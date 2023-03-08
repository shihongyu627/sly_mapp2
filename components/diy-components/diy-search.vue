<template>
	<view class="search-box" :style="searchWrapCss">
		<view class="img" v-if="value.searchStyle == 2 && value.iconType == 'img'"><image :src="$util.img(value.imageUrl)" mode="aspectFill"></image></view>
		<diy-icon
			class="icon"
			v-if="value.searchStyle == 2 && value.iconType == 'icon'"
			:icon="value.icon"
			:value="value.style ? value.style : 'null'"
			:style="{ maxWidth: 30 * 2 + 'rpx', maxHeight: 30 * 2 + 'rpx' }"
		></diy-icon>
		<view class="search-content" :style="inputStyle">
			<input
				type="text"
				class="uni-input ns-font-size-base"
				maxlength="50"
				:placeholder="value.title"
				v-model="searchText"
				@confirm="search()"
				disabled="true"
				@click="search()"
				:placeholderStyle="placeholderStyle"
			/>
			<text class="iconfont iconsousuo3" @click="search()" :style="{ color: value.textColor ? value.textColor : 'rgba(0,0,0,0)' }"></text>
		</view>
	</view>
</template>

<script>
// 搜索
export default {
	name: 'diy-search',
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
			searchText: ''
		};
	},
	computed: {
		searchWrapCss() {
			var obj = '';
			obj += 'background-color:' + this.value.componentBgColor + ';';
			if (this.value.borderType == 2) {
				obj += 'border-radius:' + '100rpx;';
			}
			obj += 'text-align:' + this.value.textAlign + ';';
			return obj;
		},
		inputStyle() {
			var obj = '';
			obj += 'background-color:' + this.value.elementBgColor + ';';
			if (this.value.borderType == 2) {
				obj += 'border-radius:' + '40rpx;';
			}
			return obj;
		},
		placeholderStyle() {
			var obj = '';
			if (this.value.textColor) {
				obj += 'color:' + this.value.textColor;
			} else {
				obj += 'color: rgba(0,0,0,0)';
			}
			return obj;
		}
	},
	created() {},
	methods: {
		search() {
			this.$util.redirectTo('/pages_tool/goods/search');
		}
	}
};
</script>

<style lang="scss">
/deep/ .uni-input-placeholder {
	overflow: initial;
}
.search-box {
	position: relative;
	display: flex;
	align-items: center;
	.img {
		width: 170rpx;
		height: 60rpx;
		margin-right: 20rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.icon {
		width: 170rpx;
		height: 60rpx;
		margin-right: 20rpx;
	}
}

.search-content {
	flex: 1;
}

.search-content input {
	box-sizing: border-box;
	display: block;
	height: 77rpx;
	width: 100%;
	padding: 0 20rpx 0 40rpx;
	color: #333333;
}

.search-content .iconfont {
	position: absolute;
	top: 50%;
	right: 20rpx;
	transform: translateY(-50%);
	font-size: 36rpx;
	z-index: 10;
	width: 80rpx;
	text-align: center;
}
</style>
