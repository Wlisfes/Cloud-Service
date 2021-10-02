import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Brackets } from 'typeorm'
import { isEmpty } from 'class-validator'
import { UserEntity } from '@/entity/user.entity'
import { ChunkEntity } from '@/entity/chunk.entity'
import * as DTO from './chunk.interface'

@Injectable()
export class ChunkService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(ChunkEntity) private readonly chunkModel: Repository<ChunkEntity>
	) {}

	/**创建版本资源-授权管理端**/
	public async nodeCreateChunk(props: DTO.NodeCreateChunkParameter, uid: number) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			await this.chunkModel.update({ status: 1 }, { status: 2 })
			const node = await this.chunkModel.create({
				url: props.url,
				path: props.path,
				name: props.name,
				version: props.version,
				status: 1,
				user
			})
			await this.chunkModel.save(node)

			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**版本资源信息-授权管理端**/
	public async nodeChunk(props: DTO.NodeChunkParameter, uid: number) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			const node = await this.chunkModel.findOne({ where: { id: props.id, user } })
			if (!node) {
				throw new HttpException('版本资源不存在', HttpStatus.BAD_REQUEST)
			}

			return node
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**版本资源列表-授权管理端**/
	public async nodeChunks(props: DTO.NodeChunksParameter, uid: number) {
		try {
			const [list = [], total = 0] = await this.chunkModel
				.createQueryBuilder('chunk')
				.leftJoinAndSelect('chunk.user', 'user')
				.where(
					new Brackets(Q => {
						Q.andWhere('user.uid = :uid', { uid })

						if (!isEmpty(props.status)) {
							Q.andWhere('chunk.status = :status', { status: props.status })
						}
					})
				)
				.orderBy({ 'chunk.id': 'DESC' })
				.skip((props.page - 1) * props.size)
				.take(props.size)
				.getManyAndCount()

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
