<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="page">
		<view class="detail-box">
			<view class="detail-img">
				<image :src="$util.img(image.media_path)" ></image>
				<view class="card-label" v-if="giftDetail && giftDetail.card_right_type == 'balance'">
					{{giftDetail.balance}}元储值卡
				</view>
				<view class="card-label-img" v-if="giftDetail && giftDetail.card_right_type == 'goods'">
					<image :src="$util.img('public/uniapp/giftcard/giftcard-label.png')" mode="heightFix"></image>
				</view>
			</view>
			<view class="detail-head">选择卡面</view>
			<scroll-view class="img-list" :scroll-x="true" :show-scrollbar="false" v-if="imageList" enable-flex="true">
				<view class="img-item" v-for="(item, index) in imageList" :key="index" :class="{'selected' : image.media_id == item.media_id}" @click="image = item">
					<image :src="$util.img(item.media_path)" mode="heightFix"></image><text v-if="image.media_id == item.media_id" class="iconfont iconright1">
				</text>
				</view>
			</scroll-view>
			
			<block v-if="giftDetail && giftDetail.card_right_type == 'goods'">
				<view class="gift-list" v-if="giftDetail.goods_list">
					<view class="detail-head" v-if="giftDetail.card_right_goods_type == 'all'">以下商品 在使用时任选{{giftDetail.card_right_goods_count}}件</view>
					<view class="detail-head" v-else>本礼品卡包含以下商品</view>
					<view class="gift-item" v-for="(item, index) in giftDetail.goods_list" :key="index">
						<view class="goods-img">
							<image :src="$util.img(item.sku_info.sku_image)" @error="imgError(index)" mode="widthFix"></image>
						</view>
						<view class="goods-info">
							<view class="goods-name">{{item.sku_info.sku_name}}</view>
							<view class="gift-bottom">
								<view class="gift-price price-font"></view>
								<view class="gift-num" v-if="giftDetail.card_right_goods_type == 'item'">
									<view class="num">x{{item.goods_num}}</view>
								</view>
							</view>
						</view>
					</view>
				 
				</view>
				<view class="card-box">
					<view class="detail-head">使用须知</view>
					<view class="card-info">
						<view class="goods-details" >
							<rich-text v-if="giftDetail.instruction" :nodes="giftDetail.instruction" :data-nodes="giftDetail.instruction"></rich-text>
							<rich-text v-else :nodes="giftDetail.giftcard_desc" :data-nodes="giftDetail.giftcard_desc"></rich-text>
						</view>
					</view>
				</view>
				
				<view class="card-box" v-if="giftDetail && giftDetail.desc">
					<view class="detail-head">卡片详情</view>
					<view class="card-info">
						<view class="goods-details" >
							<rich-text :nodes="giftDetail.desc" :data-nodes="giftDetail.desc"></rich-text>
						</view>
					</view>
				</view>
				<view class="bottom-btn">
					<view class="bottom-left">
						
						<view class="price-box">
							<view>销售价</view>
							<view class=" price-style small">￥</view>
							<view class=" price-style large">{{giftDetail.card_price}}</view>
						</view>
						<view class="title-sub"></view>
					</view>
					<button type="primary" @click="buy('goods')">制作礼包</button>
				</view>
			</block>
			
			<block v-if="giftDetail && giftDetail.card_right_type == 'balance'">
				<view class="card-box">
					<view class="detail-head">使用须知</view>
					<view class="card-info">
						<view class="goods-details" >
							<rich-text v-if="giftDetail.instruction" :nodes="giftDetail.instruction" :data-nodes="giftDetail.instruction"></rich-text>
							<rich-text v-else :nodes="giftDetail.giftcard_desc" :data-nodes="giftDetail.giftcard_desc"></rich-text>
						</view>
					</view>
				</view>
				
				<view class="card-box" v-if="giftDetail && giftDetail.desc">
					<view class="detail-head">卡片详情</view>
					<view class="card-info">
						<view class="goods-details" >
							<rich-text :nodes="giftDetail.desc" :data-nodes="giftDetail.desc"></rich-text>
						</view>
					</view>
				</view>
				<view class="bottom-btn">
					<view class="bottom-left">
						<view class="price-box">
							<view>销售价</view>
							<view class=" price-style small">￥</view>
							<view class=" price-style large">{{giftDetail.card_price}}</view>
						</view>
						<view class="title-sub"></view>
					</view>
					<button type="primary" @click="buy('balance')">制作礼包</button>
				</view>
			</block>
		</view>
		
		<view class="tab-bar-placeholder"></view>
		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
import htmlParser from '@/common/js/html-parser';
export default {
	components: {
	},
	data() {
		return {
			image:'',
			imageList:null,
			giftcardId:0,
			giftDetail: null,
			goodsList:null,
			btnSwitch:false,
		};
	},
	onLoad(option) {
		//小程序分享接收source_member
		if (option.source_member) {
			uni.setStorageSync('source_member', option.source_member);
		}
		
		if(option.id) this.giftcardId = option.id;
		
		// 小程序扫码进入
		if (option.scene) {
			var sceneParams = decodeURIComponent(option.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('id') != -1) this.giftcardId = item.split('-')[1];
				});
			}
		}
		this.getGiftcardDetail();
		
		
		
	},
	onShow() {
		
	},
	computed:{
		
	},
	methods: {
		getGiftcardDetail(){
			this.$api.sendRequest({
				url: '/giftcard/api/giftcard/detail',
				data:{'giftcard_id' : this.giftcardId},
				success: res => {
					if(res.code >= 0 && res.data){
						this.giftDetail = res.data;
						if (this.giftDetail.desc) this.giftDetail.desc = htmlParser(this
							.giftDetail.desc);
							
						if (this.giftDetail.instruction) this.giftDetail.instruction = htmlParser(this
							.giftDetail.instruction);
							
						this.imageList = res.data.media_list;
						this.image = this.imageList.length > 0 ? this.imageList[0] : '';
						if (this.giftDetail) this.$langConfig.title(this.giftDetail.card_name);
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
				}
			});
		},
		buy(type){
			let data = {
				'media_id' : this.image.media_id,
				'media_path' : this.image.media_path,
				'num' : 1,
				'giftcard_id' : this.giftcardId
			};
			
			if(this.btnSwitch) return false;
			
			this.btnSwitch = true;
			
			uni.setStorage({
				key: 'giftcardOrderCreateData',
				data: data,
				success: () => {
					this.$util.redirectTo('/pages_promotion/giftcard/payment');
					this.btnSwitch = false;
				}
			});
			
		},
		 
		imgError(index) {
			this.giftDetail.goods_list[index].sku_info.sku_image = this.$util.getDefaultImage().goods;
		},
		
	}
};
</script>

<style lang="scss" scoped>
.page{
	background: #F9FBFF;
	min-height: 100vh;
}
.detail-box{
	padding: 30rpx 24rpx;
	.detail-img{
		border-radius: 18rpx;
		overflow: hidden;
		display: flex;
		height: 400rpx;
		width: 100%;
		align-items: center;
		position: relative;
		justify-content: center;
		image{
			width: 100%;
			height: 100%;
			border-radius: 18rpx;
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
			font-size: 34rpx;
			font-weight: bold;
		}
		.card-label-img{
			position: absolute;
			line-height: 1;
			right: -6rpx;
			bottom: -8rpx;
			width: 100rpx;
			image{
				width: 100%;
				height: 100rpx;
			}
		}
	}
	.detail-head{
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: $font-size-base;
		color: #222222;
		font-weight: 500;
		padding: 0;
		font-weight: bold;
		margin-top: 50rpx;
		
		&::before{
			content: '';
			background-color: #222222;
			width: 20rpx;
			height: 5rpx;
			display: block;
			margin-right: 10rpx;
		}
		&::after{
			content: '';
			background-color: #222222;
			width: 20rpx;
			height: 5rpx;
			display: block;
			margin-left: 10rpx;
		}
	}
	/deep/.img-list{
		display: flex;
		flex-direction: row;
		white-space: nowrap;
		margin-top: 20rpx;
		margin-bottom: 40rpx;
		height: 160rpx;
		.uni-scroll-view-content{
			display: flex;
		}
		
		.img-item{
			
			overflow: hidden;
			// display: inline-block;
			margin-right: 20rpx;
			height: 160rpx;
			box-sizing: border-box;
			position: relative;
			border: 4rpx solid rgba(255, 255, 255, 0);
			flex-shrink: 0;
			display: flex;
			line-height: 1;
			padding: 0;
			border-radius: 18rpx;
			background-color: rgba(255, 255, 255, 0);
			width: max-content;
			image{
				width: 100%;
				height: 160rpx;
				border-radius: 18rpx;
			}
			&.selected{
				border: 4rpx solid var(--giftcard-promotion-color);
				background-color: var(--giftcard-promotion-color);
				&::after{
					content: " ";
					width: 0;
					height: 0;
					position: absolute;
					color: #ffffff;
					right: -2rpx;
					top: -2rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 16rpx;
					border-style: solid;
					border-width: 0 40rpx 40rpx 0px;
					border-color: transparent  var(--giftcard-promotion-color) transparent;
				}
				.iconfont{
					position: absolute;
					right: 2rpx;
					top: 2rpx;
					color: #fff;
					font-size: 16rpx;
					z-index: 1;
				}
			}
		}
	}
	
	.gift-list{
		display: flex;
		margin-top: 30rpx;
		flex-wrap: wrap;
		background-color: #ffffff;
		padding: 24rpx 0;
		border-radius: 16rpx;
		.detail-head{
			width: 100%;
			margin: 0 0 20rpx;
			padding-bottom: 20rpx;
			border-bottom: 2rpx solid #F4F4F4;
		}
		.gift-item{
			width: 100%;
			background-color: #fff;
			margin: 0 24rpx 24rpx;
			display: flex;
			.goods-img{
				position: relative;
				overflow: hidden;
				width: 200rpx;
				height: 200rpx;
				image {
					width: 100%;
					position: absolute;
					top: 50%;
					bottom: 0;
					left: 0;
					right: 0;
					transform: translateY(-50%);
				}
			}
			.goods-info{
				display: flex;
				flex-direction: column;
				width: calc(100% - 200rpx);
				
			}
			.goods-name{
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				padding: 0 20rpx;
				height: 100rpx;
				box-sizing: border-box;
				font-weight: bold;
				
			}
			.gift-bottom{
				.gift-price{
					color: var(--price-color);
				}
				padding: 0 20rpx;
				display: flex;
				line-height: 1;
				margin-top: 50rpx;
				justify-content: space-between;
			}
			.gift-num{
				display: flex;
				 
				.num{
					width: 52rpx;
					text-align: center;
					height: 50rpx;
					line-height: 50rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #999999;
					font-weight: bold;
				}
			}
		}
	}
	
	.bottom-btn{
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: #ffffff;
		left: 0;
		padding: 24rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
		padding-bottom: 24rpx;
		padding-bottom: calc(constant(safe-area-inset-bottom) + 24rpx);
		padding-bottom: calc(env(safe-area-inset-bottom) + 24rpx);
		.bottom-left{
			display: flex;
			align-items: center;
			padding: 0 24rpx;
			padding-left: 40rpx;
		}
		.title-sub{
			font-size: 22rpx;
			color: #999999;
		}
		.price-box{
			display: flex;
			align-items: baseline;
			margin-right: 20rpx;
			>view:first-child{
				font-weight: bold;
				color: var(--price-color);
				margin-right: 10rpx;
			}
		}
		button{
			width: 50%;
			background-color: var(--giftcard-promotion-color);
		}
	}
}
.tab-bar-placeholder {
	width: 100%;
	padding-bottom: calc(constant(safe-area-inset-bottom) + 130rpx);
	padding-bottom: calc(env(safe-area-inset-bottom) + 130rpx);
}

.card-box{
	background-color: #ffffff;
	padding: 24rpx;
	margin-top: 20rpx;
	.detail-head{
		margin-top: 20rpx;
	}
	.card-info{
		display: flex;
		flex-direction: column;
		margin-top: 15rpx;
		
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
					font-size: $font-size-base;
				}
				&.color{
					color: #364385;
				}
			}
		}
	}
}
.goods-details{
	overflow: hidden;
	word-break: break-all;
	*{
		max-width: 100%;
		word-break: break-all;
	}
}
</style>
<style>
	.img-list >>> .uni-scroll-view-content{
		display: flex;
	}
</style>