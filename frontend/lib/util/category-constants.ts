import { MovementCategory } from '@/lib/api/bank/movements-api'

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
