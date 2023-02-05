import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className="h-full scroll-smooth antialiased">
      <Head>
        <meta charSet="utf-8" />
        <meta name="robots" content="index,follow" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <body className="h-full bg-gradient-to-t from-slate-100 to-slate-200 bg-fixed bg-no-repeat">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
