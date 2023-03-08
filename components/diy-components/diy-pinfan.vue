<template>
	<view class="diy-pinfan" v-if="list.length" :class="[value.template, value.style]" :style="warpCss">
		<template v-if="value.template == 'row1-of1'">
			<view class="item" v-for="(item, index) in list" :key="index" @click="toDetail(item)" :class="[value.ornament.type]" :style="goodsItemCss">
				<view class="img-wrap" :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }">
					<image :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }" :src="$util.img(item.goods_image,{size: 'mid'})" mode="widthFix" @error="imageError(index)"></image>
				</view>
				<view class="content" v-if="value.goodsNameStyle.control || value.priceStyle.mainControl || value.priceStyle.lineControl || value.btnStyle.control">
					<view
						v-if="value.goodsNameStyle.control"
						class="goods-name"
						:style="{ color: value.theme == 'diy' ? value.goodsNameStyle.color : '', fontWeight: value.goodsNameStyle.fontWeight ? 'bold' : '' }"
						:class="[{ 'using-hidden': value.nameLineMode == 'single' }, { 'multi-hidden': value.nameLineMode == 'multiple' }]"
					>
						{{ item.goods_name }}
					</view>
					<view class="tag-wrap" v-if="value.groupStyle.control || value.saleStyle.control">
						<view
							v-if="value.groupStyle.control"
							:style="{ color: value.theme == 'diy' ? value.groupStyle.bgColor : '', borderColor: value.theme == 'diy' ? value.groupStyle.bgColor : '' }"
						>
							<text class="iconfont iconyonghu3" :style="{ backgroundColor: value.theme == 'diy' ? value.groupStyle.bgColor : '' }"></text>
							<text>{{ item.pintuan_num }}人团</text>
						</view>
						<view
							v-if="value.saleStyle.control"
							:style="{ color: value.theme == 'diy' ? value.saleStyle.color : '', borderColor: value.theme == 'diy' ? value.saleStyle.color : '' }"
						>
							<text>已拼{{ item.order_num }}件</text>
						</view>
					</view>
					<view class="price-wrap">
						<view class="discount-price" v-if="value.priceStyle.mainControl">
							<text class="unit price-style small" :style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">¥</text>
							<text class="price price-style large" :style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">{{ item.pintuan_price.split(".")[0] }}</text>
							<text class="unit price-style small" :style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">{{ "."+item.pintuan_price.split(".")[1] }}</text>
						</view>
						<view class="original-price  price-font" v-if="value.priceStyle.lineControl" :style="{ color: value.theme == 'diy' ? value.priceStyle.lineColor : '' }">
							¥{{ item.price }}
						</view>
						<button
							v-if="value.btnStyle.control"
							:style="{
								background: value.btnStyle.theme == 'diy' ? 'linear-gradient(to right,' + value.btnStyle.bgColorStart + ',' + value.btnStyle.bgColorEnd + ')' : '',
								color: value.btnStyle.theme == 'diy' ? value.btnStyle.textColor : '',
								borderRadius: value.btnStyle.aroundRadius * 2 + 'rpx'
							}"
						>
							<text class="text">{{ value.btnStyle.text }}</text>
							<text class="fan" v-if="item.reward_type == 4">返{{ item.reward_type_num }}柚币</text>
							<text class="fan" v-if="item.reward_type == 1 || item.reward_type == 2">返￥{{ item.reward_type_num }}</text>
							<text class="fan" v-if="item.reward_type == 3">返优惠券</text>
						</button>
					</view>
				</view>
			</view>
		</template>

		<template v-if="value.template == 'horizontal-slide'">
			<scroll-view v-if="value.slideMode == 'scroll'" class="scroll" :scroll-x="true" :show-scrollbar="false">
				<view class="item" v-for="(item, index) in list" :key="index" @click="toDetail(item)" :class="[value.ornament.type]" :style="goodsItemCss">
					<view class="img-wrap" :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }">
						<image :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }" :src="$util.img(item.goods_image,{size: 'mid'})" mode="widthFix" @error="imageError(index)"></image>
					</view>
					<view :class="['content', { 'multi-content': value.nameLineMode == 'multiple' }]" v-if="value.goodsNameStyle.control || value.priceStyle.mainControl">
						<view
							v-if="value.goodsNameStyle.control"
							class="goods-name"
							:style="{ color: value.theme == 'diy' ? value.goodsNameStyle.color : '', fontWeight: value.goodsNameStyle.fontWeight ? 'bold' : '' }"
							:class="[{ 'using-hidden': value.nameLineMode == 'single' }, { 'multi-hidden': value.nameLineMode == 'multiple' }]"
						>
							{{ item.goods_name }}
						</view>
						<view v-if="value.groupStyle.control" class="num">
							<text
								class="content-tuan-box"
								:style="{ color: value.theme == 'diy' ? value.groupStyle.color : '', backgroundColor: value.theme == 'diy' ? value.groupStyle.bgColor : '' }"
							>
								{{ item.pintuan_num }}人团
							</text>
							<text class="content-tuan-price" :style="{ color: value.theme == 'diy' ? value.groupStyle.bgColor : '' }" v-if="item.reward_type == 4">
								返{{ item.reward_type_num }}柚币
							</text>
							<text
								class="content-tuan-price"
								:style="{ color: value.theme == 'diy' ? value.groupStyle.bgColor : '' }"
								v-if="item.reward_type == 1 || item.reward_type == 2"
							>
								返￥{{ item.reward_type_num }}
							</text>
							<text class="content-tuan-price" :style="{ color: value.theme == 'diy' ? value.groupStyle.bgColor : '' }" v-if="item.reward_type == 3">返优惠券</text>
						</view>
						<view class="price-wrap" v-if="value.priceStyle.mainControl">
							<text class="unit price-style small" :style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">¥</text>
							<text class="price price-style large" :style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">{{ item.pintuan_price.split('.')[0] }}</text>
							<text class="unit price-style small" :style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">{{ "."+item.pintuan_price.split('.')[1] }}</text>
						</view>
					</view>
				</view>
			</scroll-view>

			<swiper v-if="value.slideMode == 'slide'" :autoplay="false" class="swiper" :style="{ height: swiperHeight }">
				<swiper-item v-for="(pageItem,pageIndex) in page" :key="pageIndex" :class="['swiper-item', [list[pageIndex].length / 3] >= 1 && 'flex-between']">
					<view class="item" v-for="(item, dataIndex) in list[pageIndex]" :key="dataIndex" @click="toDetail(item)" :class="[value.ornament.type]" :style="goodsItemCss">
						<view class="img-wrap" :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }">
							<image
								:style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }"
								:src="$util.img(item.goods_image,{size: 'mid'})"
								mode="widthFix"
								@error="imageError(dataIndex)"
							></image>
						</view>
						<view :class="['content', { 'multi-content': value.nameLineMode == 'multiple' }]" v-if="value.goodsNameStyle.control || value.priceStyle.mainControl">
							<view
								v-if="value.goodsNameStyle.control"
								class="goods-name"
								:style="{ color: value.theme == 'diy' ? value.goodsNameStyle.color : '', fontWeight: value.goodsNameStyle.fontWeight ? 'bold' : '' }"
								:class="[{ 'using-hidden': value.nameLineMode == 'single' }, { 'multi-hidden': value.nameLineMode == 'multiple' }]"
							>
								{{ item.goods_name }}
							</view>
							<view v-if="value.groupStyle.control" class="num">
								<text
									class="content-tuan-box"
									:style="{ color: value.theme == 'diy' ? value.groupStyle.color : '', backgroundColor: value.theme == 'diy' ? value.groupStyle.bgColor : '' }"
								>
									{{ item.pintuan_num }}人团
								</text>
								<text class="content-tuan-price" :style="{ color: value.theme == 'diy' ? value.groupStyle.bgColor : '' }" v-if="item.reward_type == 4">
									返{{ item.reward_type_num }}柚币
								</text>
								<text
									class="content-tuan-price"
									:style="{ color: value.theme == 'diy' ? value.groupStyle.bgColor : '' }"
									v-if="item.reward_type == 1 || item.reward_type == 2"
								>
									返￥{{ item.reward_type_num }}
								</text>
								<text class="content-tuan-price" :style="{ color: value.theme == 'diy' ? value.groupStyle.bgColor : '' }" v-if="item.reward_type == 3">
									返优惠券
								</text>
							</view>
							<view class="price-wrap" v-if="value.priceStyle.mainControl">
								<text class="unit price-style small" :style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">¥</text>
								<text class="price price-style large" :style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">{{ item.pintuan_price.split('.')[1] }}</text>
								<text class="unit price-style small" :style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">{{ "."+item.pintuan_price.split('.')[1] }}</text>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</template>
	</view>
</template>

<script>
export default {
	name: 'diy-pinfan',
	props: {
		value: {
			type: Object
		}
	},
	data() {
		return {
			list: [],
			page: 1
		};
	},
	created() {
		this.getData();
	},
	computed: {
		warpCss() {
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
				obj += 'box-shadow:' + '0 0 10rpx ' + this.value.ornament.color + ';';
			}
			if (this.value.ornament.type == 'stroke') {
				obj += 'border:' + '2rpx solid ' + this.value.ornament.color + ';';
			}
			const screenWidth = uni.getSystemInfoSync().safeArea.width || uni.getSystemInfoSync().screenWidth;
			if(this.value.template == 'horizontal-slide'){
				var width = "";
				if(this.value.slideMode == 'scroll' && this.value.goodsMarginType=='diy')
					width = this.rpxUpPx(this.value.goodsMarginNum*2);
				else
					width = [screenWidth - (this.rpxUpPx(20)*2) - (this.rpxUpPx(200)*3) - (this.rpxUpPx(this.value.margin.both*2)*2)]/6;
				obj += 'margin-left:' + width + "px;";
				obj += 'margin-right:' + width + "px;";
			}
			return obj;
		},
		swiperHeight() {
			if (this.value.nameLineMode == 'multiple')
				return this.value.ornament.type == 'shadow' ? '444rpx' : '432rpx';
			return this.value.ornament.type == 'shadow' ? '404rpx' : '396rpx';
		}
	},
	methods: {
		rpxUpPx(res){
			const screenWidth = uni.getSystemInfoSync().safeArea.width || uni.getSystemInfoSync().screenWidth;
			var data = screenWidth * parseInt(res) / 750;
			return Math.floor(data);
		},
		getData() {
			var data = {
				page: 1,
				page_size: this.value.count
			};
			if (this.value.sources == 'diy') {
				data.page_size = 0;
				data.goods_id_arr = this.value.goodsId.toString();
			}
			this.$api.sendRequest({
				url: '/pinfan/api/goods/page',
				data: data,
				success: res => {
					if (res.code == 0 && res.data) {
						this.list = res.data.list;

						// 切屏滚动，每页显示固定数量
						if (this.value.template == 'horizontal-slide' && this.value.slideMode == 'slide') {
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
				}
			});
		},
		toDetail(e) {
			this.$util.redirectTo('/pages_promotion/pinfan/detail', {
				pinfan_id: e.pintuan_id
			});
		},
		imageError(index) {
			this.list[index].goods_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss">
/deep/.uni-scroll-view ::-webkit-scrollbar {
	/* 隐藏滚动条，但依旧具备可以滚动的功能 */
	display: none;
	width: 0;
	height: 0;
	color: transparent;
	background: transparent;
}

/deep/::-webkit-scrollbar {
	display: none;
	width: 0;
	height: 0;
	color: transparent;
	background: transparent;
}

scroll-view ::-webkit-scrollbar {
	width: 0;
	height: 0;
	background-color: transparent;
	touch-action: none;
}

.diy-pinfan {
	&.row1-of1 {
		.item {
			display: flex;
			margin-bottom: 20rpx;
			padding: 16rpx;
			&.shadow {
				margin: 8rpx 8rpx 20rpx 8rpx;
			}
			&:last-child {
				margin-bottom: 0;
			}
			.img-wrap {
				width: 200rpx;
				height: 200rpx;
				image {
					width: 200rpx;
				}
			}
			.content {
				flex: 1;
				margin-left: 20rpx;
				position: relative;
				display: flex;
				justify-content: space-between;
				flex-direction: column;
				padding: 6rpx 0;
				.goods-name {
					line-height: 1.3;
				}
				.tag-wrap {
					display: flex;
					align-items: center;
					margin-top: 4rpx;
					> view {
						height: 30rpx;
						line-height: 30rpx;
						border: 2rpx solid $base-color;
						border-radius: 6rpx;
						margin-right: 10rpx;
						font-size: $font-size-activity-tag;
						color: $base-color;
						.iconfont {
							display: inline-block;
							width: 30rpx;
							height: 30rpx;
							font-size: $font-size-activity-tag;
							color: #ffffff;
							text-align: center;
							margin-right: -6rpx;
							background: $base-color;
						}
						text:last-child {
							padding: 0 10rpx;
						}
					}
				}
				.price-wrap {
					display: flex;
					align-items: flex-end;
					> view:last-of-type {
						flex: 1;
					}
					.discount-price {
						white-space: nowrap;
						font-weight: bold;
						.unit {
							font-size: $font-size-tag;
							color: $base-color;
						}
						.price {
							font-size: $font-size-toolbar;
							color: $base-color;
						}
					}
					.original-price {
						font-size: $font-size-tag;
						color: $color-tip;
						text-decoration: line-through;
						margin: 0 10rpx 4rpx 10rpx;
					}
				}
				button {
					bottom: 10rpx;
					height: 90rpx;
					line-height: 40rpx;
					padding: 0 16rpx;
					margin: 0;
					text-align: center;
					background-color: $base-color;
					color: #ffffff;
					.text {
						display: block;
						margin-top: 6rpx;
						font-size: $font-size-tag;
					}
					.fan {
						font-size: $font-size-activity-tag;
					}
				}
			}
		}
	}
	&.horizontal-slide {
		display: flex;
		justify-content: space-around;
		.scroll {
			width: calc(100% - 40rpx);
			padding: 20rpx;
			line-height: 1;
			white-space: nowrap;
			.item.shadow {
				margin-bottom: 8rpx;
			}
		}
		.flex-between {
			justify-content: space-between;
		}
		.item {
			display: inline-block;
			width: 200rpx;
			overflow: hidden;
			box-sizing: border-box;
			&:nth-child(3n+3){
				width: 198rpx;
			}

			&.shadow {
				margin-top: 8rpx;
			}
			.img-wrap {
				width: 200rpx;
				height: 200rpx;
				position: relative;
				overflow: hidden;
				margin: 0 auto;
				> image {
					width: 200rpx;
				}
			}
			.content {
				padding: 10rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				&.multi-content{
					height: 188rpx;
					box-sizing: border-box;
				}	
				.goods-name {
					line-height: 1.3;
					&.using-hidden{
						display: block;
					}
					&.multi-hidden {
						white-space: break-spaces;
					}
				}
				.num {
					margin-top: auto;
					font-size: $font-size-activity-tag;
					.content-tuan-box {
						border-radius: 4rpx;
						color: #ffffff;
						background-color: $base-color;
						padding: 6rpx;
					}
					.content-tuan-price {
						border-radius: 4rpx;
						padding: 4rpx 8rpx;
						border: 2rpx solid $base-color;
						color: $base-color;
						margin-left: -2rpx;
					}
				}
				.price-wrap {
					white-space: nowrap;
					margin-top: 10rpx;
					font-weight: bold;
					line-height: 1;
					.unit {
						font-size: $font-size-tag;
						height: 32rpx;
						color: $base-color;
					}
					.price {
						font-size: $font-size-toolbar;
						color: $base-color;
					}
				}
			}
		}

		.swiper {
			width: 100%;
			white-space: nowrap;
			padding: 20rpx;
			box-sizing: border-box;
			.swiper-item{
				display: flex;
				align-items: center;
			}
			.item {
				width: 200rpx;
			}
		}
	}
}
</style>
