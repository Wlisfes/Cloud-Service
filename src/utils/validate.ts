/**字符串转换number数组**/
export function toArrayNumber({ value }) {
	if (value && Array.isArray(value)) {
		return value
	} else if (value && typeof value === 'string') {
		return value.split(',').map(k => Number(k)) || []
	} else {
		return []
	}
}
