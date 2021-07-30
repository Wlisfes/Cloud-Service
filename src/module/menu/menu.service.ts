import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, IsNull } from 'typeorm'
import { UtilsService } from '@/module/utils/utils.service'
import { UserEntity } from '@/entity/user.entity'
import { MenuEntity } from '@/entity/menu.entity'
import * as DTO from './menu.interface'

@Injectable()
export class MenuService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(MenuEntity) private readonly menuModel: Repository<MenuEntity>,
		private readonly utilsService: UtilsService
	) {}

	onApplicationBootstrap() {
		console.log(111111)
	}

	/**初始化根节点**/

	/**创建菜单**/
	public async nodeCreate(props: DTO.NodeCreate) {
		try {
			let parent = null
			if (props.parent) {
				parent = await this.menuModel.findOne({ where: { id: props.parent } })
				if (!parent) {
					throw new HttpException('上级节点不存在', HttpStatus.BAD_REQUEST)
				} else if (parent.ststus !== 1) {
					throw new HttpException('上级节点已禁用', HttpStatus.BAD_REQUEST)
				}
			}

			const newMenu = await this.menuModel.create({
				type: props.type,
				name: props.name,
				router: props.router || null,
				path: props.path || null,
				keepAlive: props.keepAlive || 0,
				status: props.status || 0,
				icon: props.icon || null,
				order: props.order || 1,
				parent
			})
			await this.menuModel.save(newMenu)

			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**获取节点目录**/
	public async nodeMenuConter() {
		try {
			const node = await this.menuModel.find({
				where: {
					type: 1
				},
				relations: ['parent']
			})
			return this.utilsService.listToTree(node.map(k => ({ ...k, parent: k.parent?.id || null })))
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**动态路由节点**/
	public async nodeRouter() {
		try {
			return await this.menuModel.find({
				where: {
					type: 2
				}
			})
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**菜单列表**/
	public async nodeMenus() {
		try {
			const node = await this.menuModel.find({
				relations: ['parent']
			})
			return this.utilsService.listToTree(node.map(k => ({ ...k, parent: k.parent?.id || null })))
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
