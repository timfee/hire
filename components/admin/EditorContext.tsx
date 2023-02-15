import type { Dispatch, FC, PropsWithChildren } from 'react'
import { createContext, useContext, useReducer } from 'react'

import { type EditorProps } from '@/pages/admin/editor'
import { type Color, type Logo } from '@/types/brand'
import { type NestedKeyOf } from '@/utils/dynamic'
import { type Company } from '@/utils/supabase'

export type State = {
  step: number
  status: 'ready' | 'busy'
  company: Partial<Company>
  lookup: {
    open: boolean
    role?: string
    domain?: string | null
    name?: string | null
    mission?: string | null
    logos?: Logo[] | null
    colors?: Color[] | null
  }
}

type Action =
  | {
      type: 'update'
      payload: { fieldName: NestedKeyOf<State>; value: string }
    }
  | {
      type: 'update_step'
      payload: number
    }
  | {
      type: 'update_company'
      payload: Partial<Company>
    }
  | {
      type: 'update_status'
      payload: 'ready' | 'busy'
    }
  | {
      type: 'update_lookup'
      payload: Partial<State['lookup']>
    }

const INITIAL_STATE: State = {
  company: {},
  lookup: {
    open: true,
  },

  status: 'ready',
  step: 1,
}

const EditorContext = createContext<{
  state: State
  dispatch: Dispatch<Action>
}>({
  dispatch: () => null,
  state: INITIAL_STATE,
})

export function EditorProvider({
  children,
  company,
}: PropsWithChildren<{ company?: Company }>) {
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    ...(company ? { company } : {}),
  })

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'update':
        return update(state, action.payload.fieldName, action.payload.value)

      case 'update_step':
        return {
          ...state,
          step: action.payload,
        }
      case 'update_company':
        return {
          ...state,
          company: {
            ...state.company,
            ...action.payload,
          },
        }
      case 'update_status':
        return {
          ...state,
          status: action.payload,
        }
      case 'update_lookup':
        return {
          ...state,
          lookup: {
            ...state.lookup,
            ...action.payload,
          },
        }
      default:
        return state
    }
  }

  return (
    <EditorContext.Provider value={{ dispatch, state }}>
      {children}
    </EditorContext.Provider>
  )
}

export function withEditorContext(Component: FC<EditorProps>) {
  return function EditorContextComponent(props: EditorProps) {
    return (
      <EditorProvider {...props}>
        <Component {...props} />
      </EditorProvider>
    )
  }
}

export function useEditorContext() {
  if (!useContext(EditorContext))
    throw new Error(
      'EditorContext is not defined. Did you forget to wrap your component in EditorProvider?'
    )
  return useContext(EditorContext)
}

function update(state: State, field: string, value: unknown): State {
  const keys = field.split('.')
  let current: unknown = state
  for (const key of keys.slice(0, -1)) {
    current = (current as Record<string, unknown>)[key]
  }
  const lastKey = keys[keys.length - 1]
  return {
    ...state,
    [keys[0]]: { ...(current as Record<string, unknown>), [lastKey]: value },
  }
}
