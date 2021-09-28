import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In, Brackets } from 'typeorm'
import { isEmpty } from 'class-validator'
import { PartnerEntity } from '@/entity/partner.entity'
import { PosterEntity } from '@/entity/poster.entity'
import { UserEntity } from '@/entity/user.entity'
import { extractStr } from '@/utils/common'
import * as DTO from './partner.interface'

@Injectable()
export class PartnerService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(PosterEntity) private readonly posterModel: Repository<PosterEntity>,
		@InjectRepository(PartnerEntity) private readonly partnerModel: Repository<PartnerEntity>
	) {}

	/**创建日志-授权管理端**/
	public async nodeCreatePartner(props: DTO.NodeCreatePartnerParameter, uid: number) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			const cover = await this.posterModel.find({
				where: {
					id: In(props.cover)
				},
				select: ['id', 'type', 'url', 'path']
			})
			const node = await this.partnerModel.create({
				title: props.title,
				content: props.content,
				html: props.html,
				description: extractStr(props.html),
				status: props.status || 1,
				cover,
				user
			})
			await this.partnerModel.save(node)

			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**修改日志-授权管理端**/
	public async nodeUpdatePartner(props: DTO.NodeUpdatePartnerParameter) {
		try {
			const node = await this.partnerModel.findOne({ where: { id: props.id } })
			const cover = await this.posterModel.find({
				where: {
					id: In(props.cover)
				},
				select: ['id', 'type', 'url', 'path']
			})

			if (!node) {
				throw new HttpException('日志不存在', HttpStatus.BAD_REQUEST)
			} else if (node.status === 2) {
				throw new HttpException('日志已删除', HttpStatus.BAD_REQUEST)
			}

			await this.partnerModel.update(
				{ id: props.id },
				{
					title: props.title,
					content: props.content,
					html: props.html,
					description: extractStr(props.html),
					status: isEmpty(props.status) ? node.status : props.status,
					cover
				}
			)

			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**切换日志状态-授权管理端**/
	public async nodePartnerCutover(props: DTO.NodePartnerCutoverParameter) {
		try {
			const node = await this.partnerModel.findOne({ where: { id: props.id } })
			if (!node) {
				throw new HttpException('日志不存在', HttpStatus.BAD_REQUEST)
			} else if (node.status === 2) {
				throw new HttpException('日志已删除', HttpStatus.BAD_REQUEST)
			}
			await this.partnerModel.update(
				{ id: props.id },
				{
					status: node.status ? 0 : 1
				}
			)

			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**日志信息-授权管理端**/
	public async nodePartner(props: DTO.NodePartnerParameter) {
		try {
			const node = await this.partnerModel.findOne({ where: { id: props.id } })
			if (!node) {
				throw new HttpException('日志不存在', HttpStatus.BAD_REQUEST)
			} else if (node.status === 2) {
				throw new HttpException('日志已删除', HttpStatus.BAD_REQUEST)
			}

			return node
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**日志列表-授权管理端**/
	public async nodePartners(props: DTO.NodePartnersParameter) {
		try {
			const [list = [], total = 0] = await this.partnerModel
				.createQueryBuilder('partner')
				.where(
					new Brackets(Q => {
						if (isEmpty(props.status)) {
							Q.andWhere('partner.status != :status', { status: 2 })
						} else {
							Q.andWhere('partner.status = :status', { status: props.status })
						}
					})
				)
				.orderBy({ 'partner.id': 'DESC' })
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

	/**日志列表-客户端**/
	public async nodeClientPartners(props: DTO.NodeClientPartnersParameter) {
		try {
			const [list = [], total = 0] = await this.partnerModel
				.createQueryBuilder('partner')
				.leftJoinAndSelect('partner.user', 'user')
				.where(
					new Brackets(Q => {
						Q.andWhere('partner.status = :status', { status: 1 })
					})
				)
				.orderBy({ 'partner.id': 'DESC' })
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

	/**删除日志-授权管理端**/
	public async nodeDeletePartner(props: DTO.NodeDeletePartnerParameter) {
		try {
			const node = await this.partnerModel.findOne({ where: { id: props.id } })
			if (!node) {
				throw new HttpException('日志不存在', HttpStatus.BAD_REQUEST)
			} else if (node.status === 2) {
				throw new HttpException('日志已删除', HttpStatus.BAD_REQUEST)
			}
			await this.partnerModel.update({ id: props.id }, { status: 2 })

			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
