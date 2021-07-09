import { Module, Global } from '@nestjs/common'
import { InitService } from './init.service'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SessionModule } from 'nestjs-session'
import { UserEntity } from '@/entity/user.entity'
import { RoleEntity } from '@/entity/role.entity'
import { AuthEntity } from '@/entity/auth.entity'
import { ActionEntity } from '@/entity/action.entity'

//依赖模块挂载
import { UtilsModule } from '@/module/utils/utils.module'
import { RedisModule } from '@/module/redis/redis.module'
import { JwtAuthModule } from '@/module/jwt/jwt.module'
import { AliyunModule } from '@/module/aliyun/aliyun.module'
import { NodemailerModule } from '@/module/nodemailer/nodemailer.module'
import { BannerModule } from '@/module/banner/banner.module'
import { RoleModule } from '@/module/role/role.module'
import { UserModule } from '@/module/user/user.module'
import { MenuModule } from '@/module/menu/menu.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot(),
		TypeOrmModule.forFeature([UserEntity, RoleEntity, AuthEntity, ActionEntity]),
		RedisModule.forRoot({
			host: process.env.REDIS_HOST,
			port: Number(process.env.REDIS_PORT),
			db: Number(process.env.REDIS_DB),
			password: process.env.REDIS_PASSWORD,
			keyPrefix: process.env.REDIS_KEYPREFIX
		}),
		SessionModule.forRootAsync({
			useFactory: () => ({
				session: {
					secret: process.env.SESSION_SECRET,
					cookie: {
						httpOnly: true,
						maxAge: Number(process.env.SESSION_MAXAGE || 30 * 60 * 1000)
					}
				}
			})
		}),
		AliyunModule.forRoot({
			accessKeyId: process.env.ALIYUN_ACCESSKEYID,
			accessKeySecret: process.env.ALIYUN_ACCESSKEYSECRET,
			endpoint: process.env.ALIYUN_ENDPOINT,
			apiVersion: process.env.ALIYUN_APIVERSION
		}),
		NodemailerModule.forRoot({
			host: process.env.NODEMAILER_HOST,
			secure: true,
			auth: {
				user: process.env.NODEMAILER_AUTH_USER,
				pass: process.env.NODEMAILER_AUTH_PASS
			}
		}),
		UtilsModule,
		JwtAuthModule,
		BannerModule,
		RoleModule,
		UserModule,
		MenuModule
	],
	providers: [InitService]
})
export class InitModule {}
