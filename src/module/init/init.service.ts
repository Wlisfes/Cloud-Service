import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'
import { RoleEntity } from '@/entity/role.entity'
import { AuthEntity } from '@/entity/auth.entity'
import { ActionEntity } from '@/entity/action.entity'

@Injectable()
export class InitService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(RoleEntity) private readonly roleModel: Repository<RoleEntity>,
		@InjectRepository(AuthEntity) private readonly authModel: Repository<AuthEntity>,
		@InjectRepository(ActionEntity) private readonly actionModel: Repository<ActionEntity>
	) {
		this.initAdminUser()
	}

	/**初始化角色**/
	private async initRole() {}

	/**初始化权限**/
	private initAuth() {}

	/**初始化接口权限**/
	private initAction() {}

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
