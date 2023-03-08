<script>
	import auth from 'common/js/auth.js';
	import {
		Weixin
	} from 'common/js/wx-jssdk.js';

	export default {
		mixins: [auth],
		onLaunch: function() {
			uni.hideTabBar();

			// #ifdef MP
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
			});

			updateManager.onUpdateReady(function(res) {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});
			});

			updateManager.onUpdateFailed(function(res) {
				// 新的版本下载失败
			});
			// #endif

			// #ifdef H5
			if (uni.getSystemInfoSync().platform == 'ios') {
				uni.setStorageSync('initUrl', location.href);
			}
			// #endif

			uni.onNetworkStatusChange(function(res) {
				if (!res.isConnected) {
					uni.showModal({
						title: '网络失去链接',
						content: '请检查网络链接',
						showCancel: false
					});
				}
			});

			this.$store.dispatch('init');

			// 自动授权登录
			if (!uni.getStorageSync('token')) {
				this.getAuthInfo();
			} else {
				this.$api.sendRequest({
					url: '/api/member/info',
					complete: () => {
						if (!uni.getStorageSync('token')) this.getAuthInfo();

					},
					success: res => {
						if (res.code == 0) {
							uni.setStorageSync('store', res.data.store_info || {});
							uni.setStorageSync('is_bind_store', res.data.is_bind_store || '');
						}
					}
				});
			}
		},
		onShow: function() {},
		onHide: function() {},
		methods: {
			/**
			 * 获取授权信息
			 */
			getAuthInfo() {
				// #ifdef H5
				if (this.$util.isWeiXin()) {
					this.$util.getUrlCode(urlParams => {
						if (urlParams.source_member) uni.setStorageSync('source_member', urlParams.source_member);

						if (urlParams.code == undefined) {
							this.$api.sendRequest({
								url: '/wechat/api/wechat/authcode',
								data: {
									redirect_url: location.href,
									scopes: 'snsapi_userinfo'
								},
								success: res => {
									if (res.code >= 0) {
										location.href = res.data;
									}
								}
							});
						} else {
							this.$api.sendRequest({
								url: '/wechat/api/wechat/authcodetoopenid',
								data: {
									code: urlParams.code
								},
								success: res => {
									if (res.code >= 0) {
										let data = {};
										if (res.data.openid) data.wx_openid = res.data.openid;
										if (res.data.unionid) data.wx_unionid = res.data.unionid;
										if (res.data.userinfo) Object.assign(data, res.data.userinfo);
										this.authLogin(data);
									}
								}
							});
						}
					});
				}
				// #endif

				// #ifdef MP
				this.getCode(data => {
					this.authLogin(data, 'authOnlyLogin');
				});
				// #endif
			},
			/**
			 * 授权登录
			 */
			authLogin(data, type = 'authLogin') {
				if (uni.getStorageSync('source_member')) data.source_member = uni.getStorageSync('source_member');

				uni.setStorage({
					key: 'authInfo',
					data: data
				});

				this.$api.sendRequest({
					url: type == 'authLogin' ? '/api/login/auth' : '/api/login/authonlylogin',
					data,
					success: res => {
						if (res.code >= 0) {
							uni.setStorage({
								key: 'token',
								data: res.data.token,
								success: () => {
									this.$store.dispatch('getCartNumber');
									this.$store.commit('setToken', res.data.token);
									this.getMemberInfo()
								}
							});
						}
					}
				});
			},
			/**
			 * 查询会员信息
			 */
			getMemberInfo() {
				this.$api.sendRequest({
					url: '/api/member/info',
					data: {},
					success: res => {
						if (res.code == 0) {
							uni.setStorageSync('store', res.data.store_info || {});
							uni.setStorageSync('is_bind_store', res.data.is_bind_store || '');
						}
					}
				});
			},
			/**
			 * 公众号分享设置
			 */
			shareConfig() {
				this.$api.sendRequest({
					url: '/wechat/api/wechat/share',
					data: {
						url: window.location.href
					},
					success: res => {
						if (res.code == 0) {
							var wxJS = new Weixin();
							wxJS.init(res.data.jssdk_config);

							let share_data = JSON.parse(JSON.stringify(res.data.share_config.data));
							if (share_data) {
								wxJS.setShareData({
										title: share_data.title,
										desc: share_data.desc,
										link: share_data.link,
										imgUrl: this.$util.img(share_data.imgUrl)
									},
									res => {
										console.log(res);
									}
								);
							}

							let hideOptionMenu = res.data.share_config.permission.hideOptionMenu;
							let hideMenuItems = res.data.share_config.permission.hideMenuItems;

							if (hideOptionMenu) {
								wxJS.weixin.hideOptionMenu(); //屏蔽分享好友等按钮
							} else {
								wxJS.weixin.showOptionMenu(); //放开分享好友等按钮
							}
						}
					},
					fail: err => {}
				});
			}
		},
		watch: {
			$route: {
				handler(newName, oldName) {
					if (this.$util.isWeiXin()) {
						this.shareConfig();
					}
				},
				// 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
				immediate: true
			}
		}
	};
</script>
<style lang="scss">
	@import './common/css/iconfont/iconfont.css';
	@import './common/css/icondiy/iconfont.css'; // 自定义图标库
	@import './common/css/main.scss';

	// ********** 这里要引用扩展图标库文件 **********
	@import './common/css/icon_extend/diy_default1.css';
</style>
