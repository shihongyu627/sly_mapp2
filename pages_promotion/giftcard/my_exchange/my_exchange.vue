<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="exchange-card-box">
		<view class="card-box">
			<view class="card-title">卡密兑换</view>
			<view class="card-input"><input class="uni-input" placeholder="请输入卡号" :value="card" @input="onInputTo" /></view>
			<view class="card-input"><input class="uni-input" placeholder="请输入卡密" :value="cardNum" @input="onInput" /></view>
			<view class="exchange-btn">
				<button type="primary" @click="exchange()">立即兑换</button>
			</view>
			<view class="exchange-list" @click="gotoexchange()">我的兑换列表<text class="card-more iconfont iconright"></text></view>
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
				this.$util.redirectTo('/pages_promotion/giftcard/my_exchange/exchange_list');
			},
			exchange() {
				this.$api.sendRequest({
					url:'/giftcard/api/giftcard/exchangeInfo',
						data: {
							carmichael_text: this.cardNum,
							entity_bianhao : this.card
						},
					success: res => {
						if(res.code >= 0){
							if(res.data){
								if(res.data.entity_status == 3 || res.data.entity_status == 4 || res.data.entity_status == 2){
									this.$util.showToast({
										title: "对不起，该卡已被使用或作废，请更换其他礼品卡"
									});
									return;
								}
								if(res.data.entity_status == 0){
									this.$util.showToast({
										title: "该礼品卡未激活"
									});
									return;
								}
								if(res.data.goods_list.length){
									
									let giftcard_id = res.data.giftcard_id;
									let id = res.data.id;
									
									let giftcard_sku_id = [];
									res.data.goods_list.forEach(siteItem => {
										giftcard_sku_id.push(siteItem.sku_id)
									});
												
									uni.setStorage({
										key: 'orderCreateData',
										data: {
											sku_id: giftcard_sku_id.toString() ,
											num:1
										},
										success: () => {
											this.$util.redirectTo('/pages_promotion/giftcard/payment/payment',{ giftcard_id:giftcard_id , id:id })
										}
									});
								}else{
									this.$api.sendRequest({
										url: '/giftcard/api/giftcard/exchange',
										data: {
											carmichael_text: this.cardNum
										},
										success: res => {
											if (res.code == 0 && res.data) {
												this.$util.showToast({
														title: res.data
													});
												this.cardNum='';
												setTimeout(() => {
													this.$util.redirectTo('/pages_promotion/giftcard/my_exchange/exchange_list', {}, 'redirectTo');
												}, 1000);

											} else {
												this.$util.showToast({
													title: res.message
												});
											}
											if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
											
										},
										fail: res => {
											mescroll.endErr();
											if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
										}
									});
								}
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
		//background:#000;
		height: 100vh;
		background-image: url(data:image/png;base64,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);
		background-size: 100% 100%;
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
				width: 80%;
				margin: 0 auto;
				margin-bottom: 40rpx;
				.uni-input{
					height: 80rpx
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
		margin: 100rpx 0 0 0;

	}
	
	.exchange-list {
		color: #808080;
		margin: 20rpx 0 0 460rpx;
		.card-more{
			font-size: 13px;
		}
	}
</style>
