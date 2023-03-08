<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="nc-modify-content">
		<view class="modify">
			<view>
				<image v-if="newImg == ''" :src="$util.loadimg(memberImg)" mode="aspectFill"></image>
				<image v-else :src="$util.loadimg(newImg)" mode="aspectFill" />
			</view>
		</view>
		<view class="opection-box">
			<block v-if="newImg == ''"><button type="primary" @click="chooseImage()">点击上传</button></block>
			<block v-else>
				<view class="opec">
					<button size="mini" type="primary" @click="save()">确认保存</button>
					<button size="mini" type="primary" @click="chooseImage()">重新上传</button>
				</view>
			</block>
		</view>

		<img-cropping selWidth="300" selHeight="300" @upload="myUpload" ref="imgCropping"></img-cropping>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import imgCropping from '@/components/img-cropping/cropping.vue';

	export default {
		data() {
			return {
				memberImg: '',
				newImg: '',
				imgurl: '',
				type: ''
			};
		},
		components: {
			imgCropping
		},
		onShow() {
			if (!uni.getStorageSync('token')) {}
			this.initGetHeading();
		},
		onLoad(option) {
			if (option.type) {
				this.type = option.type
			}
		},
		methods: {
			initGetHeading() {
				this.$api.sendRequest({
					url: '/dealer/api/dealer/detail',
					success: res => {
						if (res.code == 0) {
							if (this.type == 'wechat_qrcode') {
								this.memberImg = res.data.wechat_qrcode;
								this.imgurl = res.data.wechat_qrcode;
							} else {
								this.memberImg = res.data.alipay_qrcode;
								this.imgurl = res.data.alipay_qrcode;
							}
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			chooseImage() {
				this.$refs.imgCropping.fSelect();
			},
			//上传返回图片
			myUpload(rsp) {
				let app_type = 'h5';
				let app_type_name = 'H5';

				// #ifdef MP
				app_type = 'weapp';
				app_type_name = 'weapp';
				// #endif
				uni.request({
					url: this.$config.baseUrl + '/api/upload/headimgBase64',
					method: 'POST',
					data: {
						app_type: app_type,
						app_type_name: app_type_name,
						images: rsp.base64
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded;application/json'
					},
					dataType: 'json',
					responseType: 'text',
					success: res => {
						if (res.data.code == 0) {
							this.newImg = res.data.data.pic_path;
							this.imgurl = res.data.data.pic_path;
						}
					},
					fail: () => {
						this.$util.showToast({
							title: '上传失败'
						});
					}
				});
			},
			previewImage() {
				uni.previewImage({
					current: 0,
					urls: this.images
				});
			},
			save() {
				let formData = {}
				if (this.type == 'wechat_qrcode') {
					formData.wechat_qrcode = this.imgurl
				} else {
					formData.alipay_qrcode = this.imgurl
				}
				this.$api.sendRequest({
					url: '/dealer/api/dealer/upDealerInfo',
					data: formData,
					success: res => {
						this.$util.showToast({
							title: res.message
						});
						if (res.code == 0) {
							uni.navigateBack()
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		overflow: hidden;
	}

	.modify {
		position: relative;
		padding-top: 50rpx;

		view {
			width: 500rpx;
			height: 500rpx;
			margin: 0 auto;
			overflow: hidden;
			background-color: #ffffff;
			border: 4rpx solid #ffffff;
			border-radius: 100%;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.opection-box {
		margin-top: 50rpx;
	}

	.opec {
		width: 100%;
		padding: 0 10%;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}
</style>
