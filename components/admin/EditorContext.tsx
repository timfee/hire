import type { Company } from '@prisma/client'
import type { Dispatch, PropsWithChildren } from 'react'
import { createContext, useContext, useReducer } from 'react'

import type { Color, Logo } from '@/types/brand'

type State = {
  step: number
  company: Partial<Company>
  status: 'ready' | 'busy'
  lookup?: {
    domain?: string
    name?: string
    mission?: string
    logos?: Logo[]
    colors?: Color[]
  }
}

type Action =
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
  step: 1,
  status: 'ready',
  company: {},
}

const EditorContext = createContext<{
  state: State
  dispatch: Dispatch<Action>
}>({
  state: INITIAL_STATE,
  dispatch: () => null,
})

export function EditorProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  function reducer(state: State, action: Action): State {
    switch (action.type) {
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
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  )
}

export function withEditorContext(Component: any) {
  return function EditorContextComponent(props: any) {
    return (
      <EditorProvider>
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
