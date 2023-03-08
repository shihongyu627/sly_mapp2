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
							<view class="order-header">
								<image class="shop-icon" :src="loadimg(orderItem.store_image)" mode="aspectFill">
									<text class="delivery_store_name">{{orderItem.store_name}}</text>
									<text class="status-name"
										:style="{color:orderItem.status=='sub'?'#FF9710':'#A6ABBA'}">{{ orderItem.status_name }}</text>
							</view>
							<view class="list-item">
								<text class="iconfont iconshijian1 item-icon"></text>
								<view class="item-text">
									{{ orderItem.store_info.open_date }}
								</view>
							</view>
							<view class="list-item" v-if="orderItem.store_info">
								<text class="iconfont icondizhi item-icon"></text>
								<view class="item-text">
									{{ removeComma(orderItem.store_info.address||'')}}
								</view>
							</view>
							<view class="list-content">
								预约人员：{{orderItem.name}}
							</view>
							<view class="list-content">
								预约电话：{{orderItem.mobile}}
							</view>
							<view class="list-content">
								预约时间： {{orderItem.to_date}} {{orderItem.to_time}}
							</view>
							<view class="list-content">
								预约类型： {{orderItem.type_name}}
							</view>
							<view class="order-footer" v-if="orderItem.status=='sub'">
								<view class="order-action">
									<view class="order-box-btn .order-box-btn1"
										@click="onVerifyQrcode(orderItem.verify_qrcode)">查看核销码
									</view>
									<view class="order-box-btn" @click="onSubcancel(orderItem)">取消</view>
								</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<view>
						<ns-empty :isIndex="!1" text="暂无记录"></ns-empty>
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
				statusList: [],
				orderList: [],
				isIphoneX: false,
				orderData: {},
				payMoney: 0,
				payMoneyMerge: 0,
				typeList: [],
				order_type: '1',
				type: ''
			};
		},
		components: {
			uniLoadMore,
		},
		mixins: [globalConfig],
		onLoad(option) {
			if (option.status) this.orderStatus = option.status;
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			this.getOrderStatus();
			if (uni.getStorageSync('token')) {
				if (this.$refs.mescroll) this.$refs.mescroll.refresh();
			} else {
				// this.$util.redirectTo('/pages/login/login/login', {
				// 	back: '/orderreserve/list/list?status=' + this.orderStatus
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
					url: '/subcard/api/membercard/sublists',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						status: this.orderStatus == 'all' ? '' : this.orderStatus,
						type: this.type
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
						status: 'sub',
						name: '待核销',
						id: 'status_2'
					},
					{
						status: 'complete',
						name: '已核销',
						id: 'status_3'
					},
					{
						status: 'cancel',
						name: '已取消',
						id: 'status_4'
					},
				];
			},
			loadimg(imgStr) {
				return this.$util.loadimg(imgStr)
			},
			removeComma(str) {
				return this.$util.removeComma(str)
			},
			onSubcancel(data) {
				uni.showModal({
					title: '提示',
					content: '是否取消该预约？',
					success: res => {
						if (res.confirm) {
							this.$api.sendRequest({
								url: '/subcard/api/membercard/subcancel',
								data: {
									id: data.id,
									cancel_text: '',
								},
								success: res => {
									let msg = res.message;
									this.$util.showToast({
										title: msg
									});
									setTimeout(() => {
										this.$refs.mescroll.refresh();
									}, 500);
								},
								fail: res => {
									mescroll.endErr();
									if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
								}
							});
						}
					}
				})
			},
			onVerifyQrcode(imgStr) {
				if (!imgStr) {
					this.$util.showToast({
						title: '暂无核销码'
					});
					return
				}
				let img = this.$util.loadimg(imgStr)
				uni.previewImage({
					current: 0,
					urls: [img],
				});
			},
			orderDetail(data) {
				switch (parseInt(data.order_type)) {
					case 2:
						// 自提订单
						this.$util.redirectTo('/order/detail_pickup/detail_pickup', {
							order_id: data.order_id
						});
						break;
					case 3:
						// 本地配送订单
						this.$util.redirectTo('/order/detail_local_delivery/detail_local_delivery', {
							order_id: data.order_id
						});
						break;
					case 4:
						// 虚拟订单
						this.$util.redirectTo('/pages/order/detail_virtual/detail_virtual', {
							order_id: data.order_id
						});
						break;
					default:
						this.$util.redirectTo('/order/detail/detail', {
							order_id: data.order_id
						});
						break;
				}
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
	@import '@/common/css/order_parment.scss';
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

	.shop-icon {
		width: 40px;
		height: 40px;
		background: #ccc;
		margin-right: 12px;
	}

	.delivery_store_name {
		font-size: 34rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		width: 410rpx;
	}

	.list-item {
		display: flex;
		flex-direction: row;
		padding-left: 30rpx;
		padding-right: 30rpx;
		box-sizing: border-box;
	}

	.item-icon {
		margin-right: 10px;
	}

	.item-text {
		font-size: 14px;
		font-weight: 400;
		color: #65666E;
		opacity: 1;
		width: 260px;
	}

	.list-content {
		font-size: 14px;
		font-weight: 400;
		color: #000000;
		opacity: 1;
		padding-left: 30rpx;
		padding-right: 30rpx;
		box-sizing: border-box;
	}

	.order-box-btn {
		height: 28px;
		border: 1px solid #A6ABBA;
		opacity: 1;
		border-radius: 18px;
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 28px;
		color: #65666E;
		opacity: 1;
		text-align: center;
		padding-left: 30rpx;
		padding-right: 30rpx;
	}

	.order-box-btn1 {
		border: 1px solid #1189F4;
		color: #1189F4;
	}

	.order-action {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		padding-bottom: 0 !important;
	}

	.order-item {
		padding-bottom: 30rpx;
	}
</style>
