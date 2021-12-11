import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import * as DTO from './utils.interface'
import * as day from 'dayjs'

@Injectable()
export class UtilsService {
	/**时间格式化**/
	public format(date?: Date | number | string, format?: string) {
		return day(date).format(format || 'YYYY-MM-DD HH:mm:ss')
	}

	/**数组转树结果**/
	public listToTree(list: any[]) {
		var map: any = {},
			node,
			tree = [],
			i
		for (i = 0; i < list.length; i++) {
			map[list[i].id] = list[i]
			list[i].children = []
		}
		for (i = 0; i < list.length; i += 1) {
			node = list[i]
			if (node.parent) {
				if (map[node.parent]?.children) {
					map[node.parent].children.push(node)
				}
			} else {
				tree.push(node)
			}
		}
		return tree
	}

	/**验证某个数据模型是否有效**/
	public async validator<Entity>(props: DTO.NodeValidator<Entity>): Promise<Entity> {
		try {
			const node = await props.model.findOne(props.options)
			if (!props.empty) {
				return node
			} else if (!node) {
				throw new HttpException(`${props.message}不存在`, HttpStatus.BAD_REQUEST)
			} else if (props.disable && (node as any).status === 0) {
				throw new HttpException(`${props.message}已禁用`, HttpStatus.BAD_REQUEST)
			} else if (props.delete && (node as any).status === 2) {
				throw new HttpException(`${props.message}已删除`, HttpStatus.BAD_REQUEST)
			}
			return node
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
