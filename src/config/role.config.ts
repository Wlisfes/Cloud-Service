// export interface NodeAction {
// 	primary: string
// 	name: string
// 	status: number
// }
// export interface Module extends NodeAction {
// 	action: Action[]
// }
// export interface RolesConfig extends NodeAction {
// 	auth: Module[]
// }

export type RoleEnum = 'admin' | 'super' | 'visitor'
export type RoleModuleEnum = 'module' | 'user' | 'role' | 'menu' | 'cloud' | 'source' | 'article' | 'minute'
export type RoleActionEnum = 'create' | 'update' | 'delete' | 'params' | 'list'

export const nodeAction = [
	{ primary: 'create', name: '新增', status: 1 },
	{ primary: 'update', name: '修改', status: 1 },
	{ primary: 'delete', name: '删除', status: 1 },
	{ primary: 'params', name: '查找', status: 1 },
	{ primary: 'list', name: '列表', status: 1 }
]

export const nodeModule = [
	{ primary: 'user', name: '用户管理', status: 1 },
	{ primary: 'role', name: '角色管理', status: 1 },
	{ primary: 'menu', name: '菜单管理', status: 1 },
	{ primary: 'cloud', name: '云点播管理', status: 1 },
	{ primary: 'source', name: '标签管理', status: 1 },
	{ primary: 'article', name: '文章管理', status: 1 },
	{ primary: 'minute', name: '收录管理', status: 1 }
]

export const nodeRole = { primary: 'admin', name: '超级管理员', status: 1 }
