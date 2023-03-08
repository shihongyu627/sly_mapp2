<template>
	<view :style="horzBlankGaugeWrap"></view>
</template>

<script>
// 辅助空白
export default {
	name: 'diy-horz-blank',
	props: {
		value: {
			type: Object
		}
	},
	data() {
		return {};
	},
	computed: {
		horzBlankGaugeWrap: function() {
			var obj = '';
			obj += 'background-color:' + this.value.componentBgColor + ';';
			if (this.value.componentAngle == 'round') {
				obj += 'border-top-left-radius:' + this.value.topAroundRadius * 2 + 'rpx;';
				obj += 'border-top-right-radius:' + this.value.topAroundRadius * 2 + 'rpx;';
				obj += 'border-bottom-left-radius:' + this.value.bottomAroundRadius * 2 + 'rpx;';
				obj += 'border-bottom-right-radius:' + this.value.bottomAroundRadius * 2 + 'rpx;';
			}
			obj += 'height:' + this.value.height * 2 + 'rpx';
			return obj;
		}
	},
	created() {},
	methods: {}
};
</script>

<style></style>
