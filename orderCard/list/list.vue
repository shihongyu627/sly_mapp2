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
					<view class="card-list">
						<view class="card-item margin-bottom" v-for="(item, index) in orderList" :key="index">
							<view class="card-top" @click="orderDetail(item)">
								<image class="card-img" :src="item.goods_image" mode="aspectFill"></image>
								<view class="card-right">
									<view class="card-content">
										<view class="card-content-left">
											<view class="card-title">
												3次体验卡
											</view>
										</view>
									</view>
									<view class="card-bottom">
										<view class="card-text">
											￥ <text class="card-price">10</text>
										</view>
										<view class="card-num">
											x1
										</view>
									</view>
								</view>
							</view>
							<view class="card-footer">
								<view class="card-btn2">
									取消订单
								</view>
								<view class="card-btn1">
									查看卡
								</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<view>
						<ns-empty :isIndex="!1" :text="$lang('emptyTips')"></ns-empty>
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
				order_type: '1'
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
				// 	back: '/pages/reserve/list/list?status=' + this.orderStatus
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
					url: '/api/order/lists',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						order_status: this.orderStatus,
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
						this.orderList.forEach(v => {
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
			 * 获取物流订单状态
			 */
			getOrderStatus() {
				this.orderStatus = 'all'
				this.statusList = [{
						status: 'all',
						name: '待支付',
						id: 'status_1'
					},
					{
						status: 'waitsend',
						name: '已支付',
						id: 'status_2'
					},
					{
						status: 'waitconfirm',
						name: '已取消',
						id: 'status_3'
					},
				];
			},
			orderDetail(data) {
				// 虚拟订单
				this.$util.redirectTo('/orderCard/detail/detail', {
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

	.card-item {
		width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		overflow: hidden;
		margin: 0 auto;
		margin-top: 10px;
		padding: 12px;
		box-sizing: border-box;
	}

	.card-top {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.card-img {
		width: 100px;
		height: 100px;
		opacity: 1;
		border-radius: 10px;
		background: #ccc;
	}

	.card-right {
		width: 215px;
		height: 100px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.card-content {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.card-content-left {}

	.card-title {
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		width: 215px;
		line-height: initial;
	}

	.card-num {
		font-size: 11px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #999999;
		opacity: 1;
	}

	.card-text {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FA5D34;
		opacity: 1;
	}

	.card-price {
		font-size: 22px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FA5D34;
		opacity: 1;
	}


	.card-footer {
		width: 100%;
		background: #FFFFFF;
		opacity: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		margin-top: 14px;
	}

	.card-btn1 {
		width: 72px;
		height: 28px;
		border: 1px solid #1189F4;
		opacity: 1;
		border-radius: 18px;
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 28px;
		color: #1189F4;
		opacity: 1;
		text-align: center;
	}

	.card-btn2 {
		width: 74px;
		height: 28px;
		border: 1px solid #9E9E9E;
		opacity: 1;
		border-radius: 14px;
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 28px;
		color: #9E9E9E;
		opacity: 1;
		text-align: center;
		margin-right: 10px;
	}

	.card-bottom {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.card-code {
		width: 20px;
		height: 20px;
		background: #000000;
		opacity: 1;
	}
</style>
