import { Module, Global } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { JwtAuthService } from './jwt.service'

@Global()
@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: () => ({
				secret: process.env.JWT_SECRET,
				signOptions: {
					expiresIn: Number(process.env.JWT_EXPIRESIN || 24 * 60 * 60)
				}
			})
		})
	],
	providers: [JwtAuthService],
	exports: [JwtAuthService]
})
export class JwtAuthModule {}
