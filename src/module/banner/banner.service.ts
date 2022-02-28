import { Injectable, HttpService, HttpException, HttpStatus } from '@nestjs/common'
import { map } from 'rxjs/operators'
import * as DTO from './banner.interface'

@Injectable()
export class BannerService {
	constructor(private readonly httpService: HttpService) {}

	//代理bing壁纸
	async nodeBanner() {
		try {
			return await this.httpService
				.request<{ images: Array<DTO.BingResponse> }>({
					url: `https://cn.bing.com/HPImageArchive.aspx`,
					method: 'GET',
					params: {
						format: 'js',
						idx: -1,
						n: 8,
						mkt: 'zh-CN'
					}
				})
				.pipe(
					map(response => {
						return (response.data.images || []).map(k => ({
							start: k.startdate,
							end: k.enddate,
							cover: `https://www.bing.com${k.url}`,
							name: k.copyright,
							search: k.copyrightlink
						}))
					})
				)
				.toPromise()
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
