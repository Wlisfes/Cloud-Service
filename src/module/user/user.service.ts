import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'

@Injectable()
export class UserService {
	constructor(@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>) {}

	//创建用户
	async createUser(props) {
		try {
			const newUser = await this.userModel.create({
				nickname: '妖雨纯',
				email: '876451336@qq.com',
				mobile: null,
				avatar: null
			})

			return await this.userModel.save(newUser)
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//修改用户
	async updateUser(props) {
		try {
			await this.userModel.update(
				{
					uid: 1624099363625
				},
				{
					mobile: '18676361342'
				}
			)
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//用户列表
	async findUsers(props) {
		try {
			return await this.userModel.find()
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
