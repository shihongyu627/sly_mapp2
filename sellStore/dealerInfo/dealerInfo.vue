<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<!-- <view class="info-head" @click="NavReturn()">
			<view class="head-nav" :class="{active:isIphoneX}"></view>
			<!-- <uni-nav-bar left-icon="back" :title="customNavTitle" :border="false"></uni-nav-bar> -->
		<view v-if="indent == 'all'" class="info-wrap">
			<!-- 经销商名称 -->
			<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('dealer_name')">
				<text class="cell-tit">经销商名称</text>
				<text class="cell-tip">{{ formData.dealer_name }}</text>
				<text class="cell-more"></text>
			</view>
			<!-- 银行姓名 -->
			<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('bank_name')">
				<text class="cell-tit">银行姓名</text>
				<text class="cell-tip ">{{ formData.bank_name }}</text>
				<text class="cell-more"></text>
			</view>
			<!-- 银行卡号 -->
			<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('bank_account')">
				<text class="cell-tit">银行卡号</text>
				<text class="cell-tip">{{ formData.bank_account }}</text>
				<text class="cell-more"></text>
			</view>
			<!-- 银行支行 -->
			<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('bank_address')">
				<text class="cell-tit">银行支行</text>
				<text class="cell-tip">{{ formData.bank_address }}</text>
				<text class="cell-more"></text>
			</view>
			<!-- 支付宝姓名 -->
			<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('alipay_name')">
				<text class="cell-tit">支付宝姓名</text>
				<text class="cell-tip">{{ formData.alipay_name }}</text>
				<text class="cell-more"></text>
			</view>
			<!-- 支付宝账号 -->
			<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('alipay_account')">
				<text class="cell-tit">支付宝账号</text>
				<text class="cell-tip">{{ formData.alipay_account }}</text>
				<text class="cell-more"></text>
			</view>
			<!-- 支付宝收款二维码 -->
			<view @click="headImage('alipay_qrcode')" class="info-list-cell  info-list-con" hover-class="cell-hover">
				<text class="cell-tit">支付宝收款二维码</text>
				<view class="info-list-head cell-tip">
					<image :src="$util.loadimg(formData.alipay_qrcode)" mode="aspectFill" />
				</view>
				<text class="cell-more"></text>
			</view>
			<!-- 微信姓名 -->
			<view class="info-list-cell info-list-con" @click="modifyInfo('wechat_name')">
				<text class="cell-tit">微信姓名</text>
				<text class="cell-tip">{{ formData.wechat_name }}</text>
				<text class="cell-more"></text>
			</view>
			<!-- 微信账号 -->
			<view class="info-list-cell info-list-con" @click="modifyInfo('wechat_account')">
				<text class="cell-tit">微信账号</text>
				<text class="cell-tip">{{ formData.wechat_account }}</text>
				<text class="cell-more"></text>
			</view>
			<!-- 微信收款二维码 -->
			<view @click="headImage('wechat_qrcode')" class="info-list-cell  info-list-con" hover-class="cell-hover">
				<text class="cell-tit">微信收款二维码</text>
				<view class="info-list-head cell-tip">
					<image :src="$util.loadimg(formData.wechat_qrcode)" mode="aspectFill" />
				</view>
				<text class="cell-more"></text>
			</view>
		</view>

		<uni-popup ref="inputDialog" type="center">
			<view class="inputDialog-box">
				<view class="inputDialog-title">
					{{title}}
				</view>
				<input class="uni-input" placeholder-class="placeholder-class" placeholder="请输入" mobile="mobile"
					v-model="content" @input="onChangeContent" />
				<view class="_btn" @click="confirm"><button type="primary">确认</button></view>
			</view>
		</uni-popup>
		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	import info from './public/js/info.js';

	export default {
		components: {
			uniNavBar
		},
		data() {
			return {};
		},
		mixins: [info],
		filters: {
			mobile(mobile) {
				return mobile.substring(0, 4 - 1) + '****' + mobile.substring(6 + 1);
			}
		}
	};
</script>

<style lang="scss" scoped>
	.info-head {
		.head-nav {
			width: 100%;
			height: var(--status-bar-height);
			background: #ffffff;
		}

		.head-nav.active {
			padding-top: 40rpx;
		}
	}

	.captcha {
		width: 170rpx;
		height: 50rpx;
	}

	.info-list-cell {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 30rpx;
		position: relative;
		line-height: 50rpx;
		background-color: #fff;

		&:first-child {
			padding: 28rpx 30rpx;
		}

		.cell-tit {
			white-space: nowrap;
		}

		.cell-tip1 {
			margin-right: 40rpx;
		}

		&.log-out-btn {
			margin-top: 40rpx;

			.cell-tit {
				margin: auto;
			}
		}

		.info-list-head {
			border: 1rpx solid $color-line;
			width: 82rpx;
			height: 82rpx;
			border-radius: 50%;
		}

		.info-list-head image {
			max-width: 100%;
			max-height: 100%;
		}

		// #ifdef MP
		&.info-item {
			margin-top: 16rpx;
		}

		// #endif

		&.info-list-con~&.info-list-con:after {
			content: '';
			position: absolute;
			left: 30rpx;
			right: 30rpx;
			top: 0;
			border-bottom: 1rpx solid $color-line;
		}

		.cell-tip {
			margin-left: auto;
			color: $color-tip;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			max-width: 470rpx;
		}

		.cell-more {
			margin-left: 10rpx;
			width: 32rpx;
			height: 100%;
		}

		.cell-more:after {
			content: '';
			display: block;
			width: 12rpx;
			height: 12rpx;

			border: 2rpx solid darken($color-line, 20%) {
				right-color: transparent;
				bottom-color: transparent;
			}

			transform: rotate(135deg);
		}
	}

	.edit-info-box {
		margin-top: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 40rpx;
		min-height: 50rpx;
		background-color: #fff;

		.info-name {
			width: 150rpx;
			font-size: $font-size-base;
			text-align: left;
		}

		.info-content {
			width: 0;
			font-size: $font-size-base;
			padding: 0;
			flex: 1;
		}

		.dynacode {
			margin: 0;
			padding: 0 10rpx;
			width: 250rpx;
			height: 60rpx;
			font-size: $font-size-base;
			line-height: 60rpx;
			color: #fff;
			word-break: break-all;
		}

		.edit-sex-list {
			display: flex;

			label {
				display: flex;
				margin-left: 30rpx;
				align-items: center;
			}
		}

		uni-radio .uni-radio-input {
			width: 32rpx;
			height: 32rpx;
		}
	}

	.set-pass-tips {
		padding: 20rpx 20rpx 0 20rpx;
	}

	.input-len {
		width: 500rpx !important;
	}

	.save-item {
		margin-top: 50rpx;

		button {
			font-size: 30rpx;
		}
	}

	.empty {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: $padding;
		box-sizing: border-box;
		justify-content: center;
		padding-top: 80rpx;

		.empty_img {
			width: 63%;
			height: 450rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.iconfont {
			font-size: 190rpx;
			color: $color-tip;
			line-height: 1.2;
		}

		button {
			min-width: 300rpx;
			margin-top: 100rpx;
			height: 70rpx;
			line-height: 70rpx;
			font-size: $font-size-base;
		}
	}

	.inputDialog-box {
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		width: 300px;
		padding-bottom: 20px;
	}

	.inputDialog-title {
		font-size: 18px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #364346;
		opacity: 1;
		text-align: center;
		margin-top: 20px;
	}

	.uni-input {
		height: 40px;
		background: #FFFFFF;
		border: 1px solid #C5C5C5;
		opacity: 1;
		border-radius: 6px;
		box-sizing: border-box;
		padding: 20rpx;
		margin: 30rpx;
	}

	._btn {
		margin-top: 40rpx;
		height: 80rpx;
		line-height: 80rpx;
	}
</style>
