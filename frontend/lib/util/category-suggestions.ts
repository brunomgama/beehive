import { MovementCategory } from '@/lib/api/bank/movements-api'

export interface CategoryMapping {
  keywords: string[]
  category: MovementCategory
}

export const CATEGORY_KEYWORD_MAPPINGS: CategoryMapping[] = [
  // Housing
  { keywords: ['rent', 'aluguer', 'loyer', 'huur', 'renda'], category: 'RENT' },
  { keywords: ['property tax', 'imi', 'taxe foncière', 'imposto'], category: 'PROPERTY_TAXES' },
  { keywords: ['repair', 'maintenance', 'plumber', 'electrician',
     'reparação', 'caldeira', 'manutenção', 'revisão', 'aquecimento', 'canalização', 'electricista'
    ], category: 'HOME_MAINTENANCE_REPAIRS' },
  { keywords: ['home insurance', 'house insurance', 'seguro casa', 'seguro'], category: 'HOME_INSURANCE' },
  { keywords: ['furniture', 'ikea', 'sofa', 'bed', 'table', 'chair'], category: 'HOUSEHOLD_SUPPLIES_FURNITURE' },
  
  // Transportation
  { keywords: ['fuel', 'gas', 'petrol', 'gasolina', 'gasoleo', 'essence', 'benzine'], category: 'FUEL' },
  { keywords: ['metro', 'bus', 'tram', 'train', 'stib', 'mivb', 'transport public'], category: 'PUBLIC_TRANSPORT' },
  { keywords: ['uber', 'lyft', 'taxi', 'cabify'], category: 'UBER' },
  { keywords: ['car repair', 'mechanic', 'oil change', 'tire', 'pneu', 'mecânico'], category: 'CAR_MAINTENANCE' },
  { keywords: ['parking', 'estacionamento', 'parkeren'], category: 'PARKING' },
  { keywords: ['car insurance', 'auto insurance', 'seguro auto'], category: 'VEHICLE_INSURANCE' },
  { keywords: ['toll', 'portagem', 'péage', 'tol'], category: 'TOLLS' },
  
  // Shopping
  { keywords: ['shopping', 'mall', 'store', 'loja', 'magasin'], category: 'SHOPPING' },
  { keywords: ['clothes', 'clothing', 'zara', 'h&m', 'hm', 'fashion', 'roupa'], category: 'CLOTHING' },
  { keywords: ['phone', 'laptop', 'computer', 'tablet', 'electronics', 'fnac', 'worten', 'apple'], category: 'ELECTRONICS' },
  { keywords: ['gift', 'presente', 'cadeau', 'birthday', 'aniversário'], category: 'GIFTS' },
  { keywords: ['beauty', 'cosmetics', 'makeup', 'perfume', 'sephora'], category: 'BEAUTY_COSMETICS' },
  
  // Food & Dining
  { keywords: ['grocery', 'supermarket', 'auchan', 'carrefour', 'lidl', 'aldi', 'continente', 'pingo doce', 'delhaize', 'colruyt'], category: 'GROCERIES' },
  { keywords: ['restaurant', 'dinner', 'lunch', 'restaurante', 'jantar'], category: 'RESTAURANTS' },
  { keywords: ['mcdonalds', 'burger king', 'kfc', 'fast food', 'quick'], category: 'FAST_FOOD' },
  { keywords: ['coffee', 'starbucks', 'café', 'cafe'], category: 'COFFEE_SHOPS' },
  { keywords: ['bar', 'pub', 'beer', 'wine', 'alcohol', 'cerveja', 'vinho'], category: 'ALCOHOL_BARS' },
  { keywords: ['food', 'meal', 'comida', 'refeição'], category: 'FOOD_DRINKS' },
  
  // Entertainment
  { keywords: ['cinema', 'movie', 'theater', 'filme'], category: 'MOVIES' },
  { keywords: ['concert', 'festival', 'event', 'ticket', 'show'], category: 'EVENTS' },
  { keywords: ['game', 'playstation', 'xbox', 'nintendo', 'steam', 'gaming'], category: 'GAMES' },
  { keywords: ['club', 'nightclub', 'disco', 'nightlife'], category: 'NIGHTLIFE' },
  { keywords: ['hobby', 'craft', 'art supplies'], category: 'HOBBIES' },
  { keywords: ['gym', 'fitness', 'sport', 'academia', 'basic fit', 'jims'], category: 'GYM' },
  
  // Technology & Services
  { keywords: ['software', 'app', 'subscription', 'adobe', 'microsoft'], category: 'SOFTWARE_SUBSCRIPTIONS' },
  { keywords: ['internet', 'wifi', 'broadband', 'scarlet', 'proximus'], category: 'INTERNET_SERVICES' },
  { keywords: ['mobile', 'phone plan', 'vodafone', 'orange', 'meo', 'nos', 'telemovel'], category: 'MOBILE_PHONE_PLANS' },
  
  // Utilities
  { keywords: ['water', 'água', 'eau'], category: 'WATER' },
  { keywords: ['electricity', 'eletricidade', 'électricité', 'edp'], category: 'ELECTRICITY' },
  { keywords: ['gas', 'gás', 'heating'], category: 'GAS' },
  
  // Business
  { keywords: ['office', 'supplies', 'stationery', 'printer'], category: 'OFFICE_SUPPLIES' },
  { keywords: ['business travel', 'conference', 'hotel work'], category: 'BUSINESS_TRAVEL' },
  { keywords: ['lawyer', 'accountant', 'consultant', 'professional'], category: 'PROFESSIONAL_SERVICES' },
  
  // Education
  { keywords: ['course', 'class', 'school', 'university', 'tuition', 'aula'], category: 'EDUCATION' },
  { keywords: ['udemy', 'coursera', 'online course', 'learning'], category: 'ONLINE_COURSES' },
  
  // Insurance
  { keywords: ['health insurance', 'seguro saúde', 'mutuelle'], category: 'HEALTH_INSURANCE' },
  { keywords: ['life insurance', 'seguro vida'], category: 'LIFE_INSURANCE' },
  { keywords: ['travel insurance', 'seguro viagem'], category: 'TRAVEL_INSURANCE' },
  
  // Health & Medical
  { keywords: ['pharmacy', 'medicine', 'farmácia', 'medication'], category: 'PHARMACY' },
  { keywords: ['doctor', 'hospital', 'medical', 'clinic', 'médico'], category: 'MEDICAL' },
  { keywords: ['therapy', 'therapist', 'psychologist', 'terapeuta'], category: 'THERAPY' },
  
  // Pets
  { keywords: ['pet food', 'dog food', 'cat food', 'ração'], category: 'PET_FOOD' },
  { keywords: ['vet', 'veterinary', 'veterinário'], category: 'VET_VISITS' },
  { keywords: ['pet shop', 'pet store', 'pet accessories'], category: 'PET_ACCESSORIES' },
  { keywords: ['grooming', 'pet groomer'], category: 'PET_GROOMING' },
  
  // Banking & Investments
  { keywords: ['bank fee', 'commission', 'taxa bancária'], category: 'BANK_FEES' },
  { keywords: ['investment', 'stock', 'etf', 'crypto', 'bitcoin'], category: 'INVESTMENTS' },
  
  // Streaming & Subscriptions
  { keywords: ['netflix', 'hbo', 'disney', 'video streaming', 'iptv'], category: 'VIDEO_STREAMING' },
  { keywords: ['spotify', 'apple music', 'music streaming'], category: 'MUSIC_STREAMING' },
  { keywords: ['cloud', 'dropbox', 'google drive', 'icloud', 'google'], category: 'CLOUD_STORAGE' },
  { keywords: ['magazine', 'news', 'newspaper', 'jornal', 'jornal'], category: 'NEWS_SUBSCRIPTIONS' },
  
  // Travel
  { keywords: ['hotel', 'booking', 'airbnb', 'accommodation'], category: 'HOTELS' },
  { keywords: ['flight', 'plane', 'airline', 'ryanair', 'tap', 'voo'], category: 'FLIGHTS' },
  { keywords: ['car rental', 'rent a car', 'hertz', 'sixt'], category: 'CAR_RENTAL' },
  { keywords: ['tour', 'excursion', 'tourist', 'turismo'], category: 'TOURS' },
  
  // Income
  { keywords: ['salary', 'salário', 'wage', 'paycheck'], category: 'SALARY' },
  { keywords: ['freelance', 'freelancing', 'consulting'], category: 'FREELANCING' },
  { keywords: ['dividend', 'investment income', 'interest'], category: 'INVESTMENT_INCOME' },
  { keywords: ['refund', 'reembolso', 'return'], category: 'REFUNDS' },
  { keywords: ['rental income', 'rent income', 'aluguer'], category: 'RENTAL_INCOME' },
]

/**
 * Suggests categories based on the description text
 * Returns up to 11 most relevant categories
 */
export function suggestCategories(description: string): MovementCategory[] {
  const normalizedDescription = description.toLowerCase().trim()
  const categoryScores = new Map<MovementCategory, number>()

  // Score each category based on keyword matches
  for (const mapping of CATEGORY_KEYWORD_MAPPINGS) {
    let score = 0
    for (const keyword of mapping.keywords) {
      if (normalizedDescription.includes(keyword.toLowerCase())) {
        // Give higher score to longer keyword matches (more specific)
        score += keyword.length
      }
    }
    if (score > 0) {
      categoryScores.set(mapping.category, (categoryScores.get(mapping.category) || 0) + score)
    }
  }

  // Sort by score and return top 11 unique categories
  const sortedCategories = Array.from(categoryScores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category)
    .slice(0, 11)

  return sortedCategories
}

/**
 * Get all available categories (for the "More" button)
 */
export function getAllCategories(): MovementCategory[] {
  return [
    'RENT', 'PROPERTY_TAXES', 'HOME_MAINTENANCE_REPAIRS', 'HOME_INSURANCE', 'HOUSEHOLD_SUPPLIES_FURNITURE',
    'FUEL', 'PUBLIC_TRANSPORT', 'UBER', 'CAR_MAINTENANCE', 'PARKING', 'VEHICLE_INSURANCE', 'TOLLS',
    'SHOPPING', 'CLOTHING', 'ELECTRONICS', 'GIFTS', 'BEAUTY_COSMETICS',
    'GROCERIES', 'RESTAURANTS', 'FAST_FOOD', 'COFFEE_SHOPS', 'ALCOHOL_BARS', 'FOOD_DRINKS',
    'ENTERTAINMENT', 'MOVIES', 'EVENTS', 'GAMES', 'NIGHTLIFE', 'HOBBIES', 'GYM',
    'TECH', 'SOFTWARE_SUBSCRIPTIONS', 'INTERNET_SERVICES', 'MOBILE_PHONE_PLANS', 'NET',
    'UTILITIES', 'WATER', 'ELECTRICITY', 'GAS',
    'OFFICE_SUPPLIES', 'BUSINESS_TRAVEL', 'PROFESSIONAL_SERVICES',
    'EDUCATION', 'ONLINE_COURSES', 'CLASSES',
    'HEALTH_INSURANCE', 'CAR_INSURANCE', 'LIFE_INSURANCE', 'TRAVEL_INSURANCE',
    'HEALTH', 'PHARMACY', 'MEDICAL', 'THERAPY',
    'PET_FOOD', 'VET_VISITS', 'PET_ACCESSORIES', 'PET_GROOMING',
    'BANK_FEES', 'INVESTMENTS',
    'STREAMING_SERVICES', 'VIDEO_STREAMING', 'MUSIC_STREAMING', 'CLOUD_STORAGE', 'DIGITAL_MAGAZINES', 'NEWS_SUBSCRIPTIONS',
    'HOTELS', 'FLIGHTS', 'CAR_RENTAL', 'TOURS',
    'SALARY', 'FREELANCING', 'INVESTMENT_INCOME', 'REFUNDS', 'RENTAL_INCOME',
    'OTHER'
  ]
}
