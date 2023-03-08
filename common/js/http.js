import Config from './config.js'
import Util from './util.js'
import store from '@/store/index.js'

// #ifdef H5
const app_type = Util.isWeiXin() ? 'wechat' : 'h5';
const app_type_name = Util.isWeiXin() ? '微信公众号' : 'H5';
// #endif

// #ifdef MP-WEIXIN
const app_type = 'weapp';
const app_type_name = '微信小程序';
// #endif

// #ifdef MP-ALIPAY
const app_type = 'aliapp';
const app_type_name = '支付宝小程序';
// #endif

// #ifdef MP-BAIDU
const app_type = 'baiduapp';
const app_type_name = '百度小程序';
// #endif

// #ifdef MP-TOUTIAO
const app_type = 'MP-TOUTIAO';
const app_type_name = '头条小程序';
// #endif

// #ifdef MP-QQ
const app_type = 'MP-QQ';
const app_type_name = 'QQ小程序';
// #endif

// #ifdef APP-PLUS
const app_type = 'app';
const app_type_name = 'APP';
// #endif

export default {
	sendRequest(params) {
		var method = params.data != undefined ? 'POST' : 'GET', // 请求方式
			url = Config.baseUrl + params.url, // 请求路径
			data = {
				app_type,
				app_type_name
			};

		// token
		if (uni.getStorageSync('token')) data.token = uni.getStorageSync('token');

		// 门店id
		if (uni.getStorageSync('store')) data.store_id = uni.getStorageSync('store').store_id || '';

		// 参数
		if (params.data != undefined) Object.assign(data, params.data);

		if (params.async === false) {
			//同步
			return new Promise((resolve, reject) => {
				uni.request({
					url: url,
					method: method,
					data: data,
					header: params.header || {
						'content-type': 'application/x-www-form-urlencoded;application/json'
					},
					dataType: params.dataType || 'json',
					responseType: params.responseType || 'text',
					success: (res) => {
						if (res.data.code == -3 && store.state.siteState > 0) {
							store.commit('setSiteState', -3)
							Util.redirectTo('/pages_tool/storeclose/storeclose', {}, 'reLaunch');
							return;
						}
						if (res.data.refreshtoken) {
							uni.setStorage({
								key: 'token',
								data: res.data.refreshtoken
							});
						}
						if (res.data.code == -10009 || res.data.code == -10010) {
							uni.removeStorage({
								key: 'token'
							})
						}
						resolve(res.data);
					},
					fail: (res) => {
						reject(res);
					},
					complete: (res) => {
						reject(res);
					}
				});
			});
		} else {
			//异步
			uni.request({
				url: url,
				method: method,
				data: data,
				header: params.header || {
					'content-type': 'application/x-www-form-urlencoded;application/json'
				},
				dataType: params.dataType || 'json',
				responseType: params.responseType || 'text',
				success: (res) => {
					if (res.data.code == -3 && store.state.siteState > 0) {
						store.commit('setSiteState', -3)
						Util.redirectTo('/pages_tool/storeclose/storeclose', {}, 'reLaunch');
						return;
					}
					if (res.data.refreshtoken) {
						uni.setStorage({
							key: 'token',
							data: res.data.refreshtoken
						});
					}
					if (res.data.code == -10009 || res.data.code == -10010) {
						uni.removeStorage({
							key: 'token'
						})
					}
					typeof params.success == 'function' && params.success(res.data);
				},
				fail: (res) => {
					typeof params.fail == 'function' && params.fail(res);
				},
				complete: (res) => {
					typeof params.complete == 'function' && params.complete(res);
				}
			});
		}
	}
}
