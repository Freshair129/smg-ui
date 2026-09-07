import { useEffect, useState } from 'react'

const KEY = 'smg_dev'

/**
 * Whether to show the authoring tools (grid overlay, media config drawer).
 *
 * Off for visitors, on with `?dev=1`, off again with `?dev=0`, and remembered
 * afterwards so staff do not have to keep re-typing it. Always on under
 * `npm run dev`.
 *
 * Deliberately NOT a login. Everything these tools touch — the grid overlay and
 * the media config — lives in this browser's own localStorage and changes
 * nothing for anyone else, so there is no secret for a password to protect. And
 * in a static bundle any password would ship inside the JavaScript in plain
 * text, so a login here would only look like security without being it. If
 * something genuinely private ever lands in this app, it needs auth on the
 * server, not in the browser.
 */
export function useDevMode(): boolean {
  const [on, setOn] = useState(() => {
    if (import.meta.env.DEV) return true
    try {
      return localStorage.getItem(KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    const url = new URL(location.href)
    const flag = url.searchParams.get('dev')
    if (flag === null) return

    const next = flag !== '0' && flag !== 'false'
    setOn(next || import.meta.env.DEV)
    try {
      if (next) localStorage.setItem(KEY, '1')
      else localStorage.removeItem(KEY)
    } catch { /* private mode — the flag just will not stick */ }

    // drop ?dev from the address bar so a shared or bookmarked link does not
    // silently hand the tools to whoever opens it next
    url.searchParams.delete('dev')
    history.replaceState(null, '', url.pathname + url.search + url.hash)
  }, [])

  return on
}
