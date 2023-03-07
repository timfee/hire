import colors from 'tailwindcss/colors'

import { format, OT_FEATURES } from './shared'
import resume from '../resume.json'

export default function generateEducation(doc: PDFKit.PDFDocument) {
  // #region  Education
  const { y } = doc

  format
    .education(doc)
    .text(`${resume.education[0].studyType}, ${resume.education[0].area}`, {
      characterSpacing: -0.25,
      features: OT_FEATURES,
    })
  format
    .highlight(doc)
    .text(
      `${resume.education[0].institution} (${new Date(
        resume.education[0].endDate
      ).getFullYear()})`,
      {
        characterSpacing: -0.2,
        features: OT_FEATURES,
      }
    )
  // #endregion

  // #region Endorsement
  const MOM_QUOTE = '“Pretty good with computers”'
  const MOM_BYLINE = '—Tim’s mom'

  format.education(doc).text(
    MOM_QUOTE,
    doc.page.width -
      doc.page.margins.right -
      doc.widthOfString(MOM_QUOTE, {
        characterSpacing: -0.25,
        features: OT_FEATURES,
      }),
    y,

    {
      width: doc.widthOfString(MOM_QUOTE, {
        characterSpacing: -0.25,
        features: OT_FEATURES,
      }),
      characterSpacing: -0.25,
      features: OT_FEATURES,
    }
  )
  format.highlight(doc).text(
    MOM_BYLINE,
    doc.page.width -
      doc.page.margins.right -
      doc.widthOfString(MOM_BYLINE, {
        characterSpacing: -0.1,
        features: OT_FEATURES,
      }),
    doc.y,
    {
      characterSpacing: -0.2,
      features: OT_FEATURES,
    }
  )
  // #endregion
  doc.moveDown(1.5)

  // #region Mantra
  const MANTRA_INTRO = 'Three words I live by'
  const MANTRA = '“Clarity over comfort”'
  const MANTRA_DETAILS = `Sometimes it can be hard to speak up, especially when the pressure is on or anxieties are high. These are precisely the times to take a deep breath and push through the discomfort to make yourself heard.
Like most things in life, this is a learned practice—one I strive to develop in myself and bring to the teams I support.`

  format
    .mantraintro(doc)
    .text(MANTRA_INTRO, doc.page.margins.left, doc.y, {
      characterSpacing: -0.25,
      features: OT_FEATURES,
    })
    .moveDown(0.25)

  format
    .mantra(doc)
    .roundedRect(
      doc.x,
      doc.y,
      doc.widthOfString(MANTRA, {
        characterSpacing: -0.25,
        features: OT_FEATURES,
      }),
      doc.heightOfString(MANTRA, {
        characterSpacing: -0.25,
        features: OT_FEATURES,
      }),
      4
    )
    .fill(colors.yellow[100])

  format
    .mantra(doc)
    .text(MANTRA, { characterSpacing: -0.2, features: OT_FEATURES })
    .moveDown(0.25)

  format.mantradetails(doc).text(MANTRA_DETAILS, {
    characterSpacing: -0.2,
    features: OT_FEATURES,
    paragraphGap: 8,
    lineGap: 1,
    width: doc.page.width - 3 * doc.page.margins.right,
  })

  // #endregion
}
