export default {
	data() {
		return {
			listStyle: '',
			loadingType: 'loading', //加载更多状态
			orderType: '',
			priceOrder: 'desc', //1 价格从低到高 2价格从高到低
			categoryList: [], //排序类型
			dataList: [],
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
			isList: true, //列表样式
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
		}
	},

	onLoad(options) {
		this.keyword = options.keyword || '';
		console.log(options);
		this.isIphoneX = this.$util.uniappIsIPhoneX();
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
	methods: {
		getGoodsList(mescroll) {
			this.$api.sendRequest({
				url: '/api/store/page',
				data: {
					// page: mescroll.num,
					// page_size: mescroll.size,
					keyword: this.keyword,
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
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
					this.dataList = newArr; //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					//联网失败的回调
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		search() {
			this.emptyShow = false;
			this.dataList = [];
			this.$refs.mescroll.refresh();
		},
		loadimg(imgStr) {
			return this.$util.loadimg(imgStr)
		},
		removeComma(str) {
			return this.$util.removeComma(str)
		},
		goHerf(item) {
			if (!item.latitude && !item.longitude) {
				return
			}
			uni.openLocation({
				latitude: Number(item.latitude),
				longitude: Number(item.longitude),
				name: item.store_name,
				address: this.removeComma(item.address),
				success: function() {
					console.log('success');
				}
			});
		},
		goInfo(item) {
			this.$util.redirectTo('/tabbarStore/info/info', {
				store_name: item.store_name,
				storeId: item.store_id
			}, );

		},
		makePhone(item) {
			console.log(item, '打电话');
			if (!item.telphone) {
				return
			}
			uni.makePhoneCall({
				phoneNumber: item.telphone //仅为示例
			});
		}
	},
	watch: {

	}
}
