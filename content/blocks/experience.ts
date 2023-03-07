import colors from 'tailwindcss/colors'

import { bgcolor, format, formatDate, highlight, OT_FEATURES } from './shared'
import resume from '../resume.json'

export default function generateExperience(doc: PDFKit.PDFDocument) {
  // #region  Work experience
  for (const job of resume.work) {
    // #region Page or section break
    if (doc.y > doc.page.height * 0.75) {
      doc.addPage()
      // Background
      bgcolor(doc, { color: colors.slate['100'] })
    } else {
      doc.moveDown(1.25)
    }
    // #endregion

    // #region Company name
    const { y } = doc
    format.company(doc).text(job.name, {
      characterSpacing: -0.5,
      features: OT_FEATURES,
    })
    // #endregion

    // #region Date range
    const dateRange = `${formatDate(job.startDate)} - ${formatDate(
      job.endDate
    )}`

    format.date(doc).text(
      dateRange,
      doc.page.width -
        doc.page.margins.right -
        doc.widthOfString(dateRange, {
          characterSpacing: -0.25,
          features: OT_FEATURES,
        }),
      y + 9,
      {
        characterSpacing: -0.25,
        features: OT_FEATURES,
      }
    )
    // #endregion
    doc.moveDown(0.5)

    // #region Job summary

    highlight(doc, job.summary, {
      charsPerLine: 70,
      color: colors.yellow[100],
      format: 'jobsummary',
      lineSpacing: 14,
      textOptions: {
        characterSpacing: -0.2,
        features: OT_FEATURES,
      },
    })

    doc.moveDown(0.6)

    // #region Highlights
    for (const highlightText of job.highlights) {
      highlight(doc, highlightText, {
        charsPerLine: 80,
        color: colors.yellow[100],
        format: 'highlight',
        lineSpacing: 13,
        textOptions: {
          characterSpacing: -0.2,
          features: OT_FEATURES,
        },
      })

      doc.moveDown(0.5)
    }
    // #endregion
  }
  // #endregion
  doc.moveDown(1)
}
