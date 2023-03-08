<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="my_box" :class="isIphoneX ? 'iphone-x' : ''">
		<view class="my_box_category" v-if="token">
			<view class="category-item" v-for="(item, index) in boxStatusList" :key="index" @click="categoryChange(item.id)">
				<view class="item-con" :class="item.id == boxStatus ? 'active color-base-text color-base-bg-before acts' : ''">{{ item.name }}</view>
			</view>
		</view>
		<mescroll-uni ref="mescroll" @getData="getbox" top="90" v-if="token">
			<block slot="list">
				<view class="item" v-if="blindbox.length > 0">
					<view class="goods-list" v-for="(items, indexs) in blindbox" :key="indexs">
						<view class="list-body">
							<view class="list-body-img">
								<image v-if="items.blindbox_images != ''" :src="$util.img(items.blindbox_images)" @error="errorImg()" mode="aspectFit"></image>
								<image v-else :src="$util.img('public/uniapp/blindbox/default.png')"></image>
							</view>
							<view class="shop-content">
								<view class="shop-title">{{ items.blindbox_name }}</view>
								<view class="statusing font-size-tag" v-if="items.blindbox_status == 1">进行中</view>
								<!-- <view class="status font-size-tag color-tip " v-if="items.blindbox_status==-1">已关闭</view> -->
								<view class="statused font-size-tag color-tip" v-if="items.blindbox_status == 2">已结束</view>
								<view class="font-size-tag ul">
									<text class="li"></text>
									<text class="color-tip lititle">
										盲盒次数：
										<text class="color-title ">
											可拆{{ items.blindbox_count }}次，剩余
											<text class="color-base-text">{{ items.blindbox_inventory }}</text>
											次
										</text>
									</text>
								</view>
								<view class="font-size-tag ul">
									<text class="li-two"></text>
									<text class="color-tip lititle">
										我的次数：
										<text class="color-title ">
											已拆
											<text class="color-base-text">{{ items.buy_num }}</text>
											次
										</text>
									</text>
								</view>
							</view>
						</view>
						<view class="my-prize-box">
							<text class="color-tip prize-time font-size-tag">结束时间：{{ $util.timeStampTurnTime(items.end_time) }}</text>
							<text class="color-base-text my-prize" @click="toMyprize(items)">
								我的奖品
								<text class="iconfont iconright font-size-sub toprizeicon"></text>
							</text>
						</view>
					</view>
				</view>
				<view v-else><ns-empty :isIndex="false" text="暂无数据"></ns-empty></view>
			</block>
		</mescroll-uni>
		<ns-login ref="ns-login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
export default {
	data() {
		return {
			boxStatusList: [
				{
					id: '',
					name: '全部'
				},
				{
					id: '1',
					name: '进行中'
				},
				{
					id: '2',
					name: '已结束'
				}
			],
			boxStatus: '',
			token: null,
			blindbox: [],
			state: 1,
			showEmpty: false,
			isIphoneX: false //判断手机是否是iphoneX以上
		};
	},
	onShow() {
		
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
		
		
		if (uni.getStorageSync('token')) {
			this.token = uni.getStorageSync('token');
			if (this.$refs.mescroll) this.$refs.mescroll.refresh();
		} else {
			setTimeout(() => {
				this.$refs.login.open('/pages_promotion/blindbox/my_box');
			});
		}
	},
	onLoad() {
		this.isIphoneX = this.$util.uniappIsIPhoneX();
	},
	methods: {
		getbox(mescroll) {
			this.showEmpty = false;
			this.$api.sendRequest({
				url: '/blindbox/api/blindbox/myblindbox',
				data: {
					status: this.boxStatus,
					page: mescroll.num,
					page_size: mescroll.size
				},
				success: res => {
					this.showEmpty = true;
					let newArr = [];
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
					mescroll.endSuccess(newArr.length); //设置列表数据
					if (mescroll.num == 1) this.blindbox = []; //如果是第一页需手动制空列表
					this.blindbox = this.blindbox.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		categoryChange(e) {
			this.boxStatus = e;
			this.$refs.mescroll.refresh();
		},
		toMyprize(e) {
			this.$util.redirectTo('/pages_promotion/blindbox/my_prize', { blindbox_id: e.blindbox_id });
		},
		errorImg() {
			this.blindbox.blindbox_images = this.$util.getDefaultImage().goods;
		}
	},
	watch: {
		storeToken: function(nVal, oVal) {
			if (nVal) {
				this.token = nVal;
				this.$refs.mescroll.refresh();
			}
		}
	},
	computed: {
		storeToken() {
			return this.$store.state.token;
		}
	}
};
</script>

<style lang="scss">
.my_box {
	.my_box_category {
		width: 100%;
		height: 88rpx;
		display: flex;
		justify-content: space-around;
		background-color: #fff;
		position: fixed;
		top: 0;
		z-index: 999;
		box-sizing: border-box;
		.category-item {
			width: 100rpx;
			text-align: center;
			.item-con {
				display: inline-block;
				height: 88rpx;
				font-size: 30rpx;
				position: relative;
				line-height: 88rpx;
			}
			.acts {
				font-weight: bold;
			}
			.item-con.active:after {
				content: '';
				display: block;
				text-align: center;
				width: 100%;
				height: 4rpx;
				border-radius: 6rpx;
				position: absolute;
				left: 0;
				bottom: 0;
			}

			&:last-of-type {
				margin-right: 0;
			}
		}
	}
	.goods-list {
		margin: 20rpx 30rpx;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 30rpx;
		.list-body {
			display: flex;
			justify-content: space-between;
			.list-body-img {
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #fff;
				width: 232rpx;
				height: 232rpx;
				margin-right: 20rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.shop-content {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				flex: 1;
				.shop-title {
					margin-top: -8rpx;
					height: 84rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					word-break: break-word;
					line-height: 42rpx;
					color: $color-title;
				}
				.statusing {
					color: #03bd04;
					border: 2rpx solid #03bd04;
					border-radius: 6rpx;
					padding: 6rpx 0;
					line-height: 1;
					width: 104rpx;
					text-align: center;
				}
				.status {
					border: 2rpx solid $color-tip;
					border-radius: 6rpx;
					padding: 6rpx 0;
					line-height: 1;
					width: 104rpx;
					text-align: center;
				}
				.statused {
					border: 2rpx solid $color-tip;
					border-radius: 6rpx;
					padding: 6rpx 0;
					line-height: 1;
					width: 104rpx;
					text-align: center;
				}
				.box-price {
					line-height: 1;
					font-size: 40rpx;
					.box-price-icon {
						margin-right: 6rpx;
						font-size: $font-size-tag;
					}
				}
				.ul {
					display: flex;
					align-items: center;
					.li {
						display: inline-block;
						background-color: #ff4544;
						width: 6rpx;
						height: 6rpx;
						border-radius: 50%;
						margin-right: 10rpx;
					}
					.lititle {
						white-space: nowrap;
					}
					.li-two {
						display: inline-block;
						background-color: #4470ff;
						width: 6rpx;
						height: 6rpx;
						border-radius: 50%;
						margin-right: 10rpx;
					}
				}
			}
		}
		.my-prize-box {
			border-top: 2rpx solid #eee;
			margin-top: 20rpx;
			padding-top: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.toprizeicon {
				margin-left: 10rpx;
			}
		}
	}
}
</style>
