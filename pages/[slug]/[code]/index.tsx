import type { Company, Reference } from '@prisma/client'
import type { GetStaticPaths, GetStaticPropsContext } from 'next'
import Head from 'next/head'
import type { CSSProperties } from 'react'
import ReactMarkdown from 'react-markdown'

import Container from '@/components/Container'
import DownloadLink from '@/components/DownloadLink'
import Header from '@/components/Header'
import References from '@/components/References'
import { Signature } from '@/components/Signature'
import { withData } from '@/context/DataContext'
import prisma from '@/lib/prisma'
import { getLatestResume } from '@/lib/supabase'

export type ResumePageParams = Pick<Company, 'code' | 'slug'>
export type ResumePageProps = {
  company: Omit<Company, 'png' | 'resumeMessage'>
  references: Reference[]
}

function CompanyPage({ company, references }: ResumePageProps) {
  if (!company) {
    return <>Loading...</>
  }
  const { color, created, name, svg, websiteMessage } = company
  const title = `Tim Feeley + ${name} = ❤️`
  const description =
    'I’m a PM & UX leader with two decades of experience developing high-performing teams and delivering impactful products used by billions of people.'

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta
          name="theme-color"
          content={color}
        />
        <meta
          name="description"
          content={description}
        />
        <link
          rel="icon"
          href="/favicon.svg"
        />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />
        <meta
          name="twitter:site"
          content="@timfee"
        />
        <meta
          name="twitter:creator"
          content="@timfee"
        />
        <meta
          property="og:title"
          content={title}
        />
        <meta
          property="og:description"
          content={description}
        />
        <meta
          property="og:type"
          content="website"
        />
        <meta
          property="og:image"
          content="https://hire.timfeeley.com/opengraph.png"
        />
        <meta
          property="og:image:secure_url"
          content="https://hire.timfeeley.com/opengraph.png"
        />
        <meta
          property="og:image:type"
          content="image/png"
        />
        <meta
          property="og:image:width"
          content="1200"
        />
        <meta
          property="og:image:height"
          content="630"
        />
        <meta
          property="og:image:alt"
          content="Download Tim Feeley’s Resume"
        />

        <meta
          property="og:locale"
          content="en_US"
        />
        <meta
          property="og:site_name"
          content="Tim Feeley"
        />
      </Head>

      <Container
        as="main"
        className="prose mt-6 sm:mt-8"
        style={{ '--brand-color': color } as CSSProperties}>
        <Header
          className="not-prose mt-6 sm:mt-8"
          {...{ svg, name, color }}
        />
        <p className="font-sans text-sm">
          {new Date(created).toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>

        <ReactMarkdown>{websiteMessage}</ReactMarkdown>

        <DownloadLink />

        <p>I look forward to learning more; feel free to reach out anytime!</p>
        <p>Thanks,</p>

        <Signature />

        <p className="mt-2 font-serif">
          <a href="mailto:tim@timfeeley.com">tim@timfeeley.com</a>
        </p>
        <hr className="mt-6 border-slate-400/40" />
        <h3>
          I’m grateful for the opportunities I’ve had to collaborate with some
          amazing people who have taken the time to share their thoughts about
          working together:
        </h3>
      </Container>
      <References references={references} />
      <footer className="mt-32 pb-64 text-center italic text-slate-500">
        Hand coded with
        <span className="mx-1.5 not-italic">
          <Love />
        </span>
        <a
          href="https://github.com/timfee/hire"
          className="text-sm not-italic text-blue-600 underline decoration-blue-300">
          https://github.com/timfee/hire
        </a>
      </footer>
    </>
  )
}

export default withData(CompanyPage)

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  if (!params) {
    return {
      notFound: true,
      revalidate: 10,
    }
  }

  const { slug, code } = params as ResumePageParams
  try {
    // Next doesn't like it when you try to return a binary field
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { png, ...returnFields } = await prisma.company.findFirstOrThrow({
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
      props: { company: returnFields, references },
      revalidate: 60 * 60 * 24 /* 24 hours */,
    }
  } catch (e) {
    console.error(e)
    return {
      notFound: true,
      revalidate: 60 * 60 /* 1 hour */,
    }
  }
}

export const getStaticPaths: GetStaticPaths<ResumePageParams> = async () => {
  const companies = await prisma.company.findMany({
    select: {
      code: true,
      slug: true,
      resumeLastGenerated: true,
      lastUpdated: true,
      name: true,
    },
  })

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
    fallback: 'blocking',
  }
}

export function Love() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="inline h-6 w-6">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  )
}
