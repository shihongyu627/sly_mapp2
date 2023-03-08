<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="fill-box">
		<view class="send-mode" v-if="orderPaymentData.shop_goods_list.express_type.length > 1 && goodsInfo.is_virtual == 0">
			<view class="mode"><text>配送方式</text></view>
			<view class="mode-btn">
				<button
					v-for="(deliveryItem, deliveryIndex) in orderPaymentData.shop_goods_list.express_type"
					:key="deliveryIndex"
					:type="deliveryItem.name == orderPaymentData.delivery.delivery_type ? 'primary' : 'default'"
					@click="selectDeliveryType(deliveryItem)"
					size="mini"
				>
					{{ deliveryItem.title }}
				</button>
			</view>
		</view>
		<view class="address-box" v-if="orderPaymentData.delivery.delivery_type != 'store' && goodsInfo.is_virtual == 0">
			<view class="info-wrap" :class="{local: orderPaymentData.delivery.delivery_type == 'local'}" v-if="orderPaymentData.member_address" @click="selectAddress">
				<view class="content">
					<text class="name font-size-base">{{ orderPaymentData.member_address.name ? orderPaymentData.member_address.name : '' }}</text>
					<text class="font-size-base">{{ orderPaymentData.member_address.mobile ? orderPaymentData.member_address.mobile : '' }}</text>
					<text class="cell-more iconfont iconright"></text>
					<view class="desc-wrap">
						{{ orderPaymentData.member_address.full_address ? orderPaymentData.member_address.full_address : '' }}
						{{ orderPaymentData.member_address.address ? orderPaymentData.member_address.address : '' }}
					</view>
				</view>
			</view>
			<view class="empty-wrap" v-else @click="selectAddress">
				<view class="icon-wrap"><view class="iconfont icondizhi empty"></view></view>
				<view class="info">请设置收货地址</view>
				<view class="cell-more"><view class="iconfont iconright"></view></view>
			</view>
			<!-- 外卖配送 -->
			<view class="local-box" v-if="orderPaymentData.delivery.delivery_type == 'local'">
				<view class="order-cell">
					<text class="tit">配送时间</text>
					<view class="box">
						<text v-if="timeInfo.showTime">{{ timeInfo.start_time + '-' + timeInfo.end_time }}</text>
						<text v-if="deliveryWeek">
							<template v-if="timeInfo.showTime">
								（
							</template>
							{{ deliveryWeek }}
							<template v-if="timeInfo.showTime">
								）
							</template>
						</text>
						<text v-if="!canLocalDelicery">（休息中）</text>
					</view>
				</view>
				<picker
					v-if="timeInfo.showTimeBar && orderPaymentData.member_address && canLocalDelicery"
					:value="orderCreateData.buyer_ask_delivery_time"
					mode="time"
					@change="bindTimeChange"
				>
					<view class="pick-block">
						<view class="font-size-base">送达时间</view>
						<view class="time-picker">
							<text>{{ orderCreateData.buyer_ask_delivery_time }}</text>
							<text class="iconfont iconright cell-more"></text>
						</view>
					</view>
				</picker>
			</view>
		</view>
		<!-- 选择门店 -->
		<view class="store-box" v-if="orderPaymentData.delivery.delivery_type == 'store' && goodsInfo.is_virtual == 0">
			<view v-if="storeInfo.currStore">
				<view  @click="openSiteDelivery" class="store-info">
					<view class="store-address-info">
						<view class="info-wrap">
							<view class="title">
								<text>{{ storeInfo.currStore.store_name }}</text>
								<view class="cell-more iconfont iconright"></view>
							</view>
							<view class="store-detail">
								<view v-if="storeInfo.currStore.open_date">营业时间：{{ storeInfo.currStore.open_date }}</view>
								<view>地址：{{ storeInfo.currStore.full_address }} {{ storeInfo.currStore.address }}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="mobile-wrap">
					<view class="form-group">
						<text class="text">预留手机</text>
						<input
							type="number"
							maxlength="11"
							placeholder="请输入您的手机号码"
							placeholder-class="color-tip placeholder"
							class="input font-size-base"
							v-model="member_address.mobile"
						/>
					</view>
				</view>
			</view>
			<view v-else class="empty">当前无自提门店，请选择其它配送方式</view>
		</view>
		
		<!-- 虚拟商品展示手机号 -->
		<view class="mobile-wrap virtual-goods" v-if="goodsInfo.is_virtual == 1">
			<view class="tips color-base-text">
				<text class="iconfont icongantanhao"></text>
				购买虚拟类商品需填写手机号，方便商家与您联系
			</view>
			<view class="form-group">
				<text class="iconfont icondianhua2"></text>
				<text class="text">手机号码</text>
				<input type="number" maxlength="11" placeholder="请输入您的手机号码" placeholder-class="color-tip placeholder" class="input" v-model="member_address.mobile" />
			</view>
		</view>
		<view class="blind-good">
			<view class="goods-img">
				<image v-if="goodsInfo.sku_image != ''" :src="$util.img(goodsInfo.sku_image)" @error="boxImg()" mode="aspectFit"></image>
				<image v-else :src="$util.img('public/uniapp/blindbox/default.png')"></image>
			</view>
			<view class="goods-right">
				<view class="goods-title font-size-base">{{ goodsInfo.sku_name }}</view>
				<view class="color-tip font-size-tag good-time">{{ $util.timeStampTurnTime(goodsInfo.end_time) }}</view>
			</view>
		</view>
		<view class="primary"><button type="primary" class="" @click="get()">确定</button></view>
		<uni-popup ref="deliveryPopup" type="bottom">
			<view class="delivery-popup popup">
				<view class="popup-header">
					<text class="tit">已为您甄选出附近所有相关门店</text>
					<text class="iconfont iconclose" @click="closePopup('deliveryPopup')"></text>
				</view>
				<view class="popup-body store-popup" :class="{ 'safe-area': isIphoneX }">
					<view class="delivery-content">
						<view class="item-wrap" v-for="(item, index) in storeInfo.storeList" :key="index" @click="selectPickupPoint(item)">
							<view class="detail">
								<view class="name" :class="item.store_id == orderPaymentData.delivery.store_id ? 'color-base-text' : ''">
									<text>{{ item.store_name }}</text>
									<text v-if="item.distance">({{ item.distance }}km)</text>
								</view>
								<view class="info">
									<view :class="item.store_id == orderPaymentData.delivery.store_id ? 'color-base-text' : ''" class="font-size-goods-tag">
										营业时间：{{ item.open_date }}
									</view>
									<view :class="item.store_id == orderPaymentData.delivery.store_id ? 'color-base-text' : ''" class="font-size-goods-tag">
										地址：{{ item.full_address }}{{ item.address }}
									</view>
								</view>
							</view>
							<view class="icon" v-if="item.store_id == orderPaymentData.delivery.store_id"><text class="iconfont iconyuan_checked color-base-text"></text></view>
						</view>
						<view v-if="!storeInfo.storeList" class="empty">所选择收货地址附近没有可以自提的门店</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import payment from './public/js/payment.js';
export default {
	mixins: [payment],
	data() {
		return {
			check: false,
			allcheck: false,
			_goods_id: '',
			outTradeNo: '',
			goodsInfo: {},
			isSub: false // 提交防重复
		};
	},
	onLoad(options) {
		this.outTradeNo = options.out_trade_no;
		this.blindbox_goods_id = options.blindbox_goods_id;
		this.getgoods();
	},
	methods: {
		getgoods() {
			this.$api.sendRequest({
				url: '/blindbox/api/order/boxDetail',
				data: {
					out_trade_no: this.outTradeNo
				},
				success: res => {
					if (res.code >= 0) {
						this.goodsInfo = res.data;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		},
		get() {
			if (this.verify()) {
				if (this.isSub) return;
				this.isSub = true;
				var data = this.$util.deepClone(this.orderCreateData);
				data.delivery = JSON.stringify(data.delivery);
				data.coupon = JSON.stringify(data.coupon);
				if (this.orderCreateData.delivery.delivery_type == 'store') {
					data.member_address = JSON.stringify(this.member_address);
				} else {
					data.member_address = JSON.stringify(data.member_address);
				}
				data.blindbox_goods_id = this.blindbox_goods_id;
				data.out_trade_no = this.outTradeNo;
				data.sku_id = this.sku_id;
				this.$api.sendRequest({
					url: '/blindbox/api/order/create',
					data: data,
					success: res => {
						if (res.code >= 0) {
							this.$util.showToast({
								title: '提交成功'
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages/order/list', { order_id: res.data });
							}, 2000);
							this.isSub = false;
						} else {
							this.isSub = false;
							this.$util.showToast({
								title: res.message
							});
						}
					},
					fail: res => {
						this.isSub = false;
						this.$util.showToast({ title: 'request:fail' });
					}
				});
			}
		},
		checked(check) {
			this.check = !this.check;
		},
		checkBlind() {
			this.$refs.checkpopup.open();
		},
		closePopup() {
			this.$refs.checkpopup.close();
		}
	}
};
</script>

<style lang="scss">
@import "@/common/css/order_parment.scss";
.fill-box {
	.blind-good {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx 36rpx;
		margin: 20rpx 24rpx;
		display: flex;
		.goods-img {
			width: 150rpx;
			height: 150rpx;
			margin-right: 20rpx;
			background-color: #fff;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.goods-right {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.goods-title {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				line-height: 1.5;
			}
			.good-time {
				line-height: 1;
			}
		}

		/* .check-goods{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.blind-goods{
					font-weight: bold;
				}
				.check-blind{
					.right-jiantou{
						margin-left: 10rpx;
					}
				}
			}
			.marketimg-box-con{
				.marketimg-box-con-scroll {
					width: calc(100% - 30rpx);
					line-height: 1;
					white-space: nowrap;
					margin-top: 30rpx;
					.marketimg-box-con-item {
						display: inline-block;
						width: 33.3333%;
						margin-right: 20rpx;
						&:nth-child(3n + 3) {
							margin-right: 0;
						}
						image {
							width: 170rpx;
							height: 170rpx;
							border-radius: 10rpx;
						}
						.title {
							width: 85%;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
				}
			} */
	}
	.send-mode {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx 36rpx;
		margin: 20rpx 24rpx;
		.mode {
			font-weight: bold;
		}
		.mode-btn {
			margin-top: 40rpx;
			display: flex;
			button {
				flex: 1;
				height: 70rpx;
				line-height: 70rpx;
				margin-right: 26rpx !important;
				&:last-child {
					margin-right: 0 !important;
				}
			}
		}
	}
	.address-box {
		border-radius: 16rpx;
	}
	
	.receiving {
		background-color: #fff;
		border-radius: 10rpx;
		padding: 30rpx 36rpx;
		margin: 20rpx 30rpx;
		.receiving-msg {
			font-weight: bold;
		}
		.address {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 20rpx;
		}
		.take-out {
			border-top: 2rpx solid #eee;
			margin-top: 20rpx;
			padding-top: 20rpx;
			view {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.service-time {
				.service-tim {
					.right-jiantou {
						margin-left: 10rpx;
					}
				}
			}
		}
	}
	// 门店自提
	.store-box {
		// @include wrap;
		border-radius: 16rpx;
		margin: 20rpx 24rpx;
		background: #fff;
		padding: 20rpx 30rpx;
		.store-info {
			display: flex;
			align-items: center;
			.icon {
				position: relative;
				margin-right: 26rpx;
				align-self: flex-start;
				margin-top: -2rpx;
				&.img {
					background-color: unset;
					margin: 10rpx 20rpx 0 0;
					width: 80rpx;
					height: 80rpx;
					border-radius: 10rpx;
					image {
						width: 100%;
						height: 100%;
					}
				}
				.iconfont {
					font-size: $font-size-toolbar;
				}
			}
			/* .info-wrap {
					flex: 1;
					.title {
						margin-bottom: 10rpx;
						font-size: $font-size-base;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.cell-more {
							// float: right;
							margin-left: 50rpx;
						}
					}
					.store-detail view {
						word-break: break-word;
						font-size: $font-size-tag;
						color: $color-sub;
					}
				} */
		}

		.empty {
			text-align: center;
		}
	}
	//预填手机号
	.mobile-wrap {
		margin: 20rpx 0 0 0;
		border-radius: 0;
		background: #fff;
		padding: 0;

		.form-group {
			display: flex;
			align-items: center;
			width: 100%;
			.require {
				color: #ff4544;
				margin-right: 10rpx;
			}
			.text {
				display: inline-block;
				line-height: 50rpx;
				padding-right: 40rpx;
				font-size: $font-size-base;
			}

			.placeholder {
				line-height: 50rpx;
			}

			.input {
				flex: 1;
				height: 50rpx;
				line-height: 50rpx;
				text-align: left;
			}
		}
	}
	
	.virtual-goods {
		margin: 20rpx 24rpx;
		padding: 30rpx 24rpx;

		.tips  {
			margin-bottom: 20rpx;
		}
	}
	.check-wrap {
		width: 630rpx;
		.content-wrap {
			width: 100%;
			overflow: hidden;
			.header-popup {
				display: flex;
				position: relative;
				padding: 40rpx;
				.tit {
					flex: 1;
					font-size: 30rpx;
					font-weight: bold;
					line-height: 1;
					text-align: center;
				}
				.guanbi {
					line-height: 1;
					position: absolute;
					right: 30rpx;
					top: 50%;
					transform: translate(0, -50%);
					color: $color-tip;
					font-size: $font-size-toolbar;
				}
			}
			.checked-goods {
				display: flex;
				align-items: center;
				padding: 0 30rpx;
				margin: 20rpx 0;
				.check {
					margin-right: 20rpx;
					font-size: 34rpx;
				}
				.check-list {
					display: flex;
					.img {
						width: 170rpx;
						height: 170rpx;
						image {
							width: 100%;
							height: 100%;
						}
					}

					.goods-goods {
						margin-left: 20rpx;
						width: 60%;
						.goods-name {
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
						}
						.goods-price {
							.price {
								font-size: 36rpx;
							}
						}
					}
				}
			}
			.footer {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 30rpx;
				border-top: 2rpx solid $color-line;
				.determine {
					width: 330rpx;
					button {
					}
				}
			}
		}
	}
	.primary {
		position: fixed;
		bottom: 40rpx;
		width: 100%;
	}
}
.address-box .icon-wrap {
	padding-top: 0;
}
</style>
<style>
>>> .uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
	overflow: unset;
}
/deep/ .check-popup .uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
	border-radius: 20rpx !important;
	max-width: 84% !important;
}
</style>
