<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="member-level">
		<view class="level-top"><image :src="$util.img('public/uniapp/level/level-top-bg.png')"></image></view>
		<view class="banner-container">
			<view class="memberInfo">
				<image :src="$util.img(userInfo.headimg)" v-if="userInfo.headimg" @error="userInfo.headimg = $util.getDefaultImage().head" mode="aspectFill"></image>
				<image :src="$util.getDefaultImage().head" v-else mode="aspectFill"></image>
				<view class="member-desc">
					<view class="font-size-base">{{ userInfo.nickname }}</view>
					<view class="font-size-activity-tag">当前等级：{{ userInfo.member_level_name }}</view>
				</view>
				<view class="growth-rules font-size-tag" @click="growthRules">
					<text class="iconfont iconwenhao font-size-tag"></text>
					成长规则
				</view>
			</view>
			<swiper
				:style="{ width: '100vw', height: '390rpx' }"
				class="margin-bottom"
				:indicator-dots="swiperConfig.indicatorDots"
				:indicator-color="swiperConfig.indicatorColor"
				:indicator-active-color="swiperConfig.indicatorActiveColor"
				:autoplay="false"
				:interval="swiperConfig.interval"
				:duration="swiperConfig.duration"
				:circular="swiperConfig.circular"
				:previous-margin="swiperConfig.previousMargin"
				:next-margin="swiperConfig.nextMargin"
				@change="swiperChange"
				@animationfinish="animationfinish"
				:current="curIndex"
			>
				<swiper-item :class="levelList.length == 1 ? 'image-container-box' : ''" v-for="(item, i) in levelList" :key="i">
					<view
						class="image-container"
						:class="[
							curIndex === 0
								? i === listLen - 1
									? 'item-left'
									: i === 1
									? 'item-right'
									: 'item-center'
								: curIndex === listLen - 1
								? i === 0
									? 'item-right'
									: i === listLen - 2
									? 'item-left'
									: 'item-center'
								: i === curIndex - 1
								? 'item-left'
								: i === curIndex + 1
								? 'item-right'
								: 'item-center'
						]"
					>
						<view
							class="slide-image"
							style="background-size: 100% 100%;background-repeat:no-repeat"
							:style="{
								transform: curIndex === i ? 'scale(' + scaleX + ',' + scaleY + ')' : 'scale(1,1)',
								transitionDuration: '.3s',
								transitionTimingFunction: 'ease'
							}"
						>
							<image :src="$util.img('public/uniapp/level/level_' + (Number(i % 5) + 1) + '.png')"></image>
							<view class="info">
								<view class="level-detail">
									{{ levelList[curIndex].level_name }}
									<text class="isnow " v-if="levelId == item.level_id">当前等级</text>
								</view>
								<view class="growr-name">当前成长值</view>
								<view class="growr-value">{{ growth }}</view>
								<block v-if="levelId == item.level_id">
									<block v-if="levelList[curIndex + 1] != undefined">
										<ns-progress :progress="levelList[curIndex + 1].rate"></ns-progress>
										<view class="residue-growr-value">
											再获得{{ levelList[curIndex + 1].needGrowth > 0 ? levelList[curIndex + 1].needGrowth : 0 }}成长值成为{{
												levelList[curIndex + 1].level_name
											}}
										</view>
									</block>
									<block v-else><view class="residue-growr-value">您现在已经是最高等级</view></block>
								</block>
								<block v-else>
									<ns-progress :progress="levelList[curIndex].rate" v-if="levelList[curIndex].needGrowth > 0"></ns-progress>
									<view class="residue-growr-value" v-if="levelList[curIndex].needGrowth > 0">
										再获得{{ levelList[curIndex].needGrowth }}成长值成为{{ levelList[curIndex].level_name }}
									</view>
								</block>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<view class="member-equity" v-if="levelList[curIndex].is_free_shipping > 0 || levelList[curIndex].consume_discount > 0 || levelList[curIndex].point_feedback > 0">
				<view class="equity-title">会员权益</view>
				<view class="equity-itme" v-if="levelList[curIndex].is_free_shipping > 0">
					<image :src="$util.img('public/uniapp/level/exemption_postage.png')" mode="aspectFit"></image>
					<view class="equity-content" :class="{ active: levelList[curIndex].consume_discount > 0 }">
						<text>包邮服务</text>
						<text class="equity-desc">提供商品包邮服务</text>
					</view>
				</view>
				<view class="equity-itme" v-if="levelList[curIndex].consume_discount > 0">
					<image :src="$util.img('public/uniapp/level/consumption_discount.png')" mode="aspectFit"></image>
					<view class="equity-content" :class="{ active: levelList[curIndex].point_feedback > 0 }">
						<text>享受消费折扣服务</text>
						<text class="equity-desc" v-if="levelList[curIndex].is_default == 1">不享受任何消费折扣和其他权益</text>
						<text class="equity-desc" v-else>提供{{ levelList[curIndex].consume_discount }}折消费折扣</text>
					</view>
				</view>
				<view class="equity-itme" v-if="levelList[curIndex].point_feedback > 0">
					<image :src="$util.img('public/uniapp/level/integral_feedback.png')" mode="aspectFit"></image>
					<view class="equity-content">
						<text>享受柚币回馈服务</text>
						<text class="equity-desc">提供{{ levelList[curIndex].point_feedback }}倍柚币回馈倍率</text>
					</view>
				</view>
			</view>

			<view class="member-gift" v-if="levelList[curIndex].send_balance > 0 || levelList[curIndex].send_balance > 0 || levelList[curIndex].send_coupon">
				<view class="gift-title">会员礼包</view>
				<view class="gift-itme" v-if="levelList[curIndex].send_point > 0">
					<image :src="$util.img('public/uniapp/level/integral.png')" mode="aspectFit"></image>
					<view class="gift-content" :class="{ active: levelList[curIndex].send_balance > 0 }">
						<text>柚币礼包</text>
						<text class="gift-desc">赠送{{ levelList[curIndex].send_point }}柚币</text>
					</view>
				</view>
				<view class="gift-itme" v-if="levelList[curIndex].send_balance > 0">
					<image :src="$util.img('public/uniapp/level/red_packet.png')" mode="aspectFit"></image>
					<view class="gift-content" :class="{ active: levelList[curIndex].send_coupon }">
						<text>红包礼包</text>
						<text class="gift-desc">赠送{{ levelList[curIndex].send_balance }}元红包</text>
					</view>
				</view>
				<view class="gift-itme" v-if="levelList[curIndex].send_coupon" @click="openCoupon(levelList[curIndex].send_coupon)">
					<image :src="$util.img('public/uniapp/level/coupon.png')" mode="aspectFit"></image>
					<view class="gift-content">
						<text>优惠券礼包</text>
						<text class="gift-desc">赠送{{ levelList[curIndex].coupon_length }}张优惠券</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 优惠券 -->
		<uni-popup ref="couponPopup" type="bottom">
			<view class="coupon-popup-box">
				<view class="coupon-popup-title" @click="closeCoupon">
					优惠券
					<text class="iconfont iconclose"></text>
				</view>
				<scroll-view class="coupon-popup-content" scroll-y>
					<view class="coupon-item" v-for="(item, index) in couponPopList" :key="index">
						<view class="coupon-name">
							<text class="name">{{ item.coupon_name }}</text>
							<text class="desc"></text>
						</view>
						<view class="coupon-price" v-if="item.type == 'reward'">
							<text>{{ item.money }}</text>
							元
						</view>
						<view class="coupon-price" v-if="item.type == 'discount'">
							<text>{{ $util.numberFixed(item.discount, 1) }}</text>
							折
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>

		<to-top v-if="showTop" @toTop="scrollToTopNative()"></to-top>
		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
import nsProgress from '@/components/ns-progress/ns-progress.vue';
import toTop from '@/components/toTop/toTop.vue';
import scroll from '@/common/js/scroll-view.js';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
	components: {
		nsProgress,
		toTop,
		uniPopup
	},
	mixins: [scroll],
	data() {
		return {
			couponPopList: [],
			curIndex: 0,
			descIndex: 0,
			isDescAnimating: false,
			scaleX: (634 / 540).toFixed(4),
			scaleY: (378 / 330).toFixed(4),
			swiperConfig: {
				indicatorDots: false,
				indicatorColor: 'rgba(255, 255, 255, .4)',
				indicatorActiveColor: 'rgba(255, 255, 255, 1)',
				interval: 3000,
				duration: 300,
				circular: false,
				previousMargin: '58rpx',
				nextMargin: '58rpx'
			},
			levelList: [
				{
					needGrowth: 0,
					growth: 0
				}
			],
			levelId: 0,
			growth: 0,

			nowIndex: 0, //我当前所在等级的index
			userInfo: {},
			rule: [] //成长值规则
		};
	},
	computed: {
		listLen() {
			return this.levelList.length;
		},
		remark() {
			if (this.levelList[this.curIndex]) {
				return this.levelList[this.curIndex].remark;
			}
		},
		baseColor() {
			return this.$store.state.baseColor;
		},
		nextIndex() {
			let num = 0;
			if (this.curIndex == this.levelList.length - 1) {
				return this.curIndex;
			} else {
				return this.curIndex + 1;
			}
		},
		storeToken() {
			return this.$store.state.token;
		}
	},
	onLoad() {
		this.getLevelRule();
		if (!uni.getStorageSync('token')) {
			setTimeout(() => {
				this.$refs.login.open('/pages_tool/member/level');
			});
		} else {
			this.getLevelList();
		}
	},
	onShow() {
		
		
	},
	filters: {
		rate(index, list, growth) {
			let nowGrowth = Number(growth);
			let minGrouth = Number(list[index].growth);
			if (index == list.length - 1) {
				return nowGrowth > minGrouth ? 100 : 0;
			} else {
				let maxGrouth = Number(list[index + 1].growth);
				let num2 = nowGrowth - minGrouth;
				let num1 = maxGrouth - minGrouth;
				let num = Math.floor((num2 / num1) * 100);
				return num > 100 ? 100 : num;
			}
		}
	},
	methods: {
		swiperChange(e) {
			let that = this;
			this.curIndex = e.detail.current;
			this.isDescAnimating = true;
			let timer = setTimeout(function() {
				that.descIndex = e.detail.current;
				clearTimeout(timer);
			}, 150);
		},
		animationfinish(e) {
			this.isDescAnimating = false;
		},
		getBannerDetail(index) {
			uni.showLoading({
				title: '将前往详情页面',
				duration: 2000,
				mask: true
			});
		},
		getLevelList() {
			this.$api.sendRequest({
				url: '/api/memberlevel/lists',
				success: res => {
					if (res.data && res.code == 0) {
						this.levelList = res.data;
						for (var i = 0; i < this.levelList.length; i++) {
							if (this.levelList[i].send_coupon) {
								this.levelList[i].coupon_length = this.levelList[i].send_coupon.split(',').length;
							}
						}
						this.getMemberInfo();
					} else {
						this.$util.showToast({
							title: res.message
						});
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				}
			});
		},
		getLevelRule() {
			this.$api.sendRequest({
				url: '/api/member/accountrule',
				success: res => {
					if (res.code == 0 && res.data && res.data.growth) {
						this.rule = res.data.growth;
					}
				}
			});
		},
		getMemberInfo() {
			this.$api.sendRequest({
				url: '/api/member/info',
				success: res => {
					if (res.data && res.code == 0) {
						this.levelId = res.data.member_level;
						this.growth = res.data.growth;
						this.userInfo = res.data;
						this.levelList.forEach((v, i) => {
							if (v.level_id == res.data.member_level) {
								this.curIndex = i;
								this.descIndex = i;
								this.nowIndex = i;
								return;
							}
						});
						this.levelList.forEach((v, i) => {
							if (parseFloat(v.growth) < parseFloat(this.growth)) {
								v.needGrowth = 0;
								v.rate = 100;
							} else {
								v.needGrowth = (parseFloat(v.growth) - parseFloat(this.growth)).toFixed(2);
								v.rate = (this.growth / v.growth).toFixed(2) * 100;
							}
						});

						this.levelList.forEach(v => {
							if (v.consume_discount) {
								v.consume_discount = (v.consume_discount / 10).toFixed(2);
							}
						});
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
		growthRules() {
			this.$util.redirectTo('/pages_tool/member/level_growth_rules');
		},
		openCoupon(data) {
			this.couponPopList = [];
			this.$api.sendRequest({
				url: '/coupon/api/coupon/couponbyid',
				data: {
					id: data
				},
				success: res => {
					if (res.code >= 0) {
						this.couponPopList = res.data;
					}
				}
			});
			this.$refs.couponPopup.open();
		},
		closeCoupon() {
			this.$refs.couponPopup.close();
		}
	},
	onBackPress(options) {
		if (options.from === 'navigateBack') {
			return false;
		}
		this.$util.redirectTo('/pages/member/index', {}, 'reLaunch');
		return true;
	},
	watch: {
		storeToken: function(nVal, oVal) {
			if (nVal) {
				this.getLevelList();
			}
		}
	}
};
</script>

<style lang="scss">
@import './public/css/level.scss';
</style>
