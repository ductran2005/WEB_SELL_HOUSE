'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  Clock3,
  DoorOpen,
  MapPin,
  Phone,
  ShieldCheck,
  Sofa,
  Trees,
  Utensils,
  Waves,
} from 'lucide-react'

import { FloorPlan } from '@/components/sections/FloorPlan'
import { LandingPageContent, RoomKey } from '@/types/landing'

interface LowerLandingSectionsProps {
  content: LandingPageContent
  activeRoom: RoomKey
  onRoomChange: (room: RoomKey) => void
  onRegister: () => void
  dict: any
  lang: string
}

const tourSpaces: Array<{
  room: RoomKey
  image: string
}> = [
  {
    room: 'living',
    image: '/image/hero-living-cinematic.png',
  },
  {
    room: 'kitchen',
    image: '/image/thumb_bep_16x9_v2.png',
  },
  {
    room: 'bedroom',
    image: '/image/thumb_ngu_16x9_v2.png',
  },
  {
    room: 'balcony',
    image: '/image/thumb_bancong_16x9_v2.png',
  },
  {
    room: 'bathroom',
    image: '/image/thumb_tam_16x9_v2.png',
  },
]

const roomIcons: Record<RoomKey, typeof Sofa> = {
  living: Sofa,
  bedroom: BedDouble,
  kitchen: Utensils,
  bathroom: Bath,
  balcony: DoorOpen,
}

export function LowerLandingSections({
  content,
  activeRoom,
  onRoomChange,
  onRegister,
  dict,
  lang,
}: LowerLandingSectionsProps) {
  return (
    <div className="bg-[#f6f1e8] text-[#15130f]">
      <ProjectOverview content={content} onRegister={onRegister} dict={dict} />
      <Location dict={dict} />
      <SpaceTour content={content} activeRoom={activeRoom} onRoomChange={onRoomChange} dict={dict} />
      <PlanSelection dict={dict} lang={lang} />
      <Advantages dict={dict} />
      <UpdatesAndContact onRegister={onRegister} dict={dict} />
      <SiteFooter dict={dict} />
    </div>
  )
}

function ProjectOverview({
  content,
  onRegister,
  dict,
}: {
  content: LandingPageContent
  onRegister: () => void
  dict: any
}) {
  return (
    <section id="tong-quan" className="scroll-mt-12 px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#a87832]">
            {dict.ui.overview.sectionTag}
          </p>
          <h2 className="mt-3 max-w-xl font-serif text-[2rem] font-semibold leading-tight text-[#17130e] sm:text-5xl">
            {dict.brandName} {dict.logoText}
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#62594c]">
            {dict.ui.overview.copy}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4">
            {content.stats.map((stat) => (
              <div key={stat.label} className="border border-[#d8c5a6] bg-white/55 p-3 sm:p-4">
                <p className="font-sans text-xl font-semibold text-[#a87832] sm:text-2xl">{stat.value}</p>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#746957] sm:text-[10px] sm:tracking-[0.16em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onRegister}
              className="group inline-flex min-h-13 items-center justify-center gap-3 bg-[#17130e] px-5 text-[10px] font-black uppercase tracking-[0.14em] text-[#f6dfb1] shadow-[0_18px_38px_rgba(75,48,18,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#a87832] hover:text-white hover:shadow-[0_22px_46px_rgba(75,48,18,0.24)] sm:min-h-14 sm:gap-4 sm:px-6 sm:tracking-[0.16em]"
            >
              {dict.ui.overview.ctaPrice}
              <span className="grid size-7 place-items-center border border-[#f6dfb1]/24 bg-white/5 transition-colors group-hover:border-white/34 group-hover:bg-white/12">
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
            <p className="max-w-52 text-xs leading-5 text-[#7c6f5f]">
              {dict.ui.overview.ctaDesc}
            </p>
          </div>
        </div>

          <div className="relative overflow-hidden bg-[#0d1518] shadow-2xl">
            <div className="relative aspect-[4/5] sm:aspect-[16/10]">
            <Image
              src="/image/bg_bancong.png"
              alt="Toàn cảnh căn hộ ven sông Riverfront Residences"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3 text-white sm:bottom-5 sm:left-5 sm:right-5 sm:gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4d59a]">
                  {dict.ui.overview.viewSgRiver}
                </p>
                <p className="mt-2 max-w-md text-sm text-white/78">
                  {dict.ui.overview.viewDesc}
                </p>
              </div>
              <span className="border border-white/20 bg-black/38 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] backdrop-blur-xl">
                {dict.ui.overview.ready360}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Location({ dict }: { dict: any }) {
  return (
    <section id="vi-tri" className="scroll-mt-12 bg-[#0b1515] px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#d9bd8b]">
              {dict.ui.location.sectionTag}
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl text-white">
              {dict.ui.location.title}
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/70">
              {dict.ui.location.desc}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-[#d9bd8b]/40">
                <p className="font-serif text-3xl text-[#d9bd8b]">{dict.ui.location.times["5mins"]}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                  {dict.ui.location.thuthieu}
                </p>
                <p className="mt-1 text-xs text-white/60">{dict.ui.location.thuthieuDesc}</p>
              </div>

              <div className="border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-[#d9bd8b]/40">
                <p className="font-serif text-3xl text-[#d9bd8b]">{dict.ui.location.times["10mins"]}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                  {dict.ui.location.q1}
                </p>
                <p className="mt-1 text-xs text-white/60">{dict.ui.location.q1Desc}</p>
              </div>

              <div className="border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-[#d9bd8b]/40">
                <p className="font-serif text-3xl text-[#d9bd8b]">{dict.ui.location.times["15mins"]}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                  {dict.ui.location.binhthanh}
                </p>
                <p className="mt-1 text-xs text-white/60">{dict.ui.location.binhthanhDesc}</p>
              </div>

              <div className="border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-[#d9bd8b]/40">
                <p className="font-serif text-3xl text-[#d9bd8b]">{dict.ui.location.times["25mins"]}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                  {dict.ui.location.airport}
                </p>
                <p className="mt-1 text-xs text-white/60">{dict.ui.location.airportDesc}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden border border-white/10 shadow-2xl">
            <div className="aspect-[4/3] w-full bg-[#111] relative">
              <iframe
                title={dict.ui.location.mapTitle}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4602894562095!2d106.70505191147576!3d10.776019389329068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f46e594d0cf%3A0x67303c626ebc8c1e!2zQmEgU29uLCBC4bq_biBOZ2jDqSwgUXXhuq1uIDEsIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!2svi!2s!4v1716710000000!5m2!2svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.85) contrast(1.1) invert(0.92)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function SpaceTour({
  content,
  activeRoom,
  onRoomChange,
  dict,
}: {
  content: LandingPageContent
  activeRoom: RoomKey
  onRoomChange: (room: RoomKey) => void
  dict: any
}) {
  const tourSpaceCopy: Record<RoomKey, string> = {
    living: dict.ui.tour.living,
    kitchen: dict.ui.tour.kitchen,
    bedroom: dict.ui.tour.bedroom,
    bathroom: dict.ui.tour.bathroom,
    balcony: dict.ui.tour.balcony,
  }

  return (
    <section className="bg-[#071010] px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#d9bd8b]">
              {dict.ui.tour.sectionTag}
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">
              {dict.ui.tour.title}
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/58">
            {dict.ui.tour.desc}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 md:mt-9 md:grid-cols-5 md:gap-4">
          {tourSpaces.map((space) => {
            const Icon = roomIcons[space.room]
            const isActive = activeRoom === space.room
            const room = content.roomConfigs[space.room]

            return (
              <button
                type="button"
                key={space.room}
                onPointerEnter={() => onRoomChange(space.room)}
                onFocus={() => onRoomChange(space.room)}
                className={`group relative min-h-56 overflow-hidden border text-left transition-all sm:min-h-64 md:min-h-72 ${
                  isActive
                    ? 'border-[#d9bd8b] shadow-[0_0_34px_rgba(217,189,139,0.24)]'
                    : 'border-white/10 hover:border-[#d9bd8b]/70 hover:shadow-[0_0_34px_rgba(217,189,139,0.18)]'
                }`}
              >
                <Image
                  src={space.image}
                  alt={room.name}
                  fill
                  sizes="(min-width: 768px) 20vw, 100vw"
                  className="object-cover opacity-78 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/28 to-transparent transition-colors duration-500 group-hover:from-black/72 group-hover:via-black/18" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span
                    className={`grid size-10 place-items-center border transition-colors ${
                      isActive ? 'border-[#d9bd8b] text-[#d9bd8b]' : 'border-white/22 text-white/72'
                    }`}
                  >
                    <Icon className="size-4" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{room.name}</h3>
                  <p className="mt-2 text-xs leading-5 text-white/62">{tourSpaceCopy[space.room]}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function PlanSelection({ dict, lang }: { dict: any; lang: string }) {
  const floorPlansData = [
    { id: 'one-bedroom', name: dict.ui.plans.types.oneBedroom, area: '52 m2', price: dict.ui.plans.prices.from5_8 },
    { id: 'two-bedroom', name: dict.ui.plans.types.twoBedroom, area: '78 m2', price: dict.ui.plans.prices.from8_9 },
    { id: 'three-bedroom', name: dict.ui.plans.types.threeBedroom, area: '112 m2', price: dict.ui.plans.prices.from13_6 },
    { id: 'duplex', name: dict.ui.plans.types.duplex, area: '168 m2', price: dict.ui.plans.prices.onDemand },
  ] as const

  type FloorPlanId = (typeof floorPlansData)[number]['id']
  const [activePlan, setActivePlan] = useState<FloorPlanId>('one-bedroom')

  return (
    <section id="can-ho" className="scroll-mt-12 px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-22">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#a87832]">
              {dict.ui.plans.sectionTag}
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#17130e] sm:text-4xl">
              {dict.ui.plans.title}
            </h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8c806e]">
            {dict.ui.plans.ref}
          </span>
        </div>

        <div className="mt-9 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border border-[#d8c5a6] bg-white p-2 shadow-sm sm:p-4">
            <div className="aspect-square bg-[#11100d]">
              <FloorPlan variant={activePlan} lang={lang} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 sm:gap-4">
            {floorPlansData.map((plan) => (
              <button
                key={plan.name}
                type="button"
                onClick={() => setActivePlan(plan.id)}
                className={`border bg-white p-4 text-left transition-colors sm:p-5 ${
                  activePlan === plan.id
                    ? 'border-[#a87832] shadow-[0_16px_36px_rgba(77,54,22,0.14)]'
                    : 'border-[#d8c5a6] hover:border-[#a87832]/55'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-sans text-xl font-medium text-[#17130e] sm:text-2xl">{plan.name}</h3>
                  <CheckCircle2
                    className={`size-5 ${activePlan === plan.id ? 'text-[#a87832]' : 'text-[#cbb895]'}`}
                  />
                </div>
                <div className="mt-7 grid grid-cols-2 gap-3 border-t border-[#eadbc3] pt-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#968873]">
                      {dict.ui.plans.area}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#2a251d]">{plan.area}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#968873]">
                      {dict.ui.plans.price}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#2a251d]">{plan.price}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Advantages({ dict }: { dict: any }) {
  const advantagesData = [
    {
      icon: Waves,
      title: dict.ui.advantages.riverfront,
      text: dict.ui.advantages.riverfrontDesc,
    },
    {
      icon: Trees,
      title: dict.ui.advantages.garden,
      text: dict.ui.advantages.gardenDesc,
    },
    {
      icon: ShieldCheck,
      title: dict.ui.advantages.private,
      text: dict.ui.advantages.privateDesc,
    },
    {
      icon: Building2,
      title: dict.ui.advantages.value,
      text: dict.ui.advantages.valueDesc,
    },
  ]

  return (
    <section id="tien-ich" className="scroll-mt-12 bg-[#0a1212] px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#d9bd8b]">
          {dict.ui.advantages.sectionTag}
        </p>
        <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">
          {dict.ui.advantages.title}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 md:mt-9 md:grid-cols-4 md:gap-4">
          {advantagesData.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="border border-white/10 bg-white/[0.035] p-5">
                <span className="grid size-11 place-items-center border border-[#d9bd8b]/32 text-[#d9bd8b]">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold">{item.title}</h3>
                <p className="mt-3 text-xs leading-6 text-white/58">{item.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function UpdatesAndContact({ onRegister, dict }: { onRegister: () => void; dict: any }) {
  const updatesData = [
    {
      title: dict.ui.updates.items[0].title,
      date: dict.ui.updates.items[0].date,
      image: '/image/bg_living.png',
    },
    {
      title: dict.ui.updates.items[1].title,
      date: dict.ui.updates.items[1].date,
      image: '/image/bg_bep.png',
    },
    {
      title: dict.ui.updates.items[2].title,
      date: dict.ui.updates.items[2].date,
      image: '/image/bg_ngu.png',
    },
  ]

  return (
    <section className="bg-[#f6f1e8] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#a87832]">
            {dict.ui.updates.sectionTag}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-[#17130e] sm:text-4xl">
            {dict.ui.updates.title}
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 md:mt-9 md:grid-cols-3 md:gap-4">
            {updatesData.map((update) => (
              <article key={update.title} className="border border-[#d8c5a6] bg-white">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={update.image}
                    alt={update.title}
                    fill
                    sizes="(min-width: 768px) 30vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a87832]">
                    <Clock3 className="size-3.5" />
                    {update.date}
                  </p>
                  <h3 className="mt-3 text-sm font-semibold leading-6 text-[#17130e]">
                    {update.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="relative overflow-hidden bg-[#091111] p-5 text-white shadow-[0_24px_60px_rgba(32,24,12,0.22)] sm:p-6 lg:p-7">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#9a682c] via-[#d9bd8b] to-[#9a682c]" />
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#d9bd8b]">
            {dict.ui.contact.tag}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold">{dict.ui.contact.title}</h2>
          <p className="mt-4 text-sm leading-6 text-white/62">
            {dict.ui.contact.desc}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="border border-white/10 bg-white/[0.04] p-3">
              <CalendarCheck className="size-4 text-[#d9bd8b]" />
              <p className="mt-3 text-[11px] font-semibold leading-5 text-white/78">{dict.ui.contact.flexSchedule}</p>
            </div>
            <div className="border border-white/10 bg-white/[0.04] p-3">
              <ShieldCheck className="size-4 text-[#d9bd8b]" />
              <p className="mt-3 text-[11px] font-semibold leading-5 text-white/78">{dict.ui.contact.secureInfo}</p>
            </div>
          </div>

          <div className="mt-7 space-y-3">
            {[
              dict.ui.contact.placeholderName,
              dict.ui.contact.placeholderPhone,
            ].map((label) => (
              <label key={label} className="block">
                <span className="sr-only">{label}</span>
                <input
                  type="text"
                  placeholder={label}
                  className="h-12 w-full border border-white/12 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/36 focus:border-[#d9bd8b]"
                />
              </label>
            ))}
            <label className="relative block">
              <span className="sr-only">{dict.ui.contact.placeholderDemand}</span>
              <select
                defaultValue=""
                className="h-12 w-full appearance-none border border-white/12 bg-white/[0.04] px-4 pr-10 text-sm text-white outline-none transition-colors invalid:text-white/36 focus:border-[#d9bd8b]"
                required
              >
                <option value="" disabled>
                  {dict.ui.contact.placeholderDemand}
                </option>
                {dict.ui.leadForm.demands.map((demand: string) => (
                  <option key={demand} value={demand} className="bg-[#091111] text-white">
                    {demand}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-white/42" />
            </label>
          </div>

          <button
            type="button"
            onClick={onRegister}
            className="mt-5 flex min-h-13 w-full items-center justify-center gap-3 bg-[#d9bd8b] px-5 text-[10px] font-black uppercase tracking-[0.16em] text-black transition-all hover:-translate-y-0.5 hover:bg-white"
          >
            {dict.ui.contact.ctaSubmit}
            <Phone className="size-4" />
          </button>
        </aside>
      </div>
    </section>
  )
}

function SiteFooter({ dict }: { dict: any }) {
  return (
    <footer className="bg-[#061010] px-4 py-12 text-white sm:px-6 lg:px-10 lg:py-14">
      <div className="mx-auto max-w-7xl border-t border-white/10">
        <div className="grid gap-10 py-10 md:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] md:items-start lg:gap-16">
          <div className="max-w-xl">
            <Image
              src="/image/logo.png"
              alt="Riverfront Residences"
              width={180}
              height={101}
              className="h-auto w-32 object-contain sm:w-40"
            />
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/58">
              {dict.ui.footer.desc}
            </p>
          </div>
          <div className="border-white/10 md:border-l md:pl-10 lg:pl-12">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#d9bd8b]">
              {dict.ui.footer.contact}
            </p>
            <div className="mt-5 grid gap-3 text-sm text-white/72">
              <p className="flex min-h-14 items-center gap-3 border border-white/10 bg-white/[0.035] px-4">
                <MapPin className="size-4 shrink-0 text-[#d9bd8b]" />
                {dict.ui.footer.address}
              </p>
              <p className="flex min-h-14 items-center gap-3 border border-white/10 bg-white/[0.035] px-4">
                <Phone className="size-4 shrink-0 text-[#d9bd8b]" />
                0900 000 000
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-white/10 py-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/34 sm:flex-row sm:items-center sm:justify-between">
          <p>{dict.brandName} {dict.logoText}</p>
          <p>{dict.ui.footer.privateGallery}</p>
        </div>
      </div>
    </footer>
  )
}
