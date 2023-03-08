<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="order-container" :class="{ 'safe-area': isIphoneX }">
		<!-- 选择地址 -->
		<template v-if="orderPaymentData.is_virtual == 0">
			<view class="address-box" v-if="orderPaymentData.delivery.delivery_type != 'store'">
				<view class="info-wrap" v-if="orderPaymentData.member_address" @click="selectAddress">
					<view class="icon-wrap"><text class="iconfont icondizhi"></text></view>
					<view class="content">
						<text class="name font-size-base">{{ orderPaymentData.member_address.name ? orderPaymentData.member_address.name : '' }}</text>
						<text class="font-size-base">{{ orderPaymentData.member_address.mobile ? orderPaymentData.member_address.mobile : '' }}</text>
						<text class="cell-more iconfont iconright"></text>
						<view class="desc-wrap">
							{{ orderPaymentData.member_address.full_address ? orderPaymentData.member_address.full_address : '' }}
							{{ orderPaymentData.member_address.address ? orderPaymentData.member_address.address : '' }}
						</view>
					</view>
				</view>
				<view class="empty-wrap" v-else @click="selectAddress">
					<view class="icon-wrap"><view class="iconfont icondizhi empty"></view></view>
					<view class="info">请设置收货地址</view>
					<view class="cell-more"><view class="iconfont iconright"></view></view>
				</view>

				<!-- 外卖配送 -->
				<view class="local-box" v-if="orderPaymentData.delivery.delivery_type == 'local'">
					<view class="order-cell">
						<text class="tit">配送时间</text>
						<view class="box">
							<text v-if="timeInfo.showTime">{{ timeInfo.start_time + '-' + timeInfo.end_time }}</text>
							<text v-if="deliveryWeek">
								<template v-if="timeInfo.showTime">
									（
								</template>
								{{ deliveryWeek }}
								<template v-if="timeInfo.showTime">
									）
								</template>
							</text>
							<text v-if="!canLocalDelicery">（休息中）</text>
						</view>
					</view>
					<picker
						v-if="timeInfo.showTimeBar && orderPaymentData.member_address && canLocalDelicery"
						:value="orderCreateData.buyer_ask_delivery_time"
						mode="time"
						@change="bindTimeChange"
					>
						<view class="pick-block">
							<view class="font-size-base">送达时间</view>
							<view class="time-picker">
								<text>{{ orderCreateData.buyer_ask_delivery_time }}</text>
								<text class="iconfont iconright cell-more"></text>
							</view>
						</view>
					</picker>
				</view>
			</view>

			<view class="mobile-wrap" v-if="orderPaymentData.delivery.delivery_type == 'store' && storeInfo.currStore">
				<view class="form-group">
					<text class="iconfont icondianhua2"></text>
					<text class="text">预留手机</text>
					<input type="number" maxlength="11" placeholder="请输入您的手机号码" placeholder-class="color-tip placeholder" class="input" v-model="member_address.mobile" />
				</view>
			</view>

			<!-- 配送方式 -->
			<view class="delivery-mode" v-if="orderPaymentData.shop_goods_list.express_type.length > 1">
				<view class="head">
					<text class="iconfont iconwuliu"></text>
					<text>配送方式</text>
				</view>
				<view class="action">
					<button
						v-for="(deliveryItem, deliveryIndex) in orderPaymentData.shop_goods_list.express_type"
						:key="deliveryIndex"
						:type="deliveryItem.name == orderPaymentData.delivery.delivery_type ? 'primary' : 'default'"
						@click="selectDeliveryType(deliveryItem)"
						size="mini"
					>
						{{ deliveryItem.title }}
					</button>
				</view>
			</view>

			<!-- 选择门店 -->
			<view class="store-box" v-if="orderPaymentData.delivery.delivery_type == 'store'">
				<view v-if="storeInfo.currStore" @click="openSiteDelivery" class="store-info">
					<view v-if="storeInfo.currStore.store_image" class="icon img"><image :src="$util.img(storeInfo.currStore.store_image)" mode="aspectFill"></image></view>
					<view v-else class="icon"><view class="iconfont iconmendian"></view></view>
					<view class="store-address-info">
						<view class="info-wrap">
							<view class="title">
								<text>{{ storeInfo.currStore.store_name }}</text>
								<view class="cell-more iconfont iconright"></view>
							</view>
							<view class="store-detail">
								<view v-if="storeInfo.currStore.open_date">营业时间：{{ storeInfo.currStore.open_date }}</view>
								<view>地址：{{ storeInfo.currStore.full_address }} {{ storeInfo.currStore.address }}</view>
							</view>
						</view>						
					</view>
				</view>
				<view v-else class="empty">当前无自提门店，请选择其它配送方式</view>
			</view>
		</template>

		<!-- 虚拟商品展示手机号 -->
		<view class="mobile-wrap" v-if="orderPaymentData.is_virtual == 1 && orderCreateData.member_address">
			<view class="tips color-base-text">购买虚拟类商品需填写手机号，方便商家与您联系</view>
			<view class="form-group">
				<text class="iconfont icondianhua2"></text>
				<text class="text">手机号码</text>
				<input
					type="number"
					maxlength="11"
					placeholder="请输入您的手机号码"
					placeholder-class="color-tip placeholder"
					class="input"
					v-model="orderCreateData.member_address.mobile"
				/>
			</view>
		</view>

		<!-- 店铺 -->
		<view class="site-wrap">
			<view class="site-body">
				<!-- 商品 -->
				<view class="goods-wrap" v-for="(goodsItem, goodsIndex) in orderPaymentData.shop_goods_list.goods_list" :key="goodsIndex">
					<view class="goods-img" @click="navigateTo(goodsItem.goods_id)">
						<image :src="$util.img(goodsItem.sku_image, { size: 'mid' })" @error="imageError(goodsIndex)" mode="aspectFill"></image>
					</view>
					<view class="goods-info">
						<view @click="navigateTo(goodsItem.goods_id)" class="goods-name">{{ goodsItem.sku_name }}</view>
						<view class="introduction">{{ goodsItem.introduction }}</view>
						<view class="sku">
							<view class="goods-spec"  v-if="goodsItem.sku_spec_format.length > 0">
								<block v-for="(x, i) in goodsItem.sku_spec_format" :key="i">
									{{ x.spec_value_name }} {{ i < goodsItem.sku_spec_format.length - 1 ? '; ' : '' }}
								</block>
							</view>
							<view>
								<text class="font-size-tag">x</text>
								<text class="font-size-base">{{ goodsItem.num }}</text>
							</view>
						</view>
						<view class="goods-sub-section">
<!-- 							<view class="color-base-text">
								<text class="unit">{{ $lang('common.currencySymbol') }}</text>
								<text class="goods-price">{{ goodsItem.price }}</text>
							</view> -->
							
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view v-if="orderPaymentData.system_form" class="system-form-wrap">
			<ns-form :data="orderPaymentData.system_form.json_data" ref="form"></ns-form>
		</view>

		<view class="order-submit" :class="{ 'bottom-safe-area': isIphoneX }">
			<view class="order-settlement-info">
				<!-- <text class="font-size-base color-tip margin-right">共{{ orderPaymentData.goods_num }}件</text> -->
				<!-- <text class="font-size-base">合计：</text> -->
				<!-- <text class="color-base-text unit">{{ $lang('common.currencySymbol') }}</text> -->
				<!-- <text class="color-base-text money">{{ orderPaymentData.pay_money | moneyFormat }}</text> -->
			</view>
			<view class="submit-btn"><button type="primary" size="mini" @click="openChoosePayment(giftcard_id,id)">提交</button></view>
		</view>


		<!-- 门店列表弹窗 -->
		<uni-popup ref="deliveryPopup" type="bottom">
			<view class="delivery-popup popup">
				<view class="popup-header">
					<text class="tit">已为您甄选出附近所有相关门店</text>
					<text class="iconfont iconclose" @click="closePopup('deliveryPopup')"></text>
				</view>
				<view class="popup-body store-popup" :class="{ 'safe-area': isIphoneX }">
					<view class="delivery-content">
						<view class="item-wrap" v-for="(item, index) in storeInfo.storeList" :key="index" @click="selectPickupPoint(item)">
							<view class="detail">
								<view class="name" :class="item.store_id == orderPaymentData.delivery.store_id ? 'color-base-text' : ''">
									<text>{{ item.store_name }}</text>
									<text v-if="item.distance">({{ item.distance }}km)</text>
								</view>
								<view class="info">
									<view :class="item.store_id == orderPaymentData.delivery.store_id ? 'color-base-text' : ''" class="font-size-goods-tag">
										营业时间：{{ item.open_date }}
									</view>
									<view :class="item.store_id == orderPaymentData.delivery.store_id ? 'color-base-text' : ''" class="font-size-goods-tag">
										地址：{{ item.full_address }}{{ item.address }}
									</view>
								</view>
							</view>
							<view class="icon" v-if="item.store_id == orderPaymentData.delivery.store_id"><text class="iconfont iconyuan_checked color-base-text"></text></view>
						</view>
						<view v-if="!storeInfo.storeList" class="empty">所选择收货地址附近没有可以自提的门店</view>
					</view>
				</view>
			</view>
		</uni-popup>

		<!-- 选择支付方式弹窗 -->
<!-- 		<ns-payment
			ref="choosePaymentPopup"
			:isBalance="orderCreateData.is_balance"
			@useBalance="useBalance"
			:isPayPassWord="orderPaymentData.member_account.is_pay_password"
			:balanceDeduct="orderPaymentData.order_money > 0 && orderPaymentData.member_account.balance_total > 0 ? balanceDeduct : '0'"
			:payMoney="orderPaymentData.pay_money"
			@confirm="orderCreate"
		></ns-payment> -->

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import payment from '../public/js/payment.js';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import nsSwitch from '@/components/ns-switch/ns-switch.vue';
import nsPayment from '@/components/payment/payment.vue';
import nsForm from '@/components/ns-form/ns-form.vue';

export default {
	data(){
		return{
			id:'',
			giftcard_id:''
		}
	},
	components: {
		uniPopup,
		nsSwitch,
		nsPayment,
		nsForm
	},
	mixins: [payment],
	onLoad(option) {
		this.id = option.id ;
		this.giftcard_id = option.giftcard_id
	}
};
</script>

<style lang="scss">
@import './../../../common/css/order_parment.scss';
</style>
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
.order-container {
	
	.promotion-text {
		padding: 8rpx 12rpx;
		min-width: 76rpx;
		line-height: 22rpx;
		font-size: 10px;
	}
	.order-cell{
		
		.promotion-content {
			margin-left: 10rpx;
			max-width: 540rpx;
			font-size: 10px;
			line-height: 35rpx;
			margin-bottom: 10rpx;
			
			.tit {
				font-size: 12px;
			}
		}
	}
}

.goods-info{
	.introduction{
		color: gray;
		// width: 200px;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1; /* 这里是超出几行省略 */
		overflow: hidden;
	}
	.goods-sub-section > view{
		// left: 0 !important;
		text-align: left !important;
	}
}
</style>
