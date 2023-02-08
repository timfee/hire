'use client'

/* eslint-disable @next/next/no-img-element */

import type { Company } from '@prisma/client'
import clsx from 'clsx'
import type { Variants } from 'framer-motion'
import { motion } from 'framer-motion'
import Image from 'next/image'

import timThumbnail from '../public/tim_feeley_small.png'

type HeaderProps = {
  className?: string
} & Pick<Company, 'name' | 'color' | 'svg'>

export default function Header({ className, name, color, svg }: HeaderProps) {
  const letter: Variants = {
    hidden: {
      opacity: 0,
      overflowX: 'hidden',
    },
    visible: {
      transition: {
        duration: 0.75,
        ease: 'backInOut',
      },
      x: 0,
      opacity: 1,
    },
  }

  return (
    <figure
      className={clsx('flex items-center justify-center space-x-3', className)}>
      <motion.div
        animate="visible"
        initial={{
          opacity: 0,
          x: 100,
        }}
        variants={letter}>
        <img
          alt={`${name} logo`}
          className=" h-12 max-w-[6rem] sm:h-16 sm:max-w-[8rem]"
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
        />
      </motion.div>
      <div className="h-12 w-px sm:h-16" style={{ backgroundColor: color }} />
      <motion.div
        className="relative h-12 w-12 sm:h-16 sm:w-16"
        animate="visible"
        initial={{
          opacity: 0,
          x: -100,
        }}
        variants={letter}>
        <Image src={timThumbnail} alt="Tim Feeley" className="rounded-full" />
      </motion.div>
    </figure>
  )
}
