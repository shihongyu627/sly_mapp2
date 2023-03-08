const langList = ['zh-cn', 'en-us'];

var locale = uni.getStorageSync('lang') || "zh-cn"; //设置语言

export default {
	langList: ['zh-cn', 'en-us'],
	/**
	 * * 解析多语言
	 * @param {Object} field
	 */
	lang(field) {
		let _this = getCurrentPages()[getCurrentPages().length - 1];
		if (!_this) return;

		var value = '';
		let newRoute;
		try {
			//公共语言包
			var lang = require('../../lang/' + locale + '/common.js').lang;
			
			//当前页面语言包
			let route = _this.route.split("/");
			newRoute = route.slice(1, route.length);
			let currentPageLang = require('../../lang/' + locale + '/' + newRoute.join("/") + '.js').lang;
			
			for (let f in currentPageLang) {
				lang[f] = currentPageLang[f];
			}

			var arr = field.split(".");
			if (arr.length > 1) {
				for (let i in arr) {
					var next = parseInt(i) + 1;
					if (next < arr.length) {
						value = lang[arr[i]][arr[next]];
					}
				}
			} else {
				value = lang[field];
			}
		} catch (e) {
			
			if (field.indexOf("common.") != -1 || field.indexOf("tabBar.") != -1) {
				value = lang[field];
			} else {
				value = field;
			}
		}

		if (arguments.length > 1) {
			//有参数,需要替换
			for (var i = 1; i < arguments.length; i++) {
				value = value.replace("{" + (i - 1) + "}", arguments[i]);
			}
		}

		if (value == undefined || (value == 'title' && field == 'title')) value = ''; // field
		return value;
	},
	//切换语言
	change(value) {
		let _this = getCurrentPages()[getCurrentPages().length - 1];
		if (!_this) return;

		uni.setStorageSync("lang", value);
		locale = uni.getStorageSync('lang') || "zh-cn"; //设置语言

		this.refresh();

		uni.reLaunch({
			url: '/pages/member/index'
		});
	},
	//刷新标题、tabbar
	refresh() {
		let _this = getCurrentPages()[getCurrentPages().length - 1];
		if (!_this) return;

		this.title(this.lang("title"));

		//设置tabbar的文字语言
		uni.setTabBarItem({
			index: 0,
			text: this.lang("tabBar.home")
		});
		uni.setTabBarItem({
			index: 1,
			text: this.lang("tabBar.category")
		});
		uni.setTabBarItem({
			index: 2,
			text: this.lang("tabBar.cart")
		});
		uni.setTabBarItem({
			index: 3,
			text: this.lang("tabBar.member")
		});
	},
	title(str) {
		if (str) {
			uni.setNavigationBarTitle({
				title: str,
				success: function(res){
				},
				fail: function(err){
				}
			});
		}
	},
	// 获取语言包列表
	list() {
		var list = [];
		try {
			//公共语言包
			for (var i = 0; i < langList.length; i++) {
				let item = require('../../lang/' + langList[i] + '/common.js').lang
				list.push({
					name: item.common.name,
					value: langList[i]
				});
			}
		} catch (e) {
			// "没有找到语言包:", '../../lang/' + locale + '/common.js'
		}
		return list;
	}
}
