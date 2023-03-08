<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="order-container" :data-theme="themeStyle">
		<view class="order-nav">
			<view v-for="(statusItem, statusIndex) in statusList" :key="statusIndex" class="uni-tab-item"
				:id="statusItem.id" :data-current="statusIndex" @click="ontabtap">
				<text class="uni-tab-item-title"
					:class="statusItem.status == orderStatus ? 'uni-tab-item-title-active color-base-border  color-base-text' : ''">
					{{ statusItem.name }}
				</text>
			</view>
		</view>

		<mescroll-uni ref="mescroll" @getData="getListData" top="90rpx">
			<block slot="list">
				<block v-if="orderList.length > 0">
					<view class="order-list">
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
							<view class="order-body" @click="goOrderInfo(orderItem)">
								<view class="goods-wrap">
									<view class="goods-img">
										<image :src="$util.loadimg(orderItem.card_cover)" mode="aspectFill"
											:lazy-load="true"></image>
									</view>
									<view class="goods-info">
										<view class="pro-info">
											<view class="goods-name">{{ orderItem.order_name }}</view>
										</view>
										<view class="goods-sub-section">
											<text class="goods-price">
												<text class="unit color-base-text font-size-activity-tag">￥</text>
												<text class="color-base-text">{{ orderItem.goods_money }}</text>
											</text>
											<text class="goods-num">
												<text class="iconfont iconclose"></text>
												{{ orderItem.num }}
											</text>
										</view>
									</view>
								</view>
							</view>
							<view class="order-footer">
								<view class="order-action">
									<view class="order-box-btn order-box-btn1"
										v-if="orderItem.order_type=='2'&&orderItem.order_status=='topay'"
										@click="operation('orderComplete',orderItem)">线下付款
									</view>
									<!-- 	<view class="order-box-btn color-base-border color-base-text"
										v-if="orderItem.order_status=='topay'" @click="operation('orderPay',orderItem)">
										待支付
									</view>
									<view class="order-box-btn color-base-border color-base-text"
										v-if="orderItem.order_status=='complete'" @click="operation('info',orderItem)">
										查看卡
									</view> -->
								</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<view>
						<ns-empty :isIndex="!1" text="暂无订单"></ns-empty>
					</view>
				</block>
			</block>
		</mescroll-uni>
		<!-- 选择支付方式弹窗 -->
		<!-- 选择支付方式弹窗 -->
		<payment ref="choosePaymentPopup" @close="payClose"
			:balanceUsable="orderData && orderData.subcard_info &&  orderData.subcard_info.card_right_type == 'balance' ? false : true ">
		</payment>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import globalConfig from '@/common/js/golbalConfig.js';
	import payment from '@/components/payment/payment.vue';
	import orderMethod from '../public/js/orderMethod.js';
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
				typeList: [],
			};
		},
		components: {
			uniLoadMore,
			payment
		},
		mixins: [globalConfig, orderMethod],
		onLoad(option) {
			if (option.status) this.orderStatus = option.status;
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			this.getEvaluateConfig();
			this.getOrderStatus();

			if (uni.getStorageSync('token')) {
				if (this.$refs.mescroll) this.$refs.mescroll.refresh();
			} else {
				// this.$util.redirectTo('/pages/login/login/login', {
				// 	back: '/pages/tiyan/list/list?status=' + this.orderStatus
				// });
			}
		},
		methods: {
			// 切换状态
			ontabtap(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.orderStatus = this.statusList[index].status;
				if (this.orderStatus == '') this.mergePayOrder = [];
				this.$refs.loadingCover.show();
				this.$refs.mescroll.refresh();
			},
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/dealer/api/subCardOrder/lists',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						order_status: this.orderStatus == 'all' ? '' : this.orderStatus,
					},
					success: res => {
						let newArr = [];
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
						} else {}
						if (mescroll.endSuccess) mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.orderList = []; //如果是第一页需手动制空列表
						this.orderList = this.orderList.concat(newArr); //追加新数据
						setTimeout(() => {
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						}, 300);
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			/**
			 * 获取物流订单状态
			 */
			getOrderStatus() {
				this.orderStatus = 'all'
				this.statusList = [{
						status: 'all',
						name: '全部',
						id: 'status_1'
					},
					{
						status: 'topay',
						name: '待支付',
						id: 'status_2'
					},
					{
						status: 'complete',
						name: '已支付',
						id: 'status_3'
					},
					{
						status: 'close',
						name: '已取消',
						id: 'status_4'
					},
				];
			},
			operation(action, orderData) {
				let index = this.status;
				console.log(orderData, action);
				switch (action) {
					case 'orderComplete': // 支付
						this.orderComplete(orderData, () => {
							this.$refs.mescroll.refresh();
						});
						break;
				}
			},
			goOrderInfo(data) {
				console.log(data);
				this.$util.redirectTo('/sellStore/tiyan/info/info', {
					order_id: data.order_id
				});
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
			imageError(orderIndex, goodsIndex) {
				this.orderList[orderIndex].order_goods[goodsIndex].sku_image = this.$util.getDefaultImage()
					.default_goods_img;
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
			// 显示选择支付方式弹框
			openChoosePayment() {
				this.$refs.choosePaymentPopup.open();
			},
			// 显示选择支付方式弹框【合并支付】
			openChoosePaymentMerge() {
				this.$refs.choosePaymentMergePopup.open();
			}
		},
		computed: {
			mpOrderList() {
				if (!this.orderList[this.status]) return;
				return this.orderList[this.status].list || [];
			}
		}
	};
</script>

<style lang="scss">
	@import '../public/css/list.scss';
	@import '../public/css/payment.scss';
</style>
<style scoped>
	.goods-price {
		color: #FA5D34 !important;
		font-size: 20px !important
	}

	.font-size-activity-tag {}

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

	.order-action {
		padding-top: 0 !important;
	}

	.order-box-btn {
		border-radius: 14px;
		text-align: center;
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #1189F4 !important;
		opacity: 1;
		border: 1px solid #1189F4 !important;
	}

	.order-box-btn1 {
		color: #fff !important;
		opacity: 1;
		border: 0px solid #9E9E9E !important;
		background: #1189F4;
	}
</style>
