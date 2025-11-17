const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export const API_ENDPOINTS = {
  AUTH: {
    ME: `${API_BASE_URL}/v1/auth/me`,
    LOGIN: `${API_BASE_URL}/v1/auth/login`,
    REGISTER: `${API_BASE_URL}/v1/auth/register`,
  },
} as const

export { API_BASE_URL }