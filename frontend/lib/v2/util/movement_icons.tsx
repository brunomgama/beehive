import Image from "next/image"
import { getMovementIcon } from "@/lib/v2/util/movement-icons"

interface MovementIconProps {
  description: string
  category: string
  className?: string
  opacity?: number
}

export function MovementIcon({ description, category, className = "", opacity = 1 }: MovementIconProps) {
  const iconData = getMovementIcon(description, category)
  
  return (
    <div 
      className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 ${className}`}
      style={{ backgroundColor: iconData.bgColor, opacity }}
    >
      {iconData.type === 'image' && (
        <Image src={iconData.content} alt={description}
          width={24} height={24} className="w-10 h-10 object-contain rounded-lg"/>
      )}
      {iconData.type === 'emoji' && (
        <span className="text-lg">{iconData.content}</span>
      )}
      {iconData.type === 'letter' && (
        <span className="text-white text-sm font-bold">{iconData.content}</span>
      )}
    </div>
  )
}