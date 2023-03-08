export default {
	data() {
		return {
			isIphoneX: false,
			orderCreateData: {
				buyer_message: '',
				subcard_id: "",
				num: 1,
				store_id: ''
			},
			orderPaymentData: {

			},
			isSub: false,
			tempData: null,

			canLocalDelicery: true,
			// 选择自提、配送防重判断
			judge: true,
			goodsOpen: true,
			min: 1,
			modifyFlag: false,
			out_trade_no: '',
			storeId: ''
		};
	},
	methods: {
		selectStore() {
			let is_bind_store = uni.getStorageSync('is_bind_store') || '';
			if (is_bind_store == 1) {
				return
			}
			this.$util.redirectTo('/pages_tool/store/store', {});
		},
		//选择服务人员
		openServicePeople() {
			if (!this.storeId) {
				this.$util.showToast({
					title: '请先选择门店'
				});
				return
			}
			this.$util.redirectTo('/servicePeople/index', {
				store_id: this.storeId
			});
		},
		/**
		 * 支付弹窗关闭
		 */
		payClose() {
			this.$util.redirectTo('/pages_tool/member/card/order/list/list', {}, 'redirectTo');
		},
		// 显示弹出层
		openPopup(ref) {
			this.$refs[ref].open();
		},
		// 关闭弹出层
		closePopup(ref) {
			if (this.tempData) {
				Object.assign(this.orderCreateData, this.tempData);
				Object.assign(this.orderPaymentData, this.tempData);
				this.tempData = null;
				this.$forceUpdate();
			}
			this.$refs[ref].close();
		},

		// 获取订单初始化数据
		getOrderPaymentData() {
			this.orderCreateData = uni.getStorageSync('giftcardOrderCreateData');
			var pay_flag = uni.getStorageSync("pay_flag"); // 支付中标识，防止返回时，提示,跳转错误
			if (!this.orderCreateData) {
				if (pay_flag == 1) {
					uni.removeStorageSync("pay_flag");
				} else {
					this.$util.showToast({
						title: '未获取到创建订单所需数据！'
					});
					setTimeout(() => {
						this.$util.redirectTo('/pages/index/index', {}, 'reLaunch');
					}, 1500);
				}
				return;
			}

			this.$api.sendRequest({
				url: '/subcard/api/ordercreate/calculate',
				data: this.orderCreateData,
				success: res => {
					if (res.code >= 0) {
						this.orderPaymentData = res.data;
						this.orderPaymentData.timestamp = res.timestamp;
						this.handlePaymentData();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					} else {
						this.$util.showToast({
							title: '未获取到创建订单所需数据！'
						});
						setTimeout(() => {
							this.$util.redirectTo('/pages/index/index', {}, 'reLaunch');
						}, 1500);
					}
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			})
		},
		cartNumChange(num) {
			this.modifyFlag = true;
			this.orderCreateData.num = num;
			Object.assign(this.orderPaymentData, this.orderCreateData);
			this.orderCalculate();
		},
		// 处理结算订单数据
		handlePaymentData() {
			this.orderCreateData.buyer_message = '';

			var data = this.orderPaymentData;

			Object.assign(this.orderPaymentData, this.orderCreateData);
			this.orderCalculate();
		},
		// 转化时间字符串
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
		// 订单计算
		orderCalculate() {
			var data = this.orderCreateData;
			console.log(data, 9999);
			this.$api.sendRequest({
				url: '/subcard/api/ordercreate/calculate',
				data,
				success: res => {
					if (res.code >= 0) {
						this.orderPaymentData = res.data;
						this.createBtn();
						this.modifyFlag = false;
						this.$forceUpdate();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					} else {
						this.$util.showToast({
							title: res.message
						});
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				},
			})
		},
		/**
		 * 订单创建验证
		 */
		createBtn() {
			return true;
		},
		// 订单创建
		orderCreate() {
			if (this.verify()) {
				if (this.isSub) return;
				this.isSub = true;
				uni.setStorageSync('paySource', 'giftcard');
				var data = this.$util.deepClone(this.orderCreateData);
				this.$api.sendRequest({
					url: '/subcard/api/ordercreate/create',
					data,
					success: res => {
						uni.hideLoading();
						if (res.code >= 0) {
							uni.setStorageSync('paySource', 'subcard');
							if (parseFloat(this.orderPaymentData.pay_money) > 0 && this.orderPaymentData
								.order_type == 1) {
								console.log(res.data.out_trade_no, '获取流水号，0888989');
								this.$refs.choosePaymentPopup.open();
								this.out_trade_no = res.data.out_trade_no
								this.isSub = false;
							} else {
								uni.redirectTo({
									url: '/pages_tool/member/card/order/list/list'
								})
								this.isSub = false;
							}
						} else {
							this.isSub = false;
							if (res.data.error_code == 10 || res.data.error_code == 12) {
								uni.showModal({
									title: '订单未创建',
									content: res.message,
									confirmText: '去设置',
									success: res => {
										if (res.confirm) {
											this.selectAddress();
										}
									}
								})
							} else {
								this.$util.showToast({
									title: res.message
								});
							}
						}
					},
					fail: res => {
						uni.hideLoading();
						this.isSub = false;
					}
				})
			}
		},
		orderPay() {
			this.$refs.choosePaymentPopup.getPayInfo(this.out_trade_no);
		},
		// 订单验证
		verify() {
			return true;
		},
		navigateTo(id) {
			this.$util.redirectTo('/tabbarShop/card/info/info', {
				subcard_id: id
			});
		},
		// 显示选择支付方式弹框
		openChoosePayment() {
			this.orderCreate();
		},

		openPopup(ref) {
			this.tempData = this.$util.deepClone(this.orderCreateData);
			this.$refs[ref].open();
		},
		closePopup(ref) {
			this.orderCreateData = this.$util.deepClone(this.tempData);
			this.$refs[ref].close();
			this.tempData = null;
		},
		/**
		 * 保存留言
		 */
		saveBuyerMessage() {
			this.orderCalculate();
			this.$refs.buyerMessagePopup.close();
		},
	},
	onShow() {
		if (uni.getStorageSync('addressBack')) {
			uni.removeStorageSync('addressBack');
		}
		let that = this
		uni.$on('onChangeStoreId', function(data) {
			console.log(data, '获取门店id');
			that.orderCreateData.store_id = data || ''
			that.storeId = data || ''
			that.orderCreateData.worker_id = data.worker_id || ''
			that.orderCalculate();
		})
		uni.$on('onChangeServicePeople', function(data) {
			console.log(data, '获取服务id');
			that.orderCreateData.worker_id = data.worker_id || ''
			that.orderCreateData.store_id = data.store_id || ''
			that.orderCalculate();
		})
		if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
		this.judge = true;

		this.isIphoneX = this.$util.uniappIsIPhoneX()
	},
	onHide() {
		if (this.$refs.loadingCover) this.$refs.loadingCover.show();
	},
	onLoad(data) {
		let storeInfo = uni.getStorageSync('store') || {};
		this.orderCreateData.subcard_id = data.subcard_id || ''
		console.log(storeInfo, 999);
		// 判断登录
		if (!uni.getStorageSync('token')) {
			this.$util.redirectTo('/pages_tool/login/login');
		} else {
			if (storeInfo.store_id) {
				this.orderCreateData.store_id = storeInfo.store_id
				this.storeId = storeInfo.store_id
			}
			this.storeInfo = storeInfo
			this.orderCalculate();
		}
	},
	computed: {

	},
	watch: {

	},
	filters: {
		// 金额格式化输出
		moneyFormat(money) {
			return parseFloat(money).toFixed(2);
		}
	}
}
