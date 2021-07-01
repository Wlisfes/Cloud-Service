import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common'
import { RPCClient, CLIENT, CLIENT_CONFIG, Config } from './aliyun.provider'
import * as DTO from './aliyun.interface'
import * as day from 'dayjs'

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

	/**创建上传凭证**/
	async createUpload(prosp: DTO.CreateUpload): Promise<DTO.AliyunCreateUploadResponse> {
		try {
			return await this.client.request('CreateUploadVideo', { ...prosp }, {})
		} catch (e) {
			throw new HttpException(e.data.Message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**刷新上传凭证**/
	async refreshUpload(prosp: DTO.RefreshUpload): Promise<DTO.AliyunRefreshUploadResponse> {
		try {
			return await this.client.request('RefreshUploadVideo', { ...prosp }, {})
		} catch (e) {
			throw new HttpException(e.data.Message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**获取转码模板列表**/
	async transferTmplate(): Promise<DTO.TransferTmplateResponse> {
		try {
			const response: any = await this.client.request('ListTranscodeTemplateGroup', {}, {})
			if (response?.TranscodeTemplateGroupList?.length > 0) {
				const list = response.TranscodeTemplateGroupList.map(k => ({
					...k,
					Name: k.TranscodeTemplateGroupId === 'VOD_NO_TRANSCODE' ? '不转码' : k.Name,
					IsDefault: k.IsDefault === 'Default',
					Locked: k.Locked === 'Enabled',
					ModifyTime: day(k.ModifyTime).format('YYYY-MM-DD HH:mm:ss'),
					CreationTime: day(k.CreationTime).format('YYYY-MM-DD HH:mm:ss')
				}))
				return { RequestId: response?.RequestId, list }
			}
			return { RequestId: response?.RequestId, list: [] }
		} catch (e) {
			throw new HttpException(e.data.Message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**分类列表**/
	async assetsSource(props: DTO.AssetsSource): Promise<DTO.AssetsSourceResponse> {
		try {
			const { RequestId, SubTotal, SubCategories } = await this.client.request('GetCategories', {
				CateId: props.CateId || -1,
				PageNo: 1,
				PageSize: 100
			})
			return { RequestId, SubTotal, list: SubCategories?.Category || [] }
		} catch (e) {
			throw new HttpException(e.data.Message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**获取播放凭证**/
	async createPlayAuth(prosp: DTO.CreatePlayAuth): Promise<DTO.AliyunCreatePlayAuthResponse> {
		try {
			const response: any = await this.client.request('GetVideoPlayAuth', { ...prosp }, {})
			if (response?.VideoMeta?.VideoId) {
				const { PlayAuth, RequestId, VideoMeta } = response
				return {
					PlayAuth,
					RequestId,
					props: { ...VideoMeta, Duration: Math.floor(VideoMeta.Duration * 100) / 100 }
				}
			}
			throw new HttpException('VideoId 不存在', HttpStatus.BAD_REQUEST)
		} catch (e) {
			throw new HttpException(e.data.Message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**获取播放信息**/
	async createPlayInfo(prosp: DTO.CreatePlayInfo): Promise<DTO.AliyunCreatePlayInfoResponse> {
		try {
			const { RequestId, VideoBase, PlayInfoList } = await this.client.request(
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
			if (PlayInfoList?.PlayInfo?.length) {
				const list = PlayInfoList.PlayInfo.map(k => ({
					...k,
					CreationTime: day(k.CreationTime).format('YYYY-MM-DD HH:mm:ss'),
					ModificationTime: day(k.ModificationTime).format('YYYY-MM-DD HH:mm:ss')
				}))
				return {
					RequestId,
					base: {
						...VideoBase,
						Duration: Math.floor(VideoBase.Duration * 100) / 100,
						CreationTime: day(VideoBase.CreationTime).format('YYYY-MM-DD HH:mm:ss')
					},
					list: list
				}
			}
			return {
				RequestId,
				base: {
					...VideoBase,
					Duration: Math.floor(VideoBase.Duration * 100) / 100,
					CreationTime: day(VideoBase.CreationTime).format('YYYY-MM-DD HH:mm:ss')
				},
				list: []
			}
		} catch (e) {
			throw new HttpException(e.data.Message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
