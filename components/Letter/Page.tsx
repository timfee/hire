import type { Company } from '@prisma/client'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'

import { Signature } from '@/components/Letter/Signature'
import { Stationery } from '@/components/Letter/Stationery'

import resumeThumbnail from './resume_thumbnail.png'

export default function Letter({
  name,
  svg,
  color,
  websiteMessage,
  lastUpdated,
  resumeUrl,
}: Omit<Company, 'png' | 'resumeMessage'>) {
  return (
    <main
      className="relative mx-4 mt-3 max-w-3xl rounded-md border-t-4 bg-white p-4 shadow-md sm:mx-auto sm:mt-12 sm:p-8"
      style={{ borderTopColor: color }}>
      <Stationery {...{ svg, name, color, lastUpdated }} />
      <ReactMarkdown className="prose mt-6 font-serif sm:mt-12">
        {websiteMessage}
      </ReactMarkdown>
      <Signature />
      {resumeUrl && (
        <a
          className="group relative mx-4 mt-8  block max-w-sm  rounded-lg border border-slate-300 bg-slate-100 p-4 text-center sm:mx-auto sm:p-8"
          download
          href={resumeUrl}
          rel="noreferrer">
          <Image
            src={resumeThumbnail}
            alt="Resume"
            height={100}
            className="mx-auto mb-4 transition-opacity duration-500 ease-in-out"
          />

          <span className="rounded-full bg-slate-200 py-1 px-4 text-xs text-blue-600 underline transition-all duration-500 ease-in-out group-hover:bg-blue-600 group-hover:text-white sm:text-sm">{`Tim Feeley - ${name}.pdf`}</span>
        </a>
      )}
    </main>
  )
}
