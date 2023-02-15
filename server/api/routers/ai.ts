import { Configuration, OpenAIApi } from 'openai'
import { z } from 'zod'

import { env } from '@/env.mjs'
import { prompts } from '@/utils/ai'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const aiRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        company: z.string(),
        field: z.string(),
        role: z.string().optional(),
      })
    )
    .query(async ({ input: { company, role, field } }) => {
      const openai = new OpenAIApi(
        new Configuration({
          apiKey: env.OPENAI_API,
        })
      )

      const response = await openai.createCompletion({
        max_tokens: 300,
        model: 'text-davinci-003',
        presence_penalty: 1.5,
        prompt: prompts[field](company, role),
        temperature: 0.85,
      })

      return (
        response.data.choices[0].text?.trim() ??
        '(nothing returned, try again?)'
      )
    }),
})

export default aiRouter
