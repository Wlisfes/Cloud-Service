import { CanActivate, SetMetadata, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Brackets, getRepository } from 'typeorm'
import { JwtAuthService } from '@/module/jwt/jwt.service'
import { UserEntity } from '@/entity/user.entity'
import { RoleEntity } from '@/entity/role.entity'
import { RoleEnum, RoleModuleEnum, RoleActionEnum } from '@/config/role.config'

export const APP_AUTH = Symbol('APP_AUTH')
export const APP_AUTH_ROLE = Symbol('APP_AUTH_ROLE')
export const APP_AUTH_TOKEN = 'app-token'

export class AuthTokenInterface {
	login: boolean /**是否验证登录**/
	error?: boolean /**未登录是不否抛出异常**/
}

export class AuthRoleInterface {
	role: RoleEnum[] /**所需角色**/
	module: RoleModuleEnum /**所需功能模块**/
	action: RoleActionEnum /**所需操作权限**/
	error?: boolean /**未通过是否抛出异常**/
}

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly reflector: Reflector, private readonly jwtAuthService: JwtAuthService) {}

	private HttpException(message: string, code: number, error: boolean) {
		if (error) {
			return true
		}
		throw new HttpException(message, code)
	}

	/**验证是否需要登录**/
	private async nodeAuthToken(props: AuthTokenInterface, token: string) {
		if (!token) {
			return this.HttpException('未登陆', HttpStatus.UNAUTHORIZED, props.error)
		}

		/**解密token**/
		const { uid, password } = await this.jwtAuthService.signverify(token)
		const user = await getRepository(UserEntity)
			.createQueryBuilder('user')
			.where('user.uid = :uid', { uid })
			.addSelect('user.password')
			.getOne()

		if (!user) {
			return this.HttpException('账户不存在', HttpStatus.FORBIDDEN, props.error)
		} else if (user.status !== 1) {
			return this.HttpException('账户已被禁用', HttpStatus.FORBIDDEN, props.error)
		} else if (password !== user.password) {
			return this.HttpException('密码已更换，请重新登录', HttpStatus.FORBIDDEN, false)
		}

		return user
	}

	/**验证角色权限**/
	private async nodeAuthRole(props: AuthRoleInterface, uid: number) {
		const role = await getRepository(RoleEntity)
			.createQueryBuilder('role')
			.leftJoinAndSelect('role.user', 'user')
			.where(
				new Brackets(Q => {
					Q.andWhere('role.primary IN (:...primary)', { primary: props.role })
					Q.andWhere('user.uid = :uid', { uid: uid })
				})
			)
			.getMany()

		if (role.length === 0) {
			return this.HttpException('角色不符', HttpStatus.FORBIDDEN, props.error)
		} else if (role.some(k => k.primary === 'admin')) {
			return true /**admin角色直接通行**/
		} else if (!role.some(k => k.status === 1)) {
			return this.HttpException('角色已禁用', HttpStatus.FORBIDDEN, props.error)
		} else {
			const action = role.some(k => {
				return k.status === 1 && k.action.includes(`${props.module}:${props.action}`)
			})
			if (action) {
				return true
			}

			return this.HttpException('角色action功能权限不足', HttpStatus.FORBIDDEN, props.error)
		}
	}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const props = this.reflector.get<AuthTokenInterface>(APP_AUTH, context.getHandler())
		const node = this.reflector.get<AuthRoleInterface>(APP_AUTH_ROLE, context.getHandler())

		//ipv4挂载
		request.ipv4 = request.headers['x-forwarded-for'] || request.headers['x-real-ip'] || '127.0.0.1'

		if (props?.login) {
			//验证是否需要登录
			const token = request.headers[APP_AUTH_TOKEN]
			request.user = await this.nodeAuthToken(props, token)
		}

		if (node?.role?.length > 0) {
			//验证用户权限
			return await this.nodeAuthRole(node, request.user.uid)
		}

		return true
	}
}

//用户登录守卫  使用AuthToken守卫的接口会验证用户登录
export const AuthToken = (props: AuthTokenInterface) => SetMetadata(APP_AUTH, props)

/**用户角色守卫  使用AuthRole守卫的接口会验证用户权限**/
export const AuthRole = (props: AuthRoleInterface) => SetMetadata(APP_AUTH_ROLE, props)
