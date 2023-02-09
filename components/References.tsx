import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import type { Reference as ReferenceType } from '@/types/database'

export default function References({
  references,
}: {
  references: ReferenceType[]
}) {
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

export function Reference({
  name,
  text,
  title,
  company,
  photo,
  linkedIn,
}: ReferenceType) {
  return (
    <figure className="rounded-xl bg-white p-8 shadow-md ring-1 ring-slate-900/5">
      <blockquote className="font-serif tracking-tight text-slate-900">
        {text.split('\n').map((line, i) => (
          <p
            key={i}
            className={clsx(i > 0 ? 'mt-4 text-[0.9em] text-slate-800' : '')}>
            {line}
          </p>
        ))}
      </blockquote>
      <figcaption className="mt-6 flex items-center">
        <div className="overflow-hidden rounded-full bg-slate-50">
          <Image
            className="h-12 w-12 object-cover"
            src={`https://jxtzqpuzyqbwtwcwvmln.supabase.co/storage/v1/object/public/hire-timfeeley/references/${photo}`}
            alt=""
            width={48}
            height={48}
          />
        </div>
        <div className="ml-4">
          {linkedIn && (
            <Link href={linkedIn} target="_blank" rel="noreferrer">
              <div className="flex items-baseline text-base font-medium text-[#0077B5] underline">
                <p className="font-semibold">{name}</p>
                <svg
                  className="ml-2 h-3 w-3 text-[#0077B5]"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlSpace="preserve"
                  viewBox="0 0 310 310">
                  <path
                    fill="currentColor"
                    d="M72.2 99.7H9.9a5 5 0 0 0-5 5v200a5 5 0 0 0 5 5h62.3a5 5 0 0 0 5-5v-200a5 5 0 0 0-5-5zM41 .3a41 41 0 1 0 .1 82.2 41 41 0 0 0 0-82.2zM230.5 94.8a73 73 0 0 0-54.7 23v-13a5 5 0 0 0-5-5h-59.6a5 5 0 0 0-5 5v199.9a5 5 0 0 0 5 5h62a5 5 0 0 0 5-5v-99c0-33.3 9.1-46.3 32.4-46.3 25.3 0 27.3 20.8 27.3 48v97.3a5 5 0 0 0 5 5H305a5 5 0 0 0 5-5V195c0-49.6-9.5-100.2-79.5-100.2z"
                  />
                </svg>
              </div>
              <div className="mt-0 text-xs text-slate-600">
                {title}, {company}
              </div>
            </Link>
          )}
          {!linkedIn && (
            <>
              <div className="flex items-baseline text-base font-medium text-slate-900">
                {name}
              </div>
              <div className="mt-0 text-xs text-slate-600">
                {title}, {company}
              </div>
            </>
          )}
        </div>
      </figcaption>
    </figure>
  )
}
