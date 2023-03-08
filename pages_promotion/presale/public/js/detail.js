export default {
	data() {
		return {
			goodsRoute: '/pages_promotion/presale/detail',
			posterApi: '/presale/api/goods/poster',
			id: 0,
			groupId: 0,
		}
	},
	onLoad(data) {
		this.id = data.id || 0;
		this.skuId = data.sku_id || 0;
		// 小程序扫码进入
		if (data.scene) {
			var sceneParams = decodeURIComponent(data.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('id') != -1) this.id = item.split('-')[1];
				});
			}
		}
	},
	async onShow() {
		//同步获取商品详情
		await this.getGoodsSkuDetail();
	},
	methods: {
		// 获取预售商品详情
		async getGoodsSkuDetail() {
			let res = await this.$api.sendRequest({
				url: '/presale/api/goods/detail',
				async: false,
				data: {
					id: this.id,
					sku_id: this.skuId
				}
			});
			let data = res.data;
			if (data.goods_sku_detail != null) {
				this.goodsSkuDetail = data.goods_sku_detail;
				this.goodsSkuDetail.purchased_num = this.goodsSkuDetail.purchased_num ? this.goodsSkuDetail
					.purchased_num : 0;

				this.skuId = this.goodsSkuDetail.sku_id;
				this.goodsSkuDetail.group_id = this.groupId;

				//预售结束倒计时
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
				this.shareQuery = 'id=' + this.id;
				this.shareUrl = this.goodsRoute + '?' + this.shareQuery;

				// 在线客服聊天参数
				this.chatRoomParams = {
					sku_id: this.goodsSkuDetail.sku_id,
					type: 'presale',
					type_id: this.id
				};

				// 海报参数
				this.posterParams = {
					id: this.id
				};

				// 处理商品数据
				this.handleGoodsSkuData();

				this.goodsSkuDetail.show_price = this.goodsSkuDetail.goods_price;

				if (this.$refs.loadingCover) this.$refs.loadingCover.hide();

			} else {
				this.$util.redirectTo('/pages_tool/goods/not_exist', {}, 'redirectTo');
			}
		},
		// 预售下单
		presale() {
			if (!this.token) {
				if (this.source_member) {
					this.$refs.login.open(this.shareUrl + '&source_member=' + this.source_member);
				} else {
					this.$refs.login.open(this.shareUrl);
				}
				return;
			}
			this.$refs.goodsSku.show("presale", () => {
				this.getCartCount();
			});
		},
		// 去订单列表付尾款
		toOrderDetail() {
			this.$util.redirectTo('/pages_promotion/presale/order_list');
		},
	}
}
