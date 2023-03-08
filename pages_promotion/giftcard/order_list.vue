<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<mescroll-uni @getData="getData" ref="mescroll" :size="10">
			<block slot="list">
				<view class="cf-container color-line-border">
					<view class="tab">
						<view @click="changeState('all')"><text :class="order_status == 'all' ? 'color-base-text active color-base-border-bottom' : ''">全部</text></view>
						<view @click="changeState('topay')"><text :class="order_status == 'topay' ? 'color-base-text active color-base-border-bottom' : ''">待支付</text></view>
						<view @click="changeState('complete')"><text :class="order_status == 'complete' ? 'color-base-text active color-base-border-bottom' : ''">已完成</text></view>
						<view @click="changeState('close')"><text :class="order_status == 'close' ? 'color-base-text active color-base-border-bottom' : ''">已关闭</text></view>
					</view>
				</view>

				<view class="card-box" v-if="orderList.length > 0">
					<view v-for="(item, index) in orderList" :key="index">
						<view class="card-item">
							<view class="card-head" @click="orderDetail(item.order_id)" >
								<view class="head-box">
									<view class="head-icon">
										<image :src="$util.img(item.card_right_type == 'balance' ? 'public/uniapp/giftcard/order-icon-recharge.png' : 'public/uniapp/giftcard/order-icon-gift.png')" mode="widthFix"></image>
									</view>
									<view class="head-title">
										<view class="head-type">{{item.card_right_type == 'balance' ? '储值卡' : '礼品卡' }}</view>
										<view class="head-time">{{$util.timeStampTurnTime(item.create_time)}}</view>
									</view>
								</view>
								<view class="pay-status">{{item.order_status_name}}</view>
							</view>
							<view class="card-content" @click="orderDetail(item.order_id)" >
								<view class="card-left">
									<view class="card-img">
										<image :src="$util.img(item.card_cover)" mode="aspectFill"></image>
									</view>
									<view class="card-name">{{item.order_name}}</view>
								</view>
								<view class="card-price">
									<view>￥{{item.card_price}}</view>
									<view>x{{item.num}}</view>
								</view>
							</view>
							
							<view class="order-price">
								<view>￥{{item.pay_money}}</view>
							</view>
							<view class="button" v-if="item.order_status == 'topay'">
								<view class="button-left"><button @click="orderDetail(item.order_id)"  size="mini">查看详情</button></view>
								<!-- <view class="button-left"><button  size="mini" @click="closeOrder(item.order_id)">关闭订单</button></view> -->
								<view class="button-right">
									<button size="mini" @click="openChoosePayment(item.order_id, item.pay_money, item.out_trade_no)">立即支付</button>
								</view>
							</view>
							<view class="button" v-if="item.order_status == 'complete'">
								<view class="button-left"><button @click="orderDetail(item.order_id)"  size="mini">查看详情</button></view>
								<view class="button-right">
									<button size="mini" @click="$util.redirectTo('/pages_promotion/giftcard/list', {order_id: item.order_id})">查看卡包</button>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="card-no-data" v-else>
					<view class="card-image"><image mode="widthFix" :src="$util.img('public/uniapp/giftcard/no_order.png')"></image></view>
					<view class="text">暂无订单记录</view>
					<view class="btn"><button type="primary" size='mini' @click="$util.redirectTo('/pages_promotion/giftcard/index')">去挑礼物</button></view>
				</view>
			</block>
		</mescroll-uni>

		<loading-cover ref="loadingCover"></loading-cover>

		<!-- 选择支付方式弹窗 -->
		<ns-payment ref="choosePaymentPopup" :payMoney="price" @confirm="gotoBuy"></ns-payment>
	</view>
</template>

<script>
export default {
	data() {
		return {
			order_id: '',
			order_status: 'all',
			orderList: [],
			price: '',
			out_trade_no:''
		};
	},
	methods: {
		//切换状态
		changeState(order_status) {
			this.list = [];
			this.order_status = order_status;
			this.$refs.mescroll.refresh();
		},
		getData(mescroll) {
		 
			this.$api.sendRequest({
				url: '/giftcard/api/order/lists',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					order_status: this.order_status
				},
				success: res => {
					let newArr = [];
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
					}
					if (mescroll.endSuccess) mescroll.endSuccess(newArr.length);

					//设置列表数据
					if (mescroll.num == 1) this.orderList = []; //如果是第一页需手动制空列表
					this.orderList = this.orderList.concat(newArr); //追加新数据
					setTimeout(() => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}, 300);
				},
				fail: res => {
					if (mescroll.endErr) mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		// 显示选择支付方式弹框
		openChoosePayment(id, price, out_trade_no) {
			this.order_id = id;
			this.price = price;
			this.out_trade_no = out_trade_no;
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
			this.$refs.choosePaymentPopup.getPayInfo(this.out_trade_no);
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
									this.$refs.mescroll.refresh();
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
		orderDetail(order_id) {
			this.$util.redirectTo('/pages_promotion/giftcard/order_detail', {
				order_id: order_id
			});
		}
	}
};
</script>

<style lang="scss">
.active {
	border-bottom: 0rpx solid;
}

.cf-container {
	background: #fff;
	overflow: hidden;
}

.tab {
	display: flex;
	justify-content: space-between;
	height: 86rpx;

	> view {
		text-align: center;
		width: 33%;
		height: 86rpx;

		text {
			display: inline-block;
			line-height: 86rpx;
			height: 80rpx;
			font-size: 30rpx;
		}
	}
}

.card-item {
	background: #fff;
	margin: 20rpx 30rpx;
	border-radius: 10rpx;
	padding: 30rpx 30rpx;
	.card-head{
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		.head-box{
			display: flex;
			align-items: center;
			.head-icon{
				width: 34rpx;
				margin-right: 10rpx;
				margin-bottom: -4rpx;
				image{
					width: 100%;
					max-height: 28rpx;	
				}
			}
			.head-title{
				display: flex;
				    align-items: center;
				.head-type{
					font-weight: bold;
					font-size: $font-size-tag;
				}
				.head-time{
					margin-left: 20rpx;
					font-size: $font-size-activity-tag;
				}
			}
		}
		.pay-status{
			font-size: $font-size-tag;
			color: var(--main-color);
			line-height: 1;
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
	}
	.card-content {
		display: flex;
		justify-content: space-between;
		margin-top: 20rpx;
		.card-left{
			display: flex;
			.card-img{
				width: 145rpx;
				height: 88rpx;
				margin-right: 15rpx;
				border-radius: 10rpx;
				overflow: hidden;
				image{
					width: 100%;
					max-height: 88rpx;
				}
			}
			.card-name{
				width: 300rpx;
				font-weight: bold;
				font-size: $font-size-sub;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}
		.card-price{
			display: flex;
			flex-direction: column;
			align-items: end;
			font-size: $font-size-tag;
			color: #666666;
			>view{
				font-size: $font-size-tag;
				color: #666666;
			}

		}
   }
   .order-price{
	   display: flex;
	   align-items: flex-end;
	   justify-content: flex-end;
	   width: 100%;
	   margin-top: 10rpx;
	   >view{
		   font-size: $font-size-tag;
		   &:last-child{
			   font-size: $font-size-base;
			   font-weight: bold;
			   margin-left: 10rpx;
		   }
	   }
	   
   }
   .button{
	   display: flex;
	   align-items: flex-end;
	   justify-content: flex-end;
	   width: 100%;
	   margin-top: 20rpx;
	   .button-left{
		   margin-right: 20rpx;
		   button{
				border: 2rpx solid #979797;
				color: #666666;
		   }
	   }
	   .button-right{
		   button{
				border: 2rpx solid var(--giftcard-promotion-color);
				color: var(--giftcard-promotion-color);
				
		   }
	   }
	   button{
		   background-color: #ffffff;
		   border-radius: 50rpx;
		   line-height: 1;
		   height: 50rpx;
		   display: flex;
		   align-items: center;
	   }
   }
}


.card-no-data {
	width: 100%;
	text-align: center;
	.card-image {
		margin-top: 200rpx;
		display: flex;
		image {
			width: 340rpx;
			max-height: 290rpx;
			margin: auto auto;
		}
	}
	.text{
		font-size: 26rpx;
	}
	.btn{
		margin-top: 26rpx;
		button{
			border-radius: 80rpx;
			padding: 0 50rpx;
			font-size: 30rpx;
			background-color: var(--giftcard-promotion-color);
		}
	}
}
</style>
