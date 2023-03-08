<template>
	<view class="rich-text-box" :style="richTextWarpCss"><rich-text :nodes="html"></rich-text></view>
</template>

<script>
// 富文本
import htmlParser from '@/common/js/html-parser';
export default {
	name: 'diy-rich-text',
	props: {
		value: {
			type: Object
		}
	},
	data() {
		return {
			html: ''
		};
	},
	computed: {
		richTextWarpCss: function() {
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
	created() {
		this.html = htmlParser(this.value.html);
	},
	mounted() {},
	methods: {}
};
</script>

<style lang="scss">
.rich-text-box {
	padding: $padding;
	box-sizing: border-box;
	height: auto;
	line-height: 1.5;
	white-space: pre-wrap;
	word-break: break-all;
}
</style>
