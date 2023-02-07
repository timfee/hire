import Image from 'next/image'

import resumeThumbnail from '../public/resume_thumbnail.png'

export default function DownloadLink({ name = '', resumeUrl = '' }) {
  return (
    <figure className="my-6 text-center sm:text-left">
      <a
        className="group mx-auto inline-flex flex-col rounded-lg border border-slate-400 bg-white px-3 py-6 font-sans sm:mx-0"
        download
        target="blank"
        href={resumeUrl}
        rel="noreferrer">
        <Image
          src={resumeThumbnail}
          alt="Resume"
          height={100}
          className="mx-auto mb-4 transition-opacity duration-300 ease-in-out"
        />
        <span className="rounded-full bg-slate-200 py-1 px-4 text-xs font-medium text-blue-600 underline transition-all duration-300 ease-in-out group-hover:bg-blue-600 group-hover:text-white sm:text-sm">{`Tim Feeley’s ${name} Resume.pdf`}</span>
      </a>
    </figure>
  )
}
