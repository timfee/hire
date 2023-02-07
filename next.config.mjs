/* eslint-disable @typescript-eslint/no-var-requires */
import { withPlausibleProxy } from 'next-plausible'

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [process.env.NEXT_PUBLIC_SUPABASE_URL.replace('https://', '')],
  },
  experimental: {
    swcPlugins: [['next-superjson-plugin', { excluded: ['png', 'svg'] }]],
  },
}
export default withPlausibleProxy()(config)
