import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
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

	/**创建菜单**/
	public async createMenu(props: DTO.CreateMenu) {
		try {
			// const newMenu = await this.menuModel.create({ ...props })
			// return await this.menuModel.save(newMenu)
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**菜单列表**/
	public async findMenus() {
		try {
			return await this.menuModel.find()
			// return this.utilsService.listToTree(list)
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
