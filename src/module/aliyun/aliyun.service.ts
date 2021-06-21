import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common'
import { RPCClient, CLIENT, CLIENT_CONFIG, Config } from './aliyun.provider'
import * as DTO from './aliyun.dto'

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
	createUpload(prosp: DTO.CreateUpload) {
		return new Promise((resolve, reject) => {
			this.client
				.request('CreateUploadVideo', { ...prosp }, {})
				.then(response => resolve(response))
				.catch(e => reject(new HttpException(e.data.Message, HttpStatus.BAD_REQUEST)))
		})
	}

	//刷新上传凭证
	refreshUpload(prosp: DTO.RefreshUpload) {
		return new Promise((resolve, reject) => {
			this.client
				.request('RefreshUploadVideo', { VideoId: prosp.VideoId }, {})
				.then(response => resolve(response))
				.catch(e => reject(new HttpException(e.data.Message, HttpStatus.BAD_REQUEST)))
		})
	}
}
