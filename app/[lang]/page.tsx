import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from './dictionaries'
import HomeClient from './HomeClient'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params

  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  return <HomeClient dict={dict} lang={lang} />
}
