export default {
	data() {
		return {
			isIphoneX: false,
			orderCreateData: {
				member_address: {
					mobile: ''
				}
			},
			orderPaymentData: {
				exchange_info: {
					type: 0
				},
				delivery: {
					delivery_type: ''
				},
				member_address: {
					mobile: ''
				},
				local_config: {
					info: {
						start_time: 0,
						end_time: 0,
						time_week: []
					}
				},
				express_type: [],
			},
			isSub: false,
			tempData: null,
			// 门店信息
			storeInfo: {
				storeList: [], //门店列表
				currStore: {} //当前选择门店
			},
			// 自提地址
			member_address: {
				mobile: ''
			},
			// 当前时间
			timeInfo: {
				week: 0,
				start_time: 0,
				end_time: 0,
				showTime: false,
				showTimeBar: false
			},
			canLocalDelicery: true,
			deliveryWeek: "",
			// 选择自提、配送防重判断
			judge:true,
			menuButtonBounding: {}
		};
	},
	methods: {
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
		// 选择收货地址
		selectAddress() {
			var params = {
				back: '/pages_promotion/point/payment',
				local: 0,
				type: 1
			}
			// 外卖配送需要定位地址
			if (this.orderPaymentData.delivery.delivery_type == 'local') {
				params.local = 1;
				params.type = 2;
			}
			this.$util.redirectTo('/pages_tool/member/address', params);
		},
		// 获取订单初始化数据
		getOrderPaymentData() {
			this.orderCreateData = uni.getStorageSync('exchangeOrderCreateData');
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

			this.$api.sendRequest({
				url: '/pointexchange/api/ordercreate/payment',
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
		// 处理结算订单数据
		handlePaymentData() {
			this.orderCreateData.delivery = {};
			this.orderCreateData.buyer_message = '';

			var data = this.orderPaymentData;

			// 店铺配送方式
			if (data.express_type != undefined && data.express_type[0] != undefined) {
				var express_type = data.express_type;
				this.orderCreateData.delivery.store_id = 0;
				// 获取选择配送方式缓存
				var delivery_storage = uni.getStorageSync('delivery');
				if (delivery_storage) {
					var delivery_type = delivery_storage.name;
					var delivery_type_name = delivery_storage.title;
					// 如果配送方式缓存是门店配送模拟点击门店tab选项
					if (delivery_type == 'store') {
						data.express_type.forEach(item => {
							if (item.name == 'store') {
								this.storeSelected(item);
							}
						})
						this.member_address = {
							mobile: data.member_account.mobile != '' ? data.member_account.mobile : ''
						};
					}
				} else {
					var delivery_type = express_type[0].name;
					if(delivery_type == "store"){
						this.member_address = {
							mobile: data.member_account.mobile != '' ? data.member_account.mobile : ''
						};
					}
					var delivery_type_name = express_type[0].title;
				}
				this.orderCreateData.delivery.delivery_type = delivery_type;
				this.orderCreateData.delivery.delivery_type_name = delivery_type_name;

				// 如果默认配送方式是门店配送模拟点击门店tab选项
				if (express_type[0].name == 'store') {
					this.storeSelected(express_type[0]);
				}
			}
			
			if (this.orderPaymentData.is_virtual) this.orderCreateData.member_address = {
				mobile: data.member_account.mobile != '' ? data.member_account.mobile : ''
			};
			if (this.orderPaymentData.is_virtual == 0) {
				// 是否显示时间选择
				if (this.orderPaymentData.local_config.info && this.orderPaymentData.local_config.info.time_is_open == 1) {
					this.timeInfo.showTimeBar = true;
					// 当日是否支持配送
					if (this.orderPaymentData.local_config.info.time_week.length == 0 ||
						this.orderPaymentData.local_config.info.time_week.length == 7 ||
						this.orderPaymentData.local_config.info.time_week.indexOf(this.timeInfo.week) > -1) {
						this.canLocalDelicery = true;
					} else {
						this.canLocalDelicery = false;
					}

					if (this.orderPaymentData.local_config.info.time_type == 0) {
						this.deliveryWeek = "全天";
					} else if (this.orderPaymentData.local_config.info.time_week.length > 0) {

						// if (this.orderPaymentData.local_config.info.time_week.length == 7) {
						// 	this.deliveryWeek = "全天";
						// } else {
							
						// }
						this.timeInfo.showTime = true;
						// 判断配送时间是连续还是间隔
						var timeWeek = this.orderPaymentData.local_config.info.time_week;
						var is_interval = false; // 是否间隔
						for (var i = 0; i < timeWeek.length; i++) {
							if ((i + 1) < timeWeek.length) {
								var difference = timeWeek[i + 1] - timeWeek[i];
								if (difference > 1) {
									is_interval = true;
									break;
								}
							}
						}
						
						var weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
						if (is_interval) {
							var temp = [];
							for (var i = 0; i < timeWeek.length; i++) {
								temp.push(weeks[timeWeek[i]]);
							}
							this.deliveryWeek = temp.join("、");
						} else {
							this.deliveryWeek = weeks[timeWeek[0]] + "至" + weeks[timeWeek[timeWeek.length - 1]];
						}
					} else {
						this.deliveryWeek = "店铺未设置配送时间";
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
					let start_time = this.orderPaymentData.local_config.info.start_time;
					this.timeInfo.start_time = this.getTimeStr(start_time);

					let end_time = this.orderPaymentData.local_config.info.end_time;
					this.timeInfo.end_time = this.getTimeStr(end_time);

					var current_time = new Date(this.$util.timeStampTurnTime(this.orderPaymentData.timestamp));
					var hour = current_time.getHours();
					var minute = current_time.getMinutes();

					var start_hour = parseInt(this.timeInfo.start_time.split(":")[0]);
					var start_minute = parseInt(this.timeInfo.start_time.split(":")[1]);

					var end_hour = parseInt(this.timeInfo.end_time.split(":")[0]);
					var end_minute = parseInt(this.timeInfo.end_time.split(":")[1]);

					// 检测当天是否能够配送，然后判断送达时间。不在配送时间当日不能下单，例：配送时间是周一到周五，那么周末不能下单，周一到周五可以下单
					if (this.canLocalDelicery) {

						// 判断是否全天
						if (!(start_hour == end_hour && start_minute == end_minute)) {

							// 当前时间早于配送时间，送达时间：开始时间~结束时间
							if ((hour < start_hour) || (hour == start_hour && minute < start_minute)) {
								this.orderCreateData.buyer_ask_delivery_time = (start_hour.toString().length == 1 ? "0" + start_hour :
										start_hour) + ':' +
									(start_minute.toString().length == 1 ? "0" + start_minute : start_minute);
							}

							// if (((hour > start_hour && hour < end_hour) || (hour == start_hour && minute > start_minute) || (hour ==
							// 		start_hour && minute >= start_minute && hour < end_hour))) {
							// }

							// 当前时间晚于配送时间，送达时间隐藏，不能下单
							if ((hour > end_hour) || (hour == end_hour && minute > end_minute)) {
								this.canLocalDelicery = false;
							}
						}

					}

				} else {
					this.deliveryWeek = "店铺未开启配送时间";
				}
			}

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
			var data = this.$util.deepClone(this.orderCreateData);
			data.delivery = JSON.stringify(data.delivery);
			if (this.orderCreateData.delivery.delivery_type == 'store') {
				data.member_address = JSON.stringify(this.member_address);
			} else {
				data.member_address = JSON.stringify(data.member_address);
			}

			this.$api.sendRequest({
				url: '/pointexchange/api/ordercreate/calculate',
				data,
				success: res => {
					if (res.code >= 0) {
						this.orderPaymentData.member_address = res.data.member_address;
						this.orderPaymentData.delivery_money = res.data.delivery_money;
						this.orderPaymentData.order_money = res.data.order_money;
						
						this.orderPaymentData.delivery = res.data.delivery;
						
						//时间选择判断
						if(res.data.delivery_store_info){
							this.orderPaymentData.delivery_store_info = JSON.parse(res.data.delivery_store_info);
							if(this.judge){
								if(this.orderPaymentData.delivery.delivery_type == "store"){
									this.storetime('no');
								}else if(this.orderPaymentData.delivery.delivery_type == 'local'){
									this.localtime('no');
								}
								this.judge = false;
							}
						}
						
						this.createBtn();
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
		 * 订单创建验证
		 */
		createBtn(){
			if(this.orderPaymentData.delivery 
			&& this.orderPaymentData.delivery.delivery_type == 'local' 
			&& this.orderPaymentData.delivery 
			&& this.orderPaymentData.delivery.error 
			&& this.orderPaymentData.delivery.start_money > this.orderPaymentData.price){
				return false;
			}
			if(this.orderPaymentData.delivery
			&& this.orderPaymentData.delivery.delivery_type == 'local' 
			&& this.orderPaymentData.delivery 
			&& this.orderPaymentData.delivery.error 
			&& this.orderPaymentData.delivery.error !== ''){
				return false;
			}
			return true;
		},
		// 订单创建
		orderCreate() {
			if (this.verify()) {
				if (this.isSub) return;
				this.isSub = true;
				
				uni.setStorageSync('paySource', 'pointexchange');
				
				var data = this.$util.deepClone(this.orderCreateData);
				data.delivery = JSON.stringify(data.delivery);
				if (this.orderCreateData.delivery.delivery_type == 'store') {
					data.member_address = JSON.stringify(this.member_address);
				} else {
					data.member_address = JSON.stringify(data.member_address);
				}

				this.$api.sendRequest({
					url: '/pointexchange/api/ordercreate/create',
					data,
					success: res => {
						uni.hideLoading();
						if (res.code >= 0) {
							if (this.orderPaymentData.exchange_info.type == 1 && this.orderPaymentData.order_money !=
								'0.00') {
								
								let orderCreateData = uni.getStorageSync('exchangeOrderCreateData');
								orderCreateData.out_trade_no = res.data;
								uni.setStorageSync('exchangeOrderCreateData', orderCreateData);	
								
								this.$refs.choosePaymentPopup.getPayInfo(res.data);
								this.isSub = false;
							} else {
								this.$util.redirectTo('/pages_promotion/point/result', {}, 'redirectTo');
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
		// 订单验证
		verify() {
			if (this.orderPaymentData.exchange_info.type == 1) {
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

					if (this.orderCreateData.delivery.delivery_type == 'store') {
						if (!this.orderCreateData.delivery.store_id) {
							this.$util.showToast({
								title: '没有可提货的门店,请选择其他配送方式'
							});
							return false;
						}
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

					if (this.orderCreateData.delivery.delivery_type == 'local') {

						if (this.canLocalDelicery) {

							// 判断是否全天
							if (!(start_hour == end_hour && start_minute == end_minute)) {

								var hour = parseInt(this.orderCreateData.buyer_ask_delivery_time.split(":")[0]);
								var minute = parseInt(this.orderCreateData.buyer_ask_delivery_time.split(":")[1]);

								var start_hour = parseInt(this.timeInfo.start_time.split(":")[0]);
								var start_minute = parseInt(this.timeInfo.start_time.split(":")[1]);

								var end_hour = parseInt(this.timeInfo.end_time.split(":")[0]);
								var end_minute = parseInt(this.timeInfo.end_time.split(":")[1]);

								// 当前时间早于配送时间
								if (((hour < start_hour) || (hour == start_hour && minute < start_minute))) {
									this.$util.showToast({
										title: '送达时间不能小于配送开始时间'
									});
									return false;
								}

								// 当前时间在配送时间内，送达时间：开始时间~结束时间
								if (!((hour > start_hour && hour < end_hour) || (hour == start_hour && minute > start_minute) || (hour ==
										start_hour && minute >= start_minute && hour < end_hour))) {
									this.$util.showToast({
										title: '送达时间范围：开始时间~结束时间'
									});
									return false;
								}
							}
						} else {
							this.$util.showToast({
								title: '本店已休息'
							});
							return false;
						}

					}

					let deliveryVerify = true;

					for (let key in this.orderCreateData.delivery) {
						if (JSON.stringify(this.orderCreateData.delivery[key]) == "{}") {
							deliveryVerify = false;
							this.$util.showToast({
								title: '店铺"' + this.orderPaymentData[key].site_name + '"未设置配送方式'
							});
							break;
						}
						if (this.orderCreateData.delivery[key].delivery_type == 'store' && this.orderCreateData.delivery[key].store_id ==
							0) {
							deliveryVerify = false;
							this.$util.showToast({
								title: '店铺"' + this.orderPaymentData[key].site_name + '"没有可提货的门店,请选择其他配送方式'
							});
							break;
						}
					}
					if (!deliveryVerify) return false;

				}

			}
			return true;
		},
		// 显示店铺配送信息
		openSiteDelivery() {
			this.tempData = {
				delivery: this.$util.deepClone(this.orderPaymentData.delivery)
			};
			this.$refs.deliveryPopup.open();
		},
		// 选择配送方式
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
				if (!this.member_address.mobile) this.member_address.mobile = this.orderPaymentData.member_account.mobile != '' ? this.orderPaymentData.member_account.mobile : '';
				
			}
			Object.assign(this.orderPaymentData, this.orderCreateData);
			
			this.judge = true;
			
			this.orderCalculate();
			this.$forceUpdate();
		},
		// 切换到门店
		storeSelected(data) {
			// 门店列表
			this.storeInfo.storeList = data.store_list;
			if (this.orderCreateData.delivery.store_id > 0) return;
			// 获取首页门店选择缓存
			var curr_store = uni.getStorageSync('store');
			if (curr_store && data.store_id == curr_store.store_id) {
				this.storeInfo.currStore = curr_store;
				this.orderCreateData.delivery.store_id = this.storeInfo.currStore.store_id;
			} else if (data.store_list[0] != undefined) {
				this.storeInfo.currStore = data.store_list[0];
				this.orderCreateData.delivery.store_id = data.store_list[0].store_id;
			} else {
				this.storeInfo.currStore = null;
			}
		},
		// 选择自提点
		selectPickupPoint(store_item) {
			this.orderCreateData.delivery.store_id = store_item.store_id;
			this.storeInfo.currStore = store_item;
			Object.assign(this.orderPaymentData, this.orderCreateData);
			this.orderCalculate();
			this.$forceUpdate();
			this.$refs['deliveryPopup'].close();
		},
		imageError() {
			let imageUrl = ''
			if (this.orderPaymentData.exchange_info.type == 1) {
				imageUrl = this.$util.img('public/uniapp/point/gift.png');
			} else if (this.orderPaymentData.exchange_info.type == 2) {
				imageUrl = this.$util.img('public/uniapp/point/coupon.png');
			} else if (this.orderPaymentData.exchange_info.type == 3) {
				imageUrl = this.$util.img('public/uniapp/point/hongbao.png');
			} else {
				imageUrl = this.$util.getDefaultImage().goods;
			}
			this.orderPaymentData.exchange_info.image = imageUrl;
			this.$forceUpdate();
		},
		// 选择自提时间
		bindTimeChange(data) {
			let time = data.detail.value;
			this.orderCreateData.buyer_ask_delivery_time = time;
			this.orderCalculate();
			this.$forceUpdate();
		},
		// 获取时间
		getTime() {
			// 必须是字符串,跟后端一致
			let weeks = ['0', '1', '2', '3', '4', '5', '6'];
			let week = new Date().getDay();
			this.timeInfo.week = weeks[week];
		},
		navigateTo(sku_id) {
			this.$util.redirectTo('/pages/goods/detail', {
				sku_id
			});
		},
		// 显示选择支付方式弹框
		openChoosePayment() {
			if (this.verify() && this.orderPaymentData.exchange_info.type == 1 && this.orderPaymentData.order_money !=
				'0.00') this.$refs.choosePaymentPopup.open();
			else this.orderCreate();
		},
		/**
		 * 同城配送数据处理
		 */
		localtime(type = ''){
			let data = {
				time_type:this.$util.deepClone(this.orderPaymentData.local_config.info).time_type,
				end_time:this.$util.deepClone(this.orderPaymentData.local_config.info).end_time,
				start_time:this.$util.deepClone(this.orderPaymentData.local_config.info).start_time,
				time_week:this.$util.deepClone(this.orderPaymentData.local_config.info).time_week,
			};
			let obj = {
				delivery:this.orderCreateData.delivery,
				dataTime:data
			}
			this.$refs.TimePopup.open(obj,type);
		},
		/**
		 * 门店自提数据处理
		 */
		storetime(type = ''){
			if(this.orderPaymentData.delivery_store_info){
				let delivery_store_info = this.orderPaymentData.delivery_store_info;
				let data = {
					time_type:this.$util.deepClone(delivery_store_info).time_type,
					end_time:this.$util.deepClone(delivery_store_info).end_time,
					start_time:this.$util.deepClone(delivery_store_info).start_time,
					time_week:this.$util.deepClone(delivery_store_info).time_week,
				};
				let obj = {
					delivery:this.orderCreateData.delivery,
					dataTime:data
				}
				this.$refs.TimePopup.open(obj,type);
				this.$forceUpdate();
			}
		},
		/**
		 * 弹窗返回数据
		 */
		selectTime(data){
			if(data.data && data.data.month){
				let nowDate = new Date();
				let Year =  nowDate.getFullYear();
				let timeData = data.data.month.split('月');
				let month = timeData[0];
				let date = timeData[1].split('日')[0]
				
				this.orderCreateData.buyer_ask_delivery_time = Year + '-' + month + '-' + date + ' ' + data.data.time + ':00'
				if(data.data.title == '今天' || data.data.title == '明天'){
					this.orderCreateData.buyer_ask_delivery_title =  data.data.title + '(' + data.data.time + ')'
				}else{
					this.orderCreateData.buyer_ask_delivery_title =  data.data.month + '(' + data.data.time + ')'
				}
				
				this.orderCalculate();
				
				this.$forceUpdate();
			}
		},
	},
	onShow() {
		
		

		if (uni.getStorageSync('addressBack')) {
			uni.removeStorageSync('addressBack');
		}

		// 判断登录
		if (!uni.getStorageSync('token')) {
			this.$util.redirectTo('/pages_tool/login/login');
		} else {
			this.getOrderPaymentData();
		}
		this.judge = true;
		
		this.getTime();
		this.isIphoneX = this.$util.uniappIsIPhoneX()
	},
	onHide() {
		if (this.$refs.loadingCover) this.$refs.loadingCover.show();
	},
	onLoad(){
		if (!this.location) this.$util.getLocation();
		// #ifdef MP
		this.menuButtonBounding = uni.getMenuButtonBoundingClientRect();
		// #endif
	},
	computed: {
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
		// 金额格式化输出
		moneyFormat(money) {
			return parseFloat(money).toFixed(2);
		}
	}
}
