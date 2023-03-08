<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<view class="order-detail">
			<view class="order-detail-box">
				<view class="header">
					<view class="title">
						<text>共{{ orderData.num }}件商品</text>
					</view>
					<text class="color-base-text font-size-tag" v-if="orderData.is_refund == 1">已退款</text>
					<text class="color-base-text font-size-tag" v-else-if="orderData.is_settlement == 1">已结算</text>
					<text class="color-base-text font-size-tag" v-else>待结算</text>
				</view>
				<view class="detail-body">
					<view class="detail-body-box">
						<view class="goods-image"><image :src="$util.img(orderData.sku_image, { size: 'mid' })" @error="imageError()" mode="aspectFill"></image></view>
						<view class="order-info">
							<view class="goods-name">{{ orderData.sku_name }}</view>
							<view class="goods-sub-section margin-top">
								<view>
									<text class="goods-price">
										<text class="unit price-color">￥</text>
										<text class="price-color font-size-toolbar" >{{ parseFloat(orderData.price).toFixed(2).split(".")[0] }}</text>
										<text class="unit price-color">.{{ parseFloat(orderData.price).toFixed(2).split(".")[1] }}</text>
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

				<view class="detail-footer">
					<text></text>
					<text>
						<text>合计：</text>
						<text class="price-color total">￥{{ orderData.real_goods_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-detail-box commission">
				<view class="header">
					<view class="title color-base-bg-before"><text>返佣详情</text></view>
					<text class="color-base-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</text>
				</view>
				<view class="detail-content">
					<view class="order-info-item">
						<text class="tit">订单编号：</text>
						<text>{{ orderData.order_no }}</text>
					</view>
					<view class="order-info-item">
						<text class="tit">分佣层级：</text>
						<text>{{ orderData.commission_level }}级</text>
					</view>
					<view class="order-info-item">
						<text class="tit">返佣金额：</text>
						<text class="price-color font-size-toolbar">
							<text class="font-size-goods-tag">￥</text>
							{{ parseFloat(orderData.commission).toFixed(2).split(".")[0] }}
							<text class="font-size-goods-tag">.{{ parseFloat(orderData.commission).toFixed(2).split(".")[1] }}</text>
						</text>
						
					</view>
				</view>
			</view>
		</view>
		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import fenxiaoWords from 'common/js/fenxiao-words.js';
export default {
	data() {
		return {
			isIphoneX: false,
			orderId: 0,
			orderData: {
				action: []
			}
		};
	},
	components: {},
	onLoad(option) {
		if (option.id) {
			this.orderId = option.id;
		} else {
			uni.navigateBack({
				delta: 1
			});
		}
	},
	mixins: [fenxiaoWords],
	onShow() {
		setTimeout( () => {
			if (this.addonIsExist && !this.addonIsExist.fenxiao) {
				this.$util.showToast({
					title: '商家未开启分销',
					mask: true,
					duration: 2000
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
				}, 2000);
				return;
			}
		}, 1000);

		this.isIphoneX = this.$util.uniappIsIPhoneX();

		if (uni.getStorageSync('token')) {
			this.getOrderData();
		} else {
			setTimeout(() => {
				this.$refs.login.open('/pages_promotion/fenxiao/order_detail?id=' + this.orderId);
			});
		}
	},
	methods: {
		getOrderData() {
			this.$api.sendRequest({
				url: '/fenxiao/api/order/info',
				data: {
					fenxiao_order_id: this.orderId
				},
				success: res => {
					if (res.code >= 0) {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						this.orderData = res.data;
					} else {
						this.$util.showToast({
							title: '未获取到订单信息！'
						});
						setTimeout(() => {
							this.$util.redirectTo('/pages_promotion/fenxiao/order', {}, 'redirectTo');
						}, 1500);
					}
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		imageError() {
			this.orderData.sku_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		}
	},
	computed: {
		storeToken() {
			return this.$store.state.token;
		}
	},
	watch: {
		storeToken: function(nVal, oVal) {
			if (nVal) {
				this.getOrderData();
			}
		}
	}
};
</script>

<style lang="scss">
.order-detail {
	width: 100%;
	padding: 0 $padding;
	box-sizing: border-box;
	margin-top: $margin-updown;
	.order-detail-box {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		background: #ffffff;
		border-radius: $border-radius;
		.header {
			width: 100%;
			padding: 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			.title {
				display: inline-block;
				position: relative;
				line-height: 1;
			}
		}
		.detail-body {
			width: 100%;
			padding: 0 30rpx 30rpx 30rpx;
			box-sizing: border-box;

			.detail-body-box {
				width: 100%;
				height: 100%;
				display: flex;
				.goods-image {
					width: 180rpx;
					height: 180rpx;
					border-radius: $border-radius;
					image {
						width: 100%;
						height: 100%;
						border: 1rpx solid $color-line;
						border-radius: $border-radius;
					}
				}
				.order-info {
					width: calc(100% - 200rpx);
					height: 180rpx;
					padding-left: $padding;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.goods-name {
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						line-height: 1.5;
						font-size: $font-size-base;
					}

					.goods-sub-section {
						width: 100%;
						line-height: 1.3;
						display: flex;

						.goods-price {
							font-size: $font-size-base;
						}

						.unit {
							font-weight: normal;
							font-size: $font-size-tag;
							margin-right: 2rpx;
						}

						view {
							flex: 1;
							line-height: 1.3;
							&:last-of-type {
								text-align: right;

								.iconfont {
									line-height: 1;
									font-size: $font-size-base;
								}
							}
						}
					}
				}
			}
		}
		.detail-content {
			width: 100%;
			padding: 0 30rpx 30rpx 30rpx;
			box-sizing: border-box;
			border-bottom: 1rpx solid $color-line;
			text {
				font-size: $font-size-base;
			}
			.order-info-item .tit {
				display: inline-block;
			}
		}
		.detail-footer {
			width: 100%;
			height: 100rpx;
			padding: $padding;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.total {
				font-weight: 600;
			}
		}
	}
}
.commission {
	margin-top: 20rpx;
	.detail-content {
		border: 0 !important;
	}
}
.order-money-detail {
	width: 100%;
	padding: 0 $padding;
	box-sizing: border-box;
	margin-top: $margin-updown;
	.order-money-detail-box {
		width: 100%;
		height: 100%;
		padding-top: $padding;
		box-sizing: border-box;
		background: #ffffff;
		border-radius: $border-radius;
		.header {
			width: 100%;
			height: 70rpx;
			padding: 0 $padding;
			border-bottom: 1rpx solid $color-line;
			display: flex;
			align-items: center;
			box-sizing: border-box;
			.title {
				padding-left: 20rpx;
				display: inline-block;
				position: relative;
				line-height: 1;
				font-weight: 600;
			}
			.title::before {
				content: '';
				display: block;
				width: 4rpx;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
				border-radius: 6rpx;
			}
		}
		.money-detail-body {
			width: 100%;
			padding: $padding;
			box-sizing: border-box;
			.order-cell {
				display: flex;
				margin: 10rpx 0;
				align-items: center;
				background: #fff;
				line-height: 40rpx;

				.tit {
					text-align: left;
					display: inline-block;
					width: 200rpx;
				}

				.box {
					flex: 1;
					line-height: inherit;

					.textarea {
						height: 40rpx;
					}
				}

				.iconfont {
					color: #bbb;
					font-size: $font-size-base;
				}

				.order-pay {
					padding: 0;

					text {
						display: inline-block;
						margin-left: 6rpx;
					}
				}
				text {
					color: $color-tip;
					font-size: $font-size-tag;
				}
			}
		}
	}
}
.price-color{
	color: var(--price-color);
}
</style>
