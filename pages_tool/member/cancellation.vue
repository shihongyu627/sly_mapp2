<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="container">
		<view class="agreement-box">
			<view class="agreement-intro">
				<view class="align-center agreement-title">{{ agreement.title }}</view>
				<rich-text class="agreement-content" :nodes="agreement.content"></rich-text>
			</view>

			<view class="agreement-btn">
				<view class="align-center agreement-btn-select">
					<text v-if="isSelect" class="iconfont icondui color-base-text" @click="changeSelect"></text>
					<text v-else class="iconfont iconyuan_checkbox" @click="changeSelect"></text>
					<text class="agreement-text" @click="changeSelect">勾选即表示您已阅读并同意本协议</text>
				</view>
				<button class="btn color-base-bg" @click="next">下一步</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			agreement: {},
			isSelect: false
		};
	},
	onLoad(option) {

		if (option.back) this.back = option.back;
		// 判断登录
		if (!uni.getStorageSync('token')) {
			this.$util.redirectTo('/pages_tool/login/login');
		} else {
			this.getCancelAgreement();
		}
	},
	methods: {
		getCancelAgreement() {
			this.$api.sendRequest({
				url: '/membercancel/api/membercancel/agreement',
				success: res => {
					if (res.code >= 0) {
						this.agreement = res.data;
					}
				}
			});
		},
		changeSelect() {
			this.isSelect = this.isSelect == true ? false : true;
		},
		next() {
			if (this.isSelect) {
				this.$util.redirectTo('/pages_tool/member/assets');
			} else {
				this.$util.showToast({
					title: '请先勾选同意协议'
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.agreement-box {
	.align-center {
		text-align: center;
	}

	.agreement-intro {
		height: calc(100vh - 210rpx);
		padding-top: 40rpx;
		padding-left: 40rpx;
		padding-right: 40rpx;
		box-sizing: border-box;
		overflow-y: auto;

		.agreement-title {
			font-size: 32rpx;
			line-height: 60rpx;
			margin-bottom: 10rpx;
		}

		.agreement-content {
			font-size: 24rpx;
			line-height: 44rpx;
		}
	}

	.agreement-btn {
		position: fixed;
		width: 100%;
		height: 210rpx;
		bottom: 0;
		padding-top: 16rpx;
		box-sizing: border-box;
		text-align: center;

		.agreement-btn-select {
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.agreement-btn-select .iconfont {
			color: #838383;
		}

		.agreement-text {
			font-size: 28rpx;
			color: #838383;
			margin-left: 10rpx;
		}

		button {
			display: inline-block;
			margin-top: 20rpx;
			color: var(--btn-text-color);
			font-size: 28rpx;
			width: 300rpx;
			height: 80rpx;
			line-height: 80rpx;
		}
	}
}
</style>
