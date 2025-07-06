<template>
  <div id="app">
    <router-view v-if="!isAuthRoute" />
    <AppLayout v-else>
      <router-view />
    </AppLayout>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/Layout/AppLayout.vue'
import 'element-plus/dist/index.css'

const route = useRoute()
const authStore = useAuthStore()

const isAuthRoute = computed(() => {
  return route.path !== '/login'
})

onMounted(() => {
  authStore.initAuth()
})
</script>

<style>
#app {
  font-family: 'Inter', system-ui, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.el-loading-parent--relative {
  position: relative !important;
}
</style>