'use client'
import { Analytics } from '@vercel/analytics/react'
import PlausibleProvider from 'next-plausible'

export function AnalyticsWrapper() {
  return (
    <>
      <Analytics />
      <PlausibleProvider
        domain="hire.timfeeley.com"
        trackFileDownloads
        trackOutboundLinks
      />
    </>
  )
}
