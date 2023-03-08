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
							<view class="" @click="goOrderInfo(orderItem)">
								<view class="order-header">
									<text class="font-size-base">订单号：{{ orderItem.sub_no }}</text>
									<text class="status-name color-base-text">{{ orderItem.status_name }}</text>
								</view>

								<view class="record-text">
									预约时间：{{ $util.timeStampTurnTime(orderItem.create_time) }}
								</view>
								<view class="record-item">
									体验卡产品：{{orderItem.subcard_name}}
								</view>
								<view class="record-text">
									预约人：{{ orderItem.name}}
								</view>
								<view class="record-text">
									联系方式：{{orderItem.mobile}}
								</view>
								<view class="record-content">
									<view class="record-content-item">
										<view class="record-num">
											{{orderItem.total_count}}
										</view>
										<view class="record-total">
											总次数
										</view>
									</view>
									<view class="record-content-item">
										<view class="record-num">
											{{Number(orderItem.total_count)-Number(orderItem.use_count)}}
										</view>
										<view class="record-total">
											剩余次数
										</view>
									</view>
								</view>
							</view>

							<view class="order-action" v-if="orderItem.status=='sub'">
								<view class="order-box-btn order-box-btn1" @click="onClickCancel(orderItem)">
									<text>取消订单</text>
								</view>
								<view class="order-box-btn order-box-btn2" @click="onClickVerif(orderItem)">
									<text>核销</text>
								</view>
							</view>
						</view>

					</view>
				</block>
				<block v-else>
					<view>
						<ns-empty :isIndex="!1" text="暂无预约"></ns-empty>
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
				scrollInto: '',
				orderStatus: 'all',
				statusList: [],
				orderList: [],
				isIphoneX: false,
				orderData: {},
				payMoney: 0,
				payMoneyMerge: 0,
				typeList: [],
				type: 'subcard'
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
				// 	back: '/sellStore/record/list/list?status=' + this.orderStatus
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
					url: '/dealer/api/subOrder/lists',
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
					},
					{
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
			//取消
			onClickCancel(data) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '是否取消该预约？',
					success: res => {
						if (res.confirm) {
							this.$api.sendRequest({
								url: '/dealer/api/subOrder/cancel',
								data: {
									id: data.id,
									cancel_text: '门店取消',
								},
								success: res => {
									this.$util.showToast({
										title: res.message
									});
									if (res.code >= 0) {
										this.$refs.mescroll.refresh();
									}
								},
								fail: res => {
									uni.stopPullDownRefresh();
									if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
								}
							});
						}
					}
				})

			},
			//核销
			onClickVerif() {
				this.$util.redirectTo('/pages_tool/verification/index');
			},
			goOrderInfo(data) {
				console.log(data);
				// this.$util.redirectTo('/sellStore/record/info/info', {
				// 	id: data.id
				// });
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

	.record-item {
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		padding-left: 30rpx;
		margin-bottom: 5px;
	}

	.record-text {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #65666E;
		opacity: 1;
		padding-left: 30rpx;
		margin-bottom: 5px;
	}

	.record-content {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		padding-bottom: 10px;
		margin-top: 10px;
	}

	.record-content-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.record-num {
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
	}

	.record-total {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #65666E;
		opacity: 1;
	}

	.order-action {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		padding-right: 30rpx;
		padding-bottom: 10px;
	}

	.order-box-btn1 {
		border: 1px solid #9E9E9E;
		color: #9E9E9E;
		border-radius: 25px;
	}

	.order-box-btn2 {
		border: 1px solid #1189F4;
		color: #1189F4;
		border-radius: 25px;
	}
</style>
