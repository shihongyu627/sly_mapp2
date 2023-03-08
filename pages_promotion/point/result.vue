<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="container">
		<view class="image-wrap">
			<image :src="$util.img('public/uniapp/pay/pay_success.png')" class="result-image" mode="widthFix"></image>
		</view>
		<view class="msg">{{ $lang('exchangeSuccess') }}</view>
		<view class="action">
			<view class="btn color-base-border color-base-text" @click="toOrderList()">{{ $lang('see') }}</view>
			<view class="btn go-home color-base-bg" @click="toIndex">{{ $lang('goHome') }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		onShow() {
			
			
		},
		methods: {
			toOrderList() {
				this.$util.redirectTo('/pages_promotion/point/order_list', {}, 'redirectTo');
			},
			toIndex() {
				this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
			}
		}
	};
</script>

<style lang="scss">
	.container {
		width: 100vw;
		height: 100vh;
		background: #fff;

		.image-wrap {
			display: flex;
			justify-content: center;
			padding: 200rpx 0 40rpx 0;

			.result-image {
				width: 166rpx;
			}
		}

		.msg {
			text-align: center;
			line-height: 1;
			margin-bottom: 50rpx;
			font-size: $font-size-base;
			color: #000;
		}

		.pay-amount {
			color: #999;
			text-align: center;
			line-height: 1;
			margin-bottom: 30rpx;
		}

		.action {
			width: 90%;
			margin: 0 auto;
			text-align: center;
			margin-top: 150rpx;
			display: flex;
			justify-content: space-between;

			.btn {
				width: 310rpx;
				height: 78rpx;
				border: 2rpx solid #ffffff;
				border-radius: $border-radius;
				font-size: $font-size-tag;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.alone {
				margin-left: 0;
				width: 60%;
			}

			.go-home {
				color: #fff;
			}
		}
	}
</style>
