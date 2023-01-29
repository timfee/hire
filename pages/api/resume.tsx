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
    const { name, svg } = await prisma.company.findFirstOrThrow({
      where: {
        AND: {
          code,
          slug,
        },
      },
    })
    const resumeData = await generateResumePacket({ code, slug, svg })

    // Set the content type to 'application/pdf'
    res.setHeader('Content-Type', 'application/pdf')

    const filename = `Tim Feeley Resume - ${name}.pdf`

    // Set the content disposition to 'attachment', so that the browser prompts the user to save the file
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

    // Send the PDF data to the browser
    res.end(Buffer.from(resumeData)).status(200)
  } catch {
    return res.status(404).end()
  }
}
