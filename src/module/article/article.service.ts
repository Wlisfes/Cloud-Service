import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Brackets } from 'typeorm'
import { isEmpty } from 'class-validator'
import { UtilsService } from '@/module/utils/utils.service'
import { CommentService } from '@/module/comment/comment.service'
import { ArticleEntity } from '@/entity/article.entity'
import { SourceEntity } from '@/entity/source.entity'
import { UserEntity } from '@/entity/user.entity'
import { extractStr } from '@/utils/common'
import * as DTO from './article.interface'

@Injectable()
export class ArticleService {
	constructor(
		private readonly utilsService: UtilsService,
		private readonly commentService: CommentService,
		@InjectRepository(ArticleEntity) private readonly articleModel: Repository<ArticleEntity>,
		@InjectRepository(SourceEntity) private readonly sourceModel: Repository<SourceEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>
	) {}

	/**创建文章-授权管理端**/
	public async nodeCreateArticle(props: DTO.NodeCreateArticleParameter, uid: number) {
		try {
			//验证标签
			const useSource = (props.source || []).map(async id => {
				return await this.utilsService.validator({
					message: `标签id ${id}`,
					empty: true,
					delete: true,
					disable: true,
					model: this.sourceModel,
					options: { where: { id } }
				})
			})

			const user = await this.userModel.findOne({ where: { uid } })
			const Article = await this.articleModel.create({
				title: props.title,
				cover: props.cover,
				content: props.content,
				html: props.html,
				description: extractStr(props.html),
				url: props.url || null,
				status: isEmpty(props.status) ? 1 : props.status,
				order: props.order || 0,
				source: await Promise.all(useSource),
				user
			})
			await this.articleModel.save(Article)

			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**修改文章-授权管理端**/
	public async nodeUpdateArticle(props: DTO.NodeUpdateArticleParameter) {
		try {
			//验证文章
			const article = await this.utilsService.validator({
				message: '文章',
				empty: true,
				model: this.articleModel,
				options: { where: { id: props.id }, relations: ['source'] }
			})

			//验证标签
			await Promise.all(
				(props.source || []).map(async id => {
					return await this.utilsService.validator({
						message: `标签id ${id}`,
						empty: true,
						model: this.sourceModel,
						options: { where: { id } }
					})
				})
			)

			//删除已有的标签
			await this.articleModel
				.createQueryBuilder()
				.relation('source')
				.of(article)
				.addAndRemove(
					props.source,
					article.source.map(k => k.id)
				)

			await this.articleModel.update(
				{ id: props.id },
				{
					title: props.title,
					cover: props.cover,
					content: props.content,
					html: props.html,
					description: extractStr(props.html),
					url: props.url || null,
					status: isEmpty(props.status) ? article.status : props.status,
					order: props.order || 0
				}
			)

			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**切换文章状态-授权管理端**/
	public async nodeArticleCutover(props: DTO.NodeArticleCutoverParameter) {
		try {
			const article = await this.utilsService.validator({
				message: '文章',
				empty: true,
				delete: true,
				model: this.articleModel,
				options: { where: { id: props.id } }
			})
			await this.articleModel.update({ id: props.id }, { status: article.status ? 0 : 1 })

			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**文章信息-授权管理端**/
	public async nodeArticle(props: DTO.NodeArticleParameter) {
		try {
			return await this.utilsService.validator({
				message: '文章',
				empty: true,
				model: this.articleModel,
				options: { where: { id: props.id }, relations: ['source', 'user'] }
			})
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**文章信息-客户端**/
	public async nodeClientArticle(props: DTO.NodeArticleParameter) {
		try {
			const article = await this.utilsService.validator({
				message: '文章',
				empty: true,
				delete: true,
				disable: true,
				model: this.articleModel,
				options: { where: { id: props.id }, relations: ['source', 'user'] }
			})

			//浏览量加1
			await this.articleModel.update({ id: props.id }, { browse: article.browse + 1 })

			return article
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**文章列表-授权管理端**/
	public async nodeArticles(props: DTO.NodeArticlesParameter, uid: number) {
		try {
			const [list = [], total = 0] = await this.articleModel
				.createQueryBuilder('article')
				.leftJoinAndSelect('article.source', 'source')
				.leftJoinAndSelect('article.user', 'user')
				.where(
					new Brackets(Q => {
						Q.where('user.uid = :uid', { uid })

						if (isEmpty(props.status)) {
							Q.andWhere('article.status != :status', { status: 2 })
						} else {
							Q.andWhere('article.status = :status', { status: props.status })
						}

						if (props.title) {
							Q.andWhere('article.title LIKE :title', { title: `%${props.title}%` })
							Q.orWhere('article.description LIKE :description', { description: `%${props.title}%` })
						}

						if (props.source) {
							Q.andWhere('source.id = :source', { source: props.source })
						}
					})
				)
				.orderBy({ 'article.id': 'DESC', 'article.order': 'DESC' })
				.skip((props.page - 1) * props.size)
				.take(props.size)
				.getManyAndCount()

			/**查询顶层评论总数**/
			const uesComment = list.map(async item => {
				return {
					...item,
					comment: await this.commentService.nodeCommentTotal({ one: item.id, type: 1 })
				}
			})

			return {
				size: props.size,
				page: props.page,
				total,
				list: await Promise.all(uesComment)
			}
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**文章关键字搜索**/
	public async nodeSearchArticles(props: DTO.NodeArticlesParameter) {
		try {
			const [list = [], total = 0] = await this.articleModel
				.createQueryBuilder('t')
				.select(['t.id', 't.title'])
				.where(
					new Brackets(Q => {
						if (!isEmpty(props.status)) {
							Q.andWhere('t.status = :status', { status: props.status })
						}

						if (props.title) {
							Q.andWhere('t.title LIKE :title', { title: `%${props.title}%` })
							Q.orWhere('t.description LIKE :description', { description: `%${props.title}%` })
						}
					})
				)
				.orderBy({ 't.id': 'DESC', 't.order': 'DESC' })
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

	/**文章列表-客户端**/
	public async nodeClientArticles(props: DTO.NodeClientArticlesParameter) {
		try {
			const [list = [], total = 0] = await this.articleModel
				.createQueryBuilder('t')
				.leftJoinAndSelect('t.source', 'source')
				.leftJoinAndSelect('t.user', 'user')
				// .leftJoinAndMapMany('t.star', 't.source', 'star', 'star.name = :name', { name: 'Git' })
				.loadRelationCountAndMap(
					't.star',
					't.source'
					// 'star', qb =>
					// qb.andWhere('star.name = :name', { name: 'Git' })
				)
				.where(
					new Brackets(Q => {
						Q.andWhere('t.status = :status', { status: 1 })

						if (props.title) {
							Q.andWhere('t.title LIKE :title', { title: `%${props.title}%` })
							Q.orWhere('t.description LIKE :description', { description: `%${props.title}%` })
						}

						if (props.source) {
							Q.andWhere('source.id = :source', { source: props.source })
						}
					})
				)
				.orderBy({ 't.id': 'DESC' })
				.skip((props.page - 1) * props.size)
				.take(props.size)
				.getManyAndCount()

			/**查询顶层评论总数**/
			const uesComment = list.map(async item => {
				return {
					...item,
					comment: await this.commentService.nodeCommentTotal({ one: item.id, type: 1 })
				}
			})

			return {
				size: props.size,
				page: props.page,
				total,
				list: await Promise.all(uesComment)
			}
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**删除文章-授权管理端**/
	public async nodeDeleteArticle(props: DTO.NodeDeleteArticleParameter) {
		try {
			await this.utilsService.validator({
				message: '文章',
				empty: true,
				delete: true,
				model: this.articleModel,
				options: { where: { id: props.id } }
			})
			await this.articleModel.update({ id: props.id }, { status: 2 })

			return { message: '删除成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
