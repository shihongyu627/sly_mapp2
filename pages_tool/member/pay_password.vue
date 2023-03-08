<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="container">
		<view class="tips" v-if="step != 0">请输入6位支付密码，建议不要使用重复或连续数字</view>
		<view class="tips" v-else>验证码已发送至{{ memberInfo.mobile | mobile }}请在下方输入4位数字验证码</view>
		<view class="password-wrap">
			<myp-one :maxlength="step == 0 ? 4 : 6" :is-pwd="step != 0" @input="input" ref="input" :auto-focus="true"></myp-one>
			<view v-show="step == 0" class="dynacode" :class="dynacodeData.seconds == 120 ? 'color-base-text' : 'color-tip'" @click="sendMobileCode">
				{{ dynacodeData.codeText }}
			</view>
			<view class="action-tips" v-show="step == 0">输入短信验证码</view>
			<view class="action-tips" v-show="step == 1">请设置支付密码</view>
			<view class="action-tips" v-show="step == 2">请再次输入</view>
			<view class="btn color-base-bg color-base-border" :class="{ disabled: !isClick }" @click="confirm">确认</view>
		</view>
	</view>
</template>

<script>
import mypOne from '@/components/myp-one/myp-one.vue';
export default {
	components: {
		mypOne
	},
	data() {
		return {
			isClick: false,
			step: 1,
			key: '', // 短信key
			code: '', // 动态码
			password: '', // 密码
			repassword: '', // 重复密码
			isSub: false, // 防重复提交
			back: '', // 返回页
			memberInfo: {}, // 会员信息
			dynacodeData: {
				seconds: 120,
				timer: null,
				codeText: '获取验证码',
				isSend: false
			}
		};
	},
	methods: {
		input(val) {
			if (this.step == 0) {
				if (val.length == 4) {
					this.isClick = true;
					this.code = val;
				} else {
					this.isClick = false;
				}
			} else if (this.step == 1) {
				if (val.length == 6) {
					this.isClick = true;
					this.password = val;
				} else {
					this.isClick = false;
				}
			} else {
				if (val.length == 6) {
					this.isClick = true;
					this.repassword = val;
				} else {
					this.isClick = false;
				}
			}
		},
		confirm() {
			if (this.isClick) {
				if (this.step == 0) {
					this.$api.sendRequest({
						url: '/api/member/verifypaypwdcode',
						data: {
							code: this.code,
							key: this.key
						},
						success: res => {
							if (res.code == 0) {
								this.$refs.input.clear();
								this.isClick = false;
								this.step = 1;
							} else {
								this.$util.showToast({ title: res.message });
							}
						}
					});
				} else if (this.step == 1) {
					this.$refs.input.clear();
					this.isClick = false;
					this.step = 2;
				} else {
					if (this.password == this.repassword) {
						if (this.isSub) return;
						this.isSub = true;
						this.$api.sendRequest({
							url: '/api/member/modifypaypassword',
							data: {
								key: this.key,
								code: this.code,
								password: this.password
							},
							success: res => {
								if (res.code >= 0) {
									this.$util.showToast({ title: '修改成功' });
									setTimeout(() => {
										if (this.back) this.$util.redirectTo(this.back, {}, 'redirectTo');
										else this.$util.redirectTo('/pages/member/index', {}, 'reLaunch');
									}, 2000);
								} else {
									this.initInfo();
									this.$util.showToast({ title: res.message });
								}
							}
						});
					} else {
						this.$util.showToast({
							title: '两次输入的密码不一致',
							success: res => {
								this.initInfo();
							}
						});
					}
				}
			}
		},
		initInfo() {
			this.isClick = false;
			this.step = 1;
			this.password = '';
			this.repassword = '';
			this.oldpassword = '';
			this.isSub = false;
			this.$refs.input.clear();
		},
		getMemberInfo() {
			this.$api.sendRequest({
				url: '/api/member/info',
				success: res => {
					if (res.code == 0) {
						this.memberInfo = res.data;
						if (this.memberInfo.mobile == '') {
							uni.showModal({
								title: '提示',
								content: '设置支付密码需要先绑定手机号,是否立即绑定?',
								success: res => {
									if (res.confirm) {
										this.$util.redirectTo('/pages_tool/member/info', { action: 'mobile', back: this.back }, 'redirectTo');
									} else {
										if (this.back) this.$util.redirectTo(this.back);
										else this.$util.redirectTo('/pages/member/index', {}, 'redirectTo');
									}
								}
							});
						} else {
							this.step = 0;
							this.sendMobileCode();
						}
					}
				}
			});
		},
		/**
		 * 发送手机动态码
		 */
		sendMobileCode() {
			if (this.dynacodeData.seconds != 120) return;
			if (this.dynacodeData.isSend) return;
			this.dynacodeData.isSend = true;

			this.$api.sendRequest({
				url: '/api/member/paypwdcode',
				success: res => {
					this.dynacodeData.isSend = false;
					if (res.code >= 0) {
						this.key = res.data.key;

						if (this.dynacodeData.seconds == 120 && this.dynacodeData.timer == null) {
							this.dynacodeData.timer = setInterval(() => {
								this.dynacodeData.seconds--;
								this.dynacodeData.codeText = this.dynacodeData.seconds + 's后可重新获取';
							}, 1000);
						}
					} else {
						this.$util.showToast({ title: res.message });
					}
				},
				fail: () => {
					this.$util.showToast({ title: 'request:fail' });
					this.dynacodeData.isSend = false;
				}
			});
		}
	},
	onLoad(option) {
		
		

		if (option.back) this.back = option.back;

		// 判断登录
		if (!uni.getStorageSync('token')) {
			this.$util.redirectTo('/pages_tool/login/login');
		} else {
			this.getMemberInfo();
		}
	},
	filters: {
		mobile(mobile) {
			return mobile.substring(0, 4 - 1) + '****' + mobile.substring(6 + 1);
		}
	},
	watch: {
		'dynacodeData.seconds': {
			handler(newValue, oldValue) {
				if (newValue == 0) {
					clearInterval(this.dynacodeData.timer);
					this.dynacodeData = {
						seconds: 120,
						timer: null,
						codeText: '获取动态码',
						isSend: false
					};
				}
			},
			immediate: true,
			deep: true
		}
	}
};
</script>

<style lang="scss">
.container {
	width: 100vw;
	height: 100vh;
	background: #fff;

	.tips {
		width: 60%;
		margin: 0 auto;
		text-align: center;
		padding-top: 100rpx;
	}

	.password-wrap {
		width: 80%;
		margin: 0 auto;
		margin-top: 40rpx;

		.action-tips {
			text-align: center;
			font-weight: 600;
			margin-top: 80rpx;
		}

		.dynacode {
			line-height: 1;
			margin-top: 20rpx;
			font-size: $font-size-tag;
		}
		.btn {
			margin: 0 auto;
			margin-top: 30rpx;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: $border-radius;
			color: #fff;
			text-align: center;

			&.disabled {
				background: #ccc !important;
				border-color: #ccc !important;
				color: #fff;
			}
		}
	}
}
</style>
