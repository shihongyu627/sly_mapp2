<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="page">
		<view class="closeBox">
			<image :src="$util.img('public/uniapp/giftcard/empty_card.png')" mode="widthFix"></image>
			<text class="close-title">您查看的礼品卡不存在</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	onShow() {},
	methods: {}
};
</script>

<style lang="scss">
.page{
	height: 100vh;
	overflow: hidden;
}

.closeBox {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 260rpx;
}
image {
	width: 400rpx;
}
.close-title {
	font-size: $font-size-base;
	color: $color-tip;
	margin-top: 55rpx;
	margin: 55rpx;
	letter-spacing: 4rpx;
}
</style>
