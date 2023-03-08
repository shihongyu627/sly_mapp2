<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="container">
		<mescroll-uni top="0" ref="mescroll" @getData="getGoodsList" v-if="info">
			<block slot="list">
				<view class="activity-head color-base-bg">
					<view class="activity-text font-size-toolbar">以下商品{{ info.price }}元任选{{ info.num }}件</view>
					<view class="no-start" v-if="info.status == 0">活动未开始</view>
					<view class="time" v-if="timeMachine">
						距离结束还剩
						<uni-count-down
							:day="timeMachine.d"
							:hour="timeMachine.h"
							:minute="timeMachine.i"
							:second="timeMachine.s"
							color="#fff"
							splitorColor="#fff !important"
							backgroundColor="none"
							border-color="transparent"
						/>
					</view>
				</view>

				<view class="goods-wrap">
					<view class="goods-item" v-for="(item, index) in goodsList" :key="index">
						<view class="goods-image" @click="$util.redirectTo('/pages/goods/detail', { goods_id: item.goods_id })">
							<image :src="$util.img(item.sku_image, { size: 'mid' })" mode="widthFix" @error="imageError(index)"></image>
						</view>
						<view class="goods-info">
							<view class="name" @click="$util.redirectTo('/pages/goods/detail', { goods_id: item.goods_id })">{{ item.goods_name }}</view>
							<view class="introduction">{{ item.introduction }}</view>
							<view class="goods-bottom">
								<view class="price  price-style large">
									<text class="unit  price-style small">{{ $lang('common.currencySymbol') }}</text>
									{{
										parseFloat(item.price)
											.toFixed(2)
											.split('.')[0]
									}}
									<text class="unit   price-style small">
										.{{
											parseFloat(item.price)
												.toFixed(2)
												.split('.')[1]
										}}
									</text>
								</view>
								<view class="num">
									<block v-if="cart['goods_' + item.goods_id] == undefined">
										<view v-if="item.goods_spec_format == ''" class="num-wrap">
											<!-- 单规格 -->
											<text class="iconfont iconadd-fill color-base-text" @click="singleSkuPlus(item)"></text>
										</view>
										<view v-else class="num-wrap">
											<!-- 多规格 -->
											<text class="select color-base-bg" @click="manySkuSelect(item)">选规格</text>
										</view>
									</block>
									<block v-else>
										<!-- 单规格 -->
										<view class="num-wrap" v-if="item.goods_spec_format == ''">
											<text class="iconfont iconjianshao" @click="singleSkuReduce(item)"></text>
											<text class="goods-num">{{ cart['goods_' + item.goods_id].num }}</text>
											<text class="iconfont iconadd-fill color-base-text" @click="singleSkuPlus(item)"></text>
										</view>
										<!-- 多规格 -->
										<view class="num-wrap" v-else @click="manySkuSelect(item)">
											<text class="iconfont iconjianshao"></text>
											<text class="goods-num">{{ cart['goods_' + item.goods_id].num }}</text>
											<text class="iconfont iconadd-fill color-base-text"></text>
										</view>
									</block>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</mescroll-uni>
		<block v-if="info">
			<view class="footer-wrap">
				<view class="left">
					<view class="cart-wrap" @click="openCartPopup">
						<text class="iconfont iconcart-on"></text>
						<text class="num color-base-bg" v-if="totalNum">{{ totalNum }}</text>
					</view>
					<view class="data">
						<view class="price price-color">
							<text class="unit">{{ $lang('common.currencySymbol') }}</text>
							{{
								parseFloat(totalPrice)
									.toFixed(2)
									.split('.')[0]
							}}
							<text class="unit ">
								.{{
									parseFloat(totalPrice)
										.toFixed(2)
										.split('.')[1]
								}}
							</text>
						</view>
						<view class="desc">{{ info.price }}元任选{{ info.num }}件</view>
					</view>
				</view>
				<view class="right">
					<view class="sub-btn color-base-bg" v-if="totalNum > 0 && totalNum % info.num == 0 && info.status != 0" @click="submit">立即下单</view>
					<view class="sub-btn disabled" v-else>立即下单</view>
				</view>
			</view>
			<view class="cart-shade" style="background-color:rgba(0,0,0,.4)" v-if="cartShow" @click="closeCartPopup"></view>
			<view class="cart-popup" :class="{ show: cartShow }" v-if="skuList.length">
				<view class="header">
					<view class="left"><text>购物车</text></view>
					<view class="right" @click="clearCart">
						<text class="iconfont iconicon7"></text>
						<text>清空购物车</text>
					</view>
				</view>
				<scroll-view scroll-y class="cart-goods-wrap">
					<view class="goods-item" v-for="(item, index) in skuList" :key="index">
						<view class="info">
							<text class="goods-name">{{ item.goods_name }}</text>
							<text class="sku-name" v-if="item.goods_name != item.sku_name">{{ item | sku }}</text>
						</view>
						<view class="price price-style large">
							<text class="unit price-style small">{{ $lang('common.currencySymbol') }}</text>
							{{
								parseFloat(item.price)
									.toFixed(2)
									.split('.')[0]
							}}
							<text class="unit price-style small">
								.{{
									parseFloat(item.price)
										.toFixed(2)
										.split('.')[1]
								}}
							</text>
						</view>
						<view class="num">
							<text class="iconfont iconjianshao" @click="singleSkuReduce(item)"></text>
							<text class="goods-num">{{ item.num }}</text>
							<text class="iconfont iconadd-fill color-base-text" @click="singleSkuPlus(item)"></text>
						</view>
					</view>
				</scroll-view>
			</view>
		</block>

		<ns-goods-sku
		v-if="goodsSkuDetail"
			ref="goodsSku"
			@refresh="refreshGoodsSkuDetail"
			@confirm="joinCart"
			:goodsId="goodsSkuDetail.goods_id"
			:goods-detail="goodsSkuDetail"
		></ns-goods-sku>
		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import detail from './public/js/detail.js';
import nsGoodsSku from '@/components/ns-goods-sku/ns-goods-sku.vue';

export default {
	components: {
		uniPopup,
		nsGoodsSku
	},
	mixins: [detail]
};
</script>

<style lang="scss">
@import './public/css/detail.scss';
</style>
<style scoped>
.activity-head >>> .uni-countdown__number {
	line-height: 36rpx;
	height: 36rpx;
	padding: 0 6rpx;
	font-size: 24rpx;
}
.activity-head >>> .uni-countdown__splitor {
	line-height: 40rpx;
}
/deep/ .uni-popup__wrapper.uni-center {
	background: rgba(0, 0, 0, 0.6);
}
/deep/.uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
	border-radius: 10px;
	background: rgba($color: #000000, $alpha: 0);
}
/deep/ .uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
	overflow-y: visible;
	background: unset;
}
/deep/ .sku-layer .uni-popup__wrapper-box {
	overflow-y: initial !important;
	max-height: initial !important;
}
</style>
