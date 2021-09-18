import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In, Brackets } from 'typeorm'
import { isEmpty } from 'class-validator'
import { UtilsService } from '@/module/utils/utils.service'
import { UserEntity } from '@/entity/user.entity'
import { MenuEntity } from '@/entity/menu.entity'
import { RoleEntity } from '@/entity/role.entity'
import * as DTO from './menu.interface'

@Injectable()
export class MenuService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(MenuEntity) private readonly menuModel: Repository<MenuEntity>,
		@InjectRepository(RoleEntity) private readonly roleModel: Repository<RoleEntity>,
		private readonly utilsService: UtilsService
	) {}

	/**创建菜单**/
	public async nodeCreateMenu(props: DTO.NodeCreateMenuParameter) {
		try {
			let parent = null
			if (props.parent) {
				parent = await this.menuModel.findOne({ where: { id: props.parent } })
				if (!parent) {
					throw new HttpException('上级节点不存在', HttpStatus.BAD_REQUEST)
				} else if (parent.status !== 1) {
					throw new HttpException('上级节点已禁用', HttpStatus.BAD_REQUEST)
				}
			}

			let role = []
			if (props.role?.length > 0) {
				role = await this.roleModel.find({ where: { id: In(props.role) } })
				props.role.forEach(id => {
					const element = role.find(element => element.id === id)
					if (!element) {
						throw new HttpException(`角色id ${id} 不存在`, HttpStatus.BAD_REQUEST)
					} else if (element?.status === 0) {
						throw new HttpException(`角色 ${element.name} 已禁用`, HttpStatus.BAD_REQUEST)
					} else if (element?.status === 2) {
						throw new HttpException(`角色 ${element.name} 已删除`, HttpStatus.BAD_REQUEST)
					}
				})
			}

			const newMenu = await this.menuModel.create({
				type: props.type,
				name: props.name,
				router: props.router || null,
				path: props.path || null,
				keepAlive: props.keepAlive || 0,
				visible: props.visible || 1,
				icon: props.icon || null,
				order: props.order || 0,
				parent
				// role
			})
			await this.menuModel.save(newMenu)

			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
		}
	}

	/**获取节点目录**/
	public async nodeMenuConter() {
		try {
			const node = await this.menuModel.find({
				where: { type: 1 },
				order: {
					order: 'DESC',
					createTime: 'DESC'
				},
				relations: ['parent']
			})
			return this.utilsService.listToTree(node.map(k => ({ ...k, parent: k.parent?.id || null })))
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**动态路由节点**/
	public async nodeRouter(uid: number) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			return await this.menuModel
				.createQueryBuilder('menu')
				// .leftJoinAndSelect('menu.role', 'role')
				.where(
					new Brackets(Q => {
						Q.andWhere('menu.type = :type', { type: 2 })
						Q.andWhere('menu.status = :status', { status: 1 })
						// Q.andWhere('role.primary = :primary', { primary: user.primary })
					})
				)
				.getMany()
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**角色菜单**/
	public async nodeRoleMenus(uid: number) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			const menu = await this.menuModel
				.createQueryBuilder('menu')
				.leftJoinAndSelect('menu.parent', 'parent')
				// .leftJoinAndSelect('menu.role', 'role')
				.where(
					new Brackets(Q => {
						Q.andWhere('menu.status = :status', { status: 1 })
						// Q.andWhere('role.primary = :primary', { primary: user.primary })
					})
				)
				.addOrderBy('menu.order', 'DESC')
				.addOrderBy('menu.createTime', 'DESC')
				.getMany()
			const node = menu.map(k => ({ ...k, parent: k.parent?.id || null }))
			return this.utilsService.listToTree(node)
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**菜单列表**/
	public async nodeMenus() {
		try {
			const menu = await this.menuModel.find({
				where: [{ status: 0 }, { status: 1 }],
				relations: ['parent'],
				order: {
					order: 'DESC',
					createTime: 'DESC'
				}
			})
			const node = menu.map(k => ({
				...k,
				disabled: !!k.status,
				parent: k.parent?.id || null
			}))
			return this.utilsService.listToTree(node)
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**菜单信息**/
	public async nodeMenu(id: number) {
		try {
			return await this.menuModel.findOne({
				where: { id },
				relations: ['parent', 'role']
			})
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**修改菜单**/
	public async nodeUpdateMenu(props: DTO.NodeUpdateParameter) {
		try {
			const node = await this.menuModel.findOne({ where: { id: props.id }, relations: ['role'] })
			if (!node) {
				throw new HttpException('菜单节点不存在', HttpStatus.BAD_REQUEST)
			}

			let parent = null
			if (props.parent) {
				parent = await this.menuModel.findOne({ where: { id: props.parent } })
				if (!parent) {
					throw new HttpException('上级节点不存在', HttpStatus.BAD_REQUEST)
				} else if (parent.status !== 1) {
					throw new HttpException('上级节点已禁用', HttpStatus.BAD_REQUEST)
				}
			}

			if (props.role?.length > 0) {
				const role = await this.roleModel.find({ where: { id: In(props.role) } })
				props.role.forEach(id => {
					const element = role.find(element => element.id === id)
					if (!element) {
						throw new HttpException(`角色id ${id} 不存在`, HttpStatus.BAD_REQUEST)
					} else if (element?.status === 0) {
						throw new HttpException(`角色 ${element.name} 已禁用`, HttpStatus.BAD_REQUEST)
					} else if (element?.status === 2) {
						throw new HttpException(`角色 ${element.name} 已删除`, HttpStatus.BAD_REQUEST)
					}
				})
			}

			//删除已有的权限
			// await this.menuModel
			// 	.createQueryBuilder()
			// 	.relation('role')
			// 	.of(node)
			// 	.addAndRemove(
			// 		props.role,
			// 		node.role.map(k => k.id)
			// 	)

			await this.menuModel.update(
				{ id: props.id },
				{
					name: props.name,
					router: props.router || null,
					path: props.path || null,
					keepAlive: props.keepAlive || 0,
					visible: isEmpty(props.visible) ? node.id : props.visible,
					icon: props.icon || null,
					order: props.order || 0,
					parent
				}
			)

			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**切换菜单状态**/
	public async nodeMenuCutover(props: DTO.NodeMenuCutoverParameter) {
		try {
			const menu = await this.menuModel.findOne({ where: { id: props.id } })
			if (!menu) {
				throw new HttpException('菜单节点不存在', HttpStatus.BAD_REQUEST)
			} else if (menu.status === 2) {
				throw new HttpException('菜单节点已删除', HttpStatus.BAD_REQUEST)
			}
			await this.menuModel.update(
				{ id: props.id },
				{
					status: menu.status ? 0 : 1
				}
			)

			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**删除菜单**/
	public async nodeDeleteMenu(props: DTO.NodeDeleteMenuParameter) {
		try {
			const node = await this.menuModel.findOne({ where: { id: props.id } })
			if (!node) {
				throw new HttpException('菜单节点不存在', HttpStatus.BAD_REQUEST)
			} else if (node.status === 2) {
				throw new HttpException('菜单节点已删除', HttpStatus.BAD_REQUEST)
			}
			await this.menuModel.update({ id: props.id }, { status: 2 })
			return { message: '删除成功' }
		} catch (e) {}
	}
}
