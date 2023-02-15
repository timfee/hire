import Image, { type ImageProps } from 'next/image'

type SmartImageProps = ImageProps & {
  originalWidth: number
  originalHeight: number
}
export default function SmartImage({
  height: _height,
  width: _width,
  originalHeight,
  originalWidth,
  src,
  alt,
  ...imageProps
}: SmartImageProps) {
  const ASPECT_RATIO = originalWidth / originalHeight

  let height = _height ? Number.parseInt(_height.toString()) : undefined
  let width = _width ? Number.parseInt(_width.toString()) : undefined

  if (height) {
    width = Math.round(height * ASPECT_RATIO)
  } else if (width) {
    height = Math.round(width / ASPECT_RATIO)
  }
  if (!src) {
    return <></>
  }

  return (
    <Image
      priority
      height={height}
      width={width}
      src={src}
      alt={alt}
      {...imageProps}
    />
  )
}
