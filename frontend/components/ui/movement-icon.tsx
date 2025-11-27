import Image from 'next/image'
import { getMovementIcon } from '@/lib/bank/movement-icons'

interface MovementIconProps {
  description: string
  category: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-12 h-12 text-lg'
}

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-lg'
}

export function MovementIcon({description,  category,  size = 'md', className = '' }: MovementIconProps) {
  const icon = getMovementIcon(description, category)
  const sizeClass = sizeClasses[size]
  const textSizeClass = textSizeClasses[size]

  return (
    <div className={`${sizeClass} rounded-full flex items-center justify-center shrink-0 ${className}`} style={{ backgroundColor: `${icon.bgColor}40` }}>
      {icon.type === 'emoji' && (
        <span className={`${textSizeClass}`}>
          {icon.content}
        </span>
      )}
      
      {icon.type === 'image' && (
        <div className="relative w-full h-full p-1">
          <Image src={icon.content} alt={description} fill className="object-contain rounded-full" />
        </div>
      )}
      
      {icon.type === 'letter' && (
        <span className={`${textSizeClass} font-semibold`} style={{ color: icon.bgColor }}>
          {icon.content}
        </span>
      )}
    </div>
  )
}