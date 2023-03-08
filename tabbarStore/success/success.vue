<template>
	<view class="success-box">
		<img class='success-icon' src="@/common/img/success.png" mode="aspectFill" @click='maskClick()' />
		<view class="success-title">
			预约成功！
		</view>
		<view class="go-back" @click="navigateBack">
			返回
		</view>
	</view>
</template>

<script>
	export default {
		methods: {
			navigateBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped>
	.success-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		padding-top: 130px;
	}

	.success-icon {
		width: 107px;
		height: 82px;
	}

	.success-title {
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		text-align: center;
		margin-top: 25px;
	}

	.go-back {
		width: 162px;
		height: 44px;
		background: #1189F4;
		opacity: 1;
		border-radius: 22px;
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 44px;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
		margin-top: 35px;
	}
</style>
