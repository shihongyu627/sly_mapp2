<template>
	<view class="diy-fenxiao" v-if="list.length" :class="['goods-list', value.template, value.style]" :style="goodsListWarpCss">
		<view class="goods-item" v-for="(item, index) in list" :key="index" @click="toDetail(item)" :class="[value.ornament.type]" :style="goodsItemCss">
			<view class="goods-img" :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }">
				<image :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }" :src="$util.img(item.goods_image,{size: 'mid'})" mode="widthFix" @error="imgError(index)"></image>
			</view>
			<view class="info-wrap" v-if="value.goodsNameStyle.control || value.priceStyle.mainControl || value.priceStyle.lineControl || value.btnStyle.control">
				<view class="name-wrap">
					<view
						v-if="value.goodsNameStyle.control"
						class="goods-name"
						:style="{ color: value.theme == 'diy' ? value.goodsNameStyle.color : '', fontWeight: value.goodsNameStyle.fontWeight ? 'bold' : '' }"
						:class="[{ 'using-hidden': value.nameLineMode == 'single' }, { 'multi-hidden': value.nameLineMode == 'multiple' }]"
					>
						{{ item.goods_name }}
					</view>
				</view>
				<view class="pro-info">
					<view class="discount-price">
						<view class="price-wrap" v-if="value.priceStyle.mainControl">
							<text class="unit price-style small" :style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor : '' }">赚 ￥</text>
							<text class="price price-style large" :style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor : '' }">{{ item.commission_money.split(".")[0] }}</text>
							<text class="unit price-style small" :style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor : '' }">{{ "."+item.commission_money.split(".")[1] }}</text>
						</view>
						<view
							class="sale-btn"
							v-if="value.btnStyle.control && item.is_collect == 0"
							:style="{
								background: value.btnStyle.theme == 'diy' ? 'linear-gradient(to right,' + value.btnStyle.bgColorStart + ',' + value.btnStyle.bgColorEnd + ')' : '',
								color: value.btnStyle.theme == 'diy' ? value.btnStyle.textColor : '',
								borderRadius: value.btnStyle.aroundRadius * 2 + 'rpx'
							}"
							@click.stop="followGoods(item, index)"
						>
							关注
						</view>
						<view
							class="sale-btn"
							v-if="value.btnStyle.control && item.is_collect == 1"
							:style="{
								background: value.btnStyle.theme == 'diy' ? 'linear-gradient(to right,' + value.btnStyle.bgColorStart + ',' + value.btnStyle.bgColorEnd + ')' : '',
								color: value.btnStyle.theme == 'diy' ? value.btnStyle.textColor : '',
								borderRadius: value.btnStyle.aroundRadius * 2 + 'rpx'
							}"
							@click.stop="delFollowTip(item, index)"
						>
							取消关注
						</view>
					</view>
					<view class="delete-price" v-if="value.priceStyle.lineControl" :style="{ color: value.theme == 'diy' ? value.priceStyle.lineColor : '' }">
						￥{{ item.discount_price }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'diy-fenxiao-goods-list',
	props: {
		value: {
			type: Object
		}
	},
	data() {
		return {
			list: [],
			currentRoute: ''
		};
	},
	created() {
		let currentPage = getCurrentPages()[getCurrentPages().length - 1];
		this.currentRoute = '/' + currentPage.route;
		if (!uni.getStorageSync('token')) {
			this.$util.redirectTo(
				'/pages_tool/login/login',
				{
					back: this.currentRoute
				},
				'redirectTo'
			);
		}
		this.getData();
	},
	computed: {
		goodsListWarpCss() {
			var obj = '';
			obj += 'background-color:' + this.value.componentBgColor + ';';
			if (this.value.componentAngle == 'round') {
				obj += 'border-top-left-radius:' + this.value.topAroundRadius * 2 + 'rpx;';
				obj += 'border-top-right-radius:' + this.value.topAroundRadius * 2 + 'rpx;';
				obj += 'border-bottom-left-radius:' + this.value.bottomAroundRadius * 2 + 'rpx;';
				obj += 'border-bottom-right-radius:' + this.value.bottomAroundRadius * 2 + 'rpx;';
			}
			return obj;
		},
		// 商品项样式
		goodsItemCss() {
			var obj = '';
			obj += 'background-color:' + this.value.elementBgColor + ';';
			if (this.value.elementAngle == 'round') {
				obj += 'border-top-left-radius:' + this.value.topElementAroundRadius * 2 + 'rpx;';
				obj += 'border-top-right-radius:' + this.value.topElementAroundRadius * 2 + 'rpx;';
				obj += 'border-bottom-left-radius:' + this.value.bottomElementAroundRadius * 2 + 'rpx;';
				obj += 'border-bottom-right-radius:' + this.value.bottomElementAroundRadius * 2 + 'rpx;';
			}
			if (this.value.ornament.type == 'shadow') {
				obj += 'box-shadow:' + '0 0 10rpx ' + this.value.ornament.color;
			}
			if (this.value.ornament.type == 'stroke') {
				obj += 'border:' + '2rpx solid ' + this.value.ornament.color;
			}
			return obj;
		}
	},
	methods: {
		//页面跳转
		toDetail(e) {
			this.$util.redirectTo('/pages/goods/detail', { goods_id: e.goods_id });
		},
		//关注
		followGoods(e, index) {
			let goods_id = e.goods_id;
			let sku_id = e.sku_id;
			this.$api.sendRequest({
				url: '/fenxiao/api/goodscollect/add',
				data: {
					goods_id: goods_id,
					sku_id: sku_id
				},
				success: res => {
					if (res.code >= 0) {
						this.$util.showToast({ title: '关注成功' });
						this.list[index].is_collect = 1;
						this.list[index].collect_id = res.data;
					}
					this.$forceUpdate();
				}
			});
		},
		//取消关注
		delFollowTip(e, index) {
			uni.showModal({
				title: '提示',
				content: '确认取消关注该商品吗',
				success: res => {
					if (res.confirm) {
						this.delFollow(e.collect_id, index);
					}
				}
			});
		},
		delFollow(e, f) {
			this.$api.sendRequest({
				url: '/fenxiao/api/goodscollect/delete',
				data: {
					collect_id: e
				},
				success: res => {
					let msg = '';
					if (res.code == 0) {
						msg = '取消成功';
					} else {
						msg = res.message;
					}
					this.$util.showToast({
						title: msg
					});

					let arr = this.list;
					arr[f].is_collect = 0;
					this.list = arr;
					this.$forceUpdate();
				}
			});
		},
		toMore() {
			this.$util.redirectTo('/pages_promotion/fenxiao/goods_list');
		},
		getData() {
			var data = {
				page: 1,
				page_size: this.value.count
			};
			if (this.value.sources == 'category') {
				data.category_id = this.value.categoryId;
				data.category_level = 1;
			} else if (this.value.sources == 'diy') {
				data.page_size = 0;
				data.goods_id_arr = this.value.goodsId.toString();
			}
			this.$api.sendRequest({
				url: '/fenxiao/api/goods/page',
				data: data,
				success: res => {
					if (res.code == 0) {
						this.list = res.data.list;
					}
				}
			});
		},
		imgError(index) {
			if (this.list[index]) this.list[index].goods_image = this.$util.getDefaultImage().goods;
		}
	}
};
</script>

<style lang="scss">
.diy-fenxiao {
}

// 商品列表单列样式
.goods-list.row1-of1 {
	.goods-item {
		background-color: #fff;
		display: flex;
		margin-bottom: 20rpx;
		&:last-of-type {
			margin-bottom: 0;
		}
		&.shadow {
			margin: 8rpx 8rpx 20rpx 8rpx;
		}

		.goods-img {
			width: 180rpx;
			overflow: hidden;
			margin-right: 20rpx;
			image {
				width: 100%;
			}
		}

		.info-wrap {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			position: relative;

			.name-wrap {
				flex: 1;
				margin-bottom: 10rpx;
				.goods-name {
					font-size: $font-size-base;
					line-height: 1.3;
					&.multi-hidden {
						height: 72rpx;
					}
				}
			}

			.pro-info {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.sale {
					font-size: 20rpx;
					line-height: 1;
					color: #999;
				}
				.discount-price {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 10rpx;
					.price-wrap {
						white-space: nowrap;
						.unit {
							font-size: $font-size-tag;
							color: $base-color;
						}
						.price{
							font-size: $font-size-toolbar;
						}
						text {
							font-weight: bold;
							color: $base-color;
						}
					}
				}

				.delete-price {
					text-decoration: line-through;
					flex: 1;
					line-height: 28rpx;
					color: $color-tip;
					font-size: $font-size-activity-tag;
				}
			}
			.sale-btn {
				position: absolute;
				right: 20rpx;
				bottom: 26rpx;
				height: 50rpx;
				line-height: 52rpx;
				color: #fff;
				width: 120rpx;
				text-align: center;
				background-color: $base-color;
			}
		}
	}
}

// 商品列表两列样式
.goods-list.row1-of2 {
	display: flex;
	flex-wrap: wrap;
	.goods-item {
		position: relative;
		background: #fff;
		overflow: hidden;
		margin-right: 20rpx;
		margin-top: 20rpx;
		width: calc(50% - 10rpx);
		&:nth-child(2n+2) {
			width: calc(50% - 11rpx);
			margin-right: 0;
		}
		&:nth-of-type(1),
		&:nth-of-type(2) {
			margin-top: 0;
		}
		&.shadow {
			width: calc(50% - 18rpx);
			&:nth-child(2n-1) {
				margin-left: 8rpx;
			}
			&:nth-of-type(1),
			&:nth-of-type(2) {
				margin-top: 8rpx;
			}
		}
		.goods-img {
			position: relative;
			overflow: hidden;
			height: 350rpx;

			image {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 49%;
				left: 0;
				transform: translateY(-50%);
			}
		}

		.info-wrap {
			padding: 10rpx 20rpx;

			.name-wrap {
				margin-bottom: 10rpx;
				.goods-name {
					font-size: $font-size-base;
					line-height: 1.3;
					&.multi-hidden {
						height: 72rpx;
					}
				}
			}

			.pro-info {
				margin-top: 10rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.sale {
					font-size: 20rpx;
					line-height: 1;
					color: #999;
				}
				.discount-price {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.price-wrap {
						white-space: nowrap;
						.unit {
							font-size: $font-size-tag;
							color: $base-color;
						}
						.price{
							font-size: $font-size-toolbar;
						}
						text {
							font-weight: bold;
							color: $base-color;
						}
					}
				}

				.delete-price {
					text-decoration: line-through;
					flex: 1;
					line-height: 28rpx;
					color: $color-tip;
					font-size: $font-size-activity-tag;
				}
			}
			.sale-btn {
				position: absolute;
				right: 20rpx;
				bottom: 26rpx;
				height: 50rpx;
				line-height: 52rpx;
				color: #fff;
				width: 120rpx;
				text-align: center;
				background-color: $base-color;
			}
		}
	}
}
</style>
