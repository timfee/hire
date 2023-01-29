import type { Company } from '@prisma/client'

import prisma from '@/lib/prisma'

export default async function Head({
  params: { slug, code },
}: {
  params: Pick<Company, 'code' | 'slug'>
}) {
  const companyData = await getCompanyData({ slug, code })
  const title = `Tim Feeley ${
    companyData ? ' & ' + companyData.name + ' = ❤️' : ''
  }`
  return (
    <>
      <title>{title}</title>
      <link rel="icon" href="/favicon.svg" />
    </>
  )
}

const getCompanyData = async ({
  slug,
  code,
}: Pick<Company, 'code' | 'slug'>) => {
  return await prisma.company.findFirst({
    where: {
      AND: {
        slug,
        code,
      },
    },
  })
}
