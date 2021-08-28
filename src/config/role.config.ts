export interface Action {
	primary: string
	name: string
	status: number
	type: number
}
export interface Auth extends Action {
	action: Action[]
}
export interface RolesConfig extends Action {
	auth: Auth[]
}

export type RoleEnum = 'admin' | 'super' | 'visitor'
export type RoleModuleEnum = 'user' | 'role' | 'menu' | 'cloud' | 'source' | 'article' | 'minute'
export type RoleActionEnum = 'create' | 'update' | 'delete' | 'params'

const action = {
	admin: [
		{ primary: 'create', name: '新增', status: 1, type: 3 },
		{ primary: 'update', name: '修改', status: 1, type: 3 },
		{ primary: 'delete', name: '删除', status: 1, type: 3 },
		{ primary: 'params', name: '查找', status: 1, type: 3 }
	],
	user: [
		{ primary: 'create', name: '新增', status: 1, type: 3 },
		{ primary: 'update', name: '修改', status: 1, type: 3 },
		{ primary: 'delete', name: '删除', status: 1, type: 3 },
		{ primary: 'params', name: '查找', status: 1, type: 3 }
	],
	visitor: [
		{ primary: 'create', name: '新增', status: 0, type: 3 },
		{ primary: 'update', name: '修改', status: 0, type: 3 },
		{ primary: 'delete', name: '删除', status: 0, type: 3 },
		{ primary: 'params', name: '查找', status: 1, type: 3 }
	]
}

const auth = {
	admin: [
		{ primary: 'user', name: '用户管理', status: 1, type: 2, action: action.admin },
		{ primary: 'role', name: '角色管理', status: 1, type: 2, action: action.admin },
		{ primary: 'menu', name: '菜单管理', status: 1, type: 2, action: action.admin },
		{ primary: 'cloud', name: '云点播管理', status: 1, type: 2, action: action.admin },
		{ primary: 'source', name: '标签管理', status: 1, type: 2, action: action.admin },
		{ primary: 'article', name: '文章管理', status: 1, type: 2, action: action.admin },
		{ primary: 'minute', name: '收录管理', status: 1, type: 2, action: action.admin }
	],
	super: [
		{ primary: 'user', name: '用户管理', status: 1, type: 2, action: action.user },
		{ primary: 'role', name: '角色管理', status: 1, type: 2, action: action.user },
		{ primary: 'menu', name: '菜单管理', status: 1, type: 2, action: action.user },
		{ primary: 'cloud', name: '云点播管理', status: 1, type: 2, action: action.user },
		{ primary: 'source', name: '标签管理', status: 1, type: 2, action: action.user },
		{ primary: 'article', name: '文章管理', status: 1, type: 2, action: action.user },
		{ primary: 'minute', name: '收录管理', status: 1, type: 2, action: action.user }
	],
	visitor: [
		{ primary: 'user', name: '用户管理', status: 1, type: 2, action: action.visitor },
		{ primary: 'role', name: '角色管理', status: 1, type: 2, action: action.visitor },
		{ primary: 'menu', name: '菜单管理', status: 1, type: 2, action: action.visitor },
		{ primary: 'cloud', name: '云点播管理', status: 1, type: 2, action: action.visitor },
		{ primary: 'source', name: '标签管理', status: 1, type: 2, action: action.visitor },
		{ primary: 'article', name: '文章管理', status: 1, type: 2, action: action.visitor },
		{ primary: 'minute', name: '收录管理', status: 1, type: 2, action: action.visitor }
	]
}

export const roles: RolesConfig[] = [
	{ primary: 'admin', name: '超级管理员', status: 1, type: 1, auth: auth.admin },
	{ primary: 'super', name: '管理员', status: 1, type: 1, auth: auth.super },
	{ primary: 'visitor', name: '游客', status: 1, type: 1, auth: auth.visitor }
]
