import { google } from 'googleapis'

export const getAccessToken = async () =>
  await new Promise<string>((resolve, reject) => {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID || '',
      process.env.GOOGLE_CLIENT_SECRET || '',
      'http://localhost:3000/api/auth/callback/google'
    )

    oAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN || '',
    })

    oAuth2Client.getAccessToken((err, token) => {
      if (err) {
        reject('Could not get access token')
      }
      if (!token || typeof token !== 'string') {
        reject('Access token was not a string')
      } else {
        resolve(token)
      }
    })
  })
