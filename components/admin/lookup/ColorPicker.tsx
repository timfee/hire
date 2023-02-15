import { RadioGroup } from '@headlessui/react'
import clsx from 'clsx'

import { useEditorContext } from '@/contexts/EditorContext'

export default function ColorPicker() {
  const { state, dispatch } = useEditorContext()
  if (!state.lookup || !state.lookup.colors) {
    return <></>
  }

  return (
    <div>
      <h2 className="my-4 text-lg font-medium leading-6 text-gray-900">
        Choose a color
      </h2>
      <RadioGroup
        value={state.company.color}
        onChange={(value: string) => {
          dispatch({
            payload: {
              color: value,
            },
            type: 'update_company',
          })
        }}>
        <div className="mt-4 flex items-center space-x-3">
          {state.lookup.colors.map((color) => (
            <RadioGroup.Option
              key={color.hex}
              title={color.type}
              value={color.hex}
              className={({ active, checked }) =>
                clsx(
                  'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none',
                  {
                    'ring ring-offset-1': active && checked,
                    'ring-2': !active && checked,
                  }
                )
              }>
              <span
                aria-hidden="true"
                style={{ backgroundColor: color.hex }}
                className={clsx(
                  'h-8 w-8 rounded-full border border-black border-opacity-10'
                )}
              />
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}
