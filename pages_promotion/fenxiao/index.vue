<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="fenxiao_index">
		<block v-if="info.fenxiao_id > 0">
			<!-- 头部 -->
			<view class="fenxiao_index_header color-base-bg">
				<view class="member">
					<view class="member-pic">
						<image
							:src="info.headimg ? $util.img(info.headimg) : $util.getDefaultImage().head"
							@error="info.headimg = $util.getDefaultImage().head"
							mode="aspectFill"
						></image>
					</view>
					<view class="member-info">
						<view @click="toLevel()" class="member-info-box">
							<text class="name">{{ info.fenxiao_name }}</text>
							<text class="level_name">{{ info.level_name }}</text>
						</view>
						<view class="recommend">推荐人：{{ info.parent_name ? info.parent_name : '无' }}</view>
					</view>
					<!-- <view class="member-tixian" @click="goTixian()">{{ fenxiaoWords.withdraw }}</view> -->
					<view @click="$util.redirectTo('/pages_promotion/fenxiao/promote_code', { templateId: templateId })" class="manu-list-box">
						<image class="code" :src="$util.img('public/uniapp/fenxiao/index/code1.png')" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<!-- 提现 -->
			<view class="fenxiao_index_money color-base-bg">
				<view @click="$util.redirectTo('/pages_promotion/fenxiao/bill')" class="index-money-item">
					<view class="item_money">{{ info.total_commission }}</view>
					<view class="item_tit">累计佣金 (元)</view>
				</view>
				<view class="xian"></view>
				<view @click="$util.redirectTo('/pages_promotion/fenxiao/withdraw_list')" class="index-money-item">
					<view class="item_money">{{ info.account_withdraw }}</view>
					<view class="item_tit">累计提现 (元)</view>
				</view>
				<view class="xian"></view>
				<view @click="$util.redirectTo('/pages_promotion/fenxiao/withdraw_list')" class="index-money-item">
					<text class="item_money">{{ info.account_withdraw_apply }}</text>
					<text class="item_tit">{{ fenxiaoWords.withdraw }}中（元）</text>
				</view>
			</view>
			<!-- 佣金 -->
			<view class="fenxiao-index-allmoney">
				<view class="allmoney-top">
					<view class="allmoney-top-money">
						<view class="total_commission">{{ info.account }}</view>
						<view class="font-size-sub">可{{ fenxiaoWords.withdraw }}（元）</view>
					</view>
					<text @click="$util.redirectTo('/pages_promotion/fenxiao/withdraw_apply')" class="allmoney-top-btn color-base-bg">申请提现</text>
				</view>
				<view class="allmoney-xian"></view>
				<view class="allmoney-bottom">
					<view class="allmoney-today">
						<view class="today font-size-base">{{ info.today_commission | moneyFormat }}</view>
						<view class="font-size-sub">今日收入 (元)</view>
					</view>
					<view class="allmoney-all-wrap" @click="$util.redirectTo('/pages_promotion/fenxiao/order', { type: 1 })">
						<view class="allmoney-all font-size-base">{{ info.in_progress_money | moneyFormat }}</view>
						<view class="font-size-sub">进行中 (元)</view>
					</view>
					<view class="allmoney-all-wrap">
						<view class="allmoney-all font-size-base">{{ info.today_order_money | moneyFormat }}</view>
						<view class="font-size-sub">总销售额 (元)</view>
					</view>
				</view>
			</view>

			<view class="fenxiao-index-other">
				<view @click="$util.redirectTo('/pages_promotion/fenxiao/team')" class="all-money-item">
					<view class="img-wrap"><image :src="$util.img('public/uniapp/fenxiao/index/team2.png')" mode="aspectFill"></image></view>
					<view class="all-money-tit-wrap">
						<text class="all-money-tit">我的团队</text>
						<text class="all-money-num">{{ teamNum }}人</text>
						<text class="iconfont iconright"></text>
					</view>
				</view>
			</view>

			<!-- 功能列表 -->
			<view class="fenxiao_manu_list">
				<view class="content_manu">
					<view class="manu-list">
						<view class="manu-list-box" @click="$util.redirectTo('/pages_promotion/fenxiao/withdraw_apply')">
							<image :src="$util.img('public/uniapp/fenxiao/index/withdraw.png')" mode="aspectFill"></image>
							<text>{{ fenxiaoWords.withdraw }}</text>
						</view>
					</view>
					<view class="manu-list">
						<view class="manu-list-box" @click="$util.redirectTo('/pages_promotion/fenxiao/withdraw_list')">
							<image :src="$util.img('public/uniapp/fenxiao/index/tixian.png')" mode="aspectFill"></image>
							<text>{{ fenxiaoWords.withdraw }}明细</text>
						</view>
					</view>
					<view class="manu-list">
						<view class="manu-list-box" @click="$util.redirectTo('/pages_promotion/fenxiao/order')">
							<image :src="$util.img('public/uniapp/fenxiao/index/order.png')" mode="aspectFill"></image>
							<text>{{ fenxiaoWords.concept + '订单' }}</text>
						</view>
					</view>
					<view class="manu-list">
						<view class="manu-list-box" @click="$util.redirectTo('/pages_promotion/fenxiao/team')">
							<image :src="$util.img('public/uniapp/fenxiao/index/team.png')" mode="aspectFill"></image>
							<text>{{ fenxiaoWords.my_team }}</text>
						</view>
					</view>
					<view class="manu-list">
						<view class="manu-list-box" @click="$util.redirectTo('/pages_promotion/fenxiao/promote_code', { templateId: templateId })">
							<image :src="$util.img('public/uniapp/fenxiao/index/code.png')" mode="aspectFill"></image>
							<text>推广海报</text>
						</view>
					</view>

					<view class="manu-list">
						<view class="manu-list-box" @click="$util.redirectTo('/pages_promotion/fenxiao/bill')">
							<image :src="$util.img('public/uniapp/fenxiao/index/bill.png')" mode="aspectFill"></image>
							<text>账单</text>
						</view>
					</view>
				</view>
			</view>
		</block>
		<ns-copyright></ns-copyright>
		<view class="empty" v-if="!info.fenxiao_id > 0 && showEmpty">
			<image :src="$util.img('public/uniapp/fenxiao/index/no-fenxiao.png')" mode="widthFix"></image>
			<text>您还不是{{ fenxiaoWords.fenxiao_name }}，请先提交申请</text>
			<view @click="$util.redirectTo('/pages_promotion/fenxiao/apply')" class="color-base-bg">立即加入</view>
		</view>
		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import fenxiaoWords from '@/common/js/fenxiao-words.js';
export default {
	data() {
		return {
			info: {
				fenxiao_name: '',
				fenxiao_id: 0
			},
			showEmpty: false,
			teamNum: 0,
			//初始化获取到的模板id
			templateId: ''
		};
	},
	components: {},
	mixins: [fenxiaoWords],
	onShow() {
		setTimeout(() => {
			if (this.addonIsExist && !this.addonIsExist.fenxiao) {
				this.$util.showToast({
					title: '商家未开启分销',
					mask: true,
					duration: 2000
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
				}, 2000);
				return;
			}
		}, 1000);

		if (this.fenxiaoWords && this.fenxiaoWords.concept) this.$langConfig.title(this.fenxiaoWords.concept + '中心');

		if (uni.getStorageSync('token')) {
			this.checkFenxiaoIsStart();
		} else {
			setTimeout(() => {
				this.$refs.login.open('/pages_promotion/fenxiao/index');
			});
		}

		this.getTemplateId();
	},
	methods: {
		/**
		 * 检测分销是否开启
		 */
		checkFenxiaoIsStart() {
			this.$api.sendRequest({
				url: '/fenxiao/api/config/basics',
				success: res => {
					if (res.code == 0 && res.data) {
						if (res.data.is_apply == 1 && res.data.level > 0) {
							this.getFenxiaoDetail();
						}else{
							this.$util.showToast({
								title: '商家未开启分销',
								mask: true,
								duration: 2000
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages/member/index');
							}, 2000);
						}
					}
				}
			});
		},
		// 获取分销商信息
		getFenxiaoDetail() {
			this.$api.sendRequest({
				url: '/fenxiao/api/fenxiao/detail',
				success: res => {
					if (res.data) {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						this.info = res.data;
						this.getTeamNum();
						this.showEmpty = true;
					} else {
						this.$util.redirectTo('/pages_promotion/fenxiao/apply', {}, 'redirectTo');
					}
				},
				fail: res => {
					this.showEmpty = true;
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		//去提现
		goTixian() {
			this.$util.redirectTo('/pages_promotion/fenxiao/withdraw_apply');
		},
		toLevel() {
			this.$util.redirectTo('/pages_promotion/fenxiao/level');
		},
		getTeamNum() {
			this.$api.sendRequest({
				url: '/fenxiao/api/fenxiao/teamnum',
				success: res => {
					if (res.code >= 0) {
						this.teamNum = res.data;
					}
				}
			});
		},
		/**
		 * 获取分享海报模板id
		 */
		getTemplateId() {
			this.$api.sendRequest({
				url: '/fenxiao/api/fenxiao/posterTemplateIds',
				success: res => {
					if (res.code >= 0) {
						this.templateId = [...res.data].join();
					}
				}
			});
		}
	},

	onBackPress(options) {
		if (options.from === 'navigateBack') {
			return false;
		}
		this.$util.redirectTo('/pages/member/index', {}, 'reLaunch');
		return true;
	},
	watch: {
		storeToken: function(nVal, oVal) {
			if (nVal) {
				this.checkFenxiaoIsStart();
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
.fenxiao_index {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.fenxiao_index_header {
	width: 100%;
	position: relative;
	min-height: 200rpx;
	.member {
		width: 100%;
		height: 220rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 50rpx 40rpx 0;
		box-sizing: border-box;

		.member-pic {
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
			border: 6rpx solid #fff;

			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}

		.member-info {
			width: 500rpx;
			height: 120rpx;
			margin-left: 16rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			view {
				color: #fff;
			}
			.member-info-box {
				display: flex;
				align-items: center;
				line-height: 1;
			}
			.name {
				font-size: $font-size-toolbar;
			}
			.level_name {
				display: flex;
				align-items: center;
				justify-content: center;
				border: 2rpx solid #fff;
				color: #fff;
				height: 34rpx;
				font-size: $font-size-activity-tag;
				padding: 0 4rpx;
				margin-left: 16rpx;
				line-height: 38rpx;
				border-radius: 4rpx;
			}

			.recommend {
				font-size: $font-size-tag;
				margin-top: 20rpx;
				line-height: 1;
				margin-bottom: 10rpx;
			}
		}

		.member-tixian {
			width: 120rpx;
			height: 50rpx;
			border: 2rpx solid #ffffff;
			border-radius: $border-radius;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: $font-size-tag;
			color: #ffffff;
		}
		.code {
			width: 50rpx;
			height: 50rpx;
		}
	}
}

.fenxiao_index_money {
	color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;

	.xian {
		height: 40rpx;
		border: 2rpx solid rgba(255, 255, 255, 0.5);
	}

	.index-money-item {
		padding: 40rpx 0;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.item_money {
			color: #fff;
			font-size: 36rpx;
			line-height: 1;
		}
		.item_tit {
			padding-top: 10rpx;
			font-size: $font-size-tag;
			color: #fff;
		}
	}
}

.fenxiao-index-allmoney {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin-top: 20rpx;
	width: 690rpx;
	border-radius: 10rpx;
	background-color: #ffffff;

	.allmoney-top {
		padding: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.allmoney-top-money {
			.total_commission {
				margin-bottom: 10rpx;
				line-height: 1;
				font-size: $font-size-base;
				color: var(--price-color);
			}
		}
		.allmoney-top-btn {
			color: var(--btn-text-color);
			padding: 12rpx 17rpx;
			font-size: $font-size-tag;
			line-height: 1;
			border-radius: $border-radius;
		}
	}
	.allmoney-xian {
		width: 100%;
		border-top: 2rpx solid $color-line;
	}
	.allmoney-bottom {
		display: flex;
		.allmoney-today {
			padding: 30rpx;
			flex: 1;
			.today {
				margin-bottom: 10rpx;
				line-height: 1;
				font-size: $font-size-toolbar;
				color: var(--price-color);
			}
		}
		.allmoney-all-wrap {
			padding: 30rpx;
			flex: 1;
			.allmoney-all {
				margin-bottom: 10rpx;
				line-height: 1;
				font-size: $font-size-toolbar;
				color: var(--price-color);
			}
		}
	}
}

.fenxiao-index-other {
	padding: 30rpx 0;
	margin-top: 20rpx;
	width: 690rpx;
	border-radius: 10rpx;
	background-color: #ffffff;
	.all-money-item {
		margin: 0 30rpx;
		display: flex;
		font-size: $font-size-tag;
		align-items: center;
		.img-wrap {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 70rpx;
			height: 70rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.all-money-tit-wrap {
			flex: 1;
			margin-left: 24rpx;
			display: flex;
			align-items: center;

			height: 70rpx;
			.all-money-tit {
				line-height: 1;
				color: $color-title;
				font-size: $font-size-base;
				flex: 1;
			}
			.all-money-num {
				color: $color-tip;
				font-size: $font-size-sub;
				line-height: 1;
			}
			.iconright {
				color: $color-tip;
				font-size: $font-size-sub;
				line-height: 1;
			}
		}
	}
}

.fenxiao_manu_list {
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 690rpx;
	margin-top: 20rpx;
	background-color: #fff;
	border-radius: 10rpx;
	.title-wrap {
		display: flex;
		align-items: center;
		border-bottom: 1rpx solid #f7f7f7;
		padding: 20rpx 40rpx;
		.title-img {
			width: 30rpx;
			height: 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 10rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.title {
			color: #333333;
			font-size: $font-size-base;
			padding-left: 10rpx;
			padding-left: 5rpx;
		}
	}
	.content_manu {
		padding: 20rpx 0;
		width: 100%;
		background: #fff;
		border-radius: 10rpx;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 10rpx;
		.manu-list {
			width: 24.5%;
			height: 150rpx;
			display: inline-block;
			padding: 0 $padding;
			box-sizing: border-box;
			.manu-list-box {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				image {
					width: 50rpx;
					height: 50rpx;
					margin-bottom: 15rpx;
				}
				text {
					font-size: $font-size-sub;
				}
			}
		}
	}
}
.fenxiao_content {
	.content_manu {
		width: 100%;
		background: #ffffff;
		border-radius: 15rpx;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		.manu-list {
			width: 24.5%;
			height: 150rpx;
			display: inline-block;
			box-sizing: border-box;
			.manu-list-box {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				image {
					width: 60rpx;
					height: 60rpx;
					margin-bottom: 15rpx;
				}
				text {
					font-size: $font-size-tag;
				}
			}
		}
	}
}
.empty {
	width: 100%;
	height: 400rpx;
	margin-top: 200rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	image {
		width: 300rpx;
		margin-bottom: 50rpx;
	}
	text {
		font-size: $font-size-tag;
		font-weight: 600;
	}
	view {
		width: 300rpx;
		height: 70rpx;
		border-radius: $border-radius;
		text-align: center;
		line-height: 70rpx;
		color: #ffffff;
		margin-top: 30rpx;
	}
}
</style>
<style scoped>
>>> .ns-copyright-info {
	margin-bottom: 0;
}
</style>
