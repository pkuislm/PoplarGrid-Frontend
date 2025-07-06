<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">统计分析</h1>

    <!-- 时间维度统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 昨日完成 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">昨日完成项目</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
              {{ timeStats?.yesterday.completed || 0 }}
            </p>
          </div>
          <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center" v-if="timeStats?.yesterday">
          <div :class="['px-2 py-1 rounded-full text-xs font-medium', yesterdayGrowth.bgColor, yesterdayGrowth.color]">
            <span class="mr-1">{{ yesterdayGrowth.icon }}</span>
            {{ yesterdayGrowth.text }}
          </div>
          <span class="ml-2 text-xs text-gray-500">较前天</span>
        </div>
      </div>

      <!-- 上周完成 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">上周完成项目</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
              {{ timeStats?.lastWeek.completed || 0 }}
            </p>
          </div>
          <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center" v-if="timeStats?.lastWeek">
          <div :class="['px-2 py-1 rounded-full text-xs font-medium', lastWeekGrowth.bgColor, lastWeekGrowth.color]">
            <span class="mr-1">{{ lastWeekGrowth.icon }}</span>
            {{ lastWeekGrowth.text }}
          </div>
          <span class="ml-2 text-xs text-gray-500">较上上周</span>
        </div>
      </div>

      <!-- 上月完成 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">上月完成项目</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
              {{ timeStats?.lastMonth.completed || 0 }}
            </p>
          </div>
          <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center" v-if="timeStats?.lastMonth">
          <div :class="['px-2 py-1 rounded-full text-xs font-medium', lastMonthGrowth.bgColor, lastMonthGrowth.color]">
            <span class="mr-1">{{ lastMonthGrowth.icon }}</span>
            {{ lastMonthGrowth.text }}
          </div>
          <span class="ml-2 text-xs text-gray-500">较上上月</span>
        </div>
      </div>
    </div>

    <!-- 基础统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">总项目数</p>
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
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">已完成项目</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ projectsStore.completedProjects.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
            <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">进行中项目</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ projectsStore.activeProjects.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">平均完成率</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ averageProgress }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 趋势图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 项目完成趋势 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">项目完成趋势</h2>
          <el-select v-model="trendPeriod" size="small" @change="updateTrendChart">
            <el-option label="每日" value="daily" />
            <el-option label="每周" value="weekly" />
            <el-option label="每月" value="monthly" />
          </el-select>
        </div>
        <div class="h-64">
          <v-chart :option="trendChartOption" class="w-full h-full" />
        </div>
      </div>

      <!-- 项目状态分布 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">项目状态分布</h2>
        <div class="h-64">
          <v-chart :option="pieChartOption" class="w-full h-full" />
        </div>
      </div>
    </div>

    <!-- 项目详细列表 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">项目详细统计</h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                项目名称
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                翻译进度
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                校对进度
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                嵌字状态
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                审核状态
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                状态
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                完成时间
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="project in projectsStore.projects" :key="project.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ project.name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="w-20">
                  <el-progress :percentage="project.progress.translation" :stroke-width="6" :show-text="false" />
                </div>
                <div class="text-xs text-gray-500 mt-1">{{ project.progress.translation }}%</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="w-20">
                  <el-progress :percentage="project.progress.proofreading" :stroke-width="6" :show-text="false" color="#10b981" />
                </div>
                <div class="text-xs text-gray-500 mt-1">{{ project.progress.proofreading }}%</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <el-tag :type="getTypesettingTagType(project.progress.typesetting)" size="small">
                  {{ getTypesettingText(project.progress.typesetting) }}
                </el-tag>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <el-tag :type="getReviewTagType(project.progress.review)" size="small">
                  {{ getReviewText(project.progress.review) }}
                </el-tag>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <el-tag :type="getStatusTagType(project.status)" size="small">
                  {{ getStatusText(project.status) }}
                </el-tag>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ project.completedAt ? formatDate(project.completedAt) : '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { useProjectsStore } from '@/stores/projects'
import { useStatisticsStore } from '@/stores/statistics'

use([
  CanvasRenderer,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const projectsStore = useProjectsStore()
const statisticsStore = useStatisticsStore()

const trendPeriod = ref<'daily' | 'weekly' | 'monthly'>('daily')
const trendData = ref<any[]>([])

const timeStats = computed(() => statisticsStore.timeBasedStats)

const yesterdayGrowth = computed(() => {
  if (!timeStats.value?.yesterday) return { color: '', bgColor: '', icon: '', text: '' }
  return statisticsStore.getGrowthIndicator(timeStats.value.yesterday.comparison)
})

const lastWeekGrowth = computed(() => {
  if (!timeStats.value?.lastWeek) return { color: '', bgColor: '', icon: '', text: '' }
  return statisticsStore.getGrowthIndicator(timeStats.value.lastWeek.comparison)
})

const lastMonthGrowth = computed(() => {
  if (!timeStats.value?.lastMonth) return { color: '', bgColor: '', icon: '', text: '' }
  return statisticsStore.getGrowthIndicator(timeStats.value.lastMonth.comparison)
})

const averageProgress = computed(() => {
  if (projectsStore.projects.length === 0) return 0
  
  const totalProgress = projectsStore.projects.reduce((sum, project) => {
    return sum + (project.progress.translation + project.progress.proofreading) / 2
  }, 0)
  
  return Math.round(totalProgress / projectsStore.projects.length)
})

const trendChartOption = computed(() => {
  const data = trendData.value
  if (!data.length) return {}

  const xAxisData = data.map(item => {
    if (trendPeriod.value === 'daily') return item.date.split('-').slice(1).join('/')
    return item.week || item.month
  })
  
  const seriesData = data.map(item => item.completed)

  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const point = params[0]
        return `${point.name}<br/>完成项目: ${point.value}`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisLabel: {
        color: '#6b7280'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisLabel: {
        color: '#6b7280'
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6'
        }
      }
    },
    series: [
      {
        name: '完成项目',
        type: 'line',
        data: seriesData,
        smooth: true,
        lineStyle: {
          color: '#3b82f6',
          width: 3
        },
        itemStyle: {
          color: '#3b82f6'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
            ]
          }
        }
      }
    ]
  }
})

const pieChartOption = computed(() => ({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    textStyle: {
      color: '#6b7280'
    }
  },
  series: [
    {
      name: '项目状态',
      type: 'pie',
      radius: '50%',
      data: [
        { value: projectsStore.activeProjects.length, name: '进行中' },
        { value: projectsStore.completedProjects.length, name: '已完成' },
        { 
          value: projectsStore.projects.length - projectsStore.activeProjects.length - projectsStore.completedProjects.length, 
          name: '暂停' 
        }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}))

const updateTrendChart = async () => {
  try {
    const data = await statisticsStore.getCompletionTrends(trendPeriod.value)
    trendData.value = data
  } catch (error) {
    console.error('Failed to update trend chart:', error)
  }
}

const getStatusTagType = (status: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'completed': return 'info'
    case 'paused': return 'warning'
    default: return 'info'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return '进行中'
    case 'completed': return '已完成'
    case 'paused': return '已暂停'
    default: return '未知'
  }
}

const getTypesettingTagType = (status: string) => {
  switch (status) {
    case 'not_started': return 'info'
    case 'in_progress': return 'warning'
    case 'completed': return 'success'
    default: return 'info'
  }
}

const getTypesettingText = (status: string) => {
  switch (status) {
    case 'not_started': return '未嵌字'
    case 'in_progress': return '嵌字中'
    case 'completed': return '已完成嵌字'
    default: return '未知'
  }
}

const getReviewTagType = (status: string) => {
  switch (status) {
    case 'not_reviewed': return 'info'
    case 'reviewing': return 'warning'
    case 'reviewed': return 'success'
    default: return 'info'
  }
}

const getReviewText = (status: string) => {
  switch (status) {
    case 'not_reviewed': return '未审核'
    case 'reviewing': return '审核中'
    case 'reviewed': return '已审核'
    default: return '未知'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

onMounted(async () => {
  await Promise.all([
    projectsStore.fetchProjects(),
    statisticsStore.fetchTimeBasedStatistics()
  ])
  await updateTrendChart()
})
</script>