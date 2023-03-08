<template>
	<view class="process-wrap">
<!-- 		<view class="process-header" v-if="agreement.img">
			<image class="process-header" :src="$util.loadimg(agreement.img)" mode="widthFix"></image>
		</view> -->
		<view class="content" :data-theme="themeStyle" v-if="document.content">
			<ns-rich-text :contentArr="$util.getVideo(document.content)"></ns-rich-text>
		</view>
	</view>
</template>
<script>
	export default {
		components: {},
		data() {
			return {
				agreement: {},
				document: {},
			};
		},
		mixins: [],
		onLoad() {
			this.getListData()
		},
		methods: {
			getListData() {
				this.$api.sendRequest({
					url: '/dealer/api/config/storetimeline',
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
		padding-bottom: 60px;
		box-sizing: border-box;
	}

	.process-header {
		width: 100%;
		/* height: 132px; */
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

	.menu-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
	}

	.menu-item {
		height: 40px;
		position: relative;
		width: 90px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.menu-title {
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: normal;
		color: #65666E;
		opacity: 1;
	}

	.menu-titles {
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #1189F4;
		opacity: 1;
	}

	.menu-br {
		position: absolute;
		width: 40px;
		height: 4px;
		background: #1189F4;
		opacity: 1;
		border-radius: 2px;
		bottom: 0;
		align-self: 25px;
	}

	.content-titleBox {
		width: 230px;
		height: 24px;
		position: relative;
		margin: 0 auto;
		margin-top: 30px;
	}

	.content-title {
		width: 230px;
		height: 24px;
		text-align: center;
		font-size: 17px;
		font-weight: 500;
		color: #000000;
		opacity: 1;
		line-height: 24px;
	}

	.content-icon {
		width: 230px;
		height: 24px;
		opacity: 1;
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 10;
	}

	.step-box {
		width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		margin-top: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding-left: 24rpx;
		padding-right: 24rpx;
		box-sizing: border-box;
	}

	.step-item {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: center;
		justify-content: center;
	}

	.step-top {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		width: 100%;
		position: relative;
	}

	.step-left {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 3px;
		height: 100%;
	}

	.step-radius {
		width: 10px;
		height: 10px;
		background: #FFFFFF;
		border: 1px solid #A6ABBA;
		border-radius: 50%;
		opacity: 1;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 10;
	}

	.step-br {
		height: 100%;
		border-left: 1px dashed #707070;
		opacity: 1;
		box-sizing: border-box;
	}

	.step-right {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		border-left: 1px dashed #707070;
		padding-left: 30rpx;
		box-sizing: border-box;
		margin-left: 5px;
		min-height: 28px;
	}

	.step-rights {
		border-left: 1px dashed #fff;
	}

	.step-title {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #1189F4;
		opacity: 1;
		text-align: center;
		margin-top: 20px;
	}

	.step-desc {
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		width: 200px;
		line-height: initial;
	}

	.step-time {
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: 500;
		color: #65666E;
		opacity: 1;
		line-height: initial;
	}
</style>
