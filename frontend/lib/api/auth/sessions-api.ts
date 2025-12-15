import { API_ENDPOINTS } from "../../api-config"
import { apiService } from "../api-service"

export interface UserSession {
  id: number
  sessionToken: string
  deviceType: string
  browser: string
  os: string
  ipAddress: string
  createdAt: string
  lastActiveAt: string
  current: boolean
}

export const sessionsApi = {
  /**
   * Get all active sessions for the current user.
   */
  getMySessions: () => 
    apiService.get<UserSession[]>(API_ENDPOINTS.sessions.me),

  /**
   * Revoke a specific session by ID.
   */
  revokeSession: (sessionId: number) => 
    apiService.delete(API_ENDPOINTS.sessions.revoke(sessionId)),

  /**
   * Revoke all sessions except the current one.
   */
  revokeAllOtherSessions: () => 
    apiService.delete(API_ENDPOINTS.sessions.revokeOthers),

  /**
   * Revoke all sessions (logout from all devices).
   */
  revokeAllSessions: () => 
    apiService.delete(API_ENDPOINTS.sessions.revokeAll),
}
