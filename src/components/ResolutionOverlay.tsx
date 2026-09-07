import React, { useEffect, useRef, useState } from 'react'

interface ResolutionOverlayProps {
  show: boolean
}

export const CardOverlay: React.FC<{ index: number; show: boolean }> = ({ index, show }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dim, setDim] = useState({ w: 0, h: 0 })

  useEffect(() => {
    if (!show || !containerRef.current) return
    const parent = containerRef.current.parentElement
    if (!parent) return

    const measure = () => {
      const rect = parent.getBoundingClientRect()
      setDim({ w: Math.round(rect.width), h: Math.round(rect.height) })
    }
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(parent)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [show])

  if (!show) return null

  return (
    <div ref={containerRef} className="card-res-overlay">
      <div className="card-blueprint-corner top-left" />
      <div className="card-blueprint-corner top-right" />
      <div className="card-blueprint-corner bottom-left" />
      <div className="card-blueprint-corner bottom-right" />

      <span className="card-slot-title">SLOT #{index + 1}</span>
      <strong className="card-rendered-dim">{dim.w} × {dim.h} px</strong>
      <span className="card-spec-target">Spec: 1200×1800px (2:3)</span>
    </div>
  )
}

export const ResolutionOverlay: React.FC<ResolutionOverlayProps> = ({ show }) => {
  const [logoDim, setLogoDim] = useState({ w: 0, h: 0 })
  const [canvasDim, setCanvasDim] = useState({ w: 0, h: 0 })

  useEffect(() => {
    if (!show) return

    const update = () => {
      const logoEl = document.querySelector('.logo-img')
      const canvasEl = document.getElementById('main-canvas')

      if (logoEl) {
        const r = logoEl.getBoundingClientRect()
        setLogoDim({ w: Math.round(r.width), h: Math.round(r.height) })
      }
      if (canvasEl) {
        const r = canvasEl.getBoundingClientRect()
        setCanvasDim({ w: Math.round(r.width), h: Math.round(r.height) })
      }
    }

    update()
    window.addEventListener('resize', update)
    const interval = setInterval(update, 400)
    return () => {
      window.removeEventListener('resize', update)
      clearInterval(interval)
    }
  }, [show])

  if (!show) return null

  return (
    <div className="resolution-overlay-layer">
      {/* Background Grid Lines Overlay */}
      <div className="grid-blueprint-lines">
        <div className="grid-line v-line line-25" />
        <div className="grid-line v-line line-50" />
        <div className="grid-line v-line line-75" />
      </div>

      {/* Logo Badge */}
      <div className="res-badge-tag logo-tag">
        📐 LOGO: <strong>{logoDim.w} × {logoDim.h} px</strong> (Spec: 500×500px 1:1)
      </div>

      {/* Background Video Canvas Badge */}
      <div className="res-badge-tag video-left-tag">
        🎬 VIDEO CANVAS: <strong>{canvasDim.w} × {canvasDim.h} px</strong> (Spec: 1920×1080px 16:9)
      </div>
    </div>
  )
}
