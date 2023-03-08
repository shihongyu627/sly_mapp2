<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="order-container">
		<view class="order-nav" v-if="token">
			<view v-for="(statusItem, statusIndex) in statusList" :key="statusIndex" class="uni-tab-item" :id="statusItem.id" :data-current="statusIndex" @click="ontabtap">
				<text class="uni-tab-item-title" :class="statusItem.status === orderStatus ? 'uni-tab-item-title-active color-base-border  color-base-text' : ''">
					{{ statusItem.name }}
				</text>
			</view>
		</view>

		<mescroll-uni ref="mescroll" @getData="getListData" top="100rpx" v-if="token">
			<block slot="list">
				<view class="order-list" v-if="orderList.length > 0">
					<view class="order-item" v-for="(orderItem, orderIndex) in orderList" :key="orderIndex">
						<view class="order-header">
							<text class="font-size-base">订单号：{{ orderItem.order_no }}</text>
							<text class="status-name color-base-text">{{ orderItem.order_status_name }}</text>
						</view>
						<view class="order-body" @click="orderDetail(orderItem)">
							<view class="goods-wrap">
								<view class="goods-img">
									<image
										:src="$util.img(orderItem.sku_image, { size: 'mid' })"
										@error="imageError(orderIndex)"
										mode="aspectFill"
										:lazy-load="true"
									></image>
								</view>
								<view class="goods-info">
									<view class="pro-info">
										<view class="goods-name">{{ orderItem.sku_name }}</view>
									</view>
									<view class="goods-sub-section">
										<text class="goods-price">
											<text class="unit  price-style small">{{ $lang('common.currencySymbol') }}</text>
											<text class="price-style large" >{{ parseFloat(orderItem.price).toFixed(2).split(".")[0] }}</text>
										    <text class="unit  price-style small">.{{ parseFloat(orderItem.price).toFixed(2).split(".")[1] }}</text>
										</text>
										<text class="goods-num">
											<text class="iconfont iconclose"></text>
											{{ orderItem.num }}
										</text>
									</view>
									<view class="goods-action"><!-- <view class="action-btn">加购物车</view> --></view>
								</view>
							</view>
						</view>
						<view class="order-footer">
							<view class="order-base-info">
								<view class="total">
									<text class="font-size-sub">共{{ orderItem.num }}件商品</text>
									<text class="align-right font-size-base" v-if="orderItem.order_status === 0">
										待付定金：
										<text class="ns-font-size-lg ns-text-color">{{ $lang('common.currencySymbol') }}{{ orderItem.pay_deposit_money }}</text>
									</text>
									<text class="align-right font-size-base" v-else-if="orderItem.order_status === 1">
										待付尾款：
										<text class="ns-font-size-lg ns-text-color">{{ $lang('common.currencySymbol') }}{{ orderItem.final_money }}</text>
									</text>
									<text class="align-right font-size-base" v-else-if="orderItem.order_status === 2">
										合计：
										<text class="ns-font-size-lg ns-text-color">{{ $lang('common.currencySymbol') }}0.00</text>
									</text>
									<text class="align-right font-size-base" v-else-if="orderItem.order_status === -1">
										合计：
										<text class="ns-font-size-lg ns-text-color">{{ $lang('common.currencySymbol') }}{{ orderItem.order_money }}</text>
									</text>
								</view>
							</view>
							<view class="order-action" v-if="orderItem.action.length > 0">
								<block v-for="(operationItem, operationIndex) in orderItem.action" :key="operationIndex">
									<block v-if="operationItem.action == 'orderPayFinal'">
										<block v-if="(orderItem.refund_status == 0 || orderItem.refund_status == -1) && orderItem.order_status != -1">
											<view class="order-box-btn color-base-border color-base-text" @click="operation(operationItem.action, orderItem)" v-if="orderItem.pay_start_time < timestamp && orderItem.pay_end_time > timestamp" >{{ operationItem.title }}</view>
											<view class="order-box-btn disabled" v-else>{{ operationItem.title }}</view>
										</block>
										<view class="order-box-btn disabled" v-else>{{ operationItem.title }}</view>
									</block>
									<block v-else-if="operationItem.action == 'refundDeposit'">
											<view class="order-box-btn" v-if="(orderItem.refund_status == 0 && orderItem.is_deposit_back == 0) || (orderItem.refund_status == -1 && orderItem.is_deposit_back == 0)" @click="operation(operationItem.action, orderItem)">{{ operationItem.title }}</view>
									</block>
									<view class="order-box-btn" @click="operation(operationItem.action, orderItem)" v-else>{{ operationItem.title }}</view>
								</block>
							</view>
							<view class="order-action" v-else><view class="order-box-btn color-base-border color-base-text" @click="orderDetail(orderItem)">查看详情</view></view>
						</view>
					</view>
				</view>
				<view v-else>
					<ns-empty :isIndex="true" :emptyBtn ="{url: '/pages/index/index',text: '去逛逛'}" text="暂无相关预售订单"></ns-empty>
				</view>
			</block>
		</mescroll-uni>

		<!-- 选择支付方式弹窗 -->
		<ns-payment ref="choosePaymentPopup"
			:payMoney="payMoney" 
			@confirm="pay"
			:balanceDeduct="balanceDeduct"
			:isBalance="isBalance"
			@useBalance="useBalance"></ns-payment>
			
		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import orderMethod from './public/js/orderMethod.js';

export default {
	data() {
		return {
			scrollInto: '',
			orderStatus: '',
			statusList: [],
			orderList: [],
			contentText: {},
			isIphoneX: false,
			orderData: null,
			payMoney: 0,
			payType: '',
			timestamp: 0,
			memberBalance: 0,
			isBalance: 0,
			isSub: false,
			token: null
		};
	},
	mixins: [orderMethod],
	onLoad(option) {
		if (option.status) this.orderStatus = option.status;
	},
	computed:{
		balanceDeduct(){
			if (this.orderData && this.orderData.order_status == 1 && this.orderData.final_out_trade_no == '' && this.memberBalance > 0) {
				let payMoney = this.orderData.order_money - this.orderData.presale_deposit_money;
				return (this.memberBalance > payMoney ? payMoney : this.memberBalance).toFixed(2);
			} else {
				return 0; 
			}
		},
		storeToken() {
			return this.$store.state.token;
		}
	},
	onShow() {
		
		
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		this.getOrderStatus();
		
		if (uni.getStorageSync('token')) {
			this.token = uni.getStorageSync('token');
			this.getMmemberBalance();
		} else {
			setTimeout(() => {
				this.$refs.login.open('/pages_promotion/presale/order_list');
			});
		}		
	},
	methods: {
		getMmemberBalance(){
			this.$api.sendRequest({
				url: '/api/memberaccount/info',
				data: {
					account_type: 'balance,balance_money'
				},
				success: res => {
					if (res.data) {
						this.memberBalance = parseFloat(res.data.balance) + parseFloat(res.data.balance_money);
					} 
				}
			});
		},
		ontabtap(e) {
			let index = e.target.dataset.current || e.currentTarget.dataset.current;
			this.orderStatus = this.statusList[index].status;
			
			this.$refs.loadingCover.show();
			this.$refs.mescroll.refresh();
		},
		getListData(mescroll) {
			this.$api.sendRequest({
				url: '/presale/api/order/page',
				data: {
					page: mescroll.num,
					page_size: mescroll.size,
					order_status: this.orderStatus
				},
				success: res => {
					this.timestamp = res.timestamp;
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({ title: msg });
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
		 * 获取订单状态
		 */
		getOrderStatus() {
			this.statusList = [
				{
					status: '',
					name: '全部',
					id: 'status_0'
				},
				{
					status: 0,
					name: '待付款',
					id: 'status_0'
				},
				{
					status: 1,
					name: '待付尾款',
					id: 'status_1'
				},
				{
					status: 2,
					name: '已完成',
					id: 'status_2'
				},
				{
					status: -1,
					name: '已关闭',
					id: 'status_3'
				}
			];
		},
		operation(action, orderData) {
			switch (action) {
				case 'deleteOrder': // 删除
					this.deleteOrder(orderData.id,() => {
						this.$refs.mescroll.refresh();
					});
					break;
				case 'orderClose': //关闭
					this.orderClose(orderData.id, () => {
						this.$refs.mescroll.refresh();
					});
					break;
				case 'orderPayDeposit'://定金支付
					this.orderData = orderData;
					this.openPaymentPopup(orderData, 'presale_deposit_money');
					break;
				case 'refundDeposit'://退定金
					this.refundDeposit(orderData.id, () => {
						this.$refs.mescroll.refresh();
					});
					break;
				case 'orderPayFinal': //支付尾款
					this.orderData = orderData;
					this.openPaymentPopup(orderData, 'final_money');
					break;
			}
		},
		orderDetail(orderData) {
			this.$util.redirectTo('/pages_promotion/presale/order_detail',{order_id: orderData.id})
		},
		imageError(orderIndex) {
			this.orderList[orderIndex].sku_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		pay(){
			if (this.isSub) return;
			this.isSub = true;
			if (this.payType == 'final_money') {
				this.orderPayFinal(this.orderData, () => {
					this.$refs.mescroll.refresh();
				})
			} else if (this.payType == 'presale_deposit_money') {
				this.orderPayDeposit(this.orderData, () => {
					this.$refs.mescroll.refresh();
				})
			}
		},
		useBalance() {
			if (this.isBalance) {
				this.isBalance = 0;
				this.payMoney += parseFloat(this.balanceDeduct);
			} else {
				this.isBalance = 1;
				this.payMoney -= parseFloat(this.balanceDeduct);
			}
		}
	},
	watch: {
		storeToken: function(nVal, oVal) {
			if (nVal) {
				this.token = nVal;
				this.getMmemberBalance();
				this.$refs.mescroll.refresh();
			}
		}
	}
};
</script>

<style lang="scss">
@import './public/css/order_list.scss';
</style>
<style scoped>
/deep/ .uni-page {
	overflow: hidden;
}
/deep/ .mescroll-upwarp {
	padding-bottom: 100rpx;
}
</style>
