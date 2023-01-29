// @ts-check
import { withPlausibleProxy } from 'next-plausible'

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,

  experimental: {
    appDir: true,
  },
}
export default withPlausibleProxy()(config)
