<template>
	<view class="order-container" :data-theme="themeStyle">
		<Header :dataInfo='dataInfo'></Header>
		<mescroll-uni ref="mescroll" @getData="getListData" top="200rpx">
			<block slot="list">
				<block v-if="orderList.length > 0">
					<distributor @goUserSub='goUserSub' :orderList='orderList'>
					</distributor>
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
	import distributor from '../components/distributor/distributor.vue'
	import Header from '../components/header/header.vue'
	export default {
		data() {
			return {
				scrollInto: '',
				orderList: [],
				isIphoneX: false,
				type: 'dealer',
				dataInfo: {}
			};
		},
		components: {
			uniLoadMore,
			distributor,
			Header
		},
		mixins: [globalConfig],
		onLoad(option) {},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			if (uni.getStorageSync('token')) {
				if (this.$refs.mescroll) this.$refs.mescroll.refresh();
			} else {
				// this.$util.redirectTo('/pages/login/login/login', {
				// 	back: '/sellStore/distributor/list/list?status=' + this.orderStatus
				// });
			}
		},
		methods: {
			goUserSub(data) {
				this.$util.redirectTo('/sellStore/distributor/list1/list', {
					dealer_id: data.dealer_id,
					title: data.nickname
				});
			},
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/dealer/api/dealer/team',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						order_status: 'all',
						type: this.type
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
							this.dataInfo.team_num = res.data.team_num 
							this.dataInfo.line_num = res.data.line_num 
							this.dataInfo.level3_count = res.data.level3_count 
							this.dataInfo.level4_count = res.data.level4_count 
							this.dataInfo.level5_count = res.data.level5_count 
							this.dataInfo.level6_count = res.data.level6_count
							this.dataInfo.level7_count = res.data.level7_count 
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
			goUserInfo(data) {
				this.$util.redirectTo('/sellStore/distributor/record/record', {
					dealer_id: data.dealer_id,
					title: data.nickname
				});
			},
		},
		computed: {

		}
	};
</script>

<style lang="scss">
	@import '../public/css/list.scss';
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
		height: 88px;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 0px;
		padding-left: 24px;
		padding-right: 24px;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
	}

	.distributor-item {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.distributor-title {
		font-size: 13px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #000000;
		opacity: 0.8;
	}

	.distributor-total {
		font-size: 25px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
	}

	.distributor-unit {
		font-size: 13px;
		font-weight: 400;
		color: #000000;
		opacity: 0.8;
		margin-left: 10px;
	}

	.team-item {
		width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		margin-bottom: 10px;
		padding-left: 14px;
		padding-right: 14px;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
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
		width: 270px;
	}

	.team-del {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.price {
		font-size: 22px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FA5D34;
		opacity: 1;
	}

	.price-size {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FA5D34;
		opacity: 1;
	}

	.price-text {
		font-size: 11px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #65666E;
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
		background: #1189F4;
		opacity: 1;
		border-radius: 4px;
		font-size: 11px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		opacity: 1;
		padding-left: 5px;
		padding-right: 5px;
		padding-top: 2px;
		padding-bottom: 2px;
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
