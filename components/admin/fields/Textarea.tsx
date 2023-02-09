import type { Company } from '@prisma/client'
import clsx from 'clsx'
import type { DetailedHTMLProps, TextareaHTMLAttributes } from 'react'

import { useEditorContext } from '@/components/admin/EditorContext'

type TextareaProps = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  field: keyof Company
  outerClassName?: string
  inputClassName?: string
}

export default function Textarea({
  field,
  title,
  inputClassName,
  outerClassName,
  ...props
}: TextareaProps) {
  const { state, dispatch } = useEditorContext()
  const value = state['company'][field]?.toString() ?? ''

  return (
    <div className={clsx('grow', outerClassName)}>
      <label
        htmlFor="comment"
        className="block text-sm font-medium text-gray-700">
        {title}
      </label>
      <div className="mt-1">
        <textarea
          rows={6}
          name={field}
          onChange={(e) => {
            dispatch({
              type: 'update_company',
              payload: { [field]: e.target.value },
            })
          }}
          className={clsx(
            'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
            inputClassName
          )}
          {...props}
          value={value}
        />
      </div>
      <button
        type="button"
        disabled={state.status === 'busy'}
        onClick={() => {
          if (state.status === 'busy') return
          dispatch({ type: 'update_status', payload: 'busy' })
          fetch(
            '/api/admin/ai?field=' +
              field +
              '&company=' +
              encodeURIComponent(state.company.name ?? '')
          )
            .then((response) => {
              response
                .text()
                .then((data) => {
                  dispatch({
                    type: 'update_company',
                    payload: { [field]: data },
                  })
                })
                .catch(() => {
                  alert("Couldn't generate message")
                })
                .finally(() => {
                  dispatch({ type: 'update_status', payload: 'ready' })
                })
            })
            .catch(() => {
              alert("Couldn't contact API")
            })
            .finally(() => {
              dispatch({ type: 'update_status', payload: 'ready' })
            })
        }}
        className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-20">
        Generate
      </button>
    </div>
  )
}
