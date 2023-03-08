<template>
	<view>
		<view @touchmove.prevent.stop v-if="reward" class="reward-popup">
			<uni-popup ref="registerReward" type="center" :maskClick="false">
				<view class="reward-wrap">
					<image :src="$util.img('public/uniapp/register_reward/register_reward_img.png')" mode="widthFix" class="bg-img-head"></image>
					<image :src="$util.img('public/uniapp/register_reward/register_reward_money.png')" mode="widthFix" class="bg-img-money"></image>
					<image :src="$util.img('public/uniapp/register_reward/register_reward_head.png')" mode="widthFix" class="bg-img"></image>
					<view class="wrap">
						<view>
							<scroll-view scroll-y="true" class="register-box">
								<view class="reward-content">
									<view class="reward-item" v-if="reward.point > 0">
										<view class="head">柚币奖励</view>
										<view class="content">
											<view class="info">
												<view>
													<text class="num">{{ reward.point }}</text>
													<text class="type">柚币</text>
												</view>
												<view class="desc">用于下单时抵现或兑换商品等</view>
											</view>
											<view class="tip" @click="closeRewardPopup('point')">立即查看</view>
										</view>
									</view>
									<view class="reward-item" v-if="reward.growth > 0">
										<view class="head">成长值</view>
										<view class="content">
											<view class="info">
												<view>
													<text class="num">{{ reward.growth }}</text>
													<text class="type">成长值</text>
												</view>
												<view class="desc">用于提升会员等级</view>
											</view>
											<view class="tip" @click="closeRewardPopup('growth')">立即查看</view>
										</view>
									</view>
									<view class="reward-item" v-if="reward.balance > 0">
										<view class="head">红包奖励</view>
										<view class="content">
											<view class="info">
												<view>
													<text class="num">{{ reward.balance }}</text>
													<text class="type">元</text>
												</view>
												<view class="desc">不可提现下单时可用</view>
											</view>
											<view class="tip" @click="closeRewardPopup('balance')">立即查看</view>
										</view>
									</view>
									<view class="reward-item" v-if="reward.coupon_list.length > 0">
										<view class="head">优惠券奖励</view>
										<view class="content" v-for="(item, index) in reward.coupon_list" :key="index">
											<view class="info">
												<view>
													<text class="num coupon-name">{{ item.coupon_name }}</text>
												</view>
												<view class="desc" v-if="item.at_least > 0">
													满{{ item.at_least }}{{ item.type == 'discount' ? '打' + item.discount + '折' : '减' + item.money }}
												</view>
												<view class="desc" v-else>无门槛，{{ item.type == 'discount' ? '打' + item.discount + '折' : '减' + item.money }}</view>
											</view>
											<view class="tip" @click="closeRewardPopup('coupon')">立即查看</view>
										</view>
									</view>
								</view>
							</scroll-view>
						</view>
					</view>
					<view class="close-btn" @click="closeRewardPopup()"><i class="iconfont iconclose"></i></view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
import uniPopup from '../uni-popup/uni-popup.vue';

// 注册奖励弹出层
export default {
	name: 'register-reward',
	components: {
		uniPopup
	},
	data() {
		return {
			reward: null,
			back: ''
		};
	},
	created() {
		if (this.addonIsExist.memberregister) {
			// this.getLoginReward()
			this.getRegisterReward();
		}
	},
	methods: {
		getReward() {
			return this.reward;
		},
		open(back) {
			this.back = back;
			// console.log('open', this.back);
			this.$refs.registerReward.open();
		},
		cancel() {
			this.$refs.registerReward.close();
		},
		/* getLoginReward() {
			var tokenT = uni.getStorageSync('token')
			console.log(tokenT)
			this.$api.sendRequest({
				url: '/memberregister/api/receivegift/info',
				data:{
					token:tokenT
				},
				success: res => {
					console.log(res)
				}
			});
		}, */
		/**
		 * 获取新人礼配置
		 */
		getRegisterReward() {
			this.$api.sendRequest({
				url: '/memberregister/api/Config/Config',
				success: res => {
					if (res.code >= 0) {
						let data = res.data;
						if (data.is_use == 1 && (data.value.point > 0 || data.value.balance > 0 || data.value.growth > 0 || data.value.coupon_list.length > 0)) {
							this.reward = data.value;
						}
					}
				}
			});
		},

		/* getUpdateInfo(){
			this.$api.sendRequest({
				url: '/memberregister/api/receivegift/updateInfo',
				success: res => {
					console.log(res)
				}
			});
		}, */
		closeRewardPopup(type) {
			// this.getUpdateInfo()
			this.$refs.registerReward.close();

			switch (type) {
				case 'point':
					this.$util.redirectTo('/pages_tool/member/point_detail', {});
					break;
				case 'balance':
					this.$util.redirectTo('/pages_tool/member/balance_detail', {});
					break;
				case 'growth':
					this.$util.redirectTo('/pages_tool/member/level', {});
					break;
				case 'coupon':
					this.$util.redirectTo('/pages_tool/member/coupon', {});
					break;
				default:
					// console.log('链接', this.back);
					if (this.back != '') {
						this.$util.redirectTo(this.back, {}, 'reLaunch');
					} else {
						this.$util.redirectTo('/pages/member/index', {}, 'reLaunch');
					}
			}
		}
	}
};
</script>
<style scoped>
.register-box /deep/ .uni-scroll-view {
	background: unset !important;
}

.register-box {
	max-height: 630rpx;
	overflow-y: scroll;
}
.register-box /deep/.uni-popup__wrapper-box {
	overflow: unset !important;
}
</style>

<style lang="scss">
.uni-popup__wrapper-box {
	overflow: unset !important;
}
.close-btn {
	text-align: center;
	margin-top: 20rpx;
	.iconfont {
		color: #fff;
		font-size: 40rpx;
	}
}
.reward-wrap {
	width: 80vw;
	height: auto;
	position: relative;
	// padding-top: 150rpx;

	& > uni-image,
	.bg-img {
		width: 100%;
		will-change: transform;
	}
	.bg-img-head {
		position: absolute;
		top: -150rpx;
		width: 100vw;
		left: -10vw;
	}
	.bg-img-money {
		position: absolute;
		width: 93vw;
		left: -48rpx;
		top: 100rpx;
		z-index: 10;
	}

	.wrap {
		width: calc(100% - 2rpx);
		height: 100%;
		background-color: #ef3030;
		margin-top: -80rpx;
		padding-bottom: 30rpx;
		border-bottom-left-radius: 10rpx;
		border-bottom-right-radius: 10rpx;
		& > view {
			position: relative;
		}
	}

	.reward-content {
		margin: 0 50rpx 0 50rpx;
	}

	.reward-item {
		.head {
			color: #fff;
			text-align: center;
			line-height: 1;
			margin: 20rpx 0;
		}

		.content {
			display: flex;
			padding: 16rpx 26rpx;
			background: #fff;
			border-radius: 10rpx;
			margin-bottom: 10rpx;
			.info {
				flex: 1;
			}

			.tip {
				color: #ff222d;
				padding: 10rpx 0 10rpx 30rpx;
				width: 70rpx;
				line-height: 1.5;
				letter-spacing: 2rpx;
				border-left: 2rpx dashed #e5e5e5;
			}

			.num {
				font-size: 52rpx;
				color: #ff222d;
				font-weight: bolder;
				line-height: 1;
			}
			.coupon-name {
				font-size: 38rpx;
			}

			.type {
				font-size: $font-size-base;
				margin-left: 10rpx;
				line-height: 1;
			}

			.desc {
				margin-top: 8rpx;
				color: $color-tip;
				font-size: $font-size-tag;
				line-height: 1;
			}
		}
	}

	.btn {
		position: absolute;
		width: calc(100% - 100rpx);
		bottom: 40rpx;
		left: 50rpx;

		.btn-img {
			width: 100%;
		}
	}
}
</style>
