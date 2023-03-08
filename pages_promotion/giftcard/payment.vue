<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="order-container" :class="{ 'safe-area': isIphoneX }">
		 
		<!-- 店铺 -->
		<view class="site-wrap">
			<view class="site-body" v-if="orderPaymentData">
				<view class="card-head">
					<image :src="$util.img(orderPaymentData.card_right_type == 'balance' ? 'public/uniapp/giftcard/order-icon-recharge.png' : 'public/uniapp/giftcard/order-icon-gift.png')" mode="widthFix"></image>
					<text>{{orderPaymentData.card_right_type == 'balance' ? '储值卡' : '礼品卡' }}</text>
				</view>
				<view class="giftcard-wrap">
					<view class="card-img">
						<image
							:src="orderPaymentData.card_cover ? $util.img(orderPaymentData.card_cover) : $util.img('public/uniapp/giftcard/default_card.png')"
							mode="aspectFill"
						></image>
					</view>
					<view class="goods-info">
						<view class="goods-name">{{orderPaymentData.order_name}}</view>
						<view class="goods-price price-font">
							￥{{parseFloat(orderPaymentData.item_money).toFixed(2)}}
						</view>
					</view>
				</view>
				
				<view class="buy-num-box">
					<view class="order-cell">
						<text class="tit">购买数量</text>
						<view class="box">
							<uni-number-box
								:min="min"
								:value="orderPaymentData.num"
								size="small"
								:modifyFlag="modifyFlag"
								@change="cartNumChange($event)"
							/>
						</view>
					</view>
				</view>
				
			</view>
		</view>

		<!-- 金额 -->
		<view class="order-money">
			<view class="order-cell textarea-box">
				<text class="tit">买家留言</text>
				<view class="box text-overflow " @click="openPopup('buyerMessagePopup')">
					<text v-if="orderPaymentData.buyer_message">{{orderPaymentData.buyer_message}}</text>
					<text class="color-sub" v-else>无留言</text>
				</view>
				<text class="iconfont iconright"></text>
			</view>
		</view>
		<view class="tab-bar-placeholder"></view>
		<view class="order-submit" :class="{ 'bottom-safe-area': isIphoneX }">
			<view class="order-settlement-info">
				<text class="font-size-base color-tip margin-right">共{{ orderPaymentData.num }}份</text>
				<text class="font-size-base">合计：</text>
				<text class="price-color unit">￥</text>
				<text class="price-color money">{{ parseFloat(orderPaymentData.pay_money).toFixed(2) }}</text>
			 
			</view>
			<view class="submit-btn">
				<button type="primary" size="mini" @click="openChoosePayment()">立即支付</button>
			</view>
		</view>


		<!-- 留言弹窗 -->
		<uni-popup ref="buyerMessagePopup" type="bottom">
			<view style="height: auto;" class="buyermessag-popup popup" @touchmove.prevent.stop>
				<view class="popup-header">
					<text class="tit">买家留言</text>
					<text class="iconfont iconclose" @click="closePopup('buyerMessagePopup')"></text>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view>
						<view class="buyermessag-cell">							<view class="buyermessag-form-group">								<textarea type="text" maxlength="100" placeholder="留言前建议先与商家协调一致" placeholder-class="color-tip" v-model="orderCreateData.buyer_message" /> </textarea>
							</view>						</view>
					</view>
				</scroll-view>
				<view class="popup-footer" @click="saveBuyerMessage" :class="{ 'bottom-safe-area': isIphoneX }"><view class="confirm-btn color-base-bg">确定</view></view>
			</view>
		</uni-popup>
		<!-- 选择支付方式弹窗 -->
		<payment ref="choosePaymentPopup" @close="payClose" :balanceUsable="orderPaymentData && orderPaymentData.giftcard_info &&  orderPaymentData.giftcard_info.card_right_type == 'balance' ? false : true "></payment>

		<loading-cover ref="loadingCover"></loading-cover>
		
		<!-- 门店自提、同城配送时间选择 -->
		<ns-select-time @selectTime='selectTime' ref="TimePopup"></ns-select-time>
	</view>
</template>

<script>
import paymentJs from './public/js/payment.js';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import payment from '@/components/payment/payment.vue';

export default {
	components: {
		uniPopup,
		payment
	},
	mixins: [paymentJs]
};
</script>

<style lang="scss">
@import './../../common/css/order_parment.scss';
@import './public/css/payment.scss';
</style>
<style scoped>
/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: none;
	max-height: unset !important;
	overflow-y: hidden !important;
}
>>> .uni-popup__wrapper {
	border-radius: 20rpx 20rpx 0 0;
}
>>> .uni-popup {
	z-index: 8;
}

</style>
