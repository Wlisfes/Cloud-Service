import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Not } from 'typeorm'
import { isEmpty } from 'class-validator'
import { CloudEntity } from '@/entity/cloud.entity'
import { CloudSourceEntity } from '@/entity/cloud.source.entity'
import * as DTO from './cloud-source.interface'

@Injectable()
export class CloudSourceService {
	constructor(
		@InjectRepository(CloudEntity) private readonly cloudModel: Repository<CloudEntity>,
		@InjectRepository(CloudSourceEntity) private readonly sourceModel: Repository<CloudSourceEntity>
	) {}

	/**创建分类标签**/
	public async nodeCreateCloudSource(props: DTO.NodeCreateCloudSourceParameter) {
		try {
			if (await this.sourceModel.findOne({ where: [{ name: props.name }, { status: 0 }, { status: 1 }] })) {
				throw new HttpException('分类标签已存在', HttpStatus.BAD_REQUEST)
			}
			const newSource = await this.sourceModel.create({
				name: props.name,
				color: props.color,
				status: props.status || 0,
				order: props.order || 0
			})
			await this.sourceModel.save(newSource)

			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**修改分类标签**/
	public async nodeUpdateCloudSource(props: DTO.NodeUpdateCloudSourceParameter) {
		try {
			const source = await this.sourceModel.findOne({ where: { id: props.id } })
			if (!source) {
				throw new HttpException('分类标签不存在', HttpStatus.BAD_REQUEST)
			}
			await this.sourceModel.update(
				{ id: props.id },
				{
					name: props.name,
					color: props.color,
					status: props.status || 0,
					order: props.order || 0
				}
			)

			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**切换分类标签状态**/
	public async nodeCloudSourceCutover(props: DTO.NodeCloudSourceCutoverParameter) {
		try {
			const source = await this.sourceModel.findOne({ where: { id: props.id } })
			if (!source) {
				throw new HttpException('分类标签不存在', HttpStatus.BAD_REQUEST)
			} else if (source.status === 2) {
				throw new HttpException('分类标签已删除', HttpStatus.BAD_REQUEST)
			}
			await this.sourceModel.update(
				{ id: props.id },
				{
					status: source.status ? 0 : 1
				}
			)

			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**分类标签信息**/
	public async nodeCloudSource(props: DTO.NodeCloudSourceParameter) {
		try {
			const source = await this.sourceModel.findOne({ where: { id: props.id } })
			if (!source) {
				throw new HttpException('分类标签不存在', HttpStatus.BAD_REQUEST)
			}
			return source
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**分类标签列表**/
	public async nodeCloudSources(props: DTO.NodeCloudSourcesParameter) {
		try {
			const [list = [], total = 0] = await this.sourceModel.findAndCount({
				where: {
					status: isEmpty(props.status) ? Not(2) : props.status
				},
				order: {
					id: 'ASC'
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
}
