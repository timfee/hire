/* eslint-disable @typescript-eslint/no-var-requires */
const { withPlausibleProxy } = require('next-plausible')

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    swcPlugins: [['next-superjson-plugin', { excluded: ['png', 'svg'] }]],
  },
}
module.exports = withPlausibleProxy()(config)
