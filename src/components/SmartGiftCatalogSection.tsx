import React, { useState, useMemo } from 'react'
import {
  SMARTGIFT_PRODUCTS,
  SMARTGIFT_CATEGORIES,
  SmartGiftProduct,
  CatalogCategory
} from '../data/smartGiftCatalogData'
import { BLINE_PRODUCTS, BLineProduct } from './BLineCatalogSection'

interface SmartGiftCatalogProps {
  onBackToArchive: () => void
}

const ModelViewer = (props: any) => React.createElement('model-viewer', props)

export const SmartGiftCatalogSection: React.FC<SmartGiftCatalogProps> = ({ onBackToArchive }) => {
  // Catalog tabs: 'smartgift' (B2B corporate gifts) vs 'bline' (Italian design furniture)
  const [activeCatalogTab, setActiveCatalogTab] = useState<'smartgift' | 'bline'>('smartgift')

  // SmartGift filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [only3D, setOnly3D] = useState<boolean>(false)
  const [onlyClientCases, setOnlyClientCases] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'weight'>('default')

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<SmartGiftProduct | null>(null)
  const [modalActiveTab, setModalActiveTab] = useState<'3d' | 'mockup' | 'showcase'>('3d')
  const [orderQty, setOrderQty] = useState<number>(100)
  const [quoteRequested, setQuoteRequested] = useState<boolean>(false)

  // B-Line filters (if viewing B-Line tab)
  const [blineCategory, setBlineCategory] = useState<string>('All')
  const [blineSelected, setBlineSelected] = useState<BLineProduct | null>(null)

  // Filtered SmartGift Products
  const filteredProducts = useMemo(() => {
    return SMARTGIFT_PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category_slug !== selectedCategory) {
        return false
      }
      // 3D filter
      if (only3D && !product.model3d_url) {
        return false
      }
      // Client cases filter
      if (onlyClientCases && (!product.client_showcase || product.client_showcase.length === 0)) {
        return false
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchNameTh = product.name_th.toLowerCase().includes(query)
        const matchNameEn = product.name_en.toLowerCase().includes(query)
        const matchCode = product.code.toLowerCase().includes(query)
        const matchDesc = product.description_th.toLowerCase().includes(query)
        if (!matchNameTh && !matchNameEn && !matchCode && !matchDesc) {
          return false
        }
      }
      return true
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.srp_price - b.srp_price
      if (sortBy === 'price-desc') return b.srp_price - a.srp_price
      if (sortBy === 'weight') return a.unit_weight_kg - b.unit_weight_kg
      return 0
    })
  }, [selectedCategory, only3D, onlyClientCases, searchQuery, sortBy])

  // Pricing calculation helper
  const calculateTierPrice = (product: SmartGiftProduct, qty: number) => {
    let unitPrice = product.srp_price
    for (const tier of product.price_tiers) {
      if (qty >= tier.min_qty) {
        unitPrice = tier.unit_price
      }
    }
    const totalPrice = unitPrice * qty
    const standardTotalPrice = product.srp_price * qty
    const totalSavings = standardTotalPrice - totalPrice
    const savingsPercent = Math.round(((product.srp_price - unitPrice) / product.srp_price) * 100)
    return { unitPrice, totalPrice, totalSavings, savingsPercent }
  }

  const openProductModal = (product: SmartGiftProduct) => {
    setSelectedProduct(product)
    setOrderQty(100)
    setQuoteRequested(false)
    setModalActiveTab(product.model3d_url ? '3d' : 'mockup')
  }

  // Filtered B-Line products
  const filteredBLine = useMemo(() => {
    if (blineCategory === 'All') return BLINE_PRODUCTS
    return BLINE_PRODUCTS.filter(p => p.category === blineCategory)
  }, [blineCategory])

  return (
    <div className="sg-catalog-container">
      {/* Sticky Catalog Top Bar */}
      <header className="sg-catalog-header">
        <div className="sg-header-left">
          <button className="sg-back-archive-btn" onClick={onBackToArchive} title="กลับสู่หน้า Archive Showcase">
            ← BACK TO ARCHIVE
          </button>
          <div className="sg-brand-title">
            <span className="sg-brand-name">SMARTGIFT</span>
            <span className="sg-brand-badge">B2B PORTFOLIO 2026</span>
          </div>
        </div>

        {/* Catalog Tab Switcher: SmartGift Corporate vs B-Line Classic */}
        <div className="sg-view-tabs">
          <button
            className={`sg-tab-btn ${activeCatalogTab === 'smartgift' ? 'active' : ''}`}
            onClick={() => setActiveCatalogTab('smartgift')}
          >
            🎁 SMARTGIFT PORTFOLIO (16)
          </button>
          <button
            className={`sg-tab-btn ${activeCatalogTab === 'bline' ? 'active' : ''}`}
            onClick={() => setActiveCatalogTab('bline')}
          >
            🪑 B—LINE DESIGN ARCHIVE (11)
          </button>
        </div>

        <div className="sg-header-right">
          <div className="sg-header-meta">
            <span className="sg-status-indicator" />
            <span className="sg-status-text">OFFICIAL CANONICAL DATA</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {activeCatalogTab === 'smartgift' ? (
        <main className="sg-catalog-main">
          {/* Hero Section */}
          <section className="sg-hero">
            <div className="sg-hero-content">
              <span className="sg-hero-pill">SMARTGIFT EXECUTIVE CORP COLLECTION</span>
              <h1 className="sg-hero-title">
                ชุดผลิตภัณฑ์ของขวัญองค์กรพรีเมียม (B2B)
              </h1>
              <p className="sg-hero-desc">
                รวบรวม 4 หมวดหมู่วัตกรรมของขวัญองค์กร 16 รายการหลัก พร้อมระบบโมเดล 3D Digital Prototyping
                หมุนดูสินค้าได้รอบทิศ 360°, ตัวอย่างงานจริงจากแบรนด์ชั้นนำ (Starbucks, One Bangkok, GMMTV, Iconsiam),
                และตารางราคาลดหลั่นตามจำนวนสั่งผลิต (Tiered Pricing)
              </p>
              <div className="sg-hero-stats">
                <div className="sg-stat-item">
                  <span className="sg-stat-num">4</span>
                  <span className="sg-stat-label">Core Categories</span>
                </div>
                <div className="sg-stat-divider" />
                <div className="sg-stat-item">
                  <span className="sg-stat-num">16</span>
                  <span className="sg-stat-label">Canonical Products</span>
                </div>
                <div className="sg-stat-divider" />
                <div className="sg-stat-item">
                  <span className="sg-stat-num">9</span>
                  <span className="sg-stat-label">Interactive 3D Twins</span>
                </div>
                <div className="sg-stat-divider" />
                <div className="sg-stat-item">
                  <span className="sg-stat-num">10-1000+</span>
                  <span className="sg-stat-label">Bulk Price Tiers</span>
                </div>
              </div>
            </div>
          </section>

          {/* Sticky Filtering & Search Toolbar */}
          <div className="sg-toolbar-wrapper">
            <div className="sg-toolbar">
              {/* Category Pills */}
              <div className="sg-category-pills">
                <button
                  className={`sg-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('all')}
                >
                  ทั้งหมด (All 16)
                </button>
                {SMARTGIFT_CATEGORIES.map(cat => (
                  <button
                    key={cat.slug}
                    className={`sg-pill ${selectedCategory === cat.slug ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.slug)}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name_en}</span>
                  </button>
                ))}
              </div>

              {/* Secondary Controls: Search, 3D Toggle, Sort */}
              <div className="sg-secondary-controls">
                <div className="sg-search-box">
                  <span className="sg-search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อ, รหัส (เช่น PM-BOTTLE), คุณสมบัติ..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="sg-search-input"
                  />
                  {searchQuery && (
                    <button className="sg-clear-search" onClick={() => setSearchQuery('')}>✕</button>
                  )}
                </div>

                <div className="sg-toggle-group">
                  <button
                    className={`sg-toggle-btn ${only3D ? 'active' : ''}`}
                    onClick={() => setOnly3D(!only3D)}
                  >
                    <span className="sg-3d-badge-icon">🌐</span>
                    <span>3D Models Only (9)</span>
                  </button>
                  <button
                    className={`sg-toggle-btn ${onlyClientCases ? 'active' : ''}`}
                    onClick={() => setOnlyClientCases(!onlyClientCases)}
                  >
                    <span>🏢</span>
                    <span>Client Cases</span>
                  </button>
                </div>

                <div className="sg-sort-box">
                  <label htmlFor="sg-sort-select">เรียง:</label>
                  <select
                    id="sg-sort-select"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="sg-sort-select"
                  >
                    <option value="default">ค่าเริ่มต้น (Canonical)</option>
                    <option value="price-asc">ราคา: น้อยไปมาก</option>
                    <option value="price-desc">ราคา: มากไปน้อย</option>
                    <option value="weight">น้ำหนักเบาไปหนัก</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Product Results Counter */}
          <div className="sg-results-info">
            <span>แสดงสินค้า <strong>{filteredProducts.length}</strong> จากทั้งหมด 16 รายการ</span>
            {selectedCategory !== 'all' && (
              <span className="sg-active-filter-tag">
                หมวดหมู่: {SMARTGIFT_CATEGORIES.find(c => c.slug === selectedCategory)?.name_th}
              </span>
            )}
          </div>

          {/* Product Cards Grid */}
          <div className="sg-product-grid">
            {filteredProducts.map(product => {
              const bestTier = product.price_tiers[product.price_tiers.length - 1]
              const maxDiscount = Math.round(((product.srp_price - bestTier.unit_price) / product.srp_price) * 100)

              return (
                <div
                  key={product.code}
                  className="sg-product-card"
                  onClick={() => openProductModal(product)}
                >
                  {/* Card Visual / Thumbnail */}
                  <div className="sg-card-visual">
                    <img
                      src={product.plate_image}
                      alt={product.name_en}
                      className="sg-card-img"
                      loading="lazy"
                    />

                    {/* Overlay Badges */}
                    <div className="sg-card-badge-top-left">
                      <span className="sg-category-badge">{product.category_slug}</span>
                    </div>

                    <div className="sg-card-badge-top-right">
                      {product.model3d_url && (
                        <span className="sg-badge-3d" title="มีโมเดล 3D Digital Twin แบบหมุนได้ 360°">
                          🌐 3D MODEL
                        </span>
                      )}
                      {product.client_showcase && product.client_showcase.length > 0 && (
                        <span className="sg-badge-client" title="มีตัวอย่างงานสกรีนจริงจากแบรนด์">
                          🏢 {product.client_showcase[0].brand}
                        </span>
                      )}
                    </div>

                    <div className="sg-card-hover-overlay">
                      <span className="sg-hover-cta">
                        {product.model3d_url ? '🌐 หมุนโมเดล 3D & สเปก' : '🔍 ดูสเปก & คำนวณราคา'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Info */}
                  <div className="sg-card-content">
                    <div className="sg-card-header">
                      <span className="sg-product-code">{product.code}</span>
                      <span className="sg-lead-time">⏱️ ผลิต {product.lead_time_days} วัน</span>
                    </div>

                    <h3 className="sg-product-name-th">{product.name_th}</h3>
                    <p className="sg-product-name-en">{product.name_en}</p>

                    <div className="sg-product-specs-compact">
                      <span>📐 {product.dimensions_cm.length}×{product.dimensions_cm.width}×{product.dimensions_cm.height} cm</span>
                      <span className="sg-dot">•</span>
                      <span>⚖️ {product.unit_weight_kg} kg</span>
                    </div>

                    <p className="sg-product-desc-short">{product.description_th}</p>

                    {/* Price Tier Preview */}
                    <div className="sg-card-pricing">
                      <div className="sg-price-box">
                        <span className="sg-price-label">ราคาเริ่มต้น (SRP):</span>
                        <span className="sg-srp-price">฿{product.srp_price.toLocaleString()}</span>
                      </div>
                      <div className="sg-tier-box">
                        <span className="sg-tier-label">เรท 1,000 ชิ้น:</span>
                        <div className="sg-bulk-price-row">
                          <span className="sg-bulk-price">฿{bestTier.unit_price.toLocaleString()}</span>
                          <span className="sg-discount-tag">-{maxDiscount}%</span>
                        </div>
                      </div>
                    </div>

                    <button
                      className="sg-card-action-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        openProductModal(product)
                      }}
                    >
                      {product.model3d_url ? '🌐 สำรวจ 3D & จำลองราคา' : '📋 คำนวณราคา & สเปก'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="sg-no-results">
              <span className="sg-no-results-icon">🔎</span>
              <h3>ไม่พบสินค้าที่ตรงตามเงื่อนไข</h3>
              <p>ลองค้นหาด้วยคำอื่น หรือกดล้างตัวกรองเพื่อดูสินค้าทั้งหมด</p>
              <button
                className="sg-reset-filter-btn"
                onClick={() => {
                  setSelectedCategory('all')
                  setSearchQuery('')
                  setOnly3D(false)
                  setOnlyClientCases(false)
                }}
              >
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          )}
        </main>
      ) : (
        /* B-Line Classic Archive Tab */
        <main className="sg-catalog-main">
          <section className="sg-hero">
            <div className="sg-hero-content">
              <span className="sg-hero-pill">ITALIAN DESIGN CLASSICS</span>
              <h1 className="sg-hero-title">B—Line Architecture & Furniture Design</h1>
              <p className="sg-hero-desc">
                คลังงานออกแบบระดับไอคอนิกจากอิตาลี (1970–2023) โดย Joe Colombo, Marc Sadler, Patricia Urquiola, และ Alberto Meda
              </p>
            </div>
          </section>

          <div className="sg-toolbar-wrapper">
            <div className="sg-toolbar">
              <div className="sg-category-pills">
                {['All', 'Storage', 'Chair', 'Stool', 'Lamp'].map(cat => (
                  <button
                    key={cat}
                    className={`sg-pill ${blineCategory === cat ? 'active' : ''}`}
                    onClick={() => setBlineCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="sg-product-grid">
            {filteredBLine.map(item => (
              <div
                key={item.id}
                className="sg-product-card"
                onClick={() => setBlineSelected(item)}
              >
                <div className="sg-card-visual">
                  <img src={item.image} alt={item.name} className="sg-card-img" loading="lazy" />
                  <div className="sg-card-badge-top-left">
                    <span className="sg-category-badge">{item.category}</span>
                  </div>
                  <div className="sg-card-badge-top-right">
                    <span className="sg-badge-client">{item.year}</span>
                  </div>
                </div>
                <div className="sg-card-content">
                  <div className="sg-card-header">
                    <span className="sg-product-code">{item.id.toUpperCase()}</span>
                    <span className="sg-lead-time">{item.designer}</span>
                  </div>
                  <h3 className="sg-product-name-th">{item.name}</h3>
                  <p className="sg-product-name-en">{item.designer} ({item.year})</p>
                  <button className="sg-card-action-btn">ดูรายละเอียดงานออกแบบ</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Modal: SmartGift Product Detail, 3D Digital Twin & Tier Pricing Calculator */}
      {selectedProduct && (
        <div className="sg-modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="sg-modal-card" onClick={e => e.stopPropagation()}>
            <button className="sg-modal-close-btn" onClick={() => setSelectedProduct(null)} aria-label="Close modal">
              ✕
            </button>

            <div className="sg-modal-layout">
              {/* Left Side: 3D Viewer or Image Gallery */}
              <div className="sg-modal-media-side">
                {/* Media Switcher Tabs */}
                <div className="sg-modal-media-tabs">
                  {selectedProduct.model3d_url && (
                    <button
                      className={`sg-media-tab ${modalActiveTab === '3d' ? 'active' : ''}`}
                      onClick={() => setModalActiveTab('3d')}
                    >
                      🌐 3D Digital Twin (360°)
                    </button>
                  )}
                  <button
                    className={`sg-media-tab ${modalActiveTab === 'mockup' ? 'active' : ''}`}
                    onClick={() => setModalActiveTab('mockup')}
                  >
                    📸 ภาพสินค้าจำลอง (Mockup)
                  </button>
                  {selectedProduct.client_showcase && selectedProduct.client_showcase.length > 0 && (
                    <button
                      className={`sg-media-tab ${modalActiveTab === 'showcase' ? 'active' : ''}`}
                      onClick={() => setModalActiveTab('showcase')}
                    >
                      🏢 แบรนด์ตัวอย่าง ({selectedProduct.client_showcase.length})
                    </button>
                  )}
                </div>

                {/* Media Viewport */}
                <div className="sg-modal-viewport">
                  {modalActiveTab === '3d' && selectedProduct.model3d_url ? (
                    <div className="sg-3d-viewer-box">
                      <ModelViewer
                        src={selectedProduct.model3d_url}
                        alt={selectedProduct.name_en}
                        auto-rotate
                        camera-controls
                        shadow-intensity="1"
                        shadow-softness="0.8"
                        exposure="1.1"
                        style={{ width: '100%', height: '100%', minHeight: '440px', backgroundColor: '#0d0e12' }}
                      />
                      <div className="sg-3d-hint">
                        <span>👆 ใช้เมาส์คลิกค้างเพื่อหมุน 360° | เลื่อนลูกกลิ้งเพื่อซูมขยาย</span>
                      </div>
                    </div>
                  ) : modalActiveTab === 'showcase' && selectedProduct.client_showcase ? (
                    <div className="sg-showcase-gallery">
                      <div className="sg-showcase-main">
                        <img
                          src={selectedProduct.client_showcase[0].image}
                          alt={selectedProduct.client_showcase[0].brand}
                          className="sg-showcase-img"
                        />
                        <div className="sg-showcase-caption">
                          <span>ตัวอย่างผลงานการผลิตและสกรีนโลโก้ให้กับ <strong>{selectedProduct.client_showcase[0].brand}</strong></span>
                        </div>
                      </div>
                      {selectedProduct.client_showcase.length > 1 && (
                        <div className="sg-showcase-thumbs">
                          {selectedProduct.client_showcase.map((item, idx) => (
                            <img
                              key={idx}
                              src={item.image}
                              alt={item.brand}
                              className="sg-thumb-img"
                              title={`Client: ${item.brand}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="sg-mockup-view">
                      <img
                        src={selectedProduct.mockup_image || selectedProduct.plate_image}
                        alt={selectedProduct.name_en}
                        className="sg-modal-main-img"
                      />
                    </div>
                  )}
                </div>

                {/* Technical Specifications Matrix */}
                <div className="sg-specs-table-box">
                  <h4 className="sg-specs-title">📋 ข้อมูลทางเทคนิคและขนาดบรรจุ (Specifications)</h4>
                  <table className="sg-specs-table">
                    <tbody>
                      <tr>
                        <th>รหัสสินค้า (SKU):</th>
                        <td><code>{selectedProduct.code}</code></td>
                        <th>หมวดหมู่:</th>
                        <td>{selectedProduct.category_name}</td>
                      </tr>
                      <tr>
                        <th>ขนาดสินค้า (กว้าง×ยาว×สูง):</th>
                        <td>{selectedProduct.dimensions_cm.length} × {selectedProduct.dimensions_cm.width} × {selectedProduct.dimensions_cm.height} cm</td>
                        <th>น้ำหนักสุทธิ:</th>
                        <td>{selectedProduct.unit_weight_kg} กก. ({Math.round(selectedProduct.unit_weight_kg * 1000)} g)</td>
                      </tr>
                      <tr>
                        <th>ระยะเวลาผลิตตัวอย่าง/ส่งมอบ:</th>
                        <td>{selectedProduct.lead_time_days} วันทำการ</td>
                        <th>การปรับแต่งโลโก้:</th>
                        <td>Laser Engrave, Silkscreen, UV Print, Custom Sleeve</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Side: Pricing Calculator & Order Configuration */}
              <div className="sg-modal-info-side">
                <div className="sg-modal-meta-header">
                  <span className="sg-modal-category-tag">{selectedProduct.category_name}</span>
                  <span className="sg-modal-code">{selectedProduct.code}</span>
                </div>

                <h2 className="sg-modal-title-th">{selectedProduct.name_th}</h2>
                <p className="sg-modal-title-en">{selectedProduct.name_en}</p>

                <p className="sg-modal-description">{selectedProduct.description_th}</p>

                {/* B2B Tier Pricing Calculator */}
                <div className="sg-pricing-calculator">
                  <div className="sg-calc-header">
                    <span className="sg-calc-title">📊 คำนวณราคาตามจำนวนสั่งผลิต (Tiered Pricing)</span>
                    <span className="sg-calc-note">ขั้นต่ำเริ่มต้นที่ 10 ชิ้น</span>
                  </div>

                  {/* Quantity Presets & Input */}
                  <div className="sg-qty-presets">
                    {[10, 50, 100, 300, 500, 1000].map(qty => (
                      <button
                        key={qty}
                        className={`sg-qty-btn ${orderQty === qty ? 'active' : ''}`}
                        onClick={() => setOrderQty(qty)}
                      >
                        {qty.toLocaleString()} ชิ้น
                      </button>
                    ))}
                  </div>

                  <div className="sg-qty-custom-row">
                    <label htmlFor="custom-qty-input">ระบุจำนวนที่ต้องการ (ชิ้น):</label>
                    <input
                      id="custom-qty-input"
                      type="number"
                      min="1"
                      max="10000"
                      value={orderQty}
                      onChange={e => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="sg-qty-input"
                    />
                  </div>

                  {/* Dynamic Pricing Result Box */}
                  {(() => {
                    const { unitPrice, totalPrice, totalSavings, savingsPercent } = calculateTierPrice(selectedProduct, orderQty)
                    return (
                      <div className="sg-calc-summary-card">
                        <div className="sg-calc-row">
                          <span>ราคาต่อหน่วย (Unit Price):</span>
                          <div className="sg-calc-unit-val">
                            <strong>฿{unitPrice.toLocaleString()}</strong>
                            <span className="sg-calc-per">/ ชิ้น</span>
                            {savingsPercent > 0 && (
                              <span className="sg-savings-chip">ลด {savingsPercent}%</span>
                            )}
                          </div>
                        </div>

                        <div className="sg-calc-row">
                          <span>ราคารวมโดยประมาณ:</span>
                          <span className="sg-calc-total-val">฿{totalPrice.toLocaleString()}</span>
                        </div>

                        {totalSavings > 0 && (
                          <div className="sg-calc-row savings">
                            <span>ประหยัดงบองค์กรได้:</span>
                            <span className="sg-calc-save-val">฿{totalSavings.toLocaleString()}</span>
                          </div>
                        )}

                        <div className="sg-calc-row muted">
                          <span>ระยะเวลาผลิตโดยประมาณ:</span>
                          <span>{selectedProduct.lead_time_days} - {selectedProduct.lead_time_days + 4} วันทำการ</span>
                        </div>
                      </div>
                    )
                  })()}

                  {/* Price Tiers Matrix Breakdown */}
                  <div className="sg-tier-matrix">
                    <span className="sg-matrix-title">ตารางเรทส่วนลดทั้งหมด:</span>
                    <div className="sg-matrix-grid">
                      {selectedProduct.price_tiers.map((tier, idx) => {
                        const isCurrent = orderQty >= tier.min_qty &&
                          (idx === selectedProduct.price_tiers.length - 1 || orderQty < selectedProduct.price_tiers[idx + 1].min_qty)
                        return (
                          <div key={tier.min_qty} className={`sg-matrix-col ${isCurrent ? 'current' : ''}`}>
                            <span className="sg-tier-range">≥ {tier.min_qty} ชิ้น</span>
                            <span className="sg-tier-cost">฿{tier.unit_price}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Quotation & Spec Action */}
                <div className="sg-action-section">
                  {quoteRequested ? (
                    <div className="sg-quote-success-banner">
                      <span className="sg-success-icon">✅</span>
                      <div>
                        <strong>ระบบบันทึกรายการขอใบเสนอราคาเรียบร้อยแล้ว</strong>
                        <p>เจ้าหน้าที่ฝ่าย Corporate Sales จะจัดส่งใบเสนอราคาอย่างเป็นทางการและตัวอย่าง Digital Proof ภายใน 24 ชม.</p>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="sg-request-quote-btn"
                      onClick={() => setQuoteRequested(true)}
                    >
                      📩 ขอใบเสนอราคา & สั่งทำตัวอย่าง ({orderQty.toLocaleString()} ชิ้น)
                    </button>
                  )}

                  <div className="sg-action-sublinks">
                    <button
                      className="sg-sublink-btn"
                      onClick={() => alert(`ดาวน์โหลด Product Spec Sheet: ${selectedProduct.code} เรียบร้อยแล้ว`)}
                    >
                      📄 ดาวน์โหลด Product Spec Sheet (PDF)
                    </button>
                    <button
                      className="sg-sublink-btn"
                      onClick={() => alert(`ดาวน์โหลด 3D Model: ${selectedProduct.code}.glb`)}
                    >
                      💾 ดาวน์โหลดไฟล์ 3D Assets (.GLB)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* B-Line Item Detail Modal (if opened in B-Line tab) */}
      {blineSelected && (
        <div className="sg-modal-backdrop" onClick={() => setBlineSelected(null)}>
          <div className="sg-modal-card compact" onClick={e => e.stopPropagation()}>
            <button className="sg-modal-close-btn" onClick={() => setBlineSelected(null)}>✕</button>
            <div className="sg-modal-layout single-col">
              <img src={blineSelected.image} alt={blineSelected.name} className="sg-modal-main-img" />
              <h3>{blineSelected.name} ({blineSelected.year})</h3>
              <p>Designer: {blineSelected.designer} | Category: {blineSelected.category}</p>
              <p>Iconic design piece by B-Line Italia. Master of storage, seating and architectural lighting.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
