import type { Company } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/lib/prisma'
import { generateResumePacket } from '@/lib/resume'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') return res.status(405).end()
  if (
    !req.query.code ||
    !req.query.slug ||
    typeof req.query.code !== 'string' ||
    typeof req.query.slug !== 'string'
  ) {
    return res.status(400).end()
  }
  const { code, slug } = req.query

  try {
    const { name, png } = await getCompanyData({ code, slug })
    const resumeData = await generateResumePacket({ code, slug, png, name })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Length', resumeData.length)

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Tim Feeley Resume - ${name}.pdf"`
    )

    await prisma.hit.create({
      data: {
        ip: req.headers['x-forwarded-for']?.toString() || 'unk',
        companySlug: slug,
      },
    })
    // Send the PDF data to the browser
    res.end(Buffer.from(resumeData)).status(200)
  } catch {
    return res.status(404).end()
  }
}

const getCompanyData = async ({ code, slug }: Pick<Company, 'slug' | 'code'>) =>
  await prisma.company.findFirstOrThrow({
    where: {
      AND: {
        code,
        slug,
      },
    },
  })
