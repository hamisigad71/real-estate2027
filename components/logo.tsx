import React from 'react'
import Image from 'next/image'

interface LogoProps {
  className?: string
  size?: number
  variant?: 'light' | 'dark'
}

export function Logo({ className = "", size = 40, variant = 'dark' }: LogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <Image
        src="/logo.png"
        alt="StudioConfig Logo"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
    </div>
  )
}
