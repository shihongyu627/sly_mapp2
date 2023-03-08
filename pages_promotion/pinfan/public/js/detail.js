export default {
	data() {
		return {
			goodsRoute: 'promotionpages/rebate/detail',
			posterApi: '/pinfan/api/goods/poster',
			groupId: 0,
			pinfan_id: 0,
			pintuanList: [],
			currentPintuan: {
				headimg: '',
				timeMachine: {}
			},
			openPopup: false,
			timestamp: '',
			newList: [],
		}
	},
	onLoad(data) {
		this.pinfan_id = data.pinfan_id || 0;
		if (data.id) {
			this.pinfan_id = data.id;
		}
		this.groupId = data.group_id || 0;

		// 小程序扫码进入
		if (data.scene) {
			var sceneParams = decodeURIComponent(data.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('id') != -1) this.pinfan_id = item.split('-')[1];
					if (item.indexOf('group_id') != -1) this.group_id = item.split('-')[1];
				});
			}
		}
	},
	async onShow() {
		await this.getGoodsSkuDetail();
		this.getPintuanGroupList();
	},
	methods: {
		// 获取拼团商品详情
		async getGoodsSkuDetail() {
			let res = await this.$api.sendRequest({
				url: '/pinfan/api/goods/detail',
				async: false,
				data: {
					pintuan_id: this.pinfan_id
				}
			});
			let data = res.data;
			if (data.goods_sku_detail != null) {
				this.goodsSkuDetail = data.goods_sku_detail;
				this.skuId = this.goodsSkuDetail.sku_id;
				this.goodsSkuDetail.group_id = this.groupId;

				//拼团倒计时
				if ((this.goodsSkuDetail.end_time - res.timestamp) > 0) {
					this.goodsSkuDetail.timeMachine = this.$util.countDown(this.goodsSkuDetail.end_time - res
						.timestamp);
				} else {
					this.$util.showToast({
						title: "活动已结束",
					});
					setTimeout(() => {
						this.$util.redirectTo('/pages/goods/detail', {
							goods_id: this.goodsSkuDetail.goods_id
						}, 'redirectTo');
					}, 1000);
				}

				// 分享参数、链接
				this.shareQuery = 'pinfan_id=' + this.pinfan_id + '&group_id=' + this.groupId;
				this.shareUrl = this.goodsRoute + '?' + this.shareQuery;

				// 在线客服聊天参数
				this.chatRoomParams = {
					sku_id: this.goodsSkuDetail.sku_id,
					type: 'pintuan',
					type_id: this.goodsSkuDetail.pintuan_id
				};

				// 海报参数
				this.posterParams = {
					id: this.goodsSkuDetail.id
				};

				// 处理商品数据
				this.handleGoodsSkuData();

				this.goodsSkuDetail.show_price = (this.goodsSkuDetail.group_id == 0 ? this.goodsSkuDetail
					.promotion_price : this.goodsSkuDetail
					.pintuan_price);
				this.goodsSkuDetail.save_price = (this.goodsSkuDetail.price - this.goodsSkuDetail.show_price) > 0 ?
					(this.goodsSkuDetail
						.price - this.goodsSkuDetail.show_price).toFixed(2) : 0;

				if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
			} else {
				this.$util.redirectTo('/pages_tool/goods/not_exist', {}, 'redirectTo');
			}
		},
		// 发起拼团
		pintuan(isPromotion = true) {
			if (!uni.getStorageSync('token')) {

				if (!this.source_member) {
					this.$refs.login.open(this.shareUrl);
				} else {
					this.$refs.login.open(this.shareUrl + '&source_member=' + this.source_member);
				}
				return;
			}
			if (isPromotion) {
				this.resetPrice();
			}
			this.$refs.goodsSku.show("pinfan", () => {
				this.resetPrice();
				this.getCartCount();
			});
		},
		// 立即购买
		buyNow() {
			if (!uni.getStorageSync('token')) {
				if (!this.source_member) {
					this.$refs.login.open(this.shareUrl);
				} else {
					this.$refs.login.open(this.shareUrl + '&source_member=' + this.source_member);
				}
				return;
			}
			this.$refs.goodsSku.show("buy_now", () => {
				this.getCartCount();
			});
		},
		//-------------------------------------海报-------------------------------------
		// 获取拼团组列表
		getPintuanGroupList() {
			this.$api.sendRequest({
				url: "/pinfan/api/pinfangroup/lists",
				data: {
					goods_id: this.goodsSkuDetail.goods_id
				},
				success: res => {
					let data = res.data;
					this.timestamp = res.timestamp
					if (data != null && data.length) {
						this.pintuanList = data;
						for (let i = 0; i < this.pintuanList.length; i++) {
							if (this.pintuanList[i]['end_time'] > res.timestamp) {
								this.pintuanList[i].timeMachine = this.$util.countDown(this.pintuanList[i][
									'end_time'
								] - res.timestamp);
								this.pintuanList[i].currentTime = res.timestamp;
							} else {
								this.pintuanList[i].timeMachine = null;
							}
						}
						this.newList = this.pintuanList.filter(item => {
							return item.end_time > res.timestamp;
						});
						this.$forceUpdate();
					}
				}
			});
		},
		//打开拼团弹出框
		openPinTuan(groupId, pintuan_num, time, headimg, head_id) {
			if (this.memberId == head_id) {
				this.$util.showToast({
					title: "您不能参与自己的团"
				});
				return;
			}
			this.openPopup = true;
			this.currentPintuan = {
				groupId: groupId,
				pintuan_num: pintuan_num,
				timeMachine: this.$util.countDown(time),
				headimg: headimg
			};
			this.$refs.pintuanPopup.open(() => {
				this.goodsSkuDetail.group_id = 0;
				this.openPopup = false;
			});
		},
		closePinTuanPopup() {
			this.$refs.pintuanPopup.close();
		},
		//参与拼团
		joinPintuan() {
			this.closePinTuanPopup();
			this.goodsSkuDetail.group_id = this.currentPintuan.groupId;
			this.goodsSkuDetail.show_price = this.goodsSkuDetail.pintuan_price;
			this.goodsSkuDetail.save_price = (this.goodsSkuDetail.price - this.goodsSkuDetail.show_price) > 0 ? (this
				.goodsSkuDetail
				.price - this.goodsSkuDetail.show_price).toFixed(2) : 0;
			this.$forceUpdate();
			this.pintuan(false);
		},
		pintuanImageError(index) {
			this.pintuanList[index].headimg = this.$util.getDefaultImage().head;
			this.$forceUpdate();
		},
		// 重置价格
		resetPrice() {
			this.goodsSkuDetail.group_id = 0;
			this.goodsSkuDetail.show_price = this.goodsSkuDetail.promotion_price;
			this.goodsSkuDetail.save_price = (this.goodsSkuDetail.price - this.goodsSkuDetail.show_price) > 0 ? (this
				.goodsSkuDetail
				.price - this.goodsSkuDetail.show_price).toFixed(2) : 0;
			this.$forceUpdate();
		}
	}
}
