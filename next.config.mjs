import { withPlausibleProxy } from 'next-plausible'

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: ['jxtzqpuzyqbwtwcwvmln.supabase.co'],
  },
  experimental: {
    swcMinify: true,
    appDir: true,
  },
}
export default withPlausibleProxy()(config)
