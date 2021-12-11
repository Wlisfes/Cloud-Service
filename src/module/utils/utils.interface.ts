import { Repository, FindOneOptions } from 'typeorm'

export interface NodeValidator<Entity> {
	message: string //模型描述名称
	empty?: boolean //是否验证为空
	delete?: boolean //是否判断已删除
	disable?: boolean //是否判断已禁用
	model: Repository<Entity>
	options?: FindOneOptions<Entity>
}
