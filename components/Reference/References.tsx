import type { Reference as ReferenceType } from '@prisma/client'
import clsx from 'clsx'

import { Reference } from '@/components/Reference/Reference'

export const References = ({ references }: { references: ReferenceType[] }) => {
  const allReferences = references.reduce((acc, reference) => {
    const columnIndex = Number.parseInt(reference.order.toString().charAt(0))

    if (!acc[columnIndex]) {
      acc[columnIndex] = []
    }

    acc[columnIndex].push(reference)

    return acc
  }, [] as ReferenceType[][])

  return (
    <ul
      role="list"
      className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-8 px-4 lg:max-w-7xl lg:grid-cols-3 lg:px-8">
      {allReferences
        .map((column) => column[0])
        .map((reference, referenceIndex) => (
          <li key={referenceIndex} className="lg:hidden">
            <Reference {...reference} />
          </li>
        ))}
      {allReferences.map((column, columnIndex) => (
        <li key={columnIndex}>
          <ul role="list">
            {column.map((reference, referenceIndex) => (
              <li
                key={referenceIndex}
                className={clsx(
                  referenceIndex === 0 && 'hidden lg:list-item',
                  referenceIndex === 1 && 'lg:mt-8',
                  referenceIndex > 1 && 'mt-8'
                )}>
                <Reference {...reference} />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
