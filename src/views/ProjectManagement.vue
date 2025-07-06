<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">项目管理</h1>
      <div class="flex space-x-3">
        <el-button @click="showTagManager = true" :icon="PriceTag">
          标签管理
        </el-button>
        <el-button 
          type="primary" 
          @click="handleSync" 
          :loading="syncStore.isSyncing"
          :icon="Refresh"
        >
          {{ syncStore.isSyncing ? '同步中...' : '同步项目' }}
        </el-button>
        <el-button 
          v-if="authStore.isAdmin"
          @click="handleExport"
          :icon="Download"
        >
          导出数据
        </el-button>
      </div>
    </div>

    <!-- 同步结果提示 -->
    <div v-if="syncStore.lastSyncResult" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p class="text-sm font-medium text-green-800 dark:text-green-200">
            同步完成！共同步 {{ syncStore.lastSyncResult.syncedCount }} 个项目
          </p>
          <p class="text-xs text-green-600 dark:text-green-400 mt-1">
            新增: {{ syncStore.lastSyncResult.newCount }} | 更新: {{ syncStore.lastSyncResult.updatedCount }}
          </p>
        </div>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div class="flex flex-wrap gap-4 items-center">
        <el-select v-model="typeFilter" placeholder="项目类型" clearable class="w-40">
          <el-option label="全部类型" value="" />
          <el-option 
            v-for="tag in syncStore.projectTags" 
            :key="tag.id"
            :label="tag.name" 
            :value="tag.name" 
          />
        </el-select>
        
        <el-select v-model="statusFilter" placeholder="发布状态" clearable class="w-40">
          <el-option label="全部状态" value="" />
          <el-option label="未发布" value="not_published" />
          <el-option label="已发布" value="published" />
          <el-option label="待发布" value="pending" />
        </el-select>
        
        <el-input
          v-model="searchQuery"
          placeholder="搜索项目名称..."
          :prefix-icon="Search"
          class="w-64"
        />
      </div>
    </div>

    <!-- 项目表格 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          项目列表 ({{ filteredProjects.length }})
        </h2>
      </div>
      
      <div v-if="syncStore.isLoading" class="flex justify-center py-12">
        <div class="flex items-center space-x-2">
          <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-gray-600 dark:text-gray-400">加载中...</span>
        </div>
      </div>
      
      <div v-else-if="filteredProjects.length === 0" class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">
          {{ searchQuery || typeFilter || statusFilter ? '没有找到匹配的项目' : '暂无项目，请先同步数据' }}
        </p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                序号
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                项目名称
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                项目类型
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                图源
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                美工
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                翻译
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                校对
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                嵌字
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                审核
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                发布状态
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                上次更新
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                备注
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="project in filteredProjects" 
              :key="project.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              @dblclick="navigateToProject(project)"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ project.serialNumber }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ project.name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <el-tag 
                  v-if="project.type" 
                  :color="getTagColor(project.type)"
                  size="small"
                  effect="light"
                >
                  {{ project.type }}
                </el-tag>
                <span v-else class="text-gray-400 text-sm">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ project.imageSource || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ project.artist || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ project.translator || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ project.proofreader || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ project.typesetter || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ project.reviewer || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <el-tag :type="getPublishStatusType(project.publishStatus)" size="small">
                  {{ getPublishStatusText(project.publishStatus) }}
                </el-tag>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(project.lastUpdated) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                {{ project.notes || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 标签管理对话框 -->
    <el-dialog v-model="showTagManager" title="标签管理" width="600px">
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">项目标签</h3>
          <el-button type="primary" size="small" @click="showCreateTag = true">
            新建标签
          </el-button>
        </div>
        
        <div class="grid grid-cols-1 gap-3">
          <div 
            v-for="tag in syncStore.projectTags" 
            :key="tag.id"
            class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div 
                class="w-4 h-4 rounded-full"
                :style="{ backgroundColor: tag.color }"
              ></div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ tag.name }}</p>
                <p class="text-sm text-gray-500" v-if="tag.description">{{ tag.description }}</p>
              </div>
            </div>
            <el-button 
              type="danger" 
              size="small" 
              @click="handleDeleteTag(tag.id)"
              :icon="Delete"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 创建标签对话框 -->
    <el-dialog v-model="showCreateTag" title="创建标签" width="400px">
      <el-form
        ref="tagFormRef"
        :model="tagForm"
        :rules="tagRules"
        label-width="80px"
      >
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="tagForm.name" placeholder="请输入标签名称" />
        </el-form-item>
        
        <el-form-item label="标签颜色" prop="color">
          <el-color-picker v-model="tagForm.color" />
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="tagForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入标签描述（可选）"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateTag = false">取消</el-button>
          <el-button type="primary" @click="handleCreateTag" :loading="creating">
            创建
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Refresh, Download, PriceTag, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useSyncStore } from '@/stores/sync'
import { useAuthStore } from '@/stores/auth'
import * as XLSX from 'xlsx'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const syncStore = useSyncStore()
const authStore = useAuthStore()

const typeFilter = ref('')
const statusFilter = ref('')
const searchQuery = ref('')
const showTagManager = ref(false)
const showCreateTag = ref(false)
const creating = ref(false)
const tagFormRef = ref<FormInstance>()

const tagForm = reactive({
  name: '',
  color: '#3b82f6',
  description: ''
})

const tagRules: FormRules = {
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' }
  ]
}

const filteredProjects = computed(() => {
  let filtered = syncStore.syncedProjects
  
  if (typeFilter.value) {
    filtered = filtered.filter(p => p.type === typeFilter.value)
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(p => p.publishStatus === statusFilter.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.originalName.toLowerCase().includes(query)
    )
  }
  
  return filtered.sort((a, b) => a.serialNumber - b.serialNumber)
})

const getTagColor = (tagName: string) => {
  const tag = syncStore.projectTags.find(t => t.name === tagName)
  return tag?.color || '#3b82f6'
}

const getPublishStatusType = (status: string) => {
  switch (status) {
    case 'published': return 'success'
    case 'pending': return 'warning'
    case 'not_published': return 'info'
    default: return 'info'
  }
}

const getPublishStatusText = (status: string) => {
  switch (status) {
    case 'published': return '已发布'
    case 'pending': return '待发布'
    case 'not_published': return '未发布'
    default: return '未知'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const handleSync = async () => {
  try {
    await syncStore.syncProjects()
    ElMessage.success('项目同步成功')
  } catch (error) {
    ElMessage.error('项目同步失败')
  }
}

const handleExport = async () => {
  try {
    // 使用 XLSX 库在前端生成 Excel 文件
    const data = filteredProjects.value.map((project, index) => ({
      '序号': project.serialNumber,
      '项目名称': project.name,
      '项目类型': project.type || '',
      '图源': project.imageSource || '',
      '美工': project.artist || '',
      '翻译': project.translator || '',
      '校对': project.proofreader || '',
      '嵌字': project.typesetter || '',
      '审核': project.reviewer || '',
      '发布状态': getPublishStatusText(project.publishStatus),
      '上次更新日期': formatDate(project.lastUpdated),
      '备注': project.notes || ''
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '项目列表')
    
    const fileName = `项目列表_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(workbook, fileName)
    
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

const navigateToProject = (project: any) => {
  if (project.externalProjectId) {
    // 跳转到项目详情页
    router.push(`/projects/${project.externalProjectId}`)
  } else {
    ElMessage.info('该项目暂无详情页面')
  }
}

const handleCreateTag = async () => {
  if (!tagFormRef.value) return
  
  await tagFormRef.value.validate(async (valid) => {
    if (valid) {
      creating.value = true
      try {
        await syncStore.createProjectTag(tagForm)
        ElMessage.success('标签创建成功')
        showCreateTag.value = false
        
        // 重置表单
        Object.assign(tagForm, {
          name: '',
          color: '#3b82f6',
          description: ''
        })
        tagFormRef.value?.resetFields()
      } catch (error) {
        ElMessage.error('标签创建失败')
      } finally {
        creating.value = false
      }
    }
  })
}

const handleDeleteTag = async (tagId: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个标签吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await syncStore.deleteProjectTag(tagId)
    ElMessage.success('标签删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('标签删除失败')
    }
  }
}

onMounted(async () => {
  await Promise.all([
    syncStore.fetchSyncedProjects(),
    syncStore.fetchProjectTags()
  ])
})
</script>