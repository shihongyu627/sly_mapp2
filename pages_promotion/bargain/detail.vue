<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="bargain">
		<view class="bargain_top" :style="{ backgroundImage: 'url(' + $util.img('public/uniapp/bargain/bargain_background.png') + ')' }">
			<view>{{ goodsDetail ? goodsDetail.browse_num : 0 }}人查看</view>
			<view>|</view>
			<view>{{ goodsDetail ? goodsDetail.share_num : 0 }}人分享</view>
			<view>|</view>
			<view>{{ goodsDetail ? goodsDetail.join_num : 0 }}人参与</view>
		</view>
		<view class="bargin_content">
			<view class="uer_info_base" v-if="launchInfo">
				<view class="user_info_img">
					<image :src="launchInfo.headimg == '' ? $util.img($util.getDefaultImage().head) : $util.img(launchInfo.headimg)" mode="widthFix"></image>
				</view>
				<text class="user_info_name">{{ launchInfo.nickname }}</text>
			</view>
			<!-- 宣传语 -->
			<view class="bargin_propaganda" v-if="launchInfo">
				<text class="marks">“</text>
				<text>我发现一件好物，快来帮我砍一刀</text>
				<text class="marks">”</text>
			</view>
			<!-- 商品 -->
			<view class="goods" v-if="goodsDetail">
				<view class="goods_img"><image :src="$util.img(goodsDetail.sku_image, { size: 'mid' })" mode="aspectFit"></image></view>
				<view class="goods_content" v-if="launchInfo">
					<view class="goods_title">{{ goodsDetail.sku_name }}</view>
					<view class="goods_price">
						<view>
							原价
							<text class="original_price">{{ $lang('common.currencySymbol') }}{{ launchInfo.price }}</text>
						</view>
						<view>
							最低可砍至
							<text class="bottom_price">{{ $lang('common.currencySymbol') }}{{ launchInfo.floor_price }}</text>
						</view>
					</view>
					<view class="partake_num" v-if="launchInfo">
						已有
						<text class="ident">{{ launchInfo.curr_num }}</text>
						人帮砍
						<text class="residue-num">
							剩余数量
							<text class="ident">{{ goodsDetail.bargain_stock }}</text>
						</text>
					</view>
					<view v-if="launchInfo && timeMachine && goodsDetail.bargain_status == 1" class="count-down">
						<uni-count-down
							:day="timeMachine.d"
							:hour="timeMachine.h"
							:minute="timeMachine.i"
							:second="timeMachine.s"
							color="#fff"
							splitorColor="#333 !important"
							backgroundColor="#000"
							border-color="transparent"
						></uni-count-down>
						<text>后结束</text>
					</view>
				</view>
				<view class="goods_content launch" v-else>
					<view class="goods_title">{{ goodsDetail.sku_name }}</view>
					<view class="goods_price">
						<view>
							原价：
							<text class="original_price price-font">
								<text class="price-style small">{{ $lang('common.currencySymbol') }}</text>
								<text class="price price-style small">
									{{
										parseFloat(goodsDetail.price)
											.toFixed(2)
											.split('.')[0]
									}}
								</text>
								<text class="price-symbol price-style small">
									.{{
										parseFloat(goodsDetail.price)
											.toFixed(2)
											.split('.')[1]
									}}
								</text>
							</text>
						</view>
						<view>
							最低可砍至：
							<text class="bottom_price price-style small">{{ $lang('common.currencySymbol') }}{{ goodsDetail.floor_price }}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 进度 -->
			<view class="progress">
				<view class="progress_item" :style="{ width: (progress > 2 ? progress : 2) + '%' }"><text class="iconfutou iconfont"></text></view>
				<view class="progress-point"></view>
			</view>

			<view class="info-bottom" v-if="goodsDetail">
				<view class="price-box" v-if="launchInfo">
					<view class="discount-price">
						已砍
						<text class="price price-font">
							{{ $lang('common.currencySymbol') }}{{ parseFloat(parseFloat(launchInfo.price) - parseFloat(launchInfo.curr_price)).toFixed(2) }}
						</text>
						，
					</view>
					<view class="delete-price ">
						还剩
						<text class="price price-font">
							{{ $lang('common.currencySymbol')
							}}{{
								parseFloat(
									parseFloat(launchInfo.price) - parseFloat(launchInfo.floor_price) - (parseFloat(launchInfo.price) - parseFloat(launchInfo.curr_price))
								).toFixed(2)
							}}
						</text>
					</view>
				</view>
				<view class="price-box" v-else>
					<view class="discount-price">
						已砍
						<text class="price price-font">{{ $lang('common.currencySymbol') }}0</text>
						，
					</view>
					<view class="delete-price ">
						还剩
						<text class="price price-font">
							{{ $lang('common.currencySymbol') }} {{ parseFloat(parseFloat(goodsDetail.price) - parseFloat(goodsDetail.floor_price)).toFixed(2) }}
						</text>
					</view>
				</view>

				<view class="pro-info" v-if="!parseFloat(goodsDetail.floor_price)"><view class="button-border">免费拿</view></view>
			</view>

			<!-- 邀请新用户 -->
			<view class="invitation_peo" v-if="launchInfo">
				<!-- <view class="tip">邀请新用户砍掉金额更多哦~</view> -->
				<block v-if="launchInfo.self">
					<view class="bargain-success" v-if="launchInfo.status == 1">
						<text class="iconfont iconkanjiachenggong"></text>
						<text>恭喜您砍价成功，快去支付吧</text>
					</view>
					<view class="bargain-success" v-if="launchInfo.status == 2">
						<text class="iconfont iconbiaoqing_nanguo"></text>
						<text v-if="launchInfo.buy_type == 0 && launchInfo.order_id == 0">很遗憾未能砍至最低价，可立即支付带走您心仪的宝贝</text>
						<text v-else-if="launchInfo.buy_type == 0 && launchInfo.order_id > 0">很遗憾未能砍至最低价</text>
						<text v-else>很遗憾砍价未成单</text>
					</view>
					<view class="launch-success" v-if="launchInfo.status == 2 && launchInfo.buy_type == 0 && launchInfo.order_id > 0">恭喜您通过立即支付带走您心仪的宝贝</view>
				</block>
				<block v-if="goodsDetail.bargain_status == 1">
					<view v-if="launchInfo.self" class="flex-box" :class="{ success: launchInfo.status == 1 }">
						<block v-if="launchInfo.status != 1 && (goodsDetail.bargain_status != 1 || goodsDetail.bargain_stock == 0)">
							<block v-if="goodsDetail.bargain_status != 1">
								<button class="btn-vice disabled">活动已结束</button>
								<button class="btn" @click="$util.redirectTo('/pages_promotion/bargain/list')">更多砍价商品</button>
							</block>
							<block v-else-if="goodsDetail.bargain_stock == 0">
								<button class="btn-vice disabled">已售罄</button>
								<button class="btn" @click="$util.redirectTo('/pages_promotion/bargain/list')">更多砍价商品</button>
							</block>
						</block>
						<block v-else>
							<block v-if="launchInfo.status == 0">
								<button class="btn-vice" v-if="launchInfo.buy_type == 0" @click="buyNow">不砍了，直接买</button>
								<!-- #ifdef MP -->
								<button class="btn" open-type="share">喊好友砍一刀</button>
								<!-- #endif -->
								<!-- #ifdef H5 -->
								<button class="btn" @click="openSharePopup">喊好友砍一刀</button>
								<!-- #endif -->
							</block>
							<block v-if="launchInfo.status == 1">
								<button class="btn" @click="buyNow" v-if="launchInfo.order_id == 0">立即支付</button>
								<button class="btn" v-if="launchInfo.order_id > 0" @click="$util.redirectTo('/order/detail', { order_id: launchInfo.order_id })">
									查看订单
								</button>
								<button class="btn-vice" @click="$util.redirectTo('/pages/index/index')">低价拿更多商品</button>
							</block>
							<block v-if="launchInfo.status == 2">
								<button class="btn" v-if="launchInfo.order_id > 0" @click="$util.redirectTo('/order/detail', { order_id: launchInfo.order_id })">
									查看订单
								</button>
								<button class="btn" @click="$util.redirectTo('/pages/index/index')">低价拿更多商品</button>
							</block>
						</block>
					</view>
					<view v-else class="flex-box">
						<block v-if="launchInfo.status == 0">
							<button class="btn" @click="bargain" v-if="!launchInfo.cut">帮好友砍一刀</button>
							<button class="btn-vice" @click="$util.redirectTo('/pages_promotion/bargain/list')" v-else>我也要低价拿</button>
						</block>
						<block v-else><button class="btn" @click="$util.redirectTo('/pages_promotion/bargain/list')">我也要低价拿</button></block>
					</view>
				</block>
				<block v-else>
					<view class="flex-box success">
						<button class="btn" v-if="launchInfo.self && launchInfo.order_id > 0" @click="$util.redirectTo('/order/detail', { order_id: launchInfo.order_id })">
							查看订单
						</button>
						<button class="btn-vice disabled">活动已结束</button>
					</view>
				</block>
			</view>
			<view class="invitation_peo" v-else>
				<view class="flex-box">
					<button class="btn" v-if="goodsDetail && goodsDetail.bargain_status == 1" @click="createBargain()">立即参与砍价</button>
					<button class="btn-vice disabled" v-else>活动已结束</button>
				</view>
			</view>
		</view>

		<view class="bargin_introduction" v-if="launchInfo">
			<view class="bargin_introduction_title">帮砍记录</view>
			<view class="bargin_introduction_content">
				<view class="bargin_invitation" v-if="bargainRecord.length">
					<view class="item" v-for="(item, index) in bargainRecord" :key="index">
						<view class="item_left">
							<image :src="item.headimg == '' ? $util.img($util.getDefaultImage().head) : $util.img(item.headimg)"></image>
							<view class="bargin_info">
								<view>{{ item.nickname }}</view>
								<view>{{ $util.timeStampTurnTime(item.bargain_time) }}</view>
							</view>
						</view>
						<view class="item_right">
							<image :src="$util.img('public/uniapp/bargain/bargain-icon.png')" class="bargain-icon"></image>
							帮砍
							<text>￥{{ item.money }}</text>
						</view>
					</view>
					<view class="item_more" v-if="showMore" @click="scrolltolower()">加载更多</view>
				</view>
				<view v-else><view class="record-empty">现在还没有砍价记录！</view></view>
			</view>
		</view>

		<view class="bargin_introduction">
			<view class="bargin_introduction_title">砍价流程</view>
			<view class="bargin_introduction_content">
				<view class="flow">
					<view class="flow_item">
						<image :src="$util.img('public/uniapp/bargain/bargain_kanjia.png')"></image>
						<view>发起商品砍价</view>
					</view>
					<view class="flow_item">
						<image :src="$util.img('public/uniapp/bargain/bargain_friend.png')"></image>
						<view>邀请好友砍价达要求</view>
					</view>
					<view class="flow_item">
						<image :src="$util.img('public/uniapp/bargain/bargain_good.png')"></image>
						<view>领取商品带回家</view>
					</view>
				</view>
			</view>
		</view>

		<view class="bargin_introduction" v-if="launchList && launchList.length > 0">
			<view class="bargin_introduction_title">砍成晒单</view>
			<view class="bargin_introduction_content">
				<view class="bargain-list">
					<swiper vertical="true" autoplay="true" interval="3000" :display-multiple-items="showNum" :circular="true" :class="'swiper-' + launchList.length">
						<swiper-item v-for="(item, index) in launchList" :key="index">
							<view class="bargain-item">
								<view>
									<view class="bargain-head"><image :src="item.headimg == '' ? $util.img($util.getDefaultImage().head) : $util.img(item.headimg)"></image></view>
									<view class="bargain-info">
										<view class="bargain-title">{{ item.nickname }}</view>
										<view class="bargain-desc">{{ $util.timeStampTurnTime(item.end_time) }}</view>
									</view>
								</view>
								<view class="bargain-price">
									成功砍至
									<text>{{ parseFloat(item.curr_price).toFixed(2) }}元</text>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		<view class="bargin_introduction">
			<view class="bargin_introduction_title">商品详情</view>
			<view class="bargin_introduction_content">
				<view class="detail-content">
					<view class="goods-details" v-if="goodsDetail && goodsDetail.goods_content">
						<rich-text :nodes="goodsDetail.goods_content" @click="showImg($event)" :data-nodes="goodsDetail.goods_content"></rich-text>
					</view>
					<view class="goods-details active" v-else>该商家暂无上传相关详情哦！</view>
				</view>
			</view>
		</view>

		<ns-goods-sku
			ref="goodsSku"
			v-if="goodsDetail"
			@refresh="refreshGoodsSkuDetail"
			:goods-id="goodsDetail.goods_id"
			:goods-detail="goodsDetail"
			:maxBuy="maxBuy"
		></ns-goods-sku>

		<!-- 帮砍弹出 -->
		<uni-popup ref="uniHelpPopup" type="center" :maskClick="false">
			<view class="bargain-popup self help">
				<image :src="$util.img('public/uniapp/bargain/bargain-pop-1.png')" mode="widthFix" class="head"></image>
				<view class="bargain-content">
					<view class="uer_info_base" v-if="launchInfo">
						<view class="user_info_img">
							<image :src="launchInfo.headimg == '' ? $util.img($util.getDefaultImage().head) : $util.img(launchInfo.headimg)" mode="widthFix"></image>
						</view>
						<text class="user_info_name">{{ launchInfo.nickname }}</text>
					</view>
					<view v-if="goodsDetail && launchInfo && timeMachine && goodsDetail.bargain_status == 1" class="count-down">
						<text>还剩</text>
						<uni-count-down
							:day="timeMachine.d"
							:hour="timeMachine.h"
							:minute="timeMachine.i"
							:second="timeMachine.s"
							color="#fff"
							splitorColor="#333 !important"
							backgroundColor="#000"
							border-color="transparent"
						></uni-count-down>
						<text>结束</text>
					</view>
				</view>
				<button class="bargain-btn" type="primary" @click="bargain()">帮他砍价</button>
			</view>
			<text class="iconfont iconroundclose" @click="$refs.uniHelpPopup.close()"></text>
		</uni-popup>

		<!-- 帮砍成功 -->
		<uni-popup ref="uniPopup" type="center" :maskClick="false">
			<view class="bargain-popup self">
				<image :src="$util.img('public/uniapp/bargain/bargain-pop-2.png')" mode="widthFix" class="head"></image>
				<view class="bargain-content">
					<text>您已帮砍</text>
					<text class="money color-base-text">{{ bargainMoney }}</text>
					<text>元，您也可以参与砍价，快去挑选心仪的宝贝吧~~~</text>
				</view>
				<button class="bargain-btn" type="primary" @click="$util.redirectTo('/pages_promotion/bargain/list')">我也要参与</button>
			</view>
			<text class="iconfont iconroundclose" @click="closePopup"></text>
		</uni-popup>

		<!-- 自砍一刀展示 -->
		<uni-popup ref="uniSelfBargainPopup" type="center" :maskClick="false">
			<view class="bargain-popup self">
				<image :src="$util.img('public/uniapp/bargain/bargain-pop-2.png')" mode="widthFix" class="head"></image>
				<view class="bargain-content">
					<text>您已砍掉</text>
					<text class="money color-base-text">{{ my_bargain_money }}</text>
					<text>元，听说分享次数越多砍价成功的机会越大哦！</text>
				</view>
				<!-- #ifdef MP -->
				<button class="bargain-btn" type="primary" open-type="share">邀请好友帮砍价</button>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<button class="bargain-btn" type="primary" @click="openSharePopup">邀请好友帮砍价</button>
				<!-- #endif -->
			</view>
			<text class="iconfont iconroundclose" @click="closeSelfPop"></text>
		</uni-popup>

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
						<!-- #ifdef H5 -->
						<view class="share-box" @click="copyUrl">
							<button class="share-btn" :plain="true">
								<view class="iconfont iconfuzhilianjie"></view>
								<text>复制链接</text>
							</button>
						</view>
						<!-- #endif -->
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

		<!-- 悬浮按钮 -->
		<view class="fixed-box" :style="{ height: fixBtnShow ? '330rpx' : '120rpx' }">
			<!-- 规则 -->
			<view class="btn-item" v-if="fixBtnShow" @click="$util.redirectTo('/pages/index/index')">
				<text class="iconfont iconshouye1"></text>
				<view>首页</view>
			</view>
			<view class="btn-item" v-if="fixBtnShow" @click="$util.redirectTo('/pages/member/index')">
				<text class="iconfont iconyonghu"></text>
				<view>我的</view>
			</view>

			<view class="btn-item icon-xiala" v-if="fixBtnShow" @click="fixBtnShow ? (fixBtnShow = false) : (fixBtnShow = true)"><text class="iconfont iconunfold"></text></view>
			<view class="btn-item switch" v-else :class="{ show: fixBtnShow }" @click="fixBtnShow ? (fixBtnShow = false) : (fixBtnShow = true)">
				<view class="">快捷</view>
				<view>导航</view>
			</view>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>

		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
import LTime from '@/components/l-time/l-time.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import goodsSku from '@/components/ns-goods-sku/ns-goods-sku.vue';
import nsLogin from '@/components/ns-login/ns-login.vue';
import detail from './public/js/detail.js';
export default {
	components: {
		LTime,
		goodsSku,
		nsLogin,
		uniPopup
	},
	mixins: [detail]
};
</script>

<style lang="scss">
@import './public/css/detail.scss';
</style>
<style scoped>
/deep/.uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
	overflow-y: unset;
	background: none !important;
}
.detail-content >>> img {
	max-width: 100% !important;
}
.detail-content >>> image {
	max-width: 100% !important;
}
/deep/.uni-countdown__number {
	padding: 0 4rpx;
	line-height: 36rpx;
	height: 36rpx;
}

/deep/ .uni-countdown__splitor.day {
	line-height: 36rpx;
}
.poster-layer >>> .goodslist-uni-popup .goodslist-uni-popup-box {
	max-height: 1100rpx !important;
}
</style>
