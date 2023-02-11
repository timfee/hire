/* eslint-disable @next/next/no-img-element */
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import {
  useEditorContext,
  withEditorContext,
} from '@/components/admin/EditorContext'
import {
  ColorPicker,
  Domain,
  Input,
  LogoPicker,
  Textarea,
} from '@/components/admin/fields'
import BigSubmit from '@/components/admin/fields/BigSubmit'
import Container from '@/components/Container'
import type { Company } from '@/types/database'

function Editor({ company }: { company?: Company }) {
  const { state, dispatch } = useEditorContext()
  const router = useRouter()
  useEffect(() => {
    if (company) {
      dispatch({ payload: company, type: 'update_company' })
      dispatch({ payload: 2, type: 'update_step' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Container size="xs" className="mt-6">
      {state.step === 1 && (
        <>
          <Domain create={company ? false : true} />
          <form
            className="my-6 border border-transparent"
            onSubmit={(e) => {
              e.preventDefault()
              dispatch({ payload: 2, type: 'update_step' })
            }}>
            <LogoPicker />
            <ColorPicker />
            <BigSubmit>Next</BigSubmit>
          </form>
        </>
      )}
      {state.step === 2 && (
        <form
          method="POST"
          onSubmit={(e) => {
            e.preventDefault()

            fetch('/api/admin/company', {
              body: JSON.stringify({
                ...state.company,
                ...(company
                  ? {
                      prevSlug: company.slug,
                    }
                  : {}),
              }),
              headers: {
                'Content-Type': 'application/json; charset=utf8',
              },
              method: company ? 'PATCH' : 'POST',
            })
              .then((data) => {
                if (data.status === 204) {
                  router.push('/admin/')
                }
              })
              .catch((err) => {
                alert('error')
                console.error(err)
              })
          }}>
          <button onClick={() => dispatch({ payload: 1, type: 'update_step' })}>
            Lookup
          </button>
          <div className="my-4 flex justify-items-stretch space-x-4">
            <Input field="slug" title="Slug" inputClassName="font-mono" />
            <Input field="code" title="Code" inputClassName="font-mono" />
            <Input field="color" title="Color" />
          </div>
          <div className="my-4 flex justify-items-stretch space-x-4">
            <Input field="name" title="Company Name" />
          </div>

          <div className="my-4 flex flex-col justify-items-stretch space-y-4">
            <Textarea field="resumeMessage" title="Resume Message" />
            <Textarea field="websiteMessage" title="Website Message" />
          </div>
          <div className="my-4 flex justify-items-stretch space-x-4">
            <Input field="logoUrl" title="Logo URL" />
          </div>
          <input
            type="submit"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          />
        </form>
      )}
    </Container>
  )
}

export default withEditorContext(Editor)
