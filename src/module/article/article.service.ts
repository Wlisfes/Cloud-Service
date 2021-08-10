import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ArticleEntity } from '@/entity/article.entity'
import { SourceEntity } from '@/entity/source.entity'

@Injectable()
export class ArticleService {
	constructor(
		@InjectRepository(ArticleEntity) private readonly articleModel: Repository<ArticleEntity>,
		@InjectRepository(SourceEntity) private readonly sourceModel: Repository<SourceEntity>
	) {}

	/**创建文章**/
	public async nodeCreateArticle() {
		try {
			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
