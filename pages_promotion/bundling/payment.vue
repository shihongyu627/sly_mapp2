<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<common-payment :api="api" create-data-key="comboOrderCreateData" ref="payment"></common-payment>
	</view>
</template>

<script>
export default {
	data() {
		return {
			api: {
				payment: '/bundling/api/ordercreate/payment',
				calculate: '/bundling/api/ordercreate/calculate',
				create: '/bundling/api/ordercreate/create'
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
			if (data.bunding_info) {
				return {title: '组合套餐', content: data.bunding_info.bl_name}
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
