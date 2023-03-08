<template>
	<view class="float-btn" 
		:class="{'left_top': value.bottomPosition == 1, 'right_top': value.bottomPosition == 2, 'left_bottom': value.bottomPosition == 3, 'right_bottom': value.bottomPosition == 4}"
		:style="style">
		<block v-for="(item, index) in value.list" :key="index">
			<view class="button-box" @click="$util.diyRedirectTo(item.link)">
				<image :src="$util.img(item.imageUrl)" mode="aspectFit" v-if="!item.iconType || item.iconType == 'img'"></image>
				<diy-icon v-else-if="item.iconType && item.iconType == 'icon'" :icon="item.icon" :value="item.style ? item.style : null"></diy-icon>
			</view>
		</block>
	</view>
</template>

<script>
// 获取系统状态栏的高度
let systemInfo = uni.getSystemInfoSync();
export default {
	name: 'diy-float-btn',
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
			navHeight: 0,
			statusBarHeight: systemInfo.statusBarHeight
		};
	},
	created() {},
	components: {},
	methods: {},
	computed:{
		style(){
			let style = {}, height = 54;
			// #ifdef MP
			height = systemInfo.platform == 'ios' ? 54 : 58;
			// #endif
			switch (this.value.bottomPosition) {
				case 1:
				style.top = (this.navHeight + this.statusBarHeight + parseInt(value.btnBottom)) * 2 + 'rpx !important'
				break;
				case 2:
				style.top = (this.navHeight + this.statusBarHeight + parseInt(value.btnBottom)) * 2 + 'rpx !important'
				break;
				case 3:
				style.bottom = (100 + parseInt(value.btnBottom)) * 2 + 'rpx !important'
				break;
				case 4:
				style.bottom = (100 + parseInt(value.btnBottom)) * 2 + 'rpx !important'
				break;
			}
			return this.$util.objToStyle(style);
		}
	}
};
</script>

<style lang="scss">
.float-btn {
	position: fixed;
	bottom: 20%;
	right: 40rpx;
	z-index: 999;
	&.right_top {
		top: 100rpx;
		right: 30rpx;
	}
	&.left_top {
		top: 100rpx;
		left: 30rpx;
	}
	&.right_bottom {
		bottom: 200rpx;
		right: 30rpx;
		padding-bottom: constant(safe-area-inset-bottom); /*兼容 IOS<11.2*/
		padding-bottom: env(safe-area-inset-bottom); /*兼容 IOS>11.2*/
	}
	&.left_bottom {
		bottom: 200rpx;
		left: 30rpx;
		padding-bottom: constant(safe-area-inset-bottom); /*兼容 IOS<11.2*/
		padding-bottom: env(safe-area-inset-bottom); /*兼容 IOS>11.2*/
	}
	.button-box {
		margin-bottom: 20rpx;
		width: 80rpx;
		height: 80rpx;
		font-size: 80rpx;
		&:last-child {
			margin-bottom: 0;
		}
		image {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
