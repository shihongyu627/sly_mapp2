<template>
	<view>
		<!-- 自定义 -->
		<view v-if="value.mode == 'custom-rubik-cube'">
			<view style="position: relative;"><rich-text :nodes="customHtml"></rich-text></view>
		</view>
		<view v-else :class="['rubik-cube',value.mode]" :style="rubikCubeWrapCss">
			<!-- 1左2右 -->
			<template v-if="value.mode == 'row1-lt-of2-rt'">
				<view class="template-left">
					<view
						:class="['item', value.mode]"
						@click="$util.diyRedirectTo(value.list[0].link)"
						:style="{ padding: value.imageGap + 'rpx', height: list[0].imgHeight * 2 + 'rpx' }"
					>
						<image :src="$util.img(value.list[0].imageUrl)" mode="aspectFill" :style="list[0].pageItemStyle"></image>
					</view>
				</view>

				<view class="template-right">
					<template v-for="(item, index) in list">
						<template v-if="index > 0">
							<view
								:key="index"
								:class="['item', value.mode]"
								@click="$util.diyRedirectTo(item.link)"
								:style="{ padding: value.imageGap + 'rpx', height: item.imgHeight }"
							>
								<image :src="$util.img(item.imageUrl)" mode="aspectFill" :style="item.pageItemStyle"></image>
							</view>
						</template>
					</template>
				</view>
			</template>

			<!-- 1左3右 -->
			<template v-else-if="value.mode == 'row1-lt-of1-tp-of2-bm'">
				<view class="template-left" :style="{ paddingRight: value.imageGap + 'rpx' }">
					<view :class="['item', value.mode]" :style="{ height: list[0].imgHeight + 'rpx' }" @click="$util.diyRedirectTo(value.list[0].link)">
						<image :src="$util.img(value.list[0].imageUrl)" mode="aspectFill" :style="list[0].pageItemStyle"></image>
					</view>
				</view>

				<view class="template-right" :style="{ paddingLeft: value.imageGap + 'rpx' }">
					<view
						:class="['item', value.mode]"
						:style="{ height: list[1].imgHeight + 'rpx', paddingBottom: value.imageGap + 'rpx' }"
						@click="$util.diyRedirectTo(value.list[1].link)"
					>
						<image :src="$util.img(value.list[1].imageUrl)" mode="aspectFill" :style="list[1].pageItemStyle"></image>
					</view>
					<view class="template-bottom" :style="{ paddingTop: value.imageGap + 'rpx' }">
						<template v-for="(item, index) in list">
							<template v-if="index > 1">
								<view
									:key="index"
									:class="['item', value.mode]"
									@click="$util.diyRedirectTo(item.link)"
									:style="{
										height: item.imgHeight + 'rpx',
										paddingLeft: index == 3 ? value.imageGap * 2 + 'rpx' : 0
									}"
								>
									<image :src="$util.img(item.imageUrl)" mode="aspectFill" :style="item.pageItemStyle"></image>
								</view>
							</template>
						</template>
					</view>
				</view>
			</template>

			<template v-else>
				<view
					:class="['item', value.mode]"
					v-for="(item, index) in list"
					:key="index"
					@click="$util.diyRedirectTo(item.link)"
					:style="{ padding: value.imageGap + 'rpx', height: item.imgHeight * 2 + 'rpx' }"
				>
					<image :src="$util.img(item.imageUrl)" mode="aspectFill" :style="item.pageItemStyle"></image>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
// 魔方、橱窗
import htmlParser from '@/common/js/html-parser';
export default {
	name: 'diy-rubik-cube',
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
			customHtml: ''
		};
	},
	created() {
		if (this.value.mode == 'custom-rubik-cube') {
			this.value.diyHtml = this.value.diyHtml.replace(/&quot;/g, '"');
			this.customHtml = htmlParser(this.value.diyHtml);
		} else {
			var singleRow = {
				'row1-of2': {
					ratio: 2,
					width: '50%'
				},
				'row1-of3': {
					ratio: 3,
					width: '33.33%'
				},
				'row1-of4': {
					ratio: 4,
					width: '25%'
				}
			};
			if (singleRow[this.value.mode]) {
				this.calcSingleRow(singleRow[this.value.mode]);
			} else if (this.value.mode == 'row2-lt-of2-rt') {
				this.calcFourSquare();
			} else if (this.value.mode == 'row1-lt-of2-rt') {
				this.calcRowOneLeftOfTwoRight();
			} else if (this.value.mode == 'row1-tp-of2-bm') {
				this.calcRowOneTopOfTwoBottom();
			} else if (this.value.mode == 'row1-lt-of1-tp-of2-bm') {
				this.calcRowOneLeftOfOneTopOfTwoBottom();
			}
		}
	},
	computed: {
		list() {
			var arr = JSON.parse(JSON.stringify(this.value.list));
			arr.forEach((item, index) => {
				item.pageItemStyle = this.countBorderRadius(this.value.mode, index);
			});
			return arr;
		},
		rubikCubeWrapCss() {
			var obj = '';
			obj += 'background-color:' + this.value.componentBgColor + ';';
			if (this.value.componentAngle == 'round') {
				obj += 'border-top-left-radius:' + this.value.topAroundRadius * 2 + 'rpx;';
				obj += 'border-top-right-radius:' + this.value.topAroundRadius * 2 + 'rpx;';
				obj += 'border-bottom-left-radius:' + this.value.bottomAroundRadius * 2 + 'rpx;';
				obj += 'border-bottom-right-radius:' + this.value.bottomAroundRadius * 2 + 'rpx;';
			}
			return obj;
		}
	},
	methods: {
		/**
		 * 魔方：单行多个，平分宽度
		 * 公式：
		 * 宽度：屏幕宽度/2，示例：375/2=187.5
		 * 比例：原图高/原图宽，示例：322/690=0.46
		 * 高度：宽度*比例，示例：187.5*0.46=86.25
		 */
		calcSingleRow(params) {
			let maxHeight = 0;
			this.list.forEach((item, index) => {
				uni.getSystemInfo({
					success: res => {
						var ratio = item.imgHeight / item.imgWidth;
						item.imgWidth = 375 / params.ratio;
						item.imgWidth -= this.value.margin.both * 2;
						item.imgHeight = item.imgWidth * ratio;
					}
				});

				// 获取最大高度
				if (maxHeight == 0 || maxHeight < item.imgHeight) maxHeight = item.imgHeight;
			});
			this.list.forEach((item, index) => {
				item.imgWidth = params.width;
				item.imgHeight = maxHeight;
			});
		},
		/**
		 * 魔方：四方型，各占50%
		 */
		calcFourSquare() {
			let maxHeightFirst = 0;
			let maxHeightTwo = 0;
			this.list.forEach((item, index) => {
				uni.getSystemInfo({
					success: res => {
						var ratio = item.imgHeight / item.imgWidth;
						item.imgWidth = 375 / 2;
						item.imgWidth -= this.value.margin.both * 2;
						item.imgHeight = item.imgWidth * ratio;
					}
				});

				// 获取每行最大高度
				if (index <= 1) {
					if (maxHeightFirst == 0 || maxHeightFirst < item.imgHeight) {
						maxHeightFirst = item.imgHeight;
					}
				} else if (index > 1) {
					if (maxHeightTwo == 0 || maxHeightTwo < item.imgHeight) {
						maxHeightTwo = item.imgHeight;
					}
				}
			});
			this.list.forEach((item, index) => {
				item.imgWidth = '50%';
				if (index <= 1) {
					item.imgHeight = maxHeightFirst;
				} else if (index > 1) {
					item.imgHeight = maxHeightTwo;
				}
			});
		},
		/**
		 * 魔方：1左2右
		 */
		calcRowOneLeftOfTwoRight() {
			let rightHeight = 0; // 右侧两图平分高度
			let divide = 'left'; // 划分规则，left：左，right：右
			if (this.list[1].imgWidth === this.list[2].imgWidth) divide = 'right';
			this.list.forEach((item, index) => {
				uni.getSystemInfo({
					success: res => {
						if (index == 0) {
							var ratio = item.imgHeight / item.imgWidth; // 获取左图的尺寸比例
							item.imgWidth = 375 / 2;// 因为这里使用px进行计算；最后结果会转换为rpx来适应屏幕的变化
							item.imgWidth -= (this.value.margin.both * 2 + this.value.imageGap / 2);
							item.imgHeight = item.imgWidth * ratio;
							rightHeight = item.imgHeight / 2 - this.value.imageGap / 2;
						} else {
							item.imgWidth = this.list[0].imgWidth;
							item.imgHeight = rightHeight * 2;
							item.imgHeight += 'rpx';
							// if (divide == 'left') {
							// 	item.imgWidth = this.list[0].imgWidth;
							// 	item.imgHeight = rightHeight / 100;
							// } else {
							// 	var ratio = item.imgHeight / item.imgWidth; // 获取右图的尺寸比例
							// 	if (isNaN(ratio)) ratio = 0;
							// 	item.imgWidth = res.windowWidth * ratio;
							// 	item.imgHeight = item.imgHeight * ratio;
							// 	if (this.list[1].imgHeight) this.list[0].imgHeight = this.list[1].imgHeight * 2;
							// }
						}
					}
				});
			});
			// this.list.forEach((item, index) => {
			// 	if (index == 0) item.imgHeight += this.value.imageGap;
			// 	item.imgHeight += 'px';
			// });
		},
		/**
		 * 魔方：1上2下
		 */
		calcRowOneTopOfTwoBottom() {
			var maxHeight = 0;
			this.list.forEach((item, index) => {
				uni.getSystemInfo({
					success: res => {
						var ratio = item.imgHeight / item.imgWidth; // 获取左图的尺寸比例
						if (index == 0) item.imgWidth = 375;
						else if (index > 0) item.imgWidth = 375 / 2;

						item.imgWidth -= this.value.margin.both * 2;

						item.imgHeight = item.imgWidth * ratio;

						// 获取最大高度
						if (index > 0 && (maxHeight == 0 || maxHeight < item.imgHeight)) maxHeight = item.imgHeight;
					}
				});
			});
			this.list.forEach((item, index) => {
				if (index == 0) item.imgWidth -= this.value.margin.both * 2; // 减去左右边距
				if (index > 0) item.imgWidth -= this.value.margin.both * 2; // 减去左右边距
				item.imgWidth += item.imgWidth * 2 + 'rpx';
				if (index > 0) item.imgHeight = maxHeight;
				// else item.imgHeight += 'px';
			});
		},
		/**
		 * 魔方：1左3右
		 */
		calcRowOneLeftOfOneTopOfTwoBottom() {
			this.list.forEach((item, index) => {
				uni.getSystemInfo({
					success: res => {
						// 左图
						if (index == 0) {
							var ratio = item.imgHeight / item.imgWidth;
							item.imgWidth = 375 / 2;
							item.imgWidth -= this.value.margin.both * 2;
							item.imgHeight = item.imgWidth * ratio;
						} else if (index == 1) {
							item.imgWidth = 375 / 2;
							item.imgWidth -= this.value.margin.both * 2;
							item.imgHeight = this.list[0].imgHeight / 2;
						} else if (index > 1) {
							item.imgWidth = this.list[0].imgWidth / 2;
							item.imgHeight = this.list[0].imgHeight / 2;
						}
					}
				});
			});

			this.list.forEach((item, index) => {
				if (index == 0) {
					item.imgHeight += this.value.imageGap;
					item.imgHeight *= 2;
				} else {
					item.imgHeight *= 2;
				}
				if (index > 1) {
					item.imgWidth -= this.value.imageGap / 2;
					item.imgWidth -= this.value.margin.both; // 减去左右边距
					item.imgWidth = item.imgWidth * 2 + 'rpx';
				} else {
					item.imgWidth -= this.value.margin.both * 2; // 减去左右边距
					item.imgWidth = item.imgWidth * 2 + 'rpx';
				}
			});
		},
		countBorderRadius(type, index) {
			var obj = '';
			if (this.value.elementAngle == 'right') {
				return obj;
			}
			var defaultData = {
				'row1-lt-of2-rt': [
					['border-top-right-radius', 'border-bottom-right-radius'],
					['border-top-left-radius', 'border-bottom-left-radius', 'border-bottom-right-radius'],
					['border-top-left-radius', 'border-bottom-left-radius', 'border-top-right-radius']
				],
				'row1-lt-of1-tp-of2-bm': [
					['border-top-right-radius', 'border-bottom-right-radius'],
					['border-top-left-radius', 'border-bottom-left-radius', 'border-bottom-right-radius'],
					['border-radius'],
					['border-top-left-radius', 'border-bottom-left-radius', 'border-top-right-radius']
				],
				'row1-tp-of2-bm': [
					['border-bottom-left-radius', 'border-bottom-right-radius'],
					['border-top-left-radius', 'border-bottom-right-radius', 'border-top-right-radius'],
					['border-top-left-radius', 'border-bottom-left-radius', 'border-top-right-radius']
				],
				'row2-lt-of2-rt': [
					['border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius'],
					['border-top-left-radius', 'border-bottom-right-radius', 'border-bottom-left-radius'],
					['border-top-left-radius', 'border-bottom-right-radius', 'border-top-right-radius'],
					['border-top-left-radius', 'border-bottom-left-radius', 'border-top-right-radius']
				],
				'row1-of4': [
					['border-top-right-radius', 'border-bottom-right-radius'],
					['border-radius'],
					['border-radius'],
					['border-top-left-radius', 'border-bottom-left-radius']
				],
				'row1-of3': [['border-top-right-radius', 'border-bottom-right-radius'], ['border-radius'], ['border-top-left-radius', 'border-bottom-left-radius']],
				'row1-of2': [['border-top-right-radius', 'border-bottom-right-radius'], ['border-top-left-radius', 'border-bottom-left-radius']]
			};

			defaultData[type][index].forEach((item, index) => {
				// obj += item + ':' + this.value.aroundRadius * 2 + 'rpx;';
				obj += 'border-top-left-radius:' + this.value.topElementAroundRadius * 2 + 'rpx;';
				obj += 'border-top-right-radius:' + this.value.topElementAroundRadius * 2 + 'rpx;';
				obj += 'border-bottom-left-radius:' + this.value.bottomElementAroundRadius * 2 + 'rpx;';
				obj += 'border-bottom-right-radius:' + this.value.bottomElementAroundRadius * 2 + 'rpx;';
			});
			return obj;
		}
	}
};
</script>
<style lang="scss">
.rubik-cube {
	overflow: hidden;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.rubik-cube .item {
	text-align: center;
	line-height: 0;
	overflow: hidden;
}

.rubik-cube .item image {
	width: 100%;
	max-width: 100%;
	height: 100%;
}

// 一行两个
.rubik-cube .item.row1-of2 {
	width: 50% !important;
	box-sizing: border-box;
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .item.row1-of2:nth-child(1) {
	padding-left: 0 !important;
}

.rubik-cube .item.row1-of2:nth-child(2) {
	padding-right: 0 !important;
}

// 一行三个
.rubik-cube .item.row1-of3 {
	width: 33.33%;
	box-sizing: border-box;
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .item.row1-of3:nth-child(1) {
	padding-left: 0 !important;
}

.rubik-cube .item.row1-of3:nth-child(3) {
	padding-right: 0 !important;
}

// 一行四个
.rubik-cube .item.row1-of4 {
	width: 25%;
	box-sizing: border-box;
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .item.row1-of4:nth-child(1) {
	padding-left: 0 !important;
}

.rubik-cube .item.row1-of4:nth-child(4) {
	padding-right: 0 !important;
}

// 两左两右
.rubik-cube .item.row2-lt-of2-rt {
	width: 50%;
	display: inline-block;
	box-sizing: border-box;
}

.rubik-cube .item.row2-lt-of2-rt:nth-child(1) {
	padding-left: 0 !important;
	padding-top: 0 !important;
}

.rubik-cube .item.row2-lt-of2-rt:nth-child(2) {
	padding-right: 0 !important;
	padding-top: 0 !important;
}

.rubik-cube .item.row2-lt-of2-rt:nth-child(3) {
	padding-left: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .item.row2-lt-of2-rt:nth-child(4) {
	padding-right: 0 !important;
	padding-bottom: 0 !important;
}

// 一左两右
.rubik-cube .template-left,
.rubik-cube .template-right {
	width: 50%;
	box-sizing: border-box;
}

.rubik-cube .template-left .item.row1-lt-of2-rt:nth-child(1) {
	width: auto;
	padding-top: 0 !important;
	padding-left: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .template-right .item.row1-lt-of2-rt:nth-child(1) {
	padding-top: 0 !important;
	padding-right: 0 !important;
}

.rubik-cube .template-right .item.row1-lt-of2-rt:nth-child(2) {
	padding-right: 0 !important;
	padding-bottom: 0 !important;
}
.rubik-cube.row1-lt-of2-rt .template-right{
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}


// 一上两下
.rubik-cube .item.row1-tp-of2-bm:nth-child(1) {
	width: 100%;
	box-sizing: border-box;
	padding-top: 0 !important;
	padding-left: 0 !important;
	padding-right: 0 !important;
}

.rubik-cube .item.row1-tp-of2-bm:nth-child(2) {
	width: 50%;
	box-sizing: border-box;
	padding-left: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .item.row1-tp-of2-bm:nth-child(3) {
	width: 50%;
	box-sizing: border-box;
	padding-right: 0 !important;
	padding-bottom: 0 !important;
}

// 一左三右
.rubik-cube .template-left .item.row1-lt-of1-tp-of2-bm {
	width: 100%;
	box-sizing: border-box;
}
.rubik-cube .template-bottom {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.rubik-cube .template-bottom .item.row1-lt-of1-tp-of2-bm {
	width: 50%;
}
</style>
