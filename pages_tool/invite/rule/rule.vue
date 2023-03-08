<template>
	<view class="content" :data-theme="themeStyle" v-if="detail.content">
		<rich-text :nodes="$util.richText(detail.content)"></rich-text>
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
			this.getListData()
		},
		methods: {
			getListData() {
				this.$api.sendRequest({
					url: '/memberrecommend/api/memberrecommend/info',
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
.content{
	padding-left: 20rpx;
	padding-right: 20rpx;
	/* background: #fff; */
	height: 100vh;
}
</style>
