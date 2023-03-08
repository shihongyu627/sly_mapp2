<template>
	<view class="store-wrap">
		<block v-if="value.style == 1">
			<view class="store-box store-one">
				<view class="store-info">
					<view class="info-box" :style="{ color: value.textColor }" @click="toStoreList()">
						<text class="title" v-if="store.store_id">{{ store.store_name }}</text>
						<text class="title" v-else>请绑定门店</text>
						<text>
							<text class="change margin-left">切换</text>
							<text class="iconfont iconright"></text>
						</text>
					</view>
					<view class="address-box" :style="{ color: value.textColor }">
						<view class="address" :style="{ color: value.textColor }">
							<text class="iconfont icondizhi"></text>
							<text v-if="store.store_id"
								@click="mapRoute">{{ $util.removeComma(store.address) }}</text>
							<text v-else>无法获取您当前的位置</text>
						</view>
					</view>
				</view>
				<view class="store-image" @click="selectStore()">
					<image :src="$util.img(store.store_image)" v-if="store.store_image && store.store_id"
						mode="aspectFill"></image>
					<image :src="$util.getDefaultImage().store" v-else mode="aspectFill"></image>
				</view>
			</view>
		</block>

		<block v-if="value.style == 2">
			<view class="store-box store-three" @click="toStoreList()">
				<view class="store-info">
					<view class="store-image" @click="selectStore()">
						<image :src="$util.img(store.store_image)" v-if="store.store_image && store.store_id"
							mode="aspectFill"></image>
						<image :src="$util.getDefaultImage().store" v-else mode="aspectFill"></image>
					</view>
					<view class="info-box" :style="{ color: value.textColor }">
						<text class="title" v-if="store.store_id">{{ store.store_name }}</text>
						<text class="title" v-else>请绑定门店</text>
						<text>
							<text class="change margin-left">切换</text>
							<text class="iconfont iconright"></text>
						</text>
					</view>
				</view>
				<view class="store-icon" @click.stop="search()"><text class="iconfont iconsousuo3"
						:style="{ color: value.textColor }"></text></view>
			</view>
		</block>

		<block v-if="value.style == 3">
			<view class="store-box store-four" @click="toStoreList()">
				<view class="store-left-wrap">
					<text class="iconfont iconweizhi" :style="{ color: value.textColor }"></text>
					<text class="title" v-if="store.store_id"
						:style="{ color: value.textColor }">{{ store.store_name }}</text>
					<text class="title" v-else :style="{ color: value.textColor }">请绑定门店</text>
					<text class="iconfont iconunfold" :style="{ color: value.textColor }"></text>
				</view>
				<view class="store-right-search">
					<input type="text" class="uni-input font-size-tag" disabled placeholder="请搜索关键词"
						@click.stop="search()" />
					<text class="iconfont iconsousuo3" @click.stop="search()"></text>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	// 门店列表
	import Map from '@/common/js/map/openMap.js';
	export default {
		name: 'ns-store',
		props: {
			storeId: {
				type: [String, Number],
				default () {
					return 0;
				}
			},
			value: {
				type: Object
			}
		},
		data() {
			return {
				type: 'country',
				store: {
					store_name: ''
				},
				showStore: 1,
				size: 2,
				num: 1,
				storeList: [],
				latitude: null, // 纬度
				longitude: null // 经度
			};
		},
		computed: {
			// 定位信息
			location() {
				return this.$store.state.location;
			}
		},
		watch: {
			storeId() {
				if (uni.getStorageSync('store')) {
					this.store = uni.getStorageSync('store');
				} else {
					this.getStoreList();
				}
			},
			location: function(nVal) {
				if (nVal) {
					this.latitude = nVal.latitude;
					this.longitude = nVal.longitude;
					this.getStoreList();
				}
			}
		},
		created() {
			this.getStoreList();
			if (this.location) {
				this.latitude = this.location.latitude;
				this.longitude = this.location.longitude;
			} else {
				this.$util.getLocation();
			}
		},
		methods: {
			//跳转至门店列表
			toStoreList() {
				let is_bind_store = uni.getStorageSync('is_bind_store')
				if (is_bind_store == 1) {
					return
				}
				this.$util.redirectTo('/pages_tool/index/storelist', {});
			},
			selectStore() {
				if (this.store.store_id) {
					this.$util.diyRedirectTo({
						diy_name: 'DIY_STORE_' + this.store.store_id,
						store_id: this.store.store_id,
						wap_url: '/pages/index/index?name=' + 'DIY_STORE_' + this.store.store_id
					});
				}
			},
			search() {
				this.$util.redirectTo('/pages_tool/goods/search');
			},
			//获取门店列表
			getStoreList() {
				this.store = uni.getStorageSync('store') || {}
				return
				let data = {
					// page: 1,
					// page_size: 2
				};
				if (this.latitude && this.longitude) {
					data.latitude = this.latitude;
					data.longitude = this.longitude;
				}
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
						this.storeList = newArr;
						for (let i = 0; i < this.storeList.length; i++) {
							if (this.storeList[i].store_id == res.data.store_id) {
								this.store = this.storeList[i];
								// uni.setStorageSync('store', this.storeList[i]);
								this.$forceUpdate();
							}
						}
					}
				});
			},
			mapRoute() {
				if (!isNaN(Number(this.store.latitude)) && !isNaN(Number(this.store.longitude))) {
					Map.openMap(Number(this.store.latitude), Number(this.store.longitude), this.store.store_name, 'gcj02');
				}
			}
		}
	};
</script>

<style lang="scss">
	.store-wrap {
		padding: 20rpx 0;
		box-sizing: border-box;

		.store-box {
			// padding: 20rpx 24rpx;
			box-sizing: border-box;
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.noStoreBox {
			width: 100%;
			height: 100%;
			line-height: 120rpx;
			color: #ffffff;
		}

		.store-info {
			height: 100rpx;
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-around;
			margin-right: 20rpx;

			.info-box {
				// color: #ffffff;
				display: flex;
				align-items: flex-end;
				margin-bottom: 6rpx;

				text {
					line-height: 1.2;
				}

				.title {
					max-width: 60%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: $font-size-toolbar;
					margin-right: 40rpx;
				}

				.change {
					font-size: $font-size-goods-tag;
				}

				.iconfont {
					font-size: $font-size-goods-tag;
				}
			}

			.address-box {
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #ffffff;
			}

			.address {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				// display: flex;
				width: 100%;
				// align-items: center;
				// color: #ffffff;
				line-height: 1.2;
				font-size: $font-size-goods-tag;

				.iconfont {
					font-size: $font-size-goods-tag;
					margin-right: 6rpx;
				}

				.store-address-info {
					width: calc(100% - 30rpx);
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}

		.store-image {
			width: 72rpx;
			height: 72rpx;
			border-radius: 50%;

			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
	}

	.store-one,
	.store-three {
		padding: 0 20rpx;
	}

	.store-two {
		.store-image {
			align-self: flex-start;
			margin-right: 14rpx;
		}

		.info-box {
			margin-bottom: 0 !important;
		}

		.store-info {
			height: 106rpx;
		}

		.switchover {
			display: flex;
			width: 120rpx;
		}
	}

	.store-three {
		.store-info {
			height: auto;
			justify-content: flex-start;
			flex-direction: inherit;
			align-items: center;
		}

		.info-box {
			margin-left: 18rpx;
			margin-bottom: 0 !important;
		}

		.store-icon text {
			font-size: 36rpx;
			color: #fff;
		}
	}

	.store-four {
		padding: 0 !important;

		.store-left-wrap {
			display: flex;
			align-items: center;
			line-height: 1;

			.iconweizhi {
				margin-right: 6rpx;
				font-size: 28rpx;
			}

			.iconunfold {
				margin-left: 6rpx;
			}

			.title {
				display: inline-block;
				max-width: 220rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		.store-right-search {
			width: calc(100% - 320rpx);
			position: relative;

			input {
				width: 100%;
				height: 72rpx;
				line-height: 72rpx;
				background-color: #ffffff;
				border: none;
				border-radius: 72rpx;
				padding-left: 30rpx;
				box-sizing: border-box;
			}

			.iconsousuo3 {
				position: absolute;
				right: 30rpx;
				top: 10rpx;
				font-size: 28rpx;
				color: #909399;
			}
		}
	}
</style>
