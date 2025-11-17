const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/v1/auth/login`,
    register: `${API_BASE_URL}/v1/auth/register`,
    logout: `${API_BASE_URL}/v1/auth/logout`,
    me: `${API_BASE_URL}/v1/auth/me`,
  },
} as const

export { API_BASE_URL }