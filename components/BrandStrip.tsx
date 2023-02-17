import { CSSProperties } from 'react'

export default function BrandStrip({ color = '#FFFFFF' }) {
  return (
    <div
      className="h-12"
      style={
        {
          backgroundColor: color,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 75%)',
        } as CSSProperties
      }
    />
  )
}
