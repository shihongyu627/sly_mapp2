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

		<view class="table-box">
			<block slot="list">
				<block>
					<view class="table-title">
						{{title}}
					</view>
					<view class="table-wrap">
						<view class="table-tr">
							<view class="table-th" v-for="(item, index) in tableTh" :key="index"
								:class="index==0 ? 'table-ths' : 'table-th'">
								{{item.title}}
							</view>
						</view>
						<view v-for="(item, index) in tableData" :key="index">
							<view class="table-tr" :class="index%2!=0 ? 'table-tr' : 'table-trs'" v-if="item.type!=1">
								<view class="table-ths" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.dealer_name}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.in_num||0}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.in_out_num||0}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.stock||0}}
								</view>
								<!-- <view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.name}}
								</view> -->
							</view>
							<view class="table-name" v-if="item.type==1">
								{{item.name}}
							</view>
						</view>
					</view>
				</block>
			</block>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import globalConfig from '@/common/js/golbalConfig.js';
	import dayjs from 'dayjs'
	var isoWeek = require('dayjs/plugin/isoWeek')
	dayjs.extend(isoWeek)
	export default {
		data() {
			return {
				orderStatus: 'week',
				statusList: [],
				isIphoneX: false,
				searchVal: '',
				tableTh: [],
				tableData: [],
				tableThs: [{
					title: "类别"
				}, {
					title: "人数"
				}],
				tableDatas: [{
					"name": "体验",
					"num": "2",
				}, {
					"name": "体验",
					"num": "4",
				}, {
					"name": "体验",
					"num": "2",
				}, {
					"name": "体验",
					"num": "1",
				}],
				tableDatass: [{
					"name": "体验",
					"num": "2",
				}, {
					"name": "其中",
					"type": "1",
				}, {
					"name": "体验",
					"num": "4",
				}, {
					"name": "支出分析",
					"type": "1",
				}, {
					"name": "体验",
					"num": "2",
				}, {
					"name": "体验",
					"num": "1",
				}],
				yearDate: dayjs().format('YYYY'),
				loading: false,
				date_type: '',
				title: '团队周报'
			};
		},
		components: {
			uniLoadMore
		},
		mixins: [globalConfig],
		onLoad(option) {
			if (option.status) this.orderStatus = option.status;
			this.date = this.yearDate + '-' + dayjs().isoWeek()
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			this.getOrderStatus();
			if (uni.getStorageSync('token')) {} else {
				// this.$util.redirectTo('/pages/login/login/login', {
				// 	back: '/pages/order/list/list?status=' + this.orderStatus
				// });
			}
		},
		methods: {
			// 切换状态
			ontabtap(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.orderStatus = this.statusList[index].status;
				if (this.orderStatus == 'week') {
					this.date = this.yearDate + '-' + dayjs().isoWeek()
					this.title = '团队周报'
				} else if (this.orderStatus == 'month') {
					this.date = this.yearDate + '-' + (dayjs().month() + 1)
					this.title = '团队月报'
				} else if (this.orderStatus == 'year') {
					this.date = this.yearDate
					this.title = '团队年报'
				} else if (this.orderStatus == 'total') {
					this.date = ''
					this.title = '团队累计'
				}
				this.$refs.loadingCover.show();
				this.getListData()
			},
			getListData() {
				this.$api.sendRequest({
					url: '/dealer/api/report/dealer',
					data: {
						date_type: this.orderStatus,
						date: this.date
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							console.log(res.data, 888);
							this.tableData = res.data.in_list || []
							this.tableTh = [{
								title: '类别',
							}, {
								title: '进',
							}, {
								title: '销',
							}, {
								title: '存',
							}]
							// newArr = res.data.list;
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			/**
			 * 获取物流订单状态
			 */
			getOrderStatus() {
				this.orderStatus = 'week'
				this.statusList = [
					// {
					// 	status: 'all',
					// 	name: '日报',
					// 	id: 'status_1'
					// },
					{
						status: 'week',
						name: '周报',
						id: 'status_2'
					},
					{
						status: 'month',
						name: '月报',
						id: 'status_3'
					},
					{
						status: 'year',
						name: '年报',
						id: 'status_4'
					},
					{
						status: 'total',
						name: '累计',
						id: 'status_5'
					},
				];
				this.getListData()
			},

		},
		computed: {

		}
	};
</script>

<style lang="scss">
	@import '../public/css/list.scss';
</style>
<style scoped lang="scss">
	.order-nav {
		top: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.table-box {
		margin-top: 120rpx;
		padding-bottom: 60px;
	}

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

	.table-title {
		width: 710rpx;
		margin: 0 auto;
		margin-bottom: 20px;
		margin-top: 20px;
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
	}

	.table-name {
		width: 710rpx;
		height: 50px;
		opacity: 1;
		text-align: center;
		line-height: 50px;
	}

	.table-wrap {
		width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		overflow-x: scroll;
	}

	.table-tr {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.table-th {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 50px;
		border-left: 1px solid #E2E2E2;
		flex: 1;
		min-width: 70px;
	}

	.table-ths {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 50px;
		border-left: 0;
		flex: 1;
		min-width: 100px;
	}

	.table-trs {
		background: #EEEEEE;
	}
</style>
