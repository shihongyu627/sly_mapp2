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
				<block v-if="orderStatus!='month'">
					<view class="table-title">
						现金收支{{orderStatus=='day'?'日报':'周报'}}
					</view>
					<view class="table-wrap">
						<view class="table-tr">
							<view class="table-ths">
								{{orderStatus=='day'?'昨日余额':'上周余额'}}
							</view>
							<view class="table-th">
								{{inout_report.l_balance}}
							</view>
						</view>
						<view class="table-tr table-trs">
							<view class="table-ths">
								{{orderStatus=='day'?'今日收款':'本周收款'}}
							</view>
							<view class="table-th">
								{{inout_report.to_in_money}}
							</view>
							<view class="table-th">
								{{orderStatus=='day'?'今日支出':'本周支出'}}
							</view>
							<view class="table-th">
								{{inout_report.to_out_money}}
							</view>
						</view>
						<view class="table-tr">
							<view class="table-th" v-for="(item, index) in tableThss" :key="index"
								:class="index==0 ? 'table-ths' : 'table-th'">
								{{item.title}}
							</view>
						</view>
						<view v-for="(item, index) in tableDatass" :key="index">
							<view class="table-tr" :class="index%2!=0 ? 'table-tr' : 'table-trs'" v-if="item.type!=1">
								<view class="table-ths" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.title}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.money}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.title2||''}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.money2||''}}
								</view>
							</view>
							<view class="table-name" v-if="item.type==1">
								{{item.name}}
							</view>
						</view>
						<view class="table-tr">
							<view class="table-ths">
								{{orderStatus=='day'?'今日余额':'本周余额'}}
							</view>
							<view class="table-th">
								{{inout_report.to_balance}}
							</view>
						</view>
					</view>
					<view class="table-title">
						团队{{orderStatus=='day'?'日报':'周报'}}
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
									{{item.worker_name}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.subcard399_order_num}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.subcard2980_order_num}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.device_order_num}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.xbb_order_num}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.other_order_num}}
								</view>
							</view>
							<view class="table-name" v-if="item.type==1">
								{{item.name}}
							</view>
						</view>
					</view>
					<view class="table-title">
						用户分析
					</view>
					<view class="table-wrap">
						<view class="table-tr">
							<view class="table-th" v-for="(item, index) in tableThs" :key="index"
								:class="index==0 ? 'table-ths' : 'table-th'">
								{{item.title}}
							</view>
						</view>
						<view v-for="(item, index) in tableDatas" :key="index">
							<view class="table-tr" :class="index%2!=0 ? 'table-tr' : 'table-trs'" v-if="item.type!=1">
								<view class="table-ths" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.name}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.num}}
								</view>
							</view>
							<view class="table-name" v-if="item.type==1">
								{{item.name}}
							</view>
						</view>
					</view>
				</block>
				<block v-if="orderStatus=='month'">
					<view class="table-title">
						月报
					</view>
					<view class="table-wrap">
						<view class="table-name">
							月度损益报表
						</view>
						<view class="table-tr">
							<view class="table-th table-trs" v-for="(item, index) in month_Th" :key="index"
								:class="index==0 ? 'table-ths' : 'table-th'">
								{{item.title}}
							</view>
						</view>
						<view v-for="(item, index) in month_inout" :key="index">

							<view class="table-tr" :class="index%2==0 ? 'table-tr' : 'table-trs'" v-if="item.type!=1">
								<view class="table-ths" :class="index%2==0 ? 'table-th' : 'table-trs'">
									{{item.title}}
								</view>
								<view class="table-th" :class="index%2==0 ? 'table-th' : 'table-trs'">
									{{item.money}}
								</view>
								<view class="table-th" :class="index%2==0 ? 'table-th' : 'table-trs'">
									{{item.last_money}}
								</view>
								<view class="table-th" :class="index%2==0 ? 'table-th' : 'table-trs'">
									{{item.rate}}
								</view>
							</view>

						</view>
					</view>
					<view class="table-wrap" style="margin-top: 20rpx;">
						<view class="table-name">
							月度收入分析表
						</view>
						<view class="table-tr">
							<view class="table-th table-trs" v-for="(item, index) in month_Th" :key="index"
								:class="index==0 ? 'table-ths' : 'table-th'">
								{{item.title}}
							</view>
						</view>
						<view class="table-tr">
							<view class="table-ths">
								总收入
							</view>
							<view class="table-th">
								{{month_in_ll.in_total}}
							</view>
							<view class="table-th">
								{{month_in_ll.last_in_total}}
							</view>
							<view class="table-th">
								{{month_in_ll.in_rate}}
							</view>
						</view>
						<view v-for="(item, index) in month_in_llArr" :key="index">
							<view class="table-name" v-if="item.type==1" :class="index%2!=0 ? '' : 'table-trs'">
								{{item.name}}
							</view>
							<view class="table-tr" :class="index%2!=0 ? 'table-tr' : 'table-trs'" v-if="item.type!=1">
								<view class="table-ths" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.title}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.money}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.last_money}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.rate}}
								</view>
							</view>

						</view>
					</view>

					<view class="table-wrap" style="margin-top: 20rpx;">
						<view class="table-name">
							收入趋势分析表
						</view>
						<view class="table-tr">
							<view class="table-th table-trs" v-for="(item, index) in month_AllTh" :key="index"
								:class="index==0 ? 'table-ths' : 'table-th'">
								{{item.title}}
							</view>
						</view>
						<view v-for="(item, index) in total_ll" :key="index">
							<view class="table-tr" :class="index%2==0 ? 'table-tr' : 'table-trs'" v-if="item.type!=1">
								<view class="table-ths" :class="index%2==0 ? 'table-th' : 'table-trs'">
									总收入
								</view>
								<view class="table-th" :class="index%2==0 ? 'table-th' : 'table-trs'">
									{{item.m_01}}
								</view>
								<view class="table-th" :class="index%2==0 ? 'table-th' : 'table-trs'">
									{{item.m_02}}
								</view>
								<view class="table-th" :class="index%2==0 ? 'table-th' : 'table-trs'">
									{{item.m_03}}
								</view>
								<view class="table-th" :class="index%2==0 ? 'table-th' : 'table-trs'">
									{{item.m_04}}
								</view>
								<view class="table-th" :class="index%2==0 ? 'table-th' : 'table-trs'">
									{{item.m_05}}
								</view>
								<view class="table-th" :class="index%2==0 ? 'table-th' : 'table-trs'">
									{{item.m_06}}
								</view>
								<view class="table-th" :class="index%2==0 ? 'table-th' : 'table-trs'">
									{{item.m_07}}
								</view>
								<view class="table-th" :class="index%2==0 ? 'table-th' : 'table-trs'">
									{{item.m_08}}
								</view>
								<view class="table-th" :class="index%2==0 ? 'table-th' : 'table-trs'">
									{{item.m_09}}
								</view>
								<view class="table-th" :class="index%2==0 ? 'table-th' : 'table-trs'">
									{{item.m_10}}
								</view>
								<view class="table-th" :class="index%2==0 ? 'table-th' : 'table-trs'">
									{{item.m_11}}
								</view>
								<view class="table-th" :class="index%2==0 ? 'table-th' : 'table-trs'">
									{{item.m_12}}
								</view>
							</view>

						</view>
						<view v-for="(item, index) in month_all_llArr" :key="index">
							<view class="table-namebox" :class="index%2!=0 ? '' : 'table-trs'">
								<view class="table-name1" v-if="item.type==1">
									{{item.name}}
								</view>
								<view class="table-name2" v-if="item.type==1">

								</view>
							</view>
							<view class="table-tr" :class="index%2!=0 ? 'table-tr' : 'table-trs'" v-if="item.type!=1">
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.title}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.data.m_01}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.data.m_02}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.data.m_03}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.data.m_04}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.data.m_05}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.data.m_06}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.data.m_07}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.data.m_08}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.data.m_09}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.data.m_10}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.data.m_11}}
								</view>
								<view class="table-th" :class="index%2!=0 ? 'table-th' : 'table-trs'">
									{{item.data.m_12}}
								</view>
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
				orderStatus: 'all',
				statusList: [],
				isIphoneX: false,
				searchVal: '',
				tableTh: [],
				tableData: [],
				tableThss: [{
					title: "今日收款"
				}, {
					title: "今日支出"
				}],
				tableThs: [{
					title: "类别"
				}, {
					title: "人数"
				}],
				tableDatas: [],
				tableDatass: [],
				loading: false,
				yearDate: dayjs().format('YYYY'),
				date: dayjs().format('YYYY-MM-DD'),
				inout_report: {},
				member_report: {},
				team_report: {},
				month_ll: [],
				month_Th: [],
				month_in_ll: {},
				month_inout: [],
				month_in_llArr: [],
				month_AllTh: [],
				total_ll: [],
				month_all_llArr: []
			};
		},
		components: {
			uniLoadMore
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
				if (this.orderStatus == 'day') {
					this.date = dayjs().format('YYYY-MM-DD')
					this.title = '团队日报'
				} else if (this.orderStatus == 'week') {
					this.date = this.yearDate + '-' + dayjs().isoWeek()
					this.title = '团队周报'
					this.tableThss = [{
						title: "本周收款"
					}, {
						title: "本周支出"
					}]
				} else {
					this.date = this.yearDate + '-' + (dayjs().month() + 1)
					this.title = '团队月报'
				}
				this.$refs.loadingCover.show();
				this.getListData()
			},
			getListData() {
				this.$api.sendRequest({
					url: '/dealer/api/report/store',
					data: {
						date_type: this.orderStatus,
						date: this.date || ""
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							if (this.orderStatus != 'month') {
								this.inout_report = res.data.inout_report
								this.member_report = res.data.member_report
								this.tableData = res.data?.team_report?.team_list || []
								this.tableTh = [{
									title: '姓名'
								}, {
									title: '办399卡'
								}, {
									title: '2980卡'
								}, {
									title: '9800设备'
								}, {
									title: '小白咘'
								}, {
									title: '其他'
								}]
								this.tableDatas = [{
									"name": "体验",
									"num": this.member_report?.tiyan_num,
								}, {
									"name": "办卡或购买",
									"num": this.member_report?.buy_num,
								}, {
									"name": "转化率",
									"num": this.member_report?.rate_value,
								}]
								this.tableDatass = this.inout_report?.item_ll
							} else {
								this.month_all_ll = res.data.month_all_ll
								this.month_in_ll = res.data.month_in_ll
								this.month_inout = res.data?.month_inout?.month_ll
								let income_ll = this.month_in_ll.income_ll
								let team_in_ll = this.month_in_ll.team_in_ll
								this.month_Th = [{
									title: '项目'
								}, {
									title: '金额'
								}, {
									title: '上月'
								}, {
									title: '增长率'
								}]
								let dd1 = {
									name: '产品分析',
									type: 1
								}
								let dd2 = {
									name: '团队分析',
									type: 1
								}
								this.month_in_llArr = [dd1, ...income_ll, dd2, ...team_in_ll]
								this.month_AllTh = [{
									title: '项目'
								}, {
									title: '1月'
								}, {
									title: '2月'
								}, {
									title: '3月'
								}, {
									title: '4月'
								}, {
									title: '5月'
								}, {
									title: '6月'
								}, {
									title: '7月'
								}, {
									title: '8月'
								}, {
									title: '9月'
								}, {
									title: '10月'
								}, {
									title: '11月'
								}, {
									title: '12月'
								}]
								this.total_ll = this.month_all_ll.total_ll

								let dd3 = {
									name: '产品分析',
									type: 1
								}
								let dd4 = {
									name: '团队分析',
									type: 1
								}
								let in_ll = this.month_all_ll.in_ll
								let team_ll = this.month_all_ll.team_ll
								this.month_all_llArr = [dd3, ...in_ll, dd4, ...team_ll]
								console.log(this.month_all_llArr, 4444);
							}

							// newArr = res.data.list;
						} else {
							this.$util.showToast({
								title: msg
							});
						}
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
				this.orderStatus = 'day'
				this.statusList = [{
						status: 'day',
						name: '日报',
						id: 'status_1'
					},
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
		// width: 100%;
		height: 50px;
		opacity: 1;
		text-align: center;
		line-height: 50px;
		flex: 1;
	}

	.table-namebox {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		min-width: 925px;
	}

	.table-name1 {
		width: 710rpx;
		height: 50px;
		opacity: 1;
		text-align: center;
		line-height: 50px;
	}

	.table-name2 {
		width: 200rpx;
		height: 50px;
		opacity: 1;
		text-align: center;
		line-height: 50px;
	}

	.table-wrap {
		width: 710rpx;
		background: #EEEEEE;
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
		min-width: 70px;
	}

	.table-trs {
		background: #fff;
	}
</style>
