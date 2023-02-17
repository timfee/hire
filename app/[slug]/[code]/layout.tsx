import { ReactNode } from 'react'

import { BrandStrip } from '@/components'
import { getCompanyData } from '@/helpers'

import { CompanyPageParams } from './page'

export default async function Layout({
  children,
  params,
}: CompanyPageParams & { children: ReactNode }) {
  const companyData = await getCompanyData(
    params.slug ?? undefined,
    params.code ?? undefined
  )

  if (!companyData) {
    return <>{children}</>
  }
  return (
    <>
      <BrandStrip color={companyData.color} />
      {children}
    </>
  )
}
