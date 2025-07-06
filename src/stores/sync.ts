import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SyncedProject, ProjectTag, SyncResult } from '@/types'
import { syncApi } from '@/api/sync'

export const useSyncStore = defineStore('sync', () => {
  const syncedProjects = ref<SyncedProject[]>([])
  const projectTags = ref<ProjectTag[]>([])
  const isLoading = ref(false)
  const isSyncing = ref(false)
  const error = ref<string | null>(null)
  const lastSyncResult = ref<SyncResult | null>(null)

  // 计算属性
  const maxSerialNumber = computed(() => {
    if (syncedProjects.value.length === 0) return 0
    return Math.max(...syncedProjects.value.map(p => p.serialNumber))
  })

  const projectsByTag = computed(() => {
    const grouped: Record<string, SyncedProject[]> = {}
    syncedProjects.value.forEach(project => {
      const tag = project.type || '未分类'
      if (!grouped[tag]) {
        grouped[tag] = []
      }
      grouped[tag].push(project)
    })
    return grouped
  })

  // 获取同步项目列表
  const fetchSyncedProjects = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await syncApi.getSyncedProjects()
      syncedProjects.value = response
    } catch (err: any) {
      error.value = err.message || '获取项目列表失败'
    } finally {
      isLoading.value = false
    }
  }

  // 同步外部平台项目
  const syncProjects = async () => {
    isSyncing.value = true
    error.value = null
    
    try {
      const result = await syncApi.syncProjects()
      lastSyncResult.value = result
      
      if (result.success) {
        // 重新获取项目列表
        await fetchSyncedProjects()
      }
      
      return result
    } catch (err: any) {
      error.value = err.message || '同步失败'
      throw err
    } finally {
      isSyncing.value = false
    }
  }

  // 更新项目信息
  const updateSyncedProject = async (id: string, data: Partial<SyncedProject>) => {
    try {
      const updatedProject = await syncApi.updateSyncedProject(id, data)
      
      // 更新本地状态
      const index = syncedProjects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        syncedProjects.value[index] = updatedProject
      }
      
      return updatedProject
    } catch (err: any) {
      error.value = err.message || '更新项目失败'
      throw err
    }
  }

  // 获取项目标签
  const fetchProjectTags = async () => {
    try {
      const response = await syncApi.getProjectTags()
      projectTags.value = response
    } catch (err: any) {
      error.value = err.message || '获取标签失败'
    }
  }

  // 创建项目标签
  const createProjectTag = async (data: Partial<ProjectTag>) => {
    try {
      const newTag = await syncApi.createProjectTag(data)
      projectTags.value.unshift(newTag)
      return newTag
    } catch (err: any) {
      error.value = err.message || '创建标签失败'
      throw err
    }
  }

  // 删除项目标签
  const deleteProjectTag = async (id: string) => {
    try {
      await syncApi.deleteProjectTag(id)
      projectTags.value = projectTags.value.filter(tag => tag.id !== id)
    } catch (err: any) {
      error.value = err.message || '删除标签失败'
      throw err
    }
  }

  // 导出项目数据
  const exportProjects = async (format: 'xlsx' | 'csv' = 'xlsx') => {
    try {
      const blob = await syncApi.exportProjects(format)
      
      // 创建下载链接
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `projects_export_${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      error.value = err.message || '导出失败'
      throw err
    }
  }

  // 生成新项目序号
  const generateNextSerialNumber = () => {
    return maxSerialNumber.value + 1
  }

  // 解析项目名称中的序号
  const parseProjectName = (name: string) => {
    const match = name.match(/^【(\d+)】(.+)$/)
    if (match) {
      return {
        serialNumber: parseInt(match[1], 10),
        projectName: match[2]
      }
    }
    return {
      serialNumber: 0,
      projectName: name
    }
  }

  return {
    syncedProjects: computed(() => syncedProjects.value),
    projectTags: computed(() => projectTags.value),
    isLoading: computed(() => isLoading.value),
    isSyncing: computed(() => isSyncing.value),
    error: computed(() => error.value),
    lastSyncResult: computed(() => lastSyncResult.value),
    maxSerialNumber,
    projectsByTag,
    fetchSyncedProjects,
    syncProjects,
    updateSyncedProject,
    fetchProjectTags,
    createProjectTag,
    deleteProjectTag,
    exportProjects,
    generateNextSerialNumber,
    parseProjectName
  }
})