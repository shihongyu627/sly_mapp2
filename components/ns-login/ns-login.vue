<template>
	<view>
		<view @touchmove.prevent.stop>
			<uni-popup ref="auth" :custom="true" :mask-click="false">
				<view class="uni-tip">
					<view class="uni-tip-icon"><image :src="$util.img('/public/uniapp/member/login.png')" mode="widthFix"></image></view>
					<view class="uni-tip-title">您还未登录</view>
					<view class="uni-tip-content">请先登录之后再进行操作</view>
					<view class="uni-tip-group-button">
						<button type="primary" class="uni-tip-button" @click="login">立即登录</button>
						<view class="close" @click="close">我再看看</view>
					</view>
				</view>
			</uni-popup>
		</view>

		<bind-mobile ref="bindMobile"></bind-mobile>
		<register-reward ref="registerReward"></register-reward>
	</view>
</template>

<script>
import uniPopup from '../uni-popup/uni-popup.vue';
import Config from 'common/js/config.js';
import bindMobile from '../bind-mobile/bind-mobile.vue';
import registerReward from '../register-reward/register-reward.vue';
import auth from 'common/js/auth.js';

export default {
	mixins: [auth],
	name: 'ns-login',
	components: {
		uniPopup,
		bindMobile,
		registerReward
	},
	data() {
		return {
			url: '',
			registerConfig: {}
		};
	},
	created() {
		this.getRegisterConfig();
	},
	mounted() {
		
	},
	methods: {
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
		},
		open(url) {
			if (url) this.url = url;
			// #ifdef MP-WEIXIN 
			this.$refs.auth.open();
			// #endif

			// #ifdef H5
			if (this.$util.isWeiXin()) {
				let authData = uni.getStorageSync('authInfo');
				if (authData) this.authLogin(authData);
				else this.toLogin();
			} else {
				this.toLogin();
			}
			// #endif
			
			// #ifndef MP-WEIXIN || H5
			this.toLogin();
			// #endif
		},
		close() {
			this.$refs.auth.close();
		},
		login(e) {
			// #ifdef MP-WEIXIN
			wx.getUserProfile({
				desc: '获取用户个人信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
				success: (res) => {
					if (res.errMsg == 'getUserProfile:ok') {
						this.authInfo.nickName = res.userInfo.nickName;
						this.authInfo.avatarUrl = res.userInfo.avatarUrl;
						this.getCode(data => {
							if (data) {
								this.authLogin(this.authInfo);
							} 
						});
					}
				}
			})					
			// #endif
		},
		/**
		 * 跳转去登录页
		 */
		toLogin() {
			if (this.url) this.$util.redirectTo('/pages_tool/login/login', { back: encodeURIComponent(this.url) });
			else this.$util.redirectTo('/pages_tool/login/login');
		},
		/**
		 * 授权登录
		 */
		authLogin(data) {
			uni.showLoading({ title: '登录中' });
			console.log(data,'授权登录');
			uni.setStorage({
				key: 'authInfo',
				data: data
			});
			if (uni.getStorageSync('source_member')) data.source_member = uni.getStorageSync('source_member');

			this.$api.sendRequest({
				url: '/api/login/auth',
				data,
				success: res => {
					this.$refs.auth.close();
					if (res.code >= 0) {
						uni.setStorage({
							key: 'token',
							data: res.data.token,
							success: () => {
								this.$store.dispatch('getCartNumber');
								this.$store.commit('setToken', res.data.token);

								if (res.data.is_register && this.$refs.registerReward.getReward()) {
									this.$refs.registerReward.open();
								}
							}
						});
						setTimeout(() => {
							uni.hideLoading();
						}, 1000);
					} else{
						let register_error = res.message;
						this.$api.sendRequest({
							url: '/api/register/config',
							success: res => {
								if (res.code >= 0) {
									this.registerConfig = res.data.value;
									if (this.registerConfig.third_party == 1 && this.registerConfig.bind_mobile == 1) {
										uni.hideLoading();
										this.$refs.bindMobile.open();
									} else if (this.registerConfig.third_party == 0) {
										uni.hideLoading();
										this.toLogin();
									} else {
										uni.hideLoading();
										this.$util.showToast({ title: register_error });
									}
								}
							}
						});
					}
				},
				fail: () => {
					uni.hideLoading();
					this.$refs.auth.close();
					this.$util.showToast({ title: '登录失败' });
				}
			});
		}
	}
};
</script>

<style lang="scss">
.uni-tip {
	width: 540rpx;
	background: #fff;
	box-sizing: border-box;
	border-radius: 10rpx;
	overflow: hidden;
	height: initial;
}

.uni-tip-title {
	text-align: center;
	font-weight: bold;
	font-size: $font-size-toolbar;
	color: $color-title;
	padding-top: 50rpx;
}

.uni-tip-content {
	padding: 0 30rpx;
	color: $color-sub;
	font-size: $font-size-base;
	text-align: center;
}

.uni-tip-icon {
	width: 100%;
	text-align: center;
	margin-top: 60rpx;
}

.uni-tip-icon image {
	width: 300rpx;
}

.uni-tip-group-button {
	margin-top: 30rpx;
	line-height: 120rpx;
	padding: 0 50rpx 50rpx 50rpx;
}

.uni-tip-button {
	width: 80%;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	border: none;
	border-radius: 80rpx;
	padding: 0 !important;
	margin: 20rpx auto 0 !important;
	background: $base-color;
	font-size: $font-size-base;
}

.uni-tip-group-button .close {
	color: #999;
	font-size: 28rpx;
	text-align: center;
	margin-top: 20rpx;
}

.uni-tip-button:after {
	border: none;
}
</style>
<style scoped>
/deep/ .reward-popup .uni-popup__wrapper-box {
	background: none !important;
	max-width: unset !important;
	max-height: unset !important;
	 overflow: unset!important;
}
</style>