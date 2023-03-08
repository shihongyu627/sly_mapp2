<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="page">
		<mescroll-uni @getData="getData" ref="mescroll" :size="10">
			<block slot="list">
				<view class="cf-container color-line-border">
					<view class="tab">
						<view @click="changeState('all')"><text :class="status == 'all' ? ' active ' : ''">全部</text></view>
						<view @click="changeState('to_use')"><text :class="status == 'to_use' ? ' active ' : ''">待使用</text></view>
						<view @click="changeState('used')"><text :class="status == 'used' ? ' active ' : ''">已使用</text></view>
						<view @click="changeState('expire')"><text :class="status == 'expire' ? ' active ' : ''">已过期</text></view>
					</view>
				</view>
		
				<view class="card-box" v-if="dataList.length > 0">
					<view v-for="(item, index) in dataList" :key="index">
						<view class="card-item">
						 
							<view class="card-content" @click="toDetail(item.member_card_id)">
								
								<view class="card-img">
									<image :src="$util.img(item.card_cover.split(',')[0])" mode="aspectFill"></image>
									<view class="card-label" v-if="item.card_right_type == 'balance'">
										{{item.balance}}元储值卡
									</view>
									<view class="card-label-img" v-if="item.card_right_type == 'goods'">
										<image :src="$util.img('public/uniapp/giftcard/giftcard-label.png')" mode="heightFix"></image>
									</view>
								</view>
								
							</view>
							 
							<view class="button" v-if="item.status == 'to_use'">
								<view class="button-left" v-if="transfer(item)"><button size="mini" @click="$util.redirectTo('/pages_promotion/giftcard/give', {'member_card_id' : item.member_card_id})">送给朋友</button></view>
								<view class="button-right" v-if="!item.is_transfer">
									<button size="mini" type="primary" @click="$util.redirectTo('/pages_promotion/giftcard/card_info', {member_card_id: item.member_card_id})">立即使用</button>
								</view>
							</view>
							<view class="button" v-else>
								<view class="button-right no-use">
									<button size="mini" type="primary" @click="$util.redirectTo('/pages_promotion/giftcard/card_info', {member_card_id: item.member_card_id})" v-if="item.status == 'used'">已使用</button>
									<button size="mini" type="primary" @click="$util.redirectTo('/pages_promotion/giftcard/card_info', {member_card_id: item.member_card_id})" v-if="item.status == 'expire'">已过期</button>
								</view>
							</view>
						</view>
					</view>
				</view>
		
				<view class="card-no-data" v-else>
					<view class="card-image"><image mode="widthFix" :src="$util.img('public/uniapp/giftcard/no_card.png')"></image></view>
					<view class="text">暂无卡片记录</view>
					<view class="btn"><button type="primary" size='mini' @click="$util.redirectTo('/pages_promotion/giftcard/index')">去逛逛</button></view>
				</view>
			</block>
		</mescroll-uni>
		
		<loading-cover ref="loadingCover"></loading-cover>
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
	</view>
</template>

<script>
 
export default {
	components: {
	},
	data() {
		return {
			dataList: [],
			status:'all',
			orderId: 0,
			tabList:[
				{
					'link' : '/pages_promotion/giftcard/index',
					'text' : '首页',
					'path' : 'public/uniapp/giftcard/icon-index.png',
					'selectedPath' : 'public/uniapp/giftcard/icon-index-selected.png',
					'selected' : false,
				},
				{
					'link' : '/pages_promotion/giftcard/list',
					'text' : '卡包',
					'path' : 'public/uniapp/giftcard/icon-card.png',
					'selectedPath' : 'public/uniapp/giftcard/icon-card-selected.png',
					'selected' : true,
				},
				{
					'link' : '/pages_promotion/giftcard/member',
					'text' : '我的',
					'path' : 'public/uniapp/giftcard/icon-member.png',
					'selectedPath' : 'public/uniapp/giftcard/icon-member-selected.png',
					'selected' : false,
				},
			]
		};
	},
	computed: {
		
	},
	onLoad(option) {
		if(option.order_id) this.orderId = option.order_id;
	},
	onShow() {
		if(this.$refs.mescroll) this.$refs.mescroll.refresh();
	},
	methods: {
		transfer(data){
			return data.is_allow_transfer && !data.is_transfer;
		},
		//切换状态
		changeState(status) {
			this.status = status;
			this.$refs.mescroll.refresh();
		},
		 
		getData(mescroll) {
			this.$api.sendRequest({
				url: '/giftcard/api/membercard/lists',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					status: this.status,
					is_transfer:0,
					order_id : this.orderId
				},
				success: res => {
					let newArr = [];
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
					}
					if (mescroll.endSuccess) mescroll.endSuccess(newArr.length);
			
					//设置列表数据
					if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
					this.dataList = this.dataList.concat(newArr); //追加新数据
					setTimeout(() => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}, 300);
				},
				fail: res => {
					if (mescroll.endErr) mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
	 
		},
		toDetail(member_card_id){
			this.$util.redirectTo('/pages_promotion/giftcard/card_info', {
				member_card_id: member_card_id
			});
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
.active {
	border-bottom: 0 solid;
	color: var(--giftcard-promotion-color);
}

.cf-container {
	background: #fff;
	overflow: hidden;
}

.tab {
	display: flex;
	justify-content: space-between;
	height: 86rpx;

	> view {
		text-align: center;
		width: 33%;
		height: 86rpx;

		text {
			display: inline-block;
			line-height: 86rpx;
			height: 80rpx;
			font-size: 30rpx;
		}
	}
}

.card-item {
	background: #fff;
	margin: 20rpx 30rpx;
	border-radius: 10rpx;
	padding: 10rpx 30rpx 30rpx;
	 
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
	}
	.card-content {
		display: flex;
		margin-top: 20rpx;
		.card-img{
			width: 100%;
			height: 380rpx;
			position: relative;
			overflow: hidden;
			border-radius: 18rpx;
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
				border-bottom-right-radius: 18rpx;
				font-size: $font-size-base;
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
		.card-info{
			width: calc(100% - 290rpx);
			.card-member{
				margin-top: 30rpx;
				color: #666666;
				font-size: $font-size-tag;
			}
			.card-time{
				font-size: $font-size-tag;
				color: #666666;
			}
		}
		.card-name{
			font-weight: bold;
			font-size: $font-size-sub;
			
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
		}
 
   }
 
   .button{
	   display: flex;
	   align-items: flex-end;
	   justify-content: flex-end;
	   width: 100%;
	   margin-top: 30rpx;
	   .button-left{
		   margin-right: 20rpx;
		   button{
				background-color: #ffffff;
				border: 2rpx solid var(--giftcard-promotion-color);
				color: var(--giftcard-promotion-color);
		   }
	   }
	   .button-right{
		   button{
			   background-color: var(--giftcard-promotion-color);
		   }
		   &.no-use{
			   button{
					background: #999999;
			   }
		   }
	   }
	  
	   button{
		   border-radius: 60rpx;
		   line-height: 1;
		   height: 50rpx;
		   display: flex;
		   align-items: center;
	   }
   }
}

.card-no-data {
	width: 100%;
	text-align: center;
	.card-image {
		margin-top: 200rpx;
		display: flex;
		image {
			width: 340rpx;
			max-height: 290rpx;
			margin: auto auto;
		}
	}
	.text{
		font-size: 26rpx;
	}
	.btn{
		margin-top: 26rpx;
		button{
			border-radius: 80rpx;
			padding: 0 50rpx;
			font-size: 30rpx;
			background-color: var(--giftcard-promotion-color);
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
</style>