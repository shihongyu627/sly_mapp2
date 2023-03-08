<template>
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
		<view class="order-nav" :style="{top:'90rpx'}">
			<view v-for="(statusItem, statusIndex) in statusList" :key="statusIndex" class="uni-tab-item"
				:id="statusItem.id" :data-current="statusIndex" @click="ontabtap">
				<text class="uni-tab-item-title"
					:class="statusItem.status == orderStatus ? 'uni-tab-item-title-active color-base-border  color-base-text' : ''">
					{{ statusItem.name }}
				</text>
			</view>
		</view>
		<mescroll-uni ref="mescroll" @getData="getListData" top="180rpx">
			<block slot="list">
				<block v-if="orderList.length > 0">
					<view class="order-list">
						<view class="order-item" v-for="(orderItem, orderIndex) in orderList" :key="orderIndex">
							<view class="order-header"
								:class="{ waitpay: orderStatus == 'waitpay' && orderItem.order_status == 0 }">
								<text class="font-size-base">订单号：{{ orderItem.order_no }}</text>
								<text class="status-name color-base-text">{{ orderItem.order_status_name }}</text>
							</view>
							<view class="order-body" @click="goOrderInfo(orderItem)">
								<view class="goods-wrap" v-for="(goodsItem, goodsIndex) in orderItem.order_goods"
									:key="goodsIndex">
									<view class="goods-img">
										<image :src="$util.loadimg(goodsItem.sku_image)" mode="aspectFill"
											:lazy-load="true"></image>
									</view>
									<view class="goods-info">
										<view class="pro-info">
											<view class="goods-name">{{ goodsItem.sku_name }}</view>
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
								<image class="service-img" :src="$util.loadimg(orderItem.headimg)" mode="aspectFill"
									:lazy-load="true"></image>
								<view class="service-name">
									{{orderItem.nickname}}
								</view>
								<view class="service-tel">
									{{orderItem.mobile}}
								</view>
							</view>
							<view class="create_time">
								下单时间：{{ $util.timeStampTurnTime(orderItem.create_time) }}
							</view>
							<view class="footer-box">
								<view class="look-wuliu" @click="goComplete(orderItem)"
									v-if="orderItem.order_status=='2'||orderItem.order_status=='10'">
									退货
								</view>
								<view class="look-wuliu3" v-if="order_type=='2'&&orderItem.order_status=='0'"
									@click="orderEdit(orderItem)">
									修改价格
								</view>
								<view class="look-wuliu2" v-if="order_type=='2'&&orderItem.order_status=='0'"
									@click="operation('orderComplete',orderItem)">
									线下付款
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
		<uni-popup ref="storePopup" type="bottom" :mask-click="false">
			<view class="popBox">
				<view class="popup-title">
					修改价格
				</view>
				<view class="popup-item">
					<view class="popup-itemTitle">订单总价</view>
					<view class="popup-itemMoney">￥{{orderInfo.pay_money}}</view>
				</view>
				<view class="popup-item">
					<view class="popup-itemTitle">修改价格</view>
					<view class="popup-itemMoney">￥<input class="uni-input" type='digit' v-model="adjust_money"
							placeholder-class="placeholder-class" @input="oninput" placeholder="请输入价格" /></view>
				</view>
				<view class="popup-item">
					<view class="popup-itemsTitle">修改备注<text style="color:#FA6741">*</text></view>
				</view>
				<view class="popup-itemContent">
					<textarea class="textareaBox" v-model="remarks" @input="oninputContent" maxlength="30"
						placeholder="请输入，最多30个字" placeholder-style="color:#b1b2b6; font-size:30rpx;"></textarea>
				</view>
				<view class="footer-boxs">
					<view class="footer-bnt1" @click="maskClick()">
						取消
					</view>
					<view class="footer-bnt" @click="onSubmit()">
						确定
					</view>
				</view>
			</view>

		</uni-popup>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import globalConfig from '@/common/js/golbalConfig.js';
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
				order_type: '1',
				goods_id: '',
				orderInfo: {},
				adjust_money: '',
				remarks: ''
			};
		},
		components: {
			uniLoadMore,
		},
		mixins: [globalConfig, orderMethod],
		onLoad(option) {
			if (option.status) this.orderStatus = option.status;
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			this.getOrderStatus();
			this.getOrderType();
			if (uni.getStorageSync('token')) {
				if (this.$refs.mescroll) this.$refs.mescroll.refresh();
			} else {
				// this.$util.redirectTo('/pages/login/login/login', {
				// 	back: '/sellStore/order/list/list?status=' + this.orderStatus
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
			//切换类型
			onOrderType(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				let type = this.typeList[index].order_type
				this.order_type = type;
				if (type == 1) {
					this.getOrderStatus()
				} else {
					this.getOrderSelfStatus()
				}
				this.$refs.loadingCover.show();
				this.$refs.mescroll.refresh();
			},
			operation(action, orderData) {
				let index = this.status;
				console.log(orderData, action);
				switch (action) {
					case 'orderComplete': // 支付
						this.orderComplete(orderData, () => {
							this.$refs.loadingCover.show();
							this.$refs.mescroll.refresh();
						});
						break;
				}
			},
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/dealer/api/storeOrder/lists',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						order_status: this.orderStatus == 'all' ? '' : this.orderStatus,
						order_type: this.order_type
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
					}, {
						status: 'waitpay',
						name: '待付款',
						id: 'status_2'
					},
					{
						status: 'waitsend',
						name: '待发货',
						id: 'status_3'
					},
					{
						status: 'waitconfirm',
						name: '待收货',
						id: 'status_4'
					},
					{
						status: 'waitrefund',
						name: '退款售后',
						id: 'status_5'
					},
					{
						status: 'waitrate',
						name: '已完成',
						id: 'status_6'
					}
				];
			},
			/**
			 * 获取自提订单状态
			 */
			getOrderSelfStatus() {
				this.orderStatus = 'all'
				this.statusList = [{
						status: 'all',
						name: '全部',
						id: 'status_1'
					}, {
						status: 'waitpay',
						name: '待付款',
						id: 'status_2'
					},
					{
						status: 'waitconfirm',
						name: '待自提',
						id: 'status_3'
					},
					{
						status: 'waitrefund',
						name: '退款售后',
						id: 'status_4'
					},
					{
						status: 'waitrate',
						name: '已完成',
						id: 'status_5'
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
			goOrderInfo(data) {
				console.log(data);
				this.$util.redirectTo('/sellStore/order/info/info', {
					order_id: data.order_id
				});
			},
			//修改价格
			orderEdit(data) {
				this.orderInfo = data
				this.$refs.storePopup.open('bottom')
			},
			maskClick() {
				this.$refs.storePopup.close()
			},
			onSubmit() {
				this.$api.sendRequest({
					url: '/dealer/api/storeOrder/adjustPrice',
					data: {
						order_id: this.orderInfo.order_id,
						adjust_money: this.adjust_money - this.orderInfo.pay_money,
						remarks: this.remarks,
					},
					success: res => {
						this.$util.showToast({
							title: res.message
						})
						if (res.code == 0) {
							this.$refs.mescroll.refresh();
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
				this.adjust_money = ''
				this.remarks = ''
				this.$refs.storePopup.close()
			},
			oninput(e) {
				const {
					value
				} = e.target;
				console.log(value);
				this.adjust_money = value
			},
			oninputContent(e) {
				const {
					value
				} = e.target;
				console.log(value);
				this.remarks = value
			},
			goComplete(data) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '是否退货？',
					success: res => {
						if (res.confirm) {
							that.activeRefund(data)
						}
					},
				})
			},
			activeRefund(data) {
				this.$api.sendRequest({
					url: '/dealer/api/storeOrder/activeRefund',
					data: {
						order_id: data.order_id,
					},
					success: res => {
						this.$util.showToast({
							title: res.message
						})
						if (res.code == 0) {
							this.$refs.mescroll.refresh();
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
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

	.footer-box {
		margin-top: 5px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-bottom: 10px;
		padding-right: 20rpx;
		box-sizing: border-box;
	}

	.look-wuliu {
		width: 74px;
		height: 28px;
		border: 1px solid #65666E;
		opacity: 1;
		border-radius: 14px;
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 28px;
		color: #000000;
		opacity: 1;
		text-align: center;
	}

	.look-wuliu3 {
		width: 74px;
		height: 28px;
		border: 1px solid #1189F4;
		opacity: 1;
		border-radius: 14px;
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 28px;
		color: #1189F4;
		opacity: 1;
		text-align: center;
		margin-left: 20rpx;
	}

	.look-wuliu2 {
		width: 74px;
		height: 28px;
		opacity: 1;
		border-radius: 14px;
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 28px;
		color: #fff;
		opacity: 1;
		text-align: center;
		opacity: 1;
		background: #1189F4;
		margin-left: 20rpx;
	}

	.popBox {
		width: 100%;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		overflow: hidden;
		background: #fff !important;

	}

	.footer-boxs {
		width: 100%;
		height: 68px;
		background: #FFFFFF;
		box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.01);
		opacity: 1;
		border-radius: 0px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		margin-top: 50px;
	}

	.footer-bnt1 {
		width: 302rpx;
		height: 96rpx;
		background: #FBFBFB;
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		opacity: 1;
		font-size: 32rpx;
		font-family: PingFang SC-Regular, PingFang SC;
		font-weight: 400;
		color: #333;
		line-height: 96rpx;
		text-align: center;
	}

	.footer-bnt {
		width: 302rpx;
		height: 96rpx;
		background: #1189F4;
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		opacity: 1;
		font-size: 32rpx;
		font-family: PingFang SC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 96rpx;
		text-align: center;
	}

	.popup-title {
		width: 750rpx;
		height: 60px;
		background: #FFFFFF;
		opacity: 1;
		text-align: center;
		line-height: 60px;
		position: relative;
		font-size: 18px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #454652;
		opacity: 1;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}

	.pop-close {
		width: 26px;
		height: 26px;
		position: absolute;
		right: 15px;
		top: 18px;
	}

	.popup-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 60rpx;
		padding-right: 60rpx;
		box-sizing: border-box;
		margin-top: 50rpx;
	}

	.popup-itemTitle {
		font-size: 18px;
		font-family: PingFang SC-Bold, PingFang SC;
		font-weight: bold;
		color: #000000;
	}

	.popup-itemsTitle {
		font-size: 32rpx;
		font-family: PingFang SC-Regular, PingFang SC;
		font-weight: 400;
		color: #000;
	}

	.popup-itemMoney {
		font-size: 28rpx;
		font-family: PingFang SC-Bold, PingFang SC;
		font-weight: bold;
		color: #FA5D34;
		margin-left: 76rpx;
		display: flex;
		flex-direction: row;
	}

	.uni-input {
		height: 50rpx;
		border-bottom: 1rpx solid #D2D5DC;
		width: 190rpx;
	}

	.popup-itemContent {
		width: 630rpx;
		height: 180rpx;
		background: #FBFBFB;
		border-radius: 12rpx 12rpx 12rpx 12rpx;
		opacity: 1;
		margin: 0 auto;
		margin-top: 20rpx;
		padding: 20rpx;
		box-sizing: border-box;

	}

	.textareaBox {
		height: 140rpx;
	}
</style>
