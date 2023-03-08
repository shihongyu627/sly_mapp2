<template>
	<view>
		<view class="action-buttom-wrap disabled" v-if="disabled" @click="clickEvent">{{ disabledText }}</view>
		<view class="action-buttom-wrap" :class="[backgroundClass, textPrice ? 'has-second' : '', background ? 'color-join-cart' : 'color-base-bg']" :style="{background:backgroundColor+'!important', 'color':textColor ? textColor : '#ffffff'}" v-else @click="clickEvent">
			<text class="price-font">{{ textPrice }}</text>
			<text>{{ text }}</text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'ns-goods-action-button',
	props: {
		// 商品底部按钮文字
		text: {
			type: String,
			default: ''
		},
		// 商品底部按钮价格文字
		textPrice: {
			type: String,
			default: ''
		},
		// 背景色
		background: {
			type: String,
			default: ''
		},
		// 背景色样式
		backgroundClass: {
			type: String,
			default: ''
		},
		// 
		backgroundColor: {
			type: String,
			default: ''
		},
		// 是否禁用
		disabled: {
			type: Boolean,
			default: false
		},
		// 禁用文字提示
		disabledText: {
			type: String,
			default: ''
		},
		// 文字颜色
		textColor: {
			type: String,
			default: ''
		},
	},
	computed: {
	},
	methods: {
		clickEvent() {
			this.$emit('click');
		}
	}
};
</script>

<style lang="scss">

.action-buttom-wrap {
	flex: 1;
	height: 70rpx;
	font-weight: 600;
	font-size: 30rpx;
	line-height: 70rpx;
	border: none;
	color: #fff;
	text-align: center;
	border-radius: 70rpx;
}

.action-buttom-wrap.has-second {
	line-height: 50rpx;
}

.action-buttom-wrap.has-second text {
	display: block;
	line-height: 1.2;
}

.action-buttom-wrap:active {
	opacity: 0.8;
}

.action-buttom-wrap.disabled {
	background: $color-disabled;
}
</style>
