import type { Company } from '@prisma/client'
import type { NextPage } from 'next'
import type { FC, ReactNode } from 'react'
import { createContext, useContext } from 'react'

export type LightweightCompany = Omit<Company, 'png' | 'resumeMessage'>
const CompanyContext = createContext<LightweightCompany | null>(null)

export const useCompany = () => {
  const currentCompanyContext = useContext(CompanyContext)

  if (!currentCompanyContext) {
    throw new Error(
      'useCompany has to be used within <CompanyContext.Provider>'
    )
  }

  return currentCompanyContext
}
export function CompanyProvider({
  value,
  children,
}: {
  value: LightweightCompany
  children: ReactNode
}) {
  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  )
}
export default CompanyContext

const withCompany = (Component: React.FC<PageProps>) => (props: PageProps) =>
  (
    <CompanyContext.Provider value={props.company}>
      <Component {...props} />
    </CompanyContext.Provider>
  )
