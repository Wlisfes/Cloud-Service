import { Entity, Column, ManyToMany } from 'typeorm'
import { BaseEntity } from '@/entity/common.entity'
import { ModuleEntity } from '@/entity/module.entity'

@Entity('module_action')
export class ModuleActionEntity extends BaseEntity {
	@Column({ nullable: false, comment: '接口权限唯一标识' })
	primary: string

	@Column({ nullable: false, comment: '接口权限名称' })
	name: string

	@Column({ charset: 'utf8mb4', comment: '接口权限备注', default: null, nullable: true })
	comment: string

	@Column({ nullable: false, default: 1, comment: '状态' })
	status: number

	@ManyToMany(
		type => ModuleEntity,
		type => type.action
	)
	module: ModuleEntity[]
}
