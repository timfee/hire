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
    const { name, lastUpdated, resumeLastGenerated } =
      await prisma.company.findFirstOrThrow({
        select: { name: true, lastUpdated: true, resumeLastGenerated: true },
        where: {
          AND: {
            code,
            slug,
          },
        },
      })

    let resumeData: Buffer | null = null
    if (!resumeLastGenerated || resumeLastGenerated < lastUpdated) {
      console.info(
        `** Regenerating resume for ${name} -- data last update: ${lastUpdated.toString()} -- resume last update: ${
          resumeLastGenerated ? resumeLastGenerated.toString() : '<NULL>'
        } **`
      )
      resumeData = Buffer.from(await generateResumePacket({ slug }))

      await prisma.company.update({
        where: { slug },
        data: {
          resumeLastGenerated: new Date(),
          resumeData: Buffer.from(resumeData),
        },
      })
    } else {
      resumeData = (
        await prisma.company.findFirstOrThrow({
          select: {
            resumeData: true,
          },
          where: {
            AND: {
              code,
              slug,
            },
          },
        })
      ).resumeData
    }

    if (!resumeData) {
      return res.status(400).end()
    }

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
    res.end(resumeData).status(200)
  } catch {
    return res.status(404).end()
  }
}
