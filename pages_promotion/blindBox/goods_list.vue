<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="goods-list-box">
		<view class="box-bg" :style="{ backgroundImage: 'url(' + $util.img('public/uniapp/blindbox/index_bg.png') + ')' }">
			<mescroll-uni ref="mescroll" top="30" @getData="getGoods">
				<block slot="list">
					<view class="goods-list double-column" v-if="infoList.length > 0">
						<view class="goods-item margin-bottom" v-for="(item, index) in infoList" :key="index" @click="toDetail(item)">
							<view class="goods-img"><image :src="goodsImg(item.goods_image)" mode="aspectFit" class="imgs-img" @error="infoListImg(index)"></image></view>
							<view class="info-wrap">
								<view class="name-wrap">
									<view class="goods-name">{{ item.goods_name }}</view>
								</view>
								<view class="discount-price">
									<text class="unit color-base-text font-size-tag">
										￥
										<text class="price color-base-text font-size-toolbar">{{ item.price }}</text>
									</text>
								</view>
							</view>
						</view>
					</view>
					<view v-else><ns-empty :isIndex="false" text="暂无数据"></ns-empty></view>
				</block>
			</mescroll-uni>
		</view>
		<ns-login ref="ns-login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
export default {
	data() {
		return {
			state: 1,
			isIphoneX: false, //判断手机是否是iphoneX以上
			showEmpty: false,
			blindbox_id: null,
			infoList: []
		};
	},
	onLoad(data) {
		this.blindbox_id = data.blindbox_id;
		this.isIphoneX = this.$util.uniappIsIPhoneX();
	},
	methods: {
		getGoods(mescroll) {
			this.showEmpty = false;
			this.$api.sendRequest({
				url: '/blindbox/api/goods/info',
				data: {
					blindbox_id: this.blindbox_id,
					page: mescroll.num,
					page_size: mescroll.size
				},
				success: res => {
					this.showEmpty = true;
					let newArr = [];
					if (res.code == 0 && res.data) {
						newArr = res.data.goods_list;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
					mescroll.endSuccess(newArr.length); //设置列表数据
					if (mescroll.num == 1) this.infoList = []; //如果是第一页需手动制空列表
					this.infoList = this.infoList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		goodsImg(imgStr) {
			let imgs = imgStr.split(',');
			return imgs[0]
				? this.$util.img(imgs[0], {
						size: 'mid'
				  })
				: this.$util.getDefaultImage().goods;
		},
		infoListImg(index) {
			this.infoList[index].goods_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		toDetail(e) {
			this.$util.redirectTo('/pages/goods/detail', { goods_id: e.goods_id });
		}
	}
};
</script>

<style lang="scss">
.goods-list-box {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
}
.box-bg {
	background-size: 100% 100%;
	background-repeat: no-repeat;
	height: 100vh;
}
// 商品列表双列样式
.goods-list.double-column {
	display: flex;
	flex-wrap: wrap;
	margin: 0 $margin-both;
	.goods-item {
		flex: 1;
		position: relative;
		background-color: #fff;
		flex-basis: 48%;
		max-width: calc((100% - 30rpx) / 2);
		margin-right: $margin-both;
		margin-bottom: $margin-updown;
		border-radius: $border-radius;
		&:nth-child(2n) {
			margin-right: 0;
		}
		.goods-img {
			position: relative;
			overflow: hidden;
			border-top-left-radius: $border-radius;
			border-top-right-radius: $border-radius;
			width: 330rpx;
			height: 330rpx;
			background-color: #fff;
			image {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
			}
		}
		.info-wrap {
			padding: 0 26rpx 26rpx 26rpx;
			.goods-name {
				font-size: $font-size-base;
				line-height: 1.3;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				word-break: break-word;
				margin-top: 20rpx;
				height: 68rpx;
			}
			.discount-price {
				display: inline-block;
				font-weight: bold;
				line-height: 1;
				margin-top: 16rpx;
				.unit {
					margin-right: 6rpx;
				}
				.delete-price {
					text-decoration: line-through;
					flex: 1;
					font-weight: normal;
					.unit {
						margin-right: 6rpx;
					}
				}
			}
		}
	}
}
</style>
