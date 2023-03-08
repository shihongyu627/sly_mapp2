<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<common-payment :api="api" create-data-key="bargainOrderCreateData" ref="payment"></common-payment>
	</view>
</template>

<script>
export default {
	data() {
		return {
			api: {
				payment: '/bargain/api/ordercreate/payment',
				calculate: '/bargain/api/ordercreate/calculate',
				create: '/bargain/api/ordercreate/create'
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
	methods:{
		/**
		 * 处理活动信息 如不需要则留空
		 */
		promotion(){}
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
