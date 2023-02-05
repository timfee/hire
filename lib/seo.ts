import type { Company } from '@prisma/client'
import type { NextSeoProps } from 'next-seo'

const seoPropsForPage = ({
  color,
  code,
  slug,
  name,
}: Pick<Company, 'color' | 'code' | 'slug' | 'name'>): NextSeoProps => {
  const title = `Tim Feeley + ${name} = ❤️`
  const description =
    'I’m a PM & UX leader with two decades of experience developing high-performing teams and delivering impactful products used by billions of people.'

  return {
    title,
    description,
    themeColor: color,
    useAppDir: true,
    canonical: `https://hire.timfeeley.com/${slug}/${code}`,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `https://hire.timfeeley.com/${slug}/${code}`,
      title,
      description,
      images: [
        {
          url: 'https://hire.timfeeley.com/opengraph.png',
          width: 1200,
          height: 630,
          alt: 'Download Tim Feeley’s Resume',
          type: 'image/png',
          secureUrl: 'https://hire.timfeeley.com/opengraph.png',
        },
      ],
      siteName: 'Tim Feeley',
    },
    twitter: {
      handle: '@timfee',
      site: '@timfee',
      cardType: 'summary_large_image',
    },
  }
}

export default seoPropsForPage
