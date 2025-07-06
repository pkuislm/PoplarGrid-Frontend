import { http, mockApi } from './http'
import type { Team, TeamMember, ProjectSet, TeamStatistics } from '@/types'

export const teamsApi = {
  // 获取用户的团队列表
  getUserTeams: async (): Promise<Team[]> => {
    return mockApi.getUserTeams()
    
    // Uncomment below for real API
    // return await http.get('/v1/user/teams')
  },

  // 获取团队详细信息
  getTeamDetails: async (teamId: string): Promise<Team> => {
    return mockApi.getTeamDetails(teamId)
    
    // Uncomment below for real API
    // return await http.get(`/v1/teams/${teamId}`)
  },

  // 获取团队的项目集列表
  getTeamProjectSets: async (teamId: string): Promise<ProjectSet[]> => {
    return mockApi.getTeamProjectSets(teamId)
    
    // Uncomment below for real API
    // return await http.get(`/v1/teams/${teamId}/project-sets`)
  },

  // 获取团队统计信息
  getTeamStatistics: async (teamId: string): Promise<TeamStatistics> => {
    return mockApi.getTeamStatistics(teamId)
    
    // Uncomment below for real API
    // return await http.get(`/v1/teams/${teamId}/statistics`)
  },

  // 创建团队
  createTeam: async (teamData: Partial<Team>): Promise<Team> => {
    return mockApi.createTeam(teamData)
    
    // Uncomment below for real API
    // return await http.post('/v1/teams', teamData)
  },

  // 加入团队
  joinTeam: async (teamId: string, inviteCode?: string): Promise<Team> => {
    return mockApi.joinTeam(teamId, inviteCode)
    
    // Uncomment below for real API
    // return await http.post(`/v1/teams/${teamId}/join`, { inviteCode })
  },

  // 离开团队
  leaveTeam: async (teamId: string): Promise<void> => {
    return mockApi.leaveTeam(teamId)
    
    // Uncomment below for real API
    // await http.delete(`/v1/teams/${teamId}/members/me`)
  },

  // 创建项目集
  createProjectSet: async (projectSetData: Partial<ProjectSet>): Promise<ProjectSet> => {
    return mockApi.createProjectSet(projectSetData)
    
    // Uncomment below for real API
    // return await http.post('/v1/project-sets', projectSetData)
  },

  // 获取团队成员列表
  getTeamMembers: async (teamId: string): Promise<TeamMember[]> => {
    return mockApi.getTeamMembers(teamId)
    
    // Uncomment below for real API
    // return await http.get(`/v1/teams/${teamId}/members`)
  }
}