import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { DateEntity } from '@/entity/common.entity'

@Entity('menu')
export class MenuEntity extends DateEntity {
	@PrimaryGeneratedColumn({ comment: '自增长主键' })
	id: number

	@Column({ comment: '节点类型: 1.目录 2.菜单 3.权限', type: 'enum', enum: [1, 2, 3], default: 1, nullable: false })
	type: number

	@Column({ comment: '节点名称', nullable: false })
	name: string

	@Column({ comment: '节点路由' })
	router: string

	@Column({ comment: '重定向地址' })
	redirect: string

	@Column({ comment: '路由缓存: 0.关闭 1.开启', type: 'enum', enum: [0, 1], default: 1, nullable: false })
	keepAlive: number

	@Column({ comment: '状态: 0.隐藏 1.显示', type: 'enum', enum: [0, 1], default: 1, nullable: false })
	ststus: number

	@Column({ comment: '文件路径' })
	path: string

	@Column({ comment: '节点图标' })
	icon: string

	@Column({ comment: '排序号', default: 0, nullable: false })
	order: number

	@ManyToOne(
		type => MenuEntity,
		role => role.children
	)
	parent: MenuEntity

	@OneToMany(
		type => MenuEntity,
		role => role.parent
	)
	children: MenuEntity[]

	// @Column({ comment: '权限' })
	// permission: string
}
