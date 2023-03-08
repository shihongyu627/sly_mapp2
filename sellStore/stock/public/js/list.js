export default {
	data() {
		return {
			listStyle: '',
			loadingType: 'loading', //加载更多状态
			goodsList: [],
			showCategory: false,
			showScreen: false,
			keyword: '',
			isIphoneX: false,
			emptyShow: false,
			stockInfo: {},
			is_dealer: "",
			is_store: "",
			type:"",
			isList: true //列表样式
		}
	},

	onLoad(options) {
		this.is_dealer = options.is_dealer || '';
		this.is_store = options.is_store || '';
		this.type = options.type || '';

		this.isIphoneX = this.$util.uniappIsIPhoneX();
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
	},
	methods: {
		getGoodsList(mescroll) {
			this.$api.sendRequest({
				url: '/dealer/api/goods/page',
				data: {
					page: mescroll.num,
					page_size: mescroll.size,
					keyword: this.keyword,
				},
				success: res => {
					let newArr = []
					let msg = res.message;
					if (res.code == 0 && res.data) {
						if (res.data.page_count == 0) {
							this.emptyShow = true
						}
						newArr = res.data.list;
						newArr.map((item) => {
							item.checked = false
						})
						this.stockInfo = res.data
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
			this.isList = !this.isList
		},
		//商品详情
		toStockRecord(item) {
			this.$util.redirectTo('/sellStore/stock/record/record', {
				goods_id: item.goods_id,
				type:this.type
			});
		},
		selectGoods(data) {
			console.log(data, 99);
			let arr = this.goodsList || []
			arr.map((item) => {
				if (item.goods_id == data.goods_id) {
					item.checked = !item.checked
				}
			})
			this.goodsList = arr
		},
		searchConfirm(e) {
			console.log(e.detail.value);
			this.keyword = e.detail.value
			this.emptyShow = false;
			this.goodsList = [];
			this.$refs.mescroll.refresh();
		},
		//重置数据
		resetData() {
			this.categoryId = 0
			this.minPrice = ''
			this.maxPrice = ''
			this.isFreeShipping = false
		},
		goodsImg(imgStr) {
			return this.$util.loadimg(imgStr)
		},
		goOrder(type) {
			let arr = this.goodsList || []
			let idArr = []
			let stock_cloud = false
			for (var i = 0; i < arr.length; i++) {
				let item = arr[i]
				if (item.checked) {
					idArr.push((item.goods_id))
					if (item.stock_cloud == 0 && type == 'out') {
						this.$util.showToast({
							title: `${item.goods_name}云仓库存不足`
						});
						return
					}
				}
			}
			console.log(idArr);
			let ids = idArr.join(',')
			console.log(ids);
			if (!ids) {
				this.$util.showToast({
					title: '请选择商品进行下单'
				});
				return
			}
			// uni.redirectTo({
			// 	url: `/sellStore/deliveryLocal/delivery?type=${type}&goods_ids=${ids}`
			// })
			this.$util.redirectTo('/sellStore/deliveryLocal/delivery', {
				type: type,
				goods_ids: ids
			});
		}
	}

}
