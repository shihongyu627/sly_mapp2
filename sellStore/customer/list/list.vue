<template>
	<view class="order-container" :data-theme="themeStyle">
		<view class="customer-header">
			<view class="customer-left">
				<view class="customer-title">
					累计客户
				</view>
				<view class="customer-total">
					{{member_count}}<text class="customer-unit">个</text>
				</view>
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
		<mescroll-uni ref="mescroll" @getData="getListData" top="210rpx">
			<block slot="list">
				<block v-if="orderList.length > 0">
					<view class="team-list">
						<view class="team-item" v-for="(orderItem, orderIndex) in orderList" :key="orderIndex">
							<image :src="$util.loadimg(orderItem.headimg)" class="team-head" mode="aspectFill"
								:lazy-load="true"></image>
							<view class="team-right">
								<view class="team-content">
									<view class="team-content-item">
										<view class="team-name">
											{{orderItem.nickname}}
										</view>
										<view class="team-tag">
											{{orderItem.type_name}}
										</view>
									</view>
									<view class="team-content-item" v-if="orderItem.mobile" @click="makePhone(orderItem.mobile)">
										<view class="team-mobile">
											联系方式：{{orderItem.mobile}}
										</view>
										<img class='store-tel' src="@/common/img/store_tel.png" mode="aspectFill" />
									</view>
									<view class="team-content-item">
										<view class="team-time">
											加入时间：{{$util.timeStampTurnTime(orderItem.create_time)}}
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<view>
						<ns-empty :isIndex="!1" text="暂无客户"></ns-empty>
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
				orderList: [],
				isIphoneX: false,
				typeList: [],
				groupList: [{
					name: '粉丝用户',
					id: 'member_num'
				}, {
					name: '体验用户',
					id: 'subuser_num'
				}, {
					name: '试训卡',
					id: 'subcard_test_num'
				}, {
					name: '周期卡',
					id: 'subcard_re_num'
				}, {
					name: '设备',
					id: 'device_num'
				}],
				name: '粉丝用户',
				member_count: 0,
				orderby: "member_num"
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
			if (uni.getStorageSync('token')) {
				if (this.$refs.mescroll) this.$refs.mescroll.refresh();
			} else {
				// this.$util.redirectTo('/pages/login/login/login', {
				// 	back: '/sellStore/customer/list/list?status'
				// });
			}
		},
		methods: {
			makePhone(item) {
				console.log(item, '打电话');
				if (!item) {
					return
				}
				uni.makePhoneCall({
					phoneNumber: item //仅为示例
				});
			},
			//选择分组
			pickerEventGroup(e) {
				let index = e.target.value;
				console.log(e, index);
				this.name = this.groupList[index].name;
				this.orderby = this.groupList[index].id;
				this.$refs.mescroll.refresh();
			},
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/dealer/api/member/page',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						orderby: this.orderby
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
							this.member_count = res.data.count
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
	.customer-header {
		width: 100%;
		height: 88px;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 0px;
		padding-left: 24px;
		padding-right: 20rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.customer-left {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.customer-title {
		font-size: 13px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #000000;
		opacity: 0.8;
	}

	.customer-total {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
	}

	.customer-unit {
		font-size: 13px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #000000;
		opacity: 0.8;
	}

	.header-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 129px;
		height: 44px;
		background: #FFFFFF;
		border: 1px solid #DFDFDF;
		opacity: 1;
		border-radius: 9px;
		justify-content: center;
	}

	.header-date {
		font-size: 17px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #000000;
		opacity: 1;
	}

	.header-bottomIcon {
		width: 20px;
		height: 20px;
	}

	/deep/ .uni-page {
		overflow: hidden;
	}

	/deep/ .mescroll-upwarp {
		padding-bottom: 100rpx;
	}

	.team-item {
		width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		margin-bottom: 10px;
		padding-left: 14px;
		padding-right: 40rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
	}

	.team-head {
		width: 100rpx;
		height: 100rpx;
		opacity: 1;
		border-radius: 100rpx;
		background: #ccc;
		margin-right: 12px;
	}

	.team-right {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 260px;
	}

	.team-del {
		width: 12px;
		height: 14px;
		border: 1px solid #A6ABBA;
		opacity: 1;
	}

	.team-content-item {
		display: flex;
		align-items: center;

	}

	.store-tel {
		width: 36rpx;
		height: 36rpx;
		margin-left: 10rpx;
	}

	.team-name {
		font-size: 15px;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		margin-right: 5px;
	}

	.team-tag {
		font-size: 11px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #65666E;
		opacity: 1;
	}

	.team-text {
		font-size: 11px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #65666E;
		opacity: 1;
	}

	.team-time {
		font-size: 11px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #A6ABBA;
		opacity: 1;
	}

	.team-mobile {
		color: #333;
	}

	.team-footer {
		width: 100%;
		height: 68px;
		background: #FFFFFF;
		box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.01);
		opacity: 1;
		border-radius: 0px;
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
	}

	.team-btn {
		width: 710rpx;
		height: 48px;
		background: #1189F4;
		opacity: 1;
		border-radius: 24px;
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 48px;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
	}
</style>
