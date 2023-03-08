<template>
	<view class="goods">
		<view class="goods-msg">
			<image :src="$util.img(goodsINfo.sku_image)" mode="aspectFill"></image>
			<view class="goods-item">
				<view class="title">{{ goodsINfo.goods_name }}</view>
				<view class="goods-sku">
					库存:{{ goodsINfo.stock }}
					<text>销量:{{ goodsINfo.sale_num }}</text>
				</view>
				<view class="goods-price">
					<view class="price color-base-text">
						<text class="price-util">￥</text>
						<text class="price-num">{{ goodsINfo.price }}</text>
					</view>
					<view class="see-shop color-base-text" @click="go_shop()">
						查看商品
						<text class="iconfont iconright"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ns-chat-receiveGoods',
		props: {
			skuId: {
				type: [Number, String]
			}
		},
		data() {
			return {
				goodsINfo: {}
			};
		},
		mounted() {
			this.getInfo();
		},
		methods: {
			getInfo() {
				this.$api.sendRequest({
					url: '/api/goodssku/detail',
					data: {
						sku_id: this.skuId
					},
					success: res => {
						if (res.code >= 0) {
							this.goodsINfo = res.data.goods_sku_detail;
							this.$emit('upDOM');
							// that.setPageScrollTo();
						}
					}
				});
			},
			go_shop() {
				this.$util.redirectTo('/pages/goods/detail?goods_id=' + this.goodsINfo.goods_id);
			}
		}
	};
</script>

<style lang="scss">
	.goods {
		padding: 13rpx 20rpx;
		box-sizing: border-box;
		width: 100vw;
		position: relative;

		.goods-msg {
			width: 100%;
			height: 220rpx;
			background: #ffffff;
			position: relative;
			display: flex;
			align-items: center;
			border-radius: 20rpx;
			margin: 0 auto;
			padding: $padding;
			box-sizing: border-box;

			image {
				width: 180rpx;
				height: 180rpx;
				min-width: 180rpx;
				border-radius: $border-radius;
			}

			.goods-item {
				width: 100%;
				height: 180rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding-left: 20rpx;
				box-sizing: border-box;

				.title {
					width: 100%;
					line-height: 1.4;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}

				.goods-sku {
					color: $color-sub;

					text {
						padding-left: $padding;
					}
				}

				.goods-price {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.price {
						.price-util {
							font-size: $font-size-activity-tag;
						}
					}

					.see-shop {
						display: flex;
						align-items: center;

						text {
							padding-top: 4rpx;
							padding-left: 4rpx;
							font-size: $font-size-sub;
						}
					}
				}
			}
		}
	}
</style>
