import { z } from 'zod'

import { env } from '@/env.mjs'
import { type Brand } from '@/types/brand'

import { createTRPCRouter, protectedProcedure } from '../trpc'

const MOCK = false

export const brandRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ domain: z.string() }))
    .query(async ({ input: { domain } }) => {
      if (MOCK) {
        return {
          colors: [
            { brightness: 69, hex: '#344854', type: 'dark' },
            { brightness: 120, hex: '#677b8c', type: 'light' },
            { brightness: 136, hex: '#00a5ff', type: 'accent' },
          ],
          description:
            'We build technologies that help people connect with friends and family, find communities, and grow businesses.\n',
          logos: [
            {
              formats: [
                {
                  background: null,
                  format: 'png',
                  height: 400,
                  size: 17182,
                  src: 'https://asset.brandfetch.io/idWvz5T3V7/id8N6UJd7a.png',
                  width: 400,
                },
              ],
              theme: 'dark',
              type: 'icon',
            },
            {
              formats: [
                {
                  background: 'transparent',
                  format: 'png',
                  height: 161,
                  size: 46197,
                  src: 'https://asset.brandfetch.io/idWvz5T3V7/idMn73GqYH.png',
                  width: 800,
                },
                {
                  background: 'transparent',
                  format: 'svg',
                  height: null,
                  size: 914299,
                  src: 'https://asset.brandfetch.io/idWvz5T3V7/idWh5rJSsE.svg',
                  width: null,
                },
              ],
              theme: 'dark',
              type: 'logo',
            },
          ],
          name: 'Meta Platforms, Inc.',
        }
      } else {
        const response = await fetch(
          `https://api.brandfetch.io/v2/brands/${domain}`,
          {
            headers: {
              Authorization: `Bearer ${env.BRANDFETCH_API}`,
            },
          }
        )

        const { colors, logos, description, name } =
          (await response.json()) as Brand

        return {
          colors,
          description,
          logos,
          name,
        }
      }
    }),
})

export default brandRouter
