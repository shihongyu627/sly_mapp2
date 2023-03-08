<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="container">
		<view class="assets-wrap">
			<view class="assets-block">
				<view class="assets-tips"><text>风险提示：确认申请后您的资产将被清空且不可找回!</text></view>
				<view class="assets-box assets-account">
					<view class="assets-title">
						<text class="color-base-bg"></text>
						<text>账户资产</text>
					</view>
					<view class="assets-list">
						<view class="assets-li">
							<view>{{ member_info.point }}</view>
							<view>柚币</view>
						</view>
						<view class="assets-li">
							<view>￥{{ member_info.balance_money }}</view>
							<view>现金余额</view>
						</view>
						<view class="assets-li">
							<view>￥{{ member_info.balance }}</view>
							<view>储值余额</view>
						</view>
						<view class="assets-li">
							<view>{{ accountInfo.member_coupon_count }}</view>
							<view>优惠券</view>
						</view>
					</view>
				</view>
				<view class="assets-box assets-order">
					<view class="assets-title">
						<text class="color-base-bg"></text>
						<text>订单资产</text>
					</view>
					<view class="assets-list">
						<view class="assets-li">
							<view>{{ accountInfo.order_pay_count }}</view>
							<view>待发货</view>
						</view>
						<view class="assets-li">
							<view>{{ accountInfo.order_delivery_count }}</view>
							<view>待收货</view>
						</view>
						<view class="assets-li">
							<view>{{ accountInfo.order_refund_count }}</view>
							<view>退款中</view>
						</view>
					</view>
				</view>

				<view v-if="member_info.is_fenxiao == 1" class="assets-box assets-fenxiao">
					<view class="assets-title">
						<text class="color-base-bg"></text>
						<text>分销资产</text>
					</view>
					<view class="assets-list">
						<view class="assets-li">
							<view>￥{{ fenxiao_info.account }}</view>
							<view>可提现佣金</view>
						</view>
						<view class="assets-li">
							<view>￥{{ fenxiao_info.account_withdraw_apply }}</view>
							<view>提现中佣金</view>
						</view>
						<view class="assets-li">
							<view>{{ accountInfo.fenxiao_order_count }}</view>
							<view>待结算订单</view>
						</view>
					</view>
				</view>
			</view>
			<view class="assets-btn">
				<button type="primary" @click="prev">上一步</button>
				<button class="color-base-bg" @click="submit">确认申请</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			accountInfo: {},
			member_info: {},
			fenxiao_info: {}
		};
	},
	onLoad(option) {
		
		

		if (option.back) this.back = option.back;

		// 判断登录
		if (!uni.getStorageSync('token')) {
			this.$util.redirectTo('/pages_tool/login/login');
		} else {
			this.getAccountInfo();
		}
	},
	methods: {
		getAccountInfo() {
			this.$api.sendRequest({
				url: '/membercancel/api/membercancel/accountInfo',
				success: res => {
					if (res.code >= 0) {
						this.accountInfo = res.data;
						this.member_info = res.data.member_info;
						if (res.data.member_info.is_fenxiao == 1) {
							this.fenxiao_info = res.data.fenxiao_info;
						}
					}
				}
			});
		},
		prev() {
			this.$util.redirectTo('/pages_tool/member/cancellation');
		},
		submit() {
			uni.showModal({
				title: '风险提示',
				content: '确定要注销当前账号吗？',
				confirmColor: '#000000',
				success: res => {
					if (res.confirm) {
						this.$api.sendRequest({
							url: '/membercancel/api/membercancel/apply',
							success: rres => {
								let cancellation_condition = rres.data.is_audit;
								if (rres.code >= 0) {
									this.$util.redirectTo('/pages_tool/member/cancelstatus', { condition: cancellation_condition });
								} else {
									this.$util.showToast({
										title: rres.message
									});
								}
							}
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.assets-wrap {
	.assets-block {
		padding: 0 24rpx;
		padding-top: 30rpx;
	}

	.assets-tips {
		width: 100%;
		height: 56rpx;
		background-color: rgba(250, 106, 0, 0.2);
		border-radius: 6rpx;
		line-height: 56rpx;
		padding-left: 20rpx;
		box-sizing: border-box;

		text {
			color: #fa6a00;
			font-size: 28rpx;
		}
	}

	.assets-box {
		width: 100%;
		margin-top: 30rpx;
		background-color: #ffffff;
		border-radius: 6rpx;
		padding: 20rpx;
		box-sizing: border-box;

		.assets-title {
			display: flex;
			align-items: center;

			text:nth-child(1) {
				width: 6rpx;
				height: 28rpx;
				border-radius: 2rpx;
			}

			text:nth-child(2) {
				margin-left: 20rpx;
				font-size: 28rpx;
				line-height: 28rpx;
				padding-top: 8rpx;
				font-weight: 600;
			}
		}

		.assets-list {
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
			padding: 0 26rpx 35rpx;
			margin-top: 53rpx;

			.assets-li {
				text-align: center;

				view:nth-child(1) {
					font-size: 36rpx;
					line-height: 36rpx;
				}

				view:nth-child(2) {
					font-size: 28rpx;
					line-height: 28rpx;
					color: #666666;
					margin-top: 30rpx;
				}
			}
		}
	}

	.assets-btn {
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
		}

		button[type='primary'] {
			background-color: unset !important;
			color: #333333;
			border: 2rpx solid #dddddd;
		}

		button:nth-child(2) {
			color: var(--btn-text-color);
		}
	}
}
</style>
