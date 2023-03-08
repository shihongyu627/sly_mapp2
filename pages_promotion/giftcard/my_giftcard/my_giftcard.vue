<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<mescroll-uni @getData="getData" ref="mescroll" :size="10">
			<block slot="list">
				<view class="header-box" :style="{ background: 'url(' + $util.img('public/uniapp/giftcard/detail/index.png') + ') no-repeat 0 0/100% 50%' }">
					<view class="header">
						<view @click="toExchange()">
							<image style="width: 100rpx; height: 100rpx; margin-left: 6rpx;" :src="$util.img('public/uniapp/giftcard/detail/mine_exchange.png')"></image>
							<view>我要兑换</view>
						</view>

						<view @click="toPresent()">
							<image style="width: 100rpx; height: 100rpx; margin-left: 6rpx;" :src="$util.img('public/uniapp/giftcard/detail/purchase_orders.png')"></image>
							<view>转赠记录</view>
						</view>

						<view @click="toOrder()">
							<image style="width: 100rpx; height: 100rpx; margin-left: 6rpx;" :src="$util.img('public/uniapp/giftcard/detail/turn_add_records.png')"></image>
							<view>购卡订单</view>
						</view>
					</view>
				</view>

				<view class="" v-if="cardlist.length > 0">
					<view v-for="(item, index) in cardlist" :key="index">
						<view class="card-item margin-bottom" v-if="item.elect_status == 0">
							<view
								class="card-content"
								@click="gotoDetail(item.id)"
								:style="{
									background: $util.img(cardlist[index].card_cover)
										? 'url(' + $util.img(cardlist[index].card_cover) + ') no-repeat 0 0/100% 100%'
										: 'url(' + $util.img('public/uniapp/giftcard/detail/gitcard_default3.png') + ') no-repeat 0 0/100% 100%'
								}"
							>
								<view class="content-head">
									<view class="card-name">{{ item.card_name }}</view>
									<view class="use-orno">待使用</view>
								</view>
								<view class="card-use">礼品卡权益</view>
								<view class="card-num" v-if="item.balance > 0.0 && item.point > 0 && item.goods_num > 0">
									￥{{ item.balance }} + {{ item.point }}柚币+商品*{{ item.goods_num }}
								</view>
								<view class="card-num" v-else-if="item.balance > 0.0 && item.point == 0">￥{{ item.balance }}</view>
								<view class="card-num" v-else-if="item.balance == 0.0 && item.point > 0">{{ item.point }} 柚币</view>
								<view class="card-num" v-else-if="item.balance == 0.0 && item.point == 0 && item.goods_num > 0">商品*{{ item.goods_num }}</view>

								<view class="card-num" v-else-if="item.balance > 0.0 && item.point > 0 && item.goods_num == 0">￥{{ item.balance }}+{{ item.point }}柚币</view>
								<view class="card-num" v-else-if="item.balance > 0.0 && item.point == 0 && item.goods_num > 0">￥{{ item.balance }}+商品*{{ item.goods_num }}</view>
								<view class="card-num" v-else-if="item.balance == 0.0 && item.point > 0 && item.goods_num > 0">{{ item.point }}柚币+商品*{{ item.goods_num }}</view>
								<view class="card-id">NO.{{ item.number }}</view>
							</view>
						</view>

						<view class="card-item2 margin-bottom" v-else-if="item.elect_status == 1">
							<view
								class="card-content hasuse-card-content card-box1"
								@click="gotoDetail(item.id)"
								:style="{
									background: cardlist[index].card_cover
										? 'url(' + $util.img(cardlist[index].card_cover) + ') no-repeat 0 0/100% 100%'
										: 'url(' + $util.img('public/uniapp/giftcard/detail/gitcard_default3.png') + ') no-repeat 0 0/100% 100%'
								}"
							></view>
							<view class="card-box2"></view>
							<view class="card-content card-box3" @click="gotoDetail(item.id)">
								<view class="content-head">
									<view class="card-name">{{ item.card_name }}</view>
									<view class="use-orno">已使用</view>
								</view>
								<view class="card-use">礼品卡权益</view>
								<view class="card-num" v-if="item.balance > 0.0 && item.point > 0 && item.goods_num > 0">
									￥{{ item.balance }} + {{ item.point }}柚币+商品*{{ item.goods_num }}
								</view>
								<view class="card-num" v-else-if="item.balance > 0.0 && item.point == 0">￥{{ item.balance }}</view>
								<view class="card-num" v-else-if="item.balance == 0.0 && item.point > 0">{{ item.point }} 柚币</view>
								<view class="card-num" v-else-if="item.balance == 0.0 && item.point == 0 && item.goods_num > 0">商品*{{ item.goods_num }}</view>

								<view class="card-num" v-else-if="item.balance > 0.0 && item.point > 0 && item.goods_num == 0">￥{{ item.balance }}+{{ item.point }}柚币</view>
								<view class="card-num" v-else-if="item.balance > 0.0 && item.point == 0 && item.goods_num > 0">￥{{ item.balance }}+商品*{{ item.goods_num }}</view>
								<view class="card-num" v-else-if="item.balance == 0.0 && item.point > 0 && item.goods_num > 0">{{ item.point }}柚币+商品*{{ item.goods_num }}</view>
								<view class="card-id">NO.{{ item.number }}</view>
							</view>
						</view>

						<view class="card-item2 margin-bottom" v-else-if="item.elect_status == 2 || item.elect_status == 4">
							<view
								class="card-content hasuse-card-content card-box1"
								@click="gotoDetail(item.id)"
								:style="{
									background: cardlist[index].card_cover
										? 'url(' + $util.img(cardlist[index].card_cover) + ') no-repeat 0 0/100% 100%'
										: 'url(' + $util.img('public/uniapp/giftcard/detail/gitcard_default3.png') + ') no-repeat 0 0/100% 100%'
								}"
							></view>
							<view class="card-box2"></view>
							<view class="card-content card-box3" @click="gotoDetail(item.id)">
								<view class="content-head">
									<view class="card-name">{{ item.card_name }}</view>
									<view class="use-orno">已过期</view>
								</view>
								<view class="card-use">礼品卡权益</view>
								<view class="card-num" v-if="item.balance > 0.0 && item.point > 0 && item.goods_num > 0">
									￥{{ item.balance }} + {{ item.point }}柚币+商品*{{ item.goods_num }}
								</view>
								<view class="card-num" v-else-if="item.balance > 0.0 && item.point == 0">￥{{ item.balance }}</view>
								<view class="card-num" v-else-if="item.balance == 0.0 && item.point > 0">{{ item.point }} 柚币</view>
								<view class="card-num" v-else-if="item.balance == 0.0 && item.point == 0 && item.goods_num > 0">商品*{{ item.goods_num }}</view>

								<view class="card-num" v-else-if="item.balance > 0.0 && item.point > 0 && item.goods_num == 0">￥{{ item.balance }}+{{ item.point }}柚币</view>
								<view class="card-num" v-else-if="item.balance > 0.0 && item.point == 0 && item.goods_num > 0">￥{{ item.balance }}+商品*{{ item.goods_num }}</view>
								<view class="card-num" v-else-if="item.balance == 0.0 && item.point > 0 && item.goods_num > 0">{{ item.point }}柚币+商品*{{ item.goods_num }}</view>
								<view class="card-id">NO.{{ item.number }}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="card-no-data" v-else>
					<view class="card-image"><image :src="$util.img('public/uniapp/giftcard/detail/no_giving.png')" mode="aspectFill"></image></view>
					<view class="">暂无数据</view>
				</view>
			</block>
		</mescroll-uni>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
export default {
	data() {
		return {
			cardlist: [],
			giftcardDetail: []
		};
	},
	methods: {
		toExchange() {
			this.$util.redirectTo('/pages_promotion/giftcard/my_exchange/my_exchange');
		},
		toOrder() {
			this.$util.redirectTo('/pages_promotion/giftcard/order/order');
		},
		toPresent() {
			this.$util.redirectTo('/pages_promotion/giftcard/present/list');
		},
		gotoDetail(id) {
			this.$util.redirectTo('/pages_promotion/giftcard/detail/detail', {
				id: id
			});
		},
		getData(mescroll) {
			this.$api.sendRequest({
				url: '/giftcard/api/giftcard/mygiftcardlist',
				data: {
					page_size: mescroll.size,
					page: mescroll.num
				},
				success: res => {
					let newArr = [];
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
					}

					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.cardlist = []; //如果是第一页需手动制空列表
					this.cardlist = this.cardlist.concat(newArr); //追加新数据
					this.cardlist.forEach(i => {
						i.start_time = this.$util.timeStampTurnTime(i.start_time).slice(0, 10);
						i.end_time = this.$util.timeStampTurnTime(i.end_time).slice(0, 10);
					});
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (mescroll.endErr) mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		}
	}
};
</script>

<style lang="scss">
.header-box {
	padding: 54rpx 30rpx 0 30rpx;
	// border-radius: 20rpx;
	.header {
		display: flex;
		justify-content: space-between;
		padding: 30rpx 50rpx;
		border-radius: 15rpx;
		margin: 20rpx 10rpx;
		background: #fff;
		height: 180rpx;
	}
}

.card-item2 {
	// padding: 0 20rpx;
	margin: 0 30rpx;
	border-radius: 20rpx;
	position: relative;

	.card-content {
		padding: 30rpx 50rpx;
		border-radius: 15rpx;

		.content-head {
			display: flex;
			justify-content: space-between;
			margin-bottom: 30rpx;

			.card-name {
				font-size: 40rpx;
				color: #909399;
				max-height: 160rpx;
				width: 85%;
				overflow: hidden;
			}

			.use-orno {
				color: #909399;
			}
		}

		.card-use {
			color: #909399;
		}

		.card-num {
			margin-top: 20rpx;
			line-height: 20rpx;
			color: #909399;
		}

		.card-id {
			margin-top: 40rpx;
			color: #909399;
		}
	}
}

.card-item {
	padding: 0 20rpx;
	margin: 0 10rpx;
	border-radius: 20rpx;

	.card-content {
		
		padding: 30rpx 50rpx;
		border-radius: 15rpx;

		.content-head {
			display: flex;
			justify-content: space-between;
			margin-bottom: 30rpx;

			.card-name {
				font-size: 48rpx;
				color: #fff;
				max-height: 160rpx;
				width: 85%;
				overflow: hidden;
			}

			.use-orno {
				color: #fff;
			}
		}

		.card-use {
			color: #fff;
		}

		.card-num {
			margin-top: 20rpx;
			line-height: 20rpx;
			color: #fff;
		}

		.card-id {
			margin-top: 40rpx;
			color: #fff;
		}
	}
}
.hasuse-card-content {
	-webkit-filter: grayscale(100%);
	filter: grayscale(100%);
}
.card-box1 {
	height: 296rpx;
}
.card-box2 {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #efefef;
	opacity: 0.8;
	// margin: 0 20rpx;
	border-radius: 16rpx;
	z-index: 200;
}
.card-box3 {
	position: absolute;
	width: 590rpx;
	top: 0;
	color: gray !important;
	z-index: 300;
}
.card-no-data {
	width: 100%;
	text-align: center;
	.card-image {
		margin-top: 150rpx;
		display: flex;
		image {
			margin: auto auto;
		}
	}
}
</style>
