<template>
	<page-meta :page-style="themeColor"></page-meta>
	<scroll-view scroll-y="true" class="container">
		<!-- <view class="iconfont iconclose back-btn" @click="$util.redirectTo('/pages/member/index')"></view> -->
		<view class="header-wrap">
			<view class="title">登录</view>
			<view class="regisiter-agreement" v-if="registerConfig.register != ''">
				<text class="color-tip">还没有账号,</text>
				<text class="color-base-text" @click="toRegister">立即注册</text>
			</view>
		</view>
		<view class="body-wrap">
			<view class="form-wrap">
				<view class="input-wrap" v-show="loginMode == 'mobile'">
					<view class="content">
						<view class="area-code">+86</view>
						<input type="number" placeholder="仅限中国大陆手机号登录" placeholder-class="input-placeholder" class="input" maxlength="11" v-model="formData.mobile" />
					</view>
				</view>
				<view class="input-wrap" v-show="loginMode == 'account'">
					<view class="content"><input type="text" placeholder="请输入账号" placeholder-class="input-placeholder" class="input" v-model="formData.account" /></view>
				</view>
				<view class="input-wrap" v-show="loginMode == 'account'">
					<view class="content">
						<input type="password" placeholder="请输入密码" placeholder-class="input-placeholder" class="input" v-model="formData.password" />
						<view class="align-right" v-show="loginMode == 'account'"><text @click="forgetPassword">忘记密码?</text></view>
					</view>
				</view>
				<view class="input-wrap" v-if="captchaConfig == 1">
					<view class="content">
						<input type="text" placeholder="请输入验证码" placeholder-class="input-placeholder" class="input" v-model="formData.vercode" />
						<image :src="captcha.img" class="captcha" @click="getCaptcha"></image>
					</view>
				</view>
				<view class="input-wrap" v-show="loginMode == 'mobile'">
					<view class="content">
						<input type="text" placeholder="请输入动态码" placeholder-class="input-placeholder" class="input" v-model="formData.dynacode" />
						<view class="dynacode" :class="dynacodeData.seconds == 120 ? 'color-base-text' : 'color-tip'" @click="sendMobileCode">{{ dynacodeData.codeText }}</view>
					</view>
				</view>
			</view>
			<view class="login-mode-box">
				<text @click="switchLoginMode" v-show="loginMode == 'mobile' && registerConfig.login.indexOf('username') != -1">使用账号登录</text>
				<text @click="switchLoginMode" v-show="loginMode == 'account' && registerConfig.login.indexOf('mobile') != -1">使用手机号登录</text>
			</view>
			<view class="btn_view">
				<button type="primary" @click="login" class="login-btn color-base-border color-base-bg">登录</button>
				<!-- #ifdef MP -->
				<button open-type="getPhoneNumber" class="auth-login color-base-border" @getphonenumber="mobileAuthLogin">
					<text class="color-base-text color-base-border">一键授权手机号快捷登录</text>
				</button>
				<!-- #endif -->
			</view>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
		<register-reward ref="registerReward"></register-reward>
	</scroll-view>
</template>

<script>
import validate from 'common/js/validate.js';
import registerReward from '@/components/register-reward/register-reward.vue';

export default {
	data() {
		return {
			loginMode: 'mobile',
			formData: {
				mobile: '',
				account: '',
				password: '',
				vercode: '',
				dynacode: '',
				key: ''
			},
			captcha: {
				id: '',
				img: ''
			},
			isSub: false, // 提交防重复
			back: '', // 返回页
			redirect: 'redirectTo', // 跳转方式
			dynacodeData: {
				seconds: 120,
				timer: null,
				codeText: '获取动态码',
				isSend: false
			},
			registerConfig: {
				register: '',
				login: ''
			},
			captchaConfig: 1,
			authInfo: null
		};
	},
	components: {
		registerReward
	},
	onLoad(option) {
		if (option.back) this.back = option.back;
		this.getRegisterConfig();
		this.getCaptchaConfig();
		this.authInfo = uni.getStorageSync('authInfo');
	},
	onShow() {},
	onReady() {
		if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
	},
	methods: {
		/**
		 * 获取验证码配置
		 */
		getCaptchaConfig() {
			this.$api.sendRequest({
				url: '/api/config/getCaptchaConfig',
				success: res => {
					if (res.code >= 0) {
						this.captchaConfig = res.data.data.value.shop_reception_login;
						if (this.captchaConfig == 1) this.getCaptcha();
					}
				}
			});
		},
		/**
		 * 获取注册配置
		 */
		getRegisterConfig() {
			this.$api.sendRequest({
				url: '/api/register/config',
				success: res => {
					if (res.code >= 0) {
						this.registerConfig = res.data.value;
						if (this.registerConfig.login.indexOf('mobile') != -1) this.loginMode = 'mobile';
						else this.loginMode = 'account';
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				}
			});
		},
		/**
		 * 切换登录方式
		 */
		switchLoginMode() {
			this.loginMode = this.loginMode == 'mobile' ? 'account' : 'mobile';
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
		 * 去注册
		 */
		toRegister() {
			if (this.back) this.$util.redirectTo('/pages_tool/login/register', { back: encodeURIComponent(this.back) });
			else this.$util.redirectTo('/pages_tool/login/register');
		},
		/**
		 * 忘记密码
		 */
		forgetPassword() {
			if (this.back) this.$util.redirectTo('/pages_tool/login/find', { back: encodeURIComponent(this.back) });
			else this.$util.redirectTo('/pages_tool/login/find');
		},
		/**
		 * 登录
		 */
		login() {
			if (this.loginMode == 'account') {
				var url = '/api/login/login';
				data = {
					username: this.formData.account,
					password: this.formData.password
				};
			} else {
				var url = '/api/login/mobile',
					data = {
						mobile: this.formData.mobile,
						key: this.formData.key,
						code: this.formData.dynacode
					};
			}
			if (this.captcha.id != '') {
				data.captcha_id = this.captcha.id;
				data.captcha_code = this.formData.vercode;
			}
			if (this.authInfo) Object.assign(data, this.authInfo);
			if (uni.getStorageSync('source_member')) data.source_member = uni.getStorageSync('source_member');

			if (this.verify(data)) {
				if (this.isSub) return;
				this.isSub = true;
				this.$api.sendRequest({
					url,
					data,
					success: res => {
						if (res.code >= 0) {
							var can_receive_registergift = res.data.can_receive_registergift;

							uni.setStorage({
								key: 'token',
								data: res.data.token,
								success: () => {
									if (can_receive_registergift == 1) {
										this.$util.showToast({
											title: '登录成功'
										});
										this.$refs.registerReward.open();
									} else {
										if (this.back != '') {
											this.$util.redirectTo(decodeURIComponent(this.back), {}, 'reLaunch');
										} else {
											this.$util.redirectTo('/pages/member/index', {}, 'reLaunch');
										}
									}
								}
							});
						} else {
							this.isSub = false;
							this.getCaptcha();
							this.$util.showToast({ title: res.message });
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
		 * 登录验证
		 * @param {Object} data
		 */
		verify(data) {
			let rule = [];
			// 手机号验证
			if (this.loginMode == 'mobile') {
				rule = [{ name: 'mobile', checkType: 'required', errorMsg: '请输入手机号' }, { name: 'mobile', checkType: 'phoneno', errorMsg: '请输入正确的手机号' }];
				if (this.captchaConfig == 1) {
					if (this.captcha.id != '') rule.push({ name: 'captcha_code', checkType: 'required', errorMsg: this.$lang('captchaPlaceholder') });
				}
				rule.push({ name: 'code', checkType: 'required', errorMsg: this.$lang('dynacodePlaceholder') });
			}

			// 账号验证
			if (this.loginMode == 'account') {
				rule = [
					{ name: 'username', checkType: 'required', errorMsg: this.$lang('accountPlaceholder') },
					{ name: 'password', checkType: 'required', errorMsg: this.$lang('passwordPlaceholder') }
				];
				if (this.captchaConfig == 1) {
					if (this.captcha.id != '') rule.push({ name: 'captcha_code', checkType: 'required', errorMsg: this.$lang('captchaPlaceholder') });
				}
			}

			var checkRes = validate.check(data, rule);
			if (checkRes) {
				return true;
			} else {
				this.$util.showToast({ title: validate.error });
				return false;
			}
		},
		mobileAuthLogin(e) {
			if (e.detail.errMsg == 'getPhoneNumber:ok') {
				var data = {
					iv: e.detail.iv,
					encryptedData: e.detail.encryptedData
				};
				if (Object.keys(this.authInfo).length) {
					Object.assign(data, this.authInfo);
					if (this.authInfo.nickName) data.nickname = this.authInfo.nickName;
					if (this.authInfo.avatarUrl) data.headimg = this.authInfo.avatarUrl;
				}
				if (uni.getStorageSync('source_member')) data.source_member = uni.getStorageSync('source_member');

				if (this.isSub) return;
				this.isSub = true;

				this.$api.sendRequest({
					url: '/api/tripartite/mobileauth',
					data,
					success: res => {
						if (res.code >= 0) {
							var can_receive_registergift = res.data.can_receive_registergift;
							uni.setStorage({
								key: 'token',
								data: res.data.token,
								success: () => {
									if (can_receive_registergift == 1) {
										this.$refs.registerReward.open();
									} else {
										if (this.back != '') {
											this.$util.redirectTo(decodeURIComponent(this.back), {}, this.redirect);
										} else {
											this.$util.redirectTo('/pages/member/index', {}, this.redirect);
										}
									}
								}
							});
						} else {
							this.isSub = false;
							this.$util.showToast({ title: res.message });
						}
					},
					fail: res => {
						this.isSub = false;
						this.$util.showToast({ title: 'request:fail' });
					}
				});
			}
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
			var rule = [{ name: 'mobile', checkType: 'required', errorMsg: '请输入手机号' }, { name: 'mobile', checkType: 'phoneno', errorMsg: '请输入正确的手机号' }];
			if (this.captchaConfig == 1) {
				rule.push({ name: 'captcha_code', checkType: 'required', errorMsg: '请输入验证码' });
			}
			var checkRes = validate.check(data, rule);
			if (!checkRes) {
				this.$util.showToast({ title: validate.error });
				return;
			}
			this.dynacodeData.isSend = true;
			this.dynacodeData.timer = setInterval(() => {
				this.dynacodeData.seconds--;
				this.dynacodeData.codeText = this.dynacodeData.seconds + 's后可重新获取';
			}, 1000);

			this.$api.sendRequest({
				url: '/api/login/mobileCode',
				data: data,
				success: res => {
					if (res.code >= 0) {
						this.formData.key = res.data.key;
					} else {
						this.refreshDynacodeData();
						this.$util.showToast({ title: res.message });
					}
				},
				fail: () => {
					this.$util.showToast({ title: 'request:fail' });
					this.refreshDynacodeData();
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
@import './public/css/common.scss';
</style>

<style scoped>
/deep/ .reward-popup .uni-popup__wrapper-box {
	background: none !important;
	max-width: unset !important;
	max-height: unset !important;
	overflow: unset !important;
}
/deep/ uni-toast .uni-simple-toast__text {
	background: red !important;
}
</style>
