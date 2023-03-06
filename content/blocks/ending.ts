import sharp from 'sharp'
import colors from 'tailwindcss/colors'

import type { Company } from '@/utils/supabase'

import { bgcolor, format, OT_FEATURES } from './shared'

export default async function generateEnding(
  doc: PDFKit.PDFDocument,
  company: Company
) {
  doc.addPage({
    margins: {
      top: 0,
      bottom: 0,
      left: 100,
      right: 100,
    },
  })
  bgcolor(doc, { color: colors.slate['100'] }).moveDown(5)
  format
    .custom(doc, {
      font: 'bold',
      size: 26,
      color: colors.slate['500'],
    })
    .text(`Made just for you`, { align: 'center' })
    .moveDown(3)

  const png = await fetch(company.logoUrl).then((res) => res.arrayBuffer())

  const resized = await sharp(new Uint8Array(png))
    .resize({
      width: 200,
      height: 100,
      fit: 'inside',
    })
    .toBuffer()

  const metadata = await sharp(resized).metadata()
  if (!metadata?.width) {
    throw new Error('No metadata')
  }

  doc
    .image(resized, (doc.page.width - 10) / 2 - metadata.width / 2, doc.y, {
      width: metadata.width,
      height: metadata.height,
    })
    .moveDown(3)

  format
    .custom(doc, {
      font: 'bold',
      size: 26,
      color: colors.slate['500'],
    })
    .text(`... and thanks!\n\n`, doc.x, doc.y, {
      align: 'center',
    })

  format
    .paragraph(doc)
    .text(
      'I know how important it is to hire the right talent, and I hope that this gives you some more insight into who I am and how I work.\n\nIf you’re curious about how this document and portal get generated behind the scenes, you can check out:\n\n',
      {
        align: 'center',
        features: OT_FEATURES,
        characterSpacing: -0.5,
      }
    )
    .fillColor(colors.indigo['500'])
    .text('https://github.com/timfee/hire', {
      link: 'https://github.com/timfee/hire',
      align: 'center',
      features: OT_FEATURES,
    })
}
