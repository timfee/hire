import { CSSProperties } from 'react'

import { createClient } from '@supabase/supabase-js'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import ColorContrastChecker from 'color-contrast-checker'

import {
  Contact,
  HoverButton,
  References,
  Signoff,
  SmartImage,
} from '@/components'
import { getCompanyData, getReferences } from '@/helpers'
import { Database } from '@/types/supabase'

export type CompanyPageParams = { params: { slug: string; code: string } }

export default async function Page({ params }: CompanyPageParams) {
  const companyData = await getCompanyData(
    params.slug ?? undefined,
    params.code ?? undefined
  )

  if (!companyData || companyData === null) {
    return redirect('/')
  }

  const references = await getReferences()

  const contrastRatio = new ColorContrastChecker().getContrastRatio(
    new ColorContrastChecker().hexToLuminance('#ffffff'),
    new ColorContrastChecker().hexToLuminance(companyData.color)
  )

  const {
    name,
    logoUrl,
    color,
    logoHeight,
    logoWidth,
    websiteMessage,
    resumeUrl,
  } = companyData

  return (
    <>
      <main
        className="prose prose-indigo mx-auto  mt-4 py-4 px-4 sm:px-0 md:max-w-2xl "
        style={
          {
            '--tw-prose-headings':
              contrastRatio < 4 ? 'black' : companyData.color,
          } as CSSProperties
        }>
        <SmartImage
          src={logoUrl}
          height={40}
          alt={`${name} logo`}
          originalHeight={logoHeight}
          originalWidth={logoWidth}
          className="mb-6"
        />
        <ReactMarkdown>{websiteMessage}</ReactMarkdown>
        <Signoff />
        <Contact />
        {resumeUrl && (
          <HoverButton
            color={color}
            contrastRatio={contrastRatio}
            resumeUrl={resumeUrl}
            name={name}
          />
        )}
        <p className="mt-8 font-medium leading-snug tracking-tight">
          PS: I’ve worked with some amazing colleagues over the years; here’s
          what they think of working together:
        </p>
      </main>
      <aside>
        <References references={references ?? []} />
      </aside>
    </>
  )
}

export async function generateMetadata({
  params,
}: CompanyPageParams): Promise<Metadata> {
  const companyData = await getCompanyData(
    params.slug ?? undefined,
    params.code ?? undefined
  )

  if (!companyData || companyData === null) {
    return {}
  }

  const { name, color, slug, code } = companyData

  const title = `Tim Feeley + ${name} = ❤️`
  const description =
    'I’m a PM & UX leader with two decades of experience developing high-performing teams and delivering impactful products used by billions of people.'
  const url = `https://hire.timfeeley.com/${slug}/${code}`
  const ogUrl = 'https://hire.timfeeley.com/opengraph.png'

  return {
    title,
    description,
    themeColor: color,
    viewport: 'width=device-width, initial-scale=1',
    icons: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      title,
      description,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: 'Download Tim Feeley’s Resume',
          type: 'image/png',
          secureUrl: ogUrl,
        },
      ],
      siteName: 'Tim Feeley',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@timfee',
      creator: '@timfee',
    },
  }
}

export async function generateStaticParams() {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  )

  const { data: companies } = await supabase.from('Company').select('slug,code')

  return companies ?? []
}

export const dynamic = 'force-static'
