# 2026-09-09 — SmartGift Funnel connection refused

- Symptom: User screenshot shows ERR_CONNECTION_REFUSED on HTTPS port 8443.
- Evidence: Local port 8080 returned HTTP 200; Docker web-ui-smg was Up 30 hours. Tailscale was Running but funnel status listed only the port 443 /webhook/line route. HTTPS 8443 refused connection.
- Root cause: The previously configured Funnel listener/proxy on port 8443 was absent. The action or process that removed it is not established.
- Why detection missed: Earlier verification was a point-in-time HTTP check, not ongoing configuration monitoring.
- Correction (C-1, LOW operational restoration): Restored the previously authorized route with tailscale funnel --bg --https=8443 http://127.0.0.1:8080. Existing port 443 webhook preserved. No application code changed.
- Verification: HTTPS URL returned HTTP 200 and HTML exactly matched localhost:8080. Funnel status confirms both routes. Checks performed from the hosting machine, not the user's remote browser.
- Proposed prevention: When changing shared Tailscale Serve/Funnel configuration, preserve unrelated ports and verify SmartGift 8443 after the change; avoid global reset. No recurring monitor installed.
