<template>
	<view>
		<view scroll-y="true" class="goods-detail" :class="isIphoneX ? 'active' : ''">
			<view class="goods-container">
				<!-- 商品媒体信息 -->
				<view class="goods-media">
					<!-- 商品图片 -->
					<view class="goods-img" :class="{ show: switchMedia == 'img' }">
						<swiper class="swiper" @change="swiperChange" :interval="swiperInterval" :autoplay="swiperAutoplay" autoplay="true" interval="4000" circular="true">
							<swiper-item v-for="(item, index) in goodsSkuDetail.sku_images" :key="index" :item-id="'goods_id_' + index">
								<view class="item" @click="previewMedia(index)">
									<image :src="$util.img(item, { size: 'big' })" @error="swiperImageError(index)" mode="aspectFit" />
								</view>
							</swiper-item>
						</swiper>
						<view class="img-indicator-dots">
							<text>{{ swiperCurrent }}</text>
							<text v-if="goodsSkuDetail.sku_images">/{{ goodsSkuDetail.sku_images.length }}</text>
						</view>
					</view>

					<!-- 商品视频 -->
					<view class="goods-video" :class="{ show: switchMedia == 'video' }">
						<video id="goodsVideo" :src="$util.img(goodsSkuDetail.video_url)" :poster="$util.img(goodsSkuDetail.sku_image, { size: 'big' })" objectFit="cover"></video>
					</view>

					<!-- 切换视频、图片 -->
					<view class="media-mode" v-if="goodsSkuDetail.video_url != ''">
						<text :class="{ 'color-base-bg': switchMedia == 'video' }" @click="switchMedia = 'video'">{{ $lang('video') }}</text>
						<text :class="{ 'color-base-bg': switchMedia == 'img' }" @click="(switchMedia = 'img'), videoContext.pause()">{{ $lang('image') }}</text>
					</view>
				</view>

				<!-- 价格区域 -->
				<view class="goods-gression">
					<slot name="price"></slot>
				</view>

				<view class="newdetail margin-bottom">
					<!-- 入口区域 -->
					<slot name="entrance"></slot>

					<view class="item goods-attribute" @click="openAttributePopup()" v-if="goodsSkuDetail.goods_attr_format && goodsSkuDetail.goods_attr_format.length > 0">
						<view class="label">属性</view>
						<view class="box">
							<text v-for="(item, index) in goodsSkuDetail.goods_attr_format" :key="index" v-if="index < 2">{{ item.attr_name }}: {{ item.attr_value_name }}</text>
						</view>
						<text class="iconfont iconright"></text>
						<!-- <view class="img-wrap"><image :src="$util.img('public/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
					</view>
					<view class="item service" @click="openMerchantsServicePopup()" v-if="goodsSkuDetail.goods_service.length">
						<view class="label">服务</view>
						<view class="list-wrap">
							<view class="item-wrap" v-for="(item, index) in goodsSkuDetail.goods_service" :key="index" v-if="index < 3">
								<view class="item-wrap-box">
									<view class="item-wrap-icon">
										<text class="iconfont icondui" v-if="!item.icon || (!item.icon.imageUrl && !item.icon.icon)"></text>
										<image class="icon-img" v-else-if="item.icon.iconType == 'img'" :src=" $util.img(item.icon.imageUrl)" />
										<diy-icon class="icon-box" v-else-if="item.icon.iconType == 'icon'" :icon="item.icon.icon" :value="item.icon.style ? item.icon.style : null"></diy-icon>
									</view>
									<text>{{ item.service_name }}</text>
								</view>
							</view>
						</view>
						<text class="iconfont iconright"></text>
						<!-- <view class="img-wrap"><image :src="$util.img('public/uniapp/goods/detail_more.png')" mode="aspectFit" /></view> -->
					</view>
				</view>

				<!-- 商品属性 -->
				<view @touchmove.prevent.stop>
					<uni-popup ref="attributePopup" type="bottom">
						<view class="goods-attribute-popup-layer popup-layer">
							<view class="head-wrap" @click="closeAttributePopup()">
								<text>商品属性</text>
								<text class="iconfont iconclose"></text>
							</view>
							<scroll-view scroll-y class="goods-attribute-body">
								<view class="item" v-for="(item, index) in goodsSkuDetail.goods_attr_format" :key="index">
									<text class="attr-name">{{ item.attr_name }}</text>
									<text class="value-name">{{ item.attr_value_name }}</text>
								</view>
							</scroll-view>
							<view class="button-box"><button type="primary" @click="closeAttributePopup()">确定</button></view>
						</view>
					</uni-popup>
				</view>

				<!-- 商品服务 -->
				<view @touchmove.prevent.stop>
					<uni-popup ref="merchantsServicePopup" type="bottom">
						<view class="goods-merchants-service-popup-layer popup-layer">
							<view class="head-wrap" @click="closeMerchantsServicePopup()">
								<text>商品服务</text>
								<text class="iconfont iconclose"></text>
							</view>
							<scroll-view scroll-y>
								<view class="item" :class="{ 'empty-desc': !item.desc }" v-for="(item, index) in goodsSkuDetail.goods_service" :key="index">
									<view class="item-icon" :class="{'empty-desc':!item.desc}">
										<text class="iconfont icondui color-base-text" v-if="!item.icon || (!item.icon.imageUrl && !item.icon.icon)"></text>
										<image class="icon-img" v-else-if="item.icon.iconType == 'img'" :src=" $util.img(item.icon.imageUrl)" />
										<diy-icon class="icon-box" v-else-if="item.icon.iconType == 'icon'" :icon="item.icon.icon" :value="item.icon.style ? item.icon.style : null"></diy-icon>
									</view>
									<view class="info-wrap">
										<text class="title">{{ item.service_name }}</text>
										<text class="describe" v-if="item.desc">{{ item.desc }}</text>
									</view>
								</view>
							</scroll-view>
							<view class="button-box"><button type="primary" @click="closeMerchantsServicePopup()">确定</button></view>
						</view>
					</uni-popup>
				</view>

				<!-- 业务区域 -->
				<slot name="business"></slot>

				<view class="detail-community" v-if="goodsSkuDetail.qr_data && goodsSkuDetail.qr_data.qr_state == 1">
					<view class="community-box">
						<image :src="$util.img('public/uniapp/goods/detail_erweiImage.png')" mode="aspectFill"></image>
						<view class="community-content">
							<view class="community-title">{{ goodsSkuDetail.qr_data.qr_name }}</view>
							<view class="community-txt">{{ goodsSkuDetail.qr_data.community_describe }}</view>
						</view>
					</view>
					<view class="community-btn" @click="onCommunity()">添加</view>
				</view>

				<!-- 促销 -->
				<view class="community-model" @touchmove.prevent.stop @click.stop="onCloseCommunity()" v-show="isCommunity">
					<view class="community-model-content" @click.stop>
						<view class="community-model-content-radius"><view>添加社群</view></view>
						<view class="community-model-content-draw" v-if="goodsSkuDetail.qr_data && goodsSkuDetail.qr_data.qr_img">
							<image
								:src="
									goodsSkuDetail.qr_data.qr_img != '' && goodsSkuDetail.qr_data.qr_state == 1
										? $util.img(goodsSkuDetail.qr_data.qr_img)
										: $util.img('public/uniapp/goods/detail_erweiImage.png')
								"
								mode="aspectFill"
								show-menu-by-longpress="true"
							></image>
						</view>
						<view class="community-model-content-text">长按识别二维码，添加社群</view>
					</view>
					<view class="community-model-close" @click.stop="onCloseCommunity()"><text class="iconfont iconclose"></text></view>
				</view>


				<!-- 参与流程 -->
				<slot name="articipation"></slot>

				<!-- 商品评价 -->
				<view class="group-wrap" v-if="evaluateConfig.evaluate_show == 1">
					<view class="goods-evaluate" @click="toEvaluateDetail(goodsSkuDetail.goods_id)">
						<view class="tit">
							<!-- <view class="tit" :class="{ active: goodsEvaluate.content }"> -->
							<view>
								<text class="color-title font-size-base">
									评价
									<text class="font-size-base">({{ goodsSkuDetail.evaluate }})</text>
								</text>
								<text class="evaluate-item-empty" v-if="!goodsSkuDetail.evaluate">暂无评价</text>
								<view class="evaluate-item-empty" v-else>
									<text class="font-size-tag">查看全部</text>
									<text class="iconfont iconright font-size-tag"></text>
								</view>
							</view>
						</view>
						<view class="evaluate-item" v-for="(item, index) in goodsEvaluate" :key="index" v-if="item.content">
							<view class="evaluator">
								<view class="evaluator-info">
									<view class="evaluator-face">
										<image
											v-if="item.member_headimg"
											:src="$util.img(item.member_headimg)"
											@error="item.member_headimg = $util.getDefaultImage().head"
											mode="aspectFill"
										/>
										<image
											v-else
											:src="$util.getDefaultImage().head"
											@error="item.member_headimg = $util.getDefaultImage().head"
											mode="aspectFill"
										/>
									</view>
									<view class="evaluator-name-wrap">
										<text class="evaluator-name using-hidden" v-if="item.member_name.length > 2 && item.is_anonymous == 1">
											{{ item.member_name[0] }}***{{ item.member_name[item.member_name.length - 1] }}
										</text>
										<text class="evaluator-name using-hidden" v-else>{{ item.member_name }}</text>
										<view v-if="item.scores" class="evaluator-xing"><xiaoStarComponent :starCount="item.scores * 2"></xiaoStarComponent></view>
									</view>
								</view>
								<text class="time color-tip">{{ $util.timeStampTurnTime(item.create_time) }}</text>
							</view>
							<view class="cont margin-top">{{ item.content }}</view>
							<scroll-view scroll-x="true">
								<view class="evaluate-img" v-if="item.images">
									<view class="img-box" v-for="(img, img_index) in item.images" :key="img_index" @click="previewEvaluate(index, img_index, 'images')">
										<image :src="$util.img(img)" mode="aspectFill" />
									</view>
								</view>
							</scroll-view>
						</view>
					</view>
				</view>

				<!-- 详情 -->
				<view class="goods-detail-tab">
					<view class="detail-tab">
						<!-- <view class="tab-line"></view> -->
						<view class="tab-item">商品详情</view>
						<!-- <view class="tab-line"></view> -->
						<!-- <view v-if="service.is_display == 1" class="tab-item" :class="detailTab == 1 ? 'active color-base-text' : ''" @click="detailTab = 1">售后保障</view> -->
					</view>

					<view class="detail-content active" >
						<view class="detail-content-item">
							<view class="goods-details" v-if="goodsSkuDetail.goods_content">
								<rich-text :nodes="$util.richText(goodsSkuDetail.goods_content)" @click="showImg($event)" :data-nodes="goodsSkuDetail.goods_content"></rich-text>
							</view>
							<view class="goods-details active" v-else>该商家暂无上传相关详情哦！</view>
						</view>
					<!-- 	<block v-if="service">
							<view class="detail-content-item" v-show="detailTab == 1 && service.is_display == 1">
								<view class="goods-details" v-if="service.content">
									<rich-text :nodes="service.content" @click="showImg($event)" :data-nodes="service.content"></rich-text>
								</view>
								<view class="goods-details active" v-else>该商品暂无相关售后哦！</view>
							</view>
						</block> -->
					</view>
				</view>

				<!-- 商品推荐 -->
				<ns-goods-recommend ref="goodrecommend" route="goodsdetail"></ns-goods-recommend>
				
				<ns-copyright></ns-copyright>
				
				<!-- 海报 -->
				<view @touchmove.prevent.stop>
					<uni-popup ref="posterPopup" type="bottom" class="poster-layer">
						<template v-if="poster != '-1'">
							<view>
								<view class="image-wrap"><image :src="$util.img(poster)" :show-menu-by-longpress="true" /></view>
								<!-- #ifdef MP || APP-PLUS  -->
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
								<!-- #ifdef MP -->
								<view class="share-box">
									<button class="share-btn" :plain="true" open-type="share">
										<view class="iconfont iconiconfenxianggeihaoyou"></view>
										<text>分享给好友</text>
									</button>
								</view>
								<!-- #endif -->

								<!-- #ifdef MP-WEIXIN -->
								<view class="share-box" v-if="goodsCircle">
									<button class="share-btn" :plain="true" @click="openBusinessView">
										<view class="iconfont iconhaowuquan"></view>
										<text>分享到好物圈</text>
									</button>
								</view>
								<!-- #endif -->

								<view class="share-box" @click="openPosterPopup">
									<button class="share-btn" :plain="true">
										<view class="iconfont iconpengyouquan"></view>
										<text>生成分享海报</text>
									</button>
								</view>
								<!-- #ifdef H5 -->
								<view class="share-box" @click="copyUrl">
									<button class="share-btn" :plain="true">
										<view class="iconfont iconfuzhilianjie"></view>
										<text>复制链接</text>
									</button>
								</view>
								<!-- #endif -->
							</view>
							<view class="share-footer" @click="closeSharePopup"><text>取消分享</text></view>
						</view>
					</uni-popup>
				</view>
				
				<slot name="fixedbtn"></slot>
			</view>
		</view>

		<!-- 操作区域 -->
		<slot name="action"></slot>
		<to-top v-if="showTop" @toTop="scrollToTopNative()"></to-top>
		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
import xiaoStarComponent from '@/components/xiao-star-component/xiao-star-component.vue';
// 商品详情视图
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import nsGoodsRecommend from '@/components/ns-goods-recommend/ns-goods-recommend.vue';
import scroll from '@/common/js/scroll-view.js';
import toTop from '@/components/toTop/toTop.vue';
import goodsDetailBase from '@/common/js/goods_detail_base.js';

import detail from './detail.js';

export default {
	name: 'goods-detail-view',
	props: {
		goodsSkuDetail: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	components: {
		uniPopup,
		nsGoodsRecommend,
		xiaoStarComponent,
		toTop
	},
	mixins: [scroll, detail]
};
</script>

<style lang="scss">
@import '@/common/css/goods_detail.scss';
</style>
<style scoped></style>
