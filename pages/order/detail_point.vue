<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="detail-container" :class="{ 'safe-area': isIphoneX }">
		<!-- 订单状态 -->
		<view class="status-wrap color-base-bg" :style="{ backgroundImage: 'url(' + $util.img('public/uniapp/order/status-wrap-bg.png') + ')' }">
			<view class="order-status-left">
				<image v-if="orderData.order_status == 0" :src="$util.img('public/uniapp/order/order-icon.png')"></image>
				<image v-if="orderData.order_status == 1" :src="$util.img('public/uniapp/order/order-icon-received.png')"></image>
				<image v-if="orderData.order_status == -1" :src="$util.img('public/uniapp/order/order-icon-close.png')"></image>
				<view class="status-name">
					<view class="status-name">
						{{ orderData.order_status == 0 ? '待支付' : orderData.order_status == 1 ? '已完成' : orderData.order_status == -1 ? '已关闭' : '' }}
					</view>
				</view>
			</view>
		</view>

		<!-- 店铺 -->
		<view class="site-wrap" style="margin-top: -69rpx">
			<view class="site-body">
				<view class="goods-wrap">
					<view @click="goDetail(orderData.exchange_goods_id)" class="goods-img">
						<image :src="exchangeImage(orderData)" @error="imageError()" mode="aspectFill"></image>
					</view>
					<view class="goods-info" @click="goDetail(orderData.exchange_goods_id)" >
						<view class="goods-name">{{ orderData.exchange_name }}</view>
						<view class="goods-sub-section">
							<view>
								<text class="goods-price color-base-text">
									<text>
										<text>{{ orderData.point }}柚币</text>
										<text v-if="orderData.price > 0" class="price-color">
											+
											<text class="unit">{{ $lang('common.currencySymbol') }}</text>
											{{ orderData.price }}
										</text>
									</text>
								</text>
							</view>
							<view>
								<text>
									<text class="iconfont iconclose"></text>
									{{ orderData.num }}
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 订单概况 -->
		<view class="order-summary">
			<view class="order-cell">
				<text class="tit">订单编号：</text>
				<view class="box">
					<text class="color-title">{{ orderData.order_no }}</text>
					<view class="copy" @click="$util.copy(orderData.order_no)">复制</view>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">订单交易号：</text>
				<view class="box">
					<text class="color-title">{{ orderData.out_trade_no }}</text>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">创建时间：</text>
				<view class="box">
					<text class="color-title">{{ $util.timeStampTurnTime(orderData.create_time) }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.close_time > 0">
				<text class="tit">关闭时间：</text>
				<view class="box">
					<text class="color-title">{{ $util.timeStampTurnTime(orderData.close_time) }}</text>
				</view>
			</view>
			<!-- 联系客服 -->
			<ns-contact>
				<view class="kefu">
					<view>
						<text class="iconfont iconziyuan"></text>
						<text>联系客服</text>
					</view>
				</view>
			</ns-contact>
		</view>

		<!-- 订单金额 -->
		<view class="order-money">
			<view class="order-cell" v-if="orderData.point > 0">
				<text class="tit">使用柚币</text>
				<view class="box align-right">
					<text class="color-base-text price-font">
						<text>{{ orderData.point }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.delivery_price > 0">
				<text class="tit">运费</text>
				<view class="box align-right">
					<text class="color-base-text price-font">
						<text class="unit font-size-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.delivery_price }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.order_money > 0">
				<view class="box align-right">
					<text>实付金额：</text>
					<text class="color-base-text price-font">
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text class="font-size-base">{{ orderData.order_money }}</text>
					</text>
				</view>
			</view>

			<view class="order-action" v-if="orderData.order_status == 0 && orderData.type == 1">
				<view class="order-box-btn" @click="orderClose()">关闭</view>
				<view class="order-box-btn color-base-bg color-base-border color-text-white" @click="openChoosePayment()">支付</view>
			</view>
		</view>

		<nsGoodsRecommend ref="goodrecommend" route="orderdetail"></nsGoodsRecommend>
		<!-- 选择支付方式弹窗 -->
		<ns-payment ref="choosePaymentPopup" :payMoney="orderData.order_money" @confirm="orderPay(orderData)"></ns-payment>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import nsGoodsRecommend from '@/components/ns-goods-recommend/ns-goods-recommend.vue';
export default {
	components: {
		nsGoodsRecommend
	},
	data() {
		return {
			isIphoneX: false,
			orderId: 0,
			orderData: {
				action: []
			},
			action: {
				icon: ''
			},
			storeDetail: {}
		};
	},
	onLoad(option) {
		if (option.order_id) this.orderId = option.order_id;
	},
	onShow() {
		this.isIphoneX = this.$util.uniappIsIPhoneX();

		if (uni.getStorageSync('token')) {
			this.getOrderData();
		} else {
			this.$util.redirectTo('/pages_tool/login/login', { back: '/order/detail_point?order_id=' + this.orderId });
		}
	},
	methods: {
		goRefund(id) {
			this.$util.redirectTo('/pages_tool/order/refund', { order_goods_id: id });
		},
		goRefundDetail(id) {
			this.$util.redirectTo('/pages_tool/order/refund_detail', { order_goods_id: id });
		},
		goDetail(id) {
			this.$util.redirectTo('/pages_promotion/point/detail', { id: id });
		},
		navigateBack() {
			this.$util.goBack();
		},
		getOrderData() {
			this.$api.sendRequest({
				url: '/pointexchange/api/order/info',
				data: {
					order_id: this.orderId
				},
				success: res => {
					uni.stopPullDownRefresh();
					if (res.code >= 0) {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						this.orderData = res.data;
						if (this.orderData.delivery_store_info != '') this.orderData.delivery_store_info = JSON.parse(this.orderData.delivery_store_info);
					} else {
						this.$util.showToast({
							title: '未获取到订单信息！'
						});
						setTimeout(() => {
							this.$util.redirectTo('/pages/order/list');
						}, 1500);
					}
				},
				fail: res => {
					uni.stopPullDownRefresh();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		/**
		 * 下拉刷新
		 */
		onPullDownRefresh() {
			this.getOrderData();
		},
		orderClose() {
			uni.showModal({
				title: '提示',
				content: '确定关闭此次兑换？',
				success: res => {
					if (res.confirm) {
						this.$api.sendRequest({
							url: '/pointexchange/api/order/close',
							data: {
								order_id: this.orderData.order_id
							},
							success: res => {
								if (res.code >= 0) {
									this.$util.showToast({ title: '关闭成功' });
									this.getOrderData();
								}
							}
						});
					}
				}
			});
		},
		// 显示选择支付方式弹框
		openChoosePayment() {
			this.$refs.choosePaymentPopup.open();
		},
		orderPay() {
			uni.setStorageSync('paySource', 'pointexchange');
			this.$refs.choosePaymentPopup.getPayInfo(this.orderData.out_trade_no);
		},
		exchangeImage(data) {
			switch (data.type) {
				case 1:
					return this.$util.img(data.exchange_image, { size: 'mid' });
					break;
				case 2:
					return data.exchange_image ? this.$util.img(data.exchange_image) : this.$util.img('public/uniapp/point/coupon.png');
					break;
				case 3:
					return data.exchange_image ? this.$util.img(data.exchange_image) : this.$util.img('public/uniapp/point/hongbao.png');
					break;
			}
		},
		imageError() {
			switch (this.orderData.type) {
				case 2:
					this.orderData.exchange_image = this.$util.img('public/uniapp/point/coupon.png');
					break;
				case 3:
					this.orderData.exchange_image = this.$util.img('public/uniapp/point/hongbao.png');
					break;
				default:
					this.orderData.exchange_image = this.$util.getDefaultImage().goods;
			}
			this.$forceUpdate();
		},
		// 显示选择支付方式弹框
		openChoosePayment() {
			this.$refs.choosePaymentPopup.open();
		}
	},
	filters: {
		abs(value) {
			return Math.abs(parseFloat(value)).toFixed(2);
		}
	}
};
</script>

<style lang="scss">
@import './public/css/detail.scss';
</style>
