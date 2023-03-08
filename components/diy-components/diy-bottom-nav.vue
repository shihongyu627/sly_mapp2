<template>
	<view v-if="tabBarList">
		<view class="tab-bar" :style="{ backgroundColor: tabBarList.backgroundColor }">
			<view class="tabbar-border"></view>
			<view class="item" v-for="(item, index) in tabBarList.list" :key="index" @click="redirectTo(item.link)">
				<view class="bd">
					<block v-if="item.link.wap_url == '/pages/goods/cart'">
						<view class="icon" v-if="tabBarList.type == 1 || tabBarList.type == 2" :animation="cartAnimation">
							<block v-if="verify(item.link)">
								<image v-if="item.selected_icon_type == 'img'" :src="$util.img(item.selectedIconPath)" />
								<diy-icon
									v-if="item.selected_icon_type == 'icon'"
									:icon="item.selectedIconPath"
									:value="item.selected_style ? item.selected_style : null"
								></diy-icon>
							</block>
							<block v-else>
								<image v-if="item.icon_type == 'img'" :src="$util.img(item.iconPath)" />
								<diy-icon v-if="item.icon_type == 'icon'" :icon="item.iconPath" :value="item.style ? item.style : null"></diy-icon>
							</block>
							<view
								class="cartNumberBtn font-size-activity-tag"
								:class="{ max: item.link.wap_url == '/pages/goods/cart' && cartNumber > 99 }"
								:style="{ background: 'var(--price-color)' }"
								v-if="item.link.wap_url == '/pages/goods/cart' && cartNumber > 0"
							>
								{{ cartNumber > 99 ? '99+' : cartNumber }}
							</view>
						</view>
					</block>
					<block v-else>
						<view class="icon" v-if="tabBarList.type == 1 || tabBarList.type == 2">
							<block v-if="verify(item.link)">
								<image v-if="item.selected_icon_type == 'img'" :src="$util.img(item.selectedIconPath)" />
								<diy-icon
									v-if="item.selected_icon_type == 'icon'"
									:icon="item.selectedIconPath"
									:value="item.selected_style ? item.selected_style : null"
								></diy-icon>
							</block>
							<block v-else>
								<image v-if="item.icon_type == 'img'" :src="$util.img(item.iconPath)" />
								<diy-icon v-if="item.icon_type == 'icon'" :icon="item.iconPath" :value="item.style ? item.style : null"></diy-icon>
							</block>
						</view>
					</block>
					<view
						class="label"
						v-if="(tabBarList.type == 1 || tabBarList.type == 3) && tabBarList.theme == 'diy'"
						:style="{ color: verify(item.link) ? tabBarList.textHoverColor : tabBarList.textColor }"
					>
						{{ item.text }}
					</view>
					<view
						class="label"
						v-if="(tabBarList.type == 1 || tabBarList.type == 3) && tabBarList.theme == 'default'"
						:style="{ color: verify(item.link) ? 'var(--base-color)' : '#333333' }"
					>
						{{ item.text }}
					</view>
				</view>
			</view>
		</view>
		<!-- 解决fixed定位后底部导航栏塌陷问题 -->
		<view class="tab-bar-placeholder"></view>
	</view>
</template>

<script>
export default {
	name: 'diy-bottom-nav',
	props: {
		value: {
			type: Object
		},
		name: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			currentRoute: '', //当前页面路径
			jumpFlag: true, //是否可以跳转，防止重复点击
			cartAnimation: {}
		};
	},
	mounted() {
		let currentPage = getCurrentPages()[getCurrentPages().length - 1];
		this.currentRoute = currentPage.route;
		this.$store.dispatch('getCartNumber');
	},
	computed: {
		cartNumber() {
			return this.$store.state.cartNumber;
		},
		cartChange() {
			return this.$store.state.cartChange;
		}
	},
	watch: {
		cartChange: function(nval, oval) {
			if (nval > oval) {
				let animation = uni.createAnimation({
					duration: 200,
					timingFunction: 'ease'
				});
				animation.scale(1.2).step();
				this.cartAnimation = animation.export();
				setTimeout(() => {
					animation.scale(1).step();
					this.cartAnimation = animation.export();
				}, 300);
			}
		}
	},
	methods: {
		redirectTo(link) {
			this.$emit('callback');
			this.$util.diyRedirectTo(link);
		},
		verify(link) {
			if (link == null || link == '' || !link.wap_url) return false;
			if (this.name) {
				var url = this.currentRoute + '?name=' + this.name;
			} else {
				var url = this.currentRoute;
			}

			// 首页特殊处理
			if (link.wap_url == '/pages/index/index' && this.name == 'DIY_VIEW_INDEX') {
				return true;
			} else if (link.wap_url.indexOf(url) != -1) {
				return true;
			}
			return false;
		}
	}
};
</script>

<style lang="scss">
.placeholder {
	height: 112rpx;
	&.bluge {
		height: 180rpx;
	}
}

.safe-area {
	padding-bottom: 0;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}

.tab-bar {
	background-color: #fff;
	box-sizing: border-box;
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	z-index: 998;
	display: flex;
	border-top: 2rpx solid #f5f5f5;
	padding-bottom: 0;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);

	.tabbar-border {
		background-color: rgba(255, 255, 255, 0.329412);
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 2rpx;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.item {
		display: flex;
		align-items: center;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		flex: 1;
		flex-direction: column;
		padding-bottom: 10rpx;
		box-sizing: border-box;

		.bd {
			position: relative;
			height: 100rpx;
			flex-direction: column;
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.icon {
				position: relative;
				display: inline-block;
				margin-top: 10rpx;
				width: 40rpx;
				height: 40rpx;
				font-size: 40rpx;
				image {
					width: 100%;
					height: 100%;
				}
				> view {
					height: inherit;
					display: flex;
					align-items: center;
				}
				.bar-icon {
					font-size: 42rpx;
				}
			}

			.label {
				position: relative;
				text-align: center;
				font-size: 24rpx;
				line-height: 1;
				margin-top: 20rpx;
			}
		}

		&.bulge {
			.bd {
				position: relative;
				height: 100rpx;
				flex-direction: column;
				text-align: center;

				.icon {
					margin-top: -60rpx;
					margin-bottom: 4rpx;
					border-radius: 50%;
					width: 100rpx;
					height: 102rpx;
					padding: 10rpx;
					border-top: 2rpx solid #f5f5f5;
					background-color: #fff;
					box-sizing: border-box;

					image {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}

				.label {
					position: relative;
					text-align: center;
					font-size: 24rpx;
					line-height: 1.6;
					height: 40rpx;
					line-height: 40rpx;
				}
			}
		}

		.cartNumberBtn {
			position: absolute;
			top: -8rpx;
			right: -18rpx;
			width: 24rpx;
			height: 24rpx !important;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			padding: 6rpx;
			border-radius: 50%;
			z-index: 99;
			&.max {
				width: 40rpx;
				border-radius: 24rpx;
				right: -28rpx;
			}
		}
	}
}
.tab-bar-placeholder {
	padding-bottom: calc(constant(safe-area-inset-bottom) + 112rpx);
	padding-bottom: calc(env(safe-area-inset-bottom) + 112rpx);
}
</style>
