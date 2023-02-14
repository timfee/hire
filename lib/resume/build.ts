import fontkit from '@pdf-lib/fontkit'
import fs from 'fs'
import type { PDFPage, PDFPageDrawTextOptions } from 'pdf-lib'
import {
  breakTextIntoLines,
  PDFDocument,
  PDFName,
  PDFString,
  rgb,
  setCharacterSpacing,
} from 'pdf-lib'
import { cwd } from 'process'

import { SIGNATURE_PATH } from '@/lib/resume/Signature'
import { createStandardClientWithRoleAccount } from '@/lib/supabase-server'
import type { Company } from '@/types/database'

const SOURCE_DIR = `${cwd()}/lib/resume/`
const FONTS_DIR = `${SOURCE_DIR}/fonts/`
const FONTS = ['Inter-Medium.otf', 'Inter-Bold.otf']

const INTRO_PAGE_PDF = '1.pdf'
const INTRO_PAGE_LEFT_MARGIN = 106
const INTRO_PAGE_TOP_MARGIN = 269

const STATIC_PAGE_PDFS = ['2.pdf', '3.pdf']

const LAST_PAGE_PDF = '4.pdf'

const getStaticPages = async () => {
  return Promise.all(
    STATIC_PAGE_PDFS.map(async (file) => {
      return await PDFDocument.load(
        fs.readFileSync(`${cwd()}/lib/resume/` + file)
      )
    })
  )
}

export const generateResumePacket = async ({ slug }: Pick<Company, 'slug'>) => {
  const supabase = createStandardClientWithRoleAccount()

  const { data } = await supabase
    .from('Company')
    .select()
    .eq('slug', slug)
    .single()

  if (!data) {
    throw new Error('missing company ' + slug)
  }
  const { logoUrl, name, resumeMessage, code } = data

  const introPage = await buildFirstPage({ code, name, resumeMessage, slug })
  const packet = await PDFDocument.create()

  const documents = [
    introPage,
    ...(await getStaticPages()),
    // Only add the last page if we have a PNG
  ]
  if (logoUrl) {
    documents.push(await buildLastPage({ logoUrl }))
  }

  for (const doc of documents) {
    const pages = await packet.copyPages(doc, doc.getPageIndices())
    pages.forEach((page) => {
      packet.addPage(page)
    })
  }

  packet.setAuthor('Tim Feeley')
  packet.setTitle('Tim Feeley’s Resume for ' + name)
  packet.setLanguage('en-US')
  packet.setKeywords(['resume', 'tim feeley', 'product manager', 'ux'])
  packet.setCreator('hire.timfeeley.com')
  packet.setProducer('hire.timfeeley.com')
  packet.setSubject('A very special resume from Tim Feeley for ' + name + '!')

  return await packet.save()
}

const buildLastPage = async ({
  logoUrl,
}: Required<Pick<Company, 'logoUrl'>>) => {
  const pdfDoc = await PDFDocument.load(
    fs.readFileSync(`${cwd()}/lib/resume/` + LAST_PAGE_PDF)
  )
  if (!logoUrl) {
    throw Error('Missing logoUrl')
  }
  const png = await fetch(logoUrl).then((res) => res.arrayBuffer())

  if (png) {
    const page = pdfDoc.getPages()[0]

    const { width } = page.getSize()

    const pngImage = await pdfDoc.embedPng(png)
    const pngDims = pngImage.scaleToFit(150, 150)

    page.drawImage(pngImage, {
      height: pngDims.height,
      width: pngDims.width,
      x: width / 2 - pngDims.width / 2,
      y: 515 - pngDims.height / 2,
    })
  }

  return pdfDoc
}

const buildFirstPage = async ({
  name,
  resumeMessage,
  slug,
  code,
}: Pick<Company, 'name' | 'resumeMessage' | 'slug' | 'code'>) => {
  const pdfDoc = await PDFDocument.load(
    fs.readFileSync(`${cwd()}/lib/resume/` + INTRO_PAGE_PDF)
  )
  // These order of these font names must match the order
  // of the fonts in the FONTS array to render properly.
  const [INTER_MEDIUM, INTER_BOLD] = await provideFonts(pdfDoc)

  // Prepare the blocks of text we want to add to the first page.
  const message = [
    {
      color: rgb(71 / 255, 85 / 255, 105 / 255),
      font: INTER_BOLD,
      padding: 20,
      size: 20,
      text: `Hello ${name},`,
    },
    {
      color: rgb(71 / 255, 85 / 255, 105 / 255),
      font: INTER_MEDIUM,
      padding: 16,
      size: 16,
      text: 'I’m a PM & UX leader with two decades of experience developing high-performing teams and delivering impactful products used by billions of people.',
    },
    ...(resumeMessage
      ? resumeMessage.split('\n').map((paragraph) => {
          return {
            color: rgb(71 / 255, 85 / 255, 105 / 255),
            font: INTER_MEDIUM,
            padding: 12,
            size: 16,
            text: paragraph,
          }
        })
      : []),
    {
      color: rgb(29 / 255, 78 / 255, 216 / 255),
      font: INTER_MEDIUM,
      link: `https://hire.timfeeley.com/${slug}/${code}`,
      size: 16,
      text: `https://hire.timfeeley.com/${slug}/${code}`,
    },
  ]

  const page = pdfDoc.getPages()[0]

  const { height } = page.getSize()

  // Move the page to a usable area.
  page.moveTo(
    INTRO_PAGE_LEFT_MARGIN,
    height - INTRO_PAGE_TOP_MARGIN - message[0].size
  )

  // Set letter-spacing to be a little tighter.
  page.pushOperators(setCharacterSpacing(-0.6))

  // Create the first page of text.
  message.forEach(({ text, color, font, link, size, padding }) => {
    // Draw the text, and return the width and height estimates
    // of the bounding box.
    const { height } = drawMultilineText(page, text, {
      color,
      font,
      lineHeight: font.heightAtSize(size),
      maxWidth: 420,
      size,
    })

    // If we're rendering a link, add the link annotation.
    if (link) {
      const linkContext = pdfDoc.context.register(
        pdfDoc.context.obj({
          A: {
            S: 'URI',
            Type: 'Action',
            URI: PDFString.of(link),
          },
          Rect: [
            INTRO_PAGE_LEFT_MARGIN /* Lower left X */,
            page.getY() +
              font.heightAtSize(size - 3 /* Arbitrary padding */, {
                descender: true,
              }) /* Lower left Y */,
            font.widthOfTextAtSize(text, size) +
              INTRO_PAGE_LEFT_MARGIN /* Upper right X */,
            page.getY() +
              height -
              font.heightAtSize(size + 3 /* Arbitrary padding */, {
                descender: true,
              }) /* Upper right Y */,
          ],

          Subtype: 'Link',

          Type: 'Annot',
        })
      )
      page.node.set(PDFName.of('Annots'), pdfDoc.context.obj([linkContext]))
    }

    page.moveDown(height + (padding || 0))
  })

  // Add my signature
  page.drawSvgPath(SIGNATURE_PATH, {
    color: rgb(0, 0, 0),
    scale: 0.1,
  })

  return pdfDoc
}

const provideFonts = async (pdfDoc: PDFDocument) => {
  // We must register fontkit before using non-standard fonts
  pdfDoc.registerFontkit(fontkit)

  return Promise.all(
    FONTS.map(
      async (font) =>
        await pdfDoc.embedFont(fs.readFileSync(`${FONTS_DIR}${font}`), {
          features: {
            cv05: true /* single story a */,
            cv11: true /* curved l */,
          },
        })
    )
  )
}

const drawMultilineText = (
  page: PDFPage,
  text: string,
  opts: PDFPageDrawTextOptions &
    Required<
      Pick<PDFPageDrawTextOptions, 'font' | 'size' | 'maxWidth' | 'lineHeight'>
    >
): { width: number; height: number } => {
  // Draw the text, assuming the current X, Y has been set.
  page.drawText(text, opts)

  // Break the text into lines of `maxWidth` length.
  const lines = breakTextIntoLines(
    text,
    opts.wordBreaks || page.doc.defaultWordBreaks,
    opts.maxWidth,
    (t) => opts.font.widthOfTextAtSize(t, opts.size)
  )

  // Famous last words: "this should never happen"
  if (lines.length === 0) {
    return { height: 0, width: 0 }
  }

  const lineCount = lines.length
  const height = lineCount * opts.lineHeight
  const width = Math.max(
    ...lines.map((l) => opts.font.widthOfTextAtSize(l, opts.size))
  )

  return { height, width }
}
