<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="page">
		<view class="detail-box">
			 <view class="title">文字祝福<text>(自定义)</text></view>
			 <view class="textarea">
				 <textarea maxlength="15" placeholder="赠你一份好礼，祝你每天都开心快乐！"  v-model="message"  placeholder-style="font-size:28rpx;color:#999999"></textarea>
			 </view>
			 
			 <view class="bottom-btn">
				 <button type="primary" @click="openSharePopup">送给朋友</button>
				 <button @click="$util.redirectTo('/pages_promotion/giftcard/list')">放入卡包</button>
			 </view>
		</view>
		<ns-login ref="login"></ns-login>
		
		<!-- 分享弹窗 -->
		<view @touchmove.prevent.stop>
			<uni-popup ref="sharePopup" type="bottom" class="share-popup">
				<view>
					<view class="share-title">分享</view>
					<view class="share-content">
						<!-- #ifdef MP -->
						<view class="share-box">
							<button class="share-btn" :plain="true" open-type="share">
								<view class="iconfont iconiconfenxianggeihaoyou"></view>
								<text>分享给好友</text>
							</button>
						</view>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<view class="share-box" v-if="$util.isWeiXin()">
							<button class="share-btn" @click="maskShow()" :plain="true">
								<view class="iconfont iconiconfenxianggeihaoyou"></view>
								<text>分享给好友</text>
							</button>
						</view>
						
						<view class="share-box" @click="copyUrl">
							<button class="share-btn" :plain="true">
								<view class="iconfont iconfuzhilianjie"></view>
								<text>复制链接</text>
							</button>
						</view>
						<!-- #endif -->
						<view class="share-box" @click="openPosterPopup">
							<button class="share-btn" :plain="true">
								<view class="iconfont iconpengyouquan"></view>
								<text>生成分享海报</text>
							</button>
						</view>
					</view>
					<view class="share-footer" @click="closeSharePopup"><text>取消分享</text></view>
				</view>
			</uni-popup>
		</view>
		
		<!-- 海报 -->
		<view @touchmove.prevent.stop>
			<uni-popup ref="posterPopup" type="bottom" class="poster-layer">
				<template v-if="poster != '-1'">
					<view>
						<view class="image-wrap"><image :src="$util.img(poster)" :show-menu-by-longpress="true" /></view>
						<!-- #ifdef MP || APP-PLUS  -->
						<view class="save" @click="saveGoodsPoster()">保存图片</view>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<view class="save">长按保存图片</view>
						<!-- #endif -->
					</view>
					<view class="close iconfont iconclose" @click="closePosterPopup()"></view>
				</template>
				<view v-else class="msg">{{ posterMsg }}</view>
			</uni-popup>
			
			<!-- 分享指示弹出 -->
			<view class="wechat-share" v-if="shareMask" @click="shareMask = false">
				
				<image :src="$util.img('public/uniapp/giftcard/wechat_share.png')" mode="widthFix"></image>
			</view>
			
		</view>
	</view>
</template>

<script>
export default {
	components: {
	},
	data() {
		return {
			memberCardId:0,
			cardInfo:null,
			message:'',
			memberId:0,
			token: null,
			poster: "-1", //海报
			posterMsg: "", //海报错误信息
			posterHeight: 0,
			no:'',
			shareMask:false,
		};
	},
	onLoad(option) {
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
		if (uni.getStorageSync('token')) {
			this.$util.getMemberId().then(resolve => {
				this.memberId = resolve;
				this.token = uni.getStorageSync('token');
			});
		}
		this.getData();
	},
	methods: {
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
		 },
		 maskShow(){
			 this.shareMask = true
			 this.closeSharePopup();
		 },
		 // 打开分享弹出层
		 openSharePopup() {
			let that = this;
			this.$api.sendRequest({
				url: '/giftcard/api/membercard/blessing',
				data: {
					'member_card_id': that.memberCardId,
					'blessing' : that.message ? that.message : '赠你一份好礼，祝你每天都开心快乐！',
				},
				success: res => {
					if(res.code >= 0){
						that.no = res.data;
						that.$refs.sharePopup.open();
						that.setPublicShare();
					}else{
						that.$util.showToast({
							title: res.message,
						});
					}
					
				},
				fail: err => {
					console.log(err)
				}
			});
		 	
		 },
		 // 关闭分享弹出层
		 closeSharePopup() {
		 	this.$refs.sharePopup.close();
		 },
		 copyUrl() {
		 	let text = '嘿！朋友送你一张礼品卡，快来领取吧~' + this.$config.h5Domain + '/pages_promotion/giftcard/give_info?no=' + this.no;
		 	if (this.memberId) text += '&source_member=' + this.memberId;
		 	this.$util.copy(text, () => {
		 		this.closeSharePopup();
		 	});
		 },
		 //-------------------------------------海报-------------------------------------
		 // 打开海报弹出层
		 openPosterPopup() {
		 	this.getGoodsPoster();
		 	this.$refs.sharePopup.close();
		 	this.$refs.posterPopup.open();
		 	if (this.poster != '-1') {
		 		setTimeout(() => {
		 			let view = uni.createSelectorQuery().in(this).select(".poster-layer .image-wrap");
		 			view.fields({
		 				size: true,
		 			}, data => {
		 				let posterWhith = data.width;
		 				let ratio = parseFloat((740 / posterWhith).toFixed(2));
		 				if (this.token != '') {
		 					this.posterHeight = parseInt(1240 / ratio);
		 				} else {
		 					this.posterHeight = parseInt(1100 / ratio);
		 				}
		 			}).exec();
		 		}, 100);
		 	}
		 },
		 // 关闭海报弹出层
		 closePosterPopup() {
		 	this.$refs.posterPopup.close();
		 },
		 /**
		  * 获取海报
		  */
		 getGoodsPoster() {
		 	uni.showLoading({
		 		'title' : '海报生成中...'
		 	})
		 	//活动海报信息
		 	let posterParams = {
				no : this.no
		 	};
		 	
		 	if (this.memberId) posterParams.source_member = this.memberId;
		 
		 	this.$api.sendRequest({
		 		url: '/giftcard/api/membercard/poster',
		 		data: {
		 			page: '/pages_promotion/giftcard/give_info',
		 			qrcode_param: JSON.stringify(posterParams)
		 		},
		 		success: res => {
		 			if (res.code == 0) {
		 				this.poster = res.data.path + "?time=" + new Date().getTime();
		 			} else {
		 				this.posterMsg = res.message;
		 			}
		 			uni.hideLoading();
		 		},
		 		fail: err => {
		 			uni.hideLoading();
		 		}
		 	});
		 },
		 /**
		  * 设置公众号分享
		  */
		 setPublicShare(){
		 	let shareUrl = this.$config.h5Domain + '/pages_promotion/giftcard/give_info?no=' + this.no;
		 	if (this.memberId) shareUrl += '&source_member=' + this.memberId;
		 
		 	this.$util.setPublicShare({
		 		title: this.cardInfo.card_name, 
		 		desc: this.message ? this.message : '赠你一份好礼，祝你每天都开心快乐！',
		 		link: shareUrl,
		 		imgUrl: this.$util.img(this.cardInfo.card_cover.split(',')[0])
		 	}, res => {
		 		// console.log('公众号分享成功');
		 		// this.share();
		 	})
		 },
	},
	/**
	 * 自定义分享内容
	 */
	onShareAppMessage() {
		let that = this;
		var path = '/pages_promotion/giftcard/give_info?no=' + this.no;
		if (this.memberId) path += '&source_member=' + this.memberId;
		return {
			title: '朋友送你一张礼品卡，快来领取吧~',
			imageUrl:this.$util.img(this.cardInfo.card_cover.split(',')[0]),
			path: path,
			success: res => {
			},
			fail: res => {
			},
			complete: res => {
			}
		};
	}
};
</script>

<style lang="scss" scoped>
.page{
	background: #ffffff;
	min-height: 100vh;
}
.detail-box{
	padding: 30rpx 24rpx;
	.title{
		font-weight: bold;
		font-size: $font-size-toolbar;
		text{
			font-size: $font-size-sub;
			font-weight: 500;
			color: #999999;
			margin-left: 10rpx;
		}
	}
	.textarea{
		height: 180rpx;
		background: #F5F6F9;
		border-radius: 8rpx;
		padding: 24rpx;
		font-size: 24rpx;
		margin-top: 20rpx;
		overflow: hidden;
		textarea{
			font-size: 28rpx;
			width: 100%;
			height: 100%;
		}
	}
}
.bottom-btn{
	margin-top: 120rpx;
	button{
		margin-bottom: 20rpx;
		border: 2rpx solid var(--main-color);
		&:last-child{
			color: var(--main-color);
			border: 2rpx solid var(--main-color);
			background-color: #ffffff;
		}
	}
}

	.share-popup,
	.uni-popup__wrapper-box {
		.share-title {
			line-height: 60rpx;
			font-size: $font-size-toolbar;
			padding: 15rpx 0;
			text-align: center;
		}

		.share-content {
			display: flex;
			display: -webkit-flex;
			-webkit-flex-wrap: wrap;
			-moz-flex-wrap: wrap;
			-ms-flex-wrap: wrap;
			-o-flex-wrap: wrap;
			flex-wrap: wrap;
			padding: 15rpx;

			.share-box {
				flex: 1;
				text-align: center;

				.share-btn {
					margin: 0;
					padding: 0;
					border: none;
					line-height: 1;
					height: auto;

					text {
						margin-top: 20rpx;
						font-size: $font-size-tag;
						display: block;
						color: $color-title;
					}
				}

				.iconfont {
					font-size: 80rpx;
					line-height: initial;
				}

				.iconfuzhilianjie,
				.iconpengyouquan,
				.iconhaowuquan,
				.iconiconfenxianggeihaoyou {
					color: #07c160;
				}
			}
		}

		.share-footer {
			height: 90rpx;
			line-height: 90rpx;
			border-top: 2rpx #f5f5f5 solid;
			text-align: center;
			color: #666;
		}
	}
.poster-layer {
		.generate-poster {
			padding: 40rpx 0;
			.iconfont {
				font-size: 80rpx;
				color: #07c160;
				line-height: initial;
			}
			> view {
				text-align: center;
				&:last-child {
					margin-top: 20rpx;
				}
			}
		}
		.image-wrap {
			width: 64%;
			height: 854rpx;
			margin: 60rpx auto 40rpx auto;
			box-shadow: 0 0 32rpx rgba(100, 100, 100, 0.3);
			image {
				width: 480rpx;
				height: 854rpx;
			}
		}
		.msg {
			padding: 40rpx;
		}
		.save {
			text-align: center;
			height: 80rpx;
			line-height: 80rpx;
		}
		.close {
			position: absolute;
			top: 0;
			right: 20rpx;
			width: 40rpx;
			height: 80rpx;
			font-size: 50rpx;
		}
	}
	.goods-details img{
		max-width: 100%;
	}
	
	.wechat-share{
		position: fixed;
		width: 100vw;
		height: 100vh;
		left: 0;
		top: 0;
		background-color: rgba(0,0,0,.6);
		image{
			width: 100%;
		}
	}
</style>
