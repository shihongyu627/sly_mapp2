<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="page">
		<view class="card-img">
			<image :src="$util.img(cardInfo.card_cover)" mode="aspectFill"></image>
			<view class="card-label" v-if="cardInfo.card_right_type == 'balance'">
				{{cardInfo.balance}}元储值卡
			</view>
			<view class="card-label-img" v-if="cardInfo.card_right_type == 'goods'">
				<image :src="$util.img('public/uniapp/giftcard/giftcard-label.png')" mode="heightFix"></image>
			</view>
		</view>
		<view class="goods-list" v-if="cardInfo.card_right_type == 'goods'">
			<view class="goods-title" v-if="cardInfo.card_right_goods_type == 'item'">本礼品卡包含以下商品</view>
			<view class="goods-title" v-if="cardInfo.card_right_goods_type == 'all'">以下商品在使用时任选{{cardInfo.card_right_goods_count}}件</view>
			<view class="goods-item" v-for="(item, index) in cardInfo.card_goods_list" :key="index">
				<view class="goods-image">
					<image :src="$util.img(item.sku_image)" @error="imageError(index)" mode="widthFix"></image>
				</view>
				<view class="goods-info">
					<view class="goods-name">{{item.sku_name}}</view>
					<view class="goods-num">
						<text class=""></text>
							<block v-if="cardInfo.status == 'to_use'">
								<text class="" v-if="cardInfo.card_right_goods_type == 'item'">x {{item.total_num}}</text>
							</block>
						</view>
					</view>
				</view>
			</view>
			<view class="card-box">
				<view class="card-info">
					<view class="card-item">
						<view>过期时间：</view>
						<view>{{cardInfo.valid_time > 0 ? $util.timeStampTurnTime(cardInfo.valid_time) : '永久有效'}}</view>
					</view>
					<view class="card-item" v-if="cardInfo.from_member_id > 0">
						<view>赠送人：</view>
						<view>{{cardInfo.from_member_nickname}}</view>
					</view>
					<view class="card-item" v-if="shopInfo && shopInfo.mobile">
						<view>商户电话：</view>
						<view class="color">{{shopInfo.mobile}}</view>
					</view>
					<view class="card-item">
						<view>使用须知：</view>
						<view class="details">
							<rich-text v-if="cardInfo.instruction" :nodes="cardInfo.instruction" :data-nodes="cardInfo.instruction"></rich-text>
							<rich-text v-else :nodes="cardInfo.giftcard_desc" :data-nodes="cardInfo.giftcard_desc"></rich-text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="tab-bar-placeholder"></view>
		<view class="btn" v-if="cardInfo.status == 'to_use'">
			<button class="give-btn" v-if="cardInfo.is_allow_transfer" @click="$util.redirectTo('/pages_promotion/giftcard/give', {'member_card_id' : cardInfo.member_card_id})">赠送好友</button>
			<button class="use-btn" type="primary" @click="toUse()">立即使用</button>
		</view>
		<view class="btn" v-if="cardInfo.status == 'used'">
			<button class="use-btn" type="primary" @click="useInfo()">已使用</button>
		</view>
		 
		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>
		
		<view @touchmove.prevent.stop v-if="cardInfo.card_right_type == 'balance'">
			<uni-popup ref="cardPopup" type="center">
				<view class="card-popup-layer popup-layer">
					<view class="head-wrap" @click="closeCardPopup()">
						<text class="iconfont icon2guanbi"></text>
					</view>
					<view class="content">
						<view>您的{{cardInfo.balance}}元储值卡</view>
						<view>已放入您的账户中</view>
					</view>
					<view class="button-box"><button type="primary" @click="closeCardPopup()">去看看</button></view>
				</view>
			</uni-popup>
		</view>
		
	</view>
</template>

<script>
import htmlParser from '@/common/js/html-parser';
export default {
	components: {
	},
	data() {
		return {
			memberCardId:0,
			cardInfo: [],
			btnSwitch:false,
			shopInfo:null,
			min:0,
			modifyFlag: false,
			goodsList:[],
			max:0,
		};
	},
	computed: {
	 
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
		if(uni.getStorageSync('shop_info')) this.shopInfo = JSON.parse(uni.getStorageSync('shop_info'));
	},
	onShow() {
		this.getData();
	},
	 
	methods: {
		
		openCardPopup() {
			this.$refs.cardPopup.open();
		},
		closeCardPopup() {
			this.$refs.cardPopup.close();
			this.$util.redirectTo('/pages/member/index');
		},
		getData() {
			this.$api.sendRequest({
				url: '/giftcard/api/membercard/detail',
				data:{'member_card_id' : this.memberCardId},
				success: res => {
					if(res.code >= 0 && res.data){
						this.cardInfo = res.data;
						if (this.cardInfo.instruction) this.cardInfo.instruction = htmlParser(this.cardInfo.instruction);
						
						this.max = this.cardInfo.card_right_goods_count;
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}else{
						this.$util.showToast({
							title: res.message,
							mask: true,
							duration: 2000
						});
						setTimeout(() => {
							this.$util.redirectTo('/pages_promotion/giftcard/not_exist');
						}, 1500)
					}
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		cartNumChange(num, index){
			this.modifyFlag = true;
			this.cardInfo.card_goods_list[index]['total_num'] = num;
			this.modifyFlag = false;
			this.getGoodsList();
		},
		getGoodsList(){
			let num = 0;
			this.goodsList = [];
			Object.keys(this.cardInfo.card_goods_list).forEach(key => {
				let data = this.cardInfo.card_goods_list[key];
				if(data.total_num > 0) {
					this.goodsList.push({
						'sku_id' : data.sku_id,
						'num' : data.total_num
					});
					num += data.total_num;
				}
			})
			if(this.cardInfo.card_right_goods_count-num <= 0){
				this.max = 0;
			}else{
				this.max = this.cardInfo.card_right_goods_count;
			}
		},
		useInfo(){
			uni.showModal({
				title: '提示',
				content: '礼品卡已使用，是否前往查看？',
				success: res => {
					if (res.confirm) {
						if(this.cardInfo.card_right_type == 'goods'){
							this.$util.redirectTo('/order/detail',{'order_id':this.cardInfo.use_order_id});
							return false;
						}
						if(this.cardInfo.card_right_type == 'balance'){
							this.$util.redirectTo('/pages_tool/member/balance_detail');
							return false;
						}
					}
				}
			})
		},
		toUse(){
			if(this.cardInfo.card_right_type == 'balance'){
				this.balanceUse();
			}else{
				if(this.btnSwitch) return false;
				
				let data = {
					'member_card_id':this.memberCardId
				};
				if(this.cardInfo.card_right_goods_type == 'all'){
					this.$util.redirectTo('/pages_promotion/giftcard/use_select', {member_card_id:this.memberCardId});
					return false;
				}
				
				this.btnSwitch = true;
				uni.setStorage({
					key: 'giftcarduse',
					data: data,
					success: () => {
						this.$util.redirectTo('/pages_promotion/giftcard/card_use');
						this.btnSwitch = false;
					}
				});
				
			}
		},
		imageError(index) {
			this.cardInfo.card_goods_list[index].sku_image = this.$util.getDefaultImage().goods;
		},
		balanceUse(){
			uni.showModal({
				title: '提示',
				content: '您确定要使用该储值卡吗？',
				success: res => {
					if (res.confirm) {
						this.$api.sendRequest({
							url: '/giftcard/api/carduse/balanceuse',
							data:{'member_card_id' : this.memberCardId},
							success: res => {
								if(res.code >= 0){
									this.getData();
									this.openCardPopup();
								}else{
									this.$util.showToast({
										title: res.message,
									});
								}
								
							}
						});
					}
				}
			})
		}
	 
	}
};
</script>

<style lang="scss" scoped>
.page{
	background: #F6F9FF;
	min-height: 100vh;
	padding: 30rpx;
}
.card-img{
	margin: 20rpx;
	width: calc(100% - 40rpx);
	height: 380rpx;
	border-radius: 18rpx;
	overflow: hidden;
	position: relative;
	margin-bottom: 30rpx;
	image{
		width: 100%;
		height: 100%;
	}
	.card-label{
		position: absolute;
		line-height: 1;
		padding: 10rpx 15rpx;
		background-color: #ff2c27;
		color: #FFFFFF;
		right: 0;
		bottom: 0;
		border-top-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
		font-size: 34rpx;
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
.goods-list{
	background-color: #FFFFFF;
	padding:20rpx 24rpx;
	border-radius: 18rpx;
	margin-bottom: 20rpx;
	.goods-title{
		text-align: center;
		width: 100%;
		padding: 10rpx 0;
		margin-bottom: 20rpx;
		font-weight: bold;
	}
}
.goods-item{
	display: flex;
	margin-bottom: 20rpx;
	background: #FBF9FC;
	padding: 20rpx;
	border-radius: 12rpx;
	.goods-image{
		width: 160rpx;
		height: 160rpx;
		overflow: hidden;
		border-radius: 18rpx;
		margin-right: 20rpx;
		image{
			width: 160rpx;
			height: 160rpx;
			max-height: 160rpx;
		}
	}
	.goods-info{
		width: calc(100% - 180rpx);
		.goods-name{
			overflow: hidden;
			display: -webkit-box; 
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2; 
			line-height: 1.5;
			font-size: 28rpx;
			font-weight: bold;
			height: 84rpx;
		}
		.goods-num{
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			margin-top: 20rpx;
			text{
				color: #666666;
				
				font-size: 24rpx;
				&:last-child{
					color: #333333;
					margin-top: 35rpx;
					font-weight: bold;
				}
			}
		}
	}
}
.btn{
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: center;
	margin-top: 40rpx;
	position:fixed;
	bottom:0;
	left: 0;
	background-color: #FFFFFF;
	padding:20rpx 30rpx;
	box-sizing: border-box;
	padding-bottom: calc(constant(safe-area-inset-bottom) + 20rpx);
	padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
	z-index: 10;
	button{
		width: 100%;
		margin:0;
		&:nth-child(2){
			margin-left: 20rpx;
		}
	}
	.give-btn{
		background-color: var(--giftcard-promotion-aux-color);
		color: #FFFFFF;
	}
	.use-btn{
		background-color: var(--giftcard-promotion-color);
	}

	
}
.card-box{
	background-color: #FFFFFF;
	padding:20rpx 24rpx;
	border-radius: 18rpx;
	
	.card-info{
		display: flex;
		flex-direction: column;
		
		.card-item{
			display: flex;
			flex-direction: row;
			margin: 10rpx 0;
			>view{
				&:first-child{
					width: 140rpx;
					font-size: $font-size-base;
				}
				&:last-child{
					width: calc(100% - 140rpx);
					color: #888888;
					font-size: $font-size-base;
					overflow: hidden;
				}
				&.color{
					color: #364385;
				}
			}
		}
	}
}
.tab-bar-placeholder {
	padding-bottom: 120rpx;
	padding-bottom: calc(constant(safe-area-inset-bottom) + 120rpx);
	padding-bottom: calc(env(safe-area-inset-bottom) + 120rpx);
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
	.details{
		*{
			max-width: 100%;
			word-break: break-all;
		}
	}
</style>