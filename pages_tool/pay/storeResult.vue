<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="container">
		<template>
			<view class="result-box">
				<template>
					<image :src="$util.img('public/uniapp/pay/pay_success.png')" mode="widthFix" class="result-image">
					</image>
					<view class="msg">{{ title }}</view>
				</template>
				<view class="action">
					<!-- <view class="btn" @click="$util.redirectTo('/pages/member/index', {}, 'reLaunch')" v-if="token">
					{{ $lang('memberCenter') }}
				</view> -->
					<template v-if="token">
						<view class="btn" @click="toOrderDetail">回到工作台</view>
					</template>
					<view class="btn" @click="goHome()">回到首页</view>
				</view>
			</view>
			<ns-goods-recommend></ns-goods-recommend>
		</template>
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
				title: '订单提交成功'
			};
		},
		onLoad(option) {
			if (option.type) this.type = option.type;
		},
		onShow() {
			if (uni.getStorageSync('token')) this.token = uni.getStorageSync('token');
		},
		methods: {
			goHome() {
				this.$util.redirectTo('/pages/index/index', {}, 'reLaunch');
			},
			toOrderDetail() {
				this.$util.redirectTo('/sellStore/index/index', {}, 'reLaunch');
			},
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
