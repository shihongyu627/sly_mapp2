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
			showCategory: false,
			showScreen: false,
			keyword: '',
			categoryId: 0,
			minPrice: '',
			maxPrice: '',
			isFreeShipping: false, //是否免邮
			isIphoneX: false,
			emptyShow: false
		}
	},
	onLoad(options) {
		this.categoryId = options.category_id || 0;
		this.keyword = options.keyword || '';
		this.loadCategoryList(this.categoryId);
		this.isIphoneX = this.$util.uniappIsIPhoneX();
	},
	onShow() {
		
		
	},
	methods: {
		//获取列表
		getGoodsList(mescroll) {
			this.$api.sendRequest({
				url: '/fenxiao/api/goods/page',
				data: {
					page: mescroll.num,
					page_size: mescroll.size,
					keyword: this.keyword,
					category_id: this.categoryId,
					min_price: this.minPrice,
					max_price: this.maxPrice,
					is_free_shipping: (this.isFreeShipping ? 1 : 0),
					order: this.order,
					sort: this.sort
				},
				success: res => {
					let newArr = []
					let msg = res.message;
					if (res.code == 0 && res.data) {
						if (res.data.page_count == 0) {
							this.emptyShow = true
						}
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						})
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.goodsList = []; //如果是第一页需手动制空列表
					this.goodsList = this.goodsList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					//联网失败的回调
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		changeListStyle() {
			if (!this.listStyle) this.listStyle = 'largest';
			else this.listStyle = '';
		},
		//加载分类
		loadCategoryList(fid, sid) {
			this.$api.sendRequest({
				url: '/api/goodscategory/tree',
				data: {},
				success: res => {
					if (res.data != null) this.categoryList = res.data;
				}
			});
		},
		//筛选点击
		sortTabClick(tag) {
			if (tag == 'sales') {
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

			this.$refs.mescroll.refresh();
		},
		//商品详情
		navToDetailPage(item) {
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
		imageError(index) {
			this.goodsList[index].sku_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		// 关注该商品
		followGoods(index, goods_id, sku_id) {
			this.$api.sendRequest({
				url: '/fenxiao/api/goodscollect/add',
				data: {
					goods_id: goods_id,
					sku_id: sku_id
				},
				success: res => {
					let msg = '';
					if (res.code >= 0) {
						msg = "关注成功"
					} else {
						msg = res.message
					}
					this.$util.showToast({
						title: msg
					})
					this.goodsList[index].is_collect = 1;
				}
			});
		},
		//取消关注
		delFollow(e, f) {
			this.$api.sendRequest({
				url: '/fenxiao/api/goodscollect/delete',
				data: {
					collect_id: e
				},
				success: res => {
					let msg = "";
					if (res.code == 0) {
						msg = "取消成功"
					} else {
						msg = res.message
					}
					this.$util.showToast({
						title: msg
					});
					let arr = this.goodsList;
					arr[f].is_collect = 0;
					this.goodsList = arr;
				}
			});
		},
		//重置数据
		resetData() {
			this.categoryId = 0
			this.minPrice = ''
			this.maxPrice = ''
			this.isFreeShipping = false
		}
	}

}
