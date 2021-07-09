import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'
import { RoleEntity } from '@/entity/role.entity'
import { AuthEntity } from '@/entity/auth.entity'
import { ActionEntity } from '@/entity/action.entity'

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
		primary: 'user',
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
		@InjectRepository(RoleEntity) private readonly roleModel: Repository<RoleEntity>,
		@InjectRepository(AuthEntity) private readonly authModel: Repository<AuthEntity>,
		@InjectRepository(ActionEntity) private readonly actionModel: Repository<ActionEntity>
	) {
		this.init()
	}

	private async init() {
		try {
			await this.initRole()
			await this.initAdminUser()
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
					const { id } = await this.roleModel.save(newRole)
					await this.initAuth(id, props.auth)
				}
			})
			return console.log('角色初始化完毕')
		} catch (e) {
			console.log(e)
		}
	}

	/**初始化权限**/
	private async initAuth(roleId: number, auth: Auth[]) {
		try {
			const role = await this.roleModel.findOne({ where: { id: roleId } })
			auth.map(async props => {
				const newAuth = await this.authModel.create({
					primary: props.primary,
					name: props.name,
					status: props.status,
					role
				})
				const { id } = await this.authModel.save(newAuth)
				await this.initAction(id, props.action)
			})
			return role
		} catch (e) {
			console.log(e)
		}
	}

	/**初始化接口权限**/
	private async initAction(authId: number, action: Action[]) {
		try {
			const auth = await this.authModel.findOne({ where: { id: authId } })
			action.map(async props => {
				const newAction = await this.actionModel.create({
					primary: props.primary,
					name: props.name,
					status: props.status,
					auth
				})
				await this.actionModel.save(newAction)
			})
			return auth
		} catch (e) {
			console.log(e)
		}
	}

	/**初始化管理员**/
	private async initAdminUser() {
		try {
			// const role = await this.roleModel.findOne({
			// 	where: { primary: 'admin' },
			// 	relations: ['auth', 'auth.action']
			// })

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
