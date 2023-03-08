<template>
	<view class="diy-seckill" v-if="timeList.length > 1 || (timeList.length == 1 && dataList.length)"
		:class="[value.template, value.style]" :style="wrapStyle">
		<view v-if="value.titleStyle.isShow" :class="['title-wrap', value.titleStyle.style]"
			:style="{'backgroundImage': 'url(' + $util.img(value.titleStyle.backgroundImage) + '), linear-gradient(to right,'+value.titleStyle.bgColorStart+','+ value.titleStyle.bgColorEnd+')'  }">
			<view v-if="value.titleStyle.leftStyle == 'text'"
				:style="{ fontSize: value.titleStyle.fontSize * 2 + 'rpx', color: value.titleStyle.textColor, fontWeight: value.titleStyle.fontWeight ? 'bold' : ''}">
				{{ value.titleStyle.leftText }}
			</view>
			<image class="title-img" v-else :src="$util.img(value.titleStyle.leftImg)" mode="heightFix"></image>
			<text v-if="value.titleStyle.style == 'style-2'&&isFuture" :style="{'color': value.titleStyle.textColor}"
				class="seckill-style-name">距离开始</text>
			<view class="time" :style="value.titleStyle.style == 'style-2' && titleTimeStyle">
				<text v-if="value.titleStyle.style == 'style-1' || value.titleStyle.style == 'style-3'"
					:style="{'color': value.titleStyle.textColor}"
					class="seckill-title-name">{{isFuture ? '距离开始' : '距离结束'}}</text>
				<text v-else-if="value.titleStyle.timeImageUrl"
					:class="['seckill-title-name', value.titleStyle.timeImageUrl]"></text>
				<text class="hour number"
					:style="(value.titleStyle.style == 'style-1' || value.titleStyle.style == 'style-3') && titleTimeStyle">{{ seckillH ? seckillH : '00' }}</text>
				<text class="symbol"
					:style="[value.titleStyle.style != 'style-2'&&{'color': value.titleStyle.timeBgColor}]">:</text>
				<text class="minute number"
					:style="(value.titleStyle.style == 'style-1' || value.titleStyle.style == 'style-3') && titleTimeStyle">{{ seckillI ? seckillI : '00' }}</text>
				<text class="symbol"
					:style="[value.titleStyle.style != 'style-2'&&{'color': value.titleStyle.timeBgColor}]">:</text>
				<text class="second number"
					:style="(value.titleStyle.style == 'style-1' || value.titleStyle.style == 'style-3') && titleTimeStyle">{{ seckillS ? seckillS : '00' }}</text>
			</view>
			<view class="marketimg-box-title-right"
				:style="{ fontSize: value.titleStyle.moreFontSize * 2 + 'rpx', color: value.titleStyle.moreColor }"
				@click="toMore">
				<text>{{ value.titleStyle.more }}</text>
				<text class="iconfont iconright"></text>
			</view>
		</view>

		<view class="content-wrap">
			<template v-if="value.template == 'row1-of1'">
				<view class="item" v-for="(item, index) in dataList" :key="index" @click="toDetail(item.id)"
					:class="[value.ornament.type]" :style="goodsItemCss">
					<view class="img-wrap" :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }">
						<image :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }"
							:src="$util.img(item.goods_image,{size: 'mid'})" mode="widthFix" @error="imageError(index)">
						</image>
					</view>
					<view class="content">
						<view class="goods-name" v-if="value.goodsNameStyle.control"
							:style="{ color: value.theme == 'diy' ? value.goodsNameStyle.color : '', fontWeight: value.goodsNameStyle.fontWeight ? 'bold' : '' }"
							:class="[{ 'using-hidden': value.nameLineMode == 'single' }, { 'multi-hidden': value.nameLineMode == 'multiple' }]">
							{{ item.goods_name }}
						</view>
						<view class="progress" v-if="value.progressStyle.control">
							<view class="bg"
								:style="{ backgroundColor: value.theme == 'diy' ? value.progressStyle.bgColor : '' }">
								<view class="curr" :style="{
										backgroundColor: value.theme == 'diy' ? value.progressStyle.currColor : '',
										width: Math.floor((item.sale_num / (item.goods_stock + item.sale_num)) * 240) + 'rpx'
									}">
									<image v-if="value.style == 'style-2'" class="progress-bar"
										:src="$util.img('public/uniapp/seckill/progress_bar_01.png')" mode="widthFix">
									</image>
								</view>
							</view>
							<view class="num"
								:style="{ color: value.theme == 'diy' ? value.saleStyle.color : '', borderColor: value.theme == 'diy' ? value.saleStyle.color : '' }">
								已抢{{ ((item.sale_num / (item.goods_stock + item.sale_num)) * 100).toFixed(2) }}%
							</view>
						</view>
						<view class="bottom-wrap">
							<view class="price-wrap">
								<view class="discount-price">
									<text class="unit price-style small"
										:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor : '' }">¥</text>
									<text class="price price-style large"
										:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor : '' }">{{ item.seckill_price.split(".")[0] }}</text>
									<text class="unit price-style small"
										:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor : '' }">{{ '.'+item.seckill_price.split(".")[1] }}</text>
								</view>
								<view class="original-price price-font"
									v-if="value.priceStyle.lineControl&&value.style != 'style-2'"
									:style="{ color: value.theme == 'diy' ? value.priceStyle.lineColor : '' }">
									¥{{ item.price }}
								</view>
								<view class="price-font" v-else>
									<text
										:style="{ color: value.theme == 'diy' ? value.priceStyle.lineColor : '' }">原价：</text>
									<text :style="{ color: value.theme == 'diy' ? value.priceStyle.lineColor : '' }"
										class="original-price">¥{{ item.price }}</text>
								</view>
							</view>
							<button v-if="value.btnStyle.control && isLoad" :style="{
									background:
										value.btnStyle.theme == 'diy' ? 'linear-gradient(to right,' + value.btnStyle.bgColorStart + ',' + value.btnStyle.bgColorEnd + ')' : '',
									color: value.btnStyle.theme == 'diy' ? value.btnStyle.textColor : '',
									borderRadius: value.btnStyle.aroundRadius * 2 + 'rpx'
								}">
								{{isFuture ? '即将开始' : value.btnStyle.text}}
							</button>
						</view>
					</view>
				</view>
			</template>

			<template v-if="value.template == 'row1-of2'">
				<view class="item" v-for="(item, index) in dataList" :key="index" @click="toDetail(item.id)"
					:class="[value.ornament.type]" :style="goodsItemCss">
					<view class="img-wrap" :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }">
						<image :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }"
							:src="$util.img(item.goods_image,{size: 'mid'})" mode="widthFix" @error="imageError(index)">
						</image>
					</view>
					<view class="content" v-if="value.goodsNameStyle.control || value.priceStyle.mainControl">
						<view class="goods-name" v-if="value.goodsNameStyle.control"
							:style="{ color: value.theme == 'diy' ? value.goodsNameStyle.color : '', fontWeight: value.goodsNameStyle.fontWeight ? 'bold' : '' }"
							:class="[{ 'using-hidden': value.nameLineMode == 'single' }, { 'multi-hidden': value.nameLineMode == 'multiple' }]">
							{{ item.goods_name }}
						</view>
						<view class="discount-price" v-if="value.priceStyle.mainControl">
							<text class="unit price-style small"
								:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor : '' }">¥</text>
							<text class="price price-style large"
								:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor : '' }">{{ item.seckill_price.split('.')[0] }}</text>
							<text class="unit price-style small"
								:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor : '' }">{{ "."+item.seckill_price.split('.')[1] }}</text>
						</view>
						<view class="bottom-wrap">
							<view class="original-price price-font" v-if="value.priceStyle.lineControl"
								:style="{ color: value.theme == 'diy' ? value.priceStyle.lineColor : '' }">
								¥{{ item.price }}
							</view>
							<button v-if="value.btnStyle.control && isLoad" :style="{
									background:
										value.btnStyle.theme == 'diy' ? 'linear-gradient(to right,' + value.btnStyle.bgColorStart + ',' + value.btnStyle.bgColorEnd + ')' : '',
									color: value.btnStyle.theme == 'diy' ? value.btnStyle.textColor : '',
									borderRadius: value.btnStyle.aroundRadius * 2 + 'rpx'
								}">
								{{isFuture ? '即将开始' : value.btnStyle.text}}
							</button>
						</view>
					</view>
				</view>
			</template>

			<template v-if="value.template == 'horizontal-slide'">
				<scroll-view v-if="value.slideMode == 'scroll'" class="scroll" :scroll-x="true" :show-scrollbar="false">
					<view class="item" v-for="(item, index) in dataList" :key="index" @click="toDetail(item.id)"
						:class="[value.ornament.type]" :style="goodsItemCss">
						<view class="img-wrap" :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }">
							<image :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }"
								:src="$util.img(item.goods_image,{size: 'mid'})" mode="widthFix"
								@error="imageError(index)"></image>
						</view>
						<view class="content" v-if="value.goodsNameStyle.control || value.priceStyle.mainControl">
							<view class="goods-name" v-if="value.goodsNameStyle.control"
								:style="{ color: value.theme == 'diy' ? value.goodsNameStyle.color : '', fontWeight: value.goodsNameStyle.fontWeight ? 'bold' : '' }"
								:class="[{ 'using-hidden': value.nameLineMode == 'single' }, { 'multi-hidden': value.nameLineMode == 'multiple' }]">
								{{ item.goods_name }}
							</view>
							<view class="discount-price" v-if="value.priceStyle.mainControl">
								<text class="unit price-style small"
									:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor : '' }">¥</text>
								<text class="price price-style large"
									:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor : '' }">{{ item.seckill_price.split('.')[0] }}</text>
								<text class="unit price-style small"
									:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor : '' }">{{ "."+item.seckill_price.split('.')[1] }}</text>
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
						:class="['swiper-item', dataList[pageIndex]&&[dataList[pageIndex].length / 3].length >= 1 && 'flex-between']">
						<view class="item" v-for="(item, dataIndex) in dataList[pageIndex]" :key="dataIndex"
							@click="toDetail(item.id)" :class="[value.ornament.type]" :style="goodsItemCss">
							<view class="img-wrap" :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }">
								<image :style="{ borderRadius: value.imgAroundRadius * 2 + 'rpx' }"
									:src="$util.img(item.goods_image,{size: 'mid'})" mode="widthFix"
									@error="imageError(dataIndex)"></image>
							</view>
							<view class="content" v-if="value.goodsNameStyle.control || value.priceStyle.mainControl">
								<view class="goods-name" v-if="value.goodsNameStyle.control"
									:style="{ color: value.theme == 'diy' ? value.goodsNameStyle.color : '', fontWeight: value.goodsNameStyle.fontWeight ? 'bold' : '' }"
									:class="[{ 'using-hidden': value.nameLineMode == 'single' }, { 'multi-hidden': value.nameLineMode == 'multiple' }]">
									{{ item.goods_name }}
								</view>
								<view class="discount-price" v-if="value.priceStyle.mainControl">
									<text class="unit price-style small"
										:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor : '' }">¥</text>
									<text class="price price-style large"
										:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor : '' }">{{ item.seckill_price.split('.')[0] }}</text>
									<text class="unit price-style small"
										:style="{ color: value.theme == 'diy' ? value.priceStyle.mainColor : '' }">{{ "."+item.seckill_price.split('.')[1] }}</text>
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
	</view>
</template>

<script>
	export default {
		name: 'diy-seckill',
		props: {
			value: {
				type: Object
			}
		},
		data() {
			return {
				seckillId: 0,
				index: null, //当前正在抢购的index,
				timeList: [],
				dataList: [],
				isFuture: false, //是否是预告
				seckillH: '',
				seckillI: '',
				seckillS: '',
				seckillInterval: null,
				page: 1,
				isLoad: false,
				headData: null
			};
		},
		created() {
			this.getHeadData();

			// #ifdef MP-WEIXIN
			wx.onAppRoute((res) => {
				if (res.path == 'pages/index/index') {
					this.setHeadTime();
				} else {
					clearInterval(this.seckillInterval);
				}
			});
			// #endif
		},
		watch: {
			$route(val, old) {
				if (val.path == '/' || val.path == '/pages/index/index') {
					this.setHeadTime();
				} else {
					clearInterval(this.seckillInterval);
				}
			}
		},
		computed: {
			wrapStyle() {
				var obj = 'background-color:' + this.value.componentBgColor + ';';
				if (this.value.componentAngle == 'round') {
					obj += 'border-top-left-radius:' + this.value.topAroundRadius * 2 + 'rpx;';
					obj += 'border-top-right-radius:' + this.value.topAroundRadius * 2 + 'rpx;';
					obj += 'border-bottom-left-radius:' + this.value.bottomAroundRadius * 2 + 'rpx;';
					obj += 'border-bottom-right-radius:' + this.value.bottomAroundRadius * 2 + 'rpx;';
				}
				return obj;
			},
			// 头部时间样式
			titleTimeStyle() {
				var obj = 'background-color:' + this.value.titleStyle.timeBgColor + ';';
				obj += 'color:' + this.value.titleStyle.timeTextColor + ';';
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
					obj += 'box-shadow:' + '0 0 10rpx ' + this.value.ornament.color + ";";
				}
				if (this.value.ornament.type == 'stroke') {
					obj += 'border:' + '2rpx solid ' + this.value.ornament.color + ";";
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
						return '388rpx';
					else
						return '380rpx';
				}
				if (this.value.ornament.type == 'shadow')
					return '358rpx';
				else
					return '350rpx';
			}
		},
		methods: {
			rpxUpPx(res) {
				const screenWidth = uni.getSystemInfoSync().screenWidth;
				var data = screenWidth * parseInt(res) / 750;
				return Math.floor(data);
			},
			getHeadData() {
				this.$api.sendRequest({
					url: '/seckill/api/seckill/lists',
					success: res => {
						this.headData = res;
						this.setHeadTime();
					}
				});
			},
			setHeadTime() {
				clearInterval(this.seckillInterval);
				this.seckillId = 0;
				this.isFuture = false;
				this.isLoad = false;
				this.seckillH = '';
				this.seckillI = '';
				this.seckillS = '';

				let time = new Date(this.headData.timestamp * 1000); //当前时间
				let newTimes = time.getHours() * 60 * 60 + time.getMinutes() * 60 + time.getSeconds(); //获取当前时间 时分秒的时间戳

				if (!(this.headData.data.list instanceof Array)) {
					var tempArr = Object.values(this.headData.list);
				} else {
					var tempArr = this.headData.data.list;
				}

				try {
					tempArr.forEach((v, k) => {
						if (v.type == "today" && newTimes > v.seckill_end_time) return false;
						if (v.seckill_start_time <= newTimes && newTimes < v.seckill_end_time)
							this.isFuture = false;
						else
							this.isFuture = true;

						this.seckillId = v.id;
						this.index = k;
						v.isNow = true;
						throw new Error('end');
					});
				} catch (e) {
					if (e.message != 'end') throw e;
				}


				if (!this.seckillId) {
					for (let i = 0; i < tempArr.length; i++) {
						if (newTimes < tempArr[i].seckill_start_time && i == 0) {
							this.seckillId = tempArr[i].id;
							this.index = i;
						} else if (newTimes < tempArr[i].seckill_start_time && newTimes > tempArr[i -
								1].seckill_end_time && i != 0) {
							this.seckillId = tempArr[i].id;
							this.index = i;
						} else if (i == tempArr.length - 1 && newTimes > tempArr[i].seckill_end_time) {
							this.seckillId = tempArr[i].id;
							this.index = i;
						}
					}
				}

				if (tempArr.length) {
					var self = this;
					let currTime = new Date();
					let newTimes = currTime.getHours() * 60 * 60 + currTime.getMinutes() * 60 +
						currTime.getSeconds();
					var obj;
					if (self.isFuture)
						obj = self.$util.countDown(24 * 60 * 60 + tempArr[self.index]
							.seckill_start_time - newTimes);
					else
						obj = self.$util.countDown(tempArr[self.index].seckill_end_time - newTimes);

					self.seckillH = obj.h;
					self.seckillI = obj.i;
					self.seckillS = obj.s;
					this.seckillInterval = setInterval(function() {
						currTime = new Date();
						newTimes = currTime.getHours() * 60 * 60 + currTime.getMinutes() * 60 +
							currTime.getSeconds();
						obj;
						if (self.isFuture)
							obj = self.$util.countDown(24 * 60 * 60 + tempArr[self.index]
								.seckill_start_time - newTimes);
						else
							obj = self.$util.countDown(tempArr[self.index].seckill_end_time -
								newTimes);

						self.seckillH = obj.h;
						self.seckillI = obj.i;
						self.seckillS = obj.s;
						if (self.seckillH == '00' && self.seckillI == '00' && self.seckillS ==
							'00') {
							var timeout = setTimeout(function() {
								clearInterval(self.seckillInterval);
								self.seckillH = '';
								self.seckillI = '';
								self.seckillS = '';
								self.index = 1;
								clearTimeout(timeout);
								if (self.timeList.length)
									self.setHeadTime();
							}, 2000);
						}
					}, 1000);
				}
				this.timeList = tempArr;
				this.isLoad = true;
				if (this.seckillId) {
					this.getDataList(this.seckillId);
				}
			},
			getDataList(seckillId) {
				var page_size = this.value.count;

				this.$api.sendRequest({
					url: '/seckill/api/seckillgoods/page',
					data: {
						seckill_time_id: seckillId,
						page_size: page_size
					},
					success: res => {
						var data = res.data;
						if (data.list) {
							this.dataList = data.list;

							// 切屏滚动，每页显示固定数量
							if (this.value.template == 'horizontal-slide' && this.value.slideMode == 'slide') {
								let size = 3;
								let temp = [];
								this.page = Math.ceil(this.dataList.length / size);
								for (var i = 0; i < this.page; i++) {
									temp[i] = [];
									for (var j = i * size; j < this.dataList.length; j++) {
										if (temp[i].length == size) break;
										temp[i].push(this.dataList[j]);
									}
								}
								this.dataList = temp;
							}
						}
					}
				});
			},
			toDetail(id) {
				if (this.isFuture) {
					this.$util.showToast({
						title: '秒杀即将开始，请敬请期待'
					});
					return false;
				}
				this.$util.redirectTo('/pages_promotion/seckill/detail', {
					seckill_id: id
				});
			},
			imageError(index) {
				this.dataList[index].goods_image = this.$util.getDefaultImage().goods;
				this.$forceUpdate();
			},
			toMore() {
				this.$util.redirectTo('/pages_promotion/seckill/list');
			}
		},
		onPageHide() {
			clearInterval(this.seckillInterval);
		}
	};
</script>

<style lang="scss">
	scroll-view ::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
		touch-action: none;
	}

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

	.diy-seckill {
		overflow: hidden;
		background: linear-gradient(180deg, #FFB6A1 0%, rgba(254, 215, 194, 0.4) 30%, rgba(255, 255, 255, 0) 100%) !important;
		.title-wrap.style-1 {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx;

			.time {
				display: flex;
				align-items: center;
				line-height: 1;
				margin-right: auto;
				margin-left: 20rpx;

				.seckill-title-name {
					margin-right: 10rpx;
					font-size: $font-size-tag;
				}

				.number {
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 4rpx;
					min-width: 38rpx;
					height: 36rpx;
					box-sizing: border-box;
					font-size: $font-size-tag;
					border-radius: 6rpx;
				}

				.symbol {
					margin: 0 6rpx;
				}
			}

			.marketimg-box-title-right {
				display: flex;
				align-items: center;
			}
		}

		.title-wrap.style-2 {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx;

			.seckill-style-name {
				margin-left: 12rpx;
				margin-right: -12rpx;
				font-size: 24rpx;
			}

			.time {
				display: flex;
				align-items: center;
				line-height: 1;
				margin-right: auto;
				margin-left: 20rpx;
				border-radius: 30rpx;
				padding: 0 20rpx;
				height: 44rpx;
				background-image: radial-gradient(transparent 50%, #fff);
				font-size: $font-size-tag;

				.seckill-title-name {
					font-size: $font-size-tag;
					background-image: radial-gradient(transparent 35%, #fff);
					border-radius: 50%;
					position: relative;
					margin-left: -20rpx;
					height: 44rpx;
					width: 44rpx;
					line-height: 44rpx;
					text-align: center;
					margin-right: 6rpx;
				}
			}

			.marketimg-box-title-right {
				display: flex;
				align-items: center;
			}
		}

		.title-wrap.style-3 {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx;
			border-radius: 18rpx 18rpx 0 0;
			margin-bottom: 20rpx;
			height: 88rpx;
			box-sizing: border-box;
			background-repeat: no-repeat;
			background-size: cover;

			.title-img {
				height: 40rpx;
			}

			.time {
				display: flex;
				align-items: center;
				line-height: 1;
				margin-right: auto;
				margin-left: 20rpx;

				.seckill-title-name {
					position: relative;
					margin-right: 10rpx;
					font-size: $font-size-tag;

					&::after {
						content: "";
						position: absolute;
						left: -10rpx;
						height: 24rpx;
						width: 2rpx;
						background-color: #fff;
					}
				}

				.number {
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 4rpx;
					min-width: 38rpx;
					height: 36rpx;
					box-sizing: border-box;
					font-size: $font-size-tag;
					border-radius: 6rpx;
				}

				.symbol {
					margin: 0 6rpx;
				}
			}

			.marketimg-box-title-right {
				display: flex;
				align-items: center;
			}
		}

		&.row1-of1 {
			.item {
				display: flex;
				padding: 20rpx;

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
					display: flex;
					justify-content: space-between;
					flex-direction: column;
					flex: 1;
					margin: 10rpx 0 10rpx 20rpx;

					.goods-name {
						&.multi-hidden {
							line-height: 1.3;
						}
					}

					.progress {
						display: flex;
						align-items: center;

						.bg {
							width: 240rpx;
							height: 20rpx;
							border-radius: 20rpx;
							margin-right: 20rpx;
							background-color: #fcecd7;

							.curr {
								height: 20rpx;
								border-radius: 20rpx;
								background-color: #fdbe6c;
							}
						}

						.num {
							font-size: $font-size-tag;
							color: $color-tip;
						}
					}

					.bottom-wrap {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.price-wrap {
							overflow: hidden;
							display: flex;
							align-items: baseline;
							flex-wrap: wrap;
							width: 260rpx;
							font-size: $font-size-tag;

							.discount-price {
								font-weight: bold;
								margin-right: 10rpx;
								line-height: 1;
							}

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
							margin-top: 4rpx;
							font-size: $font-size-tag;
							text-decoration: line-through;
							line-height: 1;
							color: $color-tip;
						}

						button {
							height: 50rpx;
							line-height: 50rpx;
							color: var(--btn-text-color);
							background-color: $base-color;
							color: #fff;
							margin: 0;
							padding: 0 16rpx;
							font-size: $font-size-tag;
							font-weight: bold;
						}
					}
				}
			}

			&.style-1 {
				.progress .bg {
					overflow: hidden;
				}
			}

			&.style-2 {
				.item {
					overflow: hidden;
					position: relative;
					padding: 16rpx;

					.img-wrap {
						position: relative;
						overflow: hidden;
					}

					.bottom-wrap .price-font {
						color: #999;
						font-size: $font-size-tag;
					}

					.content .progress {
						.num {
							color: #FF3D3D;
						}

						.bg {
							background-color: #FFD5D5;

							.curr {
								position: relative;
								background-color: #ff0400 !important;
							}
						}
					}

					.progress-bar {
						position: absolute;
						right: -24rpx;
						width: 30rpx;
						height: 30rpx;
						top: 50%;
						transform: translateY(-50%);
					}

					.price-wrap {
						flex-direction: column-reverse;
					}
				}
			}
		}

		&.row1-of2 {
			&.style-1 {
				.content-wrap {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;
				}

				.item {
					overflow: hidden;
					width: calc(50% - 10rpx);
					display: flex;
					flex-direction: column;
					box-sizing: border-box;
					margin-bottom: 20rpx;

					&:nth-child(2n) {
						margin-right: 0;
					}

					&:nth-of-type(1),
					&:nth-of-type(2) {
						margin-top: 0;
					}

					&.shadow {
						width: calc(50% - 18rpx);
						margin-top: 20rpx;

						&:nth-of-type(1),
						&:nth-of-type(2) {
							margin-top: 8rpx;
						}

						&:nth-child(2n-1) {
							margin-left: 8rpx;
						}
					}

					.img-wrap {
						image {
							width: 100%;
						}
					}

					.content {
						display: flex;
						flex-direction: column;
						flex: 1;
						padding: 10rpx 20rpx;
						position: relative;

						.goods-name {
							font-size: $font-size-sub;
							line-height: 1.5;
							margin-bottom: 10rpx;
						}

						.discount-price {
							margin-top: auto;
							line-height: 1;
							white-space: nowrap;
							font-weight: bold;

							.unit {
								display: inline-block;
								font-size: $font-size-tag;
								color: var(--price-color);
							}

							.price {
								font-size: $font-size-toolbar;
								color: var(--price-color);
							}
						}

						.bottom-wrap {
							display: flex;
							justify-content: space-between;
							align-items: flex-end;

							.original-price {
								font-size: $font-size-goods-tag;
								text-decoration: line-through;
								color: $color-tip;
							}

							button {
								width: auto;
								height: 52rpx;
								line-height: 52rpx;
								background-color: $base-color;
								color: #fff;
								margin: 0;
								padding: 0 16rpx;
								font-size: $font-size-tag;
								font-weight: bold;
							}
						}
					}
				}
			}
		}

		&.horizontal-slide {
			&.style-1 {
				.scroll {
					width: calc(100% - 40rpx);
					padding: 0 20rpx 20rpx;
					line-height: 1;
					white-space: nowrap;
				}

				.flex-between {
					justify-content: space-between;
				}

				.item {
					display: inline-block;
					width: 200rpx;
					overflow: hidden;
					box-sizing: border-box;
					margin-top: 20rpx;

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
					}

					.content {
						padding: 10rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;

						.goods-name {
							line-height: 1.3;

							&.using-hidden {
								display: block;
							}

							&.multi-hidden {
								white-space: break-spaces;
							}
						}

						.discount-price {
							margin-top: 10rpx;
							white-space: nowrap;
							font-weight: bold;
							line-height: 1;

							.unit {
								display: inline-block;
								font-size: $font-size-tag;
								color: var(--price-color);
							}

							.price {
								font-size: $font-size-toolbar;
								color: var(--price-color);
							}
						}

						.original-price {
							line-height: 1;
							font-size: $font-size-tag;
							text-decoration: line-through;
							color: $color-tip;
						}
					}
				}

				.swiper {
					width: 100%;
					white-space: nowrap;
					padding: 0 20rpx 20rpx;
					box-sizing: border-box;

					.swiper-item {
						display: flex;
						align-items: baseline;
					}

					.item {
						width: 200rpx;
						box-sizing: border-box;
					}
				}
			}
		}
	}
</style>
