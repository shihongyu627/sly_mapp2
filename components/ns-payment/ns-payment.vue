<template>
	<view>
		<!-- 选择支付方式弹窗 -->
		<uni-popup ref="choosePaymentPopup" type="center" :mask-click="false">
			<view class="choose-payment-popup popup" @touchmove.prevent.stop>
				<view class="popup-header">
					<text class="tit">支付方式</text>
					<text class="iconfont iconclose" @click="close()"></text>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view class="pay-money">
						<!-- <text class="unit">{{ $lang('common.currencySymbol') }}</text> -->
						<text class="money">支付金额{{ payMoney | moneyFormat }}元</text>
					</view>
					<view class="payment-item" v-if="balanceDeduct > 0 && balanceConfig == 1 && sale">
						<view class="iconfont iconyue"></view>
						<view class="info-wrap">
							<text class="name">余额抵扣</text>
							<view class="money">可用¥{{ balanceDeduct }}</view>
						</view>
						<ns-switch class="balance-switch" @change="useBalance" :checked="isBalance == 1"></ns-switch>
					</view>
					<block v-if="payMoney > 0">
						<block v-if="payTypeList.length">
							<view class="payment-item" v-for="(item, index) in payTypeList" :key="index" @click="payIndex = index">
								<view class="iconfont" :class="item.icon"></view>
								<text class="name">{{ item.name }}</text>
								<text class="iconfont" :class="payIndex == index ? 'iconyuan_checked color-base-text' : 'iconcheckboxblank'"></text>
							</view>
						</block>
						<block v-else><view class="empty">平台尚未配置支付方式！</view></block>
					</block>
				</scroll-view>
				<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }"><view class="confirm-btn color-base-bg" @click="confirm()">确认支付</view></view>
			</view>
		</uni-popup>
	</view>
</template>

<!-- 旧版支付组件 订单表不为order表 的订单支付时使用该组件  -->
<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import nsSwitch from '@/components/ns-switch/ns-switch.vue';

// #ifdef H5
import { Weixin } from 'common/js/wx-jssdk.js';
// #endif

export default {
	name: 'ns-payment',
	components: {
		uniPopup,
		nsSwitch
	},
	props: {
		balanceDeduct: {
			type: [Number, String],
			default: ''
		},
		isBalance: {
			type: Number,
			default: 0
		},
		payMoney: {
			type: [Number, String],
			default: 0
		}
	},
	data() {
		return {
			isIphoneX: false,
			payIndex: 0,
			// #ifdef H5
			payTypeList: [
				{
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
			payTypeList: [
				{
					name: '微信支付',
					provider: 'wxpay',
					icon: 'iconweixin1',
					type: 'wechatpay'
				}
			],
			isMatched: 0, // 支付是否需要校验
			// #endif
			payInfo: {},
			balanceConfig : 0,
			// 预售页面判断
			sale:true
		};
	},
	created(e) {
		// #ifdef H5
		let url=window.location.href
		// #endif
		// #ifdef MP-WEIXIN
		let url=getCurrentPages()[getCurrentPages().length-1].route
		// #endif
		let list = url.match('presale/order_list/order_list')
		let detail = url.match('presale/order_detail/order_detail')		
		if(list || detail){
			this.sale=false
		}
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		this.getPayType();
		this.getBalanceConfig();
		// #ifdef MP-WEIXIN
		if (uni.getStorageSync('paySource') == '') this.payIsMatched();
		// #endif
	},
	methods: {
		// #ifdef MP-WEIXIN
		payIsMatched(){
			if (uni.getStorageSync('is_test')) {
				this.isMatched = 1;
				return;
			}
			let options = wx.getLaunchOptionsSync();
			this.$api.sendRequest({
				url: '/shopcomponent/api/weapp/scenecheck',
				data: {
					scene: options.scene
				},
				success: res => {
					if (res.code == 0) this.isMatched = res.data;
				}
			})
		},
		// #endif
		open() {
			this.$refs.choosePaymentPopup.open();
		},
		close() {
			this.$refs.choosePaymentPopup.close();
		},
		// 使用余额
		useBalance() {
			this.$emit('useBalance');
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
			this.$refs.choosePaymentPopup.close();
			this.$emit('confirm');
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
						this.pay();
					} else {
						this.$util.showToast({
							title: '未获取到支付信息！'
						});
						setTimeout(() => {
							this.$util.redirectTo('/pages/index/index', {}, 'reLaunch');
						}, 1500);
					}
				}
			});
		},
		getBalanceConfig() {
			this.$api.sendRequest({
				url: '/api/pay/getBalanceConfig',
				data: {},
				success: res => {					
					this.balanceConfig = res.data.balance_show;
				}
			});
		},		
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
			if (!payType) return;
			var return_url = '';
			if(this.payInfo.event == 'BlindboxGoodsOrderPayNotify'){
				return_url = '/pages_promotion/blindbox/index?outTradeNo=';
			}else{
				return_url = '/pages_tool/pay/result?code=';
			}
			this.$api.sendRequest({
				url: '/api/pay/pay',
				data: {
					out_trade_no: this.payInfo.out_trade_no,
					pay_type: payType.type,
					return_url: encodeURIComponent(this.$config.h5Domain + return_url + this.payInfo.out_trade_no)
				},
				success: res => {
					uni.hideLoading();
					if (res.code >= 0) {
						switch (payType.type) {
							case 'alipay':
								if(this.$util.isWeiXin()){
									var wx_alipay = encodeURIComponent(res.data.data);
									this.$util.redirectTo('/pages_tool/pay/wx_pay', { wx_alipay: wx_alipay, out_trade_no: this.payInfo.out_trade_no }, '', 'redirectTo');
								}else{
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
										data: { url: url },
										success: jssdkRes => {
											var wxJS = new Weixin(),
												payData = res.data.data;
											wxJS.init(jssdkRes.data);
											wxJS.pay(
												{
													timestamp: payData.timestamp ? payData.timestamp : payData.timeStamp,
													nonceStr: payData.nonceStr,
													package: payData.package,
													signType: payData.signType,
													paySign: payData.paySign
												},
												res => {
													if (res.errMsg == 'chooseWXPay:ok') {
														if(this.payInfo.event == 'BlindboxGoodsOrderPayNotify'){
															this.$util.redirectTo('/pages_promotion/blindbox/index', { outTradeNo: this.payInfo.out_trade_no }, '', 'redirectTo');
														}else{
															this.$util.redirectTo('/pages_tool/pay/result', { code: this.payInfo.out_trade_no }, '', 'redirectTo');
														}
														
													} else {
														this.$util.showToast({ title: res.errMsg });
													}
												},
												res => {
													this.$util.showToast({
														title: '您已取消支付'
													});
													setTimeout(() => {
														this.$util.redirectTo('/pages_tool/pay/result', { code: this.payInfo.out_trade_no }, 'redirectTo');
													}, 2000);
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
						this.$util.showToast({ title: res.message });
					}
				},
				fail: res => {
					uni.hideLoading();
					this.$util.showToast({ title: 'request:fail' });
				}
			});
		},
		checkPayStatus() {
			this.timer = setInterval(() => {
				this.$api.sendRequest({
					url: '/api/pay/status',
					data: { out_trade_no: this.payInfo.out_trade_no },
					success: res => {
						if (res.code == 0) {
							if (res.data.pay_status == 2) {
								clearInterval(this.timer);
								this.$util.redirectTo('/pages_tool/pay/result', { code: this.payInfo.out_trade_no }, '', 'redirectTo');
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
			if (!payType) return;
			if (payType.provider == 'wxpay') {
				this.$api.sendRequest({
					url: '/api/pay/pay',
					data: {
						out_trade_no: this.payInfo.out_trade_no,
						pay_type: payType.type,
						is_matched: this.isMatched,
						scene: uni.getStorageSync('is_test') ? 1175 : wx.getLaunchOptionsSync().scene
					},
					success: res => {
						uni.hideLoading();
						if (res.code >= 0) {
							var payData = res.data.data;
							var scene = uni.getStorageSync('is_test') ? 1175 : wx.getLaunchOptionsSync().scene;
							if([1175, 1176, 1177, 1191, 1195].indexOf(scene) != -1){
								uni.requestOrderPayment({
									timeStamp: payData.timeStamp,
									nonceStr: payData.nonceStr,
									package: payData.package,
									signType: payData.signType,
									paySign: payData.paySign,
									// orderInfo: payData.orderInfo,
									success: res => {
										uni.removeStorage({ key: 'is_test' })
										if(this.payInfo.event == 'BlindboxGoodsOrderPayNotify'){
											this.$util.redirectTo('/pages_promotion/blindbox/index', { outTradeNo: this.payInfo.out_trade_no }, '', 'redirectTo');
										}else{
											this.$util.redirectTo('/pages_tool/pay/result', { code: this.payInfo.out_trade_no }, '', 'redirectTo');
										}
									},
									fail: res => {
										this.flag = false;
										if (res.errMsg == 'requestOrderPayment:fail cancel') {
											this.$util.showToast({ title: '您已取消支付' });
										} else {
											uni.showModal({ content: '支付失败,失败原因: ' + res.errMsg, showCancel: false });
										}
										setTimeout(() => {
											uni.removeStorage({ key: 'is_test' })
											if(this.payInfo.event == 'BlindboxGoodsOrderPayNotify'){
												this.$util.redirectTo('/pages_promotion/blindbox/index', { outTradeNo: this.payInfo.out_trade_no }, '', 'redirectTo');
											}else{
												this.$util.redirectTo('/pages_tool/pay/result', { code: this.payInfo.out_trade_no }, '', 'redirectTo');
											}
										}, 2000);
									}
								}) 
							} else {
								uni.requestPayment({
									provider: payType.provider,
									timeStamp: payData.timeStamp,
									nonceStr: payData.nonceStr,
									package: payData.package,
									signType: payData.signType,
									paySign: payData.paySign,
									success: res => {
										this.$util.redirectTo('/pages_tool/pay/result', { code: this.payInfo.out_trade_no }, '', 'redirectTo');
									},
									fail: res => {
										this.flag = false;
										if (res.errMsg == 'requestPayment:fail cancel') {
											this.$util.showToast({ title: '您已取消支付' });
										} else {
											uni.showModal({ content: '支付失败,失败原因: ' + res.errMsg, showCancel: false });
										}
										setTimeout(() => {
											this.$util.redirectTo('/pages_tool/pay/result', { code: this.payInfo.out_trade_no }, 'redirectTo');
										}, 2000);
									}
								});
							}
						} else {
							this.$util.showToast({ title: res.message });
							setTimeout(() => {
								this.$util.redirectTo('/pages_tool/pay/result', { code: this.payInfo.out_trade_no }, 'redirectTo');
							}, 2000);
						}
					},
					fail: res => {
						uni.hideLoading();
						this.$util.showToast({ title: 'request:fail' });
					}
				});
			}
		}
		// #endif
	},
	// #ifdef H5
	deactivated() {
		clearInterval(this.timer);
	},
	// #endif
};
</script>

<style lang="scss">
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
			font-size: $font-size-base;
			
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
