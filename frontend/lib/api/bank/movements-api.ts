import { API_ENDPOINTS } from "../api-config"
import { apiService } from "../api-service"
import { BankAccount } from "./accounts-api"
import { MovementCategory, MovementStatus, MovementType } from "../types"

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