export default {
	data() {
		return {
			goodsRoute: '/pages/goods/detail',
			couponList: [], //优惠券列表
			couponBtnSwitch: false, //获取优惠券防止重复提交

			posterApi: '/api/goods/poster',

			//满减活动
			manjian: {
				type: 0,
				manjian_name: "",
				rule_json: null
			},
			//组合套餐
			bundlingType: false,
			bundling: [{
				bundling_goods: {
					bl_name: '',
					sku_image: ''
				}
			}],

			levelInfo: {},
			showFenxiao: 0,
			membercard: null, // 会员卡信息
			hackReset: true,
		}
	},
	computed: {
		showDiscount() {
			var flag = false;
			if (
				this.preview == 0 &&
				this.addonIsExist.discount &&
				this.goodsSkuDetail.promotion_type == 1 &&
				this.goodsSkuDetail.discountTimeMachine &&
				(!this.goodsSkuDetail.member_price ||
					(this.goodsSkuDetail.member_price > 0 && Number(this.goodsSkuDetail.member_price) > Number(this
						.goodsSkuDetail.discount_price))
				)
			) {
				flag = true;
			}
			return flag;
		},
		memberCardDiscount() {
			let discount = 0,
				showPrice = this.goodsSkuDetail.member_price > 0 && Number(this.goodsSkuDetail.member_price) < Number(
					this.goodsSkuDetail
					.discount_price) ? this.goodsSkuDetail.member_price : this.goodsSkuDetail.discount_price;
			if (this.membercard && this.membercard.member_price > 0 && (parseFloat(showPrice) > parseFloat(this
					.membercard.member_price))) {
				discount = parseFloat(showPrice) - parseFloat(this.membercard.member_price);
			}
			return discount.toFixed(2);
		}
	},
	onLoad(data) {
		this.skuId = data.sku_id || 0;
		this.goodsId = data.goods_id || 0;
		// 小程序扫码进入
		if (data.scene) {
			var sceneParams = decodeURIComponent(data.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('goods_id') != -1) this.goodsId = item.split('-')[1];
				});
			}
		}
		// #ifdef MP-WEIXIN
		this.getShareImg();
		// #endif
	},
	async onShow() {
		//同步获取商品详情
		await this.getGoodsSkuDetail();

		// 开启预览，禁止任何操作和跳转
		if (this.preview == 0) {
			this.getCoupon();

			this.getManjian();

			//组合套餐
			this.getBundling();

			if (this.addonIsExist.fenxiao == 1) {
				this.getFenxiaoGoodsDetail()
			}
		}
	},
	onHide() {
		this.couponBtnSwitch = false;
	},
	methods: {
		setSkuId(val) {
			if (val) {
				this.skuId = val;
				this.getBundling();
			}
		},
		//请求佣金详情
		getFenxiaoGoodsDetail() {
			this.$api.sendRequest({
				url: '/fenxiao/api/goods/detail',
				data: {
					sku_id: this.skuId,
				},
				success: res => {
					if (res.code == 0 && res.data) {
						this.levelInfo = res.data;
					}
				}
			});
		},
		// 获取商品详情
		async getGoodsSkuDetail() {
			let res = await this.$api.sendRequest({
				url: '/api/goodssku/detail',
				async: false,
				data: {
					sku_id: this.skuId,
					goods_id: this.goodsId,
				}
			});
			let data = res.data;
			if (data.goods_sku_detail != null) {
				if (data.goods_sku_detail.promotion_type == 'presale' && data.goods_sku_detail.presale_id) {
					this.$util.redirectTo('/pages_promotion/presale/detail', {
						id: data.goods_sku_detail.presale_id,
						sku_id: this.skuId
					}, 'reLaunch');
					return;
				}

				this.goodsSkuDetail = data.goods_sku_detail;
				if (!this.skuId) this.skuId = this.goodsSkuDetail.sku_id;
				if (!this.goodsId) this.goodsId = this.goodsSkuDetail.goods_id;
				// 分享参数、链接
				this.shareQuery = 'goods_id=' + this.goodsSkuDetail.goods_id;
				this.shareUrl = this.goodsRoute + '?' + this.shareQuery;

				// 在线客服聊天参数
				this.chatRoomParams = {
					sku_id: this.goodsSkuDetail.sku_id
				};
				let typeId = this.goodsSkuDetail.goods_promotion[0];
				if (typeId) {
					// 限时折扣
					if (typeId.discount_id) {
						this.chatRoomParams.type = 'discount'
						this.chatRoomParams.type_id = typeId.discount_id
					}
				}

				// 海报参数
				this.posterParams = {
					goods_id: this.goodsId
				};

				// 处理商品数据
				this.handleGoodsSkuData();

				// 限时折扣
				if (this.goodsSkuDetail.promotion_type == 1 && this.addonIsExist.discount) {
					//检测倒计时
					if ((this.goodsSkuDetail.end_time - res.timestamp) > 0) {
						this.goodsSkuDetail.discountTimeMachine = this.$util.countDown(this.goodsSkuDetail
							.end_time - res.timestamp);
					} else {
						this.goodsSkuDetail.promotion_type = 0;
					}
				}
				if (this.goodsSkuDetail.promotion_type == 1 && this.goodsSkuDetail.discountTimeMachine) {
					if (this.goodsSkuDetail.member_price > 0 && Number(this.goodsSkuDetail.member_price) <= Number(
							this.goodsSkuDetail
							.discount_price)) {
						this.goodsSkuDetail.show_price = this.goodsSkuDetail.member_price;
					} else {
						this.goodsSkuDetail.show_price = this.goodsSkuDetail.discount_price;
					}
				} else {
					if (this.goodsSkuDetail.member_price > 0) {
						this.goodsSkuDetail.show_price = this.goodsSkuDetail.member_price;
					} else {
						this.goodsSkuDetail.show_price = this.goodsSkuDetail.price;
					}
				}

				if (this.token != '' && this.preview == 0) {
					if (this.addonIsExist.supermember) {
						this.getMemberInfo();
					}
				}

				if (this.$refs.loadingCover) this.$refs.loadingCover.hide();

			} else {
				this.$util.redirectTo('/pages_tool/goods/not_exist', {}, 'redirectTo');
			}
		},
		refreshLevelInfo(data) {
			if (data) {
				this.$refs.refLeverInfo.levelInfo.commission_money = data.commission_money;
			}
		},
		choiceSku() {
			this.$refs.goodsSku.show("buy_now", () => {
				this.getCartCount();
			});
		},
		// 加入购物车
		joinCart() {
			if (!uni.getStorageSync('token') && this.preview == 0) {
				this.$refs.login.open(this.shareUrl);
				return;
			}
			if (this.goodsSkuDetail.is_virtual == 1) {
				this.$refs.goodsSku.show("buy_now", () => {
					this.getCartCount();
				});
			} else {
				this.$refs.goodsSku.show("join_cart", () => {
					this.getCartCount();
				});
			}
		},
		// 立即购买
		buyNow() {
			if (!uni.getStorageSync('token') && this.preview == 0) {
				this.$refs.login.open(this.shareUrl);
				return;
			}
			this.$refs.goodsSku.show("buy_now", () => {
				this.getCartCount();
			});
		},

		//-------------------------------------优惠券-------------------------------------

		getCoupon() {
			this.$api.sendRequest({
				url: "/coupon/api/coupon/goodsCoupon",
				data: {
					goods_id: this.goodsSkuDetail.goods_id
				},
				success: res => {
					let data = res.data;
					if (data) {
						this.couponList = data;

						this.couponList.forEach(v => {
							if (v.count == v.lead_count) v.useState = 2;
							else if (v.max_fetch != 0 && v.member_coupon_num && v
								.member_coupon_num >= v.max_fetch) v.useState = 1;
							else v.useState = 0;
						});
						this.couponList = this.couponList.sort(this.sortBy('useState'))
					}
				}
			});
		},
		sortBy(field) {
			//根据传过来的字段进行排序,y-x 得分从高到低，x-y 从低到高
			return (y, x) => {
				return y[field] - x[field]
			}
		},

		// 打开优惠券弹出层
		openCouponPopup() {
			this.$refs.couponPopup.open();
		},
		// 关闭优惠券弹出层
		closeCouponPopup() {
			this.$refs.couponPopup.close();
		},
		// 领取优惠券
		receiveCoupon(item) {
			let that = this;
			if (this.preview) return; // 开启预览，禁止任何操作和跳转
			if (this.couponBtnSwitch) return;
			this.couponBtnSwitch = true;
			if (this.token) {
				this.$api.sendRequest({
					url: '/coupon/api/coupon/receive',
					data: {
						coupon_type_id: item.coupon_type_id,
						get_type: 2 //获取方式:1订单2.直接领取3.活动领取
					},
					success: res => {
						var data = res.data;

						let msg = '';

						let list = this.couponList;
						if (res.data.is_exist == 1 && res.code < 0) {
							msg = '您已领取过该优惠券，快去使用吧';
						} else if (res.code == 0) {
							msg = '领取成功，快去使用吧';
						} else {
							msg = res.message;
						}
						if (res.data.is_exist == 1) {
							for (let i = 0; i < list.length; i++) {
								if (list[i].coupon_type_id == item.coupon_type_id) {
									that.$set(that.couponList[i], 'useState', 1);

								}
							}
						} else {
							for (let i = 0; i < list.length; i++) {
								if (list[i].coupon_type_id == item.coupon_type_id) {
									that.$set(that.couponList[i], 'useState', 2);

								}

							}
						}
						this.$util.showToast({
							title: msg
						});
						that.$forceUpdate()
						this.hackReset = false;
						this.$nextTick(() => {
							this.hackReset = true;
						})

						this.couponBtnSwitch = false;
					},
				});
			} else {
				this.$refs.login.open(this.shareUrl);
				this.couponBtnSwitch = false;
			}
		},
		//更新优惠券信息
		refreshCoupon(couponTypeId) {
			for (let i in this.couponList) {
				var info = this.couponList[i]
				if (couponTypeId == info.coupon_type_id) {
					this.$set(this.couponList[i], 'is_lingqu', 1);
				}
			}

			this.$forceUpdate()
		},

		//-------------------------------------满减-------------------------------------

		//获取满减信息
		getManjian() {
			this.$api.sendRequest({
				url: "/manjian/api/manjian/info",
				data: {
					goods_id: this.goodsSkuDetail.goods_id
				},
				success: res => {
					let data = res.data;
					if (data) {
						this.manjian = data;
						let limit = data.type == 0 ? '元' : '件';
						Object.keys(data.rule_json).forEach((key) => {
							var item = data.rule_json[key];
							if (item.coupon_data) {
								for (var i = 0; i < item.coupon_data.length; i++) {
									item.coupon_data[i].coupon_num = item.coupon_num[i]
								}
							}
							item.limit = data.type == 0 ? parseFloat(item.limit).toFixed(2) :
								parseInt(item.limit);
							// 满减
							if (item.discount_money != undefined) {
								if (this.manjian.manjian == undefined) {
									this.manjian.manjian = '满' + item.limit + limit + '减' + item
										.discount_money + '元';
								} else {
									this.manjian.manjian += '；满' + item.limit + limit + '减' + item
										.discount_money + '元';
								}
							}
							// 满送
							if (item.point != undefined || item.coupon != undefined) {
								let text = '';
								if (item.point != undefined) {
									text = '送' + item.point + '柚币';
								}
								if (item.coupon != undefined && item.coupon_data != undefined) {
									item.coupon_data.forEach((couponItem, couponIndex) => {
										if (couponItem.type == 'discount') {
											if (text == '') text = '送' + item.coupon_num[
												couponIndex] + '张' + parseFloat(
												couponItem.discount) + '折优惠券';
											else text += '、送' + item.coupon_num[
												couponIndex] + '张' + parseFloat(
												couponItem
												.discount) + '折优惠券';
										} else {
											if (text == '') text = '送' + item.coupon_num[
												couponIndex] + '张' + parseFloat(
												couponItem.money) + '元优惠券';
											else text += '、送' + item.coupon_num[
												couponIndex] + '张' + parseFloat(
												couponItem
												.money) + '元优惠券';
										}
									})
								}
								if (this.manjian.mansong == undefined) {
									this.manjian.mansong = '满' + item.limit + limit + text;
								} else {
									this.manjian.mansong += '；' + '满' + item.limit + limit + text;
								}
							}
							// 包邮
							if (item.free_shipping != undefined) {
								if (this.manjian.free_shipping == undefined) {
									this.manjian.free_shipping = '满' + item.limit + limit + '包邮';
								} else {
									this.manjian.free_shipping += '；满' + item.limit + limit + '包邮';
								}
							}
						})
					}
				}
			});
		},
		openManjianPopup() {
			this.$refs.manjianPopup.open();
		},
		closeManjianPopup() {
			this.$refs.manjianPopup.close();
		},

		//-------------------------------------组合套餐-------------------------------------

		//获取当前商品关联的组合套餐
		getBundling() {
			this.$api.sendRequest({
				url: "/bundling/api/bundling/lists",
				data: {
					sku_id: this.skuId
				},
				success: res => {
					this.bundling = res.data;
					if (res.data && res.data.length) {

						for (var i = 0; i < this.bundling[0].bundling_goods.length; i++) {
							if (this.bundling[0].bundling_goods[i].sku_id == this.skuId) {
								this.bundlingType = true;
								break;
							} else {
								this.bundlingType = false;
							}
						}

						for (var i = 0; i < this.bundling.length; i++) {
							for (var j = 0; j < this.bundling[i].bundling_goods.length; j++) {
								if (this.bundling[i].bundling_goods[j].sku_id == this.skuId) {
									this.bundling[i].bundling_goods.splice(j, 1);
								}
							}
						}
					}
				}
			});
		},
		// 打开组合套餐弹出层
		openBundlingPopup() {
			this.$refs.bundlingPopup.open();
		},
		// 关闭组合套餐弹出层
		closeBundlingPopup() {
			this.$refs.bundlingPopup.close();
		},
		imageError() {
			this.goodsSkuDetail.sku_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		bundlingImageError(index, goods_index) {
			this.bundling[index].bundling_goods[goods_index].sku_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		fenxiao() {
			this.$refs.fenxiaoPopup.show()
		},
		toGoodsDetail(item) {
			this.$util.redirectTo(this.goodsRoute, {
				sku_id: item
			});
		},
		toComoDetail(id) {
			this.$util.redirectTo('/pages_promotion/bundling/detail', {
				bl_id: id
			});
		},
		/**
		 * 获取会员信息
		 */
		getMemberInfo() {
			this.$api.sendRequest({
				url: '/api/member/info',
				success: res => {
					if (res.code == 0 && res.data && res.data.member_level_type == 0) this
						.getMemberCardInfo();
				}
			});
		},
		getMemberCardInfo() {
			this.$api.sendRequest({
				url: '/supermember/api/membercard/recommendcard',
				data: {
					sku_id: this.goodsSkuDetail.sku_id
				},
				success: res => {
					if (res.code == 0 && res.data) {
						this.membercard = res.data;
					}
				}
			});
		},
		/**
		 * 获取分享图
		 */
		getShareImg() {
			let posterParams = {
				goods_id: this.goodsId
			};
			this.$api.sendRequest({
				url: '/api/goods/shareimg',
				data: {
					qrcode_param: JSON.stringify(posterParams)
				},
				success: res => {
					if (res.code == 0) this.shareImg = res.data.path;
				}
			})
		}
	}
}
