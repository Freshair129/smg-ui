import React, { useState } from 'react'
import {
  BriefContact,
  BriefPayload,
  SubmitResult,
  availableChannels,
  channelLabel,
  contactText,
  submitBrief
} from '../data/briefSubmit'
import { BRIEF_CONFIG } from '../config/briefConfig'

interface Props {
  /** Builds the JSON contract with the contact merged in. */
  buildPayload: (contact: BriefContact) => BriefPayload
  /** Builds the human-readable summary (without contact — this panel appends it). */
  buildText: () => string
  onClose?: () => void
  compact?: boolean
}

export const BriefSubmitPanel: React.FC<Props> = ({ buildPayload, buildText, onClose, compact }) => {
  const [contact, setContact] = useState<BriefContact>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<SubmitResult | null>(null)
  const channels = availableChannels()

  const set = (key: keyof BriefContact) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setContact(c => ({ ...c, [key]: e.target.value }))

  const canSend = Boolean(contact.name?.trim()) && Boolean(contact.email?.trim() || contact.phone?.trim())

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSend || status === 'sending') return
    setStatus('sending')
    const payload = buildPayload(contact)
    const text = `${buildText()}${contactText(contact)}`
    const r = await submitBrief(payload, text)
    setResult(r)
    setStatus(r.ok ? 'done' : 'error')
  }

  if (status === 'done' && result) {
    return (
      <div className={`bline-submit ${compact ? 'is-compact' : ''}`} role="status">
        <b>✓ {result.channel === 'webhook' ? 'ส่งถึงฝ่ายขายแล้ว' : result.channel === 'mailto' ? 'เปิดอีเมลให้แล้ว กดส่งในโปรแกรมอีเมลได้เลย' : 'คัดลอกสรุปไว้แล้ว — วางส่งให้ฝ่ายขายทางช่องทางที่สะดวก'}</b>
        <p className="bline-submit-note">
          {result.channel === 'clipboard' && !BRIEF_CONFIG.endpoint && !BRIEF_CONFIG.salesEmail
            ? 'ระบบยังไม่ได้เชื่อมกับ CRM (ตั้งค่า VITE_BRIEF_ENDPOINT หรือ VITE_SALES_EMAIL) จึงใช้การคัดลอกแทน'
            : 'ฝ่ายขายจะติดต่อกลับเพื่อยืนยันรายละเอียด ราคา และกำหนดส่ง'}
        </p>
        <div className="bline-submit-actions">
          {BRIEF_CONFIG.lineUrl && (
            <a className="pill-btn" href={BRIEF_CONFIG.lineUrl} target="_blank" rel="noreferrer">
              คุยต่อทาง LINE
            </a>
          )}
          {onClose && (
            <button type="button" className="pill-btn" onClick={onClose}>
              ปิด
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <form className={`bline-submit ${compact ? 'is-compact' : ''}`} onSubmit={send}>
      <div className="bline-submit-head">
        <b>ส่ง brief ให้ฝ่ายขาย</b>
        <span className="bline-submit-channel">ช่องทาง: {channelLabel(channels[0])}</span>
      </div>
      <div className="bline-submit-grid">
        <label>
          ชื่อผู้ติดต่อ *
          <input className="bline-input" value={contact.name ?? ''} onChange={set('name')} autoComplete="name" required />
        </label>
        <label>
          บริษัท / หน่วยงาน
          <input className="bline-input" value={contact.company ?? ''} onChange={set('company')} autoComplete="organization" />
        </label>
        <label>
          อีเมล
          <input className="bline-input" type="email" value={contact.email ?? ''} onChange={set('email')} autoComplete="email" />
        </label>
        <label>
          โทร
          <input className="bline-input" type="tel" value={contact.phone ?? ''} onChange={set('phone')} autoComplete="tel" />
        </label>
        <label className="span-2">
          หมายเหตุ (วันใช้งาน งบต่อชุด ข้อจำกัด)
          <textarea className="bline-input" rows={2} value={contact.note ?? ''} onChange={set('note')} />
        </label>
      </div>
      <p className="bline-submit-note">ข้อมูลติดต่อใช้เพื่อตอบกลับเรื่องนี้เท่านั้น ไม่ถูกเก็บในหน้าเว็บ · ต้องมีชื่อและอีเมลหรือโทรอย่างใดอย่างหนึ่ง</p>
      <div className="bline-submit-actions">
        <button type="submit" className="bline-inquire-btn" disabled={!canSend || status === 'sending'}>
          {status === 'sending' ? 'กำลังส่ง…' : 'ส่ง brief'}
        </button>
        {onClose && (
          <button type="button" className="bline-copy-btn" onClick={onClose}>
            ยกเลิก
          </button>
        )}
        {status === 'error' && result && <span className="bline-submit-error">ส่งไม่สำเร็จ ({result.detail ?? result.channel}) — ลองใหม่หรือคัดลอกสรุปแทน</span>}
      </div>
    </form>
  )
}
