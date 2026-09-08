export interface MediaSlotInfo {
  id: string
  name: string
  type: 'image' | 'video'
  aspectRatio: string
  recommendedRes: string
  recommendedSize: string
  format: string
  description: string
}

export interface MediaConfigState {
  logoUrl: string
  videoLeftUrl: string
  videoRightUrl: string
  galleryUrls: string[]
}

export const LOGO_SLOT: MediaSlotInfo = {
  id: 'logo',
  name: 'Brand Logo (โลโก้)',
  type: 'image',
  aspectRatio: '1:1 (Square)',
  recommendedRes: '500 × 500 px',
  recommendedSize: '500x500',
  format: 'PNG (Transparent) หรือ JPG',
  description: 'แสดงผลที่มุมซ้ายบนของหน้าเว็บ'
}

export const VIDEO_SLOTS: MediaSlotInfo[] = [
  {
    id: 'videoLeft',
    name: 'Background Video (มุมซ้าย)',
    type: 'video',
    aspectRatio: '16:9 (Landscape)',
    recommendedRes: '1920 × 1080 px (Full HD)',
    recommendedSize: '1920x1080',
    format: 'MP4 (H.264), Muted',
    description: 'เล่นเมื่อเลื่อนเมาส์ไปทางฝั่งซ้ายของหน้าจอ'
  },
  {
    id: 'videoRight',
    name: 'Background Video (มุมขวา)',
    type: 'video',
    aspectRatio: '16:9 (Landscape)',
    recommendedRes: '1920 × 1080 px (Full HD)',
    recommendedSize: '1920x1080',
    format: 'MP4 (H.264), Muted',
    description: 'เล่นเมื่อเลื่อนเมาส์ไปทางฝั่งขวาของหน้าจอ'
  }
]

export const GALLERY_SLOT_SPEC: MediaSlotInfo = {
  id: 'galleryItem',
  name: 'Gallery Product Item (ภาพสินค้า)',
  type: 'image',
  aspectRatio: '2:3 (Portrait แนวตั้ง)',
  recommendedRes: '1200 × 1800 px (หรือ 800 × 1200 px)',
  recommendedSize: '1200x1800',
  format: 'WebP / PNG / JPG',
  description: 'การ์ดแสดงผลในส่วน Archive Gallery เมื่อเลื่อน Scroll Down'
}

/**
 * v4 hinged gift-box clips share a closed gold-foil master and linear opening motion.
 *   mouse RIGHT half → videoLeftUrl  = east clip (ONE BANGKOK / ICONSIAM)
 *   mouse LEFT  half → videoRightUrl = west clip (UD Trucks / True)
 * The slot names are inverted relative to the mouse side — see App.tsx onMove.
 */
export const HERO_POSTER_URL = '/assets/videos/hero_frame0_poster.jpg?v=5'

/** Template-era placeholder clips; a saved config still pointing here is migrated to the defaults. */
export const LEGACY_VIDEO_HOST = 'd8j0ntlcm91z4.cloudfront.net'

export const HOME_GALLERY = [
  { url: '/assets/smartgift/plates/one31_nb_plate.png', alt: 'ภาพจำลองสมุดปกดำ' },
  { url: '/assets/smartgift/plates/one31_tmb_plate.png', alt: 'ภาพจำลองทัมเบลอร์สีดำ' },
  { url: '/assets/smartgift/plates/one31_tote_plate.png', alt: 'ภาพจำลองกระเป๋าผ้าสีดำ' },
  { url: '/assets/smartgift/plates/ob_bottle_plate.png', alt: 'ภาพจำลองกระบอกน้ำสีดำ' },
  { url: '/assets/smartgift/plates/ob_mug_plate.png', alt: 'ภาพจำลองแก้วพร้อมหูจับ' },
  { url: '/assets/smartgift/plates/gmmtv_pb_plate.png', alt: 'ภาพจำลองพาวเวอร์แบงก์สีขาว' },
  { url: '/assets/smartgift/story/open-gift-box-v5.png', alt: 'ภาพจำลองกล่อง SmartGift เปิดฝาพร้อมชุดของขวัญ' }
]

export const HOME_CHAPTERS = [
  { title: 'BESPOKE', copy: 'ออกแบบให้เป็นแบรนด์คุณ' },
  { title: 'EVERYDAY, ELEVATED', copy: 'ของใช้ประจำวัน ที่ให้ได้อย่างมีความหมาย' },
  { title: 'THE ART OF GIVING', copy: 'ใส่ใจตั้งแต่ของขวัญถึงบรรจุภัณฑ์' }
]

/** Replace only exact template-era defaults, preserving individually customised slots. */
export function migrateGallery(urls: unknown): string[] {
  if (!Array.isArray(urls) || !urls.length) return HOME_GALLERY.map(item => item.url)
  return urls.flatMap((url, index) => {
    if (typeof url !== 'string') return HOME_GALLERY[index] ? [HOME_GALLERY[index].url] : []
    const template = url.startsWith('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_')
    return template ? (HOME_GALLERY[index] ? [HOME_GALLERY[index].url] : []) : [url]
  })
}

export const DEFAULT_MEDIA_CONFIG: MediaConfigState = {
  logoUrl: '/logo-smg.jpg',
  videoLeftUrl: '/assets/videos/hero_east_discover.mp4?v=5',
  videoRightUrl: '/assets/videos/hero_west_receive.mp4?v=5',
  galleryUrls: HOME_GALLERY.map(item => item.url)
}
