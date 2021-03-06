import { Entity, Column, ManyToMany, JoinTable } from 'typeorm'
import { BaseEntity } from '@/entity/common.entity'
import { ModuleActionEntity } from '@/entity/module.action.entity'

@Entity('module')
export class ModuleEntity extends BaseEntity {
	@Column({ nullable: false, comment: '模块唯一标识' })
	primary: string

	@Column({ nullable: false, comment: '模块名称' })
	name: string

	@Column({ charset: 'utf8mb4', comment: '模块备注', default: null, nullable: true })
	comment: string

	@Column({ nullable: false, default: 1, comment: '状态' })
	status: number

	@ManyToMany(
		type => ModuleActionEntity,
		type => type.module,
		{ cascade: true }
	)
	@JoinTable({ name: 'module_action_join' })
	action: ModuleActionEntity[]
}
