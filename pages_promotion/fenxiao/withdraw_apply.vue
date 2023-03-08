<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="container">
		<view class="empty-box"></view>
		<view class="withdraw-wrap" :class="{'ios': !$util.isAndroid()}">
			<view class="title">{{ fenxiaoWords.account }}将{{ fenxiaoWords.withdraw }}到余额</view>
			<view class="money-wrap">
				<text class="unit">{{ $lang('common.currencySymbol') }}</text>
				<input type="digit" class="withdraw-money" v-model="withdrawMoney" />
			</view>
			<view class="bootom">
				<view>
					<text class="color-tip">
						可{{ fenxiaoWords.withdraw }}{{ fenxiaoWords.account }}：{{ $lang('common.currencySymbol') }}{{ fenxiaoInfo.account | moneyFormat }}
					</text>
				</view>
			</view>
		</view>
		<view class="desc">
			<text>最小{{ fenxiaoWords.withdraw }}金额为{{ $lang('common.currencySymbol') }}{{ withdrawConfig.withdraw | moneyFormat }}</text>
		</view>
		<view class="btn color-base-bg color-base-border" :class="{ disabled: withdrawMoney == '' || withdrawMoney == 0 }" @click="withdraw">
			{{ fenxiaoWords.withdraw }}到余额
		</view>
		<view class="withdraw-list btn" @click="$util.redirectTo('/pages_promotion/fenxiao/withdraw_list')">
			<view class="color-tip">{{ fenxiaoWords.withdraw + '明细' }}</view>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import fenxiaoWords from 'common/js/fenxiao-words.js';
export default {
	data() {
		return {
			fenxiaoInfo: {
				account: 0
			},
			withdrawConfig: {
				withdraw: 0
			},
			withdrawMoney: '',
			isSub: false
		};
	},
	components: {},
	mixins: [fenxiaoWords],
	onShow() {
		setTimeout( () => {
			if (this.addonIsExist && !this.addonIsExist.fenxiao) {
				this.$util.showToast({
					title: '商家未开启分销',
					mask: true,
					duration: 2000
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
				}, 2000);
				return;
			}
		}, 1000);
		
		
		if(this.fenxiaoWords && this.fenxiaoWords.withdraw)this.$langConfig.title(this.fenxiaoWords.withdraw);

		if (uni.getStorageSync('token')) {
			this.getFenxiaoInfo();
			this.getWithdrawConfig();
		} else {
			this.$util.redirectTo('/pages_tool/login/login', {
				back: '/pages_promotion/fenxiao/withdraw_apply'
			});
		}
	},
	methods: {
		withdraw() {
			if (this.verify()) {
				if (this.isSub) return;
				this.isSub = true;

				// #ifdef MP-WEIXIN
				this.subscribeMessage(() => {
					this.$api.sendRequest({
						url: '/fenxiao/api/withdraw/apply',
						data: {
							money: this.withdrawMoney
						},
						success: res => {
							if (res.code >= 0) {
								this.$util.showToast({
									title: '提现申请成功'
								});
								setTimeout(() => {
									this.$util.redirectTo('/pages_promotion/fenxiao/withdraw_list', {}, 'redirectTo');
								}, 1500);
							} else {
								this.isSub = false;
								this.$util.showToast({ title: res.message });
							}
						},
						fail: res => {
							this.isSub = false;
						}
					});
				});
				// #endif

				// #ifndef MP-WEIXIN
				this.$api.sendRequest({
					url: '/fenxiao/api/withdraw/apply',
					data: {
						money: this.withdrawMoney
					},
					success: res => {
						if (res.code >= 0) {
							this.$util.showToast({
								title: '提现申请成功'
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages_promotion/fenxiao/withdraw_list', {}, 'redirectTo');
							}, 1500);
						} else {
							this.isSub = false;
							this.$util.showToast({ title: res.message });
						}
					},
					fail: res => {
						this.isSub = false;
					}
				});
				// #endif
			}
		},
		verify() {
			if (this.withdrawMoney == '' || this.withdrawMoney == 0 || isNaN(parseFloat(this.withdrawMoney))) {
				this.$util.showToast({ title: '请输入提现金额' });
				return false;
			}
			if (parseFloat(this.withdrawMoney) > parseFloat(this.fenxiaoInfo.account)) {
				this.$util.showToast({ title: '提现金额超出可提现金额' });
				return false;
			}
			if (parseFloat(this.withdrawMoney) < parseFloat(this.withdrawConfig.withdraw)) {
				this.$util.showToast({ title: '提现金额小于最低提现金额' });
				return false;
			}
			return true;
		},
		/**
		 * 获取佣金提现配置
		 */
		getWithdrawConfig() {
			this.$api.sendRequest({
				url: '/fenxiao/api/config/withdraw',
				success: res => {
					if (res.code >= 0) {
						this.withdrawConfig = res.data;
					}
				}
			});
		},
		/**
		 * 获取分销商信息
		 */
		getFenxiaoInfo() {
			this.$api.sendRequest({
				url: '/fenxiao/api/fenxiao/detail',
				success: res => {
					if (res.code >= 0 && res.data) {
						this.fenxiaoInfo = res.data;
						this.$refs.loadingCover.hide();
					} else {
						this.$util.redirectTo('/pages_promotion/fenxiao/apply');
					}
				}
			});
		},
		/**
		 * 微信订阅消息
		 */
		subscribeMessage(callback) {
			this.$api.sendRequest({
				url: '/weapp/api/weapp/messagetmplids',
				data: {
					keywords: 'FENXIAO_WITHDRAWAL_SUCCESS,FENXIAO_WITHDRAWAL_ERROR'
				},
				success: res => {
					if (res.code == 0 && res.data.length) {
						uni.requestSubscribeMessage({
							tmplIds: res.data,
							fail: res => {
								console.log('fail', res);
							},
							complete: () => {
								callback();
							}
						});
					} else {
						callback();
					}
				},
				fail: res => {
					callback();
				}
			});
		}
	},
	onReady() {
		this.$refs.loadingCover.hide();
	}
};
</script>

<style lang="scss">
.container {
	width: 100vw;
	height: 100vh;
	background: $color-bg;
}

.align-right {
	text-align: right;
}

.withdraw-wrap {
	margin: 20rpx 30rpx 0;
	padding: 30rpx;
	border-radius: 10rpx;
	background-color: #fff;
	
	.title {
		font-size: $font-size-base;
		color: $color-tip;
	}

	.money-wrap {
		padding: 20rpx 0;
		border-bottom: 1rpx solid $color-line;
		display: flex;
		align-items: center;
		.unit {
			font-size: 60rpx;
			line-height: 1;
		}
		.withdraw-money {
			height: 70rpx;
			line-height: 70rpx;
			min-height: 70rpx;
			padding-left: 20rpx;
			font-size: 60rpx;
			flex: 1;
			font-weight: 500;
			vertical-align: top;
			display: block;
		}
	}
	&.ios{
		.money-wrap {
			.unit {
				margin-top: 10rpx;
			}
		}
	}

	.bootom {
		display: flex;
		padding-top: 30rpx;

		& > view {
			font-size: $font-size-base;
			line-height: 1;
			flex: 1;
		}
	}
}

.btn {
	margin: 0 30rpx;
	margin-top: 60rpx;
	height: 80rpx;
	line-height: 80rpx;
	border-radius: $border-radius;
	color: var(--btn-text-color);
	text-align: center;

	&.disabled {
		background: #ccc;
		border-color: #ccc;
		color: var(--btn-text-color);
	}
}

.desc {
	margin: 20rpx 40rpx;
	font-size: $font-size-tag;
	color: $color-tip;
}

.withdraw-list {
	border: 2rpx solid $color-disabled;
	text-align: center;
	margin-top: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
