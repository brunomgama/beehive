interface ApiResponse<T = any> {
  data?: T
  error?: string
  status: number
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token')
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        ...options,
      })
      const contentType = response.headers.get('content-type')
      const hasJsonContent = contentType?.includes('application/json')
      
      let data = null
      if (hasJsonContent && response.status !== 204) {
        try {
          data = await response.json()
        } catch (jsonError) {
          if (response.ok) {
            data = null
          } else {
            throw jsonError
          }
        }
      }

      return {
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data?.message || 'Request failed',
        status: response.status,
      }
    } catch (error) {
      return {
        error: 'Network error. Please try again.',
        status: 0,
      }
    }
  }

  async post<T>(url: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'GET',
    })
  }

  async put<T>(url: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'DELETE',
    })
  }
}

export const apiService = new ApiService()