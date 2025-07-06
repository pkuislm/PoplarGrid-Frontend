import { http, mockApi } from './http'
import type { ProjectMember, ProjectApplication, ProjectInvitation, ProjectRole, User } from '@/types'

export const membersApi = {
  // 获取项目成员列表
  getProjectMembers: async (projectId: string): Promise<ProjectMember[]> => {
    return mockApi.getProjectMembers(projectId)
    
    // Uncomment below for real API
    // return await http.get(`/v1/projects/${projectId}/members`)
  },

  // 申请加入项目
  applyToProject: async (projectId: string, roles: ProjectRole[], message?: string): Promise<ProjectApplication> => {
    return mockApi.applyToProject(projectId, roles, message)
    
    // Uncomment below for real API
    // return await http.post(`/v1/projects/${projectId}/applications`, { roles, message })
  },

  // 获取项目申请列表（项目负责人查看）
  getProjectApplications: async (projectId: string): Promise<ProjectApplication[]> => {
    return mockApi.getProjectApplications(projectId)
    
    // Uncomment below for real API
    // return await http.get(`/v1/projects/${projectId}/applications`)
  },

  // 处理项目申请
  handleApplication: async (applicationId: string, action: 'approve' | 'reject'): Promise<ProjectApplication> => {
    return mockApi.handleApplication(applicationId, action)
    
    // Uncomment below for real API
    // return await http.put(`/v1/applications/${applicationId}`, { action })
  },

  // 邀请用户加入项目
  inviteToProject: async (projectId: string, userId: string, roles: ProjectRole[], message?: string): Promise<ProjectInvitation> => {
    return mockApi.inviteToProject(projectId, userId, roles, message)
    
    // Uncomment below for real API
    // return await http.post(`/v1/projects/${projectId}/invitations`, { userId, roles, message })
  },

  // 获取用户收到的邀请
  getUserInvitations: async (): Promise<ProjectInvitation[]> => {
    return mockApi.getUserInvitations()
    
    // Uncomment below for real API
    // return await http.get('/v1/user/invitations')
  },

  // 响应项目邀请
  respondToInvitation: async (invitationId: string, action: 'accept' | 'decline'): Promise<ProjectInvitation> => {
    return mockApi.respondToInvitation(invitationId, action)
    
    // Uncomment below for real API
    // return await http.put(`/v1/invitations/${invitationId}`, { action })
  },

  // 移除项目成员
  removeMember: async (projectId: string, memberId: string): Promise<void> => {
    return mockApi.removeMember(projectId, memberId)
    
    // Uncomment below for real API
    // await http.delete(`/v1/projects/${projectId}/members/${memberId}`)
  },

  // 更新成员角色
  updateMemberRoles: async (projectId: string, memberId: string, roles: ProjectRole[]): Promise<ProjectMember> => {
    return mockApi.updateMemberRoles(projectId, memberId, roles)
    
    // Uncomment below for real API
    // return await http.put(`/v1/projects/${projectId}/members/${memberId}`, { roles })
  },

  // 搜索用户（用于邀请）
  searchUsers: async (query: string): Promise<User[]> => {
    return mockApi.searchUsers(query)
    
    // Uncomment below for real API
    // return await http.get(`/v1/users/search?q=${encodeURIComponent(query)}`)
  }
}