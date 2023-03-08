<template>
	<page-meta :page-style="themeColor"></page-meta>
	<scroll-view scroll-y="true" class="pay-container">
		<view class="payment-amount">
			<text class="amount-tit">{{ $lang('paymentAmount') }}</text>
			<view class="amount-num">
				{{ $lang('common.currencySymbol') }}
				<text>{{ payInfo.pay_money }}</text>
			</view>
			<view class="payment-name">{{ payInfo.pay_body }}</view>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>
		
	</scroll-view>
</template>

<script>
import loadingCover from '@/components/loading-cover/loading-cover.vue';

export default {
	components: {
		loadingCover
	},
	data() {
		return {
			isIphoneX: false,
			payInfo: {},
			outTradeNo: '',
		};
	},
	onLoad(option) {
		if (option.code) this.outTradeNo = option.code;
		this.isIphoneX = this.$util.uniappIsIPhoneX();
	},
	onShow() {

		if (!uni.getStorageSync('token')) {
			this.$util.redirectTo('/pages_tool/login/login');
		} else {
			this.getPayInfo();
		}
	},
	methods: {
		getPayInfo() {
			this.$api.sendRequest({
				url: '/api/pay/info',
				data: {
					out_trade_no: this.outTradeNo
				},
				success: res => {
					if (res.code >= 0 && res.data) {
						this.payInfo = res.data;
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
		}
	}
};
</script>

<style lang="scss">
.pay-container {
	width: 100vw;
	height: 100vh;
}
@mixin flex-column {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
@mixin flex-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.payment-amount {
	@include flex-column;
	margin: $margin-updown $margin-both;
	border-radius: 8rpx;
	padding: 20rpx 0 58rpx 0;
	background-color: #fff;
	.amount-tit {
		font-size: $font-size-base;
		color: #838383;
		line-height: 1;
		margin-top: 44rpx;
	}
	.amount-num {
		color: #000;
		margin-top: 36rpx;
		line-height: 1;
		text {
			font-size: $font-size-toolbar;
			color: #000;
		}
	}
	.amount-desc {
		font-size: $font-size-tag;
		color: #838383;
		padding: 0 40rpx;
		width: 100%;
		box-sizing: border-box;
		text-align: center;
		line-height: 1;
		text {
			width: 100%;
			display: block;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	.payment-name {
		width: 90%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #838383;
		margin-top: 30rpx;
		text-align: center;
		line-height: 1;
	}
}
</style>
