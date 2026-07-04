import Image from 'next/image'
import Link from 'next/link'

interface BrandLogoProps {
  href?: string
  className?: string
  height?: number
  priority?: boolean
}

export default function BrandLogo({
  href = '/',
  className = 'h-[38px] w-auto object-contain',
  height = 38,
  priority = false,
}: BrandLogoProps) {
  const img = (
    <Image
      src="/images/mithai-header.png"
      alt="Guiltfree Goodies"
      width={487}
      height={129}
      priority={priority}
      unoptimized
      className={className}
      style={{ height, width: 'auto' }}
    />
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex transition-opacity duration-200 hover:opacity-90">
        {img}
      </Link>
    )
  }

  return img
}
