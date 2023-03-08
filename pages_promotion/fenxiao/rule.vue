<template>
	<view class="process-wrap">
		<view class="content" :data-theme="themeStyle" v-if="dataInfo.content">
			<rich-text :nodes="$util.richText(dataInfo.content)"></rich-text>
		</view>
		<view class="btn">
			<view class="add" @click="onClickShare">
				分享海报
			</view>
		</view>
	</view>
</template>
<script>
	import validate from 'common/js/validate.js';
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		components: {},
		data() {
			return {
				dataInfo: {},
			};
		},
		mixins: [globalConfig],
		onLoad() {
			this.getListData()
		},
		onHide() {
			this.flag = false;
		},
		methods: {
			getListData() {
				this.$api.sendRequest({
					url: '/memberrecommend/api/memberrecommend/info',
					data: {},
					success: res => {
						let msg = res.message;
						if (res.code == 0) {
							this.dataInfo = res.data || {}
						} else {
							this.$util.showToast({
								title: msg
							});
						}

					},
					fail: res => {}
				});
			},
			onClickShare() {
				this.$util.redirectTo('/pages_promotion/fenxiao/promote_code');
			},
		}
	};
</script>

<style scoped lang="scss">
	.process-wrap{
		padding-bottom: 100rpx;
		box-sizing: border-box;
	}
	.content {
		// padding: 20rpx 30rpx 10rpx;
		padding-bottom: 60rpx;
		box-sizing: border-box;
	}

	.add {
		// margin-top: 60rpx;
		height: 80rpx;
		line-height: 80rpx !important;
		border-radius: 80rpx;
		font-weight: 500;
		width: calc(100% - 60rpx);
		margin-left: 30rpx;
		background: #1189F4;
		color: #fff;
		text-align: center;
	}

	.btn {
		position: fixed;
		width: 100%;
		height: 68px;
		bottom: 0;
		left: 0;
		// padding-bottom: constant(safe-area-inset-bottom);
		/*兼容 IOS<11.2*/
		// padding-bottom: env(safe-area-inset-bottom);
		/*兼容 IOS>11.2*/
		background: #fff;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}
</style>
