<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="member-level">
		<view class="level-top"><image :src="$util.img('public/uniapp/level/card-top-bg.png')"></image></view>
		<view class="banner-container">
			<view class="memberInfo">
				<image :src="$util.img(userInfo.headimg)" v-if="userInfo.headimg" @error="headimgError" mode="aspectFill"></image>
				<image :src="$util.getDefaultImage().head" v-else mode="aspectFill"></image>
				<view class="member-desc">
					<view class="font-size-toolbar">{{ userInfo.nickname }}</view>
					<view class="font-size-tag expire-time" v-if="userInfo.level_expire_time > 0">有效期至：{{ $util.timeStampTurnTime(userInfo.level_expire_time, true) }}</view>
				</view>
			</view>

			<view class="image-container item-center">
				<view class="slide-image">
					<view class="bg-border"></view>
					<image :src="$util.img('public/uniapp/level/card-bg.png')"></image>
					<view class="info">
						<view class="level-detail">{{ levelInfo.level_name }}</view>
						<view class="growr-name">{{ levelInfo.level_name }}可享受消费折扣和</view>
						<view class="growr-value">会员大礼包等权益</view>
						<view class="growth-rules font-size-tag" @click="openExplainPopup" v-if="levelInfo.remark != ''">
							<text class="iconfont iconwenhao font-size-tag"></text>
						</view>
						<button type="default" class="renew-btn" @click="$util.redirectTo('/pages_tool/member/card_buy')">立即续费</button>
					</view>
				</view>
			</view>

			<view class="card-content" v-if="levelInfo.is_free_shipping || levelInfo.consume_discount < 100 || levelInfo.point_feedback > 0">
				<view class="card-content-head">
					<view class="line-box"><view class="line right"></view></view>
					<view class="card-content-title">会员权益</view>
					<view class="line-box"><view class="line"></view></view>
					<view class="clear"></view>
				</view>
				<view class="card-privilege-list">
					<view class="card-privilege-item" v-if="levelInfo.is_free_shipping">
						<view class="card-privilege-icon"><text class="iconfont icontedianquanchangbaoyou"></text></view>
						<view class="card-privilege-name">全场包邮</view>
						<view class="card-privilege-text">享受商品包邮服务</view>
					</view>
					<view class="card-privilege-item" v-if="levelInfo.consume_discount < 100">
						<view class="card-privilege-icon"><text class="iconfont iconzhekou"></text></view>
						<view class="card-privilege-name">消费折扣</view>
						<view class="card-privilege-text">部分商品下单可享{{ levelInfo.consume_discount / 10 }}折优惠</view>
					</view>
					<view class="card-privilege-item" v-if="levelInfo.point_feedback > 0">
						<view class="card-privilege-icon"><text class="iconfont iconjifen2 f32"></text></view>
						<view class="card-privilege-name">柚币回馈</view>
						<view class="card-privilege-text">下单享{{ parseFloat(levelInfo.point_feedback) }}倍柚币回馈</view>
					</view>
				</view>

				<view v-if="levelInfo.send_coupon != '' || levelInfo.send_point > 0 || levelInfo.send_balance > 0">
					<view class="card-content-head">
						<view class="line-box"><view class="line right"></view></view>
						<view class="card-content-title">开卡礼包</view>
						<view class="line-box"><view class="line"></view></view>
						<view class="clear"></view>
					</view>
					<view class="card-privilege-list">
						<view class="card-privilege-item" v-if="levelInfo.send_point > 0">
							<view class="card-privilege-icon"><text class="iconfont iconjifen3"></text></view>
							<view class="card-privilege-name">柚币礼包</view>
							<view class="card-privilege-text">赠送{{ levelInfo.send_point }}柚币</view>
						</view>
						<view class="card-privilege-item" v-if="levelInfo.send_balance > 0">
							<view class="card-privilege-icon"><text class="iconfont iconhongbao"></text></view>
							<view class="card-privilege-name">红包礼包</view>
							<view class="card-privilege-text">赠送{{ parseFloat(levelInfo.send_balance) }}红包</view>
						</view>
						<view class="card-privilege-item" v-if="levelInfo.send_coupon != ''">
							<view class="card-privilege-icon"><text class="iconfont iconyouhuiquan1"></text></view>
							<view class="card-privilege-name">优惠券礼包</view>
							<view class="card-privilege-text">赠送{{ levelInfo.send_coupon.split(',').length }}张优惠券</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 弹出规则 -->
		<view @touchmove.prevent.stop>
			<uni-popup ref="explainPopup" type="bottom">
				<view class="tips-layer">
					<view class="head" @click="closeExplainPopup()">
						<view class="title">会员卡说明</view>
						<text class="iconfont iconclose"></text>
					</view>
					<view class="body">
						<view class="detail margin-bottom">
							<block v-if="levelInfo.remark != ''">
								<view class="tip">会员卡说明</view>
								<view class="font-size-base">{{ levelInfo.remark }}</view>
							</block>
						</view>
					</view>
				</view>
			</uni-popup>
		</view>

		<nsGoodsRecommend ref="goodrecommend" route="supermember"></nsGoodsRecommend>
		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import nsGoodsRecommend from '@/components/ns-goods-recommend/ns-goods-recommend.vue';
import scroll from '@/common/js/scroll-view.js';

export default {
	components: {
		uniPopup,
		nsGoodsRecommend
	},
	mixins: [scroll],
	data() {
		return {
			isSub: false, // 是否已提交
			isIphoneX: false,
			levelId: 0,
			userInfo: {},
			levelInfo: {
				bg_color: '#333'
			}
		};
	},
	computed: {
		storeToken() {
			return this.$store.state.token;
		}
	},
	onLoad() {
		//会员卡
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		
		if (uni.getStorageSync('token')) {
			this.getMemberInfo();
		} else {
			setTimeout(() => {
				this.$refs.login.open('/pages_tool/member/card');
			});
		}
	},
	onShow() {},
	watch: {
		storeToken: function(nVal, oVal) {
			if (nVal) {
				this.getMemberInfo();
			}
		}
	},
	methods: {
		getMemberInfo() {
			this.$api.sendRequest({
				url: '/api/member/info',
				success: res => {
					if (res.code == 0 && res.data) {
						this.levelId = res.data.member_level;
						this.userInfo = res.data;

						let levelInfo = res.data.member_level_info;
						let charge_rule = res.data.charge_rule ? JSON.parse(res.data.charge_rule) : {};
						levelInfo.charge_rule_arr = [];
						Object.keys(charge_rule).forEach(key => {
							levelInfo.charge_rule_arr.push({ key: key, value: charge_rule[key] });
						});
						this.levelInfo = levelInfo;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		headimgError() {
			this.userInfo.headimg = this.$util.getDefaultImage().head;
		},
		/**
		 * 打开说明弹出层
		 */
		openExplainPopup() {
			this.$refs.explainPopup.open();
		},
		/**
		 * 打开说明弹出层
		 */
		closeExplainPopup() {
			this.$refs.explainPopup.close();
		}
	},
	onBackPress(options) {
		if (options.from === 'navigateBack') {
			return false;
		}
		this.$util.redirectTo('/pages/member/index', {}, 'reLaunch');
		return true;
	}
};
</script>

<style lang="scss">
@import './public/css/card.scss';

.banner-container .image-container .slide-image {
	width: calc(100% - 60rpx);
	height: 360rpx;
	background-size: 100% 100%;
	background-repeat: no-repeat;
}

.banner-container .image-container image {
	background-color: #e3b66b;
}

.banner-container .slide-image .renew-btn {
	text-align: center;
	line-height: 56rpx;
	height: 56rpx;
	border-radius: $border-radius;
	width: 160rpx;
	font-size: $font-size-tag;
	color: #e3b66b !important;
	background: #fff;
	position: absolute;
	right: 10rpx;
	bottom: 40rpx;
	border: none;
	z-index: 10;
}
</style>
