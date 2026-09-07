/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** POST endpoint that receives smartgift-brief/1 JSON (zuri-ai CRM intake). Empty = not wired yet. */
  readonly VITE_BRIEF_ENDPOINT?: string
  /** Sales mailbox used for the mailto fallback. */
  readonly VITE_SALES_EMAIL?: string
  /** LINE Official Account URL shown after a brief is sent. */
  readonly VITE_LINE_OA_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
