import clsx from 'clsx'
import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

export default function BigSubmit({
  className,
  children,
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      {...props}
      type="submit"
      className={clsx(
        'mt-4 mb-10 flex w-full items-center rounded-md border border-transparent bg-green-600 p-4 text-center  text-lg font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
        className
      )}>
      {children ?? 'Submit'}
    </button>
  )
}
