'use client'

import type { PropsWithChildren } from 'react'

import type { Variants } from 'framer-motion'
import { motion } from 'framer-motion'

export default function Signoff({ children }: PropsWithChildren) {
  const signature: Variants = {
    hidden: { opacity: 0, pathLength: 0 },
    visible: (i) => {
      const delay = 0.3 + i * 0.5
      return {
        opacity: 1,
        pathLength: 1,
        transition: {
          opacity: { delay, duration: 0.01 },
          pathLength: {
            bounce: 0,
            delay,
            duration: 1,
            type: 'spring',
          },
        },
      }
    },
  }

  return (
    <>
      {children ? (
        children
      ) : (
        <>
          <p>
            I look forward to learning more; feel free to reach out anytime.
          </p>
          <p>Thanks!</p>
        </>
      )}
      <figure className="not-prose mt-2 mb-0 sm:-ml-6">
        <motion.svg
          className="h-16 sm:h-24"
          viewBox="0 0 586 201"
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 'all', once: true }}>
          <title>—Tim Feeley</title>
          <motion.g
            variants={signature}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            fillRule="evenodd">
            <motion.path
              variants={signature}
              d="M160.562177,34 C148.247455,48.4607644 90.7895961,105.594141 77.6219033,119.27921 C73.062667,124.017283 68.5873294,128.850294 64.8251315,134.274277 C60.5838273,140.388584 60.9621078,145.666112 67.0219548,150.354876 C68.1806234,151.251519 109.364703,165.748516 126.154772,155.127392 C131.85739,151.52001 139.209073,140.975032 136.799253,123.990526 C132.513876,93.7870293 113.485555,51.6394104 114.340431,51.9312301"
              strokeLinejoin="bevel"></motion.path>
            <motion.path
              variants={signature}
              custom={1}
              d="M148.562177,97.2416757 C148.562177,122.179688 155.36698,145.710808 157.078125,149 C158.78927,152.289192 166.229492,165.992188 175.488281,149 C184.74707,132.007812 186.550733,99.7089844 192.413086,99.7089844 C198.275438,99.7089844 195.676607,145.742187 202.987305,145.742187 C210.298002,145.742187 213.18457,103.738281 220.827148,103.738281 C228.469727,103.738281 224.92726,154.826912 231.591797,157.603516 C238.256334,160.380119 238.916391,115.5 248.34375,115.5 C257.771109,115.5 253.185547,136.541992 268.53125,159.246094"
              strokeLinejoin="bevel"></motion.path>
            <motion.circle
              variants={signature}
              custom={1}
              fill="currentColor"
              cx="149"
              cy="80"
              r="6"></motion.circle>
            <motion.path
              custom={2}
              variants={signature}
              d="M310.933594,174.246094 C307.174818,138.434997 304.374688,113.560578 302.533203,99.6228361 C297.440935,61.0807153 292.885428,36.5665448 295.006836,34.2509766 C297.408067,31.6299755 308.085755,37.563667 320.987305,39.40625 C334.456993,41.3299738 350.296744,39.1755662 359.054688,36.6621094 C370.485677,33.3815104 381.69694,29.4940001 392.688477,24.9995784"
              strokeLinejoin="bevel"></motion.path>
            <motion.path
              custom={3}
              variants={signature}
              d="M283,166.101562 C290.397057,166.101562 332.068479,122.089566 330.464844,112.241676 C324.400391,75 316.950125,134.987569 324.400391,136.538086 C333.050301,138.338268 355.582031,117.57065 355.582031,112.241676 C355.582031,89.8721644 339.751086,132.769631 342.52832,136.538086 C364.043641,165.732422 414.015631,31.1953069 374.240234,45.9326172 C355.25,52.96875 370.627122,135.3401 386.261719,141.449219 C393.59807,144.315851 419.853516,111.5 409.015625,102.503906 C398.177734,93.5078125 389.31017,115.082288 394.511719,125.323242 C400.423793,136.963097 417.814569,141.256582 429.518555,115.310547 C435.926758,101.104492 427.016602,144.880859 439.269531,144.880859 C451.522461,144.880859 465.265212,127.039043 464.666016,119.128906 C462.193505,86.4886736 435.637695,164.135742 451.9375,190.34082"
              strokeLinejoin="bevel"></motion.path>
          </motion.g>
        </motion.svg>
      </figure>
    </>
  )
}
