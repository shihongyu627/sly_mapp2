<template>
	<view class="order-container" :class="{ 'safe-area': isIphoneX }" :data-theme="themeStyle">

		<view class="dealerInfo-box">
			<view class="way-right">
				<view class="way-top">
					<img class='way-icon' src="../../common/img/qrcode.png" alt="" mode="aspectFill" />
					<view class="way-title">
						{{title}}
					</view>
				</view>
				<view class="other-info">
					<view class="other-info-box" v-for="(i, t) in imgList" :key="t">
						<image class="other-info-image" :src="$util.img(i)" mode="aspectFill"
							@click="preview(i, index)"></image>
						<view class="imgDel" @click="deleteImg(i, index)"><text
								class=" icon iconfont icondelete"></text></view>
					</view>
					<view class="other-info-box active" @click="addImg()">
						<text class="icon iconfont iconzhaoxiangji"></text>
						<text>{{ imgList.length ? 9 - imgList.length : 0 }}/9</text>
					</view>
				</view>
			</view>
			<view class="way-top">
				<view class="way-title">
					备注
				</view>
			</view>
			<view class="popup-itemContent">
				<textarea class="textareaBox" v-model="remarks" @input="oninputContent" maxlength="30"
					placeholder="请输入，最多30个字" placeholder-style="color:#b1b2b6; font-size:30rpx;"></textarea>
			</view>
		</view>

		<view class="footer-box">
			<view class="footer-btn" @click="onSubmit">
				提交
			</view>
		</view>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		components: {},
		mixins: [globalConfig],
		data() {
			return {
				isIphoneX: false,
				isSub: false,
				imgList: [],
				type: '',
				title: '',
				id: '',
				remarks: ''
			};
		},
		onLoad(data) {
			this.type = data.type || ''
			this.id = data.id || ''
			let title = data.type == 'invoice' ? '上传发票' : data.type == 'pay' ? '上传凭证' : '上传发票'

			this.title = title
			uni.setNavigationBarTitle({
				title: title
			})
		},
		methods: {
			oninputContent(e) {
				const {
					value
				} = e.target;
				console.log(value);
				this.remarks = value
			},
			onSubmit() {
				let data = {
					id: this.id,
					gallery: this.imgList.join(','),
					remarks: this.remarks
				};
				let url = ''
				if (this.type == 'invoice') {
					url = '/dealer/api/tuijian/upInvoice'
				} else if (this.type == 'pay') {
					url = '/dealer/api/tuijian/upPay'
				} else if (this.type == 'luodi') {
					url = '/dealer/api/luodi/upInvoice'
				}
				if (!url) {
					return
				}
				this.$api.sendRequest({
					url: url,
					data: data,
					success: res => {
						this.$util.showToast({
							title: res.message
						});
						if (res.code == 0) {
							uni.navigateBack({
								delta: 1
							});
						} else {}
					},
					fail: res => {}
				});
			},
			//添加图片
			addImg() {
				this.$util.upload(9, {
					path: 'evaluateimg'
				}, res => {
					console.log(res);
					let arr = this.imgList
					this.imgList = [...arr, ...res]
					console.log(this.imgList, 99988);
				});
			},
			//删除图片
			deleteImg(i, j) {
				this.imgList.splice(i, 1);
			},
			// 图片预览
			preview(i, j) {
				let urls = this.imgList[j];
				for (let k = 0; k < urls.length; k++) {
					urls[k] = this.$util.img(urls[k])
				}
				uni.previewImage({
					urls: urls,
					current: i
				});
			},
		}
	};
</script>

<style lang="scss">
</style>
<style scoped lang="scss" scoped>
	.dealerInfo-box {
		width: 100%;
		min-height: 222rpx;
		background: #FFFFFF;
		border-radius: 0 20rpx 0 20rpx;
		opacity: 1;
		padding-bottom: 40rpx;
		margin: 0 auto;
		padding-left: 32rpx;
		padding-right: 32rpx;
		padding-top: 40rpx;
		box-sizing: border-box;
	}

	.way-top {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.way-icon {
		width: 22px;
		height: 22px;
		background: #FA5D34;
		opacity: 1;
		border-radius: 11px;
		margin-right: 10px;
	}

	.way-title {
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		margin-right: 10px;
	}

	.way-text {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 500;
		color: #65666E;
		opacity: 1;
	}

	.way-left {
		font-size: 12px;
		font-weight: 500;
		color: #000000;
		opacity: 1;
		width: 230px;
	}

	.way-copy {
		font-size: 12px;
		font-weight: 500;
		color: #1189F4;
		opacity: 1;
	}

	.way-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 280px;
	}

	.way-code {
		display: flex;
		flex-direction: row;
		align-items: center;

	}

	.code-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.code-items {
		margin-left: 90px;
	}

	.code-title {
		font-size: 14px;
		font-weight: 500;
		color: #65666E;
		opacity: 1;
	}

	.code-img {
		width: 88px;
		height: 88px;
		opacity: 1;
		border-radius: 0px;
		background: #999;
		margin-top: 5px;
	}

	.other-info {
		width: 100%;
		padding: 0 $padding;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		margin-top: $margin-updown;
	}

	.other-info-box {
		width: 170rpx;
		height: 170rpx;
		margin-right: $margin-both;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-right: 40rpx;
		margin-bottom: 30rpx;
		position: relative;


		.iconfont {
			font-size: 60rpx;
			color: #898989;
			line-height: 1;
		}

		text {
			line-height: 1;
		}

		.imgDel {
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			right: -20rpx;
			top: -20rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.iconfont {
				font-size: $font-size-toolbar;
			}
		}
	}

	.other-info-image {
		width: 100%;
		border-radius: $border-radius;
	}

	.other-info-box.active {
		border: 1rpx dashed #898989;
	}

	.other-info-box.active:active {
		background: rgba($color: #cccccc, $alpha: 0.6);
	}

	.other-info-box:nth-child(4n) {
		margin-right: 0;
	}

	.footer-box {
		width: 100%;
		height: 140rpx;
		background: #FFFFFF;
		box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.01);
		opacity: 1;
		border-radius: 0px;
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.footer-btn {
		width: 710rpx;
		height: 100rpx;
		background: #1189F4;
		opacity: 1;
		border-radius: 24px;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 100rpx;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
	}

	.popup-itemContent {
		height: 180rpx;
		background: #FBFBFB;
		border-radius: 12rpx 12rpx 12rpx 12rpx;
		opacity: 1;
		margin: 0 auto;
		margin-top: 20rpx;
		padding: 20rpx;
		box-sizing: border-box;

	}

	.textareaBox {
		height: 140rpx;
	}
</style>
