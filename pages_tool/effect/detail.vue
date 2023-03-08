<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="page">
		<image class="cover-img" :src="$util.img(detail.cover_img)" mode="widthFix" @error="imgError(index)"></image>
		<view class="header-box">
			<view class="header-left">
				<image class="headimg" :src="$util.loadimg(detail.headimg)" mode="widthFix" @error="imgError(index)">
				</image>
				<view class="name">
					{{detail.name}}
				</view>
			</view>
			<view class="follow-and-share">
				<text class="share iconfont" @click="editCollection()"
					:class="detail.is_like == 1 ? 'iconlikefill color-base-text' : 'iconguanzhu'"></text>
				<button class="share-btn" :plain="true" open-type="share">
					<text class="follow iconfont iconfenxiang"></text>
				</button>
			</view>
		</view>
		<!-- <view class="help-title">{{ detail.article_title }}</view> -->
		<!-- 	<view class="help-meta" v-if="detail.is_show_release_time == 1">
			<text class="help-time">发表时间: {{ $util.timeStampTurnTime(detail.create_time) }}</text>
		</view> -->
		<view class="help-content">
			<ns-rich-text :contentArr="$util.getVideo(content)"></ns-rich-text>
		</view>
		<!-- 	<view class="bottom-area">
			<view v-if="detail.is_show_read_num == 1">阅读：<text class="price-font">{{ detail.read_num + detail.initial_read_num }}</text></view>
			<view v-if="detail.is_show_dianzan_num == 1"><text class="price-font">{{ detail.dianzan_num + detail.initial_dianzan_num }}</text>人已赞</view>
		</view> -->
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import htmlParser from '@/common/js/html-parser';
	export default {
		data() {
			return {
				effect_id: '',
				detail: {},
				content: '',
				whetherCollection: null
			};
		},
		onLoad(options) {
			this.effect_id = options.effect_id || '';
			this.getData();
		},
		onShow() {},
		methods: {
			getData() {
				this.$api.sendRequest({
					url: '/api/effect/info',
					data: {
						effect_id: this.effect_id
					},
					success: res => {
						if (res.code == 0 && res.data) {
							this.detail = res.data;
							this.$langConfig.title(this.detail.effect_title);
							this.content = this.detail.effect_content;
						} else {
							this.$util.showToast({
								title: res.message
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages_tool/effect/list', {}, 'redirectTo');
							}, 2000);
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			editCollection() {
				this.$api.sendRequest({
					url: '/api/effect/like',
					data: {
						effect_id: this.effect_id
					},
					success: res => {
						if (res.code == 0) {
							this.getData()
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					},
					fail: res => {}
				});
			}
		},
		onShareAppMessage(res) {
			var title = this.detail.effect_title;
			var path = '/pages_tool/effect/detail?effect_id=' + this.effect_id;
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
		// padding: 30rpx;
		box-sizing: border-box;
		background: #ffffff;
	}

	.cover-img {
		width: 100%;
	}

	.header-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding-left: 20rpx;
		// padding-right: 20rpx;
		margin-top: 20rpx;
		// margin-bottom: 15px;
		position: relative;
		box-sizing: border-box;
	}

	.header-left {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.headimg {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		opacity: 1;
		margin-right: 10px;
	}

	.name {
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #231E1E;
		opacity: 1;
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

	.follow-and-share {
		position: absolute;
		right: 20rpx;
		top: 50%;
		transform: translateY(-50%);
		margin-top: 8rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		.share-btn {
			margin: 0;
			padding: 0;
			border: none;
			line-height: 1;
			height: auto;
		}

		.iconfont {
			font-weight: bold;
			margin-right: 30rpx;
			font-size: $font-size-toolbar;
			vertical-align: middle;

			&:first-child {
				font-size: 36rpx;
				// color: #28C445;
				// font-weight: normal;
			}

			&:last-child {
				margin-right: 0;
			}
		}
	}
</style>
