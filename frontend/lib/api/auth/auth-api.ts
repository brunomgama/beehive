import { API_ENDPOINTS } from "../api-config"
import { apiService } from "../api-service"

export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  id: number
  token: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export const authApi = {
  login: (data: LoginData) => 
    apiService.post<AuthResponse>(API_ENDPOINTS.auth.login, data),
    
  register: (data: RegisterData) => 
    apiService.post<AuthResponse>(API_ENDPOINTS.auth.register, data),
    
  logout: () => 
    apiService.post(API_ENDPOINTS.auth.logout, {}),

  getCurrentUser: async (token: string): Promise<User> => {
    const response = await fetch(API_ENDPOINTS.auth.me, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Token invalid')
    }

    const data = await response.json()
    console.log('Raw API response:', data)
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
    }
  },
}