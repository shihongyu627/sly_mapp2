<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="order-container" :class="{ 'safe-area': isIphoneX }">
		 
		<!-- 店铺 -->
		<view class="site-wrap">
			<view class="site-body">
				<view class="card-head">
					<image :src="$util.img(orderDetail.card_right_type == 'balance' ? 'public/uniapp/giftcard/order-icon-recharge.png' : 'public/uniapp/giftcard/order-icon-gift.png')" mode="widthFix"></image>
					<text>{{orderDetail.card_right_type == 'balance' ? '储值卡' : '礼品卡' }}</text>
					<view class="order-status ">{{orderDetail.order_status_name}}</view>
				</view>
				<view class="giftcard-wrap" @click="toCardInfo()">
					<view class="card-img">
						<image
							:src="orderDetail.card_cover ? $util.img(orderDetail.card_cover) : $util.img('public/uniapp/giftcard/default_card.png')"
							mode="aspectFill"
						></image>
					</view>
					<view class="goods-info">
						<view class="goods-name">{{orderDetail.order_name}}</view>
						<view class="goods-price price-font">
							￥{{orderDetail.goods_money}}
						</view>
					</view>
				</view>
				
				<view class="order-content">
					<view class="content-item">
						<view class="label">订单号</view>
						<view class="value">{{orderDetail.order_no}}</view>
					</view>
					<view class="content-item">
						<view class="label">下单时间</view>
						<view class="value">{{$util.timeStampTurnTime(orderDetail.create_time)}}</view>
					</view>
					<view class="content-item">
						<view class="label">买家留言</view>
						<view class="value">{{orderDetail.buyer_message ? orderDetail.buyer_message : '无'}}</view>
					</view>
					<view class="content-item">
						<view class="label">购买数量</view>
						<view class="value">{{orderDetail.num}}</view>
					</view>
					<view class="content-item">
						<view class="label">订单金额</view>
						<view class="value">￥{{orderDetail.order_money}}</view>
					</view>
				</view>
				
				<view class="button" v-if="orderDetail.order_status == 'topay'">
					<view class="button-left"><button  size="mini" @click="closeOrder(orderDetail.order_id)">关闭订单</button></view>
					<view class="button-right">
						<button size="mini" type="primary" @click="openChoosePayment()">立即支付</button>
					</view>
				</view>
				<view class="button" v-if="orderDetail.order_status == 'complete'">
					<view class="button-right">
						<button size="mini" type="primary" @click="$util.redirectTo('/pages_promotion/giftcard/list', {order_id: orderDetail.order_id})">查看卡包</button>
					</view>
				</view>
			</view>
		</view>

		<view class="tab-bar-placeholder"></view>
		<!-- 选择支付方式弹窗 -->
		<ns-payment ref="choosePaymentPopup" :payMoney="orderDetail.pay_money" :isBalance="orderDetail && orderDetail.giftcard_info &&  orderDetail.giftcard_info.card_right_type != 'balance' ? 1 : 0 " @confirm="gotoBuy()"></ns-payment>

		<loading-cover ref="loadingCover"></loading-cover>
		
		<!-- 门店自提、同城配送时间选择 -->
		<ns-select-time @selectTime='selectTime' ref="TimePopup"></ns-select-time>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';

export default {
	components: {
		uniPopup,
	},
	data() {
		return {
			isIphoneX:false,
			orderId: '',
			orderDetail: 'all',
			goodsOpen:true,
		};
	},
	onLoad(option) {
		if(option.order_id) this.orderId = option.order_id;
		// 小程序扫码进入，接收source_member
		if (option.scene) {
			var sceneParams = decodeURIComponent(option.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('order_id') != -1) this.orderId = item.split('-')[1];
				});
			}
		}
		this.getData();
	},
	onShow() {
		this.isIphoneX = this.$util.uniappIsIPhoneX()
	},
	methods: {
		getData() {
			this.$api.sendRequest({
				url: '/giftcard/api/order/detail',
				data: {
					order_id: this.orderId,
				},
				success: res => {
					if(res.code >= 0){
						this.orderDetail = res.data;
						setTimeout(() => {
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						}, 300);
					}else{
						this.$util.showToast({
							'title' : res.message
						})
						setTimeout(() => {
							this.$util.redirectTo('/pages_promotion/giftcard/order_list');
						}, 1500)
					}
					
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		// 显示选择支付方式弹框
		openChoosePayment() {
			if (uni.getStorageSync('token')) {
				uni.setStorageSync('paySource', 'giftcard');
				this.$refs.choosePaymentPopup.open();
			} else {
				this.$util.showToast({
					title: '您尚未登录，请先登录'
				});
			}
		},
	
		gotoBuy() {
			this.$refs.choosePaymentPopup.getPayInfo(this.orderDetail.out_trade_no);
		},
		imageError(index) {
			this.orderDetail.order_goods_list[index].sku_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		toCardInfo(){
			if(this.orderDetail.card_list.length > 0){
				this.$util.redirectTo('/pages_promotion/giftcard/card_info', {'member_card_id':this.orderDetail.card_list[0]['member_card_id']});
			}else{
				this.$util.showToast({
					title: '礼品卡不存在或已送出'
				});
			}
		},
		closeOrder(id) {
			
			uni.showModal({
				title: '提示',
				content: '您确定要关闭该订单吗？',
				success: res => {
					if (res.confirm) {
						this.$api.sendRequest({
							url: '/giftcard/api/order/close',
							data: {
								order_id: id
							},
							success: res => {
								if(res.code >= 0){
									this.getData();
								}else{
									this.$util.showToast({
										title: res.message
									});
								}
							}
						});
					}
				}
			})
			
			
		},
	
	}
};
</script>

<style lang="scss">
	.site-wrap {
		margin: 0 24rpx 0;
		border-radius: 0;
		background: #fff;
		padding: 30rpx 30rpx;
		border-radius: 16rpx;
		padding: 30rpx 0 1rpx;
		.site-body {
			margin: 0 $margin-both;
		}
	}
	.order-container {
		padding-bottom: 160rpx;
		background-color: #FFFFFF;
		min-height: 100vh;
		box-sizing: border-box;
		&.safe-area {
			padding-bottom: 188rpx;
		}
	}
 
	.card-head{
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		position: relative;
		
		image{
			width: 34rpx;
			max-height: 28rpx;
			margin-right: 10rpx;
		}
		text{
			font-size: 24rpx;
			font-weight: bold;
		}
		.order-status{
			position: absolute;
			right: 0;
			color: var(--giftcard-promotion-color);
		}
	}
	.giftcard-wrap{
		display: flex;
		padding-bottom: 30rpx;
		
		.card-img{
			width: 270rpx;
			height: 164rpx;
			max-height: 164rpx;
			border-radius: 18rpx;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.goods-info{
			display: flex;
			flex-direction: column;
			margin-left: 30rpx;
			width: calc(100% - 300rpx);
			height: 164rpx;
			position: relative;
			.goods-name{
				font-weight: bold;
				font-size: 30rpx;
				overflow: hidden; 
				display: -webkit-box; 
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2; 
				line-height: 1.5;
					
			}
			.goods-price{
				position: absolute;
				color: var(--price-color);
				bottom: 0;
				left: 0;
				font-size: 32rpx;
			}
		}
		
		
	}
	.goods-list{
		border-top: 0rpx solid #F0F0F0;
		padding: 30rpx 0;
		display: flex;
		.goods-left{
			display: flex;
			width: calc(100% - 108rpx);
			overflow: hidden;
			white-space:nowrap;
			position: relative;
			align-items: center;
			image{
				width: 108rpx;
				max-height: 108rpx;
				margin-right: 22rpx;
				flex-shrink: 0;
				border-radius: 16rpx;
			}
			&:after{
				content: ' ';
				box-shadow: -4rpx 0px 24rpx rgba(0,0,0,.8);
				width: 1rpx;
				height: 80rpx;
				right: -1rpx;
				top: 14rpx;
				position: absolute;
				background: rgba(255,255,255,0);
			}
		}
		.goods-more{
			width: 108rpx;
			height: 108rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 26rpx;
			position: relative;
			text{
				font-size: 28rpx;
				line-height: 1;
			}
			
		}
		&.goodsOpen{
			flex-direction: column;
			position: relative;
			.btn{
				position: absolute;
				right: 20rpx;
				top: 50rpx;
				font-size: 26rpx;
				display: flex;
				align-items: baseline;
				text{
					line-height: 1.1;
					font-size: 24rpx;
					margin-left: 8rpx;
				}
			}
		}
		.goods-item{
			display: flex;
			margin-bottom: 20rpx;
			.goods-image{
				width: 108rpx;
				height: 108rpx;
				overflow: hidden;
				border-radius: 18rpx;
				margin-right: 20rpx;
				image{
					width: 108rpx;
					height: 108rpx;
					max-height: 108rpx;
				}
			}
			.goods-info{
				width: calc(100% - 128rpx);
				.goods-name{
					overflow: hidden;
					display: -webkit-box; 
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1; 
					line-height: 1.5;
					font-size: 28rpx;
				}
				.goods-num{
					margin-top: 20rpx;
					text{
						color: #666666;
						font-size: 24rpx;
						.num{
							margin-left: 50rpx;
						}
					}
				}
			}
		}
	}
 
	.order-content{
		padding: 20rpx 0;
		border-top: 2rpx solid #F0F0F0;
		.content-item{
			display: flex;
			justify-content: space-between;
			align-items: baseline;
			padding: 10rpx 0;
			.label{
				color: #888888;
			}
			.value{
				width: calc(100% - 150rpx);
				text-align: right;
			}
		}
	}
	.button{
		background-color: #FFFFFF;
	   position: fixed;
	   bottom: 0;
	   left: 0;
	   padding: 20rpx 30rpx 20rpx;
	   box-sizing: border-box;
	   display: flex;
	   align-items: center;
	   flex-direction: column;
	   justify-content: center;
	   width: 100%;
	   .button-left{
		   width: 100%;
		   margin-bottom: 20rpx;
		   button{
			   background-color: #ffffff;
				border: 2rpx solid #979797;
				color: #666666;
		   }
	   }
	   .button-right{
		   width: 100%;
		   button{
				border: 2rpx solid var(--giftcard-promotion-color);
				color: #fff;
				background-color: var(--giftcard-promotion-color);
				
		   }
	   }
	   button{
		   height: 80rpx;
		   border-radius: 6rpx;
		   line-height: 1;
		   display: flex;
		   align-items: center;
		   justify-content: center;
	   }
	}
	.tab-bar-placeholder {
		padding-bottom: calc(constant(safe-area-inset-bottom) + 220rpx);
		padding-bottom: calc(env(safe-area-inset-bottom) + 220rpx);
	}
</style>
 
