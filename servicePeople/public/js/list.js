export default {
	data() {
		return {
			listStyle: '',
			loadingType: 'loading', //加载更多状态
			goodsList: [],
			store_id: '',
			worker_id: '',
			keyword: '',
			workerInfo: {}
		}
	},

	onLoad(options) {
		this.store_id = options.store_id || ''
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
	},
	methods: {
		selectService(item) {
			this.workerInfo = item
			this.worker_id = item.worker_id
		},
		onClickSelect() {
			uni.$emit('onChangeServicePeople', this.workerInfo)
			uni.navigateBack();

		},
		search() {
			this.emptyShow = false;
			this.goodsList = [];
			this.$refs.mescroll.refresh();
		},
		getGoodsList(mescroll) {
			this.$api.sendRequest({
				url: '/api/store/workerlists',
				data: {
					page: mescroll.num,
					page_size: mescroll.size,
					store_id: this.store_id,
					search: this.keyword
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
		goodsImg(imgStr) {
			return this.$util.loadimg(imgStr);
		},
	}

}
