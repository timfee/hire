import sharp from 'sharp'

export async function trimWhitespace(image: Buffer) {
  const imageBytes = sharp(image).trim()
  const metadata = await imageBytes.metadata()
  const { width, height } = metadata
  return { imageBytes: await imageBytes.toBuffer(), width, height }
}

export async function getRemoteImage(url: string) {
  const response = await fetch(url)

  const blob = await response.blob()
  const buffer = await blob.arrayBuffer()

  return new Uint8Array(buffer)
}
