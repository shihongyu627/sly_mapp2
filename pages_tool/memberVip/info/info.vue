<template>
	<view class="card" :data-theme="themeStyle">
		<view class="vipInfo">
			<view class="vipInfo-headimg">
				<image class="headimg" :src="$util.loadimg(memberInfo.headimg)"></image>
			</view>
			<image class="content" :src="$util.loadimg(detail.image)" mode="widthFix"></image>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';

	export default {
		components: {},
		data() {
			return {
				detail: {},
				memberInfo: {}
			};
		},
		mixins: [globalConfig],
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.$refs.loadingCover.show();
			this.getListData()
			this.getMemberInfo()
		},
		methods: {
			/**
			 * 查询会员信息
			 */
			getMemberInfo() {
				this.$api.sendRequest({
					url: '/api/member/info',
					data: {},
					success: res => {
						if (res.code == 0) {
							this.memberInfo = res.data;
						}
					}
				});
			},
			getListData() {
				this.$api.sendRequest({
					url: '/api/config/awardconfig',
					data: {},
					success: res => {
						let newArr = []
						let msg = res.message;
						if (res.code == 0) {
							this.detail = res.data || {}
						} else {
							this.$util.showToast({
								title: msg
							})
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						//联网失败的回调
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
		}
	};
</script>

<style lang="scss">

</style>
<style scoped>
	.content {
		margin: 0 auto;
		width: 100%;
	}

	.vipInfo {
		position: relative;
	}

	.vipInfo-headimg {
		width: 100rpx;
		height: 100rpx;
		border-radius: 100rpx;
		position: absolute;
		left: 120rpx;
		top: 90rpx;
	}

	.headimg {
		width: 100rpx;
		height: 100rpx;
		border-radius: 100rpx;
	}
</style>
