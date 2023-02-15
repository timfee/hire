import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import clsx from 'clsx'
import type { ElementType, ReactNode } from 'react'
import superjson from 'superjson'

import { type AppRouter } from '@/server/api/root'
import { type ContainerProps, type NestedKeyOf } from '@/utils/dynamic'

import { useEditorContext, type State } from '../../contexts/EditorContext'

type Props = {
  children?: ReactNode
  fieldName: NestedKeyOf<State>
  withAi?: boolean
}

const Input = <C extends ElementType = 'div'>({
  className,
  withAi,
  as,
  title,
  fieldName,
  ...props
}: ContainerProps<C, Props>) => {
  const Component = as || 'input'

  const { state, dispatch } = useEditorContext()

  const path = fieldName.split('.')

  const value = path.reduce((prev: State[keyof State], cur) => {
    return prev[cur as keyof State[keyof State]]
  }, state as State[keyof State]) as string

  const computedProps = {
    type: 'text',
  }

  const fieldLeafNode = fieldName.split('.').pop() ?? ''

  return (
    <div className="flex-grow">
      {title && (
        <label
          htmlFor={`id-${fieldName}`}
          className="block text-sm font-medium text-gray-700">
          {title}
        </label>
      )}
      <div className="relative mt-1 rounded-md shadow-sm">
        <Component
          name={fieldName}
          id={`id-${fieldName}`}
          value={value ?? ''}
          onChange={(e) => {
            dispatch({
              payload: { fieldName, value: e.target.value },
              type: 'update',
            })
          }}
          className={clsx(
            'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
            className
          )}
          {...computedProps}
          {...props}
        />
      </div>
      {withAi && (
        <div className="mt-2 text-right">
          <button
            className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-20"
            disabled={state.status === 'busy'}
            onClick={(e) => {
              e.preventDefault()
              const client = createTRPCProxyClient<AppRouter>({
                links: [
                  httpBatchLink({
                    url: '/api/trpc',
                  }),
                ],
                transformer: superjson,
              })

              if (!state.company.name) {
                return
              }

              dispatch({ payload: 'busy', type: 'update_status' })

              client.ai.get
                .query({
                  company: state.company.name,
                  field: fieldLeafNode,
                  role: state.lookup.role ?? '',
                })
                .then((result) => {
                  dispatch({
                    payload: { [fieldLeafNode]: result },
                    type: 'update_company',
                  })
                })
                .catch((e) => {
                  alert('error generating AI, check console')
                  console.log(e)
                })
                .finally(() => {
                  dispatch({ payload: 'ready', type: 'update_status' })
                })
            }}>
            Generate
          </button>
        </div>
      )}
    </div>
  )
}

export default Input
