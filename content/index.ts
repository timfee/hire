import fs from 'fs'
import { cwd } from 'process'

import fontkit from '@pdf-lib/fontkit'
import type { PDFPage, PDFPageDrawTextOptions } from 'pdf-lib'
import {
  breakTextIntoLines,
  PDFDocument,
  PDFName,
  PDFString,
  rgb,
  setCharacterSpacing,
} from 'pdf-lib'

import { env } from '@/env.mjs'
import { type Company, createSupabaseServerClient } from '@/utils/supabase'

const SOURCE_DIR = `${cwd()}/content/`
const FONTS_DIR = `${cwd()}/styles/fonts/`

const INTRO_PAGE_PDF = '1.pdf'
const INTRO_PAGE_LEFT_MARGIN = 89
const INTRO_PAGE_TOP_MARGIN = 306
const INTRO_PAGE_TEXT_WIDTH = 400
const LAST_PAGE_PDF = '4.pdf'

const generateResumePacket = async ({ company }: { company: Company }) => {
  if (!company) {
    throw new Error('Tried to generateResumePacket() with no company')
  }
  const { slug, logoUrl, name, resumeMessage, code } = company

  const documents = await Promise.all([
    // Custom introduction page
    buildFirstPage({ code, name, resumeMessage, slug }),
    // Static pages
    await PDFDocument.load(fs.readFileSync(SOURCE_DIR + '2.pdf')),
    await PDFDocument.load(fs.readFileSync(SOURCE_DIR + '3.pdf')),
    // If we have a logo, generate a custom last page
    buildLastPage({ logoUrl }),
  ])

  const packet = await PDFDocument.create()

  for (const doc of documents) {
    if (doc) {
      const pages = await packet.copyPages(doc, doc.getPageIndices())
      pages.forEach((page) => {
        packet.addPage(page)
      })
    }
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

const buildFirstPage = async ({
  name,
  resumeMessage,
  slug,
  code,
}: Pick<Company, 'name' | 'resumeMessage' | 'slug' | 'code'>) => {
  const pdfDoc = await PDFDocument.load(
    fs.readFileSync(SOURCE_DIR + INTRO_PAGE_PDF)
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
      text: `Hi ${name}!`,
    },
    ...(resumeMessage
      ? resumeMessage.split('\n').map((paragraph) => {
          return {
            color: rgb(71 / 255, 85 / 255, 105 / 255),
            font: INTER_MEDIUM,
            padding: 12,
            size: 16,
            text: paragraph.trim(),
          }
        })
      : []),
    {
      color: rgb(71 / 255, 85 / 255, 105 / 255),
      font: INTER_MEDIUM,
      padding: 12,
      size: 16,
      text: `I’ve put together a dedicated portal with links to my resume, references and more.`,
    },
    {
      color: rgb(29 / 255, 78 / 255, 216 / 255),
      font: INTER_MEDIUM,
      link: `https://hire.timfeeley.com/${slug}/${code}`,
      size: 16,
      padding: 20,
      text: `https://hire.timfeeley.com/${slug}/${code}`,
    },
    {
      color: rgb(71 / 255, 85 / 255, 105 / 255),
      font: INTER_MEDIUM,
      size: 16,
      text: `Thanks for your consideration!`,
    },
  ]

  const page = pdfDoc.getPages()[0] || pdfDoc.addPage()

  const { height: pageHeight } = page.getSize()

  // Move the page to a usable area.
  message[0] &&
    page.moveTo(
      INTRO_PAGE_LEFT_MARGIN,
      pageHeight - INTRO_PAGE_TOP_MARGIN - message[0].size
    )

  // Set letter-spacing to be a little tighter.
  page.pushOperators(setCharacterSpacing(-0.6))

  // Create the first page of text.
  message.forEach(({ text, color, font, size, link, padding }) => {
    // Draw the text, and return the width and height estimates
    // of the bounding box.

    const { height } = drawMultilineText(page, text, {
      color,
      font,
      lineHeight: font.heightAtSize(size),
      maxWidth: INTRO_PAGE_TEXT_WIDTH,
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

const buildLastPage = async ({
  logoUrl,
}: Required<Pick<Company, 'logoUrl'>>) => {
  const pdfDoc = await PDFDocument.load(
    fs.readFileSync(SOURCE_DIR + LAST_PAGE_PDF)
  )
  if (!logoUrl) {
    throw Error('Missing logoUrl')
  }
  const png = await fetch(logoUrl).then((res) => res.arrayBuffer())

  if (png) {
    const page = pdfDoc.getPages()[0] ?? pdfDoc.addPage()

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

const provideFonts = async (pdfDoc: PDFDocument) => {
  pdfDoc.registerFontkit(fontkit)

  return await Promise.all([
    await pdfDoc.embedFont(fs.readFileSync(FONTS_DIR + 'sohne-kraftig.ttf')),
    await pdfDoc.embedFont(fs.readFileSync(FONTS_DIR + 'sohne-halbfett.ttf')),
  ])
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

const SIGNATURE_PATH =
  'M221.8 285.504c3.9-4.1 6.3-10 10.7-25.9 5.4-20 11.5-36.7 13.4-36.7.7 0 2.4 6.9 5.5 22.2 3.3 16.8 4.3 19.2 10.2 24.2 5.3 4.5 8.6 4.7 12.8.5a30.708 30.708 0 0 0 1.911-2.063l.224-.273c2.757-3.436 4.115-7.531 7.865-21.064 4.2-15.5 9.9-28.4 15.1-34.8 5.2-6.4 5.5-6.1 18.1 17.9a594.47 594.47 0 0 0 1.769 3.287l.515.948c4.134 7.593 8.495 15.234 10.516 18.265 6 8.8 23 25.9 25.8 25.9 3.4 0 6.5-3.7 5.7-6.8-.3-1.5-5.9-12.8-12.4-25.2l-1.974-3.769-.57-1.089a9819.93 9819.93 0 0 1-2-3.824l-.57-1.09c-4.926-9.425-9.58-18.365-11.586-22.228-3.6-7.2-6.4-11.1-11.7-16.4l-6.9-6.8-7.4.4c-11.6.8-13.3 3.2-26.3 37.7-4.4 11.8-8.3 21.6-8.6 21.9l-.025.025-.048.046c-.743.692-1.066-.094-5.427-13.37-4.7-14.3-9.9-26.3-12.1-28.2-2.5-2.1-9.3-3.1-12.2-1.9-5.9 2.5-9.2 9.6-14.2 29.9-3.7 15.2-7.9 28.1-9.8 30.6-.9 1-1.5-.2-2.9-5.5-3.6-13.8-5.8-26.2-7.3-41.4-1.7-16.9-4-30.8-5.7-34.4-1.3-2.9-4.8-4.6-9.4-4.6-5.4 0-6.5 2.4-12.5 27.5-5.6 23.6-18.3 56-21.9 56-1.8 0-5.5-6.5-7.5-13-3.3-10.5-5.7-37.7-6-67-.294-24.795-.492-27.884-2.006-29.127l-.094-.074c-2.6-1.9-5.8-1.6-7.8.6-1 1.1-2.8 6.7-4.1 13.3l-2.3 11.3-.1-6.5c-.3-19.6-3.4-47-7.7-67-4.9-23-9.6-36.3-15.9-45.1-1.9-2.7-3.5-5.1-3.5-5.3 0-.6 9.6-7.6 10.4-7.6.3 0 .6 1.5.6 3.3 0 4.3 2.2 7.3 6.6 8.7 6.5 2.2 12.4-2.1 12.4-9 0-4.4-2.3-7.8-6.3-9.5l-3-1.3 7.9-4.6c4.3-2.6 19.6-10.5 34-17.6 15.2-7.5 26.4-13.5 26.8-14.6.8-2-2-5.4-4.3-5.302-.16 0-.503.058-.998.164l-.316.07c-.333.075-.719.167-1.151.275l-.448.112c-2.546.646-6.44 1.73-10.636 2.947l-.766.222-.385.112c-25 7.3-40 13.8-57.8 24.8-48 29.7-90.5 79.4-106 124.2-6.4 18.1-8 28.1-8 48.5 0 19.6 1.1 27.3 6.3 42.8 9.9 29 21.6 39.2 46.7 40.5 20.3.9 34.2-4.5 49-19.2 8.1-8 9.8-10.4 14.3-19.6 4.9-10.2 8.9-23.9 10.7-37 .7-4.8 1-3.3 2.1 12 1.6 22.4 3.6 33.4 7.5 42.7 5.3 13 12.8 20.2 20.7 20.3 4.2 0 11.9-4.7 14.3-8.7 2.9-5 5.9-13.4 9.4-26.8 8.5-32 11.3-38.5 11.4-25.7 0 9.1 3 34.3 5 43.1 3 12.6 5 16.3 10.3 19.4 7.7 4.5 10.1 4.6 14.1.3Zm-183.5-14.2c-10.5-3.1-19.3-15.5-25.5-35.9-2.6-8.5-2.7-10.2-2.8-29 0-15.805.286-20.95 1.6-26.112l.1-.388c7.7-28.1 17.2-46.5 36.7-71 14.4-18.1 43.1-46.3 45.1-44.3.5.5 3.8 11.8 7.3 25.1 11.5 43.1 13.9 58.3 14 88.7.1 39.9-6.4 61.6-23.4 78.7-14.8 14.9-33.7 19.9-53.1 14.2Zm539.5-256.4c-24.6 3.7-44 9.4-58.4 17.1-9.8 5.3-25.3 15.6-31.3 20.9-2.6 2.3-5 4-5.3 3.8-.2-.3-.7-2.8-1.1-5.7-.3-2.8-1.2-5.9-1.9-6.8-2.3-3.2-3.7.1-4.8 11.4l-1.1 10.8-6.2 8.2c-15.7 21-27.2 45.1-33.2 69.5-2.9 11.9-5.1 27.2-5.1 36.1 0 3.5-.6 4.9-3.1 7.3-4.3 4.1-12.6 16.7-13.4 20.5-.5 2.2-.3 3.6.8 4.7 1.4 1.4 1.9 1.3 4.4-.3 1.5-1 5.1-4.1 8-6.8l5.2-4.9 1.1 4.4c5.2 20.6 14.7 35 27.9 42.2 5.1 2.7 5.6 2.8 10.7 1.7 4.5-1 6.1-2 9.1-5.7 2-2.4 5.2-4.9 6.9-5.4 1.8-.6 5.9-3.9 9.2-7.5l6-6.3 4.3 1.4c3.4 1.2 5.5 1.3 11 .4 13.5-2 24.5-7.9 34.9-18.4 5.6-5.8 7-6.6 7-4.2 0 .8 1.9 2.8 4.2 4.5 3.2 2.4 5.2 3.1 8.7 3.1 10.1 0 18-7.1 26-23.4l4.8-9.8 1.7 6.8c4.7 18.5 16.1 32.1 29.2 34.5 11.2 2.1 21.6-1.4 30.8-10.3l5.6-5.4 2.7 2.9c3.6 3.7 9.8 6.9 13.7 7 6.9.1 10.3-1.3 14.8-6.1 2.5-2.6 4.7-5.4 5-6.2.3-1.1 2.6 0 8.9 4.2 21.5 14.4 38.2 13 56.7-4.6l8-7.7 2.1 6.3c2.7 8.2 16.2 57.4 20.7 75.3 1.9 7.7 5.5 21.2 7.9 30 2.4 8.8 6.2 22.9 8.5 31.4 4.9 18.2 7.9 24.8 11.6 25.7 3.6.9 7.3-.5 9.7-3.7 2.7-3.7 2.4-13.3-.9-27.3-8-34-30.8-112.7-38-131.5-5.6-14.3-12.3-20.8-19.9-19.1-3 .7-5.6 2.8-12.4 9.9-15.4 16.2-27.9 18.2-44.9 7.1-3.5-2.2-8.6-5.2-11.4-6.6-4.6-2.3-5.6-2.5-8.9-1.5-2.2.7-4.7 2.5-6.3 4.5-4.2 5.5-5.6 6.6-8.5 6.6-3.9 0-7.6-3.2-9.6-8.3-1.5-3.9-1.5-4.8 0-10.2 1.9-7.4 1.9-10.5 0-13.2-2.2-3.2-5.2-3.5-8.4-.8-3.7 3.1-5.1 8.4-5.1 18.7v8.6l-4.1 4.2c-10.7 11-25.4 10.7-34.1-.7-7.1-9.5-9.5-16.7-14.7-43.5-2.9-14.7-3.1-17.3-3.1-38.1s-.1-22.5-1.9-24.1c-8.1-7.4-12.4 12.2-10 45.7 1.4 19.7.9 23.5-4.1 35.8-3.4 8.3-7.8 15.3-12.2 19.5-3.9 3.7-6 4.5-7.9 3.3-1.6-1-2-16.3-.6-26.6.8-5.9.8-6.2-1.6-7.8-4-2.6-6-.6-12.8 12.6-11.2 22-26.2 33.9-42.3 33.9-7.3 0-7.4-.5-2.8-12.6 8.9-24 12-39 8.8-43.9-1.3-2-2.5-2.5-5.6-2.5-3.5 0-4.3.5-7.1 4.2-5.3 7.3-16.8 31.8-18 38.3-1.8 9.7-2.8 10.8-2.8 3.4-.1-5.5-1.1-18-3.5-43.7l-.4-4.3 10.7-9.6c15-13.6 25.6-22.4 32.6-26.9 6.6-4.3 7.8-7 3.1-6.7-4.5.3-21.9 9.3-34.3 17.7-6.2 4.2-11.7 7.6-12.1 7.6-1.1 0-2.2-22.7-2.2-43.1v-14.5l6.8-5.1c21.3-15.9 35.7-23.1 73-36.4 27.4-9.7 31.9-11.6 32.7-13.7.7-1.8-1.9-4.3-4.4-4.1-.9 0-7 .9-13.7 1.9Zm-110.2 131.2c-3.7 3.5-11.5 11-17.4 16.7-5.9 5.8-11 10.3-11.2 10-.2-.2 0-4.2.5-8.8 3.2-28.1 12.3-51.2 29.8-75.6l3.6-5 .7 28.2.8 28.1-6.8 6.4Zm8.3 14c.9 2.7 3.5 36.1 3.5 45.4-.1 21.1-5.8 34.9-13.6 33-3.6-.9-12.3-9.9-16.1-16.6-3.9-6.8-9.3-22.6-9.3-27.1 0-3 1.7-5 16.6-19.6 9.2-9 17.1-16.3 17.6-16.3s1.1.6 1.3 1.2Zm16.9 53.6c.4.6-.5 3.3-1.9 5.9-1.4 2.6-2.4 3.9-2.1 2.8.2-1.1.8-5.2 1.2-9 .6-5.8.8-6.5 1.4-3.9.4 1.7 1 3.6 1.4 4.2Z'

export const refreshResumeUrl = async (company: Company, force = false) => {
  const { code, name, slug, resumeLastGenerated, lastUpdated } = company

  if (
    !code ||
    !name ||
    !slug ||
    typeof code !== 'string' ||
    typeof name !== 'string' ||
    typeof slug !== 'string'
  ) {
    throw new Error('missing code, name, or slug')
  }

  if (
    force ||
    !resumeLastGenerated ||
    !lastUpdated ||
    typeof resumeLastGenerated !== 'string' ||
    typeof lastUpdated !== 'string' ||
    Date.parse(resumeLastGenerated) < Date.parse(lastUpdated)
  ) {
    const supabase = createSupabaseServerClient()
    const { error } = await supabase
      .from('Company')
      .update({
        resumeLastGenerated: new Date().toISOString(),
        resumeUrl: await uploadResume({
          code,
          file: Buffer.from(await generateResumePacket({ company })),
          name,
          slug,
        }),
      })
      .eq('slug', slug)

    if (error) {
      throw error
    }
  }
  return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/hire-timfeeley/Tim Feeley's ${name} Resume.pdf`.replace(
    /\s/g,
    '%20'
  )
}

const uploadResume = async ({
  file,
  name,
  code,
  slug,
}: {
  file: Buffer
  name: string
  code: string
  slug: string
}) => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('missing supabase url')
  }

  const key = `${slug}/${code}/Tim Feeley's ${name} Resume.pdf`

  const supabase = createSupabaseServerClient()

  const { data, error } = await supabase.storage
    .from('hire-timfeeley')
    .upload(key, file, {
      cacheControl: 'no-cache',
      contentType: 'application/pdf',
      upsert: true,
    })

  if (!data) {
    console.error(data, error)
    throw new Error('missing data')
  }

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/hire-timfeeley/${data.path}`.replace(
    /\s/g,
    '%20'
  )
}
