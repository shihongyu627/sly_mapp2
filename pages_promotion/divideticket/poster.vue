<!-- <template>
	<view @touchmove.prevent class="poster-layer-wrap">
		<view class="top">
			<swiper class="swiper">
				<swiper-item>
					<view class="swiper-item">
						<view class="poster-wrap"><image :src="$util.img(poster)" mode="widthFix" ></image></view>
					</view>
				</swiper-item>
			</swiper>
			<image :src="$util.img(poster)" mode="aspectFit"></image>
		</view>
	</view>
</template> -->
<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="container">
		<swiper class="swiper">
			<swiper-item>
				<view class="swiper-item">
					<view class="poster-wrap"><image :src="$util.img(poster)" mode="widthFix" :show-menu-by-longpress="true"></image></view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				poster: "", //海报
				posterMsg: "", //海报错误信息
				posterHeight: 0,
				couponId:'',
				groupId:0,
				inviterId:'',
				memberInfo:{}
			}
		},
		onLoad(option) {
			this.couponId = option.coupon_id
			this.groupId = option.group_id
			this.inviterId = option.inviter_id
			this.getGoodsPoster()
			this.getMemberInfo()
		},
		methods:{
			headerimageError() {
				this.memberInfo.headimg = this.$util.getDefaultImage().head;
				this.$forceUpdate();
			},
			//生成海报
			getGoodsPoster() {
				//活动海报信息
				this.$api.sendRequest({
					url: "/divideticket/api/divideticket/poster",
					data: {
						coupon_id: this.couponId,
						group_id:this.groupId==''?0:this.groupId,
						inviter_id:this.inviterId==''?0:this.inviterId
					},
					success: res => {
						if (res.code == 0) {
							this.poster = res.data.path;
						} else {
							this.posterMsg = res.message;
						}
					}
				});
			},
			getMemberInfo() {
				this.$api.sendRequest({
					url: '/api/member/info',
					success: res => {
						if (res.code >= 0) {
							this.memberInfo = res.data;
						}
					},
				});
			},
		}
	}
</script>

<style lang="scss">
	.poster-layer-wrap{
		position: relative;
		background-color: $color-title;
		.bottom{
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: center;
			position: relative;
			left: 0;
			bottom: 0;
			line-height: 1;
			.user-head{
				width: 114rpx;
				height: 114rpx;
				border-radius: 50%;
				position: absolute;
				bottom:310rpx;
				left: 84rpx;
			}
			.name{
				font-size: 30rpx;
				color: #FF6F0F;
				font-weight: bold;
				position: absolute;
				bottom:250rpx;
				left: 40rpx;
				width: 140px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.qr-code{
				width:196rpx;
				height:198rpx;
				position: absolute;
				bottom:80rpx;
				right:50rpx;
			}
		}
	}
	
	.container {
		width: 100vw;
		min-height: 100vh;
		background-color: #f5f5f5;
	}
	.poster-wrap {
		padding: 40rpx 0;
		width: calc(100vw - 80rpx);
		margin: 0 40rpx;
		line-height: 1;
	
		image {
			border-radius: 20rpx;
			overflow: hidden;
			width: 100%;
		}
	}
	.swiper {
		height: 100vh;
	}
	.btn {
		margin: 0 80rpx;
		margin-top: 30rpx;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: $border-radius;
		color: #fff;
		text-align: center;
	}
	.tips {
		text-align: center;
		font-size: $font-size-base;
		color: #999;
		font-weight: 600;
		margin-top: 20rpx;
	}
	.dialog-popup {
		width: 580rpx;
		background: #fff;
		box-sizing: border-box;
		border-radius: 10rpx;
		overflow: hidden;
		height: initial;
	
		.title {
			padding: 30rpx 30rpx 0 30rpx;
			text-align: center;
			font-size: 32rpx;
			font-weight: bold;
		}
	
		.message {
			padding: 0 30rpx;
			color: #666;
			text-align: center;
			font-size: $font-size-base;
			line-height: 1.3;
			margin-top: 30rpx;
		}
	
		.action-wrap {
			margin-top: 50rpx;
			height: 80rpx;
			display: flex;
			border-top: 1px solid #eee;
	
			& > view {
				flex: 1;
				text-align: center;
				line-height: 80rpx;
	
				&:first-child {
					border-right: 1px solid #eee;
					color: #999;
				}
	
				button {
					border: none;
					line-height: 80rpx;
					padding: 0;
					margin: 0;
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>
<style scoped>
	/deep/ .top{
		height: calc(100vh);
	}
	/deep/ .top image{
		width:100% !important;
		height:100% !important;
	}
	/deep/ .top image div{
		background-size: 100% 100% !important;
	}
</style>
