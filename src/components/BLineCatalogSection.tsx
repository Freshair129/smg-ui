import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import {
  CatalogItem,
  CatalogRoute,
  CatalogView,
  ProductFamilySlug,
  StandardCategorySlug,
  OccasionSlug,
  INTEREST_THEMES,
  GIFT_TIERS,
  STANDARD_CATEGORIES,
  QTY_PRESETS,
  buildCatalogHash,
  parseCatalogHash,
  unitPriceAt,
  bestTierPrice,
  isPublicItem,
  standardCategory
} from '../data/catalogTaxonomy'
import {
  CATALOG_ITEMS,
  CATALOG_ITEM_BY_CODE,
  PARTNER_ITEMS,
  loadSupplierItems,
  familyLabel,
  categoryLabel,
  formatBaht,
  imageStatusLabel
} from '../data/catalogItems'
import { BLINE_PRODUCTS, BLineProduct } from '../data/unifiedBLineCatalog'

export { BLINE_PRODUCTS }
export type { BLineProduct }

const ModelViewer = (props: Record<string, unknown>) => React.createElement('model-viewer', props)

// ---------------------------------------------------------------------------
// Routing (hash-based, see docs/CATALOG-STRUCTURE-SPEC.md §6)
// ---------------------------------------------------------------------------

interface UiRoute extends CatalogRoute {
  partner: boolean
}

function readRoute(): UiRoute {
  const hash = typeof window === 'undefined' ? '' : window.location.hash
  const partner = hash.toLowerCase().startsWith('#bline')
  const parsed = parseCatalogHash(hash) ?? { lens: 'recipient' as const }
  return { ...parsed, partner }
}

function navigate(route: UiRoute) {
  const hash = route.partner ? '#bline' : buildCatalogHash(route)
  if (window.location.hash !== hash) window.location.hash = hash
}

function withFilter(route: UiRoute, key: string, value: string | null): UiRoute {
  const filters = { ...(route.filters ?? {}) }
  if (value === null || value === '') delete filters[key]
  else filters[key] = value
  return { ...route, filters: Object.keys(filters).length ? filters : undefined }
}

function sameRoute(a: UiRoute, b: UiRoute): boolean {
  return buildCatalogHash(a) === buildCatalogHash(b) && a.partner === b.partner
}

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------

function matchesRoute(item: CatalogItem, route: UiRoute): boolean {
  if (route.partner) return item.layer === 'partner'
  if (item.layer === 'partner') return false
  switch (route.axis) {
    case 'theme':
      return item.theme === route.value
    case 'tier': {
      const tier = (route.value ?? '').toLowerCase()
      return item.tier?.toLowerCase() === tier || (item.tier_eligibility ?? []).some(t => t.toLowerCase() === tier)
    }
    case 'occasion':
      return (item.occasions ?? []).includes(route.value as OccasionSlug)
    case 'kind':
      return item.kind === route.value
    case 'category': {
      if (!route.value) return true
      if (route.value === 'gift-sets') {
        if (item.kind === 'single') return false
      } else if (item.standard_category !== route.value) {
        return false
      }
      if (route.family) return item.families.includes(route.family as ProductFamilySlug)
      return true
    }
    default:
      return true
  }
}

function matchesFilters(item: CatalogItem, filters: Record<string, string> | undefined): boolean {
  if (!filters) return true
  if (filters.kind === 'single' && item.kind !== 'single') return false
  if (filters.kind === 'set' && item.kind === 'single') return false
  if (filters['3d'] === '1' && !item.model3d_url) return false
  if (filters.priced === '1' && item.price_status !== 'tiered') return false
  if (filters.contains) {
    const wanted = filters.contains.split(',').filter(Boolean)
    if (!wanted.every(f => item.families.includes(f as ProductFamilySlug))) return false
  }
  return true
}

// ---------------------------------------------------------------------------
// Presentation helpers
// ---------------------------------------------------------------------------

function priceLine(item: CatalogItem): string {
  const best = bestTierPrice(item)
  if (best === undefined || !item.price_tiers?.length) return 'สอบถามราคา'
  const tier = item.price_tiers.reduce((a, b) => (b.min_qty > a.min_qty ? b : a))
  return `เริ่ม ${formatBaht(best)} @${tier.min_qty.toLocaleString('en-US')}`
}

function subtitle(item: CatalogItem): string {
  if (item.layer === 'partner') return `${item.designer ?? ''}${item.year ? `, ${item.year}` : ''}`
  if (item.kind === 'single') return familyLabel(item.families[0] ?? '') || categoryLabel(item.standard_category)
  const parts = item.families.slice(0, 3).map(familyLabel)
  return [item.tier, parts.join(' + ')].filter(Boolean).join(' · ')
}

function dims(item: CatalogItem): string {
  const d = item.dimensions_cm
  return d ? `${d.length} × ${d.width} × ${d.height} ซม.` : '—'
}

function themeLabel(slug?: string): string {
  return INTEREST_THEMES.find(t => t.slug === slug)?.short_th ?? ''
}

function breadcrumbFor(item: CatalogItem): string {
  if (item.layer === 'partner') return 'B—Line · Italian design partner'
  const a = item.theme ? `ธีม: ${themeLabel(item.theme)}` : null
  const b =
    item.kind === 'single'
      ? `หมวด: ${categoryLabel(item.standard_category)}${item.families[0] ? ` / ${familyLabel(item.families[0])}` : ''}`
      : `หมวด: ${categoryLabel('gift-sets')}`
  return [a, b].filter(Boolean).join(' · ')
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const BLineCatalogSection: React.FC<{ onBackToArchive: () => void }> = ({ onBackToArchive }) => {
  const [dark, setDark] = useState(true)
  const [route, setRoute] = useState<UiRoute>(readRoute)
  const [supplierItems, setSupplierItems] = useState<CatalogItem[] | null>(null)
  const [supplierLoading, setSupplierLoading] = useState(false)
  const [selected, setSelected] = useState<CatalogItem | null>(null)
  const [modalMediaMode, setModalMediaMode] = useState<'3d' | 'image' | 'bom' | 'client'>('image')
  const [orderQty, setOrderQty] = useState<number>(100)
  const [inquirySent, setInquirySent] = useState(false)

  // The list route stays put while an item deep link (#catalog/item/CODE) is open.
  const listRouteRef = useRef<UiRoute>(route.axis === 'item' ? { lens: 'recipient', partner: route.partner } : route)
  const openedFromListRef = useRef(false)

  useEffect(() => {
    const onHash = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    if (route.axis !== 'item') listRouteRef.current = route
  }, [route])

  const listRoute = route.axis === 'item' ? listRouteRef.current : route
  const filters = listRoute.filters
  const supplierOn = filters?.supplier === '1'

  useEffect(() => {
    if (!supplierOn || supplierItems || supplierLoading) return
    setSupplierLoading(true)
    loadSupplierItems().then(items => {
      setSupplierItems(items)
      setSupplierLoading(false)
    })
  }, [supplierOn, supplierItems, supplierLoading])

  // ---- item pool -----------------------------------------------------------
  const pool = useMemo<CatalogItem[]>(() => {
    if (listRoute.partner) return PARTNER_ITEMS
    const base = CATALOG_ITEMS.filter(isPublicItem)
    return supplierOn && supplierItems ? [...base, ...supplierItems.filter(isPublicItem)] : base
  }, [listRoute.partner, supplierOn, supplierItems])

  const routed = useMemo(() => pool.filter(item => matchesRoute(item, listRoute)), [pool, listRoute])
  const visible = useMemo(() => routed.filter(item => matchesFilters(item, filters)), [routed, filters])

  const isIndex = !listRoute.partner && !listRoute.value && (listRoute.axis === undefined || listRoute.axis === 'category')
  const view: CatalogView = listRoute.view ?? (isIndex ? 'index' : 'grid')

  // ---- deep link: open the modal for #catalog/item/CODE --------------------
  useEffect(() => {
    if (route.axis !== 'item' || !route.value) {
      if (selected && !openedFromListRef.current) setSelected(null)
      return
    }
    const code = route.value
    const all = [...CATALOG_ITEMS, ...PARTNER_ITEMS, ...(supplierItems ?? [])]
    const found = all.find(i => i.code.toLowerCase() === code.toLowerCase())
    if (found) {
      if (found !== selected) {
        setSelected(found)
        setModalMediaMode(found.model3d_url ? '3d' : found.image ? 'image' : found.contains?.length ? 'bom' : 'image')
        setOrderQty(100)
        setInquirySent(false)
      }
    } else if (found === undefined && !supplierItems && !supplierLoading) {
      // maybe a supplier code — load the layer once, then the effect re-runs
      setSupplierLoading(true)
      loadSupplierItems().then(items => {
        setSupplierItems(items)
        setSupplierLoading(false)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.axis, route.value, supplierItems])

  const openItem = useCallback(
    (item: CatalogItem) => {
      openedFromListRef.current = true
      setSelected(item)
      setModalMediaMode(item.model3d_url ? '3d' : item.image ? 'image' : item.contains?.length ? 'bom' : 'image')
      setOrderQty(100)
      setInquirySent(false)
      window.location.hash = `${listRoute.partner ? 'bline' : 'catalog'}/item/${item.code}`
    },
    [listRoute.partner]
  )

  const closeItem = useCallback(() => {
    setSelected(null)
    if (route.axis === 'item') {
      if (openedFromListRef.current) {
        openedFromListRef.current = false
        window.history.back()
      } else {
        navigate({ ...listRouteRef.current, axis: undefined, value: undefined, family: undefined })
      }
    }
  }, [route.axis])

  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeItem()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, closeItem])

  // ---- pricing --------------------------------------------------------------
  const currentPricing = useMemo(() => {
    if (!selected || selected.price_status !== 'tiered' || !selected.price_tiers?.length) return null
    const unit = unitPriceAt(selected, orderQty)
    if (unit === undefined) return { unit: undefined, total: undefined, percent: 0, reference: selected.price_tiers[0] }
    const reference = selected.srp_price ?? selected.price_tiers[0].unit_price
    const percent = reference > 0 ? Math.round(((reference - unit) / reference) * 100) : 0
    return { unit, total: unit * orderQty, percent, reference: selected.price_tiers[0] }
  }, [selected, orderQty])

  // ---- nav model -------------------------------------------------------------
  const lens = listRoute.partner ? 'partner' : listRoute.lens
  const navLinks: { label: string; route: UiRoute; active: boolean }[] = useMemo(() => {
    if (listRoute.partner) return []
    if (lens === 'standard') {
      const all: UiRoute = { lens: 'standard', axis: 'category', partner: false, filters }
      return [
        { label: 'All', route: all, active: !listRoute.value },
        ...STANDARD_CATEGORIES.filter(c => c.public).map(c => {
          const r: UiRoute = { lens: 'standard', axis: 'category', value: c.slug, partner: false, filters }
          return { label: c.name_en, route: r, active: listRoute.axis === 'category' && listRoute.value === c.slug }
        })
      ]
    }
    const all: UiRoute = { lens: 'recipient', partner: false, filters }
    return [
      { label: 'All', route: all, active: !listRoute.axis },
      ...INTEREST_THEMES.map(t => {
        const r: UiRoute = { lens: 'recipient', axis: 'theme', value: t.slug, partner: false, filters }
        return { label: t.short_en, route: r, active: listRoute.axis === 'theme' && listRoute.value === t.slug }
      })
    ]
  }, [lens, listRoute, filters])

  const familyPills = useMemo(() => {
    if (lens !== 'standard' || !listRoute.value) return []
    const counts = new Map<string, number>()
    if (listRoute.value === 'gift-sets') {
      for (const item of routed) for (const f of item.families) counts.set(f, (counts.get(f) ?? 0) + 1)
      return [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([slug, n]) => ({ slug, label: familyLabel(slug), n }))
    }
    const cat = standardCategory(listRoute.value)
    if (!cat) return []
    for (const item of routed) for (const f of item.families) if (cat.families.includes(f)) counts.set(f, (counts.get(f) ?? 0) + 1)
    return cat.families.filter(f => counts.has(f)).map(slug => ({ slug, label: familyLabel(slug), n: counts.get(slug) ?? 0 }))
  }, [lens, listRoute.value, routed])

  const containsFilter = (filters?.contains ?? '').split(',').filter(Boolean)

  const breadcrumb = useMemo(() => {
    if (listRoute.partner) return 'B—Line / Italian design partner — Catalogo Completo'
    if (lens === 'standard') {
      const cat = listRoute.value ? categoryLabel(listRoute.value) : null
      const fam = listRoute.family ? familyLabel(listRoute.family) : null
      return ['หมวดหมู่สินค้า', cat, fam].filter(Boolean).join(' / ')
    }
    if (listRoute.axis === 'theme') return `เริ่มจากผู้รับ / ธีม: ${themeLabel(listRoute.value)}`
    if (listRoute.axis === 'tier') return `เริ่มจากผู้รับ / ระดับการดูแล: ${listRoute.value}`
    if (listRoute.axis === 'occasion') return `เริ่มจากผู้รับ / โอกาส: ${listRoute.value}`
    if (listRoute.axis === 'kind') return `เริ่มจากผู้รับ / ${listRoute.value === 'single' ? 'สินค้าเดี่ยว' : 'ชุดของขวัญ'}`
    return 'เริ่มจากผู้รับ / ให้ใคร → เพื่ออะไร → ระดับไหน'
  }, [lens, listRoute])

  // ---- index groups --------------------------------------------------------------
  const indexGroups = useMemo(() => {
    if (!isIndex || view !== 'index') return []
    if (lens === 'standard') {
      return STANDARD_CATEGORIES.filter(c => c.public)
        .map(c => ({
          key: c.slug,
          title: c.name_th,
          subtitle: c.description_th,
          items: visible.filter(i => (c.slug === 'gift-sets' ? i.kind !== 'single' : i.standard_category === c.slug)),
          route: { lens: 'standard', axis: 'category', value: c.slug, partner: false, filters } as UiRoute
        }))
        .filter(g => g.items.length)
    }
    return INTEREST_THEMES.map(t => ({
      key: t.slug,
      title: t.short_th,
      subtitle: `${t.vibe} · ${t.target_recipient}`,
      items: visible.filter(i => i.theme === t.slug),
      route: { lens: 'recipient', axis: 'theme', value: t.slug, partner: false, filters } as UiRoute
    })).filter(g => g.items.length)
  }, [isIndex, view, lens, visible, filters])

  const tierCounts = useMemo(
    () => GIFT_TIERS.map(t => ({ ...t, n: pool.filter(i => i.tier === t.code).length })),
    [pool]
  )

  // ---- handlers ------------------------------------------------------------------
  const setView = (v: CatalogView) => navigate({ ...listRoute, view: v === 'grid' ? undefined : v })
  const toggleFilter = (key: string, on: boolean, value = '1') => navigate(withFilter(listRoute, key, on ? value : null))
  const toggleContains = (slug: string) => {
    const next = containsFilter.includes(slug) ? containsFilter.filter(f => f !== slug) : [...containsFilter, slug]
    navigate(withFilter(listRoute, 'contains', next.join(',') || null))
  }
  const goFamily = (slug: string) =>
    navigate({ ...listRoute, family: listRoute.family === slug ? undefined : slug, view: listRoute.view === 'index' ? undefined : listRoute.view })
  const setLens = (l: 'recipient' | 'standard') =>
    navigate(l === 'standard' ? { lens: 'standard', axis: 'category', partner: false, filters } : { lens: 'recipient', partner: false, filters })

  const componentItems = (item: CatalogItem) =>
    (item.contains ?? []).map(line => ({ line, item: CATALOG_ITEM_BY_CODE[line.product_code] as CatalogItem | undefined }))

  const usedInItems = (item: CatalogItem) =>
    (item.used_in ?? []).map(code => CATALOG_ITEM_BY_CODE[code]).filter((x): x is CatalogItem => Boolean(x))

  // ---- render helpers ------------------------------------------------------------
  const renderCard = (item: CatalogItem) => (
    <article
      key={item.id}
      className="bline-card"
      tabIndex={0}
      role="button"
      aria-label={item.name_th}
      onClick={() => openItem(item)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openItem(item)
        }
      }}
    >
      <div className="bline-card-img-wrap">
        {item.image ? (
          <img className="bline-card-img" src={item.image} alt={item.name_th} loading="lazy" />
        ) : (
          <div className="bline-card-placeholder" aria-hidden="true">
            <span>{item.kind === 'single' ? familyLabel(item.families[0] ?? '') : 'ชุดของขวัญ'}</span>
            <small>ยังไม่มีภาพสินค้า</small>
          </div>
        )}
        {item.model3d_url && <span className="bline-3d-tag">3D{item.model3d_status === 'draft' ? ' · DRAFT' : ''}</span>}
        {item.kind !== 'single' && (
          <span className="bline-kind-tag">
            ชุด{item.contains?.length ? ` · ${item.contains.length} ชิ้น` : ''}
          </span>
        )}
        {item.layer === 'supplier' && <span className="bline-layer-tag">ผู้ผลิต</span>}
      </div>
      <div className="bline-card-meta">
        <div className="bline-card-text">
          <span className="bline-card-name">{item.name_th}</span>
          <span className="bline-card-designer">{subtitle(item)}</span>
        </div>
        {item.layer !== 'partner' && (
          <span className={`bline-card-price ${item.price_status === 'tiered' ? '' : 'is-quote'}`}>{priceLine(item)}</span>
        )}
      </div>
    </article>
  )

  const renderList = (items: CatalogItem[]) => (
    <div className="bline-list-wrap">
      <table className="bline-list-table">
        <thead>
          <tr>
            <th>รหัส</th>
            <th>ชื่อ</th>
            <th>หมวด / กลุ่ม</th>
            <th>ขนาด (ซม.)</th>
            <th className="num">นน. (กก.)</th>
            <th className="num">@10</th>
            <th className="num">@100</th>
            <th className="num">@1,000</th>
            <th className="num">MOQ</th>
            <th className="num">Lead</th>
            <th>ภาพ</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const cell = (qty: number) => {
              const p = unitPriceAt(item, qty)
              return p === undefined ? (item.price_status === 'tiered' ? '—' : 'สอบถาม') : formatBaht(p)
            }
            return (
              <tr key={item.id} tabIndex={0} onClick={() => openItem(item)} onKeyDown={e => e.key === 'Enter' && openItem(item)}>
                <td className="mono">{item.code}</td>
                <td>
                  <span className="bline-list-name">{item.name_th}</span>
                  {item.name_en && <span className="bline-list-sub">{item.name_en}</span>}
                </td>
                <td>{item.kind === 'single' ? `${categoryLabel(item.standard_category)} / ${familyLabel(item.families[0] ?? '')}` : `ชุดของขวัญ · ${item.families.map(familyLabel).join(', ')}`}</td>
                <td>{dims(item)}</td>
                <td className="num">{item.unit_weight_kg ?? '—'}</td>
                <td className="num">{cell(10)}</td>
                <td className="num">{cell(100)}</td>
                <td className="num">{cell(1000)}</td>
                <td className="num">{item.moq ?? '—'}</td>
                <td className="num">{item.lead_time_days ? `${item.lead_time_days} วัน` : '—'}</td>
                <td className="bline-list-img">{item.image_status === 'source_verified' ? 'ต้นฉบับ' : item.image_status === 'generated_from_source' ? 'สร้างสรรค์' : '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  const supplierCount = supplierItems ? supplierItems.filter(isPublicItem).length : null

  return (
    <section className={`bline-section ${dark ? 'dark-theme' : 'light-theme'}`}>
      {/* Sub Header Navigation */}
      <nav className="bline-nav">
        <div className="bline-nav-left">
          <button className="bline-back-btn" onClick={onBackToArchive}>
            ← SMARTGIFT ARCHIVE
          </button>
          <span className="bline-brand-sub">{listRoute.partner ? 'B—LINE / SMARTGIFT' : 'SMARTGIFT / B—LINE'}</span>
          {listRoute.partner ? (
            <button className="bline-category-btn" onClick={() => navigate({ lens: 'recipient', partner: false })}>
              ← SmartGift catalog
            </button>
          ) : null}
        </div>

        <ul className="bline-nav-links">
          {navLinks.map(link => (
            <li key={link.label}>
              <button className={`bline-category-btn ${link.active ? 'active' : ''}`} onClick={() => navigate(link.route)}>
                {link.label}
              </button>
            </li>
          ))}
          {!listRoute.partner && (
            <li>
              <button className="bline-category-btn bline-partner-link" onClick={() => navigate({ lens: 'recipient', partner: true })}>
                B—Line
              </button>
            </li>
          )}
        </ul>

        <div className="bline-nav-right">
          {!listRoute.partner && (
            <div className="bline-lens-toggle" role="tablist" aria-label="มุมมองแคตตาล็อก">
              <button role="tab" aria-selected={lens === 'recipient'} className={`bline-lens-btn ${lens === 'recipient' ? 'active' : ''}`} onClick={() => setLens('recipient')}>
                เริ่มจากผู้รับ
              </button>
              <button role="tab" aria-selected={lens === 'standard'} className={`bline-lens-btn ${lens === 'standard' ? 'active' : ''}`} onClick={() => setLens('standard')}>
                หมวดหมู่สินค้า
              </button>
            </div>
          )}
          <button className="bline-theme-toggle" onClick={() => setDark(!dark)} title="Toggle Light/Dark Theme">
            {dark ? '☀️ LIGHT' : '🌙 DARK'}
          </button>
        </div>
      </nav>

      {/* Hero Title */}
      <header className="bline-hero">
        <h1 className="bline-wordmark">{listRoute.partner ? 'B—Line' : 'SmartGift'}</h1>
      </header>

      {/* Section Label Bar */}
      <div className="bline-section-label">
        <span className="bline-breadcrumb">
          {breadcrumb} &nbsp;·&nbsp; {visible.length} รายการ
          {supplierLoading && <em className="bline-loading"> · กำลังโหลดแคตตาล็อกผู้ผลิต…</em>}
        </span>
        <div className="bline-filter-pills">
          {lens === 'recipient' && (
            <>
              <span className="pill-label">ระดับ:</span>
              {tierCounts.map(t => (
                <button
                  key={t.code}
                  className={`pill-btn ${listRoute.axis === 'tier' && listRoute.value === t.code.toLowerCase() ? 'active' : ''}`}
                  title={t.tagline_th}
                  onClick={() =>
                    navigate(
                      listRoute.axis === 'tier' && listRoute.value === t.code.toLowerCase()
                        ? { lens: 'recipient', partner: false, filters }
                        : { lens: 'recipient', axis: 'tier', value: t.code.toLowerCase(), partner: false, filters }
                    )
                  }
                >
                  {t.code} ({t.n})
                </button>
              ))}
            </>
          )}
          {lens === 'standard' && familyPills.length > 0 && (
            <>
              <span className="pill-label">{listRoute.value === 'gift-sets' ? 'มีในชุด:' : 'กลุ่ม:'}</span>
              {familyPills.map(p => (
                <button
                  key={p.slug}
                  className={`pill-btn ${(listRoute.value === 'gift-sets' ? containsFilter.includes(p.slug) : listRoute.family === p.slug) ? 'active' : ''}`}
                  onClick={() => (listRoute.value === 'gift-sets' ? toggleContains(p.slug) : goFamily(p.slug))}
                >
                  {p.label} ({p.n})
                </button>
              ))}
            </>
          )}
          {lens === 'standard' && isIndex && (
            <>
              <span className="pill-label">หมวด:</span>
              {STANDARD_CATEGORIES.filter(c => c.public).map(c => (
                <button key={c.slug} className="pill-btn" onClick={() => navigate({ lens: 'standard', axis: 'category', value: c.slug, partner: false, filters })}>
                  {c.name_th}
                </button>
              ))}
            </>
          )}
          {!listRoute.partner && (
            <>
              <span className="pill-label">·</span>
              {listRoute.value !== 'gift-sets' && (
                <>
                  <button className={`pill-btn ${filters?.kind === 'single' ? 'active' : ''}`} onClick={() => toggleFilter('kind', filters?.kind !== 'single', 'single')}>
                    เดี่ยว
                  </button>
                  <button className={`pill-btn ${filters?.kind === 'set' ? 'active' : ''}`} onClick={() => toggleFilter('kind', filters?.kind !== 'set', 'set')}>
                    ชุด
                  </button>
                </>
              )}
              <button className={`pill-btn ${filters?.['3d'] === '1' ? 'active' : ''}`} onClick={() => toggleFilter('3d', filters?.['3d'] !== '1')} title="เฉพาะรายการที่มี 3D digital twin (draft)">
                🌐 3D
              </button>
              <button className={`pill-btn ${filters?.priced === '1' ? 'active' : ''}`} onClick={() => toggleFilter('priced', filters?.priced !== '1')}>
                มีราคา
              </button>
              <button
                className={`pill-btn ${supplierOn ? 'active' : ''}`}
                onClick={() => toggleFilter('supplier', !supplierOn)}
                title="รวมรายการจากแคตตาล็อกผู้ผลิตที่มีภาพต้นฉบับหรือราคาอ้างอิง"
              >
                แคตตาล็อกผู้ผลิต{supplierCount !== null ? ` (${supplierCount})` : ''}
              </button>
            </>
          )}
          <span className="bline-view-toggle" role="group" aria-label="รูปแบบการแสดงผล">
            {isIndex && (
              <button className={`pill-btn ${view === 'index' ? 'active' : ''}`} onClick={() => setView('index')} title="แยกตามหมวด">
                ▤
              </button>
            )}
            <button className={`pill-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')} title="Grid">
              ⊞
            </button>
            <button className={`pill-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')} title="ตารางสเปก">
              ☰
            </button>
          </span>
        </div>
      </div>

      {/* Body */}
      <main className="bline-main">
        {view === 'index' && isIndex ? (
          <>
            {lens === 'recipient' && (
              <div className="bline-tier-strip" aria-label="ระดับการดูแล">
                {tierCounts.map(t => (
                  <button key={t.code} className="bline-tier-card" onClick={() => navigate({ lens: 'recipient', axis: 'tier', value: t.code.toLowerCase(), partner: false, filters })}>
                    <span className="bline-tier-code">{t.code}</span>
                    <span className="bline-tier-tag">{t.tagline_th}</span>
                    <span className="bline-tier-n">{t.n} ชุด</span>
                  </button>
                ))}
              </div>
            )}
            {indexGroups.map(group => (
              <section key={group.key} className="bline-index-section">
                <div className="bline-index-head">
                  <div>
                    <h3>{group.title}</h3>
                    <p>{group.subtitle}</p>
                  </div>
                  <button className="bline-index-more" onClick={() => navigate(group.route)}>
                    ดูทั้งหมด ({group.items.length}) →
                  </button>
                </div>
                <div className="bline-grid">{group.items.slice(0, 4).map(renderCard)}</div>
              </section>
            ))}
            {indexGroups.length === 0 && <p className="bline-empty">ไม่มีรายการที่ตรงกับตัวกรอง</p>}
          </>
        ) : view === 'list' ? (
          visible.length ? renderList(visible) : <p className="bline-empty">ไม่มีรายการที่ตรงกับตัวกรอง</p>
        ) : (
          <>
            <div className="bline-grid">{visible.map(renderCard)}</div>
            {visible.length === 0 && <p className="bline-empty">ไม่มีรายการที่ตรงกับตัวกรอง</p>}
          </>
        )}
      </main>

      {/* Product Detail Modal */}
      {selected && (
        <div className="bline-modal-backdrop" onClick={closeItem}>
          <div className="bline-modal-card" role="dialog" aria-modal="true" aria-label={selected.name_th} onClick={e => e.stopPropagation()}>
            <button className="bline-modal-close" onClick={closeItem} aria-label="ปิด" autoFocus>
              ✕
            </button>

            {/* Left: media */}
            <div className="bline-modal-img-container">
              <div className="bline-media-toggles">
                {selected.model3d_url && (
                  <button className={`bline-media-tab-btn ${modalMediaMode === '3d' ? 'active' : ''}`} onClick={() => setModalMediaMode('3d')}>
                    🌐 3D {selected.model3d_status === 'draft' ? '(draft)' : ''}
                  </button>
                )}
                {selected.image && (
                  <button className={`bline-media-tab-btn ${modalMediaMode === 'image' ? 'active' : ''}`} onClick={() => setModalMediaMode('image')}>
                    📷 ภาพ
                  </button>
                )}
                {selected.contains && selected.contains.length > 0 && (
                  <button className={`bline-media-tab-btn ${modalMediaMode === 'bom' ? 'active' : ''}`} onClick={() => setModalMediaMode('bom')}>
                    🧩 ในชุด ({selected.contains.length})
                  </button>
                )}
                {selected.client_showcase && selected.client_showcase.length > 0 && (
                  <button className={`bline-media-tab-btn ${modalMediaMode === 'client' ? 'active' : ''}`} onClick={() => setModalMediaMode('client')}>
                    🏢 ภาพจำลอง
                  </button>
                )}
              </div>

              {modalMediaMode === '3d' && selected.model3d_url ? (
                <div className="bline-3d-wrapper">
                  <ModelViewer
                    src={selected.model3d_url}
                    alt={selected.name_th}
                    {...(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? {} : { 'auto-rotate': true })}
                    camera-controls
                    shadow-intensity="1"
                    shadow-softness="0.8"
                    exposure="1.1"
                    style={{ width: '100%', height: '100%', minHeight: '380px', backgroundColor: '#000' }}
                  />
                  <div className="bline-3d-hint">
                    {selected.model3d_status === 'draft' ? 'Digital twin (draft) · ' : ''}360° drag to rotate & scroll to zoom
                  </div>
                </div>
              ) : modalMediaMode === 'bom' && selected.contains ? (
                <div className="bline-bom-list">
                  {componentItems(selected).map(({ line, item }) => (
                    <button
                      key={line.product_code}
                      className="bline-bom-item"
                      disabled={!item}
                      onClick={() => item && openItem(item)}
                      title={item ? 'เปิดรายละเอียด' : 'รายการจากแคตตาล็อกผู้ผลิต'}
                    >
                      {item?.image ? <img src={item.image} alt="" /> : <span className="bline-bom-thumb">{familyLabel(item?.families[0] ?? '') || '—'}</span>}
                      <span className="bline-bom-text">
                        <b>{line.name_th ?? item?.name_th ?? line.product_code}</b>
                        <small>
                          {line.product_code} × {line.qty}
                          {item?.srp_price ? ` · SRP ${formatBaht(item.srp_price)}` : ''}
                        </small>
                      </span>
                    </button>
                  ))}
                </div>
              ) : modalMediaMode === 'client' && selected.client_showcase && selected.client_showcase.length > 0 ? (
                <div className="bline-client-mockup-wrapper">
                  <img src={selected.client_showcase[0].image} alt={`ภาพจำลอง ${selected.client_showcase[0].brand}`} />
                  <div className="bline-client-caption">
                    ภาพจำลองแนวคิด: <strong>{selected.client_showcase[0].brand}</strong> — ไม่ใช่หลักฐานงานที่ส่งมอบ
                  </div>
                </div>
              ) : selected.image ? (
                <img src={selected.image} alt={selected.name_th} />
              ) : (
                <div className="bline-card-placeholder bline-modal-placeholder">
                  <span>{selected.kind === 'single' ? familyLabel(selected.families[0] ?? '') : 'ชุดของขวัญ'}</span>
                  <small>ยังไม่มีภาพสินค้า</small>
                </div>
              )}
              <div className="bline-img-caption">{imageStatusLabel(selected.image_status)}</div>
            </div>

            {/* Right: details & pricing */}
            <div className="bline-modal-info">
              <span className="bline-modal-cat">{breadcrumbFor(selected)}</span>
              <h2>{selected.name_th}</h2>
              {selected.name_en && selected.name_en !== selected.name_th && <div className="bline-modal-th-name">{selected.name_en}</div>}
              <div className="bline-chip-row">
                <span className="bline-chip mono">{selected.code}</span>
                {selected.tier && <span className="bline-chip is-tier">{selected.tier}</span>}
                <span className="bline-chip">{selected.kind === 'single' ? 'สินค้าเดี่ยว' : 'ชุดของขวัญ'}</span>
                {selected.layer === 'supplier' && <span className="bline-chip">แคตตาล็อกผู้ผลิต</span>}
              </div>

              {(selected.description_th || selected.unboxing_th) && (
                <p className="bline-modal-desc">
                  {selected.unboxing_th ?? selected.description_th}
                  {selected.layer === 'core' && selected.kind === 'single' && selected.description_th && (
                    <small className="bline-unverified"> · รายละเอียดเบื้องต้น ยังไม่ยืนยันสเปก</small>
                  )}
                </p>
              )}
              {selected.branding && <p className="bline-modal-desc bline-modal-branding">วิธีใส่โลโก้: {selected.branding.replace(/,/g, ' · ')}</p>}

              {(selected.dimensions_cm || selected.unit_weight_kg || selected.lead_time_days) && (
                <div className="bline-specs-row">
                  {selected.dimensions_cm && <span>📐 {dims(selected)}</span>}
                  {selected.unit_weight_kg !== undefined && <span>⚖️ {selected.unit_weight_kg} กก.</span>}
                  {selected.lead_time_days !== undefined && <span>⏱️ ประมาณ {selected.lead_time_days} วัน</span>}
                  {selected.moq !== undefined && <span>📦 MOQ {selected.moq}</span>}
                </div>
              )}

              {selected.layer !== 'partner' && (
                <div className="bline-calc-box">
                  <div className="bline-calc-label">ราคาตามจำนวน (B2B TIERED PRICING)</div>
                  {currentPricing ? (
                    <>
                      <div className="bline-calc-qty-pills">
                        {QTY_PRESETS.map(qty => (
                          <button key={qty} className={`bline-calc-qty-btn ${orderQty === qty ? 'active' : ''}`} onClick={() => setOrderQty(qty)}>
                            {qty.toLocaleString('en-US')} pcs
                          </button>
                        ))}
                      </div>
                      <div className="bline-calc-result-row">
                        {currentPricing.unit !== undefined && currentPricing.total !== undefined ? (
                          <>
                            <div>
                              <span className="bline-calc-sub">ราคาต่อชิ้น</span>
                              <span className="bline-calc-unit">{formatBaht(currentPricing.unit)}</span>
                            </div>
                            <div>
                              <span className="bline-calc-sub">รวมโดยประมาณ</span>
                              <span className="bline-calc-total">{formatBaht(currentPricing.total)}</span>
                              {currentPricing.percent > 0 && <span className="bline-calc-save-pill">-{currentPricing.percent}%</span>}
                            </div>
                          </>
                        ) : (
                          <div>
                            <span className="bline-calc-sub">จำนวนนี้ต่ำกว่าขั้นต่ำ {currentPricing.reference.min_qty} ชิ้น</span>
                            <span className="bline-calc-unit">สอบถามราคาสำหรับจำนวนนี้</span>
                          </div>
                        )}
                      </div>
                      <div className="bline-calc-ladder">
                        {selected.price_tiers?.map(t => (
                          <span key={t.min_qty}>
                            @{t.min_qty.toLocaleString('en-US')} <b>{formatBaht(t.unit_price)}</b>
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="bline-calc-result-row">
                      <div>
                        <span className="bline-calc-sub">ยังไม่มีราคาอ้างอิงในระบบ</span>
                        <span className="bline-calc-unit">สอบถามราคา</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selected.kind === 'single' && usedInItems(selected).length > 0 && (
                <div className="bline-used-in">
                  <span className="bline-calc-label">ใช้ในชุด</span>
                  <div className="bline-chip-row">
                    {usedInItems(selected).map(set => (
                      <button key={set.id} className="bline-chip is-link" onClick={() => openItem(set)}>
                        {set.code} · {set.tier}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="bline-modal-actions">
                <button className="bline-inquire-btn" onClick={() => setInquirySent(true)}>
                  {inquirySent ? '✓ ส่งคำขอถึงฝ่ายขายแล้ว' : `ขอใบเสนอราคา${orderQty ? ` · ${orderQty.toLocaleString('en-US')} ชิ้น` : ''}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bline-footer">
        <div className="bline-footer-top">
          <span className="bline-footer-brand">SmartGift Corporate &amp; B—Line S.r.l.</span>
          <ul className="bline-footer-links">
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#cookie">Cookie Policy</a></li>
            <li><a href="#legal">Note Legali</a></li>
            <li><a href="#contact">Contatti</a></li>
            <li><a href="#press">Area Stampa</a></li>
          </ul>
        </div>
        <p className="bline-footer-legal">
          © 2026 SmartGift Corporate Portfolio (บริษัท เทราบิส จำกัด) &amp; B—Line S.r.l. &nbsp;·&nbsp; ราคาเป็นราคาอ้างอิงตามขั้นจำนวน ยืนยันในใบเสนอราคา · ภาพสร้างสรรค์ระบุสถานะรายรายการ
        </p>
      </footer>
    </section>
  )
}
