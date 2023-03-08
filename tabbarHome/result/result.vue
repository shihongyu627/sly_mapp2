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
				}
			};
		},
		onLoad(data) {
			console.log(data, '传过来的参数');
			this.$langConfig.title(data.title);
			this.getListData()
		},
		methods: {
			getListData() {
				this.$api.sendRequest({
					url: '/api/index/spreadInfo',
					data: {},
					success: res => {
						let msg = res.message;
						if (res.code == 0 && res.data) {
							this.detail = res.data;
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
		background: #fff;
		height: 100vh;
	}
</style>
