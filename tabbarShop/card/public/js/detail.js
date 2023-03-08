import htmlParser from '@/common/js/html-parser';
import {
	Weixin
} from '@/common/js/wx-jssdk.js';

export default {
	data() {
		return {
			skuId: 0,
			// 商品详情
			goodsSkuDetail: {},
			token: "",
			isIphoneX: false, //判断手机是否是iphoneX以上
			poster: "-1", //海报
			posterMsg: "", //海报错误信息
			posterHeight: 0,
			memberId: 0,
			contactData: {
				title: '',
				path: '',
				img: ''
			},

			detailTab: 0,
			service: null,
			//是否开启预览，0：不开启，1：开启
			preview: 0,
			// 是否可分享到好物圈
			goodsCircle: false,
			levelInfo: {},
			showFenxiao: 0,
			evaluateConfig: {
				evaluate_audit: 1,
				evaluate_show: 0,
				evaluate_status: 1
			}
		}
	},
	computed: {},
	onLoad(data) {
		this.skuId = data.subcard_id || 0;
		this.preview = data.preview || 0;
		this.title = data.title || 0;
		if (data.title) {
			this.$langConfig.title(data.title || '');
		}
		this.isIphoneX = this.$util.uniappIsIPhoneX()
		if (data.source_member) uni.setStorageSync('source_member', data.source_member);
		// 小程序扫码进入
		if (data.scene) {
			var sceneParams = decodeURIComponent(data.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('sku_id') != -1) this.skuId = item.split('-')[1];
					if (item.indexOf('source_member') != -1) uni.setStorageSync('source_member', item.split(
						'-')[1]);
				});
			}
		}
		// this.getService();
	},

	async onShow() {

		// 刷新多语言
		this.$langConfig.refresh();

		//登录后查询
		this.token = uni.getStorageSync('token');

		if (this.token != '' && this.preview == 0) {}

		this.getKekuConfig();
		//同步获取商品详情
		await this.getGoodsSkuDetail();
	},
	onHide() {
		this.couponBtnSwitch = false;
	},
	async created() {},
	methods: {
		//联系客服
		goConnect() {
			let that = this;
			if (uni.getStorageSync('token')) {
				let data = {
					skuId: that.goodsSkuDetail.sku_id
				}
				// #ifdef MP
				if (this.kefuConfig.system == 1) {
					that.$util.redirectTo('/otherpages/chat/room/room', data)
					return false;
				}
				// #endif
				// #ifndef MP
				if (this.kefuConfig.open == 1) {
					that.$util.redirectTo('/otherpages/webview/webview', {
						link: encodeURIComponent(this.kefuConfig.open_url)
					})
					return false;
				}
				if (this.kefuConfig.system == 1) {
					that.$util.redirectTo('/otherpages/chat/room/room', data)
					return false;
				}
				// #endif

			} else {
				this.$refs.login.open('/tabbarShop/card/info/info?subcard_id=' + that.goodsSkuDetail.subcard_id);
				return;
			}
		},

		// 获取商品详情
		async getGoodsSkuDetail(skuId) {
			this.skuId = skuId || this.skuId;
			let res = await this.$api.sendRequest({
				url: '/subcard/api/subcard/detail',
				async: false,
				data: {
					subcard_id: this.skuId,
				}
			});
			let data = res.data;
			let sku_images = []
			if (data.card_cover) {
				sku_images.push(this.loadimg(data.card_cover))
			}
			data.sku_images = sku_images
			this.goodsSkuDetail = data || {}
			if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
			console.log(data, 9999);
		},
		loadimg(imgStr) {
			return this.$util.loadimg(imgStr)
		},
		goHome() {
			this.$util.redirectTo('/pages/index/index', {}, 'reLaunch');
		},
		// 立即购买
		buyNow() {
			if (!uni.getStorageSync('token') && this.preview == 0) {
				this.$refs.login.open('/tabbarShop/card/info/info?subcard_id=' + this.skuId);
				return;
			}
			this.$util.redirectTo('/tabbarShop/card/payment/payment', {
				subcard_id: this.skuId
			});
		},
		swiperChange(e) {
			this.swiperCurrent = e.detail.current + 1;
		},
		// 预览评价图片
		previewEvaluate(index, field) {
			var paths = [];
			for (let i = 0; i < this.goodsEvaluate[field].length; i++) {
				paths.push(this.$util.img(this.goodsEvaluate[field][i]));
			}
			uni.previewImage({
				current: index,
				urls: paths,
			});
		},
		//-------------------------------------分享-------------------------------------
		// 打开分享弹出层
		openSharePopup() {
			console.log(222, '分享');
			this.$refs.sharePopup.open();
		},
		// 关闭分享弹出层
		closeSharePopup() {
			this.$refs.sharePopup.close();
		},
		//-------------------------------------海报-------------------------------------

		// 打开海报弹出层
		openPosterPopup() {
			this.getGoodsPoster();
			this.$refs.sharePopup.close();
			this.$refs.posterPopup.open();
			if (this.poster != '-1') {
				setTimeout(() => {
					let view = uni.createSelectorQuery().in(this).select(".poster-layer .image-wrap");
					view.fields({
						size: true,
					}, data => {
						let posterWhith = data.width;
						let ratio = parseFloat((740 / posterWhith).toFixed(2));
						if (this.token != '') {
							this.posterHeight = parseInt(1120 / ratio);
						} else {
							this.posterHeight = parseInt(1100 / ratio);
						}
					}).exec();
				}, 100);
			}
		},
		// 关闭海报弹出层
		closePosterPopup() {
			this.$refs.posterPopup.close();
		},
		//生成海报
		getGoodsPoster() {
			//活动海报信息
			let qrcode_param = {
				sku_id: this.skuId
			};
			if (this.memberId) qrcode_param.source_member = this.memberId;
			this.$api.sendRequest({
				url: "/api/goods/poster",
				data: {
					page: '/pages/goods/detail/detail',
					qrcode_param: JSON.stringify(qrcode_param)
				},
				success: res => {
					if (res.code == 0) {
						this.poster = res.data.path + "?time=" + new Date().getTime();
					} else {
						this.posterMsg = res.message;
					}
				}
			});
		},
		// 预览图片
		previewMedia(index) {
			var paths = [];
			for (let i = 0; i < this.goodsSkuDetail.sku_images.length; i++) {
				paths.push(this.$util.img(this.goodsSkuDetail.sku_images[i], {
					size: 'big'
				}));
			}
			uni.previewImage({
				current: index,
				urls: paths,
				// longPressActions: {
				// 	itemList: ['发送给朋友', '保存图片', '关注'],
				// 	success: function(data) {
				// 		console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
				// 	},
				// 	fail: function(err) {
				// 		console.log(err.errMsg);
				// 	}
				// }
			});
		},
		//小程序中保存海报
		saveGoodsPoster() {

			let url = this.$util.img(this.poster);
			// this.$util.showToast({
			// 	title: "saveGoodsPoster:"+ url
			// });
			uni.downloadFile({
				url: url,
				success: (res) => {
					if (res.statusCode === 200) {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								this.$util.showToast({
									title: "保存成功"
								});
							},
							fail: () => {
								this.$util.showToast({
									title: "保存失败，请稍后重试"
								});
							}
						});
					}
				},

				fail: (e) => {
					// this.$util.showToast({
					// 	title: "fail:" + JSON.stringify(e)
					// });
				}
			});
		},
		getKekuConfig() {
			this.$api.sendRequest({
				url: '/api/config/servicer',
				success: res => {
					if (res.code == 0) {
						this.kefuConfig = res.data;
						if (this.kefuConfig.system && !this.addonIsExit.servicer) this.kefuConfig.system =
							0;
					}
				}
			});
		},
	}
}
