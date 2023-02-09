import clsx from 'clsx'
import type { DetailedHTMLProps, InputHTMLAttributes } from 'react'

import { useEditorContext } from '@/components/admin/EditorContext'
import type { Company } from '@/types/database'

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  field: keyof Company
  outerClassName?: string
  inputClassName?: string
}

export default function Input({
  field,
  title,
  outerClassName,
  inputClassName,
  ...props
}: InputProps) {
  const { state, dispatch } = useEditorContext()
  const value = state['company'][field]?.toString() ?? ''
  return (
    <div className={clsx('grow', outerClassName)}>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {title}
      </label>
      <div className="flex justify-items-stretch">
        <input
          {...props}
          value={value}
          onChange={(e) => {
            dispatch({
              type: 'update_company',
              payload: { [field]: e.target.value },
            })
          }}
          className={clsx(
            'block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500',
            inputClassName
          )}
        />
      </div>
    </div>
  )
}
