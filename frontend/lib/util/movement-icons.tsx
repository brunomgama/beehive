import { MovementCategory } from "../api/types"
import { 
  ShoppingCart, Wifi, Laptop, Coffee, Car, Music, Heart, Zap, GraduationCap, Tv, MoreHorizontal, 
  Home, Wrench, Shield, Sofa, Fuel, Bus, CarFront, ParkingCircle, Receipt, Shirt, Smartphone, 
  Gift, Sparkles, ShoppingBasket, UtensilsCrossed, Pizza, Wine, Film, Calendar, Gamepad2, Moon, Dumbbell, 
  Code, Globe, Phone, Droplet, Lightbulb, Flame, Briefcase, Plane, FileText, GraduationCap as Book, 
  Building2, CreditCard, Play, HeadphonesIcon, Cloud, Newspaper, Hotel, 
  Map, Wallet, TrendingUp, RotateCcw, HomeIcon, PawPrint, Syringe, Stethoscope, Users, PillBottle, 
  ArrowsUpFromLine
} from 'lucide-react'

export interface IconMapping {
  keywords: string[]
  iconPath: string
  iconType?: 'emoji' | 'image'
  bgColor?: string
}

export const MOVEMENT_ICON_MAPPINGS: IconMapping[] = [
  {
    keywords: ['apple', 'ios'],
    iconPath: '/icons/apple.svg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['auchan'],
    iconPath: '/icons/auchan.svg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['carrefour'],
    iconPath: '/icons/carrefour.svg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['lidl'],
    iconPath: '/icons/lidl.svg',
    iconType: 'image',
    bgColor: '#0050AA'
  },
  {
    keywords: ['aldi'],
    iconPath: '/icons/aldi.svg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['intermarche'],
    iconPath: '/icons/intermarche.svg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['delhaize'],
    iconPath: '/icons/delhaize.svg',
    iconType: 'image',
    bgColor: '#00512A'
  },
  {
    keywords: ['colruyt'],
    iconPath: '/icons/colruyt.png',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['pingo doce'],
    iconPath: '/icons/pingo_doce.jpeg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['continente'],
    iconPath: '/icons/continente.svg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['coca', 'coca cola'],
    iconPath: '/icons/coca_cola.svg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['mcdonalds', "mcdonald's", 'mac'],
    iconPath: '/icons/mcdonalds.png',
    iconType: 'image',
    bgColor: '#DB0007'
  },
  {
    keywords: ['burger king'],
    iconPath: '/icons/burgerking.png',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['starbucks'],
    iconPath: '/icons/starbucks.svg',
    iconType: 'image',
    bgColor: '#00754A'
  },
  {
    keywords: ['zara'],
    iconPath: '/icons/zara.svg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['hm'],
    iconPath: '/icons/hm.svg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['bershka'],
    iconPath: '/icons/bershka.svg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['primark'],
    iconPath: '/icons/primark.jpeg',
    iconType: 'image',
    bgColor: '#00AEDB'
  },
  {
    keywords: ['nike'],
    iconPath: '/icons/nike.svg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['adidas'],
    iconPath: '/icons/adidas.svg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['puma'],
    iconPath: '/icons/puma.svg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['dechatlon'],
    iconPath: '/icons/dechatlon.png',
    iconType: 'image',
    bgColor: '#3643BA'
  },
  {
    keywords: ['fnac'],
    iconPath: '/icons/fnac.svg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['worten'],
    iconPath: '/icons/worten.svg',
    iconType: 'image',
    bgColor: '#E41A15'
  },
  {
    keywords: ['vodafone', 'telemovel'],
    iconPath: '/icons/vodafone.svg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['proximus'],
    iconPath: '/icons/proximus.png',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['scarlet', 'net', 'internet'],
    iconPath: '/icons/scarlet.svg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['orange'],
    iconPath: '/icons/orange.svg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['galp', 'gasolina', 'gasoleo'],
    iconPath: '/icons/galp.svg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['uber', 'uber eats'],
    iconPath: '/icons/uber.svg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['bolt'],
    iconPath: '/icons/bolt.svg',
    iconType: 'image',
    bgColor: '#32BB78'
  },
  {
    keywords: ['spotify'],
    iconPath: '/icons/spotify.svg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['netflix'],
    iconPath: '/icons/netflix.png',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['amazon'],
    iconPath: '/icons/amazon.svg',
    iconType: 'image',
    bgColor: '#FFFFFF'
  },
  {
    keywords: ['action'],
    iconPath: '/icons/action.png',
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
    keywords: ['jims'],
    iconPath: '/icons/jims.svg',
    iconType: 'image',
    bgColor: '#000000'
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

export const CATEGORY_ICONS: Record<MovementCategory, React.ComponentType<{ className?: string }>> = {
  TRANSFER: ArrowsUpFromLine,
  // Housing
  RENT: Home,
  PROPERTY_TAXES: Building2,
  HOME_MAINTENANCE_REPAIRS: Wrench,
  HOME_INSURANCE: Shield,
  HOUSEHOLD_SUPPLIES_FURNITURE: Sofa,
  
  // Transportation
  FUEL: Fuel,
  PUBLIC_TRANSPORT: Bus,
  UBER: Car,
  CAR_MAINTENANCE: CarFront,
  PARKING: ParkingCircle,
  VEHICLE_INSURANCE: Shield,
  TOLLS: Receipt,
  
  // Shopping
  SHOPPING: ShoppingCart,
  CLOTHING: Shirt,
  ELECTRONICS: Smartphone,
  GIFTS: Gift,
  BEAUTY_COSMETICS: Sparkles,
  
  // Food & Dining
  GROCERIES: ShoppingBasket,
  RESTAURANTS: UtensilsCrossed,
  FAST_FOOD: Pizza,
  COFFEE_SHOPS: Coffee,
  ALCOHOL_BARS: Wine,
  FOOD_DRINKS: Coffee,
  
  // Entertainment
  ENTERTAINMENT: Music,
  MOVIES: Film,
  EVENTS: Calendar,
  GAMES: Gamepad2,
  NIGHTLIFE: Moon,
  HOBBIES: Music,
  GYM: Dumbbell,
  
  // Technology
  TECH: Laptop,
  SOFTWARE_SUBSCRIPTIONS: Code,
  INTERNET_SERVICES: Globe,
  MOBILE_PHONE_PLANS: Phone,
  NET: Wifi,
  
  // Utilities
  UTILITIES: Zap,
  WATER: Droplet,
  ELECTRICITY: Lightbulb,
  GAS: Flame,
  
  // Business
  OFFICE_SUPPLIES: Briefcase,
  BUSINESS_TRAVEL: Plane,
  PROFESSIONAL_SERVICES: FileText,
  
  // Education
  EDUCATION: GraduationCap,
  ONLINE_COURSES: Book,
  CLASSES: Users,
  
  // Insurance
  HEALTH_INSURANCE: Shield,
  CAR_INSURANCE: Shield,
  LIFE_INSURANCE: Shield,
  TRAVEL_INSURANCE: Shield,
  
  // Health
  HEALTH: Heart,
  PHARMACY: PillBottle,
  MEDICAL: Stethoscope,
  THERAPY: Users,
  
  // Pets
  PET_FOOD: PawPrint,
  VET_VISITS: Syringe,
  PET_ACCESSORIES: PawPrint,
  PET_GROOMING: Sparkles,
  
  // Financial
  BANK_FEES: CreditCard,
  INVESTMENTS: TrendingUp,
  
  // Streaming
  STREAMING_SERVICES: Tv,
  VIDEO_STREAMING: Play,
  MUSIC_STREAMING: HeadphonesIcon,
  CLOUD_STORAGE: Cloud,
  DIGITAL_MAGAZINES: Newspaper,
  NEWS_SUBSCRIPTIONS: Newspaper,
  
  // Travel
  HOTELS: Hotel,
  FLIGHTS: Plane,
  CAR_RENTAL: Car,
  TOURS: Map,
  
  // Income
  SALARY: Wallet,
  FREELANCING: Briefcase,
  INVESTMENT_INCOME: TrendingUp,
  REFUNDS: RotateCcw,
  RENTAL_INCOME: HomeIcon,
  
  // Other
  OTHER: MoreHorizontal,
}

/**
 * Get icon component for a category
 */
export function getCategoryIcon(category: MovementCategory) {
  return CATEGORY_ICONS[category] || MoreHorizontal
}

/**
 * Render category icon with optional size
 */
export function CategoryIcon({ category, className = "w-5 h-5" }: { 
  category: MovementCategory
  className?: string 
}) {
  const Icon = getCategoryIcon(category)
  return <Icon className={className} />
}