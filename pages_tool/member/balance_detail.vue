<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<!-- 		<scroll-view id="tab-bar" class="order-nav" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
			<view v-for="(statusItem, statusIndex) in statusList" :key="statusIndex" class="uni-tab-item" :id="statusItem.id" :data-current="statusIndex" @click="ontabtap">
				<text class="uni-tab-item-title" :class="statusIndex == orderStatus ? 'uni-tab-item-title-active' : ''">{{ statusItem.name }}</text>
			</view>
		</scroll-view> -->
		<view class="tab color-bg">
			<view class="tab-left">
				<picker mode="date" :value="searchType.date" @change="bindDateChange" fields="month">
					<view class="uni-input">
						{{ date }}
						<text class="iconfont iconiconangledown"></text>
					</view>
				</picker>
			</view>
		<!-- 	<view class="tab-right">
				<picker @change="bindPickerChange" :value="balanceIndex" :range="balanceType" class="picker" range-key="label">
					<text class="desc uni-input">{{ balanceType[balanceIndex].label }}</text>
					<text class="iconfont iconiconangledown"></text>
				</picker>
			</view> -->
		</view>
		<mescroll-uni @getData="getData" ref="mescroll">
			<block slot="list">
				<!-- 明细列表 -->
				<block v-if="dataList.length > 0">
					<view class="detailed-wrap">
						<view class="balances" v-for="(item, index) in dataList" :key="index">
							<!-- <image :src="$util.img('public/uniapp/member/balance_detail/income.png')" class="balances-img" v-if="item.account_data > 0"></image>
							<image v-else :src="$util.img('public/uniapp/member/balance_detail/pay.png')" mode="widthFix"></image> -->
							<view class="balances-info" @click="toFromDetail(item)">
								<text class="title">{{ item.type_name }}</text>
								<text>{{ item.remark }}</text>
								<text>{{ $util.timeStampTurnTime(item.create_time) }}</text>
							</view>
							<view class="balances-num">
								<text :class="item.account_data > 0 ? 'color-base-text' : ''">{{ item.account_data > 0 ? '+' + item.account_data : item.account_data }}</text>
							</view>
						</view>
					</view>
				</block>
				<block v-else><ns-empty :isIndex="false" text="暂无余额明细"></ns-empty></block>

				<!-- 无明细列表 -->
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
export default {
	data() {
		const currentDate = this.getDate({
			format: true
		});
		return {
			dataList: [],
			statusList: [{ name: '全部', id: '0' }, { name: '收入', id: '1' }, { name: '支出', id: '2' }],
			scrollInto: '',
			orderStatus: '0',
			date: currentDate,
			searchType: {
				from_type: 0,
				date: ''
			},
			balanceType: [
				{
					label: '全部',
					value: '0'
				}
			], //柚币类型
			balanceIndex: 0,
			related_id: 0
		};
	},
	components: {},
	onLoad(option) {
		if (option.group_id) this.related_id = option.group_id ? option.group_id : 0;
		if (option.from_type) this.searchType.from_type = option.from_type;
		if (option.related_id) this.related_id = option.related_id ? option.related_id : 0;
		if (option.status) this.orderStatus = option.status;
		this.getbalanceType();
	},
	onShow() {
		if (!uni.getStorageSync('token')) {
			this.$refs.login.open('/pages_tool/member/balance');
		}
	},
	methods: {
		bindDateChange: function(e) {
			var temp = e.target.value;
			var tempArr = temp.split('-');
			this.date = tempArr[0] + '年' + tempArr[1] + '月';
			this.searchType.date = e.target.value;
			this.$refs.mescroll.refresh();
		},
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();

			if (type === 'start') {
				year = year - 60;
			} else if (type === 'end') {
				year = year + 2;
			}
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			return `${year}年${month}月`;
		},
		bindPickerChange(e) {
			this.balanceIndex = e.detail.value;
			this.searchType.from_type = this.balanceType[this.balanceIndex].value;
			this.$refs.mescroll.refresh();
		},
		//获取分类类型
		getbalanceType() {
			this.$api.sendRequest({
				url: '/api/memberaccount/fromType',
				success: res => {
					let balanceType = Object.assign(res.balance, res.balance_money), typeArr = [ { label: '全部', value: '0' }];
					for (var index in balanceType) {
						typeArr.push({label: balanceType[index].type_name, value: index })
					}
					this.balanceType = typeArr; 
				}
			});
		},
		ontabtap(e) {
			let index = e.currentTarget.dataset.current;
			this.orderStatus = this.statusList[index].id;
			this.$refs.mescroll.refresh();
		},
		getData(mescroll) {
			this.$api.sendRequest({
				url: '/api/memberaccount/page',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					account_type: 'balance,balance_money',
					from_type: this.searchType.from_type,
					date: this.searchType.date,
					related_id: this.related_id
				},
				success: res => {
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({ title: msg });
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) {
						this.dataList = []; //如果是第一页需手动制空列表
						this.related_id = 0;
					}
					this.dataList = this.dataList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		toFromDetail(item) {
			if (item.from_type == 'order' && !isNaN(parseInt(item.type_tag))) {
				this.$util.redirectTo('/order/detail', { order_id: item.type_tag });
			} else if (item.from_type == 'refund' && parseInt(item.type_tag) != 0) {
				this.$util.redirectTo('/order/detail', {
					order_id: item.type_tag
				});
			}
		}
	}
};
</script>

<style lang="scss">
.detailed-wrap {
	padding-top: 80rpx;
	background: #fff;
}
.tab {
	position: fixed;
	top: 0;
	width: 100%;
	z-index: 10;
	display: flex;
	justify-content: space-between;
	height: 80rpx;
	background-color: $color-bg;
	view {
		flex: 1;
		text-align: center;
		line-height: 80rpx;
		text {
			margin-left: 10rpx;
			font-size: $font-size-base;
		}
	}
	.tab-left{
		display: flex;
		padding-left: 46rpx;
	}
	.tab-right{
		display: flex;
		justify-content: flex-end;
		padding-right: 26rpx;
	}
}
.order-nav {
	width: 100vw;
	height: 70rpx;
	display: flex;
	flex-direction: row;
	/* #ifndef APP-PLUS */
	white-space: nowrap;
	/* #endif */
	background: #fff;
	border-bottom-left-radius: 24rpx;
	border-bottom-right-radius: 24rpx;
	padding-bottom: 30rpx;
	position: fixed;
	left: 0;
	z-index: 998;

	.uni-tab-item {
		width: 33.33%;
		text-align: center;
		/* #ifndef APP-PLUS */
		display: inline-block;
		/* #endif */
		flex-wrap: nowrap;
	}

	.uni-tab-item-title {
		color: #555;
		font-size: $font-size-base;
		display: block;
		height: 64rpx;
		line-height: 64rpx;
		border-bottom: 4rpx solid #fff;
		padding: 0 10rpx;
		flex-wrap: nowrap;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
	}

	.uni-tab-item-title-active {
		display: block;
		height: 64rpx;
		padding: 0 10rpx;
	}

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
}
.balances {
	padding: $margin-both 0;
	margin: 0 $margin-both;
	box-sizing: border-box;
	display: flex;
	align-items: flex-start;
	border-bottom: 2rpx solid $color-line;
	image {
		width: 54rpx;
		height: 54rpx;
		border-radius: 50%;
	}
	.balances-info {
		flex: 1;
		margin-left: 16rpx;
		display: flex;
		flex-direction: column;
		text {
			font-size: $font-size-toolbar;
			line-height: 1;
			&:last-child {
			}
			&:nth-child(2) {
				margin-top: $margin-updown;
				font-size: $font-size-activity-tag;
				color: $color-tip;
			}
			&:nth-child(3) {
				font-size: $font-size-activity-tag;
				margin-top: $margin-updown;
				color: $color-tip;
			}
		}
	}
	.balances-num {
		text {
			line-height: 1;
			font-size: $font-size-toolbar;
			font-weight: 500;
		}
	}
}

.empty {
	width: 100%;
	height: 500rpx;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
}
</style>
