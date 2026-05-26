'use client'

import { useState } from 'react'

import { HeroWrapper } from '@/components/sections/Hero360'
import { LowerLandingSections } from '@/components/sections/LowerLandingSections'
import { LeadForm } from '@/components/forms/LeadForm'
import { GalleryModal } from '@/components/layout/GalleryModal'
import { trackCTAClick } from '@/lib/analytics'
import audioSynth from '@/lib/audioSynth'
import { LandingPageContent, RoomKey } from '@/types/landing'

interface HomeClientProps {
  dict: any
  lang: string
}

export default function HomeClient({ dict, lang }: HomeClientProps) {
  const content = dict as LandingPageContent
  const [activeRoom, setActiveRoom] = useState<RoomKey>('living')
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const soundEnabled = true

  const handleRoomChange = (room: RoomKey) => {
    if (room === activeRoom) return

    if (soundEnabled) {
      audioSynth.play('transition')
    }

    trackCTAClick(`room_select_${room}`, 'thumbnail_navigation')
    setActiveRoom(room)
  }

  const handleRegisterOpen = () => {
    if (soundEnabled) audioSynth.play('click')
    trackCTAClick('private_viewing', 'hero')
    setIsRegisterOpen(true)
  }

  const handleGalleryOpen = () => {
    if (soundEnabled) audioSynth.play('click')
    trackCTAClick('hero_gallery', 'hero')
    setIsGalleryOpen(true)
  }

  return (
    <main
      className="min-h-screen overflow-hidden bg-[#080807] font-sans text-white"
    >
      <HeroWrapper
        content={content}
        activeRoom={activeRoom}
        onRoomChange={handleRoomChange}
        onRegister={handleRegisterOpen}
        onGallery={handleGalleryOpen}
        dict={dict}
        lang={lang}
      />

      <LowerLandingSections
        content={content}
        activeRoom={activeRoom}
        onRoomChange={handleRoomChange}
        onRegister={handleRegisterOpen}
        dict={dict}
        lang={lang}
      />

      <LeadForm
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        campaignName={content.campaignName}
        onShowToast={() => undefined}
        dict={dict}
        lang={lang}
      />

      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        dict={dict}
        lang={lang}
      />
    </main>
  )
}
