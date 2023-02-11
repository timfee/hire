import { RadioGroup } from '@headlessui/react'

import { useEditorContext } from '@/components/admin/EditorContext'
import { classNames } from '@/lib/functions'
import type { Logo } from '@/types/brand'

export default function LogoPicker() {
  const { state, dispatch } = useEditorContext()
  if (!state.lookup || !state.lookup.logos) {
    return <></>
  }

  return (
    <div>
      <h2 className="mb-3 text-lg font-medium leading-6 text-gray-900">
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
                classNames(
                  checked ? 'border-transparent' : 'border-gray-300',
                  active ? 'border-blue-500 ring-2 ring-blue-500' : '',
                  logo.theme === 'light'
                    ? 'logo-background-dark text-white'
                    : 'logo-background-light text-slate-500',
                  'relative cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none flex justify-between'
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
                          <img alt="logo" className="max-h-6" src={logo?.src} />
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
                    className={classNames(
                      active ? 'border' : 'border-2',
                      checked ? 'border-blue-500' : 'border-transparent',
                      'pointer-events-none absolute -inset-px rounded-lg'
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
  height?: number
  width?: number
  theme?: string
  size?: number
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
