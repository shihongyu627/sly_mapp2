<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<view class="iconfont iconshang navigate-back" @click="navigateBack"></view>
		<web-view :src="src"></web-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			src: ''
		};
	},
	onLoad(option) {
		this.src = decodeURIComponent(option.src);
	},
	methods: {
		navigateBack() {
			uni.navigateBack({
				delta: 1
			});
		}
	}
};
</script>

<style lang="scss">
.navigate-back {
	position: absolute;
	top: 34rpx;
	left: 34rpx;
	z-index: 5;
	font-size: $font-size-toolbar;
}
</style>
