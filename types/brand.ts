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
  brightness?: number
}

export type Font = {
  name?: string
  type?: string
  origin?: string
  originId?: string
  weights?: any[]
}

export type Image = {
  type?: string
  formats?: Format[]
}

export type Format = {
  src?: string
  background?: string | null
  format?: string
  height?: number
  width?: number
  size?: number
}

export type Link = {
  name?: string
  url?: string
}

export type Logo = {
  type?: string
  theme?: null
  formats?: Format[]
}
