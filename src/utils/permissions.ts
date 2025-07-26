import type { RolePermissions, User, ProjectDetail } from '@/types'

// 获取角色权限
export const getRolePermissions = (roles: ProjectDetailRole[]): RolePermissions => {
  return {
    canTranslate: roles.includes('translator'),
    canProofread: roles.includes('proofreader'),
    canViewTranslations: roles.length > 0, // 任何角色都可以查看翻译
    canSetTypesettingStatus: roles.includes('typesetter'),
    canSetReviewStatus: roles.includes('reviewer'),
    canExportFiles: roles.includes('typesetter') || roles.includes('image_source') || roles.includes('artist'), // 嵌字、图源、美工可以导出文件
    canManageMembers: false, // 只有项目负责人可以管理成员
    canEditProjectDetail: false // 只有项目负责人可以编辑项目
  }
}

// 检查用户是否为项目创建者
export const isProjectDetailOwner = (user: User, ProjectDetail: ProjectDetail): boolean => {
  return user.id === ProjectDetail.ownerId
}

// 检查用户是否为项目负责人
export const isProjectDetailManager = (user: User, ProjectDetail: ProjectDetail): boolean => {
  return user.id === (ProjectDetail.managerId || ProjectDetail.ownerId)
}

// 检查用户是否为项目成员
export const isProjectDetailMember = (user: User, ProjectDetail: ProjectDetail): boolean => {
  return ProjectDetail.members.some(member => member.userId === user.id && member.status === 'active')
}

// 获取用户在项目中的角色
export const getUserProjectDetailRoles = (user: User, ProjectDetail: ProjectDetail): ProjectDetailRole[] => {
  const member = ProjectDetail.members.find(member => member.userId === user.id && member.status === 'active')
  return member?.roles || []
}

// 获取用户在项目中的权限
export const getUserProjectDetailPermissions = (user: User, ProjectDetail: ProjectDetail): RolePermissions => {
  if (isProjectDetailManager(user, ProjectDetail)) {
    // 项目负责人拥有所有权限
    return {
      canTranslate: true,
      canProofread: true,
      canViewTranslations: true,
      canSetTypesettingStatus: true,
      canSetReviewStatus: true,
      canExportFiles: true,
      canManageMembers: true,
      canEditProjectDetail: true
    }
  }
  
  const roles = getUserProjectDetailRoles(user, ProjectDetail)
  return getRolePermissions(roles)
}

// 角色显示名称映射
export const roleDisplayNames: Record<ProjectDetailRole, string> = {
  image_source: '图源',
  artist: '美工',
  translator: '翻译',
  proofreader: '校对',
  typesetter: '嵌字',
  reviewer: '审核'
}

// 获取角色显示名称
export const getRoleDisplayName = (role: ProjectDetailRole): string => {
  return roleDisplayNames[role] || role
}

// 获取角色颜色
export const getRoleColor = (role: ProjectDetailRole): string => {
  const colors = {
    image_source: '#ef4444', // 红色
    artist: '#f97316', // 橙色
    translator: '#3b82f6', // 蓝色
    proofreader: '#10b981', // 绿色
    typesetter: '#f59e0b', // 黄色
    reviewer: '#8b5cf6' // 紫色
  }
  return colors[role] || '#6b7280'
}

// 验证角色组合是否合理
export const validateRoleCombination = (roles: ProjectDetailRole[]): { valid: boolean; message?: string } => {
  if (roles.length === 0) {
    return { valid: false, message: '至少需要选择一个角色' }
  }
  
  // 可以添加更多的角色组合验证逻辑
  // 例如：某些角色不能同时拥有等
  
  return { valid: true }
}