<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="page">
		 
		<view class="goods-list" v-if="cardInfo.card_right_type == 'goods'">
			<view class="goods-title" v-if="cardInfo.card_right_goods_type == 'item'">本礼品卡包含以下商品</view>
			<view class="goods-title" v-if="cardInfo.card_right_goods_type == 'all'">请在以下商品中任选{{cardInfo.card_right_goods_count}}件</view>
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
								<view v-else>
								 <uni-number-box
										:min="min"
										:max="max"
										:value="item.total_num"
										size="small"
										@change="cartNumChange($event, index)"
									/>
								</view>
							</block>
						</view>
					</view>
				</view>
			</view>
			 
		</view>
		
		<view class="tab-bar-placeholder"></view>
		<view class="btn" v-if="cardInfo.status == 'to_use'">
			<button class="use-btn" type="primary" @click="toUse()">确定</button>
		</view>
		 
		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
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
		 
		getData() {
			this.$api.sendRequest({
				url: '/giftcard/api/membercard/detail',
				data:{'member_card_id' : this.memberCardId},
				success: res => {
					if(res.code >= 0 && res.data){
						this.cardInfo = res.data;
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
		toUse(){
			if(this.cardInfo.card_right_type == 'balance'){
				this.balanceUse();
			}else{
				if(this.btnSwitch) return false;
				
				let data = {
					'member_card_id':this.memberCardId
				};
				if(this.cardInfo.card_right_goods_type == 'all'){
					if(this.goodsList.length == 0){
						this.$util.showToast({
							title: '请选择商品',
						});
						return false;
					}
					if(this.max > 0){
						this.$util.showToast({
							title: '请选择'+this.cardInfo.card_right_goods_count+'件商品',
						});
						return false;
					}
					data.goods_sku_list = JSON.stringify(this.goodsList);
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
								}
								this.$util.showToast({
									title: res.message,
								});
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
.tab-bar-placeholder {
	padding-bottom: 120rpx;
	padding-bottom: calc(constant(safe-area-inset-bottom) + 120rpx);
	padding-bottom: calc(env(safe-area-inset-bottom) + 120rpx);
}
</style>