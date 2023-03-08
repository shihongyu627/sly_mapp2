<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	onLoad(option) {
		if (option.order_id) {
			this.$util.redirectTo('/order/detail', {order_id: option.order_id}, 'redirectTo');
		}
	}
};
</script>

<style lang="scss">
</style>
