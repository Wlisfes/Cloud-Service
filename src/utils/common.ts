/**权限筛选 losence不存在 resence存在**/
export function inteRole<T extends { id: number; children: Array<T> }>(
	list: Array<T>,
	role: Array<number>
): { losence: Array<number>; resence: Array<number> } {
	const losence: Array<number> = []
	const resence: Array<number> = []
	for (const mode of list) {
		const left: Array<number> = []
		const right: Array<number> = []
		for (const node of mode.children) {
			if (role.includes(node.id)) {
				left.push(node.id)
			} else {
				right.push(node.id)
			}
		}
		if (left.length > 0) {
			resence.push(...left, mode.id)
		} else {
			losence.push(mode.id)
		}
		losence.push(...right)
	}
	return { losence, resence }
}

/**Markdown语法文字描述提取**/
export function extractStr(value: string): string {
	if (!value) {
		return ''
	} else {
		const reg = new RegExp('<.+?>', 'g')
		const str = value
		return str
			.replace(reg, '')
			.replace(/\n/g, '')
			.slice(0, 255)
	}
}
