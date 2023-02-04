import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import type { Company } from '@prisma/client'

import prisma from '@/lib/prisma'
import { generateResumePacket } from '@/lib/resume'

export const uploadFile = async ({
  file,
  name,
  code,
  slug,
}: {
  file: Buffer
  name: string
  code: string
  slug: string
}) => {
  if (
    !process.env.AWS_KEY ||
    !process.env.AWS_SECRET ||
    !process.env.AWS_BUCKET
  ) {
    throw new Error('Missing AWS credentials')
  }
  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
    },
    region: 'us-west-1',
    endpoint: 'https://s3-us-west-1.amazonaws.com',
  })

  const key = `${slug}/${code}/Tim Feeley Resume - ${name}.pdf`
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Body: file,
      ContentType: 'application/pdf',
      CacheControl: 'no-cache',
    })
  )
  return `https://hire-timfeeley.s3.us-west-1.amazonaws.com/${key}`
}

export const getLatestResume = async ({
  slug,
  code,
  name,
  resumeLastGenerated,
  lastUpdated,
}: Pick<
  Company,
  'slug' | 'code' | 'name' | 'resumeLastGenerated' | 'lastUpdated'
>) => {
  if (!resumeLastGenerated || resumeLastGenerated < lastUpdated) {
    return await prisma.company.update({
      where: { slug },
      data: {
        resumeLastGenerated: new Date(),
        resumeUrl: await uploadFile({
          code,
          name,
          slug,
          file: Buffer.from(await generateResumePacket({ slug })),
        }),
      },
    })
  } else {
    return `https://hire-timfeeley.s3.us-west-1.amazonaws.com/${slug}/${code}/Tim Feeley Resume - ${name}.pdf`
  }
}
