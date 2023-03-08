<!-- 回到顶部的按钮 -->
<template>
	<image
		class="mescroll-totop"
		:class="[value ? 'mescroll-totop-in' : 'mescroll-totop-out']"
		:src="$util.img('public/uniapp/common/mescroll-totop.png')"
		mode="widthFix"
		@click="toTopClick"
	/>
</template>

<script>
export default {
	data() {
		return {
			value: true
		};
	},
	methods: {
		toTopClick() {
			this.$emit('toTop'); // 派发点击事件
		}
	}
};
</script>

<style>
/* 回到顶部的按钮 */
.mescroll-totop {
	z-index: 99;
	position: fixed !important; /* 加上important避免编译到H5,在多mescroll中定位失效 */
	right: 46rpx !important;
	bottom: 272rpx !important;
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	opacity: 0;
	transition: opacity 0.5s; /* 过渡 */
	margin-bottom: var(--window-bottom); /* css变量 */
}

/* 适配 iPhoneX */
.mescroll-safe-bottom {
	margin-bottom: calc(var(--window-bottom) + constant(safe-area-inset-bottom)); /* window-bottom + 适配 iPhoneX */
	margin-bottom: calc(var(--window-bottom) + env(safe-area-inset-bottom));
}

/* 显示 -- 淡入 */
.mescroll-totop-in {
	opacity: 1;
}

/* 隐藏 -- 淡出且不接收事件*/
.mescroll-totop-out {
	opacity: 0;
	pointer-events: none;
}
</style>
