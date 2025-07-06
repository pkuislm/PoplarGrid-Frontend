import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  const theme = computed(() => isDark.value ? 'dark' : 'light')

  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      isDark.value = prefersDark
    }
    
    updateDocumentTheme()
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', theme.value)
    updateDocumentTheme()
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    isDark.value = newTheme === 'dark'
    localStorage.setItem('theme', newTheme)
    updateDocumentTheme()
  }

  const updateDocumentTheme = () => {
    const html = document.documentElement
    if (isDark.value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  return {
    isDark: computed(() => isDark.value),
    theme,
    toggleTheme,
    setTheme,
    initializeTheme
  }
})