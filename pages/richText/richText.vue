<template>
	<view class="content" :data-theme="themeStyle" v-if="detail.content">
		<ns-rich-text :contentArr="$util.getVideo(detail.content)"></ns-rich-text>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				detail: {
					content: ""
				},
				url: ""
			};
		},
		onLoad(data) {
			console.log(data, '传过来的参数');
			this.id = data.textarea_id || ''
			this.getListData()
		},
		methods: {
			getListData() {
				this.$api.sendRequest({
					url: '/api/textarea/info',
					data: {
						id: this.id
					},
					success: res => {
						let msg = res.message;
						if (res.code == 0 && res.data) {
							this.detail = res.data;
							this.$langConfig.title(res.data.title || '');
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
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
		/* padding-left: 20rpx; */
		/* padding-right: 20rpx; */
		/* background: #fff; */
		/* height: 100vh; */
		padding-bottom: 145rpx;
	}

	.footer-box {
		width: 100%;
		height: 136rpx;
		background: #FFFFFF;
		box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.01);
		opacity: 1;
		border-radius: 0px;
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

	}

	.footer-bnt {
		width: 710rpx;
		height: 48px;
		background: #1189F4;
		opacity: 1;
		border-radius: 24px;
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 48px;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
	}
</style>
