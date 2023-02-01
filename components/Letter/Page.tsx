'use client'

import type { Company } from '@prisma/client'
import clsx from 'classnames'
import { Spinner } from 'flowbite-react'
import Image from 'next/image'
import { usePlausible } from 'next-plausible'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

import { Signature } from '@/components/Letter/Signature'
import { Stationery } from '@/components/Letter/Stationery'

import resumeThumbnail from './resume_thumbnail.png'

export default function Letter(
  {
    name,
    svg,
    color,
    websiteMessage,
    code,
    slug,
    lastUpdated,
  }: Omit<Company, 'png' | 'resumeMessage'>,
  logEvents = false
) {
  const [loading, setLoading] = useState(false)
  const plausible = usePlausible()

  return (
    <main
      className="relative mx-4 mt-3 max-w-3xl rounded-md border-t-4 bg-white p-4 shadow-md sm:mx-auto sm:mt-12 sm:p-8"
      style={{ borderTopColor: color }}>
      <Stationery {...{ svg, color, lastUpdated }} />
      <ReactMarkdown className="prose mt-12 font-serif">
        {websiteMessage}
      </ReactMarkdown>
      <Signature />
      <a
        className="group relative mx-4 mt-8  block max-w-sm  rounded-lg border border-slate-300 bg-slate-100 p-4 text-center sm:mx-auto sm:p-12"
        download={`Tim Feeley Resume - ${name}.pdf`}
        onClick={(e) => {
          if (loading) {
            e.preventDefault()
            alert(
              'Please wait a few moments for the resume to download before clicking again.'
            )
          } else {
            setLoading(true)
            setTimeout(() => setLoading(false), 5000)
            logEvents &&
              plausible('resume_download', {
                props: {
                  slug,
                },
              })
          }
        }}
        href={`/api/resume?slug=${slug}&code=${code}`}
        rel="noreferrer">
        <Image
          src={resumeThumbnail}
          alt="Resume"
          height={100}
          className={clsx(
            'mx-auto mb-4 transition-opacity duration-500 ease-in-out',
            { 'opacity-25': loading }
          )}
        />
        {loading && (
          <Spinner
            color="success"
            size="xl"
            className="absolute right-1/2 top-20 -mr-5"
            aria-label="Please wait..."
          />
        )}
        <span
          className={clsx(
            'rounded-full bg-slate-200 py-1 px-4 text-xs text-blue-600 underline transition-opacity duration-500 ease-in-out group-hover:bg-blue-600 group-hover:text-white sm:text-sm',
            {
              'opacity-25': loading,
              'opacity-100': !loading,
            }
          )}>{`Tim Feeley - ${name}.pdf`}</span>
      </a>
    </main>
  )
}
