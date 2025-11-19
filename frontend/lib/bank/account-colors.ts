import { AccountType } from "../api/bank-api"

export const getAccountTypeColor = (type: AccountType) => {
  switch (type) {
    case 'CURRENT':
      return 'bg-[var(--label-current-bg)] text-[var(--label-current-text)]'
    case 'SAVINGS':
      return 'bg-[var(--label-savings-bg)] text-[var(--label-savings-text)]'
    case 'INVESTMENTS':
      return 'bg-[var(--label-invest-bg)] text-[var(--label-invest-text)]'
    case 'CLOSED':
      return 'bg-[var(--label-closed-bg)] text-[var(--label-closed-text)]'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

