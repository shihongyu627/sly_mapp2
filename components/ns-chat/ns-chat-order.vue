<template>
	<view class="message">
		<view class="goods-item" v-if="orderdetails">
			<image :src="$util.img(orderdetails.order_goods ? orderdetails.order_goods[0].sku_image : '')" mode="aspectFill"></image>
			<view class="goods-info">
				<view class="goods-name">{{ orderdetails.order_goods ? orderdetails.order_goods[0].sku_name : '' }}</view>
				<view class="font-size-goods-tag">订单状态:{{ orderdetails.order_status_name }}</view>
				<view class="font-size-goods-tag">配送方式:{{ orderdetails.delivery_type_name }}</view>
				<view class="goods-bottom">
					<view class="goods-price color-base-text">
						<text class="goods-price-sign">￥</text>
						<text>{{ orderdetails.order_goods ? orderdetails.order_goods[0].price : '' }}</text>
					</view>
					<view class="goods-option font-size-goods-tag color-base-bg" @click="sendMsg('order')">发送</view>
				</view>
			</view>
		</view>
		<view class="goods-item" v-else-if="orderInfo">
			<image :src="$util.img(orderInfo.order_goods ? orderInfo.order_goods[0].sku_image : '')" mode="aspectFill"></image>
			<view class="goods-info">
				<view class="goods-name">{{ orderInfo.order_goods ? orderInfo.order_goods[0].sku_name : '' }}</view>
				<view class="font-size-goods-tag">订单状态:{{ orderInfo.order_status_name }}</view>
				<view class="font-size-goods-tag">配送方式:{{ orderInfo.delivery_type_name }}</view>
				<view class="goods-bottom">
					<view class="goods-price color-base-text">
						<text class="goods-price-sign">￥</text>
						<text>{{ orderInfo.order_goods ? orderInfo.order_goods[0].price : '' }}</text>
					</view>
					<view class="goods-option font-size-goods-tag disabled">已发送</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'ns-chat-order',
	props: {
		orderId: {
			type: [Number, String]
		},
		isCanSend: Boolean,
		orderdetails: {
			type: [Object]
		}
	},
	data() {
		return {
			orderInfo: {}
		};
	},
	mounted() {
		this.getGoodsInfo();
	},
	methods: {
		getGoodsInfo() {
			if (this.orderId) {
				this.$api.sendRequest({
					url: '/api/order/detail',
					data: {
						order_id: this.orderId
					},
					success: res => {
						if (res.code >= 0) {
							this.orderInfo = res.data;
						}
					}
				});
			}
		},
		sendMsg() {
			this.$emit('sendMsg', 'order');
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
				-webkit-line-clamp: 1;
				overflow: hidden;
				// font-size: $font-size-tag;
				margin-bottom: 10rpx;
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
						font-size: 20rpx;
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
