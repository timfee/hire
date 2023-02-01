'use client'
import { Analytics } from '@vercel/analytics/react'
import { useSearchParams } from 'next/navigation'
import PlausibleProvider from 'next-plausible'

export function AnalyticsWrapper() {
  const searchParams = useSearchParams()
  return (
    <>
      <Analytics />{' '}
      <PlausibleProvider
        domain="hire.timfeeley.com"
        trackFileDownloads
        trackOutboundLinks
        enabled={searchParams.get('ld') ? false : true}
      />
    </>
  )
}
