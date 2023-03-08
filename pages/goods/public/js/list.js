export default {
	data() {
		return {
			listStyle: '',
			loadingType: 'loading', //加载更多状态
			orderType: '',
			priceOrder: 'desc', //1 价格从低到高 2价格从高到低
			categoryList: [], //排序类型
			goodsList: [],
			order: '',
			sort: 'desc',
			showScreen: false,
			keyword: '',
			categoryId: 0,
			minPrice: '',
			maxPrice: '',
			isFreeShipping: false, //是否免邮
			isIphoneX: false,
			coupon: 0,
			emptyShow: false,
			isList: false, //列表样式
			//分享建立上下级所需id
			memberId: 0,
			//分享所需标题
			share_title: '',
			//搜索到多少件商品
			count: 0,
			//当前分类名称
			category_title: '',
			//优惠券数据
			coupon_name: '',
			//列表瀑布流数据
			listHeight: [],
			listPosition: [],
			debounce: null,
			brandId: 0,
			brandList: [], //品牌筛选项
			label_name: '',//标签
			label_id: '',//标签
		}
	},

	onLoad(options) {
		this.categoryId = options.category_id || 0;
		this.keyword = options.keyword || '';
		this.coupon = options.coupon || 0;
		this.goods_id_arr = options.goods_id_arr || 0;
		this.brandId = options.brand_id || 0;
		this.label_name = options.label_name || '';
		this.label_id = options.label_id || '';

		this.loadCategoryList(this.categoryId);
		this.getBrandList();
		this.isIphoneX = this.$util.uniappIsIPhoneX();

		this.$util.getMemberId().then(resolve => {
			this.memberId = resolve;
		});
		//小程序分享接收source_member
		if (options.source_member) {
			uni.setStorageSync('source_member', options.source_member);
		}
		// 小程序扫码进入，接收source_member
		if (options.scene) {
			var sceneParams = decodeURIComponent(options.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('sku_id') != -1) this.skuId = item.split('-')[1];
					if (item.indexOf('m') != -1) uni.setStorageSync('source_member', item.split('-')[1]);
					if (item.indexOf('is_test') != -1) uni.setStorageSync('is_test', 1);
				});
			}
		}

		uni.onWindowResize(res => {
			if (this.debounce) clearTimeout(this.debounce);
			this.waterfallflow(0);
		})
	},
	onShow() {


		//记录分享关系
		if (uni.getStorageSync('token') && uni.getStorageSync('source_member')) {
			this.$util.onSourceMember(uni.getStorageSync('source_member'));
		}
		setTimeout(() => {
			//this.handle_share();
		}, 2000)
	},
	/**
	 * 转发分享
	 */
	onShareAppMessage(res) {
		var title = '搜索到' + this.count + '件“' + this.keyword + this.category_title + this.coupon_name + '”相关的优质商品';
		let route = this.$util.getCurrentShareRoute(this.memberId);
		var path = route.path;
		return {
			title: title,
			path: path,
			success: res => {},
			fail: res => {}
		};
	},
	// 分享到微信朋友圈
	onShareTimeline() {
		var title = '搜索到' + this.count + '件“' + this.keyword + this.category_title + this.coupon_name + '”相关的优质商品';
		let route = this.$util.getCurrentShareRoute(this.memberId);
		var query = route.query;
		return {
			title: title,
			query: query,
			imageUrl: ''
		};
	},
	methods: {
		/**
		 * 获取优惠券数据
		 */
		couponInfo(id) {
			return new Promise(resolve => {
				this.$api.sendRequest({
					url: '/coupon/api/coupon/typeinfo',
					data: {
						coupon_type_id: id
					},
					success: res => {
						if (res.code >= 0) {
							resolve(res.data.coupon_name);
						}
					}
				});
			})
		},
		/**
		 *  获取分类名称
		 */
		share_select(data, id) {
			return new Promise((resolve) => {
				data.forEach((item) => {
					if (item.category_id == id) {
						resolve(item.category_name)
					}
					if (item.child_list && item.child_list.length > 0) {
						item.child_list.forEach((v) => {
							if (v.category_id == id) {
								resolve(v.category_name)
							}
							if (v.child_list && v.child_list.length > 0) {
								v.forEach((m) => {
									if (m.category_id == id) {
										resolve(m.category_name)
									}
								})

							}
						})
					}
				})
			})
		},
		//加载分类
		loadCategoryList(fid, sid) {
			this.$api.sendRequest({
				url: '/api/goodscategory/tree',
				data: {},
				success: res => {
					if (res.data != null) {
						this.categoryList = res.data
					};
				}
			});
		},
		getGoodsList(mescroll) {
			this.$api.sendRequest({
				url: '/api/goodssku/page',
				data: {
					page: mescroll.num,
					page_size: mescroll.size,
					keyword: this.keyword,
					category_id: this.categoryId,
					brand_id: this.brandId,
					min_price: this.minPrice,
					max_price: this.maxPrice,
					is_free_shipping: (this.isFreeShipping ? 1 : 0),
					order: this.order,
					sort: this.sort,
					coupon: this.coupon,
					goods_id_arr: this.goods_id_arr,
					label_name: this.label_name,
					label_id:this.label_id
				},
				success: res => {
					let newArr = []
					let msg = res.message;
					if (res.code == 0 && res.data) {
						this.count = res.data.count;
						if (res.data.page_count == 0) {
							this.emptyShow = true
						}
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						})
					}
					this.category_title = '';
					this.coupon_name = '';
					if (this.categoryId) {
						this.share_select(this.categoryList, this.categoryId).then(resolve => {
							this.category_title = resolve
						});
					}
					if (this.coupon) {
						this.couponInfo(this.coupon).then(resolve => {
							this.coupon_name = resolve
						});;
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.goodsList = []; //如果是第一页需手动制空列表
					this.goodsList = this.goodsList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();

					this.waterfallflow((mescroll.num - 1) * 10);
				},
				fail: res => {
					//联网失败的回调
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		changeListStyle() {
			this.isList = !this.isList;
			this.waterfallflow(0);
		},
		//筛选点击
		sortTabClick(tag) {
			if (tag == 'sale_num') {
				this.order = 'sale_num';
				this.sort = 'desc';
			} else if (tag == 'discount_price') {
				this.order = 'discount_price';
				this.sort = 'desc';
			} else if (tag == 'screen') {
				//筛选
				this.showScreen = true;
				return;
			} else {
				this.order = '';
				this.sort = '';
			}

			if (this.orderType === tag && tag !== 'discount_price') return;

			this.orderType = tag;
			if (tag === 'discount_price') {
				this.priceOrder = this.priceOrder === 'asc' ? 'desc' : 'asc';
				this.sort = this.priceOrder;
			} else {
				this.priceOrder = '';
			}
			this.emptyShow = false;
			this.goodsList = [];
			this.$refs.mescroll.refresh();
		},
		//商品详情
		toDetail(item) {
			this.$util.redirectTo('/pages/goods/detail', {
				goods_id: item.goods_id
			});
		},
		search() {
			this.emptyShow = false;
			this.goodsList = [];
			this.$refs.mescroll.refresh();
		},
		selectedCategory(categoryId) {
			this.categoryId = categoryId;
		},
		screenData() {
			if (this.minPrice != '' || this.maxPrice != '') {
				// if (!Number(this.minPrice) && this.minPrice) {
				// 	this.$util.showToast({
				// 		title: '请输入最低价'
				// 	});
				// 	return;
				// }
				if (!Number(this.maxPrice) && this.maxPrice) {
					this.$util.showToast({
						title: '请输入最高价'
					});
					return;
				}
				if (Number(this.minPrice) < 0 || Number(this.maxPrice) < 0) {
					this.$util.showToast({
						title: '筛选价格不能小于0'
					});
					return;
				}
				if (this.minPrice != '' && Number(this.minPrice) > Number(this.maxPrice) && this.maxPrice) {

					this.$util.showToast({
						title: '最低价不能大于最高价'
					});
					return;
				}
				if (this.maxPrice != '' && Number(this.maxPrice) < Number(this.minPrice)) {
					this.$util.showToast({
						title: '最高价不能小于最低价'
					});
					return;
				}
			}
			this.emptyShow = false;
			this.goodsList = [];
			this.$refs.mescroll.refresh();
			this.showScreen = false;
		},
		//重置数据
		resetData() {
			this.categoryId = 0
			this.minPrice = ''
			this.maxPrice = ''
			this.isFreeShipping = false
		},
		goodsImg(imgStr) {
			let imgs = imgStr.split(',');
			return imgs[0] ? this.$util.img(imgs[0], {
				size: 'mid'
			}) : this.$util.getDefaultImage().goods;
		},
		imgError(index) {
			this.goodsList[index].goods_image = this.$util.getDefaultImage().goods;
		},
		showPrice(data) {
			let price = data.discount_price;
			if (data.member_price && parseFloat(data.member_price) < parseFloat(price)) price = data.member_price;
			return price;
		},
		goodsTag(data) {
			return data.label_name || '';
		},
		/**
		 * 瀑布流
		 */
		waterfallflow(start = 0) {
			if (!this.isList) {
				//页面渲染完成后的事件
				this.$nextTick(() => {
					setTimeout(() => {
						let listHeight = [];
						let listPosition = [];
						if (start != 0) {
							listHeight = this.listHeight;
							listPosition = this.listPosition;
						}
						let column = 2;
						const query = uni.createSelectorQuery().in(this);
						query.selectAll('.double-column .goods-item').boundingClientRect(data => {
							for (let i = start; i < data.length; i++) {
								if (i < column) {
									let position = {};
									position.top = uni.upx2px(20) + 'px';
									if (i % column == 0) {
										position.left = data[i].width * i + "px";
									} else {
										position.left = data[i].width * i + (i % column * uni
											.upx2px(30)) + "px";
									}
									listPosition[i] = position;
									listHeight[i] = data[i].height + uni.upx2px(20);
								} else {
									let minHeight = Math.min(...listHeight); //  找到第一列的最小高度
									let minIndex = listHeight.findIndex(item => item ===
										minHeight) // 找到最小高度的索引
									//设置当前子元素项的位置
									let position = {};
									position.top = minHeight + uni.upx2px(20) + "px";
									position.left = listPosition[minIndex].left;
									listPosition[i] = position;
									//重新定义数组最小项的高度 进行累加
									listHeight[minIndex] += data[i].height + uni.upx2px(20);
								}
							}
							this.listHeight = listHeight;
							this.listPosition = listPosition;
						}).exec();
					}, 50)
				})
			}
		},
		getBrandList() {
			var data = {
				page: 1,
				page_size: 0
			};
			this.$api.sendRequest({
				url: '/api/goodsbrand/page',
				data: data,
				success: res => {
					if (res.code == 0 && res.data) {
						let data = res.data;
						this.brandList = data.list;
					}
				}
			});
		},
	},
	watch: {

	}
}
