<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<view class="ns-present-bg" :style="{ background: 'url(' + $util.img('public/uniapp/giftcard/detail/present_bg.png') + ') no-repeat  0 0/100% 100%' }"></view>

		<view class="present-body">
			<view
				class="card-item margin-bottom"
				:style="{
					background: $util.img(cardinfo.card_cover)
						? 'url(' + $util.img(cardinfo.card_cover) + ') no-repeat 0 0/100% 100%'
						: 'url(' + $util.img('public/uniapp/giftcard/detail/gitcard_default3.png') + ') no-repeat 0 0/100% 100%'
				}"
			>
				<view class="card-content">
					<view class="card-name">{{ cardinfo.card_name }}</view>
					<view class="card-use">礼品卡权益</view>
					<!-- <view class="card-num">￥{{cardinfo.balance}} + {{cardinfo.point}}柚币</view> -->
					<view class="card-num" v-if="cardinfo.balance > 0.0 && cardinfo.point > 0 && cardinfo.goods_num > 0">
						￥{{ cardinfo.balance }}+{{ cardinfo.point }}柚币+商品*{{ cardinfo.goods_num }}
					</view>
					<view class="card-num" v-else-if="cardinfo.balance > 0.0 && cardinfo.point == 0">￥{{ cardinfo.balance }}</view>
					<view class="card-num" v-else-if="cardinfo.balance == 0.0 && cardinfo.point > 0">{{ cardinfo.point }} 柚币</view>
					<view class="card-num" v-else-if="cardinfo.balance == 0.0 && cardinfo.point == 0 && cardinfo.goods_num > 0">商品*{{ cardinfo.goods_num }}</view>

					<view class="card-num" v-else-if="cardinfo.balance > 0.0 && cardinfo.point > 0 && cardinfo.goods_num == 0">
						￥{{ cardinfo.balance }}+{{ cardinfo.point }}柚币
					</view>
					<view class="card-num" v-else-if="cardinfo.balance > 0.0 && cardinfo.point == 0 && cardinfo.goods_num > 0">
						￥{{ cardinfo.balance }}+商品*{{ cardinfo.goods_num }}
					</view>
					<view class="card-num" v-else-if="cardinfo.balance == 0.0 && cardinfo.point > 0 && cardinfo.goods_num > 0">
						{{ cardinfo.point }}柚币+商品*{{ cardinfo.goods_num }}
					</view>
					<view class="card-id">NO.{{ cardinfo.number }}</view>
				</view>
			</view>

			<view>
				<view style="font-weight: 600;">给TA留言:</view>
				<textarea class="info" @input="oninput" maxlength="30" placeholder="请输入留言内容，最多30个字" placeholder-style="color:#b1b2b6; font-size:30rpx;"></textarea>
			</view>
		</view>
		<view class="present-btn">
			<!-- #ifdef H5 -->
			<!-- <button type="primary" @click="openSharePopup">赠送给好友</button>
			<button type="primary" plain @click="copyUrl" class="copy-present-btn"  hover-class="none">复制链接</button> -->
			<!-- #endif -->
			<button type="primary" @click="openSharePopup">赠送给好友</button>
		</view>

		<!-- 分享弹窗 -->
		<view @touchmove.prevent.stop>
			<uni-popup ref="sharePopup" type="bottom" class="share-popup">
				<view>
					<view class="share-title">分享</view>
					<view class="share-content">
						<!-- #ifdef MP -->
						<view class="share-box">
							<button class="share-btn" :plain="true" open-type="share">
								<view class="iconfont iconiconfenxianggeihaoyou"></view>
								<text>分享给好友</text>
							</button>
						</view>
						<!-- #endif -->
						<!-- <view class="share-box" @click="openPosterPopup">
							<button class="share-btn" :plain="true">
								<view class="iconfont iconpengyouquan"></view>
								<text>生成分享海报</text>
							</button>
						</view> -->
						<!-- #ifdef H5 -->
						<view class="share-box" @click="copyUrl">
							<button class="share-btn" :plain="true">
								<view class="iconfont iconfuzhilianjie"></view>
								<text>复制链接</text>
							</button>
						</view>
						<!-- #endif -->
					</view>
					<view class="share-footer" @click="closeSharePopup"><text>取消分享</text></view>
				</view>
			</uni-popup>
		</view>

		<view class="launch-mask" v-if="show == true" @click="hide()">
			<view class="mask-img"><image :src="$util.img('public/uniapp/giftcard/detail/share.png')" mode="aspectFit"></image></view>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import { Weixin } from 'common/js/wx-jssdk.js';
import uniPopup from '@/components/uni-popup/uni-popup.vue';

export default {
	components: {
		uniPopup
	},
	data() {
		return {
			cardinfo: [],
			id: '',
			member_id: '',
			leav_message: '',
			transfer_id: '',
			shareTitle: '',
			shareImageurl: '',
			show: false
		};
	},
	onLoad(option) {
		var id = option.id;
		this.getData(id);
		this.id = option.id;
		// #ifdef MP-WEIXIN
		this.onShare();
		// #endif
	},
	onShow() {},
	methods: {
		shareGift() {
			// #ifdef H5
			let transfer_id = this.transfer_id;
			// if (this.$util.isWeiXin()) {
			// 	this.$api.sendRequest({
			// 		url: '/wechat/api/wechat/share',
			// 		data: {},
			// 		success: res => {
			// 			if (res.code == 0) {
			// 				var wxJS = new Weixin();
			// 				let url = this.$config.h5Domain+'/pages_promotion/giftcard/present/accept?transfer_id=' + transfer_id;

			// 				wxJS.setShareData({
			// 					title: '送你一张礼品卡',
			// 					desc: '快来领取吧，手慢就没有啦！',
			// 					link: url,
			// 					imgUrl: this.$util.img('public/uniapp/giftcard/detail/gift_bag3.png'),
			// 				});
			// 			}
			// 		}
			// 	});
			// }
			// #endif
		},
		getData(id) {
			this.$api.sendRequest({
				url: '/giftcard/api/giftcard/transfer',
				data: {
					id: id
				},
				success: res => {
					if (res.code == 0 && res.data) {
						this.cardinfo = res.data;
						this.member_id = res.data.use_member_id;
						// this.actionTransfer();
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		oninput(e) {
			const { value } = e.target;
			this.leav_message = value;
		},
		openSharePopup() {
			this.$refs.sharePopup.open();
			this.actionTransfer(0);
		},
		// 关闭分享弹出层
		closeSharePopup() {
			this.$refs.sharePopup.close();
		},
		actionTransfer(data) {
			// data判断是否要复制
			this.$api.sendRequest({
				url: '/giftcard/api/giftcard/actiontransfer',
				data: {
					id: this.id,
					use_member_id: this.member_id,
					leav_message: this.leav_message
				},
				success: res => {
					if (res.code == 0 && res.data) {
						this.transfer_id = res.data.transfer_id;
						this.shareGift();
					} else {
					}
				}
			});
		},
		copyUrl(id) {
			this.actionTransfer(1);
			if (this.transfer_id) {
				let text = this.$config.h5Domain + '/pages_promotion/giftcard/present/accept?transfer_id=' + this.transfer_id;
				this.$util.copy(text, () => {
					this.closeSharePopup();
				});
			}
		},
		onShare() {
			this.$api.sendRequest({
				url: '/weapp/api/weapp/share',
				success: res => {}
			});
		},
		onShare2() {
			this.show = true;
			this.closeSharePopup();
		},
		hide() {
			this.show = false;
		},

		// 打开海报弹出层
		openPosterPopup() {
			this.getGiftcardPoster();
			this.$refs.sharePopup.close();
			this.$refs.posterPopup.open();
			// if (this.poster != '-1') {
			setTimeout(() => {
				let view = uni
					.createSelectorQuery()
					.in(this)
					.select('.poster-layer .image-wrap');
				view.fields(
					{
						size: true
					},
					data => {
						let posterWhith = data.width;
						let ratio = parseFloat((740 / posterWhith).toFixed(2));
						if (this.token != '') {
							this.posterHeight = parseInt(1100 / ratio);
						} else {
							this.posterHeight = parseInt(1100 / ratio);
						}
					}
				).exec();
			}, 100);
			// }
		},
		//生成海报
		getGiftcardPoster() {
			//活动海报信息
			let qrcode_param = {
				id: this.cardinfo.id
			};
			if (this.memberId) qrcode_param.source_member = this.memberId;
			this.$api.sendRequest({
				url: '/giftcard/api/goods/poster',
				data: {
					page: '/pages_promotion/giftcard/detail/detail',
					qrcode_param: JSON.stringify(qrcode_param)
				},
				success: res => {
					if (res.code == 0) {
						// this.poster = res.data.path + "?time=" + new Date().getTime();
					} else {
						// this.posterMsg = res.message;
					}
				}
			});
		}
	},
	onShareAppMessage() {
		return {
			title: '送你一张礼品卡',
			imageUrl: this.$util.img('public/uniapp/giftcard/detail/gift_bag3.png'),
			path: '/pages_promotion/giftcard/present/accept?transfer_id=' + this.transfer_id,
			success: res => {},
			fail: res => {}
		};
	},
	onReady() {
		// #ifdef H5
		// if (this.$util.isWeiXin()) {
		// 	this.$api.sendRequest({
		// 		url: '/wechat/api/wechat/share',
		// 		data: {},
		// 		success: res => {
		// 			if (res.code == 0) {
		// 				var wxJS = new Weixin();
		// 				let url = this.$config.h5Domain+'/pages_promotion/giftcard/present/accept?transfer_id=' + this.transfer_id;
		// 				wxJS.setShareData({
		// 					title: '送你一张礼品卡',
		// 					desc: '快来领取吧，手慢就没有啦！',
		// 					link: url,
		// 					imgUrl: this.$util.img('public/uniapp/giftcard/detail/gift_bag3.png'),
		// 				});
		// 			}
		// 		}
		// 	});
		// }
		// #endif
	}
};
</script>

<style lang="scss">
.ns-present-bg {
	width: 100%;
	height: 300rpx;
	z-index: 0;
}
.uni-popup__wrapper-box {
	.share-title {
		line-height: 60rpx;
		font-size: $font-size-toolbar;
		padding: 15rpx 0;
		text-align: center;
	}

	.share-content {
		display: flex;
		display: -webkit-flex;
		-webkit-flex-wrap: wrap;
		-moz-flex-wrap: wrap;
		-ms-flex-wrap: wrap;
		-o-flex-wrap: wrap;
		flex-wrap: wrap;
		padding: 80rpx 15rpx;

		.share-box {
			flex: 1;
			text-align: center;

			.share-btn {
				margin: 0;
				padding: 0;
				border: none;
				line-height: 1;
				height: auto;

				text {
					margin-top: 20rpx;
					font-size: $font-size-tag;
					display: block;
					color: $color-title;
				}
			}

			.iconfont {
				font-size: 80rpx;
				line-height: initial;
			}

			.iconfuzhilianjie,
			.iconpengyouquan,
			.iconhaowuquan,
			.iconiconfenxianggeihaoyou {
				color: #07c160;
			}
		}
	}

	.share-footer {
		height: 90rpx;
		line-height: 90rpx;
		border-top: 2rpx solid $color-line;
		text-align: center;
	}
}

.present-body {
	background: #fff;
	padding: 40rpx 30rpx;
	margin: -120rpx 30rpx 0;
	border-radius: 10rpx;
	z-index: 2;

	.card-item {
		padding: 15rpx 30rpx;
		// background: #ff9696;
		border-radius: 20rpx;

		.card-content {
			// border: 1rpx solid #ffc7c7;
			padding: 30rpx 50rpx;

			.card-name {
				font-size: 40rpx;
				color: #fff;
				max-height: 160rpx;
				overflow: hidden;
			}

			.use-orno {
				color: #fff;
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
	left: 30rpx;
	bottom: 50rpx;
	position: fixed;
	display: flex;
	justify-content: space-around;
	width: 92%;

	button {
		padding: 0 68rpx;
	}
}
.copy-present-btn {
	color: #000 !important;
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
		image {
			width: 400rpx;
			height: 400rpx;
		}
	}
}
</style>
