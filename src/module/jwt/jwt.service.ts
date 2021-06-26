import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as DTO from './jwt.interface'

@Injectable()
export class JwtAuthService {
	constructor(private readonly jwtService: JwtService) {}

	//加密
	public async signature(props: DTO.Signature): Promise<DTO.SignatureRespoens> {
		return {
			token: await this.jwtService.signAsync(props)
		}
	}

	//解密
	public async signverify(token: string): Promise<DTO.SignverifyRespoens> {
		try {
			return await this.jwtService.verifyAsync(token)
		} catch (e) {
			throw new HttpException('token 错误或已过期', HttpStatus.UNAUTHORIZED)
		}
	}
}
