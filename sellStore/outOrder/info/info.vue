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
		<view class="footer-box" v-if="orderData.order_status=='tosign'||orderData.order_status=='complete'">
			<view class="footer-btn2" @click="goComplete" v-if="orderData.order_status=='tosign'">
				确认收货
			</view>
			<view class="footer-btn2" @click="onClickLook">
				查看物流
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
				action: {}
			};
		},
		components: {},
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
			goComplete() {
				let that = this
				uni.showModal({
					title: '提示',
					content: '您确定已经收到货物了吗？',
					success: res => {
						if (res.confirm) {
							that.orderComplete()
						}
					},
				})
			},
			orderComplete() {
				this.$api.sendRequest({
					url: '/dealer/api/order/ordercomplete',
					data: {
						order_id: this.orderId
					},
					success: res => {
						this.$util.showToast({
							title: res.message
						})
						if (res.code == 0) {
							this.getOrderData()
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			getOrderData() {
				this.$api.sendRequest({
					url: '/dealer/api/order/detail',
					data: {
						order_id: this.orderId
					},
					success: res => {
						if (res.code >= 0) {
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
							console.log(res.data.order_goods_list);
							this.orderData = res.data;
						} else {
							this.$util.showToast({
								title: '未获取到订单信息！'
							});
							setTimeout(() => {
								this.$util.redirectTo('/sellStore/outOrder/list/list');
							}, 1500);
						}
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			/**
			 * 下拉刷新
			 */
			onPullDownRefresh() {
				this.getOrderData();
				setTimeout(() => {
					uni.stopPullDownRefresh();
				}, 2000)
			},
			onClickLook() {
				this.$util.redirectTo('/pages_tool/order/logistics', {
					order_id: this.orderId,
					type: 'store'
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
<style scoped>
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
		justify-content: flex-end;
		padding-right: 50rpx;
		box-sizing: border-box;
	}

	.footer-btn2 {
		width: 300rpx;
		height: 80rpx;
		border: 1px solid #DFDFDF;
		opacity: 1;
		border-radius: 40rpx;
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 80rpx;
		color: #000000;
		opacity: 1;
		text-align: center;
		margin-left: 40rpx;
	}
</style>
