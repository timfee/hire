'use client'

import { Button, Card } from 'flowbite-react'

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto mt-10">
      <Card>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Hey, friend!
        </h5>
        <h6>
          You’ve reached a site that I’ve built to share information with
          prospective employers.
        </h6>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          If you came here from a link, please double check the URL, or send me
          a note and I’ll help you out.
          <br />
          <br />
          Otherwise&hellip;
        </p>
        <Button href="https://timfeeley.com">
          Visit my personal site
          <svg
            className="ml-2 -mr-1 h-4 w-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
        <Button
          color="light"
          href="&#109;ailt&#111;&#58;&#116;i%6&#68;&#64;ti%6Dfe&#101;l&#101;&#121;&#46;c&#37;&#54;F&#109;">
          Send me an email
        </Button>
      </Card>
    </main>
  )
}
