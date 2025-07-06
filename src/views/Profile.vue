<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">个人资料</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 基本信息 -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">基本信息</h2>
          
          <el-form
            ref="profileFormRef"
            :model="profileForm"
            :rules="profileRules"
            label-width="100px"
          >
            <el-form-item label="用户名" prop="name">
              <el-input v-model="profileForm.name" disabled />
            </el-form-item>
            
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="profileForm.email" />
            </el-form-item>
            
            <el-form-item label="个人签名" prop="signature">
              <el-input
                v-model="profileForm.signature"
                type="textarea"
                :rows="3"
                placeholder="介绍一下自己..."
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="updateProfile" :loading="updating">
                保存修改
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 修改密码 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">修改密码</h2>
          
          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            label-width="100px"
          >
            <el-form-item label="当前密码" prop="currentPassword">
              <el-input
                v-model="passwordForm.currentPassword"
                type="password"
                show-password
              />
            </el-form-item>
            
            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                show-password
              />
            </el-form-item>
            
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                show-password
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="changePassword" :loading="changingPassword">
                修改密码
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="text-center">
            <el-avatar :size="80" :src="authStore.user?.avatar">
              {{ authStore.user?.name?.charAt(0).toUpperCase() }}
            </el-avatar>
            <h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              {{ authStore.user?.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ authStore.isAdmin ? '管理员' : '普通用户' }}
            </p>
            <el-button size="small" class="mt-3">
              更换头像
            </el-button>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">账户统计</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">参与项目</span>
              <span class="font-medium">2</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">完成翻译</span>
              <span class="font-medium">156</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">完成校对</span>
              <span class="font-medium">89</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import type { FormInstance, FormRules } from 'element-plus'

const authStore = useAuthStore()
const profileFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()
const updating = ref(false)
const changingPassword = ref(false)

const profileForm = reactive({
  name: '',
  email: '',
  signature: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const profileRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ]
}

const passwordRules: FormRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const updateProfile = async () => {
  if (!profileFormRef.value) return
  
  await profileFormRef.value.validate(async (valid) => {
    if (valid) {
      updating.value = true
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Update local user data
        authStore.updateUser({
          ...authStore.user!,
          email: profileForm.email,
          signature: profileForm.signature
        })
        
        ElMessage.success('个人资料更新成功')
      } catch (error) {
        ElMessage.error('个人资料更新失败')
      } finally {
        updating.value = false
      }
    }
  })
}

const changePassword = async () => {
  if (!passwordFormRef.value) return
  
  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      changingPassword.value = true
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        ElMessage.success('密码修改成功')
        
        // Reset form
        Object.assign(passwordForm, {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        passwordFormRef.value?.resetFields()
      } catch (error) {
        ElMessage.error('密码修改失败')
      } finally {
        changingPassword.value = false
      }
    }
  })
}

onMounted(() => {
  if (authStore.user) {
    profileForm.name = authStore.user.name
    profileForm.email = authStore.user.email || ''
    profileForm.signature = authStore.user.signature || ''
  }
})
</script>