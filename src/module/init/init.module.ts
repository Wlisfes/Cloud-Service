import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SessionModule } from 'nestjs-session'

//依赖模块挂载
import { RedisModule } from '@/module/redis/redis.module'
import { JwtAuthModule } from '@/module/jwt/jwt.module'
import { AliyunModule } from '@/module/aliyun/aliyun.module'
import { NodemailerModule } from '@/module/nodemailer/nodemailer.module'
import { BannerModule } from '@/module/banner/banner.module'
import { UserModule } from '@/module/user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot(),
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
		JwtAuthModule,
		BannerModule,
		UserModule
	]
})
export class InitModule {}
