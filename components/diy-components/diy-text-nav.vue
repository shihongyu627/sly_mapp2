<template>
	<view :style="{ fontSize: value.fontSize * 2 + 'rpx' }">
		<view
			v-if="value.arrangement == 'vertical'"
			class="diy-text-nav"
			:style="{ fontSize: value.fontSize * 2 + 'rpx', background: value.backgroundColor, textAlign: value.textAlign }"
			@click="redirectTo(value.list[0].link)"
		>
			<view class="single" :style="{ fontSize: value.fontSize * 2 + 'rpx', color: value.textColor ? value.textColor : 'rgba(0,0,0,0)' }">
				{{ value.list[0].text }}
				<text class="subhead">{{ value.list[0].secondText }}</text>
				<!-- <text :style="{ fontSize: value.fontSize * 2 + 'rpx'}" class="iconfont iconright font-size-goods-tag"></text> -->
			</view>
		</view>
		<view v-else class="diy-text-nav" :style="{ background: value.backgroundColor }">
			<scroll-view scroll-x>
				<view
					v-for="(item, index) in value.list"
					:key="index"
					class="item"
					@click="redirectTo(item.link)"
					:style="{ textAlign: value.textAlign, fontSize: value.fontSize * 2 + 'rpx', color: value.textColor ? value.textColor : 'rgba(0,0,0,0)' }"
				>
					{{ item.text }}
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
// 文本导航
export default {
	name: 'diy-text-nav',
	props: {
		value: {
			type: Object
		}
	},
	data() {
		return {};
	},
	methods: {
		redirectTo(link) {
			this.$util.diyRedirectTo(link);
		}
	}
};
</script>

<style>
.control-text-navigation i {
	float: right;
	margin: 6rpx 20rpx 0 0;
}

.diy-text-nav {
	padding: 20rpx;
}

.diy-text-nav scroll-view {
	width: 100%;
	flex-direction: row;
	white-space: nowrap;
}

.diy-text-nav scroll-view .item {
	display: inline-block;
	margin-left: 16rpx;
	position: relative;
	min-width: 25%;
	text-overflow: ellipsis;
	text-align: center;
}

.diy-text-nav .single {
	position: relative;
}

.diy-text-nav .single .subhead {
	font-size: 24rpx;
	color: #777;
	margin-left: 20rpx;
}

.diy-text-nav .iconfont {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	right: 0;
}
</style>
<style scoped>
.uni-view {
	font-size: 0;
}
.diy-text-nav >>> .uni-scroll-view::-webkit-scrollbar {
	display: none;
}
</style>
