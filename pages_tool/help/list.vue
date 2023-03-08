<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="help">
		<block v-if="dataList.length">
			<view class="help-item" v-for="(item, index) in dataList" :key="index">
				<view :class="['item-title', item.child_list.length == 0 ? 'empty' : '']">{{ item.class_name }}</view>
				<view class="item-content" v-for="(s_item, s_index) in item.child_list" :key="s_index" @click="helpDetail(s_item)">{{ s_item.title }}</view>
			</view>
		</block>
		<block v-else><ns-empty text="暂无帮助信息" :isIndex="false"></ns-empty></block>

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
	onLoad() {
		this.getData();
	},
	onShow() {},
	methods: {
		getData() {
			this.$api.sendRequest({
				url: '/api/helpclass/lists',
				data: {
					app_module: 'shop'
				},
				success: res => {
					if (res.code == 0 && res.data) {
						this.dataList = res.data;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		helpDetail(e) {
			// #ifndef MP-WEIXIN
				if (e.link_address) {
					uni.redirectTo({
						url: '/pages_tool/webview/webview?src=' + encodeURIComponent(e.link_address)
					});
				} else {
					this.$util.redirectTo('/pages_tool/help/detail', {
						id: e.id
					});
				}
			// #endif
			
			// #ifdef MP-WEIXIN
				this.$util.redirectTo('/pages_tool/help/detail', {
					id: e.id
				});
			// #endif
			
			
		}
	},
	onShareAppMessage(res) {
		var title = '帮助中心使你更加方便';
		var path = '/pages_tool/help/list';
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
.help {
	height: 100%;
	box-sizing: border-box;
	padding-top: 20rpx;

	.help-item {
		width: calc(100% - 60rpx);
		margin: 0 auto;
		padding: 32rpx 35rpx;
		box-sizing: border-box;
		background-color: #fff;
		margin-bottom: 18rpx;
		border-radius: 10rpx;

		.item-title {
			padding-bottom: 15rpx;
			font-size: 30rpx;
			color: #000;
			border-bottom: 2rpx solid #f1f1f1;
			&.empty{
				padding-bottom: 0;
				border-bottom: none;
			}
		}

		.item-content {
			padding: 24rpx 0;
			border-bottom: 2rpx solid #f1f1f1;
			font-size: $font-size-base;
			color: $color-sub;

			&:last-child {
				border-bottom: none;
				padding-bottom: 0;
			}
		}
	}
}
</style>
