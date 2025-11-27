import { MovementType, MovementStatus, MovementCategory, MovementRecurrence } from '../api/bank-api'
  
export interface SelectOption<T = string> {
  value: T
  label: string
  description?: string
}

export const MOVEMENT_TYPES: SelectOption<MovementType>[] = [
  { value: 'EXPENSE', label: 'Expense' },
  { value: 'INCOME', label: 'Income' }
]

export const MOVEMENT_STATUSES: SelectOption<MovementStatus>[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'FAILED', label: 'Failed' }
]

export const MOVEMENT_CATEGORIES: SelectOption<MovementCategory>[] = [
  { value: 'SHOPPING', label: 'Shopping' },
  { value: 'NET', label: 'Internet' },
  { value: 'TECH', label: 'Tech' },
  { value: 'FOOD_DRINKS', label: 'Food & Drinks' },
  { value: 'TRANSPORT', label: 'Transport' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'HEALTH', label: 'Health' },
  { value: 'UTILITIES', label: 'Utilities' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'STREAMING_SERVICES', label: 'Streaming' },
  { value: 'OTHER', label: 'Other' }
]

export const MOVEMENT_RECURRENCES: SelectOption<MovementRecurrence>[] = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'CUSTOM', label: 'Custom' }
]

export const getMovementTypeLabel = (type: MovementType): string => {
  return MOVEMENT_TYPES.find(t => t.value === type)?.label || type
}

export const getMovementStatusLabel = (status: MovementStatus): string => {
  return MOVEMENT_STATUSES.find(s => s.value === status)?.label || status
}

export const getMovementCategoryLabel = (category: MovementCategory): string => {
  return MOVEMENT_CATEGORIES.find(c => c.value === category)?.label || category
}

export const getMovementRecurrenceLabel = (recurrence: MovementRecurrence): string => {
  return MOVEMENT_RECURRENCES.find(r => r.value === recurrence)?.label || recurrence
}