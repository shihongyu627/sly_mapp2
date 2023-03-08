<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<mescroll-uni @getData="getData" class="member-point">
			<view slot="list">
				<block v-if="dataList.length">
					<view class="detailed-wrap">
						<view class="cont">
							<view class="detailed-item" v-for="(item, index) in dataList" :key="index" @click="toDetail(item.id)">
								<view class="info">
									<view class="event">{{ item.transfer_type_name }}</view>
									<view>
										<text class="time">{{ $util.timeStampTurnTime(item.apply_time) }}</text>
									</view>
								</view>
								<view class="right-wrap">
									<view class="num color-base-text">￥{{ item.apply_money }}</view>
									<view class="status-name">{{ item.status_name }}</view>
								</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<ns-empty :isIndex="false" text="暂无提现记录"></ns-empty>
				</block>
			</view>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
export default {
	data() {
		return {
			dataList: []
		};
	},
	onShow() {
		
		if (!uni.getStorageSync('token')) {
			this.$util.redirectTo(
				'/pages_tool/login/login',
				{
					back: '/pages_tool/member/point'
				},
				'redirectTo'
			);
		}
	},
	methods: {
		//获得列表数据
		getData(mescroll) {
			this.$api.sendRequest({
				url: '/api/memberwithdraw/page',
				data: {
					page_size: mescroll.size,
					page: mescroll.num
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
		},
		toDetail(id) {
			this.$util.redirectTo('/pages_tool/member/withdrawal_detail', {
				id: id
			});
		}
	}
};
</script>

<style lang="scss">
.account-box {
	width: 100vw;
	padding: 30rpx;
	box-sizing: border-box;
	padding-bottom: 10rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;

	.tit {
		color: #fff;
		line-height: 1;
	}

	.iconmn_jifen_fill {
		font-size: 60rpx;
		color: #fff;
	}

	.point {
		color: #fff;
		font-size: 60rpx;
		margin-left: 10rpx;
	}
}

.detailed-wrap {
	.head {
		display: flex;
		height: 90rpx;

		& > view {
			flex: 1;
			text-align: left;
			padding: 0 $padding;
			line-height: 90rpx;
		}
	}

	.cont {
		background: #fff;

		.detailed-item {
			padding: $padding 10rpx;
			margin: 0 $margin-both;
			border-bottom: 2rpx solid #eee;
			position: relative;

			&:last-of-type {
				border-bottom: none;
			}

			.info {
				padding-right: 180rpx;

				.event {
					font-size: $font-size-base;
					line-height: 1.3;
				}

				.time {
					font-size: $font-size-base;
					color: $color-tip;
				}
			}

			.right-wrap {
				position: absolute;
				right: 0;
				top: 0;
				text-align: right;

				.num {
					font-size: $font-size-toolbar;
				}
			}
		}
	}
}
</style>
