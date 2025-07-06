import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TimeBasedStatistics } from '@/types'
import { statisticsApi } from '@/api/statistics'

export const useStatisticsStore = defineStore('statistics', () => {
  const timeBasedStats = ref<TimeBasedStatistics | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchTimeBasedStatistics = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await statisticsApi.getTimeBasedStatistics()
      timeBasedStats.value = response
    } catch (err: any) {
      error.value = err.message || '获取统计数据失败'
    } finally {
      isLoading.value = false
    }
  }

  const getCompletionTrends = async (period: 'daily' | 'weekly' | 'monthly' = 'daily') => {
    try {
      return await statisticsApi.getProjectCompletionTrends(period)
    } catch (err: any) {
      error.value = err.message || '获取趋势数据失败'
      return []
    }
  }

  // 计算对比增长的颜色和图标
  const getGrowthIndicator = (growth: number) => {
    if (growth > 0) {
      return {
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        icon: '↗',
        text: `+${growth.toFixed(1)}%`
      }
    } else if (growth < 0) {
      return {
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        icon: '↘',
        text: `${growth.toFixed(1)}%`
      }
    } else {
      return {
        color: 'text-gray-600 dark:text-gray-400',
        bgColor: 'bg-gray-50 dark:bg-gray-900/20',
        icon: '→',
        text: '0%'
      }
    }
  }

  return {
    timeBasedStats: computed(() => timeBasedStats.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    fetchTimeBasedStatistics,
    getCompletionTrends,
    getGrowthIndicator
  }
})