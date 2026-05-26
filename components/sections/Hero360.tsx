'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import * as THREE from 'three'
import { usePathname, useRouter } from 'next/navigation'
import {
  ArrowRight,
  Building2,
  ChevronRight,
  Compass,
  Expand,
  Home,
  Map,
  Rotate3D,
  Sparkles,
  X,
} from 'lucide-react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'

import { FloorPlan } from '@/components/sections/FloorPlan'
import { RoomKey, LandingPageContent } from '@/types/landing'

interface HeroWrapperProps {
  content: LandingPageContent
  activeRoom: RoomKey
  onRoomChange: (room: RoomKey) => void
  onRegister: () => void
  onGallery: () => void
  dict: any
  lang: string
}

const roomImagePosition: Record<RoomKey, string> = {
  living: '50% 52%',
  bedroom: '42% 52%',
  kitchen: '58% 52%',
  bathroom: '46% 50%',
  balcony: '63% 50%',
}

const livingRoomImage = '/image/hero-living-cinematic.png'
const livingRoomTourImage = '/image/bg_living.png'
const bedroomTourImage = '/image/bg_ngu.png'
const kitchenTourImage = '/image/bg_bep.png'
const bathroomTourImage = '/image/bg_tam.png'
const balconyTourImage = '/image/bg_bancong.png'

const roomHeroImages: Record<RoomKey, string> = {
  living: livingRoomImage,
  bedroom: '/image/thumb_ngu_16x9_v2.png',
  kitchen: '/image/thumb_bep_16x9_v2.png',
  bathroom: '/image/thumb_tam_16x9_v2.png',
  balcony: '/image/thumb_bancong_16x9_v2.png',
}

const roomPreviewImages: Partial<Record<RoomKey, string>> = {
  bedroom: '/image/thumb_ngu_16x9_v2.png',
  kitchen: '/image/thumb_bep_16x9_v2.png',
  bathroom: '/image/thumb_tam_16x9_v2.png',
  balcony: '/image/thumb_bancong_16x9_v2.png',
}

const roomTourImages: Partial<Record<RoomKey, string>> = {
  living: livingRoomTourImage,
  bedroom: bedroomTourImage,
  kitchen: kitchenTourImage,
  bathroom: bathroomTourImage,
  balcony: balconyTourImage,
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

export function HeroWrapper({
  content,
  activeRoom,
  onRoomChange,
  onRegister,
  onGallery,
  dict,
  lang,
}: HeroWrapperProps) {
  const roomKeys = useMemo(() => Object.keys(content.roomConfigs) as RoomKey[], [content.roomConfigs])
  const [isTourOpen, setIsTourOpen] = useState(false)

  const roomAccent: Record<RoomKey, string> = {
    living: dict.ui.hero360.sunsetHall,
    bedroom: dict.ui.hero360.privateSpace,
    kitchen: dict.ui.hero360.delicateKitchen,
    bathroom: dict.ui.hero360.spaBathroom,
    balcony: dict.ui.hero360.riverfrontBalcony,
  }

  useEffect(() => {
    if (!isTourOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isTourOpen])

  return (
    <>
      {!isTourOpen && (
        <Navbar onRegister={onRegister} onTourOpen={() => setIsTourOpen(true)} dict={dict} lang={lang} />
      )}

      <section id="trang-chu" className="relative isolate min-h-[100svh] w-full overflow-hidden bg-[#080807] text-white">
        <HeroViewport activeRoom={activeRoom} />

        <div className="relative z-20 grid min-h-[100svh] w-full grid-rows-[1fr_auto] px-4 pb-4 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pb-7 lg:pt-28 xl:px-10">
          <motion.div
            className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.74fr)_minmax(230px,0.5fr)]"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroContent
              content={content}
              activeRoom={activeRoom}
              onGallery={onGallery}
              onRegister={onRegister}
              onTourOpen={() => setIsTourOpen(true)}
              dict={dict}
              lang={lang}
              roomAccent={roomAccent}
            />

            <FloatingCards
              content={content}
              activeRoom={activeRoom}
              onRoomChange={onRoomChange}
              onGallery={onGallery}
              dict={dict}
              lang={lang}
            />
          </motion.div>

          <ThumbnailNavigation
            rooms={roomKeys}
            activeRoom={activeRoom}
            content={content}
            onRoomChange={onRoomChange}
            roomAccent={roomAccent}
          />
        </div>

        <TourIndicator onOpen={() => setIsTourOpen(true)} dict={dict} />
      </section>

      <AnimatePresence>
        {isTourOpen && (
          <PanoramaModal
            rooms={roomKeys}
            activeRoom={activeRoom}
            content={content}
            onClose={() => setIsTourOpen(false)}
            onRoomChange={onRoomChange}
            dict={dict}
            lang={lang}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function Navbar({
  onRegister,
  onTourOpen,
  dict,
  lang,
}: {
  onRegister: () => void
  onTourOpen: () => void
  dict: any
  lang: string
}) {
  const pathname = usePathname()
  const router = useRouter()

  const switchLanguage = (newLang: string) => {
    if (lang === newLang) return
    const segments = pathname.split('/')
    segments[1] = newLang
    router.push(segments.join('/'))
  }

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-50 w-full border-b border-white/8 bg-gradient-to-b from-[#061010]/62 via-[#061010]/34 to-[#061010]/8 shadow-[0_14px_34px_rgba(0,0,0,0.16)] backdrop-blur-md"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex h-16 w-full items-center justify-between px-4 sm:h-20 sm:px-6 lg:h-24 lg:px-8 xl:px-10">
        <div className="relative h-16 w-28 shrink-0 sm:h-20 sm:w-32 lg:h-24 lg:w-40">
          <Image
            src="/image/logo.png"
            alt="Riverfront Residences"
            fill
            priority
            sizes="(min-width: 1024px) 240px, 176px"
            className="object-contain object-center"
          />
        </div>

        <nav className="hidden items-center gap-7 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/68 xl:gap-9 lg:flex">
          {[
            { label: dict.ui.navbar.home, href: `/${lang}` },
            { label: dict.ui.navbar.overview, href: '#tong-quan' },
            { label: dict.ui.navbar.location, href: '#vi-tri' },
            { label: dict.ui.navbar.amenities, href: '#tien-ich' },
            { label: dict.ui.navbar.apartments, href: '#can-ho' },
          ].map((item) => (
            <a key={item.label} href={item.href} className="transition-colors hover:text-[#d9bd8b]">
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={onTourOpen}
            className="text-[#d9bd8b] transition-colors hover:text-white"
          >
            {dict.ui.navbar.tour}
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-white/10 bg-black/48 px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] sm:px-2.5 sm:py-2">
            <button
              type="button"
              onClick={() => switchLanguage('vi')}
              className={`px-1.5 py-0.5 transition-colors duration-200 ${lang === 'vi' ? 'text-[#d9bd8b]' : 'text-white/50 hover:text-white'}`}
            >
              VI
            </button>
            <span className="text-white/20 select-none">|</span>
            <button
              type="button"
              onClick={() => switchLanguage('en')}
              className={`px-1.5 py-0.5 transition-colors duration-200 ${lang === 'en' ? 'text-[#d9bd8b]' : 'text-white/50 hover:text-white'}`}
            >
              EN
            </button>
          </div>

          <button
            type="button"
            onClick={onRegister}
            className="hidden border border-[#d9bd8b]/60 bg-black/30 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#e6c995] backdrop-blur-xl transition-colors hover:bg-[#d9bd8b] hover:text-black sm:block"
          >
            {dict.ui.navbar.cta}
          </button>
        </div>
      </div>
    </motion.header>
  )
}

function HeroViewport({ activeRoom }: { activeRoom: RoomKey }) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <PanoramaBackground activeRoom={activeRoom} />
      <OverlayGradient />
      <AmbientEffects />
    </div>
  )
}

function PanoramaBackground({ activeRoom }: { activeRoom: RoomKey }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const mouse = useMotionValue(0)
  const drift = useMotionValue(0)
  const smoothMouse = useSpring(mouse, { stiffness: 70, damping: 28, mass: 0.45 })
  const smoothDrift = useSpring(drift, { stiffness: 36, damping: 30, mass: 0.6 })
  const primaryX = useTransform([smoothMouse, smoothDrift], ([mx, dx]) => (mx as number) * 34 + (dx as number) * 16)
  const glowX = useTransform([smoothMouse, smoothDrift], ([mx, dx]) => (mx as number) * 42 + (dx as number) * 24)

  useEffect(() => {
    let frame = 0
    const started = performance.now()

    const tick = (now: number) => {
      const elapsed = (now - started) / 1000
      drift.set(Math.sin(elapsed * 0.12))
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [drift])

  const updateMouse = (clientX: number) => {
    const rect = viewportRef.current?.getBoundingClientRect()
    if (!rect) return
    const progress = (clientX - rect.left) / rect.width
    mouse.set(Math.max(-1, Math.min(1, (progress - 0.5) * -2)))
  }

  return (
    <div
      ref={viewportRef}
      className="absolute inset-0 overflow-hidden [perspective:1400px]"
      onPointerMove={(event) => updateMouse(event.clientX)}
      onPointerLeave={() => mouse.set(0)}
    >
      <motion.div
        className="absolute left-1/2 top-1/2 h-[108%] w-[178%] -translate-x-1/2 -translate-y-1/2 will-change-transform sm:w-[150%] md:w-[138%]"
        style={{ x: primaryX, transformStyle: 'preserve-3d' }}
        initial={false}
        animate={{ scale: activeRoom === 'balcony' ? 1.025 : 1 }}
        transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={roomHeroImages[activeRoom]}
          alt={`${activeRoom} hero preview`}
          fill
          priority
          sizes="140vw"
          className="object-cover"
          style={{ objectPosition: roomImagePosition[activeRoom] }}
        />
      </motion.div>

      <motion.div
        className="absolute top-[12%] h-[58%] w-[28%] -skew-x-12 bg-gradient-to-r from-transparent via-[#ffd49a]/16 to-transparent blur-2xl will-change-transform"
        style={{ x: glowX, left: '56%' }}
      />
    </div>
  )
}

function OverlayGradient() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_62%_38%,transparent_0%,rgba(0,0,0,0.22)_36%,rgba(0,0,0,0.82)_100%)] sm:bg-[radial-gradient(ellipse_at_62%_44%,transparent_0%,rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.78)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/48 via-black/24 to-black/82 sm:bg-gradient-to-r sm:from-black/78 sm:via-black/22 sm:to-black/18" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/68 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#070706] via-[#070706]/72 to-transparent" />
    </>
  )
}

function AmbientEffects() {
  const particles = [
    { left: '18%', top: '24%', delay: 0, size: 3 },
    { left: '72%', top: '18%', delay: 1.2, size: 2 },
    { left: '84%', top: '62%', delay: 2.1, size: 3 },
    { left: '48%', top: '74%', delay: 0.7, size: 2 },
    { left: '60%', top: '34%', delay: 1.7, size: 2 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute right-[10%] top-[18%] size-[34rem] rounded-full bg-[#d9bd8b]/10 blur-3xl" />
      <div className="absolute bottom-[8%] left-[28%] size-[26rem] rounded-full bg-[#8eb6c4]/10 blur-3xl" />
      {particles.map((particle) => (
        <motion.span
          key={`${particle.left}-${particle.top}`}
          className="absolute rounded-full bg-[#f8ddb1]/70 shadow-[0_0_18px_rgba(248,221,177,0.65)]"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={{ opacity: [0.15, 0.7, 0.15], y: [0, -18, 0] }}
          transition={{
            duration: 6,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

function HeroContent({
  content,
  activeRoom,
  onGallery,
  onRegister,
  onTourOpen,
  dict,
  lang,
  roomAccent,
}: {
  content: LandingPageContent
  activeRoom: RoomKey
  onGallery: () => void
  onRegister: () => void
  onTourOpen: () => void
  dict: any
  lang: string
  roomAccent: Record<RoomKey, string>
}) {
  const room = content.roomConfigs[activeRoom]

  return (
    <motion.div
      className="max-w-[38rem] pt-4 sm:pt-6 lg:pt-0 xl:max-w-[42rem]"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
      }}
      initial={false}
      animate="show"
    >
      <motion.div
        variants={fadeUp}
        className="mb-3 inline-flex items-center gap-2 border border-[#d9bd8b]/26 bg-black/24 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.18em] text-[#e3c38d] backdrop-blur-xl sm:mb-4 sm:gap-2.5 sm:px-3.5 sm:py-2 sm:text-[9px] sm:tracking-[0.2em]"
      >
        <Sparkles className="size-3.5" />
        {roomAccent[activeRoom]}
      </motion.div>

      <motion.h1
        variants={fadeUp}
        className="max-w-[11ch] text-balance font-sans text-[2.45rem] font-semibold uppercase leading-[1.08] tracking-normal text-white min-[390px]:text-5xl sm:max-w-[12ch] sm:text-5xl sm:leading-[1.12] lg:text-6xl lg:leading-[1.1] xl:text-[4.25rem]"
      >
        {content.hero.headline}
        <span className="mt-3 block font-serif text-[0.78em] font-medium normal-case italic leading-[1.16] text-[#dfc28d] sm:mt-4">
          {content.hero.highlightText}
        </span>
      </motion.h1>

      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={activeRoom}
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-lg text-sm font-light leading-6 text-white/74 sm:mt-5 sm:text-[15px] sm:leading-7"
        >
          {room.desc}
        </motion.p>
      </AnimatePresence>

      <motion.div variants={fadeUp} className="mt-5 grid grid-cols-1 gap-2.5 min-[390px]:grid-cols-2 sm:mt-7 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
        <button
          type="button"
          onClick={onGallery}
          className="inline-flex min-h-12 items-center justify-center gap-3 bg-[#dfc28d] px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-black transition-colors hover:bg-white sm:px-5 sm:py-3.5 sm:tracking-[0.16em]"
        >
          {content.hero.ctaText}
          <ArrowRight className="size-4" />
        </button>
        <button
          type="button"
          onClick={onRegister}
          className="inline-flex min-h-12 items-center justify-center gap-3 border border-white/18 bg-black/24 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/82 backdrop-blur-xl transition-colors hover:border-white/38 hover:text-white sm:hidden"
        >
            {dict.ui.navbar.cta}
        </button>
        <button
          type="button"
          onClick={onTourOpen}
          className="inline-flex min-h-12 items-center justify-center gap-3 border border-[#dfc28d]/42 bg-black/34 px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-[#f0d6a2] shadow-[0_0_24px_rgba(223,194,141,0.12)] backdrop-blur-xl transition-all hover:border-[#dfc28d] hover:bg-[#dfc28d]/12 hover:shadow-[0_0_34px_rgba(223,194,141,0.24)] min-[390px]:col-span-2 sm:px-5 sm:py-3.5 sm:tracking-[0.16em]"
        >
          <Rotate3D className="size-4" />
          {dict.ui.hero360.cta360}
        </button>
      </motion.div>
    </motion.div>
  )
}

function FloatingCards({
  content,
  activeRoom,
  onRoomChange,
  onGallery,
  dict,
  lang,
}: {
  content: LandingPageContent
  activeRoom: RoomKey
  onRoomChange: (room: RoomKey) => void
  onGallery: () => void
  dict: any
  lang: string
}) {
  return (
    <motion.aside
      className="hidden justify-self-end lg:block"
      initial={false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
    >
      <div className="w-[292px] border border-white/12 bg-black/36 p-4 shadow-2xl backdrop-blur-2xl xl:w-[300px]">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/62">
            {dict.ui.hero360.floorPlan}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#d9bd8b]">
            <Map className="size-3.5" />
            2D
          </span>
        </div>

        <div className="relative mt-4 aspect-square overflow-hidden border border-white/8 bg-[#11100d]">
          <FloorPlan activeRoom={activeRoom} onRoomChange={onRoomChange} lang={lang} />
          <span className="absolute bottom-3 right-3 bg-black/74 px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-white/56">
            GP-18.06
          </span>
        </div>

        <button
          type="button"
          onClick={onGallery}
          className="mt-4 flex w-full items-center justify-between border border-[#d9bd8b]/28 bg-[#d9bd8b]/10 px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-[#e2c58e] transition-colors hover:bg-[#d9bd8b]/18"
        >
          {dict.ui.hero360.viewGallery}
          <ChevronRight className="size-4" />
        </button>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {content.stats.slice(0, 2).map((stat) => (
            <div key={stat.label} className="border border-white/8 bg-white/[0.04] p-3">
              <p className="font-serif text-xl text-[#e2c58e]">{stat.value}</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.aside>
  )
}

function TourIndicator({ onOpen, dict }: { onOpen: () => void; dict: any }) {
  const isTourMode = false

  return (
    <motion.div
      className="absolute bottom-16 right-10 z-30 hidden md:block"
      initial={false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.7 }}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={isTourMode ? dict.ui.hero360.indicatorGoHome : dict.ui.hero360.indicatorTour}
        className={`relative grid size-16 place-items-center rounded-full border backdrop-blur-md transition-colors ${
          isTourMode
            ? 'border-white/55 bg-white/10 text-white hover:bg-white/18'
            : 'border-white/18 bg-black/18 text-[#efd5a4] hover:border-[#efd5a4]/55'
        }`}
      >
        <motion.span
          className={`absolute inset-0 rounded-full border ${
            isTourMode ? 'border-white/35' : 'border-[#efd5a4]/35'
          }`}
          animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {isTourMode ? <Home className="size-4" /> : <Expand className="size-4" />}
        <span className="absolute -bottom-6 whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.18em] text-white/62">
          {isTourMode ? dict.ui.hero360.indicatorGoHome : dict.ui.hero360.indicatorTour}
        </span>
      </button>
    </motion.div>
  )
}

function PanoramaModal({
  rooms,
  activeRoom,
  content,
  onClose,
  onRoomChange,
  dict,
  lang,
}: {
  rooms: RoomKey[]
  activeRoom: RoomKey
  content: LandingPageContent
  onClose: () => void
  onRoomChange: (room: RoomKey) => void
  dict: any
  lang: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const isScrollbarDragging = useRef(false)

  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrollWidthRatio, setScrollWidthRatio] = useState(0.2)
  const [showScrollbar, setShowScrollbar] = useState(false)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const updateRatio = () => {
      const { clientWidth, scrollWidth } = container
      if (scrollWidth > clientWidth) {
        setScrollWidthRatio(clientWidth / scrollWidth)
        setShowScrollbar(true)
      } else {
        setShowScrollbar(false)
      }
    }

    updateRatio()
    window.addEventListener('resize', updateRatio)
    return () => window.removeEventListener('resize', updateRatio)
  }, [rooms])

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollRef.current
    if (!container || isScrollbarDragging.current) return

    isDragging.current = false
    startX.current = e.clientX
    scrollLeft.current = container.scrollLeft

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const x = moveEvent.clientX
      const walk = (x - startX.current) * 1.5
      if (Math.abs(walk) > 5) {
        isDragging.current = true
      }
      container.scrollLeft = scrollLeft.current - walk
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      setTimeout(() => {
        isDragging.current = false
      }, 50)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const syncScrollFromTrack = (clientX: number, track: HTMLDivElement) => {
    const container = scrollRef.current
    if (!container) return

    const rect = track.getBoundingClientRect()
    const thumbWidth = rect.width * scrollWidthRatio
    const usableWidth = Math.max(rect.width - thumbWidth, 1)
    const thumbLeft = Math.max(0, Math.min(usableWidth, clientX - rect.left - thumbWidth / 2))
    const maxScrollLeft = container.scrollWidth - container.clientWidth

    container.scrollLeft = (thumbLeft / usableWidth) * maxScrollLeft
  }

  const handleScrollbarPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const track = e.currentTarget
    isScrollbarDragging.current = true
    syncScrollFromTrack(e.clientX, track)
    track.setPointerCapture(e.pointerId)

    const handlePointerMove = (moveEvent: PointerEvent) => {
      syncScrollFromTrack(moveEvent.clientX, track)
    }

    const handlePointerUp = () => {
      isScrollbarDragging.current = false
      track.removeEventListener('pointermove', handlePointerMove)
      track.removeEventListener('pointerup', handlePointerUp)
      track.removeEventListener('pointercancel', handlePointerUp)
      if (track.hasPointerCapture(e.pointerId)) {
        track.releasePointerCapture(e.pointerId)
      }
    }

    track.addEventListener('pointermove', handlePointerMove)
    track.addEventListener('pointerup', handlePointerUp)
    track.addEventListener('pointercancel', handlePointerUp)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-hidden bg-[#030711] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.04, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.02, opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <ThreePanoramaViewer
          imageSrc={roomTourImages[activeRoom] ?? livingRoomTourImage}
          roomKey={activeRoom}
          loadingText={dict.ui.panorama.loading}
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,7,17,0.08)_48%,rgba(3,7,17,0.66)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#030711]/85 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#030711]/92 via-[#030711]/48 to-transparent" />

      <div className="pointer-events-none absolute left-4 right-4 top-4 z-10 flex items-start justify-between gap-4 sm:left-8 sm:right-8 sm:top-7">
        <motion.div
          className="max-w-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#dfc28d]">
            {dict.ui.panorama.tag}
          </p>
          <h2 className="mt-2 font-serif text-2xl font-medium text-white sm:text-4xl">
            {dict.ui.panorama.title}
          </h2>
          <p className="mt-2 inline-flex items-center gap-2 border border-white/12 bg-white/[0.06] px-3 py-2 text-xs font-medium text-white/72 backdrop-blur-xl">
            <Rotate3D className="size-4 text-[#dfc28d]" />
            {dict.ui.panorama.dragTip}
          </p>
        </motion.div>
      </div>

      <motion.div
        className="absolute right-4 top-4 z-30 pointer-events-auto flex h-12 flex-col items-center justify-center sm:bottom-8 sm:right-10 sm:top-auto sm:h-[112px]"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.45, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            aria-label={dict.ui.panorama.closeLabel}
            className="relative grid size-11 place-items-center rounded-full border border-white/18 bg-black/38 text-[#dfc28d] backdrop-blur-md transition-colors hover:border-[#dfc28d]/55 hover:bg-black/50 sm:size-16 sm:bg-black/24"
          >
            <motion.span
              className="absolute inset-0 rounded-full border border-[#dfc28d]/35"
              animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <X className="size-5" />
          </button>
          <span className="hidden text-center text-[8px] font-bold uppercase tracking-[0.18em] text-white/62 sm:block sm:whitespace-nowrap">
            {dict.ui.panorama.exitLabel}
          </span>
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-x-3 bottom-4 z-10 mx-auto max-w-5xl overflow-hidden border border-white/14 bg-black/30 p-2 shadow-2xl backdrop-blur-2xl sm:inset-x-4 sm:bottom-8"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.45, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onScroll={(e) => {
            const container = e.currentTarget
            const scrollWidth = container.scrollWidth
            const clientWidth = container.clientWidth
            const scrollLeft = container.scrollLeft
            if (scrollWidth > clientWidth) {
              setScrollProgress(scrollLeft / (scrollWidth - clientWidth))
            }
          }}
          className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing select-none"
        >
          {rooms.map((room) => {
            const isActive = room === activeRoom
            const config = content.roomConfigs[room]

            return (
              <button
                key={room}
                type="button"
                onClick={() => {
                  if (isDragging.current) return
                  onRoomChange(room)
                }}
                className={`group relative h-16 min-w-36 overflow-hidden border text-left transition-all sm:h-24 sm:min-w-52 ${
                  isActive
                    ? 'border-[#dfc28d] bg-[#dfc28d]/12 shadow-[0_0_24px_rgba(223,194,141,0.16)]'
                    : 'border-white/14 bg-white/[0.04] hover:border-white/42'
                }`}
              >
                <Image
                  src={roomPreviewImages[room] ?? livingRoomImage}
                  alt={`${config.name} preview`}
                  fill
                  sizes="220px"
                  draggable={false}
                  className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                  style={{ objectPosition: roomImagePosition[room] }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/44 to-transparent pointer-events-none" />
                <div className="absolute inset-0 flex items-center gap-3 px-3 pointer-events-none">
                  <span
                    className={`grid size-8 place-items-center border ${
                      isActive ? 'border-[#dfc28d] text-[#dfc28d]' : 'border-white/24 text-white/70'
                    }`}
                  >
                    <Compass className="size-4" />
                  </span>
                  <span>
                    <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-white/48">
                      {dict.ui.navbar.tour}
                    </span>
                    <span className="mt-1 block text-sm font-semibold text-white">{config.name}</span>
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Custom Premium Scrollbar Track & Thumb */}
        {showScrollbar && (
          <div
            className="relative mt-3 h-4 w-full cursor-pointer touch-none"
            onPointerDown={handleScrollbarPointerDown}
          >
            <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-white/10" />
            <div 
              className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#dfc28d] shadow-[0_0_14px_rgba(223,194,141,0.45)] transition-[left] duration-75"
              style={{ 
                width: `${scrollWidthRatio * 100}%`,
                left: `${scrollProgress * (1 - scrollWidthRatio) * 100}%`
              }}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function ThreePanoramaViewer({
  imageSrc,
  roomKey,
  loadingText,
}: {
  imageSrc: string
  roomKey: RoomKey
  loadingText: string
}) {
  const mountRef = useRef<HTMLDivElement>(null)
  const joystickRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPointerLocked, setIsPointerLocked] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    const joystick = joystickRef.current
    const knob = knobRef.current
    if (!mount) return

    setIsLoaded(false)

    const renderer = new THREE.WebGLRenderer({
      antialias: window.devicePixelRatio <= 1.5,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.className = 'h-full w-full cursor-grab active:cursor-grabbing touch-none'
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(96, mount.clientWidth / mount.clientHeight, 0.01, 1200)

    const geometry = new THREE.SphereGeometry(500, 80, 48)
    geometry.scale(-1, 1, 1)

    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
    })
    const sphere = new THREE.Mesh(geometry, material)
    sphere.position.set(0, 0, 0)
    scene.add(sphere)

    let animationFrame = 0
    let texture: THREE.Texture | null = null
    let lastTime = performance.now()
    let fadeOpacity = 0

    // ===== FIRST-PERSON MOVEMENT TUNING =====
    // Chỉnh tốc độ đi bộ tại đây để thay đổi cảm giác walkthrough.
    const MOVE_SPEED = 1.85
    const LOOK_SENSITIVITY = 0.0022
    const TOUCH_LOOK_SENSITIVITY = 0.0048
    const ACCELERATION = 9.5
    const FRICTION = 8.2
    const HEAD_BOB_SPEED = 8.5
    const HEAD_BOB_AMOUNT = 0.035
    const EYE_HEIGHT = 1.62
    // ========================================

    const roomYaw: Record<RoomKey, number> = {
      living: 0,
      bedroom: -0.18,
      kitchen: -0.72,
      bathroom: 0.76,
      balcony: 0.42,
    }

    const collisionBounds: Record<RoomKey, { radiusX: number; radiusZ: number }> = {
      living: { radiusX: 2.25, radiusZ: 1.45 },
      bedroom: { radiusX: 1.75, radiusZ: 1.22 },
      kitchen: { radiusX: 1.55, radiusZ: 1.08 },
      bathroom: { radiusX: 1.05, radiusZ: 0.9 },
      balcony: { radiusX: 2.0, radiusZ: 0.78 },
    }

    const bounds = collisionBounds[roomKey]
    const position = new THREE.Vector3(0, EYE_HEIGHT, 0)
    const velocity = new THREE.Vector3()
    const desiredVelocity = new THREE.Vector3()
    const forward = new THREE.Vector3()
    const right = new THREE.Vector3()
    const euler = new THREE.Euler(0, roomYaw[roomKey] ?? 0, 0, 'YXZ')
    const keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    }

    let targetYaw = euler.y
    let targetPitch = -0.03
    let yaw = targetYaw
    let pitch = targetPitch
    let isTouchLooking = false
    let touchLookId: number | null = null
    let touchLookX = 0
    let touchLookY = 0
    let joystickId: number | null = null
    let joystickVector = { x: 0, y: 0 }
    let bobTime = 0
    let isMoving = false

    const clampToRoom = (next: THREE.Vector3) => {
      const normalized =
        (next.x * next.x) / (bounds.radiusX * bounds.radiusX) +
        (next.z * next.z) / (bounds.radiusZ * bounds.radiusZ)

      if (normalized <= 1) return next

      const angle = Math.atan2(next.z / bounds.radiusZ, next.x / bounds.radiusX)
      next.x = Math.cos(angle) * bounds.radiusX * 0.985
      next.z = Math.sin(angle) * bounds.radiusZ * 0.985
      velocity.multiplyScalar(0.2)
      return next
    }

    const updateJoystickVisual = () => {
      if (!knob) return
      knob.style.transform = `translate(${joystickVector.x * 34}px, ${joystickVector.y * 34}px)`
    }

    const resetJoystick = () => {
      joystickId = null
      joystickVector = { x: 0, y: 0 }
      updateJoystickVisual()
    }

    const updateCamera = (delta: number) => {
      yaw += (targetYaw - yaw) * Math.min(1, delta * 16)
      pitch += (targetPitch - pitch) * Math.min(1, delta * 16)
      pitch = THREE.MathUtils.clamp(pitch, -1.28, 1.28)

      forward.set(Math.sin(yaw), 0, Math.cos(yaw)).normalize()
      right.set(Math.cos(yaw), 0, -Math.sin(yaw)).normalize()

      const inputX = (keys.right ? 1 : 0) - (keys.left ? 1 : 0) + joystickVector.x
      const inputZ = (keys.forward ? 1 : 0) - (keys.backward ? 1 : 0) - joystickVector.y
      const inputLength = Math.hypot(inputX, inputZ)
      isMoving = inputLength > 0.03

      desiredVelocity.set(0, 0, 0)

      if (isMoving) {
        const normalizedX = inputX / Math.max(inputLength, 1)
        const normalizedZ = inputZ / Math.max(inputLength, 1)
        desiredVelocity
          .addScaledVector(right, normalizedX * MOVE_SPEED)
          .addScaledVector(forward, normalizedZ * MOVE_SPEED)
      }

      const smoothing = isMoving ? ACCELERATION : FRICTION
      velocity.lerp(desiredVelocity, 1 - Math.exp(-smoothing * delta))

      const nextPosition = position.clone().addScaledVector(velocity, delta)
      clampToRoom(nextPosition)
      position.copy(nextPosition)

      if (isMoving && velocity.lengthSq() > 0.02) {
        bobTime += delta * HEAD_BOB_SPEED
      } else {
        bobTime += delta * 3
      }

      const bob = isMoving ? Math.sin(bobTime) * HEAD_BOB_AMOUNT * Math.min(velocity.length() / MOVE_SPEED, 1) : 0
      camera.position.set(position.x, EYE_HEIGHT + bob, position.z)
      euler.set(pitch, yaw, Math.sin(bobTime * 0.5) * HEAD_BOB_AMOUNT * 0.22, 'YXZ')
      camera.quaternion.setFromEuler(euler)
    }

    const animate = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      if (fadeOpacity < 1) {
        fadeOpacity = Math.min(1, fadeOpacity + delta * 2.2)
        material.opacity = fadeOpacity
      }

      updateCamera(delta)
      renderer.render(scene, camera)
      animationFrame = requestAnimationFrame(animate)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      if (event.code === 'KeyW' || event.code === 'ArrowUp') keys.forward = true
      if (event.code === 'KeyS' || event.code === 'ArrowDown') keys.backward = true
      if (event.code === 'KeyA' || event.code === 'ArrowLeft') keys.left = true
      if (event.code === 'KeyD' || event.code === 'ArrowRight') keys.right = true
    }

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'KeyW' || event.code === 'ArrowUp') keys.forward = false
      if (event.code === 'KeyS' || event.code === 'ArrowDown') keys.backward = false
      if (event.code === 'KeyA' || event.code === 'ArrowLeft') keys.left = false
      if (event.code === 'KeyD' || event.code === 'ArrowRight') keys.right = false
    }

    const onMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement !== renderer.domElement) return
      targetYaw -= event.movementX * LOOK_SENSITIVITY
      targetPitch -= event.movementY * LOOK_SENSITIVITY
      targetPitch = THREE.MathUtils.clamp(targetPitch, -1.28, 1.28)
    }

    const onPointerLockChange = () => {
      setIsPointerLocked(document.pointerLockElement === renderer.domElement)
    }

    const onCanvasPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') {
        renderer.domElement.requestPointerLock?.()
        return
      }

      isTouchLooking = true
      touchLookId = event.pointerId
      touchLookX = event.clientX
      touchLookY = event.clientY
      renderer.domElement.setPointerCapture(event.pointerId)
    }

    const onCanvasPointerMove = (event: PointerEvent) => {
      if (!isTouchLooking || touchLookId !== event.pointerId) return
      const dx = event.clientX - touchLookX
      const dy = event.clientY - touchLookY
      touchLookX = event.clientX
      touchLookY = event.clientY

      targetYaw -= dx * TOUCH_LOOK_SENSITIVITY
      targetPitch -= dy * TOUCH_LOOK_SENSITIVITY
      targetPitch = THREE.MathUtils.clamp(targetPitch, -1.28, 1.28)
    }

    const endCanvasPointer = (event: PointerEvent) => {
      if (touchLookId !== event.pointerId) return
      isTouchLooking = false
      touchLookId = null
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId)
      }
    }

    const onJoystickPointerDown = (event: PointerEvent) => {
      if (!joystick) return
      event.preventDefault()
      event.stopPropagation()
      joystickId = event.pointerId
      joystick.setPointerCapture(event.pointerId)

      const moveJoystick = (clientX: number, clientY: number) => {
        const rect = joystick.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const dx = clientX - centerX
        const dy = clientY - centerY
        const distance = Math.min(Math.hypot(dx, dy), 42)
        const angle = Math.atan2(dy, dx)

        joystickVector = {
          x: Math.cos(angle) * (distance / 42),
          y: Math.sin(angle) * (distance / 42),
        }
        updateJoystickVisual()
      }

      moveJoystick(event.clientX, event.clientY)
    }

    const onJoystickPointerMove = (event: PointerEvent) => {
      if (!joystick || joystickId !== event.pointerId) return
      event.preventDefault()

      const rect = joystick.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = event.clientX - centerX
      const dy = event.clientY - centerY
      const distance = Math.min(Math.hypot(dx, dy), 42)
      const angle = Math.atan2(dy, dx)

      joystickVector = {
        x: Math.cos(angle) * (distance / 42),
        y: Math.sin(angle) * (distance / 42),
      }
      updateJoystickVisual()
    }

    const onJoystickPointerUp = (event: PointerEvent) => {
      if (!joystick || joystickId !== event.pointerId) return
      event.preventDefault()
      if (joystick.hasPointerCapture(event.pointerId)) {
        joystick.releasePointerCapture(event.pointerId)
      }
      resetJoystick()
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      camera.fov = Math.max(72, Math.min(104, camera.fov + event.deltaY * 0.018))
      camera.updateProjectionMatrix()
    }

    const onResize = () => {
      const width = mount.clientWidth
      const height = mount.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    renderer.domElement.addEventListener('pointerdown', onCanvasPointerDown)
    renderer.domElement.addEventListener('pointermove', onCanvasPointerMove)
    renderer.domElement.addEventListener('pointerup', endCanvasPointer)
    renderer.domElement.addEventListener('pointercancel', endCanvasPointer)
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false })
    joystick?.addEventListener('pointerdown', onJoystickPointerDown)
    joystick?.addEventListener('pointermove', onJoystickPointerMove)
    joystick?.addEventListener('pointerup', onJoystickPointerUp)
    joystick?.addEventListener('pointercancel', onJoystickPointerUp)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('pointerlockchange', onPointerLockChange)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('resize', onResize)

    new THREE.TextureLoader().load(imageSrc, (loadedTexture) => {
      texture = loadedTexture
      texture.colorSpace = THREE.SRGBColorSpace
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.generateMipmaps = false
      material.map = texture
      material.needsUpdate = true
      setIsLoaded(true)
    })

    animationFrame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrame)
      if (document.pointerLockElement === renderer.domElement) {
        document.exitPointerLock()
      }
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      renderer.domElement.removeEventListener('pointerdown', onCanvasPointerDown)
      renderer.domElement.removeEventListener('pointermove', onCanvasPointerMove)
      renderer.domElement.removeEventListener('pointerup', endCanvasPointer)
      renderer.domElement.removeEventListener('pointercancel', endCanvasPointer)
      renderer.domElement.removeEventListener('wheel', onWheel)
      joystick?.removeEventListener('pointerdown', onJoystickPointerDown)
      joystick?.removeEventListener('pointermove', onJoystickPointerMove)
      joystick?.removeEventListener('pointerup', onJoystickPointerUp)
      joystick?.removeEventListener('pointercancel', onJoystickPointerUp)
      texture?.dispose()
      material.dispose()
      geometry.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [imageSrc, roomKey])

  return (
    <div className="relative h-full w-full bg-[#030711]" ref={mountRef}>
      <div className="pointer-events-none absolute left-4 top-32 z-10 hidden border border-white/12 bg-black/30 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white/62 backdrop-blur-xl md:block">
        {isPointerLocked ? 'WASD di chuyển · Chuột nhìn xung quanh · ESC thoát' : 'Click để vào first-person · WASD + chuột'}
      </div>

      <div
        ref={joystickRef}
        className="absolute bottom-28 left-5 z-20 grid size-24 touch-none place-items-center rounded-full border border-white/16 bg-black/28 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl md:hidden"
        aria-label="Virtual movement joystick"
      >
        <div className="absolute inset-3 rounded-full border border-[#dfc28d]/18" />
        <div
          ref={knobRef}
          className="size-10 rounded-full border border-[#dfc28d]/55 bg-[#dfc28d]/24 shadow-[0_0_26px_rgba(223,194,141,0.28)] transition-transform duration-75"
        />
      </div>

      <div className="pointer-events-none absolute bottom-28 right-5 z-20 max-w-[11rem] border border-white/12 bg-black/28 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.16em] text-white/60 backdrop-blur-xl md:hidden">
        Drag phải/trái để nhìn · joystick để di chuyển
      </div>

      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="absolute inset-0 z-30 grid place-items-center bg-[#030711]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="border border-[#dfc28d]/30 bg-black/32 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#dfc28d] backdrop-blur-xl">
              {loadingText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ThumbnailNavigation({
  rooms,
  activeRoom,
  content,
  onRoomChange,
  roomAccent,
}: {
  rooms: RoomKey[]
  activeRoom: RoomKey
  content: LandingPageContent
  onRoomChange: (room: RoomKey) => void
  roomAccent: Record<RoomKey, string>
}) {
  const isTourMode = false
  const scrollRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollRef.current
    if (!container) return

    isDragging.current = false
    startX.current = e.clientX
    scrollLeft.current = container.scrollLeft

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const x = moveEvent.clientX
      const walk = (x - startX.current) * 1.5
      if (Math.abs(walk) > 5) {
        isDragging.current = true
      }
      container.scrollLeft = scrollLeft.current - walk
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      setTimeout(() => {
        isDragging.current = false
      }, 50)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      className={`pointer-events-auto relative z-20 -mx-4 flex justify-start overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 md:justify-center lg:mx-0 lg:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing select-none ${
        isTourMode ? 'mt-0' : 'mt-6'
      }`}
    >
      <div className="flex min-w-max gap-3">
        {rooms.map((room) => {
          const isActive = room === activeRoom
          const config = content.roomConfigs[room]

          return (
            <button
              key={room}
              type="button"
              onClick={() => {
                if (isDragging.current) return
                onRoomChange(room)
              }}
              className={`group relative h-[4.5rem] w-[10.5rem] shrink-0 overflow-hidden border text-left transition-colors sm:h-24 sm:w-60 ${
                isActive
                  ? isTourMode
                    ? 'border-white bg-white/10'
                    : 'border-[#dfc28d] bg-[#dfc28d]/12'
                  : isTourMode
                    ? 'border-white/38 bg-black/24 hover:border-white/70'
                    : 'border-white/10 bg-black/34 hover:border-white/32'
              }`}
            >
              <Image
                src={roomPreviewImages[room] ?? livingRoomImage}
                alt={`${config.name} preview`}
                fill
                sizes="260px"
                draggable={false}
                className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                style={{ objectPosition: roomImagePosition[room] }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/42 to-transparent pointer-events-none" />
              <div className="pointer-events-none absolute inset-0 flex items-center gap-2.5 px-3 sm:gap-3 sm:px-4">
                <span
                    className={`grid size-8 shrink-0 place-items-center border sm:size-9 ${
                    isActive
                      ? isTourMode
                        ? 'border-white text-white'
                        : 'border-[#dfc28d] text-[#dfc28d]'
                      : isTourMode
                        ? 'border-white/40 text-white/74'
                        : 'border-white/20 text-white/64'
                  }`}
                >
                  {room === 'living' ? <Compass className="size-4" /> : <Building2 className="size-4" />}
                </span>
                  <span className="min-w-0">
                  <span className="block truncate text-[8px] font-bold uppercase tracking-[0.16em] text-white/48 sm:text-[10px] sm:tracking-[0.2em]">
                    {roomAccent[room]}
                  </span>
                  <span className="mt-1 block truncate text-xs font-semibold text-white sm:text-sm">{config.name}</span>
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
