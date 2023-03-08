<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="container">
		<view class="cancelstatus-wrap">
			<view class="cancelstatus-block">
				<view class="cancelstatus-box">
					<view class="cancelstatus-box-sort color-base-bg">1</view>
					<view class="cancelstatus-box-con">
						<view class="cancelstatus-box-name">提交申请</view>
						<view class="cancelstatus-box-info">您已提交申请，请耐心等待~</view>
					</view>
					<view class="cancelstatus-box-line color-base-bg"></view>
				</view>
				<view class="cancelstatus-box">
					<view class="cancelstatus-box-sort color-base-bg">2</view>
					<view class="cancelstatus-box-con">
						<view class="cancelstatus-box-name">等待审核</view>
						<view class="cancelstatus-box-info">等待审核中，审核通过后您的账号将直接被删除</view>
					</view>
					<view class="cancelstatus-box-line color-base-bg"></view>
				</view>
				<view class="cancelstatus-box cancelstatus-box-last">
					<view class="cancelstatus-box-sort color-base-bg opacity" :class="{ 'opacity-4': condition == 1 }">3</view>
					<view class="cancelstatus-box-con">
						<view class="cancelstatus-box-name">审核通过，注销完成</view>
						<view class="cancelstatus-box-info">您已成功注销账号，期待下一次与您相遇</view>
					</view>
				</view>
			</view>
			<view class="cancelstatus-btn" v-if="condition == '1'">
				<button type="primary" @click="back">返回</button>
				<button v-if="state != 1" class="color-base-bg" @click="revoke">撤销申请</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			state: 0,
			condition: ''
		};
	},
	onLoad(option) {
		// 判断登录
		if (!uni.getStorageSync('token')) {
			this.$util.redirectTo('/pages_tool/login/login');
		} else {
			this.getStatus();
		}

		// 撤销审核状态
		this.condition = option.condition;
	},
	onShow() {
		this.getStatus();
	},
	methods: {
		getStatus() {
			this.$api.sendRequest({
				url: '/membercancel/api/membercancel/info',
				success: res => {
					if (res.code >= 0 && res.data) {
						this.state = res.data.status;
						if (this.state == -1) {
							this.$util.redirectTo('/pages_tool/member/cancelrefuse');
						}
					}

					if (res.code == -1) {
						uni.setStorageSync('token', '');
						this.$util.redirectTo('/pages/index/index', {}, 'reLaunch');
					}
				}
			});
		},
		back() {
			this.$util.redirectTo('/pages/member/index');
		},

		revoke() {
			{
				uni.showModal({
					title: '风险提示',
					content: '确定要撤销申请吗？',
					confirmColor: '#000000',
					success: res => {
						if (res.confirm) {
							this.$api.sendRequest({
								url: '/membercancel/api/membercancel/cancelApply',
								success: res => {
									if (res.code >= 0) {
										this.$util.redirectTo('/pages/member/index');
									}
								}
							});
						}
					}
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.cancelstatus-wrap {
	.cancelstatus-block {
		padding: 50rpx;
	}

	.cancelstatus-box {
		position: relative;
		display: flex;
		height: 200rpx;

		.cancelstatus-box-sort {
			width: 36rpx;
			height: 36rpx;
			text-align: center;
			line-height: 36rpx;
			border-radius: 50%;
			color: #ffffff;
			margin-right: 17rpx;
			font-size: 24rpx;
		}

		.opacity {
			opacity: 1;

			&-4 {
				opacity: 0.4;
			}
		}

		.cancelstatus-box-name {
			font-size: 32rpx;
			line-height: 32rpx;
			margin-top: 3rpx;
		}

		.cancelstatus-box-info {
			margin-top: 15rpx;
			color: #666666;
			font-size: 28rpx;
		}

		.cancelstatus-box-line {
			position: absolute;
			width: 2rpx;
			height: 164rpx;
			top: 36rpx;
			left: 18rpx;
		}

		&.cancelstatus-box-last {
			height: 80rpx;
		}
	}

	.cancelstatus-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 150rpx;

		button {
			width: 300rpx;
			height: 80rpx;
			font-size: 28rpx;
			line-height: 80rpx;
			margin: 0 15rpx;
			border-radius: $border-radius;
		}

		button[type='primary'] {
			background-color: unset !important;
			color: #333333;
			border: 2rpx solid #dddddd;
		}

		button:nth-child(2) {
			color: #ffffff;
		}
	}
}
</style>
