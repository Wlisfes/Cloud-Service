import { CanActivate, SetMetadata, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtAuthService } from '@/module/jwt/jwt.service'

export const APP_AUTH = Symbol('APP_AUTH')
export const APP_AUTH_TOKEN = 'app-token'
export class AuthTokenInterface {
	login: boolean //是否验证登录
	error?: boolean //未登录是否抛出异常
	role?: boolean //是否验证角色
}

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly reflector: Reflector, private readonly jwtAuthService: JwtAuthService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const props = this.reflector.get<AuthTokenInterface>(APP_AUTH, context.getHandler())

		if (props?.login) {
			//验证是否需要登录
			const token = request.headers[APP_AUTH_TOKEN]
			if (!token) {
				//未携带token、props.error等于true、不需要抛出异常、可继续执行
				if (props.error) {
					return true
				}
				throw new HttpException('未登陆', HttpStatus.UNAUTHORIZED)
			}

			//token解密
			const user = await this.jwtAuthService.signverify(token)
			if (user) {
				request.user = user
			}
		}

		return true
	}
}

//用户登录守卫  使用AuthToken守卫的接口会验证用户登录
export const AuthToken = (props: AuthTokenInterface) => SetMetadata(APP_AUTH, props)
