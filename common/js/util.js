import Config from './config.js'
import store from '@/store/index.js'
import Http from './http.js'
import {
	Weixin
} from 'common/js/wx-jssdk.js';

export default {
	/**
	 * 页面跳转
	 * @param {string} to 跳转链接 /pages/idnex/index
	 * @param {Object} param 参数 {key : value, ...}
	 * @param {string} mode 模式 
	 */
	redirectTo(to, param, mode) {
		let url = to;
		let tabbarList = ['/pages/index/index', '/pages/store/list/list', '/pages/goods/cart',
			'/pages/member/index', '/pages/shop/index'
		]
		if (param != undefined) {
			Object.keys(param).forEach(function(key) {
				if (url.indexOf('?') != -1) {
					url += "&" + key + "=" + param[key];
				} else {
					url += "?" + key + "=" + param[key];
				}
			});
		}
		for (let i = 0; i < tabbarList.length; i++) {
			if (url.indexOf(tabbarList[i]) == 0) {
				uni.switchTab({
					url
				})
				return;
			}
		}
		switch (mode) {
			case 'tabbar':
				// 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
				uni.switchTab({
					url
				})
				break;
			case 'redirectTo':
				// 关闭当前页面，跳转到应用内的某个页面。
				uni.redirectTo({
					url
				});
				break;
			case 'reLaunch':
				// 关闭所有页面，打开到应用内的某个页面。
				uni.reLaunch({
					url
				});
				break;
			default:
				// 保留当前页面，跳转到应用内的某个页面
				uni.navigateTo({
					url
				});
		}
	},
	/**
	 * 图片路径转换
	 * @param {String} img_path 图片地址
	 * @param {Object} params 参数，针对商品、相册里面的图片区分大中小，size: big、mid、small
	 */
	img(img_path, params) {
		var path = "";
		if (img_path != undefined && img_path != "") {
			if (img_path.split(',').length > 1) {
				img_path = img_path.split(',')[0];
			}
			if (params && img_path != this.getDefaultImage().goods) {
				// 过滤默认图
				let arr = img_path.split(".");
				let suffix = arr[arr.length - 1];
				arr.pop();
				arr[arr.length - 1] = arr[arr.length - 1] + "_" + params.size.toUpperCase();
				arr.push(suffix);
				img_path = arr.join(".");
			}
			if (img_path.indexOf("http://") == -1 && img_path.indexOf("https://") == -1) {
				path = Config.imgDomain + "/" + img_path;
			} else {
				path = img_path;
			}
			// 处理商品助手的图片路径
			path = path.replace("addons/NsGoodsAssist/", "").replace("shop/goods/", "");
		}
		// path += '?t=' + parseInt(new Date().getTime() / 1000);
		return path;
	},
	/**
	 * 去掉逗号
	 * @param {String} data 
	 */
	removeComma(data) {
		var path = data;
		if (!path) {
			return path
		}
		if (path.indexOf(",") >= 0) {
			let reg = new RegExp(',', 'g')
			path = path.replace(reg, "")
		} else if (path.indexOf("-") >= 0) {
			let reg = new RegExp('-', 'g')
			path = path.replace(reg, "")
		} else {
			path = path;
		}
		return path;
	},
	/**
	 * 富文本
	 * @param {String} str 
	 */
	richText(str) {
		if (str) {
			let html = str.replace(
				/<img /gi,
				'<img style="width:100%;height:auto;display:block"'
			);

			html = html.replace(/<img[^>]*>/gi, function(match) {
				var match = match.replace(
					/style\s*?=\s*?([‘"])[\s\S]*?\1/gi,
					'style="width:100%;height:auto;display:block"'
				);
				return match;
			});
			return html;
		} else {
			return "";
		}
	},
	/**
	 * 富文本
	 * @param {String} str 
	 */
	getVideo(data) {
		if (data) {
			let videoList = [];
			let videoReg = /<video.*?(?:>|\/>)/gi; //匹配到字符串中的 video 标签
			let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i; //匹配到字符串中的 video 标签 的路径
			let arr = data.match(videoReg) || []; // arr 为包含所有video标签的数组
			let articleList = data.split('</video>') // 把字符串 从视频标签分成数组
			arr.forEach((item, index) => {
				var src = item.match(srcReg);
				videoList.push(src[1]) //所要显示的字符串中 所有的video 标签 的路径
			})
			let needArticleList = [];
			articleList.forEach((item, index) => {
				if (item != "" && item != undefined) { // 常见的标签渲染
					needArticleList.push({
						type: 'rich-text',
						value: item + "</video>"
					});
				}
				let articleListLength = articleList.length; // 插入到原有video 标签位置
				if (index < articleListLength && videoList[index] != undefined) {
					needArticleList.push({
						type: 'video',
						value: videoList[index]
					})
				}
			})
			console.log(needArticleList, '富文本解析');
			return needArticleList
		} else {
			return "";
		}
	},
	/**
	 * 时间戳转日期格式
	 * @param {Object} timeStamp
	 */
	timeStampTurnTime(timeStamp, type = "") {
		if (timeStamp != undefined && timeStamp != "" && timeStamp > 0) {
			var date = new Date();
			date.setTime(timeStamp * 1000);
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			m = m < 10 ? ('0' + m) : m;
			var d = date.getDate();
			d = d < 10 ? ('0' + d) : d;
			var h = date.getHours();
			h = h < 10 ? ('0' + h) : h;
			var minute = date.getMinutes();
			var second = date.getSeconds();
			minute = minute < 10 ? ('0' + minute) : minute;
			second = second < 10 ? ('0' + second) : second;
			if (type) {
				if (type == 'yearMonthDay') {
					return y + '年' + m + '月' + d + '日';
				}
				return y + '-' + m + '-' + d;
			} else {
				return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
			}

		} else {
			return "";
		}
	},
	/**
	 * 非商品图片路径转换
	 * @param {String} img_path 图片地址
	 * @param {Object} params 参数，针对商品、相册里面的图片区分大中小，size: big、mid、small
	 */
	loadimg(img_path, params) {
		var path = "";
		if (img_path && img_path != undefined && img_path != "") {
			if (img_path.indexOf("http://") == -1 && img_path.indexOf("https://") == -1) {
				path = Config.imgDomain + "/" + img_path;
			} else {
				path = img_path;
			}
		}
		return path;
	},
	/**
	 * 日期格式转时间戳
	 * @param {Object} timeStamp
	 */
	timeTurnTimeStamp(string) {
		var f = string.split(' ', 2);
		var d = (f[0] ? f[0] : '').split('-', 3);
		var t = (f[1] ? f[1] : '').split(':', 3);
		return (new Date(
			parseInt(d[0], 10) || null,
			(parseInt(d[1], 10) || 1) - 1,
			parseInt(d[2], 10) || null,
			parseInt(t[0], 10) || null,
			parseInt(t[1], 10) || null,
			parseInt(t[2], 10) || null
		)).getTime() / 1000;
	},
	/**
	 * 倒计时
	 * @param {Object} seconds 秒
	 */
	countDown(seconds) {
		let [day, hour, minute, second] = [0, 0, 0, 0]
		if (seconds > 0) {
			day = Math.floor(seconds / (60 * 60 * 24))
			hour = Math.floor(seconds / (60 * 60)) - (day * 24)
			minute = Math.floor(seconds / 60) - (day * 24 * 60) - (hour * 60)
			second = Math.floor(seconds) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
		}
		if (day < 10) {
			day = '0' + day
		}
		if (hour < 10) {
			hour = '0' + hour
		}
		if (minute < 10) {
			minute = '0' + minute
		}
		if (second < 10) {
			second = '0' + second
		}
		return {
			d: day,
			h: hour,
			i: minute,
			s: second
		};
	},
	/**
	 * 数值去重
	 * @param {Array} arr 数组
	 * @param {string} field 字段
	 */
	unique(arr, field) {
		const res = new Map();
		return arr.filter((a) => !res.has(a[field]) && res.set(a[field], 1));
	},
	/**
	 * 判断值是否在数组中
	 * @param {Object} elem
	 * @param {Object} arr
	 * @param {Object} i
	 */
	inArray: function(elem, arr) {
		return arr == null ? -1 : arr.indexOf(elem);
	},
	/**
	 * 获取某天日期
	 * @param {Object} day
	 */
	getDay: function(day) {
		var today = new Date();
		var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
		today.setTime(targetday_milliseconds);

		const doHandleMonth = function(month) {
			var m = month;
			if (month.toString().length == 1) {
				m = "0" + month;
			}
			return m
		}

		var tYear = today.getFullYear();
		var tMonth = today.getMonth();
		var tDate = today.getDate();
		var tWeek = today.getDay();
		var time = parseInt(today.getTime() / 1000);
		tMonth = doHandleMonth(tMonth + 1);
		tDate = doHandleMonth(tDate);

		const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
		return {
			't': time,
			'y': tYear,
			'm': tMonth,
			'd': tDate,
			'w': week[tWeek]
		};
	},
	/**
	 * 图片选择加上传
	 * @param number num
	 * @param {Object} params
	 * @param {Object} callback
	 * @param string url
	 * return array
	 */
	upload: function(num, params, callback, url) {
		// #ifdef H5
		var app_type = this.isWeiXin() ? 'wechat' : 'h5';
		var app_type_name = this.isWeiXin() ? '微信公众号' : 'H5';
		// #endif

		// #ifdef MP-WEIXIN
		var app_type = 'weapp';
		var app_type_name = '微信小程序';
		// #endif

		// #ifdef MP-ALIPAY
		var app_type = 'aliapp';
		var app_type_name = '支付宝小程序';
		// #endif

		// #ifdef MP-BAIDU
		var app_type = 'baiduapp';
		var app_type_name = '百度小程序';
		// #endif

		// #ifdef MP-TOUTIAO
		var app_type = 'MP-TOUTIAO';
		var app_type_name = '头条小程序';
		// #endif

		// #ifdef MP-QQ
		var app_type = 'MP-QQ';
		var app_type_name = 'QQ小程序';
		// #endif
		var data = {
			token: uni.getStorageSync('token'),
			app_type: app_type,
			app_type_name: app_type_name
		}
		data = Object.assign(data, params);

		var imgs_num = num;
		var _self = this;

		uni.chooseImage({
			count: imgs_num,
			sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], //从相册或者拍照
			success: async function(res) {
				const tempFilePaths = res.tempFilePaths;
				var _data = data;
				var imgs = [];
				uni.showLoading({
					title: '图片上传中'
				})
				for (var i = 0; i < tempFilePaths.length; i++) {
					var path = await _self.upload_file_server(tempFilePaths[i], _data, params.path,
						url);
					imgs.push(path);
					if (imgs.length == tempFilePaths.length) {
						uni.hideLoading()
						uni.showToast({
							title: '上传成功',
							icon: 'none'
						})
						typeof callback == 'function' && callback(imgs);
					}
				}
			},
			fail: err => {
				uni.hideLoading()
				uni.showToast({
					title: '上传失败',
					icon: 'none'
				})
			}
		});
	},
	//上传
	upload_file_server(tempFilePath, data, path, url = "") {
		if (url) {
			var uploadUrl = Config.baseUrl + url
		} else {
			var uploadUrl = Config.baseUrl + '/api/upload/' + path
		}
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: uploadUrl,
				filePath: tempFilePath,
				name: 'file',
				formData: data,
				success: function(res) {
					var path_str = JSON.parse(res.data);
					if (path_str.code >= 0) {
						resolve(path_str.data.pic_path);
					} else {
						reject("error");
					}
				}
			});

		});

	},
	/**
	 * 复制
	 * @param {Object} message
	 * @param {Object} callback
	 */
	copy(value, callback) {
		// #ifdef H5
		var oInput = document.createElement('input'); //创建一个隐藏input（重要！）
		oInput.value = value; //赋值
		oInput.setAttribute("readonly", "readonly");
		document.body.appendChild(oInput);
		oInput.select(); // 选择对象
		document.execCommand("Copy"); // 执行浏览器复制命令
		oInput.className = 'oInput';
		oInput.style.display = 'none';
		uni.hideKeyboard();
		this.showToast({
			title: '复制成功'
		});

		typeof callback == 'function' && callback();
		// #endif

		// #ifdef MP || APP-PLUS
		uni.setClipboardData({
			data: value,
			success: () => {
				typeof callback == 'function' && callback();
			}
		});
		// #endif
	},
	/**
	 * 是否是微信浏览器
	 */
	isWeiXin() {
		// #ifndef H5
		return false;
		// #endif
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	},
	/**
	 * 显示消息提示框
	 *  @param {Object} params 参数
	 */
	showToast(params = {}) {
		params.title = params.title || "";
		params.icon = params.icon || "none";
		// params.position = params.position || 'bottom';
		params.duration = params.duration || 1500;
		uni.showToast(params);
		if (params.success) params.success();
	},
	/**
	 * 检测苹果X以上的手机
	 */
	isIPhoneX() {
		let res = uni.getSystemInfoSync();
		if (res.model.search('iPhone X') != -1) {
			return true;
		}
		return false;
	},
	//判断安卓还是iOS
	isAndroid() {
		let platform = uni.getSystemInfoSync().platform
		if (platform == 'ios') {
			return false;
		} else if (platform == 'android') {
			return true;
		}
	},
	/**
	 * 深度拷贝对象
	 * @param {Object} obj
	 */
	deepClone(obj) {
		const isObject = function(obj) {
			return typeof obj == 'object';
		}

		if (!isObject(obj)) {
			throw new Error('obj 不是一个对象！')
		}
		//判断传进来的是对象还是数组
		let isArray = Array.isArray(obj)
		let cloneObj = isArray ? [] : {}
		//通过for...in来拷贝
		for (let key in obj) {
			cloneObj[key] = isObject(obj[key]) ? this.deepClone(obj[key]) : obj[key]
		}
		return cloneObj
	},
	/**
	 * 自定义模板的跳转链接
	 * @param {Object} link
	 */
	diyRedirectTo(link) {
		if (link == null || Object.keys(link).length == 1) return;
		// 自定义页面跳转
		if (link.wap_url && link.wap_url.indexOf('/pages/index/index') != -1) {

			var pages = getCurrentPages();
			let curPage = pages[pages.length - 1]; // 当前页
			let curentRoute = getCurrentPages()[0]; // 获取当前打开过的页面路由数组

			// console.log('curPage', curentRoute,curPage);

			if (curentRoute.route == 'pages/index/index') {

				if (link.wap_url.indexOf('?name=') != -1) {
					let index = link.wap_url.indexOf('name=') + 5;
					curentRoute.name = link.wap_url.substr(index);
				} else {
					curentRoute.name = 'DIY_VIEW_INDEX';
				}

				// 制作自定义页面返回导航记录
				var routeArr = ['DIY_VIEW_INDEX'];
				if (routeArr.indexOf(curentRoute.name) == -1) {
					routeArr.push(curentRoute.name);
				}
				uni.setStorageSync('diy_page_route', routeArr); // 用于自定义页面跳转，重置

				// #ifdef H5
				curentRoute.$refs.loadingCover.show();
				curentRoute.getDiyInfo(true); // 请求自定义页面数据
				// #endif

				// #ifdef MP
				uni.setStorageSync('diy_name', curentRoute.name);
				curentRoute.onShow();
				// #endif

				// 如果当前不在首页，则返回
				if (curPage.route != 'pages/index/index') {
					// console.log('如果当前不在首页，则返回');
					uni.navigateBack({
						delta: 1
					});
				}

				return;
			} else if (link.wap_url.indexOf('/pages/index/index') != -1 && link.diy_name) {

				// console.log('如果当前不在首页，要跳转', link);
				uni.setStorageSync('diy_name', link.diy_name);
				// 如果当前不在首页，要跳转
				uni.switchTab({
					url: link.wap_url,
				})
				return;
			}
		}

		if (link.wap_url && link.wap_url.indexOf('http') != -1 || link.wap_url && link.wap_url.indexOf('http') != -1) {
			// #ifdef H5
			window.location.href = link.wap_url;
			// #endif
			// #ifdef MP
			this.redirectTo('/pages_tool/webview/webview', {
				src: encodeURIComponent(link.wap_url)
			});
			// #endif
		} else if (link.appid) {
			uni.navigateToMiniProgram({
				appId: link.appid,
				path: link.page
			})
		} else if (link.name == 'MOBILE' && !link.wap_url) {
			uni.makePhoneCall({
				phoneNumber: link.mobile,
				success: (res) => {},
				fail: (res) => {}
			});
		} else if (link.wap_url) {
			this.redirectTo(link.wap_url);
		}
	},
	/**
	 * 获取默认图
	 * @param {Object} link
	 */
	getDefaultImage() {
		let defaultImg = uni.getStorageSync('default_img');
		if (defaultImg) {
			defaultImg.goods = this.img(defaultImg.goods);
			defaultImg.head = this.img(defaultImg.head);
			defaultImg.store = this.img(defaultImg.store);
			defaultImg.article = this.img(defaultImg.article);
			return defaultImg;
		} else {
			return {
				goods: '',
				head: '',
				store: '',
				article: ''
			};
		}
	},
	/**
	 * 判断手机是否为iphoneX系列
	 */
	uniappIsIPhoneX() {
		let isIphoneX = false;
		let systemInfo = uni.getSystemInfoSync();
		// #ifdef MP
		if (systemInfo.model.search('iPhone X') != -1 || systemInfo.model.search('iPhone 11') != -1 || systemInfo.model
			.search('iPhone 12') != -1 || systemInfo.model.search('iPhone 13') != -1) {
			isIphoneX = true;
		}
		// #endif

		// #ifdef H5
		var u = navigator.userAgent;
		var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		if (isIOS) {
			if (systemInfo.screenWidth == 375 && systemInfo.screenHeight == 812 && systemInfo.pixelRatio == 3) {
				isIphoneX = true;
			} else if (systemInfo.screenWidth == 414 && systemInfo.screenHeight == 896 && systemInfo.pixelRatio == 3) {
				isIphoneX = true;
			} else if (systemInfo.screenWidth == 414 && systemInfo.screenHeight == 896 && systemInfo.pixelRatio == 2) {
				isIphoneX = true;
			}
		}
		// #endif
		return isIphoneX;
	},
	/**
	 * 判断手机是否为iphone11系列
	 */
	uniappIsIPhone11() {
		let isIphone11 = false;
		let systemInfo = uni.getSystemInfoSync();
		// #ifdef MP
		if (systemInfo.model.search('iPhone 11') != -1) {
			isIphone11 = true;
		}
		// #endif
		return isIphone11;
	},
	// #ifdef H5
	//判断该浏览器是否为safaria浏览器
	isSafari() {
		let res = uni.getSystemInfoSync();
		var ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf('applewebkit') > -1 && ua.indexOf('mobile') > -1 && ua.indexOf('safari') > -1 &&
			ua.indexOf('linux') === -1 && ua.indexOf('android') === -1 && ua.indexOf('chrome') === -1 &&
			ua.indexOf('ios') === -1 && ua.indexOf('browser') === -1) {
			return true;
		} else {
			return false;
		}
	},
	// #endif
	numberFixed(e, f) {
		if (!f) {
			f = 0;
		}
		return Number(e).toFixed(f);
	},
	/**
	 * 获取url参数
	 */
	getUrlCode(callback) {
		var url = location.search;
		var theRequest = new Object();
		if (url.indexOf('?') != -1) {
			var str = url.substr(1);
			var strs = str.split('&');
			for (var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
			}
		}
		typeof callback == 'function' && callback(theRequest);
	},
	/**
	 * 获取当前页面路由
	 */
	getCurrRoute() {
		let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
		return routes.length ? routes[routes.length - 1].route : '';
	},
	goBack(backUrl = '/pages/index/index') {
		if (getCurrentPages().length == 1) {
			this.redirectTo(backUrl);
		} else {
			uni.navigateBack();
		}
	},
	/**
	 * @param {Object} 转化时间字符串 （转化时分秒）
	 */
	getTimeStr(val) {
		var h = parseInt(val / 3600).toString();
		var m = parseInt((val % 3600) / 60).toString();
		if (m.length == 1) {
			m = '0' + m;
		}
		if (h.length == 1) {
			h = '0' + h;
		}
		return h + ':' + m;
	},
	/**
	 * 获取定位信息
	 */
	getLocation(param = {}) {
		uni.getLocation({
			type: param.type ?? 'gcj02',
			success: res => {
				store.commit('setLocation', res);
				typeof param.success == 'function' && param.success(res);
			},
			fail: res => {
				typeof param.fail == 'function' && param.fail(res);
			},
			complete: res => {
				typeof param.complete == 'function' && param.complete(res);
			}
		});
	},
	// 计算两个经纬度之间的距离
	getDistance(lat1, lng1, lat2, lng2) {
		var radLat1 = lat1 * Math.PI / 180.0;
		var radLat2 = lat2 * Math.PI / 180.0;
		var a = radLat1 - radLat2;
		var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
		var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
			Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
		s = s * 6378.137; // EARTH_RADIUS;
		s = Math.round(s * 10000) / 10000;
		return s;
	},
	//记录分享人
	onSourceMember(source_member) {
		Http.sendRequest({
			url: '/api/Member/alterShareRelation',
			data: {
				share_member: source_member,
			},
			success: res => {
				console.log(res,'记录分享人');
				if (res.code >= 0) {
					uni.removeStorage({
						key: 'source_member',
						success: res => {
							console.log('删除成功', res)
						}
					})
				}
			}
		})
	},
	/**
	 * 微信订阅消息
	 */
	subscribeMessage(string) {
		let keywords = string;
		Http.sendRequest({
			url: '/weapp/api/weapp/messagetmplids',
			data: {
				keywords: keywords
			},
			success: res => {
				if (res.data.length) {
					uni.requestSubscribeMessage({
						tmplIds: res.data,
						success: (res) => {
							console.log("res", res)
						},
						fail: (res) => {
							console.log('fail', res)
						}
					})
				}
			}
		})
	},
	/**
	 * 分享获取memberId,进行上下级绑定
	 */
	getMemberId() {
		return new Promise((resolve, reject) => {
			Http.sendRequest({
				url: "/api/member/id",
				success: res => {
					if (res.code >= 0) {
						resolve(res.data)
					} else {
						reject(res)
					}
				}
			});
		})
	},
	/**
	 * 获取小程序分享内容数据
	 */
	getMpShare(path) {
		//如果没有特别指定 则获取当前页面的路由
		if (!path) {
			let route = this.getCurrentRoute();
			path = route.path;
		}
		return new Promise((resolve, reject) => {
			Http.sendRequest({
				url: "/weapp/api/weapp/share",
				data: {
					path: path
				},
				success: res => {
					if (res.code >= 0) {
						let shareConfig = res.data.data;
						if (shareConfig) {
							//分享给好友
							let appMessageData = {
								title: shareConfig.title,
								path: shareConfig.path,
								imageUrl: shareConfig.imageUrl,
								success: res => {},
								fail: res => {}
							}
							//分享到朋友圈
							let query = '';
							if (shareConfig.path.indexOf('?') > 0) {
								query = shareConfig.path.split('?')[1];
							}
							let timeLineData = {
								title: shareConfig.title,
								query: shareConfig.path,
								imageUrl: shareConfig.imageUrl,
							}
							resolve({
								appMessage: appMessageData,
								timeLine: timeLineData,
							})
						} else {
							reject(res.data);
						}
					} else {
						reject(res.data)
					}
				}
			});
		})
	},
	/**
	 * 设置公众号分享
	 * @param {Object} shareData
	 */
	setPublicShare(shareData, callback) {
		if (!this.isWeiXin()) return;
		Http.sendRequest({
			url: '/wechat/api/wechat/jssdkconfig',
			data: {
				url: uni.getSystemInfoSync().platform == 'ios' ? uni.getStorageSync('initUrl') : window.location
					.href
			},
			success: res => {
				if (res.code == 0) {
					var wxJS = new Weixin();
					wxJS.init(res.data);
					wxJS.weixin.showOptionMenu();

					wxJS.setShareData({
						title: shareData.title ?? '',
						desc: shareData.desc ?? '',
						link: shareData.link ?? location.href,
						imgUrl: shareData.imgUrl ? this.img(shareData.imgUrl) : ''
					}, (res) => {
						typeof callback == 'function' && callback(res);
					})
				}
			}
		})
	},
	//获取当前路由
	getCurrentRoute() {
		let currentRoutes = getCurrentPages(); // 获取当前打开过的页面路由数组
		let currentRoute = currentRoutes[currentRoutes.length - 1].route //获取当前页面路由
		let currentParam = currentRoutes[currentRoutes.length - 1].options; //获取路由参数
		// 拼接参数
		let param = [];
		for (let key in currentParam) {
			param.push(key + '=' + currentParam[key])
		}
		let currentPath = '/' + currentRoute;
		let currentQuery = param.join('&');
		if (currentQuery) currentPath += '?' + currentQuery;

		return {
			path: currentPath,
			query: currentQuery,
		}
	},
	//获取分享路由
	getCurrentShareRoute(member_id) {
		let route = this.getCurrentRoute();
		//去掉原来的分享人数据
		route.path = route.path.replace(/[?|&]source_member=\d+/, '');
		if (member_id) {
			//路径的处理
			if (route.path.indexOf('?') > 0) {
				route.path += '&';
			} else {
				route.path += '?';
			}
			route.path += 'source_member=' + member_id;
			//参数的处理
			if (route.query) {
				route.query += '&';
			}
			route.query += 'source_member=' + member_id;
		}
		return route;
	},
	/**
	 * 对象转style字符串
	 * @param {Object} obj
	 */
	objToStyle(obj) {
		let s = [];
		for (let i in obj) {
			s.push(i + ':' + obj[i]);
		}
		return s.join(';')
	},
	/**
	 * 颜色减值
	 * @param {Object} c1
	 * @param {Object} c2
	 * @param {Object} ratio
	 */
	colourBlend(c1, c2, ratio) {
		ratio = Math.max(Math.min(Number(ratio), 1), 0)
		let r1 = parseInt(c1.substring(1, 3), 16)
		let g1 = parseInt(c1.substring(3, 5), 16)
		let b1 = parseInt(c1.substring(5, 7), 16)
		let r2 = parseInt(c2.substring(1, 3), 16)
		let g2 = parseInt(c2.substring(3, 5), 16)
		let b2 = parseInt(c2.substring(5, 7), 16)
		let r = Math.round(r1 * (1 - ratio) + r2 * ratio)
		let g = Math.round(g1 * (1 - ratio) + g2 * ratio)
		let b = Math.round(b1 * (1 - ratio) + b2 * ratio)
		r = ('0' + (r || 0).toString(16)).slice(-2)
		g = ('0' + (g || 0).toString(16)).slice(-2)
		b = ('0' + (b || 0).toString(16)).slice(-2)
		return '#' + r + g + b
	},
	/**
	 * 生成贝塞尔曲线轨迹
	 * @param {Object} points
	 * @param {Object} times
	 */
	bezier(points, times) {
		var bezier_points = [];
		var points_D = [];
		var points_E = [];
		const DIST_AB = Math.sqrt(Math.pow(points[1]['x'] - points[0]['x'], 2) + Math.pow(points[1]['y'] - points[0][
			'y'
		], 2));
		// 邻控制BC点间距
		const DIST_BC = Math.sqrt(Math.pow(points[2]['x'] - points[1]['x'], 2) + Math.pow(points[2]['y'] - points[1][
			'y'
		], 2));
		// D每次在AB方向上移动的距离
		const EACH_MOVE_AD = -(DIST_AB / times);
		// E每次在BC方向上移动的距离
		const EACH_MOVE_BE = -(DIST_BC / times);
		// 点AB的正切
		const TAN_AB = (points[1]['y'] - points[0]['y']) / (points[1]['x'] - points[0]['x']);
		// 点BC的正切
		const TAN_BC = (points[2]['y'] - points[1]['y']) / (points[2]['x'] - points[1]['x']);
		// 点AB的弧度值
		const RADIUS_AB = Math.atan(TAN_AB);
		// 点BC的弧度值
		const RADIUS_BC = Math.atan(TAN_BC);
		// 每次执行
		for (var i = 1; i <= times; i++) {
			// AD的距离
			var dist_AD = EACH_MOVE_AD * i;
			// BE的距离
			var dist_BE = EACH_MOVE_BE * i;
			// D点的坐标
			var point_D = {};
			point_D['x'] = dist_AD * Math.cos(RADIUS_AB) + points[0]['x'];
			point_D['y'] = dist_AD * Math.sin(RADIUS_AB) + points[0]['y'];
			points_D.push(point_D);
			// E点的坐标
			var point_E = {};
			point_E['x'] = dist_BE * Math.cos(RADIUS_BC) + points[1]['x'];
			point_E['y'] = dist_BE * Math.sin(RADIUS_BC) + points[1]['y'];
			points_E.push(point_E);
			// 此时线段DE的正切值
			var tan_DE = (point_E['y'] - point_D['y']) / (point_E['x'] - point_D['x']);
			// tan_DE的弧度值
			var radius_DE = Math.atan(tan_DE);
			// 地市DE的间距
			var dist_DE = Math.sqrt(Math.pow((point_E['x'] - point_D['x']), 2) + Math.pow((point_E['y'] - point_D['y']),
				2));
			// 此时DF的距离
			var dist_DF = (dist_AD / DIST_AB) * dist_DE;
			// 此时DF点的坐标
			var point_F = {};
			point_F['x'] = dist_DF * Math.cos(radius_DE) + point_D['x'];
			point_F['y'] = dist_DF * Math.sin(radius_DE) + point_D['y'];
			bezier_points.push(point_F);
		}
		return {
			'bezier_points': bezier_points
		};
	}
}
