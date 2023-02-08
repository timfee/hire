'use client'
import type { Company } from '@prisma/client'
import Image from 'next/image'

import resumeThumbnail from '../public/resume_thumbnail.png'

type DownloadLinkProps = Pick<Company, 'name' | 'resumeUrl'>
export default function DownloadLink({ name, resumeUrl }: DownloadLinkProps) {
  if (!resumeUrl) return null
  return (
    <figure className="my-6 text-center sm:text-left">
      <a
        className="download-card group mx-auto inline-flex flex-col px-3 py-6 font-sans sm:mx-0"
        download
        target="blank"
        href={resumeUrl}
        rel="noreferrer">
        <Image
          src={resumeThumbnail}
          alt="Resume"
          height={100}
          className="mx-auto mb-4"
        />
        <span>{`Tim Feeley’s ${name} Resume.pdf`}</span>
      </a>
    </figure>
  )
}
