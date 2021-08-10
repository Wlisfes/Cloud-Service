import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Not, Like } from 'typeorm'
import { isEmpty } from 'class-validator'
import { SourceEntity } from '@/entity/source.entity'
import * as DTO from './source.interface'

@Injectable()
export class SourceService {
	constructor(@InjectRepository(SourceEntity) private readonly sourceModel: Repository<SourceEntity>) {}

	/**创建标签**/
	public async nodeCreateSource(props: DTO.NodeCreateSourceParameter) {
		try {
			const source = await this.sourceModel.findOne({
				where: [
					{ name: props.name, status: 0 },
					{ name: props.name, status: 1 }
				]
			})
			if (source) {
				throw new HttpException('分类标签已存在', HttpStatus.BAD_REQUEST)
			}
			const newSource = await this.sourceModel.create({
				name: props.name,
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
}
