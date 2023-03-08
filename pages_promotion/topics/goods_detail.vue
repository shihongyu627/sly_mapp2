<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<goods-detail-view :goodsSkuDetail="goodsSkuDetail" ref="goodsDetailView">
			<!-- 价格区域 -->
			<template v-slot:price>
				<view
					v-if="goodsSkuDetail.discountTimeMachine"
					class="goods-promotion"
				>
					<view class="price-info">
						<view class="icon-box"><text class="iconfont iconzhuantihuodong"></text></view>
						<view class="price-box">
							<view class="promotion-text">专题活动</view>
							<view class="sale-num" v-if="goodsSkuDetail.sale_show">
								已售{{ goodsSkuDetail.sale_num }} {{ goodsSkuDetail.unit }}
							</view>
						</view>
					</view>
					<view class="countdown" >
						<view class="txt">距结束仅剩</view>
						<view class="clockrun">
							<uni-count-down
								:day="goodsSkuDetail.discountTimeMachine.d"
								:hour="goodsSkuDetail.discountTimeMachine.h"
								:minute="goodsSkuDetail.discountTimeMachine.i"
								:second="goodsSkuDetail.discountTimeMachine.s"
								splitorColor="#ffffff"
								backgroundColor="#ffffff"
							/>
						</view>
					</view>
				</view>

				<view class="group-wrap padding-top">
					<view class="goods-module-wrap">
						<text class="promotion-tag color-base-bg">专题价</text>
						<text class="price-symbol price-font">{{ $lang('common.currencySymbol') }}</text>
						 
						<text class="price price-font" >{{ parseFloat(goodsSkuDetail.topic_price).toFixed(2).split(".")[0] }}</text>
						<text class="price-symbol price-font">.{{ parseFloat(goodsSkuDetail.topic_price).toFixed(2).split(".")[1] }}</text>
						
						<view class="market-price-wrap" v-if="(goodsSkuDetail.price > 0 || goodsSkuDetail.market_price > 0) && goodsSkuDetail.market_price_show">
							<text class="unit price-font">{{ $lang('common.currencySymbol') }}</text>
							<text class="money price-font" v-if="goodsSkuDetail.market_price > 0">{{ goodsSkuDetail.market_price }}</text>
							<text class="money price-font" v-else>{{ goodsSkuDetail.price }}</text>
						</view>
						<view class="follow-and-share">
							<text class="follow iconfont iconfenxiang" @click="openSharePopup()"></text>
							<!-- <text class="share iconfont" @click="editCollection()" :class="whetherCollection == 1 ? 'iconlikefill color-base-text' : 'iconguanzhu'"></text> -->
						</view>
					</view>
					<view class="goods-module-wrap info">
						<text class="sku-name-wrap">{{ goodsSkuDetail.goods_name }}</text>
						<text class="introduction color-base-text" v-if="goodsSkuDetail.introduction">{{ goodsSkuDetail.introduction }}</text>
						<view class="logistics-wrap">
							<block v-if="!goodsSkuDetail.is_virtual">
								<text v-if="goodsSkuDetail.is_free_shipping">快递 包邮</text>
								<text v-else>快递 买家承担</text>
							</block>
							
							<text v-if="goodsSkuDetail.stock_show">库存 {{ goodsSkuDetail.stock }} {{ goodsSkuDetail.unit }}</text>
							<text v-if="goodsSkuDetail.sale_show">销量 {{ goodsSkuDetail.sale_num }} {{ goodsSkuDetail.unit }}</text>
						</view>
					</view>
				</view>
			</template>

			<!-- 入口区域 -->
			<template v-slot:entrance>
				<view class="item delivery-type" v-if="goodsSkuDetail.is_virtual == 0" @click="$refs.deliveryType.open()">
					<view class="label">配送</view>
					<block v-if="deliveryType">
						<view class="box">
							<block v-for="(item, index) in deliveryType" :key="index">
								<text v-if="goodsSkuDetail.support_trade_type.indexOf(index) != -1">{{ item.name }}</text>
							</block>
						</view>
						<text class="iconfont iconright"></text>
					</block>
					<block v-else>
						<view class="box">
							商家未配置配送方式
						</view>
					</block>
				</view>
				<!-- 已选规格 -->
				<view class="item selected-sku-spec" v-if="goodsSkuDetail.sku_spec_format" @click="topic">
					<view class="label">选择</view>
					<view class="box">
						<text v-for="(item, index) in goodsSkuDetail.sku_spec_format" :key="index">{{ item.spec_name }}/{{ item.spec_value_name }}</text>
					</view>
					<text class="iconfont iconright"></text>
					<!-- <view class="img-wrap"><image :src="$util.img('public/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
				</view>
				<!-- 配送方式 -->
				<uni-popup ref="deliveryType" type="bottom">
					<view class="deliverytype-popup-layer popup-layer">
						<view class="head-wrap" @click="$refs.deliveryType.close()">
							<text>配送</text>
							<text class="iconfont iconclose"></text>
						</view>
						<scroll-view scroll-y class="type-body">
							<block v-for="(item, index) in deliveryType" :key="index">
								<view class="type-item" :class="{'not-support': goodsSkuDetail.support_trade_type.indexOf(index) == -1}">
									<text class="iconfont" :class="item.icon"></text>
									<view class="content">
										<view class="title">{{ item.name }}</view>
										<view class="desc">{{ item.desc }}</view>
									</view>
								</view>
							</block>
						</scroll-view>
					</view>
				</uni-popup>
			</template>

			<!-- 业务区域 -->
			<template v-slot:business>
				<ns-goods-sku v-if="goodsSkuDetail.goods_id" ref="goodsSku" :goods-id="goodsSkuDetail.goods_id" :goods-detail="goodsSkuDetail" @refresh="refreshGoodsSkuDetail"></ns-goods-sku>
			</template>

			<!-- 操作区域 -->
			<template v-slot:action>
				<!-- 商品底部导航 -->
				<ns-goods-action :safeArea="isIphoneX">
					<template v-if="goodsSkuDetail.goods_state == 1 ">
						<ns-goods-action-icon text="首页" icon="iconshouye1" @click="goHome" />
						<ns-goods-action-icon text="客服" icon="iconiconicon-kefu" :send-data="contactData" :chatParam="chatRoomParams"/>
						<ns-goods-action-icon text="购物车" icon="icongouwuche2" :cornerMarkBg="themeStyle.goods_detail.goods_cart_num_corner" :corner-mark="cartCount > 0 ? cartCount + '' : ''" @click="goCart" />

						<block v-if="goodsSkuDetail.stock == 0 && !goodsSkuDetail.sku_spec_format">
							<ns-goods-action-button class="goods-action-button active3" disabled-text="库存不足" :disabled="true" />
							<!-- <ns-goods-action-button v-if="goodsSkuDetail.sku_spec_format" class="goods-action-button active3" disabled-text="库存不足" :disabled="true" @click="topic" />
							<ns-goods-action-button v-else class="goods-action-button active3" disabled-text="库存不足" :disabled="true" /> -->
						</block>

						<ns-goods-action-button :textColor="themeStyle.btn_text_color" :backgroundColor="themeStyle.goods_detail.goods_btn_color" v-else class="goods-action-button active1" text="立即抢购" @click="topic" />
					</template>
					<template v-else>
						<ns-goods-action-button class="goods-action-button active2" disabled-text="该商品已下架" :disabled="true" />
					</template>
				</ns-goods-action>
			</template>
		</goods-detail-view>

		<to-top v-if="showTop" @toTop="scrollToTopNative()"></to-top>
		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
import nsGoodsAction from '@/components/ns-goods-action/ns-goods-action.vue';
import nsGoodsActionIcon from '@/components/ns-goods-action-icon/ns-goods-action-icon.vue';
import nsGoodsActionButton from '@/components/ns-goods-action-button/ns-goods-action-button.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import nsGoodsSku from '@/components/ns-goods-sku/ns-goods-sku.vue';
import uniCountDown from '@/components/uni-count-down/uni-count-down.vue';
import detail from './public/js/detail.js';
import scroll from '@/common/js/scroll-view.js';
import goodsDetailBase from '@/common/js/goods_detail_base.js';
import goodsDetailView from '@/components/goods-detail-view/goods-detail-view.vue';
import toTop from '@/components/toTop/toTop.vue';

export default {
	components: {
		nsGoodsAction,
		nsGoodsActionIcon,
		nsGoodsActionButton,
		uniPopup,
		nsGoodsSku,
		uniCountDown,
		goodsDetailView,
		toTop
	},
	mixins: [goodsDetailBase, detail, scroll]
};
</script>

<style lang="scss">
@import '@/common/css/goods_detail.scss';
@import './public/css/detail.scss';
</style>
<style scoped>
/deep/ .uni-video-cover {
	background: none;
}

/deep/ .uni-video-cover-duration {
	display: none;
}

/deep/ .uni-video-cover-play-button {
	border-radius: 50%;
	border: 4rpx solid #fff;
	width: 120rpx;
	height: 120rpx;
	background-size: 30%;
}

.poster-layer >>> .uni-popup__wrapper-box {
	max-height: initial !important;
}

/deep/ .sku-layer .uni-popup__wrapper-box {
	overflow-y: initial !important;
}
/deep/ .action-icon-wrap .iconfont.iconshouye1 {
	font-size: 40rpx;
}
.goods-promotion .countdown .clockrun >>> .uni-countdown__number {
	min-width: 32rpx;
	height: 32rpx;
	text-align: center;
	line-height: 32rpx;
	border-radius: 4px;
	display: inline-block;
	padding: 4rpx;
	margin: 0;
	border: none;
}
.goods-promotion .countdown .clockrun >>> .uni-countdown__splitor {
	height: 32rpx;
	line-height: 36rpx;
	text-align: center;
	display: inline-block;
	padding: 0 8rpx;
}
.goods-promotion .countdown .clockrun >>> .uni-countdown__splitor.day {
	width: initial;
}
/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	max-height: unset !important;
}

/deep/ .goods-action-button.active1 {
}
/deep/ .goods-action-button.active1 .action-buttom-wrap {
	height: 72rpx;
	line-height: 72rpx;
	border-radius: $border-radius;
}
/deep/ .goods-action-button.active2 {
}
/deep/ .goods-action-button.active2 .action-buttom-wrap {
	height: 72rpx;
	line-height: 72rpx;
	border-radius: $border-radius;
	margin: 10px 0;
}
</style>
