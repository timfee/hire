import { RadioGroup } from '@headlessui/react'
import clsx from 'clsx'

import { useEditorContext } from '@/components/admin/EditorContext'
import type { Logo } from '@/types/brand'

export default function LogoPicker() {
  const { state, dispatch } = useEditorContext()
  if (!state.lookup || !state.lookup.logos) {
    return <></>
  }

  return (
    <div>
      <h2 className="mt-6 mb-3 text-lg font-medium leading-6 text-gray-900">
        Choose a logo
      </h2>
      <RadioGroup
        value={state.company.logoUrl}
        onChange={(value: string) => {
          dispatch({
            payload: { logoUrl: value },
            type: 'update_company',
          })
        }}>
        <div className="space-y-4">
          {singleArrayOfLogos(state.lookup.logos).map((logo, logoIdx) => (
            <RadioGroup.Option
              key={`logo-${logoIdx}`}
              value={logo?.src}
              className={({ checked, active }) =>
                clsx(
                  'relative flex cursor-pointer justify-between rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none',
                  {
                    'border-blue-500 ring-2 ring-blue-500': active,
                    'border-gray-300': !checked,
                    'border-transparent': checked,

                    'logo-background-dark text-white': logo.theme === 'light',
                    'logo-background-light text-slate-500':
                      logo.theme !== 'light',
                  }
                )
              }>
              {({ active, checked }) => (
                <>
                  <span className="flex items-center">
                    <span className="flex flex-col text-sm">
                      <RadioGroup.Label
                        as="span"
                        className="font-medium text-gray-900">
                        {logo.src && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            alt="logo"
                            className="max-h-6"
                            src={logo?.src}
                          />
                        )}
                      </RadioGroup.Label>
                      <RadioGroup.Description
                        as="span"
                        className="text-gray-500"></RadioGroup.Description>
                    </span>
                  </span>
                  <RadioGroup.Description
                    as="span"
                    className="mt-2 flex items-center">
                    {logo.width && (
                      <span className="text-xs ">{`${logo.width} x`}</span>
                    )}
                    {logo.height && (
                      <span className="text-xs ">{`${logo.height}`}</span>
                    )}
                    {logo.size && (
                      <span className="ml-2 text-xs ">{` • ${logo.size} kb`}</span>
                    )}
                  </RadioGroup.Description>
                  <span
                    className={clsx(
                      'pointer-events-none absolute -inset-px rounded-lg',
                      {
                        border: active,
                        'border-2': !active,
                        'border-blue-500': checked,
                        'border-transparent': !checked,
                      }
                    )}
                    aria-hidden="true"
                  />
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}

type SingleArrayOfLogos = {
  src?: string
  format?: string
  height?: number | null
  width?: number | null
  theme?: string
  size?: number | null
}

function singleArrayOfLogos(logos: Logo[]) {
  return logos
    .filter((logo) => logo.formats)
    .reduce((acc, logo) => {
      if (logo.formats) {
        const theme = logo.theme ?? undefined
        const newFormat = logo.formats
          .filter((logo) => logo.format === 'png')
          .map(({ src, format, height, width, size }) => ({
            format,
            height,
            size: size ? Math.round(size / 1000) : undefined,
            src,
            theme,
            width,
          }))
        return acc.concat(newFormat)
      } else {
        return []
      }
    }, [] as SingleArrayOfLogos[])
}
