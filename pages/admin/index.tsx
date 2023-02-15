import Container from '@/components/Container'
import { type Company, createSupabaseServerClient } from '@/utils/supabase'
import { type InferGetServerSidePropsType, type GetServerSideProps } from 'next'

import Link from 'next/link'
import { type ParsedUrlQuery } from 'querystring'

export default function AdminLander({
  companies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Container>
      <div
        role="list"
        className="mt-6 space-y-3">
        <Link
          href="/admin/editor"
          className="block overflow-hidden rounded-md bg-green-600 px-6 py-4 text-white underline shadow">
          Create New Company
        </Link>

        {companies &&
          companies.map(({ name, slug }) => (
            <Link
              key={slug}
              href={`/admin/editor?slug=${slug}`}
              className="block overflow-hidden rounded-md bg-white px-6 py-4 text-blue-800 underline shadow">
              {name}
            </Link>
          ))}
      </div>
    </Container>
  )
}

type PageProps = { companies?: Company[] }
export const getServerSideProps: GetServerSideProps<
  PageProps,
  ParsedUrlQuery
> = async () => {
  const supabase = createSupabaseServerClient()

  const {
    data: company,
    error: companyError,
    status: companyStatus,
  } = await supabase.from('Company').select()

  if (companyError || !company) {
    console.error(
      `An error occurred in Admin SSP:\nCompany: ${companyStatus}\n${JSON.stringify(
        companyError
      )}`
    )
    return {
      notFound: true,
    }
  }

  return {
    props: {
      companies: company,
    },
  }
}
