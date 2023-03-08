export default {
	data() {
		return {
			goodsRoute: '/pages_promotion/groupbuy/detail',
			posterApi: '/groupbuy/api/goods/poster',
			groupbuy_id: 0,
		}
	},
	onLoad(data) {
		this.skuId = data.sku_id || 0;
		this.groupbuy_id = data.groupbuy_id || 0;
		if (data.id) {
			this.groupbuy_id = data.id;
		}
		// 小程序扫码进入
		if (data.scene) {
			var sceneParams = decodeURIComponent(data.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('id') != -1) this.groupbuy_id = item.split('-')[1];
					if (item.indexOf('sku_id') != -1) this.skuId = item.split('-')[1];
				});
			}
		}
	},
	async onShow() {
		await this.getGoodsSkuDetail();
	},
	methods: {
		// 获取团购商品详情
		async getGoodsSkuDetail() {
			let res = await this.$api.sendRequest({
				url: '/groupbuy/api/goods/detail',
				async: false,
				data: {
					groupbuy_id: this.groupbuy_id
				}
			});
			let data = res.data;
			if (data.goods_sku_detail != null) {
				this.goodsSkuDetail = data.goods_sku_detail;
				if (this.skuId == 0) this.skuId = this.goodsSkuDetail.sku_id;

				//团购倒计时
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
				this.shareQuery = 'groupbuy_id=' + this.groupbuy_id + '&sku_id=' + this.skuId;
				this.shareUrl = this.goodsRoute + '?' + this.shareQuery;

				// 在线客服聊天参数
				this.chatRoomParams = {
					sku_id: this.goodsSkuDetail.sku_id,
					type: 'groupbuy',
					type_id: this.goodsSkuDetail.groupbuy_id
				};

				// 海报参数
				this.posterParams = {
					groupbuy_id: this.groupbuy_id
				};

				// 处理商品数据
				this.handleGoodsSkuData();

				this.goodsSkuDetail.show_price = this.goodsSkuDetail.groupbuy_price;
				this.goodsSkuDetail.save_price = (this.goodsSkuDetail.price - this.goodsSkuDetail.show_price) > 0 ?
					(this.goodsSkuDetail
						.price - this.goodsSkuDetail.show_price).toFixed(2) : 0;

				if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
			} else {
				this.$util.redirectTo('/pages_tool/goods/not_exist', {}, 'redirectTo');
			}
		},
		// 团购
		groupbuy() {
			if (!this.token) {
				if (this.source_member) {
					this.$refs.login.open(this.shareUrl + '&source_member=' + this.source_member);
				} else {
					this.$refs.login.open(this.shareUrl);
				}
				return;
			}
			this.$refs.goodsSku.show("groupbuy", () => {
				this.getCartCount();
			});
		},
	}
}
