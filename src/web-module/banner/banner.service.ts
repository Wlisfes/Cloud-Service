import { Injectable, HttpService } from '@nestjs/common'

@Injectable()
export class BannerService {
	constructor(private readonly httpService: HttpService) {}

	//代理bing壁纸
	async getBannerBing() {
		try {
			const response = await this.httpService
				.request({
					url: `https://cn.bing.com/HPImageArchive.aspx`,
					method: 'GET',
					params: {
						format: 'js',
						idx: -1,
						n: 8,
						mkt: 'zh-CN'
					}
				})
				.toPromise()

			return response.data.images
		} catch (error) {}
	}
}
