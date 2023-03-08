<template>
	<view v-if="list.length" :class="['goods-list', goodsValue.style]" :style="goodsListWarpCss">
		<view class="top-wrap">
			<text :class="['js-icon', goodsValue.topStyle.icon.value]" :style="{ backgroundColor: goodsValue.topStyle.icon.bgColor, color: goodsValue.topStyle.icon.color }"></text>
			<text class="title" :style="{ color: goodsValue.topStyle.color }">{{ goodsValue.topStyle.title }}</text>
			<text class="line" :style="{ color: goodsValue.topStyle.subColor }"></text>
			<text class="sub" :style="{ color: goodsValue.topStyle.subColor }">{{ goodsValue.topStyle.subTitle }}</text>
		</view>
		<swiper :autoplay="false" class="swiper" :style="{ height: swiperHeight }">
			<swiper-item v-for="(item,index) in page" :key="index" :class="['swiper-item', [list[index].length / 3] >= 1 && 'flex-between']">
				<view
					class="goods-item"
					v-for="(dataItem, dataIndex) in list[index]"
					:key="dataIndex"
					@click="toDetail(dataItem)"
					:class="[goodsValue.ornament.type]"
					:style="goodsItemCss"
				>
					<image
						class="goods-img"
						:style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }"
						:src="$util.img(dataItem.goods_image,{size: 'mid'})"
						mode="widthFix"
						@error="imgError(dataIndex)"
						:lazy-load="true"
					></image>
					<view :class="['info-wrap', { 'multi-content': value.nameLineMode == 'multiple' }]" v-if="goodsValue.goodsNameStyle.control || goodsValue.priceStyle.mainControl || goodsValue.priceStyle.lineControl">
						<view
							v-if="goodsValue.goodsNameStyle.control"
							class="goods-name"
							:style="{ color: goodsValue.theme == 'diy' ? goodsValue.goodsNameStyle.color : '', fontWeight: goodsValue.goodsNameStyle.fontWeight ? 'bold' : '' }"
							:class="[{ 'using-hidden': goodsValue.nameLineMode == 'single' }, { 'multi-hidden': goodsValue.nameLineMode == 'multiple' }]"
						>
							{{ dataItem.goods_name }}
						</view>
						<view class="pro-info">
							<view class="discount-price">
								<view class="price-wrap" v-if="goodsValue.priceStyle.mainControl">
									<text class="unit price-style small" :style="{ color: goodsValue.theme == 'diy' ? goodsValue.priceStyle.mainColor +'!important' : '' }">￥</text>
									<text class="price price-style large" :style="{ color: goodsValue.theme == 'diy' ? goodsValue.priceStyle.mainColor +'!important' : '' }">{{ showPrice(dataItem).split(".")[0] }}</text>
									<text class="unit price-style small" :style="{ color: goodsValue.theme == 'diy' ? goodsValue.priceStyle.mainColor +'!important' : '' }">{{ "."+showPrice(dataItem).split(".")[1] }}</text>
								</view>
								<view
									v-if="goodsValue.priceStyle.lineControl"
									class="delete-price price-font"
									:style="{ color: goodsValue.theme == 'diy' ? goodsValue.priceStyle.lineColor : '' }"
								>
									￥{{ dataItem.market_price > 0 ? dataItem.market_price : dataItem.price }}
								</view>
								<view class="sale" v-if="goodsValue.saleStyle.control" :style="{ color: goodsValue.theme == 'diy' ? goodsValue.saleStyle.color : '' }">
									售{{ dataItem.sale_num }}{{ dataItem.unit ? dataItem.unit : '件' }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
export default {
	name: 'diy-goods-recommend',
	props: {
		value: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	data() {
		return {
			list: [],
			goodsValue: {},
			page: 1
		};
	},
	created() {
		this.goodsValue = this.value;
		this.getGoodsList();
	},
	computed: {
		goodsListWarpCss() {
			var obj = '';
			obj += 'background-color:' + this.goodsValue.componentBgColor + ';';
			if (this.goodsValue.componentAngle == 'round') {
				obj += 'border-top-left-radius:' + this.goodsValue.topAroundRadius * 2 + 'rpx;';
				obj += 'border-top-right-radius:' + this.goodsValue.topAroundRadius * 2 + 'rpx;';
				obj += 'border-bottom-left-radius:' + this.goodsValue.bottomAroundRadius * 2 + 'rpx;';
				obj += 'border-bottom-right-radius:' + this.goodsValue.bottomAroundRadius * 2 + 'rpx;';
			}
			if (this.goodsValue.bgUrl) {
				obj += `background-image: url('${this.$util.img(this.goodsValue.bgUrl)}');`;
			}
			return obj;
		},
		// 商品项样式
		goodsItemCss() {
			var obj = '';
			obj += 'background-color:' + this.value.elementBgColor + ';';
			if (this.goodsValue.elementAngle == 'round') {
				obj += 'border-top-left-radius:' + this.goodsValue.topElementAroundRadius * 2 + 'rpx;';
				obj += 'border-top-right-radius:' + this.goodsValue.topElementAroundRadius * 2 + 'rpx;';
				obj += 'border-bottom-left-radius:' + this.goodsValue.bottomElementAroundRadius * 2 + 'rpx;';
				obj += 'border-bottom-right-radius:' + this.goodsValue.bottomElementAroundRadius * 2 + 'rpx;';
			}
			if (this.goodsValue.ornament.type == 'shadow') {
				obj += 'box-shadow:' + '0 0 10rpx ' + this.goodsValue.ornament.color + ";";
			}
			if (this.goodsValue.ornament.type == 'stroke') {
				obj += 'border:' + '2rpx solid ' + this.goodsValue.ornament.color + ";";
			}
			const screenWidth = uni.getSystemInfoSync().safeArea.width || uni.getSystemInfoSync().screenWidth;
			var width = "";
			if(this.goodsValue.style != "style-2"){
				width = [screenWidth - (this.rpxUpPx(20)*2) - (this.rpxUpPx(200)*3) - (this.rpxUpPx(this.value.margin.both*2)*2)]/6;
			}else{
				width = [screenWidth - (this.rpxUpPx(20)*2) - (this.rpxUpPx(20)*2) - (this.rpxUpPx(200)*3) - (this.rpxUpPx(this.value.margin.both*2)*2)]/6;
			}
			obj += 'margin-left:' + width + "px;";
			obj += 'margin-right:' + width + "px;";
			return obj;
		},
		swiperHeight() {
			if(this.goodsValue.style != "style-2"){
				if (this.value.nameLineMode == 'multiple') {
					return '348rpx';
				}
				return '312rpx';
			}else{
				if (this.value.nameLineMode == 'multiple') {
					return '360rpx';
				}
				return '320rpx';
			}
		}
	},
	methods: {
		rpxUpPx(res){
			const screenWidth = uni.getSystemInfoSync().safeArea.width || uni.getSystemInfoSync().screenWidth;
			var data = screenWidth * parseInt(res) / 750;
			return Math.floor(data);
		},
		getGoodsList() {
			var data = {
				page: 1,
				page_size: this.goodsValue.count
			};
			if (this.goodsValue.sources == 'category') {
				data.category_id = this.goodsValue.categoryId;
				data.category_level = 1;
			} else if (this.goodsValue.sources == 'diy') {
				data.page_size = 0;
				data.goods_id_arr = this.goodsValue.goodsId.toString();
			}
			data.order = this.goodsValue.sortWay;

			this.$api.sendRequest({
				url: '/api/goodssku/pagecomponents',
				data: data,
				success: res => {
					if (res.code == 0 && res.data) {
						let data = res.data;
						this.list = data.list;

						// 切屏滚动，每页显示固定数量
						let size = 3;
						let temp = [];
						this.page = Math.ceil(this.list.length / size);
						for (var i = 0; i < this.page; i++) {
							temp[i] = [];
							for (var j = i * size; j < this.list.length; j++) {
								if (temp[i].length == size) break;
								temp[i].push(this.list[j]);
							}
						}
						this.list = temp;
					}
				}
			});
		},
		toDetail(item) {
			this.$util.redirectTo('/pages/goods/detail', {
				goods_id: item.goods_id
			});
		},
		imgError(index) {
			if (this.list[index]) this.list[index].goods_image = this.$util.getDefaultImage().goods;
		},
		showPrice(data) {
			let price = data.discount_price;
			if (data.member_price && parseFloat(data.member_price) < parseFloat(price)) price = data.member_price;
			return price;
		}
	}
};
</script>

<style lang="scss" scoped>
.goods-list {
	.goods-item {
		line-height: 1;
		.sale {
			line-height: 1;
			color: $color-tip;
			font-size: $font-size-activity-tag;
		}

		.info-wrap {
			.goods-name {
				margin-bottom: 10rpx;
				line-height: 1.3;
			}
		}
	}
}

// 商品列表横向滚动样式
.goods-list.style-1 {
	width: 100%;
	white-space: nowrap;
	background-repeat: round;
	.top-wrap {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		.js-icon {
			border-radius: 50%;
			font-size: 40rpx;
			margin-right: 10rpx;
			width: 70rpx;
			height: 70rpx;
			text-align: center;
			line-height: 70rpx;
		}
		.line {
			height: 28rpx;
			margin: 0 10rpx;
			border: 2rpx solid;
		}
		.title {
			font-weight: bold;
			font-size: $font-size-toolbar;
		}
		.sub {
			font-size: $font-size-tag;
		}
	}
	.flex-between {
		justify-content: space-between;
	}
	.swiper {
		display: flex;
		flex-wrap: wrap;
		margin: 0 20rpx;
		.swiper-item{
			display: flex;
			align-items: center;
		}
	}
	.goods-item {
		overflow: hidden;
		width: 200rpx;
		display: inline-block;
		box-sizing: border-box;
		&:nth-child(3n+3){
			width: 198rpx;
		}

		&.shadow {
			margin-top: 8rpx;
		}
		.goods-img {
			width: 100%;
			height: 196rpx;
		}
		.info-wrap {
			display: flex;
			flex-direction: column;
			padding: 10rpx;
			&.multi-content{
				height: 130rpx;
				box-sizing: border-box;
			}

			.goods-name {
				font-size: $font-size-sub;
				&.using-hidden{
					display: block;
				}
				&.multi-hidden {
					white-space: break-spaces;
				}
			}

			.pro-info {
				margin-top: auto;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.discount-price {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.price-wrap {
						line-height: 1;
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
					margin-left: 10rpx;
					text-decoration: line-through;
					flex: 1;
					line-height: 28rpx;
					color: $color-tip;
					font-size: $font-size-activity-tag;
				}
			}
		}
	}
}

// 商品列表横向滚动样式
.goods-list.style-2 {
	width: 100%;
	white-space: nowrap;
	background-repeat: round;
	padding-bottom: 20rpx;
	.top-wrap {
		display: flex;
		align-items: center;
		padding: 20rpx;
		.js-icon {
			border-radius: 50%;
			font-size: 40rpx;
			margin-right: 20rpx;
			width: 70rpx;
			height: 70rpx;
			text-align: center;
			line-height: 70rpx;
		}
		.line {
			height: 28rpx;
			margin: 0 10rpx;
			border: 2rpx solid;
		}
		.title {
			font-weight: bold;
			font-size: $font-size-toolbar;
		}
		.sub {
			font-size: $font-size-tag;
		}
	}
	.swiper {
		display: flex;
		flex-wrap: wrap;
		margin: 0 20rpx;
		padding: 20rpx;
		border-radius: 20rpx;
		background-color: #fff;
	}
	.goods-item {
		overflow: hidden;
		width: 200rpx;
		display: inline-block;
		box-sizing: border-box;
		&.shadow {
			margin-top: 8rpx;
			width: 200rpx;
		}
		.goods-img {
			width: 100%;
			height: 200rpx;
		}
		.info-wrap {
			padding: 10rpx;

			.goods-name {
				line-height: 1;
				&.using-hidden{
					display: block;
				}
				&.multi-hidden {
					line-height: 1.3;
					height: 68rpx;
					white-space: break-spaces;
				}
			}

			.pro-info {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.discount-price {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.price-wrap {
						line-height: 1.3;
						.unit {
							font-size: $font-size-tag;
							color: $base-color;
						}

						text {
							font-weight: bold;
							color: $base-color;
							&:last-of-type {
								font-size: 32rpx;
							}
						}
					}
				}

				.delete-price {
					margin-left: 10rpx;
					text-decoration: line-through;
					flex: 1;
					line-height: 28rpx;
					color: $color-tip;
					font-size: $font-size-activity-tag;
				}
			}
		}
	}
}
</style>
