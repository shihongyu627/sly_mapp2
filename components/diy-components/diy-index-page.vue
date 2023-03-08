<template>
	<scroll-view scroll-y="true" :style="{ height: scrollHeight }" @scroll="scroll" :scroll-top="scrollTop" @scrolltolower="scrolltolower">
		<view class="bg" :style="warpCss">
			<view class="nav_top_category">
				<scroll-view class="diyIndex widthAuto" @click="changePageIndex(0)">
					<view
						class="item text-fiexd"
						:class="{ fill: value.styleType == 'fill' }"
						:style="{ background: pageIndex == 0 && value.styleType == 'fill' ? value.selectColor : '' }"
					>
						<view
							class="text-con"
							:class="pageIndex == 0 ? 'active' : ''"
							:style="{
								color: index == pageIndex ? '' : value.noColor
							}"
							v-if="value.styleType == 'fill'"
						>
							{{ cateList[0].short_name ? cateList[0].short_name : cateList[0].category_name }}
						</view>
						<view
							class="text-con"
							:class="pageIndex == 0 ? 'active' : ''"
							:style="{
								color: pageIndex == 0 ? value.selectColor : value.noColor
							}"
							v-else
						>
							{{ cateList[0].short_name ? cateList[0].short_name : cateList[0].category_name }}
						</view>
						<view
							class="color-base-bg line"
							v-if="pageIndex == 0 && value.styleType != 'fill'"
							:style="{ background: value.selectColor ? value.selectColor + '!important' : 'rgba(0,0,0,0)' + '!important' }"
						></view>
					</view>
				</scroll-view>

				<scroll-view
					v-if="value"
					scroll-with-animation
					class="diyIndex"
					scroll-x="true"
					:scroll-into-view="'a' + pageIndex"
					:style="{ background: value.backgroundColor ? value.backgroundColor : '', width: 'calc(100% - 102rpx)' }"
				>
					<view
						class="item"
						:id="'a' + index"
						v-for="(item, index) in cateList"
						:key="index"
						@click="changePageIndex(index)"
						:class="{ fill: value.styleType == 'fill' }"
						:style="{ background: index == pageIndex && value.styleType == 'fill' ? value.selectColor : '' }"
						v-if="index > 0"
					>
						<view
							class="text-con"
							:class="index == pageIndex ? 'active' : ''"
							:style="{
								color: index == pageIndex ? '' : value.noColor
							}"
							v-if="value.styleType == 'fill'"
						>
							{{ item.short_name ? item.short_name : item.category_name }}
						</view>
						<view
							class="text-con"
							:class="index == pageIndex ? 'active' : ''"
							:style="{
								color: index == pageIndex ? value.selectColor : value.noColor
							}"
							v-else
						>
							{{ item.short_name ? item.short_name : item.category_name }}
						</view>
						<view
							class="color-base-bg line"
							v-if="index == pageIndex && value.styleType != 'fill'"
							:style="{ background: value.selectColor ? value.selectColor + '!important' : 'rgba(0,0,0,0)' + '!important' }"
						></view>
					</view>
				</scroll-view>
			</view>

			<view class="index-page-content" :style="{ height: scrollTopHeight }">
				<block v-if="pageIndex == 0"><slot></slot></block>
				<block v-else>
					<view class="index-category-box">
						<!-- 二级分类 -->
						<view class="twoCategorylist" v-if="twoCategorylist != 'undefined' && twoCategorylist && twoCategorylist.length > 0">
							<view class="twoCategory min" v-if="twoCategorylist.length <= 5">
								<view class="twoCategory-page">
									<view class="swiper-item" v-for="(item, index) in twoCategorylist" :key="index" @click="toCateGoodsList(item.category_id_2, 2)">
										<view class="item-box">
											<image :src="$util.img(item.image)" v-if="item.image" mode="aspectFill"></image>
											<image :src="$util.getDefaultImage().goods" v-else mode="aspectFill"></image>
											<view>{{ item.category_name }}</view>
										</view>
									</view>
								</view>
							</view>
							<view class="twoCategory base" v-if="twoCategorylist.length > 5 && twoCategorylist.length <= 10">
								<view class="twoCategory-page">
									<view class="swiper-item" v-for="(item, index) in twoCategorylist" :key="index" @click="toCateGoodsList(item.category_id_2, 2)">
										<view class="item-box">
											<image :src="$util.img(item.image)" v-if="item.image" mode="aspectFill"></image>
											<image :src="$util.getDefaultImage().goods" v-else mode="aspectFill"></image>
											<view>{{ item.category_name }}</view>
										</view>
									</view>
								</view>
							</view>
							<swiper class="twoCategory big" :duration="500" v-if="twoCategorylist.length > 10" @change="swiperTocategoryChange">
								<swiper-item class="twoCategory-page" v-for="page in maxPage" :key="page">
									<view
										class="swiper-item"
										v-for="(item, index) in twoCategorylist"
										:key="index"
										v-if="index >= (page - 1) * 10 && index < page * 10"
										@click="toCateGoodsList(item.category_id_2, 2)"
									>
										<view class="item-box">
											<image :src="item.image" mode="aspectFill"></image>
											<view>{{ item.category_name }}</view>
										</view>
									</view>
								</swiper-item>
							</swiper>
							<view class="dot-box">
								<view
									class="dot-item"
									v-for="page in maxPage"
									v-if="maxPage > 1"
									:key="page"
									:class="twoCategorylistId == page - 1 ? 'active color-base-bg' : ''"
								></view>
							</view>
						</view>

						<!-- 分类广告 -->
						<image class="category_adv ns-margin" v-if="cateList[pageIndex].image_adv" :src="$util.img(cateList[pageIndex].image_adv)" mode="widthFix"></image>

						<view class="category-goods" v-show="!isloading">
							<view class="goods-list double-column" v-if="goodsList[pageIndex].list.length">
								<view class="goods-item" v-for="(item, index) in goodsList[pageIndex].list" :key="index" @click="toDetail(item)">
									<view class="goods-img">
										<image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(index)"></image>
										<view class="color-base-bg goods-tag" v-if="value.goodsTag == 'default' && goodsTag(item) != ''">{{ goodsTag(item) }}</view>
										<view class="goods-tag-img" v-if="value.goodsTag == 'diy'"><image :src="$util.img(value.tagImg.imageUrl)" mode=""></image></view>
									</view>
									<view class="info-wrap">
										<view class="name-wrap">
											<view class="goods-name">{{ item.goods_name }}</view>
										</view>
										<view class="pro-info">
											<view class="delete-price font-size-activity-tag color-tip">
												<text class="unit">{{ $lang('common.currencySymbol') }}</text>
												{{ item.market_price > 0 ? item.market_price : item.price }}
											</view>
											<view class="sale font-size-activity-tag color-tip">已售{{ item.sale_num }}{{ item.unit ? item.unit : '件' }}</view>
										</view>
										<view class="lineheight-clear">
											<view class="discount-price">
												<text class="unit color-base-text font-size-tag">{{ $lang('common.currencySymbol') }}</text>
												<text class="price color-base-text font-size-toolbar">{{ showPrice(item) }}</text>
											</view>
											<view class="member-price-tag" v-if="item.member_price && item.member_price == showPrice(item)">
												<image :src="$util.img('public/uniapp/index/VIP.png')" mode="widthFix"></image>
											</view>
											<view class="member-price-tag" v-else-if="item.promotion_type == 1">
												<image :src="$util.img('public/uniapp/index/discount.png')" mode="widthFix"></image>
											</view>
										</view>
									</view>
								</view>
							</view>
							<ns-empty v-else-if="!isloading" :isIndex="false" text="该分类下暂无商品"></ns-empty>
						</view>
						<view class="loading" v-show="isloading"><ns-loading ref="loading"></ns-loading></view>
					</view>
				</block>
			</view>
		</view>
	</scroll-view>
</template>

<script>
import nsLoading from '@/components/ns-loading/ns-loading.vue';
export default {
	props: {
		value: {
			type: Object
		},
		scrollHeight: {
			type: String
		},
		scrollTopHeight: {
			type: String
		},
		bgUrl: {
			type: String
		}
	},
	components: {
		nsLoading
	},
	data() {
		return {
			pageIndex: 0, //当前选中分类id
			cateList: [
				{
					//header分类
					category_name: '首页'
				}
			],
			twoCategorylist: [], //二级分类
			twoCategorylistId: 0, //二级分类所在的swiper
			goodsList: {},
			scrollTop: 0,
			scrollTopCopy: 0,
			isloading: true
		};
	},
	computed: {
		warpCss() {
			var obj = '';
			obj += 'background-color:' + this.value.componentBgColor + ';';
			obj += this.bgUrl ? 'background:' + 'url(' + this.$util.img(this.bgUrl) + ') no-repeat 0 0/100%' : '';
			return obj;
		},
		maxPage() {
			let num = 0;
			if (this.twoCategorylist && this.twoCategorylist.length) {
				num = Math.ceil(this.twoCategorylist.length / 10);
			}
			return num;
		},
		type() {
			if (this.value) {
				return true;
			} else {
				return false;
			}
		}
	},
	watch: {
		type(newVal, oldVal) {
			if (newVal) {
				this.getCategoryList();
			}
		}
	},
	mounted() {
		this.getCategoryList();
	},
	methods: {
		initPageIndex() {
			this.pageIndex = 0;
		},
		//请求分类列表
		getCategoryList() {
			let url = '/api/goodscategory/tree';
			let data = {
				level: 3,
				template: 2
			};
			this.$api.sendRequest({
				url: url,
				data: data,
				success: res => {
					if (res.code >= 0) {
						let arr = [];
						let obj = {
							list: [],
							isAll: false
						};
						obj.category_name = this.value.title ? this.value.title : '首页';
						arr.push(obj);
						this.cateList = arr.concat(res.data);
						Object.keys(this.cateList).forEach((key, index) => {
							this.goodsList[key] = {
								page: 1,
								list: [],
								isAll: false
							};
						});
						this.twoCategorylist = this.cateList[this.pageIndex].child_list;
					}
				}
			});
		},
		//修改当前页面id
		changePageIndex(e) {
			this.isloading = true;
			this.pageIndex = e;
			if (e == 0) return;
			this.twoCategorylist = this.cateList[this.pageIndex].child_list;
			this.twoCategorylist = this.cateList[this.pageIndex].child_list;
			if (this.cateList[this.pageIndex].child_list) {
				this.twoCategorylist = this.cateList[this.pageIndex].child_list;
				this.twoCategorylist.forEach(v => {
					if (v.image) {
						v.image = this.$util.img(v.image);
					} else {
						v.image = this.$util.getDefaultImage().goods;
					}
				});
			} else {
				this.twoCategorylist = false;
			}
			let id = e;
			if (this.goodsList[id] && this.goodsList[id].length) return;
			this.scrollTop = this.scrollTopCopy;
			this.$nextTick(function() {
				this.scrollTop = 0;
			});
			this.getGoodsList();
		},

		//swiper  监听变化
		swiperChange(e) {
			this.changePageIndex(e.detail.current);
		},

		//监听二级分类  页面切换
		swiperTocategoryChange(e) {
			this.twoCategorylistId = e.detail.current;
		},

		toDetail(item) {
			this.$util.redirectTo('/pages/goods/detail', {
				goods_id: item.goods_id
			});
		},

		scroll(e) {
			this.scrollTopCopy = e.detail.scrollTop;
		},

		getGoodsList() {
			let id = this.pageIndex;
			var data = {
				page: this.goodsList[id].page,
				page_size: 10
			};
			data.category_id = this.cateList[this.pageIndex].category_id_1;
			data.category_level = 1;
			this.$api.sendRequest({
				url: '/api/goodssku/page',
				data: data,
				success: res => {
					this.isloading = false;
					if (res.code == 0 && res.data) {
						this.goodsList[id].list = this.goodsList[id].list.concat(res.data.list);
						if (this.goodsList[id].list.length == res.data.count) {
							this.goodsList[id].isAll = true;
						}
						this.goodsList[id].page += 1;
					}
					this.$forceUpdate();
				}
			});
		},

		//滚动到底部
		scrolltolower() {
			let id = this.pageIndex;
			if (this.goodsList[id].isAll) return;
			this.isloading = true;
			this.getGoodsList();
		},
		toCateGoodsList(e, f) {
			this.$util.redirectTo('/pages/goods/list', { category_id: e, category_level: f });
		},
		goodsImg(imgStr) {
			let imgs = imgStr.split(',');
			return imgs[0] ? this.$util.img(imgs[0], { size: 'mid' }) : this.$util.getDefaultImage().goods;
		},
		imgError(index) {
			this.goodsList[index].goods_image = this.$util.getDefaultImage().goods;
		},
		showPrice(data) {
			let price = data.discount_price;
			if (data.member_price && parseFloat(data.member_price) < parseFloat(price)) price = data.member_price;
			return price;
		},
		goodsTag(data) {
			return data.label_name || '';
		}
	}
};
</script>

<style lang="scss">
.bg {
	width: 100%;
	height: 100%;
	padding: 0 30rpx;
	box-sizing: border-box;
}
.nav_top_category {
	display: flex;
	.text-fiexd {
		.text-con {
			line-height: 60rpx;
			// &.active{
			// 	line-height: 1.8;
			// }
		}
	}
}
.diyIndex {
	width: 100%;
	height: 100rpx;
	white-space: nowrap;
	padding: 20rpx 0 0;
	box-sizing: border-box;
	&.widthAuto {
		width: auto;
	}
	.item {
		padding: 0 20rpx;
		display: inline-block;
		line-height: 80rpx;
		font-size: $font-size-base;
		text-align: center;
		.text-con {
			height: 60rpx;
			line-height: 60rpx;
		}
		.text-con.active {
			font-size: $font-size-toolbar;
			font-weight: 600;
		}
		.line {
			width: 100%;
			height: 5rpx;
			border-radius: 5rpx;
		}
		&.fill {
			border-radius: 50rpx;
			.text-con.active {
				font-size: $font-size-base;
				font-weight: 600;
				color: #fff;
			}
		}
	}
}
.index-page-box {
	width: 100%;
	height: calc(100vh - 288rpx);
}
.index-page-content {
	width: 100%;
	// height: calc(100vh - 144px);
}

.index-category-box.active {
	padding-bottom: 160rpx;
	padding-bottom: calc(160rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
}
.index-category-box {
	width: 100%;
	padding-bottom: 110rpx;
	padding-bottom: calc(110rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(110rpx + env(safe-area-inset-bottom));
	.twoCategorylist {
		position: relative;
	}
	.twoCategory.min {
		height: 160rpx;
	}
	.twoCategory.big {
		height: 340rpx;
	}
	.twoCategory {
		width: 100%;
		background: #ffffff;
		border-radius: 15rpx;
		overflow: hidden;
		margin-top: 20rpx;
		.twoCategory-page {
			width: 100%;
			height: 100%;
			padding: 20rpx;
			box-sizing: border-box;
		}
		.swiper-item {
			width: 120rpx;
			height: 120rpx;
			display: inline-block;
			margin-right: calc((100% - 120rpx * 5) / 4);
			overflow: hidden;
			.item-box {
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				image {
					width: 88rpx;
					height: 88rpx;
				}
				view {
					width: 100%;
					font-size: 22rpx;
					line-height: 1;
					margin-top: 10rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
					text-align: center;
				}
			}
		}
		.swiper-item:nth-child(5n) {
			margin-right: 0;
		}
		.swiper-item:nth-child(10n + 6) {
			margin-top: 15rpx;
		}
	}
	.dot-box {
		width: calc(100% - 40rpx);
		height: 50rpx;
		position: absolute;
		bottom: 0rpx;
		left: 20rpx;
		background: rgba($color: #000000, $alpha: 0);
		display: flex;
		justify-content: center;
		align-items: center;
		.dot-item {
			width: 12rpx;
			height: 12rpx;
			background: #cccccc;
			border-radius: 6rpx;
			margin-right: 10rpx;
		}
		.dot-item.active {
			width: 24rpx;
		}
	}

	.category_adv {
		width: calc(100%);
		margin-bottom: 0;
		border-radius: 15rpx;
	}

	.category-goods {
		width: 100%;
	}
}
.loading {
	width: 100%;
	height: 50rpx;
}

/deep/.uni-scroll-view::-webkit-scrollbar {
	/* 隐藏滚动条，但依旧具备可以滚动的功能 */
	display: none;
}

.goods-list.double-column {
	display: flex;
	flex-wrap: wrap;
	margin-top: $margin-updown;

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
			padding-top: 100%;
			border-top-left-radius: $border-radius;
			border-top-right-radius: $border-radius;

			image {
				width: 100%;
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
			}
		}

		.goods-tag {
			color: #fff;
			line-height: 1;
			padding: 8rpx 16rpx;
			position: absolute;
			border-bottom-right-radius: $border-radius;
			top: 0;
			left: 0;
			font-size: $font-size-goods-tag;
		}

		.goods-tag-img {
			position: absolute;
			border-top-left-radius: $border-radius;
			width: 80rpx;
			height: 80rpx;
			top: 0;
			left: 0;
			z-index: 5;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.info-wrap {
			padding: 0 26rpx 26rpx 26rpx;
		}

		.goods-name {
			font-size: $font-size-base;
			line-height: 1.3;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
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
		}

		.pro-info {
			display: flex;
			margin-top: 16rpx;

			.delete-price {
				text-decoration: line-through;
				flex: 1;

				.unit {
					margin-right: 6rpx;
				}
			}

			& > view {
				line-height: 1;

				&:nth-child(2) {
					text-align: right;
				}
			}
		}

		.member-price-tag {
			display: inline-block;
			width: 60rpx;
			line-height: 1;
			margin-left: 6rpx;

			image {
				width: 100%;
			}
		}
	}
}
</style>
