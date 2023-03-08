<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<goods-detail-view :goodsSkuDetail="goodsSkuDetail" ref="goodsDetailView">
			<!-- 价格区域 -->
			<template v-slot:price>
				<view v-if="goodsSkuDetail.timeMachine" class="goods-promotion">
					<view class="price-info">
						<view class="icon-box"><text class="iconfont iconpintuan2"></text></view>

						<view class="price-box">
							<view class="promotion-text">拼团优惠</view>
							<view class="sale-num">
								<view class="pintuan-num">
									{{ goodsSkuDetail[goodsSkuDetail.pintuan_num_field] }}人团
								</view>
								<view v-if="goodsSkuDetail.sale_show">
									已成团{{ goodsSkuDetail.order_num }}{{ goodsSkuDetail.unit }}</view>
							</view>
						</view>

					</view>
					<view class="countdown">
						<view class="txt">距结束仅剩</view>
						<view class="clockrun">
							<uni-count-down :day="goodsSkuDetail.timeMachine.d" :hour="goodsSkuDetail.timeMachine.h"
								:minute="goodsSkuDetail.timeMachine.i" :second="goodsSkuDetail.timeMachine.s"
								splitorColor="#ffffff" backgroundColor="#ffffff" />
						</view>
					</view>
				</view>

				<view class="group-wrap padding-top">
					<view class="goods-module-wrap">
						<text class="promotion-tag ">拼团价</text>
						<text class="price-symbol price-font">{{ $lang('common.currencySymbol') }}</text>
						<text
							class="price price-font">{{ parseFloat(pintuanPirce(goodsSkuDetail)).toFixed(2).split(".")[0] }}</text>
						<text
							class="price-symbol price-font">.{{ parseFloat(pintuanPirce(goodsSkuDetail)).toFixed(2).split(".")[1] }}</text>

						<view class="market-price-wrap" v-if="goodsSkuDetail.price > 0">
							<text class="unit price-font">{{ $lang('common.currencySymbol') }}</text>
							<text class="money price-font">{{ goodsSkuDetail.price }}</text>
						</view>
						<view class="follow-and-share">
							<button class="share-btn" :plain="true" open-type="share">
								<text class="follow iconfont iconfenxiang"></text>
							</button>
							<!-- <text class="follow iconfont iconfenxiang" @click="openSharePopup()"></text> -->
							<!-- <text class="share iconfont" @click="editCollection()" :class="whetherCollection == 1 ? 'iconlikefill color-base-text' : 'iconguanzhu'"></text> -->
						</view>
					</view>
					<view class="goods-module-wrap promotion-price-wrap"
						v-if="goodsSkuDetail.pintuan_type == 'ordinary' && goodsSkuDetail.is_promotion == 1">
						<text class="label ">团长价</text>
						<text class="price-symbol price-font">{{ $lang('common.currencySymbol') }}</text>
						<text class="price price-font">{{ goodsSkuDetail.promotion_price }}</text>
					</view>
					<view class="goods-module-wrap info">
						<text class="sku-name-wrap">{{ goodsSkuDetail.goods_name }}</text>
						<text class="introduction "
							v-if="goodsSkuDetail.introduction">{{ goodsSkuDetail.introduction }}</text>
						<view class="logistics-wrap">
							<block v-if="!goodsSkuDetail.is_virtual">
								<text v-if="goodsSkuDetail.is_free_shipping">快递 包邮</text>
								<text v-else>快递 买家承担</text>
							</block>
							<!-- <text>销量 {{ goodsSkuDetail.order_num }} {{ goodsSkuDetail.unit }}</text> -->

							<text v-if="goodsSkuDetail.stock_show">库存 {{ goodsSkuDetail.stock }}{{ goodsSkuDetail.unit }}</text>
							<text v-if="goodsSkuDetail.sale_show">销量 {{ goodsSkuDetail.sale_num }}{{ goodsSkuDetail.unit }}</text>
						</view>
					</view>
				</view>
				<view class="group-wrap swiper" v-if="newList.length > 0 && !groupId">
					<!-- 已有拼团块 -->
					<swiper vertical="true" autoplay="true" interval="5000" class="spelling-block">
						<swiper-item v-for="(item, index) in newList" :key="index">
							<view class="item" v-if="item.end_time > timestamp">
								<view class="user-logo">
									<image :src="item.headimg ? $util.img(item.headimg) : $util.getDefaultImage().head"
										@error="pintuanImageError(index)" mode="aspectFill" />
								</view>
								<text class="user-name" v-if="item.nickname">{{ item.nickname }}</text>
								<view class="info">
									<template v-if="item.timeMachine">
										<view class="tip">
											还差
											<text
												class="color-base-text">{{ item.pintuan_num - item.pintuan_count }}人</text>
											拼成
										</view>
										<text class="color-tip font-size-activity-tag">剩余</text>
										<uni-count-down :day="item.timeMachine.d" :hour="item.timeMachine.h"
											:minute="item.timeMachine.i" :second="item.timeMachine.s" color="#909399"
											splitorColor="#909399 !important" background-color="transparent"
											borderColor="transparent" />
									</template>
								</view>

								<template v-if="item.timeMachine">
									<button type="primary" size="mini"
										@click="openPinTuan(item.group_id, item.pintuan_num - item.pintuan_count, item.end_time - item.currentTime, item.headimg, item.head_id)">
										去拼单
									</button>
								</template>
								<template v-else>
									<button disabled size="mini">已结束</button>
								</template>
							</view>
						</swiper-item>
					</swiper>
					<view @touchmove.prevent.stop>
						<uni-popup ref="pintuanPopup" type="center" class="pintuan-popup-layer">
							<view class="layer">
								<view class="title">参与的拼单</view>
								<view class="info" v-if="currentPintuan">
									仅剩
									<text class="color-base-text">{{ currentPintuan.pintuan_num }}</text>
									个名额，
									<uni-count-down v-if="openPopup" :day="currentPintuan.timeMachine.d"
										:hour="currentPintuan.timeMachine.h" :minute="currentPintuan.timeMachine.i"
										:second="currentPintuan.timeMachine.s" color="#333" splitorColor="#333"
										background-color="transparent" borderColor="transparent" />
									<text>后结束</text>
								</view>
								<image class="mask-layer-spelling-close"
									:src="$util.img('public/uniapp/goods/mask_layer_pintuan_close.png')"
									@click="closePinTuanPopup()" />
								<view class="user-list">
									<scroll-view scroll-x class="imgX">
										<view class="item">
											<text class="boss color-base-bg">拼主</text>
											<image
												:src="currentPintuan.headimg != '' ? $util.img(currentPintuan.headimg) : $util.getDefaultImage().head"
												@error="currentPintuan.headimg = $util.getDefaultImage().head"
												mode="aspectFill" />
										</view>
										<view class="item">
											<image :src="$util.img('public/uniapp/common/spelling_who.png')" />
										</view>
									</scroll-view>
								</view>
								<button type="primary" @click="joinPintuan()">参与拼单</button>
							</view>
						</uni-popup>
					</view>
				</view>
			</template>

			<!-- 入口区域 -->
			<template v-slot:entrance>
			<!-- 	<view class="item delivery-type" v-if="goodsSkuDetail.is_virtual == 0"
					@click="$refs.deliveryType.open()">
					<view class="label">配送</view>
					<block v-if="deliveryType">
						<view class="box">
							<block v-for="(item, index) in deliveryType" :key="index">
								<text
									v-if="goodsSkuDetail.support_trade_type.indexOf(index) != -1">{{ item.name }}</text>
							</block>
						</view>
						<text class="iconfont iconright"></text>
					</block>
					<block v-else>
						<view class="box">
							商家未配置配送方式
						</view>
					</block>
				</view> -->
				<!-- 已选规格 -->
				<view class="item selected-sku-spec" v-if="goodsSkuDetail.sku_spec_format" @click="pintuan">
					<view class="label">选择</view>
					<view class="box">
						<text v-for="(item, index) in goodsSkuDetail.sku_spec_format"
							:key="index">{{ item.spec_name }}/{{ item.spec_value_name }}</text>
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
								<view class="type-item"
									:class="{'not-support': goodsSkuDetail.support_trade_type.indexOf(index) == -1}">
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
				<!-- SKU选择 -->
				<ns-goods-sku v-if="goodsSkuDetail.goods_id" ref="goodsSku" @hideSkuPop="refreshPintuan"
					@refresh="refreshGoodsSkuDetail" :goods-id="goodsSkuDetail.goods_id" :goodsDetail="goodsSkuDetail">
				</ns-goods-sku>
			</template>

			<!-- 参与流程 -->
			<template v-slot:articipation>
				<view class="diy-process-step">
					<view class="goods-img-content">参与流程</view>
					<view class="process-step-box">
						<view class="process-step-item">
							<view class="process-step-icon"><text class="iconfont icondingdan4"></text></view>
							<view class="process-step-content">
								<view>1、购买开团</view>
								<view>点击右下角拼团购买，成功即开团</view>
							</view>
						</view>
						<view class="process-step-line">
							<view></view>
						</view>
						<view class="process-step-item">
							<view class="process-step-icon"><text class="iconfont iconyaoqinghaoyou"></text></view>
							<view class="process-step-content">
								<view>2、邀请好友拼团</view>
								<view>邀请好友一起来参加你的拼团</view>
							</view>
						</view>

						<view class="process-step-line">
							<view></view>
						</view>
						<view class="process-step-item">
							<view class="process-step-icon"><text class="iconfont iconchenggong"></text></view>
							<view class="process-step-content">
								<view>3、拼团成功</view>
								<view>有效期内达到拼团人数即拼团成功</view>
							</view>
						</view>
					</view>
				</view>

			</template>

			<!-- 操作区域 -->
			<template v-slot:action>
				<!-- 商品底部导航 -->
				<ns-goods-action :safeArea="isIphoneX">
					<template v-if="goodsSkuDetail.goods_state == 1">

						<!-- 拼团弹层 -->
						<view class="mask" v-if="pintuanPopShow" @click="pintuanPopShow = false"></view>

						<view class="pintuan-pop" v-if="pintuanPopShow && groupDetail">
							<block v-if="groupDetail.status == 2">
								<view class="pintuan-pop-head">
									<view class="pintuan-headimg">
										<image
											:src="$util.img(groupDetail.headimg || 'public/uniapp/default_img/head.png')">
										</image>
									</view>
									<view class="pintuan-txt">
										<text>{{ cutStrByte(groupDetail.nickname, 8) || '好友' }}</text>
										邀请你加入TA的团
									</view>
								</view>
								<view class="pintuan-pop-time">
									仅剩
									<text>{{ parseInt(groupDetail.pintuan_num - groupDetail.pintuan_count) }}</text>
									个名额，距结束
									<uni-count-down :day="groupDetail.timeMachine.d" :hour="groupDetail.timeMachine.h"
										:minute="groupDetail.timeMachine.i" :second="groupDetail.timeMachine.s"
										color="#FFF" splitorColor="#000000" backgroundColor="#000000" />
								</view>

								<view class="pintuan-pop-member" v-if="groupDetail.pintuan_num <= 5">
									<view class="member-item" v-for="(item, index) in groupDetail.member_list">
										<image
											:src="item.member_img ? $util.img(item.member_img) : $util.img('public/uniapp/default_img/head.png')">
										</image>
										<view v-if="item.member_id == groupDetail.head_id"
											:style="{ background: themeStyle.main_color }">
											<image class="pintuan-text" mode="widthFix"
												:src="$util.img('public/uniapp/pintuan/icon-tuanzhang.png')"></image>
										</view>
									</view>
									<view v-for="item in parseInt(groupDetail.pintuan_num - groupDetail.pintuan_count)"
										class="member-item icon"><text class="iconfont iconadd1"></text></view>
								</view>
								<view class="pintuan-pop-member more" v-else>
									<view class="member-item-box">
										<view class="member-item" v-for="(item, index) in groupDetail.member_list"
											v-if="index < 5">
											<image
												:src="item.member_img ? $util.img(item.member_img) : $util.img('public/uniapp/default_img/head.png')">
											</image>
											<view v-if="item.member_id == groupDetail.head_id"
												:style="{ background: themeStyle.main_color }">
												<image class="pintuan-text" mode="widthFix"
													:src="$util.img('public/uniapp/pintuan/icon-tuanzhang.png')">
												</image>
											</view>
										</view>
										<view class="member-item icon"><text class="iconfont iconcaidan"></text></view>
									</view>
									<view class="member-item icon"><text class="iconfont iconadd1"></text></view>
								</view>
							</block>
							<block v-else>
								<view class="pintuan-pop-head">
									<view class="pintuan-headimg">
										<image
											:src="$util.img(groupDetail.headimg || 'public/uniapp/default_img/head.png')">
										</image>
									</view>
									<view class="pintuan-txt">
										<text>{{ cutStrByte(groupDetail.nickname, 8) || '好友' }}</text>
										的团 {{ groupDetail.status == '1' ? '已关闭' : '已完成' }}
									</view>
								</view>

								<view class="pintuan-pop-time">非常抱歉，您来晚了一步~</view>

								<view class="pintuan-pop-member txt">
									<view class="pintuan-member-right">点击下方开团</view>
									<view class="pintuan-member-left">
										<image :src="$util.img('public/uniapp/pintuan/pintuan-down.png')"
											mode="widthFix"></image>
									</view>
								</view>
							</block>
						</view>


						<ns-goods-action-icon text="首页" icon="iconshouye1" @click="goHome" />
						<ns-goods-action-icon text="客服" icon="iconiconicon-kefu" :send-data="contactData"
							:chatParam="chatRoomParams" />
						<!-- <ns-goods-action-icon text="购物车" :cornerMarkBg="themeStyle.goods_detail.goods_cart_num_corner" icon="icongouwuche2" :corner-mark="cartCount > 0 ? cartCount + '' : ''" @click="goCart" /> -->

						<template
							v-if="goodsSkuDetail.goods_stock < goodsSkuDetail.pintuan_num && !goodsSkuDetail.sku_spec_format">
							<ns-goods-action-button class="goods-action-button active4" disabled-text="库存不足"
								:disabled="true" />
							<!-- <ns-goods-action-button
								v-if="goodsSkuDetail.sku_spec_format"
								class="goods-action-button active4"
								disabled-text="库存不足"
								:disabled="true"
								@click="pintuan"
							/>
							<ns-goods-action-button v-else class="goods-action-button active4" disabled-text="库存不足" :disabled="true" /> -->
						</template>

						<template v-else>
							<ns-goods-action-button v-if="goodsSkuDetail.is_single_buy == 1" class="goods-action-button"
								:text-price="'¥ ' + goodsSkuDetail.price" text="单独购买"
								:backgroundColor="themeStyle.goods_detail.goods_btn_color_shallow"
								:class="goodsSkuDetail.is_single_buy == 1 ? 'active1' : ''"
								background="linear-gradient(to right, #ffd01e, #ff8917)" @click="buyNow" />
							<ns-goods-action-button class="goods-action-button"
								:class="goodsSkuDetail.is_single_buy == 1 ? 'active2' : 'active4'"
								:text-price="'¥ ' + goodsSkuDetail.show_price"
								:backgroundColor="themeStyle.goods_detail.goods_btn_color"
								:textColor="themeStyle.btn_text_color"
								:text="groupDetail && groupDetail.status == 2 ? '参与拼团' : '发起拼团'" @click="pintuan(false)"
								v-if="goodsSkuDetail.pintuan_type == 'ordinary'" />
							<ns-goods-action-button class="goods-action-button"
								:class="goodsSkuDetail.is_single_buy == 1 ? 'active2' : 'active4'"
								:text-price="'¥ ' + pintuanPirce(goodsSkuDetail)"
								:backgroundColor="themeStyle.goods_detail.goods_btn_color"
								:textColor="themeStyle.btn_text_color"
								:text="groupDetail && groupDetail.status == 2 ? '参与拼团' : '发起拼团'" @click="pintuan(false)"
								v-if="goodsSkuDetail.pintuan_type == 'ladder'" />

						</template>



					</template>
					<template v-else>
						<ns-goods-action-button class="goods-action-button active3" disabled-text="该商品已下架"
							:disabled="true" />
					</template>
				</ns-goods-action>
			</template>

			<template v-slot:fixedbtn>
				<!-- 悬浮,别人分享并且在拼团中显示 -->
				<view v-if="groupDetail && groupDetail.status == 2 " class="fiexd-icon" @click="pintuan()">
					<view v-if="goodsSkuDetail.pintuan_type == 'ordinary'">
						<text>{{ parseFloat(goodsSkuDetail.promotion_price).toFixed(2) }}元</text>
						<text>去开团</text>
					</view>
					<view v-if="goodsSkuDetail.pintuan_type == 'ladder'">
						<text>{{ parseFloat(pintuanPirce(goodsSkuDetail)).toFixed(2) }}元</text>
						<text>去开团</text>
					</view>
					<image mode="widthFix" :src="$util.img('public/uniapp/pintuan/pintuan-join-icon.png')"></image>
				</view>
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
		display: inline-block;
	}

	.goods-promotion .countdown .clockrun>>>.uni-countdown__splitor.day {
		width: initial;
	}

	.spelling-block>>>.uni-countdown__splitor {
		padding: 0;
		font-size: 20rpx;
	}

	.sku-layer>>>.uni-popup__wrapper-box {
		overflow-y: initial !important;
	}

	.poster-layer>>>.uni-popup__wrapper-box {
		max-height: initial !important;
	}

	.spelling-block>>>.uni-countdown__number {
		padding: 0;
		margin: 0;
		font-size: 20rpx;
	}

	.pintuan-popup-layer>>>.uni-popup__wrapper-box {
		overflow-y: initial !important;
		border-radius: 10rpx;
	}

	.pintuan-popup-layer>>>.uni-countdown__number {
		padding: 0;
		margin: 0;
	}

	/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
		max-height: unset !important;
	}

	/deep/ .goods-action-button.active1 {}

	/deep/ .goods-action-button.active2 {}

	/deep/ .goods-action-button.active3 {}

	/deep/ .goods-action-button.active4 {}

	/deep/ .goods-action-button .action-buttom-wrap {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 50px;
	}

	/deep/ .goods-action-button.active1 .action-buttom-wrap {
		height: 84rpx;
		line-height: 84rpx;
	}

	/deep/ .goods-action-button.active2 .action-buttom-wrap {
		height: 84rpx;
		line-height: 84rpx;
	}

	/deep/ .goods-action-button.active3 .action-buttom-wrap {
		height: 84rpx;
		line-height: 84rpx;
		margin: 10px 0;
	}

	/deep/ .goods-action-button.active4 .action-buttom-wrap {
		height: 84rpx;
		line-height: 84rpx;
	}

	/deep/ .goods-action-button .action-buttom-wrap text {
		line-height: 1.1;
	}
</style>
