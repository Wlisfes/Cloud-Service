interface Action {
	primary: string
	name: string
	status: number
}
interface Auth {
	primary: string
	name: string
	status: number
	action: Action[]
}
export interface RolesConfig {
	primary: string
	name: string
	status: number
	auth: Auth[]
}

const action = {
	admin: [
		{ primary: 'create', name: '新增', status: 1 },
		{ primary: 'update', name: '修改', status: 1 },
		{ primary: 'delete', name: '删除', status: 1 },
		{ primary: 'params', name: '查找', status: 1 }
	],
	user: [
		{ primary: 'create', name: '新增', status: 1 },
		{ primary: 'update', name: '修改', status: 1 },
		{ primary: 'delete', name: '删除', status: 1 },
		{ primary: 'params', name: '查找', status: 1 }
	],
	visitor: [
		{ primary: 'create', name: '新增', status: 0 },
		{ primary: 'update', name: '修改', status: 0 },
		{ primary: 'delete', name: '删除', status: 0 },
		{ primary: 'params', name: '查找', status: 1 }
	]
}

const auth = {
	admin: [
		{ primary: 'user', name: '用户管理', status: 1, action: action.admin },
		{ primary: 'role', name: '角色管理', status: 1, action: action.admin },
		{ primary: 'menu', name: '菜单管理', status: 1, action: action.admin },
		{ primary: 'cloud', name: '云点播管理', status: 1, action: action.admin }
	],
	super: [
		{ primary: 'user', name: '用户管理', status: 1, action: action.user },
		{ primary: 'role', name: '角色管理', status: 1, action: action.user },
		{ primary: 'menu', name: '菜单管理', status: 1, action: action.user },
		{ primary: 'cloud', name: '云点播管理', status: 1, action: action.user }
	],
	visitor: [
		{ primary: 'user', name: '用户管理', status: 1, action: action.visitor },
		{ primary: 'role', name: '角色管理', status: 1, action: action.visitor },
		{ primary: 'menu', name: '菜单管理', status: 1, action: action.visitor },
		{ primary: 'cloud', name: '云点播管理', status: 1, action: action.visitor }
	]
}

export const roles: RolesConfig[] = [
	{ primary: 'admin', name: '超级管理员', status: 1, auth: auth.admin },
	{ primary: 'super', name: '管理员', status: 1, auth: auth.super },
	{ primary: 'visitor', name: '游客', status: 1, auth: auth.visitor }
]
