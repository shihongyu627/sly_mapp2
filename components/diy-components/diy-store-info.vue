<template>
	<view class="store-info" v-if="store">
		<view class="store-info-top">
			<view class="info-image">
				<image :src="$util.img(store.store_image)" v-if="store.store_image" mode="aspectFit"></image>
				<image :src="$util.getDefaultImage().store" v-else></image>
			</view>
			<view class="info-desc">
				<view class="store-name">
					<text class="title">{{ store.store_name }}</text>
					<text class="color-base-text far" v-if="store.distance">距离{{ store.distance }}km</text>
				</view>
				<view class="store-sign">
					<text class="ns-gradient-promotionpages-pintuan-payment color-base-text">营业中</text>
					<text class="ns-gradient-promotionpages-pintuan-payment color-base-text">门店自提</text>
				</view>
			</view>

			<!-- <text class="store-whole-country" @click="clearStore">
				全国
				<text class="iconfont iconright"></text>
			</text> -->
		</view>
		<view class="store-info-bottom" :style="{ backgroundColor: value.elementBgColor }">
			<view class="store-time store-item" v-if="store.open_date">
				<view class="store-icon iconfont iconshijian"></view>
				<text class="time-con">营业时间：{{ store.open_date }}</text>
			</view>
			<view class="store-phone store-item" v-if="store.telphone">
				<view class="phone-box">
					<view class="store-icon iconfont iconshouji"></view>
					<view class="phone">联系电话：{{ store.telphone }}</view>
				</view>
				<view class="takePhone iconfont icondianhua1 color-base-text" @click="phoneCall"></view>
			</view>
			<view class="store-address store-item" @click="mapRoute()" v-if="store.full_address || store.address">
				<view class="address-icon"><view class="store-icon iconfont iconlocation"></view></view>
				<view class="address">{{ $util.removeComma(store.address)}}</view>
			</view>
		</view>
	</view>
</template>

<script>
import Map from '@/common/js/map/openMap.js';
export default {
	props: {
		value: {
			type: Object
		},
		storeId: {
			type: [String, Number],
			default: 0
		}
	},
	data() {
		return {
			store: null
		};
	},
	computed: {
		// 定位信息
		location() {
			return this.$store.state.location;
		}
	},
	mounted() {
		if (this.location) {
			this.latitude = this.location.latitude;
			this.longitude = this.location.longitude;
		} else {
			this.$util.getLocation();
		}
		this.getInfo();
	},
	watch: {
		location: function(nVal) {
			if (nVal) {
				this.latitude = nVal.latitude;
				this.longitude = nVal.longitude;
				this.getInfo();
			}
		}
	},
	methods: {
		//打电话
		phoneCall() {
			uni.makePhoneCall({
				phoneNumber: this.store.telphone //仅为示例
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
						this.latitude = res.data.latitude;
						this.longitude = res.data.longitude;
						// uni.setStorageSync('store', this.store);
					}
				}
			});
		},
		mapRoute() {
			Map.openMap(Number(this.latitude), Number(this.longitude), this.store_name, 'gcj02');
		},
		clearStore() {
			let _this = getCurrentPages()[getCurrentPages().length - 1];
			// uni.setStorageSync('store', '');
			_this.refresh();
			this.$util.redirectTo('/pages/index/index');
		}
	}
};
</script>

<style lang="scss">
.store-info {
	width: 100%;
	box-sizing: border-box;
	.store-info-top {
		width: 100%;
		height: 100%;
		// background: #ffffff;
		display: flex;
		align-items: flex-start;
		// border-radius: 10rpx;
		// padding: 20rpx;
		// box-sizing: border-box;

		.info-image {
			width: 104rpx;
			height: 104rpx;
			border-radius: 50%;
			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		.info-desc {
			flex-grow: 1;
			display: flex;
			flex-direction: column;
			padding-left: 20rpx;
			box-sizing: border-box;
			.store-name {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.title {
					max-width: 60%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: $font-size-toolbar;
				}
				.far {
					font-size: $font-size-activity-tag;
				}
			}
			.store-sign {
				width: 100%;
				text {
					display: inline-block;
					padding: 2rpx 6rpx;
					font-size: $font-size-activity-tag;
					margin-right: 20rpx;
				}
			}
		}

		.store-whole-country {
			text {
				font-size: 26rpx;
				color: #666666;
			}
		}
	}
	.store-info-bottom {
		width: 100%;
		margin-top: 20rpx;
		border-radius: 10rpx;
		padding: 0 24rpx;
		box-sizing: border-box;
		overflow: hidden;
		// background: #ffffff;
		.store-item {
			border-bottom: 1rpx solid #f1f1f1;
		}
		.store-item:last-child {
			border: none;
		}
		.store-icon {
			width: 40rpx;
			height: 40rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			text {
				font-size: $font-size-toolbar;
				line-height: 1;
				color: #cccccc;
			}
		}
		.store-time {
			width: 100%;
			height: 90rpx;
			line-height: 90rpx;
			display: flex;
			align-items: center;
			.time-con {
				font-size: $font-size-tag;
				color: rgba(0, 0, 0, 1);
				line-height: 1;
			}
		}
		.store-phone {
			width: 100%;
			height: 90rpx;
			line-height: 90rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.phone-box {
				display: flex;
				align-items: center;
			}
			.phone {
				font-size: $font-size-tag;
				color: rgba(0, 0, 0, 1);
				line-height: 1;
			}
			.makePhone {
				font-size: $font-size-toolbar;
			}
		}
		.store-address {
			width: 100%;
			display: flex;
			.address-icon {
				width: 40rpx;
				height: 90rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.address {
				flex-grow: 1;
				padding-top: 25rpx;
				font-size: $font-size-tag;
				line-height: 40rpx;
				padding-bottom: 10rpx;
			}
		}
	}
}
</style>
