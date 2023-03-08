export default {
	data() {
		return {
			isIphoneX: false,
			orderCreateData: {
				is_balance: 0,
				is_point: 1,
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
				member_address: {
					mobile: ''
				},
				is_open_card: 0,
				member_card_unit: ''
			},
			orderPaymentData: {
				shop_goods_list: {
					site_name: '',
					express_type: [],
					coupon_list: [],
					invoice: {
						invoice_content_array: []
					}
				},
				member_account: {
					balance: 0,
					is_pay_password: 0
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
			},
			isSub: false,
			tempData: null,
			manjian: [],
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
			post_free : {},
			canLocalDelicery: true,
			deliveryWeek: "",
			out_trade_no: null
		};
	},
	onLoad(){
		if (!this.location) this.$util.getLocation();
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
				back: encodeURIComponent('/pages_promotion/blindbox/fill_address?blindbox_goods_id='+this.blindbox_goods_id+'&out_trade_no='+this.outTradeNo),
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
			if (this.out_trade_no) return;
			
			this.orderCreateData = uni.getStorageSync('blindOrderCreateData');
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
			
			/* if(this.orderCreateData.cart_ids  && this.orderCreateData.jielong_id){
				this.$api.sendRequest({
					url: '/jielong/api/cart/goodsLists',
					data: {
						jielong_id: this.orderCreateData.jielong_id
					},
					success: res => {
						if(res.data.length==0){
							this.$util.redirectTo('/pages/index/index', {}, 'reLaunch');
							return false
						}
						this.dingdna()
					},
				})
			}else {
				this.dingdna()
			} */

			
			this.$api.sendRequest({
				url: '/api/ordercreate/payment',
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
			this.orderCreateData.coupon = {};
			this.orderCreateData.buyer_message = '';

			this.orderCreateData.is_balance = 0;
			this.orderCreateData.is_point = 1;
			this.orderCreateData.pay_password = '';

			this.orderCreateData.is_invoice = 0; // 是否需要发票 0 无发票  1 有发票
			this.orderCreateData.invoice_type = 1; // 发票类型  1 纸质 2 电子
			this.orderCreateData.invoice_title_type = 1; // 发票抬头类型 1 个人 2企业
			this.orderCreateData.is_tax_invoice = 0; // 是否需要增值税专用发票  0 不需要 1 需要
			this.orderCreateData.invoice_title = '';
			
			if (this.orderPaymentData.shop_goods_list.invoice) {
				this.orderPaymentData.shop_goods_list.invoice.invoice_type = this.orderPaymentData.shop_goods_list.invoice.invoice_type.split(',');
				this.orderCreateData.invoice_type = this.orderPaymentData.shop_goods_list.invoice.invoice_type[0]; // 发票类型  1 纸质 2 电子
			} 

			var data = this.orderPaymentData;
			// var post_free = this.orderPaymentData.promotion;
			
			if (data.recommend_member_card) {
				this.orderCreateData.member_card_unit = Object.keys(data.recommend_member_card.charge_rule)[0];
			}

			// 店铺配送方式
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

			// 店铺优惠券
			if (data.shop_goods_list.coupon_list != undefined && data.shop_goods_list.coupon_list[0] != undefined) {
				var coupon_list = data.shop_goods_list.coupon_list;
				this.orderCreateData.coupon.coupon_id = coupon_list[0].coupon_id;
				this.orderCreateData.coupon.coupon_money = coupon_list[0].money;
			}
			
			// 满减送
			// if (data.shop_goods_list.promotion != undefined && data.shop_goods_list.promotion.manjian != undefined) {
			// 	this.manjian = data.shop_goods_list.promotion.manjian;
			// }
			if (data.shop_goods_list.promotion.manjian.manjian_info.rule) {
			
				let dataList = data.shop_goods_list.promotion.manjian.manjian_info;
				this.manjian = dataList;
				
				let limit = dataList.type == 0 ? '元' : '件';
				Object.keys(dataList.rule).forEach((key) => {
					var item = dataList.rule[key];
					if(item.dataList){
						for(var i=0;i<item.coupon_data.length;i++){
							item.coupon_data[i].coupon_num = item.coupon_num[i]
						}
					}
					item.limit = dataList.type == 0 ? parseFloat(item.limit).toFixed(2) : parseInt(item.limit);
					// 满减
					if (item.discount_money != undefined) {
						if (this.manjian.manjian == undefined) {
							this.manjian.manjian = '购买可享受满' + item.limit + limit + '减' + item.discount_money + '元';
						} else {
							this.manjian.manjian += '；满' + item.limit + limit + '减' + item.discount_money + '元';
						}
					}
					// 满送
					if (item.point != undefined || item.coupon != undefined) {
						let text = '';
						let point_text = ''
						if (item.point != undefined) {
							point_text = '可得' + item.point + '柚币';
						}
						if (item.coupon != undefined && item.coupon_data != undefined) {
							item.coupon_data.forEach((couponItem, couponIndex) => {
								if (couponItem.type == 'discount') {
									if (text == '') text = '送'+ item.coupon_num[couponIndex] +'张' + parseFloat(couponItem.discount) + '折优惠券';
									else text += '、送'+ item.coupon_num[couponIndex] +'张' + parseFloat(couponItem.discount) + '折优惠券';
								} else {
									if (text == '') text = '送'+ item.coupon_num[couponIndex] +'张' + parseFloat(couponItem.money) + '元优惠券';
									else text += '、送'+ item.coupon_num[couponIndex] +'张' + parseFloat(couponItem.money) + '元优惠券';
								}
							})
						}
						if(this.manjian.point_text == undefined) {
							this.manjian.point_text = '购物满' + item.limit + limit + point_text
						}else {
							this.manjian.point_text += '；' + '满' + item.limit + limit + point_text;
						}
						if (this.manjian.mansong == undefined) {
							this.manjian.mansong = '购物满' + item.limit + limit + text;
						} else {
							this.manjian.mansong += '；' + '满' + item.limit + limit + text;
						}
					}
					// 包邮
					if (item.free_shipping != undefined) {
						if (this.manjian.free_shipping == undefined) {
							this.manjian.free_shipping = '购物满' + item.limit + limit + '包邮';
						}
						// if (this.manjian.free_shipping == undefined) {
						// 	this.manjian.free_shipping = '满' + item.limit + limit + '包邮';
						// } else {
						// 	this.manjian.free_shipping += '；满' + item.limit + limit + '包邮';
						// }
					}
				})
			}
			
			// 包邮
			// if (item.free_shipping != undefined) {
			// 	if (this.manjian.free_shipping == undefined) {
			// 		this.manjian.free_shipping = '满' + item.limit + limit + '包邮';
			// 	} else {
			// 		this.manjian.free_shipping += '；满' + item.limit + limit + '包邮';
			// 	}
			// }
			if (this.goodsInfo.is_virtual) this.member_address = {
				mobile: data.member_account.mobile != '' ? data.member_account.mobile : ''
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
					
					if (this.orderPaymentData.shop_goods_list.local_config.info.time_type == 0) {
						this.deliveryWeek = "全天";
					} else if (this.orderPaymentData.shop_goods_list.local_config.info.time_week.length > 0) {

						if (this.orderPaymentData.shop_goods_list.local_config.info.time_week.length == 7) {
							this.deliveryWeek = "全天";
						} else {
							this.timeInfo.showTime = true;
							// 判断配送时间是连续还是间隔
							var timeWeek = this.orderPaymentData.shop_goods_list.local_config.info.time_week;
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
					let start_time = this.orderPaymentData.shop_goods_list.local_config.info.start_time;
					this.timeInfo.start_time = this.getTimeStr(start_time);

					let end_time = this.orderPaymentData.shop_goods_list.local_config.info.end_time;
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
			
			if (data.system_form) {
				this.orderPaymentData.system_form = data.system_form;
			} 

			Object.assign(this.orderPaymentData, this.orderCreateData);
			this.orderPaymentData.shop_goods_list.goods_list.forEach((v) => {
				if (v.sku_spec_format) {
					v.sku_spec_format = JSON.parse(v.sku_spec_format);
				} else {
					v.sku_spec_format = [];
				}
			});
			
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
			data.coupon = JSON.stringify(data.coupon);
			if (this.orderCreateData.delivery.delivery_type == 'store') {
				data.member_address = JSON.stringify(this.member_address);
			} else {
				data.member_address = JSON.stringify(data.member_address);
			}

			this.$api.sendRequest({
				url: '/api/ordercreate/calculate',
				data,
				success: res => {
					if (res.code >= 0) {
						this.orderPaymentData.member_address = res.data.member_address;
						this.orderPaymentData.delivery_money = res.data.delivery_money;
						this.orderPaymentData.coupon_money = res.data.coupon_money;
						this.orderPaymentData.invoice_money = res.data.invoice_money;
						this.orderPaymentData.invoice_delivery_money = res.data.shop_goods_list.invoice_delivery_money;
						this.orderPaymentData.promotion_money = res.data.promotion_money;
						this.orderPaymentData.order_money = res.data.order_money;
						this.orderPaymentData.balance_money = res.data.balance_money;
						this.orderPaymentData.pay_money = res.data.pay_money;
						this.orderPaymentData.goods_money = res.data.goods_money;
						this.orderPaymentData.point_money = res.data.point_money;
						this.orderPaymentData.member_card_money = res.data.member_card_money;
						this.orderPaymentData.shop_goods_list.promotion = res.data.shop_goods_list.promotion;
						this.orderPaymentData.shop_goods_list.coupon_list = res.data.shop_goods_list.coupon_list;
						this.orderPaymentData.shop_goods_list.goods_list = res.data.shop_goods_list.goods_list;
						this.orderPaymentData.shop_goods_list.max_usable_point = res.data.shop_goods_list.max_usable_point;
						// 针对优惠券特殊处理
						if (this.orderPaymentData.shop_goods_list.coupon_list.length == 0) {
							this.orderCreateData.coupon = {};
						}
						
						this.orderPaymentData.shop_goods_list.goods_list.forEach((v) => {
							if (v.sku_spec_format) {
								v.sku_spec_format = JSON.parse(v.sku_spec_format);
							} else {
								v.sku_spec_format = [];
							}
						});
						
						this.$forceUpdate();
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			})
		},
		
		// 获取订单数据
		dingdna(){
			this.$api.sendRequest({
				url: '/api/ordercreate/payment',
				data: this.orderCreateData,
				success: res => {
					if (res.code >= 0) {
						this.post_free = res.data.shop_goods_list.promotion;
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
		/**
		 * 订单创建
		 * @param {String} pay_password 支付密码
		 */
		orderCreate(pay_password) {
			if (this.verify()) {
				if (this.isSub) return;
				this.isSub = true;

				if (pay_password) this.orderCreateData.pay_password = pay_password;

				var data = this.$util.deepClone(this.orderCreateData);
				data.delivery = JSON.stringify(data.delivery);
				data.coupon = JSON.stringify(data.coupon);
				if (this.orderCreateData.delivery.delivery_type == 'store') {
					data.member_address = JSON.stringify(this.member_address);
				} else {
					data.member_address = JSON.stringify(data.member_address);
				}
				
				if (this.orderPaymentData.system_form) {
					let formData = {
						form_id: this.orderPaymentData.system_form.id,
						form_data: this.$util.deepClone(this.$refs.form.verify())
					}
					data.form_data = JSON.stringify(formData);
				}

				this.$api.sendRequest({
					url: '/api/ordercreate/create',
					data,
					success: res => {
						uni.hideLoading();
						if (res.code >= 0) {
							if (this.orderPaymentData.pay_money == 0) {
								this.$util.redirectTo('/pages_tool/pay/result', {
									code: res.data
								}, 'redirectTo');
							} else {
								this.out_trade_no = res.data;
								this.$refs.choosePaymentPopup.getPayInfo(res.data);
								this.isSub = false;
							}
						} else {
							if(res.data == ""){
								this.$util.showToast({
									title: res.message
							 	});
							}
							this.isSub = false;
						}
						this.getCartNumber();
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
			/* if (this.orderPaymentData.is_virtual == 1) {
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
			} */
			if (this.goodsInfo.is_virtual == 1) {
				if (!this.member_address.mobile) {
					this.$util.showToast({
						title: '请输入您的手机号码'
					});
					return false;
				}
				var reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
				if (!reg.test(this.member_address.mobile)) {
					this.$util.showToast({
						title: '请输入正确的手机号码'
					});
					return false;
				}
			}
			if (this.orderPaymentData.is_virtual == 0) {
				// console.log(this.orderPaymentData)
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
					
					if(this.deliveryWeek == '店铺未开启配送时间'){
						this.$util.showToast({
							title: '店铺未设置配送时间'	
						});
						return false;
					}

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
							title: '店铺"' + this.orderPaymentData.shop_goods_list[key].site_name + '"未设置配送方式'
						});
						break;
					}
					if (this.orderCreateData.delivery[key].delivery_type == 'store' && this.orderCreateData.delivery[key].store_id ==
						0) {
						deliveryVerify = false;
						this.$util.showToast({
							title: '店铺"' + this.orderPaymentData.shop_goods_list[key].site_name + '"没有可提货的门店,请选择其他配送方式'
						});
						break;
					}
				}

				if (!deliveryVerify) return false;

			}

			// 如果使用发票进行验证
			if (this.orderCreateData.is_invoice == 1) {
				if (!this.invoiceVerify()) return false;
			}

			return true;
		},
		// 显示店铺优惠信息
		openSitePromotion() {
			this.$refs.sitePromotionPopup.open();
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
		// 显示店铺优惠券信息
		openSiteCoupon() {
			this.tempData = {
				coupon: this.$util.deepClone(this.orderPaymentData.coupon)
			};
			this.$refs.couponPopup.open();
		},
		// 选择优惠券
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
			this.orderCalculate();
			this.$forceUpdate();
			this.tempData = null;
			this.$refs[ref].close();
		},
		// 使用余额
		useBalance() {
			if (this.orderCreateData.is_balance) this.orderCreateData.is_balance = 0;
			else this.orderCreateData.is_balance = 1;
			this.orderCalculate();
			this.$forceUpdate();
		},
		// 使用柚币
		usePoint() {
			if (this.orderCreateData.is_point) this.orderCreateData.is_point = 0;
			else this.orderCreateData.is_point = 1;
			this.orderCalculate();
			this.$forceUpdate();
		},
		imageError(goodsIndex) {
			this.orderPaymentData.shop_goods_list.goods_list[goodsIndex].sku_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		// 购物车数量
		getCartNumber() {
			if (uni.getStorageSync("token")) {
				this.$store.dispatch('getCartNumber');
			}
		},
		// 切换发票开关
		changeIsInvoice() {
			if (this.orderCreateData.is_invoice == 0) {
				this.orderCreateData.is_invoice = 1;
			} else {
				this.orderCreateData.is_invoice = 0;
			}
			this.orderCalculate();
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
		invoiceVerify() {
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
					title: '请填写纳税人识别号'
				});
				return false;
			}
			if (this.orderCreateData.invoice_type == 1 && !this.orderCreateData.invoice_full_address) {
				this.$refs.invoicePopup.open();
				this.$util.showToast({
					title: '请填写发票邮寄地址'
				});
				return false;
			}
			if (this.orderCreateData.invoice_type == 2 && !this.orderCreateData.invoice_email) {
				this.$refs.invoicePopup.open();
				this.$util.showToast({
					title: '请填写邮箱'
				});
				return false;
			}
			if (this.orderCreateData.invoice_type == 2) {
				var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
				if (!reg.test(this.orderCreateData.invoice_email)) {
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
		saveInvoice() {
			if (this.orderCreateData.is_invoice == 1) {
				if (this.invoiceVerify()) {
					this.closePopup('invoicePopup');
				}
			} else {
				this.closePopup('invoicePopup');
			}
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
		closeInvoicePopup() {
			// 发票
			this.orderCreateData.is_invoice = 0;
			this.orderCreateData.invoice_type = this.orderPaymentData.shop_goods_list.invoice.invoice_type[0]; // 发票类型  1 纸质 2 电子
			this.orderCreateData.invoice_title_type = 1; // 抬头类型  1 个人 2 企业
			this.orderCreateData.is_tax_invoice = 0; // 是否需要增值税专用发票  0 不需要 1 需要
			this.orderCreateData.invoice_title = ''; // 发票抬头
			this.orderCreateData.taxpayer_number = ''; // 纳税人识别号
			this.orderCreateData.invoice_content = ''; // 发票内容
			this.orderCreateData.invoice_full_address = ''; // 发票邮寄地址
			this.orderCreateData.invoice_email = ''; //发票邮箱
			this.orderCalculate();
			this.$forceUpdate();
			this.$refs.invoicePopup.close();
		},
		navigateTo(sku_id) {
			this.$util.redirectTo('/pages/goods/detail', {
				sku_id
			});
		},
		// 显示选择支付方式弹框
		openChoosePayment() {
			var data = this.$util.deepClone(this.orderCreateData);
			data.delivery = JSON.stringify(data.delivery);
			data.coupon = JSON.stringify(data.coupon);
			if (this.orderCreateData.delivery.delivery_type == 'store') {
				data.member_address = JSON.stringify(this.member_address);
			} else {
				data.member_address = JSON.stringify(data.member_address);
			}
			
			if (this.orderPaymentData.system_form) {
				let formData = {
					form_id: this.orderPaymentData.system_form.id,
					form_data: this.$util.deepClone(this.$refs.form.verify())
				}
				data.form_data = JSON.stringify(formData);
			}
			this.$api.sendRequest({
				url: '/api/ordercreate/verifyarea',
				data,
				success: res => {
					if (res.code >= 0) {
						uni.setStorageSync('paySource', '');
						if (this.verify()) {
							// #ifdef MP-WEIXIN
							this.subscribeMessage();
							// #endif
							this.$refs.choosePaymentPopup.open();
						}
					} else {
						if(res.data.error_code == 1){
							this.$util.showToast({
								title: res.message
							});
						}else if(res.data.error_code == 11){
							this.$util.showToast({
								title: res.message
							});
						}else if (res.data.error_code == 10 || res.data.error_code == 12) {
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
						}
					}	
				}
			})	
		},
		/**
		 * 微信订阅消息
		 */
		subscribeMessage() {
			let keywords = 'ORDER_PAY,ORDER_DELIVERY,ORDER_TAKE_DELIVERY';
			if(this.orderCreateData.delivery && this.orderCreateData.delivery.delivery_type == 'store'){
				keywords = 'ORDER_PAY,ORDER_TAKE_DELIVERY';
			}
			this.$api.sendRequest({
				url: '/weapp/api/weapp/messagetmplids',
				data: {
					keywords: keywords
				},
				success: res => {
					if (res.data.length) {
						uni.requestSubscribeMessage({
							tmplIds: res.data,
							success: (res) => {},
							fail: (res) => {
								console.log('fail', res)
							}
						})
					}
				}
			})
		},
		/**
		 * 选择会员卡
		 * @param {Object} item
		 */
		selectMemberCard(item) {
			this.orderCreateData.is_open_card = this.orderCreateData.is_open_card == 1 ? 0 : 1;
			Object.assign(this.orderPaymentData, this.orderCreateData);
			this.orderCalculate();
			this.$forceUpdate();
		},
		/**
		 * 选择会员卡充值类型
		 * @param {Object} key
		 */
		selectMembercardUnit(key){
			this.orderCreateData.member_card_unit = key;
			Object.assign(this.orderPaymentData, this.orderCreateData);
			this.orderCalculate();
		}
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
		this.getTime();
		this.isIphoneX = this.$util.uniappIsIPhoneX()
	},
	onHide() {
		if (this.$refs.loadingCover) this.$refs.loadingCover.show();
	},
	computed: {
		// 余额抵扣
		balanceDeduct() {
			if (this.orderPaymentData.member_account.balance_total <= parseFloat(this.orderPaymentData.order_money).toFixed(2)) {
				return parseFloat(this.orderPaymentData.member_account.balance_total).toFixed(2);
			} else {
				return parseFloat(this.orderPaymentData.order_money).toFixed(2);
			}
		},
		promotionExits() {
			if(this.orderPaymentData.shop_goods_list.promotion){
				if(this.orderPaymentData.shop_goods_list.promotion.manjian){
					if(this.orderPaymentData.shop_goods_list.promotion.manjian.manjian_info){
						return true;
					}else{
						return false;
					}
				}else{
					return false;
				}
			}else{
				return false;
			}
		},
		promotionList() {
			return this.orderPaymentData.shop_goods_list.promotion;
		},
		cardChargeType(){
			if (this.orderPaymentData.recommend_member_card) {
				let charge_rule_arr = [];
				let charge_rule = this.orderPaymentData.recommend_member_card.charge_rule;
				Object.keys(charge_rule).forEach((key, index)=>{
					switch (key) {
						case 'week':
							charge_rule_arr.push({'key': key, 'value': charge_rule[key], 'title' : '周卡', unit: '周'});
						break;
						case 'month':
							charge_rule_arr.push({'key': key, 'value': charge_rule[key], 'title' : '月卡', unit: '月'});
						break;
						case 'quarter':
							charge_rule_arr.push({'key': key, 'value': charge_rule[key], 'title' : '季卡', unit: '季'});
						break;
						case 'year':
							charge_rule_arr.push({'key': key, 'value': charge_rule[key], 'title' : '年卡', unit: '年'});
						break;
					}
				})
				return charge_rule_arr;
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
		// 金额格式化输出
		moneyFormat(money) {
			return parseFloat(money).toFixed(2);
		},
		// 店铺优惠摘取
		promotion(data) {
			let promotion = [];
			if (data) {
				Object.keys(data).forEach((key) => {
					let promotionInfo = data[key];
					switch (key) {
						case 'manjian':
							promotion.push('满减送');
							break;
						case 'freeshipping':
							promotion.push('满额包邮');
							break;
					}
				})
			}
			return promotion.join(" ");
		}
	}
}
