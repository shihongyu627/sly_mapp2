<template>
	<view :data-theme="themeStyle">
		<view class="point-header">
			<view class="header-title">
				累计邀请
			</view>
			<view class="header-num">
				<text class="point">{{total_member}}</text> 人
			</view>
		</view>
		<mescroll-uni @getData="getData" class="member-point" ref="mescroll" top="120rpx">
			<view slot="list">
				<block v-if="dataList.length">
					<view class="team-list">
						<view class="team-item" v-for="(orderItem, orderIndex) in dataList" :key="orderIndex">
							<image :src="$util.loadimg(orderItem.headimg)" class="team-head" mode="aspectFill"
								:lazy-load="true">
							</image>
							<view class="team-right">
								<view class="team-content">
									<view class="team-content-item">
										<view class="team-name">
											{{orderItem.member_nickname}}
										</view>
									</view>
									<view class="team-content-item">
										<view class="team-time">
											邀请时间：{{$util.timeStampTurnTime(orderItem.create_time)}}
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<view class="cart-empty">
						<ns-empty :isIndex="false"></ns-empty>
					</view>
				</block>
			</view>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>

	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		data() {
			return {
				dataList: [],
				pointIndex: 0,
				total_member: 0
			};
		},
		components: {},
		mixins: [globalConfig],
		onShow() {
			this.$langConfig.refresh();
		},
		onLoad() {
			// this.getPointType()
		},
		computed: {},
		methods: {
			//获得列表数据
			getData(mescroll) {
				this.$api.sendRequest({
					url: '/memberrecommend/api/memberrecommend/lists',
					data: {
						page_size: mescroll.size,
						page: mescroll.num,
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0) {
							newArr = res.data.list;
							this.total_member = res.data.total_member || 0
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
						this.dataList = this.dataList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	/deep/ .fixed {
		position: relative;
		top: 0;

	}

	.point-header {
		width: 100%;
		height: 110rpx;
		background: #fff;
		opacity: 1;
		border-radius: 0px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding-left: 40rpx;
		padding-right: 40rpx;
		box-sizing: border-box;
		position: fixed;
		top: 0;
		z-index: 99;
	}

	.point-tabBox {
		width: 100%;
		height: 44px;
		background: #fff;
		opacity: 1;
		border-radius: 0px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		box-sizing: border-box;
		position: fixed;
		top: 88px;
		z-index: 99;
	}

	.point-item {
		font-family: PingFang SC;
		font-size: 14px;
		font-weight: 400;
		color: #000000;
		opacity: 1;
		height: 44px;
		line-height: 44px;
	}

	.point-items {
		border-bottom: 2px solid #1189F4;
		font-weight: bold;
		color: #1189F4;
	}

	.header-num {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #000000;
		opacity: 0.8;
	}

	.point {
		font-size: 40rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
	}

	.header-title {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #000000;
		opacity: 0.8;
	}

	.cart-empty {
		margin-top: 104px !important;
	}

	.team-item {
		width: 710rpx;
		height: 140rpx;
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
		align-items: flex-start;
		padding-top: 12px;
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
</style>
