<template>
	<view :data-theme="themeStyle">
		<view scroll-y="true" class="goods-detail" ref="goodsDetailView" :class="isIphoneX ? 'active' : ''">
			<view class="goods-container">
				<!-- 商品媒体信息 -->
				<view class="goods-medias">
					<!-- 商品图片 -->
					<view class="goods-img" :class="{ show: switchMedia == 'img' }">
						<swiper class="swiper" @change="swiperChange" :interval="swiperInterval"
							:autoplay="swiperAutoplay">
							<swiper-item v-for="(item, index) in goodsSkuDetail.sku_images" :key="index"
								:item-id="'goods_id_' + index">
								<view class="item" @click="previewMedia(index)">
									<image :src="item" mode="scaleToFill" />
								</view>
							</swiper-item>
						</swiper>
						<view class="img-indicator-dots">
							{{goodsSkuDetail.card_sname}}
						</view>
					</view>
				</view>
				<view class="card-header">
					<view class="card-item">
						<view class="card-price">
							<text style="font-size: 16px;">￥</text>{{goodsSkuDetail.card_price}}
						</view>
						<button class="share-btn" :plain="true" open-type="share">
							<img  class='card-share' src="@/common/img/shareIcon.png" alt=""
								mode="aspectFill" />
						</button>
						<!-- <img @click="openSharePopup()" class='card-share' src="@/common/img/shareIcon.png" alt=""
							mode="aspectFill" /> -->
					</view>
					<view class="card-item">
						<view class="card-name">
							{{goodsSkuDetail.card_name}}
						</view>
						<view class="card-sale_num">
							销量：{{goodsSkuDetail.sale_num}}
						</view>
					</view>

				</view>
				<view class="content-titlebox">
					<view class="title-left">
					</view>
					<view class="content-title">
						商品详情
					</view>
					<view class="title-right">

					</view>
				</view>
				<!-- 详情 -->
				<view class="card-content">
					<view class="card-content" v-if="goodsSkuDetail.desc">
						<rich-text :nodes="$util.richText(goodsSkuDetail.desc)"></rich-text>
					</view>
				</view>
				<!-- 海报 -->
				<view @touchmove.prevent.stop>
					<uni-popup ref="posterPopup" type="bottom" class="poster-layer">
						<template v-if="poster != '-1'">
							<view :style="{ height: posterHeight > 0 ? posterHeight + 80 + 'px' : '' }">
								<view class="image-wrap">
									<image :src="$util.img(poster)"
										:style="{ height: posterHeight > 0 ? posterHeight + 'px' : '' }" />
								</view>
								<!-- #ifdef MP -->
								<view class="save" @click="saveGoodsPoster()">保存图片</view>
								<!-- #endif -->
								<!-- #ifdef H5 -->
								<view class="save">长按保存图片</view>
								<!-- #endif -->
							</view>
							<view class="close iconfont iconclose" @click="closePosterPopup()"></view>
						</template>
						<view v-else class="msg">{{ posterMsg }}</view>
					</uni-popup>
				</view>

				<!-- 分享弹窗 -->
				<view @touchmove.prevent.stop>
					<uni-popup ref="sharePopup" type="bottom" class="share-popup">
						<view>
							<view class="share-title">分享</view>
							<view class="share-content">
								<view class="share-box">
									<button class="share-btn" :plain="true" open-type="share">
										<view class="iconfont iconiconfenxianggeihaoyou"></view>
										<text>分享给好友</text>
									</button>
								</view>
								<view class="share-box" @click="openPosterPopup">
									<button class="share-btn" :plain="true">
										<view class="iconfont iconpengyouquan"></view>
										<text>生成分享海报</text>
									</button>
								</view>
							</view>
							<view class="share-footer" @click="closeSharePopup"><text>取消分享</text></view>
						</view>
					</uni-popup>
				</view>
			</view>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>

		<!-- 商品底部导航 -->
		<ns-goods-action :safeArea="isIphoneX">
			<template>
				<ns-goods-action-icon text="首页" icon="iconshouye1" @click="goHome" />
				<ns-goods-action-icon text="客服" icon="iconkefu1" open-type="contact" :send-data="contactData" />
				<block>
					<view class="goods-action-button active4" @click="buyNow">立即购买</view>
				</block>
			</template>
		</ns-goods-action>
		<to-top v-if="showTop" @toTop="scrollToTopNative()"></to-top>
	</view>
</template>

<script>
	import nsGoodsAction from '@/components/ns-goods-action/ns-goods-action.vue';
	import nsGoodsActionIcon from '@/components/ns-goods-action-icon/ns-goods-action-icon.vue';

	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import detail from '../public/js/detail.js';
	import scroll from '@/common/js/scroll-view.js';
	import globalConfig from '@/common/js/golbalConfig.js';
	import toTop from '@/components/toTop/toTop.vue';
	export default {
		components: {
			nsGoodsAction,
			nsGoodsActionIcon,
			uniPopup,
			toTop
		},
		data() {
			return {
				kefuConfig: {
					weapp: '',
					system: '',
					open: '',
					open_url: ''
				}
			};
		},
		mixins: [detail, scroll, globalConfig],
	};
</script>
<style lang="scss">
	@import '@/common/css/goods_detail.scss';
</style>
<style scoped lang="scss">
	.share-btn {
		margin: 0;
		padding: 0;
		border: none;
		line-height: 1;
		height: auto;
	}
	
	.card-header {
		width: 100%;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 0px;
		padding-top: 10px;
		padding-bottom: 15px;
		padding-left: 40rpx;
		padding-right: 40rpx;
		box-sizing: border-box;
	}

	.card-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.card-price {
		font-size: 18px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FA5D34;
		opacity: 1;
		line-height: initial;
	}

	.card-share {
		width: 28px;
		height: 28px;
	}

	.card-name {
		width: 200px;
		font-size: 20px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		line-height: initial;
	}

	.card-sale_num {
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #AFAFAF;
		opacity: 1;
	}

	// 商品媒体信息
	.goods-medias {
		width: 750rpx;
		position: relative;
		overflow: hidden;

		.goods-img {
			height: 476rpx;
			width: 100%;
			position: relative;
		}

		.goods-img .swiper {
			width: 100%;
			height: 100%;

			.item {
				width: 100%;
				height: 100%;
			}

			image {
				width: 100%;
				height: 100%;
			}
		}

		.goods-img .img-indicator-dots {
			position: absolute;
			z-index: 5;
			bottom: 0rpx;
			right: 0rpx;
			height: 33px;
			background: #1189F4;
			opacity: 1;
			border-radius: 21px 0px 0px 21px;
			padding-left: 20rpx;
			padding-right: 20rpx;
			box-sizing: border-box;
			font-size: 14px;
			font-weight: 400;
			color: #FFFFFF;
			opacity: 1;
			line-height: 33px;
		}
	}

	.content-titlebox {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-top: 25px;

		.title-left {
			width: 44px;
			height: 1px;
			background: linear-gradient(90deg, rgba(242, 242, 242, 0) 0%, #D5D5D5 100%);
			opacity: 1;
			border-radius: 0px;
		}

		.content-title {
			font-size: 14px;
			font-family: PingFang SC;
			font-weight: 400;
			color: #B5B5B5;
			opacity: 1;
			margin-left: 10px;
			margin-right: 10px;
		}

		.title-right {
			width: 44px;
			height: 1px;
			background: linear-gradient(270deg, rgba(242, 242, 242, 0) 0%, #D5D5D5 100%);
			opacity: 1;
			border-radius: 0px;
		}
	}

	.card-content {
		width: 100%;
		// background: #fff;
		margin-top: 12px;
		padding-bottom: 90rpx;
		// padding-left: 20rpx;
		// padding-right: 20rpx;
		box-sizing: border-box;
		.active {
			text-align: center;
		}
	}

	.goods-action-button {
		width: 223px;
		height: 35px;
		background: #1189F4;
		opacity: 1;
		border-radius: 22px;
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 35px;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
	}
</style>
