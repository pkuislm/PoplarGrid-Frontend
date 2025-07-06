<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <el-button @click="goBack" :icon="ArrowLeft" size="small">
              返回项目
            </el-button>
            <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
              翻译器模式
            </h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              项目: {{ projectId }} | 文件: {{ fileId }} | 页面: {{ currentPage }}
            </span>
            <el-button type="primary" size="small">
              保存翻译
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="text-center py-12">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            翻译器界面
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            这里将显示翻译器的具体内容，包括图片显示、文本识别、翻译编辑等功能
          </p>
          
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-w-md mx-auto">
            <h3 class="font-medium text-gray-900 dark:text-white mb-2">当前参数</h3>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div>项目ID: {{ projectId }}</div>
              <div>文件ID: {{ fileId }}</div>
              <div>页面索引: {{ currentPage }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const projectId = computed(() => route.params.projectId as string)
const fileId = computed(() => route.params.fileId as string)
const currentPage = computed(() => route.query.page || '0')

const goBack = () => {
  router.push(`/projects/${projectId.value}`)
}
</script>