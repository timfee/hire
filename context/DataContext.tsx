/* eslint-disable react/display-name */
import type { NextPage } from 'next'
import { createContext, useContext } from 'react'

import type { ResumePageProps } from '@/pages/[slug]/[code]'

const DataContext = createContext<ResumePageProps | null>(null)

export const useData = () => {
  const dataContext = useContext(DataContext)
  if (!dataContext) {
    throw new Error('useData has to be used within <DataContext.Provider>')
  }

  return dataContext
}

export const withData =
  (Component: NextPage<ResumePageProps>) => (props: ResumePageProps) =>
    (
      <DataContext.Provider
        value={!props || !props.company || !props.references ? null : props}>
        <Component {...props} />
      </DataContext.Provider>
    )

export default DataContext
