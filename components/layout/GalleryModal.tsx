'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Sparkles } from 'lucide-react'
import audioSynth from '@/lib/audioSynth'

interface GalleryModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenRegister: () => void
  dict: any
  lang: string
}

interface GalleryItem {
  id: number
  title: string
  category: 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'balcony'
  description: string
  brand: string
  image: string
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    title: 'Không gian Phòng Khách',
    category: 'living',
    description: 'Thiết kế mở rộng panorama, bàn giao đá marble nguyên bản cao cấp nhập khẩu châu Âu.',
    brand: 'Nội thất Hafele & Kohler',
    image: '/image/hero-living-cinematic.png',
  },
  {
    id: 2,
    title: 'Phòng Bếp & Ăn',
    category: 'kitchen',
    description: 'Bếp ốp đá thạch anh nhân tạo chống trầy xước, trang bị lò nướng âm tủ thông minh.',
    brand: 'Thiết bị Bosch & Hafele',
    image: '/image/thumb_bep_16x9_v2.png',
  },
  {
    id: 3,
    title: 'Phòng Ngủ Master',
    category: 'bedroom',
    description: 'Sàn gỗ óc chó tự nhiên, hệ tủ áo acrylic bóng gương cao sát trần sang trọng.',
    brand: 'Gỗ An Cường cao cấp',
    image: '/image/thumb_ngu_16x9_v2.png',
  },
  {
    id: 4,
    title: 'Phòng Tắm Thư Giãn',
    category: 'bathroom',
    description: 'Bồn tắm nằm công thái học, thiết bị vệ sinh thông minh mạ vàng sang trọng chuẩn spa.',
    brand: 'Thiết bị Kohler mạ PVD',
    image: '/image/thumb_tam_16x9_v2.png',
  },
  {
    id: 5,
    title: 'Ban Công Panorama',
    category: 'balcony',
    description: 'Góc ban công khoáng đạt lộng gió sông, mở ra toàn cảnh hoàng hôn và skyline thành phố.',
    brand: 'View sông Sài Gòn',
    image: '/image/thumb_bancong_16x9_v2.png',
  },
]

export function GalleryModal({
  isOpen,
  onClose,
  onOpenRegister,
  dict,
  lang,
}: GalleryModalProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | GalleryItem['category']>('all')

  if (!isOpen) return null

  const localizedItems = GALLERY_ITEMS.map((item, index) => {
    const dictItem = dict.ui.gallery.items[index]
    return {
      ...item,
      title: dictItem?.title || item.title,
      description: dictItem?.description || item.description,
      brand: dictItem?.brand || item.brand,
    }
  })

  const filteredItems = localizedItems.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  )

  const tabsList = ['all', 'living', 'bedroom', 'kitchen', 'bathroom', 'balcony'] as const
  
  const labelMap: Record<typeof tabsList[number], string> = {
    all: dict.ui.gallery.tabs.all,
    living: dict.ui.gallery.tabs.living,
    bedroom: dict.ui.gallery.tabs.bedroom,
    kitchen: dict.ui.gallery.tabs.kitchen,
    bathroom: dict.ui.gallery.tabs.bathroom,
    balcony: dict.ui.gallery.tabs.balcony,
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 transition-all duration-300 animate-in fade-in">
      <div className="bg-[#111111] border border-[#c5a880]/20 p-6 md:p-8 rounded-lg w-full max-w-4xl relative max-h-[90vh] overflow-y-auto scrollbar-none">
        <button
          type="button"
          aria-label={dict.ui.gallery.closeLabel}
          onClick={() => {
            audioSynth.play('click')
            onClose()
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6 md:mb-8">
          <h3 className="font-serif text-2xl md:text-3xl text-[#c5a880] tracking-wide">
            {dict.ui.gallery.title}
          </h3>
          <p className="text-xs text-gray-400 font-light max-w-md mx-auto leading-relaxed">
            {dict.ui.gallery.desc}
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 mb-6">
          {tabsList.map((cat) => {
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  audioSynth.play('click')
                  setActiveCategory(cat)
                }}
                className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-semibold border transition-all ${
                  activeCategory === cat
                    ? 'bg-[#c5a880] text-black border-[#c5a880]'
                    : 'bg-black/40 text-gray-400 border-white/5 hover:border-[#c5a880]/40'
                }`}
              >
                {labelMap[cat]}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="relative group overflow-hidden rounded border border-white/10 flex flex-col bg-black/30"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-[#16120e]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/18 to-transparent pointer-events-none" />
                <div className="absolute inset-3 border border-white/5 pointer-events-none" />

                <span className="absolute top-4 left-4 text-[8px] tracking-[0.2em] text-[#c5a880]/60 font-bold uppercase">
                  GP-18.06 // SPEC
                </span>
                <span className="absolute top-4 right-4 text-[8px] tracking-[0.1em] text-gray-500 font-light flex items-center">
                  <Sparkles className="w-2.5 h-2.5 text-[#c5a880]/70 mr-1 animate-pulse" />
                  PREMIUM
                </span>

                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h4 className="font-serif text-lg text-[#e5cfb3] tracking-wide font-light">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-[#c5a880]/80 tracking-widest mt-1 uppercase font-bold">
                    {item.brand}
                  </p>
                </div>
              </div>

              <div className="p-4 space-y-1.5 border-t border-white/5 bg-[#121212]">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-[#c5a880]/90 tracking-widest uppercase">
                    {lang === 'vi' ? 'Chi tiết bàn giao' : 'Handover specifications'}
                  </span>
                  <span className="text-[8px] text-gray-500 uppercase tracking-widest font-mono">
                    CAT.{item.category.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <button
            type="button"
            onClick={() => {
              audioSynth.play('click')
              onClose()
              onOpenRegister()
            }}
            className="px-8 py-3 bg-[#c5a880] text-black text-xs font-bold tracking-widest rounded hover:bg-white transition-colors uppercase"
          >
            {dict.ui.gallery.ctaRegister}
          </button>
        </div>
      </div>
    </div>
  )
}

export default GalleryModal
