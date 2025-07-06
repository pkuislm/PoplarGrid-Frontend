<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        欢迎回来，{{ authStore.user?.name }}！
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        这里是您的项目概览和最新动态
      </p>
    </div>

    <!-- 用户邀请通知 -->
    <UserInvitations />

    <!-- 时间维度统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 昨日完成 -->
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm font-medium">昨日完成项目</p>
            <p class="text-3xl font-bold mt-1">
              {{ timeStats?.yesterday.completed || 0 }}
            </p>
          </div>
          <div class="p-3 rounded-full bg-white bg-opacity-20">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center" v-if="timeStats?.yesterday">
          <div class="px-2 py-1 rounded-full bg-white bg-opacity-20 text-xs font-medium">
            <span class="mr-1">{{ yesterdayGrowth.icon }}</span>
            {{ yesterdayGrowth.text }}
          </div>
          <span class="ml-2 text-xs text-blue-100">较前天</span>
        </div>
      </div>

      <!-- 上周完成 -->
      <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm font-medium">上周完成项目</p>
            <p class="text-3xl font-bold mt-1">
              {{ timeStats?.lastWeek.completed || 0 }}
            </p>
          </div>
          <div class="p-3 rounded-full bg-white bg-opacity-20">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center" v-if="timeStats?.lastWeek">
          <div class="px-2 py-1 rounded-full bg-white bg-opacity-20 text-xs font-medium">
            <span class="mr-1">{{ lastWeekGrowth.icon }}</span>
            {{ lastWeekGrowth.text }}
          </div>
          <span class="ml-2 text-xs text-green-100">较上上周</span>
        </div>
      </div>

      <!-- 上月完成 -->
      <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm font-medium">上月完成项目</p>
            <p class="text-3xl font-bold mt-1">
              {{ timeStats?.lastMonth.completed || 0 }}
            </p>
          </div>
          <div class="p-3 rounded-full bg-white bg-opacity-20">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center" v-if="timeStats?.lastMonth">
          <div class="px-2 py-1 rounded-full bg-white bg-opacity-20 text-xs font-medium">
            <span class="mr-1">{{ lastMonthGrowth.icon }}</span>
            {{ lastMonthGrowth.text }}
          </div>
          <span class="ml-2 text-xs text-purple-100">较上上月</span>
        </div>
      </div>
    </div>

    <!-- 基础统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
            <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">项目总数</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ projectsStore.projects.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">进行中</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ projectsStore.activeProjects.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">已完成</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ projectsStore.completedProjects.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
            <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">平均进度</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ averageProgress }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近项目 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">最近项目</h2>
          <router-link
            to="/projects"
            class="text-primary-600 dark:text-primary-400 hover:text-primary-500 text-sm font-medium"
          >
            查看全部
          </router-link>
        </div>
      </div>
      
      <div class="p-6" v-if="projectsStore.isLoading">
        <div class="flex justify-center">
          <div class="flex items-center space-x-2">
            <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-600 dark:text-gray-400">加载中...</span>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6" v-else>
        <ProjectCard
          v-for="project in recentProjects"
          :key="project.id"
          :project="project"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import { useStatisticsStore } from '@/stores/statistics'
import ProjectCard from '@/components/ProjectCard.vue'
import UserInvitations from '@/components/UserInvitations.vue'

const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const statisticsStore = useStatisticsStore()

const timeStats = computed(() => statisticsStore.timeBasedStats)

const yesterdayGrowth = computed(() => {
  if (!timeStats.value?.yesterday) return { icon: '', text: '' }
  return statisticsStore.getGrowthIndicator(timeStats.value.yesterday.comparison)
})

const lastWeekGrowth = computed(() => {
  if (!timeStats.value?.lastWeek) return { icon: '', text: '' }
  return statisticsStore.getGrowthIndicator(timeStats.value.lastWeek.comparison)
})

const lastMonthGrowth = computed(() => {
  if (!timeStats.value?.lastMonth) return { icon: '', text: '' }
  return statisticsStore.getGrowthIndicator(timeStats.value.lastMonth.comparison)
})

const recentProjects = computed(() => 
  projectsStore.projects.slice(0, 4)
)

const averageProgress = computed(() => {
  if (projectsStore.projects.length === 0) return 0
  
  const totalProgress = projectsStore.projects.reduce((sum, project) => {
    return sum + (project.progress.translation + project.progress.proofreading) / 2
  }, 0)
  
  return Math.round(totalProgress / projectsStore.projects.length)
})

onMounted(async () => {
  await Promise.all([
    projectsStore.fetchProjects(),
    statisticsStore.fetchTimeBasedStatistics()
  ])
})
</script>