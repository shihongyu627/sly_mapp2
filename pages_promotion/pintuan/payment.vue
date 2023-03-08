<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<common-payment :api="api" create-data-key="pintuanOrderCreateData" ref="payment"></common-payment>
	</view>
</template>

<script>
export default {
	data() {
		return {
			api: {
				payment: '/pintuan/api/ordercreate/payment',
				calculate: '/pintuan/api/ordercreate/calculate',
				create: '/pintuan/api/ordercreate/create'
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
			if (data.pintuan_info) {
				return {title: '拼团', content: data.pintuan_info.pintuan_name}
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
