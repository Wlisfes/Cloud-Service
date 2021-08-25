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
		const str = value
			.replace(/(\*\*|__)(.*?)(\*\*|__)/g, '') //全局匹配内粗体
			.replace(/(\**\**|__)(.*?)(\**\**|__)/g, '') //全局匹配内粗体
			.replace(/\!\[[\s\S]*?\]\([\s\S]*?\)/g, '') //全局匹配图片
			.replace(/\[[\s\S]*?\]\([\s\S]*?\)/g, '') //全局匹配连接
			.replace(/<\/?.+?\/?>/g, '') //全局匹配内html标签
			.replace(/(\*)(.*?)(\*)/g, '') //全局匹配内联代码块
			.replace(/`{1,2}[^`](.*?)`{1,2}/g, '') //全局匹配内联代码块
			.replace(/```([\s\S]*?)```[\s]*/g, '') //全局匹配代码块
			.replace(/\~\~(.*?)\~\~/g, '') //全局匹配删除线
			.replace(/[\s]*[-\*\+]+(.*)/g, '') //全局匹配无序列表
			.replace(/[\s]*[0-9]+\.(.*)/g, '') //全局匹配有序列表
			.replace(/(#+)(.*)/g, '') //全局匹配标题
			.replace(/(>+)(.*)/g, '') //全局匹配摘要
			.replace(/\r\n/g, '') //全局匹配换行
			.replace(/\n/g, '') //全局匹配换行
			.replace(/\s/g, '') //全局匹配空字符;

		return str.slice(0, 155)
	}
}
