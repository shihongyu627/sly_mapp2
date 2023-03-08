<template>
	<view class="order-container" :data-theme="themeStyle">
		<view class="distributor-header">
			<view class="distributor-item">
				<view class="distributor-title">
					推荐人总数：
				</view>
				<view class="distributor-total">
					{{total||0}}人
				</view>
			</view>
		</view>
		<mescroll-uni ref="mescroll" @getData="getListData" top="100rpx">
			<block slot="list">
				<block v-if="orderList.length > 0">
					<view class="team-list">
						<view class="team-item" v-for="(orderItem, orderIndex) in orderList" :key="orderIndex"
							@click="goUserInfo(orderItem)">
							<image :src="$util.loadimg(orderItem.headimg)" class="team-head" mode="aspectFill"
								:lazy-load="true"></image>
							<view class="team-right">
								<view class="team-content">
									<view class="team-content-item">
										<view class="team-name">
											{{orderItem.dealer_name}}
										</view>
										<view class="team-tag">
											{{orderItem.level_name}}
										</view>
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
						<ns-empty :isIndex="!1" text="暂无推荐人"></ns-empty>
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
				total: 0
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
			goUserInfo(data) {
				this.$util.redirectTo('/sellStore/stock/record/record', {
					dealer_id: data.dealer_id,
					type: 'in'
				});
			},
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/dealer/api/dealer/recommendList',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
							this.total = res.data.count || 0
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
	.distributor-header {
		width: 100%;
		height: 88rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 0px;
		padding-left: 24px;
		padding-right: 10px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.distributor-header-flex {
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
	}

	.distributor-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-right: 30rpx;
		width: 360rpx;
	}

	.distributor-title {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #000000;
		opacity: 0.8;
	}

	.distributor-total {
		font-size: 28rpx;
		font-family: PingFang SC;
		color: #000000;
		opacity: 1;
	}

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
		font-size: 25px;
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
		height: 70px;
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
	}

	.team-head {
		width: 40px;
		height: 40px;
		opacity: 1;
		border-radius: 70px;
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
