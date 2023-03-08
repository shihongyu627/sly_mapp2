<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="find">
		<view class="iconfont iconclose" @click="navigateBack()"></view>
		<view class="header-wrap">
			<block v-if="stepShow == 0">
				<view class="title">请输入手机号</view>
				<view><text class="color-tip">请确认您的账号已绑定此手机号</text></view>
			</block>

			<block v-if="stepShow == 1">
				<view class="title">请输入验证码</view>
				<view>
					<text class="color-tip">已将验证码发送至手机号：{{ formData.mobile }}</text>
				</view>
			</block>

			<block v-if="stepShow == 2">
				<view class="title">请设置新的密码</view>
				<view><text class="color-tip">建议您的新密码以简单好记为标准</text></view>
			</block>
		</view>
		<view class="find-form">
			<!-- 输入手机号和验证码 -->
			<block v-if="stepShow == 0">
				<view class="form-input">
					<input
						class="uni-input"
						placeholder-class="placeholder-class"
						type="text"
						maxlength="17"
						v-model="formData.mobile"
						:placeholder="$lang('accountPlaceholder')"
					/>
				</view>

				<view class="form-input align-type">
					<input
						class="uni-input info-content"
						placeholder-class="placeholder-class"
						type="number"
						maxlength="4"
						:placeholder="$lang('captchaPlaceholder')"
						v-model="formData.captcha"
					/>
					<image :src="captcha.img" class="captcha" @click="getCaptcha"></image>
				</view>

				<button type="primary" class="find-btn" @click="nextStep()">{{ $lang('next') }}</button>
			</block>

			<!-- 输入动态码 -->
			<block v-if="stepShow == 1">
				<myp-one :maxlength="4" @input="input" ref="input" :auto-focus="true"></myp-one>
				<button type="primary" class="find-btn" :disabled="isSend" @click="sendDynaCode">{{ codeText }}</button>
			</block>
			<!-- 输入新密码 -->
			<block v-if="stepShow == 2">
				<view class="form-input">
					<input
						class="uni-input"
						placeholder-class="placeholder-class"
						type="text"
						maxlength="30"
						password="true"
						:placeholder="$lang('passwordPlaceholder')"
						v-model="formData.password"
					/>
				</view>

				<view class="form-input">
					<input
						class="uni-input"
						placeholder-class="placeholder-class"
						type="text"
						maxlength="30"
						password="true"
						:placeholder="$lang('rePasswordPlaceholder')"
						v-model="formData.rePassword"
					/>
				</view>

				<button type="primary" class="find-btn" @click="save">{{ $lang('save') }}</button>
			</block>
		</view>
	</view>
</template>

<script>
import validate from 'common/js/validate.js';
import mypOne from '@/components/myp-one/myp-one.vue';
export default {
	components: {
		mypOne
	},
	data() {
		return {
			findMode: 'mobile',
			codeText: '重新获取',
			seconds: 120,
			timer: null,
			formData: {
				mobile: '',
				password: '',
				rePassword: '',
				dynacode: '',
				captcha: ''
			},
			stepShow: 0,
			isSend: false,
			captcha: {
				id: '',
				img: ''
			},
			registerConfig: {}
		};
	},
	onLoad() {
		this.getCaptcha();
	},
	onShow() {
		
		
		this.getRegisterConfig();
	},
	methods: {
		input(val) {
			if (val.length == 4) {
				this.formData.dynacode = val;
				this.stepShow += 1;
			}
		},
		// 导航跳转
		navigateBack() {
			if (this.stepShow > 0) {
				this.stepShow -= 1;
			} else {
				this.$util.redirectTo('/pages_tool/login/login', '', 'redirectTo');
			}
		},
		// 下一步
		async nextStep() {
			let step0Rule = [
					{
						name: 'mobile',
						checkType: 'phoneno',
						errorMsg: '请输入正确的手机号'
					},
					{
						name: 'captcha',
						checkType: 'required',
						errorMsg: this.$lang('captchaPlaceholder')
					}
				], //手机验证
				step0CheckRes;

			step0CheckRes = validate.check(this.formData, step0Rule);

			if (step0CheckRes) {
				this.findMode = 'mobile';
				let res = await this.$api.sendRequest({
					url: '/api/member/checkmobile',
					data: {
						mobile: this.formData.mobile
					},
					async: false
				});
				if (res.code == 0) {
					this.$util.showToast({
						title: '该手机号未注册'
					});
					return false;
				}
			} else {
				this.$util.showToast({
					title: validate.error
				});
				return false;
			}
			this.sendDynaCode();
		},
		// 注册表单验证
		vertify() {
			let regConfig = this.registerConfig;
			let rule = [
				{
					name: 'password',
					checkType: 'required',
					errorMsg: '请输入密码'
				}
			];
			if (regConfig.pwd_len > 0) {
				rule.push({
					name: 'password',
					checkType: 'lengthMin',
					checkRule: regConfig.pwd_len,
					errorMsg: '密码长度不能小于' + regConfig.pwd_len + '位'
				});
			}
			if (regConfig.pwd_complexity != '') {
				let passwordErrorMsg = '密码需包含',
					reg = '';
				if (regConfig.pwd_complexity.indexOf('number') != -1) {
					reg += '(?=.*?[0-9])';
					passwordErrorMsg += '数字';
				}
				if (regConfig.pwd_complexity.indexOf('letter') != -1) {
					reg += '(?=.*?[a-z])';
					passwordErrorMsg += '、小写字母';
				}
				if (regConfig.pwd_complexity.indexOf('upper_case') != -1) {
					reg += '(?=.*?[A-Z])';
					passwordErrorMsg += '、大写字母';
				}
				if (regConfig.pwd_complexity.indexOf('symbol') != -1) {
					reg += '(?=.*?[#?!@$%^&*-])';
					passwordErrorMsg += '、特殊字符';
				}
				rule.push({
					name: 'password',
					checkType: 'reg',
					checkRule: reg,
					errorMsg: passwordErrorMsg
				});
			}

			var checkRes = validate.check(this.formData, rule);
			if (checkRes) {
				if (this.formData.password != this.formData.rePassword) {
					this.$util.showToast({
						title: '两次密码不一致'
					});
					return false;
				}
				return true;
			} else {
				this.$util.showToast({
					title: validate.error
				});
				return false;
			}
		},
		// 获取验证码
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
		// 发送动态验证码
		async sendDynaCode() {
			if (this.formData.captcha.length == 0) {
				this.$util.showToast({
					title: this.$lang('captchaPlaceholder')
				});
				return;
			}

			if (this.isSend) return;
			this.isSend = true;

			var url,
				data = {
					captcha_id: this.captcha.id,
					captcha_code: this.formData.captcha
				};
			data[this.findMode] = this.formData.mobile;
			url = '/api/findpassword/mobilecode';

			this.$api.sendRequest({
				url: url,
				data: data,
				success: res => {
					let data = res.data;
					if (data.key) {
						if (this.seconds == 120 && this.timer == null) {
							this.timer = setInterval(() => {
								this.seconds--;
								this.codeText = '重新获取(' + this.seconds + 's)';
							}, 1000);
						}
						uni.setStorageSync('forgot_password_token', data.key);
						this.stepShow += 1;
					} else {
						this.$util.showToast({
							title: res.message
						});
						this.isSend = false;
						this.getCaptcha();
					}
				},
				fail: res => {
					this.isSend = false;
					this.getCaptcha();
				}
			});
		},
		save() {
			if (this.vertify()) {
				var url,
					data = {
						code: this.formData.dynacode,
						key: uni.getStorageSync('forgot_password_token'),
						password: this.formData.password
					};
				data[this.findMode] = this.formData.mobile;
				url = '/api/findpassword/mobile';
				this.$api.sendRequest({
					url: url,
					data: data,
					success: res => {
						this.$util.showToast({
							title: res.message
						});
						if (res.code == 0) {
							setTimeout(() => {
								uni.removeStorage({
									key: 'forgot_password_token'
								});
								this.$util.redirectTo('/pages_tool/login/login', {}, 'redirectTo');
							}, 1000);
						} else {
							this.stepShow -= 1;
						}
					}
				});
			}
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
					}
				}
			});
		}
	},
	watch: {
		seconds(value) {
			if (value == 0) {
				this.seconds = 120;
				this.codeText = '重新获取';
				this.isSend = false;
				clearInterval(this.timer);
			}
		}
	}
};
</script>

<style lang="scss">
page {
	background: #ffffff !important;
	overflow: hidden;
}

.captcha {
	width: 170rpx;
	height: 50rpx;
}

.find-form {
	padding: 100rpx 80rpx 0;

	.form-input {
		margin-top: 60rpx;
		height: 60rpx;
		border-bottom: 2rpx solid $color-line;

		input {
			padding: 0;
			font-size: $font-size-base;
		}
	}

	.find-btn {
		margin: 374rpx 0 0;
		border-radius: $border-radius;
		color: #fff;

		&[disabled] {
			background-color: #f7f7f7 !important;
		}
	}
}

.forget-section {
	display: flex;
	flex-direction: row-reverse;
	justify-content: space-between;
	margin-top: 10rpx;
	height: 70rpx;
	line-height: 70rpx;
}

.align-type {
	display: flex;
	justify-content: space-between;
}

.header-wrap {
	width: 80%;
	height: 100%;
	margin: calc(120rpx + 88rpx) auto 0;
	background-repeat: no-repeat;
	background-size: contain;
	background-position: bottom;
	position: relative;

	.title {
		font-size: 50rpx;
		font-weight: bold;
	}
}

.iconclose {
	font-size: 52rpx;
	position: fixed;
	left: 24rpx;
	top: 72rpx;
	z-index: 9;
	color: #000;
}

.placeholder-class {
	color: #bfbfbf;
}
</style>
