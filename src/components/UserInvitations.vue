<template>
  <div v-if="pendingInvitations.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      项目邀请 ({{ pendingInvitations.length }})
    </h3>
    
    <div class="space-y-3">
      <div 
        v-for="invitation in pendingInvitations" 
        :key="invitation.id"
        class="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
      >
        <div class="flex-1">
          <p class="font-medium text-gray-900 dark:text-white">
            项目邀请：{{ getProjectName(invitation.projectId) }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            邀请人：{{ getInviterName(invitation.inviterId) }}
          </p>
          <div class="flex space-x-1 mt-1">
            <span class="text-sm text-gray-600 dark:text-gray-400">角色：</span>
            <el-tag 
              v-for="role in invitation.assignedRoles" 
              :key="role"
              :color="getRoleColor(role)"
              size="small"
              effect="light"
            >
              {{ getRoleDisplayName(role) }}
            </el-tag>
          </div>
          <p v-if="invitation.message" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            "{{ invitation.message }}"
          </p>
          <p class="text-xs text-gray-500 mt-1">
            {{ formatDate(invitation.createdAt) }}
          </p>
        </div>
        <div class="flex space-x-2 ml-4">
          <el-button 
            type="success" 
            size="small" 
            @click="respondToInvitation(invitation.id, 'accept')"
            :loading="respondingInvitation === invitation.id"
          >
            接受
          </el-button>
          <el-button 
            type="danger" 
            size="small" 
            @click="respondToInvitation(invitation.id, 'decline')"
            :loading="respondingInvitation === invitation.id"
          >
            拒绝
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useMembersStore } from '@/stores/members'
import { useProjectsStore } from '@/stores/projects'
import { useAuthStore } from '@/stores/auth'
import { getRoleColor, getRoleDisplayName } from '@/utils/permissions'

const membersStore = useMembersStore()
const projectsStore = useProjectsStore()
const authStore = useAuthStore()

const respondingInvitation = ref<string | null>(null)

const pendingInvitations = computed(() => {
  return membersStore.pendingInvitations
})

const getProjectName = (projectId: string) => {
  const project = projectsStore.projects.find(p => p.id === projectId)
  return project?.name || '未知项目'
}

const getInviterName = (inviterId: string) => {
  // 如果邀请人是当前用户，显示"我"
  if (inviterId === authStore.user?.id) {
    return '我'
  }
  
  // 尝试从项目成员中找到邀请人信息
  // 这里可以根据实际情况从用户store或其他地方获取用户信息
  // 暂时返回一个默认值，实际应用中应该有用户信息的获取方法
  if (inviterId === '1') {
    return 'admin'
  }
  
  return `用户${inviterId}`
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const respondToInvitation = async (invitationId: string, action: 'accept' | 'decline') => {
  respondingInvitation.value = invitationId
  try {
    await membersStore.respondToInvitation(invitationId, action)
    ElMessage.success(action === 'accept' ? '已接受邀请' : '已拒绝邀请')
    
    if (action === 'accept') {
      // 重新获取项目列表以更新成员信息
      await projectsStore.fetchProjects()
    }
  } catch (error) {
    ElMessage.error('响应邀请失败')
  } finally {
    respondingInvitation.value = null
  }
}

onMounted(() => {
  membersStore.fetchUserInvitations()
})
</script>