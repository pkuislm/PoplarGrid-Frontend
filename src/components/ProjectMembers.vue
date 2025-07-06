<template>
  <div class="space-y-6">
    <!-- 成员列表 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">项目成员</h3>
        <div class="flex space-x-2">
          <el-button 
            v-if="canManageMembers"
            type="primary" 
            size="small" 
            @click="showInviteDialog = true"
            :icon="Plus"
          >
            邀请成员
          </el-button>
          <el-button 
            v-if="!isManager && !isMember"
            type="success" 
            size="small" 
            @click="showApplyDialog = true"
            :icon="UserIcon"
          >
            申请加入
          </el-button>
        </div>
      </div>

      <div v-if="membersStore.isLoading" class="flex justify-center py-8">
        <div class="flex items-center space-x-2">
          <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-gray-600 dark:text-gray-400">加载中...</span>
        </div>
      </div>

      <div v-else-if="members.length === 0 && !ownerInfo && !managerInfo" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">暂无成员</p>
      </div>

      <div v-else class="space-y-3">
        <!-- 项目创建者 -->
        <div v-if="ownerInfo" class="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div class="flex items-center space-x-3">
            <el-avatar :size="40" :src="ownerInfo?.avatar">
              {{ ownerInfo?.name?.charAt(0).toUpperCase() }}
            </el-avatar>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ ownerInfo?.name }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ ownerInfo?.email }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <el-tag type="primary" size="small">项目创建者</el-tag>
          </div>
        </div>

        <!-- 项目负责人（如果与创建者不同） -->
        <div v-if="managerInfo && managerInfo.id !== ownerInfo?.id" class="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div class="flex items-center space-x-3">
            <el-avatar :size="40" :src="managerInfo?.avatar">
              {{ managerInfo?.name?.charAt(0).toUpperCase() }}
            </el-avatar>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ managerInfo?.name }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ managerInfo?.email }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <el-tag type="success" size="small">项目负责人</el-tag>
          </div>
        </div>

        <!-- 普通成员 -->
        <div 
          v-for="member in members" 
          :key="member.id"
          class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div class="flex items-center space-x-3">
            <el-avatar :size="40" :src="member.user.avatar">
              {{ member.user.name.charAt(0).toUpperCase() }}
            </el-avatar>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ member.user.name }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ member.user.email }}</p>
              <div class="flex space-x-1 mt-1">
                <el-tag 
                  v-for="role in member.roles" 
                  :key="role"
                  :color="getRoleColor(role)"
                  size="small"
                  effect="light"
                >
                  {{ getRoleDisplayName(role) }}
                </el-tag>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-500">
              {{ formatDate(member.joinedAt) }} 加入
            </span>
            <el-dropdown v-if="canManageMembers" @command="(command) => handleMemberAction(member, command)">
              <el-button size="small" :icon="More" circle />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">编辑角色</el-dropdown-item>
                  <el-dropdown-item command="setManager" v-if="!isProjectManager(member.user)">设为负责人</el-dropdown-item>
                  <el-dropdown-item command="remove" divided>移除成员</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>

    <!-- 申请列表（仅项目负责人可见） -->
    <div v-if="canManageMembers && applications.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">待处理申请</h3>
      
      <div class="space-y-3">
        <div 
          v-for="application in applications" 
          :key="application.id"
          class="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
        >
          <div class="flex items-center space-x-3">
            <el-avatar :size="40" :src="application.user.avatar">
              {{ application.user.name.charAt(0).toUpperCase() }}
            </el-avatar>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ application.user.name }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ application.user.email }}</p>
              <div class="flex space-x-1 mt-1">
                <el-tag 
                  v-for="role in application.requestedRoles" 
                  :key="role"
                  :color="getRoleColor(role)"
                  size="small"
                  effect="light"
                >
                  {{ getRoleDisplayName(role) }}
                </el-tag>
              </div>
              <p v-if="application.message" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                "{{ application.message }}"
              </p>
            </div>
          </div>
          <div class="flex space-x-2">
            <el-button 
              type="success" 
              size="small" 
              @click="handleApplication(application.id, 'approve')"
              :loading="processingApplication === application.id"
            >
              同意
            </el-button>
            <el-button 
              type="danger" 
              size="small" 
              @click="handleApplication(application.id, 'reject')"
              :loading="processingApplication === application.id"
            >
              拒绝
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 申请加入对话框 -->
    <el-dialog v-model="showApplyDialog" title="申请加入项目" width="500px">
      <el-form
        ref="applyFormRef"
        :model="applyForm"
        :rules="applyRules"
        label-width="80px"
      >
        <el-form-item label="申请角色" prop="roles">
          <el-checkbox-group v-model="applyForm.roles">
            <el-checkbox label="image_source">图源</el-checkbox>
            <el-checkbox label="artist">美工</el-checkbox>
            <el-checkbox label="translator">翻译</el-checkbox>
            <el-checkbox label="proofreader">校对</el-checkbox>
            <el-checkbox label="typesetter">嵌字</el-checkbox>
            <el-checkbox label="reviewer">审核</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        
        <el-form-item label="申请理由" prop="message">
          <el-input
            v-model="applyForm.message"
            type="textarea"
            :rows="3"
            placeholder="请简单介绍您的经验和能力..."
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showApplyDialog = false">取消</el-button>
          <el-button type="primary" @click="submitApplication" :loading="submittingApplication">
            提交申请
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 邀请成员对话框 -->
    <el-dialog v-model="showInviteDialog" title="邀请成员" width="500px">
      <el-form
        ref="inviteFormRef"
        :model="inviteForm"
        :rules="inviteRules"
        label-width="80px"
      >
        <el-form-item label="搜索用户" prop="selectedUser">
          <el-select
            v-model="inviteForm.selectedUser"
            filterable
            remote
            reserve-keyword
            placeholder="输入用户名或邮箱搜索"
            :remote-method="searchUsers"
            :loading="searchingUsers"
            value-key="id"
            class="w-full"
          >
            <el-option
              v-for="user in searchResults"
              :key="user.id"
              :label="`${user.name} (${user.email})`"
              :value="user"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="分配角色" prop="roles">
          <el-checkbox-group v-model="inviteForm.roles">
            <el-checkbox label="image_source">图源</el-checkbox>
            <el-checkbox label="artist">美工</el-checkbox>
            <el-checkbox label="translator">翻译</el-checkbox>
            <el-checkbox label="proofreader">校对</el-checkbox>
            <el-checkbox label="typesetter">嵌字</el-checkbox>
            <el-checkbox label="reviewer">审核</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        
        <el-form-item label="邀请消息" prop="message">
          <el-input
            v-model="inviteForm.message"
            type="textarea"
            :rows="3"
            placeholder="邀请消息（可选）..."
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showInviteDialog = false">取消</el-button>
          <el-button type="primary" @click="submitInvitation" :loading="submittingInvitation">
            发送邀请
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑成员角色对话框 -->
    <el-dialog v-model="showEditMemberDialog" title="编辑成员角色" width="400px">
      <el-form
        ref="editMemberFormRef"
        :model="editMemberForm"
        :rules="editMemberRules"
        label-width="80px"
      >
        <el-form-item label="成员" prop="memberName">
          <el-input v-model="editMemberForm.memberName" disabled />
        </el-form-item>
        
        <el-form-item label="角色" prop="roles">
          <el-checkbox-group v-model="editMemberForm.roles">
            <el-checkbox label="image_source">图源</el-checkbox>
            <el-checkbox label="artist">美工</el-checkbox>
            <el-checkbox label="translator">翻译</el-checkbox>
            <el-checkbox label="proofreader">校对</el-checkbox>
            <el-checkbox label="typesetter">嵌字</el-checkbox>
            <el-checkbox label="reviewer">审核</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditMemberDialog = false">取消</el-button>
          <el-button type="primary" @click="updateMemberRoles" :loading="updatingMember">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Plus, User as UserIcon, More } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useMembersStore } from '@/stores/members'
import { useAuthStore } from '@/stores/auth'
import { useTeamsStore } from '@/stores/teams'
import { getRoleColor, getRoleDisplayName, isProjectManager } from '@/utils/permissions'
import type { Project, ProjectMember, User, ProjectRole } from '@/types'
import type { FormInstance, FormRules } from 'element-plus'

interface Props {
  project: Project
}

const props = defineProps<Props>()

const membersStore = useMembersStore()
const authStore = useAuthStore()
const teamsStore = useTeamsStore()

const showApplyDialog = ref(false)
const showInviteDialog = ref(false)
const showEditMemberDialog = ref(false)
const submittingApplication = ref(false)
const submittingInvitation = ref(false)
const updatingMember = ref(false)
const processingApplication = ref<string | null>(null)
const searchingUsers = ref(false)
const searchResults = ref<User[]>([])

const applyFormRef = ref<FormInstance>()
const inviteFormRef = ref<FormInstance>()
const editMemberFormRef = ref<FormInstance>()

const applyForm = reactive({
  roles: [] as ProjectRole[],
  message: ''
})

const inviteForm = reactive({
  selectedUser: null as User | null,
  roles: [] as ProjectRole[],
  message: ''
})

const editMemberForm = reactive({
  memberId: '',
  memberName: '',
  roles: [] as ProjectRole[]
})

const applyRules: FormRules = {
  roles: [
    { required: true, message: '请选择至少一个角色', trigger: 'change' }
  ]
}

const inviteRules: FormRules = {
  selectedUser: [
    { required: true, message: '请选择要邀请的用户', trigger: 'change' }
  ],
  roles: [
    { required: true, message: '请选择至少一个角色', trigger: 'change' }
  ]
}

const editMemberRules: FormRules = {
  roles: [
    { required: true, message: '请选择至少一个角色', trigger: 'change' }
  ]
}

// 计算属性
const isOwner = computed(() => {
  return authStore.user?.id === props.project.ownerId
})

const isManager = computed(() => {
  return authStore.user?.id === (props.project.managerId || props.project.ownerId)
})

const isMember = computed(() => {
  return props.project.members.some(member => 
    member.userId === authStore.user?.id && member.status === 'active'
  )
})

const canManageMembers = computed(() => {
  return isManager.value
})

const members = computed(() => {
  return membersStore.getProjectMembers(props.project.id)
})

const applications = computed(() => {
  return membersStore.getProjectApplications(props.project.id).filter(app => app.status === 'pending')
})

const ownerInfo = computed(() => {
  // 这里应该从用户store或API获取创建者信息
  // 暂时返回模拟数据
  return {
    id: props.project.ownerId,
    name: '项目创建者',
    email: 'owner@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
  }
})

const managerInfo = computed(() => {
  if (!props.project.managerId) return null
  
  // 这里应该从用户store或API获取负责人信息
  // 暂时返回模拟数据
  return {
    id: props.project.managerId,
    name: '项目负责人',
    email: 'manager@example.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
  }
})

// 方法
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const searchUsers = async (query: string) => {
  if (!query) {
    searchResults.value = []
    return
  }
  
  searchingUsers.value = true
  try {
    const users = await membersStore.searchUsers(query)
    
    // 过滤掉已经是成员的用户，包括项目创建者、负责人和当前用户
    const existingMemberIds = new Set([
      props.project.ownerId,
      props.project.managerId,
      authStore.user?.id, // 不能邀请自己
      ...props.project.members.map(m => m.userId)
    ])
    
    // 只显示同团队的用户
    const teamMemberIds = new Set(
      teamsStore.currentTeam?.members?.map(m => m.userId) || []
    )
    
    searchResults.value = users.filter(user => 
      !existingMemberIds.has(user.id) && teamMemberIds.has(user.id)
    )
  } catch (error) {
    ElMessage.error('搜索用户失败')
  } finally {
    searchingUsers.value = false
  }
}

const submitApplication = async () => {
  if (!applyFormRef.value) return
  
  await applyFormRef.value.validate(async (valid) => {
    if (valid) {
      submittingApplication.value = true
      try {
        await membersStore.applyToProject(props.project.id, applyForm.roles, applyForm.message)
        ElMessage.success('申请已提交，请等待项目负责人审核')
        showApplyDialog.value = false
        
        // 重置表单
        Object.assign(applyForm, { roles: [], message: '' })
        applyFormRef.value?.resetFields()
      } catch (error) {
        ElMessage.error('提交申请失败')
      } finally {
        submittingApplication.value = false
      }
    }
  })
}

const submitInvitation = async () => {
  if (!inviteFormRef.value) return
  
  await inviteFormRef.value.validate(async (valid) => {
    if (valid && inviteForm.selectedUser) {
      // 检查是否尝试邀请自己
      if (inviteForm.selectedUser.id === authStore.user?.id) {
        ElMessage.error('不能邀请自己')
        return
      }
      
      submittingInvitation.value = true
      try {
        await membersStore.inviteToProject(
          props.project.id,
          inviteForm.selectedUser.id,
          inviteForm.roles,
          inviteForm.message
        )
        ElMessage.success('邀请已发送')
        showInviteDialog.value = false
        
        // 重置表单
        Object.assign(inviteForm, { selectedUser: null, roles: [], message: '' })
        inviteFormRef.value?.resetFields()
        searchResults.value = []
      } catch (error) {
        ElMessage.error('发送邀请失败')
      } finally {
        submittingInvitation.value = false
      }
    }
  })
}

const handleApplication = async (applicationId: string, action: 'approve' | 'reject') => {
  processingApplication.value = applicationId
  try {
    await membersStore.handleApplication(applicationId, action)
    ElMessage.success(action === 'approve' ? '申请已同意' : '申请已拒绝')
    
    if (action === 'approve') {
      // 重新获取成员列表
      await membersStore.fetchProjectMembers(props.project.id)
    }
  } catch (error) {
    ElMessage.error('处理申请失败')
  } finally {
    processingApplication.value = null
  }
}

const handleMemberAction = async (member: ProjectMember, action: string) => {
  if (action === 'edit') {
    editMemberForm.memberId = member.id
    editMemberForm.memberName = member.user.name
    editMemberForm.roles = [...member.roles]
    showEditMemberDialog.value = true
  } else if (action === 'setManager') {
    try {
      await ElMessageBox.confirm(
        `确定要将 ${member.user.name} 设为项目负责人吗？`,
        '确认设置',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      
      // TODO: 实现设置负责人的API调用
      ElMessage.success('负责人设置成功')
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('设置负责人失败')
      }
    }
  } else if (action === 'remove') {
    try {
      await ElMessageBox.confirm(
        `确定要移除成员 ${member.user.name} 吗？`,
        '确认移除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      
      await membersStore.removeMember(props.project.id, member.id)
      ElMessage.success('成员已移除')
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('移除成员失败')
      }
    }
  }
}

const updateMemberRoles = async () => {
  if (!editMemberFormRef.value) return
  
  await editMemberFormRef.value.validate(async (valid) => {
    if (valid) {
      updatingMember.value = true
      try {
        await membersStore.updateMemberRoles(
          props.project.id,
          editMemberForm.memberId,
          editMemberForm.roles
        )
        ElMessage.success('角色更新成功')
        showEditMemberDialog.value = false
      } catch (error) {
        ElMessage.error('角色更新失败')
      } finally {
        updatingMember.value = false
      }
    }
  })
}

onMounted(async () => {
  await Promise.all([
    membersStore.fetchProjectMembers(props.project.id),
    canManageMembers.value ? membersStore.fetchProjectApplications(props.project.id) : Promise.resolve()
  ])
})
</script>