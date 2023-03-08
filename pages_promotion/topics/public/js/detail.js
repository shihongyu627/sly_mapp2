export default {
	data() {
		return {
			goodsRoute: '/pages_promotion/topics/goods_detail',
			posterApi: '/topic/api/topicgoods/poster',
			topics_id: 0,
		}
	},
	onLoad(data) {
		this.topics_id = data.id || 0;
		// 小程序扫码进入
		if (data.scene) {
			var sceneParams = decodeURIComponent(data.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('id') != -1) this.topics_id = item.split('-')[1];
				});
			}
		}
	},
	onShow() {
		//同步获取商品详情
		this.getGoodsSkuDetail();
	},
	methods: {
		// 获取专题活动商品详情
		async getGoodsSkuDetail() {
			let res = await this.$api.sendRequest({
				url: '/topic/api/topicgoods/detail',
				async: false,
				data: {
					topic_id: this.topics_id
				}
			});
			let data = res.data;
			if (data.goods_sku_detail != null) {
				this.goodsSkuDetail = data.goods_sku_detail;
				this.skuId = this.goodsSkuDetail.sku_id;
				if (res.timestamp > this.goodsSkuDetail.end_time) {
					this.$util.showToast({
						title: "专题活动已结束",
					});
					setTimeout(() => {
						this.$util.redirectTo('/pages/goods/detail', {
							goods_id: this.goodsSkuDetail.goods_id
						}, 'redirectTo');
					}, 1000);
				} else {
					this.goodsSkuDetail.discountTimeMachine = this.$util.countDown(this.goodsSkuDetail.end_time -
						res.timestamp);
				}

				// 分享参数、链接
				this.shareQuery = 'id=' + this.topics_id;
				this.shareUrl = this.goodsRoute + '?' + this.shareQuery;

				// 在线客服聊天参数
				this.chatRoomParams = {
					sku_id: this.goodsSkuDetail.sku_id,
					type: 'topic',
					type_id: this.topics_id
				};

				// 海报参数
				this.posterParams = {
					id: this.topics_id
				};

				// 处理商品数据
				this.handleGoodsSkuData();

				this.goodsSkuDetail.show_price = this.goodsSkuDetail.topic_price;
				this.goodsSkuDetail.save_price = (this.goodsSkuDetail.price - this.goodsSkuDetail.show_price) > 0 ?
					(this.goodsSkuDetail
						.price - this.goodsSkuDetail.show_price).toFixed(2) : 0;

				if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
			} else {
				this.$util.redirectTo('/pages_tool/goods/not_exist', {}, 'redirectTo');
			}
		},
		// 立即购买
		topic() {
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open(this.shareUrl);
				return;
			}
			this.$refs.goodsSku.show("topic", () => {
				this.getCartCount();
			});
		}
	}
}
