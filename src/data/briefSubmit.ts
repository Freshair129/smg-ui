/**
 * Brief intake — the client side of "ขอใบเสนอราคา".
 *
 * Contract: smartgift-brief/1 (docs/CATALOG-STRUCTURE-SPEC.md §11). The payload carries the four
 * brief answers, the items or package groups the buyer looked at with reference prices, and the
 * contact details they typed. It is sent, never stored in this app (Zero-PII outside the CRM).
 *
 * Delivery falls back in order: webhook (VITE_BRIEF_ENDPOINT) → mailto (VITE_SALES_EMAIL) → clipboard.
 * AGENTS.md Rule 3: no React imports here.
 */
import { BRIEF_CONFIG } from '../config/briefConfig'

export interface BriefContact {
  name?: string
  company?: string
  email?: string
  phone?: string
  note?: string
}

export interface BriefLine {
  code: string
  name_th: string
  kind: string
  tier?: string
  label?: string
  qty?: number
  unit_price?: number
  total?: number
  price_status: 'reference' | 'ask_for_quote'
}

export interface BriefPayload {
  schema: 'smartgift-brief/1'
  submitted_at: string
  source: 'web-ui-smg'
  page_url: string
  brief: { recipient?: string; occasion?: string; tier?: string; qty?: number }
  lines: BriefLine[]
  bundle?: { template?: string; groups: BriefLine[]; recipients?: number; total_reference?: number }
  contact?: BriefContact
  notes: string[]
}

export type SubmitChannel = 'webhook' | 'mailto' | 'clipboard'

export interface SubmitResult {
  channel: SubmitChannel
  ok: boolean
  detail?: string
}

export const PRICE_NOTE = 'ราคาเป็นราคาอ้างอิงตามขั้นจำนวน ยังไม่รวม VAT ค่าส่ง และงานพิมพ์ ยืนยันในใบเสนอราคา'

export function availableChannels(): SubmitChannel[] {
  const out: SubmitChannel[] = []
  if (BRIEF_CONFIG.endpoint) out.push('webhook')
  if (BRIEF_CONFIG.salesEmail) out.push('mailto')
  out.push('clipboard')
  return out
}

export function channelLabel(channel: SubmitChannel): string {
  switch (channel) {
    case 'webhook':
      return 'ส่งเข้าระบบฝ่ายขายโดยตรง'
    case 'mailto':
      return `เปิดอีเมลถึง ${BRIEF_CONFIG.salesEmail}`
    default:
      return 'คัดลอกสรุปไว้ให้วางส่งเอง'
  }
}

export function contactText(c: BriefContact | undefined): string {
  if (!c) return ''
  const rows = [
    c.name && `ชื่อ: ${c.name}`,
    c.company && `บริษัท: ${c.company}`,
    c.email && `อีเมล: ${c.email}`,
    c.phone && `โทร: ${c.phone}`,
    c.note && `หมายเหตุ: ${c.note}`
  ].filter(Boolean)
  return rows.length ? `\nผู้ติดต่อ\n${rows.join('\n')}` : ''
}

async function postWebhook(payload: BriefPayload): Promise<SubmitResult> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(BRIEF_CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    })
    if (!res.ok) return { channel: 'webhook', ok: false, detail: `HTTP ${res.status}` }
    return { channel: 'webhook', ok: true }
  } catch (err) {
    return { channel: 'webhook', ok: false, detail: err instanceof Error ? err.message : String(err) }
  } finally {
    window.clearTimeout(timer)
  }
}

function openMailto(subject: string, body: string): SubmitResult {
  const url = `mailto:${BRIEF_CONFIG.salesEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.slice(0, 1800))}`
  try {
    window.location.href = url
    return { channel: 'mailto', ok: true }
  } catch (err) {
    return { channel: 'mailto', ok: false, detail: err instanceof Error ? err.message : String(err) }
  }
}

async function copyToClipboard(text: string): Promise<SubmitResult> {
  try {
    await navigator.clipboard.writeText(text)
    return { channel: 'clipboard', ok: true }
  } catch (err) {
    return { channel: 'clipboard', ok: false, detail: err instanceof Error ? err.message : String(err) }
  }
}

/**
 * Tries each configured channel in order and returns the first success (or the last failure).
 * `text` is the human-readable summary used for mail and clipboard; `payload` is the JSON contract.
 */
export async function submitBrief(payload: BriefPayload, text: string): Promise<SubmitResult> {
  const attempts: SubmitResult[] = []
  if (BRIEF_CONFIG.endpoint) {
    const r = await postWebhook(payload)
    if (r.ok) return r
    attempts.push(r)
  }
  if (BRIEF_CONFIG.salesEmail) {
    const r = openMailto(`SmartGift brief · ${payload.brief.occasion ?? ''} ${payload.brief.tier ?? ''}`.trim(), text)
    if (r.ok) return r
    attempts.push(r)
  }
  const r = await copyToClipboard(`${text}\n\n--- payload (smartgift-brief/1) ---\n${JSON.stringify(payload, null, 2)}`)
  if (!r.ok && attempts.length) r.detail = [...attempts, r].map(a => `${a.channel}: ${a.detail ?? 'failed'}`).join(' · ')
  return r
}
