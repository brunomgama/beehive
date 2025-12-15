const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/v1/auth/login`,
    register: `${API_BASE_URL}/v1/auth/register`,
    logout: `${API_BASE_URL}/v1/auth/logout`,
    me: `${API_BASE_URL}/v1/auth/me`,
  },
  sessions: {
    me: `${API_BASE_URL}/v1/sessions/me`,
    revoke: (sessionId: number) => `${API_BASE_URL}/v1/sessions/${sessionId}`,
    revokeOthers: `${API_BASE_URL}/v1/sessions/others`,
    revokeAll: `${API_BASE_URL}/v1/sessions/all`,
  },
  user: {
    users: `${API_BASE_URL}/v1/users`,
    userById: (id: number) => `${API_BASE_URL}/v1/users/${id}`,
  },
  bank: {
    accounts: `${API_BASE_URL}/v1/bank/accounts`,
    accountById: (id: number) => `${API_BASE_URL}/v1/bank/accounts/${id}`,
    accountsByUser: (userId: number) => `${API_BASE_URL}/v1/bank/accounts/user/${userId}`,
    accountsCount: `${API_BASE_URL}/v1/bank/accounts/count`,
    
    movements: `${API_BASE_URL}/v1/bank/movements`,
    movementById: (id: number) => `${API_BASE_URL}/v1/bank/movements/${id}`,
    movementsByAccount: (accountId: number) => `${API_BASE_URL}/v1/bank/movements/account/${accountId}`,
    movementsCount: `${API_BASE_URL}/v1/bank/movements/count`,
    movementsByAccountAndType: (accountId: number, type: string) => `${API_BASE_URL}/v1/bank/movements/account/${accountId}/type/${type}`,
    movementsByAccountAndStatus: (accountId: number, status: string) => `${API_BASE_URL}/v1/bank/movements/account/${accountId}/status/${status}`,
    movementsByAccountDateRange: (accountId: number, startDate: string, endDate: string) => `${API_BASE_URL}/v1/bank/movements/account/${accountId}/date-range?startDate=${startDate}&endDate=${endDate}`,
    movementsCountByAccount: (accountId: number) => `${API_BASE_URL}/v1/bank/movements/account/${accountId}/count`,

    plannedMovements: `${API_BASE_URL}/v1/bank/planned`,
    plannedMovementById: (id: number) => `${API_BASE_URL}/v1/bank/planned/${id}`,
    plannedMovementsByAccount: (accountId: number) => `${API_BASE_URL}/v1/bank/planned/account/${accountId}`,
    plannedMovementsCount: `${API_BASE_URL}/v1/bank/planned/count`,
    plannedMovementsByAccountAndType: (accountId: number, type: string) => `${API_BASE_URL}/v1/bank/planned/account/${accountId}/type/${type}`,
    plannedMovementsByAccountAndStatus: (accountId: number, status: string) => `${API_BASE_URL}/v1/bank/planned/account/${accountId}/status/${status}`,
    plannedMovementsByAccountDateRange: (accountId: number, startDate: string, endDate: string) => `${API_BASE_URL}/v1/bank/planned/account/${accountId}/date-range?startDate=${startDate}&endDate=${endDate}`,
    plannedMovementsCountByAccount: (accountId: number) => `${API_BASE_URL}/v1/bank/planned/account/${accountId}/count`,
  },
} as const

export { API_BASE_URL }