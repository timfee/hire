/* eslint-disable @typescript-eslint/no-floating-promises */
import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'

import pdfPreview from '@/lib/resume_thumbnail.png'
import Image from 'next/image'
import { ArrowDownCircleIcon } from '@heroicons/react/24/outline'
import {
  useScroll,
  useInView,
  motion,
  useAnimationControls,
} from 'framer-motion'

export default function HoverButton({
  resumeUrl,
  color,
  name,
}: {
  resumeUrl: string
  name: string
  color: string
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
        animateFunction(oldPosition, 'top')
        return 'top'
      })
    } else if (!inView && y + height < stickyYthreshold) {
      setPosition((oldPosition) => {
        animateFunction(oldPosition, 'bottom')
        return 'bottom'
      })
    } else {
      setPosition((oldPosition) => {
        animateFunction(oldPosition, 'inline')
        return 'inline'
      })
    }
  }

  // Only bother re-rending the button if its
  // visibility in the current viewport has
  // changed
  useEffect(() => {
    updateStickiness()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  // Initial effect
  useEffect(() => {
    if (unstickyRef.current && stickyRef.current) {
      unstickyRef.current.style.height = `${stickyRef.current.clientHeight}px`
    }
    updateStickiness()
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

  return (
    <>
      <div ref={unstickyRef}>
        <motion.div
          data-position={position}
          animate={controls}
          ref={stickyRef}
          className={clsx('not-prose h-fit w-full', {
            'border-top fixed bottom-0 left-0 right-0 border-t border-slate-300':
              position === 'bottom',
            'border-bottom fixed top-0 left-0 right-0 z-10 border-b  border-slate-300':
              position === 'top',
            'bg-slate-200 px-4': position !== 'inline',
          })}>
          <div className="relative mx-auto py-4 md:max-w-2xl">
            <a
              href={resumeUrl}
              className="card flex items-center justify-items-stretch rounded-md border border-slate-300 bg-white p-3 shadow-inner"
              target="_blank"
              rel="noopener noreferrer">
              <Image
                height={48}
                src={pdfPreview}
                alt="Resume"
              />
              <span
                style={{ color }}
                className="text ml-2 font-medium text-indigo-600 underline">
                Tim Feeley’s {name} Resume.pdf
              </span>
              <div className="h-fit flex-grow"></div>
              <button
                style={
                  {
                    backgroundColor: color,
                    '--tw-ring-color': color,
                  } as CSSProperties
                }
                className="flex items-center rounded-full border border-transparent px-3 py-1.5 text-xs font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <ArrowDownCircleIcon className="mr-2 h-5 w-5" />
                <span>Download</span>
              </button>
            </a>
          </div>
        </motion.div>
      </div>
    </>
  )
}
