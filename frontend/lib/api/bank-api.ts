import { apiService } from './api-service'
import { API_ENDPOINTS } from '../api-config'

export type AccountType = 'CURRENT' | 'SAVINGS' | 'INVESTMENTS' | 'CLOSED'
export type MovementType = 'EXPENSE' | 'INCOME'
export type MovementStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FAILED'
export type MovementCategory = 'SHOPPING' | 'NET' | 'TECH' | 'FOOD_DRINKS' | 'TRANSPORT' | 'ENTERTAINMENT' | 'HEALTH' | 'UTILITIES' | 'EDUCATION' | 'STREAMING_SERVICES' | 'OTHER'
export type MovementRecurrence = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM'

export interface BankAccount {
  id?: number
  userId: number
  accountName: string
  iban: string
  balance: number
  type: AccountType
  priority: number
}

export interface CreateAccountData {
  userId: number
  accountName: string
  iban: string
  balance: number
  type: AccountType
  priority: number
}

export interface UpdateAccountData {
  accountName: string
  iban: string
  balance: number
  type: AccountType
  userId: number
  priority: number
}

export interface Movement {
  id?: number
  accountId: number
  category: MovementCategory
  type: MovementType
  amount: number
  description: string
  date: string
  status: MovementStatus
  account?: BankAccount
}

export interface CreateMovementData {
  accountId: number
  category: MovementCategory
  type: MovementType
  amount: number
  description: string
  date: string
  status: MovementStatus
}

export interface UpdateMovementData {
  accountId: number
  category: MovementCategory
  type: MovementType
  amount: number
  description: string
  date: string
  status: MovementStatus
}


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


export const bankAccountApi = {
  getAll: () => 
    apiService.get<BankAccount[]>(API_ENDPOINTS.bank.accounts),
    
  getById: (id: number) => 
    apiService.get<BankAccount>(API_ENDPOINTS.bank.accountById(id)),
    
  getByUserId: (userId: number) => 
    apiService.get<BankAccount[]>(API_ENDPOINTS.bank.accountsByUser(userId)),
    
  create: (data: CreateAccountData) => 
    apiService.post<BankAccount>(API_ENDPOINTS.bank.accounts, data),
    
  update: (id: number, data: UpdateAccountData) => 
    apiService.put<BankAccount>(API_ENDPOINTS.bank.accountById(id), data),
    
  delete: (id: number) => 
    apiService.delete(API_ENDPOINTS.bank.accountById(id)),
    
  getCount: () => 
    apiService.get<{ count: number }>(API_ENDPOINTS.bank.accountsCount),
}

export const movementApi = {
  getAll: () => 
    apiService.get<Movement[]>(API_ENDPOINTS.bank.movements),
    
  getById: (id: number) => 
    apiService.get<Movement>(API_ENDPOINTS.bank.movementById(id)),
    
  getByAccountId: (accountId: number) => 
    apiService.get<Movement[]>(API_ENDPOINTS.bank.movementsByAccount(accountId)),
    
  create: (data: CreateMovementData) => 
    apiService.post<Movement>(API_ENDPOINTS.bank.movements, data),
    
  update: (id: number, data: UpdateMovementData) => 
    apiService.put<Movement>(API_ENDPOINTS.bank.movementById(id), data),
    
  delete: (id: number) => 
    apiService.delete(API_ENDPOINTS.bank.movementById(id)),
    
  getCount: () => 
    apiService.get<{ count: number }>(API_ENDPOINTS.bank.movementsCount),
    
  getByAccountIdAndType: (accountId: number, type: MovementType) => 
    apiService.get<Movement[]>(API_ENDPOINTS.bank.movementsByAccountAndType(accountId, type)),
    
  getByAccountIdAndStatus: (accountId: number, status: MovementStatus) => 
    apiService.get<Movement[]>(API_ENDPOINTS.bank.movementsByAccountAndStatus(accountId, status)),
    
  getByAccountIdAndDateRange: (accountId: number, startDate: string, endDate: string) => 
    apiService.get<Movement[]>(API_ENDPOINTS.bank.movementsByAccountDateRange(accountId, startDate, endDate)),
    
  countByAccountId: (accountId: number) => 
    apiService.get<{ count: number }>(API_ENDPOINTS.bank.movementsCountByAccount(accountId)),
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