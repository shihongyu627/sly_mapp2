<template>
	<view class="diy-text" @click="$util.diyRedirectTo(value.link)" :style="warpCss">
		<view :class="value.style == 'style-8' ? 'title2' : 'title'" :style="{ fontSize: value.fontSize * 2 + 'rpx', color: value.textColor }">
			<block v-if="value.style == 'style-1'" style="height: 40rpx; line-height: 40rpx;">
				<view class="text-left" :style="{ color: value.textColor}"><text>───</text></view>
				<text>{{ value.text }}</text>
				<view class="text-right" :style="{ color: value.textColor}"><text>───</text></view>
			</block>
			<block v-else-if="value.style == 'style-2'">
				<view class="style2">
					<text :style="{ color: value.textColor, fontSize: value.fontSize * 2 + 'rpx' }">{{ value.text }}</text>
					<view class="xian" :style="{ background: value.textColor }">
						<view class="line-triangle" :style="{ borderColor: value.textColor }"></view>
					</view>
				</view>
			</block>
			<block v-else-if="value.style == 'style-3'">
				<view class="style3">
					<text :style="{ color: value.textColor, fontSize: value.fontSize * 2 + 'rpx' }">{{ value.text }}</text>
					<view class="inner-line" :style="{ background: value.textColor }"><view class="line-short" :style="{ background: value.textColor }"></view></view>
				</view>
			</block>
			<block v-else-if="value.style == 'style-4'">
				<view class="style4">
					<text :style="{ color: value.textColor, fontSize: value.fontSize * 2 + 'rpx' }">{{ value.text }}</text>
					<view class="line-box">
						<view class="line-left" :style="{ background: value.textColor }"></view>
						<view class="line-center" :style="{ borderColor: value.textColor }"></view>
						<view class="line-right" :style="{ background: value.textColor }"></view>
					</view>
				</view>
			</block>
			<block v-else-if="value.style == 'style-5'">
				<view class="style5">
					<view class="style5-box" :style="{ color: value.textColor }">
						<text class="style5-title" :style="{ color: value.textColor, fontSize: value.fontSize * 2 + 'rpx' }">{{ value.text }}</text>
						<view class="line-left" :style="{ background: value.textColor }"></view>
						<view class="line-right" :style="{ background: value.textColor }"></view>
					</view>
				</view>
			</block>
			<block v-else-if="value.style == 'style-6'">
				<view class="style6">
					<view class="style6-box" :style="{ color: value.textColor }">
						<text class="style6-title" :style="{ color: value.textColor, fontSize: value.fontSize * 2 + 'rpx' }">{{ value.text }}</text>
						<view class="style6-wrap" :style="{ color: value.textColor }"></view>
					</view>
				</view>
			</block>
			<block v-else-if="value.style == 'style-7'">
				<view class="style7">
					<view class="style7-box" :style="{ color: value.textColor }">
						<text class="style7-title" :style="{ background: value.textColor, fontSize: value.fontSize * 2 + 'rpx' }">{{ value.text }}</text>
						<view class="style7-wrap" :style="{ color: value.textColor }"></view>
					</view>
				</view>
			</block>
			<block v-else-if="value.style == 'style-8'">
				<view class="style8">
					<view class="style8-box" :style="{ color: value.textColor }">
						<text class="style8-title" :style="{ color: value.textColor, fontSize: value.fontSize * 2 + 'rpx' }">{{ value.text }}</text>
						<view class="style8-wrap" :style="{ background: value.textColor, height: value.fontSize * 2 + 'rpx' }"></view>
					</view>
				</view>
			</block>
			<block v-else-if="value.style == 'style-9'">
				<view class="style9">
					<view class="style9-box">
						<view class="style9-center">
							<view class="left-img"><image :src="$util.img('public/uniapp/diy/style9-1.png')"></image></view>
							<text
								class="style9-title"
								:style="{ fontSize: value.fontSize * 2 + 'rpx', color: value.textColor, fontWeight: value.fontWeight }"
							>
								{{ value.text }}
							</text>
							<view class="right-img"><image :src="$util.img('public/uniapp/diy/style9-2.png')"></image></view>
							<view
								class="style9-more"
								v-if="value.more.isShow"
								:style="{ color: value.more.color }"
								@click.stop="$util.diyRedirectTo(value.more.link)"
							>
								{{ value.more.text }}
								<view class="iconfont iconright" :style="{ color: value.more.color }"></view>
							</view>
						</view>
						<text class="sub-title" :style="{ color: value.subTitle.color }">{{ value.subTitle.text }}</text>
					</view>
				</view>
			</block>
			<block v-else-if="value.style == 'style-10'">
				<view class="style10">
					<view class="style10-box">
						<view class="style10-center">
							<view class="left-img"><image :src="$util.img('public/uniapp/diy/style10-1.png')"></image></view>

							<text
								class="style10-title"
								v-if="$util.img('public/uniapp/diy/style10-3.png')"
								:style="{
									backgroundImage: 'url(' + $util.img('public/uniapp/diy/style10-3.png') + ')',
									backgroundSize: 100 + '%',
									backgroundPositionY: 93 + '%',
									backgroundRepeat: 'no-repeat',
									fontSize: value.fontSize * 2 + 'rpx',
									color: value.textColor,
									fontWeight: value.fontWeight
								}"
							>
								{{ value.text }}
							</text>
							<view class="right-img"><image :src="$util.img('public/uniapp/diy/style10-2.png')"></image></view>
							<view class="style10-more" v-if="value.more.isShow" :style="{ color: value.more.color }" @click.stop="$util.diyRedirectTo(value.more.link)">
								{{ value.more.text }}
								<view class="iconfont iconright" :style="{ color: value.more.color }"></view>
							</view>
						</view>
						<text class="sub-title" :style="{ color: value.subTitle.color }">{{ value.subTitle.text }}</text>
					</view>
				</view>
			</block>
			<block v-else-if="value.style == 'style-11'">
				<view class="style11" :style="{ backgroundColor: value.backgroundColor }">
					<view class="style11-box">
						<view class="style11-conter">
							<view class="style11-conter-box">
								<view class="left">
									<view
										class="style11-title"
										:style="{
											fontSize: value.fontSize * 2 + 'rpx',
											color: value.textColor,
											fontWeight: value.fontWeight
										}"
									>
										{{ value.text }}
									</view>
									<view class="style11-sub" :style="{ color: value.subTitle.color }">{{ value.subTitle.text }}</view>
								</view>
								<view class="style11-more" v-if="value.more.isShow" :style="{ color: value.more.color }" @click.stop="$util.diyRedirectTo(value.more.link)">
									{{ value.more.text }}
									<view class="iconfont iconright" :style="{ color: value.more.color }"></view>
								</view>

								<image class="center-img" :src="$util.img('public/uniapp/diy/style11-1.png')" mode="widthFix"></image>

								<image class="right-img" :src="$util.img('public/uniapp/diy/style11-2.png')" mode="widthFix"></image>
							</view>
						</view>
					</view>
				</view>
			</block>
			<view class="style12" v-if="value.style == 'style-12'">
				<img class='style12-icon' v-if="value.subTitle.text=='热门好物清单'||value.subTitle.text=='超值爆品低价来袭'" src="@/common/img/fire.png" alt=""
					mode="aspectFill" />
					<img class='style12-icon' v-if="value.subTitle.text=='百万用户效果见证'" src="@/common/img/star.png" alt=""
						mode="aspectFill" />
				<view
					class="style12-title"
					:style="{
						fontSize: value.fontSize * 2 + 'rpx',
						color: value.textColor,
						fontWeight: value.fontWeight
					}"
				>
					{{ value.text }}
				</view>
				<text class="style12-sub-title" :style="{ color: value.subTitle.color }">{{ value.subTitle.text }}</text>
				<view class="style12-more" v-if="value.more.isShow" :style="{ color: value.more.color }" @click.stop="$util.diyRedirectTo(value.more.link)">
					<text>{{ value.more.text }}</text>
					<view class="iconfont iconright" :style="{ color: value.more.color }"></view>
				</view>
			</view>
			<view class="style13" v-else-if="value.style == 'style-13'">
				<image class="left-img" :src="$util.img('public/uniapp/diy/style13-1.png')" mode="widthFix"></image>
				<view
					class="style13-title"
					:style="{
						fontSize: value.fontSize * 2 + 'rpx',
						color: value.textColor,
						fontWeight: value.fontWeight
					}"
				>
					{{ value.text }}
				</view>
				<image class="right-img" :src="$util.img('public/uniapp/diy/style13-1.png')" mode="widthFix"></image>
			</view>
			<view class="style14" v-else-if="value.style == 'style-14'">
				<view class="title-wrap">
					<view class="text">
						<text :style="{ fontSize: value.fontSize * 2 + 'rpx', color: value.textColor, fontWeight: value.fontWeight }">
							{{ value.text }}
						</text>
						<text class="zone" :style="{ fontSize: value.fontSize * 2 + 'rpx', fontWeight: value.fontWeight }">专区</text>
					</view>
					<text class="iconfont icondanxuan-xuanzhong" :style="{ color: value.textColor, fontWeight: value.fontWeight }"></text>
					<text class="iconfont icondanxuan-xuanzhong" :style="{ color: value.textColor, fontWeight: value.fontWeight }"></text>
					<text class="iconfont icondanxuan-xuanzhong" :style="{ color: value.textColor, fontWeight: value.fontWeight }"></text>
					<view
						class="sub-title"
						v-show="value.subTitle.text"
						:style="{ fontSize: value.subTitle.fontSize * 2 + 'rpx', color: value.subTitle.color }"
					>
						{{ value.subTitle.text }}
					</view>
				</view>
				<view v-show="value.more.isShow == 1" class="more" :style="{ color: value.more.color }">
					<text>{{ value.more.text }}</text>
					<text class="iconfont iconright"></text>
				</view>
			</view>

			<!-- 图十五 -->
			<view class="style15" v-else-if="value.style == 'style-15'">
				<view class="title-wrap">
					<view class="ornament" style="margin-right: 40rpx;">
						<text class="line" :style="{ color: value.textColor, fontWeight: value.fontWeight }"></text>
						<text class="line" :style="{ color: value.textColor, fontWeight: value.fontWeight }"></text>
						<text class="my">
							<text class="yuan" :style="{ backgroundColor: value.textColor, fontWeight: value.fontWeight }"></text>
							<text class="vertical" :style="{ color: value.textColor, fontWeight: value.fontWeight }"></text>
						</text>
					</view>
					<text :style="{ fontSize: value.fontSize * 2 + 'rpx', color: value.textColor, fontWeight: value.fontWeight }">
						{{ value.text }}
					</text>
					<view class="ornament" style="margin-left: 40rpx;">
						<text class="line" :style="{ color: value.textColor, fontWeight: value.fontWeight }"></text>
						<text class="line" :style="{ color: value.textColor, fontWeight: value.fontWeight }"></text>
						<text class="my">
							<text class="yuan" :style="{ backgroundColor: value.textColor, fontWeight: value.fontWeight }"></text>
							<text class="vertical" :style="{ color: value.textColor, fontWeight: value.fontWeight }"></text>
						</text>
					</view>
				</view>
				<view
					class="sub-title"
					v-show="value.subTitle.text"
					:style="{ fontSize: value.subTitle.fontSize * 2 + 'rpx', color: value.subTitle.color }"
				>
					{{ value.subTitle.text }}
				</view>
			</view>

			<!-- 图十六 -->
			<view class="style16" v-if="value.style == 'style-16'">
				<view
					class="style16-title"
					:style="{
						fontSize: value.fontSize * 2 + 'rpx',
						color: value.textColor,
						fontWeight: value.fontWeight
					}"
				>
					{{ value.text }}
				</view>
				<view class="style16-sub-title" v-show="value.subTitle.text" :style="{ color: value.subTitle.color, backgroundColor: value.subTitle.bgColor }">
					<text :class="['js-icon', value.subTitle.icon]" :style="{ backgroundColor: value.subTitle.bgColor }"></text>
					<text :style="{ fontWeight: value.subTitle.fontWeight }">{{ value.subTitle.text }}</text>
				</view>
				<view class="style16-more" v-if="value.more.isShow" :style="{ color: value.more.color }" @click.stop="$util.diyRedirectTo(value.more.link)">
					<text>{{ value.more.text }}</text>
					<view class="iconfont iconright" :style="{ color: value.more.color }"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// 标题
export default {
	name: 'diy-text',
	props: {
		value: {
			type: Object
		}
	},
	data() {
		return {};
	},
	created() {},
	computed: {
		warpCss() {
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
	methods: {}
};
</script>

<style lang="scss">
.diy-text {
	padding: 0;
	display: flex;
	justify-content: center;
}

.diy-text .title {
	margin: 0;
	color: #333;
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: center;
}

.diy-text .title2 {
	margin: 0;
	color: #333;
	display: flex;
	align-items: center;
	width: 100%;
}

.diy-text .title > text {
	padding: 0 15rpx;
}

.left {
	transform: translateY(0%);
	width: 30rpx;
	height: 24rpx;
}

.right {
	transform: translateY(0%);
	width: 30rpx;
	height: 24rpx;
}

.style2 {
	width: 100%;
	text-align: center;

	.xian {
		width: 100%;
		height: 2rpx;
		vertical-align: top;
		position: relative;
	}

	.line-triangle {
		background: transparent !important;
		position: absolute;
		border: 12rpx solid #000;
		border-top-color: transparent !important;
		border-left-color: transparent !important;
		left: 50%;
		bottom: -10rpx;
		margin-left: -12rpx;
		transform: rotate(45deg);
	}
}

.style3 {
	width: 100%;
	text-align: center;

	.inner-line {
		width: 100%;
		height: 2rpx;
		vertical-align: top;
		position: relative;
	}

	.line-short {
		width: 324rpx;
		height: 6rpx;
		position: absolute;
		bottom: 0;
		left: 50%;
		margin-left: -162rpx;
	}
}

.style4 {
	text-align: center;
	width: 100%;

	.line-box {
		height: 5rpx;
		position: relative;
		text-align: center;
		margin-top: 5rpx;
		width: 100%;

		.line-left {
			display: inline-block;
			position: absolute;
			top: 8rpx;
			left: 0;
			bottom: 0;
			width: calc((100% - 44rpx) / 2);
			height: 2rpx;
		}

		.line-center {
			width: 12rpx;
			height: 12rpx;
			border: 2rpx solid;
			display: inline-block;
			-webkit-transform: rotate(45deg);
			transform: rotate(45deg);
			position: absolute;
			top: 0;
			left: 50%;
			bottom: 0;
			margin-left: -6rpx;
		}

		.line-right {
			display: inline-block;
			position: absolute;
			top: 8rpx;
			bottom: 0;
			right: 0;
			width: calc((100% - 44rpx) / 2);
			height: 2rpx;
		}
	}
}

.style5 {
	text-align: center;
	position: relative;

	.style5-box {
		display: inline-block;
		padding: 10rpx !important;
		border: 1rpx solid;
		position: relative;

		.style5-title {
			display: inline-block;
			padding: 10rpx 30rpx;
			border: 1rpx solid;
			line-height: 1;
		}

		.line-left {
			height: 10rpx;
			position: absolute;
			width: 80rpx;
			top: 50%;
			margin-top: -4rpx;
			left: 0;
			margin-left: -60rpx;
		}

		.line-right {
			height: 10rpx;
			position: absolute;
			width: 80rpx;
			top: 50%;
			margin-top: -4rpx;
			right: 0;
			margin-right: -60rpx;
		}
	}
}

.style6 {
	text-align: center;
	position: relative;

	.style6-box {
		display: inline-block;
		position: relative;

		.style6-title {
			display: inline-block;
			padding: 6rpx 50rpx;
			border: 1rpx solid;
			position: relative;
			z-index: 2;
			padding-bottom: 6rpx;
			background: rgb(255, 255, 255);
			line-height: 1.5;
		}

		.style6-wrap {
			position: absolute;
			display: inline-block;
			width: 100%;
			top: 10rpx;
			right: 4rpx;
			bottom: -10rpx;
			left: 10rpx;
			border: 1rpx solid;
			z-index: 0;
			box-sizing: border-box;
		}
	}
}

.style7 {
	text-align: center;
	position: relative;

	.style7-box {
		display: inline-block;
		position: relative;

		.style7-title {
			display: inline-block;
			padding: 0rpx 50rpx;
			position: relative;
			z-index: 2;
			padding-bottom: 6rpx;
			color: rgb(255, 255, 255);
			line-height: 1.5;
		}

		.style7-wrap {
			width: 100%;
			box-sizing: border-box;
			position: absolute;
			top: 10rpx;
			right: 4rpx;
			bottom: -10rpx;
			left: 10rpx;
			border: 1rpx solid;
			z-index: 0;
		}
	}
}

.style8 {
	position: relative;
	text-align: left;

	.style8-box {
		text-align: left !important;
		.style8-title{
			margin-left: 20rpx;
		}
		.style8-wrap {
			height: 100%;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			left: 0;
			width: 4rpx;
		}
	}
}

.style9 {
	width: 100%;

	.style9-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;

		.style9-center {
			display: flex;
			justify-content: center;
			align-items: center;
			width: calc(100% - 264rpx);
			position: relative;

			text {
				max-width: 100%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			.left-img {
				width: 40rpx;
				height: 40rpx;
				text-align: center;
				flex-shrink: 0;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.right-img {
				width: 40rpx;
				height: 40rpx;
				text-align: center;
				flex-shrink: 0;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.style9-more {
				display: flex;
				position: absolute;
				right: -140rpx;
				/* #ifdef MP-WEIXIN */
				right: -120rpx;
				/* #endif */
				top: 14rpx;
				line-height: 1;
				align-items: center;

				.iconfont {
					line-height: 1;
				}
			}

			.sub-title {
				line-height: 1;
			}
		}
	}
}

.style10 {
	width: 100%;

	.style10-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;

		.style10-center {
			display: flex;
			justify-content: center;
			align-items: center;
			width: calc(100% - 264rpx);
			position: relative;

			text {
				max-width: 100%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				padding-bottom: 8rpx;
				z-index: 99;
			}

			.left-img {
				padding-bottom: 13rpx;
				width: 40rpx;
				height: 40rpx;
				text-align: center;
				flex-shrink: 0;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.center-img {
				width: 198rpx;
				height: 18rpx;
				text-align: center;
				flex-shrink: 0;
				position: absolute;
				bottom: 26rpx;
				z-index: 5;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.right-img {
				padding-bottom: 13rpx;
				width: 40rpx;
				height: 40rpx;
				text-align: center;
				flex-shrink: 0;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.style10-more {
				display: flex;
				position: absolute;
				right: -140rpx;
				/* #ifdef MP-WEIXIN */
				right: -120rpx;
				/* #endif */
				top: 14rpx;
				line-height: 1;
				align-items: center;

				.iconfont {
					line-height: 1;
				}
			}

			.sub-title {
				line-height: 1;
			}
		}
	}
}

.style11 {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;

	.style11-box {
		width: 100%;
		margin: 10rpx 0;

		.style11-conter {
			.style11-conter-box {
				display: flex;
				justify-content: space-between;
				align-items: center;
				position: relative;

				.left {
					display: flex;
					width: 70%;
					flex-direction: column;
					justify-content: space-between;
					height: 100%;
					margin: 15rpx 0;
					padding-left: 34rpx;
					z-index: 9;

					.style11-title {
						width: 100%;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}

					.style11-sub {
						letter-spacing: 14rpx;
						width: 100%;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}

				.style11-more {
					display: flex;
					margin-right: 20rpx;
				}
			}

			.center-img {
				width: 61rpx;
				position: absolute;
				bottom: -26rpx;
				left: 16rpx;
				z-index: 0;
			}

			.right-img {
				width: 35rpx;
				position: absolute;
				top: -14rpx;
				left: 172rpx;
				z-index: 0;
			}
		}
	}
}

.style12 {
	display: flex;
	align-items: center;
	width: 100%;
	padding: 20rpx;
	.style12-icon{
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
	}
	.style12-title {
		text-align: left;
		max-width: 200rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.style12-sub-title {
		text-align: left;
		max-width: 300rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.style12-more {
		display: flex;
		align-items: center;
		margin-left: auto;

		text {
			padding: 0;
			max-width: 160rpx;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
	}
}

.style13 {
	display: flex;
	align-items: center;
	justify-content: center;

	.style13-title {
		max-width: 420rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		margin: 0 10rpx;
	}

	image {
		height: 50rpx;
		width: 76rpx;
	}

	.right-img {
		transform: rotateY(180deg);
	}
}
.style14 {
	display: flex;
	justify-content: space-between;
	text-align: initial;
	align-items: center;
	flex: 1;
	padding: 0 20rpx;
	text {
		padding: 0 !important;
	}
	.title-wrap {
		.text {
			display: inline-block;
		}
		.iconfont {
			font-size: 24rpx;
			&:nth-of-type(1) {
				margin-left: 20rpx;
			}
			&:nth-of-type(2) {
				opacity: 0.6;
			}
			&:nth-of-type(3) {
				opacity: 0.4;
			}
		}
		.sub-title {
			opacity: 0.6;
		}
		.more {
			text:first-child {
				font-size: 28rpx;
			}
		}
	}
}
.style15 {
	flex: 1;
	text {
		padding: 0 !important;
		line-height: 1;
	}
	.title-wrap {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.ornament {
		display: flex;
		align-items: flex-end;
		.line {
			border-left: 8rpx solid;
			transform: rotate(40deg);
			border-radius: 40rpx;
			height: 28rpx;
			display: block;
			margin-right: 12rpx;
			&:nth-of-type(2) {
				height: 40rpx;
				margin-right: 10rpx;
				position: relative;
				top: 4rpx;
			}
		}
		.my {
			transform: rotate(40deg);
			line-height: 0;
			position: relative;
			top: 4rpx;
			.yuan {
				font-size: 100rpx;
				border-radius: 50%;
				width: 8rpx;
				height: 8rpx;
				display: block;
			}
			.vertical {
				border-left: 8rpx solid;
				height: 20rpx;
				margin-top: 4rpx;
				display: inline-block;
				border-radius: 40rpx;
			}
		}
	}
	.sub-title {
		opacity: 0.6;
		text-align: center;
	}
}
.style16 {
	display: flex;
	align-items: center;
	width: 100%;
	padding: 20rpx;
	.style16-more {
		display: flex;
		align-items: center;
		margin-left: auto;
		& > text {
			max-width: 200rpx;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
	}
	.style16-title {
		text-align: left;
		max-width: 200rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.style16-sub-title {
		margin-left: 20rpx;
		text-align: left;
		max-width: 300rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		border-radius: 34rpx;
		background-image: radial-gradient(transparent 60%, #fff);
		height: 50rpx;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		position: relative;
		&> .js-icon {
			padding: 8rpx;
			background-image: radial-gradient(transparent 30%, #fff);
			border-radius: 50%;
			margin-left: -20rpx;
			margin-right: 6rpx;
			font-size: 28rpx;
			line-height: 1;
		}
	}
}
</style>
