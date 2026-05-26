'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, User, Phone, Mail, Home, CheckCircle2, CalendarCheck, ShieldCheck } from 'lucide-react'

import { demandOptions, leadFormSchema, LeadFormData } from '@/lib/validations'
import { trackFormSubmit } from '@/lib/analytics'
import audioSynth from '@/lib/audioSynth'

interface LeadFormProps {
  isOpen: boolean
  onClose: () => void
  campaignName: string
  onShowToast: (message: string) => void
  dict: any
  lang: string
}

export function LeadForm({
  isOpen,
  onClose,
  campaignName,
  onShowToast,
  dict,
  lang,
}: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      demand: demandOptions[1],
    },
  })

  if (!isOpen) return null

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true)
    audioSynth.play('click')

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, campaignName }),
      })

      if (response.ok) {
        trackFormSubmit(campaignName, true)
        setIsSuccess(true)
        audioSynth.play('transition')
        reset()
        onShowToast(dict.ui.leadForm.successToast)
      } else {
        throw new Error('Submit failed')
      }
    } catch (e) {
      console.error(e)
      trackFormSubmit(campaignName, false)
      onShowToast(dict.ui.leadForm.errorToast)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getErrorMessage = (fieldName: 'fullName' | 'phone' | 'email') => {
    const err = errors[fieldName]
    if (!err) return null
    if (lang === 'vi') return err.message

    // English localized messages
    if (fieldName === 'fullName') {
      return 'Full name must be at least 2 characters'
    }
    if (fieldName === 'phone') {
      return 'Invalid Vietnamese phone number format (e.g. 0901234567)'
    }
    if (fieldName === 'email') {
      return 'Invalid email address'
    }
    return err.message
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto bg-[#050403]/82 p-0 backdrop-blur-xl transition-all duration-300 animate-in fade-in sm:items-center sm:p-4">
      <div className="relative max-h-[100svh] w-full max-w-[920px] overflow-y-auto border border-[#d9bd8b]/28 bg-[#0c0b09] shadow-[0_32px_90px_rgba(0,0,0,0.55)] sm:max-h-[calc(100svh-2rem)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d9bd8b] to-transparent" />

        <button
          type="button"
          aria-label={dict.ui.leadForm.closeLabel}
          onClick={() => {
            audioSynth.play('click')
            onClose()
          }}
          className="absolute right-3 top-3 z-10 grid size-10 place-items-center border border-white/10 bg-white/[0.06] text-white/72 transition-colors hover:border-[#d9bd8b]/45 hover:text-white sm:right-4 sm:top-4 sm:size-9"
        >
          <X className="size-4" />
        </button>

        {isSuccess ? (
          <div className="mx-auto max-w-md px-6 py-12 text-center animate-in zoom-in-95 duration-300 md:py-14">
            <div className="mx-auto flex size-16 items-center justify-center border border-[#d9bd8b]/42 bg-[#d9bd8b]/12">
              <CheckCircle2 className="size-8 text-[#d9bd8b]" />
            </div>
            <div className="mt-6 space-y-3">
              <h3 className="font-serif text-3xl text-[#d9bd8b]">{dict.ui.leadForm.successTitle}</h3>
              <p className="text-sm leading-6 text-white/66">
                {dict.ui.leadForm.successDesc}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                audioSynth.play('click')
                setIsSuccess(false)
                onClose()
              }}
              className="mt-8 min-h-12 w-full bg-[#d9bd8b] px-6 text-[10px] font-black uppercase tracking-[0.16em] text-black transition-colors hover:bg-white"
            >
              {dict.ui.leadForm.successClose}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-[0.82fr_1fr]">
            <div className="relative hidden min-h-[560px] overflow-hidden bg-[#16110c] p-8 md:block">
              <div className="absolute inset-0 bg-[url('/image/bg_bancong.png')] bg-cover bg-center opacity-42" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080706] via-[#080706]/60 to-transparent" />
              <div className="relative flex h-full flex-col justify-end">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#d9bd8b]">
                  {dict.ui.leadForm.titlePrice}
                </p>
                <h3 className="mt-3 font-serif text-4xl leading-tight text-white">
                  {dict.ui.leadForm.subtitlePrice}
                </h3>
                <p className="mt-4 text-sm leading-6 text-white/64">
                  {dict.ui.leadForm.descPrice}
                </p>
                <div className="mt-7 grid grid-cols-2 gap-3">
                  <div className="border border-white/12 bg-black/28 p-4 backdrop-blur-md">
                    <CalendarCheck className="size-5 text-[#d9bd8b]" />
                    <p className="mt-3 text-xs font-semibold leading-5 text-white/78">
                      {dict.ui.leadForm.scheduleLabel}
                    </p>
                  </div>
                  <div className="border border-white/12 bg-black/28 p-4 backdrop-blur-md">
                    <ShieldCheck className="size-5 text-[#d9bd8b]" />
                    <p className="mt-3 text-xs font-semibold leading-5 text-white/78">
                      {dict.ui.leadForm.secureLabel}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-5 pt-14 sm:p-6 sm:pt-14 md:p-9">
              <div className="mb-7">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#d9bd8b]">
                  {dict.ui.leadForm.registerTag}
                </p>
                <h3 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-3xl">
                  {dict.ui.leadForm.registerTitle}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/56">
                  {dict.ui.leadForm.registerDesc}
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/44">
                    {dict.ui.leadForm.labelName}
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#d9bd8b]/58">
                      <User className="size-4" />
                    </span>
                    <input
                      {...register('fullName')}
                      type="text"
                      placeholder="Nguyen Van A"
                      className="h-13 w-full border border-white/10 bg-white/[0.035] pl-11 pr-4 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#d9bd8b] sm:h-12 sm:text-sm"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-[10px] font-light text-red-300">{getErrorMessage('fullName')}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/44">
                    {dict.ui.leadForm.labelPhone}
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#d9bd8b]/58">
                      <Phone className="size-4" />
                    </span>
                    <input
                      {...register('phone')}
                      type="tel"
                      placeholder="0901234567"
                      className="h-13 w-full border border-white/10 bg-white/[0.035] pl-11 pr-4 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#d9bd8b] sm:h-12 sm:text-sm"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[10px] font-light text-red-300">{getErrorMessage('phone')}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/44">
                    {dict.ui.leadForm.labelEmail}
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#d9bd8b]/58">
                      <Mail className="size-4" />
                    </span>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="example@gmail.com"
                      className="h-13 w-full border border-white/10 bg-white/[0.035] pl-11 pr-4 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#d9bd8b] sm:h-12 sm:text-sm"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[10px] font-light text-red-300">{getErrorMessage('email')}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/44">
                    {dict.ui.leadForm.labelDemand}
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#d9bd8b]/58">
                      <Home className="size-4" />
                    </span>
                    <select
                      {...register('demand')}
                      className="h-13 w-full cursor-pointer appearance-none border border-white/10 bg-white/[0.035] pl-11 pr-4 text-base text-white/72 outline-none transition-colors focus:border-[#d9bd8b] sm:h-12 sm:text-sm"
                      style={{ colorScheme: 'dark' }}
                    >
                      {demandOptions.map((option, index) => {
                        const translatedLabel = dict.ui.leadForm.demands[index] || option
                        return (
                          <option
                            key={option}
                            value={option}
                            className="bg-[#0c0b09] text-white"
                          >
                            {translatedLabel}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 min-h-13 w-full select-none bg-[#d9bd8b] px-5 text-[10px] font-black uppercase tracking-[0.16em] text-black transition-all hover:-translate-y-0.5 hover:bg-white disabled:translate-y-0 disabled:bg-white/18 disabled:text-white/42"
              >
                {isSubmitting
                  ? dict.ui.leadForm.sending
                  : dict.ui.leadForm.ctaSubmit}
              </button>

              <p className="mt-4 text-center text-[11px] leading-5 text-white/38">
                {dict.ui.leadForm.footerNote}
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeadForm
