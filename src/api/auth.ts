import { http, mockApi } from './http'
import type { LoginRequest, LoginResponse } from '@/types'

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // Use mock API for development
    return mockApi.login(credentials)
    
    // Uncomment below for real API
    // try {
    //   return await http.post('/v1/user/token', credentials)
    // } catch (error) {
    //   // If user doesn't exist on our platform, try to register with same credentials
    //   try {
    //     await http.post('/v1/users', credentials)
    //     return await http.post('/v1/user/token', credentials)
    //   } catch (registerError) {
    //     throw error
    //   }
    // }
  },

  register: async (userData: any) => {
    return http.post('/v1/users', userData)
  },

  getUserInfo: async () => {
    return http.get('/v1/user/info')
  },

  updateProfile: async (userData: any) => {
    return http.put('/v1/user/info', userData)
  }
}