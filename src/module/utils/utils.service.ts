import { Injectable } from '@nestjs/common'
import * as day from 'dayjs'

@Injectable()
export class UtilsService {
	/**时间格式化**/
	public format(date?: Date | number | string, format?: string) {
		return day(date).format(format || 'YYYY-MM-DD HH:mm:ss')
	}
}
