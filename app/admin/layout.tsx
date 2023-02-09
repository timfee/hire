import type { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav>ADMIN</nav>
      {children}
    </>
  )
}

export const dynamic = 'force-dynamic'
