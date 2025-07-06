import { http, mockApi } from './http'
import type { TimeBasedStatistics } from '@/types'

export const statisticsApi = {
  getTimeBasedStatistics: async (): Promise<TimeBasedStatistics> => {
    // Use mock API for development
    return mockApi.getTimeBasedStatistics()
    
    // Uncomment below for real API
    // return await http.get('/v1/statistics/time-based')
  },

  getProjectCompletionTrends: async (period: 'daily' | 'weekly' | 'monthly' = 'daily') => {
    // Mock implementation
    const stats = await mockApi.getTimeBasedStatistics()
    return stats.trends[period]
    
    // Uncomment below for real API
    // return await http.get(`/v1/statistics/trends?period=${period}`)
  }
}