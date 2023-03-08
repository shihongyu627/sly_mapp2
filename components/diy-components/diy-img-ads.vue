<template>
	<view class="single-graph">
		<view :style="imgAdsMarginWarp" class="swiper-box">
			<block v-if="imgAdsValue.list.length == 1">
				<view class="simple-graph-wrap" :style="imgAdsSwiper" @click="$util.diyRedirectTo(imgAdsValue.list[0].link)">
					<image :style="{ height: imgAdsValue.list[0].imgHeight }" :src="$util.img(imgAdsValue.list[0].imageUrl)" mode="widthFix"></image>
					<!-- 热区功能 -->
					<view v-if="imgAdsValue.list[0].heatMapData">
						<view
							class="heat-map"
							v-for="(mapItem, mapIndex) in imgAdsValue.list[0].heatMapData"
							:key="mapIndex"
							:style="{
								width: mapItem.width + '%',
								height: mapItem.height + '%',
								left: mapItem.left + '%',
								top: mapItem.top + '%'
							}"
							@click.stop="$util.diyRedirectTo(mapItem.link)"
						></view>
					</view>
				</view>
			</block>
			<swiper
				v-else
				class="swiper"
				:style="{ height: swiperHeight }"
				:class="{
					'swiper-left': imgAdsValue.indicatorLocation == 'left',
					'swiper-right': imgAdsValue.indicatorLocation == 'right',
					'ns-indicator-dots': imgAdsValue.carouselStyle == 'line'
				}"
				autoplay="true"
				circular="true"
				:indicator-dots="isDots"
				indicator-color="rgba(130, 130, 130, .5)"
				:indicator-active-color="imgAdsValue.indicatorColor"
				@change="swiperChange"
			>
				<swiper-item
					class="swiper-item"
					:style="imgAdsSwiper"
					v-for="(item, index) in imgAdsValue.list"
					:key="index"
					v-if="item.imageUrl"
					@click="$util.diyRedirectTo(item.link)"
				>
					<view class="item" :style="{ height: item.imgHeight }">
						<image :src="$util.img(item.imageUrl)" mode="aspectFill"></image>
						<!-- 热区功能 -->
						<view v-if="item.heatMapData">
							<view
								class="heat-map"
								v-for="(mapItem, mapIndex) in item.heatMapData"
								:key="mapIndex"
								:style="{
									width: mapItem.width + '%',
									height: mapItem.height + '%',
									left: mapItem.left + '%',
									top: mapItem.top + '%'
								}"
								@click.stop="$util.diyRedirectTo(mapItem.link)"
							></view>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<!-- #ifdef MP-WEIXIN -->
			<view
				v-if="imgAdsValue.list.length > 1"
				:class="[
					'swiper-dot-box',
					{ straightLine: imgAdsValue.carouselStyle == 'line' },
					{ 'swiper-left': imgAdsValue.indicatorLocation == 'left' },
					{ 'swiper-right': imgAdsValue.indicatorLocation == 'right' }
				]"
			>
				<view
					v-for="(numItem, numIndex) in imgAdsValue.list.length"
					:key="numIndex"
					:class="['swiper-dot', { active: numIndex == swiperIndex }]"
					:style="[numIndex == swiperIndex && { backgroundColor: imgAdsValue.indicatorColor }]"
				></view>
			</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
export default {
	name: 'diy-img-ads',
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
			isDots: true,
			swiperHeight: 0,
			imgAdsValue: null, // 深拷贝一遍数据，防止动态计算图片展示尺寸的时候，影响到父级的数据，导致二次渲染的时候，数据错误
			swiperIndex: 0
		};
	},
	created() {
		this.calcSingleRow();
	},
	computed: {
		imgAdsMarginWarp: function() {
			var obj = '';
			obj = 'background-color:' + this.value.componentBgColor + ';';
			return obj;
		},
		imgAdsSwiper: function() {
			var obj = '';
			if (this.value.componentAngle == 'round') {
				obj += 'border-top-left-radius:' + this.value.topAroundRadius * 2 + 'rpx;';
				obj += 'border-top-right-radius:' + this.value.topAroundRadius * 2 + 'rpx;';
				obj += 'border-bottom-left-radius:' + this.value.bottomAroundRadius * 2 + 'rpx;';
				obj += 'border-bottom-right-radius:' + this.value.bottomAroundRadius * 2 + 'rpx;';
			}
			return obj;
		},
		singleGraphBg: function() {
			var imgArr = [];
			for (let i = 0; i < this.imgAdsValue.list.length; i++) {
				let item = this.imgAdsValue.list[i];
				imgArr[i] = parseFloat(item.imgHeight);
			}
			imgArr.sort(function(a, b) {
				return b - a;
			});
			var obj = '';
			obj += 'background-color:' + this.imgAdsValue.backgroundColor + ';';
			obj += 'height:' + imgArr[0] * (this.imgAdsValue.backgroundHeight / 100) * 2 + 'rpx;';
			return obj;
		}
	},
	methods: {
		swiperChange(e) {
			this.swiperIndex = e.detail.current;
		},
		calcSingleRow() {
			let maxHeight = 0;

			// 深拷贝一层数据，防止数据更改越权
			this.imgAdsValue = JSON.parse(JSON.stringify(this.value));
			this.imgAdsValue.list.forEach((item, index) => {
				uni.getSystemInfo({
					success: res => {
						var ratio = item.imgHeight / item.imgWidth;
						item.imgWidth = res.windowWidth;
						item.imgWidth -= this.value.margin.both * 2;
						item.imgHeight = item.imgWidth * ratio;
					}
				});

				// 获取最大高度
				if (maxHeight == 0 || maxHeight < item.imgHeight) maxHeight = item.imgHeight;
			});
			this.imgAdsValue.list.forEach((item, index) => {
				item.imgHeight = maxHeight * 2 + 'rpx';
				this.swiperHeight = maxHeight * 2 + 'rpx';
			});
			this.imgAdsValue.indicatorColor = this.imgAdsValue.indicatorColor || '#fff';

			// 是否显示指示器
			if (this.imgAdsValue.list.length <= 1) {
				this.isDots = false;
			}
			// #ifdef MP-WEIXIN
			this.isDots = false;
			// #endif
		}
	}
};
</script>

<style lang="scss" scoped>
.single-graph {
	width: 100%;
	line-height: 0;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	box-sizing: border-box;
}
.simple-graph-wrap {
	line-height: 0;
	overflow: hidden;
	position: relative;
	image {
		width: 100%;
	}
	.heat-map {
		position: absolute;
	}
}
.item.active text {
	background: rgba(0, 0, 0, 0.3);
	position: absolute;
	bottom: 0;
	color: #ffffff;
	font-size: $font-size-tag;
	width: 100%;
	left: 0;
	line-height: 40rpx;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	padding: 0 10rpx;
	text-align: center;
}
.swiper-box {
	position: relative;
	width: 100%;
	overflow: hidden;
	box-sizing: border-box;
}

.swiper {
	margin: 0 auto;
	overflow: hidden;
}

.swiper-item {
	width: 100%;
	height: auto !important;
	display: flex;
	justify-content: center;
	flex-direction: column;
	position: relative;

	.item {
		width: 100%;
		height: auto;
		text-align: center;
		position: relative;
		overflow: hidden;

		image {
			width: 100%;
			max-width: 100%;
			height: 100%;
		}
		.heat-map {
			position: absolute;
		}
	}
}

.swiper-dot-box {
	position: absolute;
	bottom: 20rpx;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 40rpx 8rpx;
	box-sizing: border-box;
	&.swiper-left {
		justify-content: flex-start;
	}
	&.swiper-right {
		justify-content: flex-end;
	}

	.swiper-dot {
		background-color: #b2b2b2;
		width: 15rpx;
		border-radius: 50%;
		height: 15rpx;
		margin: 8rpx;
		&.active {
			background-color: rgba(0, 0, 0, 1);
		}
	}
	&.straightLine {
		.swiper-dot {
			width: 18rpx;
			height: 6rpx;
			border-radius: 4rpx;
			&.active {
				width: 36rpx;
				background-color: rgba(0, 0, 0, 1);
			}
		}
	}
}

/* 隐藏滚动条，但依旧具备可以滚动的功能 */
/deep/.uni-scroll-view::-webkit-scrollbar {
	display: none;
}
.swiper /deep/ .uni-swiper-dots-horizontal {
	bottom: 25rpx;
}
.swiper-left /deep/ .uni-swiper-dots-horizontal {
	left: 40rpx;
	transform: translate(0);
}
.swiper-right /deep/ .uni-swiper-dots-horizontal {
	right: 40rpx;
	display: flex;
	justify-content: flex-end;
	transform: translate(0);
}
.carousel-angle /deep/ .uni-swiper-dots-horizontal .uni-swiper-dot {
	width: 24rpx;
	border-radius: 0;
	height: 8rpx;
}
.swiper /deep/ .swiper-item .item uni-image > div {
	background-size: cover !important;
}
.swiper.ns-indicator-dots /deep/ .uni-swiper-dot {
	width: 18rpx;
	height: 6rpx;
	border-radius: 4rpx;
}
.swiper.ns-indicator-dots /deep/ .uni-swiper-dot-active {
	width: 36rpx;
}
</style>
