<template>
	<view>
		<!-- 选择支付方式弹窗 -->
		<uni-popup ref="choosePaymentPopup" type="center" v-if="payInfo" :mask-click="false">
			<view class="choose-payment-popup popup" @touchmove.prevent.stop>
				<view class="popup-header">
					<text class="tit">支付方式</text>
					<text class="iconfont iconclose" @click="close()"></text>
				</view>
				<scroll-view scroll-y="true" class="popup-body">
					<view class="pay-money">
						<text class="money">支付金额{{ payMoney|moneyFormat }}元</text>
					</view>

					<view class="payment-item" v-if="balanceDeduct > 0 && balanceUsable && balanceConfig == 1">
						<view class="iconfont iconyue"></view>
						<view class="info-wrap">
							<text class="name">余额抵扣</text>
							<view class="money">可用¥{{ balanceDeduct|moneyFormat }}</view>
						</view>
						<ns-switch class="balance-switch" @change="useBalance" :checked="isBalance == 1"></ns-switch>
					</view>
					<block v-if="payMoney > 0">
						<block v-if="payTypeList.length">
							<view class="payment-item" v-for="(item, index) in payTypeList" :key="index"
								@click="payIndex = index">
								<view class="iconfont" :class="item.icon"></view>
								<text class="name">{{ item.name }}</text>
								<text class="iconfont"
									:class="payIndex == index ? 'iconyuan_checked color-base-text' : 'iconcheckboxblank'"></text>
							</view>
						</block>
						<block v-else>
							<view class="empty">平台尚未配置支付方式！</view>
						</block>
					</block>
				</scroll-view>
				<view class="popup-footer">
					<view class="confirm-btn color-base-bg" @click="confirm()">确认支付</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<!-- 新版支付组件 订单表为order表 的订单支付时使用该组件 -->
<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import nsSwitch from '@/components/ns-switch/ns-switch.vue';

	// #ifdef H5
	import {
		Weixin
	} from 'common/js/wx-jssdk.js';
	// #endif
	
	export default {
		name: 'payment',
		components: {
			uniPopup,
			nsSwitch
		},
		props: {
			// 是否可用余额支付
			balanceUsable: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				payIndex: 0,
				// #ifdef H5
				payTypeList: [{
						name: '支付宝支付',
						icon: 'iconzhifubaozhifu-',
						type: 'alipay'
					},
					{
						name: '微信支付',
						icon: 'iconweixin1',
						type: 'wechatpay'
					}
				],
				timer: null,
				// #endif
				// #ifdef MP-WEIXIN
				payTypeList: [{
					name: '微信支付',
					provider: 'wxpay',
					icon: 'iconweixin1',
					type: 'wechatpay'
				}],
				// #endif
				payInfo: null,
				balanceConfig: 0,
				// 预售页面判断
				sale: true,
				isBalance: 0,
				balance: 0
			};
		},
		created(e) {
			this.getPayType();
			if (this.balanceUsable) this.getBalanceConfig();
		},
		computed: {
			balanceDeduct() {
				let money = 0;
				if (this.payInfo && this.balance) {
					money = this.balance > this.payInfo.pay_money ? this.payInfo.pay_money : this.balance;
				}
				return money;
			},
			payMoney() {
				let money = 0;
				if (this.payInfo) {
					money = this.payInfo.pay_money;
					if (this.balanceDeduct && this.isBalance && this.balanceUsable) {
						money = this.payInfo.pay_money - this.balanceDeduct;
					}
				}
				return money;
			}
		},
		methods: {
			close() {
				this.$emit('close');
				this.$refs.choosePaymentPopup.close();
			},
			// 使用余额
			useBalance() {
				this.isBalance = this.isBalance ? 0 : 1;
				this.$emit('useBalance', this.isBalance)
			},
			confirm() {
				if (this.payTypeList.length == 0 && this.payMoney > 0) {
					this.$util.showToast({
						title: '请选择支付方式！'
					});
					return;
				}
				uni.showLoading({
					title: '支付中...',
					mask: true
				});
				this.pay();
				uni.setStorageSync('pay_flag', 1);
			},
			getPayInfo(out_trade_no) {
				this.$api.sendRequest({
					url: '/api/pay/info',
					data: {
						out_trade_no
					},
					success: res => {
						if (res.code >= 0 && res.data) {
							this.payInfo = res.data;
							if (this.balanceConfig && this.balanceUsable) this.getMemberBalance();
							setTimeout(() => {
								this.$refs.choosePaymentPopup.open();
							})
						} else {
							this.$util.showToast({
								title: '未获取到支付信息！'
							});
						}
					}
				});
			},
			/**
			 * 获取余额配置
			 */
			getBalanceConfig() {
				this.$api.sendRequest({
					url: '/api/pay/getBalanceConfig',
					data: {},
					success: res => {
						this.balanceConfig = res.data.balance_show;
					}
				});
			},
			/**
			 * 获取用户余额
			 */
			getMemberBalance() {
				this.$api.sendRequest({
					url: '/api/memberaccount/usablebalance',
					success: res => {
						if (res.code == 0 && res.data) {
							this.balance = parseFloat(res.data.usable_balance);
						}
					}
				})
			},
			/**
			 * 查询支付方式
			 */
			getPayType() {
				this.$api.sendRequest({
					url: '/api/pay/type',
					success: res => {
						if (res.code == 0) {
							if (res.data.pay_type == '') {
								this.payTypeList = [];
							} else {
								this.payTypeList.forEach((val, key) => {
									if (res.data.pay_type.indexOf(val.type) == -1) {
										this.payTypeList.splice(key, 1);
									}
								});
							}
						}
					}
				});
			},
			// #ifdef H5
			pay() {
				var payType = this.payTypeList[this.payIndex];
				var return_url = '';
				if (this.payInfo.event == 'BlindboxGoodsOrderPayNotify') {
					return_url = '/pages_promotion/blindbox/index?outTradeNo=';
				} else {
					return_url = '/pages_tool/pay/result?code=';
				}
				this.$api.sendRequest({
					url: '/api/pay/pay',
					data: {
						out_trade_no: this.payInfo.out_trade_no,
						pay_type: payType ? payType.type : '',
						return_url: encodeURIComponent(this.$config.h5Domain + return_url + this.payInfo
							.out_trade_no),
						is_balance: this.isBalance
					},
					success: res => {
						uni.hideLoading();
						if (res.code >= 0) {
							if (res.data.pay_success) {
								this.paySuccess();
								return;
							}
							switch (payType.type) {
								case 'alipay':
									if (this.$util.isWeiXin()) {
										var wx_alipay = encodeURIComponent(res.data.data);
										this.$util.redirectTo('/pages_tool/pay/wx_pay', {
											wx_alipay: wx_alipay,
											out_trade_no: this.payInfo.out_trade_no
										}, '', 'redirectTo');
									} else {
										location.href = res.data.data;
										this.checkPayStatus();
									}
									break;
								case 'wechatpay':
									if (this.$util.isWeiXin()) {
										if (uni.getSystemInfoSync().platform == 'ios') {
											var url = uni.getStorageSync('initUrl');
										} else {
											var url = location.href;
										}
										// 获取jssdk配置
										this.$api.sendRequest({
											url: '/wechat/api/wechat/jssdkconfig',
											data: {
												url: url
											},
											success: jssdkRes => {
												var wxJS = new Weixin(),
													payData = res.data.data;
												wxJS.init(jssdkRes.data);
												wxJS.pay({
														timestamp: payData.timestamp ? payData.timestamp : payData.timeStamp,
														nonceStr: payData.nonceStr,
														package: payData.package,
														signType: payData.signType,
														paySign: payData.paySign
													},
													res => {
														if (res.errMsg == 'chooseWXPay:ok') {
															this.paySuccess();
														} else {
															this.$util.showToast({
																title: res.errMsg
															});
															setTimeout(() => {
																this.close();
															}, 1500)
														}
													},
													res => {
														this.$util.showToast({
															title: '您已取消支付'
														});
														this.resetpay();
													}
												);
											}
										});
									} else {
										location.href = res.data.url;
										this.checkPayStatus();
									}
									break;
							}
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					},
					fail: res => {
						uni.hideLoading();
						this.$util.showToast({
							title: 'request:fail'
						});
					}
				});
			},
			checkPayStatus() {
				this.timer = setInterval(() => {
					this.$api.sendRequest({
						url: '/api/pay/status',
						data: {
							out_trade_no: this.payInfo.out_trade_no
						},
						success: res => {
							if (res.code == 0) {
								if (res.data.pay_status == 2) {
									clearInterval(this.timer);
									this.paySuccess();
								}
							} else {
								clearInterval(this.timer);
							}
						}
					});
				}, 1000);
			},
			// #endif
			// #ifdef MP-WEIXIN
			pay() {
				var payType = this.payTypeList[this.payIndex];
				this.$api.sendRequest({
					url: '/api/pay/pay',
					data: {
						out_trade_no: this.payInfo.out_trade_no,
						pay_type: payType ? payType.type : '',
						scene: uni.getStorageSync('is_test') ? 1175 : wx.getLaunchOptionsSync().scene,
						is_balance: this.isBalance
					},
					success: res => {
						uni.hideLoading();
						if (res.code >= 0) {
							if (res.data.pay_success) {
								this.paySuccess();
								return;
							}
							var payData = res.data.data;
							var scene = uni.getStorageSync('is_test') ? 1175 : wx.getLaunchOptionsSync().scene;
							if([1175, 1176, 1177, 1191, 1195].indexOf(scene) != -1){
								uni.requestOrderPayment({
									timeStamp: payData.timeStamp,
									nonceStr: payData.nonceStr,
									package: payData.package,
									signType: payData.signType,
									paySign: payData.paySign,
									success: res => {
										this.paySuccess();
									},
									fail: res => {
										this.flag = false;
										if (res.errMsg == 'requestOrderPayment:fail cancel') {
											this.$util.showToast({
												title: '您已取消支付'
											});
											this.resetpay();
										} else {
											uni.showModal({
												content: '支付失败,失败原因: ' + res.errMsg,
												showCancel: false
											});
											setTimeout(() => {
												this.close();
											}, 1500)
										}
									}
								});
							}else{
								uni.requestPayment({
									provider: 'wxpay',
									timeStamp: payData.timeStamp,
									nonceStr: payData.nonceStr,
									package: payData.package,
									signType: payData.signType,
									paySign: payData.paySign,
									success: res => {
										this.paySuccess();
									},
									fail: res => {
										this.flag = false;
										if (res.errMsg == 'requestPayment:fail cancel') {
											this.$util.showToast({
												title: '您已取消支付'
											});
											this.resetpay();
										} else {
											uni.showModal({
												content: '支付失败,失败原因: ' + res.errMsg,
												showCancel: false
											});
											setTimeout(() => {
												this.close();
											}, 1500)
										}
									}
								});
							}
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					},
					fail: res => {
						uni.hideLoading();
						this.$util.showToast({
							title: 'request:fail'
						});
					}
				});
			},
			// #endif
			/**
			 * 支付成功之后跳转
			 */
			paySuccess() {
				this.getMember()
				if (this.payInfo.event == 'BlindboxGoodsOrderPayNotify') {
					this.$util.redirectTo('/pages_promotion/blindbox/index', {
						outTradeNo: this.payInfo.out_trade_no
					}, 'redirectTo');
				} else if(this.payInfo.return_url) {
					if (this.payInfo.return_url.indexOf('http://') != -1 || this.payInfo.return_url.indexOf('https://') != -1) location.replace(this.payInfo.return_url);
					else this.$util.redirectTo(this.payInfo.return_url, {}, 'redirectTo');
				} else {
					this.$util.redirectTo('/pages_tool/pay/result', {
						code: this.payInfo.out_trade_no
					}, 'redirectTo');
				}
			},
			//同步用户信息门店
			getMember() {
				this.$api.sendRequest({
					url: '/api/member/info',
					success: res => {
						if (res.code == 0) {
						
						}
					}
				});
			},
			/**
			 * 重置支付单据
			 */
			resetpay(){	
				this.$api.sendRequest({
					url: '/api/pay/resetpay',
					data: {
						out_trade_no: this.payInfo.out_trade_no,
					},
					success: res => {
						if (res.code == 0) this.getPayInfo(res.data);
					}
				})
			}
		},
		// #ifdef H5
		deactivated() {
			clearInterval(this.timer);
		},
		// #endif
	};
</script>

<style lang="scss" scoped>
	.popup {
		width: 75vw;
		background: #fff;
		border-top-left-radius: $border-radius;
		border-top-right-radius: $border-radius;

		.popup-header {
			display: flex;
			border-bottom: 2rpx solid $color-line;
			position: relative;
			padding: 40rpx;

			.tit {
				flex: 1;
				font-size: $font-size-toolbar;
				line-height: 1;
				text-align: center;
			}

			.iconfont {
				line-height: 1;
				position: absolute;
				right: 30rpx;
				top: 50%;
				transform: translate(0, -50%);
				color: $color-tip;
				font-size: $font-size-toolbar;
			}
		}

		.popup-body {
			height: calc(100% - 250rpx);

			&.safe-area {
				height: calc(100% - 270rpx);
			}
		}

		.popup-footer {
			height: 100rpx;

			.confirm-btn {
				height: 72rpx;
				line-height: 72rpx;
				color: #fff;
				text-align: center;
				margin: 20rpx 30rpx 0;
				border-radius: $border-radius;
			}

			&.bottom-safe-area {
				padding-bottom: constant(safe-area-inset-bottom);
				padding-bottom: env(safe-area-inset-bottom);
			}
		}
	}

	.choose-payment-popup {
		.payment-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 90rpx;
			margin: 0 30rpx;
			border-bottom: 2rpx solid $color-line;
			padding: 20rpx 0;

			&:nth-child(2) {
				padding-top: 0;
			}

			&:last-child {
				border-bottom: none;
			}

			.iconfont {
				font-size: 64rpx;
			}

			.iconyue {
				color: #faa218;
			}

			.iconweixin1 {
				color: #24af41;
			}

			.iconzhifubaozhifu- {
				color: #00a0e9;
			}

			.iconcheckboxblank {
				font-size: 40rpx;
				color: $color-line;
			}

			.iconyuan_checked {
				font-size: 40rpx;
			}

			.name {
				margin-left: 20rpx;
				font-size: $font-size-base;
				flex: 1;
			}

			.info-wrap {
				flex: 1;
				margin-left: 20rpx;

				.name {
					margin-left: 0;
					font-size: $font-size-base;
					flex: 1;
				}

				.money {
					color: $color-tip;
					font-size: $font-size-tag;
				}
			}

			.box {
				flex: 1;
				padding: 0 10rpx;
				line-height: inherit;
				text-align: right;

				input {
					font-size: $font-size-tag !important;
				}
			}

			&.set-pay-password {
				height: initial;

				.box {
					font-size: $font-size-tag !important;
				}
			}
		}
	
	.pay-money {
			text-align: center;
			padding: 20rpx 0 40rpx 0;
			background-color: #fff;
			font-weight: bold;
			margin-top: 30rpx;
			line-height: 1;

			.unit {
				margin-right: 4rpx;
				font-size: $font-size-tag;
			}

			.money {
				font-size: $font-size-toolbar;
			}
		}
	}

	.empty {
		width: 100%;
		text-align: center;
		padding: 40rpx 0;
		color: $color-sub;
		font-size: $font-size-tag;
	}
</style>
