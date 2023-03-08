<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<mescroll-uni @getData="getData" ref="mescroll" :size="10">
			<block slot="list">
				<view class="cf-container color-line-border">
					<view class="tab">
						<view @click="changeState(1)"><text :class="order_type == 1 ? 'color-base-text active color-base-border-bottom' : ''">全部</text></view>
						<view @click="changeState(2)"><text :class="order_type == 2 ? 'color-base-text active color-base-border-bottom' : ''">待支付</text></view>
						<view @click="changeState(3)"><text :class="order_type == 3 ? 'color-base-text active color-base-border-bottom' : ''">已完成</text></view>
					</view>
				</view>

				<view class="card-box" v-if="orderList.length > 0">
					<view v-for="(item, index) in orderList" :key="index">
						<view class="card-item" v-if="item.status == 0">
							<view class="card-content">
								<view class="" style="display: flex; justify-content: space-between; margin-bottom: 30rpx;border-bottom: 1rpx solid #fcfcfc;">
									<view class="card-num">订单号: {{ item.order_number }}</view>
									<view class="pay-status">待支付</view>
								</view>
								<view class="" style="display: flex; justify-content: space-between;margin-bottom: 20rpx;">
									<view class="card-name">{{ item.card_name }}</view>
									<view class="card-money">￥{{ item.order_total_price / item.num }}</view>
								</view>
								<view class="" style="display: flex; justify-content: space-between;">
									<view class="card-use">
										<text v-if="item.balance > 0 || item.point > 0 || item.goods_num > 0">礼品卡权益：</text>
										<text class="card-num" v-if="item.balance > 0 && item.point > 0 && item.goods_num > 0">
											￥{{ item.balance }} + {{ item.point }}柚币+商品*{{ item.goods_num }}
										</text>
										<text class="card-num" v-else-if="item.balance > 0 && item.point == 0">￥{{ item.balance }}</text>
										<text class="card-num" v-else-if="item.balance == 0 && item.point > 0">{{ item.point }} 柚币</text>
										<text class="card-num" v-else-if="item.balance == 0 && item.point == 0 && item.goods_num > 0">商品*{{ item.goods_num }}</text>
										<text class="card-num" v-else-if="item.balance > 0 && item.point > 0 && item.goods_num == 0">
											￥{{ item.balance }}+{{ item.point }}柚币
										</text>
										<text class="card-num" v-else-if="item.balance > 0 && item.point == 0 && item.goods_num > 0">
											￥{{ item.balance }}+商品*{{ item.goods_num }}
										</text>
										<text class="card-num" v-else-if="item.balance == 0 && item.point > 0 && item.goods_num > 0">
											{{ item.point }}柚币+商品*{{ item.goods_num }}
										</text>
									</view>
									<view class="card-amount">x{{ item.num }}</view>
								</view>
								<view class="card-account">
									<text class="goods-num">共计{{ item.num }}件商品</text>
									<text>应付款：￥{{ item.order_total_price }}</text>
								</view>
								<view class="button">
									<view class="button-left"><button type="primary" size="mini" @click="closeOrder(item.order_id)">关闭订单</button></view>
									<view class="button-right">
										<button type="primary" size="mini" @click="openChoosePayment(item.order_id, item.order_total_price, item.num)">支付</button>
									</view>
								</view>
							</view>
						</view>

						<view class="card-item" v-else-if="item.status == 1">
							<view class="card-content">
								<view class="" style="display: flex; justify-content: space-between; margin-bottom: 30rpx;border-bottom: 1rpx solid #fcfcfc;">
									<view class="card-num">订单号: {{ item.order_number }}</view>
									<view class="pay-status2">已完成</view>
								</view>
								<view class="" style="display: flex; justify-content: space-between;margin-bottom: 20rpx;">
									<view class="card-name">{{ item.card_name }}</view>
									<view class="card-money">￥{{ item.order_total_price / item.num }}</view>
								</view>
								<view class="" style="display: flex; justify-content: space-between;">
									<view class="card-use">
										<text v-if="item.balance > 0 || item.point > 0 || item.goods_num > 0">礼品卡权益：</text>
										<text class="card-num" v-if="item.balance > 0 && item.point > 0 && item.goods_num > 0">
											￥{{ item.balance }} + {{ item.point }}柚币+商品*{{ item.goods_num }}
										</text>
										<text class="card-num" v-else-if="item.balance > 0 && item.point == 0">￥{{ item.balance }}</text>
										<text class="card-num" v-else-if="item.balance == 0 && item.point > 0">{{ item.point }} 柚币</text>
										<text class="card-num" v-else-if="item.balance == 0 && item.point == 0 && item.goods_num > 0">商品*{{ item.goods_num }}</text>
										<text class="card-num" v-else-if="item.balance > 0 && item.point > 0 && item.goods_num == 0">
											￥{{ item.balance }}+{{ item.point }}柚币
										</text>
										<text class="card-num" v-else-if="item.balance > 0 && item.point == 0 && item.goods_num > 0">
											￥{{ item.balance }}+商品*{{ item.goods_num }}
										</text>
										<text class="card-num" v-else-if="item.balance == 0 && item.point > 0 && item.goods_num > 0">
											{{ item.point }}柚币+商品*{{ item.goods_num }}
										</text>
									</view>
									<view class="card-amount">x{{ item.num }}</view>
								</view>
								<view class="card-account">
									<text class="goods-num">共计{{ item.num }}件商品</text>
									<text>应付款：￥{{ item.order_total_price }}</text>
								</view>
								<view class="button2">
									<view class="button3"><!-- <button type="primary" size="mini"  @click="orderDetail">查看订单</button> --></view>
								</view>
							</view>
						</view>

						<view class="card-item" v-else-if="item.status == 2">
							<view class="card-content">
								<view class="" style="display: flex; justify-content: space-between; margin-bottom: 30rpx;border-bottom: 1rpx solid #fcfcfc;">
									<view class="card-num">订单号: {{ item.order_number }}</view>
									<view class="pay-status2">已关闭</view>
								</view>
								<view class="" style="display: flex; justify-content: space-between;margin-bottom: 20rpx;">
									<view class="card-name">{{ item.card_name }}</view>
									<view class="card-money">￥{{ item.order_total_price / item.num }}</view>
								</view>
								<view class="" style="display: flex; justify-content: space-between;">
									<view class="card-use">
										<text v-if="item.balance > 0 || item.point > 0 || item.goods_num > 0">礼品卡权益：</text>
										<text class="card-num" v-if="item.balance > 0 && item.point > 0 && item.goods_num > 0">
											￥{{ item.balance }} + {{ item.point }}柚币+商品*{{ item.goods_num }}
										</text>
										<text class="card-num" v-else-if="item.balance > 0 && item.point == 0">￥{{ item.balance }}</text>
										<text class="card-num" v-else-if="item.balance == 0 && item.point > 0">{{ item.point }} 柚币</text>
										<text class="card-num" v-else-if="item.balance == 0 && item.point == 0 && item.goods_num > 0">商品*{{ item.goods_num }}</text>
										<text class="card-num" v-else-if="item.balance > 0 && item.point > 0 && item.goods_num == 0">
											￥{{ item.balance }}+{{ item.point }}柚币
										</text>
										<text class="card-num" v-else-if="item.balance > 0 && item.point == 0 && item.goods_num > 0">
											￥{{ item.balance }}+商品*{{ item.goods_num }}
										</text>
										<text class="card-num" v-else-if="item.balance == 0 && item.point > 0 && item.goods_num > 0">
											{{ item.point }}柚币+商品*{{ item.goods_num }}
										</text>
									</view>
									<view class="card-amount">x{{ item.num }}</view>
								</view>
								<view class="card-account">
									<text class="goods-num">共计{{ item.num }}件商品</text>
									<text>应付款：￥{{ item.order_total_price }}</text>
								</view>
								<view class="button2">
									<view class="button3"><!-- <button type="primary" size="mini" @click="orderDetail">查看订单</button> --></view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="card-no-data" v-else>
					<view class="card-image"><image :src="$util.img('public/uniapp/giftcard/detail/no_orders.png')"></image></view>
					<view class="">暂无数据</view>
				</view>
			</block>
		</mescroll-uni>

		<loading-cover ref="loadingCover"></loading-cover>

		<!-- 选择支付方式弹窗 -->
		<ns-payment ref="choosePaymentPopup" :payMoney="price" @confirm="gotoBuy"></ns-payment>
	</view>
</template>

<script>
export default {
	data() {
		return {
			order_id: '',
			order_type: 1,
			orderList: [],
			price: ''
		};
	},
	methods: {
		//切换状态
		changeState(order_type) {
			this.list = [];
			this.order_type = order_type;
			this.$refs.mescroll.refresh();
		},
		getData(mescroll) {
			this.$api.sendRequest({
				url: '/giftcard/api/giftcard/order',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					order_type: this.order_type
				},
				success: res => {
					let newArr = [];
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
					}
					if (mescroll.endSuccess) mescroll.endSuccess(newArr.length);

					//设置列表数据
					if (mescroll.num == 1) this.orderList = []; //如果是第一页需手动制空列表
					this.orderList = this.orderList.concat(newArr); //追加新数据
					setTimeout(() => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}, 300);
				},
				fail: res => {
					if (mescroll.endErr) mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		// 显示选择支付方式弹框
		openChoosePayment(id, price, num) {
			this.order_id = id;
			this.price = price * num;
			// #ifdef H5
			if (localStorage.getItem('userInfo')) {
				uni.setStorageSync('paySource', 'giftcard');
				// #ifdef MP-WEIXIN
				this.subscribeMessage();
				// #endif
				this.$refs.choosePaymentPopup.open();
			} else {
				this.$util.showToast({
					title: '您尚未登录，请先登录'
				});
			}
			// #endif
			uni.setStorageSync('paySource', 'giftcard');
			// #ifdef MP-WEIXIN
			this.subscribeMessage();
			// #endif
			this.$refs.choosePaymentPopup.open();
		},

		/**
		 * 微信订阅消息
		 */
		subscribeMessage() {
			this.$api.sendRequest({
				url: '/weapp/api/weapp/messagetmplids',
				data: {
					keywords: 'ORDER_PAY,ORDER_DELIVERY,ORDER_TAKE_DELIVERY'
				},
				success: res => {
					if (res.data.length) {
						uni.requestSubscribeMessage({
							tmplIds: res.data,
							success: res => {},
							fail: res => {
								console.log('fail', res);
							}
						});
					}
				}
			});
		},
		gotoBuy() {
			this.$api.sendRequest({
				url: '/giftcard/api/order/pay',
				data: {
					order_id: this.order_id
				},
				success: res => {
					if (res.data && res.code == 0) {
						uni.setStorageSync('paySource', 'giftcard');
						this.$refs.choosePaymentPopup.getPayInfo(res.data);
					} else {
						this.isSub = false;
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		},
		closeOrder(id) {
			this.$api.sendRequest({
				url: '/giftcard/api/order/close',
				data: {
					order_id: id
				},
				success: res => {
					this.$util.showToast({
						title: res.message
					});
					this.$refs.mescroll.refresh();
				}
			});
		},
		orderDetail() {
			this.$util.redirectTo('/order/detail', {
				order_id: this.id
			});
		}
	}
};
</script>

<style lang="scss">
.active {
	border-bottom: 4rpx solid;
}

.cf-container {
	background: #fff;
	overflow: hidden;
}

.tab {
	display: flex;
	justify-content: space-between;
	height: 86rpx;

	> view {
		text-align: center;
		width: 33%;
		height: 86rpx;

		text {
			display: inline-block;
			line-height: 86rpx;
			height: 80rpx;
			font-size: 30rpx;
		}
	}
}

.card-item {
	background: #fff;
	padding: 10rpx;
	margin: 20rpx 30rpx;
	border-radius: 10rpx;

	.card-content {
		padding: 20rpx;

		.card-num {
			color: #909399;
			font-size: 26rpx;
		}

		.pay-status {
			color: #fc6666;
		}

		.pay-status2 {
			color: #000;
		}

		.card-name {
			font-weight: 600;
		}

		.card-money {
			color: #fc6666;
			font-weight: 600;
		}

		.card-use {
			color: #909399;
			font-size: 26rpx;
		}
		.card-num {
			color: #909399;
		}

		.card-account {
			text-align: right;

			.goods-num {
				color: #909399;
				font-size: 26rpx;
				margin-right: 20rpx;
			}
		}
	}
}

.card-no-data {
	width: 100%;
	text-align: center;
	.card-image {
		margin-top: 200rpx;
		display: flex;
		image {
			margin: auto auto;
		}
	}
}

.button {
	display: flex;
	padding: 30rpx 20rpx 0 320rpx;

	.button-left {
		margin: 10rpx 20rpx 10rpx 0;

		button {
			background: #fff;
			color: #000;
			border: 1rpx solid #d9d9d9;
			width: 170rpx;
			height: 60rpx;
			line-height: 60rpx;
		}
	}

	.button-right {
		margin: 10rpx 0;

		button {
			width: 120rpx;
			height: 60rpx;
			line-height: 60rpx;
		}
	}
}

.button2 {
	padding: 30rpx 20rpx 0 460rpx;

	.button3 {
		margin: 10rpx 20rpx 10rpx 0;

		button {
			background: #fff;
			color: #000;
			border: 1rpx solid #d9d9d9;
			width: 170rpx;
			height: 60rpx;
			line-height: 60rpx;
		}
	}
}
</style>
