import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In, IsNull, Not, Brackets } from 'typeorm'
import { isEmpty } from 'class-validator'
import { UtilsService } from '@/module/utils/utils.service'
import { UserEntity } from '@/entity/user.entity'
import { RoleEntity } from '@/entity/role.entity'
import { ModuleEntity } from '@/entity/module.entity'
import * as DTO from './role.interface'

@Injectable()
export class RoleService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(RoleEntity) public readonly roleModel: Repository<RoleEntity>,
		@InjectRepository(ModuleEntity) private readonly moduleModel: Repository<ModuleEntity>,
		private readonly utilsService: UtilsService
	) {}

	/**创建角色-授权管理端**/
	public async nodeCreateRole(props: DTO.NodeCreateRoleParameter) {
		try {
			if (await this.roleModel.findOne({ where: { primary: props.primary } })) {
				throw new HttpException('角色已存在', HttpStatus.BAD_REQUEST)
			}

			const newRole = await this.roleModel.create({
				primary: props.primary,
				name: props.name,
				status: props.status || 0,
				action: props.action || null,
				comment: props.comment || null
			})
			await this.roleModel.save(newRole)

			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**修改角色-授权管理端**/
	public async nodeUpdateRole(props: DTO.NodeUpdateRoleParameter) {
		try {
			const role = await this.roleModel.findOne({ where: { id: props.id } })
			if (!role) {
				throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST)
			}

			await this.roleModel.update(
				{ id: props.id },
				{
					primary: props.primary,
					name: props.name,
					action: props.action || null,
					comment: props.comment || null,
					status: isEmpty(props.status) ? role.status : props.status
				}
			)

			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**切换角色状态-授权管理端**/
	public async nodeRoleCutover(props: DTO.NodeRoleCutoverParameter) {
		try {
			const role = await this.roleModel.findOne({ where: { id: props.id } })
			if (!role) {
				throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST)
			}
			await this.roleModel.update(
				{ id: props.id },
				{
					status: role.status ? 0 : 1
				}
			)

			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**角色信息-授权管理端**/
	public async nodeRole(props: DTO.NodeRoleParameter) {
		try {
			const role = await this.roleModel.findOne({
				where: { id: props.id }
				// relations: ['module']
			})

			if (!role) {
				throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST)
			} else if (role.status === 0) {
				throw new HttpException('角色已禁用', HttpStatus.BAD_REQUEST)
			}

			return role
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**角色列表-授权管理端**/
	public async nodeRoles(props: DTO.NodeRolesParameter) {
		try {
			const [list = [], total = 0] = await this.roleModel
				.createQueryBuilder('role')
				.where(
					new Brackets(Q => {
						if (!isEmpty(props.status)) {
							Q.andWhere('role.status = :status', { status: props.status })
						}

						if (props.name) {
							Q.andWhere('role.name LIKE :name', { name: `%${props.name}%` })
						}
					})
				)
				.skip((props.page - 1) * props.size)
				.take(props.size)
				.getManyAndCount()
			return {
				size: props.size,
				page: props.page,
				total,
				list
			}
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
