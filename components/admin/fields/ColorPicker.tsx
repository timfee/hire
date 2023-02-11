import { RadioGroup } from '@headlessui/react'

import { useEditorContext } from '@/components/admin/EditorContext'
import { classNames } from '@/lib/functions'

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
                classNames(
                  active && checked ? 'ring ring-offset-1' : '',
                  !active && checked ? 'ring-2' : '',
                  '-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none'
                )
              }>
              <span
                aria-hidden="true"
                style={{ backgroundColor: color.hex }}
                className={classNames(
                  'h-8 w-8 border border-black border-opacity-10 rounded-full'
                )}
              />
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}
