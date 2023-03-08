<template>
	<view class="order-container" :data-theme="themeStyle">
		<view class="distributor-header">
			<view class="distributor-item">
				<view class="distributor-title">
					门店总数：
				</view>
				<view class="distributor-total">
					{{total||0}}
				</view>
			</view>
		<!-- 	<view class="distributor-item">
				<view class="distributor-title">
					新增门店：
				</view>
				<view class="distributor-total">
					{{newTotal||0}}
				</view>
			</view> -->
		</view>
		<mescroll-uni ref="mescroll" @getData="getListData" top="100rpx">
			<block slot="list">
				<block v-if="orderList.length > 0">
					<view class="record-list">
						<view class="record-item" v-for="(item,index) in orderList" :key="index">
							<view class="item-top">
								<image :src="$util.loadimg(item.store_image)" class="top-left" mode="aspectFill"
									:lazy-load="true">
								</image>
								<view class="top-right">
									<view class="title">
										{{item.store_name}}
									</view>
									<view class="name">
										<text>联系人：{{item.dealer_name}}</text>
										<text class="name2">联系方式：{{item.member_mobile}}</text>
									</view>
								</view>
							</view>
							<view class="item-bottom">
								<view class="bottom-item">
									<view class="price">
										{{item.self_order_money||0}}
									</view>
									<view class="text">
										销售额(元)
									</view>
								</view>
								<view class="bottom-item">
									<view class="price">
										{{item.self_order_num||0}}
									</view>
									<view class="text">
										订单数(个)
									</view>
								</view>
								<view class="bottom-item">
									<view class="price">
										{{item.self_in_num||0}}
									</view>
									<view class="text">
										进货数(件)
									</view>
								</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<view>
						<ns-empty :isIndex="!1" text="暂无门店"></ns-empty>
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
				orderList: [],
				date: dayjs().format('YYYY-MM-DD'),
				total: 0,
				newTotal: 0
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
				// 	back: '/sellStore/store/list/list?status=' + this.orderStatus
				// });
			}
		},
		methods: {
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/dealer/api/dealer/team',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						type: 'store',
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
							this.total = res.data.store_num || 0
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

	.distributor-header {
		width: 100%;
		height: 88rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 0px;
		padding-left: 24px;
		padding-right: 24px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
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

	.record-item {
		width: 710rpx;
		height: 151px;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		margin-bottom: 10px;
	}

	.item-top {
		width: 320px;
		border-bottom: 1px solid #F8F8F8;
		opacity: 1;
		height: 76px;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin: 0 auto;
	}

	.top-left {
		width: 48px;
		height: 48px;
		background: #1189F4;
		border-radius: 50%;
		opacity: 1;
		margin-right: 15px;
	}

	.top-right {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.title {
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
	}

	.name {
		font-size: 11px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #65666E;
		opacity: 1;
	}

	.name2 {
		margin-left: 20px;
	}

	.item-bottom {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 75px;
	}

	.bottom-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 118px;
	}

	.price {
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
	}

	.text {
		font-size: 11px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #65666E;
		opacity: 1;
	}
</style>
