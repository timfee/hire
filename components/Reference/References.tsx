import type { Reference as ReferenceType } from '@prisma/client'
import clsx from 'clsx'

import { Reference } from '@/components/Reference/Reference'

export const References = ({ references }: { references: ReferenceType[] }) => {
  const allReferences = chunkify<ReferenceType>(references, 3, true)

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

function chunkify<T>(a: T[], n: number, balanced: boolean): T[][] {
  if (n < 2) return [a]

  const len = a.length,
    out = []

  let i = 0,
    size

  if (len % n === 0) {
    size = Math.floor(len / n)
    while (i < len) {
      out.push(a.slice(i, (i += size)))
    }
  } else if (balanced) {
    while (i < len) {
      size = Math.ceil((len - i) / n--)
      out.push(a.slice(i, (i += size)))
    }
  } else {
    n--
    size = Math.floor(len / n)
    if (len % size === 0) size--
    while (i < size * n) {
      out.push(a.slice(i, (i += size)))
    }
    out.push(a.slice(size * n))
  }

  return out
}
