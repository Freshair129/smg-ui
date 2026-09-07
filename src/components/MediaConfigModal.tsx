import React, { useState } from 'react'
import {
  MediaConfigState,
  LOGO_SLOT,
  VIDEO_SLOTS,
  DEFAULT_MEDIA_CONFIG
} from '../config/mediaConfig'

interface MediaConfigModalProps {
  isOpen: boolean
  onClose: () => void
  config: MediaConfigState
  onChangeConfig: (newConfig: MediaConfigState) => void
  showOverlay: boolean
  onToggleOverlay: (show: boolean) => void
}

export const MediaConfigModal: React.FC<MediaConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  showOverlay,
  onToggleOverlay
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'blueprint' | 'export'>('browse')
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'logo' | 'videoLeft' | 'videoRight' | number
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const objectUrl = URL.createObjectURL(file)

    if (target === 'logo') {
      onChangeConfig({ ...config, logoUrl: objectUrl })
    } else if (target === 'videoLeft') {
      onChangeConfig({ ...config, videoLeftUrl: objectUrl })
    } else if (target === 'videoRight') {
      onChangeConfig({ ...config, videoRightUrl: objectUrl })
    } else if (typeof target === 'number') {
      const nextGallery = [...config.galleryUrls]
      nextGallery[target] = objectUrl
      onChangeConfig({ ...config, galleryUrls: nextGallery })
    }
  }

  const handleReset = () => {
    if (confirm('คุณต้องการรีเซ็ตสื่อทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?')) {
      onChangeConfig(DEFAULT_MEDIA_CONFIG)
    }
  }

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="config-panel-backdrop" onClick={onClose}>
      <div className="config-panel-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="config-panel-header">
          <div className="config-title-group">
            <h2>⚙️ Media Configuration</h2>
            <p>ปรับเปลี่ยนสื่อ & ดูสเปก Resolution สำหรับครอปภาพ</p>
          </div>
          <button className="config-close-btn" onClick={onClose} title="ปิด Panel">
            ✕
          </button>
        </div>

        {/* Top Controls Bar */}
        <div className="config-controls-bar">
          <div className="config-tabs">
            <button
              className={`config-tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
              onClick={() => setActiveTab('browse')}
            >
              📁 Browse สื่อ
            </button>
            <button
              className={`config-tab-btn ${activeTab === 'blueprint' ? 'active' : ''}`}
              onClick={() => setActiveTab('blueprint')}
            >
              📐 Blueprint สเปก
            </button>
            <button
              className={`config-tab-btn ${activeTab === 'export' ? 'active' : ''}`}
              onClick={() => setActiveTab('export')}
            >
              📋 JSON Config
            </button>
          </div>

          <label className="config-toggle-label">
            <input
              type="checkbox"
              checked={showOverlay}
              onChange={(e) => onToggleOverlay(e.target.checked)}
            />
            <span>แสดง Resolution Overlay บนเว็บ</span>
          </label>
        </div>

        {/* Tab Content */}
        <div className="config-panel-body">
          {activeTab === 'browse' && (
            <div className="tab-browse-section">
              {/* Logo Section */}
              <div className="media-section-card">
                <div className="media-section-header">
                  <div>
                    <h3>{LOGO_SLOT.name}</h3>
                    <span className="spec-badge">อัตราส่วน {LOGO_SLOT.aspectRatio} | {LOGO_SLOT.recommendedRes}</span>
                  </div>
                  <label className="upload-file-btn">
                    Browse รูป...
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logo')}
                    />
                  </label>
                </div>
                <div className="media-preview-row">
                  <div className="preview-box logo-preview">
                    <img src={config.logoUrl} alt="Logo preview" />
                  </div>
                  <div className="media-url-info">
                    <span className="info-label">ไฟล์ปัจจุบัน:</span>
                    <input
                      type="text"
                      className="media-url-input"
                      value={config.logoUrl}
                      onChange={(e) => onChangeConfig({ ...config, logoUrl: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Background Videos Section */}
              <div className="media-section-card">
                <h3>Background Interactive Videos (16:9)</h3>
                <p className="card-desc">Resolution แนะนำ 1920×1080 px (16:9 Landscape MP4)</p>

                <div className="videos-grid">
                  {VIDEO_SLOTS.map((slot) => {
                    const isLeft = slot.id === 'videoLeft'
                    const currentUrl = isLeft ? config.videoLeftUrl : config.videoRightUrl

                    return (
                      <div key={slot.id} className="video-slot-box">
                        <div className="slot-title">
                          <strong>{slot.name}</strong>
                          <span className="spec-badge">{slot.recommendedRes}</span>
                        </div>
                        <div className="preview-box video-preview">
                          <video src={currentUrl} autoPlay loop muted playsInline />
                        </div>
                        <div className="video-actions">
                          <label className="upload-file-btn block">
                            Browse วิดีโอ...
                            <input
                              type="file"
                              accept="video/mp4,video/*"
                              onChange={(e) => handleFileUpload(e, isLeft ? 'videoLeft' : 'videoRight')}
                            />
                          </label>
                          <input
                            type="text"
                            className="media-url-input mt-2"
                            value={currentUrl}
                            onChange={(e) =>
                              onChangeConfig({
                                ...config,
                                [isLeft ? 'videoLeftUrl' : 'videoRightUrl']: e.target.value
                              })
                            }
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Gallery Product Items */}
              <div className="media-section-card">
                <div className="media-section-header">
                  <div>
                    <h3>Archive Gallery Product Items (10 ช่องสินค้า)</h3>
                    <p className="card-desc">
                      สเปกที่แนะนำ: อัตราส่วน <strong>2:3 (Portrait)</strong> | ขนาด <strong>1200 × 1800 px</strong>
                    </p>
                  </div>
                </div>

                <div className="gallery-slots-grid">
                  {config.galleryUrls.map((url, idx) => (
                    <div key={`slot-${idx}`} className="gallery-slot-item">
                      <div className="slot-badge-bar">
                        <span>ช่องที่ {idx + 1}</span>
                        <span className="ratio-tag">2:3 (1200x1800)</span>
                      </div>
                      <div className="gallery-preview-box">
                        <img src={url} alt={`Gallery item ${idx + 1}`} />
                      </div>
                      <div className="slot-btn-group">
                        <label className="upload-file-btn sm">
                          Browse ภาพสินค้า...
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, idx)}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'blueprint' && (
            <div className="tab-blueprint-section">
              <div className="blueprint-hero">
                <h3>📐 คำแนะนำการไดคัท / Crop ภาพสินค้าเพื่อความสวยงามบนหน้าเว็บ</h3>
                <p>
                  เมื่อเปลี่ยนจากรูปคนมาเป็นรูปสินค้า (Product Shots) ให้ทำตามสเปกขนาดด้านล่างนี้เพื่อให้ภาพพอดีกับ Grid เลเอาต์
                </p>
              </div>

              <div className="blueprint-cards-container">
                <div className="blueprint-spec-card">
                  <div className="spec-icon">🖼️</div>
                  <h4>1. ภาพสินค้าใน Archive Gallery (10 ช่อง)</h4>
                  <ul className="spec-list">
                    <li><strong>อัตราส่วนภาพ (Aspect Ratio):</strong> <code>2:3</code> (แนวตั้ง / Portrait)</li>
                    <li><strong>ขนาดแนะนำ (Resolution):</strong> <code>1200 × 1800 px</code> (หรือ <code>800 × 1200 px</code>)</li>
                    <li><strong>นามสกุลไฟล์:</strong> WebP (แนะนำ), PNG, JPG</li>
                    <li><strong>การจัดวางสินค้า:</strong> วางตัวสินค้าไว้ตรงกลางภาพ (Center Alignment) โดยเหลือระยะขอบรอบข้างประมาณ 10-15%</li>
                  </ul>
                </div>

                <div className="blueprint-spec-card">
                  <div className="spec-icon">🎬</div>
                  <h4>2. วิดีโอตอบสนองฉากหลัง (Left / Right Videos)</h4>
                  <ul className="spec-list">
                    <li><strong>อัตราส่วนวิดีโอ:</strong> <code>16:9</code> (แนวนอน / Widescreen)</li>
                    <li><strong>ขนาดแนะนำ:</strong> <code>1920 × 1080 px</code> (Full HD)</li>
                    <li><strong>ฟอร์แมต:</strong> MP4 (H.264 Codec), No Audio / Muted</li>
                    <li><strong>ความยาวแนะนำ:</strong> 3 - 10 วินาที (วนลูปได้เนียนตา)</li>
                  </ul>
                </div>

                <div className="blueprint-spec-card">
                  <div className="spec-icon">🏷️</div>
                  <h4>3. แบรนด์โลโก้ (Brand Logo)</h4>
                  <ul className="spec-list">
                    <li><strong>อัตราส่วน:</strong> <code>1:1</code> (สี่เหลี่ยมจัตุรัส)</li>
                    <li><strong>ขนาดแนะนำ:</strong> <code>500 × 500 px</code></li>
                    <li><strong>ฟอร์แมต:</strong> PNG (พื้นหลังใส) หรือ JPG (พื้นหลังขาว/ดำ)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="tab-export-section">
              <h3>📋 จัดการข้อมูลสื่อ (JSON Format)</h3>
              <p>คุณสามารถก๊อปปี้โครงสร้าง JSON ด้านล่างนี้ไปบันทึกไว้ หรือปรับแต่ง URL สื่อได้โดยตรง</p>
              <textarea
                className="json-textarea"
                readOnly
                value={JSON.stringify(config, null, 2)}
              />
              <div className="export-actions">
                <button className="action-btn" onClick={handleCopyJson}>
                  {copied ? '✅ คัดลอกเรียบร้อย!' : '📋 คัดลอก JSON'}
                </button>
                <button className="action-btn danger" onClick={handleReset}>
                  🔄 รีเซ็ตสื่อทั้งหมดกลับค่าเริ่มต้น
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="config-panel-footer">
          <span>💡 Browse อัปโหลดไฟล์เพื่อดูตัวอย่างบนเว็บจริงด้านซ้ายได้ทันที</span>
          <button className="config-done-btn" onClick={onClose}>
            ปิด Panel ✕
          </button>
        </div>
      </div>
    </div>
  )
}
