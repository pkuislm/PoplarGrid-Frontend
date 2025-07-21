export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  signature?: string
  isAdmin?: boolean
  createdAt?: string
}

export interface Project {
  id: number
  name: string
  description?: string
  sourceLanguage: string
  targetLanguages: string[]
  createdAt: string
  updatedAt: string
  completedAt?: string // 新增完成时间字段
  status: 'active' | 'completed' | 'paused'
  progress: ProjectProgress
  team?: Team
  teamId: string // 所属团队ID
  projectSetId?: string // 所属项目集ID
  files: ProjectFile[]
  coverImage?: string // 新增封面图片字段
  ownerId: string // 项目创建者ID
  managerId?: string // 项目负责人ID（可以与创建者不同）
  members: ProjectMember[] // 项目成员列表
}

export interface ProjectProgress {
  translation: number // 0-100
  proofreading: number // 0-100
  typesetting: 'not_started' | 'in_progress' | 'completed'
  review: 'not_reviewed' | 'reviewing' | 'reviewed'
  totalSources: number
  completedSources: number
}

export interface ProjectFile {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: string
  sources: Source[]
  imageUrl?: string // 新增图片URL字段
}

export interface Source {
  id: string
  content: string
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  translations: Translation[]
}

export interface Translation {
  id: string
  content: string
  language: string
  translator: User
  proofreader?: User
  status: 'draft' | 'translated' | 'proofread'
  createdAt: string
  updatedAt: string
}

export interface Team {
  id: string
  name: string
  description?: string
  avatar?: string
  members: TeamMember[]
  projects: Project[]
  projectSets: ProjectSet[]
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  userId: string
  user: User
  teamId: string
  role: 'admin' | 'member'
  joinedAt: string
  status: 'active' | 'pending' | 'left'
}

// 新增项目集接口
export interface ProjectSet {
  id: string
  name: string
  description?: string
  teamId: string
  projects: Project[]
  createdAt: string
  updatedAt: string
}

// 项目成员接口
export interface ProjectMember {
  id: string
  userId: string
  user: User
  projectId: string
  roles: ProjectRole[]
  joinedAt: string
  invitedBy?: string // 邀请人ID
  status: 'active' | 'pending' | 'rejected' // 成员状态
}

// 项目角色枚举 - 添加图源和美工角色
export type ProjectRole = 'image_source' | 'artist' | 'translator' | 'proofreader' | 'typesetter' | 'reviewer'

// 项目申请接口
export interface ProjectApplication {
  id: string
  projectId: string
  userId: string
  user: User
  requestedRoles: ProjectRole[]
  message?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  reviewedAt?: string
  reviewedBy?: string
}

// 项目邀请接口
export interface ProjectInvitation {
  id: string
  projectId: string
  inviterId: string
  inviterName?: string // 添加邀请人姓名字段
  invitedUserId: string
  invitedUser: User
  assignedRoles: ProjectRole[]
  message?: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
  respondedAt?: string
}

// 角色权限定义
export interface RolePermissions {
  canTranslate: boolean
  canProofread: boolean
  canViewTranslations: boolean
  canSetTypesettingStatus: boolean
  canSetReviewStatus: boolean
  canExportFiles: boolean
  canManageMembers: boolean
  canEditProject: boolean
}

export interface ApiConfig {
  baseUrl: string
  apiKey?: string
}

export interface LoginRequest {
  name: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
  teams: Team[] // 用户所属的团队列表
}

export interface Statistics {
  projects: {
    total: number
    active: number
    completed: number
  }
  users: {
    total: number
    active: number
  }
  translations: {
    total: number
    completed: number
    inProgress: number
  }
}

// 更新时间统计接口
export interface TimeBasedStatistics {
  yesterday: {
    completed: number
    comparison: number // 与前天的对比
  }
  lastWeek: {
    completed: number
    comparison: number // 与上上周的对比
  }
  lastMonth: {
    completed: number
    comparison: number // 与上上个月的对比
  }
  trends: {
    daily: Array<{
      date: string
      completed: number
    }>
    weekly: Array<{
      week: string
      completed: number
    }>
    monthly: Array<{
      month: string
      completed: number
    }>
  }
}

// 团队统计接口
export interface TeamStatistics {
  teamId: string
  teamName: string
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalMembers: number
  completionRate: number
  recentActivity: {
    date: string
    completed: number
  }[]
}

// 新增：项目同步相关接口
export interface SyncedProject {
  id: string
  serialNumber: number // 项目序号
  name: string
  originalName: string // 原始项目名（包含序号格式）
  type?: string // 项目类型标签
  imageSource?: string // 图源
  artist?: string // 美工
  translator?: string // 翻译
  proofreader?: string // 校对
  typesetter?: string // 嵌字
  reviewer?: string // 审核
  publishStatus: number // 发布状态
  workStatus: number,
  lastUpdated: string // 上次更新日期
  notes?: string // 备注
  coverImage: string
  members: SyncedProjectMember[] // 项目成员
  externalProjectId?: string // 外部平台项目ID
  createdAt: string
  updatedAt: string
}

export interface SyncedProjectMember {
  userId: string
  userName: string
  role: 'image_source' | 'artist' | 'translator' | 'proofreader' | 'typesetter' | 'reviewer'
  assignedAt: string
}

export interface ProjectTag {
  id: string
  name: string
  color: string
  description?: string
  createdAt: string
}

export interface SyncResult {
  success: boolean
  syncedCount: number
  newCount: number
  updatedCount: number
  errors: string[]
  lastSyncTime: string
}