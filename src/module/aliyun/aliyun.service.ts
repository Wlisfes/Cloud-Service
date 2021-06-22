import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common'
import { RPCClient, CLIENT, CLIENT_CONFIG, Config } from './aliyun.provider'
import * as DTO from './aliyun.interface'

export class AliyunBase {
	protected client: RPCClient
	protected options: Config
}

@Injectable()
export class AliyunService extends AliyunBase {
	constructor(
		@Inject(CLIENT_CONFIG) public readonly options: Config,
		@Inject(CLIENT) public readonly client: RPCClient
	) {
		super()
	}

	//创建上传凭证
	async createUpload(prosp: DTO.CreateUpload): Promise<DTO.AliyunInterface> {
		try {
			return await this.client.request('CreateUploadVideo', { ...prosp }, {})
		} catch (e) {
			throw new HttpException(e.data.Message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//刷新上传凭证
	async refreshUpload(prosp: DTO.RefreshUpload): Promise<DTO.AliyunInterface> {
		try {
			return await this.client.request('RefreshUploadVideo', { VideoId: prosp.VideoId }, {})
		} catch (e) {
			throw new HttpException(e.data.Message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
