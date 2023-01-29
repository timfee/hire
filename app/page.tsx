'use client'

export default function Home() {
  if (typeof window !== 'undefined') {
    document.location.href = 'https://timfeeley.com'
  }

  return <main className="text-center"></main>
}
