<template>
	<view :data-theme="themeStyle">
		<view class="info-wrap">
			<!-- 真实姓名 -->
			<view class="info-list-cell info-list-con" hover-class="cell-hover">
				<text class="cell-tit">姓名</text>
				<text class="cell-tip">{{ userInfo.name }}</text>
			</view>
			<!-- 昵称 -->
			<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="editInfo('rankname')">
				<text class="cell-tit">职位</text>
				<text class="cell-tip">{{ userInfo.rankname }}</text>
				<text class="cell-more"></text>
			</view>
			<!-- 手机号 -->
			<view class="info-list-cell info-list-con">
				<text class="cell-tit">关联用户</text>
				<text class="cell-tip">{{ userInfo.member_nickname }}</text>
			</view>
		</view>
		<view class="info-wrap">
			<!-- 真实姓名 -->
			<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="editInfo('money')">
				<text class="cell-tit">基本工资</text>
				<text class="cell-tip">{{ userInfo.base_salary }}</text>
				<text class="cell-more"></text>
			</view>
			<!-- 昵称 -->
			<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="lookRecord()">
				<text class="cell-tit">工资明细</text>
				<text class="cell-tip"></text>
				<text class="cell-more"></text>
			</view>
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
				worker_id: "",
				userInfo: {}
			};
		},
		mixins: [globalConfig],
		onShow() {
			if (!uni.getStorageSync('token')) {
				// this.$util.redirectTo('/pages/login/login/login', {
				// 	back: '/sellStore/team/info/info'
				// }, 'redirectTo');
			}
			this.dealerInfo()
		},
		onLoad(data) {
			this.worker_id = data.worker_id || ''

		},
		filters: {
			mobile(mobile) {
				return mobile.substring(0, 4 - 1) + '****' + mobile.substring(6 + 1);
			}
		},
		methods: {
			lookRecord() {
				this.$util.redirectTo('/sellStore/team/record/record');
			},
			editInfo(type) {
				let value = ''
				if (type == 'money') {
					value = this.userInfo.base_salary || ''
				} else {
					value = this.userInfo.rankname
				}
				this.$util.redirectTo('/sellStore/team/info/edit', {
					type: type,
					value: value,
					worker_id: this.worker_id
				});
			},
			dealerInfo() {
				this.$api.sendRequest({
					url: '/dealer/api/worker/info',
					data: {
						worker_id: this.worker_id
					},
					success: res => {
						if (res.code == 0) {
							this.userInfo = res.data;
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
				});
			}
		}
	};
</script>

<style lang="scss">
	.info-head {
		.head-nav {
			width: 100%;
			height: var(--status-bar-height);
		}

		.head-nav.active {
			padding-top: 40rpx;
		}
	}

	.captcha {
		width: 170rpx;
		height: 50rpx;
	}

	.info-wrap {
		margin-top: 10px;
	}

	.info-list-cell {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 0;
		position: relative;
		line-height: 50rpx;
		background-color: #fff;
		box-sizing: border-box;
		width: 710rpx;
		margin: 0 auto;
		padding-right: 30rpx;
		// &:first-child {
		// 	padding: 28rpx 30rpx;
		// }

		.cell-tip1 {
			margin-right: 40rpx;
		}

		&.log-out-btn {
			margin-top: 40rpx;

			.cell-tit {
				margin: auto;
			}
		}

		.cell-tit {
			margin-left: 15px;
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
			&:first-of-type {
				width: auto !important;
			}

			margin-right: auto;
			width: 250rpx;
			font-size: $font-size-base;
			padding: 0;
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
			border-radius: 94rpx;
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
</style>
