import { useCompany } from '@/context/CompanyContext'

export default function Metadata() {
  const { color, name } = useCompany()
  const title = `Tim Feeley + ${name} = ❤️`
  const description =
    'I’m a PM & UX leader with two decades of experience developing high-performing teams and delivering impactful products used by billions of people.'

  return (
    <>
      <meta charSet="utf-8" />
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content={color} />
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.svg" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@timfee" />
      <meta name="twitter:creator" content="@timfee" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta
        property="og:image"
        content="https://hire.timfeeley.com/opengraph.png"
      />
      <meta
        property="og:image:secure_url"
        content="https://hire.timfeeley.com/opengraph.png"
      />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Download Tim Feeley’s Resume" />

      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="Tim Feeley" />
    </>
  )
}
