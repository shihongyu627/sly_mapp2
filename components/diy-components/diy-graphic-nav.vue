<template>
	<view :style="componentStyle">
		<block v-if="value.showStyle == 'pageSlide'">
			<swiper :class="['graphic-nav', 'pageSlide', value.carousel.type]" circular :indicator-dots="false" :style="swiperHeight" @change="swiperChange">
				<swiper-item class="graphic-nav-wrap" v-for="(numItem, numIndex) in Math.ceil(value.list.length / (value.pageCount * value.rowCount))">
					<!-- #ifdef MP-WEIXIN -->
					 <view
						class="graphic-nav-item"
						v-for="(item, index) in value.list"
						:key="index"
						v-if="index >= [(numItem) * (value.pageCount * value.rowCount)] && index < [(numItem+1) * (value.pageCount * value.rowCount)]"
						:style="{ width: 100 / value.rowCount + '%' }"
						@click="redirectTo(item.link)"
					 >
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<view
						class="graphic-nav-item"
						v-for="(item, index) in value.list"
						:key="index"
						v-if="index >= [(numItem - 1) * (value.pageCount * value.rowCount)] && index < [numItem * (value.pageCount * value.rowCount)]"
						:style="{ width: 100 / value.rowCount + '%' }"
						@click="redirectTo(item.link)"
					>
					<!-- #endif -->
						<view
							class="graphic-img"
							v-show="value.mode != 'text'"
							:style="{ fontSize: value.imageSize * 2 + 'rpx', width: value.imageSize * 2 + 'rpx', height: value.imageSize * 2 + 'rpx' }"
						>
							<image
								v-if="item.iconType == 'img'"
								:src="$util.img(item.imageUrl) || $util.img('public/uniapp/default_img/goods.png')"
								mode="aspectFill"
								:style="{ maxWidth: value.imageSize * 2 + 'rpx', maxHeight: value.imageSize * 2 + 'rpx', borderRadius: value.aroundRadius * 2 + 'rpx' }"
							></image>

							<diy-icon
								v-if="item.iconType == 'icon'"
								:icon="item.icon"
								:value="item.style ? item.style : null"
								:style="{ maxWidth: value.imageSize * 2 + 'rpx', maxHeight: value.imageSize * 2 + 'rpx', width: '100%', height: '100%' }"
							></diy-icon>

							<text
								class="tag"
								v-if="item.label.control"
								:style="{ color: item.label.textColor, backgroundImage: 'linear-gradient(' + item.label.bgColorStart + ',' + item.label.bgColorEnd + ')' }"
							>
								{{ item.label.text }}
							</text>
						</view>
						<text
							v-show="value.mode != 'img'"
							class="graphic-text"
							:style="{ fontSize: value.font.size * 2 + 'rpx', fontWeight: value.font.weight, color: value.font.color }"
						>
							{{ item.title }}
						</text>
					</view>
				</swiper-item>
			</swiper>
			
			<view class="swiper-dot-box" v-if="isIndicatorDots" :class="value.carousel.type">
				<view v-for="(numItem, numIndex) in Math.ceil(value.list.length / (value.pageCount * value.rowCount))" :key="numIndex">
					<view class="swiper-dot" :class="{'active':numIndex==swiperCurrent}" ></view>
				</view>
			</view>
			
		</block>
		<scroll-view v-else :scroll-x="value.showStyle == 'singleSlide'" :class="['graphic-nav', value.showStyle]">
				<!-- #ifdef MP -->
				<view class="uni-scroll-view-content">
				<!-- #endif -->
				
					<view class="graphic-nav-item" v-for="(item, index) in value.list" :key="index" :style="{ width: 100 / value.rowCount + '%' }" @click="redirectTo(item.link)">
						<view
							class="graphic-img"
							v-show="value.mode != 'text'"
							:style="{ fontSize: value.imageSize * 2 + 'rpx', width: value.imageSize * 2 + 'rpx', height: value.imageSize * 2 + 'rpx' }"
						>
							<image
								v-if="item.iconType == 'img'"
								:src="$util.img(item.imageUrl) || $util.img('public/uniapp/default_img/goods.png')"
								mode="aspectFill"
								:style="{ maxWidth: value.imageSize * 2 + 'rpx', maxHeight: value.imageSize * 2 + 'rpx', borderRadius: value.aroundRadius * 2 + 'rpx' }"
							></image>
							<diy-icon
								v-if="item.iconType == 'icon'"
								:icon="item.icon"
								:value="item.style ? item.style : null"
								:style="{  maxWidth: value.imageSize * 2 + 'rpx', maxHeight: value.imageSize * 2 + 'rpx', width: '100%', height: '100%' }"
							></diy-icon>
							<text
								:class="['tag', { alone: value.mode == 'text' }]"
								v-if="item.label.control"
								:style="{ color: item.label.textColor, backgroundImage: 'linear-gradient(' + item.label.bgColorStart + ',' + item.label.bgColorEnd + ')' }"
							>
								{{ item.label.text }}
							</text>
						</view>
						<text v-show="value.mode != 'img'" class="graphic-text" :style="{ fontSize: value.font.size * 2 + 'rpx', fontWeight: value.font.weight, color: value.font.color }">
							{{ item.title }}
						</text>
					</view>
			
				<!-- #ifdef MP -->
				</view>
				<!-- #endif -->
				
			
		</scroll-view>
	</view>
</template>

<script>
export default {
	name: 'diy-graphic-nav',
	props: {
		value: {
			type: Object
		}
	},
	data() {
		return {
			pageWidth: '',
			indicatorDots: false,
			swiperCurrent:0
		};
	},
	created() {
	},
	computed: {
		componentStyle() {
			var css = '';
			css += 'background-color:' + this.value.componentBgColor + ';';
			if (this.value.componentAngle == 'round') {
				css += 'border-top-left-radius:' + this.value.topAroundRadius * 2 + 'rpx;';
				css += 'border-top-right-radius:' + this.value.topAroundRadius * 2 + 'rpx;';
				css += 'border-bottom-left-radius:' + this.value.bottomAroundRadius * 2 + 'rpx;';
				css += 'border-bottom-right-radius:' + this.value.bottomAroundRadius * 2 + 'rpx;';
			}
			css += 'box-shadow:' + (this.value.ornament.type == 'shadow' ? '0 0 10rpx ' + this.value.ornament.color : '') + ';';
			css += 'border:' + (this.value.ornament.type == 'stroke' ? '2rpx solid ' + this.value.ornament.color : '') + ';';
			return css;
		},
		// 滑块容器的高度
		swiperHeight() {
			var css = '';
			var height = 88 * this.value.pageCount; // 88 = 文字的高度 + 图片的高度

			if (this.value.mode == 'img') height -= 21 * this.value.pageCount; // 21 = 文字的高度
			if (this.value.mode == 'text') height -= 50 * this.value.pageCount; // 21 = 文字的高度
			css += 'height:' + height * 2 + 'rpx';
			return css;
		},
		// 是否显示轮播点
		isIndicatorDots() {
			var bool = true;
			bool = this.value.carousel.type == 'hide' || Math.ceil(this.value.list.length / (this.value.pageCount * this.value.rowCount)) == 1 ? false : true;
			
			return bool;
		}
	},
	methods: {
		redirectTo(link) {
			this.$util.diyRedirectTo(link);
		},
		swiperChange(e){
			this.swiperCurrent = e.detail.current
		}
	}
};
</script>
<style>

/* 固定显示 */
.graphic-nav.fixed >>> .uni-scroll-view-content {
	display: flex;
	flex-wrap: wrap;
}

/* 单行滑动 */
.graphic-nav.singleSlide >>> .uni-scroll-view-content {
	display: flex;
}

.graphic-nav.pageSlide >>> .uni-swiper-dots-horizontal {
	bottom: 0rpx;
}

.graphic-nav.pageSlide.straightLine >>> .uni-swiper-dot {
	width: 30rpx;
	border-radius: 0;
	height: 8rpx;
}

.graphic-nav.pageSlide.circle >>> .uni-swiper-dot {
	width: 14rpx;
	height: 14rpx;
}
 
</style>
<style lang="scss">
	
	
.graphic-nav {
	padding: 16rpx;
	box-sizing: border-box;
	&.singleSlide {
		.graphic-nav-item {
			flex-shrink: 0;
		}
	}

	&.pageSlide {
		position: relative;

		.graphic-nav-wrap {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			height: 100%;
		}
	}

	.graphic-nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 14rpx 0;
		box-sizing: border-box;

		.graphic-text {
			padding-top: 12rpx;
			line-height: 1.5;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			width: 100%;
			text-align: center;

			&.alone {
				padding-top: 0;
			}
		}

		.graphic-img {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100rpx;
			height: 100rpx;
			font-size: 90rpx;
			.tag {
				position: absolute;
				top: -10rpx;
				right: -36rpx;
				color: #fff;
				border-radius: 24rpx;
				border-bottom-left-radius: 0;
				transform: scale(0.8);
				padding: 8rpx 16rpx;
				line-height: 1;
				font-size: 24rpx;
			}

			.icon {
				font-size: 50rpx;
				color: $color-sub;
			}
		}
	}
}

.swiper-dot-box{
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: -20rpx;
	padding-bottom: 8rpx;
	
	.swiper-dot{
		background-color: rgba(0,0,0,.3);
		margin: 8rpx;
		&.active{
			background-color: rgba(0,0,0,1);
		}
		
	}
	&.straightLine{
		.swiper-dot{
			width: 30rpx;
			border-radius: 0;
			height: 8rpx;
		}
	}
	&.circle{
		.swiper-dot{
			width: 15rpx;
			border-radius: 50%;
			height: 15rpx;
		}
	}
	 
}

</style>
