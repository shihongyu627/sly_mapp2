<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<view class="container">
			<scroll-view class="scroll-view" :scroll-y="true" :show-scrollbar="false">
				<block v-if="hasData">
					<view class="cart-header fixed" v-if="cartData.length">
						<view class="num-wrap">
							共{{ cartData[0].cartList.length }}种商品
						</view>
						<view class="cart-action" @click="changeAction">{{ isAction ? $lang('complete') : $lang('edit') }}</view>
					</view>
					<view class="cart-wrap" v-for="(siteItem, siteIndex) in cartData" :key="siteIndex">
						<view class="coupon-use-tips" v-if="discount.coupon_info">
							<view>
								<text class="title color-base-text">优惠券</text>
								<text class="desc">领券结算最高可减{{ discount.coupon_info.coupon_money|moneyFormat }}元</text>
							</view>
							<view class="color-base-text" @click="$refs.couponPopup.open()">点击{{ discount.coupon_info.receive_type == 'wait' ? '领取' : '查看' }}<text class="iconfont iconright"></text></view>
						</view>
						<block v-for="(item, cartIndex) in siteItem.cartList" :key="cartIndex">
							<view class="cart-goods">
								<view class="goods-wrap" :class="{ edit: item.edit }">
									<view
										class="iconfont"
										:class="item.checked ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'"
										@click="singleElection(siteIndex, cartIndex)"
									></view>
									<view @click="toGoodsDetail(item)" class="goods-img">
										<image :src="$util.img(item.sku_image, { size: 'mid' })" @error="imageError(siteIndex, cartIndex)" mode="aspectFill"></image>
									</view>
									<view class="goods-info">
										<view>
											<view @click="toGoodsDetail(item)" class="goods-name">{{ item.goods_name }}</view>
											<view class="sku-wrap">
												<view class="sku">
													<view class="goods-spec" v-if="item.sku_spec_format.length" @click="selectSku(item)">
														<block v-for="(x, i) in item.sku_spec_format" :key="i">
															{{ x.spec_name }}:{{ x.spec_value_name }} {{ i < item.sku_spec_format.length - 1 ? ';' : '' }}
														</block>
													</view>
													<text class="iconfont iconunfold" v-if="item.sku_spec_format.length"></text>
												</view>
											</view>
										</view>
										<view class="goods-sub-section">
											<block v-if="item.promotion_type == 1">
												<block v-if="Number(item.member_price) > 0 && Number(item.member_price) < Number(item.discount_price)">
													<view class="goods-price ">
														<view class="bottom-price price-style large">
															<text class="unit price-style small">{{ $lang('common.currencySymbol') }}</text>
															{{ parseFloat( item.member_price).toFixed(2).split(".")[0] }}
														    <text class="unit price-style small">.{{ parseFloat(item.member_price).toFixed(2).split(".")[1] }}</text>
															
															<image :src="$util.img('public/uniapp/index/VIP.png')"></image>
														</view>
													</view>
												</block>
												<block v-else>
													<view class="goods-price ">
														<view class="bottom-price price-style large">
															<text class="unit price-style small">{{ $lang('common.currencySymbol') }}</text>
															{{ parseFloat( item.discount_price).toFixed(2).split(".")[0] }}
															<text class="unit price-style small">.{{ parseFloat(item.discount_price).toFixed(2).split(".")[1] }}</text>
															
															<image :src="$util.img('public/uniapp/index/discount.png')"></image>
														</view>
													</view>
												</block>
											</block>
											<block v-else>
												<block v-if="Number(item.member_price) > 0">
													<view class="goods-price">
														<view class="bottom-price price-style large">
															<text class="unit price-style small">{{ $lang('common.currencySymbol') }}</text>
															{{ parseFloat( item.member_price).toFixed(2).split(".")[0] }}
															<text class="unit price-style small">.{{ parseFloat(item.member_price).toFixed(2).split(".")[1] }}</text>
															<image :src="$util.img('public/uniapp/index/VIP.png')"></image>
														</view>
													</view>
												</block>
												<block v-else>
													<view class="goods-price">
														<view class="bottom-price price-style large">
															<text class="unit price-style small">{{ $lang('common.currencySymbol') }}</text>
															{{ parseFloat( item.price).toFixed(2).split(".")[0] }}
															<text class="unit price-style small">.{{ parseFloat(item.price).toFixed(2).split(".")[1] }}</text>
														</view>
													</view>
												</block>
											</block>
											<uni-number-box
												:min="item.min_buy > 1 ? item.min_buy : 1"
												:max="item.max_buy > 0 && item.max_buy < item.stock ? item.max_buy : item.stock"
												:value="initNum(item)"
												size="small"
												:modifyFlag="modifyFlag"
												@change="cartNumChange($event, { siteIndex, cartIndex })"
												@limit="goodsLimit($event, cartIndex)"
											/>
										</view>
										<view class="discount-wrap" v-if="manjian && manjian['sku_' + item.sku_id]">
											<text class="discount-tag">满减</text>
											<scroll-view scroll-x="true" class="scroll-view">
												<block v-for="(mitem, key) in manjian['sku_' + item.sku_id]" :key="key">
													<text v-if="mitem.discount_money">{{ mitem.limit }}减{{ mitem.discount_money }}</text>
													<text class="interval" v-if="mitem.discount_money"></text>
												</block>
											</scroll-view>
										</view>
									</view>
								</view>
							</view>
						</block>
					</view>
			
					<view class="cart-wrap invalid" v-if="invalidGoods.length">
						<view class="cart-header">
							<view class="num-wrap">
								<text class="font-size-base">失效商品{{ invalidGoods.length }}件</text>
							</view>
							<view class="cart-action color-base-text" @click="clearInvalidGoods">清空</view>
						</view>
						<block v-for="(goodsItem, goodsIndex) in invalidGoods" :key="goodsIndex">
							<view class="cart-goods invalid-goods">
								<view class="goods-wrap">
									<view class="iconfont iconyuan_checked color-tip"></view>
									<view class="goods-img"><image :src="$util.img(goodsItem.sku_image, { size: 'mid' })" mode="aspectFill"></image></view>
									<view class="goods-info">
										<view class="goods-name">{{ goodsItem.sku_name }}</view>
										<view>
											<view class="sku">
												<view class="goods-spec" v-if="goodsItem.sku_spec_format.length">
													<block v-for="(x, i) in goodsItem.sku_spec_format" :key="i">
														{{ x.spec_name }}:{{ x.spec_value_name }} {{ i < goodsItem.sku_spec_format.length - 1 ? '; ' : '' }}
													</block>
												</view>
											</view>
										</view>
										<view class="goods-sub-section">
											<text class="goods-price price-style large">
												<template v-if="goodsItem.member_price > 0 && goodsItem.member_price < goodsItem.discount_price">
													<text class="unit price-style small">{{ $lang('common.currencySymbol') }}</text>
													{{ parseFloat( goodsItem.member_price).toFixed(2).split(".")[0] }}
													<text class="unit price-style small">.{{ parseFloat(goodsItem.member_price).toFixed(2).split(".")[1] }}</text>
													<image :src="$util.img('public/uniapp/index/VIP.png')"></image>
												</template>
												<template v-else>
													<text class="unit price-style small">{{ $lang('common.currencySymbol') }}</text>
													{{ parseFloat( goodsItem.discount_price).toFixed(2).split(".")[0] }}
													<text class="unit price-style small">.{{ parseFloat(goodsItem.discount_price).toFixed(2).split(".")[1] }}</text>
												</template>
											</text>
											<text class="invalid-mark">已失效</text>
										</view>
									</view>
								</view>
							</view>
						</block>
					</view>
				</block>
				<block v-else>
					<view class="cart-empty">
						<!-- <image :src="$util.img('public/uniapp/cart/empty.png')" mode="aspectFit"></image>
						<view class="color-tip margin-top margin-bottom">{{ $lang('emptyTips') }}</view>
						<button type="primary" size="mini" class="button visit-the" v-if="token != ''" @click="$util.redirectTo('/pages/index/index', {}, 'reLaunch')">去逛逛</button>
						<button type="primary" size="mini" class="button" v-else @click="toLogin">去登录</button> -->
						<ns-empty text="购物车为空" subText="赶紧去逛逛, 购买心仪的商品吧" :isIndex="Boolean(token)"></ns-empty>
						<button type="primary" size="mini" class="button" v-if="!token" @click="toLogin">去登录</button>
					</view>
				</block>
				<nsGoodsRecommend ref="goodrecommend" route="cart"></nsGoodsRecommend>
				
				<uni-popup ref="discountPopup" type="bottom">
					<view class="discount-popup popup" v-if="Object.keys(discount).length">
						<view class="popup-header">
							<text class="tit">优惠明细</text>
							<text class="iconfont iconclose" @click="toggleDiscountPopup"></text>
						</view>
						<view class="popup-body" :class="{ 'safe-area': isIphoneX }" @click="toggleDiscountPopup">
							<view class="detail-item">
								<view class="title">商品总额</view>
								<view class="money price-font">￥{{ discount.goods_money|moneyFormat }}</view>
							</view>
							<view class="detail-item" v-if="discount.coupon_money > 0">
								<view class="title">优惠券</view>
								<view class="money price-font reduce">-￥{{ discount.coupon_money|moneyFormat }}</view>
							</view>
							<view class="detail-item" v-if="discount.promotion_money > 0">
								<view class="title">满减</view>
								<view class="money reduce price-font">-￥{{ discount.promotion_money|moneyFormat }}</view>
							</view>
							<view class="detail-item total">
								<view class="title">合计</view>
								<view class="money price-font ">￥{{ discount.order_money|moneyFormat }}</view>
							</view>
						</view>
					</view>
				</uni-popup>
				
				<uni-popup ref="couponPopup" type="bottom" v-if="discount.coupon_info">
					<view class="coupon-popup popup">
						<view class="popup-header">
							<text class="tit">优惠券</text>
							<text class="iconfont iconclose" @click="$refs.couponPopup.close()"></text>
						</view>
						<view class="popup-body" :class="{ 'safe-area': isIphoneX }" @click="$refs.couponPopup.close()">
							<view class="coupon-item">
								<view class="coupon-info" :style="{ backgroundColor: discount.coupon_info.receive_type != 'wait' ? '#F2F2F2' : 'var(--main-color-shallow)' }">
									<view class="info-wrap" >
										<image class="coupon-line" mode="heightFix" :src="$util.img('public/uniapp/coupon/coupon_line.png')"></image>
										<view class="coupon-money">
											<template v-if="discount.coupon_info.type == 'reward'">
												<text class="unit">{{ $lang('common.currencySymbol') }}</text>
												<text class="money">{{ parseFloat(discount.coupon_info.money) }}</text>
											</template>
											<template v-else-if="discount.coupon_info.type == 'discount'">
												<text class="money">{{ parseFloat(discount.coupon_info.discount) }}</text>
												<text class="unit">折</text>
											</template>
											<view class="at-least">
												<template v-if="discount.coupon_info.at_least > 0">
													满{{ discount.coupon_info.at_least }}可用
												</template>
												<template v-else>
													无门槛
												</template>
											</view>
										</view>
									</view>
									<view class="desc-wrap">
										<view class="coupon-name">{{ discount.coupon_info.coupon_name }}</view>
										<view v-if="discount.coupon_info.type == 'discount' && discount.coupon_info.discount_limit > 0" class="limit">最多可抵￥{{ discount.coupon_info.discount_limit }}</view>
										<view class="time font-size-goods-tag" v-if="discount.coupon_info.validity_type == 0">有效期：{{ $util.timeStampTurnTime(discount.coupon_info.end_time) }}</view>
										<view class="time font-size-goods-tag" v-else-if="discount.coupon_info.validity_type == 1">有效期：领取之日起{{ discount.coupon_info.fixed_term }}天内有效</view>
										<view class="time font-size-goods-tag" v-else>有效期：长期有效</view>
									</view>
							
									<button type="primary" v-if="discount.coupon_info.receive_type != 'wait'" disabled>已领取</button>
									<button type="primary" v-else @click.stop="receiveCoupon(discount.coupon_info.coupon_type_id)">领取</button>
								</view>
							</view>
							
						</view>
					</view>
				</uni-popup>
			</scroll-view>
			
			<view class="cart-bottom" :class="{ active: isIphoneX }" v-if="hasData">
				<view class="all-election" @click="allElection">
					<view class="iconfont" :class="checkAll ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'"></view>
					<text>{{ $lang('allElection') }}</text>
				</view>
				<view class="settlement-info" :style="{ visibility: isAction ? 'hidden' : 'visible' }">
					<view class="money">
						{{ $lang('total') }}：
						<text class="unit price-font">{{ $lang('common.currencySymbol') }} </text>
						<block v-if="Object.keys(discount).length">
							<text class="value price-font">{{ parseFloat(discount.order_money).toFixed(2).split(".")[0] }}</text>
							<text class="unit price-font">.{{ parseFloat(discount.order_money).toFixed(2).split(".")[1] }}</text>
						</block>
						<block v-else>
							<text class="value price-font">{{ parseFloat(totalPrice).toFixed(2).split(".")[0] }}</text>
							<text class="unit price-font">.{{ parseFloat(totalPrice).toFixed(2).split(".")[1] }}</text>
						</block>
					</view>
					<view class="detail" @click="toggleDiscountPopup" v-if="Object.keys(discount).length">
						优惠明细<text class="iconfont iconunfold" :class="{open: !discountPopupShow}"></text>
					</view>
				</view>
				<view class="action-btn" v-if="isAction">
					<button type="primary" size="mini" @click="deleteCart('all')" >{{ $lang('del') }}</button>
				</view>
				<view class="action-btn" v-else>
					<button type="primary" size="mini" @click="settlement" v-if="totalCount != 0">
						{{ discount.coupon_info && discount.coupon_info.receive_type == 'wait' ? '领券' : '立即' }}结算({{ totalCount }})
					</button>
					<button type="primary" size="mini" @click="settlement" disabled v-else>{{ $lang('settlement') }}({{ totalCount }})</button>
				</view>
			</view>
		</view>
		
		<!-- 加载动画 -->
		<ns-goods-sku ref="selectSku" 
			v-if="goodsSkuDetail"
			:goods-detail="goodsSkuDetail"
			:goods-id="goodsSkuDetail.goods_id"
			:max-buy="goodsSkuDetail.max_buy"
			:min-buy="goodsSkuDetail.min_buy"
			@refresh="refreshSkuDetail">
		</ns-goods-sku>
		
		<loading-cover ref="loadingCover"></loading-cover>
		<!-- 底部tabBar -->
		<view id="tab-bar">
			<diy-bottom-nav></diy-bottom-nav>
		</view>
		<!-- 返回顶部 -->
		<to-top v-if="showTop" @toTop="scrollToTopNative()"></to-top>
		
		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
import nsGoodsRecommend from '@/components/ns-goods-recommend/ns-goods-recommend.vue';
import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue';
import toTop from '@/components/toTop/toTop.vue';
import scroll from '@/common/js/scroll-view.js';
import cart from './public/js/cart.js';

export default {
	components: {
		nsGoodsRecommend,
		uniNumberBox,
		toTop
	},
	mixins: [scroll, cart],
};
</script>

<style lang="scss">
/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: none;
	max-height: unset !important;
	overflow-y: hidden !important;
}
/deep/ .uni-popup__wrapper {
	border-radius: 20rpx 20rpx 0 0;
}
@import './public/css/cart.scss';
</style>
