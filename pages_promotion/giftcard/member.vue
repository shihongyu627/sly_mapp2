<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="page">
		<view class="ns-adv">
			<image :src="$util.img('public/uniapp/giftcard/member-bg.png')" mode="widthFix"></image>
		</view>
		
		<view class="member">
			<view class="member-info" v-if="memberInfo">
				<view class="member-headimg">
					<image :src="memberInfo.headimg ? $util.img(memberInfo.headimg) : $util.getDefaultImage().head" mode="widthFix" @error="memberInfo.headimg = $util.getDefaultImage().head"></image>
				</view>
				<view class="member-name">
					<view class="nickname">{{ memberInfo.nickname}}</view>
					<view class="mobile" v-if="memberInfo.mobile">手机号码：{{ memberInfo.mobile}}</view>
				</view>
				
			</view>
			<view class="member-info" v-else @click="login">
				<view class="member-headimg">
					<image :src="$util.getDefaultImage().head"mode="widthFix" ></image>
				</view>
				<view class="member-name">登录/注册</view>
			</view>
		</view>
		
		<view class="member-box">
			<view class="member-action">
				<view class="action-item" @click="redirectTo('/pages_promotion/giftcard/receive_list')" :style="{'background-image' : 'url('+$util.img('public/uniapp/giftcard/icon-card-yellow.png')+') '}">
					<view class="title">收到的卡片</view>
					<view class="desc">可赠送他人</view>
				</view>
				<view class="action-item" @click="redirectTo('/pages_promotion/giftcard/give_list')" :style="{'background-image' : 'url('+$util.img('public/uniapp/giftcard/icon-card-red.png')+') '}">
					<view class="title">送出的卡片</view>
					<view class="desc">查看送出的卡片</view>
				</view>
			</view>
		</view>
		
		<view class="member-tool">
			<view class="tool-title">常用功能</view>
			<view class="tool-list">
				<view class="tool-item" @click="redirectTo('/pages_promotion/giftcard/order_list')">
					<view class="tool-left">
						<image :src="$util.img('public/uniapp/giftcard/icon-history.png')" mode="widthFix"></image>
						<text class="tool-name">购买历史</text>
					</view>
					<view class="tool-icon">
						<text class="iconfont iconright"></text>
					</view>
				</view>
				<view class="tool-item" @click="redirectTo('/pages_promotion/giftcard/list')">
					<view class="tool-left" >
						<image :src="$util.img('public/uniapp/giftcard/member-icon-card.png')" mode="widthFix"></image>
						<text class="tool-name">我的卡包</text>
					</view>
					<view class="tool-icon">
						<text class="iconfont iconright"></text>
					</view>
				</view>
				<view class="tool-item" @click="redirectTo('/pages_promotion/giftcard/exchange')">
					<view class="tool-left" >
						<image :src="$util.img('public/uniapp/giftcard/member-icon-exchange.png')" mode="widthFix"></image>
						<text class="tool-name">卡密激活</text>
					</view>
					<view class="tool-icon">
						<text class="iconfont iconright"></text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="tab-bar">
			<view class="tabbar-border"></view>
			<view class="item" v-for="(item, index) in tabList" :key="index" @click="tabRedirectTo(item.link)">
				<view class="bd">
					<view class="icon">
						<image :src="$util.img(item.selected ? item.selectedPath : item.path)" />
					</view>
					<view class="label" :style="{color: item.selected ? themeStyle.giftcard.giftcard_promotion_color : ''}">
						{{ item.text }}
					</view>
				</view>
			</view>
		</view>
		<view class="tab-bar-placeholder"></view>
		<ns-login ref="login"></ns-login>
		<!-- 悬浮按钮 -->
		<view class="fixed-box" :style="{ height: fixBtnShow ? '330rpx' : '120rpx' }">
			<!-- 规则 -->
			<view class="btn-item" v-if="fixBtnShow" @click="$util.redirectTo('/pages/index/index')">
				<text class="iconfont iconshouye1"></text>
				<view>首页</view>
			</view>
			<view class="btn-item" v-if="fixBtnShow" @click="$util.redirectTo('/pages/member/index')">
				<text class="iconfont iconyonghu"></text>
				<view>我的</view>
			</view>
		
			<view class="btn-item icon-xiala" v-if="fixBtnShow" @click="fixBtnShow ? (fixBtnShow = false) : (fixBtnShow = true)"><text class="iconfont iconunfold"></text></view>
			<view class="btn-item switch" v-else :class="{ show: fixBtnShow }" @click="fixBtnShow ? (fixBtnShow = false) : (fixBtnShow = true)">
				<view class="">快捷</view>
				<view>导航</view>
			</view>
		</view>
		
	</view>
</template>

<script>
import nsAdv from '@/components/ns-adv/ns-adv.vue';
export default {
	components: {
		nsAdv
	},
	data() {
		return {
			memberInfo: null,
			tabList:[
				{
					'link' : '/pages_promotion/giftcard/index',
					'text' : '首页',
					'path' : 'public/uniapp/giftcard/icon-index.png',
					'selectedPath' : 'public/uniapp/giftcard/icon-index-selectd.png',
					'selected' : false,
				},
				{
					'link' : '/pages_promotion/giftcard/list',
					'text' : '卡包',
					'path' : 'public/uniapp/giftcard/icon-card.png',
					'selectedPath' : 'public/uniapp/giftcard/icon-card-selected.png',
					'selected' : false,
				},
				{
					'link' : '/pages_promotion/giftcard/member',
					'text' : '我的',
					'path' : 'public/uniapp/giftcard/icon-member.png',
					'selectedPath' : 'public/uniapp/giftcard/icon-member-selected.png',
					'selected' : true,
				},
				
			],
			fixBtnShow: false,
		};
	},
	onLoad(option) {
		 if (uni.getStorageSync('token')) this.getMemberInfo();
	},
	onShow() {
		
	},
	methods: {
		 /**
		  * 查询会员信息
		  */
		 getMemberInfo() {
		 	this.$api.sendRequest({
		 		url: '/api/member/info',
		 		data: {},
		 		success: res => {
		 			if (res.code == 0) {
		 				if (!this.memberInfo) this.memberInfo = res.data;
		 				else Object.assign(this.memberInfo, res.data);
						
						if(this.memberInfo && this.memberInfo.mobile) this.memberInfo.mobile = this.mobileHide(this.memberInfo.mobile)
		 			}
		 		}
		 	});
		 },
		 mobileHide(str) {
		 	return str.substr(0, 3) + '****' + str.substr(str.length - 4, 4);
		 },
		redirectTo(link) {
			if (!uni.getStorageSync('token')) {
				var url = link;
				this.$refs.login.open(url);
			}else{
				this.$util.redirectTo(link);
			}
		},
		tabRedirectTo(link) {
			if (!uni.getStorageSync('token')) {
				var url = link;
				this.$refs.login.open(url);
			}else{
				this.$util.redirectTo(link, {}, 'reLaunch');
			}
		},
		login(){
			if (!uni.getStorageSync('token')) {
				var url = '/pages_promotion/giftcard/member';
				this.$refs.login.open(url);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.page{
	background: #F9FBFF;
	min-height: 100vh;
}

.ns-adv {
	margin: 0;
	border-radius: 0;
	line-height: 1;
	height: fit-content;
	background: #F9FBFF;
	width: 100%;
	position: absolute;
	image {
		width: 100%;
	}
}
.member-tool{
	margin: 24rpx 50rpx;
	background-color: #FFFFFF;
	box-shadow: 0px 6rpx 18rpx 0px rgba(38,56,120,0.06);
	border-radius: 18rpx;
	display: flex;
	flex-direction: column;
	position: relative;
	padding: 24rpx 30rpx;
	.tool-title{
		font-size: $font-size-toolbar;
		font-weight: bold;
	}
	.tool-list{
		margin-top: 20rpx;
		.tool-item{
			display: flex;
			justify-content: space-between;
			padding: 20rpx 0;
			color: #333333;
			.iconfont{
				color: #333333;
			}
			.tool-left{
				display: flex;
				align-items: center;
				image{
					width: 60rpx;
					max-height: 60rpx;
				}
				.tool-name{
					color: #333333;
					margin-left: 14rpx;
					font-size: 26rpx;
					line-height: 1;
					font-weight: bold;
				}
			}
		}
	}
}
.member{
	margin: 0 25px;
	padding: 40rpx 0;
	.member-info{
		position: relative;
		display: flex;
		align-items: center;
		.member-headimg{
			width: 100rpx;
			height: 100rpx;
			border: 2rpx solid #FFFFFF;
			border-radius: 50%;
			overflow: hidden;
			background-color: #fff;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.member-name{
			text-align: left;
			font-size: 32rpx;
			font-weight: bold;
			margin-left: 20rpx;
			.nickname{
				font-size: 32rpx;
				font-weight: bold;
			}
			.mobile{
				font-size: 24rpx;
				color: #666666;
				font-weight: 500;
			}
		}
	}
}
.member-box{
	margin: 0 50rpx;
	border-radius: 18rpx;
	// margin-top: -200rpx;
	display: flex;
	flex-direction: column;
	position: relative;
	
	.member-action{
		display: flex;
		margin-top: 20rpx;
		justify-content:space-between;
		.action-item{
			width: calc((100% - 22rpx) / 2);
			height: 140rpx;
			border-radius: 18rpx;
			display: flex;
			align-items: flex-start;
			justify-content: center;
			flex-direction: column;
			background-size: 100% 100%;
			padding-left: 25rpx;
			box-sizing: border-box;
			image{
				width: 40rpx;
				max-height: 36rpx;
				margin-bottom: 20rpx;
			}
			.title{
				font-weight: 600;
				color: #FFFFFF;
				font-size: 28rpx;
			}
			.desc{
				font-weight: 500;
				color: #FFFFFF;
				font-size: 22rpx;
			}
		}
		
	}
}


.tab-bar {
	background-color: #fff;
	box-sizing: border-box;
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	z-index: 998;
	display: flex;
	border-top: 2rpx solid #f5f5f5;
	padding-bottom: 0;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);

	.tabbar-border {
		background-color: rgba(255, 255, 255, 0.329412);
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 2rpx;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.item {
		display: flex;
		align-items: center;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		flex: 1;
		flex-direction: column;
		padding-bottom: 10rpx;
		box-sizing: border-box;

		.bd {
			position: relative;
			height: 100rpx;
			flex-direction: column;
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.icon {
				position: relative;
				display: inline-block;
				margin-top: 10rpx;
				width: 40rpx;
				height: 40rpx;
				font-size: 40rpx;
				image {
					width: 100%;
					height: 100%;
					display: block;
				}
				> view {
					height: inherit;
					display: flex;
					align-items: center;
				}
				 
			}

			.label {
				position: relative;
				text-align: center;
				font-size: 24rpx;
				line-height: 1;
				margin-top: 12rpx;
			}
		}
	}
}
.tab-bar-placeholder {
	padding-bottom: calc(constant(safe-area-inset-bottom) + 112rpx);
	padding-bottom: calc(env(safe-area-inset-bottom) + 112rpx);
}
.fixed-box {
		position: fixed;
		right: 20rpx;
		bottom: 300rpx;
		z-index: 10;
		background: #fff;
		box-shadow: 2rpx 2rpx 22rpx rgba(0, 0, 0, 0.3);
		border-radius: 120rpx;
		padding: 20rpx 0;
		display: flex;
		justify-content: center;
		flex-direction: column;
		width: 120rpx;
		box-sizing: border-box;
		transition: 0.3s;
		overflow: hidden;
		.btn-item {
			display: flex;
			justify-content: center;
			text-align: center;
			flex-direction: column;
			line-height: 1;
			margin: 14rpx 0;
			transition: 0.1s;
			text {
				font-size: 44rpx;
				font-weight: bold;
			}
			view {
				font-size: 26rpx;
				font-weight: bold;
			}
			&.show {
				transform: rotate(180deg);
			}
			&.switch {
			}
			&.icon-xiala {
				margin: 0;
				margin-top: 0.10rpx;
			}
		}
	}
</style>
