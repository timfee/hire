import type { Company } from '@prisma/client'
import clsx from 'clsx'
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { NextSeo } from 'next-seo'
import type { CSSProperties } from 'react'
import ReactMarkdown from 'react-markdown'

import { styles } from '@/components/Container'
import resumeThumbnail from '@/components/Letter/resume_thumbnail.png'
import { Signature } from '@/components/Letter/Signature'
import { Stationery } from '@/components/Letter/Stationery'
import { References } from '@/components/Reference/References'
import prisma from '@/lib/prisma'
import seoPropsForPage from '@/lib/seo'
import { getLatestResume } from '@/lib/supabase'

type PageParams = Pick<Company, 'code' | 'slug'>

const CompanyPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  company: { code, color, resumeUrl, created, name, slug, svg, websiteMessage },
  references,
}) => {
  const title = `Tim Feeley + ${name} = ❤️`

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="theme-color" content={color} />
        <NextSeo {...seoPropsForPage({ color, code, slug, name })} />
      </Head>

      <main
        className={clsx('prose mt-6 font-serif', styles.sm)}
        style={{ '--brand-color': color } as CSSProperties}>
        <Stationery
          className="not-prose mt-4 sm:mt-8"
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

        {resumeUrl && (
          <figure className="my-6 text-center sm:text-left">
            <a
              className="group mx-auto inline-flex flex-col rounded-lg border border-slate-400 bg-white px-3 py-6 font-sans sm:mx-0"
              download
              target="blank"
              href={resumeUrl}
              rel="noreferrer">
              <Image
                src={resumeThumbnail}
                alt="Resume"
                height={100}
                className="mx-auto mb-4 transition-opacity duration-300 ease-in-out"
              />
              <span className="rounded-full bg-slate-200 py-1 px-4 text-xs font-medium text-blue-600 underline transition-all duration-300 ease-in-out group-hover:bg-blue-600 group-hover:text-white sm:text-sm">{`Tim Feeley’s ${name} Resume.pdf`}</span>
            </a>
          </figure>
        )}

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
      </main>
      <References references={references} />
      <div className="mt-32 pb-64 text-center">
        <a
          href="https://github.com/timfee/hire"
          className="text-sm text-blue-600">
          https://github.com/timfee/hire
        </a>
      </div>
    </>
  )
}

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
    fallback: 'blocking',
  }
}

export default CompanyPage
