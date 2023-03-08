<template>
	<view :data-theme="themeStyle" class="store-wrapp">
		<view class="index_bg">
			<swiper class="store-header" :interval="swiperInterval" :autoplay="swiperAutoplay">
				<swiper-item v-for="(item, index) in adv_list" :key="index" :item-id="'goods_id_' + index">
					<view class="store-header">
						<image :src="item.adv_image" />
					</view>
				</swiper-item>
			</swiper>
			<view class="store-top">
				<view class="store-left">
				<!-- 	<picker @change="pickerEventGroup($event)" mode='selector' :range="citylist" range-key="shortname"
						:value="index"> -->
						<view class="store-left-l" @click="selectCity">
							<view class="store-address">
								{{shortname}}
							</view>
							<img class='store-bottomImg' src="../../../common/img/store_bottom.png" alt=""
								mode="aspectFill" />
						</view>
					<!-- </picker> -->
					<view class="store-left-r">
						<text class="iconfont iconsousuo2"></text>
						<input class="uni-input" confirm-type="search" @confirm='confirmSearch' placeholder="搜索门店" />
					</view>
				</view>
				<view class="store-right" @click="goMap()">
					<img class='store_mapImg' src="../../../common/img/store_map.png" alt="" mode="aspectFill" />
					<view class="store-map-title">
						地图找店
					</view>
				</view>
			</view>
		</view>
		<!-- 门店列表 -->
		<view class="store-list">
			<view class="list-item" v-for="(item, index) in dataList" :key="index">
				<view class="list-top">
					<image class="store-img" :src="loadimg(item.store_image)" mode="aspectFill" @click="goInfo(item)">
					</image>
					<view class="item-right">
						<view class="item-one" @click="goInfo(item)">
							<view class="item-storeName">
								{{item.store_name}}
							</view>
							<view class="item-km" v-if="item.distance">
								{{(item.distance).toFixed(2)}}km
							</view>
						</view>
						<view class="item-two">
							<view class="item-time" @click="goInfo(item)">
								营业时间：{{ item.open_date }}
							</view>
							<img class='store-tel' src="@/common/img/store_tel.png" alt="" mode="aspectFill"
								@click="makePhone(item)" />
						</view>
					</view>
				</view>
				<view class="item-footer">
					<view class="address-box" @click="goInfo(item)">
						<img class='address-icon' src="../../../common/img/address_icon.png" alt="" mode="aspectFill" />
						<view class="address-text">
							{{ removeComma(item.address)}}
						</view>
					</view>
					<view class="address-go" @click="goHerf(item)">
						去这里
					</view>
				</view>
			</view>
		</view>
		<!-- 底部tabBar -->
		<view id="tab-bar">
			<diy-bottom-nav type="shop"></diy-bottom-nav>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>

	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		components: {},
		data() {
			return {
				searchText: '',
				dataList: [],
				isNetwork: 1, //是否可以继续请求
				isAll: false,
				latitude: "", // 纬度
				longitude: "", // 经度
				store: {},
				storeId: 0,
				isIphoneX: false,
				keyword: '',
				total: 0,
				num: 1,
				citylist: [],
				shortname: '全部',
				city_id: '',
				adv_list: []
			};
		},
		onLoad() {
			let that = this
			uni.getLocation({
				type: 'gcj02',
				success: res => {
					console.log('当前位置的经度：' + res.longitude);
					console.log('当前位置的纬度：' + res.latitude);
					that.latitude = res.latitude
					that.longitude = res.longitude
					this.getData()
				},
				fail: res => {
					// if(this.storeId){
					// 	this.getInfo()
					// }
					this.getData()
				}
			});
			// this.isIphoneX = this.$util.uniappIsIPhoneX();
			this.store = uni.getStorageSync('store') ? uni.getStorageSync('store') : {};
			if (this.store) this.storeId = this.store.store_id;
			// this.getCitylists()
			this.advBanner()
		},
		onShow() {
			let that = this
			// uni.$on('onChangeMapAddress', function(data) {
			// 	let latitude = data.latitude
			// 	let longitude = data.longitude
			// 	console.log(longitude, latitude, '搜索门店经纬度');
			// })
			uni.$on('onChangeSeleCity', function(data) {
				that.shortname = data.shortname;
				that.city_id = data.city_id;
				console.log(that.shortname, that.city_id, '选择城市');
				that.getData()
			})
		},
		
		mixins: [globalConfig],
		onReachBottom() {
			if (this.total == this.dataList.length) {
				return
			}
			this.num += 1
			// this.getData()
		},
		/**
		 * 下拉刷新
		 */
		onPullDownRefresh() {
			// this.getCitylists()
			this.advBanner()
			this.getData()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			//选择分组
			pickerEventGroup(e) {
				let index = e.target.value;
				console.log(e, index);
				this.shortname = this.citylist[index].shortname;
				this.city_id = this.citylist[index].city_id;
				this.getData()
			},
			navigateBack() {
				this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
			},
			selectCity(){
				this.$util.redirectTo('/tabbarStore/city/city');
			},
			goMap() {
				let latitude = this.latitude
				let longitude = this.longitude
				this.$util.redirectTo('/tabbarStore/map/map', {
					latitude,
					longitude
				});
			},
			confirmSearch(e) {
				console.log(e.detail.value);
				this.keyword = e.detail.value
				this.dataList = []
				this.getData()
			},
			advBanner() {
				this.$api.sendRequest({
					url: '/api/adv/detail',
					data: {
						keyword: 'NS_STORE_CENTER'
					},
					success: res => {
						let msg = res.message;
						if (res.code == 0) {
							this.adv_list = res.data.adv_list || [];
						} else {
							this.$util.showToast({
								title: msg
							});
						}

					},
					fail: res => {}
				});
			},
			getCitylists() {
				this.$api.sendRequest({
					url: '/api/store/citylists',
					data: {},
					success: res => {
						let msg = res.message;
						if (res.code == 0 && res.data) {
							let dd = {
								city_id: '',
								shortname: '全部'
							}
							res.data.unshift(dd)
							this.citylist = res.data;

						} else {
							this.$util.showToast({
								title: msg
							});
						}

					},
					fail: res => {}
				});
			},
			getData() {
				this.$api.sendRequest({
					url: '/api/store/page',
					data: {
						// page: this.num,
						// page_size: 10,
						latitude: this.latitude,
						longitude: this.longitude,
						keyword: this.keyword,
						city_id: this.city_id,
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
							this.total = res.data.count || 0
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						//设置列表数据
						this.dataList = newArr; //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			storeTap(item) {
				// uni.setStorageSync('store', item);
				this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
			},
			selectStore(e) {
				let id = e ? e : this.storeId;
				this.$util.redirectTo('/otherpages/index/storedetail/storedetail', {
					store_id: id,
					back: '/otherpages/index/storelist/storelist'
				});
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
		}
	};
</script>

<style lang="scss" scoped>
	.store-wrapp {
		display: flex;
		flex-direction: column;
	}

	.store-header {
		width: 100%;
		opacity: 1;
		height: 540rpx;

		image {
			width: 100%;
			height: 540rpx;
		}
	}

	.store-top {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
		position: absolute;
		bottom: -34rpx;
		z-index: 10;
	}

	.store-left {
		width: 269px;
		height: 40px;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 22px;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 40rpx;
		box-sizing: border-box;
		margin-right: 7px;
	}

	.store-left-l {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-right: 6px;
		box-sizing: border-box;
		border-right: 1px solid #DFDFDF;
	}

	.store-bottomImg {
		width: 20px;
		height: 20px;
	}

	.store-address {
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: normal;
		color: #000000;
		opacity: 1;
		width: 30px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.store-right {
		width: 79px;
		height: 40px;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 22px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.store-left-r {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 20rpx;
		box-sizing: border-box;
	}

	.iconsousuo2 {
		color: #A9AAB0;
		margin-right: 10px;
	}

	.uni-input {
		width: 140px;
	}

	.store_mapImg {
		width: 17px;
		height: 17px;
	}

	.store-map-title {
		font-size: 10px;
		font-family: PingFang SC;
		font-weight: normal;
		color: #000000;
		opacity: 1;
	}

	.index_bg {
		width: 100%;
		position: relative;
		height: 540rpx;
	}

	.head-nav {
		width: 100%;
		height: var(--status-bar-height);
	}

	.head-nav.active {
		padding-top: 40rpx;
	}

	.store-list {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		margin-top: 30px;
		padding-bottom: 120rpx;
	}

	.list-item {
		width: 100%;
		padding-left: 24rpx;
		padding-right: 24rpx;
		box-sizing: border-box;
		// width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		padding-top: 10px;
		padding-bottom: 10px;
		margin-bottom: 10px;
	}

	.list-top {
		margin-bottom: 10px;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
		width: 100%;
	}

	.store-img {
		width: 66px;
		height: 66px;
		opacity: 1;
		border-radius: 10px;
		overflow: hidden;
		background: #ccc;
	}

	.item-right {
		width: 250px;
		padding-left: 20rpx;
		box-sizing: border-box;
	}

	.item-one {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.item-storeName {
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		width: 170px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.item-km {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #000000;
		opacity: 1;
	}

	.item-two {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.item-time {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: normal;
		color: #A9AAB0;
		opacity: 1;
	}

	.store-tel {
		width: 36rpx;
		height: 36rpx;
	}

	.item-footer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.address-box {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.address-icon {
		width: 14px;
		height: 14px;
		margin-right: 5px;
	}

	.address-text {
		width: 204px;
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: normal;
		color: #000000;
		opacity: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.address-go {
		width: 68px;
		height: 30px;
		background: #1189F4;
		opacity: 1;
		border-radius: 15px;
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 30px;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
	}
</style>
