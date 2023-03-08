export default {
	data() {
		return {
			goodsRoute: '/pages_promotion/seckill/detail',
			posterApi: '/seckill/api/seckillgoods/poster',
			seckill_id: 0,
		}
	},
	onLoad(data) {
		this.seckill_id = data.seckill_id || 0;
		if (data.id) {
			this.seckill_id = data.id;
		}
		// 小程序扫码进入
		if (data.scene) {
			var sceneParams = decodeURIComponent(data.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('id') != -1) this.seckill_id = item.split('-')[1];
				});
			}
		}
	},
	onShow() {
		//同步获取商品详情
		this.getGoodsSkuDetail();
	},
	methods: {
		// 获取秒杀商品详情
		async getGoodsSkuDetail() {
			let res = await this.$api.sendRequest({
				url: '/seckill/api/seckillgoods/detail',
				async: false,
				data: {
					seckill_id: this.seckill_id
				},
			});

			let data = res.data;
			if (data.goods_sku_detail != null) {
				this.goodsSkuDetail = data.goods_sku_detail;
				this.shopInfo = data.shop_info;
				this.skuId = this.goodsSkuDetail.sku_id;

				let time = new Date(res.timestamp * 1000);
				let currentTime = time.getHours() * 60 * 60 + time.getMinutes() * 60 + time.getSeconds();
				if (this.goodsSkuDetail.seckill_start_time <= currentTime && currentTime < this.goodsSkuDetail
					.seckill_end_time) {
					this.goodsSkuDetail.discountTimeMachine = this.$util.countDown(this.goodsSkuDetail
						.seckill_end_time - currentTime);
				} else if (this.goodsSkuDetail.seckill_start_time > currentTime && currentTime < this.goodsSkuDetail
					.seckill_end_time) {
					this.$util.showToast({
						title: "限时秒杀活动还未开始",
					});
					setTimeout(() => {
						this.$util.redirectTo('/pages/goods/detail', {
							goods_id: this.goodsSkuDetail.goods_id
						}, 'redirectTo');
					}, 1000);
				} else if (currentTime < this.goodsSkuDetail.seckill_start_time && currentTime > this.goodsSkuDetail
					.seckill_end_time) {
					this.$util.showToast({
						title: "限时秒杀活动已结束",
					});
					setTimeout(() => {
						this.$util.redirectTo('/pages/goods/detail', {
							goods_id: this.goodsSkuDetail.goods_id
						}, 'redirectTo');
					}, 1000);
				}

				// 分享参数、链接
				this.shareQuery = 'seckill_id=' + this.seckill_id
				this.shareUrl = this.goodsRoute + '?' + this.shareQuery;

				// 在线客服聊天参数
				this.chatRoomParams = {
					sku_id: this.goodsSkuDetail.sku_id,
					type: 'seckill',
					type_id: this.goodsSkuDetail.seckill_id
				};

				// 海报参数
				this.posterParams = {
					id: this.goodsSkuDetail.goods_id
				};
				
				// #ifdef MP-WEIXIN
				this.getShareImg();
				// #endif

				// 处理商品数据
				this.handleGoodsSkuData();

				this.goodsSkuDetail.show_price = this.goodsSkuDetail.seckill_price;
				this.goodsSkuDetail.save_price = (this.goodsSkuDetail.price - this.goodsSkuDetail.seckill_price) >
					0 ? (this.goodsSkuDetail
						.price - this.goodsSkuDetail.seckill_price).toFixed(2) : 0;

				if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
			} else {
				this.$util.redirectTo('/pages_tool/goods/not_exist', {}, 'redirectTo');
			}
		},
		// 秒杀
		seckill() {
			if (!uni.getStorageSync('token')) {
				if (!this.source_member) {
					this.$refs.login.open(this.shareUrl);
				} else {
					this.$refs.login.open(this.shareUrl + '&source_member=' + this.source_member);
				}
				return;
			}
			this.$refs.goodsSku.show("seckill", () => {
				this.getCartCount();
			});
		},
		/**
		 * 获取分享图
		 */
		getShareImg(){
			let posterParams = {
				id: this.goodsSkuDetail.goods_id
			};
			this.$api.sendRequest({
				url: '/seckill/api/seckillgoods/shareimg',
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
