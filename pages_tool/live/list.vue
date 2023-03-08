<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="live-content">
		<!-- #ifdef MP-WEIXIN -->
		<mescroll-uni ref="mescroll" @getData="getListData">
			<block slot="list">
				<block v-if="liveList.length">
					<view class="live-wrap" v-for="(item, index) in liveList" :key="index" @click="entryRoom(item.roomid)">
						<view class="banner-wrap">
							<image :src="item.banner != '' ? $util.img(item.banner) : $util.img('public/uniapp/live/live_default_banner.png')" mode="widthFix"></image>
							<view class="shade"></view>
							<view class="wrap">
								<view class="room-name">
									<text class="status-name font-size-base" :class="{ 'color-base-bg': item.live_status == '101' }">
										<text class="iconfont iconzhibozhong font-size-sub" v-if="item.live_status == '101'"></text>
										<text class="iconfont iconzhibojieshu font-size-sub" v-else></text>
										{{ item.status_name }}
									</text>
									{{ item.name }}
								</view>
							</view>
						</view>
						<view class="room-info">
							<image :src="item.anchor_img != '' ? $util.img(item.anchor_img) : $util.getDefaultImage().head" class="anchor-img"></image>
							<text class="anchor-name">主播：{{ item.anchor_name }}</text>
							<text class="separate">|</text>
							<text class="goods-text">直播商品：{{ item.goods.length }}</text>
						</view>
						<view class="time">
							<text class="color-tip">
								{{ $util.timeStampTurnTime(item.start_time) }}
								<text class="separate">-</text>
								{{ $util.timeStampTurnTime(item.end_time) }}
							</text>
						</view>
					</view>
				</block>
				<block v-else><ns-empty text="暂无直播记录" :isIndex="isIndex"></ns-empty></block>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
		<!-- #endif -->

		<!-- #ifndef MP-WEIXIN -->
		<ns-empty text="直播仅支持在微信小程序内查看" :isIndex="isIndex"></ns-empty>
		<!-- #endif -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			liveList: [],
			isIndex: false,
			showEmpty: false
		};
	},
	onShow() {
		setTimeout( () => {
			if (this.addonIsExist && !this.addonIsExist.live) {
				this.$util.showToast({
					title: '商家未开启小程序直播',
					mask: true,
					duration: 2000
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
				}, 2000);
				return;
			}
		}, 1000);
		
		this.liveList = [];
		if (this.$refs.mescroll) this.$refs.mescroll.refresh();
	},
	methods: {
		getListData(mescroll) {
			this.showEmpty = false;
			this.$api.sendRequest({
				url: '/live/api/live/page',
				data: {
					page: mescroll.num,
					page_size: mescroll.size
				},
				success: res => {
					this.showEmpty = true;
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
					if (mescroll.num == 1) this.liveList = []; //如果是第一页需手动制空列表
					this.liveList = this.liveList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		entryRoom(roomId) {
			// #ifdef MP-WEIXIN
			wx.navigateTo({
				url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}`
			});
			// #endif
		}
	}
};
</script>

<style lang="scss">
.live-wrap {
	margin: $margin-updown $margin-both;
	background: #fff;
	border-radius: 16rpx;
	overflow: hidden;
}

.banner-wrap {
	width: 100%;
	position: relative;
	line-height: 1;
	display: flex;

	image {
		width: 100%;
	}

	.shade {
		width: 100%;
		height: 100%;
		position: absolute;
		background: rgba($color: #888, $alpha: 0.3);
		left: 0;
		top: 0;
		z-index: 5;
	}

	.wrap {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 10;
		padding: 30rpx;
		box-sizing: border-box;

		.room-name {
			font-size: $font-size-toolbar;
			color: #fff;
			line-height: 1;
			width: 100%;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			display: flex;
			align-items: center;

			.status-name {
				display: inline-block;
				font-size: $font-size-activity-tag;
				color: #fff;
				padding: 8rpx 20rpx;
				background-color: rgba(0, 0, 0, 0.6);
				border-radius: 36rpx;
				margin-right: 20rpx;

				.iconfont {
					margin-right: 4rpx;
				}

				.iconzhibozhong {
					font-size: $font-size-activity-tag;
					color: #fff;
					margin-right: 4rpx;
				}
			}
		}
	}
}

.room-info {
	padding: 20rpx 30rpx 0 30rpx;
	background: #fff;
	display: flex;

	.anchor-img {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 20rpx;
	}

	.anchor-name,
	.goods-text {
		font-size: $font-size-base;
		line-height: 60rpx;
	}

	.separate {
		color: #808080;
		margin: 0 10rpx;
		line-height: 56rpx;
	}
}

.time {
	padding: 20rpx 30rpx;
	background: #fff;
	line-height: 1;

	.separate {
		color: #808080;
		margin: 0 10rpx;
		line-height: 1;
	}
}
</style>
