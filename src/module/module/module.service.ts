import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { ModuleEntity } from '@/entity/module.entity'
import { ModuleActionEntity } from '@/entity/module.action.entity'
import * as DTO from './module.interface'

@Injectable()
export class ModuleService {
	constructor(
		@InjectRepository(ModuleEntity) private readonly moduleModel: Repository<ModuleEntity>,
		@InjectRepository(ModuleActionEntity) private readonly moduleActionModel: Repository<ModuleActionEntity>
	) {}

	/**创建模块-授权管理端**/
	public async nodeCreateModule(props: DTO.NodeCreateModuleParameter) {
		try {
			if (await this.moduleModel.findOne({ where: { primary: props.primary } })) {
				throw new HttpException(`${props.primary} 已存在`, HttpStatus.BAD_REQUEST)
			}

			let action = []
			if (props.action?.length > 0) {
				action = await this.moduleActionModel.find({ where: { id: In(props.action) } })
				props.action.forEach(id => {
					const element = action.find(element => element.id === id)
					if (!element) {
						throw new HttpException(`权限id ${id} 不存在`, HttpStatus.BAD_REQUEST)
					} else if (element?.status === 0) {
						throw new HttpException(`权限 ${element.name} 已禁用`, HttpStatus.BAD_REQUEST)
					}
				})
			}

			const newModule = await this.moduleModel.create({
				name: props.name,
				primary: props.primary,
				comment: props.comment || null,
				status: props.status || 0,
				action
			})
			await this.moduleModel.save(newModule)

			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**修改模块-授权管理端**/
	public async nodeUpdateModule(props: DTO.NodeUpdateModuleParameter) {
		try {
			const module = await this.moduleModel.findOne({ where: { id: props.id }, relations: ['action'] })
			if (!module) {
				throw new HttpException('模块不存在', HttpStatus.BAD_REQUEST)
			}

			if (props.action?.length > 0) {
				const action = await this.moduleActionModel.find({ where: { id: In(props.action) } })
				props.action.forEach(id => {
					const element = action.find(element => element.id === id)
					if (!element) {
						throw new HttpException(`权限id ${id} 不存在`, HttpStatus.BAD_REQUEST)
					}
				})
			}

			//删除已有的接口权限
			await this.moduleModel
				.createQueryBuilder()
				.relation('action')
				.of(module)
				.addAndRemove(
					props.action,
					module.action.map(k => k.id)
				)

			await this.moduleModel.update(
				{ id: props.id },
				{
					name: props.name,
					primary: props.primary,
					comment: props.comment || null,
					status: props.status || 0
				}
			)

			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**模块列表-授权管理端**/
	public async nodeModules() {
		try {
			const [list = [], total = 0] = await this.moduleModel.findAndCount({ relations: ['action'] })
			return { total, list }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**模块信息-授权管理端**/
	public async nodeModule(props: DTO.NodeModuleParameter) {
		try {
			const model = await this.moduleModel.findOne({ where: { id: props.id }, relations: ['action'] })
			if (!model) {
				throw new HttpException('模块不存在', HttpStatus.BAD_REQUEST)
			}
			return model
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**创建接口权限-授权管理端**/
	public async nodeCreateModuleAction(props: DTO.NodeCreateModuleActionParameter) {
		try {
			if (await this.moduleActionModel.findOne({ where: { primary: props.primary } })) {
				throw new HttpException(`${props.primary} 已存在`, HttpStatus.BAD_REQUEST)
			}

			const newModule = await this.moduleActionModel.create({
				name: props.name,
				primary: props.primary,
				comment: props.comment || null,
				status: props.status || 0
			})
			await this.moduleActionModel.save(newModule)

			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**修改接口权限-授权管理端**/
	public async nodeUpdateModuleAction(props: DTO.NodeUpdateModuleActionParameter) {
		try {
			const actionModel = await this.moduleActionModel.findOne({ where: { id: props.id } })
			if (!actionModel) {
				throw new HttpException('接口权限不存在', HttpStatus.BAD_REQUEST)
			}

			await this.moduleActionModel.update(
				{ id: props.id },
				{
					name: props.name,
					primary: props.primary,
					comment: props.comment || null,
					status: props.status || 0
				}
			)

			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**接口权限列表-授权管理端**/
	public async nodeModuleActions() {
		try {
			const [list = [], total = 0] = await this.moduleActionModel.findAndCount()
			return { total, list }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**接口权限信息-授权管理端**/
	public async nodeModuleAction(props: DTO.NodeModuleActionParameter) {
		try {
			const actionModel = await this.moduleActionModel.findOne({ where: { id: props.id } })
			if (!actionModel) {
				throw new HttpException('接口权限不存在', HttpStatus.BAD_REQUEST)
			}
			return actionModel
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
