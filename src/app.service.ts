import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, IsNull } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'
import { RoleEntity } from '@/entity/role.entity'
import { roles as R, RolesConfig, Auth, Action } from '@/config/role.config'
import * as _ from 'lodash'

@Injectable()
export class AppService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(RoleEntity) private readonly roleModel: Repository<RoleEntity>
	) {}

	onApplicationBootstrap() {
		// this.init()
	}

	// 	private async init() {
	// 		try {
	// 			await this.initRole(_.cloneDeep(R))
	// 			console.log('角色初始化完毕')
	// 			await this.initAdminUser(_.cloneDeep(R.filter(k => k.primary === 'admin')))
	// 			console.log('管理员初始化成功  账户:88888888  password:88888888')
	// 		} catch (e) {
	// 			console.log(e)
	// 		}
	// 	}

	// 	/**初始化角色**/
	// 	private initRole(roles: RolesConfig[], uid?: number) {
	// 		return new Promise(async resolve => {
	// 			try {
	// 				if (roles.length > 0) {
	// 					let user = null
	// 					const props = roles.shift()

	// 					if (uid) {
	// 						user = await this.userModel.findOne({ where: { uid } })
	// 					}
	// 					if (
	// 						!(await this.roleModel.findOne({
	// 							where: { primary: props.primary, user: user ? user : IsNull() }
	// 						}))
	// 					) {
	// 						const newRole = await this.roleModel.create({
	// 							primary: props.primary,
	// 							name: props.name,
	// 							status: props.status,
	// 							type: props.type,
	// 							user: user ? user : IsNull()
	// 						})
	// 						await this.roleModel.save(newRole)
	// 					}

	// 					const role = await this.roleModel.findOne({
	// 						where: { primary: props.primary, user: user ? user : IsNull() }
	// 					})
	// 					await this.initAuth(role.id, _.cloneDeep(props.auth), uid)
	// 					await this.initRole(roles, uid)

	// 					resolve(true)
	// 				} else {
	// 					resolve(true)
	// 				}
	// 			} catch (e) {
	// 				console.log('initRole', e)
	// 			}
	// 		})
	// 	}

	// 	/**初始化权限模块**/
	// 	private initAuth(parentId: number, auths: Auth[], uid?: number) {
	// 		return new Promise(async resolve => {
	// 			try {
	// 				if (auths.length > 0) {
	// 					let user = null
	// 					const props = auths.shift()
	// 					if (uid) {
	// 						user = await this.userModel.findOne({ where: { uid } })
	// 					}

	// 					const parent = await this.roleModel.findOne({ where: { id: parentId } })
	// 					if (!(await this.roleModel.findOne({ where: { primary: props.primary, parent } }))) {
	// 						const newAuth = await this.roleModel.create({
	// 							primary: props.primary,
	// 							name: props.name,
	// 							status: props.status,
	// 							type: props.type,
	// 							parent,
	// 							user
	// 						})
	// 						await this.roleModel.save(newAuth)
	// 					}
	// 					const auth = await this.roleModel.findOne({ where: { primary: props.primary, parent } })
	// 					await this.initAction(auth.id, _.cloneDeep(props.action), uid)
	// 					await this.initAuth(parentId, auths, uid)

	// 					resolve(true)
	// 				} else {
	// 					resolve(true)
	// 				}
	// 			} catch (e) {
	// 				console.log('initAuth', e)
	// 			}
	// 		})
	// 	}

	// 	/**初始化权限**/
	// 	private initAction(parentId: number, actions: Action[], uid?: number) {
	// 		return new Promise(async resolve => {
	// 			try {
	// 				if (actions.length > 0) {
	// 					let user = null
	// 					const props = actions.shift()

	// 					if (uid) {
	// 						user = await this.userModel.findOne({ where: { uid } })
	// 					}
	// 					const parent = await this.roleModel.findOne({ where: { id: parentId } })
	// 					if (!(await this.roleModel.findOne({ where: { primary: props.primary, parent } }))) {
	// 						const newAction = await this.roleModel.create({
	// 							primary: props.primary,
	// 							name: props.name,
	// 							status: props.status,
	// 							type: props.type,
	// 							parent,
	// 							user
	// 						})
	// 						await this.roleModel.save(newAction)
	// 					}
	// 					await this.initAction(parentId, actions, uid)

	// 					resolve(true)
	// 				} else {
	// 					resolve(true)
	// 				}
	// 			} catch (e) {
	// 				console.log('initAction', e)
	// 			}
	// 		})
	// 	}

	// 	/**初始化管理员**/
	// 	private initAdminUser(props: RolesConfig[]) {
	// 		return new Promise(async resolve => {
	// 			if (!(await this.userModel.findOne({ where: { account: 88888888 } }))) {
	// 				const newUser = await this.userModel.create({
	// 					account: 88888888,
	// 					nickname: '妖雨纯',
	// 					password: '88888888'
	// 				})
	// 				await this.userModel.save(newUser)
	// 			}

	// 			const user = await this.userModel.findOne({ where: { account: 88888888 } })
	// 			await this.initRole(props, user.uid)

	// 			resolve(true)
	// 		})
	// 	}
}
