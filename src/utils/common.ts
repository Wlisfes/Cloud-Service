/**权限筛选 losence不存在 resence存在**/
export function inteRole(list: any[], role: number[]) {
	const losence = []
	const resence = []
	for (const mode of list) {
		const left = []
		const right = []
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
