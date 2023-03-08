<template>
	<view class="order-container" :data-theme="themeStyle">
		<view class="record-header">
			<picker @change="pickerEventDate($event)" mode='selector' :range="dadeTypeList" range-key="name"
				:value="index">
				<view class="header-item">
					<view class="header-date"> {{dateTypeName?dateTypeName:'全部'}}</view>
					<img class='header-bottomIcon' src="../../../common/img/store_bottom.png" alt=""
						mode="aspectFill" />
				</view>
			</picker>
			<!-- 	<view class="header-item" v-if="dateType!=3&&dateType!=4" @click="openCalendar">
					<view class="header-date">{{date}}</view>
					<img class='header-bottomIcon' src="../../../common/img/store_bottom.png" alt=""
						mode="aspectFill" />
				</view> -->
			<!-- v-if="dateType!=1&&dateType!=2" -->
			<picker mode="date"  v-if="dateType!=1" :fields="fieldsType" :value="date" @change="bindMonthChange">
				<view class="header-item">
					<view class="header-date">{{date}}</view>
					<img class='header-bottomIcon' src="../../../common/img/store_bottom.png" alt=""
						mode="aspectFill" />
				</view>
			</picker>
		<!-- 	<view class="header-item" v-if="dateType==1">
				<view class="header-date"> {{week?week:'请选择'}}</view>
				<img class='header-bottomIcon' src="../../../common/img/store_bottom.png" alt="" mode="aspectFill" />
			</view> -->
			<picker @change="pickerEventGroup($event)" mode='selector' :range="groupList" range-key="name"
				:value="index">
				<view class="header-item">
					<view class="header-date"> {{name?name:'全部'}}</view>
					<img class='header-bottomIcon' src="../../../common/img/store_bottom.png" alt=""
						mode="aspectFill" />
				</view>
			</picker>

		</view>
		<mescroll-uni ref="mescroll" @getData="getListData" top="90rpx">
			<block slot="list">
				<block v-if="recordList.length > 0">
					<view class="record-list">
						<view class="record-item" v-for="(item,index) in recordList" :key="index">
							<view class="record-index" v-if="index!=0&&index!=1&&index!=2">
								{{index+1}}
							</view>
							<img class='record-index' src="@/common/img/oneIcon.png" mode="aspectFill"
								v-if="index==0" />
							<img class='record-index' src="@/common/img/TwoIcon.png" mode="aspectFill"
								v-if="index==1" />
							<img class='record-index' src="@/common/img/ThreeIcon.png" mode="aspectFill"
								v-if="index==2" />
							<view class="record-right">
								<view class="record-box">
									<image class="record-head" :src="$util.loadimg(item.headimg)"></image>
									<view class="">
										<view class="record-name">
											{{item.nickname}}
										</view>
										<view class="record-phone">
											{{item.member_mobile}}
										</view>
									</view>

								</view>
								<view class="record-total">
									{{item.type_name}}：{{item[orderby]||0}}
								</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<view>
						<ns-empty :isIndex="!1" text="暂无数据"></ns-empty>
					</view>
				</block>
			</block>
		</mescroll-uni>
		<!-- 	<view class="">
			<van-calendar v-model="show" @confirm="onConfirm" />
		</view> -->
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
				scrollInto: '',
				orderStatus: 'all',
				recordList: [],
				date: dayjs().format('YYYY'),
				groupList: [{
					name: '进货',
					id: 'in_num'
				}, {
					name: '出货',
					id: 'in_put_num'
				}],
				name: '进货',
				dateTypeName: '周',
				dateType: '1',
				dadeTypeList: [{
					name: "周",
					type: 1
				}, {
					name: "月",
					type: 2
				}, {
					name: "年",
					type: 3
				}],
				show: false,
				fieldsType: 'year',
				orderby: 'in_num',
				week: '',
				weekList: [],
				weekValue: dayjs().isoWeek(),
				yearDate: dayjs().format('YYYY')
			};
		},
		components: {
			uniLoadMore,
		},
		mixins: [globalConfig],
		onLoad(option) {
			if (option.status) this.orderStatus = option.status;
			this.week = `本周`
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			if (uni.getStorageSync('token')) {
				if (this.$refs.mescroll) this.$refs.mescroll.refresh();
			} else {
				// this.$util.redirectTo('/pages/login/login/login', {
				// 	back: '/sellStore/team/list/list?status=' + this.orderStatus
				// });
			}
		},
		methods: {
			goCreate() {
				this.$util.redirectTo('/sellStore/bill/create/create');
			},
			//选择周
			pickerWeekEventGroup(e) {
				let index = e.target.value;
				console.log(e, index);
				this.week = this.weekList[index].week;
				this.weekValue = this.weekList[index].value;
				// this.date = this.yearDate + '-' + this.weekList[index].value
				this.$refs.mescroll.refresh();
			},
			//选择分组
			pickerEventGroup(e) {
				let index = e.target.value;
				console.log(e, index);
				this.name = this.groupList[index].name;
				this.orderby = this.groupList[index].id;
				this.$refs.mescroll.refresh();
			},
			pickerEventDate(e) {
				let index = e.target.value;
				console.log(e, index);
				this.dateTypeName = this.dadeTypeList[index].name;
				let dateType = this.dadeTypeList[index].type;
				this.dateType = dateType
				if (dateType == 1) {
					this.fieldsType = 'year'
					this.date = dayjs().format('YYYY')
					this.weekValue = dayjs().isoWeek()
					this.week = `本周`
				}
				// if (dateType == 2) {
				// 	this.fieldsType = 'day'
				// 	this.date = dayjs().format('YYYY-MM-DD')
				// }
				if (dateType == 2) {
					this.fieldsType = 'month'
					this.date = dayjs().format('YYYY-MM')
				}
				if (dateType == 3) {
					this.fieldsType = 'year'
					this.date = dayjs().format('YYYY')
				}
				this.$refs.mescroll.refresh();
				console.log(this.date, 9999);
			},
			bindMonthChange(e) {
				console.log(e);
				this.date = e.detail.value
				this.yearDate = e.detail.value
				this.$refs.mescroll.refresh();
			},
			getListData(mescroll) {
				console.log(this.weekValue);
				let dateValue = ''
				if (this.dateType == 1) {
					dateValue = this.yearDate + '-' + this.weekValue
				} else {
					dateValue = this.date
				}
				this.$api.sendRequest({
					url: '/dealer/api/rank/dealer',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						date: dateValue,
						orderby: this.orderby,
						date_type: this.dateType == 1 ? 'week' : this.dateType == 2 ? 'month' : this.dateType ==
							3 ?
							"year" : ''
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
						if (mescroll.num == 1) this.recordList = []; //如果是第一页需手动制空列表
						this.recordList = this.recordList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
		},
		computed: {

		}
	};
</script>

<style>
</style>
<style scoped>
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
		justify-content: space-around;
		padding-left: 17px;
		padding-right: 30rpx;
		box-sizing: border-box;
		margin: 0 auto;
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

	.record-list {
		margin-top: 10px;
		width: 710rpx;
		margin: 0 auto;
	}


	.record-item {
		width: 710rpx;
		height: 95px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		padding-right: 40rpx;
		padding-left: 24rpx;
		box-sizing: border-box;
		margin-top: 10px;
	}

	.record-index {
		font-size: 24px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		width: 36px;
		height: 36px;
		text-align: center;
	}

	.record-right {
		width: 275px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.record-box {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.record-head {
		width: 48px;
		height: 48px;
		opacity: 1;
		border-radius: 24px;
		background: #ccc;
		margin-right: 8px;
	}

	.record-name {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		line-height: initial;
		width: 280rpx;
	}

	.record-phone {
		font-size: 11px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #65666E;
		opacity: 1;
	}

	.record-total {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #65666E;
		opacity: 1;
		display: flex;
		flex-direction: row;
	}
</style>
