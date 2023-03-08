<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<view class="combo-package" :class="isIphoneX ? 'combo-iphonex' : ''">
			<view class="combo-package-content">
				<view class="combo-package-name color-title">{{ combo.bl_name }}</view>

				<view v-for="(item, index) in combo.bundling_goods" :key="index" class="goods-info" @click="toGoodsDetail(item)">
					<view class="goods-img">
						<view class="img-wrap"><image :src="$util.img(item.sku_image, { size: 'mid' })" @error="imageError(index)" mode="aspectFit" /></view>
					</view>
					<view class="data-info">
						<view class="goods-name">{{ item.sku_name }}</view>
						<view class="price-wrap">
							<text class="unit price-style small">{{ $lang('common.currencySymbol') }}</text>
							<text class="price price-style large">{{ parseFloat(item.price).toFixed(2).split(".")[0] }}</text>
							<text class="unit price-style small">.{{ parseFloat(item.price).toFixed(2).split(".")[1] }}</text>
							<text class="num">x1</text>
						</view>
						<view class="stock-tips color-base-text" v-if="item.stock < num">
							库存不足，剩余：{{ item.stock }}
							<block v-if="item.unit">{{ item.unit }}</block>
							<block v-else>件</block>
						</view>
					</view>
				</view>
			</view>

			<view class="footer" :class="isIphoneX ? 'padding-bottom' : ''">
				<view class="price-wrap">
					<text class="label">套餐价：</text>
					<text class="unit price-color">{{ $lang('common.currencySymbol') }}</text>
					<text class="price price-color">{{ parseFloat(packagePrice).toFixed(2).split(".")[0] }}</text>
					<text class="unit price-color">.{{ parseFloat(packagePrice).toFixed(2).split(".")[1] }}</text>
					
					<!-- <text class="info-num">为您节省：{{ $lang('common.currencySymbol') }} {{ saveThePrice }}</text> -->
				</view>
				<button class="footer-btn" v-if="isDisabled" type="primary" @click="comboBuy()" size="mini">立即购买</button>
				<button class="footer-btn" v-else disabled>立即购买</button>
			</view>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
export default {
	data() {
		return {
			num: 1, //购买数量
			blId: 0, //商品id
			combo: [],
			packagePrice: [], //套餐价
			saveThePrice: 0, //节省价格
			isDisabled: false, //按钮失效
			isIphoneX: false //判断是否是iphoneX以上的设备
		};
	},
	onLoad(e) {
		this.blId = e.bl_id || 0;
		this.isIphoneX = this.$util.uniappIsIPhoneX();
	},
	onShow() {
		setTimeout( () => {
			if (this.addonIsExist && !this.addonIsExist.bundling) {
				this.$util.showToast({
					title: '商家未开启组合套餐',
					mask: true,
					duration: 2000
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
				}, 2000);
				return;
			}
		}, 1000);
		
		
		this.getDetail();
	},
	onHide() {
		this.btnSwitch = true;
	},
	methods: {
		// 获取套餐详情
		getDetail() {
			this.$api.sendRequest({
				url: '/bundling/api/bundling/detail',
				data: {
					bl_id: this.blId
				},
				success: res => {
					if (res.data) {
						this.combo = res.data;
						this.numberChange();
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		toGoodsDetail(e) {
			this.$util.redirectTo('/pages/goods/detail', { goods_id: e.goods_id });
		},
		numberChange(flag, callback) {
			setTimeout(() => {
				var disabledCount = 0;

				// 防止空
				if (flag && this.num.length == 0) {
					this.num = 1;
					disabledCount++;
				}

				// 防止输入0和负数、非法输入
				if (flag && (this.num <= 0 || isNaN(this.num))) {
					this.number = 1;
					disabledCount++;
				}

				if (flag) this.num = parseInt(this.num);

				var price = 0;
				for (var i = 0; i < this.combo.bundling_goods.length; i++) {
					price += parseFloat(this.combo.bundling_goods[i].price);
					//检测库存
					if (this.combo.bundling_goods[i].stock < this.num) disabledCount++;
				}
				this.isDisabled = !(disabledCount > 0);

				this.saveThePrice = ((price - this.combo.bl_price) * this.num).toFixed(2);
				this.packagePrice = (this.combo.bl_price * this.num).toFixed(2);
				if (callback) callback();
			}, 0);
		},
		// 套餐立即购买点击
		async comboBuy() {
			if (!this.isDisabled) return;
			//纠正数量
			this.numberChange(true, () => {
				if (!uni.getStorageSync('token')) {
					this.$refs.login.open('/pages_promotion/bundling/detail?bl_id=' + this.blId);
					return;
				}

				if (this.btnSwitch == false) return;

				this.btnSwitch = false;

				var data = {
					bl_id: this.blId,
					num: this.num
				};

				uni.setStorage({
					key: 'comboOrderCreateData',
					data: data,
					success: () => {
						this.$util.redirectTo('/pages_promotion/bundling/payment');
						this.btnSwitch = true;
					}
				});
			});
			
		},
		imageError(index) {
			this.combo.bundling_goods[index].sku_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		}
	},
	onShareAppMessage(res) {
		var title = '购买套餐，优惠多多哦';
		var path = '/pages_promotion/combo/detail?bl_id=' + this.blId;
		return {
			title: title,
			path: path,
			success: res => {},
			fail: res => {}
		};
	}
};
</script>

<style lang="scss">
.combo-package {
	border-radius: $border-radius;
	margin: 20rpx 30rpx;
	margin-bottom: 160rpx;
	background: #ffffff;

	&.combo-iphonex {
		margin-bottom: 230rpx;
	}

	.combo-package-content {
		// padding-bottom: 40rpx;

		.combo-package-name {
			padding: 20rpx 30rpx;
		}

		.goods-info {
			overflow: hidden;
			padding: $padding 30rpx;
			border-radius: $border-radius;

			.goods-img {
				display: inline-block;
				width: 30%;
				text-align: center;
				line-height: 100%;
				float: left;

				.img-wrap {
					display: inline-block;
					width: 180rpx;
					height: 180rpx;
					text-align: center;
					border-radius: $border-radius;

					image {
						height: 100%;
						width: 100%;
						vertical-align: middle;
					}
				}
			}

			.data-info {
				display: inline-block;
				width: 66%;
				float: left;
				position: relative;
				margin-left: 20rpx;
				height: 180rpx;

				.goods-name {
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					display: -webkit-box;
					line-height: 150%;
					// margin-bottom: 20rpx;
				}
				.stock-tips {
					position: absolute;
					width: 100%;
					bottom: 50rpx;
					height: 40rpx;
					line-height: 40rpx;
					font-size: $font-size-tag;
				}

				.price-wrap {
					height: 50rpx;
					line-height: 50rpx;
					position: absolute;
					width: 100%;
					bottom: 0;
					.unit {
						font-weight: bold;
						font-size: $font-size-tag;
						margin-right: 4rpx;
					}
					.price {
						font-weight: bold;
						font-size: $font-size-toolbar;
					}

					.num {
						float: right;
					}
				}
			}
		}
	}
	.footer {
		width: 100%;
		background: #fff;
		display: flex;
		justify-content: space-between;
		padding: 20rpx 24rpx;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 0;

		.price-wrap {
			flex: 1;
			text-align: right;
			vertical-align: middle;
			line-height: 70rpx;
			margin-right: 30rpx;
			.label {
				font-size: $font-size-base;
			}
			.unit {
				font-weight: bold;
				font-size: $font-size-tag;
				margin-right: 4rpx;
			}
			.price {
				font-weight: bold;
				font-size: $font-size-toolbar;
			}
			.info-num {
				font-size: $font-size-activity-tag;
				color: $color-tip;
				line-height: 1;
				margin-top: 12rpx;
			}
		}

		.footer-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 70rpx;
			line-height: 70rpx;
		}
	}
	.padding-bottom {
		padding-bottom: 80rpx;
	}
}
</style>
