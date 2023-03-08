<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view :class="isIphoneX ? 'iphone-x' : ''">
		<scroll-view scroll-y="true" class="topHeight" @scroll="watchScroll" @scrolltolower="getDate">
			<view class="ns-adv">
				<ns-adv keyword="NS_blindbox"></ns-adv>
				<view :class="topJudge ? 'my_box_category_box' : ''">
					<view class="my_box_category-big my_box_category">
						<view class="category-item" @click="categoryChange('0')">
							<view class="item-con" :class="boxStatus == 0 ? 'active color-base-text color-base-bg-before' : ''">全部</view>
						</view>
						<scroll-view class="coupon-all" :scroll-x="true" :show-scrollbar="false">
							<view class="my_box_category">
								<view class="category-item" v-for="(item, index) in categoryList" :key="index" @click="categoryChange(item.category_id)">
									<view class="item-con" :class="item.category_id == boxStatus ? 'active color-base-text color-base-bg-before' : ''">
										{{ item.category_name }}
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
				<view v-if="topJudge" class="hover_category"></view>
			</view>
			<view class="goods-list double-column" v-if="list.length > 0">
				<view class="goods-item margin-bottom" v-for="(items, indexs) in list" :key="indexs" @click="toDetail(items.blindbox_id)">
					<view class="goods-img">
						<image v-if="items.blindbox_images != ''" :src="$util.img(items.blindbox_images)" @error="imageError(indexs)" mode="aspectFit"></image>
						<image v-else :src="$util.img('public/uniapp/blindbox/default.png')"></image>
					</view>
					<view class="info-wrap">
						<view class="name-wrap">
							<view class="goods-name">{{ items.blindbox_name }}</view>
						</view>
						<view class="discount-price">
							<text class="unit price-style small">
								￥
								<text class="price price-style large" >{{ parseFloat(items.price).toFixed(2).split(".")[0] }}</text>
								.{{ parseFloat(items.price).toFixed(2).split(".")[1] }}
							</text>
						</view>
					</view>
				</view>
			</view>
			<view class="bottom_tips_judge" v-if="bottom_tips_judge">已经到底了</view>
			<view v-if="list.length == 0"><ns-empty :isIndex="false" text="暂无数据"></ns-empty></view>
		</scroll-view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import nsAdv from '@/components/ns-adv/ns-adv.vue';
export default {
	components: {
		nsAdv
	},
	data() {
		return {
			boxStatus: 0,
			list: [],
			categoryList: [],
			showEmpty: false,
			isIphoneX: false, //判断手机是否是iphoneX以上
			state: 1,
			adv: {},
			//接口请求数据
			mescroll: {
				num: 1,
				size: 8
			},
			// 选择吸顶判断
			topJudge: false,
			//用于判断列表数据是否已经全部加载
			bottom_tips_judge: true,
			skuId: 0,
			//分享建立上下级id
			memberId: 0,
			mpShareData: null //小程序分享数据
		};
	},
	onLoad(option) {
		this.getCategory();
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		this.getDate();

		this.$util.getMemberId().then(resolve => {
			this.memberId = resolve;
		});
		//小程序分享接收source_member
		if (option.source_member) {
			uni.setStorageSync('source_member', option.source_member);
		}
		// 小程序扫码进入,接收source_member
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
		this.getAdvList();
		setTimeout( () => {
			if (this.addonIsExist && !this.addonIsExist.blindbox) {
				this.$util.showToast({
					title: '商家未开启盲盒',
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
		if (uni.getStorageSync('token') && uni.getStorageSync('source_member')) {
			this.$util.onSourceMember(uni.getStorageSync('source_member'));
		}

		//小程序分享
		// #ifdef MP-WEIXIN
		this.$util.getMpShare().then(res => {
			this.mpShareData = res;
		});
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
		getAdvList() {
			this.$api.sendRequest({
				url: '/api/adv/detail',
				data: {
					keyword: 'NS_blindbox'
				},
				success: res => {
					if (res.code == 0) {
						var data = res.data.adv_list;
						for (var index in data) {
							if (data[index].adv_url) data[index].adv_url = JSON.parse(data[index].adv_url);
						}
						this.adv = res.data.adv_list;
					}
				}
			});
		},
		getCategory() {
			this.$api.sendRequest({
				url: '/blindbox/api/goods/categoryList',
				success: res => {
					if (res.code >= 0) {
						this.categoryList = res.data;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		},
		getDate() {
			this.showEmpty = false;
			this.$api.sendRequest({
				url: '/blindbox/api/goods/page',
				data: {
					page: this.mescroll.num,
					page_size: this.mescroll.size,
					category_id: this.boxStatus
				},
				success: res => {
					this.showEmpty = true;
					if (res.code >= 0) {
						if (res.data.list.length > 0) {
							let newArr = [];
							newArr = res.data.list;
							if (newArr.length < this.mescroll.size) {
								this.bottom_tips_judge = true;
							}
							this.list = this.list.concat(newArr); //追加新数据
							this.mescroll.num += 1;
						} else {
							if (this.mescroll.num > 1) {
								this.bottom_tips_judge = true;
							}
						}
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		categoryChange(e) {
			this.boxStatus = e;
			(this.mescroll.num = 1), (this.list = []);
			this.bottom_tips_judge = false;
			this.getDate();
		},
		toDetail(e) {
			this.$util.redirectTo('/pages_promotion/blindbox/index', {
				blindbox_id: e
			});
		},
		imageError(index) {
			this.list[index].blindbox_images = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		watchScroll(e) {
			this.topHeight = e.detail.scrollTop;
			if (this.topHeight < 165) {
				this.topJudge = false;
			} else {
				this.topJudge = true;
			}
		}
	}
};
</script>

<style lang="scss">
.ns-adv {
	padding: $margin-updown $margin-both 0;
	overflow: hidden;
	line-height: 1;
	background-color: #fff;
	margin-bottom: 20rpx;
	.my_box_category-big {
	}
	.my_box_category {
		line-height: 1;
		width: 100%;
		display: flex;
		//justify-content: space-between;
		z-index: 999;
		box-sizing: border-box;
		.category-item {
			text-align: center;
			margin: 0 20rpx;
			white-space: nowrap;
			.item-con {
				display: inline-block;
				height: 88rpx;
				font-size: 30rpx;
				position: relative;
				line-height: 88rpx;
			}
			.item-con.active:after {
				content: '';
				display: block;
				text-align: center;
				width: 100%;
				height: 4rpx;
				border-radius: 10rpx;
				position: absolute;
				left: 0;
				bottom: 0;
			}
		}
	}
}
// 商品列表双列样式
.goods-list.double-column {
	display: flex;
	flex-wrap: wrap;
	margin: 0 $margin-both;
	.goods-item {
		flex: 1;
		position: relative;
		background-color: #fff;
		flex-basis: 48%;
		max-width: calc((100% - 30rpx) / 2);
		margin-right: $margin-both;
		margin-bottom: $margin-updown;
		border-radius: $border-radius;
		&:nth-child(2n) {
			margin-right: 0;
		}
		.goods-img {
			position: relative;
			overflow: hidden;
			padding-top: 100%;
			border-top-left-radius: $border-radius;
			border-top-right-radius: $border-radius;
			background-color: #fff;
			image {
				height: 332rpx;
				width: 100%;
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
			}
		}
		.info-wrap {
			padding: 0 26rpx 26rpx 26rpx;
			.goods-name {
				font-size: $font-size-base;
				line-height: 1.3;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				word-break: break-word;
				margin-top: 20rpx;
				height: 68rpx;
			}
			.discount-price {
				display: inline-block;
				font-weight: bold;
				line-height: 1;
				margin-top: 16rpx;
				color: var(--price-color);
				.unit {
					margin-right: 6rpx;
				}
				.delete-price {
					text-decoration: line-through;
					flex: 1;
					font-weight: normal;
					.unit {
						margin-right: 6rpx;
					}
				}
			}
		}
	}
}
</style>
<style lang="scss" scoped>
/deep/ .fixed {
	top: 40vh;
}
/deep/ .coupon-all {
	width: 85%;
}
.topHeight {
	height: 100vh;
}
.my_box_category_box {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	background: #ffffff;
	z-index: 999999;
	padding: 0 30rpx;
	box-sizing: border-box;
}
.hover_category {
	height: 90rpx;
}
.bottom_tips_judge {
	color: #cccccc;
	font-size: 28rpx;
	text-align: center;
	padding: 20rpx 0;
}
</style>
