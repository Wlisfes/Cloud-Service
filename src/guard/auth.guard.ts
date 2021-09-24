import { CanActivate, SetMetadata, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Brackets } from 'typeorm'
import { JwtAuthService } from '@/module/jwt/jwt.service'
import { RedisService } from '@/module/redis/redis.service'
import { UserService } from '@/module/user/user.service'
import { RoleService } from '@/module/role/role.service'
import { RoleEnum, RoleModuleEnum, RoleActionEnum } from '@/config/role.config'

export const APP_AUTH = Symbol('APP_AUTH')
export const APP_AUTH_ROLE = Symbol('APP_AUTH_ROLE')
export const APP_AUTH_TOKEN = 'app-token'

export class AuthTokenInterface {
	login: boolean /**是否验证登录**/
	error?: boolean /**未登录是否抛出异常**/
}

export class AuthRoleInterface {
	role: RoleEnum[] /**所需角色**/
	module: RoleModuleEnum /**所需功能模块**/
	action: RoleActionEnum /**所需操作权限**/
	error?: boolean /**未通过是否抛出异常**/
}

const useThrow = (message: string, code: number, error: boolean) => {
	if (error) {
		return true
	}
	throw new HttpException(message, code)
}

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly jwtAuthService: JwtAuthService,
		private readonly redisService: RedisService,
		private readonly userService: UserService,
		private readonly roleService: RoleService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const props = this.reflector.get<AuthTokenInterface>(APP_AUTH, context.getHandler())
		const node = this.reflector.get<AuthRoleInterface>(APP_AUTH_ROLE, context.getHandler())

		if (props?.login) {
			//验证是否需要登录
			const token = request.headers[APP_AUTH_TOKEN]
			if (!token) {
				return useThrow('未登陆', HttpStatus.UNAUTHORIZED, props.error)
			}

			const { uid, password } = await this.jwtAuthService.signverify(token)
			const user = await this.userService.nodeUidUser(uid, true)
			if (!user) {
				return useThrow('账户不存在', HttpStatus.FORBIDDEN, props.error)
			} else if (user.status !== 1) {
				return useThrow('账户已被禁用', HttpStatus.FORBIDDEN, props.error)
			} else if (password !== user.password) {
				throw new HttpException('密码已更换，请重新登录', HttpStatus.FORBIDDEN)
			}
			request.user = user
		}

		if (node?.role?.length > 0) {
			//验证用户权限
			// const user = await this.userService.userModel.findOne({
			// 	where: { uid: request.user.uid },
			// 	relations: ['role', 'role.module', 'role.module.action']
			// })
			// if
			const role = await this.roleService.roleModel
				.createQueryBuilder('role')
				.leftJoinAndSelect('role.user', 'user')
				.leftJoinAndSelect('role.module', 'module')
				.leftJoinAndSelect('module.action', 'action')
				.leftJoinAndMapOne('role.star', 'role.module', 'star', 'star.primary = :primary', { primary: 'role' })
				// .leftJoinAndMapOne('role.star', 'role.module', 'star', 'star.primary = :primary', {
				// 	primary: node.module
				// })

				// .leftJoinAndMapOne('role.star', 'role.module', 'star', qb => {
				// 	return qb.andWhere('star.primary = :primary', { primary: node.module })
				// })
				.where(
					new Brackets(Q => {
						Q.where('user.uid = :uid', { uid: request.user.uid })
					})
				)
				.getMany()
			console.log(node, role)
			if (!node.role.some(k => role.some(v => v.primary === k))) {
				return true // useThrow('角色不符', HttpStatus.FORBIDDEN, petence.error)
			} else {
			}

			// if (!petence.role.includes()) {
			// 		return useThrow('角色不符', HttpStatus.FORBIDDEN, petence.error)
			// 	}
			// const role = await this.roleService.nodeUserRole(request.user.uid)
			// if (!petence.role.includes(role.primary as RoleEnum)) {
			// 	return useThrow('角色不符', HttpStatus.FORBIDDEN, petence.error)
			// } else if (role.status === 0) {
			// 	return useThrow('角色已禁用', HttpStatus.FORBIDDEN, petence.error)
			// } else if (!role.children.find(k => k.primary === petence.module)) {
			// 	return useThrow('角色功能不足', HttpStatus.FORBIDDEN, petence.error)
			// } else if (!role.children.find(k => k.primary === petence.module).status) {
			// 	return useThrow('角色功能已禁用', HttpStatus.FORBIDDEN, petence.error)
			// } else {
			// 	const { children } = role.children.find(k => k.primary === petence.module)
			// 	if (!children.find(k => k.primary === petence.action)) {
			// 		return useThrow('角色功能已权限不足', HttpStatus.FORBIDDEN, petence.error)
			// 	} else if (!children.find(k => k.primary === petence.action).status) {
			// 		return useThrow('角色功能已权限已禁用', HttpStatus.FORBIDDEN, petence.error)
			// 	} else {
			// 		//验证通过
			// 		return true
			// 	}
			// }
			return true
		}

		return true
	}
}

//用户登录守卫  使用AuthToken守卫的接口会验证用户登录
export const AuthToken = (props: AuthTokenInterface) => SetMetadata(APP_AUTH, props)

/**用户角色守卫  使用AuthRole守卫的接口会验证用户权限**/
export const AuthRole = (props: AuthRoleInterface) => SetMetadata(APP_AUTH_ROLE, props)
