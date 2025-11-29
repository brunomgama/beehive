export interface IconMapping {
  keywords: string[]
  iconPath: string
  iconType?: 'emoji' | 'image'
  bgColor?: string
}

export const MOVEMENT_ICON_MAPPINGS: IconMapping[] = [
  {
    keywords: ['spotify'],
    iconPath: '/icons/spotify.png',
    iconType: 'image',
    bgColor: '#ffffff'
  },
  {
    keywords: ['netflix'],
    iconPath: '/icons/netflix.png',
    iconType: 'image',
    bgColor: '#E50914'
  },
  {
    keywords: ['uber', 'uber eats'],
    iconPath: '/icons/uber.png',
    iconType: 'image',
    bgColor: '#000000'
  },
  {
    keywords: ['amazon'],
    iconPath: '/icons/amazon.png',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['mcdonalds', "mcdonald's", 'mac'],
    iconPath: '/icons/mcdonalds.png',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['burger king'],
    iconPath: '/icons/burgerking.png',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['starbucks'],
    iconPath: '/icons/starbucks.png',
    iconType: 'image',
    bgColor: '#00704A'
  },
  {
    keywords: ['lidl'],
    iconPath: '/icons/lidl.png',
    iconType: 'image',
    bgColor: '#1772ba'
  },
  {
    keywords: ['action'],
    iconPath: '/icons/action.png',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['colruyt'],
    iconPath: '/icons/colruyt.png',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['carrefour'],
    iconPath: '/icons/carrefour.png',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['stib', 'metro', 'autocarro', 'bus', 'tram'],
    iconPath: '/icons/stib.png',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['dechatlon'],
    iconPath: '/icons/dechatlon.png',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['jims'],
    iconPath: '/icons/jims.png',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['grocery', 'supermarket'],
    iconPath: '🛒',
    iconType: 'emoji',
    bgColor: '#4CAF50'
  },
  {
    keywords: ['restaurant', 'dinner', 'lunch'],
    iconPath: '🍽️',
    iconType: 'emoji',
    bgColor: '#FF5722'
  },
  {
    keywords: ['gas', 'fuel', 'petrol', 'gasoline'],
    iconPath: '⛽',
    iconType: 'emoji',
    bgColor: '#9C27B0'
  },
  {
    keywords: ['salary', 'paycheck', 'income'],
    iconPath: '💰',
    iconType: 'emoji',
    bgColor: '#4CAF50'
  },
  {
    keywords: ['gym', 'fitness'],
    iconPath: '💪',
    iconType: 'emoji',
    bgColor: '#FF9800'
  },
  {
    keywords: ['cinema', 'movie', 'theater'],
    iconPath: '🎬',
    iconType: 'emoji',
    bgColor: '#9C27B0'
  },
  {
    keywords: ['coffee', 'cafe', 'café'],
    iconPath: '☕',
    iconType: 'emoji',
    bgColor: '#795548'
  },
  {
    keywords: ['transport', 'bus', 'train', 'metro'],
    iconPath: '🚇',
    iconType: 'emoji',
    bgColor: '#2196F3'
  },
  {
    keywords: ['pharmacy', 'medicine', 'health'],
    iconPath: '💊',
    iconType: 'emoji',
    bgColor: '#F44336'
  },
]

export interface MovementIcon {
  type: 'emoji' | 'image' | 'letter'
  content: string
  bgColor: string
}
  
/**
 * Gets the appropriate icon for a movement based on its description
 * Returns an object with icon type, content, and background color
 */
export function getMovementIcon(description: string, category: string): MovementIcon {
  const normalizedDescription = description.toLowerCase().trim()
  
  // Check each mapping for keyword matches
  for (const mapping of MOVEMENT_ICON_MAPPINGS) {
    for (const keyword of mapping.keywords) {
      if (normalizedDescription.includes(keyword.toLowerCase())) {
        return {
          type: mapping.iconType || 'image',
          content: mapping.iconPath,
          bgColor: mapping.bgColor || '#3B82F6'
        }
      }
    }
  }
  
  // Fallback: return first letter of category with a default color
  return {
    type: 'letter',
    content: category[0]?.toUpperCase() || '?',
    bgColor: '#3B82F6'
  }
}

/**
 * Add a new icon mapping dynamically (useful for user customization later)
 */
export function addIconMapping(mapping: IconMapping): void {
  MOVEMENT_ICON_MAPPINGS.push(mapping)
}

/**
 * Get all configured mappings (useful for admin/settings panel)
 */
export function getAllIconMappings(): IconMapping[] {
  return [...MOVEMENT_ICON_MAPPINGS]
}