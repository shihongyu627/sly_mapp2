<template>
	<view>
		<view @touchmove.prevent.stop v-if="newgift" class="reward-popup">
			<uni-popup ref="nsNewGift" type="center" :maskClick="false">
				<view class="reward-wrap">
					<view class="newgift-content" :style="{ backgroundImage: 'url(' + $util.img('public/uniapp/new_gift/holiday_polite-bg.png') + ')' }">
						<view class="content-title-holiday">
							<image :src="$util.img('public/uniapp/new_gift/holiday_polite_left.png')" mode="" class="birthday-img-all"></image>
							<view class="font-size-toolbar activity-name">{{ newgift.activity_name }}</view>
							<image :src="$util.img('public/uniapp/new_gift/holiday_polite_right.png')" mode="" class="birthday-img-all"></image>
						</view>
						<view class="content-title-name">Dear {{ userInfo.nickname }}</view>
						<view class="content-title-hint" v-if="newgift.remark">{{ newgift.remark }}</view>
						<view class="content-title-hint" v-else>
							感谢您一直以来的支持，为回馈会员，商城{{ newgift.activity_name ? newgift.activity_name : 'xx' }}节日，为您提供以下福利
						</view>
						<scroll-view scroll-y="true" class="register-box">
							<view :class="introduction > 38 ? 'reward-content' : 'reward-content-two'">
								<view class="content" v-if="newgift.award_list.point > 0">
									<view class="info">
										<text class="num">
											{{ newgift.award_list.point }}
											<text class="type">柚币</text>
										</text>
										<view class="desc">用于参与活动购买商品时抵扣</view>
									</view>
									<view class="tip" @click="closeRewardPopup('1')">立即查看</view>
								</view>
								<view class="content" v-if="newgift.award_list.balance_type == 0 && newgift.award_list.balance > 0">
									<view class="info">
										<text class="num">
											{{ newgift.award_list.balance | int }}
											<text class="type">元红包</text>
										</text>
										<view class="desc">不可提现红包</view>
									</view>
									<view class="tip" @click="closeRewardPopup('2')">立即查看</view>
								</view>
								<view class="content" v-if="newgift.award_list.balance_type == 1 && newgift.award_list.balance_money > 0">
									<view class="info">
										<text class="num">
											{{ newgift.award_list.balance_money | int }}
											<text class="type">元红包</text>
										</text>
										<view class="desc">可提现红包</view>
									</view>
									<view class="tip" @click="closeRewardPopup('2')">立即查看</view>
								</view>
								<block v-if="newgift.award_list.coupon_list.length > 0">
									<block v-for="(item, index) in newgift.award_list.coupon_list" :key="index">
										<view class="content">
											<view class="info">
												<text v-if="item.type == 'reward'" class="num">
													{{ parseFloat(item.money) }}
													<text class="type">元优惠劵</text>
												</text>
												<text v-else-if="item.type == 'discount'" class="num">
													{{ item.discount | int }}
													<text class="type">折</text>
												</text>
												<view class="desc">用于下单时抵现或兑换商品等</view>
											</view>
											<view class="tip" @click="closeRewardPopup('3')">立即查看</view>
										</view>
									</block>
								</block>
							</view>
						</scroll-view>
					</view>
					<view class="close-btn" @click="cancel()">
						<!-- <button type="default" class="btn" @click="getGift">收下福利</button> -->
						<i class="iconfont iconclose btn"></i>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
import uniPopup from '../uni-popup/uni-popup.vue';

export default {
	components: {
		uniPopup
	},
	data() {
		return {
			newgift: {
				flag: false,
				award_list: {
					point: 0,
					coupon_list: {}
				},
				remark: {}
			},
			userInfo: '',
			bgHight: '940rpx !important',
			bytesCount: null,
			leatGift: false
		};
	},
	filters: {
		int(val) {
			var str = String(val);
			var arr = str.split('.');
			if (parseInt(arr[1]) > 0) {
				return str;
			} else {
				return arr[0];
			}
		}
	},
	computed: {
		introduction() {
			let bytesCount = 0;
			for (let i = 0, n = this.newgift.remark.length; i < n; i++) {
				let c = this.newgift.remark.charCodeAt(i);
				if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
					bytesCount += 1;
				} else {
					bytesCount += 2;
				}
			}
			return bytesCount;
		}
	},
	async created() {
		await this.getHolidayGift();
		// await this.getusername();
		//this.getGift()
	},
	methods: {
		getReward() {
			return this.birthday;
		},
		async open() {
			if (this.leatGift) {
				this.$refs.nsNewGift.open();
				await this.getusername();
				await this.getGift();
			} else {
				await this.getusername();
				await this.getHolidayGift();
				await this.getGift();
				this.$refs.nsNewGift.open();
			}
		},
		cancel() {
			this.$refs.nsNewGift.close();
		},
		async getusername() {
			this.userInfo = uni.getStorageSync('userInfo');
			let res = await this.$api.sendRequest({
				url: '/api/member/info',
				async: false
			});
			if (res.code >= 0 && res.data) {
				this.token = uni.getStorageSync('token');
				this.userInfo = res.data;
				uni.setStorageSync('userInfo', this.memberInfo);
				uni.setStorageSync('store', res.data.store_info||{});
				uni.setStorageSync('is_bind_store', res.data.is_bind_store || '');
				// if (this.addonIsExist.supermember && this.memberInfo.member_level_type == 0) this.getMemberCardInfo();
			}
		},
		async getHolidayGift() {
			var res = await this.$api.sendRequest({
				url: '/scenefestival/api/config/config',
				async: false
			});
			if (res.data[0]) {
				this.newgift = res.data[0];
				this.leatGift = true;
			}
			if (res.data[0]) {
				if (this.newgift.award_list.award_type.length <= 1) {
					this.bgHight = '800rpx !important';
				}
			}
			if (res.data[0]) {
				uni.setStorageSync('newgiftflag', res.data[0].flag);
			}
			/* this.$api.sendRequest({
				url: '/scenefestival/api/config/config',
				success: res => {
						if(res.data[0]) {
							this.newgift = res.data[0];
						}
						if(this.newgift){
							if(this.newgift.award_list.award_type.length <= 1) {
								this.bgHight = '800rpx !important';
							}
						}
						if(res.data[0]){
							uni.setStorageSync('newgiftflag',res.data[0].flag);
						}
				}
			}); */
		},
		async getGift() {
			if (this.newgift.flag == true) {
				await this.$api.sendRequest({
					url: '/scenefestival/api/config/receive',
					data: {
						festival_id: this.newgift.festival_id
					},
					success: res => {
						if (res.code >= 0) {
							this.$emit('getData');
							uni.removeStorageSync('newgiftflag');
							this.$util.redirectTo('/pages/member/index', {}, 'reLaunch');
						}
					}
				});
			}
		},
		closeRewardPopup(type) {
			if (type == 1) {
				this.$util.redirectTo('/pages_tool/member/point_detail', {});
				return;
			} else if (type == 2) {
				this.$util.redirectTo('/pages_tool/member/balance_detail', {});
				return;
			} else if (type == 3) {
				this.$util.redirectTo('/pages_tool/member/coupon', {});
				return;
			}
		}
	}
};
</script>

<style scoped>
/deep/ .newgift-content uni-image {
	width: 113rpx !important;
	height: 24rpx !important;
}
/deep/ .reward-popup .uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box{
	max-height: unset!important;
	overflow-y: unset;
}
.register-box /deep/ .uni-scroll-view {
	background: unset !important;
}
.register-box {
	max-height: 300rpx;
	overflow-y: scroll;
	/* margin-top: 610rpx; */
}
</style>

<style lang="scss">
.reward-wrap {
	width: 85vw;
	height: auto;
	.newgift-content {
		width: 100%;
		height: auto;
		background-size: 100%;
		background-repeat: no-repeat;
		padding-bottom: 40rpx;
	}
	.content-title-holiday {
		font-size: $font-size-toolbar;
		font-weight: bold;
		font-family: BDZongYi-A001;
		line-height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		// margin-bottom: 20rpx;
		padding-top: 320rpx;
		line-height: 1;
		.birthday-img-all {
			width: 100rpx;
			height: 20rpx;
		}
		& > view {
			margin: 0 20rpx;
			color: #fff;
			font-weight: bold;
		}
	}
	.content-title-name {
		font-size: $font-size-toolbar;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		text-align: center;
		color: #fff;
		margin: 30rpx 0 40rpx;
		line-height: 1;
	}

	.content-title-hint {
		margin: 0 70rpx 40rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		text-align: center;
		color: #fff;
	}

	.reward-content {
		max-height: 300rpx;
		margin: 0 56rpx;
	}
	.reward-content-two {
		max-height: 360rpx;
		margin: 0 56rpx;
	}
	.head {
		color: #fff;
		text-align: center;
		line-height: 1;
		margin: 20rpx 0;
	}
	& .content:last-child {
		margin-bottom: 0;
	}
	.content {
		display: flex;
		align-items: center;
		padding: 16rpx 26rpx;
		background: #fff;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
		.info {
			flex: 1;
		}
		.tip {
			color: #fa5b14;
			padding: 10rpx 0 10rpx 20rpx;
			width: 60rpx;
			line-height: 1.5;
			letter-spacing: 2rpx;
			border-left: 2rpx dashed #e5e5e5;
		}
		.num {
			font-size: 48rpx;
			color: #fa5b14;
			font-weight: bolder;
			line-height: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			max-width: 300rpx;
		}
		.type {
			font-size: $font-size-tag;
			margin-left: 10rpx;
			line-height: 1;
			font-weight: normal;
			color: #606266;
		}
		.desc {
			margin-top: 8rpx;
			color: $color-tip;
			font-size: $font-size-tag;
			line-height: 1;
		}
	}
	.close-btn {
		text-align: center;
		margin-top: 20rpx;
		z-index: 500;
		.btn {
			/* margin: 0 50rpx;
				background: linear-gradient(90deg,#ff4100,#ff6a00) ;
				border: none; */
			color: #fff;
			font-size: 40rpx;
			// padding: 100px;
			border: 4rpx solid #fff;
			border-radius: 50%;
			padding: 10rpx;
			font-weight: bold;
			width: 40rpx;
			height: 40rpx;
			margin: 0 auto;
			line-height: 40rpx;
		}
	}
}
</style>
