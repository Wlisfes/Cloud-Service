import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'
import { RoleEntity } from '@/entity/role.entity'
import { roles, RolesConfig } from '@/config/role.config'

@Injectable()
export class AppService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(RoleEntity) private readonly roleModel: Repository<RoleEntity>
	) {}

	onApplicationBootstrap() {
		this.init()
	}

	private async init() {
		try {
			await this.initRole(roles)
			console.log('角色初始化完毕')
			await this.initAdminUser(roles.find(k => k.primary === 'admin'))
			console.log('管理员初始化成功  账户:88888888  password:88888888')
		} catch (e) {
			console.log(e)
		}
	}

	/**初始化角色**/
	private async initRole(roles: RolesConfig[]) {
		try {
			roles.map(async props => {
				const role = await this.roleModel.findOne({ where: { primary: props.primary } })
				if (!role) {
					const newRole = await this.roleModel.create({
						primary: props.primary,
						name: props.name,
						status: props.status,
						type: props.type
					})
					const roleParent = await this.roleModel.save(newRole)
					props.auth.forEach(async auth => {
						const newAuth = await this.roleModel.create({
							primary: auth.primary,
							name: auth.name,
							status: auth.status,
							type: auth.type,
							parent: roleParent
						})
						const authParent = await this.roleModel.save(newAuth)
						auth.action.forEach(async action => {
							const newAction = await this.roleModel.create({
								primary: action.primary,
								name: action.name,
								status: action.status,
								type: action.type,
								parent: authParent
							})
							await this.roleModel.save(newAction)
						})
					})
				}
			})
			return true
		} catch (e) {
			console.log(e)
		}
	}

	/**初始化管理员**/
	private async initAdminUser(props: RolesConfig) {
		try {
			if (!(await this.userModel.findOne({ where: { account: 88888888 } }))) {
				const newUser = await this.userModel.create({
					account: 88888888,
					nickname: '妖雨纯',
					password: '88888888'
				})
				await this.userModel.save(newUser)
			}

			const user = await this.userModel.findOne({ where: { account: 88888888 } })
			const role = await this.roleModel.findOne({ where: { primary: props.primary, user } })
			if (!role) {
				const newRole = await this.roleModel.create({
					primary: props.primary,
					name: props.name,
					status: props.status,
					type: props.type,
					user
				})
				const roleParent = await this.roleModel.save(newRole)
				props.auth.forEach(async auth => {
					const newAuth = await this.roleModel.create({
						primary: auth.primary,
						name: auth.name,
						status: auth.status,
						type: auth.type,
						parent: roleParent,
						user
					})
					const authParent = await this.roleModel.save(newAuth)
					auth.action.forEach(async action => {
						const newAction = await this.roleModel.create({
							primary: action.primary,
							name: action.name,
							status: action.status,
							type: action.type,
							parent: authParent,
							user
						})
						await this.roleModel.save(newAction)
					})
				})
			}

			return true
		} catch (e) {
			console.log(e)
		}
	}
}
