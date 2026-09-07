import React, { useState, useMemo } from 'react'
import {
  UNIFIED_CATALOG_ITEMS,
  CATALOG_TIERS,
  UnifiedCatalogItem,
  BLINE_PRODUCTS,
  BLineProduct
} from '../data/unifiedBLineCatalog'

export { BLINE_PRODUCTS }
export type { BLineProduct }

const ModelViewer = (props: any) => React.createElement('model-viewer', props)


export const BLineCatalogSection: React.FC<{ onBackToArchive: () => void }> = ({ onBackToArchive }) => {
  const [dark, setDark] = useState(true)
  const [filterCategory, setFilterCategory] = useState<string>('All')
  const [only3D, setOnly3D] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<UnifiedCatalogItem | null>(null)
  const [modalMediaMode, setModalMediaMode] = useState<'3d' | 'image' | 'client'>('3d')
  const [orderQty, setOrderQty] = useState<number>(100)
  const [inquirySent, setInquirySent] = useState<boolean>(false)

  // Filter products by category tier and 3D flag
  const filteredProducts = useMemo(() => {
    return UNIFIED_CATALOG_ITEMS.filter(p => {
      if (filterCategory !== 'All' && p.category !== filterCategory) return false
      if (only3D && !p.model3d_url) return false
      return true
    })
  }, [filterCategory, only3D])

  const openProduct = (prod: UnifiedCatalogItem) => {
    setSelectedProduct(prod)
    setModalMediaMode(prod.model3d_url ? '3d' : 'image')
    setOrderQty(100)
    setInquirySent(false)
  }

  // Tiered pricing calculation
  const currentPricing = useMemo(() => {
    if (!selectedProduct || !selectedProduct.price_tiers || !selectedProduct.srp_price) return null
    let unit = selectedProduct.srp_price
    for (const tier of selectedProduct.price_tiers) {
      if (orderQty >= tier.min_qty) unit = tier.unit_price
    }
    const total = unit * orderQty
    const stdTotal = selectedProduct.srp_price * orderQty
    const save = stdTotal - total
    const percent = Math.round(((selectedProduct.srp_price - unit) / selectedProduct.srp_price) * 100)
    return { unit, total, save, percent }
  }, [selectedProduct, orderQty])

  return (
    <section className={`bline-section ${dark ? 'dark-theme' : 'light-theme'}`}>
      {/* Sub Header Navigation */}
      <nav className="bline-nav">
        <div className="bline-nav-left">
          <button className="bline-back-btn" onClick={onBackToArchive}>
            ← SMARTGIFT ARCHIVE
          </button>
          <span className="bline-brand-sub">B—LINE / SMARTGIFT</span>
        </div>

        <ul className="bline-nav-links">
          {CATALOG_TIERS.map((cat) => (
            <li key={cat}>
              <button
                className={`bline-category-btn ${filterCategory === cat ? 'active' : ''}`}
                onClick={() => {
                  setFilterCategory(cat)
                  setOnly3D(false)
                }}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>

        <div className="bline-nav-right">
          <button
            className="bline-theme-toggle"
            onClick={() => setDark(!dark)}
            title="Toggle Light/Dark Theme"
          >
            {dark ? '☀️ LIGHT' : '🌙 DARK'}
          </button>
        </div>
      </nav>

      {/* Hero Title */}
      <header className="bline-hero">
        <h1 className="bline-wordmark">
          {filterCategory === 'Bespoke (B-Line)' ? 'B—Line' : 'SmartGift'}
        </h1>
      </header>

      {/* Section Label Bar */}
      <div className="bline-section-label">
        <span>Prodotti / Gift Tiers — Catalogo Completo &nbsp;·&nbsp; {filteredProducts.length} oggetti</span>
        <div className="bline-filter-pills">
          <span className="pill-label">Filter:</span>
          {CATALOG_TIERS.map(c => (
            <button
              key={c}
              className={`pill-btn ${filterCategory === c ? 'active' : ''}`}
              onClick={() => {
                setFilterCategory(c)
                setOnly3D(false)
              }}
            >
              {c}
            </button>
          ))}
          <button
            className={`pill-btn ${only3D ? 'active' : ''}`}
            onClick={() => setOnly3D(!only3D)}
            title="แสดงเฉพาะสินค้าที่มีโมเดล 3D Digital Twin"
          >
            🌐 3D Digital Twin (9)
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <main className="bline-main">
        <div className="bline-grid">
          {filteredProducts.map((prod) => (
            <article
              key={prod.id}
              className="bline-card"
              onClick={() => openProduct(prod)}
            >
              <div className="bline-card-img-wrap">
                <img className="bline-card-img" src={prod.image} alt={prod.name} loading="lazy" />
                {prod.model3d_url && (
                  <span className="bline-3d-tag">3D</span>
                )}
              </div>
              <div className="bline-card-meta">
                <span className="bline-card-name">{prod.name}</span>
                <span className="bline-card-designer">{prod.subtitle}</span>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="bline-modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="bline-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="bline-modal-close" onClick={() => setSelectedProduct(null)}>✕</button>

            {/* Left Side: 3D Viewer or Image */}
            <div className="bline-modal-img-container">
              {selectedProduct.model3d_url && (
                <div className="bline-media-toggles">
                  <button
                    className={`bline-media-tab-btn ${modalMediaMode === '3d' ? 'active' : ''}`}
                    onClick={() => setModalMediaMode('3d')}
                  >
                    🌐 3D Orbit
                  </button>
                  <button
                    className={`bline-media-tab-btn ${modalMediaMode === 'image' ? 'active' : ''}`}
                    onClick={() => setModalMediaMode('image')}
                  >
                    📷 Photo
                  </button>
                  {selectedProduct.client_showcase && selectedProduct.client_showcase.length > 0 && (
                    <button
                      className={`bline-media-tab-btn ${modalMediaMode === 'client' ? 'active' : ''}`}
                      onClick={() => setModalMediaMode('client')}
                    >
                      🏢 {selectedProduct.client_showcase[0].brand}
                    </button>
                  )}
                </div>
              )}

              {modalMediaMode === '3d' && selectedProduct.model3d_url ? (
                <div className="bline-3d-wrapper">
                  <ModelViewer
                    src={selectedProduct.model3d_url}
                    alt={selectedProduct.name}
                    auto-rotate
                    camera-controls
                    shadow-intensity="1"
                    shadow-softness="0.8"
                    exposure="1.1"
                    style={{ width: '100%', height: '100%', minHeight: '380px', backgroundColor: '#000' }}
                  />
                  <div className="bline-3d-hint">360° Drag to rotate & scroll to zoom</div>
                </div>
              ) : modalMediaMode === 'client' && selectedProduct.client_showcase && selectedProduct.client_showcase.length > 0 ? (
                <div className="bline-client-mockup-wrapper">
                  <img src={selectedProduct.client_showcase[0].image} alt={selectedProduct.client_showcase[0].brand} />
                  <div className="bline-client-caption">
                    Client Showcase: <strong>{selectedProduct.client_showcase[0].brand}</strong>
                  </div>
                </div>
              ) : (
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              )}
            </div>

            {/* Right Side: Product Details & Pricing Calculator */}
            <div className="bline-modal-info">
              <span className="bline-modal-cat">{selectedProduct.category}</span>
              <h2>{selectedProduct.name}</h2>
              {selectedProduct.name_th && (
                <div className="bline-modal-th-name">{selectedProduct.name_th}</div>
              )}
              <p className="bline-modal-designer">{selectedProduct.subtitle}</p>
              <p className="bline-modal-desc">{selectedProduct.description}</p>

              {/* Specs row if available */}
              {selectedProduct.dimensions && (
                <div className="bline-specs-row">
                  <span>📐 {selectedProduct.dimensions}</span>
                  <span>⚖️ {selectedProduct.weight}</span>
                  <span>⏱️ {selectedProduct.lead_time}</span>
                </div>
              )}

              {/* Tiered pricing calculator if available */}
              {selectedProduct.price_tiers && currentPricing && (
                <div className="bline-calc-box">
                  <div className="bline-calc-label">B2B TIERED VOLUME PRICING:</div>
                  <div className="bline-calc-qty-pills">
                    {[10, 50, 100, 300, 500, 1000].map(qty => (
                      <button
                        key={qty}
                        className={`bline-calc-qty-btn ${orderQty === qty ? 'active' : ''}`}
                        onClick={() => setOrderQty(qty)}
                      >
                        {qty} pcs
                      </button>
                    ))}
                  </div>

                  <div className="bline-calc-result-row">
                    <div>
                      <span className="bline-calc-sub">Unit Price:</span>
                      <span className="bline-calc-unit">฿{currentPricing.unit.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="bline-calc-sub">Est. Total:</span>
                      <span className="bline-calc-total">฿{currentPricing.total.toLocaleString()}</span>
                      {currentPricing.percent > 0 && (
                        <span className="bline-calc-save-pill">-{currentPricing.percent}%</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bline-modal-actions">
                <button
                  className="bline-inquire-btn"
                  onClick={() => setInquirySent(true)}
                >
                  {inquirySent ? '✓ INQUIRY SENT TO SALES' : 'REQUEST B2B SPECIFICATION & QUOTE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bline-footer">
        <div className="bline-footer-top">
          <span className="bline-footer-brand">B—Line S.r.l. &amp; SmartGift Corporate</span>
          <ul className="bline-footer-links">
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#cookie">Cookie Policy</a></li>
            <li><a href="#legal">Note Legali</a></li>
            <li><a href="#contact">Contatti</a></li>
            <li><a href="#press">Area Stampa</a></li>
          </ul>
        </div>
        <p className="bline-footer-legal">
          © 2026 B—Line S.r.l. &amp; SmartGift Corporate Portfolio &nbsp;·&nbsp; Via dell&apos;Industria 14, Pero (MI)
        </p>
      </footer>
    </section>
  )
}
