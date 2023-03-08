export default {
	data() {
		return {
			isIphoneX: false,
			orderCreateData: {
				order_type: 'in',
				goods_list: [],
				pay_gallery: '',
				buyer_message: '',
			},
			orderPaymentData: {},
			isSub: false,
			parent_dealer_info: {},
			imgList: [],
			order_type: ''
		};
	},
	onLoad(data) {
		if (data.goodsStr) {
			this.orderCreateData.goods_list = data.goodsStr
		}
		console.log(data, 9999);
		if (data.type) {
			this.orderCreateData.order_type = data.type
			this.order_type = data.type
		}
	},
	methods: {
		//添加图片
		addImg() {
			this.$util.upload(3, {
				path: 'evaluateimg'
			}, res => {
				console.log(res);
				let arr = this.imgList
				this.imgList = [...arr, ...res]
				this.orderCreateData.pay_gallery = this.imgList.join(',')
				console.log(this.imgList, 99988);
			});
		},
		//删除图片
		deleteImg(i, j) {
			this.imgList.splice(i, 1);
			this.orderCreateData.pay_gallery = this.imgList.join(',')
		},
		// 图片预览
		preview(i, j) {
			let urls = this.imgList[j];
			for (let k = 0; k < urls.length; k++) {
				urls[k] = this.$util.img(urls[k])
			}
			uni.previewImage({
				urls: urls,
				current: i
			});
		},
		previewQrcode(url) {
			let urls = [url];
			uni.previewImage({
				urls: urls,
				current: 0
			});
		},
		// 获取订单初始化数据
		orderCalculate() {
			var data = this.$util.deepClone(this.orderCreateData);
			this.$api.sendRequest({
				url: '/dealer/api/ordercreate/calculate',
				data: data,
				success: res => {
					if (res.code >= 0) {
						console.log(res);
						this.orderPaymentData = res.data
						this.parent_dealer_info = res.data.parent_dealer_info || {}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					} else {
						this.$util.showToast({
							title: '未获取到创建订单所需数据！'
						});
						setTimeout(() => {
							this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
						}, 1500);
					}
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			})
		},
		/**
		 * 订单创建
		 * @param {String} pay_password 支付密码
		 */
		orderCreate() {
			let str = this.imgList.join(',')
			console.log(str, '上传凭证图片');
			if (this.order_type == 'in' && !str) {
				this.$util.showToast({
					title: '缺少支付凭证'
				});
				return
			}
			if (this.isSub) return;
			this.isSub = true;
			var data = this.$util.deepClone(this.orderCreateData);
			this.$api.sendRequest({
				url: '/dealer/api/ordercreate/create',
				data,
				success: res => {
					uni.hideLoading();
					if (res.code >= 0) {
						this.isSub = false;
						// uni.removeStorage({
						// 	key: 'orderCreateData',
						// 	success: () => {}
						// });
						this.$util.redirectTo('/pages_tool/pay/storeResult', 'redirectTo');
						// this.$util.showToast({
						// 	title: '下单成功，请联系上级经销商审核'
						// });
						// setTimeout(() => {
						// 	uni.reLaunch({
						// 		url:'/sellStore/index/index'
						// 	})
						// }, 2000);
					} else {
						this.isSub = false;
						this.$util.showToast({
							title: res.message
						});
					}
				},
				fail: res => {
					uni.hideLoading();
					this.isSub = false;
				}
			})
		},
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();

		if (uni.getStorageSync('addressBack')) {
			uni.removeStorageSync('addressBack');
		}

		// 判断登录
		if (!uni.getStorageSync('token')) {
			// this.$util.redirectTo('/pages/login/login/login');
		} else {
			this.orderCalculate();
		}
		this.isIphoneX = this.$util.uniappIsIPhoneX()
	},
	onHide() {
		if (this.$refs.loadingCover) this.$refs.loadingCover.show();
	},
	computed: {},
	filters: {
		// 金额格式化输出
		moneyFormat(money) {
			return parseFloat(money).toFixed(2);
		},
	}
}
