<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="goods-detail">
		<view class="goods-item" v-if="noteType == 'goods_item'">
			<image class="item-img" :src="$util.img(goodsItemInfo.goods_image)" @error="imageError()" mode="aspectFit"></image>
			<text class="item-title" v-if="goodsItemInfo.is_show_release_time == 1">{{ goodsItemInfo.note_title }}</text>
			<view class="item-lightspot" v-if="goodsItemInfo.goods_highlights.length">
				<text v-for="(item, index) in goodsItemInfo.goods_highlights" :key="index" class="color-base-bg">{{ item }}</text>
			</view>
			<text class="item-time" v-if="goodsItemInfo.is_show_release_time == 1">{{ $util.timeStampTurnTime(goodsItemInfo.create_time, 'time') }}</text>
			<view class="item-content"><rich-text :nodes="goodsItemInfo.note_content"></rich-text></view>
			<view class="rest-info">
				<text v-if="goodsItemInfo.is_show_read_num == 1">
					阅读
					<text>{{ goodsItemInfo.initial_read_num + goodsItemInfo.read_num }}</text>
				</text>
				<text v-if="goodsItemInfo.is_show_dianzan_num == 1" @click="giveLike">
					<text class="iconfont iconlikefill color-base-text" v-if="giveLikeIdent"></text>
					<text class="iconfont icongz" v-if="!giveLikeIdent"></text>
					<text>{{ goodsItemInfo.initial_dianzan_num + goodsItemInfo.dianzan_num }}</text>
				</text>
			</view>
			<view class="item-action">
				<view class="action-left">
					<text @click="giveLike" v-if="!giveLikeIdent" class="iconfont icondianzan"></text>
					<text @click="giveLike" v-if="giveLikeIdent" class="iconfont icondianzan1 active color-base-text"></text>
					<!-- #ifdef MP -->
					<button type="primary" open-type="share" class="iconfont iconicon--"></button>
					<!-- #endif -->
				</view>
				<button class="color-base-bg action-right" @click="redirectToGoods(goodsItemInfo)" v-if="goodsItemInfo.goods_list.length">购买</button>
			</view>
		</view>
		<!-- 掌柜说 -->
		<view class="shop-said" v-else-if="noteType == 'shop_said'">
			<text class="said-title">{{ shopSaidInfo.note_title }}</text>
			<text class="said-time" v-if="shopSaidInfo.is_show_release_time == 1">{{ $util.timeStampTurnTime(shopSaidInfo.create_time, 'time') }}</text>
			<view class="said-content"><rich-text :nodes="shopSaidInfo.note_content"></rich-text></view>
			<view class="said-goods">
				<view
					class="commodity-item"
					v-if="shopSaidInfo.goods_list"
					v-for="(goodsItme, goodsIndex) in shopSaidInfo.goods_list"
					:key="goodsIndex"
					@click="redirectToGoods(goodsItme.goods_id, 'shop_said')"
				>
					<image class="commodity-img" :src="$util.img(goodsItme.goods_image.split(',')[0])" mode="aspectFit"></image>
					<view class="commodity-content">
						<text class="commodity-name">{{ goodsItme.goods_name }}</text>
						<text class="commodity-price color-base-text">{{ goodsItme.price }}</text>
					</view>
				</view>
			</view>
			<view class="rest-info">
				<text v-if="shopSaidInfo.is_show_read_num == 1">
					阅读
					<text>{{ shopSaidInfo.initial_read_num + shopSaidInfo.read_num }}</text>
				</text>
				<text v-if="shopSaidInfo.is_show_dianzan_num == 1" @click="giveLike">
					<text class="iconfont iconlikefill color-base-text" v-if="giveLikeIdent"></text>
					<text class="iconfont icongz" v-if="!giveLikeIdent"></text>
					<text>{{ shopSaidInfo.initial_dianzan_num + shopSaidInfo.dianzan_num }}</text>
				</text>
			</view>
			<view class="said-action">
				<text @click="giveLike" v-if="!giveLikeIdent" class="iconfont icondianzan"></text>
				<text @click="giveLike" v-if="giveLikeIdent" class="iconfont icondianzan1 color-base-text active"></text>
				<!-- #ifdef MP -->
				<button type="primary" open-type="share" class="iconfont iconicon--"></button>
				<!-- #endif -->
			</view>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>

		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
import htmlParser from '@/common/js/html-parser';
export default {
	components: {},
	data() {
		return {
			noteId: '',
			noteType: '',
			goodsItemInfo: {},
			shopSaidInfo: {},
			giveLikeIdent: false,
			giveLikeFlag: false,
			//分享建立上下级所需id
			memberId: 0,
			//分享时详情所用图片
			shareImg: ''
		};
	},
	onLoad(options) {
		setTimeout( () => {
			if (this.addonIsExist && !this.addonIsExist.notes) {
				this.$util.showToast({
					title: '商家未开启店铺笔记',
					mask: true,
					duration: 2000
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
				}, 2000);
				return;
			}
		}, 1000);
	 
		this.$util.getMemberId().then(resolve => {
			this.memberId = resolve;
		});
		//小程序分享接收source_member
		if (options.source_member) {
			uni.setStorageSync('source_member', options.source_member);
		}
		// 小程序扫码进入，接收source_member
		if (options.scene) {
			var sceneParams = decodeURIComponent(options.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('sku_id') != -1) this.skuId = item.split('-')[1];
					if (item.indexOf('m') != -1) uni.setStorageSync('source_member', item.split('-')[1]);
					if (item.indexOf('is_test') != -1) uni.setStorageSync('is_test', 1);
				});
			}
		}

	 
		if (options.note_id) {
			this.noteId = options.note_id;
			this.getNoteDetail();
		} else {
			this.$util.redirectTo('/pages_tool/store_notes/note_list', {}, 'redirectTo');
		}
	},
	onShow() {
		
		//记录分享关系
		if (uni.getStorageSync('token') && uni.getStorageSync('source_member')) {
			this.$util.onSourceMember(uni.getStorageSync('source_member'));
		}

		if (uni.getStorageSync('token')) {
			this.isDianzan();
		}
	},

	onShareAppMessage() {
		var title = this.noteType == 'goods_item' ? this.goodsItemInfo.note_title : this.shopSaidInfo.note_title;
		var imageUrl = this.noteType == 'goods_item' ? this.goodsItemInfo.cover_img : this.shopSaidInfo.cover_img;
		imageUrl = this.$util.img(imageUrl.split(',')[0]);
		var route = this.$util.getCurrentShareRoute(this.memberId);
		var path = route.path;
		return {
			title: title,
			path: path,
			imageUrl: imageUrl
		};
	},
	// 分享到微信朋友圈
	// #ifdef MP-WEIXIN
	onShareTimeline() {
		var title = this.noteType == 'goods_item' ? this.goodsItemInfo.note_title : this.shopSaidInfo.note_title;
		var route = this.$util.getCurrentShareRoute(this.memberId);
		var imageUrl = this.noteType == 'goods_item' ? this.goodsItemInfo.cover_img : this.shopSaidInfo.cover_img;
		imageUrl = this.$util.img(imageUrl.split(',')[0]);
		var query = route.query;
		return {
			title: title,
			query: query,
			imageUrl: imageUrl
		};
	},
	// #endif
	methods: {
		/* 获取笔记详情 */
		getNoteDetail() {
			this.$api.sendRequest({
				url: '/notes/api/notes/detail',
				data: {
					note_id: this.noteId
				},
				success: res => {
					if (res.code == 0) {
						this.noteType = res.data.note_type;
						if (this.noteType == 'goods_item') {
							this.goodsItemInfo = res.data;

							if (this.goodsItemInfo.note_content) this.goodsItemInfo.note_content = htmlParser(this.goodsItemInfo.note_content);
							//获取分享图片
							if (this.goodsItemInfo.goods_image) {
								this.shareImg = this.$util.img(this.goodsItemInfo.goods_image);
							} else {
								this.shareImg = this.$util.getDefaultImage().goods;
							}

							if (this.goodsItemInfo.goods_list.length) {
								this.goodsItemInfo.goods_image = this.goodsItemInfo.goods_list[0].goods_image.split(',')[0];
							} else {
								this.goodsItemInfo.goods_image = this.$util.getDefaultImage().goods;
							}

							if (this.goodsItemInfo.goods_highlights) this.goodsItemInfo.goods_highlights = this.goodsItemInfo.goods_highlights.split(',');
						} else {
							this.shopSaidInfo = res.data;
							if (this.shopSaidInfo.note_content) this.shopSaidInfo.note_content = htmlParser(this.shopSaidInfo.note_content);
						}
					} else {
						this.$util.showToast({
							title: res.message
						});
					}

					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		/* 点赞 */
		giveLike() {
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open('/pages/index/index');
				return;
			}

			if (this.giveLikeFlag) return false;
			this.giveLikeFlag = true;

			var url = this.giveLikeIdent ? '/notes/api/record/delete' : '/notes/api/record/add';
			this.$api.sendRequest({
				url: url,
				data: {
					note_id: this.noteId
				},
				success: res => {
					this.giveLikeFlag = false;
					if (res.code == 0 && res.data > 0) {
						if (this.noteType != 'goods_item')
							this.shopSaidInfo.dianzan_num = this.giveLikeIdent ? this.shopSaidInfo.dianzan_num - 1 : this.shopSaidInfo.dianzan_num + 1;
						else {
							this.goodsItemInfo.dianzan_num = this.giveLikeIdent ? this.goodsItemInfo.dianzan_num - 1 : this.goodsItemInfo.dianzan_num + 1;
						}
						this.giveLikeIdent = !this.giveLikeIdent;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		},
		/* 检测是否点赞 */
		isDianzan() {
			this.$api.sendRequest({
				url: '/notes/api/record/isDianzan',
				data: {
					note_id: this.noteId
				},
				success: res => {
					if (res.code == 0) {
						this.giveLikeIdent = res.data == 1 ? true : false;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		},
		/* 页面跳转 */
		redirectToGoods(data, type = '') {
			var id = type ? data : data.goods_list[0].goods_id;

			this.$util.redirectTo('/pages/goods/detail', { goods_id: id });
		},
		imageError() {
			if (this.goodsItemInfo.goods_image) this.goodsItemInfo.goods_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #fff;
}
.goods-detail {
	padding: 30rpx 24rpx 180rpx;
	.said-content,
	.item-content {
		padding: 4rpx;
		rich-text {
			word-wrap: break-word;
		}
	}
	.goods-item {
		.item-img {
			width: 100%;
			height: 400rpx;
			border-radius: 10rpx;
		}
		.item-title {
			display: block;
			margin: 40rpx 0 44rpx;
			font-size: $font-size-toolbar;
			line-height: 1;
		}
		.item-lightspot text {
			& ~ text {
				margin-left: 10rpx;
			}
			font-size: $font-size-tag;
			padding: 6rpx 10rpx;
			line-height: 1;
			border-radius: 4rpx;
			color: #ffffff;
		}
		.item-time {
			display: block;
			margin: 44rpx 0 40rpx;
			font-size: $font-size-tag;
			color: #b6b6b6;
		}
		.rest-info {
			text {
				text {
					margin-left: 8rpx;
				}
			}
			text.iconfont {
				font-size: 26rpx;
			}
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 40rpx;
			color: #6b6b6b;
			font-size: $font-size-tag;
		}
		.item-action {
			.action-left {
				display: flex;
				text {
					&.active {
						margin: 0;
						background-color: rgb(255, 255, 255) !important;
						border: 2rpx solid #dddddd;
					}
					display: flex;
					justify-content: center;
					align-items: center;
					width: 70rpx;
					height: 70rpx;
					background-color: rgba(0, 0, 0, 0.4) !important;
					border-radius: 50%;
					border: 2rpx solid rgba(0, 0, 0, 0);
				}
				button {
					display: flex;
					justify-content: center;
					align-items: center;
					margin: 0;
					margin-left: 16rpx;
					padding: 0;
					width: 70rpx;
					height: 70rpx;
					background-color: rgba(0, 0, 0, 0.4) !important;
					border-radius: 50%;
				}
				.iconfont {
					color: #fff;
					font-size: $font-size-toolbar;
				}
			}
			.action-right {
				margin: 0;
				width: 180rpx;
				height: 70rpx;
				color: #fff;
			}
			position: fixed;
			bottom: 0;
			width: calc(100% - 24px);
			display: flex;
			margin: 80rpx 0;
			justify-content: space-between;
		}
	}
	.shop-said {
		.said-title {
			display: block;
			margin: 40rpx 0 44rpx;
			font-size: $font-size-toolbar;
			line-height: 1;
		}
		.said-time {
			display: block;
			margin: 44rpx 0 40rpx;
			font-size: $font-size-tag;
			color: #b6b6b6;
		}
		.rest-info {
			text {
				text {
					margin-left: 8rpx;
				}
			}
			text.iconfont {
				font-size: 26rpx;
			}
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 40rpx;
			color: #6b6b6b;
			font-size: $font-size-tag;
		}
		.said-action {
			position: fixed;
			bottom: 0;
			width: calc(100% - 24px);
			display: flex;
			justify-content: center;
			margin: 80rpx 0;
			text {
				&.active {
					margin: 0;
					background-color: rgb(255, 255, 255) !important;
					border: 2rpx solid #dddddd;
				}
				display: flex;
				justify-content: center;
				align-items: center;
				width: 70rpx;
				height: 70rpx;
				background-color: rgba(0, 0, 0, 0.4) !important;
				border-radius: 50%;
			}
			button {
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 0;
				margin-left: 16rpx;
				padding: 0;
				width: 70rpx;
				height: 70rpx;
				background-color: rgba(0, 0, 0, 0.4) !important;
				border-radius: 50%;
			}
			.iconfont {
				color: #fff;
				font-size: $font-size-toolbar;
			}
		}
		.said-goods {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			margin-top: 40rpx;
			.commodity-item {
				display: flex;
				flex-direction: column;
				margin-bottom: 22rpx;
				width: 338rpx;
				border: 2rpx solid #f1f1f1;
				image {
					width: 338rpx;
					height: 338rpx;
				}
				.commodity-content {
					padding: 20rpx;
					.commodity-name {
						overflow: hidden;
						display: block;
						font-size: $font-size-tag;
						text-overflow: ellipsis;
						white-space: nowrap;
						color: #383838;
					}
					.commodity-price {
						display: block;
						font-size: $font-size-tag;
					}
				}
			}
		}
	}
}
</style>
