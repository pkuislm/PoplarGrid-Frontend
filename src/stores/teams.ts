import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Team, TeamMember, ProjectSet, TeamStatistics } from '@/types'
import { teamsApi } from '@/api/teams'

export const useTeamsStore = defineStore('teams', () => {
  const teams = ref<Team[]>([])
  const currentTeam = ref<Team | null>(null)
  const currentProjectSet = ref<ProjectSet | null>(null)
  const teamStatistics = ref<TeamStatistics[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const userTeams = computed(() => teams.value)
  
  const currentTeamProjectSets = computed(() => {
    return currentTeam.value?.projectSets || []
  })

  const currentTeamProjects = computed(() => {
    if (!currentTeam.value) return []
    if (currentProjectSet.value) {
      return currentProjectSet.value.projects
    }
    return currentTeam.value.projects
  })

  const currentTeamStats = computed(() => {
    if (!currentTeam.value) return null
    return teamStatistics.value.find(stat => stat.teamId === currentTeam.value!.id)
  })

  // 获取用户的团队列表
  const fetchUserTeams = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await teamsApi.getUserTeams()
      teams.value = response
      
      // 如果没有当前团队，设置第一个团队为当前团队
      if (!currentTeam.value && teams.value.length > 0) {
        currentTeam.value = teams.value[0]
      }
    } catch (err: any) {
      error.value = err.message || '获取团队列表失败'
    } finally {
      isLoading.value = false
    }
  }

  // 切换当前团队
  const switchTeam = async (teamId: string) => {
    const team = teams.value.find(t => t.id === teamId)
    if (team) {
      currentTeam.value = team
      currentProjectSet.value = null // 重置项目集选择
      
      // 获取团队详细信息和项目集
      await Promise.all([
        fetchTeamDetails(teamId),
        fetchTeamProjectSets(teamId),
        fetchTeamStatistics(teamId)
      ])
    }
  }

  // 获取团队详细信息
  const fetchTeamDetails = async (teamId: string) => {
    try {
      const team = await teamsApi.getTeamDetails(teamId)
      const index = teams.value.findIndex(t => t.id === teamId)
      if (index !== -1) {
        teams.value[index] = team
        if (currentTeam.value?.id === teamId) {
          currentTeam.value = team
        }
      }
    } catch (err: any) {
      error.value = err.message || '获取团队详情失败'
    }
  }

  // 获取团队的项目集列表
  const fetchTeamProjectSets = async (teamId: string) => {
    try {
      const projectSets = await teamsApi.getTeamProjectSets(teamId)
      const team = teams.value.find(t => t.id === teamId)
      if (team) {
        team.projectSets = projectSets
        if (currentTeam.value?.id === teamId) {
          currentTeam.value = team
        }
      }
    } catch (err: any) {
      error.value = err.message || '获取项目集列表失败'
    }
  }

  // 切换项目集
  const switchProjectSet = (projectSetId: string | null) => {
    if (!projectSetId) {
      currentProjectSet.value = null
      return
    }
    
    const projectSet = currentTeam.value?.projectSets.find(ps => ps.id === projectSetId)
    if (projectSet) {
      currentProjectSet.value = projectSet
    }
  }

  // 获取团队统计信息
  const fetchTeamStatistics = async (teamId: string) => {
    try {
      const stats = await teamsApi.getTeamStatistics(teamId)
      const index = teamStatistics.value.findIndex(s => s.teamId === teamId)
      if (index !== -1) {
        teamStatistics.value[index] = stats
      } else {
        teamStatistics.value.push(stats)
      }
    } catch (err: any) {
      error.value = err.message || '获取团队统计失败'
    }
  }

  // 获取所有团队的统计信息
  const fetchAllTeamsStatistics = async () => {
    try {
      const allStats = await Promise.all(
        teams.value.map(team => teamsApi.getTeamStatistics(team.id))
      )
      teamStatistics.value = allStats
    } catch (err: any) {
      error.value = err.message || '获取团队统计失败'
    }
  }

  // 创建新团队
  const createTeam = async (teamData: Partial<Team>) => {
    try {
      const newTeam = await teamsApi.createTeam(teamData)
      teams.value.push(newTeam)
      return newTeam
    } catch (err: any) {
      error.value = err.message || '创建团队失败'
      throw err
    }
  }

  // 加入团队
  const joinTeam = async (teamId: string, inviteCode?: string) => {
    try {
      const team = await teamsApi.joinTeam(teamId, inviteCode)
      teams.value.push(team)
      return team
    } catch (err: any) {
      error.value = err.message || '加入团队失败'
      throw err
    }
  }

  // 离开团队
  const leaveTeam = async (teamId: string) => {
    try {
      await teamsApi.leaveTeam(teamId)
      teams.value = teams.value.filter(t => t.id !== teamId)
      
      // 如果离开的是当前团队，切换到第一个团队
      if (currentTeam.value?.id === teamId) {
        if (teams.value.length > 0) {
          await switchTeam(teams.value[0].id)
        } else {
          currentTeam.value = null
          currentProjectSet.value = null
        }
      }
    } catch (err: any) {
      error.value = err.message || '离开团队失败'
      throw err
    }
  }

  // 创建项目集
  const createProjectSet = async (projectSetData: Partial<ProjectSet>) => {
    if (!currentTeam.value) throw new Error('请先选择团队')
    
    try {
      const newProjectSet = await teamsApi.createProjectSet({
        ...projectSetData,
        teamId: currentTeam.value.id
      })
      
      currentTeam.value.projectSets.push(newProjectSet)
      return newProjectSet
    } catch (err: any) {
      error.value = err.message || '创建项目集失败'
      throw err
    }
  }

  return {
    teams: computed(() => teams.value),
    currentTeam: computed(() => currentTeam.value),
    currentProjectSet: computed(() => currentProjectSet.value),
    teamStatistics: computed(() => teamStatistics.value),
    userTeams,
    currentTeamProjectSets,
    currentTeamProjects,
    currentTeamStats,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    fetchUserTeams,
    switchTeam,
    fetchTeamDetails,
    fetchTeamProjectSets,
    switchProjectSet,
    fetchTeamStatistics,
    fetchAllTeamsStatistics,
    createTeam,
    joinTeam,
    leaveTeam,
    createProjectSet
  }
})