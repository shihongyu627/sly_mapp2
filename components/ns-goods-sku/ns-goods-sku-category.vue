<template>
	<view class="goods-sku" @touchmove.prevent.stop>
		<uni-popup ref="skuPopup" type="center" class="sku-layer">
			<view class="sku-content">
				<view class="sku-info" :style="{ height: systemInfo.windowHeight * 2 + 'rpx' }">
					<view class="header">
						<view class="img-wrap" @click="previewMedia()"><image :src="$util.img(goodsDetail.sku_image, { size: 'mid' })" @error="imageError()" /></view>
						<view class="main">
							<view class="goodname">{{ goodsDetail.goods_name }}</view>
							<view class="stock color-tip">库存{{ goodsDetail.stock }}{{ goodsDetail.unit }}</view>
						</view>
					</view>
					<view class="body-item">
						<scroll-view scroll-y class="wrap">
							<view class="sku-list-wrap" v-for="(item, index) in goodsDetail.goods_spec_format" :key="index">
								<text class="title font-size-tag">{{ item.spec_name }}</text>
								<view class="sku-list_item">
									<view
										v-for="(item_value, index_value) in item.value"
										:key="index_value"
										:class="{
											selected: item_value['selected'] || skuId == item_value.sku_id,
											disabled: item_value['disabled'] || (!item_value['selected'] && disabled)
										}"
										class="items color-line-border font-size-tag"
										@click="change(item_value.sku_id, item_value.spec_id)"
									>
										<image v-if="item_value.image" :src="$util.img(item_value.image, { size: 'small' })" @error="valueImageError(index, index_value)" />
										<text>{{ item_value.spec_value_name }}</text>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
					<view class="footer">
						<view class="sku-name font-size-goods-tag">
							<template v-if="goodsDetail.sku_spec_format" class="color-tip">
								已选择：
								<text class="color-tip" v-for="(item, index) in goodsDetail.sku_spec_format" :key="index">
									{{ item.spec_value_name }} {{ index != goodsDetail.sku_spec_format.length - 1 ? '&nbsp;/&nbsp;' : '&nbsp;' }}
								</text>
							</template>
						</view>
						<view class="footer-bottom">
							<view class="footer-left">
								<view class="price-wrap">
									<text class="price price-font">￥{{ goodsDetail.show_price }}</text>
								</view>
							</view>
							<view class="footer-right">
								<view class="change_num" v-if="number > 0">
									<view class="num-action" @click="changeNum('-')">
										<text class="desc iconfont iconjianshao color-base-text"></text>
										<view class="click-event"></view>
									</view>
									<input type="number" class="uni-input" @blur="blur" v-model="number" placeholder="0" @input="keyInput(false)" />
									<view class="num-action" :id="'select-sku-num-' + goodsDetail.goods_id" @click="changeNum('+', $event)">
										<text class="add iconfont iconadd-fill color-base-text change_hover"></text>
										<view class="click-event"></view>
									</view>
								</view>
								<view v-else-if="number == 0 && isLoad">
									<view class="num-action">
										<button type="primary" v-if="goodsDetail.stock && goodsDetail.stock != 0" @click="confirm($event)">加入购物车</button>
										<button type="primary" disabled="true" v-else>确定</button>
										<view class="click-event"></view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="sku-close iconfont icon2guanbi" @click="closeSkuPopup()"></view>
		</uni-popup>

		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup-sku-new.vue';
// 商品SKU
export default {
	name: 'ns-goods-sku-category',
	components: {
		uniPopup
	},
	props: {
		disabled: {
			type: Boolean,
			default: false
		},
		pointLimit: {
			type: [Number, String]
		}
	},
	data() {
		return {
			isIphoneX: false,
			systemInfo: {}, //系统信息
			number: 0,
			btnSwitch: false, //提交按钮防止重复提交
			type: '', //join_cart：加入购物车
			callback: null, //回调
			skuId: 0,
			limitNumber: 0, // 限购
			//是否开启预览，0：不开启，1：开启
			cartData: [], //购物车
			cartIdArr: [],
			goodsDetail: {},
			goodsSkuList: {}, // 商品规格项集合
			maxBuy: 0,
			minBuy: 0,
			isLoad: false,
			goodsCartNumber: 0
		};
	},
	created() {
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		this.systemInfo = uni.getSystemInfoSync();
	},
	watch: {
		pointLimit(newNum, oldNum) {
			this.limitNumber = Number(newNum);
		},
		goodsDetail(newData, oldData) {
			this.skuId = newData.sku_id;
		},
		minBuy(newData, oldData) {
			if (this.minBuy > 1) {
				this.number = Number(this.minBuy);
			}
		}
	},
	methods: {
		show(type, data, callback) {
			this.type = type;
			this.callback = callback;
			this.goodsDetail = data;
			this.getGoodsSkuList(this.goodsDetail.goods_id);
			this.skuId = this.goodsDetail.sku_id;
			this.maxBuy = this.goodsDetail.max_buy;
			this.minBuy = this.goodsDetail.min_buy;
			this.keyInput(false);
			this.isLoad = true;
			this.getCartData();
			this.getGoodsCartNum();
			this.$refs.skuPopup.open();
		},
		hide() {
			this.$refs.skuPopup.close();
		},
		change(skuId, spec_id) {
			if (this.disabled) return;
			this.btnSwitch = false;
			this.skuId = skuId;
			// 清空选择
			for (var i = 0; i < this.goodsDetail.goods_spec_format.length; i++) {
				var sku = this.goodsDetail.goods_spec_format[i];
				for (var j = 0; j < sku.value.length; j++) {
					// 排除当前点击的规格值
					if (spec_id == this.goodsDetail.goods_spec_format[i].value[j].spec_id) {
						this.goodsDetail.goods_spec_format[i].value[j].selected = false;
					}
				}
			}

			this.isLoad = true;
			if (this.goodsSkuList['sku_' + skuId]) {
				this.goodsDetail = Object.assign({}, this.goodsDetail, this.goodsSkuList['sku_' + skuId]);
			}
		},
		//查看规格图片
		previewMedia() {
			var paths = [];
			paths.push(
				this.$util.img(this.goodsDetail.sku_image, {
					size: 'big'
				})
			);
			uni.previewImage({
				current: 1,
				urls: paths
			});
		},
		// 获取普通商品规格集合
		getGoodsSkuList(goods_id) {
			this.$api.sendRequest({
				url: '/api/goodssku/goodsSkuByCategory',
				data: {
					goods_id
				},
				success: res => {
					if (res.code >= 0) {
						let data = res.data,
							obj = {};

						res.data.forEach((item, index) => {
							// 当前商品SKU规格
							if (item.sku_spec_format) item.sku_spec_format = JSON.parse(item.sku_spec_format);

							// 商品SKU格式
							if (item.goods_spec_format) item.goods_spec_format = JSON.parse(item.goods_spec_format);

							// 限时折扣
							if (item.promotion_type == 1) {
								item.discountTimeMachine = this.$util.countDown(item.end_time - res.timestamp);
							}

							if (item.promotion_type == 1 && item.discountTimeMachine) {
								if (item.member_price > 0 && Number(item.member_price) <= Number(item.discount_price)) {
									item.show_price = item.member_price;
								} else {
									item.show_price = item.discount_price;
								}
							} else if (item.member_price > 0) {
								item.show_price = item.member_price;
							} else {
								item.show_price = item.price;
							}

							obj['sku_' + item.sku_id] = item;
						});
						this.goodsSkuList = obj;
					}
				}
			});
		},
		changeNum(tag, event) {
			if (this.goodsDetail.stock == 0) return;

			var stock = this.goodsDetail.stock;
			var min = 1;

			if (this.goodsDetail.is_limit == 1 && this.maxBuy > 0 && this.maxBuy < stock) stock = this.maxBuy;

			if (this.goodsDetail.is_limit == 1 && this.goodsDetail.limit_type == 2 && this.maxBuy > 0 && this.goodsDetail.purchased_num > 0) {
				let maxBuy = this.maxBuy - this.goodsDetail.purchased_num;
				stock = maxBuy < this.goodsDetail.stock ? maxBuy : this.goodsDetail.stock;
			}

			if (this.minBuy > 1) {
				min = this.minBuy;
			}
			if (tag == '+') {
				// 加
				if (this.number < stock) {
					this.number++;
				} else {
					if (this.number >= this.goodsDetail.stock) {
						this.$util.showToast({
							title: '库存不足'
						});
						return;
					}

					if (this.goodsDetail.is_limit == 1 && this.maxBuy > 0) {
						if (this.goodsDetail.limit_type == 1) {
							this.$util.showToast({
								title: '该商品每次最多购买' + this.maxBuy + this.goodsDetail.unit
							});
							return;
						}

						if (this.goodsDetail.limit_type == 2) {
							let message = '该商品每人限购' + this.maxBuy + this.goodsDetail.unit;
							message += this.goodsDetail.purchased_num > 0 ? '，您已购买了' + this.goodsDetail.purchased_num + this.goodsDetail.unit : '';
							this.$util.showToast({
								title: message
							});
							return;
						}
					}
				}

				const query = uni.createSelectorQuery().in(this);
				query
					.select('#' + event.currentTarget.id + ' .click-event')
					.boundingClientRect(data => {
						if (data) {
							this.$emit('addCart', data.left, data.top);
						}
					})
					.exec();
			} else if (tag == '-') {
				// 减
				if (this.number > min) {
					this.number -= 1;
				} else {
					this.number = 0;
				}
			}
			if (this.number > this.limitNumber && this.limitNumber) {
				this.number = this.limitNumber;
			}
			if (this.number) {
				this.cartNumChange(this.number, this.cartIdArr[this.skuId]);
			} else {
				this.deleteCart();
			}
		},
		blur() {
			if (!this.number) {
				this.number = 1;
			}
			if (this.number > this.limitNumber && this.limitNumber) {
				this.number = this.limitNumber;
			}
			if (this.goodsDetail.is_limit && this.maxBuy > 0) {
				let maxBuy = this.maxBuy - this.goodsDetail.purchased_num;
				if (this.number > maxBuy) this.number = maxBuy;
			}
			if (this.number < this.minBuy && this.minBuy > 0) {
				this.number = this.minBuy;
			}

			let newNumber = parseInt(this.number);

			this.isLoad = false;
			setTimeout(() => {
				this.number = newNumber;
				this.cartNumChange(this.number, this.cartIdArr[this.skuId]);
			}, 0);
		},
		//输入数量
		keyInput(flag, callback) {
			setTimeout(() => {
				var stock = this.goodsDetail.stock;

				// 库存为0
				if (this.goodsDetail.stock == 0) {
					this.number = 0;
					return;
				}

				// 防止空
				if (flag && this.number.length == 0) this.number = 1;

				// 防止输入0和负数、非法输入
				if (flag && (this.number <= 0 || isNaN(this.number))) this.number = 1;

				if (this.number > stock) {
					this.number = stock;
				}
				// 商品起售数
				if (this.minBuy > 1 && this.number < this.minBuy) {
					this.number = this.minBuy;
				}

				if (flag) this.number = parseInt(this.number);

				if (callback) callback();
			}, 0);
		},

		//提交
		confirm(event) {
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open();
				return;
			}
			this.number = 1;
			//纠正数量
			this.keyInput(true, () => {
				if (this.goodsDetail.stock == 0) {
					this.$util.showToast({
						title: '商品已售罄'
					});
					return;
				}

				if (this.number > this.goodsDetail.stock) {
					this.$util.showToast({
						title: '库存不足'
					});
					return;
				}

				if (this.goodsDetail.is_limit == 1 && this.goodsDetail.limit_type == 1 && this.maxBuy > 0 && this.number > this.maxBuy) {
					this.$util.showToast({
						title: '该商品每次最多购买' + this.maxBuy + this.goodsDetail.unit
					});
					return;
				}

				if (this.goodsDetail.is_limit == 1 && this.goodsDetail.limit_type == 2 && this.maxBuy > 0 && this.number + this.goodsDetail.purchased_num > this.maxBuy) {
					let message = '该商品每人限购' + this.maxBuy + this.goodsDetail.unit;
					message += this.goodsDetail.purchased_num > 0 ? '，您已购买了' + this.goodsDetail.purchased_num + this.goodsDetail.unit : '';
					this.$util.showToast({
						title: message
					});
					return;
				}

				this.$emit('addCart', event.detail.x, event.detail.y);

				if (this.btnSwitch) return;
				this.btnSwitch = true;
				this.$api.sendRequest({
					url: '/api/cart/add',
					data: {
						sku_id: this.goodsDetail.sku_id,
						num: this.number
					},
					success: res => {
						var data = res.data;
						if (data > 0) {
							this.getCartData();
							this.$store.dispatch('getCartNumber');
							this.$util.showToast({
								title: '加入购物车成功'
							});
							if (this.callback) this.callback();
						}
						//this.$refs.skuPopup.close();
						this.btnSwitch = false;
					},
					fail: res => {
						this.$refs.skuPopup.close();
						this.btnSwitch = false;
					}
				});
			});
		},
		closeSkuPopup() {
			this.$refs.skuPopup.close();
		},
		imageError() {
			this.goodsDetail.sku_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		valueImageError(index, index_value) {
			this.goodsDetail.goods_spec_format[index].value[index_value].image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		//获取购物车的信息
		getCartData() {
			this.$api.sendRequest({
				url: '/api/cart/lists',
				success: res => {
					if (res.code >= 0) {
						var skuArr = [];
						var cartArr = [];
						if (res.data.length) {
							for (var index = 0; index < res.data.length; index++) {
								skuArr[res.data[index].sku_id] = res.data[index].num;
								cartArr[res.data[index].sku_id] = res.data[index].cart_id;
							}
						}
						this.cartData = skuArr;
						this.cartIdArr = cartArr;
					}
					this.number = this.cartData[this.skuId] ? this.cartData[this.skuId] : 0;
					this.$forceUpdate();
				}
			});
		},
		/**
		 * 变更购物车数量
		 * @param {Object} params
		 */
		cartNumChange(num, cartid) {
			if (num < 1) num = 1;
			this.modifyFlag = true;
			this.$api.sendRequest({
				url: '/api/cart/edit',
				data: {
					num,
					cart_id: cartid
				},
				success: res => {
					if (res.code >= 0) {
						this.cartData[this.skuId] = num;
						// this.calculationTotalPrice();
						this.$store.dispatch('getCartNumber');
						this.getGoodsCartNum();
					} else {
						// this.$util.showToast({ title: res.message });
					}
				}
			});
		},
		/**
		 * 删除购物车
		 * @param {Object} siteIndex
		 * @param {Object} cartIndex
		 */
		deleteCart() {
			this.$api.sendRequest({
				url: '/api/cart/delete',
				data: { cart_id: this.cartIdArr[this.skuId] },
				success: res => {
					if (res.code >= 0) {
						this.$store.dispatch('getCartNumber');
						this.getCartData();
						this.getGoodsCartNum();
					} else {
						// this.$util.showToast({ title: res.message });
					}
				}
			});
		},
		/**
		 * 获取商品在购物车数量
		 */
		getGoodsCartNum() {
			this.$api.sendRequest({
				url: '/api/cart/goodsnum',
				data: {
					goods_id: this.goodsDetail.goods_id
				},
				success: res => {
					if (res.code >= 0) {
						this.goodsCartNumber = res.data;
					}
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.sku-content {
	background: #ffffff;
	border-radius: 20rpx;
}
.sku-close {
	color: #fff;
	width: 50rpx;
	text-align: center;
	font-size: 76rpx;
	border-radius: 50%;
	margin: 40rpx auto 0;
}
.sku-layer .sku-info {
	width: 600rpx;
	height: 60vh !important;
	position: relative;
	z-index: 999;
}

.sku-layer .sku-info .header {
	// padding: 30rpx 0 30rpx 300rpx;
	/* #ifdef MP-ALIPAY */
	// padding: 50rpx 0 50rpx 300rpx;
	/* #endif */
	padding: 30rpx;
	display: flex;
	position: relative;
	border-bottom: 2rpx solid rgba(0, 0, 0, 0.1);
	z-index: 2;
}

.sku-layer .sku-info .header .img-wrap {
	width: 114rpx;
	height: 114rpx;
	margin-right: 20rpx;
	// position: absolute;
	// top: -56rpx;
	/* #ifdef MP-ALIPAY */
	// top: 20rpx;
	/* #endif */
	// left: 20rpx;
	border-radius: 8rpx;
	overflow: hidden;
	border: 2rpx solid rgba(0, 0, 0, 0.1);
	padding: 2rpx;
	background-color: #fff;
	line-height: 208rpx;
}

.sku-layer .sku-info .header .img-wrap image {
	width: 100%;
	height: 100%;
}

.sku-layer .sku-info .main {
	font-size: 24rpx;
	line-height: 40rpx;
	flex: 1;
	width: 0;
}
.sku-layer .sku-info .main .goodname {
	word-wrap: break-word;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	line-height: 1.3;
}
.footer-left .price {
	word-wrap: break-word;
	font-size: $font-size-toolbar;
	color: var(--price-color);
}

.sku-layer .sku-info .main .stock {
	margin-top: 20rpx;
	line-height: 1;
	font-size: $font-size-tag;
}

.sku-layer .sku-info .main .sku-name {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	height: 90rpx;
	overflow: hidden;
}

.sku-layer .sku-info .main .sku-name text {
	margin-right: 10rpx;
}

.sku-layer .sku-info .sku-close {
	position: absolute;
	top: 20rpx;
	right: 20rpx;
	width: 40rpx;
	height: 80rpx;
	font-size: 50rpx;
}

.sku-layer .body-item {
	padding: 0 30rpx 30rpx 30rpx;
	height: calc(100% - 282rpx);
	box-sizing: border-box;
	overflow: scroll;
}

.sku-layer .body-item .wrap {
	height: calc(100% - 116rpx);
}

.sku-layer .body-item .sku-list-wrap {
}

.sku-layer .body-item .sku-list-wrap .title {
	font-weight: 400;
	padding: 20rpx 0;
	margin: 0;
	display: block;
}
.sku-layer .body-item .sku-list-wrap .sku-list_item {
	display: flex;
	flex-wrap: wrap;
}
.sku-layer .body-item .sku-list-wrap .items {
	text-align: center;
	position: relative;
	display: inline-block;
	border: 2rpx solid $color-line;
	padding: 4rpx 30rpx;
	border-radius: 8rpx;
	margin: 0 20rpx 20rpx 0;
	background-color: #fff !important;
}
.sku-layer .body-item .sku-list-wrap .items.disabled {
	border: 2rpx dashed;
}

.sku-layer .body-item .sku-list-wrap .items image {
	height: 48rpx;
	width: 48rpx;
	border-radius: 4rpx;
	margin-right: 10rpx;
	display: inline-block;
	vertical-align: middle;
}

.sku-layer .body-item .number-wrap .number-line {
	padding: 20rpx 0;
	line-height: 72rpx;
}

.sku-layer .body-item .number-wrap .title {
	font-weight: 400;
}

.sku-layer .body-item .number-wrap .limit-txt {
}

.sku-layer .body-item .number-wrap .number {
	height: 72rpx;
	border-radius: 6rpx;
	float: right;
}

.sku-layer .body-item .number-wrap .number button {
	display: inline-block;
	line-height: 64rpx;
	height: 68rpx;
	width: 60rpx;
	font-size: 48rpx;
	box-sizing: content-box;
	border: 2rpx solid;
	padding: 0;
	margin: 0;
	border-radius: 0;
}

.sku-layer .body-item .number-wrap .number button.decrease {
	border-right: 2rpx solid #fff !important;
}

.sku-layer .body-item .number-wrap .number button.increase {
	border-left: 2rpx solid #fff !important;
}

.sku-layer .body-item .number-wrap .number button:after {
	border-radius: 0;
	border: none;
}

.sku-layer .body-item .number-wrap .number input {
	display: inline-block;
	line-height: 64rpx;
	height: 68rpx;
	width: 72rpx;
	text-align: center;
	font-weight: 700;
	border: 2rpx solid;
	margin: 0;
	padding: 0;
	vertical-align: top;
}

.sku-layer .footer {
	width: calc(100% - 60rpx);
	position: absolute;
	bottom: 26rpx;
	color: #fff;
	z-index: 1;
	border-top: 1rpx solid $color-line;
	padding: 30rpx 30rpx 0;
	background-color: #fff;

	// button {
	// 	width: 100%;
	// }
}
.sku-layer .footer .footer-bottom {
	margin-top: 24rpx;
	display: flex;
	justify-content: be;
	align-items: center;
	.footer-left {
		flex: 1;
	}
	.footer-right {
		width: 238rpx;
		text-align: right;
	}
	.footer-right button {
		margin-right: 0;
		width: 210rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 30rpx;
	}
}

.position-bottom {
	bottom: 98rpx !important;
}
// 数量加减样式
.change_num {
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
.change_num > text,
.change_num .iconfont {
	font-size: 48rpx;
}
.change_num input {
	width: 70rpx;
	height: 36rpx;
	line-height: 36rpx;
	text-align: center;
}
.change_num .num-action {
	position: relative;
}
.change_num .num-action .click-event {
	position: absolute;
	width: 2rpx;
	height: 2rpx;
	left: 0;
	top: 0;
	transform: translate(-50%, -50%);
	z-index: 5;
}
/deep/ .uni-popup__wrapper {
	background: transparent !important;
}
/deep/ .sku-layer .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: transparent !important;
}
/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: transparent !important;
}
</style>
