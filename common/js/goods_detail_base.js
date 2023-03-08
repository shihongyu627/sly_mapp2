// 商品详情业务
import htmlParser from '@/common/js/html-parser';
export default {
	data() {
		return {
			skuId: 0,
			goodsId: 0,
			// 商品详情
			goodsSkuDetail: {
				goods_id: 0,
				goods_service: []
			},
			preview: 0, //是否开启预览，0：不开启，1：开启
			token: "",
			//评价
			contactData: {
				title: '',
				path: '',
				img: ''
			},

			shareQuery: '', // 分享参数
			shareUrl: '', // 分享链接

			source_member: 0, //分享人的id
			chatRoomParams: {}, // 联系客服参数
			isIphoneX: false, //判断手机是否是iphoneX以上
			// cartCount: 0, // 购物车商品数量
			whetherCollection: 0,
			memberId: 0,
			posterParams: {}, //海报所需参数
			shareImg: '',
			deliveryType: null
		}
	},
	onLoad(data) {
		this.preview = data.preview || 0;
		this.token = uni.getStorageSync('token');
		this.isIphoneX = this.$util.uniappIsIPhoneX();

		if (data.source_member) {
			uni.setStorageSync('source_member', data.source_member);
			this.source_member = data.source_member;
		}
		//记录分享关系
		if (this.token && uni.getStorageSync('source_member')) {
			this.$util.onSourceMember(uni.getStorageSync('source_member'));
		}

		// 小程序扫码进入
		if (data.scene) {
			var sceneParams = decodeURIComponent(data.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('m') != -1) uni.setStorageSync('source_member', item.split('-')[1]);
					if (item.indexOf('is_test') != -1) uni.setStorageSync('is_test', 1);
				});
			}
		}
	},
	computed: {
		cartCount() {
			return this.$store.state.cartNumber;
		},
	},
	onShow() {
		if (this.token) {
			this.getCartCount();

			this.$util.getMemberId().then(resolve => {
				this.memberId = resolve;
			});
		}
	},
	watch: {
		memberId: function() {
			if (this.goodsSkuDetail.goods_id) this.setPublicShare();
		}
	},
	methods: {
		// 处理商品详情数据
		handleGoodsSkuData() {
			this.$langConfig.title(this.goodsSkuDetail.goods_name);

			this.modifyGoodsInfo();
			this.getWhetherCollection();

			// 初始化商品详情视图数据
			this.$refs.goodsDetailView.init({
				sku_id: this.skuId,
				goods_id: this.goodsSkuDetail.goods_id,
				preview: this.preview,
				source_member: this.source_member,
				posterParams: this.posterParams,
				posterApi: this.posterApi,
				shareUrl: this.shareUrl,
				memberId: this.memberId,
				goodsRoute: this.goodsRoute
			});

			//媒体
			if (this.goodsSkuDetail.video_url) this.switchMedia = "video";

			if (!Array.isArray(this.goodsSkuDetail.sku_images)) {
				if (this.goodsSkuDetail.sku_images) this.goodsSkuDetail.sku_images = this.goodsSkuDetail.sku_images
					.split(",");
				else this.goodsSkuDetail.sku_images = [];
			}

			// 多规格时合并主图
			if (this.goodsSkuDetail.goods_spec_format && this.goodsSkuDetail.goods_image) {

				if (!Array.isArray(this.goodsSkuDetail.goods_image)) this.goodsSkuDetail.goods_image = this
					.goodsSkuDetail.goods_image.split(",");

				this.goodsSkuDetail.sku_images = this.goodsSkuDetail
					.goods_image.concat(this.goodsSkuDetail.sku_images);
			}

			this.goodsSkuDetail.unit = this.goodsSkuDetail.unit || "件";

			// 当前商品SKU规格
			if (this.goodsSkuDetail.sku_spec_format) this.goodsSkuDetail.sku_spec_format = JSON.parse(this
				.goodsSkuDetail.sku_spec_format);

			// 商品属性
			if (this.goodsSkuDetail.goods_attr_format) {
				let goods_attr_format = JSON.parse(this.goodsSkuDetail.goods_attr_format);
				this.goodsSkuDetail.goods_attr_format = this.$util.unique(goods_attr_format, "attr_id");
				for (var i = 0; i < this.goodsSkuDetail.goods_attr_format.length; i++) {
					for (var j = 0; j < goods_attr_format.length; j++) {
						if (this.goodsSkuDetail.goods_attr_format[i].attr_id == goods_attr_format[j].attr_id &&
							this.goodsSkuDetail.goods_attr_format[
								i].attr_value_id != goods_attr_format[j].attr_value_id) {
							this.goodsSkuDetail.goods_attr_format[i].attr_value_name += "、" + goods_attr_format[
								j].attr_value_name;
						}
					}
				}
			}

			// 商品SKU格式
			if (this.goodsSkuDetail.goods_spec_format) this.goodsSkuDetail.goods_spec_format = JSON.parse(this
				.goodsSkuDetail.goods_spec_format);

			// // 商品详情
			// if (this.goodsSkuDetail.goods_content) this.goodsSkuDetail.goods_content = htmlParser(this
			// 	.goodsSkuDetail.goods_content);

			//商品服务
			if (this.goodsSkuDetail.goods_service) {
				for (let i in this.goodsSkuDetail.goods_service) {
					this.goodsSkuDetail.goods_service[i]['icon'] = this.goodsSkuDetail.goods_service[i]['icon'] ? JSON
						.parse(this.goodsSkuDetail.goods_service[i]['icon']) : '';
				}
			}

			this.contactData = {
				title: this.goodsSkuDetail.sku_name,
				path: this.shareUrl,
				img: this.$util.img(this.goodsSkuDetail.sku_image, {
					size: 'big'
				})
			}
			if (this.$refs.goodsPromotion) this.$refs.goodsPromotion.refresh(this.goodsSkuDetail
				.goods_promotion);

			if (this.goodsRoute != '/pages/goods/detail') this.setPublicShare();

			this.getBarrageData();
			this.getGoodsForm();
			if (this.goodsSkuDetail.is_virtual == 0) this.getEnabledExpressType();
		},
		/**
		 * 刷新商品详情数据
		 * @param {Object} goodsSkuDetail
		 */
		refreshGoodsSkuDetail(data) {
			this.goodsSkuDetail = Object.assign({}, this.goodsSkuDetail, data);
			if (this.$refs.goodsPromotion) this.$refs.goodsPromotion.refresh(this.goodsSkuDetail.goods_promotion);
			if (this.$refs.goodsDetailView) {

				// 初始化商品详情视图数据
				this.goodsSkuDetail.unit = this.goodsSkuDetail.unit || "件";

				// 解决轮播图数量不一致时，切换到第一个
				if (this.swiperCurrent > this.goodsSkuDetail.sku_images.length) {
					this.swiperAutoplay = true;
					this.swiperCurrent = 1;
					setTimeout(() => {
						this.swiperAutoplay = false;
					}, 40);
				}

			}
			this.$langConfig.title(this.goodsSkuDetail.sku_name);

		},
		goodsDetailViewInit() {
			// 初始化商品详情视图数据
			this.$refs.goodsDetailView.init({
				sku_id: this.skuId,
				goods_id: this.goodsSkuDetail.goods_id,
				preview: this.preview,
				source_member: this.source_member,
				posterParams: this.posterParams,
				posterApi: this.posterApi,
				shareUrl: this.shareUrl,
				memberId: this.memberId,
				goodsRoute: this.goodsRoute
			});
		},
		goHome() {
			if (this.preview) return; // 开启预览，禁止任何操作和跳转
			this.$util.redirectTo('/pages/index/index', {}, 'reLaunch');
		},
		goCart() {
			if (this.preview) return; // 开启预览，禁止任何操作和跳转
			this.$util.redirectTo('/pages/goods/cart', {}, 'reLaunch');
		},
		//获取购物车数量
		getCartCount() {
			this.$store.dispatch('getCartNumber');
		},

		//-------------------------------------关注-------------------------------------
		//更新商品信息
		modifyGoodsInfo() {
			if (this.preview) return; // 开启预览，禁止任何操作和跳转
			//更新商品点击量
			this.$api.sendRequest({
				url: "/api/goods/modifyclicks",
				data: {
					sku_id: this.skuId
				},
				success: res => {}
			});

			//添加足迹
			this.$api.sendRequest({
				url: "/api/goodsbrowse/add",
				data: {
					goods_id: this.goodsSkuDetail.goods_id,
					sku_id: this.skuId
				},
				success: res => {}
			});
		},
		//-------------------------------------关注-------------------------------------

		//获取用户是否关注
		getWhetherCollection() {
			this.$api.sendRequest({
				url: "/api/goodscollect/iscollect",
				data: {
					goods_id: this.goodsSkuDetail.goods_id
				},
				success: res => {
					this.whetherCollection = res.data;
				}
			});
		},
		editCollection() {
			if (this.$refs.goodsDetailView) {
				this.whetherCollection = this.$refs.goodsDetailView.collection();
			}
		},
		openSharePopup() {
			console.log(123);
			if (this.$refs.goodsDetailView) {
				this.$refs.goodsDetailView.openSharePopup();
			}
		},
		getMemberId() {
			this.$api.sendRequest({
				url: "/api/member/id",
				success: res => {
					if (res.code >= 0) {
						this.memberId = res.data;
					}
				}
			});
		},

		//弹幕
		getBarrageData() {
			this.$api.sendRequest({
				url: '/api/goods/goodsbarrage',
				data: {
					goods_id: this.goodsSkuDetail.goods_id
				},
				success: res => {
					if (res.code == 0 && res.data) {
						let barrageData = [];
						for (let i in res.data.list) {
							if (res.data.list[i]['title']) {
								let title = res.data.list[i]['title'].substr(0, 1) + '*' + res.data.list[i][
									'title'
								].substr(res.data.list[i]['title'].length - 1, 1)
								barrageData.push({
									'img': res.data.list[i]['img'] ? res.data.list[i]['img'] : this
										.$util.getDefaultImage().head,
									'title': title + '已下单'
								});
							}
						}
						this.goodsSkuDetail.barrageData = barrageData;
					}
				}
			});
		},
		/**
		 * 设置公众号分享
		 */
		setPublicShare() {
			let shareUrl = this.$config.h5Domain + this.shareUrl;
			if (this.memberId) shareUrl += '&source_member=' + this.memberId;

			this.$util.setPublicShare({
				title: this.goodsSkuDetail.goods_name,
				desc: '',
				link: shareUrl,
				imgUrl: typeof this.goodsSkuDetail.goods_image == 'object' ? this.goodsSkuDetail.goods_image[
					0] : this.goodsSkuDetail.goods_image.split(',')[0]
			})
		},
		/**
		 * 获取商品表单
		 */
		getGoodsForm() {
			this.$api.sendRequest({
				url: "/form/api/form/goodsform",
				data: {
					goods_id: this.goodsSkuDetail.goods_id
				},
				success: res => {
					if (res.code == 0 && res.data) this.$set(this.goodsSkuDetail, 'goods_form', res.data);
				}
			});
		},
		/**
		 * 查询启用的配送方式
		 */
		getEnabledExpressType(){
			this.$api.sendRequest({
				url: "/api/config/enabledexpresstype",
				success: res => {
					if (res.code == 0 && res.data) this.deliveryType = res.data;
				}
			});
		}
	},
	/**
	 * 自定义分享内容
	 * @param {Object} res
	 */
	onShareAppMessage(res) {
		var path = this.shareUrl;
		if (this.memberId) path += '&source_member=' + this.memberId;
		console.log(path);
		return {
			title: this.goodsSkuDetail.sku_name,
			imageUrl: this.shareImg ? this.$util.img(this.shareImg) : this.$util.img(this.goodsSkuDetail.sku_image, {
				size: 'big'
			}),
			path: path,
			success: res => {},
			fail: res => {}
		};
	},
	// 分享到微信朋友圈
	// #ifdef MP-WEIXIN
	onShareTimeline() {
		let query = this.shareQuery;
		if (this.memberId) query += '&source_member=' + this.memberId;
		return {
			title: this.goodsSkuDetail.sku_name,
			query: query,
			imageUrl: this.$util.img(this.goodsSkuDetail.sku_image, {
				size: 'big'
			})
		};
	}
	// #endif
}
