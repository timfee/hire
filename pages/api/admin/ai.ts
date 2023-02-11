import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API,
})
const openai = new OpenAIApi(configuration)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (
    !req.query ||
    !req.query.company ||
    typeof req.query.company !== 'string'
  ) {
    return res.status(400).json({ error: 'Missing company query param' })
  }

  const { company, field } = req.query
  let prompt
  switch (field) {
    case 'resumeMessage':
      prompt = `
Write a short memo that will accompany my resume packet.  It should start exactly like this: "Hello ${company},

I’m a PM & UX leader with two decades of experience developing high-performing teams and delivering impactful products used by billions of people."

Then, insert a new pagraph break and write a short paragraph that is casual, informal, simple, clever,  and connects my skills with ${company}'s mission. Maximum of 3 sentences.`

      break

    case 'websiteMessage':
    default:
      prompt = `
I’m Tim Feeley, a PM & UX leader with two decades of experience developing high-performing teams and delivering impactful products used by billions of people. 
    
I worked at Google for 4 years, where I grew and led teams and PMs in 4 countries responsible for protecting over Google accounts, building culture, principles and practices to keep everyone aligned and empowered to make decisions autonomously.
At Goldman Sachs, I worked for the Marcus consumer fintech division and developed a customizable and centralized platform for account opening and identity management, serving 9M+ customers while increasing signup conversion.
At Meta, I was responsible for the global Facebook UX library, containing designs, code and guidance to craft beautiful, simple interfaces —with measurable results.
At Tripadvisor, I created and led the Site Experience team, improving how travelers navigate and experience the site and apps, managing seven reports, two managers & 30+ engineers across 3 offices.

I have a technical and design background and have led teams, grown Product Managers and built product organizations.

I'd like to write an informal letter expressing interest for a Product Management role at ${company} that is friendly, informal, and succint.
It doesn't need too many details. Two paragraph maximum. 

Avoid phrases like "I am confident" and "skillset and experience" and "proven track record" or anything too formal or business jargon-y. 

You don't need to list every single job I've worked at, just a summary  of what’s most relevant for ${company}. If possible, tie in my experience with ${company}'s company mission. Again, should be casual and clever.`
      break
  }

  await openai
    .createCompletion({
      max_tokens: 300,
      model: 'text-davinci-003',
      presence_penalty: 1.5,
      prompt,
      temperature: 0.85,
    })
    .then((response) => {
      res.status(200).send((response.data.choices[0].text ?? 'error').trim())
    })
    .catch((error) => {
      res.status(200).send(error)
    })
}
