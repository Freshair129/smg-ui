/**
 * Where a gifting brief goes. All three are optional and read from Vite env at build time
 * (see .env.example). The submit flow tries them in order: webhook → mailto → clipboard.
 * Nothing here stores customer data — the CRM (zuri-ai) is the store of record.
 */
const env = import.meta.env

const clean = (v: string | undefined) => (v ?? '').trim()

export const BRIEF_CONFIG = {
  endpoint: clean(env.VITE_BRIEF_ENDPOINT),
  salesEmail: clean(env.VITE_SALES_EMAIL),
  lineUrl: clean(env.VITE_LINE_OA_URL)
} as const
