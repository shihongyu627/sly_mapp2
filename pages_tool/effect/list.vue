<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<mescroll-uni @getData="getData" ref="mescroll">
			<block slot="list">
				<view class="article-wrap" v-if="list.length">
					<view class="item" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
						<view class="article-img">
							<image class="cover-img" :src="$util.img(item.cover_img)" mode="widthFix"
								@error="imgError(index)"></image>
						</view>
						<view class="info-wrap">
							<!-- <text class="title">{{ item.effect_title }}</text> -->
							<view class="read-wrap">
								<image class="cover-img" :src="$util.loadimg(item.headimg)" mode="widthFix"
									@error="imgError(index)">
								</image>
								<view class="name">{{ item.name }}</view>
							</view>
						</view>
					</view>
				</view>
				<view v-else class="empty-wrap">
					<ns-empty text="暂无内容" :isIndex="false"></ns-empty>
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
				list: []
			};
		},
		onShow() {},
		methods: {
			getData(mescroll) {
				this.$api.sendRequest({
					url: '/api/effect/page',
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
						if (mescroll.num == 1) this.list = []; //如果是第一页需手动制空列表
						this.list = this.list.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			toDetail(item) {
				this.$util.redirectTo('/pages_tool/effect/detail', {
					effect_id: item.effect_id
				});
			},
			imgError(index) {
				if (this.list[index]) this.list[index].cover_img = this.$util.getDefaultImage().effect;
			}
		},
		onShareAppMessage(res) {
			var title = '文章列表';
			var path = '/pages_tool/effect/list';
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

	image {
		max-width: 100% !important;
		max-height: 100% !important;
	}

	.empty-wrap {
		padding-top: 200rpx;
	}

	.article-wrap {
		background: #f8f8f8;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		padding-left: 20rpx;
		padding-right: 20rpx;

		.item {
			width: calc(50% - 10rpx);
			background: #FFFFFF;
			opacity: 1;
			border-radius: 10px;
			margin-top: 10px;
			padding-bottom: 10px;

			.article-img {
				// height: 182px;
				opacity: 1;
				border-radius: 10px 10px 0px 0px;
				overflow: hidden;
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					width: 100%;
				}
			}

			.info-wrap {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.title {
					font-size: 14px;
					font-weight: 400;
					color: #231E1E;
					margin-bottom: 10rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					padding-left: 24rpx;
					padding-right: 24rpx;
					box-sizing: border-box;
				}

				.abstract {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					font-size: $font-size-tag;
				}

				.read-wrap {
					display: flex;
					color: #999ca7;
					justify-content: flex-start;
					align-items: center;
					margin-top: 10rpx;
					line-height: 1;
					padding-left: 24rpx;
					padding-right: 24rpx;
					box-sizing: border-box;

					.cover-img {
						width: 22px;
						height: 22px;
						border-radius: 50%;
						opacity: 1;
						margin-right: 5px;
					}

					.name {
						font-size: 12px;
						font-family: PingFang SC;
						font-weight: 400;
						color: #231E1E;
						opacity: 1;
					}

					text {
						font-size: $font-size-tag;
					}

					.iconfont {
						font-size: 36rpx;
						vertical-align: bottom;
						margin-right: 10rpx;
					}

					.category-icon {
						width: 8rpx;
						height: 8rpx;
						border-radius: 50%;
						background: $base-color;
						margin-right: 10rpx;
					}

					.date {
						margin-left: 20rpx;
					}
				}
			}
		}
	}
</style>
