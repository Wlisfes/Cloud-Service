import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In, Not } from 'typeorm'
import { isEmpty } from 'class-validator'
import { CloudEntity } from '@/entity/cloud.entity'
import { CloudSourceEntity } from '@/entity/cloud.source.entity'
import * as DTO from './cloud.interface'

@Injectable()
export class CloudService {
	constructor(
		@InjectRepository(CloudEntity) private readonly cloudModel: Repository<CloudEntity>,
		@InjectRepository(CloudSourceEntity) private readonly sourceModel: Repository<CloudSourceEntity>
	) {}

	/**创建音视频**/
	public async nodeCreateCloud(props: DTO.NodeCreateCloudParameter) {
		try {
			let parent = null,
				source = []
			const cloud = await this.cloudModel.findOne({
				where: [
					{ title: props.title, status: 0 },
					{ title: props.title, status: 1 }
				]
			})
			if (cloud) {
				throw new HttpException('媒体标题已存在', HttpStatus.BAD_REQUEST)
			}

			if (props.parent) {
				parent = await this.cloudModel.findOne({
					where: [
						{ id: props.parent, status: 0 },
						{ id: props.parent, status: 1 }
					]
				})
				if (!parent) {
					throw new HttpException('父级媒体不存在', HttpStatus.BAD_REQUEST)
				} else if (parent.status !== 1) {
					throw new HttpException('父级媒体已禁用', HttpStatus.BAD_REQUEST)
				}
			}

			if (props.source?.length > 0) {
				source = await this.sourceModel.find({ where: { id: In(props.source) } })
				source.forEach(element => {
					if (props.source.some(id => id === element.id)) {
						if (element.status !== 1) {
							throw new HttpException(`标签 ${element.name} 已禁用`, HttpStatus.BAD_REQUEST)
						}
					} else {
						throw new HttpException(`标签 ${element.name} 不存在`, HttpStatus.BAD_REQUEST)
					}
				})
			}

			const newCloud = await this.cloudModel.create({
				type: props.type,
				title: props.title,
				cover: props.cover,
				key: props.key || null,
				name: props.name || null,
				path: props.path || null,
				status: props.status || 0,
				order: props.order || 0,
				size: props.size || 0,
				description: props.description || null,
				source,
				parent
			})
			await this.cloudModel.save(newCloud)

			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**音视频信息**/
	public async nodeCloud(props: DTO.NodeCloudParameter) {
		try {
			const cloud = await this.cloudModel.findOne({
				where: { id: props.id },
				relations: ['source', 'parent', 'children']
			})
			if (!cloud) {
				throw new HttpException('音视频媒体不存在', HttpStatus.BAD_REQUEST)
			}
			return cloud
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**音视频列表**/
	public async nodeClouds(props: DTO.NodeCloudsParameter) {
		try {
			const [list = [], total = 0] = await this.cloudModel.findAndCount({
				where: {
					status: isEmpty(props.status) ? Not(2) : props.status
				},
				order: {
					createTime: 'DESC',
					order: 'DESC'
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
