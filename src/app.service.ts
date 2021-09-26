import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, IsNull } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'
import { RoleEntity } from '@/entity/role.entity'
import { ModuleEntity } from '@/entity/module.entity'
import { ModuleActionEntity } from '@/entity/module.action.entity'
import { nodeRole, nodeModule, nodeAction } from '@/config/role.config'
import * as _ from 'lodash'

@Injectable()
export class AppService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(RoleEntity) private readonly roleModel: Repository<RoleEntity>,
		@InjectRepository(ModuleEntity) private readonly moduleModel: Repository<ModuleEntity>,
		@InjectRepository(ModuleActionEntity) private readonly actionModel: Repository<ModuleActionEntity>
	) {}

	onApplicationBootstrap() {
		// this.init()
	}

	private init() {
		this.initAction().finally(() => {
			this.initModule().finally(() => {
				this.inirRole().then(async next => {
					await this.initUser()
					console.log(next)
				})
			})
		})
	}

	/**初始化用户**/
	private initUser() {
		return new Promise(async resolve => {
			if (!(await this.userModel.findOne({ where: { account: 88888888 } }))) {
				const role = await this.roleModel.find()
				const newUser = await this.userModel.create({
					account: 88888888,
					nickname: '妖雨纯',
					password: '123456',
					role
				})
				await this.userModel.save(newUser)
				resolve(true)
			} else {
				resolve(true)
			}
		})
	}

	/**初始化role角色**/
	private inirRole() {
		return new Promise(async resove => {
			const params = await this.roleModel.findOne({ where: { primary: nodeRole.primary } })
			if (!params) {
				const action = nodeModule.reduce((next, k) => {
					return next.concat(nodeAction.map(v => `${k.primary}:${v.primary}`))
				}, [])
				const node = await this.roleModel.create({
					primary: nodeRole.primary,
					name: nodeRole.name,
					status: nodeRole.status,
					comment: '超级管理员、适用于所有权限',
					action
				})
				await this.roleModel.save(node)
			}
			resove('初始化role角色完毕')
		})
	}

	/**初始化action权限**/
	private initAction() {
		return new Promise(async resolve => {
			for (const props of nodeAction) {
				const params = await this.actionModel.findOne({ where: { primary: props.primary } })
				if (!params) {
					const node = await this.actionModel.create({
						primary: props.primary,
						name: props.name,
						status: props.status,
						comment: null
					})
					await this.moduleModel.save(node)
				}
			}
			resolve('初始化action权限完毕')
		})
	}

	/**初始化module模块**/
	private initModule() {
		return new Promise(async resolve => {
			for (const props of nodeModule) {
				const params = await this.moduleModel.findOne({ where: { primary: props.primary } })
				if (!params) {
					const action = await this.actionModel.find()
					const node = await this.moduleModel.create({
						primary: props.primary,
						name: props.name,
						status: props.status,
						comment: null,
						action
					})
					await this.moduleModel.save(node)
				}
			}
			resolve('初始化module模块完毕')
		})
	}
}
