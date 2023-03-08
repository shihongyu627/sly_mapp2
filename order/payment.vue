<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<common-payment :api="api" create-data-key="orderCreateData" ref="payment"></common-payment>
	</view>
</template>

<script>
export default {
	data() {
		return {
			api: {
				payment: '/api/ordercreate/payment',
				calculate: '/api/ordercreate/calculate',
				create: '/api/ordercreate/create'
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
		/**
		 * 处理活动信息 如不需要则定义为空方法
		 */
		promotion(data){
			if (data.shop_goods_list.promotion && data.shop_goods_list.promotion.manjian && data.shop_goods_list.promotion.manjian.manjian_info.length) {
				let promotion = {title: '满减送', content: ''};
				let manjianInfo = data.shop_goods_list.promotion.manjian.manjian_info;
				let content = {};
				let limit = manjianInfo.type == 0 ? '元' : '件';
				
				if(manjianInfo.rule){
					Object.keys(manjianInfo.rule).forEach((key) => {
						var item = manjianInfo.rule[key];
						if(item.manjianInfo){
							for(var i=0;i<item.coupon_data.length;i++){
								item.coupon_data[i].coupon_num = item.coupon_num[i]
							}
						}
						item.limit = manjianInfo.type == 0 ? parseFloat(item.limit).toFixed(2) : parseInt(item.limit);
						// 满减
						if (item.discount_money != undefined) {
							if (content.manjian == undefined) {
								content.manjian = '购买可享受满' + item.limit + limit + '减' + item.discount_money + '元';
							} else {
								content.manjian += '；满' + item.limit + limit + '减' + item.discount_money + '元';
							}
						}
						// 满送优惠券
						if (item.coupon && item.coupon_data) {
							let text = '';
							item.coupon_data.forEach((couponItem, couponIndex) => {
								if (couponItem.type == 'discount') {
									if (text == '') text = '送'+ item.coupon_num[couponIndex] +'张' + parseFloat(couponItem.discount) + '折优惠券';
									else text += '、送'+ item.coupon_num[couponIndex] +'张' + parseFloat(couponItem.discount) + '折优惠券';
								} else {
									if (text == '') text = '送'+ item.coupon_num[couponIndex] +'张' + parseFloat(couponItem.money) + '元优惠券';
									else text += '、送'+ item.coupon_num[couponIndex] +'张' + parseFloat(couponItem.money) + '元优惠券';
								}
							})
							if (content.mansong == undefined) {
								content.mansong = '购物满' + item.limit + limit + text;
							} else {
								content.mansong += '；' + '满' + item.limit + limit + text;
							}
						}
						// 满送柚币
						if (item.point) {
							let point_text = '可得' + item.point + '柚币';
							if(content.point_text == undefined) {
								content.point_text = '购物满' + item.limit + limit + point_text
							}else {
								content.point_text += '；' + '满' + item.limit + limit + point_text;
							}
						}
						// 包邮
						if (item.free_shipping != undefined) {
							if (content.free_shipping == undefined) {
								content.free_shipping = '购物满' + item.limit + limit + '包邮';
							}
						}
					})
				}
				promotion.content = Object.values(content).join('\n');
				return promotion;
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
