<template>
	<view :data-theme="themeStyle">
		<view class="point-header">
			<view class="header-title">
				累计总收益
			</view>
			<view class="header-num">
				<text class="point">{{total_point}}</text> 个柚币
			</view>
		</view>
		<mescroll-uni @getData="getData" class="member-point" ref="mescroll" top="120rpx">
			<view slot="list">
				<block v-if="dataList.length">
					<view class="detailed-wrap">
						<view class="cont">
							<view class="detailed-item" v-for="(item, index) in dataList" :key="index">
								<view class="info">
									<view class="event">{{ item.recommend_name }}</view>
									<view class="time-box">
										<text
											class="time color-tip">{{ $util.timeStampTurnTime(item.create_time) }}</text>
									</view>
								</view>
								<view class="num ">{{ parseInt(item.point) }}</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<view class="cart-empty">
						<ns-empty :isIndex="false"></ns-empty>
					</view>
				</block>
			</view>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>

	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		data() {
			return {
				dataList: [],
				pointIndex: 0,
				total_point: 0
			};
		},
		components: {},
		mixins: [globalConfig],
		onShow() {
			this.$langConfig.refresh();
		},
		onLoad() {
			// this.getPointType()
		},
		computed: {},
		methods: {
			goHref(url) {
				this.$util.redirectTo(url);
			},
			//获得列表数据
			getData(mescroll) {
				this.$api.sendRequest({
					url: '/memberrecommend/api/memberrecommend/lists',
					data: {
						page_size: mescroll.size,
						page: mescroll.num,
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0) {
							newArr = res.data.list;
							this.total_point = res.data.total_point || 0
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
						this.dataList = this.dataList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	/deep/ .fixed {
		position: relative;
		top: 0;

	}

	.tab {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 10;
		display: flex;
		justify-content: space-between;
		height: 80rpx;
		background-color: $color-bg;

		view {
			flex: 1;
			text-align: center;
			line-height: 80rpx;

			text {
				margin-left: 10rpx;
				font-size: $font-size-base;
			}
		}
	}

	.point-header {
		width: 100%;
		height: 110rpx;
		background: #fff;
		opacity: 1;
		border-radius: 0px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding-left: 40rpx;
		padding-right: 40rpx;
		box-sizing: border-box;
		position: fixed;
		top: 0;
		z-index: 99;
	}

	.point-tabBox {
		width: 100%;
		height: 44px;
		background: #fff;
		opacity: 1;
		border-radius: 0px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		box-sizing: border-box;
		position: fixed;
		top: 88px;
		z-index: 99;
	}

	.point-item {
		font-family: PingFang SC;
		font-size: 14px;
		font-weight: 400;
		color: #000000;
		opacity: 1;
		height: 44px;
		line-height: 44px;
	}

	.point-items {
		border-bottom: 2px solid #1189F4;
		font-weight: bold;
		color: #1189F4;
	}

	.header-num {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #000000;
		opacity: 0.8;
	}

	.point {
		font-size: 40rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
	}

	.header-title {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #000000;
		opacity: 0.8;
	}

	.cart-empty {
		margin-top: 104px !important;
	}

	.account-box {
		width: 100%;
		box-sizing: border-box;
		position: relative;

		>image {
			width: 100%;
			position: absolute;
			top: 0;
			z-index: 1;
		}

		.accout-btn {
			display: flex;
			margin-top: 30rpx;

			view {
				width: 170rpx;
				height: 44rpx;
				border-radius: 22rpx;
				border: 1px solid rgba(255, 255, 255, 0.4);
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 44rpx;
			}
		}

		.account-text {
			position: relative;
			padding: 50rpx 30rpx 34rpx 30rpx;
			display: flex;
			align-items: center;
			z-index: 9;

			.headimg {
				width: 100rpx;
				height: 100rpx;
				background: #fff;
				border: 2px solid #fff;
				border-radius: 50%;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.point {
				margin-left: 30rpx;
				color: #fff;
				font-size: 36rpx;
			}

			.iconjifen1 {
				color: #fff;
				margin-left: 8rpx;
			}
		}
	}

	.detailed-wrap {
		background: #fff;
		position: relative;
		z-index: 9;
		width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		margin-top: 10px;
		overflow: hidden;

		.head {
			display: flex;
			height: 90rpx;

			&>view {
				flex: 1;
				text-align: left;
				padding: 0 $padding;
				line-height: 90rpx;
			}
		}

		.cont {
			background: #fff;
			width: 100%;
			margin: 0 auto;

			.detailed-item {
				padding: 20rpx 0 20rpx;
				margin: 0 32rpx;
				border-bottom: 1px solid $color-line;
				position: relative;
				box-sizing: border-box;

				&:last-of-type {
					border-bottom: none;
				}

				.info {
					padding-right: 180rpx;

					.event {
						font-size: 28rpx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #000000;
						opacity: 1;
					}

					.time-box {
						line-height: 1;
						// margin-top: 15rpx;
					}

					.time {
						font-size: $font-size-activity-tag;
						color: $color-tip;
					}
				}

				.num {
					position: absolute;
					right: 17rpx;
					top: 50%;
					transform: translateY(-50%);
					text-align: right;
					font-weight: 500;
					font-size: 32rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #1189F4;
					opacity: 1;
				}
			}
		}
	}

	.color-base-text {
		color: #1189F4 !important;
	}
</style>
