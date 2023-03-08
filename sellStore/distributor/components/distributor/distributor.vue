<template>
	<view class="order-container" :data-theme="themeStyle">
		<view class="team-list">
			<view class="team-item-box" v-for="(orderItem, orderIndex) in orderList" :key="orderIndex">
				<view class="team-item" @click="goUserSub(orderItem)">
					<image :src="$util.loadimg(orderItem.headimg)" class="team-head" mode="aspectFill"
						:lazy-load="true">
					</image>
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
								<view class="team-text">
									团队人数：{{orderItem.team_num}}
								</view>
							</view>
							<view class="team-content-item">
								<view class="team-text">
									上级供货人：{{orderItem.parent_name}}
								</view>
							</view>
							<view class="team-content-item">
								<view class="team-time">
									加入时间：{{$util.timeStampTurnTime(orderItem.create_time)}}
								</view>
							</view>
						</view>
						<view>
							<!-- 	<view class="team-del">
							<view class="price">
								<text class="price-size">￥</text>
							</view>
							<view class="price-text">
								进货数量
							</view>
						</view> -->
							<view class="team-del">
								<view class="price">
									<text class="price-size">￥</text>{{orderItem.self_in_money}}
								</view>
								<view class="price-text">
									进货设备：{{orderItem.self_in_device_num}}
								</view>

							</view>
						</view>

					</view>
				</view>
				<view class="orderbtnbox" v-if="orderItem.dealer_id">
					<view class="orderbtn" @click="goUserInfo(orderItem)">
						经销订单
					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		props: {
			orderList: {
				orderList: Array,
			},
		},
		data() {
			return {};
		},
		components: {},
		mixins: [globalConfig],
		onLoad(option) {},
		onShow() {

		},
		methods: {
			goUserInfo(data) {
				this.$util.redirectTo('/sellStore/distributor/record/record', {
					dealer_id: data.dealer_id,
					title: data.nickname
				});
			},
			goUserSub(data) {
				this.$emit('goUserSub', data);
				// this.$util.redirectTo('/sellStore/distributor/record/record', {
				// 	dealer_id: data.dealer_id,
				// 	title: data.nickname
				// });
			},
		},
		computed: {

		}
	};
</script>

<style lang="scss">
	@import '../../public/css/list.scss';
</style>
<style scoped lang="scss">
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
		box-sizing: border-box;
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

	.team-item-box {
		background: #FFFFFF;
		width: 710rpx;
		margin: 0 auto;
		margin-bottom: 10px;
		padding-left: 14px;
		padding-right: 14px;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		border-radius: 10px;
		box-sizing: border-box;
	}

	.team-item {
		width: 710rpx;
		opacity: 1;
		display: flex;
		flex-direction: row;
		align-items: flex-start;

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
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FA5D34;
		opacity: 1;
	}

	.price-size {
		font-size: 26rpx;
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
		display: flex;
		flex-direction: row;
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

	.orderbtnbox {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		margin-top: 20rpx;
	}

	.orderbtn {
		padding-left: 15rpx;
		padding-right: 15rpx;
		padding-top: 8rpx;
		padding-bottom: 8rpx;
		background: #1189F4;
		opacity: 1;
		border-radius: 24px;
		font-size: 20rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
	}
</style>
