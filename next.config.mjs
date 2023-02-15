import { withPlausibleProxy } from 'next-plausible'

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./env.mjs'))

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: ['jxtzqpuzyqbwtwcwvmln.supabase.co'],
  },
  experimental: {
    swcMinify: true,
  },
}
export default withPlausibleProxy()(config)
