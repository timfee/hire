import type { NextApiHandler } from 'next'

const MOCK = false

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' })

    return
  }

  if (!process.env.BRANDFETCH_API) {
    res.status(500).json({ message: 'Internal Server Error' })

    return
  }

  if (!req.query.domain || typeof req.query.domain !== 'string') {
    res.status(400).json({ message: 'Bad Request' })

    return
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const init: RequestInit = {
    headers: {
      Authorization: `Bearer ${process.env.BRANDFETCH_API}`,
    },
  }

  if (MOCK) {
    return res.status(200).json(dummy)
  } else {
    const response = await fetch(
      `https://api.brandfetch.io/v2/brands/${req.query.domain}`,
      init
    )
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const jsonResponse = await response.json()

    return res.status(200).json(jsonResponse)
  }
}

export default handler

const dummy = {
  claimed: false,
  colors: [
    { brightness: 242, hex: '#f0f2f5', type: 'dark' },
    { brightness: 255, hex: '#ffffff', type: 'light' },
    { brightness: 108, hex: '#1877f2', type: 'accent' },
  ],
  description:
    'Our mission is to give people the power to build community and bring the world closer together.',
  domain: 'facebook.com',
  fonts: [
    {
      name: 'Segoe UI',
      origin: 'custom',
      originId: undefined,
      type: 'title',
      weights: [],
    },
    {
      name: 'Segoe UI',
      origin: 'custom',
      originId: undefined,
      type: 'body',
      weights: [],
    },
  ],
  images: [
    {
      formats: [
        {
          background: undefined,
          format: 'png',
          height: 504,
          size: 1_392_697,
          src: 'https://asset.brandfetch.io/idpKX136kp/id5kHV9FuC.png',
          width: 1920,
        },
      ],
      type: 'banner',
    },
  ],
  links: [
    {
      name: 'crunchbase',
      url: 'https://crunchbase.com/organization/facebook',
    },
    { name: 'twitter', url: 'https://twitter.com/facebook' },
    { name: 'instagram', url: 'https://instagram.com/facebook' },
    { name: 'linkedin', url: 'https://linkedin.com/company/facebook' },
    { name: 'facebook', url: 'https://facebook.com/facebook' },
  ],
  logos: [
    {
      formats: [
        {
          background: 'transparent',
          format: 'svg',
          size: 2604,
          src: 'https://asset.brandfetch.io/idpKX136kp/idNZ6hqFNO.svg',
        },
        {
          background: 'transparent',
          format: 'png',
          height: 156,
          size: 15_082,
          src: 'https://asset.brandfetch.io/idpKX136kp/idA0oZ9v8O.png',
          width: 800,
        },
      ],
      theme: 'dark',
      type: 'logo',
    },
    {
      formats: [
        {
          background: 'transparent',
          format: 'svg',
          size: 1245,
          src: 'https://asset.brandfetch.io/idpKX136kp/idxTrSmpfj.svg',
        },
        {
          background: 'transparent',
          format: 'png',
          height: 800,
          size: 18_562,
          src: 'https://asset.brandfetch.io/idpKX136kp/idPL7nYG0q.png',
          width: 800,
        },
      ],
      theme: 'light',
      type: 'symbol',
    },
    {
      formats: [
        {
          background: 'transparent',
          format: 'svg',
          size: 1629,
          src: 'https://asset.brandfetch.io/idpKX136kp/id4P3q9qSr.svg',
        },
        {
          background: 'transparent',
          format: 'png',
          height: 800,
          size: 30_149,
          src: 'https://asset.brandfetch.io/idpKX136kp/iddsfgq1tB.png',
          width: 800,
        },
      ],
      theme: 'dark',
      type: 'symbol',
    },
    {
      formats: [
        {
          background: undefined,
          format: 'jpeg',
          height: 400,
          size: 11_801,
          src: 'https://asset.brandfetch.io/idpKX136kp/idQBiBTxsm.jpeg',
          width: 400,
        },
      ],
      theme: 'dark',
      type: 'icon',
    },
    {
      formats: [
        {
          background: 'transparent',
          format: 'svg',
          size: 1629,
          src: 'https://asset.brandfetch.io/idpKX136kp/idEE7sAZiz.svg',
        },
        {
          background: 'transparent',
          format: 'png',
          height: 800,
          size: 30_249,
          src: 'https://asset.brandfetch.io/idpKX136kp/idZYJaj46n.png',
          width: 800,
        },
      ],
      theme: undefined,
      type: 'other',
    },
    {
      formats: [
        {
          background: 'transparent',
          format: 'svg',
          size: 1629,
          src: 'https://asset.brandfetch.io/idpKX136kp/idKc--q1mB.svg',
        },
        {
          background: 'transparent',
          format: 'png',
          height: 800,
          size: 29_521,
          src: 'https://asset.brandfetch.io/idpKX136kp/idZD5g3yGB.png',
          width: 800,
        },
      ],
      theme: undefined,
      type: 'other',
    },
  ],
  name: 'Facebook',
}
