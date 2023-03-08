<template>
	<view class="card" :data-theme="themeStyle">
		<view class="memberVip-header" @click="goHref('/pages_tool/memberVip/info/info')">
			<image class="memberVip-bg" :src="goodsImg(configData.top_image)" mode="widthFix" @click="toDetail(item)">
			</image>
		</view>
		<view class="memberVip-title-box">
			<img class='memberVip-icon' src="../../assets/img/vip_icon.png" alt="" mode="aspectFill" />
			<view class="memberVip-title">
				购买以下任意一款商品即可成为会员
			</view>
			<img class='memberVip-icon' src="../../assets/img/vip_icon.png" alt="" mode="aspectFill" />
		</view>
		<view class="card-list">

			<view class="card-left">
				<view class="card-item margin-bottom" v-for="(item, index) in goodsListRight" :key="index">
					<image class="card-img" :src="goodsImg(item.sku_image)" mode="aspectFill" @click="toDetail(item)">
					</image>
					<view class="card-title">
						{{item.goods_name}}
					</view>
					<view class="card-text">
						已售{{item.sale_num}}件
					</view>
					<view class="card-price">
						<text style="font-size: 10px;">￥</text>{{item.price}}
					</view>
				</view>
			</view>
			<view class="card-left">
				<view class="card-item margin-bottom" v-for="(item, index) in goodsListLeft" :key="index">
					<image class="card-img" :src="goodsImg(item.sku_image)" mode="aspectFill" @click="toDetail(item)">
					</image>
					<view class="card-title">
						{{item.goods_name}}
					</view>
					<view class="card-text">
						已售{{item.sale_num}}件
					</view>
					<view class="card-price">
						<text style="font-size: 10px;">￥</text>{{item.price}}
					</view>
				</view>
			</view>
		</view>
		<view v-if="goodsList.length == 0 && emptyShow">
			<ns-empty text="暂无商品"></ns-empty>
		</view>
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
		mixins: [list, globalConfig],
		methods: {

		}
	};
</script>

<style lang="scss">

</style>
<style scoped>
	.memberVip-header {
		width: 100%;
		/* height: 280rpx; */
		margin: 0 auto;
	}

	.memberVip-bg {
		width: 100%;
		/* height: 280rpx; */
	}

	.memberVip-title-box {
		margin-top: 20px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-bottom: 20px;
	}

	.memberVip-title {
		font-size: 13px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #000000;
		opacity: 1;
	}

	.memberVip-icon {
		width: 16px;
		height: 16px;
	}

	.card-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		width: 710rpx;
		margin: 0 auto;
	}

	.card-item {
		width: 172px;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 4px;
		padding-bottom: 10px;
		overflow: hidden;
	}

	.card-img {
		width: 172px;
		height: 130px;
		opacity: 1;
	}

	.card-title {
		padding-left: 24rpx;
		padding-right: 40rpx;
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		line-height: initial;
		box-sizing: border-box;
	}

	.card-text {
		font-size: 11px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #A6ABBA;
		opacity: 1;
		padding-left: 24rpx;
		box-sizing: border-box;
	}

	.card-price {
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FA5D34;
		opacity: 1;
		padding-left: 24rpx;
		box-sizing: border-box;
	}
</style>
