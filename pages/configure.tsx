import { google } from 'googleapis'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import prisma from '@/lib/prisma'

export default function Page(
  data: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return (
    <div>
      <p>
        Paste this in <code>.env</code>:
      </p>
      <pre className="w-4/5 whitespace-pre-wrap bg-slate-200 text-xs ">
        GOOGLE_TOKENS=&apos;{JSON.stringify(data)}&apos;
      </pre>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (ctx.req.headers.host !== 'localhost:3000') {
    return {
      notFound: true,
    }
  }

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID || '',
    process.env.GOOGLE_CLIENT_SECRET || '',
    'http://localhost:3000/api/auth/callback/google'
  )
  const owner = await prisma.user.findFirst({
    include: {
      accounts: true,
    },
    where: {
      email: process.env.OWNER_EMAIL,
    },
  })
  if (owner && owner.accounts) {
    const {
      access_token,
      expires_at: expiry_date,
      id_token,
      refresh_token,
      scope,
      token_type,
    } = owner.accounts[0]

    oAuth2Client.setCredentials({
      access_token,
      expiry_date,
      id_token,
      refresh_token,
      scope: scope || '',
      token_type,
    })
  }
  return {
    ...(((!owner || !owner.accounts) && {
      redirect: {
        destination: '/api/auth/signin/google',
        permanent: false,
      },
    }) || {
      props: {
        access_token: owner?.accounts[0].access_token,
        refresh_token: owner?.accounts[0].refresh_token,
      },
    }),
  }
}
