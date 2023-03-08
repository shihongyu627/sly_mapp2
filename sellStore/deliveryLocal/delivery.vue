<template>
	<view class="stock-box">
		<mescroll-uni ref="mescroll" @getData="getGoodsList">
			<block slot="list">
				<view class="cart-wrap">
					<view v-for="(item, siteIndex) in goodsList" :key="siteIndex" class="cart-goods">
						<view class="goods-wrap" :class="{ edit: item.edit }">
							<view class="iconfont"
								:class="item.checked ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'"
								@click="selectGoods(item)"></view>
							<view @click="toGoodsDetail(item)" class="goods-img">
								<image :src="$util.loadimg(item.goods_image)" mode="aspectFill"></image>
							</view>
							<view class="goods-info">
								<view @click="toGoodsDetail(item)" class="goods-name">{{ item.goods_name }}</view>
								<view class="goods-sub-section">
									<view class="goods-price price-color color-base-text">
										<view class="bottom-price price-color color-base-text">
											<text class="unit">￥</text>
											{{ item.price }}
										</view>
									</view>
									<uni-number-box v-if="type=='in'" min="1" size="small" :modifyFlag="modifyFlag"
										:value="item.num" @change="cartNumChange($event, item )" />
									<view class="" v-if="type=='out'">
										<view class="select-num">
											选择提货数量
										</view>
										<uni-number-box min="1" :max="item.stock_cloud" size="small"
											:modifyFlag="modifyFlag" :value="item.num"
											@change="cartNumChange($event, item )" />
									</view>

								</view>
							</view>
						</view>
						<view class="item-del color-base-bg" :class="{ show: item.edit }"
							@click="deleteCart('single', siteIndex, cartIndex)">{{ $lang('del') }}</view>
					</view>
				</view>
				<view v-if="goodsList.length == 0 && emptyShow">
					<ns-empty text="暂无商品"></ns-empty>
				</view>
				<view class="deliveryLocal-desc" v-if="type=='out'">
					<view class="deliveryLocal-item">
						<img class='address-icon' src="@/common/img/address_icon.png" mode="aspectFill" />
						<view class="">
							{{ $util.removeComma(storeInfo.full_address) }}{{ storeInfo.address }}
						</view>
					</view>
					<view class="deliveryLocal-item deliveryLocal-item1">
						温馨提示：{{desc}}
					</view>
				</view>



			</block>
		</mescroll-uni>
		<view class="cart-bottom" :class="{ active: isIphoneX }">
			<view class="all-election" @click="allElection">
				<view class="iconfont" :class="checkAll ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'">
				</view>
				<text>全选</text>
				<view class="settlement-info">
					合计：<text class="color-base-text price-color font-size-toolbar">{{ totalPrice ||0}}</text>
				</view>
			</view>

			<view class="action-btn" @click="settlement">
				{{ title }}
			</view>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	import nsGoodsRecommend from '@/components/ns-goods-recommend/ns-goods-recommend.vue';
	import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue';
	import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
	export default {
		components: {
			nsGoodsRecommend,
			uniNumberBox,
			diyBottomNav,
		},
		data() {
			return {
				title: "",
				goods_ids: '',
				goodsList: [],
				checkAll: true,
				startX: '', // 触摸开始位置
				endX: '', // 触摸结束位置
				totalPrice: 0,
				totalCount: 0,
				isIphoneX: false, //判断手机是否是iphoneX以上,
				newIdsStr: "",
				newIdsArr: [],
				type: '',
				isSub: false,
				desc: '提交订单会将产品发往店，请注意查收；如用于审核下级订单，请勿提交提货申请',
				storeInfo: {}
			};
		},
		mixins: [globalConfig],
		onLoad(options) {
			if (options.type == 'in') {
				this.$langConfig.title('进货单');
				this.title = '进货'
				this.type = options.type
			} else {
				this.$langConfig.title('提货单');
				this.title = '提货'
				this.type = options.type
			}
			this.goods_ids = options.goods_ids
			this.storeInfo = uni.getStorageSync('memberInfo') || {};
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			if (uni.getStorageSync('token')) {
				// this.getCartData();
			} else {
				this.token = '';
				this.goodsList = [];
			}
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			if (this.$util.uniappIsIPhone11()) {
				this.cartBottom = '90px';
			}
		},
		onReady() {
			if (!uni.getStorageSync('token')) {
				if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
			}
		},
		methods: {
			//选择
			selectGoods(data) {
				console.log(data, 99);
				let arr = this.goodsList || []
				arr.map((item) => {
					if (item.goods_id == data.goods_id) {
						item.checked = !item.checked
					}
				})
				let goodsIds = []
				let totalPrice = 0
				arr.map((item => {
					if (item.checked) {
						goodsIds.push(item.goods_id)
						let total = Number(item.num) * Number(item.price)
						totalPrice += total
					}
				}))
				if (goodsIds.length == arr.length) {
					this.checkAll = true
				} else {
					this.checkAll = false
				}
				this.goodsList = arr
				this.newIdsArr = goodsIds
				this.newIdsStr = goodsIds.join(',')
				this.totalPrice = parseFloat(totalPrice).toFixed(2)
				console.log(this.newIdsStr);
			},
			//计算
			cartNumChange(num, data) {
				let totalPrice = 0
				if (isNaN(num)) return;
				console.log(num, data);
				let arr = this.goodsList || []
				arr.map((item) => {
					if (item.goods_id == data.goods_id) {
						item.num = num
					}
					let total = Number(item.num) * Number(item.price)
					console.log(total, '计算');
					totalPrice += total
				})
				console.log(arr, 999, parseFloat(totalPrice).toFixed(2));
				this.goodsList = arr
				this.totalPrice = parseFloat(totalPrice).toFixed(2)
			},
			/**
			 * 结算
			 */
			settlement() {
				let arr = this.goodsList || []
				let goodsArr = []
				arr.map((item) => {
					if (item.checked) {
						let obj = {}
						obj.goods_id = item.goods_id
						obj.goods_num = item.num
						goodsArr.push(obj)
					}
				})
				if (goodsArr.length == 0) {
					this.$util.showToast({
						title: '请选择商品进行下单'
					});
					return
				}
				if (this.isSub) return;
				this.isSub = true;
				let goodsStr = JSON.stringify(goodsArr)
				this.$util.redirectTo('/sellStore/stock/payment/payment', {
					goodsStr: goodsStr,
					type: this.type
				});
				this.isSub = false;
				// uni.redirectTo({
				// 	url: `/sellStore/stock/payment/payment?goodsStr=${goodsStr}&type=${this.type}`
				// })
			},
			getGoodsList(mescroll) {
				this.$api.sendRequest({
					url: '/dealer/api/goods/page',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						goods_ids: this.goods_ids,
					},
					success: res => {
						let newArr = []
						let msg = res.message;
						if (res.code == 0 && res.data) {
							if (res.data.page_count == 0) {
								this.emptyShow = true
							}
							newArr = res.data.list;
							newArr.map((item) => {
								item.checked = true
								item.num = 1
							})
							this.stockInfo = res.data
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
		}
	};
</script>

<style lang="scss" scoped>
	.allPage {
		height: calc(100vh - 110rpx);
		padding-bottom: 110rpx;
		overflow-y: auto;

		&.bottom {
			height: calc(100vh - 210rpx);
			padding-bottom: 210rpx;
		}
	}

	.cart-header {
		padding: 20rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		line-height: 40rpx;
		background: #fff;

		&.fixed {
			height: 28px;
			position: absolute;
			width: 100%;
			margin-bottom: 48px;
			z-index: 100;
		}

		.num-wrap {
			margin-left: $margin-both;

			text {
				padding: 0 8rpx;
			}
		}

		.cart-action {
			line-height: inherit;
			margin-right: $margin-both;
		}

		&.invalid {
			margin-left: $margin-both;
			margin-top: $margin-updown;
			flex: 1;
			line-height: inherit;
		}
	}

	.cart-wrap {
		margin-bottom: $margin-updown;

		.fixed-wrap {
			height: 10rpx;
		}

		&.invalid {
			.cart-header {
				margin: 0 $margin-both;
			}
		}

		.cart-goods {
			margin: 0 $margin-both;
			background: #fff;
			box-sizing: border-box;
			position: relative;
			padding: 30rpx 30rpx 0;
			margin-top: 10px;
			border-radius: 10px;

			&:nth-of-type(2) {
				border-top-left-radius: $border-radius;
				border-top-right-radius: $border-radius;
			}

			&:last-child {
				border-bottom-left-radius: $border-radius;
				border-bottom-right-radius: $border-radius;
				padding-bottom: 30rpx;
			}

			.goods-wrap {
				display: flex;
				position: relative;
				padding-left: 64rpx;
				transition: all 0.1s;

				&>.iconfont {
					font-size: 40rpx;
					position: absolute;
					top: 50%;
					left: 0;
					transform: translateY(-50%);
					transition: all 0.2s;
				}

				&>.iconyuan_checkbox {
					color: $color-disabled;
				}

				&.edit {
					transform: translateX(-70rpx);

					>.iconfont {
						opacity: 0;
					}
				}

				.goods-img {
					width: 180rpx;
					height: 180rpx;
					margin-right: 20rpx;
					border-radius: $border-radius;

					image {
						width: 100%;
						height: 100%;
						border-radius: $border-radius;
					}
				}

				.goods-info {
					flex: 1;
					position: relative;
					width: calc(100% - 220rpx);
					margin-top: -4rpx;

					.goods-name {
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						line-height: 1.5;
						font-size: $font-size-base;
					}

					.sku {
						display: flex;
						line-height: 1;
						margin-top: 8rpx;

						.goods-spec {
							color: $color-tip;
							font-size: $font-size-tag;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							flex: 1;
							// text {
							// 	margin-right: 20rpx;
							// 	&:last-child {
							// 		margin-right: 0;
							// 	}
							// }
						}
					}

					.goods-sub-section {
						position: absolute;
						left: 0;
						bottom: 0;
						display: flex;
						justify-content: space-between;
						width: 100%;

						.unit {
							font-size: $font-size-tag;
							margin-right: 4rpx;
						}

						.uni-numbox {
							position: absolute;
							right: 0;
							bottom: 8rpx;
						}

						.goods-price {
							display: flex;
							flex-direction: row;
							font-weight: bold;
							align-items: flex-end;

							.bottom-price {
								width: 100%;
								font-size: $font-size-toolbar;

								image {
									width: 56rpx;
									height: 22rpx;
									margin-left: 6rpx;
								}
							}
						}
					}
				}
			}

			.select-num {
				color: #000;
				font-size: $font-size-tag;
				overflow: hidden;
				text-align: center;
				margin-bottom: 5px;
			}

			.item-del {
				position: absolute;
				width: 0;
				height: 90%;
				color: #fff;
				right: 0;
				top: 20rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				transition: all 0.3s;
				overflow: hidden;
				white-space: nowrap;
				font-size: $font-size-tag;

				&.show {
					width: 90rpx;
				}
			}
		}

		.invalid-goods {
			.invalid-mark {
				color: $color-tip;
				padding: 6rpx 16rpx;
				display: inline-block;
				font-size: $font-size-goods-tag;
			}
		}
	}

	.cart-bottom {
		position: fixed;
		width: 100vw;
		height: 120rpx;
		background: #fff;
		overflow: hidden;
		display: flex;
		bottom: 0;
		z-index: 9999;
		align-items: center;
		justify-content: space-between;

		.all-election {
			height: 120rpx;
			position: relative;
			display: inline-block;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			margin-left: 30rpx;

			&>.iconfont {
				font-size: 40rpx;
				// position: absolute;
				// top: 50%;
				// left: 30rpx;
				// transform: translateY(-50%);
			}

			&>.iconyuan_checkbox {
				color: $color-disabled;
			}

			&>text {
				// margin-left: 56rpx;
				// line-height: 100rpx;
				padding-left: 20rpx;
			}
		}

		.settlement-info {
			padding-left: 30rpx;
			display: flex;
			flex-direction: row;
			align-items: center;

			text {
				font-weight: bold;
			}
		}

		.action-btn {
			width: 260rpx;
			height: 88rpx;
			background: #1189F4;
			opacity: 1;
			border-radius: 44rpx;
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: 400;
			line-height: 88rpx;
			color: #FFFFFF;
			opacity: 1;
			text-align: center;
			margin-right: 20rpx;
		}
	}

	.cart-bottom.active {
		bottom: calc(constant(safe-area-inset-bottom) + 55px) !important;
		bottom: calc(env(safe-area-inset-bottom) + 55px) !important;
	}

	.deliveryLocal-desc {
		margin: 20rpx 30rpx 0;
		background: #fff;
		margin-top: 20rpx;
		box-sizing: border-box;
		border-radius: 8rpx;
	}

	.deliveryLocal-item {
		width: 650rpx;
		opacity: 1;
		margin: 0 auto;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		font-size: 26rpx;
		font-family: PingFang SC-Medium, PingFang SC;
		font-weight: 400;
		color: #65666E;
		display: flex;
		flex-direction: row;
		align-items: center;
		.address-icon{
			width: 40rpx;
			height: 30rpx;
			margin-right: 10rpx;
		}
	}

	.deliveryLocal-item1 {
		border-top: 1px solid #F2F2F2;
		width: 652rpx;
		color: #1189F4;
	}

	.cart-empty {
		text-align: center;
		padding: 140rpx $padding 80rpx $padding;

		image {
			width: 63%;
			height: 450rpx;
		}

		button {
			min-width: 300rpx;
			margin-top: 100rpx;
			height: 70rpx;
			line-height: 70rpx !important;
			font-size: $font-size-base;
		}
	}
</style>
<style scoped>
	/deep/ .reward-popup .uni-popup__wrapper-box {
		background: none !important;
		max-width: unset !important;
		max-height: unset !important;
	}

	/deep/ .decrease {
		width: 52rpx;
		height: 52rpx;
		line-height: 46rpx !important;
		font-size: 40rpx;
		border-radius: 10rpx 0px 0px 10rpx;
	}

	/deep/ input {
		height: 52rpx;
		line-height: 52rpx !important;
	}

	/deep/ .increase {
		width: 52rpx;
		height: 52rpx;
		line-height: 52rpx !important;
		font-size: 40rpx;
		border-radius: 0px 10rpx 10rpx 0px;
	}

	.iconyuan_checked {
		color: #1189F4 !important
	}

	.price-color {
		color: #FA5D34 !important;
	}
</style>
