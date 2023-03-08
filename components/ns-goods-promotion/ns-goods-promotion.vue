<template>
	<!-- 当前商品参与的营销活动入口 -->
	<view class="ns-goods-promotion" v-if="goodsPromotion.length">
		<view v-for="(item, index) in goodsPromotion" v-if="promotion != item.promotion_type" :key="index">
			<view v-if="item.promotion_type == 'discount'" class="item" @click="redirectTo('/pages/goods/detail', { goods_id: item.goods_id })">
				<text class="promotion-mark ">限时折扣</text>
				<text class="title">当前商品正在参加{{ item.promotion_name }}</text>
				<text class="iconfont iconright"></text>
				<!-- <view class="img-wrap"><image :src="$util.img('public/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
			</view>
			<view v-else-if="item.promotion_type == 'groupbuy'" class="item" @click="redirectTo('/pages_promotion/groupbuy/detail', { groupbuy_id: item.groupbuy_id })">
				<!-- <view v-else-if="item.promotion_type == 'groupbuy'" class="item" @click="redirectTo('/pages_promotion/groupbuy/detail', { id: item.groupbuy_id })"> -->
				<text class="promotion-mark ">团购</text>
				<text class="title">当前商品正在参加{{ item.promotion_name }}</text>
				<text class="iconfont iconright"></text>
				<!-- <view class="img-wrap"><image :src="$util.img('public/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
			</view>
			<view v-else-if="item.promotion_type == 'pintuan'" class="item" @click="redirectTo('/pages_promotion/pintuan/detail', { pintuan_id: item.pintuan_id })">
				<text class="promotion-mark ">拼团</text>
				<text class="title">当前商品正在参加{{ item.promotion_name }}</text>
				<text class="iconfont iconright"></text>
				<!-- <view class="img-wrap"><image :src="$util.img('public/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
			</view>
			<view v-else-if="item.promotion_type == 'seckill'" class="item" @click="redirectTo('/pages_promotion/seckill/detail', { seckill_id: item.id })">
				<text class="promotion-mark ">秒杀</text>
				<text class="title">当前商品正在参加{{ item.promotion_name }}</text>
				<text class="iconfont iconright"></text>
				<!-- <view class="img-wrap"><image :src="$util.img('public/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
			</view>
			<view v-else-if="item.promotion_type == 'topic'" class="item" @click="redirectTo('/pages_promotion/topics/goods_detail', { id: item.id })">
				<text class="promotion-mark ">专题活动</text>
				<text class="title">当前商品正在参加{{ item.promotion_name }}</text>
				<text class="iconfont iconright"></text>
				<!-- <view class="img-wrap"><image :src="$util.img('public/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
			</view>
			<view v-else-if="item.promotion_type == 'bargain'" class="item" @click="redirectTo('/pages_promotion/bargain/detail', { b_id: item.bargain_id })">
				<text class="promotion-mark ">砍价</text>
				<text class="title">当前商品正在参加{{ item.promotion_name }}</text>
				<text class="iconfont iconright"></text>
				<!-- <view class="img-wrap"><image :src="$util.img('public/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
			</view>
			<view v-else-if="item.promotion_type == 'pinfan'" class="item" @click="redirectTo('/pages_promotion/pinfan/detail', { pinfan_id: item.pintuan_id })">
				<text class="promotion-mark ">拼团返利</text>
				<text class="title">当前商品正在参加{{ item.promotion_name }}</text>
				<text class="iconfont iconright"></text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'ns-goods-promotion',
	props: {
		promotion: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			goodsPromotion: {
				type: Array
			}
		};
	},
	created() {},
	methods: {
		refresh(goodsPromotion) {
			this.goodsPromotion = goodsPromotion;
		},
		redirectTo(path, param) {
			this.$util.redirectTo(path, param);
		}
	}
};
</script>

<style lang="scss">
.ns-goods-promotion {
	background-color: #fff;
	& > view {
	}
	.item {
		display: flex;
		font-size: $font-size-base;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 2rpx solid $color-line;
		&:last-child {
			border-bottom: none;
		}

		.promotion-mark {
			padding: 12rpx 14rpx;
			margin-right: 16rpx;
			line-height: 1;
			color: var(--main-color);
			border-radius: 6rpx;
			font-size: $font-size-tag;
			font-weight: bold;
			background-color: var(--main-color-shallow);
		}

		.title {
			flex: 1;
			line-height: 1;
		}

		.iconfont {
			color: $color-tip;
			font-size: $font-size-base;
		}

		.img-wrap {
			width: 38rpx;
			height: 38rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
}
</style>
