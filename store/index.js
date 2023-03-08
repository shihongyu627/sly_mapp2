import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import Http from '../common/js/http.js'
import colorList from '../common/js/style_color.js'

const store = new Vuex.Store({
	state: {
		tabBarList: '',
		siteState: 1,
		themeStyle: '',
		addonIsExist: {
			bundling: 0,
			coupon: 0,
			discount: 0,
			fenxiao: 0,
			gift: 0,
			groupbuy: 0,
			manjian: 0,
			memberconsume: 0,
			memberrecharge: 0,
			memberregister: 0,
			membersignin: 0,
			memberwithdraw: 0,
			memberrecommend: 0,
			pintuan: 0,
			pointexchange: 0,
			seckill: 0,
			store: 0,
			topic: 0,
			bargain: 0,
			membercancel: 0,
			servicer: 0,
			supermember: 0,
			giftcard: 0,
			divideticket: 0,
			scenefestival: 0,
			birthdaygift: 0,
			pinfan: 0
		},
		sourceMember: 0, // 来源会员
		authInfo: {}, // 授权信息
		token: null,
		flRefresh: 0,
		location: null, // 定位信息
		defaultImg: {
			goods: '',
			head: '',
			store: ''
		},
		cartNumber: 0,
		cartList: {},
		cartMoney: 0,
		siteInfo: null,
		cartChange: 0
	},
	mutations: {
		setSiteState(state, siteStateVal) {
			state.siteState = siteStateVal;
		},
		setCartNumber(state, cartNumber) {
			state.cartNumber = cartNumber
		},
		setThemeStyle(state, value) {
			state.themeStyle = value
			uni.setStorageSync('theme_style', value);
		},
		setTabBarList(state, value) {
			state.tabBarList = value;
			uni.setStorageSync('bottomNav', value);
		},
		setAddonIsExist(state, value) {
			state.addonIsExist = value;
			uni.setStorageSync('addon_is_exist', value);
		},
		setToken(state, value) {
			state.token = value;
		},
		setAuthinfo(state, value) {
			state.authInfo = value;
		},
		setSourceMember(state, value) {
			state.sourceMember = value;
		},
		setflRefresh(state, flRefreshVal) {
			state.flRefresh = flRefreshVal;
		},
		setLocation(state, value) {
			state.location = value;
		},
		setDefaultImg(state, value) {
			uni.setStorageSync('default_img', value)
			state.defaultImg = value;
		},
		setCartList(state, value) {
			state.cartList = value;
		},
		setCartMoney(state, value) {
			state.cartMoney = value;
		},
		setSiteInfo(state, value) {
			state.siteInfo = value;
			uni.setStorageSync('siteInfo', value)
		},
		setCartChange(state) {
			state.cartChange += 1;
		}
	},
	actions: {
		init() {
			return new Promise((resolve, reject) => {
				Http.sendRequest({
					url: '/api/config/init',
					success: res => {
						var data = res.data;
						if (data) {

							this.commit('setCartNumber', data.cart_count);

							this.commit('setThemeStyle', colorList[data.style_theme.name]);

							// 底部导航
							this.commit('setTabBarList', data.diy_bottom_nav);

							this.commit('setAddonIsExist', data.addon_is_exist);

							this.commit('setDefaultImg', data.default_img);

							this.commit('setSiteInfo', data.site_info);

							uni.setStorageSync('copyright', data.copyright);

							resolve(data);
						}
					}
				});
			})
		},
		//查询购物车数量
		getCartNumber() {
			if (uni.getStorageSync("token")) {
				Http.sendRequest({
					url: '/api/cart/lists',
					success: res => {
						if (res.code == 0) {
							let cartList = {},
								count = 0,
								money = 0;
							res.data.forEach(item => {
								cartList['sku_' + item.sku_id] = item;
								count += item.num;
								money += item.total_money;
							})
							this.commit('setCartList', cartList);
							this.commit('setCartNumber', count);
							this.commit('setCartMoney', money);
						}
					}
				});
			} else {
				this.commit('setCartNumber', 0);
				this.commit('setCartList', {});
				this.commit('setCartMoney', 0);
			}
		},
	}
})
export default store
