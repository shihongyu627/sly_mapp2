<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="content">
		<view class="head-wrap">
			<!-- 搜索区域 -->
			<view class="search-wrap uni-flex uni-row">
				<view class="flex-item input-wrap">
					<input class="uni-input" maxlength="50" v-model="keyword" confirm-type="search" @confirm="search()"
						placeholder="请输入商品关键词" />
					<text class="iconfont iconsousuo3" @click.stop="search()"></text>
				</view>
			</view>

			<!-- 排序 -->
			<view class="sort-wrap">
				<view class="comprehensive-wrap" :class="{ 'color-base-text': order === '' }" @click="sortTabClick('')">
					<text :class="{ 'color-base-text': order === '' }">综合</text>
				</view>
				<view class="price-wrap" @click="sortTabClick('point')">
					<text :class="{ 'color-base-text': order === 'point' }">柚币</text>
					<view class="iconfont-wrap">
						<view class="iconfont iconshangsanjiao-copy"
							:class="{ 'color-base-text': priceOrder === 'asc' && order === 'point' }"></view>
						<view class="iconfont iconsanjiao"
							:class="{ 'color-base-text': priceOrder === 'desc' && order === 'point' }"></view>
					</view>
				</view>
				<view class="price-wrap" @click="sortTabClick('create_time')">
					<text :class="{ 'color-base-text': order === 'create_time' }">上新时间</text>
					<view class="iconfont-wrap">
						<view class="iconfont iconshangsanjiao-copy"
							:class="{ 'color-base-text': priceOrder === 'asc' && order === 'create_time' }"></view>
						<view class="iconfont iconsanjiao"
							:class="{ 'color-base-text': priceOrder === 'desc' && order === 'create_time' }"></view>
					</view>
				</view>
				<view :class="{ 'color-base-text': order === 'screen' }" class="screen-wrap">
					<text @click="sortTabClick('screen')">筛选</text>
					<view @click="sortTabClick('screen')" class="iconfont-wrap">
						<view class="iconfont iconshaixuan color-tip"></view>
					</view>
				</view>
			</view>
		</view>

		<mescroll-uni top="180" @getData="getData" ref="mescroll" :size="10">
			<block slot="list">
				<view class="list-wrap">
					<view class="goods-list double-column" v-if="goodsList.length">
						<view class="goods-item margin-bottom" v-for="(item, index) in goodsList" :key="index">
							<view class="goods-img" @click="toDetail(item)">
								<image :src="goodsImg(item.image)" mode="widthFix" @error="imgError(index)"></image>
							</view>
							<view class="info-wrap">
								<view class="name-wrap">
									<view class="goods-name" @click="toDetail(item)">{{ item.name }}</view>
								</view>
								<view class="lineheight-clear">
									<view class="discount-price">
										<text class="unit ">{{ item.point }}</text>
										<text class="unit  font-size-tag">柚币</text>
										<block v-if="item.price > 0 && item.pay_type > 0">
											<text class="unit  font-size-tag">+</text>
											<text class="unit  font-size-tag">{{ $lang('common.currencySymbol') }}</text>
											<text class="price  font-size-toolbar" >{{ parseFloat(item.price).toFixed(2).split(".")[0] }}</text>
											<text class="unit  font-size-tag">.{{ parseFloat(item.price).toFixed(2).split(".")[1] }}</text>
										</block>
									</view>
								</view>
								<view class="pro-info"  v-if="item.stock_show">
									<view class="font-size-activity-tag color-tip">库存{{ item.stock }}</view>
									<view class="sale font-size-activity-tag color-tip" @click="toDetail(item)">
										<!-- <button type="primary" size="mini">立即兑换</button> -->
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="empty" v-if="goodsList.length == 0">
						<ns-empty :isIndex="false" text="暂无柚币商品"></ns-empty>
					</view>
				</view>
			</block>
		</mescroll-uni>

		<!-- 筛选弹出框 -->
		<uni-drawer :visible="showScreen" mode="right" @close="showScreen = false" class="screen-wrap">
			<view class="title color-tip">筛选</view>
			<scroll-view scroll-y>
				<!-- 价格筛选项 -->
				<view class="item-wrap">
					<view class="label"><text>柚币区间</text></view>
					<view class="price-wrap">
						<input class="uni-input" type="digit" v-model="minPoint" placeholder="最低" />
						<view class="h-line"></view>
						<input class="uni-input" type="digit" v-model="maxPoint" placeholder="最高" />
					</view>
				</view>
				<!-- 分类筛选项 -->
				<view class="category-list-wrap">
					<text class="first">全部分类</text>
					<view class="class-box">
						<view @click="selectedCategory('')" class="list-wrap"><text
								:class="{ selected: !categoryId, 'color-base-text': !categoryId }">全部</text></view>
						<view @click="selectedCategory(item.category_id)" v-for="(item, index) in categoryList"
							:key="index" class="list-wrap">
							<text
								:class="{ selected: item.category_id == categoryId, 'color-base-text': item.category_id == categoryId }">{{ item.category_name }}</text>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="footer" :class="{ 'safe-area': isIphoneX }">
				<button type="default" class="footer-box" @click="resetData">重置</button>
				<button type="primary" class="footer-box1" @click="screenData">确定</button>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import uniDrawer from '@/components/uni-drawer/uni-drawer.vue';

	export default {
		components: {
			uniDrawer,
		},
		data() {
			return {
				listStyle: '',
				priceOrder: 'desc',
				categoryList: [], //排序类型
				goodsList: [],
				order: '',
				sort: 'desc',
				showScreen: false,
				keyword: '',
				categoryId: 0,
				minPoint: '',
				maxPoint: '',
				isFreeShipping: false, //是否免邮
				isIphoneX: false,
				coupon: 0,
				emptyShow: false,
				isList: true, //列表样式
				mescroll: null,
				isLogin: false,
				couponList: [],
				hongbaoList: [],
				point: 0,
				token: null,
				memberInfo: {
					headimg: ''
				},
			};
		},
		onLoad(options) {
			this.categoryId = options.category_id || 0;
			this.keyword = options.keyword || '';
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			this.coupon = options.coupon || 0;
			this.loadCategoryList(this.categoryId);
		},
		methods: {
			//获取柚币商品详情
			getData(mescroll) {
				this.$api.sendRequest({
					url: '/pointexchange/api/goods/page',
					data: {
						page_size: mescroll.size,
						page: mescroll.num,
						type: 1,
						keyword: this.keyword,
						category_id: this.categoryId,
						min_point: this.minPoint,
						max_point: this.maxPoint,
						is_free_shipping: (this.isFreeShipping ? 1 : 0),
						order: this.order,
						sort: this.sort,
						coupon: this.coupon
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
						if (mescroll.num == 1) this.goodsList = []; //如果是第一页需手动制空列表
						this.goodsList = this.goodsList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail() {
						//联网失败的回调
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			//加载分类
			loadCategoryList(fid, sid) {
				this.$api.sendRequest({
					url: '/api/goodscategory/tree',
					data: {},
					success: res => {
						if (res.data != null) this.categoryList = res.data;
					}
				});
			},
			goodsImg(imgStr) {
				let imgs = imgStr.split(',');
				return imgs[0] ? this.$util.img(imgs[0], {
					size: 'mid'
				}) : this.$util.getDefaultImage().goods;
			},
			imgError(index) {
				this.goodsList[index].goods_image = this.$util.getDefaultImage().goods;
			},
			//跳转至详情页面
			toDetail(item) {
				this.$util.redirectTo('/pages_promotion/point/detail', {
					id: item.id
				});
			},
			search() {
				this.emptyShow = false;
				this.goodsList = [];
				this.$refs.mescroll.refresh();
			},
			//筛选点击
			sortTabClick(tag) {
				if (tag == 'point') {
					this.order = 'point';
					this.sort = 'desc';
				} else if (tag == 'create_time') {
					this.order = 'create_time';
					this.sort = 'desc';
				} else if (tag == 'screen') {
					//筛选
					this.showScreen = true;
					return;
				} else {
					this.order = '';
					this.sort = '';
				}

				this.order = tag;
				if (tag === 'create_time') {
					this.priceOrder = this.priceOrder === 'asc' ? 'desc' : 'asc';
					this.sort = this.priceOrder;
				} else if (tag === 'point') {
					this.priceOrder = this.priceOrder === 'asc' ? 'desc' : 'asc';
					this.sort = this.priceOrder;
				}

				this.emptyShow = false;
				this.goodsList = [];
				this.$refs.mescroll.refresh();
			},
			selectedCategory(categoryId) {
				this.categoryId = categoryId;
			},
			screenData() {
				if (this.minPoint != '' || this.maxPoint != '') {
					// if (!Number(this.minPoint) && this.minPoint) {
					// 	this.$util.showToast({
					// 		title: '请输入最低价'
					// 	});
					// 	return;
					// }
					if (!Number(this.maxPoint) && this.maxPoint) {
						this.$util.showToast({
							title: '请输入最高价'
						});
						return;
					}
					if (Number(this.minPoint) < 0 || Number(this.maxPoint) < 0) {
						this.$util.showToast({
							title: '筛选价格不能小于0'
						});
						return;
					}
					if (this.minPoint != '' && Number(this.minPoint) > Number(this.maxPoint) && this.maxPoint) {

						this.$util.showToast({
							title: '最低价不能大于最高价'
						});
						return;
					}
					if (this.maxPoint != '' && Number(this.maxPoint) < Number(this.minPoint)) {
						this.$util.showToast({
							title: '最高价不能小于最低价'
						});
						return;
					}
				}
				this.emptyShow = false;
				this.goodsList = [];
				this.$refs.mescroll.refresh();
				this.showScreen = false;
			},
			//重置数据
			resetData() {
				this.showScreen = false;
				this.categoryId = 0
				this.minPoint = ''
				this.maxPoint = ''
			},
		},
	};
</script>

<style lang="scss">
	.head-wrap {
		background: #fff;
		position: fixed;
		width: 100%;
		left: 0;
		z-index: 1;

		.search-wrap {
			flex: 0.5;
			padding: 30rpx 30rpx 0;
			font-size: $font-size-tag;
			display: flex;
			align-items: center;

			.input-wrap {
				flex: 1;
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: $color-bg;
				height: 70rpx;
				padding-left: 10rpx;
				border-radius: 70rpx;

				input {
					width: 90%;
					background: $color-bg;
					font-size: $font-size-tag;
					height: 50rpx;
					padding: 10rpx 25rpx 10rpx 40rpx;
					line-height: 50rpx;
					border-radius: 40rpx;
				}

				text {
					font-size: $font-size-toolbar;
					color: $color-tip;
					width: 80rpx;
					text-align: center;
					margin-right: 20rpx;
				}
			}

			.category-wrap,
			.list-style {
				display: flex;
				justify-content: center;
				align-items: center;

				.iconfont {
					font-size: 50rpx;
					color: $color-tip;
				}

				text {
					display: block;
					margin-top: 60rpx;
				}
			}
		}

		.sort-wrap {
			display: flex;
			padding: 10rpx 20rpx 10rpx 0;

			>view {
				flex: 1;
				text-align: center;
				font-size: $font-size-base;
				height: 60rpx;
				line-height: 60rpx;
			}

			.comprehensive-wrap {
				display: flex;
				justify-content: center;
				align-items: center;

				.iconfont-wrap {
					display: inline-block;
					margin-left: 10rpx;
					width: 40rpx;

					.iconfont {
						font-size: $font-size-toolbar;
						line-height: 1;
						margin-bottom: 5rpx;
					}
				}
			}

			.price-wrap {
				display: flex;
				justify-content: center;
				align-items: center;

				.iconfont-wrap {
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
					width: 40rpx;

					.iconfont {
						float: left;
						font-size: 24rpx;
						line-height: 1;
						height: 20rpx;
						color: #909399;
					}
				}
			}

			.screen-wrap {
				display: flex;
				justify-content: center;
				align-items: center;

				.iconfont-wrap {
					display: inline-block;
					margin-left: 10rpx;
					width: 40rpx;

					.iconfont {
						font-size: $font-size-toolbar;
						line-height: 1;
					}
				}
			}
		}
	}

	.category-list-wrap {
		height: 100%;

		.class-box {
			display: flex;
			flex-wrap: wrap;
			padding: 0 $padding;

			view {
				width: calc((100% - 60rpx) / 3);
				font-size: $font-size-goods-tag;
				margin-right: 20rpx;
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				margin-bottom: 12rpx;
				flex-shrink: 0;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				background: rgba(245, 245, 245, 1);
				border-radius: 5rpx;

				&:nth-of-type(3n) {
					margin-right: 0;
				}
			}
		}

		.first {
			font-size: $font-size-tag;
			display: block;
			// background: $page-color-base;
			padding: 20rpx;
		}

		.second {
			border-bottom: 2rpx solid $color-line;
			padding: 20rpx;
			display: block;
			font-size: $font-size-tag;
		}

		.third {
			padding: 0 20rpx 20rpx;
			overflow: hidden;
			font-size: $font-size-tag;

			>view {
				display: inline-block;
				margin-right: 20rpx;
				margin-top: 20rpx;
			}

			.uni-tag {
				padding: 0 20rpx;
			}
		}
	}

	.screen-wrap {
		.title {
			font-size: $font-size-tag;
			padding: $padding;
			background: #f6f4f5;
		}

		scroll-view {
			height: 85%;

			.item-wrap {
				border-bottom: 1px solid #f0f0f0;

				.label {
					font-size: $font-size-tag;
					padding: $padding;

					view {
						display: inline-block;
						font-size: 60rpx;
						height: 40rpx;
						vertical-align: middle;
						line-height: 40rpx;
					}
				}

				.list {
					margin: $margin-updown $margin-both;
					overflow: hidden;

					>view {
						display: inline-block;
						margin-right: 25rpx;
						margin-bottom: 25rpx;
					}

					.uni-tag {
						padding: 0 $padding;
						font-size: $font-size-goods-tag;
						background: #f5f5f5;
						height: 52rpx;
						line-height: 52rpx;
						border: 0;
					}
				}

				.price-wrap {
					display: flex;
					justify-content: center;
					align-items: center;
					padding: $padding;

					input {
						flex: 1;
						background: #f5f5f5;
						height: 52rpx;
						width: 182rpx;
						line-height: 50rpx;
						font-size: $font-size-goods-tag;
						border-radius: 50rpx;
						text-align: center;

						&:first-child {
							margin-right: 10rpx;
						}

						&:last-child {
							margin-left: 10rpx;
						}
					}
				}
			}
		}

		.footer {
			height: 90rpx;
			display: flex;
			justify-content: center;
			align-items: flex-start;
			display: flex;
			//position: absolute;
			bottom: 0;
			width: 100%;

			.footer-box {
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
				margin: 0;
				width: 40%;
			}

			.footer-box1 {
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
				margin: 0;
				width: 40%;
			}
		}
	}

	.safe-area {
		bottom: 68rpx !important;
	}

	.empty {
		margin-top: 100rpx;
	}

	.buy-num {
		font-size: $font-size-activity-tag;
	}

	.icon {
		width: 34rpx;
		height: 30rpx;
	}

	.list-style-new {
		display: flex;
		align-items: center;

		.line {
			width: 4rpx;
			height: 28rpx;
			background-color: rgba(227, 227, 227, 1);
			margin-right: 60rpx;
		}
	}

	.h-line {
		width: 37rpx;
		height: 2rpx;
		background-color: $color-tip;
	}

	.lineheight-clear {
		line-height: 1 !important;
	}

	// 商品列表单列样式
	.goods-list.single-column {
		.goods-item {
			padding: 26rpx;
			background: #fff;
			margin: $margin-updown $margin-both;
			border-radius: $border-radius;
			display: flex;
			position: relative;

			.goods-img {
				width: 200rpx;
				height: 200rpx;
				overflow: hidden;
				border-radius: $border-radius;
				margin-right: 20rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.goods-tag {
				color: #fff;
				line-height: 1;
				padding: 8rpx 12rpx;
				position: absolute;
				border-top-left-radius: $border-radius;
				border-bottom-right-radius: $border-radius;
				top: 26rpx;
				left: 26rpx;
				font-size: $font-size-goods-tag;
			}

			.goods-tag-img {
				position: absolute;
				border-top-left-radius: $border-radius;
				width: 80rpx;
				height: 80rpx;
				top: 26rpx;
				left: 26rpx;
				z-index: 5;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.info-wrap {
				flex: 1;
				display: flex;
				flex-direction: column;
			}

			.name-wrap {
				flex: 1;
			}

			.goods-name {
				font-size: $font-size-base;
				line-height: 1.3;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				height: 68rpx;
			}

			.introduction {
				line-height: 1;
				margin-top: 10rpx;
			}

			.discount-price {
				display: inline-block;
				font-weight: bold;
				line-height: 1;
				margin-top: 16rpx;
				color: var(--price-color);
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

				&>view {
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

	// 商品列表双列样式
	.goods-list.double-column {
		display: flex;
		flex-wrap: wrap;
		margin: 0 $margin-both;
		padding-top: $margin-updown;

		.goods-item {
			flex: 1;
			position: relative;
			background-color: #fff;
			flex-basis: 48%;
			max-width: calc((100% - 30rpx) / 2);
			margin: 0 $margin-both $margin-updown 0;
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
				color: var(--price-color);
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

				&>view {
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
<style scoped>
	>>>.uni-tag--primary.uni-tag--inverted {
		background-color: #f5f5f5 !important;
	}
</style>
