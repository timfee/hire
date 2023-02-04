import type { Company } from '@prisma/client'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import Head from 'next/head'
import type { NextSeoProps } from 'next-seo'
import { NextSeo } from 'next-seo'

import Letter from '@/components/Letter/Page'
import { getLatestResume } from '@/lib/amazon'
import prisma from '@/lib/prisma'

type PageParams = Pick<Company, 'code' | 'slug'>

const CompanyPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  companyData
) => {
  const { slug, code } = companyData

  const title = `Tim Feeley ${
    companyData ? '& ' + companyData.name + ' = ❤️' : ''
  }`

  const description =
    'I’m a PM & UX leader with two decades of experience developing high-performing teams and delivering impactful products used by billions of people.'

  const SEO_PARAMS: NextSeoProps = {
    title,
    description,
    themeColor: companyData.color,
    useAppDir: true,
    canonical: `https://hire.timfeeley.com/${slug}/${code}`,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `https://hire.timfeeley.com/${slug}/${code}`,
      title,
      description,
      images: [
        {
          url: 'https://hire.timfeeley.com/opengraph.png',
          width: 1200,
          height: 630,
          alt: 'Download Tim Feeley’s Resume',
          type: 'image/png',
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
      <Head>
        <meta name="theme-color" content={companyData.color} />
        <NextSeo {...SEO_PARAMS} />
      </Head>

      <main className="mb-12">
        <Letter {...companyData} />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps<
  Omit<Company, 'png' | 'resumeMessage'>,
  PageParams
> = async ({ params }) => {
  if (!params) {
    return {
      notFound: true,
      revalidate: 10,
    }
  }

  const { slug, code } = params
  try {
    // Next doesn't like it when you try to return a binary field
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { png, ...returnFields } = await prisma.company.findFirstOrThrow({
      where: {
        slug,
        code,
      },
    })

    return {
      props: { ...returnFields },
      revalidate: 60,
    }
  } catch {
    return {
      notFound: true,
      revalidate: 10,
    }
  }
}

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  const companies = await prisma.company.findMany({
    select: {
      code: true,
      slug: true,
      resumeLastGenerated: true,
      lastUpdated: true,
      name: true,
    },
  })

  // Generate resume data at build time.
  for (const company of companies) {
    await getLatestResume({ ...company })
  }

  return {
    paths: companies.map(({ slug, code }) => ({
      params: {
        slug,
        code,
      },
    })),
    fallback: true,
  }
}

export default CompanyPage
