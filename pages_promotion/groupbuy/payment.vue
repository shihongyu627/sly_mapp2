<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<common-payment :api="api" create-data-key="groupbuyOrderCreateData" ref="payment"></common-payment>
	</view>
</template>

<script>
export default {
	data() {
		return {
			api: {
				payment: '/groupbuy/api/ordercreate/payment',
				calculate: '/groupbuy/api/ordercreate/calculate',
				create: '/groupbuy/api/ordercreate/create'
			}
		}
	},
	provide() {
		return {
			promotion: this.promotion.bind(this)
		}
	},
	onShow() {
		if (this.$refs.payment) this.$refs.payment.pageShow();
	},
	methods: {
		promotion(data){
			if (data.groupbuy_info) {
				return {title: '团购', content: `团购${data.groupbuy_info.buy_num}件起,享团购价<text class="color-base-text">${data.groupbuy_info.groupbuy_price}</text>元`}
			}
		}
	}
};
</script>

<style scoped lang="scss">
/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: none;
	max-height: unset !important;
	overflow-y: hidden !important;
}
/deep/ .uni-popup__wrapper {
	border-radius: 20rpx 20rpx 0 0;
}
/deep/ .uni-popup {
	z-index: 8;
}
</style>
