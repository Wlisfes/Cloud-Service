import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'
import { JwtAuthService } from '@/module/jwt/jwt.service'
import { RedisService } from '@/module/redis/redis.service'
import { compareSync } from 'bcryptjs'
import { create } from 'svg-captcha'
import * as DTO from './user.interface'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		private readonly jwtAuthService: JwtAuthService,
		private readonly redisService: RedisService
	) {}

	/**验证码**/
	async createCode(): Promise<DTO.CreateCode> {
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
	async createAccount(num: number): Promise<number> {
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

	/**创建用户**/
	async createUser(props: DTO.CreateUserParameter) {
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

			// Object.keys([...Array(55)]).map(async () => {
			// 	const newUser = await this.userModel.create({
			// 		...props,
			// 		account: await this.createAccount(8)
			// 	})
			// 	await this.userModel.save(newUser)
			// })
			// return { message: '注册成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**用户登录**/
	async loginUser(props: DTO.LoginUserParameter, code: string) {
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
	async updateNodeUser(props: DTO.UpdateNodeUserParameter, uid: number): Promise<UserEntity> {
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

	/**uid获取用户信息**/
	async nodeUidUser(uid: number): Promise<UserEntity> {
		try {
			const user = await this.userModel.findOne({ uid })
			if (user) {
				return user
			}
			throw new HttpException('uid 错误', HttpStatus.BAD_REQUEST)
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**用户列表**/
	async nodeUsers(props: DTO.NodeUsersParameter) {
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
