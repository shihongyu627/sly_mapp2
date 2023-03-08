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

		<!-- 地址信息 -->
		<view class="address-wrap">
			<view class="icon">
				<image :src="$util.loadimg(orderData.member_info&&orderData.member_info.headimg)" mode="aspectFill">
				</image>
			</view>
			<view class="address-info">
				<view class="info">
					<text class="font-size-base">下单用户：{{ orderData.member_info&&orderData.member_info.nickname }}</text>
				</view>
				<view class="detail">
					<text class="font-size-base">联系方式：{{orderData.member_info&& orderData.member_info.mobile }}</text>
					<img class='store-tel' src="@/common/img/store_tel.png" mode="aspectFill"
						@click="makePhone(orderData)" />
				</view>
			</view>
		</view>

		<!-- 店铺 -->
		<view class="site-wrap">
			<view class="site-body">
				<view class="goods-wrap" v-for="(goodsItem, goodsIndex) in orderData.order_goods_list"
					:key="goodsIndex">
					<view class="goods-img" @click="goDetail(goodsItem.goods_id)">
						<image :src="$util.loadimg(goodsItem.goods_image)" mode="aspectFill"></image>
					</view>
					<view class="goods-info">
						<view @click="goDetail(goodsItem.goods_id)" class="goods-name">{{ goodsItem.goods_name }}</view>
						<view class="goods-sub-section">
							<view>
								<text class="goods-price color-base-text">
									<text class="unit">￥</text>
									<text class="font-size-base">{{ goodsItem.price }}</text>
								</text>
							</view>
							<view>
								<text class="font-size-base">
									<text class="iconfont iconclose"></text>
									{{ goodsItem.num }}
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 订单金额 -->
		<view class="order-money">
			<view class="order-cell">
				<text class="tit">商品金额</text>
				<view class="box align-right">
					<text class="color-title">
						<text class="font-size-goods-tag">￥</text>
						{{ orderData.goods_money }}
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.buyer_message != ''">
				<text class="tit">买家留言：</text>
				<view class="box">
					<text class="color-title">{{ orderData.buyer_message }}</text>
				</view>
			</view>
			<view class="order-cell">
				<view class="box align-right">
					<text>实付金额：</text>
					<text class="color-base-text">
						<text class="font-size-goods-tag">￥</text>
						<text class="font-size-base">{{ orderData.pay_money }}</text>
					</text>
				</view>
			</view>
		</view>
		<view class="order-money">
			<view class="order-wayBox" v-if="orderData.pay_gallery">
				<view class="way-right">
					<view class="way-top">
						<view class="way-title">
							支付凭证
						</view>
					</view>
					<view class="other-info">
						<view class="other-info-box" v-for="(i, t) in orderData.pay_gallery" :key="t">
							<image class="other-info-image" :src="$util.loadimg(i)" mode="aspectFill"
								@click="preview(orderData.pay_gallery, t)"></image>
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
		</view>
		<view class="footer-box"
			v-if="dealerInfo.dealer_id!=orderData.dealer_id&&dealerInfo.dealer_id==orderData.parent_dealer_id&&dealerInfo.is_dealer==1&&orderData.order_status=='topass'">
			<view class="footer-btn2" @click="onClickClose">
				拒绝
			</view>
			<view class="footer-btn1" @click="onClickOrderpass">
				通过
			</view>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>

	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';

	export default {
		mixins: [globalConfig],
		data() {
			return {
				isIphoneX: false,
				orderId: 0,
				orderData: {},
				action: {},
				dealerInfo: {}
			};
		},
		components: {},
		onLoad(option) {
			if (option.order_id) this.orderId = option.order_id;
			this.dealerInfo = uni.getStorageSync('dealerInfo') || {}
			console.log(this.dealerInfo, '经销商信息');
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			if (uni.getStorageSync('token')) {
				this.getOrderData();
			} else {
				// this.$util.redirectTo('/pages/login/login/login', {
				// 	back: '/pages/order/detail/detail?order_id=' + this.orderId
				// });
			}
		},
		methods: {
			goDetail(id) {
				this.$util.redirectTo('/pages/goods/detail/detail', {
					sku_id: id
				});
			},
			makePhone(item) {
				console.log(item, '打电话');
				if (!item.mobile) {
					return
				}
				uni.makePhoneCall({
					phoneNumber: item.mobile || '' //仅为示例
				});
			},
			getOrderData() {
				this.$api.sendRequest({
					url: '/dealer/api/order/detail',
					data: {
						order_id: this.orderId
					},
					success: res => {
						uni.stopPullDownRefresh();
						if (res.code >= 0) {
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
							console.log(res.data.order_goods_list);
							if (res.data.pay_gallery) {
								res.data.pay_gallery = res.data.pay_gallery.split(',')
							}
							this.orderData = res.data;
						} else {
							this.$util.showToast({
								title: '未获取到订单信息！'
							});
							setTimeout(() => {
								this.$util.redirectTo('/sellStore/inOrder/list/list');
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
			// 图片预览
			preview(urls, j) {
				for (let k = 0; k < urls.length; k++) {
					urls[k] = this.$util.loadimg(urls[k])
				}
				uni.previewImage({
					urls: urls,
					current: j
				});
			},
			onClickOrderpass() {
				let that = this
				this.$api.sendRequest({
					url: '/dealer/api/order/orderpass',
					data: {
						order_id: this.orderId,
						pass_status: '1',
						pass_text: ''
					},
					success: res => {
						this.$util.showToast({
							title: res.message
						});
						if (res.code >= 0) {
							that.getOrderData()
						}
					},
					fail: res => {
						uni.stopPullDownRefresh();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			onClickClose() {
				let that = this
				this.$api.sendRequest({
					url: '/dealer/api/order/close',
					data: {
						order_id: this.orderId
					},
					success: res => {
						this.$util.showToast({
							title: res.message
						});
						if (res.code >= 0) {
							that.getOrderData()
						}
					},
					fail: res => {
						uni.stopPullDownRefresh();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			}
		},
		filters: {

		}
	};
</script>

<style lang="scss">
	@import '../public/css/detail.scss';
</style>
<style scoped lang="scss">
	.detail-container {
		padding-bottom: 90px;
	}

	.footer-box {
		width: 100%;
		height: 68px;
		background: #FFFFFF;
		box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.01);
		opacity: 1;
		border-radius: 0px;
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
	}

	.footer-btn1 {
		width: 160px;
		height: 48px;
		background: #1189F4;
		opacity: 1;
		border-radius: 24px;
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 48px;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
	}

	.footer-btn2 {
		width: 160px;
		height: 44px;
		border: 1px solid #DFDFDF;
		opacity: 1;
		border-radius: 25px;
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 44px;
		color: #000000;
		opacity: 1;
		text-align: center;
	}

	.order-wayBox {
		margin-top: 10px;
		margin-bottom: 10px;
		display: flex;
		flex-direction: row;
	}

	.way-top {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.way-icon {
		width: 22px;
		height: 22px;
		background: #FA5D34;
		opacity: 1;
		border-radius: 11px;
		margin-right: 10px;
	}

	.way-title {
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		margin-right: 10px;
	}

	.way-text {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 500;
		color: #65666E;
		opacity: 1;
	}

	.way-left {
		font-size: 12px;
		font-weight: 500;
		color: #000000;
		opacity: 1;
		width: 230px;
	}

	.way-copy {
		font-size: 12px;
		font-weight: 500;
		color: #1189F4;
		opacity: 1;
	}

	.way-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 280px;
	}

	.way-code {
		display: flex;
		flex-direction: row;
		align-items: center;

	}

	.code-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.code-items {
		margin-left: 90px;
	}

	.code-title {
		font-size: 14px;
		font-weight: 500;
		color: #65666E;
		opacity: 1;
	}

	.code-img {
		width: 88px;
		height: 88px;
		opacity: 1;
		border-radius: 0px;
		background: #999;
		margin-top: 5px;
	}

	.other-info {
		width: 100%;
		padding: 0 $padding;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		margin-top: $margin-updown;
	}

	.other-info-box {
		width: 195rpx;
		height: 195rpx;
		margin-right: $margin-both;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-right: 0rpx;
		margin-bottom: 30rpx;
		position: relative;


		.iconfont {
			font-size: 60rpx;
			color: #898989;
			line-height: 1;
		}

		text {
			line-height: 1;
		}

		.imgDel {
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			right: -20rpx;
			top: -20rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.iconfont {
				font-size: $font-size-toolbar;
			}
		}
	}

	.other-info-image {
		width: 100%;
		border-radius: $border-radius;
	}

	.other-info-box.active {
		border: 1rpx dashed #898989;
	}

	.other-info-box.active:active {
		background: rgba($color: #cccccc, $alpha: 0.6);
	}

	.other-info-box:nth-child(4n) {
		margin-right: 0;
	}
</style>
