import { useEditorContext } from '@/components/admin/EditorContext'
import { getJSON } from '@/lib/functions'
import type { Brand } from '@/types/brand'

export default function Domain({ create = true }) {
  const { state, dispatch } = useEditorContext()

  return (
    <div>
      <label
        htmlFor="domain"
        className="mb-4 block text-sm font-medium text-gray-700">
        Company Domain
      </label>
      <form
        className="flex justify-items-stretch"
        onSubmit={(e) => {
          e.preventDefault()
          if (!state.lookup || !state.lookup.domain) {
            return
          }

          getJSON<Brand>(`/api/admin/brand?domain=${state.lookup.domain}`)
            .then(({ name, description, domain, colors, logos }) => {
              dispatch({
                type: 'update_lookup',
                payload: {
                  name,
                  mission: description,
                  domain,
                  colors,
                  logos,
                },
              })
              create &&
                dispatch({
                  type: 'update_company',
                  payload: {
                    name: name ?? '',
                    slug: name?.toLowerCase().replace(/ /g, '-') ?? '',
                    code: (Math.random() + 1).toString(36).substring(9),
                  },
                })
            })
            .catch((e) => {
              alert('Error looking up info, check console')
              console.error(e)
            })

          return false
        }}>
        <div className="flex grow rounded-md shadow-sm">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
            https://
          </span>
          <input
            value={state.lookup?.domain ?? ''}
            onChange={(e) => {
              dispatch({
                type: 'update_lookup',
                payload: { domain: e.target.value },
              })
            }}
            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="www.example.com"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            name="domain"
            id="domain"
            type="text"
          />
        </div>

        <button
          type="submit"
          className="ml-2 flex items-center rounded-md border border-transparent bg-blue-600 px-4  text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Search
        </button>
      </form>
    </div>
  )
}
