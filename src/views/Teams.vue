<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">团队管理</h1>
      <div class="flex space-x-3">
        <el-button type="primary" @click="showCreateTeamDialog = true">
          创建团队
        </el-button>
        <el-button @click="showJoinTeamDialog = true">
          加入团队
        </el-button>
      </div>
    </div>

    <!-- 当前团队信息 -->
    <div v-if="teamsStore.currentTeam" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">当前团队</h2>
        <el-tag type="primary">{{ teamsStore.currentTeam.name }}</el-tag>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="flex items-center space-x-4">
          <el-avatar :size="60" :src="teamsStore.currentTeam.avatar">
            {{ teamsStore.currentTeam.name.charAt(0) }}
          </el-avatar>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">{{ teamsStore.currentTeam.name }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ teamsStore.currentTeam.description }}</p>
          </div>
        </div>
        
        <div v-if="teamsStore.currentTeamStats" class="grid grid-cols-2 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ teamsStore.currentTeamStats.totalProjects }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">总项目</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ teamsStore.currentTeamStats.completedProjects }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">已完成</div>
          </div>
        </div>
        
        <div class="flex justify-end">
          <el-button @click="showCreateProjectSetDialog = true">
            创建项目集
          </el-button>
        </div>
      </div>
    </div>

    <!-- 团队统计对比 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">团队统计对比</h2>
      
      <div v-if="teamsStore.isLoading" class="flex justify-center py-8">
        <div class="flex items-center space-x-2">
          <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-gray-600 dark:text-gray-400">加载中...</span>
        </div>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                团队名称
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                总项目数
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                进行中
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                已完成
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                完成率
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                成员数
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="stats in teamsStore.teamStatistics" 
              :key="stats.teamId"
              :class="{ 'bg-blue-50 dark:bg-blue-900/20': stats.teamId === teamsStore.currentTeam?.id }"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <el-avatar :size="32" :src="getTeamAvatar(stats.teamId)">
                      {{ stats.teamName.charAt(0) }}
                    </el-avatar>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ stats.teamName }}
                      <el-tag v-if="stats.teamId === teamsStore.currentTeam?.id" type="primary" size="small" class="ml-2">
                        当前
                      </el-tag>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ stats.totalProjects }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ stats.activeProjects }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ stats.completedProjects }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-16 mr-2">
                    <el-progress 
                      :percentage="stats.completionRate" 
                      :stroke-width="6" 
                      :show-text="false"
                    />
                  </div>
                  <span class="text-sm text-gray-900 dark:text-white">{{ stats.completionRate }}%</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ stats.totalMembers }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <el-button 
                  v-if="stats.teamId !== teamsStore.currentTeam?.id"
                  type="primary" 
                  size="small"
                  @click="switchToTeam(stats.teamId)"
                >
                  切换
                </el-button>
                <el-button 
                  type="danger" 
                  size="small"
                  @click="handleLeaveTeam(stats.teamId)"
                >
                  离开
                </el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 项目集管理 -->
    <div v-if="teamsStore.currentTeam" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">项目集管理</h2>
        <el-button type="primary" size="small" @click="showCreateProjectSetDialog = true">
          创建项目集
        </el-button>
      </div>
      
      <div v-if="teamsStore.currentTeamProjectSets.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">暂无项目集</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="projectSet in teamsStore.currentTeamProjectSets"
          :key="projectSet.id"
          class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          :class="{ 'border-blue-500 bg-blue-50 dark:bg-blue-900/20': projectSet.id === teamsStore.currentProjectSet?.id }"
          @click="teamsStore.switchProjectSet(projectSet.id)"
        >
          <h3 class="font-medium text-gray-900 dark:text-white mb-2">{{ projectSet.name }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ projectSet.description }}</p>
          <div class="flex justify-between items-center text-xs text-gray-500">
            <span>{{ projectSet.projects.length }} 个项目</span>
            <span>{{ formatDate(projectSet.updatedAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建团队对话框 -->
    <el-dialog v-model="showCreateTeamDialog" title="创建团队" width="500px">
      <el-form
        ref="createTeamFormRef"
        :model="createTeamForm"
        :rules="createTeamRules"
        label-width="80px"
      >
        <el-form-item label="团队名称" prop="name">
          <el-input v-model="createTeamForm.name" placeholder="请输入团队名称" />
        </el-form-item>
        
        <el-form-item label="团队描述" prop="description">
          <el-input
            v-model="createTeamForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入团队描述（可选）"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateTeamDialog = false">取消</el-button>
          <el-button type="primary" @click="handleCreateTeam" :loading="creatingTeam">
            创建
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 加入团队对话框 -->
    <el-dialog v-model="showJoinTeamDialog" title="加入团队" width="400px">
      <el-form
        ref="joinTeamFormRef"
        :model="joinTeamForm"
        :rules="joinTeamRules"
        label-width="80px"
      >
        <el-form-item label="邀请码" prop="inviteCode">
          <el-input v-model="joinTeamForm.inviteCode" placeholder="请输入团队邀请码" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showJoinTeamDialog = false">取消</el-button>
          <el-button type="primary" @click="handleJoinTeam" :loading="joiningTeam">
            加入
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 创建项目集对话框 -->
    <el-dialog v-model="showCreateProjectSetDialog" title="创建项目集" width="500px">
      <el-form
        ref="createProjectSetFormRef"
        :model="createProjectSetForm"
        :rules="createProjectSetRules"
        label-width="80px"
      >
        <el-form-item label="项目集名称" prop="name">
          <el-input v-model="createProjectSetForm.name" placeholder="请输入项目集名称" />
        </el-form-item>
        
        <el-form-item label="项目集描述" prop="description">
          <el-input
            v-model="createProjectSetForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入项目集描述（可选）"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateProjectSetDialog = false">取消</el-button>
          <el-button type="primary" @click="handleCreateProjectSet" :loading="creatingProjectSet">
            创建
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTeamsStore } from '@/stores/teams'
import type { FormInstance, FormRules } from 'element-plus'

const teamsStore = useTeamsStore()

const showCreateTeamDialog = ref(false)
const showJoinTeamDialog = ref(false)
const showCreateProjectSetDialog = ref(false)
const creatingTeam = ref(false)
const joiningTeam = ref(false)
const creatingProjectSet = ref(false)

const createTeamFormRef = ref<FormInstance>()
const joinTeamFormRef = ref<FormInstance>()
const createProjectSetFormRef = ref<FormInstance>()

const createTeamForm = reactive({
  name: '',
  description: ''
})

const joinTeamForm = reactive({
  inviteCode: ''
})

const createProjectSetForm = reactive({
  name: '',
  description: ''
})

const createTeamRules: FormRules = {
  name: [
    { required: true, message: '请输入团队名称', trigger: 'blur' }
  ]
}

const joinTeamRules: FormRules = {
  inviteCode: [
    { required: true, message: '请输入邀请码', trigger: 'blur' }
  ]
}

const createProjectSetRules: FormRules = {
  name: [
    { required: true, message: '请输入项目集名称', trigger: 'blur' }
  ]
}

const getTeamAvatar = (teamId: string) => {
  const team = teamsStore.userTeams.find(t => t.id === teamId)
  return team?.avatar
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const switchToTeam = async (teamId: string) => {
  await teamsStore.switchTeam(teamId)
  ElMessage.success('团队切换成功')
}

const handleCreateTeam = async () => {
  if (!createTeamFormRef.value) return
  
  await createTeamFormRef.value.validate(async (valid) => {
    if (valid) {
      creatingTeam.value = true
      try {
        await teamsStore.createTeam(createTeamForm)
        ElMessage.success('团队创建成功')
        showCreateTeamDialog.value = false
        
        // 重置表单
        Object.assign(createTeamForm, { name: '', description: '' })
        createTeamFormRef.value?.resetFields()
      } catch (error) {
        ElMessage.error('团队创建失败')
      } finally {
        creatingTeam.value = false
      }
    }
  })
}

const handleJoinTeam = async () => {
  if (!joinTeamFormRef.value) return
  
  await joinTeamFormRef.value.validate(async (valid) => {
    if (valid) {
      joiningTeam.value = true
      try {
        await teamsStore.joinTeam('team1', joinTeamForm.inviteCode) // Mock team ID
        ElMessage.success('加入团队成功')
        showJoinTeamDialog.value = false
        
        // 重置表单
        Object.assign(joinTeamForm, { inviteCode: '' })
        joinTeamFormRef.value?.resetFields()
      } catch (error) {
        ElMessage.error('加入团队失败')
      } finally {
        joiningTeam.value = false
      }
    }
  })
}

const handleCreateProjectSet = async () => {
  if (!createProjectSetFormRef.value) return
  
  await createProjectSetFormRef.value.validate(async (valid) => {
    if (valid) {
      creatingProjectSet.value = true
      try {
        await teamsStore.createProjectSet(createProjectSetForm)
        ElMessage.success('项目集创建成功')
        showCreateProjectSetDialog.value = false
        
        // 重置表单
        Object.assign(createProjectSetForm, { name: '', description: '' })
        createProjectSetFormRef.value?.resetFields()
      } catch (error) {
        ElMessage.error('项目集创建失败')
      } finally {
        creatingProjectSet.value = false
      }
    }
  })
}

const handleLeaveTeam = async (teamId: string) => {
  const team = teamsStore.userTeams.find(t => t.id === teamId)
  if (!team) return
  
  try {
    await ElMessageBox.confirm(
      `确定要离开团队 ${team.name} 吗？`,
      '确认离开',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await teamsStore.leaveTeam(teamId)
    ElMessage.success('已离开团队')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('离开团队失败')
    }
  }
}

onMounted(async () => {
  await Promise.all([
    teamsStore.fetchUserTeams(),
    teamsStore.fetchAllTeamsStatistics()
  ])
})
</script>