import { API_ENDPOINTS } from "../../api-config"
import { apiService } from "../api-service"
import { BankAccount } from "./accounts-api"

export type MovementType = 'EXPENSE' | 'INCOME'
export type MovementStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FAILED'
export type MovementRecurrence = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'CUSTOM'
export type MovementCategory = 
  // Transfers
  | 'TRANSFER'
  
  // Housing
  | 'RENT'
  | 'PROPERTY_TAXES'
  | 'HOME_MAINTENANCE_REPAIRS'
  | 'HOME_INSURANCE'
  | 'HOUSEHOLD_SUPPLIES_FURNITURE'
  
  // Transportation
  | 'FUEL'
  | 'PUBLIC_TRANSPORT'
  | 'UBER'
  | 'CAR_MAINTENANCE'
  | 'PARKING'
  | 'VEHICLE_INSURANCE'
  | 'TOLLS'
  
  // Shopping
  | 'SHOPPING'
  | 'CLOTHING'
  | 'ELECTRONICS'
  | 'GIFTS'
  | 'BEAUTY_COSMETICS'
  
  // Food & Dining
  | 'GROCERIES'
  | 'RESTAURANTS'
  | 'FAST_FOOD'
  | 'COFFEE_SHOPS'
  | 'ALCOHOL_BARS'
  | 'FOOD_DRINKS'
  
  // Entertainment
  | 'ENTERTAINMENT'
  | 'MOVIES'
  | 'EVENTS'
  | 'GAMES'
  | 'NIGHTLIFE'
  | 'HOBBIES'
  | 'GYM'
  
  // Technology & Services
  | 'TECH'
  | 'SOFTWARE_SUBSCRIPTIONS'
  | 'INTERNET_SERVICES'
  | 'MOBILE_PHONE_PLANS'
  | 'NET'
  
  // Utilities
  | 'UTILITIES'
  | 'WATER'
  | 'ELECTRICITY'
  | 'GAS'
  
  // Business
  | 'OFFICE_SUPPLIES'
  | 'BUSINESS_TRAVEL'
  | 'PROFESSIONAL_SERVICES'
  
  // Education
  | 'EDUCATION'
  | 'ONLINE_COURSES'
  | 'CLASSES'
  
  // Insurance
  | 'HEALTH_INSURANCE'
  | 'CAR_INSURANCE'
  | 'LIFE_INSURANCE'
  | 'TRAVEL_INSURANCE'
  
  // Health & Medical
  | 'HEALTH'
  | 'PHARMACY'
  | 'MEDICAL'
  | 'THERAPY'
  
  // Pets
  | 'PET_FOOD'
  | 'VET_VISITS'
  | 'PET_ACCESSORIES'
  | 'PET_GROOMING'
  
  // Banking & Investments
  | 'BANK_FEES'
  | 'INVESTMENTS'
  
  // Streaming & Subscriptions
  | 'STREAMING_SERVICES'
  | 'VIDEO_STREAMING'
  | 'MUSIC_STREAMING'
  | 'CLOUD_STORAGE'
  | 'DIGITAL_MAGAZINES'
  | 'NEWS_SUBSCRIPTIONS'
  
  // Travel
  | 'HOTELS'
  | 'FLIGHTS'
  | 'CAR_RENTAL'
  | 'TOURS'
  
  // Income
  | 'SALARY'
  | 'FREELANCING'
  | 'INVESTMENT_INCOME'
  | 'REFUNDS'
  | 'RENTAL_INCOME'
  
  // General
  | 'OTHER'

export interface PlannedMovement {
  id?: number
  accountId: number
  category: MovementCategory
  type: MovementType
  amount: number
  description: string
  recurrence: MovementRecurrence
  cron: string
  nextExecution: string
  endDate: string
  status: MovementStatus
  account?: BankAccount
}

export interface CreatePlannedMovementData {
  accountId: number
  category: MovementCategory
  type: MovementType
  amount: number
  description: string
  recurrence: MovementRecurrence
  cron: string
  nextExecution: string
  endDate: string
  status: MovementStatus
}

export interface UpdatePlannedMovementData {
  accountId: number
  category: MovementCategory
  type: MovementType
  amount: number
  description: string
  recurrence: MovementRecurrence
  cron: string
  nextExecution: string
  endDate: string
  status: MovementStatus
}

export const plannedMovementApi = {
  getAll: () => 
    apiService.get<PlannedMovement[]>(API_ENDPOINTS.bank.plannedMovements),
    
  getById: (id: number) => 
    apiService.get<PlannedMovement>(API_ENDPOINTS.bank.plannedMovementById(id)),
    
  getByAccountId: (accountId: number) => 
    apiService.get<PlannedMovement[]>(API_ENDPOINTS.bank.plannedMovementsByAccount(accountId)),
    
  create: (data: CreatePlannedMovementData) => 
    apiService.post<PlannedMovement>(API_ENDPOINTS.bank.plannedMovements, data),
    
  update: (id: number, data: UpdatePlannedMovementData) => 
    apiService.put<PlannedMovement>(API_ENDPOINTS.bank.plannedMovementById(id), data),
    
  delete: (id: number) => 
    apiService.delete(API_ENDPOINTS.bank.plannedMovementById(id)),
    
  getCount: () => 
    apiService.get<{ count: number }>(API_ENDPOINTS.bank.plannedMovementsCount),
    
  getByAccountIdAndType: (accountId: number, type: MovementType) => 
    apiService.get<PlannedMovement[]>(API_ENDPOINTS.bank.plannedMovementsByAccountAndType(accountId, type)),
    
  getByAccountIdAndStatus: (accountId: number, status: MovementStatus) => 
    apiService.get<PlannedMovement[]>(API_ENDPOINTS.bank.plannedMovementsByAccountAndStatus(accountId, status)),
    
  getByAccountIdAndDateRange: (accountId: number, startDate: string, endDate: string) => 
    apiService.get<PlannedMovement[]>(API_ENDPOINTS.bank.plannedMovementsByAccountDateRange(accountId, startDate, endDate)),
    
  countByAccountId: (accountId: number) => 
    apiService.get<{ count: number }>(API_ENDPOINTS.bank.plannedMovementsCountByAccount(accountId)),
}