<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="prize-box">
		<view class="my_prize" :style="{ backgroundImage: 'url(' + $util.img('public/uniapp/blindbox/index_bg.png') + ')' }">
			<view class="top">
				<view class="top-img">
					<image v-if="blindgoods.blindbox_images != ''" :src="$util.img(blindgoods.blindbox_images)" @error="errorImg()" mode="aspectFit"></image>
					<image v-else :src="$util.img('public/uniapp/blindbox/default.png')"></image>
				</view>
				<view class="right">
					<view class="blind-title font-size-toolbar">{{ blindgoods.blindbox_name }}</view>
					<view class="statused font-size-tag" v-if="blindgoods.blindbox_status == 1">进行中</view>
					<view class="statused font-size-tag" v-if="blindgoods.blindbox_status == -1">已关闭</view>
					<view class="statused font-size-tag" v-if="blindgoods.blindbox_status == 2">已结束</view>
					<view class="font-size-tag ul">
						<text class="li"></text>
						<text class="">盲盒次数：</text>
						<text class="">
							可拆{{ blindgoods.blindbox_count }}次，剩余
							<text class="chi">{{ blindgoods.blindbox_inventory }}</text>
							次
						</text>
					</view>
					<view class="font-size-tag ul">
						<text class="li"></text>
						<text class="">我的次数：</text>
						<text class="">
							已拆
							<text class="chi">{{ blindgoods.buy_num }}</text>
							次
						</text>
					</view>
				</view>
			</view>
			<view class="content">
				<view class="tabs">
					<view :class="diff == 1 ? 'tab tab_left act' : 'tab tab_left'" @click="myPrize('1')">我的奖品</view>
					<view :class="diff == 2 ? 'tab tab_right act' : 'tab tab_right'" @click="myPrize('2')">参与人</view>
				</view>
				<mescroll-uni ref="mescroll" :size="10" @getData="getMyPrize">
					<block slot="list">
						<view class="big">
							<view class="list-tab" v-if="typeShow">
								<view class="goods-list" v-if="blindbox.length > 0">
									<view class="list-body" v-for="(items, indexs) in blindbox" :key="indexs">
										<view class="list-body-img" v-if="diff == 1">
											<image v-if="items.sku_image != ''" :src="$util.img(items.sku_image)" @error="errorSkuImg()" mode="aspectFit"></image>
											<image v-else :src="$util.img('public/uniapp/blindbox/default.png')"></image>
										</view>
										<view class="list-body-img-right" v-if="diff == 2">
											<image v-if="items.headimg" :src="$util.img(items.headimg)" @error="errorSkuHeadImg()" mode="aspectFit"></image>
											<image v-else :src="$util.img('public/uniapp/common/default_headimg.png')"></image>
										</view>
										<view class="shop-content" v-if="diff == 1">
											<view class="shop-title">{{ items.sku_name }}</view>
											<view class="shop-time">
												<text class="color-tip font-size-tag">{{ $util.timeStampTurnTime(items.create_time) }}</text>
												<button type="primary" size="mini" v-if="items.is_dispatch == 0" @click="deliver(items)">发货</button>
												<button type="primary" size="mini" v-if="items.is_dispatch == 1" @click="look(items)">查看状态</button>
											</view>
										</view>
										<view class="shop-content-right" v-if="diff == 2">
											<view class="shop-name-right">
												<text>{{ items.nickname }}</text>
												<text class="color-tip font-size-tag">{{ $util.timeStampTurnTime(items.create_time) }}</text>
											</view>
											<view class="shop-title-right color-sub font-size-tag">获得{{ items.sku_name }}</view>
										</view>
									</view>
								</view>
								<view class="prize-null" v-else>
									<view class="prize-image" v-if="diff == 1"><image :src="$util.img('public/uniapp/blindbox/prize_null.png')" mode="aspectFill"></image></view>
									<view class="prize-null-title" v-if="diff == 1">暂无奖品~</view>
									<view class="prize-image" v-if="diff == 2"><image :src="$util.img('public/uniapp/blindbox/people_null.png')" mode="aspectFill"></image></view>
									<view class="prize-null-title" v-if="diff == 2">暂无参与人~</view>
								</view>
							</view>
							<view v-else>
								<view class="jiazai-box " style="background:#fff ;"><view class="jiazai">加载中...</view></view>
							</view>
						</view>
					</block>
				</mescroll-uni>
			</view>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
export default {
	data() {
		return {
			myprizes: true,
			participant: false,
			blindbox: [],
			diff: '1',
			blindgoods: {},
			blindboxId: '',
			mescroll: null,
			token: null,
			typeShow: true
		};
	},
	onLoad(options) {
		this.blindboxId = options.blindbox_id;
		this.getGoods();
	},
	methods: {
		getGoods() {
			this.$api.sendRequest({
				url: '/blindbox/api/blindbox/blindboxInfo',
				data: {
					blindbox_id: this.blindboxId
				},
				success: res => {
					if (res.code >= 0) {
						this.blindgoods = res.data;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		},
		getMyPrize(mescroll) {
			this.mescroll = mescroll;
			this.$api.sendRequest({
				url: '/blindbox/api/blindbox/box',
				data: {
					blindbox_id: this.blindboxId,
					diff: this.diff,
					page: mescroll.num,
					page_size: mescroll.size
				},
				success: res => {
					this.typeShow = true;
					let newArr = [];
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
					
					mescroll.endSuccess(newArr.length); //设置列表数据
					if (mescroll.num == 1) this.blindbox = []; //如果是第一页需手动制空列表
					this.blindbox = this.blindbox.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		myPrize(e) {
			this.blindbox = [];
			this.diff = e;
			this.typeShow = false;
			this.mescroll.resetUpScroll(false);
		},
		errorImg() {
			this.blindgoods.blindbox_images = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		errorSkuImg() {
			this.blindbox.sku_image = this.$util.getDefaultImage().goods;
		},
		errorSkuHeadImg() {
			this.blindbox.headimg = this.$util.getDefaultImage().head;
		},
		deliver(e) {
			uni.setStorage({
				key: 'blindOrderCreateData',
				data: {
					sku_id: e.sku_id.toString() ,
					num:1
				}
			});	
			this.$util.redirectTo('/pages_promotion/blindbox/fill_address', { blindbox_goods_id: e.blindbox_goods_id, out_trade_no: e.out_trade_no });
		},
		look(e) {
			this.$util.redirectTo('/pages/order/list', { order_id: e.order_id });
		}
	}
};
</script>

<style lang="scss">
.prize-box {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	.my_prize {
		height: 100vh;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		display: flex;
		flex-direction: column;
		.top {
			display: flex;
			justify-content: space-between;
			margin-left: 30rpx;
			padding-top: 60rpx;
			.top-img {
				background-color: #fff;
				width: 210rpx;
				height: 210rpx;
				margin-right: 20rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.right {
				flex: 1;
				view {
					color: #fff;
				}
				.blind-title {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					word-break: break-word;
					height: 80rpx;
					line-height: 1.3;
				}
				.statused {
					background-color: #ffbe01;
					border-radius: 6rpx;
					padding: 6rpx 0;
					line-height: 1;
					width: 104rpx;
					text-align: center;
					color: #fff;
					margin: 6rpx 0;
				}
				.ul {
					display: flex;
					align-items: center;

					text {
						color: #fff;
					}
					.chi {
						color: #ffbe01;
					}
					.li {
						display: inline-block;
						background-color: #fff;
						width: 6rpx;
						height: 6rpx;
						border-radius: 50%;
						margin-right: 10rpx;
					}
				}
			}
		}
		.content {
			margin: 60rpx 30rpx;
			border: 2rpx solid #d1beff;
			border-radius: 20rpx;
			background-color: #8a6de1;
			flex: 1;
			.tabs {
				display: flex;
				box-sizing: border-box;
				.tab {
					width: 50%;
					text-align: center;
					height: 80rpx;
					line-height: 80rpx;
					background-color: #d1beff;
				}
				.tab_left {
					border-radius: 18rpx 0 20rpx 0;
					color: #1f066c;
					font-weight: bold;
				}
				.tab_right {
					border-radius: 0 18rpx 0 20rpx;
					color: #1f066c;
					font-weight: bold;
				}
				.act {
					background: #8a6de1 !important;
					margin: 0 -2rpx;
					margin-top: -20rpx;
					line-height: 80rpx;
					height: 80rpx;
					border-top: 2rpx solid #d1beff;
					border-left: 2rpx solid #d1beff;
					border-right: 2rpx solid #d1beff;
					border-radius: 20rpx 20rpx 0 0;
					color: #ffffff;
				}
			}
			.list-tab {
				.goods-list {
					background-color: #8a6de1;
					background-color: #fff;
					border-radius: 10rpx;
					padding: 30rpx;
					.list-body {
						display: flex;
						justify-content: space-between;
						align-items: center;
						border-bottom: 2rpx solid $color-line;
						padding-bottom: 30rpx;
						margin-bottom: 30rpx;
						&:last-child {
							border-bottom: none;
							padding-bottom: 0;
							margin-bottom: 0;
						}
						.list-body-img {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 150rpx;
							height: 150rpx;
							margin-right: 20rpx;
							background-color: #fff;
							image {
								width: 100%;
								height: 100%;
							}
						}
						.shop-content {
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							flex: 1;
							.shop-title {
								margin-top: -8rpx;
								height: 84rpx;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 2;
								-webkit-box-orient: vertical;
								word-break: break-word;
								line-height: 42rpx;
								color: $color-title;
							}
							.shop-time {
								display: flex;
								justify-content: space-between;
								align-items: flex-end;
								margin-top: 20rpx;
							}
						}
						.list-body-img-right {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 80rpx;
							height: 80rpx;
							background-color: #fff;
							margin-right: 20rpx;
							image {
								width: 100%;
								height: 100%;
								border-radius: 50%;
							}
						}
						.shop-content-right {
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							flex: 1;
							.shop-name-right {
								display: flex;
								align-items: center;
								justify-content: space-between;
							}
							.shop-title-right {
								margin-top: -8rpx;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 1;
								-webkit-box-orient: vertical;
								color: $color-title;
								margin-top: 10rpx;
							}
						}
					}
				}
				.prize-null {
					background-color: #fff;
					border-radius: 10rpx;
					display: flex;
					flex-direction: column;
					text-align: center;
					align-items: center;
					padding: 220rpx;
					.prize-image {
						width: 468rpx;
						height: 314rpx;
						image {
							width: 100%;
							height: 100%;
						}
					}
				}
			}
		}
	}
}
.jiazai-box {
	background-color: #fff;
	border-radius: 10rpx;
	display: -webkit-box;
	display: -webkit-flex;
	display: flex;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	-webkit-flex-direction: column;
	flex-direction: column;
	text-align: center;
	-webkit-box-align: center;
	-webkit-align-items: center;
	align-items: center;
	padding-bottom: 535rpx;
	padding-top: 100rpx;
	.jiazai {
		text-align: center;
	}
}
</style>
<style>
/deep/ .mescroll-uni-fixed {
	background-color: #8a6de1;
	margin: 0 30rpx;
	padding: 30rpx 10rpx 20rpx !important;
	border: 2rpx solid #d1beff;
	border-top: none;
	top: 408rpx !important;
	bottom: 60rpx !important;
	/* height: 860rpx !important; */
	border-radius: 0 0 20rpx 20rpx;
}
/* /deep/ .list-tab .mescroll-uni-fixed{
		background-color: #8A6DE1;
		margin: 0 30rpx;
		padding: 30rpx 10rpx 20rpx !important;
		border: 2rpx solid #D1BEFF;
		border-top: none;
		top: 410rpx !important;
		height: 740rpx !important;
		border-radius: 0 0 20rpx 20rpx;
	}
	/deep/ .list-tab-right .mescroll-uni-fixed{
		background-color: #8A6DE1;
		margin: 0 30rpx;
		padding: 30rpx 10rpx 20rpx !important;
		border: 2rpx solid #D1BEFF;
		border-top: none;
		top: 410rpx !important;
		height: 860rpx !important;
		border-radius: 0 0 20rpx 20rpx;
	} */
/deep/ .mescroll-upwarp {
	min-height: 0 !important;
	padding: 0 !important;
	text-align: center;
	clear: both;
	margin-bottom: 0 !important;
	height: 0 !important;
}
</style>
