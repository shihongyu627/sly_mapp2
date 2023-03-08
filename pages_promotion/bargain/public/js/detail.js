import htmlParser from '@/common/js/html-parser';
export default {
	data() {
		return {
			windowHeight: 0,
			launch_id: 0,
			bargain_id: 0,
			info: {
				headimg: ''
			},
			bargainRecord: [],
			page: 1,
			totalPage: 1,
			load: false,
			timeMachine: null,
			memberId: 0,
			bargainMoney: '0.00',
			token: null,
			poster: '-1', //海报
			posterMsg: '', //海报错误信息
			posterHeight: 0,
			goodsDetail: null,
			launchInfo: null,
			maxBuy: 1,
			launchList: null,
			fixBtnShow: false,
			showMore: false,
			isOwn: 0, //是否自己砍了一刀
			my_bargain_money: 0,
			shareImg: ''
		};
	},
	onLoad(data) {
		this.getHeight();
		if (data.l_id) this.launch_id = data.l_id;
		if (data.b_id) this.bargain_id = data.b_id;
		if (data.is_own) this.isOwn = data.is_own;

		if (data.scene) {
			var sceneParams = decodeURIComponent(data.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('m') != -1) uni.setStorageSync('source_member', item.split('-')[1]);
					if (item.indexOf('l_id') != -1) this.id = item.split('-')[1];
					if (item.indexOf('b_id') != -1) this.bargain_id = item.split('-')[1];
					if (item.indexOf('is_own') != -1) this.isOwn = item.split('-')[1];
				});
			}
		}
		// #ifdef MP-WEIXIN
		this.getShareImg();
		// #endif
	},
	computed: {
		progress() {
			if (this.launchInfo && this.goodsDetail) {
				let total = this.goodsDetail.price - this.launchInfo.floor_price,
					progress = parseInt(((this.goodsDetail.price - this.launchInfo.curr_price) / total) * 100);

				return isNaN(progress) ? 0 : progress;
			} else {
				return 0;
			}
		},
		showNum() {
			if (this.launchList && this.launchList.length < 3) {
				return this.launchList.length;
			} else {
				return 3;
			}
		}
	},
	onShow() {
		this.getBargainInfo();
		if (uni.getStorageSync('token')) {
			this.$util.getMemberId().then(resolve => {
				this.memberId = resolve;
				this.token = uni.getStorageSync('token');
				if (this.goodsDetail && this.goodsDetail.launch_id) this.setPublicShare();
			});
		}

		setTimeout(() => {
			if (this.addonIsExist && !this.addonIsExist.bargain) {
				this.$util.showToast({
					title: '商家未开启砍价',
					mask: true,
					duration: 2000
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
				}, 2000);
				return;
			}
		}, 1000);
	},
	onReady() {},
	methods: {
		getHeight() {
			var self = this;
			uni.getSystemInfo({
				success: function(res) {
					self.windowHeight = res.windowHeight - 44;
					if (self.iphoneX) {
						self.windowHeight = self.windowHeight - 33;
					}
				}
			});
		},
		getBargainInfo() {
			this.$api.sendRequest({
				url: '/bargain/api/bargain/detail',
				data: {
					launch_id: this.launch_id,
					bargain_id: this.bargain_id
				},
				success: res => {
					if (res.code == 0) {
						this.goodsDetail = res.data.goods_sku_detail;
						if (this.goodsDetail.sku_spec_format) this.goodsDetail.sku_spec_format = JSON.parse(
							this.goodsDetail.sku_spec_format);

						this.$langConfig.title(this.goodsDetail.sku_name);

						// 商品SKU格式
						if (this.goodsDetail.goods_spec_format) this.goodsDetail.goods_spec_format = JSON
							.parse(this.goodsDetail.goods_spec_format);

						if (this.goodsDetail.goods_content) this.goodsDetail.goods_content = htmlParser(this
							.goodsDetail.goods_content);

						if (res.data.launch_info && Object.keys(res.data.launch_info).length > 0) {
							this.launchInfo = res.data.launch_info;
							if (this.launchInfo.status == 0) {
								this.timeMachine = this.$util.countDown(this.launchInfo.end_time - res
									.timestamp);
							}
							this.launch_id = this.launchInfo.launch_id;
						}
						if (res.data.launch_list && Object.keys(res.data.launch_list).length > 0) {
							this.launchList = res.data.launch_list;
						}

						//发起拼团后自砍一刀展示
						if (this.isOwn && this.goodsDetail.is_own > 0 && this.launchInfo && this.launchInfo
							.self && this.launchInfo.my_bargain_money) {
							this.my_bargain_money = this.launchInfo.my_bargain_money;
							this.$refs.uniSelfBargainPopup.open();
						}

						//好友进来后帮砍弹出
						if (this.launchInfo && !this.launchInfo.self && !this.launchInfo.cut && this
							.goodsDetail.bargain_status == 1) this.$refs.uniHelpPopup.open();

						this.getBargainRecord(1);
						this.setPublicShare();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					} else {
						this.$util.redirectTo('/pages_promotion/bargain/my_bargain');
					}
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		getBargainRecord(page) {
			if (this.load) return;

			if (!this.launchInfo) return;

			this.load = true;

			this.$api.sendRequest({
				url: '/bargain/api/bargain/record',
				data: {
					page: page,
					id: this.launchInfo.launch_id
				},
				success: res => {
					this.load = false;
					this.totalPage = res.data.page_count;
					this.page = page;
					if (res.code == 0 && res.data.list.length) {
						if (page == 1) {
							this.bargainRecord = res.data.list;
						} else {
							this.bargainRecord = this.bargainRecord.concat(res.data.list);
						}
					}
					this.showMore = false;
					if (page < this.totalPage) {
						this.showMore = true;
					}
				}
			});
		},
		scrolltolower() {
			let next = this.page + 1;
			if (!this.load && next <= this.totalPage) {
				this.getBargainRecord(next);
			}
		},
		browse() {
			this.$api.sendRequest({
				url: '/bargain/api/bargain/browse',
				data: {
					bargain_id: this.goodsDetail.bargain_id
				},
				success: res => {}
			});
		},
		share() {
			this.$api.sendRequest({
				url: '/bargain/api/bargain/share',
				data: {
					bargain_id: this.goodsDetail.bargain_id
				},
				success: res => {}
			});
		},
		/**
		 * 刷新商品详情数据
		 * @param {Object} goodsSkuDetail
		 */
		refreshGoodsSkuDetail(goodsSkuDetail) {
			Object.assign(this.goodsDetail, goodsSkuDetail);
		},

		// 发起砍价
		createBargain() {
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open('/pages_promotion/bargain/detail?l_id=' + this.launch_id + '&b_id=' + this
					.bargain_id);
				return;
			}

			// #ifdef MP-WEIXIN
			this.$util.subscribeMessage('BARGAIN_COMPLETE');
			// #endif

			if (this.goodsDetail.sku_spec_format) {
				this.$refs.goodsSku.show('bargain', () => {});
			} else {
				this.$api.sendRequest({
					url: '/bargain/api/bargain/launch',
					data: {
						id: this.goodsDetail.id
					},
					success: res => {
						if (res.code == 0) {
							let params = {
								l_id: res.data,
								b_id: this.bargain_id
							};
							if (this.goodsDetail.is_own) params.is_own = 1;

							this.$util.redirectTo('/pages_promotion/bargain/detail', params, 'redirectTo');
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			}
		},
		/**
		 * 立即购买
		 */
		buyNow() {
			uni.setStorage({
				key: 'bargainOrderCreateData',
				data: {
					launch_id: this.launchInfo.launch_id
				},
				success: () => {
					this.$util.redirectTo('/pages_promotion/bargain/payment');
				}
			});
		},
		/**
		 * 帮好友砍价
		 */
		bargain() {
			if (uni.getStorageSync('token')) {
				this.$api.sendRequest({
					url: '/bargain/api/bargain/bargain',
					data: {
						id: this.launchInfo.launch_id
					},
					success: res => {
						if (res.code == 0) {
							this.bargainMoney = parseFloat(res.data.bargain_money).toFixed(2);
							this.$refs.uniHelpPopup.close();
							this.$refs.uniPopup.open();
							this.getBargainInfo();
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			} else {
				this.$refs.login.open('/pages_promotion/bargain/detail?l_id=' + this.launch_id + '&b_id=' + this
					.bargain_id);
			}
		},
		closePopup() {
			this.$refs.uniPopup.close();
		},
		closeSelfPop() {
			this.$refs.uniSelfBargainPopup.close();
		},
		// 打开分享弹出层
		openSharePopup() {
			this.$refs.uniSelfBargainPopup.close();
			this.$refs.sharePopup.open();
			this.share();
		},
		// 关闭分享弹出层
		closeSharePopup() {
			this.$refs.sharePopup.close();
		},
		copyUrl() {
			let text = '嘿！朋友就差你这一刀了，帮一下忙呗~' + this.$config.h5Domain + '/pages_promotion/bargain/detail?l_id=' + this
				.launch_id + '&b_id=' + this.bargain_id;
			if (this.memberId) text += '&source_member=' + this.memberId;
			this.$util.copy(text, () => {
				this.closeSharePopup();
			});
		},
		toBargainRecode() {
			let view = uni.createSelectorQuery().select('.bargin_introduction');
			view.boundingClientRect(data => {
				uni.pageScrollTo({
					duration: 100,
					scrollTop: data.top + 100
				});
			}).exec();
		},
		/**
		 * 设置公众号分享
		 */
		setPublicShare() {
			let shareUrl = this.$config.h5Domain + '/pages_promotion/bargain/detail?l_id=' + this.launch_id + '&b_id=' +
				this.bargain_id;
			if (this.memberId) shareUrl += '&source_member=' + this.memberId;

			this.$util.setPublicShare({
					title: this.goodsDetail.sku_name,
					desc: '嘿！朋友就差你这一刀了，帮一下忙呗~',
					link: shareUrl,
					imgUrl: this.goodsDetail.sku_image
				},
				res => {
					// console.log('公众号分享成功');
					// this.share();
				}
			);
		},
		//-------------------------------------海报-------------------------------------
		// 打开海报弹出层
		openPosterPopup() {
			this.getGoodsPoster();
			this.$refs.sharePopup.close();
			this.$refs.posterPopup.open();
			if (this.poster != '-1') {
				setTimeout(() => {
					let view = uni
						.createSelectorQuery()
						.in(this)
						.select('.poster-layer .image-wrap');
					view.fields({
							size: true
						},
						data => {
							let posterWhith = data.width;
							let ratio = parseFloat((740 / posterWhith).toFixed(2));
							if (this.token != '') {
								this.posterHeight = parseInt(1240 / ratio);
							} else {
								this.posterHeight = parseInt(1100 / ratio);
							}
						}
					).exec();
				}, 100);
			}
		},
		// 关闭海报弹出层
		closePosterPopup() {
			this.$refs.posterPopup.close();
		},
		/**
		 * 获取海报
		 */
		getGoodsPoster() {
			uni.showLoading({
				title: '海报生成中...'
			});
			//活动海报信息
			let posterParams = {
				l_id: this.launch_id,
				b_id: this.bargain_id,
				bargain_id: this.goodsDetail.bargain_id
			};

			if (this.memberId) posterParams.source_member = this.memberId;

			this.$api.sendRequest({
				url: '/bargain/api/goods/poster',
				data: {
					page: '/pages_promotion/bargain/detail',
					qrcode_param: JSON.stringify(posterParams)
				},
				success: res => {
					if (res.code == 0) {
						this.poster = res.data.path + '?time=' + new Date().getTime();
					} else {
						this.posterMsg = res.message;
					}
					uni.hideLoading();
				},
				fail: err => {
					uni.hideLoading();
				}
			});
		},
		getNewArray(array, subGroupLength) {
			if (array) {
				let index = 0;
				let newArray = [];
				while (index < array.length) {
					newArray.push(array.slice(index, (index += subGroupLength)));
				}
				return newArray;
			}
		},
		toDetail(goods_id) {
			this.$util.redirectTo('/pages/goods/detail', {
				goods_id: goods_id
			});
		},
		/**
		 * 获取分享图
		 */
		getShareImg() {
			let posterParams = {
				l_id: this.launch_id,
				b_id: this.bargain_id,
				bargain_id: this.bargain_id
			};

			this.$api.sendRequest({
				url: '/bargain/api/goods/shareimg',
				data: {
					page: '/pages_promotion/bargain/launch',
					qrcode_param: JSON.stringify(posterParams)
				},
				success: res => {
					if (res.code == 0) this.shareImg = res.data.path;
				}
			});
		}
	},
	filters: {
		/**
		 * 字符掩饰输出
		 * @param {Object} str
		 */
		cover(str) {
			if (typeof str == 'string' && str.length > 0) {
				return str.substr(0, 1) + '******' + str.substr(-1);
			} else {
				return '';
			}
		}
	},
	/**
	 * 自定义分享内容
	 */
	onShareAppMessage() {
		let that = this;
		var path = '/pages_promotion/bargain/detail?l_id=' + this.launch_id + '&b_id=' + this.bargain_id;
		if (this.memberId) path += '&source_member=' + this.memberId;
		that.share();
		return {
			title: '嘿！朋友就差你这一刀了，帮一下忙呗~',
			imageUrl: this.shareImg ? this.$util.img(this.shareImg) : this.$util.img(this.goodsDetail.sku_image, {
				size: 'big'
			}),
			path: path,
			success: res => {},
			fail: res => {},
			complete: res => {}
		};
	}
}
