<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<goods-detail-view :goodsSkuDetail="goodsSkuDetail" ref="goodsDetailView">
			<!-- 价格区域 -->
			<template v-slot:price>
				<!-- 限时折扣 -->
				<view v-if="showDiscount && goodsSkuDetail.discountTimeMachine" class="goods-promotion">

					<view class="price-info">
						<view class="icon-box">
							<text class="iconfont icontutechan-copy-copy-copy"></text>
						</view>
						<view class="price-box">
							<view class="promotion-text">限时折扣</view>
							<view class="sale-num" v-if="goodsSkuDetail.sale_show">
								已售{{ goodsSkuDetail.sale_num }}{{ goodsSkuDetail.unit }}</view>
						</view>
					</view>

					<view class="countdown">
						<view class="txt">距结束仅剩</view>
						<view class="clockrun">
							<uni-count-down :day="goodsSkuDetail.discountTimeMachine.d"
								:hour="goodsSkuDetail.discountTimeMachine.h"
								:minute="goodsSkuDetail.discountTimeMachine.i"
								:second="goodsSkuDetail.discountTimeMachine.s" splitorColor="#ffffff"
								backgroundColor="#ffffff" />
						</view>
					</view>
				</view>

				<view class="group-wrap padding-top">
					<view class="goods-module-wrap">
						<text class="price-symbol price-font">{{ $lang('common.currencySymbol') }}</text>
						<template v-if="showDiscount">
							<text
								class="price price-font">{{ parseFloat(goodsSkuDetail.discount_price).toFixed(2).split(".")[0] }}</text>
							<text
								class="price-symbol price-font">.{{ parseFloat(goodsSkuDetail.discount_price).toFixed(2).split(".")[1] }}</text>
						</template>
						<template v-else>
							<template v-if="goodsSkuDetail.member_price > 0">
								<text
									class="price price-font">{{ parseFloat(goodsSkuDetail.member_price).toFixed(2).split(".")[0] }}</text>
								<text
									class="price-symbol price-font">.{{ parseFloat(goodsSkuDetail.member_price).toFixed(2).split(".")[1] }}</text>
								<view class="member-price-wrap">
									<view class="img-wrap">
										<image :src="$util.img('public/uniapp/index/VIP.png')" mode="aspectFit"></image>
									</view>
									<text class="unit price-font">{{ $lang('common.currencySymbol') }}</text>
									<text class="money price-font">{{ goodsSkuDetail.price }}</text>
								</view>
							</template>
							<template v-else>
								<text
									class="price price-font">{{ parseFloat(goodsSkuDetail.price).toFixed(2).split(".")[0] }}</text>
								<text
									class="price-symbol price-font">.{{ parseFloat(goodsSkuDetail.price).toFixed(2).split(".")[1] }}</text>
							</template>
						</template>
						<view class="market-price-wrap" v-if="goodsSkuDetail.market_price_show">
							<text class="unit price-font"
								v-if="(showDiscount && goodsSkuDetail.price > 0) || goodsSkuDetail.market_price > 0">{{ $lang('common.currencySymbol') }}</text>
							<text class="money price-font"
								v-if="showDiscount && goodsSkuDetail.price > 0">{{ goodsSkuDetail.price }}</text>
							<text class="money price-font"
								v-else-if="goodsSkuDetail.market_price > 0">{{ goodsSkuDetail.market_price }}</text>
						</view>
						<view class="follow-and-share">
							<button class="share-btn" :plain="true" open-type="share">
								<text class="follow iconfont iconfenxiang"></text>
							</button>
							<!-- <text class="follow iconfont iconfenxiang" @click="openSharePopup()"></text> -->
							<!-- <text class="share iconfont" @click="editCollection()"
								:class="whetherCollection == 1 ? 'iconlikefill color-base-text' : 'iconguanzhu'"></text> -->
						</view>
					</view>
					<view class="goods-module-wrap info">
						<text class="sku-name-wrap">{{ goodsSkuDetail.goods_name }}</text>
						<text class="introduction "
							v-if="goodsSkuDetail.introduction">{{ goodsSkuDetail.introduction }}</text>
						<view class="logistics-wrap">
							<text v-if="goodsSkuDetail.stock_show">库存 {{ goodsSkuDetail.stock }}{{ goodsSkuDetail.unit }}</text>
							<text v-if="goodsSkuDetail.sale_show">销量 {{ goodsSkuDetail.sale_num }}{{ goodsSkuDetail.unit }}</text>
						</view>
					</view>
				</view>
			</template>
			<!-- 业务区域 -->
			<template v-slot:business>
				<!-- SKU选择 -->
				<ns-goods-sku v-if="goodsSkuDetail.goods_id" ref="goodsSku" @refresh="refreshGoodsSkuDetail"
					@levelInfo="refreshLevelInfo" :goods-id="goodsSkuDetail.goods_id" :goods-detail="goodsSkuDetail"
					:max-buy="goodsSkuDetail.max_buy" :min-buy="goodsSkuDetail.min_buy" @getSkuId="setSkuId">
				</ns-goods-sku>

				<!-- 组合套餐 -->
				<view v-if="bundling.length && bundling[0].bl_name && addonIsExist.bundling">
					<view @touchmove.prevent.stop>
						<uni-popup ref="bundlingPopup" type="bottom">
							<view class="bundling-popup-layer popup-layer">
								<view class="head-wrap" @click="closeBundlingPopup()">
									<text>组合套餐</text>
									<text class="iconfont iconclose"></text>
								</view>
								<scroll-view scroll-y class="bundling-body">
									<view class="bundling-view">
										<block v-for="(item, index) in bundling" :key="index">
											<view class="bundling-item">
												<view class="title" @click="toComoDetail(item.bl_id)">
													<text>{{ item.bl_name }}</text>
													<text class="iconfont iconright"></text>
												</view>
												<scroll-view scroll-x>
													<view class="goods-wrap">
														<view class="goods-item" @click="toGoodsDetail(skuId)">
															<view class="combo-img">
																<image
																	:src="$util.img(goodsSkuDetail.sku_image, { size: 'mid' })"
																	@error="imageError()" />
																<view class="price-wrap">
																	<text
																		class="unit price-font">{{ $lang('common.currencySymbol') }}</text>
																	<text
																		class="price price-font">{{ goodsSkuDetail.price }}</text>
																</view>
															</view>
															<text class="name">{{ goodsSkuDetail.goods_name }}</text>
														</view>
														<block v-for="(goods, goods_index) in item.bundling_goods"
															:key="goods_index">
															<template v-if="goods_index < 3">
																<view class="goods-item"
																	@click="toGoodsDetail(goods.sku_id)">
																	<view class="combo-img">
																		<image
																			:src="$util.img(goods.sku_image, { size: 'mid' })"
																			@error="bundlingImageError(index, goods_index)" />
																		<view class="price-wrap">
																			<text
																				class="unit price-font">{{ $lang('common.currencySymbol') }}</text>
																			<text
																				class="price price-font">{{ goods.price }}</text>
																		</view>
																	</view>
																	<text class="name">{{ goods.sku_name }}</text>
																</view>
															</template>
														</block>
													</view>
												</scroll-view>
												<view class="bundling-price-wrap">
													<text class="label">套餐价</text>
													<text
														class="unit price-color">{{ $lang('common.currencySymbol') }}</text>
													<text class="price price-color">{{ item.bl_price }}</text>
													<view class="card-btn" @click="toComoDetail(item.bl_id)">
														立即购买
													</view>
												</view>
											</view>
										</block>
									</view>

								</scroll-view>
							</view>
						</uni-popup>
					</view>
				</view>
			</template>

			<!-- 操作区域 -->
			<template v-slot:action>
				<!-- 商品底部导航 -->
				<ns-goods-action :safeArea="isIphoneX">
					<template v-if="goodsSkuDetail.goods_state == 1">
						<ns-goods-action-icon text="首页" icon="iconshouye1" @click="goHome" />
						<ns-goods-action-icon text="客服" icon="iconiconicon-kefu" :send-data="contactData"
							:chatParam="chatRoomParams" />
							<view class="goods-action-button">
							</view>
						<ns-goods-action-button class="goods-action-button"
							:backgroundColor="themeStyle.goods_detail.goods_btn_color"
							:textColor="themeStyle.btn_text_color" text="立即购买" @click="buyNow" />
					</template>
					<template v-else>
						<ns-goods-action-button class="goods-action-button active3" disabled-text="该商品已下架"
							:disabled="true" />
					</template>
				</ns-goods-action>
			</template>
		</goods-detail-view>
		<to-top v-if="showTop" @toTop="scrollToTopNative()"></to-top>
		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import nsGoodsAction from '@/components/ns-goods-action/ns-goods-action.vue';
	import nsGoodsActionIcon from '@/components/ns-goods-action-icon/ns-goods-action-icon.vue';
	import nsGoodsActionButton from '@/components/ns-goods-action-button/ns-goods-action-button.vue';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import nsGoodsSku from '@/components/ns-goods-sku/ns-goods-sku.vue';
	import uniCountDown from '@/components/uni-count-down/uni-count-down.vue';
	import detail from '../public/js/detail.js';
	import scroll from '@/common/js/scroll-view.js';
	import toTop from '@/components/toTop/toTop.vue';
	import nsFenxiaoGoodsDetail from '@/components/ns-fenxiao-goods-detail/ns-fenxiao-goods-detail.vue';
	import goodsDetailBase from '@/common/js/goods_detail_base.js';
	export default {
		components: {
			nsGoodsAction,
			nsGoodsActionIcon,
			nsGoodsActionButton,
			uniPopup,
			nsGoodsSku,
			uniCountDown,
			nsFenxiaoGoodsDetail,
			toTop
		},
		mixins: [goodsDetailBase, detail, scroll]
	};
</script>
<style lang="scss">
	@import '@/common/css/goods_detail.scss';
	@import '../public/css/detail.scss';
</style>
<style scoped>
	.goods-action-button {
		background: #1189F4 !important;
		color: #FFFFFF;
		border-radius: 90rpx !important;
		overflow: hidden;
	}
	.share-btn {
		margin: 0;
		padding: 0;
		border: none;
		line-height: 1;
		height: auto;
	}

	/deep/ .action-icon-wrap .iconfont.iconshouye1 {
		font-size: 40rpx;
	}

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

	.poster-layer>>>.uni-popup__wrapper-box {
		max-height: initial !important;
	}

	/deep/ .sku-layer .uni-popup__wrapper-box {
		overflow-y: initial !important;
	}

	.goods-promotion .countdown .clockrun>>>.uni-countdown__number {
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

	.goods-promotion .countdown .clockrun>>>.uni-countdown__splitor {
		width: 10rpx;
		height: 32rpx;
		line-height: 36rpx;
		text-align: center;
	}

	.goods-promotion .countdown .clockrun>>>.uni-countdown__splitor.day {
		width: initial;
	}

	/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
		max-height: unset !important;
	}

	/deep/ .goods-action-button.active1 {
		padding-left: 20rpx;
	}

	/deep/ .goods-action-button.active2 {
		padding-right: 20rpx;
	}

	/deep/ .goods-action-button.active3 {
		padding: 0 10px;
	}

	/deep/ .goods-action-button.active4 {
		padding: 0 10px;
	}

	/deep/ .uni-popup__wrapper.bottom {
		border-radius: 24rpx 24rpx 0 0;
	}

	/deep/ .goods-action-button.active1 .action-buttom-wrap {
		height: 72rpx;
		line-height: 72rpx;
	}

	/deep/ .goods-action-button.active2 .action-buttom-wrap {
		height: 72rpx;
		line-height: 72rpx;
	}

	/deep/ .goods-action-button.active3 .action-buttom-wrap {
		height: 72rpx;
		line-height: 72rpx;
		margin: 20rpx 0;
	}

	/deep/ .goods-action-button.active4 .action-buttom-wrap {
		height: 72rpx;
		line-height: 72rpx;
	}
</style>
