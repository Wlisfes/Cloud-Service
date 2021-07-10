import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'
import { RoleEntity } from '@/entity/role.entity'

@Injectable()
export class RoleService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(RoleEntity) private readonly roleModel: Repository<RoleEntity>
	) {}

	/**角色列表-不包括子类**/
	public async nodeRoles(): Promise<RoleEntity[]> {
		try {
			const parent = await this.roleModel.findOne({ where: { primary: 'admin' } })
			// return await this.roleModel.manager.getTreeRepository(RoleEntity).findDescendantsTree(parent)
			// return await this.roleModel.manager.getTreeRepository(RoleEntity).countDescendants(parent)

			return this.roleModel.manager.getTreeRepository(RoleEntity).findRoots()
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**角色列表-包括子类**/
	public async nodeRolesChild() {
		try {
			return this.roleModel.manager.getTreeRepository(RoleEntity).findTrees()
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**角色信息**/
	public async nodeRole() {
		try {
			const parent = await this.roleModel.findOne({ where: { id: 1 } })
			if (!parent) {
				throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST)
			}
			return await this.roleModel.manager.getTreeRepository(RoleEntity).findDescendantsTree(parent)
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
