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
 * Hero clips (docs/HERO-VIDEO-BRAND-DIRECTION.md, preset SG-1). Both start from the same frame
 * (the approved FXD66-3 ad creative), which is also the poster shown before the clips load.
 *   mouse RIGHT half → videoLeftUrl  = east clip "ของ"    (camera pushes in on the open box)
 *   mouse LEFT  half → videoRightUrl = west clip "คนรับ"  (hands enter and lift the tumbler)
 * The slot names are inverted relative to the mouse side — see App.tsx onMove.
 */
export const HERO_POSTER_URL = '/assets/videos/hero_frame0_poster.jpg'

/** Template-era placeholder clips; a saved config still pointing here is migrated to the defaults. */
export const LEGACY_VIDEO_HOST = 'd8j0ntlcm91z4.cloudfront.net'

export const DEFAULT_MEDIA_CONFIG: MediaConfigState = {
  logoUrl: '/logo-smg.jpg',
  videoLeftUrl: '/assets/videos/hero_east_discover.mp4',
  videoRightUrl: '/assets/videos/hero_west_receive.mp4',
  galleryUrls: [
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_104530_521b2f85-c0f3-4d0e-9704-b578315b4cb9.png&w=1920&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103711_76ccdb8b-5043-4f47-9c54-4379713393ea.png&w=1920&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103728_394f6a1b-85e2-4386-a4f6-408472a0a5b7.png&w=1920&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103739_86743e0e-16a7-4bee-bf38-dd67985344dc.png&w=1920&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103748_b2215dc8-a3a7-470d-b19a-5b87fa7d0c37.png&w=1920&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103758_e919ce72-5c9d-4b87-9be6-d7647b34825c.png&w=1920&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103808_013583d0-3386-4547-9832-37c7d8edb3ac.png&w=1920&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103937_a0c49d0a-33eb-4ead-aea6-c1baf241acbc.png&w=1920&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103956_d18ed8fd-7b6f-4b86-91f9-20010fe38670.png&w=1920&q=85',
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_104034_ba5a9963-87ff-4008-a545-6bd686c088b5.png&w=1920&q=85'
  ]
}
