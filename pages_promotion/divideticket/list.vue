<template>
	<page-meta :page-style="themeColor"></page-meta>
	 
	<view :class="isIphoneX ? 'iphone-x' : ''">
		<mescroll-uni ref="mescroll" top="20" @getData="getMemberCounponList">
			<block slot="list">
				<view class="coupon-listone" v-if="list.length>0">
					<view class="item" v-for="(item, index) in list" :key="index" @click="toGoodsList(item)">
						<view class="item-left">
							<view class="item-flex">
								<view class="item-base">
									<image v-if="item.image != '' " :src="$util.img(item.image)" mode="aspectFit" @error="imageError(index)"></image>
									<image v-else :src="$util.img('public/uniapp/divideticket/coupon_list_img.png')" mode="aspectFit"></image>
								</view>
								<view class="item-info">
									<view class="use_name">{{item.name}}</view>
									<view class="use_title">{{item.divide_num}}名好友瓜分{{ item.money|int}}元优惠券</view>
									<view class="use_time" v-if="item.validity_type">有效期：领取之日起{{ item.fixed_term }}日内有效</view>
									<view class="use_time" v-else>有效期：{{ $util.timeStampTurnTime(item.end_time) }}</view>
								</view>
							</view>
						</view>
						<view class="item-right">
							<view class="use_price">
								<text>￥</text>
								{{ parseFloat(item.money).toFixed(2).split(".")[0] }}
								<text >.{{ parseFloat(item.money).toFixed(2).split(".")[1] }}</text>
							</view>
							<view class="tag" @click="toGoodsList(item)" v-if="item.g_status==2">去瓜分</view>
							<view class="tag" @click="toGoodsList(item)" v-if="item.g_status==1">去查看</view>
							<view class="tag" @click="toGoodsList(item)" v-if="item.g_status==0">组队中</view>
						</view>
					</view>
				</view>
				<view v-else><ns-empty :isIndex="false" text="暂无数据"></ns-empty></view>
			</block>
		</mescroll-uni>
		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: '',
				types:'',
				state: 1,
				sort: 1,
				list: [],
				isIphoneX: false, //判断手机是否是iphoneX以上
				showEmpty: false,
				//分享建立上下级所需id
				memberId:0,
				mpShareData:null,//小程序分享数据
			};
		},
		onLoad(data) {
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			//获取memberId
			this.$util.getMemberId().then(resolve=>{
				this.memberId = resolve;
			}).catch((reject)=>{
				// #ifdef MP-WEIXIN
				console.log('reject',reject)
				// #endif
			})
			//小程序分享接收source_member
			if (data.source_member){
				uni.setStorageSync('source_member', data.source_member);
			}
			// 小程序扫码进入，接收source_member
			if (data.scene) {
				var sceneParams = decodeURIComponent(data.scene);
				sceneParams = sceneParams.split('&');
				if (sceneParams.length) {
					sceneParams.forEach(item => {
						if (item.indexOf('sku_id') != -1) this.skuId = item.split('-')[1];
						if (item.indexOf('m') != -1) uni.setStorageSync('source_member', item.split('-')[1]);
						if (item.indexOf('is_test') != -1) uni.setStorageSync('is_test', 1);
					});
				}
			}
		},
		filters:{
			int(val){
				var str = String(val);
				var arr = str.split('.');
				if(parseInt(arr[1])>0){
					return str
				}else{
					return arr[0]
				}
			}
		},
		onShow() {
			setTimeout( () => {
				if (this.addonIsExist && !this.addonIsExist.divideticket) {
					this.$util.showToast({
						title: '商家未开启瓜分券',
						mask: true,
						duration: 2000
					});
					setTimeout(() => {
						this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
					}, 2000);
					return;
				}
			}, 1000);
			
			//记录分享关系
			if(uni.getStorageSync('token') && uni.getStorageSync('source_member')){
				this.$util.onSourceMember(uni.getStorageSync('source_member'));
			}
			
			//小程序分享
			// #ifdef MP-WEIXIN
			this.$util.getMpShare().then((res) => { this.mpShareData = res; });
			// #endif
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
			getMemberCounponList(mescroll) {
				this.showEmpty = false;
				this.$api.sendRequest({
					url: '/divideticket/api/divideticket/lists',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
					},
					success: res => {
						this.showEmpty = true;
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.list = []; //如果是第一页需手动制空列表
						this.list = this.list.concat(newArr); //追加新数据
						let data = res.data;
						if (data) this.couponList = data;
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			imageError(index) {
				this.list[index].image = this.$util.getDefaultImage().goods;
				this.$forceUpdate();
			},
			toGoodsList(item) {
				this.$util.redirectTo('/pages_promotion/divideticket/index', {
					coupon_id: item.coupon_id
				});
			}
		},
	};
</script>

<style lang="scss" scoped>
	.cart-empty {
		margin-top: 104px !important;
	}

	.active {
		border-bottom: 4rpx solid;
	}
	
	.coupon-head {
		display: flex;
		background: #fff;
		padding: 20rpx 50rpx;
		
		.sort {
			border: 1px solid #c5c5c5;
			padding: 1rpx 20rpx;
			border-radius: 50rpx;
			cursor: pointer;
			margin-right: 15rpx;
		}
	}
	.cf-container {
		background: #fff;
		overflow: hidden;
	}

	.tab {
		display: flex;
		justify-content: space-between;
		height: 86rpx;

		>view {
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

	.coupon-listone {
		margin: 0 30rpx;
		
		.item {
			display: flex;
			align-items: center;
			// justify-content: space-between;
			flex-direction: column;
			background-color: #FFF; 
			background-size: 100% 100%;
			border-radius: 20rpx;
			align-items: stretch;
			margin-top: $padding;
			overflow: hidden;
			padding: 20rpx;
			.item-left {
				margin-bottom: 30rpx;
				.use_name{
					font-weight: bold;
					width: 460rpx;    
					word-break: break-word;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				.item-flex {
					display: flex;
					align-items: center;
				}
				.use_time {
					font-size: $font-size-tag;
					color: #909399;
				
				}
				.item-base {
					width: 160rpx;
					height: 160rpx;
					border-radius: 10rpx;
					& image {
						width: 100%;
						height: 100%;
						border-radius: 10rpx;
					}
				}
				.item-info {
					margin-left: $padding;
					overflow: hidden;
					background-repeat-x: no-repeat;
					background-repeat-y: repeat;
					
					
					.use_title {
						font-size: $font-size-tag;
						max-width: 330rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						color: $color-sub;
				
						.max_price {
							font-weight: 400;
							font-size: $font-size-tag;
						}
					}
					.use_type {
						max-width: 330rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						border-radius: 5rpx;
						background-color: #FF9988;
					}
				}
			}
			.item-right {
				padding-top: 20rpx;
				display: flex;
				justify-content: space-between;
				border-top: 1px solid $color-line;
				.use_price {
					color:#FA5B14;
					font-weight: bold;
					font-size: 36rpx;
					color: var(--price-color);
					& text {
						font-size: $font-size-base;
						margin-right: 10rpx;
						font-weight: bold;
					}
				}
					.tag {
						height: 50rpx;
						border-radius: $border-radius;
						line-height: 50rpx;
						padding:0 19.5px;
						text-align: center;
						background: linear-gradient(90deg, var(--bg-color) 0%, var(--bg-color-shallow) 100%);
						color: #fff;
						font-size: $font-size-tag;
				
						&.disabled {
							background: $color-line !important;
							color: $color-tip !important;
						}
					}
			}
		}
	}
</style>
