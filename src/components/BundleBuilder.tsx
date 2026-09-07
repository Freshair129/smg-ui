import React, { useMemo, useState } from 'react'
import {
  CatalogItem,
  GiftTier,
  GIFT_TIERS,
  BundleTemplate,
  unitPriceAt,
  giftTier,
  occasion as occasionDef,
  recipientRelationship
} from '../data/catalogTaxonomy'
import { BUNDLE_TEMPLATES, CORE_SETS, CATALOG_ITEM_BY_CODE, formatBaht, familyLabel } from '../data/catalogItems'
import { BriefContact, BriefLine, BriefPayload, PRICE_NOTE } from '../data/briefSubmit'
import { BriefSubmitPanel } from './BriefSubmitPanel'

export interface BuilderBrief {
  recipient?: string
  occasion?: string
  tier?: string
  qty?: number
}

interface Group {
  tier: GiftTier
  offer_code?: string
  qty?: number
  label?: string
}

interface Props {
  templateCode?: string
  /** Encoded groups from the hash (?g=tier:code:qty|…). */
  encoded?: string
  brief: BuilderBrief
  onEncodedChange: (encoded: string | null) => void
  onSelectTemplate: (code: string | null) => void
  onOpenItem: (item: CatalogItem) => void
  pageUrl: string
}

const TIERS: GiftTier[] = ['Reach', 'Select', 'Signature', 'Bespoke']

function encodeGroups(groups: Group[]): string {
  return groups.map(g => [g.tier.toLowerCase(), g.offer_code ?? '', g.qty ?? ''].join(':')).join('|')
}

function decodeGroups(encoded: string | undefined): Group[] | null {
  if (!encoded) return null
  const out: Group[] = []
  for (const part of encoded.split('|')) {
    const [t, code, q] = part.split(':')
    const tier = TIERS.find(x => x.toLowerCase() === (t ?? '').toLowerCase())
    if (!tier) continue
    const qty = Number(q)
    out.push({ tier, offer_code: code && CATALOG_ITEM_BY_CODE[code] ? code : undefined, qty: Number.isFinite(qty) && qty > 0 ? qty : undefined })
  }
  return out.length ? out : null
}

function groupsFromTemplate(t: BundleTemplate | undefined): Group[] {
  if (!t) return [{ tier: 'Reach' }, { tier: 'Select' }, { tier: 'Signature' }]
  return t.groups
    .filter(g => g.tier)
    .map(g => ({ tier: g.tier as GiftTier, offer_code: g.offer_code, qty: g.qty, label: g.label }))
}

export const BundleBuilder: React.FC<Props> = ({ templateCode, encoded, brief, onEncodedChange, onSelectTemplate, onOpenItem, pageUrl }) => {
  const template = useMemo(() => BUNDLE_TEMPLATES.find(t => t.code === templateCode), [templateCode])
  const groups = useMemo<Group[]>(() => decodeGroups(encoded) ?? groupsFromTemplate(template), [encoded, template])
  const [showSubmit, setShowSubmit] = useState(false)
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')

  const update = (next: Group[]) => onEncodedChange(next.length ? encodeGroups(next) : null)
  const setGroup = (i: number, patch: Partial<Group>) => update(groups.map((g, j) => (j === i ? { ...g, ...patch } : g)))
  const removeGroup = (i: number) => update(groups.filter((_, j) => j !== i))
  const addGroup = () => update([...groups, { tier: 'Select', qty: brief.qty }])

  const rows = groups.map(g => {
    const set = g.offer_code ? CATALOG_ITEM_BY_CODE[g.offer_code] : undefined
    const unit = set && g.qty ? unitPriceAt(set, g.qty) : undefined
    const total = unit !== undefined && g.qty ? unit * g.qty : undefined
    const belowMoq = Boolean(set && g.qty && set.price_status === 'tiered' && unit === undefined)
    return { g, set, unit, total, belowMoq }
  })

  const recipients = rows.reduce((n, r) => n + (r.g.qty ?? 0), 0)
  const pricedTotal = rows.reduce((n, r) => n + (r.total ?? 0), 0)
  const unpriced = rows.filter(r => r.g.qty && (!r.set || r.total === undefined)).length

  const bom = useMemo(() => {
    const units = new Map<string, { name: string; units: number }>()
    for (const r of rows) {
      if (!r.set || !r.g.qty) continue
      for (const line of r.set.contains ?? []) {
        const cur = units.get(line.product_code) ?? { name: line.name_th ?? line.product_code, units: 0 }
        cur.units += line.qty * r.g.qty
        units.set(line.product_code, cur)
      }
    }
    return [...units.entries()].sort((a, b) => b[1].units - a[1].units)
  }, [rows])

  const lines = (): BriefLine[] =>
    rows.map(r => ({
      code: r.set?.code ?? `(${r.g.tier})`,
      name_th: r.set?.name_th ?? (r.g.tier === 'Bespoke' ? 'Bespoke — ออกแบบเฉพาะโครงการ' : 'ยังไม่เลือกชุด'),
      kind: 'set',
      tier: r.g.tier,
      label: r.g.label,
      qty: r.g.qty,
      unit_price: r.unit,
      total: r.total,
      price_status: r.total !== undefined ? 'reference' : 'ask_for_quote'
    }))

  const summaryText = () => {
    const out = ['สรุปแพ็กเกจหลายระดับ SmartGift']
    if (template) out.push(`แม่แบบ: ${template.code} ${template.name_th}`)
    const rel = brief.recipient ? recipientRelationship(brief.recipient)?.name_th : undefined
    const occ = brief.occasion ? occasionDef(brief.occasion)?.name_th : undefined
    if (rel || occ) out.push(`Brief: ${[rel && `ให้ใคร ${rel}`, occ && `โอกาส ${occ}`].filter(Boolean).join(' · ')}`)
    for (const r of rows) {
      const name = r.set ? `${r.set.code} ${r.set.name_th}` : r.g.tier === 'Bespoke' ? 'Bespoke — ออกแบบเฉพาะ' : 'ยังไม่เลือกชุด'
      const price = r.total !== undefined && r.unit !== undefined ? `${formatBaht(r.unit)}/ชุด = ${formatBaht(r.total)}` : 'สอบถามราคา'
      out.push(`- ${r.g.label ?? r.g.tier} (${r.g.tier}): ${name} × ${r.g.qty ?? '?'} → ${price}`)
    }
    out.push(`รวมผู้รับ ${recipients.toLocaleString('en-US')} · ราคาอ้างอิงรวม ${pricedTotal ? formatBaht(pricedTotal) : '—'}${unpriced ? ` (+${unpriced} กลุ่มรอเสนอราคา)` : ''}`)
    if (bom.length) out.push(`ชิ้นที่ต้องใช้: ${bom.map(([code, b]) => `${b.name} ${b.units} (${code})`).join(', ')}`)
    out.push(`ลิงก์: ${pageUrl}`)
    out.push(`หมายเหตุ: ${PRICE_NOTE}`)
    return out.join('\n')
  }

  const buildPayload = (contact: BriefContact): BriefPayload => ({
    schema: 'smartgift-brief/1',
    submitted_at: new Date().toISOString(),
    source: 'web-ui-smg',
    page_url: pageUrl,
    brief: { recipient: brief.recipient, occasion: brief.occasion, tier: brief.tier, qty: brief.qty },
    lines: [],
    bundle: { template: template?.code, groups: lines(), recipients: recipients || undefined, total_reference: pricedTotal || undefined },
    contact,
    notes: [PRICE_NOTE, 'Bespoke ต้องผ่าน feasibility review ก่อนออกใบเสนอราคา']
  })

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText())
      setCopied('ok')
    } catch {
      setCopied('fail')
    }
    window.setTimeout(() => setCopied('idle'), 2500)
  }

  return (
    <section className="bline-builder" aria-label="จัดแพ็กเกจหลายระดับ">
      <div className="bline-builder-head">
        <div>
          <h3>จัดแพ็กเกจหลายระดับในแคมเปญเดียว</h3>
          <p>หนึ่งแคมเปญอาจมีผู้รับหลายกลุ่ม ต่างระดับการดูแล — เลือกชุด core ต่อกลุ่ม ใส่จำนวน ระบบคิดราคาอ้างอิงจากขั้นจำนวนของแต่ละชุด</p>
        </div>
        {template && (
          <button className="pill-btn" onClick={() => onSelectTemplate(null)}>
            ล้างแม่แบบ
          </button>
        )}
      </div>

      <div className="bline-builder-templates">
        <span className="pill-label">แม่แบบ:</span>
        {BUNDLE_TEMPLATES.map(t => (
          <button
            key={t.code}
            className={`pill-btn ${t.code === templateCode ? 'active' : ''}`}
            title={`${t.code} · ${t.source === 'pkg' ? `สถานะ ${t.status}` : 'ตัวอย่างจาก portfolio blueprint'}${t.target_recipients ? ` · ${t.target_recipients} ผู้รับ` : ''}`}
            onClick={() => onSelectTemplate(t.code === templateCode ? null : t.code)}
          >
            {t.name_th}
          </button>
        ))}
      </div>
      {template && (
        <p className="bline-note">
          {template.code} · {template.source === 'pkg' ? `โครงจาก BundleOffer สถานะ ${template.status} — ยังไม่มีราคาแพ็กเกจที่อนุมัติ` : 'ตัวอย่างโครงสร้างจาก portfolio blueprint'}
          {template.description_th ? ` · ${template.description_th}` : ''}
          {template.occasion ? ` · โอกาส: ${occasionDef(template.occasion)?.name_th ?? template.occasion}` : ''}
        </p>
      )}

      <div className="bline-builder-table" role="table">
        <div className="bline-builder-row is-head" role="row">
          <span>กลุ่มผู้รับ</span>
          <span>ระดับ</span>
          <span>ชุด</span>
          <span className="num">จำนวน</span>
          <span className="num">ต่อชุด</span>
          <span className="num">รวม</span>
          <span />
        </div>
        {rows.map((r, i) => {
          const options = r.g.tier === 'Bespoke' ? [] : CORE_SETS.filter(s => s.tier === r.g.tier)
          return (
            <div className="bline-builder-row" role="row" key={i}>
              <input
                className="bline-input"
                value={r.g.label ?? ''}
                placeholder={r.g.tier === 'Reach' ? 'เช่น ทีมปฏิบัติการ' : r.g.tier === 'Select' ? 'เช่น หัวหน้าทีม' : 'เช่น ผู้บริหาร'}
                onChange={e => setGroup(i, { label: e.target.value || undefined })}
                aria-label="ชื่อกลุ่มผู้รับ"
              />
              <select className="bline-select" value={r.g.tier} onChange={e => setGroup(i, { tier: e.target.value as GiftTier, offer_code: undefined })} aria-label="ระดับการดูแล">
                {GIFT_TIERS.map(t => (
                  <option key={t.code} value={t.code}>
                    {t.code}
                  </option>
                ))}
              </select>
              {r.g.tier === 'Bespoke' ? (
                <span className="bline-builder-bespoke">ออกแบบเฉพาะ — ประเมินโครงการก่อนเสนอราคา</span>
              ) : (
                <span className="bline-builder-set">
                  <select className="bline-select" value={r.g.offer_code ?? ''} onChange={e => setGroup(i, { offer_code: e.target.value || undefined })} aria-label="ชุดของขวัญ">
                    <option value="">— เลือกชุด ({options.length}) —</option>
                    {options.map(s => (
                      <option key={s.code} value={s.code}>
                        {s.code} · {s.name_th}
                      </option>
                    ))}
                  </select>
                  {r.set && (
                    <button type="button" className="bline-link-btn" onClick={() => onOpenItem(r.set as CatalogItem)}>
                      ดูชุด
                    </button>
                  )}
                </span>
              )}
              <input
                className="bline-input num"
                type="number"
                min={1}
                step={1}
                value={r.g.qty ?? ''}
                placeholder="0"
                onChange={e => setGroup(i, { qty: Number(e.target.value) > 0 ? Math.floor(Number(e.target.value)) : undefined })}
                aria-label="จำนวนผู้รับ"
              />
              <span className="num">{r.unit !== undefined ? formatBaht(r.unit) : r.belowMoq ? `ขั้นต่ำ ${r.set?.moq}` : r.set || r.g.tier === 'Bespoke' ? 'สอบถาม' : '—'}</span>
              <span className="num total">{r.total !== undefined ? formatBaht(r.total) : '—'}</span>
              <button type="button" className="bline-builder-remove" onClick={() => removeGroup(i)} aria-label="ลบกลุ่มนี้">
                ✕
              </button>
            </div>
          )
        })}
        <div className="bline-builder-row is-foot" role="row">
          <button type="button" className="pill-btn" onClick={addGroup}>
            + เพิ่มกลุ่มผู้รับ
          </button>
          <span />
          <span className="bline-builder-summary">
            ผู้รับรวม <b>{recipients.toLocaleString('en-US')}</b>
            {unpriced > 0 && <em> · {unpriced} กลุ่มรอเสนอราคา</em>}
          </span>
          <span />
          <span className="num">ราคาอ้างอิงรวม</span>
          <span className="num total">{pricedTotal ? formatBaht(pricedTotal) : '—'}</span>
          <span />
        </div>
      </div>
      <p className="bline-note">{PRICE_NOTE} · ระดับสูงกว่าไม่ได้แปลว่าต้องแพงกว่า คุณค่าอยู่ที่ความเหมาะสมกับผู้รับ</p>

      {bom.length > 0 && (
        <div className="bline-builder-bom">
          <span className="bline-calc-label">ชิ้นที่ต้องใช้ทั้งแพ็กเกจ</span>
          <div className="bline-chip-row">
            {bom.map(([code, b]) => {
              const pm = CATALOG_ITEM_BY_CODE[code]
              return (
                <button key={code} type="button" className="bline-chip is-link" onClick={() => pm && onOpenItem(pm)} title={pm ? familyLabel(pm.families[0] ?? '') : code}>
                  {b.name} × {b.units.toLocaleString('en-US')}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="bline-modal-actions">
        {!showSubmit && (
          <button type="button" className="bline-inquire-btn" onClick={() => setShowSubmit(true)} disabled={recipients === 0}>
            ส่งแพ็กเกจให้ฝ่ายขาย · {recipients.toLocaleString('en-US')} ผู้รับ
          </button>
        )}
        <button type="button" className="bline-copy-btn" onClick={copy}>
          {copied === 'ok' ? '✓ คัดลอกแล้ว' : copied === 'fail' ? 'คัดลอกไม่สำเร็จ' : 'คัดลอกสรุปแพ็กเกจ'}
        </button>
      </div>
      {showSubmit && <BriefSubmitPanel buildPayload={buildPayload} buildText={summaryText} onClose={() => setShowSubmit(false)} />}
      <p className="bline-note">
        Tier ที่มักใช้: {GIFT_TIERS.map(t => `${t.code} — ${giftTier(t.code)?.tagline_th ?? ''}`).join(' · ')}
      </p>
    </section>
  )
}
