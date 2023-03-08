<template>
	<view class="order-container" :data-theme="themeStyle">
		<view class="record-header">
			<view class="header-left">
				<!-- 	<picker mode="date" :value="date" fields="year" @change="bindYearChange">
					<view class="header-item header-items">
						<view class="header-date">{{date}}</view>
						<img class='header-bottomIcon' src="../../../common/img/store_bottom.png" alt=""
							mode="aspectFill" />
					</view>
				</picker> -->
				<picker mode="date" :value="date" fields="month" @change="bindMonthChange">
					<view class="header-item">
						<view class="header-date">{{date}}</view>
						<img class='header-bottomIcon' src="../../../common/img/store_bottom.png" alt=""
							mode="aspectFill" />
					</view>
				</picker>
			</view>
			<picker @change="pickerEventGroup($event)" mode='selector' :range="groupList" range-key="name"
				:value="index">
				<view class="header-item">
					<view class="header-date"> {{name?name:'全部'}}</view>
					<img class='header-bottomIcon' src="../../../common/img/store_bottom.png" alt=""
						mode="aspectFill" />
				</view>
			</picker>
		</view>
		<mescroll-uni ref="mescroll" @getData="getListData" top="110rpx">
			<block slot="list">
				<block v-if="recordList.length > 0">
					<view class="record-list">
						<view class="record-top">
							<view class="record-date">
								{{date}}
							</view>
							<view class="record-total">
								收入 {{total}}
							</view>
						</view>
						<view class="record-item" v-for="(item,index) in recordList" :key="index">
							<view class="item-left">
								<view class="item-type">
									{{item.title}}
								</view>
								<view class="item-date">
									{{item.date}}
								</view>
							</view>
							<view class="item-total">
								{{item.total}}
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
				recordList: [],
				date: dayjs().format('YYYY-MM'),
				groupList: [],
				name:'',
				total:0
			};
		},
		components: {
			uniLoadMore,
		},
		mixins: [ globalConfig],
		onLoad(option) {
			if (option.status) this.orderStatus = option.status;
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
			//选择分组
			pickerEventGroup(e) {
				let index = e.target.value;
				console.log(e,index);
				this.name = this.groupList[index].name;
				this.id = this.groupList[index].id;
			},
			bindMonthChange(e) {
				console.log(e);
				this.date = e.detail.value
			},
			getListData(mescroll) {
				// this.$api.sendRequest({
				// 	url: '/api/order/lists',
				// 	data: {
				// 		page: mescroll.num,
				// 		page_size: mescroll.size,
				// 		order_status: 'all',
				// 		order_type: this.order_type
				// 	},
				// 	success: res => {
				// 		let newArr = [];
				// 		let msg = res.message;
				// 		if (res.code == 0 && res.data) {
				// 			newArr = res.data.list;
				// 		} else {
				// 			this.$util.showToast({
				// 				title: msg
				// 			});
				// 		}
				// 		mescroll.endSuccess(newArr.length);
				// 		//设置列表数据
				// 		if (mescroll.num == 1) this.orderList = []; //如果是第一页需手动制空列表
				// 		this.orderList = this.orderList.concat(newArr); //追加新数据
				// 		this.orderList.forEach(v => {
				// 			v.order_goods.forEach(vo => {
				// 				if (vo.sku_spec_format) {
				// 					try {
				// 						vo.sku_spec_format = JSON.parse(vo.sku_spec_format);
				// 					} catch (e) {
				// 						vo.sku_spec_format = vo.sku_spec_format;
				// 					}
				// 				} else {
				// 					vo.sku_spec_format = [];
				// 				}
				// 			});
				// 		});
				// 		if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				// 	},
				// 	fail: res => {
				// 		mescroll.endErr();
				// 		if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				// 	}
				// });
			},
			goUserInfo(data) {
				this.$util.redirectTo('/sellStore/team/info/info', {
					order_id: data.order_id
				});
			},
			imageError(orderIndex, goodsIndex) {
				this.orderList[orderIndex].order_goods[goodsIndex].sku_image = this.$util.getDefaultImage()
					.default_goods_img;
				this.$forceUpdate();
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

	.record-header {
		width: 750rpx;
		height: 44px;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 0px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding-left: 17px;
		padding-right: 30rpx;
		box-sizing: border-box;
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
	}

	.item-left {}

	.item-type {
		font-size: 15px;
		font-weight: bold;
		color: #000000;
		opacity: 1;
	}

	.item-date {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #A6ABBA;
		opacity: 1;
	}

	.item-total {
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #1189F4;
		opacity: 1;
	}
</style>
