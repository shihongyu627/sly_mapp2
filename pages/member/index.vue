<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view :style="{ backgroundColor: bgColor, minHeight: 'calc(100vh - 55px)' }" class="page-img">
		<view class="header-box">
			<view class="header-info" v-if="memberInfo" @click="goHref('/pages_tool/member/info')">
				<image class="headimg" :src="$util.loadimg(memberInfo.headimg)"></image>
				<view class="header-right">
					<view class="name">
						{{ memberInfo.nickname }}
					</view>
					<view class="label">
						{{ memberInfo.mobile }}
					</view>
					<view class="label">
						{{ memberLabel(memberInfo.member_label_name) }}
					</view>
				</view>

			</view>
			<view class="header-info" v-if="!memberInfo">
				<view class="header-right" @click="getWxAuth">
					<view class="name">
						登录/注册
					</view>
					<view class="label">
						点击登录 享受更多精彩信息
					</view>
				</view>

			</view>
			<view class="header-data">
				<view class="header-item" @click="goHref('/pages_tool/member/point')">
					<view class="data-num">
						{{ memberInfo ? (parseFloat(memberInfo.point) + parseFloat(memberInfo.balance_money)).toFixed(2) : '0' }}
					</view>
					<view class="data-text">
						我的柚币
					</view>
				</view>
				<view class="data-br">
				</view>
				<view class="header-item" @click="goHref('/pages_tool/member/card/list/list')">
					<view class="data-num">
						{{ memberInfo ? parseFloat(memberInfo.subcard_count) : '0' }}
					</view>
					<view class="data-text">
						体验卡
					</view>
				</view>
				<view class="data-br">
				</view>
				<view class="header-item" @click="goHref('/pages_tool/device/device')">
					<view class="data-num">
						{{ memberInfo && memberInfo.coupon_num != undefined ? memberInfo.coupon_num : '0' }}
					</view>
					<view class="data-text">
						我的设备
					</view>
				</view>
			</view>

		</view>
		<view class="footer-box">
			<view class="header-invite" v-if="memberInfo.is_store == 1||memberInfo.is_dealer == 1">
				<view class="invite-box">
					<view class="invite-item" @click="applyStore()" v-if="memberInfo.is_store == 1">
						<image class="invite-icon"
							src="https://qiniu.shanliangyou888.com/upload/1/common/images/20221221/20221221075032167162343252934.png"
							mode="aspectFit"></image>
						<view class="invite-right">
							<view class="invite-name">
								门店工作台
							</view>
							<view class="invite-txt">
								数字化管理
							</view>
						</view>
					</view>
					<view class="invite-item" @click="applyDealer()" v-if="memberInfo.is_dealer == 1">
						<image class="invite-icon"
							src="https://qiniu.shanliangyou888.com/upload/1/common/images/20221221/20221221075032167162343253255.png"
							mode="aspectFit"></image>
						<view class="invite-right">
							<view class="invite-name">
								经销商工作台
							</view>
							<view class="invite-txt">
								携手闪亮柚
							</view>
						</view>
					</view>
				</view>
			</view>
			<swiper class="adv-box" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				:duration="duration">
				<swiper-item class="adv-img" @click="goHref(item.adv_url)" v-for="(item,pageIndex) in adv_list"
					:key="pageIndex">
					<image class="adv-img" :src="$util.loadimg(item.adv_image)"></image>
				</swiper-item>
			</swiper>
			<view class="menu-box">
				<view v-for="(item,index) in menuList" :key="index">
					<ns-contact v-if="item.url=='kefu'">
						<view class="menu-item">
							<image class="menu-icon" :src="item.icon" mode="aspectFit"></image>
							<view class="menu-name">
								{{item.name}}
							</view>
						</view>
					</ns-contact>
					<view class="menu-item" v-if="item.url!='kefu'" @click="goHref(item.url)">
						<image class="menu-icon" :src="item.icon" mode="aspectFit"></image>
						<view class="menu-name">
							{{item.name}}
						</view>
					</view>
				</view>

			</view>
			<view class="menu-box" v-if="memberInfo.is_verifier == 1">
				<view v-for="(item,index) in menuListWrok" :key="index">
					<ns-contact v-if="item.url=='kefu'">
						<view class="menu-item">
							<image class="menu-icon" :src="item.icon" mode="aspectFit"></image>
							<view class="menu-name">
								{{item.name}}
							</view>
						</view>
					</ns-contact>
					<view class="menu-item" v-if="item.url!='kefu'" @click="goHref(item.url)">
						<image class="menu-icon" :src="item.icon" mode="aspectFit"></image>
						<view class="menu-name">
							{{item.name}}
						</view>
					</view>
				</view>
			
			</view>
		</view>

		<!-- 底部tabBar -->
		<view class="page-bottom">
			<diy-bottom-nav @callback="callback"></diy-bottom-nav>
		</view>
		<bind-mobile ref="bindMobile"></bind-mobile>
		<ns-login ref="login"></ns-login>
		<!-- <loading-cover ref="loadingCover"></loading-cover> -->
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import nsNavbar from '@/components/ns-navbar/ns-navbar.vue';
	import index from './public/js/index.js';
	export default {
		components: {
			uniPopup,
			nsNavbar
		},
		mixins: [index]
	};
</script>

<style lang="scss">
	@import './public/css/index.scss';
</style>

<style scoped>
	.header-box {
		width: 100%;
		height: 265px;
		background: #1189F4;
		opacity: 1;
		border-bottom-right-radius: 20px;
		border-bottom-left-radius: 20px;
		padding-top: 80px;
		box-sizing: border-box;
	}

	.header-info {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 20rpx;
		box-sizing: border-box;
	}

	.headimg {
		width: 60px;
		height: 60px;
		background: #ccc;
		border-radius: 60px;
	}

	.header-right {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-left: 15px;
	}

	.name {
		font-size: 20px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FFFFFF;
		opacity: 1;
	}

	.label {
		font-size: 13px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		opacity: 0.6;
	}

	.header-data {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		margin-top: 10px;
	}

	.header-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 120px;
	}

	.data-num {
		font-size: 18px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FFFFFF;
		opacity: 1;
	}

	.data-text {
		font-size: 10px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		opacity: 1;
	}

	.data-br {
		width: 0px;
		height: 39px;
		border: 1px solid #E4E4E4;
		opacity: 0.2;
	}

	.footer-box {
		margin-top: -60rpx;
	}

	.header-invite {
		width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		margin-bottom: 20rpx;
		overflow: hidden;
	}

	.invite-title {
		height: 40px;
		background: #FFFFFF;
		opacity: 1;
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 40px;
		color: #000000;
		opacity: 1;
		margin-left: 14px;
	}

	.invite-box {
		width: 710rpx;
		height: 150rpx;
		background: #FFFFFF;
		opacity: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding-left: 40rpx;
		padding-right: 80rpx;
		box-sizing: border-box;
	}

	.invite-item {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.invite-icon {
		width: 42px;
		height: 42px;
		margin-right: 10px;
	}

	.invite-name {
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
	}

	.invite-txt {
		font-size: 11px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #A6ABBA;
		opacity: 1;
	}

	.adv-box {
		width: 710rpx;
		border-radius: 10px;
		height: 220rpx;
		margin: 0 auto;
		overflow: hidden;
	}

	.adv-img {
		width: 710rpx;
		border-radius: 10px;
		height: 220rpx;
	}

	.menu-box {
		width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		padding-left: 20rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 20rpx;
		padding-bottom: 50rpx;
		flex-wrap: wrap;
	}

	.menu-item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 50rpx;
		width: 142rpx;
		margin-right: 30rpx;
	}

	.menu-icon {
		width: 60rpx;
		height: 60rpx;
	}

	.menu-name {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #34373F;
		opacity: 1;
		margin-top: 10rpx;
	}

	.wap-floating>>>.uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
		background: none !important;
	}

	/deep/ .placeholder {
		height: 0;
	}

	/deep/::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
		display: none;
	}

	/deep/ .ns-copyright-info {
		margin-top: 40rpx;
		margin-bottom: 0;
	}
</style>
