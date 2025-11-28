import { API_ENDPOINTS } from "@/lib/api-config"
import { apiService } from "@/lib/v2/api/api-service"

export type AccountType = 'CURRENT' | 'SAVINGS' | 'INVESTMENTS' | 'CLOSED'

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