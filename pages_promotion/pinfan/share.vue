<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<view class="pintuan-wrap">
			<view class="pintuan-list">
				<image class="pintuan-bg" :src="$util.img('public/uniapp/pintuan/pintuan_bg.png')" @error="imageError()" mode="widthFix"></image>
				<view class="list-item" @click="toPintuanDetail(groupDetail.pintuan_id)">
					<view class="item-image"><image :src="$util.img(groupDetail.sku_image, { size: 'big' })" @error="imageError()" mode="widthFix"></image></view>
					<view class="item-desc">
						<view class="desc-title">{{ groupDetail.sku_name }}</view>
						<view class="pintuan-num">
							<text class="color-base-text color-base-bg-light">已团{{ groupDetail.group_num }}次</text>
							<text class="color-base-border color-base-text">{{ groupDetail.pintuan_num }}人团</text>
						</view>
						<view class="color-tip">
							<text class="color-base-text font-size-toolbar margin-right">
								<text class="font-size-tag price-btn">￥</text>
								{{ groupDetail.pintuan_price }}
							</text>
							<text class="old-price font-size-tag">￥{{ groupDetail.discount_price }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="pintuan-clustering">
				<template v-if="groupDetail.timeMachine">
					<view class="tips">
						<view class="tips-title" v-if="kill > 0">
							还差
							<text class="color-base-text">{{ kill }}</text>
							人成团
						</view>
						<view class="tips-title" v-else>拼团已成功</view>
						距结束还剩
						<uni-count-down
							:day="groupDetail.timeMachine.d"
							:hour="groupDetail.timeMachine.h"
							:minute="groupDetail.timeMachine.i"
							:second="groupDetail.timeMachine.s"
							backgroundColorClass="color-base-bg"
							splitorColorClass="color-base-text"
							borderColor="#fff"
							color="#fff"
						/>
					</view>
				</template>
				<view class="tips" v-else>活动已结束</view>
				<view class="headimg-group">
					<view class="group-member" v-for="(item, index) in groupDetail.member_list" :key="index">
						<view class="mark ns-gradient-promotionpages-pintuan-share-share" v-if="groupDetail.head_id == item.member_id">团长</view>
						<view class="member-face">
							<image :src="item.member_img ? $util.img(item.member_img) : $util.img('public/uniapp/common/default_headimg.png')" mode="aspectFill"></image>
						</view>
					</view>
					<view class="group-member" v-for="itm in kill">
						<view class="member-face"><image :src="$util.img('public/uniapp/common/spelling_who.png')" mode="aspectFill"></image></view>
					</view>
				</view>
				<view class="pintuan-btn-box" v-if="groupDetail.timeMachine">
					<!-- #ifdef MP -->
					<button type="primary" class="pintuan-btn" open-type="share">邀请好友参团</button>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<button type="primary" class="pintuan-btn" @click="openSharePopup">邀请好友参团</button>
					<!-- #endif -->
					<button class="one_btn pintuan-btn" @click="orderDetail(groupDetail)">查看订单</button>
				</view>
			</view>
			<image class="pintuan-playing" :src="$util.img('public/uniapp/pinfan/pinfan_playing.png')" mode="widthFix"></image>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>

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
						<!-- #ifdef H5 -->
						<view class="share-box" @click="copyUrl">
							<button class="share-btn" :plain="true">
								<view class="iconfont iconfuzhilianjie"></view>
								<text>复制链接</text>
							</button>
						</view>
						<!-- #endif -->
						<view class="share-box" @click="openPosterPopup">
							<button class="share-btn" :plain="true">
								<view class="iconfont iconpengyouquan"></view>
								<text>生成分享海报</text>
							</button>
						</view>
					</view>
					<view class="share-footer" @click="closeSharePopup"><text>取消分享</text></view>
				</view>
			</uni-popup>
		</view>
		
		<!-- 海报 -->
		<view @touchmove.prevent.stop>
			<uni-popup ref="posterPopup" type="bottom" class="poster-layer">
				<template v-if="poster != '-1'">
					<view>
						<view class="image-wrap"><image :src="$util.img(poster)" :show-menu-by-longpress="true" /></view>
						<!-- #ifdef MP || APP-PLUS  -->
						<view class="save" @click="saveGoodsPoster()">保存图片</view>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<view class="save">长按保存图片</view>
						<!-- #endif -->
					</view>
					<view class="close iconfont iconclose" @click="closePosterPopup()"></view>
				</template>
				<view v-else class="msg">{{ posterMsg }}</view>
			</uni-popup>
		</view>
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
			id: 0,
			groupDetail: {
				sku_image: ''
			},
			kill: 0,
			memberId: 0,
			poster: "-1", //海报
			posterMsg: "", //海报错误信息
			posterHeight: 0,
		};
	},
	onLoad(e) {
		
		setTimeout( () => {
			if (this.addonIsExist && !this.addonIsExist.pinfan) {
				this.$util.showToast({
					title: '商家未开启拼团返利',
					mask: true,
					duration: 2000
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
				}, 2000);
				return;
			}
		}, 1000);
		
		this.id = e.id;
		
		this.getGroupDetail();
		this.$util.getMemberId().then(resolve => {
			this.memberId = resolve;
			if (this.groupDetail.pintuan_id) this.setPublicShare();
		});
	},
	methods: {
		getGroupDetail() {
			this.$api.sendRequest({
				url: '/pinfan/api/order/detail',
				data: {
					id: this.id
				},
				success: res => {
					if (res.code == 0) {
						res.data.member_list;
						let newArr = [];
						for (let i = 0; i < res.data.pintuan_num - res.data.member_list.length; i++) {
							let str = '';
							newArr.push(str);
						}
						this.kill = res.data.pintuan_num - res.data.pintuan_count;
						res.data.member_list = res.data.member_list.concat(newArr);
						if (res.data.group_end_time > res.timestamp) {
							res.data.timeMachine = this.$util.countDown(res.data.group_end_time - res.timestamp);
						} else {
							res.data.timeMachine = null;
						}
						this.groupDetail = res.data;

						this.groupDetail.member_list = this.groupDetail.member_list.filter(function(item, index) {
							return item;
						});
						
						this.setPublicShare();
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		toPintuanDetail(id) {
			this.$util.redirectTo('/pages_promotion/pinfan/detail', {
				pinfan_id: id
			});
		},
		toDetail(id, groupId) {
			this.$util.redirectTo('/pages_promotion/pintuan/detail', {
				pintuan_id: this.groupDetail.pintuan_id,
				group_id: groupId
			});
		},
		imageError() {
			this.groupDetail.sku_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		// 打开分享弹出层
		openSharePopup() {
			this.$refs.sharePopup.open();
		},
		// 关闭分享弹出层
		closeSharePopup() {
			this.$refs.sharePopup.close();
		},
		copyUrl() {
			let text = this.$config.h5Domain + '/pages_promotion/pinfan/rebate/order?pinfan_id=' + this.groupDetail.pintuan_id + '&group_id=' + this.groupDetail.group_id;
			if (this.memberId) text += '&source_member=' + this.memberId;
			this.$util.copy(text, () => {
				this.closeSharePopup();
			});
		},
		orderDetail(data) {
			switch (parseInt(data.order_type)) {
				case 2:
					// 自提订单
					this.$util.redirectTo('/order/detail_pickup', {
						order_id: data.order_id
					});
					break;
				case 3:
					// 本地配送订单
					this.$util.redirectTo('/order/detail_local_delivery', {
						order_id: data.order_id
					});
					break;
				case 4:
					// 虚拟订单
					this.$util.redirectTo('/pages_tool/order/detail_virtual', {
						order_id: data.order_id
					});
					break;
				default:
					this.$util.redirectTo('/order/detail', {
						order_id: data.order_id
					});
					break;
			}
		},
		/**
		 * 设置公众号分享
		 */
		setPublicShare(){
			let shareUrl = this.$config.h5Domain + '/pages_promotion/pinfan/order?pinfan_id=' + this.groupDetail.pintuan_id + '&group_id=' + this.groupDetail.group_id;
			if (this.memberId) shareUrl += '&source_member=' + this.memberId;
		
			this.$util.setPublicShare({
				title: this.groupDetail.sku_name, 
				desc: '还差' + (this.groupDetail.pintuan_num - this.groupDetail.pintuan_count) + '人就拼团成功了',
				link: shareUrl,
				imgUrl: this.groupDetail.sku_image
			})
		},
		//-------------------------------------海报-------------------------------------
		// 打开海报弹出层
		openPosterPopup() {
			this.getGoodsPoster();
			this.$refs.sharePopup.close();
			this.$refs.posterPopup.open();
			if (this.poster != '-1') {
				setTimeout(() => {
					let view = uni.createSelectorQuery().in(this).select(".poster-layer .image-wrap");
					view.fields({
						size: true,
					}, data => {
						let posterWhith = data.width;
						let ratio = parseFloat((740 / posterWhith).toFixed(2));
						if (this.token != '') {
							this.posterHeight = parseInt(1240 / ratio);
						} else {
							this.posterHeight = parseInt(1100 / ratio);
						}
					}).exec();
				}, 100);
			}
		},
		// 关闭海报弹出层
		closePosterPopup() {
			this.$refs.posterPopup.close();
		},
		/**
		 * 获取海报
		 */
		getGoodsPoster() {
			uni.showLoading({
				'title' : '海报生成中...'
			})
			//活动海报信息
			// #ifdef MP
			let posterParams = {
				id: this.groupDetail.pintuan_goods_id,
				pinfan: this.groupDetail.pintuan_id,
				group: this.groupDetail.group_id
			};
			// #endif
			
			// #ifndef MP
			let posterParams = {
				id: this.groupDetail.pintuan_goods_id,
				pinfan_id: this.groupDetail.pintuan_id,
				group_id: this.groupDetail.group_id
			};
			// #endif
		
			this.$api.sendRequest({
				url: '/pinfan/api/goods/poster',
				data: {
					page: '/pages_promotion/rebate/order',
					qrcode_param: JSON.stringify(posterParams)
				},
				success: res => {
					if (res.code == 0) {
						this.poster = res.data.path + "?time=" + new Date().getTime();
					} else {
						this.posterMsg = res.message;
					}
					uni.hideLoading();
				},
				fail: err => {
					uni.hideLoading();
				}
			});
		},
	},
	/**
	 * 自定义分享内容
	 * @param {Object} res
	 */
	onShareAppMessage(res) {
		var path = '/pages_promotion/pinfan/order?pinfan_id=' + this.groupDetail.pintuan_id + '&group_id=' + this.groupDetail.group_id;
		if (this.memberId) path += '&source_member=' + this.memberId;
		return {
			title: '还差' + (this.groupDetail.pintuan_num - this.groupDetail.pintuan_count) + '人拼团成功，' + this.groupDetail.sku_name,
			imageUrl: this.$util.img(this.groupDetail.sku_image, {
				size: 'big'
			}),
			path: path,
			success: res => {},
			fail: res => {}
		};
	}
};
</script>

<style lang="scss">
.pintuan-wrap {
	.pintuan-list {
		position: relative;
		background-color: #fff;
		height: 428rpx;

		.pintuan-bg {
			width: 100%;
		}

		.list-item {
			position: absolute;
			top: 90rpx;
			display: flex;
			margin: 0 $margin-both;
			padding: $margin-both;
			width: 690rpx;
			height: 264rpx;
			border-radius: $border-radius;
			box-sizing: border-box;
			background-color: #fff;

			.item-image {
				overflow: hidden;
				margin-right: 34rpx;
				width: 192rpx;
				height: 208rpx;
				border-radius: $border-radius;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.item-desc {
				flex: 1;
				display: flex;
				justify-content: space-between;
				flex-direction: column;

				.desc-title {
					overflow: hidden;
					font-size: $font-size-base;
					height: 84rpx;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					line-height: 42rpx;
					color: $color-title;
				}

				.pintuan-num {
					// margin-top: 22rpx;
					display: flex;
					align-items: baseline;
					line-height: 1;

					text {
						display: flex;
						align-items: center;
						justify-content: center;
						border: 2rpx solid;
						padding: 6rpx;
						margin-right: 24rpx;
						font-size: $font-size-tag;
						border-radius: 4rpx;

						&:nth-child(1) {
							padding: 10rpx;
							border: 0;
						}
					}
				}

				.color-tip {
					line-height: 1;
					margin-top: 36rpx;

					.price-btn {
						margin-right: 4rpx;
					}

					.old-price {
						text-decoration: line-through;
					}
				}
			}
		}
	}

	.pintuan-clustering {
		padding: 50rpx 0 46rpx;
		margin-top: $margin-updown;
		background-color: #fff;

		.tips {
			font-size: $font-size-base;
			text-align: center;

			.tips-title {
				line-height: 1;
				margin-bottom: $margin-updown;
				font-size: 40rpx;
				font-weight: bold;
			}
		}
	}

	.headimg-group {
		padding-top: $margin-both;
		padding-bottom: 40rpx;
		background-color: #fff;
		line-height: 1;
		text-align: center;
		height: 100rpx;
		overflow: hidden;
		.group-member {
			position: relative;
			width: 100rpx;
			height: 100rpx;
			// margin: 0 20rpx 20rpx 0;
			display: inline-block;
			margin: 30rpx;
			.member-face {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				overflow: hidden;
				line-height: 1;
				image {
					width: 100rpx;
					height: 100rpx;
				}
			}

			.mark {
				white-space: nowrap;
				position: absolute;
				z-index: 5;
				color: #fff;
				line-height: 1;
				font-size: $font-size-tag;
				padding: 4rpx 10rpx;
				border-radius: 28rpx;
				left: 50%;
				bottom: -14rpx;
				transform: translate(-50%, -20%);
			}
		}

		/* .group-image .member-face {
				width: 100rpx;
				height: 100rpx;
				border: 2rpx solid;
				image {
					width: 100rpx;
					height: 100rpx;
				}
			} */
	}

	.pintuan-btn-box {
		margin-top: 60rpx;
	}
	.pintuan-btn {
		width: 560rpx;
		height: 84rpx;
		line-height: 84rpx;
		margin: 22rpx auto 0;
	}
}

.pintuan-playing {
	margin-top: 20rpx;
	width: 100%;
}

button.one_btn {
	background-color: #fff;
	border: 2rpx solid $color-disabled;
	color: $color-tip;
}

.share-btn {
	margin-top: 20rpx;
	background-color: #fff;
	border: 1px solid;
}

.share-popup,
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
		padding: 15rpx;

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
		border-top: 2rpx #f5f5f5 solid;
		text-align: center;
		color: #666;
	}
}
.poster-layer {
	.generate-poster {
		padding: 40rpx 0;
		.iconfont {
			font-size: 80rpx;
			color: #07c160;
			line-height: initial;
		}
		> view {
			text-align: center;
			&:last-child {
				margin-top: 20rpx;
			}
		}
	}
	.image-wrap {
		width: 64%;
		height: 854rpx;
		margin: 60rpx auto 40rpx auto;
		box-shadow: 0 0 32rpx rgba(100, 100, 100, 0.3);
		image {
			width: 480rpx;
			height: 854rpx;
		}
	}
	.msg {
		padding: 40rpx;
	}
	.save {
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
	}
	.close {
		position: absolute;
		top: 0;
		right: 20rpx;
		width: 40rpx;
		height: 80rpx;
		font-size: 50rpx;
	}
}
</style>
