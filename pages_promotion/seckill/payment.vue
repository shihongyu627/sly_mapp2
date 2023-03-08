<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<common-payment :api="api" create-data-key="seckillOrderCreateData" ref="payment"></common-payment>
	</view>
</template>

<script>
export default {
	data() {
		return {
			api: {
				payment: '/seckill/api/ordercreate/payment',
				calculate: '/seckill/api/ordercreate/calculate',
				create: '/seckill/api/ordercreate/create'
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
			if (data.seckill_info) {
				return {title: '限时秒杀', content: data.seckill_info.seckill_name}
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
