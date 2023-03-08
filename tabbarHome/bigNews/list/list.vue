<template>
	<view class="content" :data-theme="themeStyle">
		<mescroll-uni ref="mescroll" @getData="getGoodsList">
			<block slot="list">
				<view class="bigNews-list">
					<view class="bigNews-item margin-bottom" v-for="(item, index) in goodsList" :key="index"
						@click="toDetail(item)">
						<view class="bigNews-img-box">
							<image class="bigNews-img" :src="goodsImg(item.cover_img)" mode="widthFix"></image>
						</view>
						<view class="bigNews-name">{{ item.title }}</view>
						<view class="bigNews-time">{{ $util.timeStampTurnTime(item.create_time) }}</view>
					</view>
				</view>
				<view v-if="goodsList.length == 0 && emptyShow">
					<ns-empty text="暂无新闻"></ns-empty>
				</view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import list from '../public/js/list.js';
	import globalConfig from '@/common/js/golbalConfig.js';

	export default {
		components: {},
		data() {
			return {};
		},
		mixins: [list, globalConfig]
	};
</script>

<style lang="scss">

</style>
<style scoped>
	.bigNews-item {
		width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		margin-top: 10px;
		padding-bottom: 10px;
		padding-top: 10px;
	}

	.bigNews-img-box {
		width: 670rpx;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		margin-top: 10px;
	}

	.bigNews-img {
		width: 670rpx;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
	}

	.bigNews-name {
		width: 670rpx;
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		margin: 0 auto;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		margin-bottom: 12px;
		margin-top: 10px;
	}

	.bigNews-time {
		width: 670rpx;
		font-size: 12px;
		font-family: PingFang SC;
		margin: 0 auto;
		font-weight: 400;
		color: #AFAFAF;
		opacity: 1;
	}
</style>
