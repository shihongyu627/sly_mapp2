<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="page">
		<view class="help-title">{{ detail.article_title }}</view>
		<view class="help-meta" v-if="detail.is_show_release_time == 1">
			<text class="help-time">发表时间: {{ $util.timeStampTurnTime(detail.create_time) }}</text>
		</view>
		<view class="help-content">
			<ns-rich-text :contentArr="$util.getVideo(content)"></ns-rich-text>
		</view>
		<view class="bottom-area">
			<view v-if="detail.is_show_read_num == 1">阅读：<text
					class="price-font">{{ detail.read_num + detail.initial_read_num }}</text></view>
			<view v-if="detail.is_show_dianzan_num == 1"><text
					class="price-font">{{ detail.dianzan_num + detail.initial_dianzan_num }}</text>人已赞</view>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import htmlParser from '@/common/js/html-parser';
	export default {
		data() {
			return {
				articleId: 0,
				detail: {},
				content: ''
			};
		},
		onLoad(options) {
			this.articleId = options.article_id || 0;
			if (this.articleId == 0) {
				this.$util.redirectTo('/pages_tool/help/list', {}, 'redirectTo');
				return;
			}
			this.getData();
		},
		onShow() {},
		methods: {
			getData() {
				this.$api.sendRequest({
					url: '/api/article/info',
					data: {
						article_id: this.articleId
					},
					success: res => {
						if (res.code == 0 && res.data) {
							this.detail = res.data;
							this.$langConfig.title(this.detail.article_title);
							this.content = this.detail.article_content;
						} else {
							this.$util.showToast({
								title: res.message
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages_tool/article/list', {}, 'redirectTo');
							}, 2000);
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			}
		},
		onShareAppMessage(res) {
			var title = this.detail.article_title;
			var path = '/pages_tool/article/detail?article_id=' + this.articleId;
			return {
				title: title,
				path: path,
				success: res => {},
				fail: res => {}
			};
		}
	};
</script>

<style lang="scss">
	.page {
		width: 100%;
		height: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		background: #ffffff;
	}

	.help-title {
		font-size: $font-size-toolbar;
		text-align: left;
		font-weight: bold;
	}

	.help-content {
		margin-top: $margin-updown;
		word-break: break-all;
	}

	.help-meta {
		text-align: left;
		margin-top: $margin-updown;
		color: $color-tip;

		.help-time {
			font-size: $font-size-tag;
		}
	}

	.bottom-area {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 40rpx;

		.price-font {
			font-weight: normal !important;
		}

		view {
			color: #999;
			font-size: 24rpx;
		}
	}
</style>
