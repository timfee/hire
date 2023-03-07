import { type ParsedUrlQuery } from 'querystring'

import { type FC, useEffect, useState } from 'react'

import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import { type GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import superjson from 'superjson'

import {
  useEditorContext,
  withEditorContext,
} from '@/components/admin/EditorContext'
import Input from '@/components/admin/Input'
import BrandLookup from '@/components/admin/lookup'
import Container from '@/components/Container'
import { type AppRouter } from '@/server/api/root'
import { type Company, createSupabaseServerClient } from '@/utils/supabase'

export type EditorProps = { company?: Company }

const Editor: FC<EditorProps> = ({ company: originalCompany }) => {
  const router = useRouter()
  const { state } = useEditorContext()
  const client = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: '/api/trpc',
      }),
    ],
    transformer: superjson,
  })

  return (
    <Container className="bg-slate-200">
      <BrandLookup />
      <form
        className="pb-8"
        onSubmit={(e) => {
          e.preventDefault()

          client.company.save
            .query({
              action: originalCompany ? 'update' : 'create',
              company: {
                ...(state.company as Company),
                ...(originalCompany && originalCompany.slug
                  ? { originalSlug: originalCompany.slug }
                  : {}),
              },
            })
            .then(() => {
              void router.reload()
            })
            .catch((error) => {
              console.error(error)
            })
        }}>
        <fieldset className="mb-4 flex space-x-4">
          <Input
            fieldName="company.name"
            title="Name"
          />
          <Input
            fieldName="lookup.role"
            title="Role"
          />
        </fieldset>
        <fieldset className="mb-4 flex  space-x-4">
          <Input
            fieldName="company.slug"
            title="Slug"
          />
          <Input
            fieldName="company.code"
            title="Code"
          />
          <Input
            fieldName="company.color"
            title="Color"
          />
        </fieldset>

        <fieldset className="mb-4 flex space-x-4">
          <Input
            title="Logo"
            fieldName="company.logoUrl"
          />
        </fieldset>
        <fieldset className="mb-4 flex-col space-y-4">
          <Input
            as="textarea"
            withAi
            title="Resume Message"
            fieldName="company.resumeMessage"
            rows={10}
          />
          <Input
            as="textarea"
            withAi
            title="Website Message"
            fieldName="company.websiteMessage"
            rows={10}
          />
        </fieldset>
        {originalCompany && (
          <div>
            <span>
              <a
                href={`/${originalCompany.slug}/${originalCompany.code}`}
                target="_blank"
                className=" focus:slate-indigo-500 mr-2 rounded-md border border-transparent bg-lime-800 px-1 py-0.5 text-sm font-medium text-white shadow-sm hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
                rel="noreferrer">
                View site
              </a>
              {(originalCompany.resumeUrl && (
                <a
                  target="_blank"
                  href={originalCompany.resumeUrl}
                  className=" focus:slate-indigo-500 mr-2 rounded-md border border-transparent bg-lime-800 px-1 py-0.5 text-sm font-medium text-white shadow-sm hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  rel="noreferrer">
                  Resume
                </a>
              )) ||
                'No resume was '}
              last generated:
            </span>
            {originalCompany &&
            originalCompany.resumeUrl &&
            originalCompany.resumeLastGenerated &&
            typeof originalCompany.resumeLastGenerated === 'string' ? (
              <NoSsr>
                <>
                  {typeof window !== 'undefined' &&
                    new Date(
                      originalCompany.resumeLastGenerated
                    ).toLocaleString('en-US', {
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      month: 'short',
                      second: 'numeric',
                      year: 'numeric',
                    })}
                </>
              </NoSsr>
            ) : (
              <>Never</>
            )}
            <button
              className=" ml-5 rounded-md border border-transparent bg-slate-600 px-2 py-1 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => {
                client.company.regenerate
                  .query({
                    slug: originalCompany.slug,
                  })
                  .then(() => {
                    router
                      .push('/admin/editor?slug=' + originalCompany.slug)
                      .catch((error) => {
                        console.error(error)
                      })
                  })
                  .catch((error) => {
                    alert('error, check console logs')
                    console.error(error)
                  })
              }}>
              Regenerate
            </button>
          </div>
        )}
        <button
          type="submit"
          className="mx-auto mt-5 flex w-fit items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Submit
        </button>
      </form>
    </Container>
  )
}

export default withEditorContext(Editor)

type PageData = { company?: Company }
type ParsedUrlQueryWithKey = ParsedUrlQuery & { query: { slug: string } }

export const getServerSideProps: GetServerSideProps<
  PageData,
  ParsedUrlQueryWithKey
> = async ({ query }) => {
  if (!query || !query.slug) {
    return {
      props: {},
    }
  }

  const supabase = createSupabaseServerClient()
  const { slug } = query

  const { data, error, statusText } = await supabase
    .from('Company')
    .select()
    .eq('slug', slug)
    .single()

  if (error || !data) {
    console.error(error, statusText)
    return {
      notFound: true,
    }
  }

  return {
    props: {
      company: data,
    },
  }
}

function NoSsr({ children = <></>, defer = false, fallback = null }) {
  const [mountedState, setMountedState] = useState(false)

  useEffect(() => {
    if (!defer) {
      setMountedState(true)
    }
  }, [defer])

  useEffect(() => {
    if (defer) {
      setMountedState(true)
    }
  }, [defer])

  // We need the Fragment here to force react-docgen to recognise NoSsr as a component.
  return <>{mountedState ? children : fallback}</>
}
