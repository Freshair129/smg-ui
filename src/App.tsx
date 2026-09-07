import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { DEFAULT_MEDIA_CONFIG, HERO_POSTER_URL, LEGACY_VIDEO_HOST, MediaConfigState } from './config/mediaConfig'
import { MediaConfigModal } from './components/MediaConfigModal'
import { ResolutionOverlay, CardOverlay } from './components/ResolutionOverlay'
import { BLineCatalogSection } from './components/BLineCatalogSection'
import { CATALOG_ITEMS, SUPPLIER_LAYER_META } from './data/catalogItems'
import { useDevMode } from './devMode'

gsap.registerPlugin(ScrollTrigger)

// Hero ledger: what we actually sell, counted from the SSOT-generated pool (never typed by hand).
const CORE_SINGLES = CATALOG_ITEMS.filter(item => item.kind === 'single').length
const CORE_SETS = CATALOG_ITEMS.length - CORE_SINGLES
const CATALOG_TOTAL = CATALOG_ITEMS.length + SUPPLIER_LAYER_META.count

function useGalleryLayout(galleryLength: number) {
  const [columns, setColumns] = useState(4)
  useEffect(() => {
    const sync = () => setColumns(innerWidth < 640 ? 2 : innerWidth < 1024 ? 3 : 4)
    sync(); addEventListener('resize', sync)
    return () => removeEventListener('resize', sync)
  }, [])
  return useMemo(() => {
    const rows: Array<Array<number>> = []
    let image = 0
    for (let row = 0; image < galleryLength; row++) {
      const cells = Array(columns).fill(-1)
      const a = (row * 2 + (row % 2)) % columns
      cells[a] = image++
      if (row % 3 === 0 && image < galleryLength) {
        const b = (a + 2) % columns === a ? (a + 1) % columns : (a + 2) % columns
        cells[b] = image++
      }
      rows.push(cells)
    }
    return rows.flat()
  }, [columns, galleryLength])
}

export default function App() {
  const root = useRef<HTMLDivElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const leftVideo = useRef<HTMLVideoElement>(null)
  const rightVideo = useRef<HTMLVideoElement>(null)
  const cards = useRef<Array<HTMLDivElement | null>>([])
  
  const [currentView, setCurrentView] = useState<'archive' | 'catalog'>(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hash.toLowerCase()
      if (h.startsWith('#catalog') || h.startsWith('#bline') || window.location.pathname.startsWith('/catalog')) {
        return 'catalog'
      }
    }
    return 'archive'
  })

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.toLowerCase()
      if (h.startsWith('#catalog') || h.startsWith('#bline')) {
        setCurrentView('catalog')
      } else if (h === '#archive' || h === '') {
        setCurrentView('archive')
      }
    }
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const setView = (v: 'archive' | 'catalog') => {
    setCurrentView(v)
    if (typeof window !== 'undefined') {
      const h = window.location.hash.toLowerCase()
      const alreadyCatalog = h.startsWith('#catalog') || h.startsWith('#bline')
      if (v === 'catalog' && alreadyCatalog) return
      window.location.hash = v === 'catalog' ? 'catalog' : 'archive'
    }
  }

  const [mediaConfig, setMediaConfig] = useState<MediaConfigState>(() => {
    const saved = localStorage.getItem('smg_media_config')
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as MediaConfigState
        // A config saved while the template clips were the default keeps pointing at them; move it to the brand clips.
        const legacy = (url: string) => typeof url !== 'string' || url.includes(LEGACY_VIDEO_HOST)
        return {
          ...DEFAULT_MEDIA_CONFIG,
          ...parsed,
          videoLeftUrl: legacy(parsed.videoLeftUrl) ? DEFAULT_MEDIA_CONFIG.videoLeftUrl : parsed.videoLeftUrl,
          videoRightUrl: legacy(parsed.videoRightUrl) ? DEFAULT_MEDIA_CONFIG.videoRightUrl : parsed.videoRightUrl
        }
      } catch { /* ignore */ }
    }
    return DEFAULT_MEDIA_CONFIG
  })

  const devMode = useDevMode()
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [loaded, setLoaded] = useState(0)

  const layout = useGalleryLayout(mediaConfig.galleryUrls.length)

  const handleConfigChange = (newConfig: MediaConfigState) => {
    setMediaConfig(newConfig)
    localStorage.setItem('smg_media_config', JSON.stringify(newConfig))
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 50)
    return () => clearTimeout(timer)
  }, [isConfigOpen])

  useGSAP(() => {
    if (!root.current || !wrap.current) return
    const refresh = () => {
      const vh = innerHeight
      const maxScroll = Math.max(0, wrap.current!.scrollHeight - vh)
      root.current!.style.height = `${vh + maxScroll + 2 * vh}px`
    }
    refresh()
    const resize = () => { refresh(); ScrollTrigger.refresh() }
    addEventListener('resize', resize)
    return () => removeEventListener('resize', resize)
  }, { scope: root, dependencies: [layout] })

  useLayoutEffect(() => {
    let raf = 0
    const update = () => {
      const y = scrollY
      const vh = innerHeight
      const maxScroll = Math.max(0, (wrap.current?.scrollHeight ?? 0) - vh)
      const phaseTwo = Math.max(0, y - vh)
      const panel = document.getElementById('black-panel')
      const overlay = document.getElementById('outro-overlay')
      const info = document.getElementById('outro-info')
      const buy = document.getElementById('outro-buy')
      const footer = document.getElementById('outro-footer')
      if (panel) panel.style.transform = `translateY(${Math.max(0, vh - y)}px)`
      if (wrap.current) wrap.current.style.transform = `translateY(${-phaseTwo}px)`
      cards.current.forEach((card) => {
        if (!card) return
        const rect = card.getBoundingClientRect()
        const enter = Math.min(1, (vh - rect.top) / (vh * .6))
        const exit = Math.min(1, rect.bottom / (vh * .4))
        const scale = rect.bottom <= 0 || rect.top >= vh ? 0 : Math.max(0, Math.min(enter, exit))
        card.style.transform = `scale(${scale})`
      })
      const outro = Math.max(0, Math.min(1, (y - vh - maxScroll) / Math.max(1, vh - 100)))
      if (overlay) overlay.style.opacity = `${outro}`
      if (info) info.style.transform = `translateY(${-166 * outro}px)`
      if (buy) buy.style.transform = `scale(${outro})`
      if (footer) footer.style.opacity = `${outro}`
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [layout])

  useEffect(() => {
    const isTouch = matchMedia('(pointer: coarse)').matches
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const left = leftVideo.current, right = rightVideo.current
    if (!left || !right) return
    if (isTouch && !reduced) {
      const play = (video: HTMLVideoElement) => video.play().catch(() => undefined)
      const switchToRight = () => { left.style.display = 'none'; right.style.display = 'block'; right.currentTime = 0; play(right) }
      const switchToLeft = () => { right.style.display = 'none'; left.style.display = 'block'; left.currentTime = 0; play(left) }
      left.addEventListener('ended', switchToRight); right.addEventListener('ended', switchToLeft); play(left)
      return () => { left.removeEventListener('ended', switchToRight); right.removeEventListener('ended', switchToLeft) }
    }
    let active: 'left' | 'right' = 'right'
    let frame = 0
    const onMove = (event: MouseEvent) => {
      if (cursor.current) { cursor.current.style.left = `${event.clientX}px`; cursor.current.style.top = `${event.clientY}px` }
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const width = innerWidth, dead = Math.max(30, width * .05), center = width / 2
        if (Math.abs(event.clientX - center) <= dead) return
        active = event.clientX < center - dead ? 'right' : 'left'
        const shown = active === 'left' ? left : right
        const hidden = active === 'left' ? right : left
        shown.style.display = 'block'; hidden.style.display = 'none'
        const range = Math.max(1, center - dead)
        const progress = active === 'right' ? (center - dead - event.clientX) / range : (event.clientX - center - dead) / range
        if (Number.isFinite(shown.duration) && !shown.seeking) shown.currentTime = Math.max(0, Math.min(1, progress)) * shown.duration
      })
    }
    addEventListener('mousemove', onMove)
    return () => { removeEventListener('mousemove', onMove); cancelAnimationFrame(frame) }
  }, [mediaConfig.videoLeftUrl, mediaConfig.videoRightUrl])

  const ready = () => setLoaded(value => Math.min(2, value + 1))

  if (currentView === 'catalog') {
    return (
      <div className={`bline-page-wrapper ${isConfigOpen ? 'modal-is-open' : ''}`}>
        <BLineCatalogSection onBackToArchive={() => setView('archive')} showPartner />
        <MediaConfigModal
          isOpen={devMode && isConfigOpen}
          onClose={() => setIsConfigOpen(false)}
          config={mediaConfig}
          onChangeConfig={handleConfigChange}
          showOverlay={showOverlay}
          onToggleOverlay={setShowOverlay}
        />
      </div>
    )
  }

  return (
    <div id="scroll-spacer" ref={root} className={`page-root ${isConfigOpen ? 'modal-is-open' : ''}`}>
      <ResolutionOverlay show={devMode && showOverlay} />

      <div ref={cursor} className="cursor"><span>↗</span></div>
      
      <section id="main-canvas" className={loaded >= 1 ? 'loaded' : ''}>
        <video key={mediaConfig.videoLeftUrl} ref={leftVideo} src={mediaConfig.videoLeftUrl} poster={HERO_POSTER_URL} muted playsInline preload="auto" onLoadedData={ready} />
        <video key={mediaConfig.videoRightUrl} ref={rightVideo} src={mediaConfig.videoRightUrl} poster={HERO_POSTER_URL} muted playsInline preload="auto" onLoadedData={ready} />
      </section>

      <motion.div className="logo" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
        <img src={mediaConfig.logoUrl} alt="SmartGift Logo" className="logo-img" />
      </motion.div>

      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .15 }}>
        <nav className="header-nav">
          <button
            className="nav-link active"
            onClick={() => setView('archive')}
          >
            HOME
          </button>
          <button
            className="nav-link"
            onClick={() => setView('catalog')}
          >
            CATALOG
          </button>
        </nav>
        <div className="header-tools">
          {devMode && (
            <>
              <button className={`media-config-trigger-btn ${showOverlay ? 'active' : ''}`} onClick={() => setShowOverlay(!showOverlay)}>
                📐 GRID OVERLAY: {showOverlay ? 'ON' : 'OFF'}
              </button>
              <button className="media-config-trigger-btn" onClick={() => setIsConfigOpen(true)}>
                ⚙️ MEDIA CONFIG
              </button>
            </>
          )}
          <span className="hamburger" />
          <button className="header-quote-btn" onClick={() => setView('catalog')}>ขอใบเสนอราคา</button>
        </div>
      </motion.header>

      <motion.aside id="outro-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .6, delay: .45 }}>
        <div className="collection">
          <div className="symbol-circle">SG</div>
          <span>CORPORATE GIFT PORTFOLIO<br />ของขวัญที่เริ่มจากผู้รับ</span>
        </div>
        <strong>{CATALOG_TOTAL.toLocaleString('en-US')}</strong>
        <small className="outro-count-label">
          สินค้าและชุดของขวัญที่พร้อมเสนอ<br />
          {CORE_SINGLES} สินค้าหลัก · {CORE_SETS} ชุด · {SUPPLIER_LAYER_META.count} จากแคตตาล็อกผู้ผลิต
        </small>
      </motion.aside>

      <div id="black-panel">
        <div className="gallery-wrap" ref={wrap}>
          {layout.map((image, index) =>
            image < 0 ? (
              <div className="gallery-space" key={`space-${index}`} />
            ) : (
              <div className="bp-card" key={`item-${image}`} ref={node => { cards.current[index] = node }}>
                <CardOverlay index={image} show={devMode && showOverlay} />
                <img src={mediaConfig.galleryUrls[image]} alt={`Archive collection garment ${image + 1}`} />
              </div>
            )
          )}
        </div>
      </div>

      <div id="outro-overlay" />
      <div id="outro-buy" onClick={() => setView('catalog')}>EXPLORE CATALOG →</div>
      <footer id="outro-footer">
        <span>SMART-GIFT (R) 2026</span>
        <span>PRIVACY POLICY</span>
      </footer>

      <MediaConfigModal
        isOpen={devMode && isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={mediaConfig}
        onChangeConfig={handleConfigChange}
        showOverlay={showOverlay}
        onToggleOverlay={setShowOverlay}
      />
    </div>
  )
}
