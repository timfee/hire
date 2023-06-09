'use client'

import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'

import { ArrowDownCircleIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import {
  useScroll,
  useInView,
  motion,
  useAnimationControls,
} from 'framer-motion'
import Image from 'next/image'
import { usePlausible } from 'next-plausible'

import pdfPreview from '@/public/resume_thumbnail.png'

export default function HoverButton({
  resumeUrl,
  color,
  name,
  contrastRatio = 10,
}: {
  resumeUrl: string
  name: string
  color: string
  contrastRatio?: number
}) {
  const stickyRef = useRef<HTMLDivElement>(null),
    unstickyRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const [_position, setPosition] = useState('')
  const controls = useAnimationControls()

  const inView = useInView(unstickyRef)

  const position = useMemo(() => {
    return _position
  }, [_position])

  const updateStickiness = () => {
    if (!stickyRef.current || !unstickyRef.current) return
    const height = typeof window !== 'undefined' ? window.innerHeight : 0
    const y = scrollY.get()
    const stickyYthreshold = unstickyRef.current.offsetTop

    if (!inView && unstickyRef.current.getBoundingClientRect().bottom < 40) {
      setPosition((oldPosition) => {
        void animateFunction(oldPosition, 'top')
        return 'top'
      })
    } else if (!inView && y + height < stickyYthreshold) {
      setPosition((oldPosition) => {
        void animateFunction(oldPosition, 'bottom')
        return 'bottom'
      })
    } else {
      setPosition((oldPosition) => {
        void animateFunction(oldPosition, 'inline')
        return 'inline'
      })
    }
  }

  // Only bother re-rending the button if its visibility in the current
  // viewport has changed
  useEffect(() => {
    updateStickiness()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  // Initial effect
  useEffect(() => {
    if (unstickyRef.current && stickyRef.current) {
      unstickyRef.current.style.height = `${stickyRef.current.clientHeight}px`
      updateStickiness()
      unstickyRef.current.style.visibility = 'visible'
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function animateFunction(oldPosition: string, newPosition: string) {
    if (newPosition === 'bottom') {
      controls.set({
        y: 300,
      })
      await controls.start(
        {
          y: 0,
        },
        { duration: 1 }
      )
    } else if (newPosition === 'top') {
      controls.set({
        y: -300,
      })
      await controls.start(
        {
          y: 0,
        },
        { duration: 1 }
      )
    } else {
      await controls.start(
        {
          y: 0,
        },
        { duration: 1 }
      )
    }
  }

  const plausible = usePlausible()
  return (
    <>
      <div ref={unstickyRef}>
        <motion.div
          data-position={position}
          animate={controls}
          ref={stickyRef}
          className={clsx('not-prose h-fit w-full transition-opacity', {
            'border-top fixed bottom-0 left-0 right-0 border-t border-slate-300':
              position === 'bottom',
            'border-bottom fixed top-0 left-0 right-0 z-10 border-b  border-slate-300':
              position === 'top',
            'bg-slate-200 px-4': position === 'top' || position === 'bottom',
            'opacity-0': position === '',
          })}>
          <div className="relative mx-auto py-4 md:max-w-2xl">
            <a
              href={resumeUrl}
              onClick={() => {
                plausible('resume_download', { props: { name } })
              }}
              className="card flex items-center justify-items-stretch rounded-md border border-slate-300 bg-white p-3 shadow-inner"
              target="_blank"
              rel="noopener noreferrer">
              <Image
                height={48}
                src={pdfPreview}
                alt="Resume"
              />
              <span
                style={{ color: contrastRatio > 3.5 ? color : 'black' }}
                className="ml-2 text-xs font-medium leading-snug text-indigo-600 underline sm:text-sm md:text-base">
                Tim Feeley’s {name} Resume.pdf
              </span>
              <div className="h-fit flex-grow"></div>
              <button
                style={
                  {
                    color: contrastRatio > 3.5 ? 'white' : 'black',
                    backgroundColor: color,
                    '--tw-ring-color': color,
                  } as CSSProperties
                }
                className="flex items-center rounded-full border border-transparent py-1.5 pr-2 pl-1.5 text-xs font-medium  shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <ArrowDownCircleIcon className="mr-1 h-5 w-5" />
                <span>Download</span>
              </button>
            </a>
          </div>
        </motion.div>
      </div>
    </>
  )
}
