import clsx from 'clsx'
import type { ElementType, ReactNode } from 'react'

import { type ContainerProps } from '@/utils/dynamic'

type Props = {
  children?: ReactNode
}

export default function Container<C extends ElementType = 'div'>({
  className,
  as,
  ...props
}: ContainerProps<C, Props>) {
  const Component = as || 'div'
  return (
    <Component
      className={clsx('mx-auto md:max-w-2xl', className)}
      {...props}
    />
  )
}
