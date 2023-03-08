<template>
	<view class="order-container" :data-theme="themeStyle">
		<view class="distributor-header">
			<view class="distributor-header-flex">
				<view class="distributor-title">
					团队总人数：
				</view>
				<view class="distributor-total">
					{{dataInfo.team_num}}人
				</view>
			</view>
			<view class="distributor-header-flex">
				<view class="distributor-item" v-if="dataInfo.level6_count!=null">
					<view class="distributor-title">
						总裁：
					</view>
					<view class="distributor-total">
						{{dataInfo.level6_count}}人
					</view>
				</view>
				<view class="distributor-item" v-if="dataInfo.level5_count!=null">
					<view class="distributor-title">
						副总裁：
					</view>
					<view class="distributor-total">
						{{dataInfo.level5_count}}人
					</view>
				</view>
			</view>
		<view class="distributor-header-flex">
			<view class="distributor-item" v-if="dataInfo.level4_count!=null">
				<view class="distributor-title">
					总监：
				</view>
				<view class="distributor-total">
					{{dataInfo.level4_count}}人
				</view>
			</view>
			<view class="distributor-item" v-if="dataInfo.level3_count!=null">
				<view class="distributor-title">
					区域：
				</view>
				<view class="distributor-total">
					{{dataInfo.level3_count}}人
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
			dataInfo: {
				type: Object
			},
		},
		data() {
			return {};
		},
		components: {},
		mixins: [globalConfig],
		onLoad(option) {
			console.log(dataInfo, 999);
		},
		onShow() {

		},
		methods: {

		},
		computed: {

		}
	};
</script>


<style>
	.distributor-header {
		width: 100%;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 0px;
		padding-left: 24px;
		padding-right: 10px;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
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
		/* margin-right: 30rpx; */
		width: 50%;
		/* width: 360rpx; */
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
</style>
