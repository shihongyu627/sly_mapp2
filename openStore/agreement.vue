<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="process-wrap">
		<view class="process-header" v-if="agreement.img">
			<image class="process-header" :src="$util.loadimg(agreement.img)" mode="widthFix"></image>
		</view>
		<!-- <view class="process-header" v-if="agreement.img" :style="{'background-image':'url(' + $util.loadimg(agreement.img) + ')'}">
			<view class="process-title">
				开店流程
			</view>
			<view class="process-text">
				签约前不会产生任何费用
			</view>
		</view> -->
		<view class="content" :data-theme="themeStyle" v-if="document.content">
			<rich-text :nodes="$util.richText(document.content)"></rich-text>
		</view>
		<view class="footer-box">
			<view class="footer-btnLeft" @click="goBack">
				取消
			</view>
			<view class="footer-btnRight" @click="goApplyStep">
				已知晓，同意
			</view>
		</view>
		<ns-login ref="login"></ns-login>
	</view>
</template>
<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		components: {},
		data() {
			return {
				agreement: {},
				document: {},
			};
		},
		mixins: [globalConfig],
		onLoad(data) {
			if (data.source_member) {
				uni.setStorageSync('source_member', data.source_member)
			}
			this.$langConfig.title('开店流程');
			this.getListData()
		},
		methods: {
			goApplyStep() {
				uni.navigateTo({
					url: '/openStore/applyStep'
				})
				// uni.redirectTo({
				// 	url: '/openStore/applyStep'
				// })
			},
			goBack() {
				this.$util.redirectTo('/pages/member/index');
			},
			getListData() {
				this.$api.sendRequest({
					url: '/dealer/api/config/storeagreement',
					data: {},
					success: res => {
						let msg = res.message;
						if (res.code == 0) {
							this.agreement = res.data.agreement || {}
							this.document = res.data.document || {}
						} else {
							this.$util.showToast({
								title: msg
							});
						}

					},
					fail: res => {}
				});
			},
		}
	};
</script>

<style scoped>
	.process-wrap {
		height: 100%;
		/* background: #fff; */
		padding-bottom: 180rpx;
		box-sizing: border-box;
	}

	.process-header {
		width: 100%;
		/* height: 132px; */
		/* background-image: url('http://sly.shanliangyou888.com/upload/1/common/images/20220907/20220907043943166253998333217.png'); */
		background-size: 100% 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.process-title {
		font-size: 22px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FFFFFF;
		opacity: 1;
		margin-left: 15px;
	}

	.process-text {
		font-size: 13px;
		font-family: PingFang SC;
		font-weight: normal;
		color: #FFFFFF;
		opacity: 0.6;
		margin-left: 15px;
	}

	.content {
		/* padding-left: 20rpx; */
		/* padding-right: 20rpx; */
		/* background: #fff; */
	}

	.footer-box {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		padding-left: 20rpx;
		padding-right: 20rpx;
		padding-bottom: 40rpx;
		padding-top: 20rpx;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 0;
		background: #fff;
	}

	.footer-btnLeft {
		width: 150px;
		height: 48px;
		border: 1px solid #9E9E9E;
		opacity: 1;
		border-radius: 24px;
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 48px;
		color: #454652;
		opacity: 1;
		text-align: center;
	}

	.footer-btnRight {
		width: 150px;
		height: 48px;
		background: #1189F4;
		opacity: 1;
		border-radius: 24px;
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 48px;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
	}
</style>
