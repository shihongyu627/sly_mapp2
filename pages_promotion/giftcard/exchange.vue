<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="exchange-card-box" :style="{backgroundImage:'url('+$util.img('public/uniapp/giftcard/exchange-bg.png')+')'}">
		<view class="card-box">
			<view class="card-title">卡密兑换</view>
			<view class="card-input">
				<image :src="$util.img('public/uniapp/giftcard/exchange-icon-account.png')" mode="widthFix"></image>
				<input class="uni-input" placeholder="请输入您的卡号码" :value="cardNum" @input="onInput" />
			</view>
			<view class="card-input">
				<image :src="$util.img('public/uniapp/giftcard/exchange-icon-pwd.png')" mode="widthFix"></image>
				<input class="uni-input" placeholder="请输入您的卡密码" :value="card" @input="onInputTo" />
			</view>
			<view class="exchange-btn">
				<button type="primary" @click="exchange()">立即兑换</button>
			</view>
			<view class="exchange-list" @click="gotoexchange()">我的兑换列表</view>
		</view>	
	</view>
</template>

<script>
	export default {
		data() {
			return {	
				cardNum: '',
				card : ''
			};
		},
		onShow() {
			
			
		},
		methods: {
			onInput(e) {
				const { value } = e.target;
				this.cardNum = value
			},
			onInputTo(e){
				const { value } = e.target;
				this.card = value
			},
			gotoexchange() {
				this.$util.redirectTo('/pages_promotion/giftcard/list');
			},
			exchange() {
				this.$api.sendRequest({
					url:'/giftcard/api/activate/activate',
						data: {
							card_no: this.cardNum,
							card_cdk : this.card
						},
					success: res => {
						if(res.code >= 0){
							if(res.data){
								this.$util.showToast({
									title: '兑换成功'
								});
								setTimeout(() => {
									this.$util.redirectTo('/pages_promotion/giftcard/card_info', {'member_card_id' : res.data}, 'redirectTo');
								}, 1500)
								
							}else{
								this.$util.showToast({
									title: "卡号或密码错误，请重新输入"
								});
							}
						}else{
							this.$util.showToast({
								title: res.message
							});
						}
					}
				})
			},
		},
	};
</script>

<style lang="scss">
	.exchange-card-box{
		height: 100vh;
		background-size: 100% auto;
		background-repeat: no-repeat;
		min-height: 100vh;
		background-color: #F6F9FF;
		.card-box{
			background: #fff;
			position: relative;
			top: 320rpx;
			width: 90%;
			margin: 0 auto;
			border-radius: 10rpx;
			padding-bottom: 10px;
			.card-title{
				text-align: center;
				font-size: 32rpx;
				padding: 20rpx 0px;
			}
			.card-input{
				background: #F8F8F8;
				width: 80%;
				margin: 0 auto;
				margin-bottom: 40rpx;
				padding-left: 86rpx;
				padding-right: 20rpx;
				box-sizing: border-box;
				position: relative;
				.uni-input{
					height: 88rpx
				}
				image{
					position: absolute;
					width: 40rpx;
					max-height: 40rpx;
					left: 25rpx;
					top: 25rpx;
				}
			}
		}
	}
	.cate-image{
		display: flex;
		image{
			width: 170rpx;
			height: 116rpx;
			margin:274rpx auto 100rpx auto;
		}
	}
	.cate-search {
		// margin-top: 399rpx;
		width: 100%;
		height: 80rpx;
		padding: 10rpx 30rpx;
		box-sizing: border-box;
		/* #ifdef H5 */
		padding-top: 30rpx;
		/* #endif */

		input {
			font-size: $font-size-base;
			height: 80rpx;
			padding: 15rpx 25rpx 15rpx 30rpx;
			line-height: 60rpx;
			width: calc(100% - 120rpx);
		}

		.search-box {
			width: 100%;
			background: #fff;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 20rpx;
		}
		
		.input-placeholder {
			text-align: center;
		}
	}

	.exchange-btn {
		width: 80%;
		margin: 100rpx auto 0;
		button{
			width: 100%;
			margin: 0;
			
		}

	}
	
	.exchange-list {
		color: #1A1FF1;
		margin: 60rpx auto;
		text-align: center;
	}
</style>
