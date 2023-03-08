<template>
	<view>
		<view class="weui-switch" :class="{ 'weui-switch-on': checked, 'color-base-border': checked }" @click="change()">
			<view class="bgview" :class="{ 'color-base-bg': checked }"></view>
			<view class="spotview"></view>
		</view>
	</view>
</template>
<script>
export default {
	name: 'nsSwitch',
	props: {
		checked: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		change() {
			this.$emit('change');
		}
	}
};
</script>
<style>
.weui-switch {
	display: block;
	position: relative;
	width: 94rpx;
	height: 45rpx;
	outline: 0;
	border-radius: 30rpx;
	border: 2rpx solid;
	border-color: #dfdfdf;
	transition: background-color 0.1s, border 0.1s;
}

.weui-switch .bgview {
	content: ' ';
	position: absolute;
	top: 0;
	left: 0;
	width: 94rpx;
	height: 45rpx;
	border-radius: 30rpx;
	transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
}
.weui-switch .spotview {
	content: ' ';
	position: absolute;
	top: 2rpx;
	left: 4rpx;
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	background-color: #ffffff;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.4);
	transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
}
.weui-switch-on {
	border-color: #6f6f6f;
}
.weui-switch-on .bgview {
	border-color: #1aad19;
}
.weui-switch-on .spotview {
	transform: translateX(48rpx);
}
</style>
