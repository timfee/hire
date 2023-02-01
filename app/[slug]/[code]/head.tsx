import type { Company } from '@prisma/client'
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
  return (
    <>
      <title>{title}</title>
      <link rel="icon" href="/favicon.svg" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="description"
        content={`Hi, ${companyData.name}, I’m Tim Feeley, a people-centric Product Manager from San Francisco.`}
      />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@timfee" />
      <meta name="twitter:creator" content="@timfee" />
      <meta
        property="og:description"
        content={`Hi, ${companyData.name}, I’m Tim Feeley, a people-centric Product Manager from San Francisco.`}
      />
      <meta
        property="og:url"
        content={`https://hire.timfeeley.com/${slug}/${code}`}
      />
      <meta name="type" property="og:type" content="website" />
      <meta
        name="image"
        property="og:image"
        content="https://hire.timfeeley.com/opengraph.png"
      />
      <meta property="og:locale" content="en_US" />
      <meta name="title" property="og:title" content={title} />
      <link
        rel="canonical"
        href={`https://hire.timfeeley.com/${slug}/${code}`}
      />
      <link rel="icon" href="/favicon.svg" />
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
