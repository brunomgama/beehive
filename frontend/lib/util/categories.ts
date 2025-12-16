import { MovementCategory } from "../api/types"

export interface CategoryMapping {
  keywords: string[]
  category: MovementCategory
}

export const CATEGORY_LABELS: Record<MovementCategory, string> = {
  // Transfers
  TRANSFER: 'Transfer',
  
  // Housing
  RENT: 'Rent',
  PROPERTY_TAXES: 'Property Taxes',
  HOME_MAINTENANCE_REPAIRS: 'Home Maintenance',
  HOME_INSURANCE: 'Home Insurance',
  HOUSEHOLD_SUPPLIES_FURNITURE: 'Household Items',
  
  // Transportation
  FUEL: 'Fuel',
  PUBLIC_TRANSPORT: 'Public Transport',
  UBER: 'Uber',
  CAR_MAINTENANCE: 'Car Maintenance',
  PARKING: 'Parking',
  VEHICLE_INSURANCE: 'Vehicle Insurance',
  TOLLS: 'Tolls',
  
  // Shopping
  SHOPPING: 'Shopping',
  CLOTHING: 'Clothing',
  ELECTRONICS: 'Electronics',
  GIFTS: 'Gifts',
  BEAUTY_COSMETICS: 'Beauty',
  
  // Food & Dining
  GROCERIES: 'Groceries',
  RESTAURANTS: 'Restaurants',
  FAST_FOOD: 'Fast Food',
  COFFEE_SHOPS: 'Coffee Shops',
  ALCOHOL_BARS: 'Alcohol & Bars',
  FOOD_DRINKS: 'Food & Drinks',
  
  // Entertainment
  ENTERTAINMENT: 'Entertainment',
  MOVIES: 'Movies',
  EVENTS: 'Events',
  GAMES: 'Games',
  NIGHTLIFE: 'Nightlife',
  HOBBIES: 'Hobbies',
  GYM: 'Gym',
  
  // Technology & Services
  TECH: 'Technology',
  SOFTWARE_SUBSCRIPTIONS: 'Software',
  INTERNET_SERVICES: 'Internet Services',
  MOBILE_PHONE_PLANS: 'Mobile Plans',
  NET: 'Internet',
  
  // Utilities
  UTILITIES: 'Utilities',
  WATER: 'Water',
  ELECTRICITY: 'Electricity',
  GAS: 'Gas',
  
  // Business
  OFFICE_SUPPLIES: 'Office Supplies',
  BUSINESS_TRAVEL: 'Business Travel',
  PROFESSIONAL_SERVICES: 'Professional',
  
  // Education
  EDUCATION: 'Education',
  ONLINE_COURSES: 'Online Courses',
  CLASSES: 'Classes',
  
  // Insurance
  HEALTH_INSURANCE: 'Health Insurance',
  CAR_INSURANCE: 'Car Insurance',
  LIFE_INSURANCE: 'Life Insurance',
  TRAVEL_INSURANCE: 'Travel Insurance',
  
  // Health & Medical
  HEALTH: 'Health',
  PHARMACY: 'Pharmacy',
  MEDICAL: 'Medical',
  THERAPY: 'Therapy',
  
  // Pets
  PET_FOOD: 'Pet Food',
  VET_VISITS: 'Vet Visits',
  PET_ACCESSORIES: 'Pet Accessories',
  PET_GROOMING: 'Pet Grooming',
  
  // Banking & Investments
  BANK_FEES: 'Bank Fees',
  INVESTMENTS: 'Investments',
  
  // Streaming & Subscriptions
  STREAMING_SERVICES: 'Streaming',
  VIDEO_STREAMING: 'Video Streaming',
  MUSIC_STREAMING: 'Music Streaming',
  CLOUD_STORAGE: 'Cloud Storage',
  DIGITAL_MAGAZINES: 'Digital Magazines',
  NEWS_SUBSCRIPTIONS: 'News',
  
  // Travel
  HOTELS: 'Hotels',
  FLIGHTS: 'Flights',
  CAR_RENTAL: 'Car Rental',
  TOURS: 'Tours',
  
  // Income
  SALARY: 'Salary',
  FREELANCING: 'Freelancing',
  INVESTMENT_INCOME: 'Investment Income',
  REFUNDS: 'Refunds',
  RENTAL_INCOME: 'Rental Income',
  
  // General
  OTHER: 'Other'
}

export const CATEGORY_COLORS: Record<MovementCategory, string> = {
  // Transfers
  TRANSFER: 'bg-slate-500',
  
  // Housing
  RENT: 'bg-amber-600',
  PROPERTY_TAXES: 'bg-amber-700',
  HOME_MAINTENANCE_REPAIRS: 'bg-orange-600',
  HOME_INSURANCE: 'bg-orange-500',
  HOUSEHOLD_SUPPLIES_FURNITURE: 'bg-yellow-600',
  
  // Transportation
  FUEL: 'bg-green-600',
  PUBLIC_TRANSPORT: 'bg-green-500',
  UBER: 'bg-emerald-500',
  CAR_MAINTENANCE: 'bg-teal-600',
  PARKING: 'bg-teal-500',
  VEHICLE_INSURANCE: 'bg-cyan-600',
  TOLLS: 'bg-cyan-500',
  
  // Shopping
  SHOPPING: 'bg-purple-500',
  CLOTHING: 'bg-purple-600',
  ELECTRONICS: 'bg-indigo-600',
  GIFTS: 'bg-pink-400',
  BEAUTY_COSMETICS: 'bg-fuchsia-500',
  
  // Food & Dining
  GROCERIES: 'bg-orange-500',
  RESTAURANTS: 'bg-red-500',
  FAST_FOOD: 'bg-red-600',
  COFFEE_SHOPS: 'bg-amber-500',
  ALCOHOL_BARS: 'bg-rose-600',
  FOOD_DRINKS: 'bg-orange-500',
  
  // Entertainment
  ENTERTAINMENT: 'bg-pink-500',
  MOVIES: 'bg-violet-500',
  EVENTS: 'bg-fuchsia-600',
  GAMES: 'bg-indigo-500',
  NIGHTLIFE: 'bg-purple-700',
  HOBBIES: 'bg-pink-600',
  GYM: 'bg-red-500',
  
  // Technology & Services
  TECH: 'bg-cyan-500',
  SOFTWARE_SUBSCRIPTIONS: 'bg-sky-500',
  INTERNET_SERVICES: 'bg-blue-600',
  MOBILE_PHONE_PLANS: 'bg-blue-500',
  NET: 'bg-blue-500',
  
  // Utilities
  UTILITIES: 'bg-yellow-500',
  WATER: 'bg-blue-400',
  ELECTRICITY: 'bg-yellow-400',
  GAS: 'bg-orange-400',
  
  // Business
  OFFICE_SUPPLIES: 'bg-slate-600',
  BUSINESS_TRAVEL: 'bg-slate-500',
  PROFESSIONAL_SERVICES: 'bg-gray-600',
  
  // Education
  EDUCATION: 'bg-indigo-500',
  ONLINE_COURSES: 'bg-indigo-600',
  CLASSES: 'bg-violet-600',
  
  // Insurance
  HEALTH_INSURANCE: 'bg-emerald-600',
  CAR_INSURANCE: 'bg-teal-700',
  LIFE_INSURANCE: 'bg-cyan-700',
  TRAVEL_INSURANCE: 'bg-sky-600',
  
  // Health & Medical
  HEALTH: 'bg-red-500',
  PHARMACY: 'bg-red-600',
  MEDICAL: 'bg-rose-600',
  THERAPY: 'bg-pink-600',
  
  // Pets
  PET_FOOD: 'bg-amber-500',
  VET_VISITS: 'bg-orange-600',
  PET_ACCESSORIES: 'bg-yellow-500',
  PET_GROOMING: 'bg-amber-400',
  
  // Banking & Investments
  BANK_FEES: 'bg-slate-700',
  INVESTMENTS: 'bg-green-600',
  
  // Streaming & Subscriptions
  STREAMING_SERVICES: 'bg-rose-500',
  VIDEO_STREAMING: 'bg-red-500',
  MUSIC_STREAMING: 'bg-purple-500',
  CLOUD_STORAGE: 'bg-sky-500',
  DIGITAL_MAGAZINES: 'bg-blue-600',
  NEWS_SUBSCRIPTIONS: 'bg-indigo-600',
  
  // Travel
  HOTELS: 'bg-teal-500',
  FLIGHTS: 'bg-sky-600',
  CAR_RENTAL: 'bg-cyan-600',
  TOURS: 'bg-emerald-500',
  
  // Income
  SALARY: 'bg-green-600',
  FREELANCING: 'bg-emerald-600',
  INVESTMENT_INCOME: 'bg-teal-600',
  REFUNDS: 'bg-lime-500',
  RENTAL_INCOME: 'bg-green-500',
  
  // General
  OTHER: 'bg-gray-500'
}

export const CATEGORY_KEYWORD_MAPPINGS: CategoryMapping[] = [
  // Housing
  { keywords: ['rent', 'rental', 'lease', 'leasing', 'tenancy', 'landlord', 'house', 'apartment', 'room', 'aluguer', 'arrendamento', 'renda'], category: 'RENT' },
  { keywords: ['property tax', 'imi', 'taxe foncière', 'imposto', 'imi', 'imposto', 'impostos', 'imt', 'selo', 'finanças', 'tributária', 'câmara'], category: 'PROPERTY_TAXES' },
  { keywords: ['repair', 'maintenance', 'plumber', 'electrician', 'reparação', 'caldeira', 'manutenção', 'revisão', 'aquecimento', 'canalização', 'electricista', 'obra', 'obras', 'avaria', 'conserto', 'arranjo', 'instalação', 'instalador', 'picheleiro', 'esgotos', 'telhado', 'isolamento', 'pintura', 'trolha', 'carpintaria'], category: 'HOME_MAINTENANCE_REPAIRS' },
  { keywords: ['home insurance', 'house insurance', 'seguro casa', 'seguro', 'apólice', 'seguradora', 'habitação', 'incêndio', 'multirriscos'], category: 'HOME_INSURANCE' },
  { keywords: ['furniture', 'ikea', 'sofa', 'bed', 'table', 'chair', 'couch', 'mattress', 'wardrobe', 'desk', 'shelf', 'armário', 'cama', 'colchão', 'mesa', 'cadeira', 'sofá', 'estante', 'móvel', 'móveis', 'decoração', 'tapete', 'cortinas'], category: 'HOUSEHOLD_SUPPLIES_FURNITURE' },
  
  // Transportation
  { keywords: ['fuel', 'gas', 'petrol', 'gasolina', 'gasoleo', 'essence', 'benzine', 'diesel', 'combustivel', 'repsol', 'galp', 'bp', 'shell'], category: 'FUEL' },
  { keywords: ['metro', 'bus', 'tram', 'train', 'stib', 'mivb', 'transport public', 'autocarro', 'comboio', 'cp', 'fertagus', 'transtejo'], category: 'PUBLIC_TRANSPORT' },
  { keywords: ['uber', 'lyft', 'taxi', 'cabify', 'bolt', 'tvde'], category: 'UBER' },
  { keywords: ['car repair', 'mechanic', 'oil change', 'tire', 'pneu', 'mecânico', 'oficina', 'revisao', 'oleo', 'filtro', 'travoes', 'bateria', 'alinhamento'], category: 'CAR_MAINTENANCE' },
  { keywords: ['parking', 'estacionamento', 'parkeren', 'parque', 'parquímetro', 'emel', 'telpark'], category: 'PARKING' },
  { keywords: ['car insurance', 'auto insurance', 'seguro auto', 'seguro', 'apólice', 'seguradora', 'automóvel'], category: 'VEHICLE_INSURANCE' },
  { keywords: ['toll', 'portagem', 'péage', 'tol', 'scut', 'viaverde', 'autoestrada'], category: 'TOLLS' },
  
  // Shopping
  { keywords: ['shopping', 'mall', 'store', 'loja', 'magasin', 'centro', 'comercial', 'retail', 'boutique'], category: 'SHOPPING' },
  { keywords: ['clothes', 'clothing', 'zara', 'h&m', 'hm', 'fashion', 'roupa', 'roupas', 'vestuário', 'moda', 'casaco', 'calças', 'sapatos'], category: 'CLOTHING' },
  { keywords: ['phone', 'laptop', 'computer', 'tablet', 'electronics', 'fnac', 'worten', 'apple', 'tecnologia', 'telemóvel', 'pc', 'macbook', 'iphone', 'samsung'], category: 'ELECTRONICS' },
  { keywords: ['gift', 'presente', 'cadeau', 'birthday', 'aniversário', 'prenda', 'oferta'], category: 'GIFTS' },
  { keywords: ['beauty', 'cosmetics', 'makeup', 'perfume', 'sephora', 'beleza', 'maquilhagem', 'cosmética', 'creme', 'batom'], category: 'BEAUTY_COSMETICS' },
  
  // Food & Dining
  { keywords: ['grocery', 'supermarket', 'auchan', 'carrefour', 'lidl', 'aldi', 'continente', 'pingo doce', 'delhaize', 'colruyt', 'mercado', 'mercearia', 'hipermercado', 'minipreço'], category: 'GROCERIES' },
  { keywords: ['restaurant', 'dinner', 'lunch', 'restaurante', 'jantar', 'almoço', 'refeição', 'tasca', 'cantina', 'bistrô'], category: 'RESTAURANTS' },
  { keywords: ['mcdonalds', 'burger king', 'kfc', 'fast food', 'quick', 'subway', 'pizza', 'hamburguer', 'drive'], category: 'FAST_FOOD' },
  { keywords: ['coffee', 'starbucks', 'café', 'cafe', 'cafeteria', 'delta', 'nespresso'], category: 'COFFEE_SHOPS' },
  { keywords: ['bar', 'pub', 'beer', 'wine', 'alcohol', 'cerveja', 'vinho', 'gin', 'vodka', 'beirão', 'cocktail', 'whisky', 'rum'], category: 'ALCOHOL_BARS' },
  { keywords: ['food', 'meal', 'comida', 'refeição', 'bebida', 'snack', 'lanche'], category: 'FOOD_DRINKS' },  
  
  // Entertainment
  { keywords: ['cinema', 'movie', 'theater', 'filme', 'filmes', 'teatro', 'exibição'], category: 'MOVIES' },
  { keywords: ['concert', 'festival', 'event', 'ticket', 'show', 'concerto', 'evento', 'bilhete', 'entrada'], category: 'EVENTS' },
  { keywords: ['game', 'playstation', 'xbox', 'nintendo', 'steam', 'gaming', 'jogo', 'jogos', 'console'], category: 'GAMES' },
  { keywords: ['club', 'nightclub', 'disco', 'nightlife', 'bar', 'balada', 'noite'], category: 'NIGHTLIFE' },
  { keywords: ['hobby', 'craft', 'art', 'pintura', 'desenho', 'manualidades'], category: 'HOBBIES' },
  { keywords: ['gym', 'fitness', 'sport', 'academia', 'jims', 'basics', 'treino', 'exercício', 'desporto'], category: 'GYM' },  
  
  // Technology & Services
  { keywords: ['software', 'app', 'subscription', 'adobe', 'microsoft', 'programa', 'aplicação', 'serviço'], category: 'SOFTWARE_SUBSCRIPTIONS' },
  { keywords: ['internet', 'wifi', 'broadband', 'scarlet', 'proximus', 'rede', 'dados'], category: 'INTERNET_SERVICES' },
  { keywords: ['mobile', 'vodafone', 'orange', 'meo', 'nos', 'telemovel', 'telefone', 'plano'], category: 'MOBILE_PHONE_PLANS' },  
  
  // Utilities
  { keywords: ['water', 'água', 'aqua', 'hidráulico', 'simar'], category: 'WATER' },
  { keywords: ['electricity', 'eletricidade', 'edp', 'energia'], category: 'ELECTRICITY' },
  { keywords: ['gas', 'gás', 'heating', 'aquecimento'], category: 'GAS' },
  
  // Business
  { keywords: ['office', 'supplies', 'stationery', 'printer', 'papel', 'caneta', 'material'], category: 'OFFICE_SUPPLIES' },
  { keywords: ['conference', 'hotel', 'business', 'viagem', 'deslocação'], category: 'BUSINESS_TRAVEL' },
  { keywords: ['lawyer', 'accountant', 'consultant', 'professional', 'advogado', 'contabilista', 'consultor', 'profissional'], category: 'PROFESSIONAL_SERVICES' },
  
  // Education
  { keywords: ['course', 'class', 'school', 'university', 'tuition', 'aula', 'escola', 'universidade', 'formação'], category: 'EDUCATION' },
  { keywords: ['udemy', 'coursera', 'learning', 'curso', 'online', 'ensino'], category: 'ONLINE_COURSES' },  
  
  // Insurance
  { keywords: ['health insurance', 'seguro saúde', 'saúde', 'mutuelle', 'apólice', 'seguradora'], category: 'HEALTH_INSURANCE' },
  { keywords: ['life insurance', 'seguro vida', 'vida', 'apólice', 'seguradora'], category: 'LIFE_INSURANCE' },
  { keywords: ['travel insurance', 'seguro viagem', 'viagem', 'apólice', 'seguradora'], category: 'TRAVEL_INSURANCE' },  
  
  // Health & Medical
  { keywords: ['pharmacy', 'medicine', 'farmácia', 'medicação', 'medicamento', 'droga'], category: 'PHARMACY' },
  { keywords: ['doctor', 'hospital', 'medical', 'clinic', 'médico', 'clínica', 'saúde'], category: 'MEDICAL' },
  { keywords: ['therapy', 'therapist', 'psychologist', 'terapeuta', 'psicólogo', 'psicologia'], category: 'THERAPY' },  
  
  // Pets
  { keywords: ['pet', 'dog', 'cat', 'ração', 'alimento', 'comida'], category: 'PET_FOOD' },
  { keywords: ['vet', 'veterinary', 'veterinário', 'consulta', 'clínica'], category: 'VET_VISITS' },
  { keywords: ['pet', 'shop', 'store', 'acessórios', 'coleira', 'brinquedo', 'gaiola'], category: 'PET_ACCESSORIES' },
  { keywords: ['grooming', 'tosquia', 'banho', 'toalete', 'corte'], category: 'PET_GROOMING' },
  
  // Banking & Investments
  { keywords: ['bank', 'fee', 'commission', 'taxa', 'bancária', 'encargo'], category: 'BANK_FEES' },
  { keywords: ['investment', 'stock', 'etf', 'crypto', 'bitcoin', 'ações', 'fundo', 'criptomoeda'], category: 'INVESTMENTS' },
  
  // Streaming & Subscriptions
  { keywords: ['netflix', 'hbo', 'disney', 'iptv', 'streaming', 'video', 'filmes', 'séries'], category: 'VIDEO_STREAMING' },
  { keywords: ['spotify', 'apple', 'music', 'streaming', 'música', 'canção'], category: 'MUSIC_STREAMING' },
  { keywords: ['cloud', 'dropbox', 'drive', 'icloud', 'google', 'armazenamento', 'nuvem'], category: 'CLOUD_STORAGE' },
  { keywords: ['magazine', 'news', 'newspaper', 'jornal', 'revista', 'notícias'], category: 'NEWS_SUBSCRIPTIONS' },  
  
  // Travel
  { keywords: ['hotel', 'booking', 'airbnb', 'accommodation', 'hospedagem', 'reserva'], category: 'HOTELS' },
  { keywords: ['flight', 'plane', 'airline', 'ryanair', 'tap', 'voo', 'avião'], category: 'FLIGHTS' },
  { keywords: ['car', 'rental', 'hertz', 'sixt', 'aluguer', 'automóvel'], category: 'CAR_RENTAL' },
  { keywords: ['tour', 'excursion', 'tourist', 'turismo', 'visita', 'passeio'], category: 'TOURS' },  
  
  // Income
  { keywords: ['salary', 'salário', 'wage', 'paycheck', 'remuneração', 'ordenado'], category: 'SALARY' },
  { keywords: ['freelance', 'freelancing', 'consulting', 'consultoria', 'trabalho'], category: 'FREELANCING' },
  { keywords: ['dividend', 'investment', 'income', 'interest', 'dividendo', 'rendimentos', 'lucro'], category: 'INVESTMENT_INCOME' },
  { keywords: ['refund', 'reembolso', 'return', 'devolução'], category: 'REFUNDS' },
  { keywords: ['rental', 'rent', 'aluguer', 'renda'], category: 'RENTAL_INCOME' },  
]

export const CATEGORIES: MovementCategory[] = [
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

/**
 * Suggests categories based on the description text
 * Returns up to 11 most relevant categories
 */
export function suggestCategories(description: string): MovementCategory[] {
  const normalizedDescription = description.toLowerCase().trim()
  const categoryScores = new Map<MovementCategory, number>()

  for (const mapping of CATEGORY_KEYWORD_MAPPINGS) {
    let score = 0
    for (const keyword of mapping.keywords) {
      if (normalizedDescription.includes(keyword.toLowerCase())) {
        score += keyword.length
      }
    }
    if (score > 0) {
      categoryScores.set(mapping.category, (categoryScores.get(mapping.category) || 0) + score)
    }
  }

  const sortedCategories = Array.from(categoryScores.entries())
    .sort((a, b) => b[1] - a[1]).map(([category]) => category).slice(0, 11)

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
