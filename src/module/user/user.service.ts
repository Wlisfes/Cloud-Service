import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, IsNull, Not, Like, In, Brackets } from 'typeorm'
import { isEmpty } from 'class-validator'
import { UserEntity } from '@/entity/user.entity'
import { RoleEntity } from '@/entity/role.entity'
import { JwtAuthService } from '@/module/jwt/jwt.service'
import { RedisService } from '@/module/redis/redis.service'
import { NodemailerService } from '@/module/nodemailer/nodemailer.service'
import { compareSync } from 'bcryptjs'
import { create } from 'svg-captcha'
import * as DTO from './user.interface'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(RoleEntity) private readonly roleModel: Repository<RoleEntity>,
		private readonly jwtAuthService: JwtAuthService,
		private readonly redisService: RedisService,
		private readonly nodemailerService: NodemailerService
	) {}

	/**验证码**/
	public async createCode(): Promise<DTO.CreateCode> {
		return create({
			// fontSize: 32,
			// noise: 2,
			// width: 100,
			// height: 32,
			// inverse: true,
			// background: '#cc9966'
			size: 4,
			fontSize: 32,
			color: true,
			noise: 4,
			width: 100,
			height: 32,
			inverse: true,
			charPreset: '1234567890',
			background: '#cc9966'
		})
	}

	/**创建8位数账户**/
	private createNumber(): number {
		const captcha = Array(8)
			.fill(8)
			.map(() => Math.floor(Math.random() * 10))
			.join('')
		if (Number(captcha) < 80000000) {
			return this.createNumber()
		}
		return Number(captcha)
	}

	/**验证8位数账户**/
	public async createAccount(): Promise<number> {
		try {
			const account = this.createNumber()
			const user = await this.userModel.findOne({ where: { account } })
			if (user) {
				return await this.createAccount()
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

			const role = await this.roleModel.find({ where: { primary: 'super' } })
			const newUser = await this.userModel.create({
				nickname: props.nickname,
				password: props.password,
				email: props.email,
				account: await this.createAccount(),
				role
			})
			const { uid } = await this.userModel.save(newUser)
			const user = await this.nodeUidUser(uid, true)

			//注册成功删除redis中的邮箱验证码
			await this.redisService.delStore(props.email)

			//发送账户
			await this.nodemailerService.registerSend(user.account, user.email)

			const { token } = await this.jwtAuthService.signature({
				uid: user.uid,
				password: user.password
			})

			return { token, message: '注册成功' }
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

			let role = []
			if (props.role?.length > 0) {
				role = await this.roleModel.find({ where: { id: In(props.role) } })
				props.role.forEach(id => {
					const element = role.find(element => element.id === id)
					if (!element) {
						throw new HttpException(`角色id ${id} 不存在`, HttpStatus.BAD_REQUEST)
					} else if (element?.status === 0) {
						throw new HttpException(`角色 ${element.name} 已禁用`, HttpStatus.BAD_REQUEST)
					}
				})
			}

			const newUser = await this.userModel.create({
				nickname: props.nickname,
				password: props.password,
				status: props.status,
				email: props.email || null,
				mobile: props.mobile || null,
				avatar: props.avatar || null,
				comment: props.comment || null,
				account: await this.createAccount(),
				role
			})
			await this.userModel.save(newUser)

			return { message: '创建成功' }
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
				.where(
					new Brackets(Q => {
						Q.orWhere('user.account = :account', { account: props.account })
						Q.orWhere('user.email = :email', { email: props.account })
						Q.orWhere('user.mobile = :mobile', { mobile: props.account })
					})
				)
				.addSelect('user.password')
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

	/**修改用户信息**/
	public async nodeUpdateUser(props: DTO.NodeUpdateUserParameter) {
		try {
			if (props.email) {
				const user = await this.userModel.findOne({ where: { email: props.email } })
				if (user && user.uid !== props.uid) {
					throw new HttpException('邮箱已存在', HttpStatus.BAD_REQUEST)
				}
			}

			if (props.mobile) {
				const user = await this.userModel.findOne({ where: { mobile: props.mobile } })
				if (user && user.uid !== props.uid) {
					throw new HttpException('手机号已存在', HttpStatus.BAD_REQUEST)
				}
			}

			const user = await this.userModel.findOne({
				where: { uid: props.uid },
				relations: ['role']
			})

			if (props.role?.length > 0) {
				const role = await this.roleModel.find({ where: { id: In(props.role) } })
				props.role.forEach(id => {
					const element = role.find(element => element.id === id)
					if (!element) {
						throw new HttpException(`角色id ${id} 不存在`, HttpStatus.BAD_REQUEST)
					} else if (element?.status === 0) {
						throw new HttpException(`角色 ${element.name} 已禁用`, HttpStatus.BAD_REQUEST)
					}
				})
			}

			await this.userModel
				.createQueryBuilder()
				.relation('role')
				.of(user)
				.addAndRemove(
					props.role,
					user.role.map(k => k.id)
				)

			await this.userModel.update(
				{ uid: props.uid },
				{
					nickname: props.nickname,
					status: props.status,
					email: props.email || null,
					mobile: props.mobile || null,
					avatar: props.avatar || null,
					comment: props.comment || null
				}
			)
			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**重置用户密码**/
	async nodeUpdatePwsUser(props: DTO.NodeUpdatePwsUserParameter) {
		try {
			const user = await this.userModel.findOne({ where: { uid: props.uid } })
			if (!user) {
				throw new HttpException('账户不存在', HttpStatus.BAD_REQUEST)
			}
			await this.userModel.update({ uid: props.uid }, { password: props.password })
			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**修改用户邮箱**/
	async nodeUpdateUserEmail(props: DTO.NodeUpdateUserEmailParameter, uid: number) {
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
	public async nodeUidUser(uid: number, password?: boolean): Promise<UserEntity> {
		try {
			const Model = await this.userModel
				.createQueryBuilder('user')
				.leftJoinAndSelect('user.role', 'role')
				.where('user.uid = :uid', { uid })

			if (password) {
				Model.addSelect('user.password')
			}

			const user = Model.getOne()
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
			const [list = [], total = 0] = await this.userModel
				.createQueryBuilder('user')
				.leftJoinAndSelect('user.role', 'role')
				.where(
					new Brackets(Q => {
						if (!isEmpty(props.status)) {
							Q.andWhere('user.status = :status', { status: props.status })
						}
						if (props.primary) {
							Q.andWhere('role.primary = :primary', { primary: props.primary })
						}
						if (props.keyword) {
							Q.orWhere('user.account LIKE :account', { account: `%${props.keyword}%` })
							Q.orWhere('user.nickname LIKE :nickname', { nickname: `%${props.keyword}%` })
							Q.orWhere('user.email LIKE :email', { email: `%${props.keyword}%` })
							Q.orWhere('user.mobile LIKE :mobile', { mobile: `%${props.keyword}%` })
						}
					})
				)
				.skip((props.page - 1) * props.size)
				.take(props.size)
				.getManyAndCount()

			return {
				total,
				size: props.size,
				page: props.page,
				list
			}
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
