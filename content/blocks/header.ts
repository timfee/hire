import colors from 'tailwindcss/colors'

import { format, highlight, OT_FEATURES } from './shared'
import resume from '../resume.json'

export default function generateHeader(doc: PDFKit.PDFDocument) {
  format.name(doc, colors.slate['800']).text(resume.basics.name, {
    characterSpacing: -1.5,
    features: OT_FEATURES,
  })

  format.paragraph(doc).moveDown(0.3)

  format.intro(doc).text(resume.basics.email, doc.x, doc.y - 20, {
    width: doc.page.width - doc.page.margins.right - doc.page.margins.left,
    align: 'right',
  })

  format.paragraph(doc).moveDown(0.5)

  highlight(doc, resume.basics.summary, {
    charsPerLine: 75,
    color: colors.yellow['100'],
    format: 'intro',
    lineSpacing: 16,
    textOptions: {
      characterSpacing: -0.5,
      features: OT_FEATURES,
    },
  })
}
