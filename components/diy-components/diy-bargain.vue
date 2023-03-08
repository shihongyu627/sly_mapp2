<template>
	<view class="diy-bargain" v-if="list.length" :class="[value.template, value.style]" :style="warpCss">
		<!-- 商品头部 -->
		<view v-if="value.titleStyle.isShow" :class="[value.titleStyle.style,'bargain-head']"
			:style="{'backgroundImage': 'url(' + $util.img(value.titleStyle.backgroundImage) + '), linear-gradient(to right,'+value.titleStyle.bgColorStart+','+ value.titleStyle.bgColorEnd+')'  }">
			<view v-if="value.titleStyle.leftStyle == 'text'" class="left-text"
				:style="{fontSize: value.titleStyle.fontSize*2 + 'rpx',color: value.titleStyle.textColor,fontWeight: value.titleStyle.fontWeight ? 'bold' : ''}">
				{{value.titleStyle.leftText}}
			</view>
			<image v-else class="left-img" :src="$util.img(value.titleStyle.leftImg)" mode="heightFix"></image>
			<view class="head-content" :style="{color: value.titleStyle.textColor}">低至0元免费拿</view>
			<view class="head-right"
				:style="{fontSize: value.titleStyle.moreFontSize*2 + 'rpx',color: value.titleStyle.moreColor}"
				@click="$util.redirectTo('/pages_promotion/bargain/list')">
				<text>{{value.titleStyle.more}}</text>
				<text class="iconfont iconright"></text>
			</view>
		</view>
		<!-- 商品列表 -->
		<template v-if="value.template == 'row1-of1'">
			<view class="item" v-for="(item, index) in list" :key="index" @click="toDetail(item)"
				:class="[value.ornament.type]" :style="goodsItemCss">
				<view class="img-wrap" :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }">
					<image :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }"
						:src="$util.img(item.goods_image,{size: 'mid'})" mode="widthFix" @error="imageError(index)">
					</image>
				</view>
				<view class="content"
					v-if="value.goodsNameStyle.control || value.priceStyle.mainControl || value.btnStyle.control">
					<view v-if="value.goodsNameStyle.control" class="goods-name"
						:style="{ color: value.theme == 'diy' ? value.goodsNameStyle.color : '', fontWeight: value.goodsNameStyle.fontWeight ? 'bold' : '' }"
						:class="[{ 'using-hidden': value.nameLineMode == 'single' }, { 'multi-hidden': value.nameLineMode == 'multiple' }]">
						{{ item.goods_name }}
					</view>
					<view class="progress" v-if="value.style=='style-2'">
						<view class="bg">
							<view class="curr" :style="{width: progress(item)*2+'rpx'}">
								<image class="progress-bar" mode="widthFix"
									:src="$util.img('public/uniapp/bargain/progress_bar_01.png')">
								</image>
							</view>
						</view>
						<view class="num" v-if="item.is_bargaining">
							已砍 <text>￥{{(item.price - item.curr_price).toFixed(2)}}</text>，仅差
							<text>￥{{item.curr_price}}</text>
						</view>
						<view class="num" v-else>
							最低可砍至 <text>￥{{item.floor_price}}</text>
						</view>
					</view>
					<view class="price-wrap">
						<view class="discount-price" v-if="value.priceStyle.mainControl">
							<text class="unit price-style small"
								:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">¥</text>
							<text class="price price-style large"
								:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">{{ value.style=='style-2' ? item.price.split(".")[0] : item.floor_price.split(".")[0] }}</text>
							<text class="unit price-style small"
								:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">{{ value.style=='style-2' ? "."+item.price.split(".")[1] : "."+item.floor_price.split(".")[1] }}</text>
						</view>
						<button v-if="value.btnStyle.control" :style="{
								background: value.btnStyle.theme == 'diy' ? 'linear-gradient(to right,' + value.btnStyle.bgColorStart + ',' + value.btnStyle.bgColorEnd + ')' : '',
								color: value.btnStyle.theme == 'diy' ? value.btnStyle.textColor : '',
								borderRadius: value.btnStyle.aroundRadius * 2 + 'rpx'
							}">
							{{ item.is_bargaining ? '继续砍价' : value.btnStyle.text }}
						</button>
					</view>
				</view>
			</view>
		</template>

		<template v-if="value.template == 'horizontal-slide'">
			<scroll-view v-if="value.slideMode == 'scroll'" class="scroll" :scroll-x="true" :show-scrollbar="false">
				<view class="item" v-for="(item, index) in list" :key="index" @click="toDetail(item)"
					:class="[value.ornament.type]" :style="goodsItemCss">
					<view class="img-wrap" :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }">
						<image :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }"
							:src="$util.img(item.goods_image,{size: 'mid'})" mode="widthFix" @error="imageError(index)"
							:lazy-load="true"></image>
						<image class="bg"
							v-if="value.saleStyle.control&&value.template == 'horizontal-slide'&&value.style!='style-2'"
							:src="$util.img('public/uniapp/bargain/bg.png')" mode="widthFix"></image>
						<view class="num"
							v-if="value.saleStyle.control&&value.template == 'horizontal-slide'&&value.style!='style-2'"
							:style="{ color: value.theme == 'diy' ? value.saleStyle.color : '' }">已砍{{ item.sale_num }}件
						</view>
					</view>
					<view :class="['content', { 'multi-content': value.nameLineMode == 'multiple' }]"
						v-if="value.goodsNameStyle.control || value.priceStyle.mainControl || value.priceStyle.lineControl">
						<view v-if="value.goodsNameStyle.control" class="goods-name"
							:style="{ color: value.theme == 'diy' ? value.goodsNameStyle.color : '', fontWeight: value.goodsNameStyle.fontWeight ? 'bold' : '' }"
							:class="[{ 'using-hidden': value.nameLineMode == 'single' }, { 'multi-hidden': value.nameLineMode == 'multiple' }]">
							{{ item.goods_name }}
						</view>
						<view class="discount-price"
							v-if="value.priceStyle.mainControl&&value.template == 'horizontal-slide'&&value.style!='style-2'">
							<text class="unit price-style small"
								:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">¥</text>
							<text class="price price-style large"
								:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">{{ item.floor_price.split(".")[0] }}</text>
							<text class="unit price-style small"
								:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">{{ "."+item.floor_price.split(".")[1] }}</text>
						</view>
						<view class="original-price price-font" v-if="value.priceStyle.lineControl"
							:style="{ color: value.theme == 'diy' ? value.priceStyle.lineColor : '' }">
							¥{{ item.price }}
						</view>
					</view>
				</view>
			</scroll-view>

			<swiper v-if="value.slideMode == 'slide'" :autoplay="false" class="swiper"
				:style="{ height: swiperHeight }">
				<swiper-item v-for="(pageItem,pageIndex) in page" :key="pageIndex"
					:class="['swiper-item', [list[pageIndex].length / 3] >= 1 && 'flex-between']">
					<view class="item" v-for="(item, dataIndex) in list[pageIndex]" :key="dataIndex"
						@click="toDetail(item)" :class="[value.ornament.type]" :style="goodsItemCss">
						<view class="img-wrap" :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }">
							<image :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }"
								:src="$util.img(item.goods_image,{size: 'mid'})" mode="widthFix"
								@error="imageError(dataIndex)" :lazy-load="true"></image>
							<image class="bg"
								v-if="value.saleStyle.control&&value.template == 'horizontal-slide'&&value.style!='style-2'"
								:src="$util.img('public/uniapp/bargain/bg.png')" mode="widthFix"></image>
							<view class="num"
								v-if="value.saleStyle.control&&value.template == 'horizontal-slide'&&value.style!='style-2'"
								:style="{ color: value.theme == 'diy' ? value.saleStyle.color : '' }">
								已砍{{ item.sale_num }}件</view>
						</view>
						<view :class="['content', { 'multi-content': value.nameLineMode == 'multiple' }]"
							v-if="value.goodsNameStyle.control || value.priceStyle.mainControl || value.priceStyle.lineControl">
							<view v-if="value.goodsNameStyle.control" class="goods-name"
								:style="{ color: value.theme == 'diy' ? value.goodsNameStyle.color : '', fontWeight: value.goodsNameStyle.fontWeight ? 'bold' : '' }"
								:class="[{ 'using-hidden': value.nameLineMode == 'single' }, { 'multi-hidden': value.nameLineMode == 'multiple' }]">
								{{ item.goods_name }}
							</view>
							<view class="discount-price"
								v-if="value.priceStyle.mainControl&&value.template == 'horizontal-slide'&&value.style!='style-2'">
								<text class="unit price-style small"
									:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">¥</text>
								<text class="price price-style large"
									:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">{{ item.floor_price.split(".")[0] }}</text>
								<text class="unit price-style small"
									:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">{{ "."+item.floor_price.split(".")[1] }}</text>
							</view>
							<view class="original-price price-font" v-if="value.priceStyle.lineControl"
								:style="{ color: value.theme == 'diy' ? value.priceStyle.lineColor : '' }">
								¥{{ item.price }}
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
		name: 'diy-bargain',
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
		components: {},
		async created() {
			if (this.value.template == 'row1-of1' && this.value.style == 'style-2')
				await this.getDataing();
			this.getData();
		},
		computed: {
			warpCss() {
				var obj = '';
				if (this.value.componentBgColor) obj += 'background:' + this.value.componentBgColor + ';';
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
				if (this.value.template == 'horizontal-slide') {
					var width = "";
					if (this.value.slideMode == 'scroll' && this.value.goodsMarginType == 'diy')
						width = this.rpxUpPx(this.value.goodsMarginNum * 2);
					else
						width = [screenWidth - (this.rpxUpPx(20) * 2) - (this.rpxUpPx(200) * 3) - (this.rpxUpPx(this.value
							.margin.both * 2) * 2)] / 6;


					obj += 'margin-left:' + width + "px;";
					obj += 'margin-right:' + width + "px;";
				}
				return obj;
			},
			swiperHeight() {
				if (this.value.nameLineMode == 'multiple') {
					if (this.value.ornament.type == 'shadow')
						return '420rpx';
					else
						return '400rpx';
				}
				if (this.value.ornament.type == 'shadow')
					return '386rpx';
				else
					return '378rpx';
			}
		},
		methods: {
			rpxUpPx(res) {
				const screenWidth = uni.getSystemInfoSync().safeArea.width || uni.getSystemInfoSync().screenWidth;
				var data = screenWidth * parseInt(res) / 750;
				return Math.floor(data);
			},
			// 查找自己参与的砍价
			async getDataing() {
				var res = await this.$api.sendRequest({
					url: '/bargain/api/goods/bargainingList',
					data: {},
					async: false
				});

				res.data && res.data.forEach((item, index) => {
					item.is_bargaining = 1;
				});
				this.list = res.data || [];
			},
			// 查找可砍价的商品
			getData() {
				var data = {
					page: 1,
					page_size: this.value.count,
					is_exclude_bargaining: 1
				};
				if (this.value.sources == 'diy') {
					data.page_size = 0;
					data.id_arr = this.value.goodsId.toString();
				}

				this.$api.sendRequest({
					url: '/bargain/api/goods/page',
					data: data,
					success: res => {
						if (res.code == 0) {
							if (this.value.template == 'row1-of1' && this.value.style == 'style-2')
								this.list = this.list.concat(res.data.list).splice(0, this.value.count);
							else
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
			progress(data) {
				// 214 表示当前进度条的宽度
				let progress = (((parseFloat(data.price) - parseFloat(data.curr_price)) / parseFloat(data.price)) * 214)
					.toFixed();
				if (progress == 'NaN') {
					progress = 0;
				}
				return progress;
			},
			toDetail(e) {
				this.$util.redirectTo('/pages_promotion/bargain/detail', {
					b_id: e.bargain_id
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

	.diy-bargain {
		overflow: hidden;
		background: linear-gradient(180deg, #FFB6A1 0%, rgba(254, 215, 194, 0.4) 30%, rgba(255, 255, 255, 0) 100%) !important;
		overflow: hidden;
		border-radius: 18rpx 18rpx 0 0 !important;

		// 头部
		.bargain-head {
			&.style-1 {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 88rpx;
				box-sizing: border-box;
				padding: 0 20rpx;
				background-repeat: no-repeat;
				background-size: cover;
				// margin-bottom: 20rpx;
				border-radius: 18rpx 18rpx 0 0;

				.left-img {
					height: 40rpx;
					width: 156rpx;
				}

				.head-content {
					position: relative;
					color: #fff;
					font-size: $font-size-tag;
					margin-right: auto;
					margin-left: 20rpx;
					line-height: 1;

					&::after {
						content: '';
						position: absolute;
						width: 2rpx;
						height: 24rpx;
						background-color: #fff;
						top: 50%;
						transform: translateY(-50%);
						left: -12rpx;
					}
				}

				.head-right {
					display: flex;
					align-items: center;
					font-size: $font-size-sub;
					color: #fff;
				}
			}
		}

		// 商品列表
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
					padding-bottom: 20rpx;
				}

				.img-wrap {
					width: 200rpx;
					height: 200rpx;

					>image {
						width: 200rpx;
					}
				}

				.content {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					padding: 6rpx 0 6rpx 20rpx;

					.goods-name {
						&.multi-hidden {
							line-height: 1.3;
						}
					}

					.price-wrap {
						display: flex;
						justify-content: space-between;
						align-items: center;
					}

					.discount-price {
						white-space: nowrap;
						font-weight: bold;
						line-height: 1;

						.unit {
							font-size: $font-size-tag;
							margin-right: 4rpx;
							color: var(--price-color);
						}

						.price {
							font-size: $font-size-toolbar;
							color: var(--price-color);
						}
					}

					button {
						margin: 0;
						padding: 0;
						color: var(--btn-text-color);
						background-color: $base-color;
						color: #fff;
						width: 140rpx;
						height: 52rpx;
						line-height: 52rpx;
						font-size: $font-size-tag;
						font-weight: bold;
					}
				}
			}

			&.style-2 {
				.discount-price {
					position: relative;
				}

				.progress {
					display: flex;
					flex-direction: column;
					margin-top: 10rpx;
					margin-right: 16rpx;

					.bg {
						margin-left: 6rpx;
						width: auto;
						height: 20rpx;
						border-radius: 20rpx;
						background-color: #FFEADB;
						position: relative;

						&::after {
							content: "";
							width: 26rpx;
							height: 26rpx;
							border-radius: 50%;
							background-color: #FA1A1A;
							position: absolute;
							top: 50%;
							transform: translateY(-50%);
							right: -18rpx;
						}

						.curr {
							width: 0;
							height: 20rpx;
							border-radius: 20rpx;
							background-color: #FA1A1A;
							position: relative;

							.progress-bar {
								position: absolute;
								right: -20rpx;
								width: 30rpx;
								height: 30rpx;
								max-width: inherit !important;
								max-height: inherit !important;
								top: 50%;
								transform: translateY(-50%);
								z-index: 1;
							}
						}

					}

					.num {
						font-size: $font-size-tag;
						margin-top: 12rpx;
						line-height: 1;

						text {
							color: #FA1A1A;
						}
					}


				}
			}
		}

		&.horizontal-slide {
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

				&:nth-child(3n+3) {
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

					>image {
						width: 100%;
					}

					.bg {
						position: absolute;
						width: 100%;
						height: 60rpx;
						bottom: 0;
						left: 0;
						z-index: 2;
					}

					.num {
						width: 180rpx;
						position: absolute;
						bottom: 10rpx;
						padding-left: 20rpx;
						font-size: 20rpx;
						line-height: 1;
						color: #ffffff;
						z-index: 3;
					}
				}

				.content {
					padding: 10rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					&.multi-content {
						height: 160rpx;
						box-sizing: border-box;
					}

					.goods-name {
						line-height: 1.3;

						&.multi-hidden {
							white-space: break-spaces;
						}

						&.using-hidden {
							display: block;
						}
					}

					.discount-price {
						white-space: nowrap;
						margin-top: auto;
						font-weight: bold;
						line-height: 1;

						.unit {
							font-size: $font-size-tag;
							margin-right: 4rpx;
							color: var(--price-color);
						}

						.price {
							font-size: $font-size-toolbar;
							color: var(--price-color);
						}
					}

					.original-price {
						margin-top: 4rpx;
						font-size: $font-size-tag;
						color: $color-tip;
						line-height: 1;
						text-decoration: line-through;
					}
				}
			}

			.swiper {
				padding: 20rpx;
				width: 100%;
				white-space: nowrap;
				box-sizing: border-box;

				.swiper-item {
					display: flex;
					align-items: center;
				}

				.item {
					width: 200rpx;
					box-sizing: border-box;
				}
			}

		}
	}
</style>
