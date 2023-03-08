<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<!-- 修改职位 -->
		<view v-if="type == 'rankname'" class="edit-info edit-birthday-list">
			<view class="edit-info-box">
				<text class="info-name">选择职位</text>
				<picker @change="pickerEventGroup($event)" mode='selector' :range="groupList" range-key="name"
					:value="index">
						<view class="uni-input">{{ formData.rankname ? formData.rankname : '点击选择' }}</view>
				</picker>
				
			</view>
			<view class="save-item" @click="save('rankname')">
				<button type="primary">保存</button>
			</view>
		</view>
		<!-- 修改工资 -->
		<view v-if="type == 'money'" class="edit-info">
			<view class="edit-info-box">
				<text class="info-name">工资</text>
				<input class="uni-input info-content" type="number" placeholder="请输入基本工资" v-model="formData.base_salary" />
			</view>
			<view class="save-item" @click="save('money')">
				<button type="primary">保存</button>
			</view>
		</view>
		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
	import info from '../public/js/info.js';
	export default {
		components: {
		},
		data() {
			return {};
		},
		onload(data) {
		},
		mixins: [info],
	};
</script>

<style lang="scss">
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
			flex: 1;
			width: 0;
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

		.pick-regions {
			flex: 1;
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
</style>
