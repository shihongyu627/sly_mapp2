export default {
	data() {
		return {
			token: '',
			cartData: [], // 购物车
			checkAll: true,
			totalPrice: '0.00',
			totalCount: 0,
			modifyFlag: false,
			isSub: false,
			invalidGoods: [], // 失效商品集合
			isIphoneX: false, //判断手机是否是iphoneX以上,
			cartBottom: '56px',
			isAction: false, // 是否操作删除
			goodsSkuDetail: null,
			discount: {},
			manjian: {},
			receiveSub: false,
			discountPopupShow: false
		};
	},
	onLoad() {
		uni.hideTabBar();
	},
	onShow() {
		if (uni.getStorageSync('token')) {
			this.getCartData();
		} else {
			this.token = '';
			this.cartData = [];
			this.calculationTotalPrice();
		}
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		if (this.$util.uniappIsIPhone11()) {
			this.cartBottom = '90px';
		}
	},
	onReady() {
		if (!uni.getStorageSync('token')) {
			if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
		}
	},
	computed: {
		hasData() {
			return this.cartData.length > 0 || this.invalidGoods.length > 0;
		},
		storeToken() {
			return this.$store.state.token;
		}
	},
	watch: {
		storeToken: function(nVal, oVal) {
			this.getCartData();
		}
	},
	methods: {
		initNum(item) {
			let max_buy = item.max_buy > 0 && item.max_buy < item.stock ? item.max_buy : item.stock;
			max_buy = max_buy == 0 ? 1 : max_buy;
			if (item.num > max_buy) return max_buy;
			return item.num;
		},
		/**
		 * 获取购物车数据
		 */
		getCartData() {
			this.$api.sendRequest({
				url: '/api/cart/goodslists',
				success: res => {
					if (res.code >= 0) {
						this.token = uni.getStorageSync('token');
						if (res.data.length) this.handleCartData(res.data);
						else this.cartData = [];
					} else {
						this.token = '';
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		/**
		 * 处理购物车数据结构
		 */
		handleCartData(data) {
			this.invalidGoods = [];
			this.cartData = [];
			var temp = {};
			data.forEach((item, index) => {
				if (item.goods_state == 1) {
					// 如果最小限购超出库存则该商品失效
					if (item.min_buy > 0 && item.min_buy > item.stock) {
						this.invalidGoods.push(item);
					} else {
						item.checked = true;
						item.edit = false;
						if (temp['site_' + item.site_id] != undefined) {
							temp['site_' + item.site_id].cartList.push(item);
						} else {
							temp['site_' + item.site_id] = {
								siteId: item.site_id,
								siteName: item.site_name,
								edit: false,
								checked: true,
								cartList: [item]
							};
						}
					}
				} else {
					this.invalidGoods.push(item);
				}
			});

			this.cartData = [];
			Object.keys(temp).forEach(key => {
				this.cartData.push(temp[key]);
			});
			this.calculationTotalPrice();
			if (this.cartData.length) {
				this.cartData[0].cartList.forEach(v => {
					if (v.sku_spec_format) {
						v.sku_spec_format = JSON.parse(v.sku_spec_format);
					} else {
						v.sku_spec_format = [];
					}
				});
			}
			if (this.invalidGoods.length) {
				this.invalidGoods.forEach(v => {
					if (v.sku_spec_format) {
						v.sku_spec_format = JSON.parse(v.sku_spec_format);
					} else {
						v.sku_spec_format = [];
					}
				});
			}
		},
		/**
		 * 单选
		 * @param {Object} index
		 */
		singleElection(siteIndex, index) {
			this.cartData[siteIndex].cartList[index].checked = !this.cartData[siteIndex].cartList[index].checked;
			this.calculationTotalPrice();
		},
		/**
		 * 店铺全选
		 * @param {Object} checked
		 */
		siteAllElection(checked, index) {
			this.cartData[index].checked = checked;
			this.cartData[index].cartList.forEach(item => {
				item.checked = checked;
			});
			this.calculationTotalPrice();
		},
		/**
		 * 全选
		 */
		allElection(checked) {
			if (typeof checked == 'boolean') {
				this.checkAll = checked;
			} else {
				this.checkAll = !this.checkAll;
			}
			if (this.cartData.length) {
				this.cartData.forEach(siteItem => {
					siteItem.checked = this.checkAll;
					siteItem.cartList.forEach(item => {
						item.checked = this.checkAll;
					});
				});
			}
			this.calculationTotalPrice();
		},
		/**
		 * 计算购物车总价
		 */
		calculationTotalPrice() {
			if (this.cartData.length) {
				let totalPrice = 0,
					totalCount = 0,
					siteAllElectionCount = 0;

				this.cartData.forEach(siteItem => {
					let siteGoodsCount = 0;
					siteItem.cartList.forEach(item => {
						if (item.checked) {
							siteGoodsCount += 1;
							totalCount += parseInt(item.num);
							if (Number(item.member_price) > 0 && Number(item.member_price) < Number(item
									.discount_price)) {
								totalPrice += item.member_price * item.num;
							} else {
								totalPrice += item.discount_price * item.num;
							}
						}
					});
					if (siteItem.cartList.length == siteGoodsCount) {
						siteItem.checked = true;
						siteAllElectionCount += 1;
					} else {
						siteItem.checked = false;
					}
				});
				this.totalPrice = totalPrice.toFixed(2);
				this.totalCount = totalCount;
				this.checkAll = this.cartData.length == siteAllElectionCount;
			} else {
				this.totalPrice = '0.00';
				this.totalCount = 0;
			}
			this.modifyFlag = false;
			this.discountCalculate();
		},
		/**
		 * 删除购物车
		 * @param {Object} siteIndex
		 * @param {Object} cartIndex
		 */
		deleteCart(tag, siteIndex, cartIndex) {
			var cart_id = [];
			if (tag == 'all') {
				for (let i = 0; i < this.cartData.length; i++) {
					for (let j = 0; j < this.cartData[i].cartList.length; j++) {
						if (this.cartData[i].cartList[j].checked) cart_id.push(this.cartData[i].cartList[j].cart_id);
					}
				}
			} else {
				cart_id.push(this.cartData[siteIndex].cartList[cartIndex].cart_id);
			}
			if (cart_id.length == 0) {
				this.$util.showToast({
					title: '请选择要删除的商品'
				});
				return;
			}

			uni.showModal({
				title: '提示',
				content: '确定要删除这些商品吗？',
				success: res => {
					if (res.confirm) {
						cart_id = cart_id.toString();
						this.calculationTotalPrice();
						this.getCartNumber();
						this.$api.sendRequest({
							url: '/api/cart/delete',
							data: {
								cart_id
							},
							success: res => {
								if (res.code >= 0) {
									if (tag == 'all') {
										for (var i = 0; i < this.cartData.length; i++) {
											for (var j = 0; j < this.cartData[i].cartList
												.length; j++) {
												var item = this.cartData[i].cartList[j];
												if (item.checked) {
													this.cartData[i].cartList.splice(j, 1);
													j = -1;
												}
											}
											if (this.cartData[i].cartList.length == 0) {
												this.cartData.splice(i, 1);
												i = -1;
											}
										}
									} else {
										this.cartData[siteIndex].cartList.splice(cartIndex, 1);
										if (this.cartData[siteIndex].cartList.length == 0) this
											.cartData.splice(siteIndex, 1);
									}
									this.calculationTotalPrice();
									this.getCartNumber();
								} else {
									this.$util.showToast({
										title: res.message
									});
								}
							}
						});
					}
				}
			});
		},
		/**
		 * 变更购物车数量
		 * @param {Object} params
		 */
		cartNumChange(num, params) {
			if (isNaN(num)) return;
			let data = this.cartData[params.siteIndex].cartList[params.cartIndex],
				max_buy = data.is_limit && data.max_buy > 0 && data.max_buy < data.stock ? data.max_buy : data.stock,
				min_buy = data.min_buy > 0 ? data.min_buy : 1;
			if (num > max_buy) num = max_buy;
			if (num < min_buy) num = min_buy;

			this.modifyFlag = true;
			this.$api.sendRequest({
				url: '/api/cart/edit',
				data: {
					num,
					cart_id: this.cartData[params.siteIndex].cartList[params.cartIndex].cart_id
				},
				success: res => {
					if (res.code >= 0) {
						this.cartData[params.siteIndex].cartList[params.cartIndex].num = num;
						this.calculationTotalPrice();
						this.getCartNumber();
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		},
		/**
		 * 结算
		 */
		settlement() {
			if (this.totalCount > 0) {
				let cart_ids = [];
				this.cartData.forEach(siteItem => {
					siteItem.cartList.forEach(item => {
						if (item.checked) {
							cart_ids.push(item.cart_id);
						}
					});
				});

				if (this.discount.coupon_info && this.discount.coupon_info.receive_type == 'wait') this.receiveCoupon(
					this.discount.coupon_info.coupon_type_id, false);

				if (this.isSub) return;
				this.isSub = true;

				uni.removeStorageSync('delivery');
				uni.setStorage({
					key: 'orderCreateData',
					data: {
						cart_ids: cart_ids.toString()
					},
					success: () => {
						this.$util.redirectTo('/pages/order/payment');
						this.isSub = false;
					}
				});
			}
		},
		/**
		 * 清空失效商品
		 */
		clearInvalidGoods() {
			uni.showModal({
				title: '提示',
				content: '确定要清空这些商品吗？',
				success: res => {
					if (res.confirm) {
						var cart_ids = [];
						this.invalidGoods.forEach(goodsItem => {
							cart_ids.push(goodsItem.cart_id);
						});
						if (cart_ids.length) {
							this.$api.sendRequest({
								url: '/api/cart/delete',
								data: {
									cart_id: cart_ids.toString()
								},
								success: res => {
									if (res.code >= 0) {
										this.invalidGoods = [];
										this.getCartNumber();
									} else {
										this.$util.showToast({
											title: res.message
										});
									}
								}
							});
						}
					}
				}
			});
		},
		imageError(siteIndex, cartIndex) {
			this.cartData[siteIndex].cartList[cartIndex].sku_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		toGoodsDetail(item) {
			this.$util.redirectTo('/pages/goods/detail', {
				sku_id: item.sku_id
			});
		},
		// 购物车数量
		getCartNumber() {
			if (uni.getStorageSync('token')) {
				this.$store.dispatch('getCartNumber');
				this.resetEditStatus();
			}
		},
		goodsLimit(event, index) {
			let data = this.cartData[0].cartList[index];
			if (event.type == 'plus') {
				if (data.max_buy > 0 && data.max_buy < data.stock) {
					this.$util.showToast({
						title: '该商品每人限购' + data.max_buy + '件'
					});
				} else {
					this.$util.showToast({
						title: '库存不足'
					});
				}
			} else {
				this.$util.showToast({
					title: '最少购买' + event.value + '件'
				});
			}
		},
		toLogin() {
			this.$refs.login.open();
		},
		// 重置编辑状态
		resetEditStatus() {
			if (this.cartData.length) {
				for (var i = 0; i < this.cartData[0].cartList.length; i++) {
					this.cartData[0].cartList[i].edit = false;
				}
				this.$forceUpdate();
			}
		},
		changeAction() {
			this.isAction = !this.isAction;
			this.resetEditStatus();
		},
		selectSku(data) {
			let goodsSkuDetail = this.$util.deepClone(data);
			if (goodsSkuDetail.goods_spec_format) goodsSkuDetail.goods_spec_format = JSON.parse(goodsSkuDetail
				.goods_spec_format);
			this.goodsSkuDetail = goodsSkuDetail;
			
			setTimeout(() => {
				this.$refs.selectSku.show('confirm', (sku_id, num) => {
					this.$api.sendRequest({
						url: '/api/cart/editcartsku',
						data: {
							cart_id: data.cart_id,
							sku_id: sku_id,
							num: num
						},
						success: res => {
							if (res.code >= 0) {
								this.invalidGoods = [];
								this.getCartData();
								this.getCartNumber();
							} else {
								this.$util.showToast({
									title: res.message
								});
							}
						}
					});
				}, this.goodsSkuDetail);
			})
		},
		toggleDiscountPopup() {
			if (this.$refs.discountPopup.showPopup) this.$refs.discountPopup.close();
			else this.$refs.discountPopup.open();
			this.discountPopupShow = !this.discountPopupShow;
		},
		/**
		 * 优惠信息计算
		 */
		discountCalculate() {
			let skuIds = [];
			this.cartData.forEach(siteItem => {
				siteItem.cartList.forEach(item => {
					if (item.checked) {
						skuIds.push({
							sku_id: item.sku_id,
							num: item.num
						});
					}
				});
			});
			if (!skuIds.length) {
				this.discount = {};
				return;
			}
			this.$api.sendRequest({
				url: '/api/cartcalculate/calculate',
				data: {
					sku_ids: JSON.stringify(skuIds)
				},
				success: res => {
					if (res.code >= 0 && res.data && (res.data.coupon_money > 0 || res.data
							.promotion_money > 0)) {
						this.discount = res.data;
						let manjian = {};
						res.data.goods_list.forEach(item => {
							if (item.promotion && item.promotion.manjian) {
								manjian['sku_' + item.sku_id] = JSON.parse(item.promotion.manjian
									.rule_json);
							}
						})
						Object.assign(this.manjian, manjian);
					}
				}
			})
		},
		/**
		 * 领取优惠券 
		 * tips 失败时是否提示
		 * @param {Object} couponTypeId
		 */
		receiveCoupon(couponTypeId, tips = true) {
			if (this.receiveSub) return;
			this.receiveSub = true;
			this.$api.sendRequest({
				url: '/coupon/api/coupon/receive',
				data: {
					coupon_type_id: couponTypeId,
					get_type: 2 //获取方式:1订单2.直接领取3.活动领取
				},
				success: res => {
					if (res.code == 0) {
						this.$set(this.discount.coupon_info, 'receive_type', '');
					} else {
						if (tips) this.$util.showToast({
							title: res.message
						});
						this.receiveSub = false;
					}
				}
			});
		},
		moneyFormat(money) {
			if (isNaN(parseFloat(money))) return money;
			return parseFloat(money).toFixed(2);
		},
		refreshSkuDetail(goodsSkuDetail) {
			this.goodsSkuDetail = goodsSkuDetail;
		}
	},
	onHide() {
		this.isAction = false;
	}
}
