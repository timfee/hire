import { type ParsedUrlQuery } from 'querystring'

import { type CSSProperties } from 'react'

import {
  type GetStaticPaths,
  type GetStaticProps,
  type InferGetStaticPropsType,
  type NextPage,
} from 'next'
import Head from 'next/head'
import ReactMarkdown from 'react-markdown'

import { Contact } from '@/components/Contact'
import Container from '@/components/Container'
import HoverButton from '@/components/HoverButton'
import References from '@/components/References'
import Signoff from '@/components/Signoff'
import SmartImage from '@/components/SmartImage'
import { refreshResumeUrl } from '@/content'
import { type Database } from '@/types/supabase'
import { createSupabaseServerClient, type Reference } from '@/utils/supabase'

type CompanyData = Database['public']['Tables']['Company']['Row']
type PageData = { company: CompanyData; references: Reference[] }

type ParsedUrlQueryWithKey = ParsedUrlQuery & { company: string; code: string }

const Company: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  company: {
    websiteMessage,
    color,
    name,
    resumeUrl,
    logoUrl,
    logoWidth,
    logoHeight,
    slug,
    code,
  },
  references,
}) => {
  const title = `Tim Feeley + ${name} = ❤️`
  const description =
    'I’m a PM & UX leader with two decades of experience developing high-performing teams and delivering impactful products used by billions of people.'
  const url = `https://hire.timfeeley.com/${slug}/${code}`
  const ogUrl = 'https://hire.timfeeley.com/opengraph.png'

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta
          name="description"
          content={description}
        />
        <meta
          name="theme-color"
          content={color}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
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
          property="og:url"
          content={url}
        />
        <meta
          property="og:site_name"
          content="Tim Feeley"
        />
        <meta
          property="og:locale"
          content="en_US"
        />
        <meta
          property="og:image:alt"
          content="Download Tim Feeley’s Resume"
        />
        <meta
          property="og:image:height"
          content="630"
        />
        <meta
          property="og:image:secureUrl"
          content={ogUrl}
        />
        <meta
          property="og:image:type"
          content="image/png"
        />
        <meta
          property="og:image:url"
          content={ogUrl}
        />
        <meta
          property="og:image:width"
          content="1200"
        />
        <meta
          property="og:type"
          content="website"
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
        <link
          rel="icon"
          href="/favicon.svg"
          type="image/svg+xml"
        />
      </Head>
      <main>
        <BrandStrip color={color} />
        <Container
          as="section"
          className="prose prose-indigo mx-auto mt-4 py-4 px-4 sm:px-0 md:max-w-2xl"
          style={{ '--tw-prose-headings': color } as CSSProperties}>
          <SmartImage
            src={logoUrl}
            height={40}
            alt={`${name} logo`}
            originalHeight={logoHeight}
            originalWidth={logoWidth}
            className="mb-0"
          />
          <ReactMarkdown>{websiteMessage}</ReactMarkdown>
          <Signoff />
          <Contact />
          {resumeUrl && (
            <HoverButton
              color={color}
              resumeUrl={resumeUrl}
              name={name}
            />
          )}
          <p className="mt-8 font-medium leading-snug">
            PS: I’ve worked with some amazing colleagues over the years; here’s
            what they think of working together:
          </p>
        </Container>
        <References references={references} />
      </main>
    </>
  )
}

export default Company

export const getStaticProps: GetStaticProps<
  PageData,
  ParsedUrlQueryWithKey
> = async ({ params }) => {
  if (!params) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
        statusCode: 404,
      },
      revalidate: 10,
    }
  }

  const supabase = createSupabaseServerClient()
  const { company: slug, code } = params

  const {
    data: company,
    error: companyError,
    status: companyStatus,
  } = await supabase
    .from('Company')
    .select()
    .eq('slug', slug)
    .eq('code', code)
    .single()

  const {
    data: references,
    error: refsError,
    status: refsStatus,
  } = await supabase
    .from('Reference')
    .select()
    .order('order', { ascending: true })

  if (refsError || companyError || !references || !company) {
    console.error(
      `An error occurred in SSP:\nCompany: ${companyStatus}\n${JSON.stringify(
        companyError
      )}\n---------\nReferences: ${refsStatus}\n${JSON.stringify(refsError)}`
    )
    return {
      redirect: {
        destination: `/?${companyStatus}-${refsStatus}`,
        permanent: false,
      },
      revalidate: 60 * 60 * 24,
    }
  }

  await refreshResumeUrl({ ...company })

  return {
    props: {
      company,
      references,
    },

    revalidate: 60 * 60 * 24,
  }
}

export const getStaticPaths: GetStaticPaths<
  ParsedUrlQueryWithKey
> = async () => {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase.from('Company').select('*')

  if (error) {
    return { fallback: 'blocking', paths: [] }
  }

  const paths = data.map((company) => {
    return {
      params: {
        code: company.code,
        company: company.slug,
      },
    }
  })

  return { fallback: 'blocking', paths }
}

function BrandStrip({ color }: { color: string }) {
  return (
    <div
      className="h-12"
      style={
        {
          backgroundColor: color,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 75%)',
        } as CSSProperties
      }
    />
  )
}
