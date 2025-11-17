import { API_ENDPOINTS } from '../api-config'

interface User {
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export const authApi = {
  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(API_ENDPOINTS.AUTH.ME, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Token invalid')
    }

    const data = await response.json()
    return {
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
    }
  },
}