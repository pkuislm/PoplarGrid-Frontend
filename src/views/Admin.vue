<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">系统管理</h1>

    <!-- API 配置 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">外部平台配置</h2>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
        配置外部翻译平台的API接口地址，用于转发基础功能请求
      </p>

      <el-form
        ref="configFormRef"
        :model="configForm"
        :rules="configRules"
        label-width="120px"
        class="max-w-2xl"
      >
        <el-form-item label="API基础地址" prop="baseUrl">
          <el-input
            v-model="configForm.baseUrl"
            placeholder="https://api.moeflow.com"
          />
          <div class="text-xs text-gray-500 mt-1">
            外部翻译平台的API基础地址
          </div>
        </el-form-item>

        <el-form-item label="API密钥" prop="apiKey">
          <el-input
            v-model="configForm.apiKey"
            type="password"
            placeholder="可选：用于API认证的密钥"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveConfig" :loading="saving">
            保存配置
          </el-button>
          <el-button @click="testConnection" :loading="testing">
            测试连接
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 系统状态 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">系统状态</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div class="p-2 bg-green-100 dark:bg-green-900 rounded-full">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800 dark:text-green-200">平台状态</p>
            <p class="text-xs text-green-600 dark:text-green-400">运行正常</p>
          </div>
        </div>

        <div class="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-blue-800 dark:text-blue-200">API连接</p>
            <p class="text-xs text-blue-600 dark:text-blue-400">{{ connectionStatus }}</p>
          </div>
        </div>

        <div class="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
            <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-purple-800 dark:text-purple-200">活跃用户</p>
            <p class="text-xs text-purple-600 dark:text-purple-400">1 人在线</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 功能说明 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">功能说明</h2>
      
      <div class="space-y-4">
        <div class="border-l-4 border-blue-500 pl-4">
          <h3 class="font-medium text-gray-900 dark:text-white">双平台集成</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            本平台作为外部翻译平台的wrapper，基础功能（项目管理、翻译编辑）转发到外部平台，
            高级功能（进度管理、统计分析）由本平台提供。
          </p>
        </div>

        <div class="border-l-4 border-green-500 pl-4">
          <h3 class="font-medium text-gray-900 dark:text-white">统一登录</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            用户可使用外部平台账号直接登录，系统会自动创建对应账户。
            登录后两个平台共享cookie，实现无缝切换。
          </p>
        </div>

        <div class="border-l-4 border-purple-500 pl-4">
          <h3 class="font-medium text-gray-900 dark:text-white">进度管理</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            翻译和校对进度支持百分比精确跟踪，嵌字和审核提供三阶段状态管理。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useConfigStore } from '@/stores/config'
import type { FormInstance, FormRules } from 'element-plus'

const configStore = useConfigStore()
const configFormRef = ref<FormInstance>()
const saving = ref(false)
const testing = ref(false)
const connectionStatus = ref('未连接')

const configForm = reactive({
  baseUrl: configStore.apiConfig.baseUrl,
  apiKey: configStore.apiConfig.apiKey || ''
})

const configRules: FormRules = {
  baseUrl: [
    { required: true, message: '请输入API基础地址', trigger: 'blur' },
    { pattern: /^https?:\/\/.+/, message: '请输入有效的URL地址', trigger: 'blur' }
  ]
}

const saveConfig = async () => {
  if (!configFormRef.value) return
  
  await configFormRef.value.validate(async (valid) => {
    if (valid) {
      saving.value = true
      try {
        configStore.setApiConfig({
          baseUrl: configForm.baseUrl,
          apiKey: configForm.apiKey || undefined
        })
        ElMessage.success('配置保存成功')
      } catch (error) {
        ElMessage.error('配置保存失败')
      } finally {
        saving.value = false
      }
    }
  })
}

const testConnection = async () => {
  testing.value = true
  connectionStatus.value = '测试中...'
  
  try {
    // Mock connection test
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate connection test result
    const isConnected = Math.random() > 0.3 // 70% success rate for demo
    
    if (isConnected) {
      connectionStatus.value = '连接正常'
      ElMessage.success('API连接测试成功')
    } else {
      connectionStatus.value = '连接失败'
      ElMessage.error('API连接测试失败，请检查配置')
    }
  } catch (error) {
    connectionStatus.value = '连接失败'
    ElMessage.error('连接测试失败')
  } finally {
    testing.value = false
  }
}

onMounted(() => {
  // Initial connection status check
  connectionStatus.value = '已配置'
})
</script>