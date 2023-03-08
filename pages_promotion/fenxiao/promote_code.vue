<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="container">
		<swiper class="swiper" @change="getIndex">
			<swiper-item v-for="(item, index) in poster" :key="index">
				<view class="swiper-item">
					<view class="poster-wrap"><image :src="$util.img(item)" mode="widthFix" :show-menu-by-longpress="true"></image></view>
				</view>
			</swiper-item>
		</swiper>

		<!-- #ifdef H5 -->
		<view class="tips">长按识别图中二维码</view>
		<!--  #endif -->

		<!-- #ifdef MP -->
		<view class="btn color-base-bg color-base-border" @click="save">保存海报</view>
		<!--  #endif -->

		<uni-popup ref="popupDialog" :custom="true" :mask-click="false">
			<view class="dialog-popup">
				<view class="title">提示</view>
				<view class="message">您拒绝了保存图片到相册的授权请求，无法保存图片到相册，如需正常使用，请授权之后再进行操作。</view>
				<view class="action-wrap">
					<view @click="closeDialog">取消</view>
					<view><button type="default" open-type="openSetting" @opensetting="closeDialog" hover-class="none">立即授权</button></view>
				</view>
			</view>
		</uni-popup>

		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import { Weixin } from 'common/js/wx-jssdk.js';
import uniPopup from '@/components/uni-popup/uni-popup.vue';

export default {
	data() {
		return {
			poster: [],
			fenxiaoInfo: {},
			posterIndex: 0,
			//海报模板id
			templateId: ['default'],
			mpShareData: null //小程序分享数据
		};
	},
	components: {
		uniPopup
	},
	methods: {
		/**
		 * 获取分销海报
		 */
		getPoster(id) {
			return new Promise((resolve, reject) => {
				this.$api.sendRequest({
					url: '/fenxiao/api/fenxiao/poster',
					data: {
						page: '/pages/index/index',
						qrcode_param: JSON.stringify({}),
						template_id: id
					},
					success: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						if (res.code >= 0) {
							resolve(res.data.path);
						}
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						reject();
					}
				});
			});
		},
		getIndex(e) {
			this.posterIndex = e.detail.current;
		},
		save() {
			// #ifdef MP
			uni.downloadFile({
				url: this.$util.img(this.poster[this.posterIndex]),
				success: res => {
					if (res.statusCode === 200) {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								this.$util.showToast({
									title: '保存成功'
								});
							},
							fail: res => {
								if (res.errMsg == 'saveImageToPhotosAlbum:fail auth deny' || res.errMsg == 'saveImageToPhotosAlbum:fail:auth denied') {
									this.$refs.popupDialog.open();
								} else {
									this.$util.showToast({
										title: '保存失败，请稍后重试'
									});
								}
							}
						});
					} else {
						this.$util.showToast({ title: '下载失败' });
					}
				},
				fail: res => {
					this.$util.showToast({ title: '下载失败' });
				}
			});
			// #endif
		},
		getFenxiaoDetail() {
			this.poster = [];
			try {
				this.templateId.forEach((item, index) => {
					this.getPoster(item)
						.then(resolve => {
							this.poster.push(resolve);
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						})
						.catch(reject => {
							throw reject;
						});
				});
			} catch {
				this.$util.showToast({ title: '海报生成失败' });
			}
		},

		closeDialog() {
			this.$refs.popupDialog.close();
		}
	},
	onLoad(option) {
		// setTimeout( () => {
		// 	if (this.addonIsExist && !this.addonIsExist.fenxiao) {
		// 		this.$util.showToast({
		// 			title: '商家未开启分销',
		// 			mask: true,
		// 			duration: 2000
		// 		});
		// 		setTimeout(() => {
		// 			this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
		// 		}, 2000);
		// 		return;
		// 	}
		// }, 1000);
		if (option.templateId) {
			this.templateId = option.templateId.split(',');
		}
		
		
		if (uni.getStorageSync('token')) {
			this.getFenxiaoDetail();
		} else {
			setTimeout(() => {
				this.$refs.login.open('/pages_promotion/fenxiao/promote_code');
			});
		}
	},
	onShow() {
		//小程序分享
		// #ifdef MP-WEIXIN
		this.$util.getMpShare().then(res => {
			this.mpShareData = res;
		});
		// #endif
	},
	//分享给好友
	onShareAppMessage() {
		return this.mpShareData.appMessage;
	},
	//分享到朋友圈
	onShareTimeline() {
		return this.mpShareData.timeLine;
	},
	watch: {
		storeToken: function(nVal, oVal) {
			if (nVal) {
				this.getFenxiaoDetail();
			}
		}
	},
	computed: {
		storeToken() {
			return this.$store.state.token;
		}
	}
};
</script>

<style lang="scss">
.container {
	width: 100vw;
	min-height: 100vh;
	background-color: #f5f5f5;
}
.poster-wrap {
	padding: 40rpx 0;
	width: calc(100vw - 80rpx);
	margin: 0 40rpx;
	line-height: 1;

	image {
		border-radius: 20rpx;
		overflow: hidden;
		width: 100%;
	}
}
.swiper {
	height: 1170rpx;
}
.btn {
	margin: 0 80rpx;
	margin-top: 30rpx;
	height: 80rpx;
	line-height: 80rpx;
	border-radius: $border-radius;
	color: #fff;
	text-align: center;
}
.tips {
	text-align: center;
	font-size: $font-size-base;
	color: #999;
	font-weight: 600;
	margin-top: 20rpx;
}
.dialog-popup {
	width: 580rpx;
	background: #fff;
	box-sizing: border-box;
	border-radius: 10rpx;
	overflow: hidden;
	height: initial;

	.title {
		padding: 30rpx 30rpx 0 30rpx;
		text-align: center;
		font-size: 32rpx;
		font-weight: bold;
	}

	.message {
		padding: 0 30rpx;
		color: #666;
		text-align: center;
		font-size: $font-size-base;
		line-height: 1.3;
		margin-top: 30rpx;
	}

	.action-wrap {
		margin-top: 50rpx;
		height: 80rpx;
		display: flex;
		border-top: 2rpx solid #eee;

		& > view {
			flex: 1;
			text-align: center;
			line-height: 80rpx;

			&:first-child {
				border-right: 2rpx solid #eee;
				color: #999;
			}

			button {
				border: none;
				line-height: 80rpx;
				padding: 0;
				margin: 0;
				width: 100%;
				height: 100%;
			}
		}
	}
}
</style>
