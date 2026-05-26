export type RoomKey = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'balcony'

export interface HotspotData {
  position: [number, number, number] // [x, y, z] in 3D space
  label: string
  info?: string
  action?: RoomKey
}

export interface RoomConfig {
  name: string
  desc: string
  hotspots: HotspotData[]
}

export interface StatItem {
  value: string
  label: string
}

export interface LandingPageContent {
  campaignName: string
  seoTitle: string
  seoDescription: string
  brandName: string
  logoText: string
  hero: {
    tag: string
    headline: string
    highlightText: string
    subheadline: string
    ctaText: string
  }
  stats: StatItem[]
  roomConfigs: Record<RoomKey, RoomConfig>
}
