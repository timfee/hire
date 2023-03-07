import { Configuration, OpenAIApi } from 'openai'
import { z } from 'zod'

import { env } from '@/env.mjs'
import { prompts } from '@/utils/ai'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const humanRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        company: z.string(),
        field: z.string(),
        role: z.string().optional(),
      })
    )
    .query(({ input: { field, role, company } }) => {
      if (field === 'websiteMessage') {
        return `# Hey there ${company},

Thanks for stopping by! I’m Tim, and I’m excited to be applying for the ${role} role.

I put this site together not only to share more information about myself, but also to give you a sense of how I work and what the products I build actually _feel_ like when people are using them.

With over 20 years of product management experience, I’ve had the privilege of working on products that have been used by billions of people, like Google Accounts, the Facebook App and Tripadvisor’s core product experiences.

From creating delightful experiences to leading teams, I understand how to foster an engaging workplace culture and bring out the best in others. 

I’d be thrilled to introduce my skillset to your team and join a mission like ${company}’s.`
      } else {
        return `I’m Tim—a PM & UX leader with two decades of experience developing high-performing teams and delivering impactful products used by billions of people, and I’m excited to share my resume with you for the ${role} role.

I’m passionate about building user-friendly experiences, reducing complexity in software design, and driving innovation through research and experimentation.`
      }
    }),
})

export default humanRouter
