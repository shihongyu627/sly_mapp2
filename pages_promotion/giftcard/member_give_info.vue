<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="page" v-if="cardInfo">

		<view class="bg-box" :style="{backgroundImage:'url('+$util.img('public/uniapp/giftcard/give_bg_1.png')+')'}">
			<view class="card-img">
				<image :src="$util.img(cardimg())" mode="widthFix"></image>
			</view>
			
			<view class="card-box">
				 <view class="member-info">
					 <view class="headimg">
						 <image :src="$util.img(cardInfo.to_member_headimg ? cardInfo.to_member_headimg : $util.getDefaultImage().head)" @error="cardInfo.to_member_headimg = $util.getDefaultImage().head" mode="aspectFill"></image>
					 </view>
					 <view class="member">
						 <text class="member-name">{{cardInfo.to_member_nickname}}</text>
					 </view>
				 </view>
				 
				 <view class="desc">
					 <view class="title">
						领取了您的「{{cardInfo.card_name}}」
					 </view>
					 <view class="content">{{cardInfo.blessing}}</view>
				 </view>
			</view>
		</view>
		<image class="bg-img" :src="$util.img('public/uniapp/giftcard/give_bg_2.png')" mode="widthFix"></image>
		<block >
			<button class="btn" type="primary">已领取</button>
		</block>
	 
		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			memberCardId:0,
			cardInfo: null,
			goodsOpen:false,
		};
	},
	computed: {
	 
	},
	onLoad(option) {
		//小程序分享接收source_member
		if (option.source_member) {
			uni.setStorageSync('source_member', option.source_member);
		}
		if(option.member_card_id) this.memberCardId = option.member_card_id;
		// 小程序扫码进入，接收source_member
		if (option.scene) {
			var sceneParams = decodeURIComponent(option.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('member_card_id') != -1) this.memberCardId = item.split('-')[1];
				});
			}
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
		cardimg(){
			if(this.cardInfo && this.cardInfo.card_cover.indexOf(',') != -1){
				return this.cardInfo.card_cover;
			}else{
				return 	this.cardInfo ? this.cardInfo.card_cover.split(',')[0] : '';
			}
		},
		getData() {
			this.$api.sendRequest({
				url: '/giftcard/api/membercard/detail',
				data:{'member_card_id' : this.memberCardId},
				success: res => {
					if(res.code >= 0){
						this.cardInfo = res.data;
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}else{
						this.$util.showToast({
							title: res.message,
							mask: true,
							duration: 2000
						});
						setTimeout(() => {
							this.$util.redirectTo('/pages_promotion/giftcard/member');
						}, 1500)
					}
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
			
		}
	 
	}
};
</script>

<style lang="scss" scoped>
.page{
	background: #ffffff;
	min-height: 100vh;
	
	box-sizing: border-box;
}
.bg-box{
	background-color: #f6f9ff;
	background-repeat: no-repeat;
	background-size: 100%;
	padding: 30rpx;
}
.bg-img{
	background-color: #f6f9ff;
	width: 100%;
	max-height: 100rpx;
}
.member-box{
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 20rpx;
	image{
		width: 44rpx;
		height: 44rpx;
		border-radius: 6rpx;
	}
	view{
		font-size: 30rpx;
		margin-left: 10rpx;
	}
	
}
.card-status{
	margin: 15rpx auto;
	font-size: 36rpx;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	image{
		width: 44rpx;
		height: 44rpx;
		margin-right: 15rpx;
	}
}
.card-img{
	margin: 20rpx auto;
	width: 96%;
	overflow: hidden;
	image{
		width: 100%;
		border-radius: 18rpx;
		margin: 0;
	}
}
.card-title{
	font-size: 30rpx;
	color: #444444;
	display: flex;
	justify-content: center;
	>text{
		color: var(--price-color);
	}
	
}

.card-box{
	display: flex;
	padding-top: 40rpx;
	margin-top: 40rpx;
	flex-direction: column;
	.member-info{
		display: flex;
		flex-direction: column;
		align-items: center;
		
		.headimg{
			width: 110rpx;
			height: 110rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			image{
				width: 100%;
				max-height: 110rpx;
				border-radius: 50%;
				border: 2rpx solid #FFFFFF;
			}
		}
		.member{
			width: 100%;
			overflow: hidden;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1; 
			justify-content: center;
			text-align: center;
			margin-top: 10rpx;
			.member-name{
				font-size: 32rpx;
				color: #666666;
			}
		}
	}
	.desc{
		margin-top: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		.title{
			font-size: 30rpx;
			font-weight: bold;
			text-align: center;
		}
		.content{
			text-align: center;
			font-size: 30rpx;
			color: #888888;
		}
	}

}
.goods-list{
		border-top: 0rpx solid #F0F0F0;
		padding: 30rpx 0;
		display: flex;
		.goods-left{
			display: flex;
			width: calc(100% - 108rpx);
			overflow: hidden;
			white-space:nowrap;
			position: relative;
			align-items: center;
			image{
				width: 108rpx;
				max-height: 108rpx;
				margin-right: 22rpx;
				flex-shrink: 0;
				border-radius: 16rpx;
			}
			&:after{
				content: ' ';
				box-shadow: -4rpx 0px 24rpx rgba(0,0,0,.8);
				width: 1rpx;
				height: 80rpx;
				right: -1rpx;
				top: 14rpx;
				position: absolute;
				background: rgba(255,255,255,0);
			}
		}
		.goods-more{
			width: 108rpx;
			height: 108rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 26rpx;
			position: relative;
			text{
				font-size: 28rpx;
				line-height: 1;
			}
		
		}
		&.goodsOpen{
			flex-direction: column;
			position: relative;
			.btn{
				position: absolute;
				right: 20rpx;
				top: 50rpx;
				font-size: 26rpx;
				display: flex;
				align-items: baseline;
				background-color: var(--giftcard-promotion-color);
				text{
					line-height: 1.1;
					font-size: 24rpx;
					margin-left: 8rpx;
				}
			}
		}
		.goods-item{
			display: flex;
			margin-bottom: 20rpx;
			.goods-image{
				width: 108rpx;
				height: 108rpx;
				overflow: hidden;
				border-radius: 18rpx;
				image{
					width: 108rpx;
					height: 108rpx;
					max-height: 108rpx;
				}
			}
			.goods-info{
				width: calc(100% - 268rpx);
				.goods-name{
					overflow: hidden;
					display: -webkit-box; 
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1; 
					line-height: 1.5;
					font-size: 28rpx;
				}
				.goods-num{
					margin-top: 20rpx;
					text{
						color: #666666;
						font-size: 24rpx;
						&:last-child{
							margin-left: 50rpx;
						}
					}
				}
			}
		}
	}
	.btn{
		width: 50%;
		margin: 40rpx auto;
		background-color: #F6F6F6!important;
		color: #999999!important;
		font-weight: bold;
	}
	.card-popup-layer{
		width: 500rpx;
		height: 400rpx;
		position: relative;
		padding: 20rpx;
		box-sizing: border-box;
		.head-wrap{
			width: 100%;
			text-align: right;
			text{
				font-size: 34rpx;
			}
		}
		.content{
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 32rpx;
			font-weight: bold;
			padding: 40rpx 0;
		}
		.button-box{
			margin-top: 10rpx;
			button{
				background-color: var(--giftcard-promotion-color);
			}
		}
	}
 
</style>