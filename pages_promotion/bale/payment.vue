<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<common-payment :api="api" create-data-key="baleOrderCreateData" ref="payment"></common-payment>
	</view>
</template>

<script>
export default {
	data() {
		return {
			api: {
				payment: '/bale/api/ordercreate/payment',
				calculate: '/bale/api/ordercreate/calculate',
				create: '/bale/api/ordercreate/create'
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
			if (data.bale_info) {
				return {title: '打包一口价', content: `<text class="ns-text-color">${data.bale_info.price }}</text>元任选${data.bale_info.num }}件`}
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
