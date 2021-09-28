import { Entity, Column, ManyToOne } from 'typeorm'
import { BaseEntity } from '@/entity/common.entity'
import { UserEntity } from '@/entity/user.entity'

@Entity('logger')
export class LoggerEntity extends BaseEntity {
	@Column({ nullable: true, comment: '来源地址' })
	referer: string

	@Column({ nullable: true, comment: '来源ip' })
	ip: string

	@Column({ nullable: true, comment: '请求地址' })
	path: string

	@Column({ nullable: true, comment: '请求类型' })
	method: string

	@Column({ nullable: false, default: 1, comment: '存储类型：1、中间件存储 2、拦截器存储 3、过滤器存储' })
	type: number

	@Column('simple-json', { nullable: true, comment: 'body参数' })
	body: never

	@Column('simple-json', { nullable: true, comment: 'query参数' })
	query: never

	@Column('simple-json', { nullable: true, comment: 'params参数' })
	params: never

	@Column({ nullable: true, comment: '状态码' })
	code: number

	@Column({ nullable: true, comment: '状态描述' })
	message: string

	@Column({ nullable: false, default: 1, comment: '状态: 0.禁用 1.启用 2.删除' })
	status: number

	@ManyToOne(type => UserEntity)
	user: UserEntity
}
