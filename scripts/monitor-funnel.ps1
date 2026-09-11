<#
.SYNOPSIS
  Watch the SmartGift site's public exposure: the container, the Tailscale Funnel route and the
  public URL. Meant to run every few minutes from Task Scheduler (scripts/install-funnel-monitor.ps1).

.DESCRIPTION
  Each run checks three things:
    container  http://127.0.0.1:8080/ answers 200
    funnel     `tailscale funnel status --json` still routes https :8443 "/" to http://127.0.0.1:8080
               and allows Funnel on it
    public     https://<host>:8443/ answers 200 (checked from this machine)

  Every run appends one line to .monitor/funnel.log (capped at 2000 lines). A Windows popup is raised
  only when the overall state changes (UP -> DOWN, DOWN -> UP), or on a first run that finds it down,
  so an outage produces one alert rather than one every few minutes.

  The Funnel route has vanished twice with no known cause (.brain/rca/2026-09-09-funnel-8443-missing.md,
  and again on 2026-09-11). -AutoRestore re-adds that single route when it is missing and the container
  is healthy. It is off by default: restoring puts the site back on the public internet without a
  person deciding to, which would fight anyone who closed it on purpose. It never runs
  `tailscale funnel reset` and never touches any other port.

  Kept ASCII-only on purpose: Windows PowerShell 5.1 reads a .ps1 without a BOM as ANSI.

.EXAMPLE
  powershell -File scripts/monitor-funnel.ps1                        # one check, alert on change
  powershell -File scripts/monitor-funnel.ps1 -AutoRestore           # also re-add a missing route
  powershell -File scripts/monitor-funnel.ps1 -AutoRestore -DryRun   # log what it would do instead
#>
param(
    [string]$HostName  = 'desktop-vetatmq.tail71c7d1.ts.net',
    [int]   $HttpsPort = 8443,
    [string]$Backend   = 'http://127.0.0.1:8080',
    [string]$StateDir  = (Join-Path $PSScriptRoot '..\.monitor'),
    [string]$Tailscale = 'C:\Program Files\Tailscale\tailscale.exe',
    [switch]$AutoRestore,
    [switch]$DryRun,
    [switch]$NoNotify
)

# Native commands (tailscale) write to stderr; under 'Stop' PowerShell 5.1 would turn that into a
# terminating error. Errors are handled explicitly below instead.
$ErrorActionPreference = 'Continue'
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

$StateDir  = [IO.Path]::GetFullPath($StateDir)
$null      = New-Item -ItemType Directory -Force -Path $StateDir
$logFile   = Join-Path $StateDir 'funnel.log'
$stateFile = Join-Path $StateDir 'funnel.state'
$route     = '{0}:{1}' -f $HostName, $HttpsPort
$publicUrl = 'https://{0}/' -f $route

function Test-Http([string]$Url) {
    try {
        $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 20 -ErrorAction Stop
        return [int]$r.StatusCode
    } catch {
        if ($_.Exception.Response) { return [int]$_.Exception.Response.StatusCode }
        return 0
    }
}

function Test-Funnel {
    if (-not (Test-Path $Tailscale)) { return 'tailscale not found' }
    try {
        $json = (& $Tailscale funnel status --json 2>$null) | Out-String
        if (-not $json.Trim()) { return 'no serve config' }
        $status = $json | ConvertFrom-Json
        $handler = $status.Web.$route.Handlers.'/'
        if (-not $handler) { return 'route-missing' }
        if ($handler.Proxy -ne $Backend) { return ('proxy-is-' + $handler.Proxy) }
        if (-not $status.AllowFunnel.$route) { return 'funnel-not-allowed' }
        return 'ok'
    } catch {
        return ('tailscale-error: ' + $_.Exception.Message)
    }
}

$container = Test-Http ($Backend + '/')
$funnel    = Test-Funnel
$public    = Test-Http $publicUrl

# Restore only the one route, only when it is the route that is broken: if the container is down,
# re-adding the route would just publish an error page.
$restored = ''
if ($AutoRestore -and $funnel -ne 'ok' -and $container -eq 200) {
    $cmd = 'tailscale funnel --bg --https={0} {1}' -f $HttpsPort, $Backend
    if ($DryRun) {
        $restored = 'would run: ' + $cmd
    } else {
        & $Tailscale funnel --bg ('--https={0}' -f $HttpsPort) $Backend 2>&1 | Out-Null
        $funnel   = Test-Funnel
        $public   = Test-Http $publicUrl
        $restored = 'ran: {0} -> funnel {1}' -f $cmd, $funnel
    }
}

$ok     = ($container -eq 200) -and ($funnel -eq 'ok') -and ($public -eq 200)
$state  = if ($ok) { 'UP' } else { 'DOWN' }
$detail = 'container={0} funnel={1} public={2}' -f $container, $funnel, $public
if ($restored) { $detail += ' | ' + $restored }

$previous = if (Test-Path $stateFile) { (Get-Content -Path $stateFile -Raw).Trim() } else { '' }
$changed  = ($previous -ne $state) -and -not ($previous -eq '' -and $ok)
if ($changed) { $detail += $(if ($NoNotify) { ' | alert suppressed (-NoNotify)' } else { ' | alert sent' }) }
$line = '{0:yyyy-MM-dd HH:mm:ss}  {1,-4}  {2}' -f (Get-Date), $state, $detail

# ASCII, not UTF8: PowerShell 5.1 writes a BOM for UTF8, and everything logged here is ASCII.
Add-Content -Path $logFile -Value $line -Encoding ASCII
$lines = @(Get-Content -Path $logFile -Encoding ASCII)
if ($lines.Count -gt 2000) { $lines | Select-Object -Last 2000 | Set-Content -Path $logFile -Encoding ASCII }
Set-Content -Path $stateFile -Value $state -Encoding ASCII

if ($changed -and -not $NoNotify) {
    if ($ok) {
        $msg = 'SmartGift is back up: ' + $publicUrl
    } else {
        $msg = 'SmartGift is DOWN. {0}. Restore the route with: tailscale funnel --bg --https={1} {2}  (log: {3})' -f $detail, $HttpsPort, $Backend, $logFile
    }
    & (Join-Path $env:SystemRoot 'System32\msg.exe') $env:USERNAME /TIME:3600 $msg 2>$null
}

Write-Output $line
if ($ok) { exit 0 } else { exit 1 }
