<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<mescroll-uni @getData="getData" ref="mescroll">
			<block slot="list">
				<view class="notice-list" v-if="dataList.length">
					<view class="notice-item" @click="jumpDetail(item.id)" v-for="(item, index) in dataList" :key="index">
						<view class="title-info">
							<view class="title">
								<text v-if="item.is_top == 1" class="color-base-bg tag">置顶</text>
								<text class="txt using-hidden">{{ item.title }}</text>
							</view>
							<text class="release-time">{{ $util.timeStampTurnTime(item.create_time, 1) }}</text>
							<view class="iconfont iconright"></view>
						</view>
					</view>
				</view>
				<view v-else class="cart-empty">
					<ns-empty text="暂无公告" :isIndex="false"></ns-empty>
				</view>
				<loading-cover ref="loadingCover"></loading-cover>
			</block>
		</mescroll-uni>

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
			
		},
		methods: {
			getData(mescroll) {
				this.$api.sendRequest({
					url: '/api/notice/page',
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
			jumpDetail(e) {
				this.$util.redirectTo('/pages_tool/notice/detail?notice_id=' + e);
			}
		},

		onShareAppMessage(res) {
			var title = '公告';
			var path = '/pages_tool/notice/list';
			return {
				title: title,
				path: path,
				success: res => {},
				fail: res => {}
			};
		}
	};
</script>

<style lang="scss" scoped>
	/deep/ .fixed {
		position: relative;
		top: 0;
	}

	.cart-empty {
		padding-top: 308rpx;
	}

	.notice-list {
		.notice-item {
			margin: $margin-updown $margin-both;
			background: #fff;
			border-radius: 10rpx;
			padding: 32rpx 34rpx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			align-items: center;
			line-height: 1;

			.title-info {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				overflow: hidden;

				.title {
					flex: 4;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					display: flex;
					align-items: center;

					.txt {
						display: block;
						color: #000;
						font-size: $font-size-base;
						line-height: 28rpx;
					}
					.tag {
						font-size: 22rpx;
						color: #FFFFFF;
						line-height: 28rpx;
						border-radius: 6rpx;
						padding: 2rpx 6rpx;
						margin-right: 10rpx;
					}
				}

				.release-time {
					flex: 3;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					margin-left: 20rpx;
					color: $color-tip;
					text-align: right;
					font-size: $font-size-tag;
				}
				.iconfont{
					color: $color-tip;
					font-size: $font-size-tag;
				}
			}

			.content {
				margin-top: 10rpx;
				display: inline-block;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				width: 100%;
				color: $color-tip;
				font-size: $font-size-goods-tag;
				padding-bottom: 30rpx;
			}
		}
	}
</style>
