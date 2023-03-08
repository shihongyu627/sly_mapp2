export default {
	data() {
		return {
			listStyle: '',
			loadingType: 'loading', //加载更多状态
			goodsList: [],
			userInfo: {},
			selectGoodsList: [],
			total: 0
		}
	},

	onLoad(options) {},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		this.loadData()
	},
	methods: {
		toNum(data, type) {
			let arr = this.goodsList
			if (type == 'add') {
				arr.map((item) => {
					if (data.sku_id == item.sku_id) {
						item.num = item.num + 1
					}
				})
			} else {
				arr.map((item) => {
					if (data.sku_id == item.sku_id) {
						if (item.num == 0) {
							return
						}
						item.num = item.num - 1
					}
				})
			}
			let selectArr = []
			let total = 0
			arr.map((item) => {
				if (item.num > 0) {
					selectArr.push(item)
					total += Number(item.price) * Number(item.num)
				}
			})
			this.goodsList = arr
			this.selectGoodsList = selectArr
			this.total = total
		},
		toBuy(data) {
			console.log(data);
			let arr = this.goodsList
			arr.map((item) => {
				if (data.sku_id == item.sku_id && item.num < 1) {
					item.num = 1
				}
			})
			let selectArr = []
			let total = 0
			arr.map((item) => {
				if (item.num > 0) {
					selectArr.push(item)
					total += Number(item.price) * Number(item.num)
				}
			})
			this.goodsList = arr
			this.selectGoodsList = selectArr
			this.total = total
		},
		/**
		 * 结算
		 */
		settlement() {
			let skuIds = [];
			this.selectGoodsList.map((item) => {
				if (item.num > 0) {
					let obj = {
						sku_id: item.sku_id,
						num: item.num
					}
					skuIds.push(obj);
				}
			})
			uni.setStorage({
				key: 'orderCreateData',
				data: {
					sku_ids: JSON.stringify(skuIds)
				},
				success: () => {
					this.$util.redirectTo('/pages/order/payment');
				}
			});
		},
		loadData() {
			this.$api.sendRequest({
				url: '/api/member/info',
				success: res => {
					if (res.code == 0) {
						this.userInfo = res.data
					}
				}
			});
		},
		getGoodsList(mescroll) {
			this.$api.sendRequest({
				url: '/api/goodssku/page',
				data: {
					page: mescroll.num,
					page_size: mescroll.size,
					label_name: '爆品'
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
					newArr.map((item) => {
						item.num = 0
					})
					this.total = 0
					this.selectGoodsList = []
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
			this.$util.redirectTo('/tabbarShop/info/info', {
				sku_id: item.sku_id,
				title: item.goods_name,
				goods_id: item.goods_id
			});
		},
		goodsImg(imgStr) {
			if (!imgStr) {
				return
			}
			let imgs = imgStr.split(',');
			console.log(imgStr);
			console.log(imgs);
			return imgs[0] ? this.$util.img(imgs[0], {
				size: 'mid'
			}) : this.$util.getDefaultImage().default_goods_img;
		},
		imgError(index) {
			this.goodsList[index].goods_image = this.$util.getDefaultImage().default_goods_img;
		},
	}

}
