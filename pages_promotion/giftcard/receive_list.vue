<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<mescroll-uni @getData="getData" ref="mescroll" :size="10">
			<block slot="list">
				<view class="cf-container color-line-border">
					<view class="tab">
						<view @click="changeState('all')"><text :class="status == 'all' ? 'color-base-text active color-base-border-bottom' : ''">全部</text></view>
						<view @click="changeState('to_use')"><text :class="status == 'to_use' ? 'color-base-text active color-base-border-bottom' : ''">待使用</text></view>
						<view @click="changeState('used')"><text :class="status == 'used' ? 'color-base-text active color-base-border-bottom' : ''">已使用</text></view>
						<view @click="changeState('expire')"><text :class="status == 'expire' ? 'color-base-text active color-base-border-bottom' : ''">已过期</text></view>
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
					<view class="btn"><button type="primary" size='mini' @click="$util.redirectTo('/pages_promotion/giftcard/index')">去赠送</button></view>
				</view>
			</block>
		</mescroll-uni>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
export default {
	data() {
		return {
			status: 'all',
			dataList: [],
		};
	},
	methods: {
		//切换状态
		changeState(status) {
			this.status = status;
			this.$refs.mescroll.refresh();
		},
		transfer(data){
			return data.is_allow_transfer && !data.is_transfer;
		},
		getData(mescroll) {
		 
			this.$api.sendRequest({
				url: '/giftcard/api/membercard/lists',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					status: this.status,
					source:'gift'
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
		}
		 
	}
};
</script>

<style lang="scss">
.active {
	border-bottom: 0rpx solid;
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
		}
	  
	   button{
		   border-radius: 60rpx;
		   line-height: 1;
		   height: 50rpx;
		   display: flex;
		   align-items: center;
	   }
	   .button-right.no-use{
		   button{
				background: #999999;
		   }
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
</style>
