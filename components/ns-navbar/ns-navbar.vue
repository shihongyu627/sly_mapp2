<template>
	<!-- #ifndef H5 -->
	<view>
		<view class="u-navbar u-navbar-fixed" :style="{ backgroundColor: bgColor, textAlign: globalS.textImgPosLink, paddingTop: navbarHeight + 'px' }">
			<view class="u-navbar-inner" :style="navbarInnerStyle">
				<block v-if="globalS.navStyle == 1">
					<view class="u-navbar-content-title" v-if="globalS.title" @click="toLink(globalS.moreLink.wap_url)">
						<view class="u-title" :style="{ color: globalS.textNavColor, textAlign: globalS.textImgPosLink }">{{ globalS.title }}</view>
					</view>
				</block>
				<block v-if="globalS.navStyle == 2">
					<view class="u-navbar-content-title u-navbar-content-title_img" v-if="globalS.title" @click="toLink(globalS.moreLink.wap_url)">
						<view class="u-title img_text" :style="{ color: globalS.textNavColor, textAlign: 'left' }">
							<view><image :src="$util.img(globalS.topNavImg)" mode="aspectFit"></image></view>
							<view>{{ globalS.title }}</view>
						</view>
					</view>
				</block>
				<block v-if="globalS.navStyle == 3">
					<view class="u-navbar-content-title">
						<view
							class="u-title img"
							@click="toLink(globalS.moreLink.wap_url)"
							:style="{
								color: globalS.textNavColor,
								textAlign: globalS.textImgPosLink
							}"
						>
							<image :src="$util.img(globalS.topNavImg)" mode="aspectFit"></image>
						</view>
						<view
							:style="{ height: menuButtonInfo.height - 2 + 'px', lineHeight: menuButtonInfo.height - 2 + 'px' }"
						>
						<!-- 	<text class="iconfont iconsousuo3"></text>
							请输入商品名称 -->
						</view>
					</view>
				</block>
			</view>
		</view>

		<!-- 解决fixed定位后导航栏塌陷的问题 -->
		<view class="u-navbar-placeholder" :style="{ width: '100%', paddingTop: navbarHeight + 'px' }"></view>
	</view>
	<!-- #endif -->
</template>

<script>
// 获取系统状态栏的高度
let systemInfo = uni.getSystemInfoSync();
let menuButtonInfo = {};
// 如果是小程序，获取右上角胶囊的尺寸信息，避免导航栏右侧内容与胶囊重叠(支付宝小程序非本API，尚未兼容)
// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
menuButtonInfo = uni.getMenuButtonBoundingClientRect();
// #endif
/**
 * navbar 自定义导航栏
 * @property {String} title 导航栏标题，如设置为空字符，将会隐藏标题占位区域
 * @property {String Number} title-width 导航栏标题的最大宽度，内容超出会以省略号隐藏，单位rpx（默认250）
 * @property {String} title-color 标题的颜色（默认#606266）
 * @property {String Number} title-size 导航栏标题字体大小，单位rpx（默认32）
 * @property {Function} custom-back 自定义返回逻辑方法
 * @property {Boolean} is-back 是否显示导航栏左边返回图标和辅助文字（默认true）
 * @property {Boolean} is-fixed 导航栏是否固定在顶部（默认true）
 * @example <u-navbar back-text="返回" title="剑未配妥，出门已是江湖"></u-navbar>
 */
export default {
	name: 'ns-navbar',
	props: {
		globalS: {
			type: Object,
			default() {
				return {};
			}
		},
		// 导航栏标题
		title: {
			type: String,
			default: ''
		},
		// 标题的宽度，如果需要自定义右侧内容，且右侧内容很多时，可能需要减少这个宽度，单位rpx
		titleWidth: {
			type: [String, Number],
			default: '250'
		},
		// 标题的颜色
		titleColor: {
			type: String,
			default: '#606266'
		},
		// 自定义返回逻辑
		customBack: {
			type: Function,
			default: null
		},
		scrollTop: {
			type: [String, Number],
			default: '0'
		}
	},
	data() {
		return {
			menuButtonInfo: menuButtonInfo
		};
	},
	computed: {
		// 导航栏内部盒子的样式
		navbarInnerStyle() {
			let style = '';
			// 导航栏宽度，如果在小程序下，导航栏宽度为胶囊的左边到屏幕左边的距离
			// style += 'height:' + this.navbarHeight + 'px;';
			style += 'height:' + menuButtonInfo.height * 2 + 'rpx;';
			// // 如果是各家小程序，导航栏内部的宽度需要减少右边胶囊的宽度
			// #ifdef MP
			let rightButtonWidth = menuButtonInfo.width ? menuButtonInfo.width * 2 + 'rpx' : '70rpx';
			// style.marginRight = 'calc(' + rightButtonWidth + ' + 30rpx)';
			// style += 'margin-right:calc(' + rightButtonWidth + ' + 30rpx);';
			// style += 'width:calc(100vw - ' + menuButtonInfo.width + ' - 30rpx);';
			// #endif
			return style;
		},
		// 转换字符数值为真正的数值
		navbarHeight() {
			// #ifdef APP-PLUS || H5
			return 44;
			// #endif
			// #ifdef MP
			// 小程序特别处理，让导航栏高度 = 胶囊高度 + 两倍胶囊顶部与状态栏底部的距离之差(相当于同时获得了导航栏底部与胶囊底部的距离)
			// 此方法有缺陷，暂不用(会导致少了几个px)，采用直接固定值的方式
			// return menuButtonInfo.height + (menuButtonInfo.top - this.navbarHeight) * 2;//导航高度
			// let height = systemInfo.platform == 'ios' ? 44 : 48;
			let height = menuButtonInfo.top;
			// height += systemInfo.navbarHeight;
			return height;
			// #endif
		},
		bgColor() {
			var color = '';
			if (!this.globalS.topNavBg) {
				color = this.globalS.topNavColor;
			} else {
				color = 'transparent';
				if (this.scrollTop > 80) {
					color = this.globalS.topNavColor;
				} else {
					color = 'transparent';
				}
			}
			return color;
		}
	},
	created(e) {},
	methods: {
		toLink(val) {
			if (val) this.$util.redirectTo(val);
		},
		goBack() {
			// 如果自定义了点击返回按钮的函数，则执行，否则执行返回逻辑
			if (typeof this.customBack === 'function') {
				this.customBack();
			} else {
				uni.navigateBack();
			}
		}
	}
};
</script>

<style scoped lang="scss">
.u-navbar {
	width: 100%;
	transition: all 0.5s;
}

/* #ifdef MP */
.u-navbar-content-title {
	padding: 0 0 0 30rpx;
}
/* #endif */

/* #ifndef MP */
.u-navbar-content-title {
	padding: 0 200rpx 0 30rpx;
}
/* #endif */

.u-navbar-placeholder {
	height: 80rpx;
}

.u-navbar-fixed {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	z-index: 991;
}

.u-navbar-inner {
	display: flex;
	justify-content: space-between;
	position: relative;
	align-items: center;
	padding-bottom: 20rpx;
	background: #118AF4;
}

.u-navbar-content-title {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	flex: 1;
	position: absolute;
	left: 0;
	right: 0;
	height: 60rpx;
	text-align: center;
	flex-shrink: 0;

	.search {
		flex: 0.4;
		margin-left: 30rpx;
		padding: 0 20rpx;
		height: 50rpx;
		background-color: #fff;
		text-align: left;
		border-radius: 60rpx;
		height: 60rpx;
		line-height: 60rpx;
		border: 1px solid #eeeeee;
		color: rgb(102, 102, 102);

		.iconsousuo3 {
			color: #909399;
			font-size: $font-size-tag;
			margin-right: 10rpx;
		}
	}
}

.u-title {
	line-height: 1;
	font-size: 32rpx;
	// flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-weight: bold;

	&.img {
		height: 60rpx;
		width: 240rpx;
		// max-width: 165px;
		image {
			height: 100%;
			width: 100%;
		}
	}
}

.u-navbar-content-title_img {
	.u-title {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: bold;

		&.img_text {
			display: flex !important;
			align-items: center;
			font-size: 28rpx !important;

			> view {
				height: 60rpx;
				line-height: 60rpx;
				width: 170rpx;
				margin-right: 20rpx;

				text {
					font-size: 24rpx;
				}

				image {
					width: 100%;
					height: 100%;
				}

				&:last-child {
					overflow: hidden; //超出的文本隐藏
					text-overflow: ellipsis; //用省略号显示
					white-space: nowrap; //不换行
					flex: 1;
				}
			}
		}
	}
}
</style>
