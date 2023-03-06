import colors from 'tailwindcss/colors'

export const OT_FEATURES: PDFKit.Mixins.OpenTypeFeatures[] = [
  'ss01',
  'ss02',
  'ss09',
  'ss10',
  'kern',
  'calt',
  'liga',
]

export const format = {
  custom: (
    doc: PDFKit.PDFDocument,
    {
      font = 'standard',
      size = 20,
      color = colors.black,
    }: { font: string; size: number; color: string }
  ) => doc.font(font).fontSize(size).fillColor(color),
  name: (doc: PDFKit.PDFDocument, color: string) =>
    doc.font('black').fontSize(38).fillColor(color),
  standard: (doc: PDFKit.PDFDocument) =>
    doc.font('standard').fontSize(14).fillColor(colors.slate['800']),
  intro: (doc: PDFKit.PDFDocument) =>
    doc.font('medium').fontSize(13).fillColor(colors.slate['800']),
  paragraph: (doc: PDFKit.PDFDocument) =>
    doc.font('medium').fontSize(15).fillColor(colors.slate['800']),
  company: (doc: PDFKit.PDFDocument) =>
    doc.font('bold').fontSize(17).fillColor(colors.slate['500']),
  date: (doc: PDFKit.PDFDocument) =>
    doc.font('medium').fontSize(9).fillColor(colors.slate['400']),
  jobsummary: (doc: PDFKit.PDFDocument) =>
    doc.font('medium').fontSize(12).fillColor(colors.slate['700']),
  highlight: (doc: PDFKit.PDFDocument) =>
    doc.font('standard').fontSize(10).fillColor(colors.slate['800']),
  education: (doc: PDFKit.PDFDocument) =>
    doc.font('bold').fontSize(10).fillColor(colors.slate['500']),
  mantraintro: (doc: PDFKit.PDFDocument) =>
    doc.font('bold').fontSize(9).fillColor(colors.slate['600']),
  mantra: (doc: PDFKit.PDFDocument) =>
    doc.font('black').fontSize(14).fillColor(colors.slate['700']),
  mantradetails: (doc: PDFKit.PDFDocument) =>
    doc.font('standard').fontSize(9).fillColor(colors.slate['800']),
}

export function bgcolor(doc: PDFKit.PDFDocument, style: { color: string }) {
  return doc.rect(0, 0, doc.page.width, doc.page.height).fill(style.color)
}

export function highlight(
  doc: PDFKit.PDFDocument,
  text: string,
  settings: {
    charsPerLine: number
    y?: number
    x?: number
    lineSpacing: number
    format: keyof typeof format
    textOptions: PDFKit.Mixins.TextOptions
    color: string
  }
) {
  let y = settings?.y ?? doc.y
  const textArray = saveSplitStringIntoLines(text, settings.charsPerLine)

  for (const line of textArray) {
    const numUnderscores = line.match(/_/gu)?.length ?? 0

    if (Array.isArray(numUnderscores) && numUnderscores.length % 2 !== 0) {
      throw new Error(
        `Malformed text: ${line}. There should be either 0 _s, or an even number of _s.`
      )
    }

    let match

    if (settings.format === 'custom' || settings.format === 'name') {
      throw new Error('Incompatible format')
    }
    const x = settings?.x ?? format[settings.format](doc).page.margins.left

    const matchRegexp = /_.*?_/gu
    // Find and draw the highlights
    while ((match = matchRegexp.exec(line)) !== null) {
      const matchStartIndex = match.index + 1
      const matchText = match[0].replaceAll('_', ' ')

      const matchTextWidth = doc.widthOfString(matchText, settings.textOptions)
      const matchTextX =
        x +
        doc.widthOfString(
          line.replaceAll('_', ' ').slice(0, Math.max(0, matchStartIndex - 1)),
          settings.textOptions
        )

      const height = doc.heightOfString(matchText)
      const rectY = y + 0.5
      doc
        .roundedRect(matchTextX, rectY, matchTextWidth, height, 4)
        .fill(settings.color)
    }

    format[settings.format](doc).text(
      line.replaceAll('_', ' '),
      x,
      y,
      settings.textOptions
    )

    y += settings.lineSpacing
  }

  return doc
}

export const saveSplitStringIntoLines = (
  input: string,
  charsPerLine: number
): string[] => {
  const words = input.split(/\s+/u)
  const lines = []
  let line = ''

  for (const word of words) {
    if (line.length + word.length + 1 <= charsPerLine) {
      line += `${word} `
    } else {
      lines.push(line.trim())
      line = `${word} `
    }
  }

  if (line.length > 0) {
    lines.push(line.trim())
  }

  for (let i = 0; i < lines.length; i++) {
    // calculate how many _s are in the line.
    const underscores = (lines[i].match(/_/gu) ?? []).length
    if (underscores % 2 === 1) {
      lines[i] += '_'
      lines[i + 1] = `_${lines[i + 1]}`
    }
  }

  return lines
}

export const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
