<template>
	<view class="diy-pintuan" v-if="list.length" :class="[value.template, value.style]" :style="warpCss">
		<view v-if="value.titleStyle.isShow" :class="[value.titleStyle.style,'pintuan-head']"
			:style="{'backgroundImage': 'url(' + $util.img(value.titleStyle.backgroundImage) + '), linear-gradient(to right,'+value.titleStyle.bgColorStart+','+ value.titleStyle.bgColorEnd+')'  }">
			<view v-if="value.titleStyle.leftStyle == 'text'" class="left-text"
				:style="{fontSize: value.titleStyle.fontSize*2 + 'rpx',color: value.titleStyle.textColor,fontWeight: value.titleStyle.fontWeight ? 'bold' : ''}">
				{{value.titleStyle.leftText}}
			</view>
			<image v-else class="left-img" :src="$util.img(value.titleStyle.leftImg)" mode="heightFix"></image>
			<view class="head-content">
				<view class="img-warp">
					<block v-if="headData && headData.member_list && headData.member_list.length">
						<image v-for="(item,index) in headData.member_list" :key="index"
							:src="$util.img(item.member_img || 'public/static/img/default_img/square.png')"
							mode="aspectFill" @error="headImageError(index)"></image>
					</block>
					<block v-else>
						<image :src="$util.img('public/static/img/default_img/square.png')" mode="aspectFill">
						</image>
						<image :src="$util.img('public/static/img/default_img/square.png')" mode="aspectFill">
						</image>
						<image :src="$util.img('public/static/img/default_img/square.png')" mode="aspectFill">
						</image>
					</block>
				</view>
				<text :style="{color: value.titleStyle.textColor}">{{headData.pintuan_count}}人拼团成功</text>
			</view>
			<view class="head-right"
				:style="{fontSize: value.titleStyle.moreFontSize*2 + 'rpx',color: value.titleStyle.moreColor}"
				@click="$util.redirectTo('/pages_promotion/pintuan/list')">
				<text>{{value.titleStyle.more}}</text>
				<text class="iconfont iconright"></text>
			</view>
		</view>

		<template v-if="value.template == 'row1-of1'">
			<view class="item" v-for="(item, index) in list" :key="index" @click="toDetail(item)"
				:class="[value.ornament.type]" :style="goodsItemCss">
				<view class="img-wrap" :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }">
					<image :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }"
						:src="$util.img(item.goods_image,{size: 'mid'})" mode="widthFix" @error="imageError(index)">
					</image>
				</view>
				<view class="content"
					v-if="value.goodsNameStyle.control || value.priceStyle.mainControl || value.priceStyle.lineControl || value.btnStyle.control">
					<view v-if="value.goodsNameStyle.control" class="goods-name"
						:style="{ color: value.theme == 'diy' ? value.goodsNameStyle.color : '', fontWeight: value.goodsNameStyle.fontWeight ? 'bold' : '' }"
						:class="[{ 'using-hidden': value.nameLineMode == 'single' }, { 'multi-hidden': value.nameLineMode == 'multiple' }]">
						{{ item.goods_name }}
					</view>
					<view class="tag-wrap" v-if="value.groupStyle.control || value.saleStyle.control">
						<view v-if="value.groupStyle.control" :style="{
								color: value.theme == 'diy' ? value.groupStyle.bgColorStart : '',
								borderColor: value.theme == 'diy' ? value.groupStyle.bgColorStart : ''
							}">
							<text class="iconfont iconyonghu3"
								:style="{ backgroundColor: value.theme == 'diy' ? value.groupStyle.bgColorStart : '' }"></text>
							<text>{{ item.pintuan_num }}人团</text>
						</view>
						<view v-if="value.saleStyle.control"
							:style="{ color: value.theme == 'diy' ? value.saleStyle.color : '', borderColor: value.theme == 'diy' ? value.saleStyle.color : '' }">
							<text>已拼{{ item.order_num }}件</text>
						</view>
					</view>

					<view class="bottom-wrap">
						<view class="price-wrap">
							<view class="discount-price" v-if="value.priceStyle.mainControl">
								<text class="unit price-style small"
									:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">¥</text>
								<text class="price price-style large"
									:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">{{ item.pintuan_price.split(".")[0] }}</text>
								<text class="unit price-style small"
									:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">{{ "."+item.pintuan_price.split(".")[1] }}</text>
							</view>
							<view class="original-price  price-font" v-if="value.priceStyle.lineControl"
								:style="{ color: value.theme == 'diy' ? value.priceStyle.lineColor : '' }">
								¥{{ item.price }}
							</view>
						</view>
						<button v-if="value.btnStyle.control" :style="{
								background: value.btnStyle.theme == 'diy' ? 'linear-gradient(to right,' + value.btnStyle.bgColorStart + ',' + value.btnStyle.bgColorEnd + ')' : '',
								color: value.btnStyle.theme == 'diy' ? value.btnStyle.textColor : '',
								borderRadius: value.btnStyle.aroundRadius * 2 + 'rpx'
							}">
							{{ value.btnStyle.text }}
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
							:src="$util.img(item.goods_image,{size: 'mid'})" mode="widthFix" @error="imageError(index)">
						</image>
						<view v-if="value.groupStyle.control && value.style!='style-2'" class="num" :style="{
								color: value.theme == 'diy' ? value.groupStyle.color : '',
								background: value.theme == 'diy' ? 'linear-gradient(to right,' + value.groupStyle.bgColorStart + ',' + value.groupStyle.bgColorEnd + ')' : ''
							}">
							{{ item.pintuan_num }}人团
						</view>
					</view>
					<view :class="['content', { 'multi-content': value.nameLineMode == 'multiple' }]"
						v-if="value.goodsNameStyle.control || value.priceStyle.mainControl">
						<view v-if="value.goodsNameStyle.control && value.style!='style-2'" class="goods-name"
							:style="{ color: value.theme == 'diy' ? value.goodsNameStyle.color : '', fontWeight: value.goodsNameStyle.fontWeight ? 'bold' : '' }"
							:class="[{ 'using-hidden': value.nameLineMode == 'single' }, { 'multi-hidden': value.nameLineMode == 'multiple' }]">
							{{ item.goods_name }}
						</view>
						<view class="price-wrap" v-if="value.priceStyle.mainControl">
							<text class="unit price-style small"
								:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">¥</text>
							<text class="price price-style large"
								:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">{{ item.pintuan_price.split(".")[0] }}</text>
							<text class="unit price-style small"
								:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">{{ "."+item.pintuan_price.split(".")[1] }}</text>
						</view>
						<view class="sale-num" v-if="value.style=='style-2'">已拼{{item.sale_num}}件</view>
					</view>
				</view>
			</scroll-view>

			<swiper v-if="value.slideMode == 'slide'" :autoplay="false" class="swiper"
				:style="{ height: swiperHeight }">
				<swiper-item v-for="(pageItem,pageIndex) in page" :key="pageIndex"
					:class="['swiper-item', [list[pageIndex].length / 3] >= 1 && 'flex-between']">
					<view class="item" v-for="(item, dataIndex) in list[pageIndex]" :key="dataIndex"
						@click="toDetail(item)" :class="[value.ornament.type]" :style="goodsItemCss">
						<view class="img-wrap" :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx'}">
							<image :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }"
								:src="$util.img(item.goods_image,{size: 'mid'})" mode="widthFix"
								@error="imageError(dataIndex)"></image>
							<view v-if="value.groupStyle.control && value.style!='style-2'" class="num" :style="{
									color: value.theme == 'diy' ? value.groupStyle.color : '',
									background: value.theme == 'diy' ? 'linear-gradient(to right,' + value.groupStyle.bgColorStart + ',' + value.groupStyle.bgColorEnd + ')' : ''
								}">
								{{ item.pintuan_num }}人团
							</view>
						</view>
						<view :class="['content', { 'multi-content': value.nameLineMode == 'multiple' }]"
							v-if="value.goodsNameStyle.control || value.priceStyle.mainControl">
							<view v-if="value.goodsNameStyle.control && value.style!='style-2'" class="goods-name"
								:style="{ color: value.theme == 'diy' ? value.goodsNameStyle.color : '', fontWeight: value.goodsNameStyle.fontWeight ? 'bold' : '' }"
								:class="[{ 'using-hidden': value.nameLineMode == 'single' }, { 'multi-hidden': value.nameLineMode == 'multiple' }]">
								{{ item.goods_name }}
							</view>
							<view class="price-wrap" v-if="value.priceStyle.mainControl">
								<text class="unit price-style small"
									:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">¥</text>
								<text class="price price-style large"
									:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">{{ item.pintuan_price.split(".")[0] }}</text>
								<text class="unit price-style small"
									:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor +'!important' : '' }">{{ "."+item.pintuan_price.split(".")[1] }}</text>
							</view>
							<view class="sale-num" v-if="value.style=='style-2'">已拼{{item.sale_num}}件</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</template>
	</view>
</template>

<script>
	export default {
		name: 'diy-pintuan',
		props: {
			value: {
				type: Object
			}
		},
		data() {
			return {
				list: [],
				page: 1,
				scrollWidth: 0,
				headData: []
			};
		},
		created() {
			this.getData();
			this.getHeadData();
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
				if (this.value.template == 'horizontal-slide') {
					var width = "";
					if (this.value.slideMode == 'scroll' && this.value.goodsMarginType == 'diy')
						width = this.rpxUpPx(this.value.goodsMarginNum * 2);
					else if (this.value.template == 'horizontal-slide' && this.value.style == 'style-2')
						width = [screenWidth - (this.rpxUpPx(212) * 3) - (this.rpxUpPx(this.value
							.margin.both * 2) * 2)] / 6;
					else
						width = [screenWidth - (this.rpxUpPx(20) * 2) - (this.rpxUpPx(200) * 3) - (this.rpxUpPx(this.value
							.margin.both * 2) * 2)] / 6;
					obj += 'margin-left:' + width + "px;";
					obj += 'margin-right:' + width + "px;";
				}
				return obj;
			},
			swiperHeight() {
				if (this.value.template == 'horizontal-slide' && this.value.style == 'style-2') {
					if (this.value.nameLineMode == 'multiple') {
						if (this.value.ornament.type == 'shadow')
							return '360rpx';
						else
							return '342rpx';
					}
					if (this.value.ornament.type == 'shadow')
						return '324rpx';
					else
						return '308rpx';
				} else {
					if (this.value.nameLineMode == 'multiple') {
						if (this.value.ornament.type == 'shadow')
							return '400rpx';
						else
							return '382rpx';
					}
					if (this.value.ornament.type == 'shadow')
						return '364rpx';
					else
						return '348rpx';
				}
			}
		},
		methods: {
			rpxUpPx(res) {
				const screenWidth = uni.getSystemInfoSync().safeArea.width || uni.getSystemInfoSync().screenWidth;
				var data = screenWidth * parseInt(res) / 750;
				return Math.floor(data);
			},
			getHeadData() {
				var data = {
					num: 3
				};
				this.$api.sendRequest({
					url: '/pintuan/api/order/pintuanmember',
					data: data,
					success: res => {
						if (res.code == 0 && res.data) {
							this.headData = res.data;
						}
					}
				});
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
					url: '/pintuan/api/goods/page',
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
				this.$util.redirectTo('/pages_promotion/pintuan/detail', {
					pintuan_id: e.pintuan_id
				});
			},
			imageError(index) {
				if (this.list[index]) this.list[index].goods_image = this.$util.getDefaultImage().goods;
				this.$forceUpdate();
			},
			headImageError(index) {
				this.headData.member_list[index].member_img = this.$util.img('public/static/img/default_img/square.png');
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

	.diy-pintuan {
		overflow: hidden;
		background: linear-gradient(180deg, #FF9710 0%, #FFE2BC 30%, rgba(255, 255, 255, 0) 100%) !important;
		overflow: hidden;
		border-radius: 18rpx 18rpx 0 0 !important;
		.pintuan-head {
			padding: 0 24rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 88rpx;
			box-sizing: border-box;
			background-repeat: no-repeat;
			background-size: cover;
			overflow: hidden;
			// margin-bottom: 20rpx;
			border-radius: 18rpx 18rpx 0 0;

			.left-img {
				width: 174rpx;
				height: 40rpx;
			}

			.head-content {
				display: flex;
				align-items: center;
				margin-left: 50rpx;
				margin-right: auto;
				color: #fff;

				.img-warp {
					position: relative;
					margin-right: 8rpx;
					line-height: 1;

					image {
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
						border: 2rpx solid #FF3D3D;
						margin-left: -14rpx;
					}

					&:after {
						content: "";
						width: 2rpx;
						height: 28rpx;
						background-color: #fff;
						position: absolute;
						left: -32rpx;
						top: 50%;
						transform: translateY(-50%);
					}
				}
			}

			.head-right {
				display: flex;
				align-items: center;
				font-size: $font-size-sub;
				color: #fff;
				line-height: 1;
			}
		}

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

					.tag-wrap {
						display: flex;
						align-items: center;

						>view {
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

					.goods-name {
						line-height: 1.3;
					}

					.bottom-wrap {
						display: flex;
						align-items: center;
						justify-content: space-between;
					}

					.price-wrap {
						overflow: hidden;
						width: 260rpx;
						display: flex;
						align-items: flex-end;
						flex-wrap: wrap;

						>view:last-of-type {
							flex: 1;
						}

						.discount-price {
							white-space: nowrap;
							font-weight: bold;
							line-height: 1;

							.unit {
								font-size: $font-size-tag;
								color: var(--price-color);
							}

							.price {
								font-size: $font-size-toolbar;
								color: var(--price-color);
							}
						}

						.original-price {
							font-size: $font-size-tag;
							color: $color-tip;
							line-height: 1;
							text-decoration: line-through;
							margin: 0 10rpx;
						}
					}

					button {
						margin-right: 20rpx;
						height: 50rpx;
						line-height: 50rpx;
						padding: 0 16rpx;
						margin: 0;
						color: var(--btn-text-color);
						background-color: $base-color;
						color: #fff;
						font-size: 24rpx;
					}
				}
			}
		}

		&.horizontal-slide {
			display: flex;
			flex-direction: column;

			.flex-between {
				justify-content: space-between;
			}

			.scroll {
				width: calc(100% - 40rpx);
				padding: 20rpx;
				line-height: 1;
				white-space: nowrap;

				.item.shadow {
					margin-bottom: 4rpx;
				}
			}

			.item {
				display: inline-block;
				width: 200rpx;
				overflow: hidden;
				box-sizing: border-box;
				flex-shrink: 0;

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
						width: 200rpx;
					}

					.num {
						width: 80rpx;
						position: absolute;
						bottom: 0;
						font-size: $font-size-tag;
						line-height: 1;
						color: #ffffff;
						text-align: center;
						border-top-left-radius: 20rpx;
						border-top-right-radius: 20rpx;
						padding: 10rpx;
						transform: translate(50%);
						background: $base-color;
					}
				}

				.content {
					padding: 10rpx 10rpx 16rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					&.multi-content {
						height: 142rpx;
						box-sizing: border-box;
					}

					.goods-name {
						line-height: 1.3;
						font-size: $font-size-base;

						&.using-hidden {
							display: block;
						}

						&.multi-hidden {
							white-space: break-spaces;
						}
					}

					.price-wrap {
						line-height: 1;
						white-space: nowrap;
						margin-top: 10rpx;
						font-weight: bold;

						.unit {
							font-size: $font-size-tag;
							height: 32rpx;
							color: var(--price-color);
						}

						.price {
							font-size: $font-size-toolbar;
							color: var(--price-color);
						}
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

			&.style-2 {
				.item {
					width: 212rpx;

					&:nth-child(3n+3) {
						width: 210rpx;
					}

					.img-wrap {

						width: 212rpx;
						height: 212rpx;

						>image {
							width: 212rpx !important;
						}
					}

					.price-wrap {
						text-align: center;
						margin-top: 0 !important;
						margin-bottom: 10rpx;
					}

					.sale-num {
						text-align: center;
						color: #666666;
						line-height: 1;
					}
				}

				.scroll {
					padding: 0;
					width: auto;
				}

				.swiper {
					padding: 0;
				}
			}
		}
	}
</style>
