import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Project, ProjectProgress } from '@/types'
import { projectApi } from '@/api/projects'
import { useTeamsStore } from '@/stores/teams'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const teamsStore = useTeamsStore()

  // 根据当前团队和项目集筛选项目
  const filteredProjects = computed(() => {
    let filtered = projects.value
    
    // 按团队筛选
    if (teamsStore.currentTeam) {
      filtered = filtered.filter(p => p.teamId === teamsStore.currentTeam!.id)
    }
    
    // 按项目集筛选
    if (teamsStore.currentProjectSet) {
      filtered = filtered.filter(p => p.projectSetId === teamsStore.currentProjectSet!.id)
    }
    
    return filtered
  })

  const activeProjects = computed(() => 
    filteredProjects.value.filter(p => p.status === 'active')
  )
  
  const completedProjects = computed(() => 
    filteredProjects.value.filter(p => p.status === 'completed')
  )

  const fetchProjects = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await projectApi.getProjects()
      projects.value = response
    } catch (err: any) {
      error.value = err.message || '获取项目列表失败'
    } finally {
      isLoading.value = false
    }
  }

  const fetchProject = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const project = await projectApi.getProject(id)
      currentProject.value = project
      return project
    } catch (err: any) {
      error.value = err.message || '获取项目详情失败'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateProjectProgress = async (projectId: string, progress: Partial<ProjectProgress>) => {
    try {
      const updatedProject = await projectApi.updateProgress(projectId, progress)
      
      // Update local state
      const index = projects.value.findIndex(p => p.id === projectId)
      if (index !== -1) {
        projects.value[index] = updatedProject
      }
      
      if (currentProject.value?.id === projectId) {
        currentProject.value = updatedProject
      }
      
      return updatedProject
    } catch (err: any) {
      error.value = err.message || '更新项目进度失败'
      throw err
    }
  }

  const createProject = async (projectData: Partial<Project>) => {
    isLoading.value = true
    error.value = null
    
    try {
      // 添加当前团队和项目集信息
      const enrichedProjectData = {
        ...projectData,
        teamId: teamsStore.currentTeam?.id,
        projectSetId: teamsStore.currentProjectSet?.id
      }
      
      const newProject = await projectApi.createProject(enrichedProjectData)
      projects.value.unshift(newProject)
      return newProject
    } catch (err: any) {
      error.value = err.message || '创建项目失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    projects: computed(() => filteredProjects.value),
    allProjects: computed(() => projects.value),
    currentProject: computed(() => currentProject.value),
    activeProjects,
    completedProjects,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    fetchProjects,
    fetchProject,
    updateProjectProgress,
    createProject
  }
})