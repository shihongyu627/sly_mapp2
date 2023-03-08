<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="page">
		<view class="notice-title">{{ detail.title }}</view>
		<view class="notice-meta">
			<text class="notice-time">发表时间: {{ $util.timeStampTurnTime(detail.create_time) }}</text>
		</view>
		<view class="notice-content">
			<rich-text :nodes="content"></rich-text>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>

	</view>
</template>

<script>
	import htmlParser from '@/common/js/html-parser';
	export default {
		data() {
			return {
				noticeId: 0,
				content: '',
				detail: {}
			};
		},
		onLoad(options) {
			options.notice_id ? (this.noticeId = options.notice_id) : this.$util.redirectTo('/pages_tool/notice/list', {},
				'redirectTo');
			this.$api.sendRequest({
				url: '/api/notice/info',
				data: {
					id: this.noticeId
				},
				success: res => {
					if (res.code == 0) {
						if (res.data) {
							this.detail = res.data;
							this.content = htmlParser(res.data.content);
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						} else {
							this.$util.redirectTo('/pages_tool/notice/list', {}, 'redirectTo');
						}
					} else {
						this.$util.showToast({
							title: res.message
						});
						setTimeout(() => {
							this.$util.redirectTo('/pages_tool/notice/list', {}, 'redirectTo');
						}, 2000);
					}
				},
				fail: res => {
					this.$util.redirectTo('/pages_tool/notice/list', {}, 'redirectTo');
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		onShow() {
			
		},
		onShareAppMessage(res) {
			var title = '[公告]' + this.detail.title;
			var path = '/pages_tool/notice/detail?notice_id=' + this.noticeId;
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
		background-color: #fff;
	}

	.notice-title {
		font-size: $font-size-toolbar;
		text-align: left;
		font-weight: bold;
	}

	.notice-content {
		margin-top: $margin-updown;
		word-break: break-all;
		font-size: $font-size-base;
	}

	.notice-meta {
		text-align: left;
		margin-top: $margin-updown;
		color: $color-tip;

		.notice-time {
			font-size: $font-size-tag;
		}
	}
</style>
