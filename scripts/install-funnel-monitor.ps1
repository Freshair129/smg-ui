<#
.SYNOPSIS
  Register, or remove, the scheduled task that runs scripts/monitor-funnel.ps1 every few minutes.

.DESCRIPTION
  Registers "SmartGift Funnel Monitor" for the current user, running only while that user is logged
  on (needed for the msg.exe popup to reach the desktop). It starts a minute after registration and
  repeats every -Minutes. conhost --headless launches PowerShell without flashing a console window on
  every run. Missed runs (sleep, reboot) start as soon as the machine is available.

  Kept ASCII-only on purpose: Windows PowerShell 5.1 reads a .ps1 without a BOM as ANSI.

.EXAMPLE
  powershell -File scripts/install-funnel-monitor.ps1                # detect and alert only
  powershell -File scripts/install-funnel-monitor.ps1 -AutoRestore   # also re-add a missing route
  powershell -File scripts/install-funnel-monitor.ps1 -Uninstall
#>
param(
    [int]$Minutes = 5,
    [switch]$AutoRestore,
    [switch]$Uninstall
)

$ErrorActionPreference = 'Stop'
$TaskName = 'SmartGift Funnel Monitor'

if ($Uninstall) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
    Write-Output ('removed: ' + $TaskName)
    return
}

$script    = (Resolve-Path (Join-Path $PSScriptRoot 'monitor-funnel.ps1')).Path
$arguments = '--headless powershell.exe -NoProfile -ExecutionPolicy Bypass -File "{0}"' -f $script
if ($AutoRestore) { $arguments += ' -AutoRestore' }

$action   = New-ScheduledTaskAction -Execute (Join-Path $env:SystemRoot 'System32\conhost.exe') -Argument $arguments
$trigger  = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes $Minutes)
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
                -ExecutionTimeLimit (New-TimeSpan -Minutes 2) -MultipleInstances IgnoreNew
$desc     = 'Checks the SmartGift container, Tailscale Funnel route and public URL every {0} min. Log: .monitor\funnel.log. Script: {1}' -f $Minutes, $script

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Description $desc -Force | Out-Null

$task = Get-ScheduledTask -TaskName $TaskName
Write-Output ('registered: {0}  state={1}  every {2} min  autoRestore={3}' -f $TaskName, $task.State, $Minutes, [bool]$AutoRestore)
