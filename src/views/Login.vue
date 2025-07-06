<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
          登录到漫画翻译管理平台
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          使用您的账户凭据登录
        </p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 py-8 px-6 shadow-lg rounded-lg">
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="rules"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="name">
            <el-input
              v-model="loginForm.name"
              placeholder="用户名"
              size="large"
              :prefix-icon="User"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              size="large"
              :prefix-icon="Lock"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="authStore.isLoading"
              @click="handleLogin"
              class="w-full"
            >
              {{ authStore.isLoading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            测试账户：admin/admin (管理员) 或 user/user (普通用户)
          </p>
        </div>
        
        <div v-if="authStore.error" class="mt-4">
          <el-alert
            :title="authStore.error"
            type="error"
            :closable="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()
const loginFormRef = ref<FormInstance>()

const loginForm = reactive({
  name: '',
  password: ''
})

const rules: FormRules = {
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, message: '密码长度至少3位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      const success = await authStore.login(loginForm)
      if (success) {
        router.push('/dashboard')
      }
    }
  })
}
</script>