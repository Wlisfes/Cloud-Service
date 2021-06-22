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
	async createUpload(prosp: DTO.CreateUpload): Promise<DTO.AliyunCreateUploadResponse> {
		try {
			return await this.client.request('CreateUploadVideo', { ...prosp }, {})
		} catch (e) {
			throw new HttpException(e.data.Message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//刷新上传凭证
	async refreshUpload(prosp: DTO.RefreshUpload): Promise<DTO.AliyunRefreshUploadResponse> {
		try {
			return await this.client.request('RefreshUploadVideo', { ...prosp }, {})
		} catch (e) {
			throw new HttpException(e.data.Message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//获取播放凭证
	async createPlayAuth(prosp: DTO.CreatePlayAuth): Promise<DTO.AliyunCreatePlayAuthResponse> {
		try {
			return await this.client.request('GetVideoPlayAuth', { ...prosp }, {})
		} catch (e) {
			throw new HttpException(e.data.Message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	//获取播放信息
	async createPlayInfo(prosp: DTO.CreatePlayInfo): Promise<DTO.AliyunCreatePlayInfoResponse> {
		try {
			return await this.client.request(
				'GetPlayInfo',
				{
					VideoId: prosp.VideoId,
					AuthTimeout: prosp.AuthTimeout,
					Formats: 'mp4,flv',
					OutputType: 'cdn',
					StreamType: 'video,audio',
					Definition: 'HD,4k',
					ResultType: 'Multiple'
				},
				{}
			)
		} catch (e) {
			throw new HttpException(e.data.Message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
