import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest, LoginResponse, Team } from '@/types'
import { authApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const userTeams = ref<Team[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.isAdmin || false)

  const login = async (credentials: LoginRequest) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authApi.login(credentials)
      
      if (response.token && response.user) {
        token.value = response.token
        user.value = response.user
        userTeams.value = response.teams || []
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        localStorage.setItem('userTeams', JSON.stringify(response.teams || []))
        return true
      }
      return false
    } catch (err: any) {
      error.value = err.message || '登录失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    userTeams.value = []
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userTeams')
  }

  const initAuth = () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    const savedTeams = localStorage.getItem('userTeams')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
      userTeams.value = savedTeams ? JSON.parse(savedTeams) : []
    }
  }

  const updateUser = (updatedUser: User) => {
    user.value = updatedUser
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    userTeams: computed(() => userTeams.value),
    isAuthenticated,
    isAdmin,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    login,
    logout,
    initAuth,
    updateUser
  }
})