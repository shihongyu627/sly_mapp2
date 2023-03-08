<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="page">
		<view class="adv">
			<ns-adv  keyword="NS_GIFTCARD"></ns-adv>
		</view>
		<view class="card-box" v-for="(item, index) in cardList">
			<view class="card-category-title" :style="{color:item.font_color}">
				<text class="before-line" :style="{backgroundColor:item.font_color}"></text>
				<text>{{item.category_name}}</text>
				<text class="after-line" :style="{backgroundColor:item.font_color}"></text>
			</view>
			<view class="card-list">
				<view class="card-item" v-for="(card, cardIndex) in item.giftcard_list" @click="toDetail(card)">
					<view class="card-img">
						<image :src="$util.img(card.card_cover.split(',')[0])" mode="aspectFill"></image>
						<view class="card-label" v-if="card.card_right_type == 'balance'">
							{{card.balance}}元储值卡
						</view>
						<view class="card-label-img" v-if="card.card_right_type == 'goods'">
							<image :src="$util.img('public/uniapp/giftcard/giftcard-label.png')" mode="heightFix"></image>
						</view>
					</view>
					<view class="card-title">{{card.card_name}}</view>
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
		
		<loading-cover ref="loadingCover"></loading-cover>
		<view class="tab-bar-placeholder"></view>
		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
import nsAdv from '@/components/ns-adv/ns-adv.vue';
// 获取系统状态栏的高度
let systemInfo = uni.getSystemInfoSync();
let menuButtonInfo = {};
// 如果是小程序，获取右上角胶囊的尺寸信息，避免导航栏右侧内容与胶囊重叠(支付宝小程序非本API，尚未兼容)
// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
menuButtonInfo = uni.getMenuButtonBoundingClientRect();
// #endif
export default {
	components: {
		nsAdv
	},
	data() {
		return {
			cardList: [],
			tabList:[
				{
					'link' : '/pages_promotion/giftcard/index',
					'text' : '首页',
					'path' : 'public/uniapp/giftcard/icon-index.png',
					'selectedPath' : 'public/uniapp/giftcard/icon-index-selected.png',
					'selected' : true,
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
					'selected' : false,
				},
			],
			fixBtnShow: false,
		};
	},
	computed: {
		// 导航栏内部盒子的样式
		navbarInnerStyle() {
			let style = '';
			// #ifdef MP
			style += 'margin-top:' + (menuButtonInfo.height * 2) + 'rpx;';
			// #endif
			return style;
		},
	},
	onLoad(option) {
		//获取memberId
		this.$util
			.getMemberId()
			.then(resolve => {
				this.memberId = resolve;
			})
			.catch(reject => {
				// #ifdef MP-WEIXIN
				// #endif
			});
		//小程序分享接收source_member
		if (option.source_member) {
			uni.setStorageSync('source_member', option.source_member);
		}
	},
	onShow() {
		//记录分享关系
		if (uni.getStorageSync('token') && uni.getStorageSync('source_member')) {
			this.$util.onSourceMember(uni.getStorageSync('source_member'));
		}
		//小程序分享
		// #ifdef MP-WEIXIN
		this.$util.getMpShare().then(res => {
			this.mpShareData = res;
		});
		// #endif
		this.getData();
	},
	//分享给好友
	onShareAppMessage() {
		return this.mpShareData.appMessage;
	},
	//分享到朋友圈
	onShareTimeline() {
		return this.mpShareData.timeLine;
	},
	methods: {
		//切换状态
		changeOrder(order) {
			this.list = [];
			this.order = order;
			this.$refs.mescroll.refresh();
		},
		getData() {
			
			this.$api.sendRequest({
				url: '/giftcard/api/giftcard/giftcardlistbycategory',
				success: res => {
					this.cardList = res.data;
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		toDetail(item) {
			if (!uni.getStorageSync('token')) {
				var url = '/pages_promotion/giftcard/index';
				this.$refs.login.open(url);
			} else {
				this.$util.redirectTo('/pages_promotion/giftcard/detail', {
					id: item.giftcard_id
				});
			}
		},
		redirectTo(link) {
			this.$util.redirectTo(link);
		},
		tabRedirectTo(link) {
			if (!uni.getStorageSync('token')) {
				var url = link;
				this.$refs.login.open(url);
			}else{
				
				this.$util.redirectTo(link, {}, 'reLaunch');
			}
		},
	}
};
</script>

<style lang="scss" scoped>
.page{
	background: #F9FBFF;
	min-height: 100vh;
}

.bg{
	margin: 0;
	border-radius: 0;
	line-height: 1;
	height: fit-content;
	background: #F9FBFF;
	width: 100%;
	image {
		width: 100%;
	}
}

/deep/ .fixed {
	position: relative;
	top: 0;
}

/deep/ .empty {
	margin-top: 0 !important;
}

.topic-pic {
	height: 300rpx;

	image {
		height: 300rpx;
	}
}
.card-box{
	padding: 24rpx;
	.card-category-title{
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: $font-size-base;
		color: #222222;
		font-weight: 500;
		padding: 0;
		font-weight: bold;
		.before-line,.after-line{
			width: 30rpx;
			height: 4rpx;
			margin: 0 10rpx;
		}
		
	}
	.card-list{
		margin-top: 20rpx;
		display: flex;
		flex-wrap: wrap;
		.card-item{
			border-radius: $border-radius;
			background-color: #ffffff;
			margin-right: 22rpx;
			width: calc((100% - 22rpx) / 2);
			overflow: hidden;
			margin-bottom: 22rpx;
			position: relative;
			.card-img{
				width: 100%;
				height: 220rpx;
				position: relative;
				overflow: hidden;
				border-radius: 18rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.card-title{
				text-align: center;
				padding: 8rpx 0;
				font-size: $font-size-sub;
			}
			&:nth-child(2n){
				margin-right: 0;
			}
			.card-label{
				position: absolute;
				line-height: 1;
				padding: 6rpx 10rpx;
				background-color: #ff2c27;
				color: #FFFFFF;
				right: 0;
				bottom: 0;
				border-top-left-radius: 20rpx;
				border-bottom-right-radius: 0;
				font-size: $font-size-base;
				font-weight: bold;
			}
			.card-label-img{
				position: absolute;
				line-height: 1;
				right: 0;
				bottom: -4rpx;
				width: 100rpx;
				image{
					width: 100%;
					height: 100rpx;
				}
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
<style>
	
	.adv{
		margin: 20rpx 20rpx 30rpx;
		border-radius: 24rpx;
		overflow: hidden;
	}
	.adv >>> image{
		max-height: 100%;
		width: 100%;
		border-radius: 24rpx;
	}
	
	 
</style>