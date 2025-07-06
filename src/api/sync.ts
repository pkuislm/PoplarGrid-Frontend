import { http, mockApi } from './http'
import type { SyncedProject, ProjectTag, SyncResult } from '@/types'

export const syncApi = {
  // 同步外部平台项目
  syncProjects: async (): Promise<SyncResult> => {
    // Use mock API for development
    return mockApi.syncProjects()
    
    // Uncomment below for real API
    // return await http.post('/v1/sync/projects')
  },

  // 获取同步的项目列表
  getSyncedProjects: async (): Promise<SyncedProject[]> => {
    return mockApi.getSyncedProjects()
    
    // Uncomment below for real API
    // return await http.get('/v1/synced-projects')
  },

  // 更新同步项目信息
  updateSyncedProject: async (id: string, data: Partial<SyncedProject>): Promise<SyncedProject> => {
    // Mock implementation
    const projects = await mockApi.getSyncedProjects()
    const project = projects.find(p => p.id === id)
    if (!project) throw new Error('项目不存在')
    
    Object.assign(project, data, { updatedAt: new Date().toISOString() })
    return project
    
    // Uncomment below for real API
    // return await http.put(`/v1/synced-projects/${id}`, data)
  },

  // 获取项目标签
  getProjectTags: async (): Promise<ProjectTag[]> => {
    return mockApi.getProjectTags()
    
    // Uncomment below for real API
    // return await http.get('/v1/project-tags')
  },

  // 创建项目标签
  createProjectTag: async (data: Partial<ProjectTag>): Promise<ProjectTag> => {
    const newTag: ProjectTag = {
      id: Date.now().toString(),
      name: data.name || '',
      color: data.color || '#3b82f6',
      description: data.description,
      createdAt: new Date().toISOString()
    }
    return newTag
    
    // Uncomment below for real API
    // return await http.post('/v1/project-tags', data)
  },

  // 删除项目标签
  deleteProjectTag: async (id: string): Promise<void> => {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Uncomment below for real API
    // await http.delete(`/v1/project-tags/${id}`)
  },

  // 导出项目数据
  exportProjects: async (format: 'xlsx' | 'csv' = 'xlsx'): Promise<Blob> => {
    // Mock implementation - return empty blob
    return new Blob([''], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    // Uncomment below for real API
    // const response = await http.get(`/v1/synced-projects/export?format=${format}`, {
    //   responseType: 'blob'
    // })
    // return response
  }
}