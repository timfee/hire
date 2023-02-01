import type { Company } from '@prisma/client'
import type { NextSeoProps } from 'next-seo'
import { NextSeo } from 'next-seo'
import { cache } from 'react'

import prisma from '@/lib/prisma'

export default async function Head({
  params: { slug, code },
}: {
  params: Pick<Company, 'code' | 'slug'>
}) {
  const companyData = await getCompanyData({ slug, code })
  const title = `Tim Feeley ${
    companyData ? ' & ' + companyData.name + ' = ❤️' : ''
  }`

  const description =
    'I’m a PM & UX leader with two decades of experience developing high-performing teams and delivering impactful products used by billions of people.'

  const NEXT_SEO_DEFAULT: NextSeoProps = {
    title,
    description,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `https://hire.timfeeley.com/${slug}/${code}`,
      title,
      description,
      images: [
        {
          url: 'http://hire.timfeeley.com/opengraph.png',
          width: 1200,
          height: 630,
          alt: 'Download Tim Feeley’s Resume',
          type: 'image/jpeg',
          secureUrl: 'https://hire.timfeeley.com/opengraph.png',
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

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <meta name="robots" content="index,follow" />
      <meta name="theme-color" content={companyData.color} />
      <link
        rel="canonical"
        href={`https://hire.timfeeley.com/${slug}/${code}`}
      />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <NextSeo {...NEXT_SEO_DEFAULT} useAppDir={true} />
    </>
  )
}

const getCompanyData = cache(
  async ({ slug, code }: Pick<Company, 'code' | 'slug'>) => {
    const returnFields = await prisma.company.findFirstOrThrow({
      select: {
        name: true,
        svg: true,
        color: true,
        websiteMessage: true,
        lastUpdated: true,
        code: true,
        slug: true,
      },
      where: {
        AND: {
          slug,
          code,
        },
      },
    })

    return returnFields
  }
)
