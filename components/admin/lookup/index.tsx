import { Disclosure } from '@headlessui/react'
import { ArrowDownCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import { type FormEventHandler } from 'react'
import superjson from 'superjson'

import { type AppRouter } from '@/server/api/root'

import { useEditorContext } from '../../../contexts/EditorContext'
import Input from '../Input'
import ColorPicker from './ColorPicker'
import LogoPicker from './LogoPicker'

const BrandLookup = () => {
  const { dispatch, state } = useEditorContext()

  const client = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: '/api/trpc',
      }),
    ],
    transformer: superjson,
  })

  const lookup: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (state.lookup.domain) {
      client.brand.get
        .query({
          domain: state.lookup.domain,
        })
        .then((payload) => {
          if (!payload) {
            return
          }
          dispatch({ payload, type: 'update_lookup' })
          dispatch({ payload, type: 'update_company' })
        })
        .catch((e) => {
          alert(e)
        })
    }
  }

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full items-center justify-between rounded-lg bg-blue-100 px-4 py-2 text-left  font-medium text-blue-900 hover:bg-blue-200  focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
            <span>Brand Lookup</span>
            {open ? (
              <XCircleIcon className="h-6 w-6" />
            ) : (
              <ArrowDownCircleIcon className="h-6 w-6" />
            )}
          </Disclosure.Button>

          <Disclosure.Panel className="bg-blue-100">
            {({ close }) => (
              <form
                onSubmit={lookup}
                className="px-4 pb-6">
                <Input
                  className="font-mono"
                  placeholder="example.com"
                  fieldName="lookup.domain"
                />
                <button
                  type="submit"
                  className="mt-2 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Lookup
                </button>
                <LogoPicker />
                <ColorPicker />
                {state.lookup.name && (
                  <button
                    onClick={() => close()}
                    className="mt-4 flex w-full items-center justify-between rounded-lg bg-blue-200 px-4 py-2 text-left  font-medium text-blue-900 hover:bg-blue-200  focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                    <span>Close</span>
                  </button>
                )}
              </form>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
export default BrandLookup
