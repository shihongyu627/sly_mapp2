<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<!-- <view class="info-head" @click="NavReturn()">
			<view class="head-nav" :class="{active:isIphoneX}"></view>
			<!-- <uni-nav-bar left-icon="back" :title="customNavTitle" :border="false"></uni-nav-bar> -->
		<view v-if="indent == 'all'" class="info-wrap">
			<!-- 头像 -->
			<view @click="headImage" class="info-list-cell info-item info-list-con" hover-class="cell-hover">
				<text class="cell-tit">{{ $lang('headImg') }}</text>
				<view class="info-list-head cell-tip">
					<image
						:src="memberInfo.headimg ? $util.img(memberInfo.headimg) : $util.getDefaultImage().head"
						@error="memberInfo.headimg = $util.getDefaultImage().head"
						mode="aspectFill"
					/>
				</view>
				<text class="cell-more"></text>
			</view>
			<!-- 账号 -->
		<!-- 	<view class="info-list-cell info-list-con" hover-class="cell-hover" v-if="memberInfo.is_edit_username == 1" @click="modifyInfo('username')">
				<text class="cell-tit">{{ $lang('account') }}</text>
				<text class="cell-tip">{{ memberInfoformData.number }}</text>
				<text class="cell-more"></text>
			</view> -->
			<!-- 账号 -->
		<!-- 	<view class="info-list-cell info-list-con" hover-class="cell-hover" v-else>
				<text class="cell-tit">{{ $lang('account') }}</text>
				<text class="cell-tip cell-tip1">{{ memberInfoformData.number }}</text>
			</view> -->
			<!-- 昵称 -->
			<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('name')">
				<text class="cell-tit">{{ $lang('nickname') }}</text>
				<text class="cell-tip">{{ memberInfoformData.nickName }}</text>
				<text class="cell-more"></text>
			</view>
			<!-- 真实姓名 -->
		<!-- 	<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('realName')">
				<text class="cell-tit">{{ $lang('realName') }}</text>
				<text class="cell-tip">{{ memberInfoformData.realName }}</text>
				<text class="cell-more"></text>
			</view> -->
			<!-- 性别 -->
		<!-- 	<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('sex')">
				<text class="cell-tit">{{ $lang('sex') }}</text>
				<text class="cell-tip">{{ memberInfoformData.sex }}</text>
				<text class="cell-more"></text>
			</view> -->
			<!-- 生日 -->
		<!-- 	<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('birthday')">
				<text class="cell-tit">{{ $lang('birthday') }}</text>
				<text class="cell-tip">{{ memberInfoformData.birthday }}</text>
				<text class="cell-more"></text>
			</view> -->
			<!-- 手机号 -->
			<view class="info-list-cell info-list-con" @click="modifyInfo('mobile')">
				<text class="cell-tit">{{ $lang('mobilePhone') }}</text>
				<text v-if="memberInfoformData.user_tel == ''" class="cell-tip">{{ $lang('bindMobile') }}</text>
				<text v-else class="cell-tip">{{ memberInfoformData.mobile }}</text>
				<text class="cell-more"></text>
			</view>
			<!-- 密码 -->
		<!-- 	<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('password')">
				<text class="cell-tit">{{ $lang('password') }}</text>
				<text class="cell-tip">{{ memberInfo.password ? $lang('modify') : $lang('noset') }}</text>
				<text class="cell-more"></text>
			</view> -->
			<!-- 支付密码 -->
			<!-- <view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('paypassword')">
				<text class="cell-tit">{{ $lang('paypassword') }}</text>
				<text class="cell-more"></text>
			</view> -->
			
			<!-- <view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('address')">
				<text class="cell-tit">所在地址</text>
				<text class="cell-tip" v-if="memberInfo.full_address">{{ memberInfo.full_address }} {{ memberInfo.address }}</text>
				<text class="cell-tip" v-else>去设置</text>
				<text class="cell-more"></text>
			</view> -->

			<!-- 注销 -->
	<!-- 		<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('cancellation')" v-if="addonIsExist.membercancel && memberConfig.is_enable == 1">
				<text class="cell-tit">{{ $lang('cancellation') }}</text>
				<text class="cell-tip">{{ $lang('modify') }}</text>
				<text class="cell-more"></text>
			</view> -->

			<!-- 语言 -->
			<!-- <view class="info-list-cell info-item info-list-con" hover-class="cell-hover" @click="modifyInfo('language')">
				<text class="cell-tit">{{ $lang('lang') }}</text>
				<text class="cell-tip">{{ langList[langIndex].name }}</text>
				<text class="cell-more"></text>
			</view> -->
			<!-- 退出登录 -->
			<!-- <view class="info-list-cell log-out-btn" >
				<text class="cell-tit color-base-text"></text>
			</view> -->
			<!-- #ifdef H5 -->
			<view class="save-item" @click="logout" v-if="!$util.isWeiXin()">
				<button type="primary">{{ $lang('logout') }}</button>
			</view>
			<!-- #endif -->
		</view>
		<bind-mobile ref="bindMobile"></bind-mobile>
		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import info from './public/js/info.js';
import auth from 'common/js/auth.js';
import Config from 'common/js/config.js';
export default {
	components: {
		uniNavBar
	},
	data() {
		return {};
	},
	mixins: [info,auth],
	filters: {
		mobile(mobile) {
			return mobile.substring(0, 4 - 1) + '****' + mobile.substring(6 + 1);
		}
	}
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

	&.info-list-con ~ &.info-list-con:after {
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
</style>
