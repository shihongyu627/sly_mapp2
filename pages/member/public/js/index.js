let systemInfo = uni.getSystemInfoSync();
export default {
	data() {
		return {
			diyData: {
				global: {
					title: '',
					popWindow: {
						imageUrl: '',
						count: -1,
						link: {},
						imgWidth: '',
						imgHeight: ''
					}
				}
			},
			name: 'DIY_VIEW_MEMBER_INDEX',

			store: {}, //首页展示的门店详情
			storeId: 0, //首页展示的门店id

			pageHeight: '0',
			headerHeight: '0',
			bottomHeight: '0',
			topIndexValue: null,
			statusBarHeight: systemInfo.statusBarHeight,
			collectTop: 44,
			showTip: false,
			mpCollect: false,
			mpShareData: null, //小程序分享数据
			scrollTop: 0, // 滚动位置
			paddingTop: (44 + systemInfo.statusBarHeight) + 'px',
			marginTop: -(44 + systemInfo.statusBarHeight) + 'px',

			memberInfo: null,
			token: '',
			menuList: [{
					name: '我的预约',
					icon: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20221217/20221217104652167124521212040.png',
					url: '/orderReserve/list/list'
				}, {
					name: '商城订单',
					icon: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20221217/20221217104652167124521202349.png',
					url: '/pages/order/list'
				}, {
					name: '我的拼团',
					icon: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20221217/20221217104651167124521167217.png',
					url: '/pages_promotion/pintuan/my_spell'
				}, {
					name: '我的砍价',
					icon: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20221217/20221217104652167124521204760.png',
					url: '/pages_promotion/bargain/my_bargain'
				}, {
					name: '体验订单',
					icon: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20221217/20221217104651167124521168218.png',
					url: '/pages_tool/member/card/order/list/list'
				}, {
					name: '邀请好友',
					icon: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20221217/20221217104652167124521212524.png',
					url: '/pages_promotion/fenxiao/rule'
				}, {
					name: '地址管理',
					icon: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20221217/20221217104652167124521205798.png',
					url: '/pages_tool/member/address'
				},
				// {
				// 	name: '产品检验',
				// 	icon: '',
				// 	url:''
				// }, {
				// 	name: '视力档案',
				// 	icon: '',
				// 	url:''
				// }, 
				{
					name: '联系客服',
					icon: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20221217/20221217104652167124521204272.png',
					url: 'kefu'
				}, {
					name: '我要合作',
					icon: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20221217/20221217104652167124521208936.png',
					url: '/openStore/index'
				}
			],
			adv_list: [],
			menuListWrok: [{
				name: '门店订单',
				icon: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20221217/20221217104652167124521202349.png',
				url: '/sellStore/order/list/list'
			}, {
				name: '体验核销',
				icon: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20221217/20221217105434167124567496472.png',
				url: '/sellStore/tiyan/list/list'
			}, {
				name: '扫一扫',
				icon: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20221217/20221217105434167124567498031.png',
				url: '/pages_tool/verification/index'
			}]
		};
	},
	computed: {
		storeToken() {
			return this.$store.state.token;
		},
		bgColor() {
			let str = '';
			if (this.diyData && this.diyData.global) {
				str = this.diyData.global.pageBgColor;
			}
			return str;
		},
		bgImg() {
			let str = '';
			if (this.diyData && this.diyData.global) {
				str = this.diyData.global.topNavBg ? 'url(' + this.$util.img(this.diyData.global.bgUrl) + ')' : this
					.diyData.global.pageBgColor;
			}
			return str;
		},
		bgUrl() {
			let str = '';
			if (this.diyData && this.diyData.global) {
				str = this.diyData.global.topNavBg ? 'transparent' : this.diyData.global.bgUrl;
			}
			return str;
		},
		bgNav() {
			if (this.diyData.global.topNavColor) {
				return {
					background: this.diyData.global.topNavColor
				};
			} else {
				return {
					background: '#ffffff'
				};
			}
		},
		backgroundUrl() {
			var str = this.diyData.global.bgUrl && this.diyData.global.bgUrl != 'transparent' ? 'url(' + this.$util.img(
				this.diyData.global.bgUrl) + ') ' : '';
			return str;
		},
		textNavColor() {
			if (this.diyData && this.diyData.global && this.diyData.global.textNavColor) {
				return this.diyData.global.textNavColor;
			} else {
				return '#ffffff';
			}
		},
		openBottomNav() {
			let str = false;
			if (this.diyData && this.diyData.global) {
				str = this.diyData.global.openBottomNav;
			}
			return str;
		},
		globalS() {
			return this.diyData.global;
		},
		//计算首页弹框的显示宽高
		popWindowStyle() {
			// 做大展示宽高
			let max_width = 290;
			let max_height = 410;
			// 参照宽高
			let refer_width = 290;
			let refer_height = 290;

			let scale = this.diyData.global.popWindow.imgHeight / this.diyData.global.popWindow.imgWidth;
			let width, height;
			if (scale < refer_height / refer_width) {
				width = max_width;
				height = width * scale;
			} else {
				height = max_height;
				width = height / scale;
			}

			let obj = '';
			if (this.diyData.global.popWindow && this.diyData.global.popWindow.count != -1 && this.diyData.global
				.popWindow.imageUrl) {
				obj += 'height:' + (height * 2) + 'rpx;';
				obj += 'width:' + (width * 2) + 'rpx;';
			}
			return obj;
		},
		scrollHeight() {
			if (this.pageHeight != undefined && this.headerHeight != undefined && this.bottomHeight != undefined) {
				return 'calc(' + this.pageHeight * 2 + 'rpx - ' + this.headerHeight + ' - ' + this.bottomHeight + ')';
			} else {
				return '100vh';
			}
		},
		scrollTopHeight() {
			if (this.pageHeight != undefined && this.headerHeight != undefined && this.bottomHeight != undefined) {
				return 'calc(' + this.pageHeight * 2 + 'rpx - ' + this.headerHeight + ' - ' + this.bottomHeight +
					' - 80rpx)';
			} else {
				return '100vh';
			}
		}
	},
	watch: {
		storeToken: function(nVal, oVal) {
			if (nVal) {
				this.getMemberInfo();
				if (uni.getStorageSync('source_member')) this.$util.onSourceMember(uni.getStorageSync(
					'source_member'));
			}
		}
	},
	onLoad(data) {
		uni.hideTabBar();
		if (data.code) {
			this.$api.sendRequest({
				url: '/wechat/api/wechat/authcodetoopenid',
				data: {
					code: data.code
				},
				success: res => {
					if (res.code >= 0) {
						if (res.data.userinfo.nickName) this.modifyNickname(res.data.userinfo.nickName);
						if (res.data.userinfo.avatarUrl) this.modifyHeadimg(res.data.userinfo
							.avatarUrl);
					}
				}
			});
		}
		this.getAdvDetail()
	},
	onShow() {
		this.store = uni.getStorageSync('store') ? uni.getStorageSync('store') : null;
		if (this.store) this.storeId = this.store.store_id;
		this.token = uni.getStorageSync('token');
		this.getMemberInfo()
	},
	/**
	 * 下拉刷新
	 */
	onPullDownRefresh() {
		this.getAdvDetail()
		this.getMemberInfo()
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	methods: {
		memberLabel(str) {
			return str.split(',').join(' | ')
		},
		goHref(url) {
			if (!uni.getStorageSync('token')) {
				this.getWxAuth()
				return;
			}
			// #ifdef MP-WEIXIN
			if ((this.memberInfo.nickname.indexOf('u_') != -1 && this.memberInfo.nickname == this.memberInfo
					.username) || this.memberInfo.nickname == this.memberInfo.mobile) {
				this.getWxAuth(() => {
					this.$util.redirectTo(url);
				});
			} else {
				if (this.memberInfo && this.memberInfo.member_level > 1 && url == '/pages_tool/memberVip/list/list') {
					this.$util.redirectTo('/pages_tool/memberVip/info/info');
					return
				}
				this.$util.redirectTo(url);
			}
			// #endif
		},
		applyDealer() {
			if (!uni.getStorageSync('token')) {
				this.getWxAuth()
				return;
			}
			// if (this.memberInfo && this.memberInfo.is_dealer == 1) {
			// 	this.$util.redirectTo('/sellStore/index/index',{
			// 		type:"dealer"
			// 	});
			// 	return
			// }
			this.$util.redirectTo('/sellStore/index/index', {
				type: "dealer",
				is_dealer_auth_account: this.memberInfo.is_dealer_auth_account
			});
		},
		applyStore() {
			if (!uni.getStorageSync('token')) {
				this.getWxAuth()
				return;
			}
			this.$util.redirectTo('/sellStore/index/index', {
				type: "store",
				is_store_auth_account: this.memberInfo.is_store_auth_account
			});
			// if (this.memberInfo && this.memberInfo.is_store == 1) {
			// 	this.$util.redirectTo('/sellStore/index/index',{
			// 		type:"store"
			// 	});
			// 	return
			// }
		},
		invitePost() {
			if (!uni.getStorageSync('token')) {
				this.getWxAuth()
				return;
			}
			this.$util.redirectTo('/pages_promotion/fenxiao/rule');
		},
		/**
		 * 自定义跳转
		 * @param {Object} data
		 */
		// diyRedirect(data) {
		// 	if (data.wap_url && data.wap_url.indexOf('http') == -1 && data.wap_url.indexOf('https') == -1) {
		// 		if (!uni.getStorageSync('token')) {
		// 			this.$refs.login.open(data.wap_url);
		// 			return;
		// 		}
		// 	}
		// 	data.diy_name = data.name;
		// 	this.$util.diyRedirectTo(data);
		// },
		getAdvDetail() {
			this.$api.sendRequest({
				url: '/api/adv/detail',
				data: {
					keyword: 'NS_MEMBER_INDEX'
				},
				success: res => {
					if (res.code == 0) {
						this.adv_list = res.data.adv_list || []
						this.adv_list.map((item) => {
							if (item.adv_url) {
								item.adv_url = JSON.parse(item.adv_url)
								item.adv_url = item.adv_url?.wap_url
							}
						})
						console.log(this.adv_list);
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
						if (!this.memberInfo) this.memberInfo = res.data;
						else Object.assign(this.memberInfo, res.data);
						uni.setStorageSync('store', res.data.store_info || {});
						uni.setStorageSync('is_bind_store', res.data.is_bind_store || '');
						let newArr = [{
								name: '我的预约',
								icon: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20221217/20221217104652167124521212040.png',
								url: '/orderReserve/list/list'
							}, {
								name: '商城订单',
								icon: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20221217/20221217104652167124521202349.png',
								url: '/pages/order/list'
							}, {
								name: '我的拼团',
								icon: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20221217/20221217104651167124521167217.png',
								url: '/pages_promotion/pintuan/my_spell'
							}, {
								name: '我的砍价',
								icon: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20221217/20221217104652167124521204760.png',
								url: '/pages_promotion/bargain/my_bargain'
							}, {
								name: '体验订单',
								icon: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20221217/20221217104651167124521168218.png',
								url: '/pages_tool/member/card/order/list/list'
							}, {
								name: '邀请好友',
								icon: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20221217/20221217104652167124521212524.png',
								url: '/pages_promotion/fenxiao/rule'
							}, {
								name: '地址管理',
								icon: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20221217/20221217104652167124521205798.png',
								url: '/pages_tool/member/address'
							},
							{
								name: '联系客服',
								icon: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20221217/20221217104652167124521204272.png',
								url: 'kefu'
							}, {
								name: '我要合作',
								icon: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20221217/20221217104652167124521208936.png',
								url: '/openStore/index'
							},

						]

						// if (res.data.is_store == 1) {
						// 	let dd = {
						// 		name: '工作台',
						// 		icon: 'https://img.static.idocore.com/upload/1/common/images/20221011/20221011104843166545652351142.png',
						// 		url: '/sellStore/index/index?type=store'
						// 	}
						// 	newArr.push(dd)
						// }
						if (res.data.is_apply_store != 0) {
							let dd = {
								name: '开店流程',
								icon: 'https://img.static.idocore.com/upload/1/common/images/20221027/20221027083948166687438880732.png',
								url: '/openStore/applyStep'
							}
							newArr.push(dd)
						}
						if (res.data.is_apply_dealer != 0) {
							let dd = {
								name: '合作流程',
								icon: 'https://img.static.idocore.com/upload/1/common/images/20221027/20221027083948166687438881531.png',
								url: '/applyDealer/apply'
							}
							newArr.push(dd)
						}

						this.menuList = newArr
						if (!res.data.mobile) {
							this.$refs.bindMobile.open();
						}
					}
				}
			});
		},
		/**
		 * 修改昵称
		 * @param {Object} nickName
		 */
		modifyNickname(nickName) {
			this.$api.sendRequest({
				url: '/api/member/modifynickname',
				data: {
					nickname: nickName
				},
				success: res => {
					if (res.code == 0) this.memberInfo.nickname = nickName;
				}
			});
		},
		/**
		 * 修改头像
		 */
		modifyHeadimg(headimg) {
			this.$api.sendRequest({
				url: '/api/member/modifyheadimg',
				data: {
					headimg: headimg
				},
				success: res => {
					if (res.code == 0) this.memberInfo.headimg = headimg;
				}
			});
		},
		/**
		 * 获取微信授权
		 */
		getWxAuth(callback) {
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open('/pages/member/index');
				return;
			}
			// #ifdef MP-WEIXIN
			wx.getUserProfile({
				desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
				success: res => {
					this.modifyNickname(res.userInfo.nickName);
					this.modifyHeadimg(res.userInfo.avatarUrl);
					typeof callback == 'function' && callback();
				}
			});
			// #endif

			// #ifdef H5
			if (this.$util.isWeiXin()) {
				this.$api.sendRequest({
					url: '/wechat/api/wechat/authcode',
					data: {
						scopes: 'snsapi_userinfo',
						redirect_url: this.$config.h5Domain + '/pages/member/index'
					},
					success: res => {
						if (res.code >= 0) {
							location.href = res.data;
						}
					}
				});
			}
			// #endif
		},
	}
};
