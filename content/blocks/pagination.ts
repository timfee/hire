import colors from 'tailwindcss/colors'

import { OT_FEATURES } from './shared'

export default function addPagination(doc: PDFKit.PDFDocument) {
  const pages = doc.bufferedPageRange()
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i)

    const oldTopMargin = doc.page.margins.top
    doc.page.margins.top = 0

    const headerString = `page ${i + 1} of ${pages.count}`

    doc
      .fillColor(colors.slate['400'])
      .fontSize(7)
      .text(
        headerString,
        doc.page.width / 2 - doc.widthOfString(headerString) / 2,
        20,
        {
          features: OT_FEATURES,
          characterSpacing: -0.1,
          width: doc.widthOfString(headerString),
        }
      )
    doc.page.margins.top = oldTopMargin // ReProtect bottom margin
  }
}
