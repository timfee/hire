import type { Company } from '@prisma/client'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import type { NextSeoProps } from 'next-seo'
import { NextSeo } from 'next-seo'
import ReactMarkdown from 'react-markdown'

import resumeThumbnail from '@/components/Letter/resume_thumbnail.png'
import { Signature } from '@/components/Letter/Signature'
import { Stationery } from '@/components/Letter/Stationery'
import { getLatestResume } from '@/lib/amazon'
import prisma from '@/lib/prisma'

type PageParams = Pick<Company, 'code' | 'slug'>

const CompanyPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  code,
  color,
  resumeUrl,
  lastUpdated,
  name,
  slug,
  svg,
  websiteMessage,
}) => {
  const title = `Tim Feeley + ${name} = ❤️`

  const description =
    'I’m a PM & UX leader with two decades of experience developing high-performing teams and delivering impactful products used by billions of people.'

  const SEO_PARAMS: NextSeoProps = {
    title,
    description,
    themeColor: color,
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
        <meta name="theme-color" content={color} />
        <title>{title}</title>
        <NextSeo {...SEO_PARAMS} />
      </Head>

      <main
        className="relative mx-4 mt-3 max-w-3xl rounded-md border-t-4 bg-white p-4 shadow-md sm:mx-auto sm:mt-12 sm:p-8"
        style={{ borderTopColor: color }}>
        <Stationery {...{ svg, name, color, lastUpdated }} />
        <ReactMarkdown className="prose mt-6 font-serif sm:mt-12">
          {websiteMessage}
        </ReactMarkdown>
        <Signature />
        {resumeUrl && (
          <a
            className="group relative mx-4 mt-8  block max-w-sm  rounded-lg border border-slate-300 bg-slate-100 p-4 text-center sm:mx-auto sm:p-8"
            download
            target="blank"
            href={resumeUrl}
            rel="noreferrer">
            <Image
              src={resumeThumbnail}
              alt="Resume"
              height={100}
              className="mx-auto mb-4 transition-opacity duration-500 ease-in-out"
            />

            <span className="rounded-full bg-slate-200 py-1 px-4 text-xs text-blue-600 underline transition-all duration-500 ease-in-out group-hover:bg-blue-600 group-hover:text-white sm:text-sm">{`Tim Feeley - ${name}.pdf`}</span>
          </a>
        )}
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
