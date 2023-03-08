<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="page">
		<mescroll-uni @getData="getData" ref="mescroll" :size="10" v-if="addonIsExist.bargain && isLoading">
			<block slot="list" v-show="isLoad">
				
				<view class="ns-adv">
					<ns-adv keyword="NS_BARGAIN"></ns-adv>
				</view>
				
				<block v-if="(dataList.length > 0 || dataListing.length > 0)">
					<view class="goods-list single-column" v-if="dataListing.length">
						<view class="goods-item margin-bottom" v-for="(item, index) in dataListing" :key="index">
							<view class="goods-item-content">
								<view class="goods-img" @click="toDetailP(item)">
									<image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(index)"></image>
									<view class="color-base-bg goods-tag" v-if="goodsTag(item) != ''">{{ goodsTag(item) }}</view>
								</view>
							
								<view class="info-wrap">
									<view class="name-wrap">
										<view class="goods-name" @click="toDetailP(item)">{{ item.goods_name }}</view>
										<text class="info-sub-title">已有{{ item.join_num }}人参与</text>
										<view class="progress-wrap">
											<progress percent="20" :show-info="false" stroke-width="8" backgroundColor="#FFF4F4" :activeColor="themeStyle.main_color"
											 border-radius="6" :percent="progressP(item)" />
											 <view class="progress-point"></view>
											 <view class="progress-select icon" :style="{left: 'calc('+progressP(item)+'% - 16rpx)'}">
												 <text class="iconfutou iconfont"></text>
												 
											 </view>
										</view>
									</view>
										
									<view class="info-bottom">
										<view class="price-box">
											<view class="discount-price">
												已砍
												<text class="price price-font">{{ (item.price - item.curr_price).toFixed(2) }}</text>，
											</view>
											<view class="delete-price ">
												还剩
												<text class="price price-font">{{ $lang('common.currencySymbol') }}{{ (item.curr_price - item.floor_price).toFixed(2) }}</text>
											</view>
											
										</view>
										
										<view class="pro-info">
											<view class="button-border">免费拿</view>
										</view>
									</view>
								</view>
							</view>
							<view class="goods-item-bottom">
								<view class="item-bottom-left">
									<uni-count-down :day="item.time.d" :hour="item.time.h" :minute="item.time.i" :second="item.time.s" color="#fff"
									 borderColor="none" splitorColor="#303133" backgroundColor="#303133" />
									 <view class="color-sub txt">后结束</view>
								</view>
								<view class="item-bottom-right">
									<button type="primary" @click="toDetailP(item)" size="mini">继续砍价</button>
								</view>
							</view>
							 
						</view>
					</view>
					<view class="goods-list single-column" v-if="dataList.length">
						<view class="goods-item margin-bottom" v-for="(item, index) in dataList" :key="index">
							<view class="goods-item-content">
								<view class="goods-img" @click="toDetail(item)">
									<image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(index)"></image>
									<view class="color-base-bg goods-tag" v-if="goodsTag(item) != ''">{{ goodsTag(item) }}</view>
								</view>
								<view class="info-wrap">
									<view class="name-wrap">
										<view class="goods-name" @click="toDetail(item)">{{ item.sku_name }}</view>
										<text class="info-sub-title">已有{{ item.join_num }}人参与</text>
										<view class="progress-wrap">
											<progress percent="20" :show-info="false" stroke-width="8" backgroundColor="#FFF4F4" :activeColor="themeStyle.main_color"
											 border-radius="6" :percent="progress(item)" />
											 <view class="progress-point"></view>
											 <view class="progress-select icon" :style="{left: 'calc('+progress(item)+'% - 8rpx)'}">
												 <text class="iconfutou iconfont"></text>
											 </view>
										</view>
									</view>
									<view class="info-bottom">
										<view class="sale-box price-font">
											已砍{{ item.sale_num}}件
										</view>
										
										<view class="pro-info">
											<view class="button-border" >免费拿</view>
										</view>
									</view>
								</view>
							</view>
							<view class="goods-item-bottom">
								<view class="item-bottom-left">
									<view class="txt">底价：</view>
									<text class="unit price-style small">{{ $lang('common.currencySymbol') }}</text>
									<text class="price price-style large" >{{ parseFloat(item.floor_price).toFixed(2).split(".")[0] }}</text>
									<text class="unit price-style large">.{{ parseFloat(item.floor_price).toFixed(2).split(".")[1] }}</text>
									<view class="delete-pirce">{{ $lang('common.currencySymbol') }}{{item.price}}</view>
								</view>
								<view class="item-bottom-right">
									<button type="primary" @click="toDetail(item)" size="mini">去砍价</button>
								</view>
								
							</view>
						</view>
						
					</view>
				</block>
				<ns-empty v-else-if="isLoad && isLoading" textColor="#fff!important" :isIndex="false" text="暂无砍价商品"></ns-empty>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import uniCountDown from '@/components/uni-count-down/uni-count-down.vue';
	export default {
		components: {
			uniCountDown
		},
		data() {
			return {
				dataList: [],
				dataListing: [],
				isLoading: false,
				isLoad: false,
				skuId:0,
				//分享建立上下级所需id
				memberId:0,
				mpShareData:null,//小程序分享数据
				progressBorder:'10'
			};
		},
		onLoad(option) {
			this.$util.getMemberId().then(resolve => {
				this.memberId = resolve;
			});
			//小程序分享接收source_member
			if (option.source_member){
				uni.setStorageSync('source_member', option.source_member);
			}
			// 小程序扫码进入，接收source_member
			if (option.scene) {
				var sceneParams = decodeURIComponent(option.scene);
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
		onShow() {
			if (this.$refs.loadingCover) this.$refs.loadingCover.show();
			setTimeout( () => {
				if (this.addonIsExist && !this.addonIsExist.bargain) {
					this.$util.showToast({
						title: '商家未开启砍价',
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
			
			if(this.$refs.mescroll) this.$refs.mescroll.refresh();
			this.getDataing();
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
			getData(mescroll) {
				this.$api.sendRequest({
					url: '/bargain/api/goods/page',
					data: {
						page_size: mescroll.size,
						page: mescroll.num,
						is_exclude_bargaining: 1
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
						} else {
							this.$util.showToast({
								title: msg
							});
						}

						if (mescroll.endSuccess) mescroll.endSuccess(newArr.length);

						//设置列表数据
						if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
						this.dataList = this.dataList.concat(newArr); //追加新数据
						
						this.isLoad = true;
						this.$forceUpdate();
						setTimeout(() => {
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						},300)
					},
					fail() {
						//联网失败的回调
						if (mescroll.endErr) mescroll.endErr();
						setTimeout(() => {
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						},300)
					}
				});
			},
			getDataing() {
				this.$api.sendRequest({
					url: '/bargain/api/goods/bargainingList',
					data:{},
					success: res => {
						this.dataListing = res.data;
						for (var index in res.data) {
							this.dataListing[index].time = this.$util.countDown(res.data[index].end_time - res.timestamp);
						}
						this.isLoading = true;
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail() {
						//联网失败的回调
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			toDetail(e) {
				this.$util.redirectTo('/pages_promotion/bargain/detail', {
					b_id: e.bargain_id
				});
			},
			toDetailP(e) {
				this.$util.redirectTo('/pages_promotion/bargain/detail', {
					b_id: e.bargain_id,
					l_id: e.launch_id,
				});
			},
			imgError(index) {
				this.dataList[index].goods_image = this.$util.getDefaultImage().goods;
				this.$forceUpdate();
			},
			goodsImg(imgStr) {
				let imgs = imgStr.split(',');
				return imgs[0] ? this.$util.img(imgs[0], {
					size: 'mid'
				}) : this.$util.getDefaultImage().goods;
			},
			progress(data) {
				let progress = ((parseInt(data.sale_num) / (parseInt(data.bargain_stock) + parseInt(data.sale_num))) * 100).toFixed();
				if (progress == 'NaN') {
					progress = 0;
				}
				return progress;
			},
			progressP(data) {
				let progress = (((parseFloat(data.price) - parseFloat(data.curr_price)) / parseFloat(data.price)) * 100).toFixed();
				if (progress == 'NaN') {
					progress = 0;
				}
				return progress;
			},
			goodsTag(data) {
				return data.label_name || '';
			}
		},
		onHide() {
			if (this.$refs.loadingCover) this.$refs.loadingCover.show();
		}
		
	};
</script>
<style lang="scss">
	@import './public/css/list.scss';
</style>
<style lang="scss" scoped>
	/deep/ .fixed {
		position: relative;
		top: 0;
	}


	/deep/ .empty {
		margin-top: 0 !important;
	}

	.clockrun {
		.delete-price {
			max-width: 60%;
		}
	}

	/deep/ .uni-countdown__number {
		min-width: 32rpx;
		height: 32rpx;
		text-align: center;
		line-height: 32rpx;
		border-radius: 4px;
		display: inline-block;
		padding: 4rpx;
		margin: 0;
		border: none !important;
	}

	/deep/ .uni-countdown__splitor {
		width: 10rpx;
		height: 32rpx;
		line-height: 36rpx;
		text-align: center;
		display: inline-block;
	}

	/deep/ .uni-countdown__splitor.day {
		width: initial;
	}

	.pintuan-top {
		width: 100%;

		image {
			width: 100%;
		}
	}

	.bargain_pro {
		.progress {
			display: block;
			margin-bottom: 10rpx;

			.progress_top {
				display: flex;

				>view {
					flex: 1;
				}
				
			}

			view {
				margin-top: 10rpx;
			}
			.txt{
				.text-color{
					color: var(--price-color);
				}
			}
		}

		.pro-info {
			margin-top: $margin-updown;
		}
	}
	
</style>
<style>
	.progress-wrap >>> .uni-progress .uni-progress-bar {
		border-radius: 16rpx;
		overflow: hidden;
	}
	.progress-wrap >>> .uni-progress-bar .uni-progress-inner-bar{
		background: linear-gradient(to left, var(--bargain-promotion-color), var(--bargain-promotion-aux-color))!important;
	}
</style>