import { apiService } from './api-service'
import { API_ENDPOINTS } from '../api-config'

export interface UserProfile {
  id?: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
}


export const userProfileApi = {
  getAll: () => 
    apiService.get<UserProfile[]>(API_ENDPOINTS.user.users),

  getById: (id: number) => 
    apiService.get<UserProfile>(API_ENDPOINTS.user.userById(id)),
}
