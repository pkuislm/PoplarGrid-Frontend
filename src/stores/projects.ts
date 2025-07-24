import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  Project,
  ProjectBasic,
  ProjectDetail,
  ProjectProgress,
} from "@/types";
import { projectApi } from "@/api/projects";
import { useTeamsStore } from "@/stores/teams";

export const useProjectsStore = defineStore("projects", () => {
  const projects_page = ref<ProjectBasic[]>([]); // 用于传递单页项目信息
  const project_detail = ref<ProjectDetail | null>(null); // 用于逐个请求项目
  const currentProject = ref<Project | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const teamsStore = useTeamsStore();

  // 根据当前团队和项目集筛选项目
  const filteredProjects = computed(() => {
    let filtered = projects_page.value;

    return filtered;
  });

  const activeProjects = computed(() =>
    filteredProjects.value.filter((_) => true)
  );

  const completedProjects = computed(() =>
    filteredProjects.value.filter((_) => true)
  );

  const fetchProjects = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await projectApi.getProjects();
      projects_page.value = response;
    } catch (err: any) {
      error.value = err.message || "获取项目列表失败";
    } finally {
      isLoading.value = false;
    }
  };

  const fetchProject = async (id: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const project = await projectApi.getProject(id);
      project_detail.value = project;
      return project;
    } catch (err: any) {
      error.value = err.message || "获取项目详情失败";
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const updateProjectProgress = async (
    projectId: string,
    progress: Partial<ProjectProgress>
  ) => {
    try {
      const updatedProject = await projectApi.updateProgress(
        projectId,
        progress
      );

      // Update local state
      const index = projects_page.value.findIndex(_ => true);
      // if (index !== -1) {
      //   projects_page.value[index] = updatedProject;
      // }

      // if (currentProject.value?.id === projectId) {
      //   currentProject.value = updatedProject;
      // }

      return updatedProject;
    } catch (err: any) {
      error.value = err.message || "更新项目进度失败";
      throw err;
    }
  };

  const createProject = async (projectData: Partial<Project>) => {
    isLoading.value = true;
    error.value = null;

    // try {
    //   // 添加当前团队和项目集信息
    //   const enrichedProjectData = {
    //     ...projectData,
    //     teamId: teamsStore.currentTeam?.id,
    //     projectSetId: teamsStore.currentProjectSet?.id,
    //   };

    //   const newProject = await projectApi.createProject(enrichedProjectData);
    //   projects_page.value.unshift(newProject);
    //   return newProject;
    // } catch (err: any) {
    //   error.value = err.message || "创建项目失败";
    //   throw err;
    // } finally {
    //   isLoading.value = false;
    // }
  };

  return {
    projects: computed(() => filteredProjects.value),
    allProjects: computed(() => projects_page.value),
    currentProject: computed(() => currentProject.value),
    projectDetail: computed(() => project_detail.value),
    activeProjects,
    completedProjects,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    fetchProjects,
    fetchProject,
    updateProjectProgress,
    createProject,
  };
});
