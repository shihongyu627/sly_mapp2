export default {
	data() {
		return {
			listStyle: '',
			loadingType: 'loading', //加载更多状态
			goodsListLeft: [],
			goodsListRight: [],
			num: 1,
			total: 0,
			configData: {}
		}
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		this.$refs.loadingCover.show();
		this.getAwardconfig()
		this.getListData()
	},
	onReachBottom() {
		if (this.total == this.goodsList.length) {
			return
		}
		this.num += 1
		this.getListData()
	},
	methods: {
		getAwardconfig() {
			this.$api.sendRequest({
				url: '/api/config/awardconfig',
				data: {},
				success: res => {
					let newArr = []
					let msg = res.message;
					if (res.code == 0) {
						this.configData = res.data || {}
					} else {
						this.$util.showToast({
							title: msg
						})
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					//联网失败的回调
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		getListData() {
			this.$api.sendRequest({
				url: '/api/goodssku/page',
				data: {
					page: this.num,
					page_size: 10,
					label_name: '会员'
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
					//设置列表数据
					if (this.num == 1) this.goodsList = []; //如果是第一页需手动制空列表
					let arr = this.goodsList.concat(newArr); //追加新数据
					let arrLeft = []
					let arrRight = []
					arr.map((item, index) => {
						if (index % 2 === 0) {
							arrRight.push(item)
						} else {
							arrLeft.push(item)
						}
					})
					this.goodsListLeft = arrLeft
					this.goodsListRight = arrRight
					this.goodsList = arr
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					//联网失败的回调
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		goHref(url) {
			this.$util.redirectTo(url);
		},
		//商品详情
		toDetail(item) {
			this.$util.redirectTo('/pages/goods/detail', {
				goods_id: item.goods_id,
				title: item.goods_name
			});
		},
		goodsImg(imgStr) {
			return this.$util.loadimg(imgStr)
		},
		imgError(index) {
			this.goodsList[index].goods_image = this.$util.getDefaultImage().default_goods_img;
		},
	}

}
