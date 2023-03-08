export default {
	data() {
		return {
			currTime:'',
			isDisabled:true,
			isIphoneX: false,
			orderCreateData: {
				is_balance: 0,
				pay_password: '',

				// 发票
				is_invoice: 0, // 是否需要发票 0 无发票  1 有发票
				invoice_type: 1, // 发票类型  1 纸质 2 电子
				invoice_title_type: 1, // 抬头类型  1 个人 2 企业
				is_tax_invoice: 0, // 是否需要增值税专用发票  0 不需要 1 需要
				invoice_title: '', // 发票抬头
				taxpayer_number: '', // 纳税人识别号
				invoice_content: '', // 发票内容
				invoice_full_address: '', // 发票邮寄地址
				invoice_email: '', //发票邮箱
				default_store_id:''
			},
			orderPaymentData: {
				shop_goods_list: {
					site_name: '',
					express_type: [],
					coupon_list: [],
					coupon_list: [],
					invoice: {
						invoice_content_array: []
					}
				},
				pintuan_info: {},
				pintuan_group_info: {},
				member_account: {
					balance: 0,
					is_pay_password: 0
				},
				local_config:{
					info:{
						start_time:0,
						end_time:0,
						time_week:[]
					}
				}
			},
			isSub: false,
			tempData: null,
			// 门店信息
			storeInfo: {
				storeList: [], //门店列表
				currStore: {} //当前选择门店
			},
			// 自提地址
			member_address:{
				mobile:''
			},
			// 当前时间
			timeInfo:{
				week:0,
				start_time:0,
				end_time:0,
				showTimeBar:false
			},
			canLocalDelicery: true,
			// 密码是否聚焦
			isFocus:false,
			member_id:0,//会员id
			presale_id:0,
			finalPay:'',
			pay_password:"",
			firstData:"",
			action: {
				icon: ''
			},
		};
	},
	methods: {
		//获取商品详情
		getGoodsDetail(){
			this.$api.sendRequest({
				url: '/presale/api/order/detail',
				data:{
					order_id:this.presale_id
				},
				success: res => {
					this.firstData = res.data;
					this.action = JSON.parse(res.data.order_status_action);
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		//定金支付
		orderPayDeposit(){
			var is_balance = 0
			this.$api.sendRequest({
				url: '/presale/api/ordercreate/depositCalculate',
				data:{
					order_id:this.presale_id,
					sku_id :this.firstData.sku_id
				},
				success: res => {
					// this.firstData = res.data
					// this.finalPay = res.data
					// this.currTime = res.timestamp
					// // this.orderPaymentData = res.data;
					// // console.log("this.orderPaymentData",this.orderPaymentData)
					// this.$forceUpdate()
					// // this.handlePaymentData();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					// // this.$util.redirectTo('/pages_promotion/presale/payment',{id:item.id})
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		/**
		 * 显示弹出层
		 * @param {Object} ref
		 */
		openPopup(ref) {
			this.$refs[ref].open();
		},
		/**
		 * 关闭弹出层
		 * @param {Object} ref
		 */
		closePopup(ref) {
			if (this.tempData) {
				Object.assign(this.orderCreateData, this.tempData);
				Object.assign(this.orderPaymentData, this.tempData);
				this.tempData = null;
				this.$forceUpdate();
			}
			this.$refs[ref].close();
		},
		/**
		 * 选择收货地址
		 */
		selectAddress() {
			this.$util.redirectTo('/pages_tool/member/address', {
				'back': '/pages_promotion/pintuan/payment'
			});
		},
		/**
		 * 获取订单初始化数据
		 */
		getOrderPaymentData() {
			this.orderCreateData = uni.getStorageSync('presaleOrderCreateData');
			// 获取经纬度
			if (this.location) {
				this.orderCreateData.latitude = this.location.latitude;
				this.orderCreateData.longitude = this.location.longitude;
			}
			//获取门店缓存
			var store_info_storage = uni.getStorageSync('store');
			
			
			if (store_info_storage) {
				this.orderCreateData.default_store_id = store_info_storage.store_id;
			}
			if (!this.orderCreateData) {
				this.$util.showToast({
					title: '未获取到创建订单所需数据!！',
					success: () => {
						setTimeout(() => {
							this.$util.redirectTo('/pages/index/index', {}, 'reLaunch');
						}, 1500)
					}
				});
				return;
			}
			this.$api.sendRequest({
				url: '/presale/api/ordercreate/depositPayment',
				data: this.orderCreateData,
				success: res => {
					if (res.code >= 0) {
						this.orderPaymentData = res.data;
						// console.log("this.orderPaymentData",this.orderPaymentData)
						
						this.handlePaymentData();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					} else {
						this.$util.showToast({
							title: '未获取到创建订单所需数据!！',
							success: () => {
								setTimeout(() => {
									this.$util.redirectTo('/pages/index/index', {}, 'reLaunch');
								}, 1500)
							}
						});
					}
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			})
		},
		/**
		 * 处理结算订单数据
		 */
		handlePaymentData() {
			this.orderCreateData.delivery = {};
			this.orderCreateData.coupon = {};
			this.orderCreateData.buyer_message = '';

			this.orderCreateData.is_balance = 0;
			this.orderCreateData.pay_password = '';

			this.orderCreateData.is_invoice = 0; // 是否需要发票 0 无发票  1 有发票
			this.orderCreateData.invoice_type = 1; // 发票类型  1 纸质 2 电子
			this.orderCreateData.invoice_title_type = 1; // 发票抬头类型 1 个人 2企业
			this.orderCreateData.is_tax_invoice = 0; // 是否需要增值税专用发票  0 不需要 1 需要
			this.orderCreateData.invoice_title = '';
			
			var data = this.orderPaymentData;

			if (data.shop_goods_list.express_type != undefined && data.shop_goods_list.express_type[0] != undefined) {
				var express_type = data.shop_goods_list.express_type;
				this.orderCreateData.delivery.store_id = 0;
				// 获取选择配送方式缓存
				var delivery_storage = uni.getStorageSync('delivery');
				if (delivery_storage) {
					var delivery_type = delivery_storage.name;
					var delivery_type_name = delivery_storage.title;
					// 如果配送方式缓存是门店配送模拟点击门店tab选项
					if (delivery_type == 'store') {
						data.shop_goods_list.express_type.forEach(item => {
							if (item.name == 'store') {
								this.storeSelected(item);
							}
						})
					}
				} else {
					var delivery_type = express_type[0].name;
					var delivery_type_name = express_type[0].title;
				}
				this.orderCreateData.delivery.delivery_type = delivery_type;
				this.orderCreateData.delivery.delivery_type_name = delivery_type_name;

				// 如果默认配送方式是门店配送模拟点击门店tab选项
				if (express_type[0].name == 'store') {
					this.storeSelected(express_type[0]);
				}
			}

			if (data.shop_goods_list.coupon_list != undefined && data.shop_goods_list.coupon_list[0] != undefined) {
				var coupon_list = data.shop_goods_list.coupon_list;
				this.orderCreateData.coupon.coupon_id = coupon_list[0].coupon_id;
				this.orderCreateData.coupon.coupon_money = coupon_list[0].money;
			}

			if (this.orderPaymentData.is_virtual) this.orderCreateData.member_address = {
				mobile: ''
			};

			if (this.orderPaymentData.shop_goods_list.invoice) {
				var invoice_content_array = this.orderPaymentData.shop_goods_list.invoice.invoice_content_array;
				if (invoice_content_array.length) this.orderCreateData.invoice_content = invoice_content_array[0];
			}
			
			if (this.orderPaymentData.is_virtual == 0) {
				// 是否显示时间选择
				if (this.orderPaymentData.shop_goods_list.local_config.info && this.orderPaymentData
					.shop_goods_list.local_config.info.time_is_open == 1) {
					this.timeInfo.showTimeBar = true;
					// 当日是否支持配送
					if (this.orderPaymentData.shop_goods_list.local_config.info.time_week.length == 0 ||
						this.orderPaymentData.shop_goods_list.local_config.info.time_week.length == 7 ||
						this.orderPaymentData.shop_goods_list.local_config.info.time_week.indexOf(this.timeInfo.week) > -1) {
						this.canLocalDelicery = true;
					} else {
						this.canLocalDelicery = false;
					}
					// 将timepicker选中当前时间
					var h = new Date().getHours().toString();
					var m = new Date().getMinutes().toString();
					if (h.length == 1) {
						h = '0' + h;
					}
					if (m.length == 1) {
						m = '0' + m;
					}
					this.orderCreateData.buyer_ask_delivery_time = h + ':' + m;
					// picker组件时间起始
					let start_time = this.orderPaymentData.shop_goods_list.local_config.info.start_time;
					this.timeInfo.start_time = this.getTimeStr(start_time);
					let end_time = this.orderPaymentData.shop_goods_list.local_config.info.end_time;
					this.timeInfo.end_time = this.getTimeStr(end_time);
				}
			
			}

			Object.assign(this.orderPaymentData, this.orderCreateData);
			this.orderPaymentData.shop_goods_list.goods_list.forEach((v)=>{
				if(v.sku_spec_format){
					v.sku_spec_format=JSON.parse(v.sku_spec_format);
				}else{
					v.sku_spec_format=[]
				}
			});
			this.orderCalculate();
		},
		// 转化时间字符串
		getTimeStr(val){
			var h = parseInt(val/3600).toString();
			var m = parseInt((val%3600)/60).toString();
			if(m.length == 1){
				m = '0' + m;
			}
			if(h.length == 1){
				h = '0' + h;
			}
			return h + ':' + m;
		},
		/**
		 * 订单计算
		 */
		orderCalculate() {
			var data = this.$util.deepClone(this.orderCreateData);
			data.delivery = JSON.stringify(data.delivery);
			data.coupon = JSON.stringify(data.coupon);
			if(this.orderCreateData.delivery.delivery_type == 'store'){
				data.member_address = JSON.stringify(this.member_address);
			}else{
				data.member_address = JSON.stringify(data.member_address);
			}

			this.$api.sendRequest({
				url: '/presale/api/ordercreate/depositCalculate',
				data,
				success: res => {
					if (res.code >= 0) {
						this.orderPaymentData.delivery_money = res.data.delivery_money;
						this.orderPaymentData.coupon_money = res.data.coupon_money;
						this.orderPaymentData.invoice_money = res.data.invoice_money;
						this.orderPaymentData.invoice_delivery_money = res.data.shop_goods_list.invoice_delivery_money;
						this.orderPaymentData.promotion_money = res.data.promotion_money;
						this.orderPaymentData.order_money = res.data.order_money;
						this.orderPaymentData.balance_money = res.data.balance_money;
						this.orderPaymentData.pay_money = res.data.pay_money;
						this.orderPaymentData.goods_money = res.data.goods_money;
						this.orderPaymentData.final_money = res.data.final_money;
						this.$forceUpdate();
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				},
			})
		},
		/**
		 * 订单创建
		 */
		orderCreate() {
			if (this.verify()) {
				if (this.isSub) return;
				this.isSub = true;

				var data = this.$util.deepClone(this.orderCreateData);
				data.delivery = JSON.stringify(data.delivery);
				data.coupon = JSON.stringify(data.coupon);
				if(this.orderCreateData.delivery.delivery_type == 'store'){
					data.member_address = JSON.stringify(this.member_address);
				}else{
					data.member_address = JSON.stringify(data.member_address);
				}

				this.$api.sendRequest({
					url: '/presale/api/ordercreate/depositCreate',
					data,
					success: res => {
						if (res.code >= 0) {
							uni.removeStorage({
								key: 'presaleOrderCreateData',
								success: () => {
									if (this.orderPaymentData.pay_money == 0) {
										this.$util.redirectTo('/pages_tool/pay/result', {
											code: res.data
										}, 'redirectTo');
									} else {
										this.$util.redirectTo('/pages_tool/pay/index', {
											code: res.data
										}, 'redirectTo');
									}
								}
							});
						} else {
							this.isSub = false;
							uni.hideLoading();
							if(this.$refs.payPassword){
								this.$refs.payPassword.close();
							}
							if(res.data.error_code == 10 || res.data.error_code == 12){
								uni.showModal({
									title:'订单未创建',
									content:res.message,
									confirmText:'去设置',
									success:res=>{
										if(res.confirm){
											this.selectAddress();
										}
									}
								})
							}else{
								this.$util.showToast({
									title: res.message
								});
							}
						}
					}
				})
			}
		},
		/**
		 * 订单支付
		 * @param {Object} out_trade_no
		 */
		firstPaymentCreate(orderData){
			var now_date = new Date().getTime(),pay_end_time = this.firstData.pay_end_time * 1000;
			if(now_date>pay_end_time){
				this.isDisabled = false;
			}else{
				this.$api.sendRequest({
					url: '/presale/api/order/pay',
					data: {
						id: orderData.id
					},
					success: res => {
						if (res.code >= 0) {
							this.$util.redirectTo('/pages_tool/pay/index', {code: res.data });
						} else {
							this.$util.showToast({title: res.message});
						}
					}
				})
			}
		},
		/**
		 * 订单验证
		 */
		verify() {
			if (this.orderPaymentData.is_virtual == 1) {
				if (!this.orderCreateData.member_address.mobile.length) {
					this.$util.showToast({
						title: '请输入您的手机号码'
					});
					return false;
				}
				var reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
				if (!reg.test(this.orderCreateData.member_address.mobile)) {
					this.$util.showToast({
						title: '请输入正确的手机号码'
					});
					return false;
				}
			}

			if (this.orderPaymentData.is_virtual == 0) {
				if (this.orderCreateData.delivery.delivery_type != 'store') {
					if (!this.orderPaymentData.member_address) {
						this.$util.showToast({
							title: '请先选择您的收货地址'
						});
						return false;
					}
				}

				if (JSON.stringify(this.orderCreateData.delivery) == "{}") {
					this.$util.showToast({
						title: '店铺未设置配送方式'
					});
					return false;
				}

				if (this.orderCreateData.delivery.delivery_type == 'store' && this.orderCreateData.delivery.store_id == 0) {
					this.$util.showToast({
						title: '店铺没有可提货的门店,请选择其他配送方式'
					});
					return false;
				}
				
				if(this.orderCreateData.delivery.delivery_type == 'store'){
					if (!this.member_address.mobile) {
						this.$util.showToast({
							title: '请输入预留手机'
						});
						return false;
					}
					var reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
					if (!reg.test(this.member_address.mobile)) {
						this.$util.showToast({
							title: '请输入正确的预留手机'
						});
						return false;
					}
					
					// if(!this.orderCreateData.buyer_ask_delivery_time){
					// 	this.$util.showToast({
					// 		title: '请输入自提时间'
					// 	});
					// 	return false;
					// }
				}
			}

			// 如果使用发票进行验证
			if (this.orderCreateData.is_invoice == 1) {
				if (!this.invoiceVerify()) return false;
			}

			if (this.orderCreateData.is_balance == 1 && this.orderCreateData.pay_password == '') {
				if(this.$refs.input){
					setTimeout(() => {
						this.$refs.input.clear();
					}, 0)
				}
				this.openPasswordPopup();
				return false;
			}

			return true;
		},
		/**
		 * 显示店铺优惠信息
		 * @param {Object} data
		 */
		openSitePromotion() {
			this.$refs.sitePromotionPopup.open();
		},
		/**
		 * 显示店铺配送信息
		 * @param {Object} index
		 */
		openSiteDelivery() {
			this.tempData = {
				delivery: this.$util.deepClone(this.orderPaymentData.delivery)
			};
			this.$refs.deliveryPopup.open();
		},
		/**
		 * 选择配送方式
		 */
		selectDeliveryType(data) {
			uni.setStorageSync('delivery', {
				title: data.title,
				name: data.name
			});
			this.orderCreateData.delivery.delivery_type = data.name;
			this.orderCreateData.delivery.delivery_type_name = data.title;
			// 如果是门店配送
			if (data.name == 'store') {
				this.storeSelected(data);
			}
			Object.assign(this.orderPaymentData, this.orderCreateData);
			this.orderCalculate();
			this.$forceUpdate();

		},
		// 切换到门店
		storeSelected(data) {
			// 门店列表
			this.storeInfo.storeList = data.store_list;
			if(this.orderCreateData.delivery.store_id > 0 ) return;
			// 获取首页门店选择缓存
			var curr_store = uni.getStorageSync('store');
			if (curr_store && data.store_id == curr_store.store_id) {
				this.storeInfo.currStore = curr_store;
				this.orderCreateData.delivery.store_id = this.storeInfo.currStore.store_id;
			} else if (data.store_list[0] != undefined) {
				this.storeInfo.currStore = data.store_list[0];
				this.orderCreateData.delivery.store_id = data.store_list[0].store_id;
			}else{
				this.storeInfo.currStore = null;
			}
		},
		/**
		 * 选择自提点 
		 */
		selectPickupPoint(store_item) {
			this.orderCreateData.delivery.store_id = store_item.store_id;
			this.storeInfo.currStore = store_item;
			Object.assign(this.orderPaymentData, this.orderCreateData);
			this.orderCalculate();
			this.$forceUpdate();
			this.$refs['deliveryPopup'].close();
		},
		/**
		 * 显示店铺优惠券信息
		 */
		openSiteCoupon() {
			this.tempData = {
				coupon: this.$util.deepClone(this.orderPaymentData.coupon)
			};
			this.$refs.couponPopup.open();
		},
		/**
		 * 选择优惠券
		 * @param {Object} item
		 */
		selectCoupon(item) {
			if (this.orderCreateData.coupon.coupon_id != item.coupon_id) {
				this.orderCreateData.coupon.coupon_id = item.coupon_id;
				this.orderCreateData.coupon.coupon_money = item.money;
			} else {
				this.orderCreateData.coupon.coupon_id = 0;
				this.orderCreateData.coupon.coupon_money = '0.00';
			}
			Object.assign(this.orderPaymentData, this.orderCreateData);
			this.$forceUpdate();
		},
		popupConfirm(ref) {
			this.$refs[ref].close();
			this.orderCalculate();
			this.$forceUpdate();
			this.tempData = null;
		},
		/**
		 * 使用余额
		 */
		useBalance() {
			if (this.firstData.is_balance&&　this.firstData.is_balance != undefined) this.firstData.is_balance = 0;
			else this.firstData.is_balance = 1;
			this.orderPayDeposit();
			// this.orderCalculate();
			this.$forceUpdate();
		},
		/**
		 * 设置支付密码
		 */
		setPayPassword() {
			this.$util.redirectTo('/pages_tool/member/pay_password', {
				back: '/pages_promotion/pintuan/payment'
			});
		},
		/**
		 * 暂不设置支付密码
		 */
		noSet() {
			this.orderCreateData.is_balance = 0;
			this.$refs.payPassword.close();
			this.orderCalculate();
			this.$forceUpdate();
		},
		/**
		 * 支付密码输入
		 */
		input(pay_password) {
			if (pay_password.length == 6) {
				uni.showLoading({
					title: '支付中...',
					mask: true
				})
				this.$api.sendRequest({
					url: '/api/member/checkpaypassword',
					data: {
						pay_password
					},
					success: res => {
						if (res.code >= 0) {
							
							if(this.finalPay){
								this.finalPay.pay_password = pay_password;
								this.finalPay.member_id = this.member_id;
								this.finalPay.is_balance = this.finalPay.is_use_balance;
								// console.log(this.finalPay)
								this.finalPaymentCreate();
							}else{
								this.orderCreateData.pay_password = pay_password;
								this.orderCreate();
							}
							
						} else {
							uni.hideLoading();
							this.$util.showToast({
								title: res.message
							});
						}
					},
					fail: res => {
						uni.hideLoading();
					}
				})
			}
		},
		imageError(goodsIndex) {
			this.orderPaymentData.shop_goods_list.goods_list[goodsIndex].sku_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		navigateBack() {
			this.$util.goBack();
		},
		// 切换发票开关
		changeIsInvoice() {
			if (this.orderCreateData.is_invoice == 0){
				this.orderCreateData.is_invoice = 1;
			}else{
				this.orderCreateData.is_invoice = 0;
			} 
			if(this.presale_id){
				this.finalPayment();
			}else{
				this.orderCalculate();
			}
			
			this.$forceUpdate();
		},
		// 切换发票类型
		changeInvoiceType(invoice_type) {
			this.orderCreateData.invoice_type = invoice_type;
			this.orderCalculate();
			this.$forceUpdate();
		},
		// 切换发票个人还是企业
		changeInvoiceTitleType(invoice_title_type) {
			this.orderCreateData.invoice_title_type = invoice_title_type;
			this.orderCalculate();
			this.$forceUpdate();
		},
		// 切换增值税专用发票开关
		changeIsTaxInvoice() {
			if (this.orderCreateData.is_tax_invoice == 0) this.orderCreateData.is_tax_invoice = 1;
			else this.orderCreateData.is_tax_invoice = 0;
			this.$forceUpdate();
		},
		// 选择发票内容
		changeInvoiceContent(invoice_content) {
			this.orderCreateData.invoice_content = invoice_content;
			this.$forceUpdate();
		},
		// 发票验证
		invoiceVerify(){
			if (!this.orderCreateData.invoice_title) {
				this.$refs.invoicePopup.open();
				this.$util.showToast({
					title: '请填写发票抬头'
				});
				return false;
			}
			if (!this.orderCreateData.taxpayer_number && this.orderCreateData.invoice_title_type == 2) {
				this.$refs.invoicePopup.open();
				this.$util.showToast({
					title:'请填写纳税人识别号'
				});
				return false;
			}
			// if (this.orderCreateData.invoice_type == 1 && !this.orderCreateData.invoice_full_address) {
			// 	this.$refs.invoicePopup.open();
			// 	this.$util.showToast({
			// 		title: '请填写发票邮寄地址'
			// 	});
			// 	return false;
			// }
			if (this.orderCreateData.invoice_type == 2 && !this.orderCreateData.invoice_email) {
				this.$refs.invoicePopup.open();
				this.$util.showToast({
					title: '请填写邮箱'
				});
				return false;
			}
			if (this.orderCreateData.invoice_type == 2) {
				var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
				if(!reg.test(this.orderCreateData.invoice_email)){
					this.$refs.invoicePopup.open();
					this.$util.showToast({
						title: '请填写正确的邮箱'
					});
					return false;
				}
			}
			if (!this.orderCreateData.invoice_content) {
				this.$refs.invoicePopup.open();
				this.$util.showToast({
					title: '请选择发票内容'
				});
				return false;
			}
			return true;
		},
		// 保存发票信息
		saveInvoice(){
			if (this.orderCreateData.is_invoice == 1) {
				if(this.invoiceVerify()){
					this.closePopup('invoicePopup');
				}
			}else{
				this.closePopup('invoicePopup');
			}
		},
		// 选择自提时间
		bindTimeChange(data){
			let time = data.detail.value;
			this.orderCreateData.buyer_ask_delivery_time = time;
			this.orderCalculate();
			this.$forceUpdate();
		},
		// 获取时间
		getTime(){
			// 必须是字符串,跟后端一致
			let weeks = ['0', '1', '2', '3', '4', '5', '6'];  
			let week = new Date().getDay();  
			this.timeInfo.week = weeks[week];
		},
		closeInvoicePopup(){
			// 发票
			this.orderCreateData.is_invoice =  0;
			this.orderCreateData.invoice_type = 1; // 发票类型  1 纸质 2 电子
			this.orderCreateData.invoice_title_type = 1; // 抬头类型  1 个人 2 企业
			this.orderCreateData.is_tax_invoice = 0; // 是否需要增值税专用发票  0 不需要 1 需要
			this.orderCreateData.invoice_title = ''; // 发票抬头
			this.orderCreateData.taxpayer_number = ''; // 纳税人识别号
			this.orderCreateData.invoice_content = ''; // 发票内容
			this.orderCreateData.invoice_full_address = ''; // 发票邮寄地址
			this.orderCreateData.invoice_email = '';//发票邮箱
			this.orderCalculate();
			this.$forceUpdate();
			this.$refs.invoicePopup.close();
		},
		openPasswordPopup(){
			this.$refs.payPassword.open();
			setTimeout(()=>{
				this.isFocus = true;
			},500)
		},
		navigateTo(e){
		   this.$util.redirectTo('/pages/goods/detail',{goods_id:e})
		}
	},
	onShow() {
		
		

		// 判断登录
		if (!uni.getStorageSync('token')) {
			this.$util.redirectTo('/pages_tool/login/login');
		} else {
			if(this.presale_id){
				this.getGoodsDetail ()
				// this.orderPayDeposit();
			}else{
				this.$util.showToast({
					title:"缺少参数"
				})
			}
		}
		this.getTime();
		this.isIphoneX = this.$util.uniappIsIPhoneX()
	},
	onLoad(option){
		if(option.id){
			this.presale_id = option.id
		}
		if(uni.getStorageSync('userInfo')){
			this.member_id = uni.getStorageSync('userInfo').member_id
		}
		if (!this.location) this.$util.getLocation();
	},
	onHide() {
		if (this.$refs.loadingCover) this.$refs.loadingCover.show();
	},
	computed:{
		// 余额抵扣
		balanceDeduct(){
			if(this.firstData.balance_total <=  parseFloat(this.firstData.pay_deposit_money).toFixed(2)){
				return parseFloat(this.firstData.balance_total).toFixed(2);
			}else{
				return  parseFloat(this.firstData.pay_deposit_money).toFixed(2);
			}
		},
		location(){
			return this.$store.state.location;
		}
	},
	watch: {
		location: function(nVal){
			if (nVal) {
				this.getOrderPaymentData();
			}
		}
	},
	filters: {
		/**
		 * 金额格式化输出
		 * @param {Object} money
		 */
		moneyFormat(money) {
			return parseFloat(money).toFixed(2);
		},
		/**
		 * 店铺优惠摘取
		 */
		promotion(data) {
			let promotion = '';
			if (data) {
				Object.keys(data).forEach((key) => {
					promotion += data[key].content + '　';
				})
			}
			return promotion;
		}
	}
}
