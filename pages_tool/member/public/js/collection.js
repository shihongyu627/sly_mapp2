export default {
	data() {
		return {
			collectionList: [],
			isShowEmpty: false
		};
	},
	methods: {
		//跳转至详情页
		toDetail(e) {
			this.$util.redirectTo("/pages/goods/detail", {
				goods_id: e.goods_id
			});
		},
		//请求数据
		getData(mescroll) {
			this.isShowEmpty = false;
			let url = "/api/goodscollect/page"
			let that = this;
			let array = []
			this.$api.sendRequest({
				url: url,
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
				},
				async: false,
			}).then((res) => {
				let newArr = res.data.list;
				for (var i = 0; i < newArr.length; i++) {
					newArr[i].composite_score = Math.floor((parseFloat(newArr[i].shop_desccredit) + parseFloat(
							newArr[i].shop_servicecredit) +
						parseFloat(newArr[i].shop_deliverycredit)) / 3).toFixed(1);
				}
				array = array.concat(newArr);
				//设置列表数据
				if (mescroll.num == 1) this.collectionList = []; //如果是第一页需手动制空列表
				this.collectionList = this.collectionList.concat(newArr); //追加新数据
				mescroll.endSuccess(array.length);
				if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				this.isShowEmpty = true;
			})

		},
		//监听下拉刷新，初始化页面数据
		listenRefresh(e) {
			this.$refs.goodsRecommend.init();
		},
		//删除某一项
		deleteItem(e) {
			this.$api.sendRequest({
				url: "/api/goodscollect/delete",
				data: {
					goods_id: e
				},
				success: res => {
					if (res.code == 0) {
						this.$util.showToast({
							title: "删除成功"
						})
						let array = this.collectionList;
						let newArray = array.filter((v) => {
							return v.goods_id != e;
						})
						this.collectionList = newArray;
					} else {
						this.$util.showToast({
							title: res.message
						})
					}
				}
			})
		},
		imageError(index) {
			this.collectionList[index].logo = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		goodsImageError(index) {
			this.collectionList[index].sku_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		}
	}
};
