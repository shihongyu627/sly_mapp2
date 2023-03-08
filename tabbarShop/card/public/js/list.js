export default {
	data() {
		return {
			listStyle: '',
			loadingType: 'loading', //加载更多状态
			goodsList: [],
		}
	},

	onLoad(options) {

	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
	},
	methods: {
		getGoodsList(mescroll) {
			this.$api.sendRequest({
				url: '/subcard/api/subcard/lists',
				data: {
					page: mescroll.num,
					page_size: mescroll.size,
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
		//商品详情
		toDetail(item) {
			this.$util.redirectTo('/tabbarShop/card/info/info', {
				subcard_id: item.subcard_id,
				title: item.card_name
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
