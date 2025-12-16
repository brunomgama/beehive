import { API_ENDPOINTS } from "../api-config"
import { apiService } from "../api-service"
import { BankAccount } from "./accounts-api"
import { MovementCategory, MovementRecurrence, MovementStatus, MovementType } from "../types"

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