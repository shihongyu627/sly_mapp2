<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="container">
		<template v-if="payInfo.pay_status != undefined">
			<view class="result-box">
				<template v-if="payInfo.pay_status||payInfo.order_type==2">
					<image :src="$util.img('public/uniapp/pay/pay_success.png')" mode="widthFix" class="result-image">
					</image>
					<view class="msg">{{ title }}</view>
					<view class="pay-amount" v-if="type != 'store'">
						￥
						<text>{{ payInfo.pay_money|moneyFormat }}</text>
					</view>
				</template>
				<template v-else>
					<image :src="$util.img('public/uniapp/pay/pay_fail.png')" mode="widthFix" class="result-image">
					</image>
					<view class="msg">{{ $lang('paymentFail') }}</view>
				</template>
				<view class="action">
					<!-- <view class="btn" @click="$util.redirectTo('/pages/member/index', {}, 'reLaunch')" v-if="token">
					{{ $lang('memberCenter') }}
				</view> -->
					<template v-if="token">
						<view v-if="paySource == 'recharge'" class="btn" @click="toRecharge()">充值记录</view>
						<view v-else-if="paySource == 'membercard'" class="btn" @click="toCard()">会员卡</view>
						<view v-else-if="paySource == 'presale'" class="btn" @click="toPresaleOrder()">查看订单</view>
						<view v-else-if="paySource == 'subcard'" class="btn" @click="toSubcardOrder()">查看订单</view>
						<view v-else-if="paySource == 'giftcard'" class="btn" @click="toOrder()">查看订单</view>
						<view v-else-if="paySource == 'pointexchange'" class="btn" @click="toExchangeOrder()">查看订单
						</view>
						<view v-else class="btn" @click="toOrderDetail(payInfo.order_id)">查看订单</view>
					</template>
					<view class="btn" @click="goHome()">{{ $lang('goHome') }}</view>
				</view>
			</view>
			<!-- 消费奖励 -->
			<view class="consume-box" v-if="addonIsExist.memberconsume && consumeStatus == 1 && payInfo.pay_status">
				<view class="consume-head">
					<view class="consume-line"></view>
					<view class="consume-head-text">恭喜获得以下奖励</view>
					<view class="consume-line"></view>
					<view class="clear"></view>
				</view>
				<view class="consume-list">
					<view class="consume-item" v-if="consumeInfo.point_num > 0">
						<view class="consume-type">柚币</view>
						<view class="consume-value color-base-text">{{ consumeInfo.point_num }}</view>
						<view class="consume-btn btn color-base-bg color-base-border"
							v-if="consumeInfo.return_point_status == 'pay'" @click="consume('point')">查看</view>
					</view>
					<view class="consume-item" v-if="consumeInfo.growth_num > 0">
						<view class="consume-type">成长值</view>
						<view class="consume-value color-base-text">{{ consumeInfo.growth_num }}</view>
						<view class="consume-btn btn color-base-bg color-base-border"
							v-if="consumeInfo.return_point_status == 'pay'" @click="consume('growth')">查看</view>
					</view>
					<view class="consume-item" v-if="consumeInfo.coupon_list.length > 0">
						<view class="consume-type">优惠券</view>
						<view class="consume-value color-base-text">{{ consumeInfo.coupon_list.length }}</view>
						<view class="consume-btn btn color-base-bg color-base-border"
							v-if="consumeInfo.return_point_status == 'pay'" @click="consume('coupon')">查看</view>
					</view>
					<view class="clear"></view>
				</view>
				<view class="consume-remark" v-if="consumeInfo.return_point_status == 'receive'">
					注：订单收货后即可获得
				</view>
				<view class="consume-remark" v-if="consumeInfo.return_point_status == 'complete'">
					注：订单完成后即可获得
				</view>
			</view>


			<ns-goods-recommend></ns-goods-recommend>
		</template>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				payInfo: {},
				outTradeNo: '',
				token: null,
				paySource: '',
				consumeInfo: {},
				consumeStatus: 0,
				type: '',
				title: '支付成功'
			};
		},
		onLoad(option) {
			if (option.code) this.outTradeNo = option.code;
			if (option.type) this.type = option.type;
			if (option.type == 'store') {
				this.title = '订单提交成功'
			}
			this.paySource = uni.getStorageSync('paySource');
		},
		onShow() {
			if (uni.getStorageSync('token')) this.token = uni.getStorageSync('token');
			this.getPayInfo();
			this.getConsume();
		},
		methods: {
			consume(type) {
				switch (type) {
					case 'point':
						this.$util.redirectTo('/pages_tool/member/point_detail', {});
						break;
					case 'growth':
						this.$util.redirectTo('/pages_tool/member/level', {});
						break;
					case 'coupon':
						this.$util.redirectTo('/pages_tool/member/coupon', {});
						break;
					default:
						this.$util.redirectTo('/pages/member/index', {}, 'reLaunch');
						break;

				}
			},
			getConsume() {
				this.$api.sendRequest({
					url: '/memberconsume/api/config/info',
					data: {
						out_trade_no: this.outTradeNo
					},
					success: res => {
						if (res.code >= 0 && res.data) {
							let reward = res.data.value;
							if (res.data.is_use && (reward.point_num > 0 || reward.growth_num > 0 || reward
									.coupon_list.length)) {
								this.consumeStatus = res.data.is_use;
								this.consumeInfo = res.data.value;
							}
						}
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			getPayInfo() {
				this.$api.sendRequest({
					url: '/api/pay/info',
					data: {
						out_trade_no: this.outTradeNo
					},
					success: res => {
						if (res.code >= 0 && res.data) {
							this.payInfo = res.data;
							this.payInfo.pay_money = parseFloat(res.data.pay_money);
							this.payInfo.pay_money += parseFloat(res.data.balance);
							this.payInfo.pay_money += parseFloat(res.data.balance_money);
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						} else {
							this.$util.showToast({
								title: '未获取到支付信息！'
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages/index/index', {}, 'reLaunch');
							}, 1500);
						}
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			goHome() {
				this.$util.redirectTo('/pages/index/index', {}, 'reLaunch');
			},
			toOrderDetail(id) {
				if (this.payInfo.order_type == 2) {
					this.$util.redirectTo('/order/detail_pickup', {
						order_id: id
					}, 'redirectTo');
				} else if (this.payInfo.order_type == 3) {
					this.$util.redirectTo('/order/detail_local_delivery', {
						order_id: id
					}, 'redirectTo');
				} else if (this.payInfo.order_type == 4) {
					this.$util.redirectTo('/pages_tool/order/detail_virtual', {
						order_id: id
					}, 'redirectTo');
				} else {
					this.$util.redirectTo('/order/detail', {
						order_id: id
					}, 'redirectTo');
				}
			},
			toOrder(id) {
				this.$util.redirectTo('/pages_promotion/giftcard/order_list', {}, 'redirectTo');
				uni.setStorageSync('paySource', '');
			},
			toRecharge() {
				this.$util.redirectTo('/pages_tool/recharge/order_list', {}, 'redirectTo');
				uni.setStorageSync('paySource', '');
			},
			toCard() {
				this.$util.redirectTo('/pages_tool/member/card', {}, 'redirectTo');
				uni.setStorageSync('paySource', '');
			},
			toPresaleOrder() {
				this.$util.redirectTo('/pages_promotion/presale/order_list', {}, 'redirectTo');
				uni.setStorageSync('paySource', '');
			},
			toSubcardOrder() {
				this.$util.redirectTo('/pages_tool/member/card/order/list/list', {}, 'redirectTo');
				uni.setStorageSync('paySource', '');
			},
			toExchangeOrder() {
				this.$util.redirectTo('/pages_promotion/point/order_list', {}, 'redirectTo');
				uni.setStorageSync('paySource', '');
			}
		}
	};
</script>

<style lang="scss">
	.consume-box {
		padding: $padding;
		margin-top: 60rpx;
		width: 100%;

		.consume-line {
			background: #bfbfbf;
			float: left;
			width: 15%;
			text-align: center;
			height: 2rpx;
			box-sizing: border-box;
			margin: 0 15% 0 5%;

			&:first-child {
				margin: 0 5% 0 15%;
			}
		}

		.consume-head-text {
			width: 30%;
			float: left;
			text-align: center;
			margin-top: -26rpx;
			color: $color-title;
			font-size: $font-size-base;
		}

		.consume-item {
			background-color: #FFFFFF;
			float: left;
			width: 29%;
			margin-left: 3.25%;
			text-align: center;
			margin-top: 45rpx;
			padding: $padding 0;
			color: $color-title;
			font-size: $font-size-base;

			.consume-value {
				font-size: $font-size-toolbar;
				font-weight: bold;
			}

			.consume-btn {
				color: #fff;
				width: 100rpx;
				border-radius: $border-radius;
				margin: 4rpx auto;
			}
		}

		.consume-remark {
			color: $color-tip;
			font-size: $font-size-tag;
			padding: 10rpx 20rpx;
		}
	}

	.clear {
		clear: both;
	}

	.container {

		display: flex;
		flex-direction: column;
		align-items: center;

		.result-box {
			padding-top: 94rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: #FFFFFF;
			width: 100%;
			padding-bottom: 40rpx;
		}

		.result-image {
			width: 160rpx;
			height: 120rpx;
		}

		.msg {
			font-size: 32rpx;
			margin-top: 30rpx;
			height: $font-size-toolbar;
			line-height: $font-size-toolbar;
			font-weight: bold;
		}

		.pay-amount {
			font-size: 30rpx;
			margin-top: 70rpx;
			font-weight: 600;
			height: 50rpx;
			line-height: 50rpx;
			color: var(--main-color);

			text {
				font-size: 50rpx;
			}
		}

		.action {
			width: 100%;
			height: 80rpx;
			display: flex;
			justify-content: center;
			box-sizing: border-box;
			margin-top: 90rpx;

			.btn {
				font-size: $font-size-base;
				width: 200rpx;
				height: 70rpx;
				line-height: 66rpx;
				text-align: center;
				border-radius: 70rpx;
				border: 1px solid $color-tip;
				box-sizing: border-box;

				&:last-child {
					margin-left: 100rpx;
				}
			}
		}
	}
</style>
