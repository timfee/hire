export default function Home() {
  return (
    <>
      <main className="mx-auto mt-10 max-w-xl">
        <div className="bg-white">
          <div className="py-24 px-6 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h5 className="mb-12 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Hey, friend!
              </h5>
              <p>
                You’ve reached a site that I’ve built to share information with
                prospective employers. If you came here from a link, please
                double check the URL, or send me a note and I’ll help you out.
              </p>
              <a
                href="https://timfeeley.com"
                className="mt-12 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
