<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="order-container" :data-theme="themeStyle">
		<view class="order-nav">
			<view v-for="(statusItem, statusIndex) in typeList" :key="statusIndex" class="type-item" :id="statusItem.id"
				:data-current="statusIndex" @click="onOrderType">
				<text class="type-item-title"
					:class="statusItem.order_type == order_type ? 'type-item-title-active color-base-border  color-base-text' : ''">
					{{ statusItem.name }}
				</text>
			</view>
		</view>
		<view class="order-nav" v-if="token" :style="{top:'90rpx'}">
			<view v-for="(statusItem, statusIndex) in statusList" :key="statusIndex" class="uni-tab-item"
				:id="statusItem.id" :data-current="statusIndex" @click="ontabtap">
				<text class="uni-tab-item-title"
					:class="statusItem.status == orderStatus ? 'uni-tab-item-title-active color-base-border  color-base-text' : ''">
					{{ statusItem.name }}
				</text>
			</view>
		</view>

		<mescroll-uni ref="mescroll" @getData="getListData" top="200rpx" v-if="token">
			<block slot="list">
				<view class="order-list" v-if="orderList.length > 0">
					<view class="order-item" v-for="(orderItem, orderIndex) in orderList" :key="orderIndex">
						<view class="order-header"
							:class="{ waitpay: orderStatus == 'waitpay' && orderItem.order_status == 0 }">
							<view class="iconfont"
								:class="$util.inArray(orderItem.order_id, mergePayOrder) == -1 ? 'iconyuan_checkbox' : 'iconyuan_checked color-base-text'"
								@click="selectOrder(orderItem.order_id, orderItem.pay_money)"
								v-if="orderStatus == 'waitpay' && orderItem.order_status == 0"></view>
							<text class="font-size-base">订单号：{{ orderItem.order_no }}</text>
							<text class="status-name color-base-text">{{ orderItem.order_status_name }}</text>
						</view>
						<view class="order-body" @click="orderDetail(orderItem)">
							<view class="goods-wrap" v-for="(goodsItem, goodsIndex) in orderItem.order_goods"
								:key="goodsIndex">
								<view class="goods-img">
									<image :src="$util.img(goodsItem.sku_image, { size: 'mid' })"
										@error="imageError(orderIndex, goodsIndex)" mode="aspectFill" :lazy-load="true">
									</image>
								</view>
								<view class="goods-info">
									<view class="pro-info">
										<view class="goods-name" v-if="goodsItem.goods_class == 2">
											{{ goodsItem.goods_name }}
										</view>
										<view class="goods-name" v-else>{{ goodsItem.sku_name }}</view>
										<view class="sku" v-if="goodsItem.sku_spec_format">
											<view class="goods-spec">
												<block v-for="(x, i) in goodsItem.sku_spec_format" :key="i">
													{{ x.spec_value_name }}
													{{ i < goodsItem.sku_spec_format.length - 1 ? '; ' : '' }}
												</block>
											</view>
										</view>
									</view>
									<view class="goods-sub-section">
										<text class="goods-price">
											<text
												class="unit price-style small">{{ $lang('common.currencySymbol') }}</text>
											<text
												class="price-style large">{{ parseFloat(goodsItem.price).toFixed(2).split(".")[0] }}</text>
											<text
												class="unit price-style small">.{{ parseFloat(goodsItem.price).toFixed(2).split(".")[1] }}</text>

										</text>
										<text class="goods-num">
											<text class="iconfont iconclose"></text>
											{{ goodsItem.num }}
										</text>
									</view>
									<view class="goods-action">
										<!-- <view class="action-btn">加购物车</view> -->
									</view>
								</view>
							</view>
						</view>
						<view class="order-footer">
							<view class="order-base-info">
								<view class="total">
									<text class="font-size-sub">共{{ orderItem.goods_num }}件商品</text>
									<text class="align-right font-size-base">
										实付款：
										<text
											class="font-size-base price-font">{{ $lang('common.currencySymbol') }}{{ orderItem.order_money }}</text>
									</text>
								</view>
							</view>
							<view class="order-action" v-if="orderItem.action.length > 0">
							<!-- 	<view class="order-time" v-if="orderItem.order_status == 0" id="action-date">
									<image :src="$util.img('public/uniapp/order/time.png')"></image>
									剩余时间：
									<uni-count-down :day="orderItem.discountTimeMachine.d"
										:hour="orderItem.discountTimeMachine.h"
										:minute="orderItem.discountTimeMachine.i"
										:second="orderItem.discountTimeMachine.s" color="#FF4644"
										splitorColor="#FF4644" />
								</view> -->
								<view class="order-box-btn"
									v-if="evaluateConfig.evaluate_status == 1 && orderItem.is_evaluate == 1"
									@click="operation('memberOrderEvaluation', orderItem)">
									<text v-if="orderItem.evaluate_status == 0">评价</text>
									<text v-else-if="orderItem.evaluate_status == 1">追评</text>
								</view>
								<view class="order-box-btn"
									:class="{ 'color-base-border color-base-text': operationItem.action == 'orderPay' }"
									v-for="(operationItem, operationIndex) in orderItem.action" :key="operationIndex"
									@click="operation(operationItem.action, orderItem)">
									{{ operationItem.title }}
								</view>
							</view>
							<view class="order-action"
								v-else-if="orderItem.action.length == 0 && orderItem.is_evaluate == 1 && evaluateConfig.evaluate_status == 1">
								<view class="order-box-btn" v-if="orderItem.is_evaluate == 1"
									@click="operation('memberOrderEvaluation', orderItem)">
									<text v-if="orderItem.evaluate_status == 0">评价</text>
									<text v-else-if="orderItem.evaluate_status == 1">追评</text>
								</view>
							</view>
							<view class="order-action" v-else>
								<view class="order-box-btn color-base-border color-base-text"
									@click="orderDetail(orderItem)">查看详情</view>
							</view>
						</view>
					</view>
				</view>
				<view v-else>
					<ns-empty :isIndex="false" :text="$lang('emptyTips')"></ns-empty>
				</view>
			</block>
		</mescroll-uni>

		<view class="order-batch-action" :class="{ 'bottom-safe-area': isIphoneX }" v-if="mergePayOrder.length">
			<view class="action-btn color-base-text color-base-border" @click="mergePay()">合并付款</view>
		</view>

		<!-- 选择支付方式弹窗 -->
		<ns-payment ref="choosePaymentPopup"></ns-payment>
		<ns-payment ref="choosePaymentMergePopup"></ns-payment>

		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import orderMethod from './public/js/orderMethod.js';
	import nsPayment from '@/components/payment/payment.vue';

	export default {
		data() {
			return {
				scrollInto: '',
				orderStatus: 'all',
				statusList: [],
				orderList: [],
				contentText: {},
				mergePayOrder: [],
				isIphoneX: false,
				evaluateConfig: {
					evaluate_audit: 1,
					evaluate_show: 0,
					evaluate_status: 1
				},
				orderData: {},
				payMoney: 0,
				payMoneyMerge: 0,
				token: null,
				order_id: 0,
				searchText: "",
				pageText: "",
				typeList: [],
				order_type: '1',
			};
		},
		components: {
			nsPayment
		},
		mixins: [orderMethod],
		onLoad(option) {
			if (option.status) this.orderStatus = option.status;
			if (option.order_id) this.order_id = option.order_id;
		},
		onShow() {
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			this.getEvaluateConfig();
			this.getOrderStatus();
			this.getOrderType();
			if (uni.getStorageSync('token')) {
				this.token = uni.getStorageSync('token');
				if (this.$refs.mescroll) this.$refs.mescroll.refresh();
			} else {
				setTimeout(() => {
					this.$refs.login.open('/pages/order/list?status=' + this.orderStatus);
				});
			}
		},
		methods: {
			ontabtap(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.orderStatus = this.statusList[index].status;
				this.$refs.loadingCover.show();
				this.$refs.mescroll.refresh();
			},
			//切换类型
			onOrderType(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				let type = this.typeList[index].order_type
				this.order_type = type;
				this.orderStatus = 'all'
				if (type == 1) {
					this.getOrderStatus()
				} else {
					this.getOrderSelfStatus()
				}
				this.$refs.loadingCover.show();
				this.$refs.mescroll.refresh();
			},
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/api/order/lists',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						order_status: this.orderStatus,
						order_id: this.order_id,
						searchText: this.pageText,
						order_type: this.order_type
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						let auto_close = 0
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
							auto_close = res.data.auto_close
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) {
							this.orderList = []; //如果是第一页需手动制空列表
							this.order_id = 0
						}
						this.orderList = this.orderList.concat(newArr); //追加新数据
						let date = (Date.parse(new Date())) / 1000
						this.orderList.forEach(v => {
							v.discountTimeMachine = this.$util.countDown((v.create_time + auto_close) -
								date);
							v.order_goods.forEach(vo => {
								if (vo.sku_spec_format) {
									try {
										vo.sku_spec_format = JSON.parse(vo.sku_spec_format);
									} catch (e) {
										vo.sku_spec_format = vo.sku_spec_format;
									}
								} else {
									vo.sku_spec_format = [];
								}
							});
						});
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			/**
			 * 获取订单状态
			 */
			getOrderStatus() {
				this.statusList = [{
						status: 'all',
						name: this.$lang('all'),
						id: 'status_0'
					},
					{
						status: 'waitpay',
						name: this.$lang('waitPay'),
						id: 'status_1'
					},
					{
						status: 'waitsend',
						name: this.$lang('readyDelivery'),
						id: 'status_2'
					},
					{
						status: 'waitconfirm',
						name: this.$lang('waitDelivery'),
						id: 'status_3'
					},
					{
						status: 'complete',
						name: '已完成',
						id: 'status_4'
					}
				];
			},
			/**
			 * 获取自提订单状态
			 */
			getOrderSelfStatus() {
				this.statusList = [{
						status: 'all',
						name: '全部',
						id: 'status_0'
					}, {
						status: 'waitpay',
						name: '待付款',
						id: 'status_1'
					},
					{
						status: 'waitconfirm',
						name: '待自提',
						id: 'status_2'
					},
					// {
					// 	status: 'waitrefund',
					// 	name: '退款售后',
					// 	id: 'status_3'
					// },
					{
						status: 'waitrate',
						name: '已完成',
						id: 'status_3'
					}
				];
			},
			getOrderType() {
				this.typeList = [{
						order_type: '1',
						name: '物流',
						id: 'type_0'
					},
					{
						order_type: '2',
						name: '自提',
						id: 'type_1'
					},
				];
			},
			operation(action, orderData) {
				let index = this.status;
				switch (action) {
					case 'orderPay': // 支付
						this.orderData = orderData;
						this.payMoney = parseFloat(orderData.pay_money);
						this.orderPay(orderData);
						break;
					case 'orderClose': //关闭
						this.orderClose(orderData.order_id, () => {
							this.$refs.mescroll.refresh();
						});
						break;
					case 'memberTakeDelivery': //收货
						this.orderDelivery(orderData.order_id, () => {
							this.$refs.mescroll.refresh();
						});
						break;
					case 'trace': //查看物流
						this.$util.redirectTo('/pages_tool/order/logistics', {
							order_id: orderData.order_id
						});
						break;
					case 'memberOrderEvaluation': //评价
						this.$util.redirectTo('/pages_tool/order/evaluate', {
							order_id: orderData.order_id
						});
						break;
					case 'memberVirtualTakeDelivery':
						this.orderVirtualDelivery(orderData.order_id, () => {
							this.$refs.mescroll.refresh();
						});
						break;
				}
			},
			orderDetail(data) {
				switch (parseInt(data.order_type)) {
					case 2:
						// 自提订单
						this.$util.redirectTo('/order/detail_pickup', {
							order_id: data.order_id
						});
						break;
					case 3:
						// 本地配送订单
						this.$util.redirectTo('/order/detail_local_delivery', {
							order_id: data.order_id
						});
						break;
					case 4:
						// 虚拟订单
						this.$util.redirectTo('/pages_tool/order/detail_virtual', {
							order_id: data.order_id
						});
						break;
					default:
						this.$util.redirectTo('/order/detail', {
							order_id: data.order_id
						});
						break;
				}
			},
			/**
			 * 选择订单
			 * @param {Object} orderId
			 */
			selectOrder(orderId, pay_money) {
				if (this.$util.inArray(orderId, this.mergePayOrder) != -1) {
					this.mergePayOrder.splice(this.$util.inArray(orderId, this.mergePayOrder), 1);
					this.payMoneyMerge -= parseFloat(pay_money);
				} else {
					this.payMoneyMerge += parseFloat(pay_money);
					this.mergePayOrder.push(orderId);
				}
			},
			/**
			 * 合并支付
			 */
			mergePay() {
				if (this.mergePayOrder.length) {
					this.$api.sendRequest({
						url: '/api/order/pay',
						data: {
							order_ids: this.mergePayOrder.toString()
						},
						success: res => {
							if (res.code >= 0) {
								this.$refs.choosePaymentMergePopup.getPayInfo(res.data);
							} else {
								this.$util.showToast({
									title: res.message
								});
							}
						}
					});
				}
			},
			imageError(orderIndex, goodsIndex) {
				this.orderList[orderIndex].order_goods[goodsIndex].sku_image = this.$util.getDefaultImage().goods;
				this.$forceUpdate();
			},
			getEvaluateConfig() {
				this.$api.sendRequest({
					url: '/api/goodsevaluate/config',
					success: res => {
						if (res.code == 0) {
							var data = res.data;
							this.evaluateConfig = data;
						}
					}
				});
			},
			search() {
				this.pageText = this.searchText;
				this.$refs.mescroll.refresh();
			}
		},
		computed: {
			mpOrderList() {
				if (!this.orderList[this.status]) return;
				return this.orderList[this.status].list || [];
			},
			storeToken() {
				return this.$store.state.token;
			}
		},
		watch: {
			storeToken: function(nVal, oVal) {
				if (nVal) {
					this.token = nVal;
					this.$refs.mescroll.refresh();
				}
			}
		}
	};
</script>

<style lang="scss">
	@import './public/css/list.scss';
	@import '@/common/css/order_parment.scss';
	.cate-search {
		width: 100%;
		height: 100rpx;
		background: #ffffff;
		padding: 10rpx 30rpx;
		box-sizing: border-box;
		/* #ifdef H5 */
		padding-top: 30rpx;
		/* #endif */
		position: relative;
		z-index: 998;

		input {
			font-size: $font-size-base;
			height: 76rpx;
			padding: 0 25rpx 0 30rpx;
			line-height: 60rpx;
			width: calc(100% - 120rpx);
		}

		text {
			font-size: 32rpx;
			color: $color-tip;
			width: 120rpx;
			text-align: center;
		}

		.search-box {
			width: 100%;
			height: 100%;
			background: $color-bg;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 40rpx;
		}
	}
</style>
<style scoped>
	/deep/ .uni-page {
		overflow: hidden;
	}

	/deep/ .mescroll-upwarp {
		padding-bottom: 100rpx;
	}

	.type-item {
		width: 80px;
		text-align: center;
	}

	.type-item-title {
		font-size: 14px;
		font-weight: 400;
		color: #1B1E21;
	}

	.type-item-title-active {
		font-size: 16px;
		font-weight: bold;
		color: #1189F4 !important;
	}

	.uni-tab-item-title {
		border: 0;
		padding-left: 30rpx;
		padding-right: 30rpx;
		height: 32px;
		background: #fff;
		opacity: 1;
		border-radius: 16px;
		color: #999999;
		line-height: 32px;
	}

	.uni-tab-item-title-active {
		background: #1189F4;
		color: #fff !important;
	}

	.order-service {
		margin-top: 10px;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 40rpx;
		box-sizing: border-box;
	}

	.service-img {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		opacity: 1;
		margin-right: 5px;
		background: #ccc;
	}

	.service-name {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #231E1E;
		opacity: 1;
		margin-right: 12px;
	}

	.service-tel {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #A6ABBA;
		opacity: 0.5;
	}

	.create_time {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #000000;
		opacity: 0.5;
		margin-top: 5px;
		padding-left: 40rpx;
		box-sizing: border-box;
		padding-bottom: 10px;
	}
</style>
