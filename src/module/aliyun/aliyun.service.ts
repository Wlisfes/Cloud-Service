import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common'
import { RPCClient, CLIENT, CLIENT_CONFIG, Config } from './aliyun.provider'
import { UtilsService } from '@/module/utils/utils.service'
import * as DTO from './aliyun.interface'

@Injectable()
export class AliyunService {
	constructor(
		@Inject(CLIENT_CONFIG) public readonly options: Config,
		@Inject(CLIENT) public readonly client: RPCClient,
		private readonly utilsService: UtilsService
	) {}

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
			const { RequestId, TranscodeTemplateGroupList }: any = await this.client.request(
				'ListTranscodeTemplateGroup',
				{},
				{}
			)
			if (TranscodeTemplateGroupList?.length > 0) {
				const list = TranscodeTemplateGroupList.map(k => ({
					...k,
					Name: k.TranscodeTemplateGroupId === 'VOD_NO_TRANSCODE' ? '不转码' : k.Name,
					IsDefault: k.IsDefault === 'Default',
					Locked: k.Locked === 'Enabled',
					ModifyTime: this.utilsService.format(k.ModifyTime),
					CreationTime: this.utilsService.format(k.ModifyTime)
				}))
				return { RequestId, list }
			}
			return { RequestId, list: [] }
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
			const base = {
				...VideoBase,
				Duration: Math.floor(VideoBase.Duration * 100) / 100,
				CreationTime: this.utilsService.format(VideoBase.CreationTime)
			}
			if (PlayInfoList?.PlayInfo?.length) {
				const list = PlayInfoList.PlayInfo.map(k => ({
					...k,
					CreationTime: this.utilsService.format(k.CreationTime),
					ModificationTime: this.utilsService.format(k.ModificationTime)
				}))
				return { RequestId, base, list }
			}
			return { RequestId, base, list: [] }
		} catch (e) {
			throw new HttpException(e.data.Message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
