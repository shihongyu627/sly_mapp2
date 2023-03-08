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
		<view class="record-header">
			<picker mode="date" :fields="fieldsType" :value="dateName" @change="bindMonthChange">
				<view class="header-item">
					<view class="header-date">{{dateName}}</view>
					<img class='header-bottomIcon' src="../../../common/img/store_bottom.png" alt=""
						mode="aspectFill" />
				</view>
			</picker>
			<!-- 	<view class="header-item" v-if="dateType==1">
				<view class="header-date"> {{week?week:'请选择'}}</view>
				<img class='header-bottomIcon' src="../../../common/img/store_bottom.png" alt="" mode="aspectFill" />
			</view> -->
		</view>
		<view class="table-box">
			<block slot="list">
				<block v-if="orderStatus!='month'&&orderStatus!='year'">
					<view class="table-headerBox">
						<view class="table-header-top">
							<view class="table-header-left">
								<img class='table-header-left-icon' src="../../common/img/reportForm_1.png" alt=""
									mode="aspectFill" />
								<view class="table-header-left-title">
									现金收支{{orderStatus=='day'?'日报':'周报'}}
								</view>
							</view>
						</view>
						<view class="table-header-bottom">
							<view class="table-header-item">
								<view class="table-header-item-num">
									{{inout_report.l_balance||0}}
								</view>
								<view class="table-header-item-text">
									{{orderStatus=='day'?'昨日余额':'上周余额'}}
								</view>
							</view>
							<view class="table-header-item-br">
							</view>
							<view class="table-header-item">
								<view class="table-header-item-num">
									{{inout_report.to_in_money||0}}
								</view>
								<view class="table-header-item-text">
									{{orderStatus=='day'?'今日收款':'本周收款'}}
								</view>
							</view>
							<view class="table-header-item-br">
							</view>
							<view class="table-header-item">
								<view class="table-header-item-num">
									{{inout_report.to_out_money||0}}
								</view>
								<view class="table-header-item-text">
									{{orderStatus=='day'?'今日支出':'本周支出'}}
								</view>
							</view>
						</view>
					</view>
					<view class="table-headerBox">
						<view class="table-commonTitle">
							{{orderStatus=='day'?'今日收款':'本周收款'}}
						</view>
						<view class="table-balanceBox">
							<view class="table-balanceBox-left">
								<img class='table-balanceBox-icon' src="../../common/img/reportForm_3.png" alt=""
									mode="aspectFill" />
								<view class="table-balanceBox-title">
									{{orderStatus=='day'?'今日余额':'本周余额'}}
								</view>
							</view>
							<view class="table-balanceBox-num">
								{{inout_report.to_balance||0}}
								<view class="table-balanceBox-unit">
									元
								</view>
							</view>
						</view>
						<view class="table-moneyBox">
							<view class="table-money-item" v-for="(item, index) in in_ll" :key="index"
								:style="{background:item.background}">
								<img class='table-balanceBox-icon' :src="item.icon" alt="" mode="aspectFill" />
								<view class="table-money-title">
									{{item.title}}
								</view>
								<view class="table-money-num">
									+{{item.money}}
									<view class="table-money-unit">
										元
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="table-headerBox">
						<view class="table-commonTitle">
							{{orderStatus=='day'?'今日支出':'本周支出'}}
						</view>
						<view class="table-moneyBox">
							<view class="table-money-item" v-for="(item, index) in out_ll" :key="index"
								:style="{background:item.background}">
								<img class='table-balanceBox-icon' :src="item.icon" alt="" mode="aspectFill" />
								<view class="table-money-title">
									{{item.title}}
								</view>
								<view class="table-money-num">
									-{{item.money}}
									<view class="table-money-unit">
										元
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="table-headerBox">
						<view class="table-commonTitle">
							团队{{orderStatus=='day'?'日报':'周报'}}
						</view>
						<view class="table-teamWrapp">
							<view class="table-teamBox">
								<view class="table-team-name" :class="index1==0 ? 'table-team-names' : ''"
									v-for="(item1, index1) in tableWeekTh" :key="index1"
									:style="{background:item1.background}">
									{{item1.title}}
								</view>
							</view>
							<view class="" v-for="(item, index) in tableWeekData" :key="index">
								<view class="table-teamBox">
									<view class="table-team-item" :class="index==0 ? '' : 'table-team-items'">
										{{item.worker_name}}
									</view>
									<view class="table-team-item" :class="index==0 ? '' : 'table-team-items'">
										{{item.subcard399_order_num}}
									</view>
									<view class="table-team-item" :class="index==0 ? '' : 'table-team-items'">
										{{item.subcard2980_order_num}}
									</view>
									<view class="table-team-item" :class="index==0 ? '' : 'table-team-items'">
										{{item.device_order_num}}
									</view>
									<view class="table-team-item" :class="index==0 ? '' : 'table-team-items'">
										{{item.xbb_order_num}}
									</view>
									<view class="table-team-item" :class="index==0 ? '' : 'table-team-items'">
										{{item.other_order_num}}
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="table-headerBox">
						<view class="table-commonTitle">
							用户分析
						</view>

						<view class="user-analysis">
							<view class="user-analysis-itemBox">
								<view class="user-analysis-item">
									{{member_report.tiyan_num||0}}
								</view>
								<view class="">
									体验
								</view>
							</view>
							<view class="user-analysis-itemBox">
								<view class="user-analysis-item">
									{{member_report.buy_num||0}}
								</view>
								<view class="">
									办卡或购买
								</view>
							</view>

							<view class="user-analysis-itemBox">
								<canvas class="chart" id="pie" canvas-id="pie"></canvas>
								<view class="">
									转换率
								</view>
							</view>
						</view>
					</view>
				</block>
				<block v-if="orderStatus=='month'&&orderStatus!='year'">
					<view class="table-headerBox">
						<view class="table-header-top">
							<view class="table-header-left">
								<img class='table-header-left-icon' src="../../common/img/reportForm_1.png" alt=""
									mode="aspectFill" />
								<view class="table-header-left-title">
									月度损益报表
								</view>
							</view>
						</view>
						<view class="monthHeader-box">
							<view class="monthHeader-item" v-for="(item, index) in monthHeaderData" :key="index">
								<view :class="index==0 ? 'monthHeader-titles' : 'monthHeader-tag'"
									:style="{background:item.background}">
									{{item.title}}
								</view>
								<view :class="index==0? 'monthHeader-title' : 'monthHeader-num'">
									{{item.money}}
									<view v-if="item.title=='毛利率'||item.title=='净利率'">
										%
									</view>
								</view>
								<view :class="index==0 ? 'monthHeader-title' : 'monthHeader-num'">
									{{item.last_money}}
								</view>
								<view :class="index==0 ? 'monthHeader-title' : 'monthHeader-num'" :style="{border:0}">
									{{item.rate}}%
								</view>
							</view>

						</view>
					</view>
					<view class="table-headerBox">
						<view class="table-commonTitle">
							月度收入分析表
						</view>
						<view class="table-monthTotal">
							<view class="table-monthTotal-total">
								<img class='table-monthTotal-icon' src="../../common/img/reportForm_month_1.png" alt=""
									mode="aspectFill" />
								<view class="table-monthTotal-totalname">
									总收入
								</view>
							</view>
							<view class="table-monthTotal-item">
								<view class="table-monthTotal-title">
									金额
								</view>
								<view class="table-monthTotal-num">
									{{month_in_ll.in_total||0}}元
								</view>
							</view>
							<view class="table-monthTotal-item">
								<view class="table-monthTotal-title">
									上月
								</view>
								<view class="table-monthTotal-num">
									{{month_in_ll.last_in_total||0}}元
								</view>
							</view>
							<view class="table-monthTotal-item" :style="{border:0}">
								<view class="table-monthTotal-title">
									增长率
								</view>
								<view class="table-monthTotal-num">
									{{month_in_ll.in_rate||0}}%
								</view>
							</view>
						</view>
						<view class="table-common-title">
							产品分析
						</view>
						<view class="table-pro-analysis" :style="{'margin-bottom':'23rpx'}">
							<view class="table-pro-analysis-item" v-for="(item, index) in month_Th" :key="index"
								:style="{background:item.background}">
								<view class="table-pro-analysis-title">
									{{item.title}}
								</view>
								<img class='table-monthTotal-icon' :src="item.icon" alt="" mode="aspectFill" />
							</view>
						</view>
						<view class="table-pro-from">
							<view class="table-pro-from-box" v-for="(item, index) in income_ll" :key="index">
								<view class="table-pro-from-name">
									{{item.title}}
								</view>
								<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
									{{item.money}}元
								</view>
								<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
									{{item.last_money}}元
								</view>
								<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'"
									:style="{border:0}">
									{{item.rate}}%
								</view>
							</view>
						</view>

						<view class="table-common-title">
							团队分析
						</view>
						<view class="table-pro-from" :style="{'padding-bottom':'30rpx'}">
							<view class="table-pro-from-box" v-for="(item, index) in team_in_ll" :key="index">
								<view class="table-pro-from-name">
									{{item.title}}
								</view>
								<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
									{{item.money}}元
								</view>
								<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
									{{item.last_money}}元
								</view>
								<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'"
									:style="{border:0}">
									{{item.rate}}%
								</view>
							</view>
						</view>
					</view>
					<view class="table-headerBox">
						<view class="table-commonTitle">
							月度支出分析表
						</view>
						<view class="table-monthTotal">
							<view class="table-monthTotal-total">
								<img class='table-monthTotal-icon' src="../../common/img/reportForm_month_1.png" alt=""
									mode="aspectFill" />
								<view class="table-monthTotal-totalname">
									总支出
								</view>
							</view>
							<view class="table-monthTotal-item">
								<view class="table-monthTotal-title">
									本月
								</view>
								<view class="table-monthTotal-num">
									{{month_out_ll.out_total||0}}元
								</view>
							</view>
							<view class="table-monthTotal-item">
								<view class="table-monthTotal-title">
									上月
								</view>
								<view class="table-monthTotal-num">
									{{month_out_ll.last_out_total||0}}元
								</view>
							</view>
							<view class="table-monthTotal-item" :style="{border:0}">
								<view class="table-monthTotal-title">
									增长率
								</view>
								<view class="table-monthTotal-num">
									{{month_out_ll.out_rate||0}}%
								</view>
							</view>
						</view>
						<view class="table-pro-analysis" :style="{'margin-bottom':'23rpx','margin-top':'23rpx'}">
							<view class="table-pro-analysis-item" v-for="(item, index) in month_Th" :key="index"
								:style="{background:item.background}">
								<view class="table-pro-analysis-title">
									{{item.title}}
								</view>
								<img class='table-monthTotal-icon' :src="item.icon" alt="" mode="aspectFill" />
							</view>
						</view>
						<view class="table-pro-from">
							<view class="table-pro-from-box" v-for="(item, index) in outcome_ll" :key="index">
								<view class="table-pro-from-name">
									{{item.title||'-'}}
								</view>
								<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
									{{item.money||0}}元
								</view>
								<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
									{{item.last_money||0}}元
								</view>
								<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'"
									:style="{border:0}">
									{{item.rate||0}}%
								</view>
							</view>
						</view>
					</view>

				</block>
				<block v-if="orderStatus=='year'">
					<view class="table-headerBox">
						<view class="table-commonTitle">
							收入趋势分析表
						</view>
						<view class="table-pro-wrapp">
							<view class="table-pro-analysis">
								<view class="table-pro-analysis-item" v-for="(item, index) in month_AllTh" :key="index"
									:style="{background:item.background}">
									<view class="table-pro-analysis-title">
										{{item.title}}
									</view>
									<img class='table-monthTotal-icon' v-if="item.icon" :src="item.icon" alt=""
										mode="aspectFill" />
								</view>
							</view>
							<view class="table-common-title">
								月度总收入
							</view>
							<view class="table-pro-from">
								<view class="table-pro-from-box" v-for="(item, index) in total_ll" :key="index">
									<view class="table-pro-from-name">
										总收入
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.m_01}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.m_02}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.m_03}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.m_04}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.m_05}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.m_06}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.m_07}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.m_08}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.m_09}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.m_10}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.m_11}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'"
										:style="{border:0}">
										{{item.m_12}}元
									</view>
								</view>
							</view>
							<view class="table-common-title">
								月度产品分析
							</view>

							<view class="table-pro-from">
								<view class="table-pro-from-box" v-for="(item, index) in month_in_llData" :key="index">
									<view class="table-pro-from-name">
										{{item.title}}
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_01}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_02}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_03}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_04}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_05}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_06}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_07}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_08}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_09}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_10}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_11}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'"
										:style="{border:0}">
										{{item.data.m_12}}元
									</view>
								</view>
							</view>
							<view class="table-common-title">
								月度团队分析
							</view>
							<view class="table-pro-from">
								<view class="table-pro-from-box" v-for="(item, index) in month_team_llData"
									:key="index">
									<view class="table-pro-from-name">
										{{item.title}}
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_01}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_02}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_03}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_04}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_05}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_06}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_07}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_08}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_09}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_10}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'">
										{{item.data.m_11}}元
									</view>
									<view class="table-pro-from-item" :class="index%2!=0 ? '' : 'table-pro-from-items'"
										:style="{border:0}">
										{{item.data.m_12}}元
									</view>
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
				orderStatus: 'day',
				statusList: [],
				isIphoneX: false,
				tableWeekTh: [],
				tableWeekData: [],
				loading: false,
				yearDate: dayjs().format('YYYY'),
				date: dayjs().format('YYYY-MM-DD'),
				inout_report: {},
				member_report: {},
				month_ll: [],
				month_Th: [],
				month_in_ll: {},
				month_out_ll: {},
				month_inout: [],
				outcome_ll:[],
				income_ll: [], //月报产品分析
				team_in_ll: [], //月报团队分析
				month_AllTh: [],
				month_in_llData: [], //月度产品分析
				month_team_llData: [], //月度团队分析
				month_all_llArr: [],
				in_ll: [],
				out_ll: [],
				monthHeaderData: [],
				barColorArr: [{
					color: "#888"
				}, {
					color: "#888"
				}], //切换折线1，折线2{color:"#888"},{color:"#888"}3.0最新版本修改
				barChartX: [],
				barChartX1: [],
				total_ll: [],
				total_llY: [],
				selectBarType: 'top',
				weekValue: dayjs().isoWeek(),
				yearDate: dayjs().format('YYYY'),
				week: '',
				weekList: [],
				fieldsType: 'day',
				dateName: dayjs().format('YYYY-MM-DD'),
				dadeTypeList: [{
					name: "日",
					type: 1
				}, {
					name: "周",
					type: 2
				}, {
					name: "月",
					type: 3
				}, {
					name: "年",
					type: 4
				}],
				dateType: '1',
			};
		},
		components: {
			uniLoadMore
		},
		mixins: [globalConfig],
		onReady() {

		},
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
			pickerEventDate(index) {
				console.log(index);
				let dateType = this.dadeTypeList[index].type;
				this.dateType = dateType
				if (dateType == 1) {
					this.fieldsType = 'day'
					this.date = dayjs().format('YYYY-MM-DD')
					this.dateName = dayjs().format('YYYY-MM-DD')
				}
				if (dateType == 2) {
					this.fieldsType = 'day'
					this.date = this.yearDate + '-' + dayjs().isoWeek()
					this.dateName = dayjs().format('YYYY-MM-DD')
				}
				if (dateType == 3) {
					this.fieldsType = 'month'
					this.date = this.yearDate + '-' + (dayjs().month() + 1)
					this.dateName = this.yearDate + '-' + (dayjs().month() + 1)
				}
				if (dateType == 4) {
					this.fieldsType = 'year'
					this.date = this.yearDate
					this.dateName = this.yearDate
				}
				this.getListData()
				console.log(this.date, 9999);
			},
			bindMonthChange(e) {
				console.log(e);
				if (this.dateType == '1') {
					this.date = e.detail.value
				}
				if (this.dateType == '2') {
					this.date = this.yearDate + '-' + dayjs(e.detail.value).isoWeek()
				}
				if (this.dateType == '3') {
					this.date = e.detail.value
				}
				if (this.dateType == '4') {
					this.date = e.detail.value
				}
				this.dateName = e.detail.value
				this.getListData()
			},
			//求两点之间的距离3.0最新版本修改
			distDot(pointA, pointB, R) {
				return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)) - R
			},
			toFixedNumber(n = 2, val) { //去小数点后2位
				if (typeof val == "number") {
					return val.toFixed(n) * 1
				}
			},
			selectBarChart(type) {
				if (type == 'bottom') {
					this.total_llY = this.total_ll.slice(6)
					this.barChartX1 = this.barChartX.slice(6)
				} else {
					this.total_llY = this.total_ll.slice(0, 6)
					this.barChartX1 = this.barChartX.slice(0, 6)
				}
				this.selectBarType = type
				const query = uni.createSelectorQuery().in(this);
				query.select('.barChart').boundingClientRect(data => {
					this.domEchart = data;
					this.barDraw2d("line", data, -1);
				}).exec();
			},
			//绘制bar 柱状图chart3.0最新版本修改
			barDraw2d(ids, elem, num = -1) {
				let ctx = uni.createCanvasContext(ids);
				let grid = {
						top: (12 * elem.height) / 100, //canvas标签的高度的12%（相对总高的百分比）
						bottom: ((100 - 18) * elem.height) / 100,
						left: (12 * elem.width) / 100, //距离左侧的百分比（12%总宽度）
						right: ((100 - 8) * elem.width) / 100
					},
					lineColor = "#999", //x,y轴线颜色
					fillColor = "#333", //x,y轴number颜色
					lineWidth = 1,
					yAxis = {
						textSize: 10, //刻度数字fontSize
						maxNumber: 80, //分段的最大值
						splitNumber: 5, //分成几段
						splitLen: 5, //轴左侧的小横线 -|
						marginSplit: 5 //刻度文字与 “-|”的距离  
					},
					xAxis = {
						textSize: 12, //刻度数字fontSize
						maxNumber: 50,
						splitNumber: 6,
						splitLen: 5,
						marginSplit: 3
					},
					dotStyle = [{
							color: "#fff",
							arcR: 5, //半径
							dash: 0 //是否线条虚线 0实线 1以上虚线
						},
						{
							color: "#fff",
							arcR: 5, //半径
							dash: 0 //是否线条虚线 0实线 1以上虚线
						}
					],
					barMargin = 5, //柱子之间间隔
					barStyle = [{
							color: "#3f51b5",
							barWidth: 10, //连线的width
							dash: 3 //是否线条虚线 0实线 1以上虚线
						},
						{
							color: "#03a9f4",
							barWidth: 10, //连线的width
							dash: 0 //是否线条虚线 0实线 1以上虚线
						}
					],
					xData = this.barChartX1,
					dataJSON = [{
						y: this.total_llY
					}];
				if (num != -1) {
					barStyle.forEach((el, vl) => {
						if (vl == num) {
							this.barColorArr[vl] = {
								color: el.fillColor
							};
						} else {
							this.barColorArr[vl] = {
								color: "#888"
							};
						}

					})
				} else {
					barStyle.forEach((el, vl) => {
						this.barColorArr[vl] = {
							color: el.fillColor
						};
					})
				}
				// ---- bar echarts draw start
				ctx.beginPath();
				ctx.setLineWidth(lineWidth);
				ctx.setTextAlign("right");
				ctx.setTextBaseline("middle");
				ctx.setStrokeStyle(lineColor);
				ctx.setFillStyle(fillColor);

				ctx.moveTo(grid.left, grid.top);
				ctx.lineTo(grid.left, grid.bottom);
				ctx.setFontSize(yAxis.textSize);
				for (let n = 1; n <= yAxis.splitNumber; n++) {

					ctx.moveTo(grid.left, grid.bottom - (grid.bottom - grid.top) / yAxis.splitNumber * n + lineWidth);
					ctx.lineTo(grid.left - yAxis.splitLen, grid.bottom - (grid.bottom - grid.top) / yAxis.splitNumber * n +
						lineWidth);
					ctx.fillText(this.toFixedNumber(1, yAxis.maxNumber / yAxis.splitNumber * n), grid.left - yAxis
						.splitLen - lineWidth - yAxis.marginSplit, grid.bottom - (grid.bottom - grid.top) / yAxis
						.splitNumber * n + lineWidth)
				}


				ctx.moveTo(grid.left, grid.bottom);
				ctx.lineTo(grid.right, grid.bottom);
				ctx.setTextAlign("center");
				ctx.setTextBaseline("top");
				ctx.setFontSize(xAxis.textSize);
				for (let n = 1; n <= xAxis.splitNumber; n++) {

					ctx.moveTo(grid.left + (grid.right - grid.left) / xAxis.splitNumber * n - lineWidth, grid.bottom);
					ctx.lineTo(grid.left + (grid.right - grid.left) / xAxis.splitNumber * n - lineWidth, grid.bottom +
						xAxis.splitLen);
					let splitWidth = (grid.right - grid.left) / xAxis.splitNumber - lineWidth * 2, //每格刻度的长度
						textWidth = ctx.measureText(xData[n - 1]).width; //当前格子文字的款都
					let textArr = xData[n - 1].split(""),
						textOne = "",
						textTwo = "";
					textArr.forEach((txt, indx) => {
						indx < xData[n - 1].length / 2 - 1 ? textOne += txt : textTwo += txt;
					})
					if (textWidth > splitWidth) {
						ctx.fillText(textOne, grid.left + (grid.right - grid.left) / xAxis.splitNumber * n - lineWidth - (
								grid.right - grid.left) / xAxis.splitNumber * 0.5,
							grid.bottom + xAxis.splitLen + lineWidth + xAxis.marginSplit);
						ctx.fillText(textTwo, grid.left + (grid.right - grid.left) / xAxis.splitNumber * n - lineWidth - (
								grid.right - grid.left) / xAxis.splitNumber * 0.5,
							grid.bottom + xAxis.splitLen + lineWidth + xAxis.marginSplit + xAxis.textSize + 2);
					} else {
						ctx.fillText(xData[n - 1], grid.left + (grid.right - grid.left) / xAxis.splitNumber * n -
							lineWidth - (grid.right - grid.left) / xAxis.splitNumber * 0.5,
							grid.bottom + xAxis.splitLen + lineWidth + xAxis.marginSplit);
					}
				}
				ctx.stroke();

				let drawBarData = (dataY, ix) => {
					dataY.forEach((ele, indx) => {
						let x = grid.left + (grid.right - grid.left) / xAxis.splitNumber * (indx + 1) -
							lineWidth - (grid.right - grid.left) / xAxis.splitNumber * 0.5,
							y = grid.bottom - (grid.bottom - grid.top) * (ele / yAxis.maxNumber) + lineWidth;

						ctx.beginPath();
						ctx.setStrokeStyle(barStyle[ix].color);
						ctx.setFillStyle(barStyle[ix].color);
						ctx.setLineWidth(barStyle[ix].barWidth);
						ctx.setFontSize(10);
						ctx.setTextAlign("center");
						ctx.setTextBaseline("bottom");
						if (ix % 2 == 0 && dataJSON.length > 1) {
							ctx.moveTo(x - barMargin / 2 - barStyle[ix].barWidth / 2, y);
							ctx.lineTo(x - barMargin / 2 - barStyle[ix].barWidth / 2, grid.bottom);
							ctx.fillText(ele, x - barMargin / 2 - barStyle[ix].barWidth / 2, y); //绘制文字
						} else if (ix % 2 == 1 && dataJSON.length > 1) {
							ctx.moveTo(x + barMargin / 2 + barStyle[ix].barWidth / 2, y); //绘制bar 上侧
							ctx.lineTo(x + barMargin / 2 + barStyle[ix].barWidth / 2, grid.bottom); //绘制bar 下侧
							ctx.fillText(ele, x + barMargin / 2 + barStyle[ix].barWidth / 2, y);
						} else {
							ctx.moveTo(x, y);
							ctx.lineTo(x, grid.bottom);
							ctx.fillText(ele, x, y);
						}
						ctx.stroke();
					})
				}
				//遍历折线数据
				dataJSON.forEach((e, v) => {
					if (num == v) {
						drawBarData(e.y, v);
					}
					if (num == -1) {
						drawBarData(e.y, v);
					}

				})
				ctx.draw();
			},
			//绘制饼图3.0最新版本修改
			pieDraw(ids, elem) {
				let ctx = uni.createCanvasContext(ids);
				let tiyan_num = this.member_report.tiyan_num || 0
				let buy_num = this.member_report.buy_num || 0
				let rate_value = this.member_report.rate_value || 0

				let radius = {
						outside: {
							x: (50 * elem.width) / 100,
							y: (50 * elem.height) / 100,
							r: (43 * elem.height) / 100
						},
						inside: {
							r: 50 / 49
						} //占外圈圆的百分比
					},
					colorRadius = ["#1189F4", "#DBF3F9"], //设置扇形1,2,3颜色
					arcWidth = 1, //圆边框线宽
					radiusOutStyle = { //环外侧圆样式
						fillColor: "#DBF3F9",
						strokeColor: "#DBF3F9"
					},
					radiusInStyle = { //环内侧圆样式
						fillColor: "#fff",
						strokeColor: "#DBF3F9"
					},
					dataJSON = [tiyan_num, buy_num]; //colorRadius数据json对应数量
				ctx.beginPath();
				ctx.setFillStyle(radiusOutStyle.fillColor);
				ctx.setStrokeStyle(radiusOutStyle.strokeColor);
				ctx.arc(radius.outside.x, radius.outside.y, radius.outside.r + arcWidth, 0, 2 * Math.PI);
				ctx.stroke();

				let degRadius = (sDeg, eDeg, color, part, textPart) => {
					ctx.beginPath();
					ctx.setFillStyle(color);
					ctx.setStrokeStyle(color);
					ctx.moveTo(radius.outside.x, radius.outside.y);
					// ctx.arc(radius.outside.x, radius.outside.y, radius.outside.r, sDeg * Math.PI / 180, eDeg * Math
					// 	.PI / 180);
					ctx.fill();
					ctx.stroke();
				}
				let setPieText = (part, textPart) => {
					let distR = radius.outside.r * radius.inside.r + (radius.outside.r - radius.outside.r * radius
						.inside.r) / 2;
					ctx.beginPath();
					ctx.setFillStyle("#FFF");
					ctx.setFontSize(12);
					ctx.setTextAlign("center");
					ctx.setTextBaseline("middle");
					// ctx.arc(radius.outside.x + Math.cos(Math.PI * textPart * 2) * distR,
					// 	radius.outside.y + Math.sin(Math.PI * textPart * 2) * distR + 10, 3, 0, 2 * Math.PI);
					ctx.fill();
					// ctx.fillText(part + "%", radius.outside.x + Math.cos(Math.PI * textPart * 2) * distR,
					// 	radius.outside.y + Math.sin(Math.PI * textPart * 2) * distR);
					ctx.stroke();
				}
				let totalData = 0,
					count = 0;
				dataJSON.forEach((el, vl) => {
					totalData += el;
				})
				dataJSON.forEach((e, lx, ar) => {
					if (lx == 0) {
						degRadius(0, e / totalData * 360, colorRadius[lx]);
						setPieText(this.toFixedNumber(1, e / totalData * 100), this.toFixedNumber(2, (e / 2 +
							count) / totalData));
					} else if (lx == ar.length - 1) {
						degRadius(count / totalData * 360, 360, colorRadius[lx]);
						setPieText(this.toFixedNumber(1, e / totalData * 100), this.toFixedNumber(2, (e / 2 +
							count) / totalData));
					} else {
						degRadius(count / totalData * 360, (e + count) / totalData * 360, colorRadius[lx]);
						setPieText(this.toFixedNumber(1, e / totalData * 100), this.toFixedNumber(2, (count + e /
							2) / totalData));
					}
					count += e;
				})
				ctx.beginPath();
				ctx.setFillStyle(radiusInStyle.fillColor);
				ctx.setStrokeStyle(radiusInStyle.strokeColor);
				ctx.arc(radius.outside.x, radius.outside.y, (radius.outside.r + arcWidth) * radius.inside.r, 0, 2 * Math
					.PI);
				ctx.fill();
				ctx.stroke();
				ctx.setFontSize(15)
				ctx.setFillStyle("#306EF2");
				ctx.fillText(rate_value + '%', 50, 48)
				ctx.draw();
			},
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

				} else {
					this.date = this.yearDate + '-' + (dayjs().month() + 1)
					this.title = '团队月报'
				}
				// this.$refs.loadingCover.show();
				// this.getListData()
				this.pickerEventDate(index)
			},
			getListData() {
				this.$refs.loadingCover.show();
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
							if (this.orderStatus != 'month' && this.orderStatus != 'year') {
								this.inout_report = res.data.inout_report || []
								this.in_ll = res.data.inout_report?.in_ll || [] //收入明细
								this.out_ll = res.data.inout_report?.out_ll || [] //支出明细

								this.in_ll.map((item) => {
									if (item.title == '399卡') {
										item.icon = require('../../common/img/reportForm_4.png')
										item.background = '#E4EEFA'
									}
									if (item.title == '2980卡') {
										item.icon = require('../../common/img/reportForm_4.png')
										item.background = '#E5FAFF'
									}
									if (item.title == '399卡') {
										item.icon = require('../../common/img/reportForm_4.png')
										item.background = '#E4EEFA'
									}
									if (item.title == '9800设备') {
										item.icon = require('../../common/img/reportForm_9.png')
										item.background = '#EBF5EF'
									}
									if (item.title == '小白咘') {
										item.icon = require('../../common/img/reportForm_10.png')
										item.background = '#E4EEFA'
									}
									if (item.title == '其它收入') {
										item.icon = require('../../common/img/reportForm_12.png')
										item.background = '#E4EEFA'
									}
								})
								this.out_ll.map((item) => {
									if (item.title == '水费') {
										item.icon = require('../../common/img/reportForm_11.png')
										item.background = '#E4EEFA'
									}
									if (item.title == '人员工资') {
										item.icon = require('../../common/img/reportForm_7.png')
										item.background = '#E5FAFF'
									}
									if (item.title == '电费') {
										item.icon = require('../../common/img/reportForm_5.png')
										item.background = '#E4EEFA'
									}
									if (item.title == '房租') {
										item.icon = require('../../common/img/reportForm_6.png')
										item.background = '#EBF5EF'
									}
									if (item.title == '押金') {
										item.icon = require('../../common/img/reportForm_8.png')
										item.background = '#E4EEFA'
									}
									if (item.title == '其他支出') {
										item.icon = require('../../common/img/reportForm_12.png')
										item.background = '#E4EEFA'
									}
								})
								this.member_report = res.data.member_report
								this.tableWeekData = res.data?.team_report?.team_list || []
								this.tableWeekTh = [{
									title: '姓名',
									background: "#2673FF"
								}, {
									title: '399卡',
									background: "#E4EEFA"
								}, {
									title: '2980卡',
									background: "#E5FAFF"
								}, {
									title: '9800设备',
									background: "#EBF5EF"
								}, {
									title: '小白咘',
									background: "#E4EEFA"
								}, {
									title: '其他',
									background: "#E4EEFA"
								}]

								const query = uni.createSelectorQuery().in(this);
								query.select('.chart').boundingClientRect(data => {
									console.log(data, 9999);
									this.pieDraw("pie", data);
								}).exec()
							} else if (this.orderStatus == 'year') {
								this.month_all_ll = res.data.month_all_ll

								this.month_AllTh = [{
									title: '月份',
									icon: require('../../common/img/reportForm_month_4.png'),
									background: 'linear-gradient(90deg, #8DDE8F 0%, #64CD61 100%)',
								}, {
									title: '1月',
									background: 'linear-gradient(90deg, #91A0FF 0%, #8091FF 100%)',
								}, {
									title: '2月',
									background: 'linear-gradient(90deg, #FE8FEF 0%, #FF74E9 100%)',
								}, {
									title: '3月',
									background: 'linear-gradient(90deg, #FDB67A 0%, #FDAB73 100%)',
								}, {
									title: '4月',
									background: 'linear-gradient(90deg, #91A0FF 0%, #8091FF 100%)',
								}, {
									title: '5月',
									background: 'linear-gradient(90deg, #FE8FEF 0%, #FF74E9 100%)',
								}, {
									title: '6月',
									background: 'linear-gradient(90deg, #FDB67A 0%, #FDAB73 100%)',
								}, {
									title: '7月',
									background: 'linear-gradient(90deg, #91A0FF 0%, #8091FF 100%)',
								}, {
									title: '8月',
									background: 'linear-gradient(90deg, #FE8FEF 0%, #FF74E9 100%)',
								}, {
									title: '9月',
									background: 'linear-gradient(90deg, #FDB67A 0%, #FDAB73 100%)',
								}, {
									title: '10月',
									background: 'linear-gradient(90deg, #91A0FF 0%, #8091FF 100%)',
								}, {
									title: '11月',
									background: 'linear-gradient(90deg, #FE8FEF 0%, #FF74E9 100%)',
								}, {
									title: '12月',
									background: 'linear-gradient(90deg, #FDB67A 0%, #FDAB73 100%)',
								}]
								this.total_ll = this.month_all_ll.total_ll
								this.month_in_llData=this.month_all_ll.in_ll
								this.month_team_llData=this.month_all_ll.team_ll
							} else {
								this.month_in_ll = res.data.month_in_ll
								this.month_out_ll = res.data.month_out_ll
								this.monthHeaderData = res.data?.month_inout?.month_ll
								this.income_ll = this.month_in_ll.income_ll //产品分析
								this.outcome_ll = this.month_out_ll.outcome_ll //产品分析
								this.team_in_ll = this.month_in_ll.team_in_ll //团队
								this.monthHeaderData.map((item) => {
									if (item.title == '收入') {
										item.background = '#63B0FF'
									}
									if (item.title == '成本') {
										item.background = '#FB8F8C'
									}
									if (item.title == '毛利') {
										item.background = '#51E2C8'
									}
									if (item.title == '毛利率') {
										item.background = '#86BAFF'
									}
									if (item.title == '费用') {
										item.background = '#63B0FF'
									}
									if (item.title == '净利') {
										item.background = '#FBC041'
									}
									if (item.title == '净利率') {
										item.background = '#2673FF'
									}
								})
								this.monthHeaderData.unshift({
									title: '',
									money: '金额',
									last_money: '上月',
									rate: '增长率',
								})
								this.month_Th = [{
									title: '项目',
									background: 'linear-gradient(90deg, #8DDE8F 0%, #64CD61 100%)',
									icon: require('../../common/img/reportForm_month_4.png')
								}, {
									title: '金额',
									background: 'linear-gradient(90deg, #91A0FF 0%, #8091FF 100%)',
									icon: require('../../common/img/reportForm_month_2.png')
								}, {
									title: '上月',
									background: 'linear-gradient(90deg, #FE8FEF 0%, #FF74E9 100%)',
									icon: require('../../common/img/reportForm_month_3.png')
								}, {
									title: '增长率',
									background: 'linear-gradient(90deg, #FDB67A 0%, #FDAB73 100%)',
									icon: require('../../common/img/reportForm_month_5.png')
								}]
								const query = uni.createSelectorQuery().in(this);
								query.select('.barChart').boundingClientRect(data => {
									this.domEchart = data;
									this.barDraw2d("line", data, -1);
								}).exec();
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
					{
						status: 'year',
						name: '年报',
						id: 'status_4'
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
		padding-top: 40px;
		padding-bottom: 60px;
		background: linear-gradient(180deg, #D1E8FF 0%, #F2FCFF 100%);
	}

	/deep/ .uni-page {
		overflow: hidden;
	}

	/deep/ .mescroll-upwarp {
		padding-bottom: 100rpx;
	}

	.record-header {
		width: 100%;
		height: 44px;
		background: #FFFFFF;
		opacity: 1;
		display: flex;
		flex-direction: row;
		padding-left: 17px;
		padding-right: 30rpx;
		box-sizing: border-box;
		margin: 0 auto;
		padding-top: 120rpx;
	}

	.header-left {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.header-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 44px;
		width: 100px;
		justify-content: center;
	}

	.header-items {
		margin-right: 30px;
	}

	.header-date {
		font-size: 13px;
		font-weight: 400;
		color: #000000;
		opacity: 1;
	}

	.header-bottomIcon {
		width: 14px;
		height: 14px;
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

	.table-headerBox {
		width: 690rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 2rpx 5rpx 0rpx rgba(161, 161, 161, 0.31);
		border-radius: 20rpx;
		margin: 0 auto;
		overflow: hidden;
		margin-bottom: 36rpx;
	}

	.table-teamWrapp {
		width: 612rpx;
		background: #FFFFFF;
		margin: 0 auto;
		overflow: hidden;
		overflow-x: scroll;
		margin-top: 40rpx;
	}

	.table-header-top {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding-left: 30rpx;
		padding-right: 30rpx;
		width: 690rpx;
		background: linear-gradient(90deg, #453E36 0%, #37322C 100%);
		height: 72rpx;
	}

	.table-header-left {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.table-header-left-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 13rpx;
	}

	.table-header-left-title {
		font-size: 25rpx;
		font-family: OPPOSans;
		font-weight: 400;
		color: #F9E4B2;
	}

	.table-header-bottom {
		width: 690rpx;
		height: 205rpx;
		background: #FFFFFF;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

	}

	.table-header-item-br {
		width: 1rpx;
		height: 109rpx;
		background: #A8A8A8;
	}

	.table-header-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.table-header-item-num {
		font-size: 33rpx;
		font-family: OPPOSans;
		font-weight: normal;
		color: #0C0C0C;
	}

	.table-header-item-text {
		font-size: 23rpx;
		font-family: OPPOSans;
		font-weight: 400;
		color: #A8A8A8;
	}

	.table-commonTitle {
		font-size: 25rpx;
		font-family: OPPOSans;
		font-weight: bold;
		color: #393939;
		padding-top: 30rpx;
		padding-left: 50rpx;
	}

	.table-balanceBox {
		width: 627rpx;
		height: 127rpx;
		background: #E1F1FF;
		border-radius: 30rpx;
		margin: 0 auto;
		margin-top: 28rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.table-balanceBox-left {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 252rpx;
		justify-content: center;
		border-right: 1px solid #A1A1A1;
		height: 73rpx;
		margin-right: 74rpx;
	}

	.table-balanceBox-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 11rpx;
	}

	.table-balanceBox-title {
		font-size: 23rpx;
		font-family: OPPOSans;
		font-weight: 500;
		color: #5E5E5E;
	}

	.table-balanceBox-num {
		font-size: 33rpx;
		font-family: OPPOSans;
		font-weight: normal;
		color: #0C0C0C;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.table-balanceBox-unit {
		font-size: 20rpx;
		font-family: OPPOSans;
		font-weight: 500;
		color: #5C5C5C;
		margin-left: 20rpx;
	}

	.table-moneyBox {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		width: 627rpx;
		margin: 0 auto;
		padding-bottom: 36rpx;
	}

	.table-money-item {
		display: flex;
		flex-direction: column;
		// align-items: center;
		justify-content: center;
		width: 306rpx;
		height: 185rpx;
		border-radius: 30rpx;
		margin-top: 14rpx;
		padding-left: 60rpx;
		box-sizing: border-box;
	}

	.table-money-title {
		font-size: 23rpx;
		font-family: OPPOSans;
		font-weight: 400;
		color: #858585;
	}

	.table-money-num {
		font-size: 34rpx;
		font-family: OPPOSans;
		font-weight: normal;
		color: #0C0C0C;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
	}

	.table-money-unit {
		font-size: 20rpx;
		font-family: OPPOSans;
		font-weight: 500;
		color: #5C5C5C;
		margin-bottom: 10rpx;
		margin-left: 12rpx;
	}

	.user-analysis {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		padding-bottom: 30rpx;
		padding-top: 20rpx;
	}

	.user-analysis-itemBox {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.user-analysis-item {
		width: 163rpx;
		height: 163rpx;
		border: 12rpx solid #DBF3F9;
		border-radius: 50%;
		font-size: 30rpx;
		font-family: OPPOSans;
		font-weight: 500;
		color: #306EF2;
		line-height: 163rpx;
		text-align: center;
	}

	.chart {
		width: 190rpx;
		height: 190rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		text-align: center;
		line-height: 190rpx;
		font-size: 30rpx;
		font-family: OPPOSans;
		font-weight: 500;
		color: #306EF2;
		background: #DBF3F9;
		border-radius: 190rpx;
	}

	.barChart-tab {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-bottom: 20rpx;
	}

	.barChart-tab-item {
		background: #FB8F8C;
		font-size: 20rpx;
		font-family: OPPOSans;
		font-weight: 500;
		color: #fff;
		text-align: center;
		height: 40rpx;
		width: 80rpx;
		line-height: 40rpx;
		border-radius: 8rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
	}

	.barChart-tab-items {
		background: #2673FF;
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

	.table-teamBox {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		// min-width: 925px;
	}

	.table-team-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 50px;
		flex: 1;
		min-width: 106rpx;
		padding-right: 50rpx;
		font-size: 20rpx;
		font-family: OPPOSans;
		font-weight: 400;
		color: #505050;
		// opacity: 0.48;
	}

	.table-team-items {
		border-top: 1px solid rgba(161, 161, 161, 0.48);
	}

	.table-team-name {
		height: 38rpx;
		background: #2673FF;
		border-radius: 12rpx;
		font-size: 19rpx;
		font-family: OPPOSans;
		font-weight: 400;
		color: #333;
		flex: 1;
		line-height: 38rpx;
		text-align: center;
		min-width: 106rpx;
		margin-right: 50rpx;
	}

	.table-team-names {
		color: #fff;
	}

	.monthHeader-box {
		padding-bottom: 40rpx
	}

	.monthHeader-item {
		width: 627rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin: 0 auto;
		margin-top: 23rpx;
		height: 68rpx;
	}

	.monthHeader-tag {
		width: 108rpx;
		height: 39rpx;
		border-radius: 18rpx;
		line-height: 39rpx;
		text-align: center;
		font-size: 22rpx;
		font-family: OPPOSans;
		font-weight: 400;
		color: #fff;
	}

	.monthHeader-title {
		font-size: 23rpx;
		font-family: OPPOSans;
		font-weight: 400;
		color: #717171;
		width: 176rpx;
		text-align: center;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.monthHeader-titles {
		font-size: 23rpx;
		font-family: OPPOSans;
		font-weight: 400;
		color: #717171;
		width: 108rpx;
		text-align: center;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.monthHeader-num {
		font-size: 30rpx;
		font-family: OPPOSans;
		// font-weight: bold;
		color: #0C0C0C;
		width: 176rpx;
		border-right: 1rpx solid #A8A8A8;
		text-align: center;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.table-monthTotal {
		width: 627rpx;
		height: 127rpx;
		background: #E1F1FF;
		border-radius: 30rpx;
		overflow: hidden;
		margin: 0 auto;
		margin-top: 24rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.table-monthTotal-total {
		width: 153rpx;
		height: 127rpx;
		background: linear-gradient(0deg, #3B8CFF 0%, #98D3FF 100%);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.table-monthTotal-icon {
		width: 43rpx;
		height: 43rpx;
	}

	.table-monthTotal-totalname {
		font-size: 19rpx;
		font-family: OPPOSans;
		font-weight: 500;
		color: #FFFFFF;
	}

	.table-monthTotal-item {
		width: 159rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-right: 1px solid #8E8E8E;
	}

	.table-monthTotal-title {
		font-size: 20rpx;
		font-family: OPPOSans;
		font-weight: 400;
		color: #858585;
	}

	.table-monthTotal-num {
		font-size: 25rpx;
		font-family: OPPOSans;
		// font-weight: bold;
		color: #3D3D3D;
	}

	.table-common-title {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		// width: 627rpx;
		height: 69rpx;
		// background: #E1F1FF;
		border-radius: 12rpx;
		// margin: 0 auto;
		// margin-top: 36rpx;
		font-size: 25rpx;
		font-family: OPPOSans;
		font-weight: bold;
		color: #393939;
		// text-align: center;
		// line-height: 69rpx;
	}

	.table-pro-analysis {
		width: 627rpx;
		margin: 0 auto;
		// margin-top: 23rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.table-pro-analysis-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		min-width: 123rpx;
		height: 74rpx;
		box-shadow: 1rpx 5rpx 6rpx 0px rgba(129, 146, 255, 0.31), 5rpx 5rpx 11rpx 0px rgba(255, 255, 255, 0.35);
		border-radius: 8rpx;
		flex: 1;
		margin-right: 20rpx
	}

	.table-pro-analysis-title {
		font-size: 23rpx;
		font-family: OPPOSans;
		font-weight: 400;
		color: #FFFFFF;
		margin-right: 10rpx;
	}

	.table-pro-from {
		width: 627rpx;
		margin: 0 auto;
		// margin-top: 35rpx;
		border-radius: 12rpx;
	}

	.table-pro-from-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		height: 97rpx;
		margin-bottom: 10rpx;
	}

	.table-pro-from-name {
		height: 97rpx;
		font-size: 19rpx;
		font-family: OPPOSans;
		font-weight: 500;
		color: #FFFFFF;
		border-bottom: 1px solid #FFFFFF;
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background: linear-gradient(0deg, #3B8CFF 0%, #52B2FE 100%);
		min-width: 140rpx;
		border-radius: 13rpx 0 0 13rpx
	}

	.table-pro-from-item {
		height: 97rpx;
		font-size: 20rpx;
		font-family: OPPOSans;
		font-weight: 400;
		color: #858585;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-right: 1px solid rgba(161, 161, 161, 0.48);
		flex: 1;
		min-width: 140rpx;
	}

	.table-pro-from-items {
		background: rgba(232, 243, 255, 0.48);
	}

	.table-pro-wrapp {
		width: 612rpx;
		background: #FFFFFF;
		margin: 0 auto;
		overflow: hidden;
		overflow-x: scroll;
		padding-bottom: 42rpx;
		margin-top: 23rpx;
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
		min-width: 140rpx;
	}

	.table-ths {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 50px;
		border-left: 0;
		flex: 1;
		min-width: 140rpx;
	}

	.table-trs {
		background: #fff;
	}
</style>
