<template>
	<view class="openStore-wrapp">
		<view class="openStore-header">
			<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				:duration="duration">
				<swiper-item class="banner" v-for="(item,pageIndex) in adv_list" :key="pageIndex">
					<image class="banner" :src="$util.loadimg(item.adv_image)" mode="aspectFill"
						@click="diyRedirectTo(item)"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="step-box" v-if="timeline_info.img">
			<view class="step-item" @click="goHref('/openStore/history')">
				<image class="step-item" :src="$util.loadimg(timeline_info.img)" mode="aspectFill"></image>
			</view>
			<!-- 	<view class="step-title" @click="goHref('/openStore/history')">
				了解更多
			</view> -->
		</view>
		<view class="menu-box">
			<view class="menu-item" @click="goHref('/openStore/process')">
				<img class="menu-icon" src='./img/process.png' mode="aspectFill"></img>
				<view class="menu-content">
					<view class="menu-title">
						开店流程
					</view>
					<!-- <view class="menu-text">
						流程&条件&优势
					</view> -->
				</view>
			</view>
			<view class="menu-item" @click="goHref('/openStore/cost')">
				<img class="menu-icon" src='./img/cost.png' mode="aspectFill"></img>
				<view class="menu-content">
					<view class="menu-title">
						开店费用
					</view>
					<!-- 	<view class="menu-text">
						单店&多点费用
					</view> -->
				</view>
			</view>
		</view>
		<view class="openStore-btn" @click="goHref('/openStore/userApply')">
			<img class="openStore-icon" src='./img/open.png' mode="aspectFill" />
			<view class="openStore-title">
				我要合作
			</view>
		</view>
		<!-- 	<view class="goods-header">
			<view class="title-left">
				<img class='star-icon' src="@/common/img/starIcon.png" mode="aspectFill" />
				<view class="title">
					明星门店
				</view>
				<view class="title-br">
				</view>
				<view class="desc">
					近视防控独角兽
				</view>
			</view>
			<view class="title-right" @click="goHref('/openStore/list')">
				<view class="more">
					更多
				</view>
				<img class='right-icon' src="@/common/img/rightIcon.png" mode="aspectFill" />
			</view>
		</view> -->
		<!-- 	<view class="goods-box">
			<view class="goods-item" v-for="(item, index) in goodsList" :key="index" @click="goDetail(item)">
				<image class="goods-image" :src="$util.loadimg(item.cover_img)" mode="widthFix"></image>
				<view class="goods-title">
					{{item.upstore_abstract}}
				</view>
				<view class="goods-name">
					{{item.upstore_title}}
				</view>
			</view>
		</view> -->
	</view>
</template>
<script>
	export default {
		components: {},
		data() {
			return {
				list: [],
				active: 1,
				goodsList: [],
				adv_list: [],
				timeline_info: {}
			};
		},
		mixins: [],
		onLoad() {
			this.getListData()
		},
		methods: {
			//申请状态
			getApplyInfo(url) {
				this.$api.sendRequest({
					url: '/dealer/api/apply/info',
					data: {},
					success: res => {
						let msg = res.message;
						if (res.code == 0) {
							if (res.data.status1 == 0) {
								this.$util.redirectTo(url);
							} else {
								this.$util.redirectTo('/openStore/applyStep');
							}
						} else {
							this.$util.redirectTo(url);
						}

					},
					fail: res => {}
				});
			},
			getListData() {
				this.$api.sendRequest({
					url: '/dealer/api/config/storeapplyindex',
					data: {},
					success: res => {
						let msg = res.message;
						if (res.code == 0) {
							this.adv_list = res.data.adv_list || []
							this.timeline_info = res.data.timeline_info || {}
							this.goodsList = res.data.upstore_list || []
							this.adv_list.map((item) => {
								if (item.adv_url) {
									item.adv_url = JSON.parse(item.adv_url)
									item.adv_url = item.adv_url?.wap_url
								}
							})
						} else {
							this.$util.showToast({
								title: msg
							});
						}

					},
					fail: res => {}
				});
			},
			diyRedirectTo(link) {
				console.log(link, '跳转链接');
				link.wap_url=link.adv_url
				this.$util.diyRedirectTo(link);
			},
			goHref(url) {
				if (!url) {
					return
				}
				if (url == '/openStore/agreement') {
					this.getApplyInfo(url)
				} else {
					this.$util.redirectTo(url);
				}
			},
			goDetail(data) {
				this.$util.redirectTo('/openStore/info', {
					id: data.upstore_id,
					title: data.upstore_title
				});
			}
		}
	};
</script>

<style scoped>
	.openStore-wrapp {
		padding-bottom: 60px;
	}

	.openStore-header {
		width: 710rpx;
		height: 320rpx;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		margin-top: 10px;
		overflow: hidden;
	}

	.banner {
		width: 710rpx;
		height: 320rpx;
		opacity: 1;
		border-radius: 10px;
		overflow: hidden;
	}

	.step-box {
		width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		margin-top: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		/* padding-bottom: 15px; */
		/* padding-left: 12px; */
		/* padding-right: 12px; */
		box-sizing: border-box;
	}

	.step-item {
		width: 710rpx;
		height: 320rpx;
		opacity: 1;
		border-radius: 10px;
		overflow: hidden;
		/* 	display: flex;
		flex-direction: column;
		width: 100%;
		align-items: center;
		justify-content: center; */
	}

	.step-top {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		width: 100%;
		position: relative;
	}

	.step-left {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 3px;
		height: 100%;
	}

	.step-radius {
		width: 10px;
		height: 10px;
		background: #FFFFFF;
		border: 1px solid #A6ABBA;
		border-radius: 50%;
		opacity: 1;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 10;
	}

	.step-br {
		height: 100%;
		border-left: 1px dashed #707070;
		opacity: 1;
		box-sizing: border-box;
	}

	.step-right {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		border-left: 1px dashed #707070;
		padding-left: 15px;
		box-sizing: border-box;
		margin-left: 5px;
		min-height: 28px;
	}

	.step-rights {
		border-left: 1px dashed #fff;
	}

	.step-title {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #1189F4;
		opacity: 1;
		text-align: center;
		margin-top: 20px;
	}

	.step-desc {
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		margin-left: 25px;
		width: 200px;
		line-height: initial;
	}

	.step-time {
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: 500;
		color: #65666E;
		opacity: 1;
		line-height: initial;
	}

	.menu-box {
		width: 710rpx;
		opacity: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin: 0 auto;
		margin-top: 22px;
	}

	.menu-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 172px;
		height: 80px;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		overflow: hidden;
	}

	.menu-icon {
		width: 36px;
		height: 36px;
		border-radius: 0px;
		margin-right: 10px;
	}

	.menu-title {
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
	}

	.menu-text {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: normal;
		color: #65666E;
		opacity: 1;
	}

	.openStore-btn {
		opacity: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
		margin-top: 10px;
		width: 710rpx;
		height: 80px;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
	}

	.openStore-icon {
		width: 36px;
		height: 36px;
		border-radius: 0px;
		margin-right: 10px;
	}

	.openStore-title {
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
	}

	.goods-header {
		width: 710rpx;
		height: 40px;
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-top: 10px;
	}

	.title-left {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.star-icon {
		width: 20px;
		height: 20px;
		margin-right: 10px;
	}

	.title {
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #231E1E;
		opacity: 1;
	}

	.title-br {
		width: 1px;
		height: 12px;
		opacity: 1;
		background: #343434;
		margin-left: 12px;
		margin-right: 10px;
	}

	.desc {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: normal;
		color: #65666E;
		opacity: 1;
	}

	.title-right {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.more {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: normal;
		color: #65666E;
		opacity: 1;
	}

	.right-icon {
		width: 14px;
		height: 14px;
		margin-left: 3px;
	}

	.goods-box {
		width: 710rpx;
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		/* align-items: center; */
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.goods-item {
		width: 340rpx;
		/* height: 205px; */
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		overflow: hidden;
		margin-bottom: 30rpx;
		padding-bottom: 20rpx;
	}

	.goods-image {
		width: 340rpx;
		/* height: 140px; */
	}

	.goods-title {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #A6ABBA;
		opacity: 1;
		padding-left: 8px;
		padding-right: 8px;
		box-sizing: border-box;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.goods-name {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		padding-left: 8px;
		padding-right: 8px;
		box-sizing: border-box;
		line-height: initial;
		/* 	white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis; */
	}
</style>
