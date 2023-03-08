<template>
	<view class="ruleBox">
		<image class='imgBg' :src="imgUrl" mode="widthFix">
	</view>
</template>

<script>
	export default {
		components: {},
		mixins: [],
		data() {
			return {
				imgUrl: 'https://qiniu.shanliangyou888.com/upload/1/common/images/20230228/20230228051011167757541103330.jpg'
			};
		},
		onLoad(data) {
			let title = data.title
			let type = data.type
			if (type == 1) {
				this.imgUrl =
					'https://qiniu.shanliangyou888.com/upload/1/common/images/20230228/20230228051011167757541103330.jpg'
			} else {
				this.imgUrl =
					'https://qiniu.shanliangyou888.com/upload/1/common/images/20230302/20230302023339167773881956841.jpg'
			}
			this.$langConfig.title(title || '');
		},
	};
</script>

<style scoped lang="scss">
	.ruleBox {
		width: 100%;
		height: auto;

		.imgBg {
			width: 100%;
			height: 100%;
		}
	}
</style>
