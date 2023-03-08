<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<view class="present-head" :style="{ background: 'url(' + $util.img('public/uniapp/giftcard/detail/present_bg.png') + ')  no-repeat  0 0/100% 100%' }"></view>

		<view class="present-body">
			<view
				class="card-item margin-bottom"
				:style="{
					background: $util.img(carddetail.card_cover)
						? 'url(' + $util.img(carddetail.card_cover) + ') no-repeat 0 0/100% 100%'
						: 'url(' + $util.img('public/uniapp/giftcard/detail/gitcard_default3.png') + ') no-repeat 0 0/100% 100%'
				}"
			>
				<view class="card-content">
					<view class="content-head">
						<view class="card-name">{{ carddetail.card_name }}</view>
						<view class="use-orno">待使用</view>
					</view>
					<view class="card-use">礼品卡权益</view>
					<!-- <view class="card-num">￥{{carddetail.balance}} + {{carddetail.point}}柚币</view> -->
					<view class="card-num" v-if="carddetail.balance > 0.0 && carddetail.point > 0 && carddetail.goods_num > 0">
						￥{{ carddetail.balance }}+{{ carddetail.point }}柚币+商品*{{ carddetail.goods_num }}
					</view>
					<view class="card-num" v-else-if="carddetail.balance > 0.0 && carddetail.point == 0">￥{{ carddetail.balance }}</view>
					<view class="card-num" v-else-if="carddetail.balance == 0.0 && carddetail.point > 0">{{ carddetail.point }} 柚币</view>
					<view class="card-num" v-else-if="carddetail.balance == 0.0 && carddetail.point == 0 && carddetail.goods_num > 0">商品*{{ carddetail.goods_num }}</view>

					<view class="card-num" v-else-if="carddetail.balance > 0.0 && carddetail.point > 0 && carddetail.goods_num == 0">
						￥{{ carddetail.balance }}+{{ carddetail.point }}柚币
					</view>
					<view class="card-num" v-else-if="carddetail.balance > 0.0 && carddetail.point == 0 && carddetail.goods_num > 0">
						￥{{ carddetail.balance }}+商品*{{ carddetail.goods_num }}
					</view>
					<view class="card-num" v-else-if="carddetail.balance == 0.0 && carddetail.point > 0 && carddetail.goods_num > 0">
						{{ carddetail.point }}柚币+商品*{{ carddetail.goods_num }}
					</view>
					<view v-if="carddetail.length > 0" class="card-id">NO.{{ carddetail.number }}</view>
				</view>
			</view>

			<view>
				<view v-if="this.code == 0" style="font-weight: 600;">To:{{ carddetail.receive_member_name }}</view>
				<view v-else style="font-weight: 600;text-align: center;" @click="alertLogin()">{{ haveReceive }}</view>
				<textarea class="info" :value="carddetail.leav_message"></textarea>
				<view class="" style="margin-left: 180rpx;display: flex;">
					<view class="" style="text-align: right;width: 320rpx;">
						{{ carddetail.has_member_name }}
						<br />
						<view style="width: 320rpx;">{{ $util.timeStampTurnTime(carddetail.create_time) }}</view>
					</view>
					<view><image style="width: 100rpx; height: 100rpx; margin-left: 15rpx;" :src="carddetail.has_member_headimg" mode=""></image></view>
				</view>
			</view>
		</view>
		<view class="present-btn" @click="gotocardlist">查看我的礼品卡</view>

		<view class="launch-mask" v-if="show == true" @click="hide()">
			<view class="mask-img"><image :src="$util.img('public/uniapp/giftcard/detail/gift_bag.png')" mode="aspectFit"></image></view>
			<text class="mask-info">送你一张礼品卡</text>
		</view>

		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
export default {
	data() {
		return {
			carddetail: {},
			haveReceive: '',
			show: false,
			transfer_id: 0,
			code: ''
		};
	},
	onLoad(option) {
		this.getData(option.transfer_id);
		this.transfer_id = option.transfer_id;
		this.show = true;
	},
	onShow() {},
	methods: {
		getData(id) {
			this.$api.sendRequest({
				url: '/giftcard/api/giftcard/receivegiftcard',
				data: { transfer_id: id },
				success: res => {
					if (res.code == 0 && res.data) {
						this.carddetail = res.data;
						this.code = 0;
					} else {
						this.haveReceive = res.message;
						this.code = 1;
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		gotocardlist() {
			this.$util.redirectTo('/pages_promotion/giftcard/my_giftcard/my_giftcard');
		},
		hide() {
			this.show = false;
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open('/pages_promotion/giftcard/present/accept?transfer_id=' + this.transfer_id);
				return;
			}
		},
		alertLogin() {
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open('/pages_promotion/giftcard/present/accept?transfer_id=' + this.transfer_id);
				return;
			}
		}
	}
};
</script>

<style lang="scss">
.present-head {
	width: 100%;
	height: 300rpx;
	z-index: 0;
}
.present-body {
	background: #fff;
	padding: 40rpx 30rpx;
	margin: -120rpx 30rpx 0;
	border-radius: 10rpx;
	z-index: 2;

	.card-item {
		padding: 10rpx 30rpx;
		border-radius: 20rpx;

		.card-content {
			padding: 20rpx 30rpx;

			.content-head {
				display: flex;
				justify-content: space-between;
				margin-bottom: 30rpx;

				.card-name {
					font-size: 40rpx;
					color: #fff;
					max-height: 160rpx;
					width: 80%;
					overflow: hidden;
				}

				.use-orno {
					color: #fff;
				}
			}

			.card-use {
				color: #fff;
			}

			.card-num {
				margin-top: 20rpx;
				line-height: 20rpx;
				color: #fff;
			}

			.card-id {
				margin-top: 40rpx;
				color: #fff;
			}
		}
	}
}

.present-btn {
	left: 300rpx;
	bottom: 50rpx;
	position: fixed;
	color: #fd7979;
}

.launch-mask {
	position: fixed;
	top: 0rpx;
	left: 0rpx;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
	.mask-img {
		text-align: right;
		margin: 400rpx 176rpx 0;
		image {
			width: 400rpx;
			height: 400rpx;
		}
	}
	.mask-info {
		margin: 20rpx 0 0 280rpx;
		color: #fff;
	}
}
</style>
