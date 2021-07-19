import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'
import { RoleEntity } from '@/entity/role.entity'
import { JwtAuthService } from '@/module/jwt/jwt.service'
import { RedisService } from '@/module/redis/redis.service'
import { compareSync } from 'bcryptjs'
import { create } from 'svg-captcha'
import * as DTO from './user.interface'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(UserEntity) private readonly roleModel: Repository<RoleEntity>,
		private readonly jwtAuthService: JwtAuthService,
		private readonly redisService: RedisService
	) {}

	/**验证码**/
	public async createCode(): Promise<DTO.CreateCode> {
		return create({
			fontSize: 32,
			noise: 2,
			width: 100,
			height: 32,
			inverse: true,
			background: '#cc9966'
		})
	}

	/**创建8位数账户**/
	public async createAccount(num: number): Promise<number> {
		try {
			const account = Number(
				Array(num)
					.fill(num)
					.map(() => Math.floor(Math.random() * 10))
					.join('')
			)
			const user = await this.userModel.findOne({ where: { account } })
			if (user) {
				return await this.createAccount(num)
			}
			return account
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**注册用户**/
	public async registerUser(props: DTO.RegisterUserParameter) {
		try {
			const code = await this.redisService.getStore(props.email)
			if (!code || code !== props.code) {
				throw new HttpException('邮箱验证码错误', HttpStatus.BAD_REQUEST)
			}
			if (await this.userModel.findOne({ where: { email: props.email } })) {
				throw new HttpException('邮箱已注册', HttpStatus.BAD_REQUEST)
			}
			const newUser = await this.userModel.create({
				...props,
				account: await this.createAccount(8)
			})
			await this.userModel.save(newUser)
			//注册成功删除redis中的邮箱验证码
			await this.redisService.delStore(props.email)
			return { message: '注册成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**创建用户**/
	public async createUser(props: DTO.CreateUserParameter) {
		try {
			if (props.email && (await this.userModel.findOne({ where: { email: props.email } }))) {
				throw new HttpException('邮箱已存在', HttpStatus.BAD_REQUEST)
			}

			if (props.mobile && (await this.userModel.findOne({ where: { mobile: props.mobile } }))) {
				throw new HttpException('手机号已存在', HttpStatus.BAD_REQUEST)
			}

			if (props.role) {
				console.log(props.role)
				const role = await this.roleModel.findOne({ where: { id: props.role } })
				console.log(role, props.role)
				if (!role) {
					throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST)
				} else if (role.status !== 1) {
					throw new HttpException('角色已禁用', HttpStatus.BAD_REQUEST)
				}
			}

			const newUser = await this.userModel.create({
				nickname: props.nickname,
				password: props.password,
				status: props.status,
				email: props.email || null,
				mobile: props.mobile || null,
				avatar: props.avatar || null,
				comment: props.comment || null,
				account: await this.createAccount(8)
			})
			const user = await this.roleModel.save(newUser)
			await this.createUserRole(user.uid, props.role)

			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**创建用户角色**/
	public async createUserRole(uid: number, id: number) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			const role = await this.roleModel.findOne({
				where: { id },
				relations: ['children', 'children.children']
			})
			const newRole = await this.roleModel.create({
				primary: role.primary,
				name: role.name,
				status: role.status,
				type: role.type,
				user
			})
			const roleParent = await this.roleModel.save(newRole)
			role.children.forEach(async auth => {
				const newAuth = await this.roleModel.create({
					primary: auth.primary,
					name: auth.name,
					status: auth.status,
					type: auth.type,
					parent: roleParent,
					user
				})
				const authParent = await this.roleModel.save(newAuth)
				auth.children.forEach(async action => {
					const newAction = await this.roleModel.create({
						primary: action.primary,
						name: action.name,
						status: action.status,
						type: action.type,
						parent: authParent,
						user
					})
					await this.roleModel.save(newAction)
				})
			})

			return true
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**用户登录**/
	public async loginUser(props: DTO.LoginUserParameter, code: string) {
		try {
			if (!code || code !== props.code.toUpperCase()) {
				throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST)
			}
			const user = await this.userModel
				.createQueryBuilder('user')
				.orWhere('user.account = :account', { account: props.account })
				.orWhere('user.email = :email', { email: props.account })
				.orWhere('user.mobile = :mobile', { mobile: props.account })
				.getOne()

			if (!user) {
				throw new HttpException('账户不存在', HttpStatus.BAD_REQUEST)
			}
			if (user.status !== 1) {
				throw new HttpException('账户已被禁用', HttpStatus.BAD_REQUEST)
			}
			if (!compareSync(props.password, user.password)) {
				throw new HttpException('密码错误', HttpStatus.BAD_REQUEST)
			}
			return await this.jwtAuthService.signature({
				uid: user.uid,
				password: user.password
			})
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**修改用户**/
	public async updateNodeUser(props: DTO.UpdateNodeUserParameter, uid: number): Promise<UserEntity> {
		try {
			await this.userModel.update({ uid }, { ...props })
			return await this.nodeUidUser(uid)
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**修改用户邮箱**/
	async updateNodeUserEmail(props: DTO.UpdateNodeUserEmailParameter, uid: number): Promise<UserEntity> {
		try {
			const code = await this.redisService.getStore(props.email)
			if (!code || code !== props.code) {
				throw new HttpException('邮箱验证码错误', HttpStatus.BAD_REQUEST)
			}

			await this.userModel.update({ uid }, { email: props.email })
			return await this.nodeUidUser(uid)
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**切换用户状态**/
	public async nodeUserCutover({ uid }: DTO.NodeUserCutoverParameter) {
		try {
			const role = await this.userModel.findOne({ where: { uid } })
			if (!role) {
				throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST)
			}
			if (role.status) {
				await this.userModel.update({ uid }, { status: 0 })
			} else {
				await this.userModel.update({ uid }, { status: 1 })
			}

			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**uid获取用户信息**/
	public async nodeUidUser(uid: number): Promise<UserEntity> {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			if (user) {
				return user
			}
			throw new HttpException('uid 错误', HttpStatus.BAD_REQUEST)
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**用户列表**/
	public async nodeUsers(props: DTO.NodeUsersParameter) {
		try {
			const [list = [], total = 0] = await this.userModel.findAndCount({
				order: { uid: 'ASC' },
				skip: (props.page - 1) * props.size,
				take: props.size
			})

			return { total, size: props.size, page: props.page, list }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
