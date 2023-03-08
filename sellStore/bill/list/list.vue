<template>
	<view class="order-container" :data-theme="themeStyle">
		<view class="bill-box">
			<view class="bill-left">
				<view class="bill-title">
					费用录入
				</view>
				<view class="bill-text">
					费用录入除商品成本外的支出(如餐费等)
				</view>
			</view>
			<view class="bill-btn" @click="goCreate()">
				去录入
			</view>
		</view>
		<view class="record-header">
			<view class="header-left">
				<picker @change="pickerEventGroup($event)" mode='selector' :range="groupList" range-key="name"
					:value="index">
					<view class="header-item">
						<view class="header-date"> {{name?name:'全部'}}</view>
						<img class='header-bottomIcon' src="../../../common/img/store_bottom.png" alt=""
							mode="aspectFill" />
					</view>
				</picker>
			</view>
			<picker mode='date' :value="date" fields="month" @change="bindMonthChange">
				<view class="header-item">
					<view class="header-date">{{date}}</view>
					<img class='header-bottomIcon' src="../../../common/img/store_bottom.png" alt=""
						mode="aspectFill" />
				</view>
			</picker>
		</view>
		<mescroll-uni ref="mescroll" @getData="getListData" top="320rpx">
			<block slot="list">
				<block v-if="orderList.length > 0">
					<view class="record-list">
						<view class="record-item" v-for="(item,index) in orderList" :key="index">
							<view class="item-left">
								<view class="item-type">
									{{item.title}}
								</view>
								<view class="item-date">
									{{item.content}}
								</view>
							</view>
							<view class="item-right">
								<view class="item-total">
									￥{{item.money}}
								</view>
								<view class="item-date">
									{{$util.timeStampTurnTime(item.pay_time,'YY-MM-DD')}} <img @click="delRecord(item)"
										class='delPng' src="../../common/img/del.png" alt="" mode="aspectFill" />
								</view>
							</view>
							<!-- 	<view class="delBox">
							
							</view> -->
						</view>
					</view>
				</block>
				<block v-else>
					<view>
						<ns-empty :isIndex="!1" text="暂无明细"></ns-empty>
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
	import dayjs from 'dayjs'
	export default {
		data() {
			return {
				scrollInto: '',
				orderStatus: 'all',
				orderList: [],
				date: dayjs().format('YYYY-MM'),
				groupList: [],
				name: '',
				type: '',
				start_date: dayjs().startOf('month').format('YYYY-MM-DD'),
				end_date: dayjs().endOf('month').format('YYYY-MM-DD')
			};
		},
		components: {
			uniLoadMore,
		},
		mixins: [globalConfig],
		onLoad() {
			this.typelists()
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			if (uni.getStorageSync('token')) {
				if (this.$refs.mescroll) this.$refs.mescroll.refresh();
			} else {
				// this.$util.redirectTo('/pages/login/login/login', {
				// 	back: '/sellStore/bill/list/list?status=' + this.orderStatus
				// });
			}
		},
		methods: {
			goCreate() {
				this.$util.redirectTo('/sellStore/bill/create/create');
			},
			//选择分组
			pickerEventGroup(e) {
				let index = e.target.value;
				let type = this.groupList[index].value;
				console.log(e, index);
				this.type = type;
				if (type) {
					this.name = this.groupList[index].name;
				} else {
					this.name = ''
				}
				this.$refs.mescroll.refresh();
			},
			bindMonthChange(e) {
				this.date = e.detail.value
				this.start_date = dayjs(e.detail.value).startOf('month').format('YYYY-MM-DD')
				this.end_date = dayjs(e.detail.value).endOf('month').format('YYYY-MM-DD')
				this.$refs.mescroll.refresh();
			},
			delRecord(item) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '是否删除该记录？',
					success: res => {
						if (res.confirm) {
							that.confirmDel(item)
						}
					}
				});
			},
			confirmDel(item) {
				this.$api.sendRequest({
					url: '/dealer/api/cashbook/delete',
					data: {
						id: item.id
					},
					success: res => {
						this.$util.showToast({
							title: res.msg || ""
						});
						if (res.code == 0) {
							this.$refs.mescroll.refresh();
						}
					},
					fail: res => {}
				});
			},
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/dealer/api/cashbook/page',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						title: this.name,
						start_date: this.start_date,
						type: this.type,
						end_date: this.end_date
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
			typelists() {
				this.$api.sendRequest({
					url: '/dealer/api/cashbook/typelists',
					data: {},
					success: res => {
						if (res.code == 0 && res.data) {
							let dd = {
								name: "全部",
								value: ""
							}
							let arr = res.data
							arr.unshift(dd)
							this.groupList = arr;
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
		},
		computed: {

		}
	};
</script>

<style lang="scss">
</style>
<style scoped>
	/deep/ .uni-page {
		overflow: hidden;
	}

	/deep/ .mescroll-upwarp {
		padding-bottom: 100rpx;
	}

	.bill-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 710rpx;
		height: 94px;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		margin-top: 10px;
		padding-left: 14px;
		padding-right: 40rpx;
		box-sizing: border-box;
	}

	.bill-left {}

	.bill-title {
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
	}

	.bill-text {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 500;
		color: #65666E;
		opacity: 1;
	}

	.bill-btn {
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
	}

	.record-header {
		width: 710rpx;
		height: 44px;
		background: #FFFFFF;
		opacity: 1;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding-left: 17px;
		padding-right: 30rpx;
		box-sizing: border-box;
		margin: 0 auto;
		margin-top: 10px;
		border-radius: 10px;
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

	.record-top {
		width: 710rpx;
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding-left: 5px;
		padding-right: 5px;
		box-sizing: border-box;
	}

	.record-date {
		font-size: 13px;
		font-weight: 400;
		color: #000000;
		opacity: 1;
	}

	.record-total {
		font-size: 13px;
		font-weight: 400;
		color: #000000;
		opacity: 1;
	}

	.record-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 710rpx;
		height: 70px;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		padding-left: 14px;
		padding-right: 14px;
		box-sizing: border-box;
		margin-top: 10px;
		position: relative;
	}

	.item-left {}

	.item-type {
		font-size: 15px;
		font-weight: bold;
		color: #000000;
		opacity: 1;
	}

	.delBox {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 100;
		width: 40rpx;
		height: 40rpx;
	}

	.delPng {
		width: 30rpx;
		height: 30rpx;
		margin-left: 10rpx;
	}

	.item-date {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #A6ABBA;
		opacity: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.item-right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.item-total {
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #000000;
		opacity: 1;
	}
</style>
