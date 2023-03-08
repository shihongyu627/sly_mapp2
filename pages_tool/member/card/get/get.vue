<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="page" v-if="cardInfo">
		<view class="bg-box" :style="{backgroundImage:'url('+$util.img('public/uniapp/giftcard/give_bg_1.png')+')'}">
			<view class="card-img">
				<image :src="$util.img(cardimg())" mode="widthFix"></image>
			</view>
			<view class="card-box">
				<view class="member-info">
					<view class="headimg">
						<image
							:src="$util.img(cardInfo.member_headimg ? cardInfo.member_headimg : $util.getDefaultImage().head)"
							@error="cardInfo.member_headimg = $util.getDefaultImage().head" mode="aspectFill"></image>
					</view>
					<view class="member">
						<text class="member-name">{{cardInfo.member_nickname}}</text>
					</view>
				</view>

				<view class="desc">
					<view class="title">
						送您「{{cardInfo.card_name}}」
					</view>
					<view class="content">{{cardInfo.blessing}}</view>
				</view>
			</view>
		</view>
		<image class="bg-img" :src="$util.img('public/uniapp/giftcard/give_bg_2.png')" mode="widthFix"></image>
		<block v-if="!cardInfo.is_self">
			<button class="btn getBtn" type="primary" v-if="!cardInfo.is_transfer" @click="transfer()">领取</button>
			<button class="btn is_transfer" type="primary" v-else>该卡已被领取</button>
		</block>
		<view @touchmove.prevent.stop>
			<uni-popup ref="cardPopup" type="center">
				<view class="card-popup-layer popup-layer">
					<view class="head-wrap" @click="closeCardPopup()">
						<text class="iconfont icon2guanbi"></text>
					</view>
					<view class="content">
						<view>恭喜您</view>
						<view>成功领取了体验卡</view>
					</view>
					<view class="button-box"><button type="primary" @click="closeCardPopup()">去看看</button></view>
				</view>
			</uni-popup>
		</view>
		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				member_card_id: 0,
				cardInfo: null,
				goodsOpen: false,
				source_member: ''
			};
		},
		computed: {

		},
		onLoad(option) {
			console.log(option);
			//小程序分享接收source_member
			if (option.source_member) {
				uni.setStorageSync('source_member', option.source_member);
				this.source_member = option.source_member
			}
			if (option.member_card_id) this.member_card_id = option.member_card_id;
		},
		onShow() {
			this.getData();
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
			openCardPopup() {
				this.$refs.cardPopup.open();
			},
			closeCardPopup() {
				this.$refs.cardPopup.close();
				this.$util.redirectTo('/pages_tool/member/card/list/list');
			},
			cardimg() {
				if (this.cardInfo && this.cardInfo.card_cover.indexOf(',') != -1) {
					return this.cardInfo.card_cover;
				} else {
					return this.cardInfo ? this.cardInfo.card_cover.split(',')[0] : '';
				}
			},
			getData() {
				this.$api.sendRequest({
					url: '/subcard/api/membercard/detail',
					data: {
						member_card_id: this.member_card_id
					},
					success: res => {
						console.log(res);
						if (res.code >= 0) {
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
							this.cardInfo = res.data;
							this.card_use_list = res.data.card_use_list || []
						} else {
							this.$util.showToast({
								title: res.message || '未获取到体验卡信息！'
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages_tool/member/card/list/list');
							}, 1500);
						}
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});

			},
			transfer() {
				if (!uni.getStorageSync('token')) {
					let path = '/pages_tool/member/card/get/get';
					if (this.cardData && this.cardData.member_id) path += '?source_member=' + this.source_member;
					if (this.member_card_id) path += '&member_card_id=' + this.member_card_id;
					this.$refs.login.open(path);
				} else {
					this.$api.sendRequest({
						url: '/subcard/api/membercard/transfer',
						data: {
							member_card_id: this.member_card_id
						},
						success: res => {
							if (res.code >= 0) {
								this.openCardPopup();

							} else {
								this.$util.showToast({
									title: res.message,
									mask: true,
									duration: 2000
								});
							}
						}
					});
				}

			}
		}
	};
</script>

<style lang="scss" scoped>
	.page {
		background: #ffffff;
		min-height: 100vh;

		box-sizing: border-box;
	}

	.bg-box {
		background-color: #f6f9ff;
		background-repeat: no-repeat;
		background-size: 100%;
		padding: 30rpx;
	}

	.bg-img {
		background-color: #f6f9ff;
		width: 100%;
		max-height: 100rpx;
	}

	.member-box {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20rpx;

		image {
			width: 44rpx;
			height: 44rpx;
			border-radius: 6rpx;
		}

		view {
			font-size: 30rpx;
			margin-left: 10rpx;
		}

	}

	.card-status {
		margin: 15rpx auto;
		font-size: 36rpx;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;

		image {
			width: 44rpx;
			height: 44rpx;
			margin-right: 15rpx;
		}
	}

	.card-img {
		margin: 20rpx auto;
		width: 96%;
		overflow: hidden;

		image {
			width: 100%;
			border-radius: 18rpx;
			margin: 0;
		}
	}

	.card-title {
		font-size: 30rpx;
		color: #444444;
		display: flex;
		justify-content: center;

		>text {
			color: var(--price-color);
		}

	}

	.card-box {
		display: flex;
		padding-top: 40rpx;
		margin-top: 40rpx;
		flex-direction: column;

		.member-info {
			display: flex;
			flex-direction: column;
			align-items: center;

			.headimg {
				width: 110rpx;
				height: 110rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					width: 100%;
					max-height: 110rpx;
					border-radius: 50%;
					border: 2rpx solid #FFFFFF;
				}
			}

			.member {
				width: 100%;
				overflow: hidden;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				justify-content: center;
				text-align: center;
				margin-top: 10rpx;

				.member-name {
					font-size: 32rpx;
					color: #666666;
				}
			}
		}

		.desc {
			margin-top: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;

			.title {
				font-size: 30rpx;
				font-weight: bold;
				text-align: center;
			}

			.content {
				text-align: center;
				font-size: 30rpx;
				color: #888888;
			}
		}

	}

	.goods-list {
		border-top: 0rpx solid #F0F0F0;
		padding: 30rpx 0;
		display: flex;

		.goods-left {
			display: flex;
			width: calc(100% - 108rpx);
			overflow: hidden;
			white-space: nowrap;
			position: relative;
			align-items: center;

			image {
				width: 108rpx;
				max-height: 108rpx;
				margin-right: 22rpx;
				flex-shrink: 0;
				border-radius: 16rpx;
			}

			&:after {
				content: ' ';
				box-shadow: -4rpx 0px 24rpx rgba(0, 0, 0, .8);
				width: 1rpx;
				height: 80rpx;
				right: -1rpx;
				top: 14rpx;
				position: absolute;
				background: rgba(255, 255, 255, 0);
			}
		}

		.goods-more {
			width: 108rpx;
			height: 108rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 26rpx;
			position: relative;

			text {
				font-size: 28rpx;
				line-height: 1;
			}

		}

		&.goodsOpen {
			flex-direction: column;
			position: relative;

			.btn {
				position: absolute;
				right: 20rpx;
				top: 50rpx;
				font-size: 26rpx;
				display: flex;
				align-items: baseline;
				background-color: #1189F4;

				text {
					line-height: 1.1;
					font-size: 24rpx;
					margin-left: 8rpx;
				}

			}
		}

		.goods-item {
			display: flex;
			margin-bottom: 20rpx;

			.goods-image {
				width: 108rpx;
				height: 108rpx;
				overflow: hidden;
				border-radius: 18rpx;

				image {
					width: 108rpx;
					height: 108rpx;
					max-height: 108rpx;
				}
			}

			.goods-info {
				width: calc(100% - 268rpx);

				.goods-name {
					overflow: hidden;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					line-height: 1.5;
					font-size: 28rpx;
				}

				.goods-num {
					margin-top: 20rpx;

					text {
						color: #666666;
						font-size: 24rpx;

						&:last-child {
							margin-left: 50rpx;
						}
					}
				}
			}
		}
	}

	.btn {
		width: 50%;
		margin: 40rpx auto;
		background-color: var(--giftcard-promotion-color) !important;
		font-weight: bold;

		&.is_transfer {
			background-color: #F6F6F6 !important;
			color: #999999 !important;
		}
	}

	.getBtn {
		background-color: #1189F4 !important;
	}

	.card-popup-layer {
		width: 500rpx;
		height: 400rpx;
		position: relative;
		padding: 20rpx;
		box-sizing: border-box;

		.head-wrap {
			width: 100%;
			text-align: right;

			text {
				font-size: 34rpx;
			}
		}

		.content {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 32rpx;
			font-weight: bold;
			padding: 40rpx 0;
		}

		.button-box {
			margin-top: 10rpx;

			button {
				background-color: #1189F4 !important;
			}
		}
	}
</style>
