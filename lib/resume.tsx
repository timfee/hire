import fontkit from '@pdf-lib/fontkit'
import type { Company } from '@prisma/client'
import { Resvg } from '@resvg/resvg-js'
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

import prisma from '@/lib/prisma'
import { SIGNATURE_PATH } from '@/lib/resume/Signature'

const SOURCE_DIR = `${cwd()}/lib/resume/`
const FONTS_DIR = `${SOURCE_DIR}/fonts/`
const FONTS = ['Inter-Medium.woff2', 'Inter-Bold.woff2']

const INTRO_PAGE_PDF = '1.pdf'
const INTRO_PAGE_LEFT_MARGIN = 106
const INTRO_PAGE_TOP_MARGIN = 269

const STATIC_PAGE_PDFS = ['2.pdf', '3.pdf']

const LAST_PAGE_PDF = '4.pdf'

const getStaticPages = async () => {
  return Promise.all(
    STATIC_PAGE_PDFS.map(async (file) => {
      return await PDFDocument.load(fs.readFileSync(SOURCE_DIR + file))
    })
  )
}

export async function generateResumePacket({
  slug,
  code,
  svg,
}: Pick<Company, 'slug' | 'code' | 'svg'>) {
  const introPage = await buildFirstPage({ slug, code })
  const lastPage = await buildLastPage({ slug, code, svg })

  const packet = await PDFDocument.create()

  const documents = [introPage, ...(await getStaticPages()), lastPage]

  for (const doc of documents) {
    const pages = await packet.copyPages(doc, doc.getPageIndices())
    pages.forEach((page) => {
      packet.addPage(page)
    })
  }

  packet.setAuthor('Tim Feeley')
  packet.setTitle('Tim Feeley’s Resume')
  packet.setLanguage('en-US')
  packet.setKeywords(['resume', 'tim feeley', 'product manager', 'ux'])
  packet.setCreator('hire.timfeeley.com')
  packet.setProducer('hire.timfeeley.com')
  packet.setSubject('A very special resume from Tim Feeley for you!')
  return await packet.save()
}

const buildLastPage = async ({
  svg,
}: Pick<Company, 'slug' | 'code' | 'svg'>) => {
  const pdfDoc = await PDFDocument.load(
    fs.readFileSync(SOURCE_DIR + LAST_PAGE_PDF)
  )

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 300,
    },
  })

  const page = pdfDoc.getPages()[0]

  const { width } = page.getSize()

  const png = Buffer.from(resvg.render().asPng())
  const pngImage = await pdfDoc.embedPng(png)
  const pngDims = pngImage.scale(0.5)

  page.drawImage(pngImage, {
    x: width / 2 - pngDims.width / 2,
    y: 550,
    width: pngDims.width,
    height: pngDims.height,
  })

  return pdfDoc
}

const buildFirstPage = async ({
  slug,
  code,
}: Pick<Company, 'slug' | 'code'>) => {
  const company = await prisma.company.findFirstOrThrow({
    where: {
      AND: {
        slug,
        code,
      },
    },
  })
  const pdfDoc = await PDFDocument.load(
    fs.readFileSync(SOURCE_DIR + INTRO_PAGE_PDF)
  )
  // These order of these font names must match the order
  // of the fonts in the FONTS array to render properly.
  const [INTER_MEDIUM, INTER_BOLD] = await provideFonts(pdfDoc)

  // Prepare the blocks of text we want to add to the first page.
  const message = [
    {
      text: `Hello ${company.name},`,
      size: 20,
      padding: 20,
      color: rgb(71 / 255, 85 / 255, 105 / 255),
      font: INTER_BOLD,
    },
    {
      text: 'I’m a PM & UX leader with two decades of experience developing high-performing teams and delivering impactful products used by billions of people.',
      size: 16,
      color: rgb(71 / 255, 85 / 255, 105 / 255),
      font: INTER_MEDIUM,
    },
    ...(company.resumeMessage
      ? company.resumeMessage.split('\n').map((paragraph) => {
          return {
            text: paragraph,
            size: 16,
            padding: 12,
            color: rgb(71 / 255, 85 / 255, 105 / 255),
            font: INTER_MEDIUM,
          }
        })
      : []),
    {
      text: `https://hire.timfeeley.com/${company.slug}/${company.code}`,
      size: 16,
      color: rgb(29 / 255, 78 / 255, 216 / 255),
      font: INTER_MEDIUM,
      link: `https://hire.timfeeley.com/${company.slug}/${company.code}`,
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
      size,
      font,
      color,
      lineHeight: font.heightAtSize(size),
      maxWidth: 420,
    })

    // If we're rendering a link, add the link annotation.
    if (link) {
      const linkContext = pdfDoc.context.register(
        pdfDoc.context.obj({
          Type: 'Annot',
          Subtype: 'Link',

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

          A: {
            Type: 'Action',
            S: 'URI',
            URI: PDFString.of(link),
          },
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
    return { width: 0, height: 0 }
  }

  const lineCount = lines.length
  const height = lineCount * opts.lineHeight
  const width = Math.max(
    ...lines.map((l) => opts.font.widthOfTextAtSize(l, opts.size))
  )

  return { width, height }
}
