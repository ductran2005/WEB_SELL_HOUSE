'use client'

import { PointerEvent, useEffect, useRef, useState } from 'react'
import { RoomKey } from '@/types/landing'

export type FloorPlanVariant = 'one-bedroom' | 'two-bedroom' | 'three-bedroom' | 'duplex'

interface FloorPlanProps {
  activeRoom?: RoomKey | null
  onRoomChange?: (room: RoomKey) => void
  variant?: FloorPlanVariant
  lang?: string
}

type ZoneKind = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'balcony' | 'stairs'

type RoomZone = {
  room: RoomKey
  kind: ZoneKind
  label: string
  x: number
  y: number
  width: number
  height: number
}

const planZones: Record<FloorPlanVariant, RoomZone[]> = {
  'one-bedroom': [
    { room: 'balcony', kind: 'balcony', label: 'BAN CONG', x: 25, y: 25, width: 125, height: 155 },
    { room: 'living', kind: 'living', label: 'P. KHACH', x: 25, y: 180, width: 125, height: 295 },
    { room: 'kitchen', kind: 'kitchen', label: 'BEP & AN', x: 150, y: 25, width: 170, height: 295 },
    { room: 'bathroom', kind: 'bathroom', label: 'P. TAM', x: 320, y: 25, width: 155, height: 155 },
    { room: 'bedroom', kind: 'bedroom', label: 'P. NGU MASTER', x: 320, y: 180, width: 155, height: 295 },
  ],
  'two-bedroom': [
    { room: 'balcony', kind: 'balcony', label: 'BAN CONG DAI', x: 25, y: 25, width: 450, height: 75 },
    { room: 'living', kind: 'living', label: 'P. KHACH', x: 25, y: 100, width: 180, height: 205 },
    { room: 'kitchen', kind: 'kitchen', label: 'BEP & AN', x: 205, y: 100, width: 115, height: 205 },
    { room: 'bedroom', kind: 'bedroom', label: 'P. NGU 2', x: 25, y: 305, width: 180, height: 170 },
    { room: 'bathroom', kind: 'bathroom', label: 'P. TAM', x: 205, y: 305, width: 115, height: 170 },
    { room: 'bedroom', kind: 'bedroom', label: 'P. NGU MASTER', x: 320, y: 100, width: 155, height: 375 },
  ],
  'three-bedroom': [
    { room: 'balcony', kind: 'balcony', label: 'BAN CONG', x: 25, y: 25, width: 450, height: 65 },
    { room: 'living', kind: 'living', label: 'P. KHACH', x: 25, y: 90, width: 185, height: 200 },
    { room: 'kitchen', kind: 'kitchen', label: 'BEP & AN', x: 210, y: 90, width: 120, height: 200 },
    { room: 'bedroom', kind: 'bedroom', label: 'P. NGU 2', x: 25, y: 290, width: 185, height: 185 },
    { room: 'bathroom', kind: 'bathroom', label: 'WC', x: 210, y: 290, width: 120, height: 90 },
    { room: 'bedroom', kind: 'bedroom', label: 'P. NGU 3', x: 210, y: 380, width: 120, height: 95 },
    { room: 'bedroom', kind: 'bedroom', label: 'P. NGU MASTER', x: 330, y: 90, width: 145, height: 385 },
  ],
  duplex: [
    { room: 'balcony', kind: 'balcony', label: 'LOGGIA', x: 25, y: 25, width: 450, height: 55 },
    { room: 'living', kind: 'living', label: 'TANG 1 / KHACH', x: 25, y: 80, width: 215, height: 230 },
    { room: 'kitchen', kind: 'kitchen', label: 'BEP & AN', x: 25, y: 310, width: 215, height: 165 },
    { room: 'bedroom', kind: 'bedroom', label: 'MASTER SUITE', x: 260, y: 80, width: 215, height: 170 },
    { room: 'bedroom', kind: 'bedroom', label: 'P. NGU 2', x: 260, y: 250, width: 105, height: 225 },
    { room: 'bedroom', kind: 'bedroom', label: 'P. NGU 3', x: 365, y: 250, width: 110, height: 145 },
    { room: 'bathroom', kind: 'bathroom', label: 'WC', x: 365, y: 395, width: 110, height: 80 },
    { room: 'living', kind: 'stairs', label: 'THANG', x: 210, y: 175, width: 50, height: 135 },
  ],
}

const labelTranslation: Record<string, Record<string, string>> = {
  vi: {
    'BAN CONG': 'BAN CÔNG',
    'BAN CONG DAI': 'BAN CÔNG DÀI',
    'P. KHACH': 'P. KHÁCH',
    'BEP & AN': 'BẾP & ĂN',
    'P. TAM': 'P. TẮM',
    'P. NGU MASTER': 'P. NGỦ MASTER',
    'P. NGU 2': 'P. NGỦ 2',
    'P. NGU 3': 'P. NGỦ 3',
    'WC': 'WC',
    'LOGGIA': 'LOGGIA',
    'TANG 1 / KHACH': 'TẦNG 1 / KHÁCH',
    'MASTER SUITE': 'MASTER SUITE',
    'THANG': 'THANG BỘ',
  },
  en: {
    'BAN CONG': 'BALCONY',
    'BAN CONG DAI': 'LONG BALCONY',
    'P. KHACH': 'LIVING ROOM',
    'BEP & AN': 'KITCHEN & DINING',
    'P. TAM': 'BATHROOM',
    'P. NGU MASTER': 'MASTER BEDROOM',
    'P. NGU 2': 'BEDROOM 2',
    'P. NGU 3': 'BEDROOM 3',
    'WC': 'WC',
    'LOGGIA': 'LOGGIA',
    'TANG 1 / KHACH': 'L1 / LIVING',
    'MASTER SUITE': 'MASTER SUITE',
    'THANG': 'STAIRS',
  }
}

function getRoomAtPoint(x: number, y: number, zones: RoomZone[]) {
  return zones.find(
    (zone) =>
      x >= zone.x &&
      x <= zone.x + zone.width &&
      y >= zone.y &&
      y <= zone.y + zone.height,
  )?.room
}

function getCanvasSansFont() {
  if (typeof window === 'undefined') {
    return 'Be Vietnam Pro, system-ui, sans-serif'
  }

  return (
    getComputedStyle(document.documentElement).getPropertyValue('--font-be-vietnam').trim() ||
    'Be Vietnam Pro, system-ui, sans-serif'
  )
}

export function FloorPlan({
  activeRoom = null,
  onRoomChange,
  variant = 'one-bedroom',
  lang = 'vi',
}: FloorPlanProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredRoom, setHoveredRoom] = useState<RoomKey | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const canvasContext = canvas.getContext('2d')
    if (!canvasContext) return
    const ctx: CanvasRenderingContext2D = canvasContext

    const w = canvas.width
    const h = canvas.height
    const zones = planZones[variant]
    const canvasSansFont = getCanvasSansFont()
    const wallColor = '#c5a880'
    const furnitureColor = '#4a4a4a'
    const textHeadingColor = '#d5c4aa'

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#111111'
    ctx.fillRect(0, 0, w, h)

    ctx.strokeStyle = '#181818'
    ctx.lineWidth = 1
    for (let i = 0; i < w; i += 25) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, h)
      ctx.moveTo(0, i)
      ctx.lineTo(w, i)
      ctx.stroke()
    }

    function drawThickWall(x1: number, y1: number, x2: number, y2: number, thickness = 5) {
      ctx.strokeStyle = wallColor
      ctx.lineWidth = thickness
      ctx.lineCap = 'square'
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()

      ctx.strokeStyle = '#111111'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    function drawDoorSwing(
      x: number,
      y: number,
      radius: number,
      startAngle: number,
      endAngle: number,
      counterClockwise: boolean,
    ) {
      ctx.strokeStyle = '#666666'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(x, y, radius, startAngle, endAngle, counterClockwise)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + Math.cos(endAngle) * radius, y + Math.sin(endAngle) * radius)
      ctx.stroke()
    }

    function drawRoomBorder(zone: RoomZone) {
      drawThickWall(zone.x, zone.y, zone.x + zone.width, zone.y, 4)
      drawThickWall(zone.x + zone.width, zone.y, zone.x + zone.width, zone.y + zone.height, 4)
      drawThickWall(zone.x + zone.width, zone.y + zone.height, zone.x, zone.y + zone.height, 4)
      drawThickWall(zone.x, zone.y + zone.height, zone.x, zone.y, 4)
    }

    function drawFurniture(zone: RoomZone) {
      const pad = 12
      const cx = zone.x + zone.width / 2
      const cy = zone.y + zone.height / 2
      const zw = zone.width
      const zh = zone.height

      ctx.strokeStyle = zone.kind === 'balcony' ? '#252525' : furnitureColor
      ctx.lineWidth = 1.2

      if (zone.kind === 'living') {
        ctx.strokeRect(zone.x + pad, zone.y + zh * 0.42, Math.min(54, zw * 0.32), Math.min(98, zh * 0.44))
        ctx.strokeRect(zone.x + pad + 42, zone.y + zh * 0.68, Math.min(58, zw * 0.34), 28)
        ctx.strokeRect(zone.x + zw - 18, zone.y + zh * 0.35, 8, Math.min(86, zh * 0.42))
        ctx.beginPath()
        ctx.arc(cx, cy + zh * 0.12, Math.min(18, zw * 0.1), 0, Math.PI * 2)
        ctx.stroke()
      }

      if (zone.kind === 'kitchen') {
        ctx.strokeRect(zone.x + pad, zone.y + pad, zw - pad * 2, Math.min(34, zh * 0.22))
        ctx.strokeRect(zone.x + pad, cy + 5, zw - pad * 2, Math.min(32, zh * 0.2))
        ctx.beginPath()
        ctx.arc(cx - 20, cy - 5, 5, 0, Math.PI * 2)
        ctx.arc(cx + 20, cy - 5, 5, 0, Math.PI * 2)
        ctx.stroke()
      }

      if (zone.kind === 'bedroom') {
        const bedW = Math.max(58, Math.min(92, zw - pad * 2))
        const bedH = Math.max(62, Math.min(104, zh - 54))
        const bedX = zone.x + (zw - bedW) / 2
        const bedY = zone.y + zh - bedH - pad
        ctx.strokeRect(bedX, bedY, bedW, bedH)
        ctx.strokeRect(bedX + 8, bedY + bedH - 30, bedW - 16, 22)
        ctx.strokeRect(bedX + 12, bedY + bedH - 25, (bedW - 32) / 2, 13)
        ctx.strokeRect(bedX + bedW / 2 + 4, bedY + bedH - 25, (bedW - 32) / 2, 13)
        ctx.strokeRect(zone.x + pad, zone.y + pad, zw - pad * 2, 26)
      }

      if (zone.kind === 'bathroom') {
        ctx.strokeRect(zone.x + pad, zone.y + pad, Math.min(30, zw * 0.3), zh - pad * 2)
        ctx.beginPath()
        ctx.ellipse(zone.x + zw - 36, zone.y + 38, Math.min(24, zw * 0.2), 14, 0, 0, Math.PI * 2)
        ctx.ellipse(zone.x + zw - 32, zone.y + zh - 34, 9, 11, 0, 0, Math.PI * 2)
        ctx.stroke()
      }

      if (zone.kind === 'balcony') {
        for (let x = zone.x + 8; x < zone.x + zw - 4; x += 14) {
          ctx.beginPath()
          ctx.moveTo(x, zone.y + 4)
          ctx.lineTo(x, zone.y + zh - 4)
          ctx.stroke()
        }
        ctx.strokeStyle = furnitureColor
        ctx.strokeRect(zone.x + 28, cy - 14, 28, 28)
        ctx.strokeRect(zone.x + zw - 60, cy - 14, 28, 28)
      }

      if (zone.kind === 'stairs') {
        for (let y = zone.y + 10; y < zone.y + zh - 8; y += 12) {
          ctx.beginPath()
          ctx.moveTo(zone.x + 7, y)
          ctx.lineTo(zone.x + zw - 7, y)
          ctx.stroke()
        }
      }
    }

    zones.forEach((zone) => {
      if (activeRoom === zone.room) {
        ctx.fillStyle = 'rgba(197, 168, 128, 0.12)'
        ctx.fillRect(zone.x, zone.y, zone.width, zone.height)
      } else if (hoveredRoom === zone.room) {
        ctx.fillStyle = 'rgba(223, 194, 141, 0.08)'
        ctx.fillRect(zone.x, zone.y, zone.width, zone.height)
      }
    })

    drawThickWall(25, 25, 475, 25)
    drawThickWall(475, 25, 475, 475)
    drawThickWall(475, 475, 25, 475)
    drawThickWall(25, 475, 25, 25)
    zones.forEach(drawRoomBorder)

    ctx.strokeStyle = '#2d3d4a'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(32, 25)
    ctx.lineTo(468, 25)
    ctx.stroke()

    zones.forEach((zone) => {
      if (zone.kind !== 'balcony' && zone.kind !== 'stairs') {
        drawDoorSwing(zone.x + 2, zone.y + Math.min(zone.height - 10, 52), 22, Math.PI * 1.5, Math.PI, true)
      }
      drawFurniture(zone)
    })

    ctx.fillStyle = textHeadingColor
    ctx.font = `bold 10px ${canvasSansFont}`
    ctx.textAlign = 'center'
    zones.forEach((zone) => {
      const translatedLabel = labelTranslation[lang]?.[zone.label] ?? zone.label
      ctx.fillText(translatedLabel, zone.x + zone.width / 2, zone.y + zone.height / 2)
    })

    ctx.fillStyle = '#555555'
    ctx.font = `8px ${canvasSansFont}`
    const footerLabel = lang === 'vi'
      ? `MẶT BẰNG ${variant.toUpperCase().replaceAll('-', ' ')} - TỶ LỆ 1:50`
      : `${variant.toUpperCase().replaceAll('-', ' ')} PLAN - SCALE 1:50`
    ctx.fillText(footerLabel, w / 2, h - 15)
  }, [activeRoom, hoveredRoom, variant, lang])

  const getCanvasPoint = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!onRoomChange) return

    const point = getCanvasPoint(event)
    setHoveredRoom(point ? getRoomAtPoint(point.x, point.y, planZones[variant]) ?? null : null)
  }

  const handleClick = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!onRoomChange) return

    const point = getCanvasPoint(event)
    const room = point ? getRoomAtPoint(point.x, point.y, planZones[variant]) : null
    if (room) onRoomChange(room)
  }

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      role={onRoomChange ? 'button' : 'img'}
      aria-label={lang === 'vi'
        ? "Mặt bằng căn hộ 2D, bấm vào từng phòng để xem ảnh tương ứng"
        : "2D Floor plan, click on each room to view its photo"
      }
      tabIndex={onRoomChange ? 0 : undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setHoveredRoom(null)}
      onPointerUp={handleClick}
      className={`h-full w-full object-cover opacity-90 transition-all duration-300 ${
        onRoomChange ? 'cursor-pointer' : ''
      }`}
    />
  )
}

export default FloorPlan
