import type { Company } from '@prisma/client'
import { redirect } from 'next/navigation'
import type { CSSProperties } from 'react'
import ReactMarkdown from 'react-markdown'

import {
  Container,
  DownloadLink,
  Header,
  References,
  Signoff,
} from '@/components'
import prisma from '@/lib/prisma'
import { getLatestResume } from '@/lib/supabase'

type ResumePageParams = Pick<Company, 'code' | 'slug'>

export const revalidate = 3600 // revalidate every hour

export async function generateMetadata({
  params: { code, slug },
}: {
  params: ResumePageParams
}) {
  const data = await GetData({ code, slug })

  if (!data.company) {
    return {}
  }
  const {
    company: { color, name },
  } = data

  const title = `Tim Feeley + ${name} = ❤️`
  const description =
    'I’m a PM & UX leader with two decades of experience developing high-performing teams and delivering impactful products used by billions of people.'
  const url = `https://hire.timfeeley.com/${slug}/${code}`
  const ogUrl = 'https://hire.timfeeley.com/opengraph.png'

  return {
    title,
    description,
    themeColor: color,
    canonical: url,
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
      handle: '@timfee',
      site: '@timfee',
      cardType: 'summary_large_image',
    },
  }
}

export default async function ResumePage({
  params: { code, slug },
}: {
  params: ResumePageParams
}) {
  const data = await GetData({ code, slug })
  if (!data.company) {
    redirect('/404')
  }
  const {
    company: { color, name, logoUrl, websiteMessage, resumeUrl },
    references,
  } = data

  return (
    <main style={{ '--brand-color': color } as CSSProperties}>
      <Container as="section" className="prose mt-6 sm:mt-8">
        <Header
          className="not-prose mt-6 sm:mt-8"
          {...{ logoUrl, name, color }}
        />

        <ReactMarkdown>{websiteMessage}</ReactMarkdown>
        <DownloadLink name={name} resumeUrl={resumeUrl} />
        <Signoff />
      </Container>

      <References references={references} />

      <footer className="mt-32 pb-64 text-center italic text-slate-500">
        Hand coded with
        <Love />
        <a
          href="https://github.com/timfee/hire"
          className="text-sm not-italic text-blue-600 underline decoration-blue-300">
          https://github.com/timfee/hire
        </a>
      </footer>
    </main>
  )
}

async function GetData({ slug = '', code = '' }) {
  const company = await prisma.company.findFirst({
    where: {
      slug,
      code,
    },
  })

  const references = await prisma.reference.findMany({
    orderBy: {
      order: 'asc',
    },
  })

  return {
    company,
    references,
  }
}

export async function generateStaticParams() {
  const companies = await prisma.company.findMany({
    select: {
      name: true,
      code: true,
      slug: true,
      resumeLastGenerated: true,
      lastUpdated: true,
    },
  })

  await Promise.all(companies.map((company) => getLatestResume({ ...company })))

  return companies.map(({ slug, code }) => ({
    slug,
    code,
  }))
}

function Love() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="mx-2 inline h-6 w-6">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  )
}
