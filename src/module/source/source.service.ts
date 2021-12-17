import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Not, In, Like } from 'typeorm'
import { isEmpty } from 'class-validator'
import { UtilsService } from '@/module/utils/utils.service'
import { SourceEntity } from '@/entity/source.entity'
import * as DTO from './source.interface'

@Injectable()
export class SourceService {
	constructor(
		private readonly utilsService: UtilsService,
		@InjectRepository(SourceEntity) private readonly sourceModel: Repository<SourceEntity>
	) {}

	/**创建标签**/
	public async nodeCreateSource(props: DTO.NodeCreateSourceParameter) {
		try {
			const source = await this.sourceModel.findOne({ where: { name: props.name, status: In([0, 1]) } })
			if (source) {
				throw new HttpException('分类标签已存在', HttpStatus.BAD_REQUEST)
			}
			const newSource = await this.sourceModel.create({
				name: props.name,
				icon: props.icon,
				color: props.color,
				status: props.status || 0,
				order: props.order || 0,
				comment: props.comment || null
			})
			await this.sourceModel.save(newSource)

			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**修改标签**/
	public async nodeUpdateSource(props: DTO.NodeUpdateSourceParameter) {
		try {
			//验证分类标签
			const source = await this.utilsService.validator({
				message: '分类标签',
				empty: true,
				model: this.sourceModel,
				options: { where: { id: props.id } }
			})
			await this.sourceModel.update(
				{ id: props.id },
				{
					name: props.name,
					icon: props.icon,
					color: props.color,
					status: isEmpty(props.status) ? source.status : props.status,
					order: props.order || 0,
					comment: props.comment || null
				}
			)

			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**切换标签状态**/
	public async nodeSourceCutover(props: DTO.NodeSourceCutoverParameter) {
		try {
			const source = await this.utilsService.validator({
				message: '分类标签',
				empty: true,
				delete: true,
				model: this.sourceModel,
				options: { where: { id: props.id } }
			})
			await this.sourceModel.update({ id: props.id }, { status: source.status ? 0 : 1 })

			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**标签信息**/
	public async nodeSource(props: DTO.NodeSourceParameter) {
		try {
			return await this.utilsService.validator({
				message: '分类标签',
				empty: true,
				model: this.sourceModel,
				options: { where: { id: props.id } }
			})
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**标签列表**/
	public async nodeSources(props: DTO.NodeSourcesParameter) {
		try {
			const [list = [], total = 0] = await this.sourceModel.findAndCount({
				where: {
					status: isEmpty(props.status) ? Not(2) : props.status,
					...(() => {
						if (props.name) {
							return { name: Like(`%${props.name}%`) }
						}
						return {}
					})()
				},
				order: {
					order: 'DESC',
					createTime: 'DESC'
				},
				skip: (props.page - 1) * props.size,
				take: props.size
			})

			return {
				size: props.size,
				page: props.page,
				total,
				list
			}
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**删除标签**/
	public async nodeDeleteSource(props: DTO.NodeDeleteSourceParameter) {
		try {
			await this.utilsService.validator({
				message: '分类标签',
				empty: true,
				delete: true,
				model: this.sourceModel,
				options: { where: { id: props.id } }
			})
			await this.sourceModel.update({ id: props.id }, { status: 2 })

			return { message: '删除成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
