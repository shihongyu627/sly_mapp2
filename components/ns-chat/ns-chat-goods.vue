<template>
	<view class="message">
		<view class="goods-item" v-if="goodsInfo.goods_name">
			<image :src="$util.img(goodsInfo.sku_image)" mode="aspectFill"></image>
			<view class="goods-info">
				<view class="goods-name">{{ goodsInfo.sku_name ? goodsInfo.sku_name : goodsInfo.goods_name }}</view>
				<view class="goods-bottom">
					<view class="goods-price">
						<text class="goods-price-sign color-base-text">￥</text>
						<text class="color-base-text">{{ goodsInfo.price }}</text>
					</view>
					<view class="goods-option font-size-goods-tag disabled">已发送</view>
				</view>
			</view>
		</view>
		<view class="goods-item" v-else-if="goodsDetail">
			<image :src="$util.img(goodsDetail.sku_image)" mode="aspectFill"></image>
			<view class="goods-info">
				<view class="goods-name">{{ goodsDetail.sku_name ? goodsDetail.sku_name : goodsDetail.goods_name }}</view>
				<view class="goods-bottom">
					<view class="goods-price">
						<text class="goods-price-sign color-base-text">￥</text>
						<text class="color-base-text">{{ goodsDetail.price }}</text>
					</view>
					<view class="goods-option font-size-goods-tag color-base-bg" @click="sendMsg('goods')">发送</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'ns-chat-goods',
	props: {
		skuId: {
			type: [Number, String]
		},
		goodsDetail: {
			type: [Object]
		}
	},
	data() {
		return {
			goodsInfo: {}
		};
	},
	mounted() {
		this.getGoodsInfo();
	},
	methods: {
		getGoodsInfo() {
			this.$api.sendRequest({
				url: '/api/goodssku/detail',
				data: {
					sku_id: this.skuId
				},
				success: res => {
					if (res.code >= 0) {
						this.goodsInfo = res.data.goods_sku_detail;
					}
				}
			});
		},
		sendMsg() {
			this.$emit('sendMsg', 'goods');
		}
	}
};
</script>

<style lang="scss">
.message {
	padding: 13rpx 20rpx;
	box-sizing: border-box;
	width: 100vw;
	position: relative;
	.goods-item {
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
		}
		.goods-info {
			width: 100%;
			height: 180rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding-left: 20rpx;
			box-sizing: border-box;
			.goods-name {
				width: 100%;
				line-height: 1.4;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
			.goods-bottom {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				text {
					line-height: 1;
				}
				.goods-price {
					display: flex;
					align-items: flex-end;
					padding-bottom: 10rpx;
					font-weight: 500;
					.goods-price-sign {
						font-size: $font-size-activity-tag;
					}
				}
				.goods-option {
					width: 150rpx;
					height: 50rpx;
					line-height: 50rpx;
					text-align: center;
					border-radius: $border-radius;
					color: #ffffff;
				}
			}
		}
		.disabled {
			background: #e5e5e5;
		}
	}
}
</style>
