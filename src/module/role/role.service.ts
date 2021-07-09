import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'
import { RoleEntity } from '@/entity/role.entity'
import { AuthEntity } from '@/entity/auth.entity'
import { ActionEntity } from '@/entity/action.entity'

@Injectable()
export class RoleService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(RoleEntity) private readonly roleModel: Repository<RoleEntity>,
		@InjectRepository(AuthEntity) private readonly authModel: Repository<AuthEntity>,
		@InjectRepository(ActionEntity) private readonly actionModel: Repository<ActionEntity>
	) {}

	/**角色列表**/
	public async findRoles(): Promise<RoleEntity[]> {
		try {
			return await this.roleModel.find({
				relations: ['auth', 'auth.action']
			})
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
