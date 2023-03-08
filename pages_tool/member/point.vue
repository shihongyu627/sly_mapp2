<template>
	<view :data-theme="themeStyle">
		<view class="point-header">
			<view class="header-title">
				我的柚币(个)
			</view>
			<view class="header-flex">
				<view class="header-num">
					{{memberAccount.point}}
				</view>
				<view class="header-invite" @click="$util.redirectTo('/pages_promotion/fenxiao/team')">
					 邀请记录
				</view>
			</view>
		
		</view>
		<view class="point-tabBox">
			<view class="point-item" v-for="(item, index) in pointType" :key="index"
				:class="pointIndex==item.value? 'point-items' : ''" @click="onPointType(item)">
				{{item.label}}
			</view>
		</view>
		<mescroll-uni @getData="getData" class="member-point" ref="mescroll" top="260rpx">
			<view slot="list">
				<block v-if="dataList.length">
					<view class="detailed-wrap">
						<view class="cont">
							<view class="detailed-item" v-for="(item, index) in dataList" :key="index">
								<view class="info">
									<view class="event">{{ item.type_name }}</view>
									<view class="time-box">
										<text
											class="time color-tip">{{ $util.timeStampTurnTime(item.create_time) }}</text>
									</view>
								</view>
								<view class="num color-base-text" v-if="item.account_data > 0">
									+{{ parseInt(item.account_data) }}</view>
								<view class="num " v-else>{{ parseInt(item.account_data) }}</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<view class="cart-empty">
						<ns-empty :isIndex="!1" text="暂无内容"></ns-empty>
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
				memberAccount: {
					point: 0
				},
				dataList: [],
				memberInfo: {
					headimg: ''
				},
				searchType: {
					from_type: 0,
					date: ''
				},
				pointType: [{
					label: "全部",
					value: "0"
				}], //柚币类型
				pointIndex: 0,
				pointType: [{
					label: "全部",
					value: "0"
				}, {
					label: "收入",
					value: "1"
				}, {
					label: "支出",
					value: "2"
				}],
			};
		},
		components: {},
		mixins: [globalConfig],
		onShow() {
			this.$langConfig.refresh();
			if (!uni.getStorageSync('token')) {
				this.$util.redirectTo(
					'/pages/login/login/login', {
						back: '/otherpages/member/point/point'
					},
					'redirectTo'
				);
			}
			this.getMemberInfo();
		},
		onLoad() {
			// this.getPointType()
		},
		computed: {},
		methods: {
			goInvite(){
				
			},
			onPointType(item) {
				console.log(item);
				this.pointIndex = item.value
				this.$refs.mescroll.refresh();
			},
			//获取个人柚币信息
			getAccountInfo() {
				this.$api.sendRequest({
					url: '/api/memberaccount/info',
					data: {
						account_type: 'point'
					},
					success: res => {
						if (res.code == 0 && res.data) {
							this.memberAccount = res.data;
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			},
			// 会员信息
			getMemberInfo() {
				this.$api.sendRequest({
					url: '/api/member/info',
					success: res => {
						if (res.code >= 0) {
							this.token = uni.getStorageSync('token');
							this.memberInfo = res.data;
							this.getAccountInfo();
						} else {
							this.token = null;
						}
					}
				});
			},
			//获得列表数据
			getData(mescroll) {
				this.$api.sendRequest({
					url: '/api/memberaccount/page',
					data: {
						page_size: mescroll.size,
						page: mescroll.num,
						account_type: 'point',
						from_type: this.searchType.from_type,
						sign: this.pointIndex
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
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
		height: 89px;
		background: #1189F4;
		opacity: 1;
		border-radius: 0px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-left: 60rpx;
		padding-right: 60rpx;
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
	.header-flex{
		margin-top: 4px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.header-num {
		font-size: 25px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FFFFFF;
		opacity: 1;
	}
	.header-invite{
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FFFFFF;
		opacity: 1;
	}
	.header-title {
		font-size: 13px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
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
				padding: 30rpx 0 32rpx;
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
						font-size: 16px;
						font-family: PingFang SC;
						font-weight: bold;
						color: #000000;
						opacity: 1;
					}

					.time-box {
						line-height: 1;
						margin-top: 24rpx;
					}

					.time {
						font-size: $font-size-activity-tag;
						color: $color-tip;
					}
				}

				.num {
					width: 160rpx;
					position: absolute;
					right: 17rpx;
					top: 50%;
					transform: translateY(-50%);
					text-align: right;
					font-size: $font-size-toolbar;
					font-weight: 500;
				}
			}
		}
	}

	.color-base-text {
		color: #1189F4 !important;
	}
</style>
