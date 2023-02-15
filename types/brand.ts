export type Brand = {
  name?: string
  domain?: string
  claimed?: boolean
  description?: string
  links?: Link[]
  logos?: Logo[]
  colors?: Color[]
  fonts?: Font[]
  images?: Image[]
}

export type Color = {
  hex?: string
  type?: string
  brightness?: number | undefined
}

export type Font = {
  name?: string
  type?: string
  origin?: string
  originId?: string
  weights?: string[]
}

export type Image = {
  type?: string
  formats?: Format[]
}

export type Format = {
  src?: string
  background?: string | null
  format?: string
  height?: number | null
  width?: number | null
  size?: number | null
}

export type Link = {
  name?: string
  url?: string
}

export type Logo = {
  type?: string | null
  theme?: string | null
  formats?: Format[]
}

export type SingleArrayOfLogos = {
  src?: string
  format?: string
  height?: number
  width?: number
  theme?: string
  size?: number
}
