<template>
	<view :data-theme="themeStyle" style="width: 100%; height: 100%;">
		<map style="width: 100%; height: 100%;" scale="10" :latitude="latitude" :longitude="longitude" @markertap='markertap'
			:markers="covers">
		</map>
		<view class="footer-map" v-if="markerId">
			<view class="list-top">
				<image class="store-img" :src="loadimg(detail.iconPath)" mode="aspectFill" @click="goInfo(detail)">
				</image>
				<view class="item-right">
					<view class="item-one" @click="goInfo(detail)">
						<view class="item-storeName">
							{{detail.storeName}}
						</view>
						<view class="item-km" v-if="detail.distance">
							{{(Number(detail.distance)).toFixed(2)}}km
						</view>
					</view>
					<view class="item-two">
						<view class="item-time" @click="goInfo(detail)">
							营业时间：{{ detail.open_date }}
						</view>
						<img class='store-tel' src="@/common/img/store_tel.png" mode="aspectFill"
							@click="makePhone(detail)" />
					</view>
				</view>
			</view>
			<view class="item-footer">
				<view class="address-box">
					<img class='address-icon' src="@/common/img/address_icon.png" mode="aspectFill" />
					<view class="address-text">
						{{ removeComma(detail.address)}}
					</view>
				</view>
				<view class="address-go" @click="goHerf(detail)">
					去这里
				</view>
			</view>
		</view>
		<!-- <loading-cover ref="loadingCover"></loading-cover> -->

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
				latitude: 39.909,
				longitude: 116.39742,
				store: {},
				storeId: 0,
				isIphoneX: false,
				covers: [],
				detail: {},
				markerId: ''
			};
		},
		onLoad(e) {
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			this.latitude=e.latitude
			this.longitude=e.longitude
			this.getData()
		},

		created() {
			let that = this
			uni.getLocation({
				type: 'gcj02',
				success: res => {
					console.log('当前位置的经度：' + res.longitude);
					console.log('当前位置的纬度：' + res.latitude);
					that.latitude = res.latitude
					that.longitude = res.longitude
				},
				fail: res => {
					// if(this.storeId){
					// 	this.getInfo()
					// }
				}
			});
		},
		mixins: [globalConfig],

		methods: {
			goMap() {},
			markertap(e) {
				let markerId = e.detail.markerId || ''
				this.markerId = markerId || ''
				if (!markerId) {
					return
				}
				let arr = this.covers
				arr.map((item) => {
					if (item.id == markerId) {
						this.detail = item
					}
				})
				this.covers = arr
				// let latitude = e.detail.latitude
				// let longitude = e.detail.longitude
				// // this.latitude = latitude
				// // this.longitude = longitude
				// uni.$emit('onChangeMapAddress', {
				// 	longitude: longitude,
				// 	latitude: latitude
				// })
				// uni.navigateBack();
				console.log(e, 999);
			},
			getData() {
				let data = {
					page: 1,
					page_size: 50,
					latitude: this.latitude,
					longitude: this.longitude,
				};
				this.$api.sendRequest({
					url: '/api/store/page',
					data: data,
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						let covers = []
						newArr.map((item, ) => {
							item.iconPath = this.loadimg(item.store_image)
							item.storeName = item.store_name
							item.tel = item.telphone
							item.width = 40
							item.height = 40
							item.id = item.store_id
							covers.push(item)
						})
						this.covers = covers
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
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
			loadimg(imgStr) {
				return this.$util.loadimg(imgStr)
			},
			removeComma(str) {
				return this.$util.removeComma(str)
			},
			goInfo(item) {
				this.$util.redirectTo('/tabbarStore/info/info', {
					store_name: item.store_name,
					storeId: item.store_id
				});
			},
			makePhone(item) {
				console.log(item, '打电话');
				if (!item.tel) {
					return
				}
				uni.makePhoneCall({
					phoneNumber: item.tel || '' //仅为示例
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.footer-map {
		position: fixed;
		bottom: 0;
		left: 0;
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
