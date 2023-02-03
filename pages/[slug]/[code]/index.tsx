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
import prisma from '@/lib/prisma'
import { generateResumePacket } from '@/lib/resume'

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
  Omit<Company, 'png' | 'resumeMessage' | 'resumeData'>,
  PageParams
> = async ({ params }) => {
  if (!params) {
    return {
      notFound: true,
      revalidate: 60,
    }
  }

  const { slug, code } = params
  try {
    const returnFields = await prisma.company.findFirstOrThrow({
      select: {
        name: true,
        svg: true,
        color: true,
        websiteMessage: true,
        lastUpdated: true,
        code: true,
        slug: true,
        created: true,
        resumeLastGenerated: true,
      },
      where: {
        slug,
        code,
      },
    })

    return {
      props: { ...returnFields },
      redirect: 60,
    }
  } catch {
    return {
      notFound: true,
      revalidate: 60,
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

  // generate resume data at build time.
  console.info(`${new Date().toString()} Generating resume data for companies`)
  for (const company of companies) {
    console.info(`${new Date().toString()} ** Starting ${company.name} **`)
    if (
      !company.resumeLastGenerated ||
      company.resumeLastGenerated < company.lastUpdated
    ) {
      const { slug, name } = company
      console.info(
        `${new Date().toString()} ** !!!  ${
          company.name
        } is stale - updating **`
      )
      await prisma.company.update({
        where: { slug },
        data: {
          resumeLastGenerated: new Date(),
          resumeData: Buffer.from(await generateResumePacket({ slug })),
        },
      })
      console.info(`${new Date().toString()} ** Finished ${name} **`)
    }
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
