<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<mescroll-uni ref="mescroll" @getData="getData" class="member-point">
			<view slot="list">
				<block v-if="dataList.length">
					<!-- 门店列表 -->
					<view class="store-list">
						<view class="list-content-box">
							<view class="list-title">附近门店</view>
							<view class="list-content">
								<block v-for="(item, index) in dataList" :key="index">
									<view class="list-item" @click="selectStore(item)">
										<view class="item-box">
											<view class="item-image">
												<image :src="$util.img(item.store_image)" v-if="item.store_image">
												</image>
												<image :src="$util.getDefaultImage().store" v-else></image>
											</view>
											<view class="item-info">
												<view class="item-title">
													<text class="title">{{ item.store_name }}</text>
													<text class="distance color-base-text" v-if="item.distance">
														距离{{ item.distance > 1 ? item.distance + 'km' : item.distance * 1000 + 'm' }}
													</text>
												</view>
												<view class="item-time" v-if="item.open_date">营业时间：{{ item.open_date }}
												</view>
												<view class="item-address">{{ $util.removeComma(item.address) }}
												</view>
											</view>
											<view class="item-right"><text class="iconfont iconright"></text></view>
										</view>
									</view>
									<view class="line" v-if="index != dataList.length - 1"></view>
								</block>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<ns-empty text="您的附近暂无可选门店" :isIndex="false"></ns-empty>
				</block>
			</view>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				searchText: '',
				dataList: [],
				isNetwork: 1, //是否可以继续请求
				isAll: false,
				latitude: null, // 纬度
				longitude: null, // 经度
				store: {},
				storeId: 0,
				isIphoneX: false
			};
		},
		onLoad() {
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			this.store = uni.getStorageSync('store') ? uni.getStorageSync('store') : {};
			if (this.store) this.storeId = this.store.store_id;

			if (this.location) {
				this.latitude = this.location.latitude;
				this.longitude = this.location.longitude;
			} else {
				this.$util.getLocation();
			}
		},
		computed: {
			location() {
				return this.$store.state.location;
			}
		},
		watch: {
			location: function(nVal) {
				if (nVal) {
					this.latitude = nVal.latitude;
					this.longitude = nVal.longitude;
					this.$refs.mescroll.refresh();
				}
			}
		},
		methods: {
			navigateBack() {
				this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
			},
			search() {},
			getData(mescroll) {
				if (!this.isNetwork) {
					mescroll.endSuccess(0);
					return;
				}
				if (this.isAll) {
					mescroll.endSuccess(0);
					return;
				}
				this.isNetwork = 0;
				let data = {
					// page: mescroll.num,
					// page_size: mescroll.size
				};
				if (this.latitude && this.longitude) {
					data.latitude = this.latitude;
					data.longitude = this.longitude;
				}
				this.$api.sendRequest({
					url: '/api/store/page',
					data: data,
					success: res => {
						this.isNetwork = 1;
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
						this.dataList = newArr; //追加新数据
						if (this.dataList.length == res.data.count) {
							this.isAll = true;
						}
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			//获取门店详情
			getInfo() {
				let data = {
					store_id: this.storeId
				};
				if (this.latitude && this.longitude) {
					data.latitude = this.latitude;
					data.longitude = this.longitude;
				}
				this.$api.sendRequest({
					url: '/api/store/info',
					data: data,
					success: res => {
						if (res.data) {
							this.store = res.data;
							// uni.setStorageSync('store', this.store);
						}
					}
				});
			},
			storeTap(item) {
				// uni.setStorageSync('store', item);
				this.$util.redirectTo('/pages/index/index', {}, 'reLaunch');
			},
			selectStore(data) {
				let store_id = data.store_id ? data.store_id : this.storeId;
				uni.$emit('onChangeStoreId', store_id)
				uni.setStorageSync('store', data || {});
				uni.navigateBack();
			}
		}
	};
</script>

<style lang="scss" scoped>
	.index_bg {
		width: 100%;
		height: 422rpx;
		background-size: 100% 100%;
	}

	.head-nav {
		width: 100%;
		height: 100rpx;
	}

	.head-nav.active {
		padding-top: 40rpx;
	}

	.head-return {
		padding-left: 30rpx;
		padding-right: 30rpx;
		height: 90rpx;
		line-height: 90rpx;
		color: #fff;
		font-weight: 600;
		font-size: $font-size-toolbar;
		display: flex;
		justify-content: space-between;

		text {
			display: inline-block;
			margin-right: 10rpx;
		}
	}

	//----------------------------------门店信息----------------------------------------
	.store-info {
		width: 100%;
		padding: 76rpx 24rpx 0;
		box-sizing: border-box;
		position: relative;

		.info-box {
			width: 702rpx;
			height: 350rpx;
			background: #fff;
			border-radius: 20rpx;
			padding: 16rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: center;
			align-items: center;

			.info-content {
				width: 660rpx;
				height: 312rpx;
				background: #fff;
				text-align: center;
				border: 2rpx dashed rgba(229, 229, 229, 1);
				border-radius: 20rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				box-sizing: border-box;

				.info-title {
					max-width: 50%;
					font-size: $font-size-toolbar;
					color: $color-title;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-weight: 500;
					margin-bottom: 36rpx;
					line-height: 1;
				}

				.info-time {
					line-height: 1;
					font-size: $font-size-tag;
					color: $color-tip;
					margin-bottom: 36rpx;
				}

				.info-address {
					max-width: 80%;
					line-height: 42rpx;
					font-size: $font-size-tag;
					color: $color-title;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
			}
		}

		image {
			width: 104rpx;
			height: 104rpx;
			position: absolute;
			border-radius: 50%;
			left: calc(50% - 54rpx);
			top: 24rpx;
		}

		.nowstore-title {
			width: 100%;
			font-size: $font-size-tag;
			color: #ffffff;
			line-height: 1;
			position: absolute;
			border-radius: 50%;
			left: calc(50% - 48rpx);
			top: -90rpx;
		}
	}

	//-----------------------------门店列表---------------------------------
	.store-list {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
		padding-bottom: 100rpx;

		.line {
			width: 654rpx;
			margin: 0 auto;
			height: 2rpx;
			background: $color-line;
		}

		.list-content-box {
			width: 100%;
			height: 100%;
			box-sizing: border-box;

			.list-title {
				width: 100%;
				font-size: 30rpx;
				color: $color-title;
				font-weight: 500;
				line-height: 1;
				margin: 52rpx 0 24rpx;
			}

			.list-content {
				width: 100%;
				background: #ffffff;
				border-radius: 20rpx;
				box-sizing: border-box;
				overflow: hidden;

				.list-item {
					width: 100%;
					padding: 35rpx 24rpx;
					box-sizing: border-box;

					.item-box {
						width: 100%;
						height: 100%;
						display: flex;
						background: #ffffff;
						align-items: center;

						.item-image {
							width: 88rpx;
							height: 88rpx;
							border-radius: 50%;
							align-self: start;

							image {
								width: 88rpx;
								height: 88rpx;
								border-radius: 50%;
							}
						}

						.item-info {
							width: 520rpx;
							height: 100%;
							padding-left: 20rpx;
							box-sizing: border-box;
							display: flex;
							flex-direction: column;
							margin-right: 24rpx;
							font-size: $font-size-tag;

							.item-title {
								display: flex;
								justify-content: space-between;
								align-items: center;
								margin-bottom: 10rpx;

								.title {
									max-width: 240rpx;
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
									font-size: $font-size-base;
									color: $color-title;
								}

								.distance {
									font-size: $font-size-activity-tag;
								}
							}

							.item-time {
								font-size: $font-size-activity-tag;
								color: $color-tip;
								margin-bottom: 10rpx;
							}

							.item-address {
								font-size: $font-size-tag;
								color: $color-title;
								line-height: 42rpx;

								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 2;
								overflow: hidden;
							}
						}

						.item-right {
							flex-grow: 1;
							height: 100%;
							display: flex;
							justify-content: center;
							align-items: center;

							.iconfont {
								color: #acacac;
							}
						}
					}
				}
			}
		}
	}
</style>
