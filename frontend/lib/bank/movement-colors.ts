import { MovementType, MovementStatus, MovementCategory, MovementRecurrence } from "../api/bank-api"

export const getMovementTypeColor = (type: MovementType) => {
  switch (type) {
    case 'INCOME':
      return 'bg-[var(--movement-income-bg)] text-[var(--movement-income-text)]'
    case 'EXPENSE':
      return 'bg-[var(--movement-expense-bg)] text-[var(--movement-expense-text)]'
    default:
      return 'bg-muted/50 text-muted-foreground'
  }
}

export const getMovementStatusColor = (status: MovementStatus) => {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-[var(--movement-confirmed-bg)] text-[var(--movement-confirmed-text)]'
    case 'PENDING':
      return 'bg-[var(--movement-pending-bg)] text-[var(--movement-pending-text)]'
    case 'CANCELLED':
      return 'bg-[var(--movement-cancelled-bg)] text-[var(--movement-cancelled-text)]'
    case 'FAILED':
      return 'bg-[var(--movement-failed-bg)] text-[var(--movement-failed-text)]'
    default:
      return 'bg-muted/50 text-muted-foreground'
  }
}

export const getMovementCategoryColor = (category: MovementCategory) => {
  switch (category) {
    case 'SHOPPING':
      return 'bg-[var(--cat-shopping-bg)] text-[var(--cat-shopping-text)]'
    case 'NET':
      return 'bg-[var(--cat-net-bg)] text-[var(--cat-net-text)]'
    case 'TECH':
      return 'bg-[var(--cat-tech-bg)] text-[var(--cat-tech-text)]'
    case 'FOOD_DRINKS':
      return 'bg-[var(--cat-food-bg)] text-[var(--cat-food-text)]'
    case 'TRANSPORT':
      return 'bg-[var(--cat-transport-bg)] text-[var(--cat-transport-text)]'
    case 'ENTERTAINMENT':
      return 'bg-[var(--cat-entertainment-bg)] text-[var(--cat-entertainment-text)]'
    case 'HEALTH':
      return 'bg-[var(--cat-health-bg)] text-[var(--cat-health-text)]'
    case 'UTILITIES':
      return 'bg-[var(--cat-utilities-bg)] text-[var(--cat-utilities-text)]'
    case 'EDUCATION':
      return 'bg-[var(--cat-education-bg)] text-[var(--cat-education-text)]'
    case 'STREAMING_SERVICES':
      return 'bg-[var(--cat-streaming-bg)] text-[var(--cat-streaming-text)]'
    case 'OTHER':
      return 'bg-muted/50 text-muted-foreground'
    default:
      return 'bg-muted/50 text-muted-foreground'
  }
}

export const getMovementRecurrenceColor = (type: MovementRecurrence) => {
  switch (type) {
    case 'DAILY':
      return 'bg-[var(--rec-daily-bg)] text-[var(--rec-daily-text)]'
    case 'WEEKLY':
      return 'bg-[var(--rec-weekly-bg)] text-[var(--rec-weekly-text)]'
    case 'MONTHLY':
      return 'bg-[var(--rec-monthly-bg)] text-[var(--rec-monthly-text)]'
    case 'CUSTOM':
      return 'bg-[var(--rec-custom-bg)] text-[var(--rec-custom-text)]'
    default:
      return 'bg-muted/50 text-muted-foreground'
  }
}
