<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="detail-container" :class="{ 'safe-area': isIphoneX }" :data-theme="themeStyle">
		<!-- 订单状态 -->
		<view class="status-wrap color-base-bg"
			:style="{ backgroundImage: 'url(' + $util.img('public/uniapp/order/status-wrap-bg.png') + ')' }">
			<view class="order-status-left">
				<image v-if="action.icon" :src="$util.img(action.icon)"></image>
				<view class="status-name">
					<view>{{ orderData.order_status_name }}</view>
				</view>
			</view>
		</view>
		<view class="address-box">
			<view class="adddress-top">
				<view class="address-name">
					{{storeInfo.store_name}}
				</view>
				<img class='store-tel' src="@/common/img/store_tel.png" mode="aspectFill"
					@click="makePhone(storeInfo)" />
			</view>
			<view class="address-bottom">
				<view class="address-left">
					<img class='address-icon' src="@/common/img/address_icon.png" mode="aspectFill" />
					<view class="address-content">
						{{ removeComma(storeInfo.address)}}
					</view>
				</view>
				<view class="address-guide" @click="goHerf(storeInfo)">
					<img class='guide-icon' src="@/common/img/store_tel.png" mode="aspectFill" />
					<view class="guide-title">
						导航
					</view>
				</view>
			</view>
		</view>
		<!-- 店铺 -->
		<view class="site-wrap">
			<!-- <view class="site-header">
				<view class="iconfont icondianpu"></view>
				<text class="site-name">{{ orderData.site_name }}</text>
				<view class="iconfont iconright"></view>
			</view> -->
			<view class="site-body">
				<view class="goods-wrap">
					<view class="goods-img">
						<image :src="$util.loadimg(orderData.card_cover)" mode="aspectFill"></image>
					</view>
					<view class="goods-info">
						<view class="goods-name">{{ orderData.order_name }}</view>
						<view class="goods-sub-section">
							<view>
								<text class="goods-price color-base-text" style="color:#D14847;">
									<text class="unit">￥</text>
									<text class="font-size-base"
										style="font-size: 20px;">{{ orderData.goods_money }}</text>
								</text>
							</view>
							<view>
								<text class="font-size-base">
									<text class="iconfont iconclose"></text>
									{{ orderData.num }}
								</text>
							</view>
						</view>
						<!-- 		<view class="goods-action" v-if="orderData.is_enable_refund">
							<view @click="goRefund(goodsItem.order_goods_id)" v-if="goodsItem.refund_status == 0 || goodsItem.refund_status == -1"><view class="order-box-btn">退款</view></view>
							<view @click="goRefundDetail(goodsItem.order_goods_id)" v-else><view class="order-box-btn">查看退款</view></view>
						</view> -->
					</view>
				</view>
			</view>
		</view>

		<!-- 订单概况 -->
		<view class="order-summary">
			<view class="order-cell" v-if="orderData.worker_name">
				<text class="tit">服务人员：</text>
				<view class="box">
					<text class="color-title">{{ orderData.worker_name }}</text>
				</view>
			</view>
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
			<block v-if="orderData.pay_status > 0">
				<view class="hr"></view>
				<view class="order-cell">
					<text class="tit">支付方式：</text>
					<view class="box">
						<text class="color-title">{{ orderData.pay_type_name }}</text>
					</view>
				</view>
				<view class="order-cell">
					<text class="tit">支付时间：</text>
					<view class="box">
						<text class="color-title">{{ $util.timeStampTurnTime(orderData.pay_time) }}</text>
					</view>
				</view>
			</block>
			<view class="order-cell" v-if="orderData.buyer_message != ''">
				<text class="tit">买家留言：</text>
				<view class="box">
					<text class="color-title">{{ orderData.buyer_message }}</text>
				</view>
			</view>
			<!-- <view class="order-cell" v-if="orderData.promotion_type_name != ''">
				<text class="tit">类型：</text>
				<view class="box">
					<text class="color-title">{{ orderData.promotion_type_name }}</text>
				</view>
			</view> -->
		</view>
		<view class="button" v-if="orderData.order_status == 'topay'">
			<view class="button-left" @click="closeOrder(orderData.order_id)">关闭订单</view>
			<view class="button-right" v-if="orderData.order_type=='1'" @click="openChoosePayment()">
				立即支付
			</view>
		</view>
		<!-- 选择支付方式弹窗 -->
		<!-- 选择支付方式弹窗 -->
		<payment ref="choosePaymentPopup"></payment>
		<loading-cover ref="loadingCover"></loading-cover>

	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	import payment from '@/components/payment/payment.vue';
	import orderMethod from '../public/js/orderMethod.js';
	export default {
		mixins: [globalConfig, orderMethod],
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
				storeInfo: {}
			};
		},
		components: {
			payment
		},
		onLoad(option) {
			if (option.order_id) this.orderId = option.order_id;
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			if (uni.getStorageSync('token')) {
				this.getOrderData();
			} else {
				// this.$util.redirectTo('/pages/login/login/login', {
				// 	back: '/sellStore/tiyan/info/info?order_id=' + this.orderId
				// });
			}
		},
		methods: {
			makePhone(item) {
				console.log(item, '打电话');
				if (!item.telphone) {
					return
				}
				uni.makePhoneCall({
					phoneNumber: item.telphone || '' //仅为示例
				});
			},
			goHerf(item) {
				if (!item.latitude && !item.longitude) {
					return
				}
			uni.openLocation({
				latitude: Number(item.latitude),
				longitude: Number(item.longitude),
				name: item.store_name,
				address: this.removeComma(item.address),
				success: function() {
					console.log('success');
				}
			});
			},
			removeComma(str) {
				return this.$util.removeComma(str)
			},
			navigateBack() {
				this.$util.goBack();
			},
			getOrderData() {
				this.$api.sendRequest({
					url: '/subcard/api/order/detail',
					data: {
						order_id: this.orderId
					},
					success: res => {
						uni.stopPullDownRefresh();
						if (res.code >= 0) {
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
							this.orderData = res.data;
							this.storeInfo = res.data.store_info || {}
						} else {
							this.$util.showToast({
								title: '未获取到订单信息！'
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages/order/list/list');
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
			closeOrder(id) {
				uni.showModal({
					title: '提示',
					content: '您确定要关闭该订单吗？',
					success: res => {
						if (res.confirm) {
							this.$api.sendRequest({
								url: '/subcard/api/order/close',
								data: {
									order_id: id
								},
								success: res => {
									if (res.code >= 0) {
										this.getOrderData();
									} else {
										this.$util.showToast({
											title: res.message
										});
									}
								}
							});
						}
					}
				})
			},
			// 显示选择支付方式弹框
			openChoosePayment() {
				if (uni.getStorageSync('token')) {
					this.orderPay()
				} else {
					this.$util.showToast({
						title: '您尚未登录，请先登录'
					});
				}
			},
		},
		filters: {
			abs(value) {
				return Math.abs(parseFloat(value)).toFixed(2);
			}
		},

	};
</script>

<style lang="scss">
	@import '../public/css/detail.scss';
	@import '../public/css/payment.scss';
</style>
<style scoped lang="scss">
	.detail-container {
		padding-bottom: 60px;
	}
	.goods-img {
		width: 260rpx !important;
		height: 166rpx !important;
	}
	.button {
		height: 68px;
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0;
		left: 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
		padding-left: 20rpx;
		padding-right: 20rpx;

		.button-left {
			flex: 1;
			height: 48px;
			border: 1px solid #9E9E9E;
			opacity: 1;
			border-radius: 24px;
			font-size: 14px;
			font-family: PingFang SC;
			font-weight: 400;
			line-height: 48px;
			color: #454652;
			opacity: 1;
			text-align: center;
		}

		.button-right {
			flex: 1;
			height: 48px;
			background: #1189F4;
			opacity: 1;
			border-radius: 24px;
			font-size: 14px;
			font-family: PingFang SC;
			font-weight: 400;
			line-height: 48px;
			color: #FFFFFF;
			opacity: 1;
			text-align: center;
			margin-left: 20rpx;
		}
	}

	.address-box {
		width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		overflow: hidden;
		margin: 0 auto;
		margin-top: 10px;
		padding-top: 20px;
		padding-bottom: 20px;
		padding-left: 24rpx;
		padding-right: 24rpx;
		box-sizing: border-box;
		background-image: url('@/common/img/address_bg.png');
		background-size: 100% 100%;
	}

	.adddress-top {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.address-name {
		font-size: 18px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #303133;
		opacity: 1;
	}

	.store-tel {
		width: 42rpx;
		height: 42rpx;
		margin-left: 22rpx;
	}

	.address-bottom {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		margin-top: 5px
	}

	.address-left {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.address-icon {
		width: 12px;
		height: 14px;
		margin-right: 5px;
	}

	.address-content {
		width: 240px;
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #999999;
		opacity: 1;
		line-height: initial;
	}

	.address-guide {
		width: 45px;
		height: 18px;
		background: #FFFFFF;
		border: 1px solid #1189F4;
		opacity: 1;
		border-radius: 4px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
	}

	.guide-icon {
		width: 9px;
		height: 10px;
	}

	.guide-title {
		font-size: 10px;
		font-family: PingFang SC;
		font-weight: normal;
		color: #1189F4;
		opacity: 1;
	}
</style>
