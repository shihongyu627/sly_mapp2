<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="signin">
		<!-- #ifdef H5 -->
		<view class="head-nav color-base-bg"></view>
		<!-- #endif -->
		<view class="sigin-box">
			<view class="sigin-bg"><image :src="$util.img('public/uniapp/signin/bg4.png')" mode="widthFix"></image></view>

			<view class="signin-wrap">
				<view class="member-info">
					<view class="headimg">
						<view class="headimg-img">
							<image
								:src="headimg ? $util.img(headimg) : $util.getDefaultImage().head"
								mode="aspectFill"
								@error="headimg = $util.getDefaultImage().head"
							></image>
						</view>

						<view class="signin-info">
							<view>
								已连续签到
								<text>{{ signDaysSeries }}</text>
								天
							</view>
							<view>{{ hasSign ? '明日' : '今日' }}签到可获得{{ pointTomorrow }}柚币</view>
						</view>
					</view>

					<view class="point-box">
						<text class="point font-size-base">柚币：{{ signPoint }}</text>
					</view>
				</view>

				<view class="signin-days-wrap">
					<view class="signin-desc">连续签到领好礼</view>
					<view class="signin-day-list">
						<view class="signin-day-con">
							<scroll-view class="signin-day-scroll" scroll-with-animation="true" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="'id_' + showDay">
								<block v-for="(item, index) in showSignDays">
									<view :id="'id_' + item.day" class="signin-day-item" v-if="item.day < signDaysSeries || (item.day == signDaysSeries && hasSign == 0)">
										<view class="">第{{ item.day }}天</view>
										<image :src="$util.img('public/uniapp/signin/signed.png')"></image>
									</view>
									<view :id="'id_' + item.day" class="signin-day-item" v-else-if="item.day == signDaysSeries && hasSign == 1" style="background: #FF4544;">
										<view style="color:#fff">第{{ item.day }}天</view>
										<image :src="$util.img('public/uniapp/signin/sginin.png')"></image>
									</view>
									<view :id="'id_' + item.day" class="signin-day-item" v-else-if="$util.inArray(item.day, rewardRuleDay) != -1">
										<view class="">第{{ item.day }}天</view>
										<image :src="$util.img('public/uniapp/signin/award.png')"></image>
									</view>
									<view :id="'id_' + item.day" class="signin-day-item" v-else>
										<view class="">第{{ item.day }}天</view>
										<image :src="$util.img('public/uniapp/signin/gold1.png')"></image>
									</view>
								</block>
							</scroll-view>
						</view>
					</view>

					<view class="signin-btn">
						<button class="sign-btn" :class="hasSign == 1 || signState == 0 ? 'btn-active' : ''" @click="sign()">{{ hasSign == 1 ? '已签到' : '签到' }}</button>
					</view>
				</view>

				<view class="my-signin">
					<view class="my-signin-title">我的签到</view>

					<view class="my-signin-con">
						<view class="my-signin-item">
							<image :src="$util.img('public/uniapp/signin/bg2.png')"></image>
							<view class="my-signin-item-num">
								<text>{{ signPoint }}</text>
								<text>柚币</text>
							</view>
							<view>累计获得柚币</view>
						</view>
						<view class="my-signin-item">
							<image :src="$util.img('public/uniapp/signin/bg3.png')"></image>
							<view class="my-signin-item-num">
								<text>{{ signGrowth }}</text>
								<text>成长值</text>
							</view>
							<view>累计获得成长值</view>
						</view>
					</view>
				</view>

				<view class="signin-rule">
					<view class="signin-rule-title">
						<image :src="$util.img('public/uniapp/signin/icon2.png')"></image>
						<text>签到规则</text>
						<image :src="$util.img('public/uniapp/signin/icon1.png')"></image>
					</view>

					<view class="signin-rule-con">
						<view class="rule-item" v-for="(item, index) in rule" :key="index">
							<block v-if="index == 0">1. 每日签到奖励：</block>
							<block v-else>{{ index + 1 + '. 连续签到' + item.day + '天额外奖励：' }}</block>
							<text v-if="item.point">{{ item.point + '柚币 ' }}</text>
							<text v-if="item.growth">{{ item.growth + '成长值' }}</text>
						</view>

						<view class="rule-item">{{ rule.length + 1 }}.连续签到{{ cycle }}天为一个周期，连续签到天数签满一个周期或者签到中断，将清空连签天数重新计算签到天数</view>
						<view class="rule-item">
							{{ rule.length + 2 }}. 用户可在签到页每日签到一次，签到后可获得每日签到奖励；连续签到天数达到连签奖励的当天，可额外获得连签奖励
						</view>
					</view>
				</view>
			</view>
		</view>

		<view @touchmove.prevent.stop>
			<uni-popup ref="uniPopup" type="center" class="wap-floating" :maskClick="false">
				<view class="popup-box" @click="close()">
					<text class="iconfont iconclose" @click="$refs.uniPopup.close()"></text>
					<image class="pic" :src="$util.img('public/uniapp/signin/bg1.png')"></image>
					<view class="popup-content">
						<view class="popup-content-wrap">
							<view class="title" v-if="successTip.point || successTip.growth">
								<text>恭喜您获得</text>
								<text v-if="successTip.point">
									<text class="num color-base-text">{{ successTip.point }}</text>
									柚币
								</text>
								<text v-if="successTip.growth">
									<text class="num color-base-text">{{ successTip.growth }}</text>
									成长值
								</text>
							</view>
							<view class="desc">连续签到可获得更多奖励！</view>
						</view>
						<view class="other-info color-base-bg" @click="$refs.uniPopup.close()">知道了</view>
					</view>
				</view>
			</uni-popup>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>

		<ns-login ref="login"></ns-login>
	</view>
</template>
<script>
import uniCalender from '@/components/uni-calendar/uni-calendar.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import signIn from './public/js/signin.js';
import Calendar from '@/components/uni-calendar/util.js';
export default {
	components: {
		uniPopup,
		uniCalender
	},
	data() {
		return {
			isIphoneX: false,
			showSignDays: [] // 一共展示的天数
		};
	},
	onLoad(option) {
		setTimeout( () => {
			if (this.addonIsExist && !this.addonIsExist.membersignin) {
				this.$util.showToast({
					title: '商家未开启会员签到',
					mask: true,
					duration: 2000
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
				}, 2000);
				return;
			}
		}, 1000);
		 
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		if (option.back) this.back = option.back;
		if (option.redirect) this.redirect = option.redirect;
		this.getRule();
		this.getSignState();
	},
	computed: {
		storeToken() {
			return this.$store.state.token;
		}
	},
	onShow() {
		
		this.getSignPointData();
		this.getSignGrowthData();

		if (uni.getStorageSync('token')) {
			this.getSignInfo();
			this.getIsSign();
		} else {
			setTimeout(() => {
				this.$refs.login.open('/pages_tool/member/signin');
			});
		}
	},
	mixins: [signIn],
	watch: {
		storeToken: function(nVal, oVal) {
			if (nVal) {
				this.getSignInfo();
				this.getIsSign();
			}
		}
	}
};
</script>
<style lang="scss">
uni-page-body,
uni-page-refresh {
	height: 100%;
}

.iphontX-top {
	top: 1160;
}

.signin {
	position: relative;
	height: 100%;

	.head-nav {
		width: 100%;
		height: var(--status-bar-height);
	}

	.head-nav.active {
		padding-top: 40rpx;
	}

	.sigin-box {
		position: relative;
	}

	.sigin-bg {
		width: 100%;
		position: absolute;
		top: 0;
		z-index: 1;

		image {
			width: 100%;
		}
	}

	.signin-wrap {
		padding: 0 30rpx;
	}

	.member-info {
		position: relative;
		z-index: 9;
		padding: 74rpx 0 55rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.headimg {
			display: flex;
			align-items: center;

			.headimg-img {
				width: 100rpx;
				height: 100rpx;
				background: #fff;
				border: 2px solid #fff;
				border-radius: 50%;
				overflow: hidden;
				margin-right: 20rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.signin-info {
				view {
					color: #ffffff;
					font-size: $font-size-base;
					line-height: 1;

					&:first-child {
						margin-bottom: 18rpx;

						text {
							color: #fffc00;
						}
					}
				}
			}
		}

		.point-box {
			display: flex;
			align-items: center;
			height: 68rpx;
			padding: 13rpx 20rpx 13rpx 15rpx;
			box-sizing: border-box;

			image {
				width: 42rpx;
				height: 42rpx;
			}

			.point {
				margin-left: 14rpx;
				font-size: $font-size-toolbar;
				color: #ffffff;
			}
		}
	}

	.signin-days-wrap {
		position: relative;
		z-index: 9;
		background-color: #ffffff;
		border-radius: 10rpx;
		padding: 30rpx 0 160rpx;
		position: relative;

		.signin-desc {
			font-size: 30rpx;
			line-height: 1;
			padding: 0 30rpx;
		}

		.signin-day-list {
			margin-top: 30rpx;
			display: flex;
			justify-content: space-between;
			padding: 0 20rpx;

			.signin-day-con {
				width: 100%;
			}

			.signin-day-scroll {
				display: flex;
				flex-wrap: nowrap;
				width: 100%;
				flex-direction: row;
				white-space: nowrap;
				line-height: 1;

				.signin-day-item {
					flex-shrink: 0;
					margin-right: calc((100% - 85rpx * 7) / 6);

					&:last-child {
						margin-right: 0;
					}

					image {
						width: 52rpx;
						height: 52rpx;
						margin-top: 13rpx;
					}
				}

				.reward {
					image {
						width: 100%;
						height: 100%;
						margin-top: 0;
					}
				}
			}

			.signin-day-item {
				display: inline-block;
				width: 85rpx;
				height: 103rpx;
				border-radius: 4rpx;
				text-align: center;
				background-color: #f6f6fb;
				flex-shrink: 0;

				view {
					font-size: 22rpx;
					line-height: 1;
					margin-top: 15rpx;
				}

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.signin-btn {
			position: absolute;
			width: 100%;
			height: 80rpx;
			bottom: 40rpx;
			text-align: center;

			button {
				display: inline-block;
				width: 442rpx;
				height: 100%;
				color: #ffffff;
				background-color: #ff4544;
			}

			.btn-active {
				color: $color-title;
				background-color: #e1e1e1;
			}
		}
	}

	.my-signin {
		padding: 30rpx;
		margin-top: 68rpx;
		background-color: #ffffff;
		border-radius: 10rpx;

		.my-signin-title {
			font-size: 30rpx;
			line-height: 1;
		}

		.my-signin-con {
			display: flex;
			justify-content: space-between;
			margin-top: 20rpx;
		}

		.my-signin-item {
			width: 300rpx;
			height: 133rpx;
			position: relative;

			image {
				width: 300rpx;
				height: 133rpx;
				position: absolute;
				top: 0;
				left: 0;
			}

			.my-signin-item-num {
				position: relative;
				z-index: 9;
				padding: 36rpx 17rpx 0;
				line-height: $font-size-toolbar;

				text:first-child {
					font-size: $font-size-toolbar;
					color: #ffffff;
				}

				text:last-child {
					font-size: $font-size-activity-tag;
					color: #ffffff;
				}
			}

			view:last-child {
				position: relative;
				z-index: 9;
				padding-left: 17rpx;
				color: #ffffff;
				font-size: $font-size-activity-tag;
				line-height: 1;
				margin-top: 16rpx;
			}
		}
	}

	.signin-rule {
		margin-top: 55rpx;

		.signin-rule-title {
			display: flex;
			align-items: center;
			justify-content: center;
			line-height: $font-size-toolbar;

			image {
				width: 21rpx;
				height: 14rpx;
			}

			text {
				margin: 0 21rpx;
				font-size: $font-size-toolbar;
			}
		}

		.signin-rule-con {
			margin-top: 52rpx;
			padding: 0 38rpx;

			.rule-item {
				font-size: $font-size-tag;
				color: $color-sub;
			}
		}
	}
}

.popup-box {
	position: relative;
	top: 0;
	display: flex;
	flex-direction: column;
	align-items: center;

	.iconclose {
		display: block;
		width: 42rpx;
		height: 42rpx;
		border: 1px solid #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		color: #fff;
		position: absolute;
		top: 70rpx;
		right: 0;
	}

	.pic {
		width: 274rpx;
		height: 200rpx;
		position: relative;
		margin-bottom: -30rpx;
	}

	.popup-content {
		background: #ffffff;
		width: 70vw;
		margin-top: -100rpx;
		border-radius: 20rpx;
		padding: 0 60rpx;
		padding-bottom: 40rpx;
		box-sizing: border-box;
		background-size: 100% 100rpx;
	}

	.popup-content-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;

		.title {
			font-size: $font-size-base;
			margin-top: 160rpx;
			color: #999;

			.num {
				font-size: 32rpx;
			}
		}

		.desc {
			color: #999;
			font-size: $font-size-tag;
		}
	}

	.other-info {
		width: 300rpx;
		height: 70rpx;
		border-radius: 10rpx;
		margin: 0 auto;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 40rpx;
	}
}
</style>

<style scoped>
.wap-floating >>> .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: none !important;
	display: flex !important;
	flex-direction: column !important;
	align-items: center !important;
}
</style>
