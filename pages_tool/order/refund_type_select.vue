<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<view>
			<view class="refund-option">
				<view class="option-item" @click="selectRefundType(1)">
					<view>
						<text>退款无需退货</text>
						<text class="font-size-goods-tag color-tip">没收到货，或与卖家协商同意无需退货只退款</text>
					</view>
					<text class="iconfont iconright"></text>
				</view>
				<view class="option-item" @click="selectRefundType(2)" v-if="refund_data.order_status == 3">
					<view>
						<text>退货退款</text>
						<text class="font-size-goods-tag color-tip">已收到货，需退还收到的货物</text>
					</view>
					<text class="iconfont iconright"></text>
				</view>
			</view>
			
			<loading-cover ref="loadingCover"></loading-cover>
			
		</view>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
	components: {
		uniPopup
	},
	data() {
		return {
			order_id: '',
			isIphoneX: false,
			refund_data: {},
		};
	},
	onLoad(option) {
		if (option.order_id) this.order_id = option.order_id;
	},
	onShow() {
		
		
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		if (uni.getStorageSync('token')) {
			this.getRefundData();
		} else {
			this.$util.redirectTo('/pages_tool/login/login', { back: '/pages_tool/order/refund?order_goods_id=' + this.order_goods_id });
		}
	},
	methods: {
		/**
		 * 选择退款方式
		 * @param {Object} type
		 */
		selectRefundType(type) {
			this.$util.redirectTo('/pages_tool/order/refund_goods_select', { refund_type:type });
		},
		/**
		 * 获取退款订单数据
		 */
		getRefundData() {
			this.$api.sendRequest({
				url: '/api/order/detail',
				data: {
					order_id: this.order_id
				},
				success: res => {
					if (res.code >= 0) {
						this.refund_data = res.data;
						uni.setStorage({
							key:'refund_goods_data',
							data:JSON.stringify(res.data.order_goods),
							success:res=>{}
						})
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					} else {
						this.$util.showToast({ title: '未获取到该订单项退款信息' });
						setTimeout(() => {
							this.$util.redirectTo('/pages/order/list');
						}, 1000);
					}
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
	}
};
</script>

<style lang="scss">
@import './public/css/refund.scss';
</style>
<style scoped>
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
.sub-btn{
	padding-top: 20rpx;
	background-color: #FFFFFF;
}
</style>
