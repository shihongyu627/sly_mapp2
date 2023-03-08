<template>
	<view>
		<view @touchmove.prevent.stop>
			<uni-popup ref="bindMobile" :custom="true" :mask-click="true">
				<view class="bind-wrap">
					<!-- #ifdef H5 -->
					<view class="head">检测到您还未绑定手机号码</view>
					<view class="form-wrap">
						<view class="label">手机号码</view>
						<view class="form-item">
							<view class="input-wrap">
								<input type="number" placeholder="请输入您的手机号码" placeholder-class="placeholder"
									v-model="formData.mobile" />
							</view>
						</view>
						<block v-if="captchaConfig">
							<view class="label">验证码</view>
							<view class="form-item">
								<view class="input-wrap">
									<input type="number" placeholder="请输入验证码" placeholder-class="placeholder"
										v-model="formData.vercode" />
								</view>
								<image :src="captcha.img" class="captcha" @click="getCaptcha"></image>
							</view>
						</block>
						<view class="label">动态码</view>
						<view class="form-item">
							<view class="input-wrap">
								<input type="number" placeholder="请输入动态码" placeholder-class="placeholder"
									v-model="formData.dynacode" />
							</view>
							<view class="send color-base-text" @click="sendMobileCode">{{ dynacodeData.codeText }}
							</view>
						</view>
					</view>
					<view class="footer">
						<view class="confirm" @click="confirm">确定</view>
						<view @click="cancel" class="cancel">取消</view>
					</view>
					<!-- #endif -->

					<!-- #ifdef MP-WEIXIN || MP-QQ || MP-BAIDU -->
					<view class="bind-tip-icon">
						<image :src="$util.img('public/uniapp/member/login.png')" mode="widthFix"></image>
					</view>
					<view class="bind-tips">为了方便您接收订单等信息，需要绑定您的手机号码</view>
					<button open-type="getPhoneNumber" class="auth-login ns-btn-default-all color-base-bg"
						@getphonenumber="mobileAuthLogin"><text>点击绑定手机号码</text></button>
					<!-- #endif  -->
				</view>
			</uni-popup>
		</view>
		<register-reward ref="registerReward"></register-reward>
	</view>
</template>

<script>
	import uniPopup from '../uni-popup/uni-popup.vue';
	import validate from 'common/js/validate.js';
	import registerReward from '../register-reward/register-reward.vue';
	import auth from 'common/js/auth.js';
	import Config from 'common/js/config.js';
	export default {
		name: 'bind-mobile',
		components: {
			uniPopup,
			registerReward
		},
		mixins: [validate, auth],
		data() {
			return {
				captchaConfig: 0,
				captcha: {
					id: '',
					img: ''
				},
				dynacodeData: {
					seconds: 120,
					timer: null,
					codeText: '获取动态码',
					isSend: false
				},
				formData: {
					key: '',
					mobile: '',
					vercode: '',
					dynacode: ''
				},
				isSub: false
			};
		},
		created() {
			this.getCaptchaConfig();
		},
		methods: {
			open() {
				this.$refs.bindMobile.open();
			},
			cancel() {
				this.$refs.bindMobile.close();
			},
			confirm() {
				let authData = uni.getStorageSync('authInfo');
				let data = {
					mobile: this.formData.mobile,
					key: this.formData.key,
					code: this.formData.dynacode
				};
				if (this.captcha.id != '') {
					data.captcha_id = this.captcha.id;
					data.captcha_code = this.formData.vercode;
				}

				if (authData) Object.assign(data, authData);
				if (authData.avatarUrl) data.headimg = authData.avatarUrl;
				if (authData.nickName) data.nickname = authData.nickName;

				if (uni.getStorageSync('source_member')) data.source_member = uni.getStorageSync('source_member');

				if (this.verify(data)) {
					if (this.isSub) return;
					this.isSub = true;
					this.$api.sendRequest({
						url: '/api/tripartite/mobile',
						data,
						success: res => {
							if (res.code >= 0) {
								uni.setStorage({
									key: 'token',
									data: res.data.token,
									success: () => {
										this.$store.commit('setToken', res.data.token);
										this.$store.dispatch('getCartNumber');
									}
								});
								this.$refs.bindMobile.close();

								if (res.data.is_register && this.$refs.registerReward.getReward()) {
									this.$refs.registerReward.open();
								}
							} else {
								this.isSub = false;
								this.getCaptcha();
								this.$util.showToast({
									title: res.message
								});
							}
						},
						fail: res => {
							this.isSub = false;
							this.getCaptcha();
						}
					});
				}
			},
			/**
			 * 表单验证
			 * @param {Object} data
			 */
			verify(data) {
				let rule = [{
					name: 'mobile',
					checkType: 'required',
					errorMsg: '请输入手机号'
				}, {
					name: 'mobile',
					checkType: 'phoneno',
					errorMsg: '请输入正确的手机号'
				}];
				if (this.captchaConfig == 1) {
					if (this.captcha.id != '') rule.push({
						name: 'captcha_code',
						checkType: 'required',
						errorMsg: this.$lang('captchaPlaceholder')
					});
				}
				rule.push({
					name: 'code',
					checkType: 'required',
					errorMsg: this.$lang('dynacodePlaceholder')
				});

				var checkRes = validate.check(data, rule);
				if (checkRes) {
					return true;
				} else {
					this.$util.showToast({
						title: validate.error
					});
					return false;
				}
			},
			/**
			 * 获取验证码配置
			 */
			getCaptchaConfig() {
				this.$api.sendRequest({
					url: '/api/config/getCaptchaConfig',
					success: res => {
						if (res.code >= 0) {
							this.captchaConfig = res.data.data.value.shop_reception_login;
							if (this.captchaConfig) this.getCaptcha();
						}
					}
				});
			},
			/**
			 * 获取验证码
			 */
			getCaptcha() {
				this.$api.sendRequest({
					url: '/api/captcha/captcha',
					data: {
						captcha_id: this.captcha.id
					},
					success: res => {
						if (res.code >= 0) {
							this.captcha = res.data;
							this.captcha.img = this.captcha.img.replace(/\r\n/g, '');
						}
					}
				});
			},
			/**
			 * 发送手机动态码
			 */
			sendMobileCode() {
				if (this.dynacodeData.seconds != 120 || this.dynacodeData.isSend) return;
				var data = {
					mobile: this.formData.mobile,
					captcha_id: this.captcha.id,
					captcha_code: this.formData.vercode
				};
				var rule = [{
					name: 'mobile',
					checkType: 'required',
					errorMsg: '请输入手机号'
				}, {
					name: 'mobile',
					checkType: 'phoneno',
					errorMsg: '请输入正确的手机号'
				}];
				if (this.captchaConfig == 1) {
					rule.push({
						name: 'captcha_code',
						checkType: 'required',
						errorMsg: '请输入验证码'
					});
				}
				var checkRes = validate.check(data, rule);
				if (!checkRes) {
					this.$util.showToast({
						title: validate.error
					});
					return;
				}
				this.dynacodeData.isSend = true;

				if (this.dynacodeData.seconds == 120) {
					this.dynacodeData.timer = setInterval(() => {
						this.dynacodeData.seconds--;
						this.dynacodeData.codeText = this.dynacodeData.seconds + 's后可重新获取';
					}, 1000);
				}

				this.$api.sendRequest({
					url: '/api/tripartite/mobileCode',
					data: data,
					success: res => {
						if (res.code >= 0) {
							this.formData.key = res.data.key;
						} else {
							this.$util.showToast({
								title: res.message
							});
							this.refreshDynacodeData();
						}
					},
					fail: () => {
						this.$util.showToast({
							title: 'request:fail'
						});
						this.refreshDynacodeData();
					}
				});
			},
			mobileAuthLogin(e) {
				console.log(e,'获取手机号参数。。。。。。。。。。。。');
				this.getCode(data => {
					console.log(data, '获取code......');
					if (data) {
						if (e.detail.errMsg == 'getPhoneNumber:ok') {
							let authData = uni.getStorageSync('authInfo');
							data.iv = e.detail.iv
							data.encryptedData = e.detail.encryptedData
							data.code = e.detail.code
							
							// var data = {
							// 	iv: e.detail.iv,
							// 	encryptedData: e.detail.encryptedData
							// };
							// if (authData) Object.assign(data, authData);
							if (authData.avatarUrl) data.headimg = authData.avatarUrl;
							if (authData.nickName) data.nickname = authData.nickName;
							if (uni.getStorageSync('source_member')) data.source_member = uni.getStorageSync(
								'source_member');
							console.log(data, '......');

							if (this.isSub) return;
							this.isSub = true;
							this.$api.sendRequest({
								url: '/api/tripartite/mobileauth',
								data,
								success: res => {
									if (res.code >= 0) {
										uni.setStorage({
											key: 'token',
											data: res.data.token,
											success: () => {
												this.$store.dispatch('getCartNumber');
												this.$store.commit('setToken', res.data
													.token);
											}
										});
										this.$refs.bindMobile.close();
										if (res.data.is_register && this.$refs.registerReward
											.getReward()) {
											this.$refs.registerReward.open();
										}
									} else {
										this.isSub = false;
										this.$util.showToast({
											title: res.message
										});
									}
								},
								fail: res => {
									this.isSub = false;
									this.$util.showToast({
										title: 'request:fail'
									});
								}
							});
						}
					}
				});

			},
			refreshDynacodeData() {
				this.getCaptcha();
				clearInterval(this.dynacodeData.timer);
				this.dynacodeData = {
					seconds: 120,
					timer: null,
					codeText: '获取动态码',
					isSend: false
				};
			}
		},
		watch: {
			'dynacodeData.seconds': {
				handler(newValue, oldValue) {
					if (newValue == 0) {
						this.refreshDynacodeData();
					}
				},
				immediate: true,
				deep: true
			}
		}
	};
</script>

<style lang="scss">
	.bind-wrap {
		background: #fff;
		box-sizing: border-box;
		border-radius: 20rpx;
		overflow: hidden;
		width: calc(100vw - 168rpx);
		margin: 0 auto;

		.head {
			text-align: center;
			height: 118rpx;
			line-height: 118rpx;
			background-color: #F6F6F6;
			color: #333333;
			font-size: 36rpx;
			font-weight: 600;
		}

		.form-wrap {
			padding: 30rpx 70rpx;

			.label {
				color: #000;
				font-size: $font-size-base;
				line-height: 1.3;
				font-weight: bold;
			}

			.form-item {
				margin: 24rpx 0;
				display: flex;
				align-items: flex-end;

				.input-wrap {
					padding-bottom: 30rpx;
					border-bottom: 2rpx solid #F2F2F2;
					flex: 1;
					width: 0;
					margin-right: 20rpx;

					&:last-child {
						margin-right: 0;
					}
				}

				.placeholder {
					font-size: $font-size-tag;
					color: #A3A3A3;
					height: 100%;
				}

				input {
					font-size: $font-size-tag;
				}

				.send {
					border: 2rpx solid $base-color;
					height: 60rpx;
					line-height: 60rpx;
					border-radius: 60rpx;
					font-size: $font-size-tag;
					text-align: center;
					padding: 0 40rpx;
				}

				.captcha {
					margin: 4rpx;
					height: 52rpx;
					width: 140rpx;
				}
			}
		}

		.footer {
			.confirm {
				height: 78rpx;
				line-height: 78rpx;
				border-radius: 78rpx;
				text-align: center;
				background: $base-color;
				color: #fff;
				margin: 0 54rpx;
			}

			.cancel {
				text-align: center;
				padding: 30rpx 0;
				font-size: 24rpx;
				line-height: 1;
				color: #666;
			}
		}

		.bind-tips {
			color: #aaa;
			font-size: $font-size-base;
			padding: 20rpx 50rpx;
			text-align: center;
		}

		.auth-login {
			width: calc(100% - 100rpx);
			margin: 20rpx auto 50rpx auto;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 80rpx;
		}

		.bind-tip-icon {
			padding-top: 80rpx;
			width: 100%;
			text-align: center;

			image {
				width: 300rpx;
			}
		}
	}

	.ns-btn-default-all {
		width: 100%;
		height: 70rpx;
		border-radius: $border-radius;
		text-align: center;
		line-height: 70rpx;
		color: #ffffff;
		font-size: $font-size-base;
	}
</style>
<style scoped>
	/deep/ .reward-popup .uni-popup__wrapper-box {
		background: none !important;
		max-width: unset !important;
		max-height: unset !important;
		overflow: unset !important;
	}
</style>
