import { http, mockApi } from "./http";
import type {
  Project,
  ProjectBasic,
  ProjectDetail,
  ProjectFile,
  ProjectProgress,
} from "@/types";

export const projectApi = {
  getProjects: async (): Promise<ProjectBasic[]> => {
    // Use mock API for development
    return mockApi.getProjects();

    // Uncomment below for real API
    // const response = await http.get('/v1/user/projects')
    // return response.data
  },

  getProject: async (id: number): Promise<ProjectDetail> => {
    // Mock implementation
    const projects = await mockApi.getProjects();
    const project = projects.find((p) => p.id === id);
    if (!project) throw new Error("项目不存在");
    return project;

    // Uncomment below for real API
    // return await http.get(`/v1/projects/${id}`)
  },

  createProject: async (projectData: Partial<Project>): Promise<Project> => {
    // Mock implementation
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectData.name || "",
      description: projectData.description,
      sourceLanguage: projectData.sourceLanguage || "ja",
      targetLanguages: projectData.targetLanguages || ["zh-CN"],
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: {
        translation: 0,
        proofreading: 0,
        typesetting: "not_started",
        review: "not_reviewed",
        totalSources: 0,
        completedSources: 0,
      },
      files: [],
    };
    return newProject;

    // Uncomment below for real API
    // return await http.post('/v1/teams/1/projects', projectData)
  },

  updateProgress: async (
    projectId: string,
    progress: Partial<ProjectProgress>
  ): Promise<Project> => {
    // Mock implementation
    const projects = await mockApi.getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) throw new Error("项目不存在");

    project.progress = { ...project.progress, ...progress };
    project.updatedAt = new Date().toISOString();
    return project;

    // This would be a custom endpoint for progress tracking
    // return await http.put(`/v1/projects/${projectId}/progress`, progress)
  },

  getFiles: async (projectId: number): Promise<ProjectFile[]> => {
    // 按页获取指定项目的缩略图
    return mockApi.getFiles(projectId);

    // return http.get(`/v1/projects/${projectId}/files`);
  },

  getSource: async (projectId: number) => {
    // 获取指定项目的指定完整图

    // return http.get(`/v1/projects/${projectId}/files`);
  },

  uploadFile: async (projectId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return http.post(`/v1/projects/${projectId}/files`, formData);
  },
};
