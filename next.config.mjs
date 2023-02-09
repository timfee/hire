import { withPlausibleProxy } from 'next-plausible'

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    appDir: true,
    swcPlugins: [['next-superjson-plugin', {}]],
  },
  images: {
    domains: [process.env.NEXT_PUBLIC_SUPABASE_URL.replace('https://', '')],
  },
  reactStrictMode: true,
  swcMinify: true,
}

export default withPlausibleProxy()(config)
