export default {
	data() {
		return {
			authInfo: {}
		}
	},
	methods: {
		/**
		 * 获取用户登录凭证code
		 */
		getCode(callback) {
			// 微信小程序
			// #ifdef MP-WEIXIN
			uni.login({
				provider: 'weixin',
				timeout: 3000,
				success: res => {
					if (res.code) {
						this.$api.sendRequest({
							url: '/weapp/api/weapp/authcodetoopenid',
							data: {
								code: res.code
							},
							success: res => {
								if (res.code >= 0) {
									if (res.data.openid) this.authInfo.weapp_openid = res.data.openid;
									if (res.data.unionid) this.authInfo.wx_unionid = res.data.unionid;
									typeof callback == 'function' && callback(this.authInfo);
								} else {
									this.$util.showToast({
										title: '小程序配置错误'
									});
								}
							}
						})
					}
				},
				fail: () => {
					this.$util.showToast({
						title: '请求失败'
					});
				}
			})
			// #endif
		}
	}
}