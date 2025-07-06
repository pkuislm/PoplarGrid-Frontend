<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">项目管理</h1>
      <el-button type="primary" @click="showCreateDialog = true">
        创建项目
      </el-button>
    </div>

    <!-- 筛选器 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div class="flex flex-wrap gap-4 items-center">
        <el-select v-model="statusFilter" placeholder="状态筛选" clearable class="w-32">
          <el-option label="全部" value="" />
          <el-option label="进行中" value="active" />
          <el-option label="已完成" value="completed" />
          <el-option label="已暂停" value="paused" />
        </el-select>
        
        <el-input
          v-model="searchQuery"
          placeholder="搜索项目名称..."
          :prefix-icon="Search"
          class="w-64"
        />
      </div>
    </div>

    <!-- 项目列表 -->
    <div v-if="projectsStore.isLoading" class="flex justify-center py-12">
      <div class="flex items-center space-x-2">
        <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-600 dark:text-gray-400">加载中...</span>
      </div>
    </div>
    
    <div v-else-if="filteredProjects.length === 0" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">{{ searchQuery ? '没有找到匹配的项目' : '暂无项目' }}</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProjectCard
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
      />
    </div>

    <!-- 创建项目对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      title="创建新项目"
      width="500px"
    >
      <el-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        label-width="100px"
      >
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="createForm.name" placeholder="请输入项目名称" />
        </el-form-item>
        
        <el-form-item label="项目描述" prop="description">
          <el-input
            v-model="createForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入项目描述（可选）"
          />
        </el-form-item>
        
        <el-form-item label="源语言" prop="sourceLanguage">
          <el-select v-model="createForm.sourceLanguage" placeholder="选择源语言">
            <el-option label="日语" value="ja" />
            <el-option label="英语" value="en" />
            <el-option label="韩语" value="ko" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="目标语言" prop="targetLanguages">
          <el-select
            v-model="createForm.targetLanguages"
            multiple
            placeholder="选择目标语言"
          >
            <el-option label="简体中文" value="zh-CN" />
            <el-option label="繁体中文" value="zh-TW" />
            <el-option label="英语" value="en" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateDialog = false">取消</el-button>
          <el-button type="primary" @click="handleCreateProject" :loading="creating">
            创建
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useProjectsStore } from '@/stores/projects'
import ProjectCard from '@/components/ProjectCard.vue'
import type { FormInstance, FormRules } from 'element-plus'

const projectsStore = useProjectsStore()

const statusFilter = ref('')
const searchQuery = ref('')
const showCreateDialog = ref(false)
const creating = ref(false)
const createFormRef = ref<FormInstance>()

const createForm = reactive({
  name: '',
  description: '',
  sourceLanguage: 'ja',
  targetLanguages: ['zh-CN']
})

const createRules: FormRules = {
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' }
  ],
  sourceLanguage: [
    { required: true, message: '请选择源语言', trigger: 'change' }
  ],
  targetLanguages: [
    { required: true, message: '请选择至少一个目标语言', trigger: 'change' }
  ]
}

const filteredProjects = computed(() => {
  let filtered = projectsStore.projects
  
  if (statusFilter.value) {
    filtered = filtered.filter(p => p.status === statusFilter.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

const handleCreateProject = async () => {
  if (!createFormRef.value) return
  
  await createFormRef.value.validate(async (valid) => {
    if (valid) {
      creating.value = true
      try {
        await projectsStore.createProject(createForm)
        ElMessage.success('项目创建成功')
        showCreateDialog.value = false
        
        // 重置表单
        Object.assign(createForm, {
          name: '',
          description: '',
          sourceLanguage: 'ja',
          targetLanguages: ['zh-CN']
        })
        createFormRef.value?.resetFields()
      } catch (error) {
        ElMessage.error('项目创建失败')
      } finally {
        creating.value = false
      }
    }
  })
}

onMounted(() => {
  projectsStore.fetchProjects()
})
</script>