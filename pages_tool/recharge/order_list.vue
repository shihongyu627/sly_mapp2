<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="order-container">
		<mescroll-uni ref="mescroll" @getData="getListData">
			<block slot="list">
				<block v-if="orderList.length > 0">
					<view class="order-item" v-for="(orderItem, orderIndex) in orderList" :key="orderIndex">
						<view class="order-header">
							<view>
								<text class="color-tip font-size-tag">{{ orderItem.order_no }}</text>
							</view>
							<view class="align-right">
								<text class="color-tip font-size-tag">{{ $util.timeStampTurnTime(orderItem.create_time) }}</text>
							</view>
						</view>
						<view class="order-body">
							<view class="goods_info_flex">
								<view class="goods-name font-size-base">充值成功</view>
							</view>

							<view class="goods-img color-base-text">￥<text>{{ orderItem.buy_price }}</text></view>

							<view class="goods-sub-section">
								<view class="<strong>goods-name</strong> color-tip " v-if="orderItem.point > 0 || orderItem.growth > 0">赠送:
								</view>
								<view class="goods-name color-tip " v-if="orderItem.point > 0">{{ orderItem.point }}柚币</view>
								<view class="goods-name color-tip " v-if="orderItem.point > 0 && orderItem.growth > 0">、</view>
								<view class="goods-name color-tip " v-if="orderItem.growth > 0">{{ orderItem.growth }}成长值</view>
								<view class="goods-name color-tip " v-if="orderItem.point > 0 && orderItem.coupon_id">、</view>
								<view class="goods-name color-tip " v-if="orderItem.coupon_id">优惠券x{{ orderItem.coupon_id.split(',').length }}</view>
							</view>
						</view>
					</view>
				</block>
				<view v-else>
					<ns-empty :isIndex="false" text="暂无充值记录"></ns-empty>
				</view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderList: []
			};
		},
		onShow() {
			
			if (this.$refs.mescroll) this.$refs.mescroll.refresh();

			if (!uni.getStorageSync('token')) {
				this.$refs.login.open('/pages_tool/recharge/order_list');
			}
		},
		methods: {
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/memberrecharge/api/order/page',
					data: {
						page: mescroll.num,
						page_size: mescroll.size
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.orderList = []; //如果是第一页需手动制空列表
						this.orderList = this.orderList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			imageError(index) {
				this.orderList[index].cover_img = this.$util.getDefaultImage().goods;
				this.$forceUpdate();
			}
		}
	};
</script>

<style lang="scss">
	.order-container {
		width: 100vw;
		height: 100vh;
	}

	.align-right {
		text-align: right;
	}

	.order-item {
		margin: $margin-updown $margin-both;
		padding: 0 30rpx;
		border-radius: $border-radius;
		background: #fff;
		position: relative;

		.order-header {
			display: flex;
			align-items: center;
			position: relative;
			height: 80rpx;
			line-height: 80rpx;
			border-bottom: 1px solid #E3E3E3;

			&>view {
				flex: 1;
				line-height: 1;
				font-weight: 500;
			}
		}

		.order-body {
			height: 155rpx;
			position: relative;

			.goods_info_flex {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-top: 30rpx;

				.goods-name {
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					line-height: 1;
					font-weight: 500;
				}
			}

			.goods-img {
				font-size: $font-size-tag;
				font-weight: 500;
				position: absolute;
				right: 0;
				top: 20rpx;

				text {
					font-size: $font-size-toolbar;
				}
			}

			.goods-sub-section {
				width: 100%;
				line-height: 1;
				display: flex;
				margin-top: 39rpx;
				font-size: $font-size-tag;

				view {
					line-height: 1;
					text-align: right;
					margin-right: 10rpx;
					font-size: $font-size-tag;
				}
			}
		}
	}
</style>
