import { Injectable } from '@nestjs/common'
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
}
