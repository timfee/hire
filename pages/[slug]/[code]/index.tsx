import type { Company } from '@prisma/client'
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import Head from 'next/head'
import type { CSSProperties } from 'react'
import ReactMarkdown from 'react-markdown'

import Container from '@/components/Container'
import DownloadLink from '@/components/DownloadLink'
import Header from '@/components/Header'
import Metadata from '@/components/Metadata'
import References from '@/components/References'
import { Signature } from '@/components/Signature'
import CompanyContext from '@/context/CompanyContext'
import prisma from '@/lib/prisma'
import { getLatestResume } from '@/lib/supabase'

type PageParams = Pick<Company, 'code' | 'slug'>

const CompanyPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  company,
  references,
}) => {
  if (!company) {
    return <>Loading...</>
  }
  const { color, resumeUrl, created, name, svg, websiteMessage } = company

  return (
    <>
      <Head>
        <Metadata />
      </Head>

      <Container
        as="main"
        className="prose mt-6 font-serif sm:mt-8"
        style={{ '--brand-color': color } as CSSProperties}>
        <Header className="not-prose mt-6 sm:mt-8" {...{ svg, name, color }} />
        <p className="font-sans text-sm">
          {new Date(created).toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>

        <ReactMarkdown>{websiteMessage}</ReactMarkdown>

        {resumeUrl && <DownloadLink resumeUrl={resumeUrl} />}

        <p>I look forward to learning more. Please reach out anytime.</p>
        <p>Thanks,</p>
        <Signature />

        <p className="mt-2 font-serif">
          <a href="mailto:tim@timfeeley.com" className="text-blue-700">
            tim@timfeeley.com
          </a>
        </p>
        <hr className="mt-6 border-slate-400/40" />
        <section className="mt-6 mb-0 text-center font-serif font-medium italic tracking-tight text-slate-800 sm:text-lg">
          I’m grateful for the opportunities I’ve had to collaborate with some
          amazing people who have taken the time to share their thoughts about
          working together:
        </section>
      </Container>
      <References references={references} />
      <footer className="mt-32 pb-64 text-center italic text-slate-500">
        Hand coded with
        <span className="mx-1.5 not-italic">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="inline h-6 w-6">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
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

const Resume: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  return (
    <CompanyContext.Provider value={props ? props.company : null}>
      <CompanyPage {...props} />
    </CompanyContext.Provider>
  )
}

export default Resume

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  if (!params) {
    return {
      notFound: true,
      revalidate: 10,
    }
  }

  const { slug, code } = params as PageParams
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
      revalidate: 60,
    }
  } catch (e) {
    console.error(e)
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
