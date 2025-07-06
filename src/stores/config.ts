import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ApiConfig } from '@/types'

export const useConfigStore = defineStore('config', () => {
  const apiConfig = ref<ApiConfig>({
    baseUrl: localStorage.getItem('apiBaseUrl') || 'https://api.moeflow.com',
    apiKey: localStorage.getItem('apiKey') || undefined
  })

  const setApiConfig = (config: ApiConfig) => {
    apiConfig.value = config
    localStorage.setItem('apiBaseUrl', config.baseUrl)
    if (config.apiKey) {
      localStorage.setItem('apiKey', config.apiKey)
    }
  }

  const getApiUrl = (endpoint: string) => {
    return `${apiConfig.value.baseUrl}${endpoint}`
  }

  return {
    apiConfig: computed(() => apiConfig.value),
    setApiConfig,
    getApiUrl
  }
})