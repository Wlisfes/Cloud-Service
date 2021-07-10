import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'
import { RoleEntity } from '@/entity/role.entity'

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
interface Role {
	primary: string
	name: string
	status: number
	auth: Auth[]
}
const roles: Role[] = [
	{
		primary: 'admin',
		name: '超级管理员',
		status: 1,
		auth: [
			{ primary: 'user', name: '用户管理', status: 1, action: action.admin },
			{ primary: 'role', name: '角色管理', status: 1, action: action.admin },
			{ primary: 'menu', name: '菜单管理', status: 1, action: action.admin },
			{ primary: 'cloud', name: '云点播管理', status: 1, action: action.admin }
		]
	},
	{
		primary: 'super',
		name: '管理员',
		status: 1,
		auth: [
			{ primary: 'user', name: '用户管理', status: 1, action: action.user },
			{ primary: 'role', name: '角色管理', status: 1, action: action.user },
			{ primary: 'menu', name: '菜单管理', status: 1, action: action.user },
			{ primary: 'cloud', name: '云点播管理', status: 1, action: action.user }
		]
	},
	{
		primary: 'visitor',
		name: '游客',
		status: 1,
		auth: [
			{ primary: 'user', name: '用户管理', status: 1, action: action.visitor },
			{ primary: 'role', name: '角色管理', status: 1, action: action.visitor },
			{ primary: 'menu', name: '菜单管理', status: 1, action: action.visitor },
			{ primary: 'cloud', name: '云点播管理', status: 1, action: action.visitor }
		]
	}
]

@Injectable()
export class InitService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(RoleEntity) private readonly roleModel: Repository<RoleEntity>
	) {
		this.init()
	}

	private async init() {
		try {
			await this.initRole()
			setTimeout(async () => {
				await this.initAdminUser()
			}, 1500)
		} catch (e) {
			console.log(e)
		}
	}

	/**初始化角色**/
	private async initRole() {
		try {
			roles.map(async props => {
				const role = await this.roleModel.findOne({ where: { primary: props.primary } })
				if (!role) {
					const newRole = await this.roleModel.create({
						primary: props.primary,
						name: props.name,
						status: props.status
					})
					const roleParent = await this.roleModel.save(newRole)
					await this.initAuth(roleParent, props.auth)
				}
			})
			return console.log('角色初始化完毕')
		} catch (e) {
			console.log(e)
		}
	}

	/**初始化权限**/
	private async initAuth(parent: RoleEntity, auth: Auth[]) {
		try {
			auth.forEach(async props => {
				const newAuth = await this.roleModel.create({
					primary: props.primary,
					name: props.name,
					status: props.status,
					parent
				})
				const roleParent = await this.roleModel.save(newAuth)
				await this.initAction(roleParent, props.action)
			})
			return true
		} catch (e) {
			console.log(e)
		}
	}

	/**初始化接口权限**/
	private async initAction(parent: RoleEntity, action: Action[]) {
		try {
			action.forEach(async props => {
				const newAction = await this.roleModel.create({
					primary: props.primary,
					name: props.name,
					status: props.status,
					parent
				})
				await this.roleModel.save(newAction)
			})
			return true
		} catch (e) {
			console.log(e)
		}
	}

	/**初始化管理员**/
	private async initAdminUser() {
		try {
			const user = await this.userModel.findOne({ where: { account: 88888888 } })
			if (!user) {
				const newUser = await this.userModel.create({
					account: 88888888,
					nickname: '妖雨纯',
					password: '88888888'
				})
				await this.userModel.save(newUser)
				return console.log('管理员初始化成功  账户:88888888  password:88888888')
			}
		} catch (e) {
			console.log(e)
		}
	}
}
