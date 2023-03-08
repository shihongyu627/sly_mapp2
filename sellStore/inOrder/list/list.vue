<template>
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
							<view class="order-header">
								<text class="font-size-base">订单号：{{ orderItem.order_no }}</text>
								<text class="status-name color-base-text">{{ orderItem.order_status_name }}</text>
							</view>
							<view class="order-body" @click="goOrderInfo(orderItem)">
								<view class="goods-wrap" v-for="(goodsItem, goodsIndex) in orderItem.order_goods_list"
									:key="goodsIndex">
									<view class="goods-img">
										<image :src="$util.loadimg(goodsItem.goods_image)" mode="aspectFill"
											:lazy-load="true"></image>
									</view>
									<view class="goods-info">
										<view class="pro-info">
											<view class="goods-name">{{ goodsItem.goods_name }}</view>
										</view>
										<view class="goods-sub-section">
											<text class="goods-price">
												<text class="unit color-base-text font-size-activity-tag">￥</text>
												<text class="color-base-text">{{ goodsItem.price }}</text>
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
												class="font-size-base">{{ $lang('common.currencySymbol') }}{{ orderItem.pay_money }}</text>
										</text>
									</view>
								</view>
								<!-- 		<view class="order-action" v-else>
									<view class="order-box-btn color-base-border color-base-text"
										@click="orderDetail(orderItem)">查看详情</view>
								</view> -->
							</view>
							<view class="order-service">
								<image class="service-img" :src="$util.loadimg(orderItem.member_info.headimg)"
									mode="aspectFill" :lazy-load="true"></image>
								<view class="service-name">
									{{orderItem.member_info.nickname}}
								</view>
								<view class="service-tel">
									{{orderItem.member_info.mobile}}
								</view>
							</view>
							<view class="create_time">
								下单时间：{{ $util.timeStampTurnTime(orderItem.create_time) }}
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
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import globalConfig from '@/common/js/golbalConfig.js';

	export default {
		data() {
			return {
				orderStatus: 'all',
				orderList: [],
				isIphoneX: false,
				orderData: {},
				payMoney: 0,
				typeList: [],
				order_type: 'in',
				is_self: '1',
				statusList: [],
				is_dealer: '',
				is_store: ''
			};
		},
		components: {
			uniLoadMore,
		},
		mixins: [globalConfig],
		onLoad(option) {
			if (option.status) this.orderStatus = option.status;
			if (option.order_type) this.order_type = option.order_type;
			let title = ''
			if (option.order_type == 'in') {
				this.$langConfig.title('进货订单');
			} else {
				this.$langConfig.title('出货订单');
			}
			this.getOrderStatus();
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			if (uni.getStorageSync('token')) {
				if (this.$refs.mescroll) this.$refs.mescroll.refresh();
			} else {
				// this.$util.redirectTo('/pages/login/login/login', {
				// 	back: '/sellStore/inOrder/list/list?status=' + this.orderStatus
				// });
			}
		},
		methods: {
			// 切换状态
			ontabtap(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.orderStatus = this.statusList[index].status;
				this.$refs.loadingCover.show();
				this.$refs.mescroll.refresh();
			},
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/dealer/api/order/lists',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						order_status: this.orderStatus == 'all' ? '' : this.orderStatus,
						order_type: this.order_type,
						is_self: this.is_self
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.orderList = []; //如果是第一页需手动制空列表
						this.orderList = this.orderList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
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
						status: 'topass',
						name: '待审核',
						id: 'status_2'
					},
					{
						status: 'complete',
						name: '已审核',
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
				switch (action) {
					case 'orderPay': // 支付
						this.orderData = orderData;
						this.payMoney = parseFloat(orderData.pay_money);
						this.openChoosePayment();
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
						this.$util.redirectTo('/pages/order/logistics/logistics', {
							order_id: orderData.order_id
						});
						break;
					case 'memberOrderEvaluation': //评价
						this.$util.redirectTo('/pages/order/evaluate/evaluate', {
							order_id: orderData.order_id
						});
						break;
				}
			},
			goOrderInfo(data) {
				console.log(data);
				this.$util.redirectTo('/sellStore/inOrder/info/info', {
					order_id: data.order_id
				});
			},
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
		padding-left: 30rpx;
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
		padding-left: 20rpx;
		box-sizing: border-box;
		padding-bottom: 15px;
	}
</style>
