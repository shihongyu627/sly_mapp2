<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="page">
		<view class="pintuan-wrap">
			<view class="pintuan-list">
				<view class="pintuan-bg"></view>
				<view class="list-item" @click="toPintuanDetail(groupDetail.pintuan_goods_id)">
					<view class="item-image"><image :src="$util.img(groupDetail.sku_image, { size: 'big' })" @error="imageError()" mode="widthFix"></image></view>
					<view class="item-desc">
						<view class="desc-title">{{ groupDetail.sku_name }}</view>
						<view class="pintuan-num">
							<text class="color-base-border ">{{ groupDetail.pintuan_num }}人团</text>
							<text class="color-base-text color-base-bg-light">已成团{{ groupDetail.group_num }}件</text>
						</view>
						<view class="color-tip">
							<text class="color-base-text font-size-toolbar margin-right price-style large">
								<text class="font-size-tag price-btn price-style small">￥</text>
								{{ groupDetail.order_money }}
							</text>
							<text class="old-price font-size-tag price-font">￥{{ groupDetail.discount_price }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="pintuan-clustering">
				<template  v-if="groupDetail.pintuan_status == 2">
					<view class="tips countdown">
						<view class="tips-title">
							还差
							<text class="color-base-text">{{ kill }}</text>
							人成团
						</view>
						距结束还剩
						<uni-count-down v-if="groupDetail.timeMachine"
							:day="groupDetail.timeMachine.d"
							:hour="groupDetail.timeMachine.h"
							:minute="groupDetail.timeMachine.i"
							:second="groupDetail.timeMachine.s"
							color="#fff"
							splitorColor="#333 !important"
							backgroundColor="#000"
						/>
					</view>
				</template>
				<view class="tips text" v-else-if="groupDetail.pintuan_status == 3"><text>恭喜您，拼团成功</text></view>
				<view class="tips text" v-else-if="groupDetail.pintuan_status == 1"><text>很遗憾，拼团失败</text></view>
				<view class="tips text" v-else-if="groupDetail.status != 1"><text>活动已结束，很遗憾拼团失败</text></view>
				<view class="headimg-group" v-if="groupDetail && groupDetail.member_list">
					<view class="group-member" v-for="(item, index) in groupDetail.member_list" :key="index" v-if="index < 5">
						<view class="mark ns-gradient-promotionpages-pintuan-share-share" v-if="groupDetail.head_id == item.member_id">团长</view>
						<view class="member-face">
							<image :src="item.member_img ? $util.img(item.member_img) : $util.img('public/uniapp/common/default_headimg.png')" mode="aspectFill"></image>
						</view>
					</view>
					
					<view class="group-member" v-if="groupDetail.pintuan_status != 3" v-for="item in kill">
						<view class="member-face">
							<image 
								:src="
									groupDetail.member_list && groupDetail.member_list.length < 5
										? $util.img('public/uniapp/common/spelling_who.png')
										: $util.img('public/uniapp/common/spelling_who_omit.png')
								"
								mode="aspectFill"
							></image>
						</view>
					</view>
				</view>
				<view class="pintuan-btn-box" v-if="groupDetail.status != 1">
					<button class="one_btn pintuan-btn" v-if="groupDetail.pintuan_status == 3" @click="orderDetail(groupDetail)">查看订单</button>
					<button class="disabled" v-else>活动已结束</button>
				</view>
				<view class="pintuan-btn-box" v-else-if="groupDetail.pintuan_status == 2">
					<!-- #ifdef MP -->
					<button type="primary" class="pintuan-btn" open-type="share">邀请好友参团</button>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<button type="primary" class="pintuan-btn" @click="openSharePopup">邀请好友参团</button>
					<!-- #endif -->
					<button class="one_btn pintuan-btn" @click="orderDetail(groupDetail)">查看订单</button>
				</view>
				<view class="pintuan-btn-box" v-else-if="groupDetail.pintuan_status == 1 || groupDetail.pintuan_status == 3">
					<button type="primary" class="pintuan-btn" @click="$util.redirectTo('/pages_promotion/pintuan/list')">再次发起拼团</button>
					<button class="one_btn pintuan-btn" v-if="groupDetail.pintuan_status == 3" @click="orderDetail(groupDetail)">查看订单</button>
				</view>
				
			</view>
			<view class="pintuan-playing">
				<view class="pintuan-step-title">
					拼团玩法
				</view>
				<view class="pintuan-step-list">
					<view class="pintuan-step">
						<view class="step-img">
							<image :src="$util.img('public/uniapp/pintuan/pintuan-step-1.png')"></image>
						</view>
						<view class="step-text">
							<view>支付开团</view>
							<view>或参团</view>
						</view>
					</view>
					<view class="pintuan-step-point">
						<view></view>
						<view></view>
						<view></view>
					</view>
					<view class="pintuan-step">
						<view class="step-img">
							<image :src="$util.img('public/uniapp/pintuan/pintuan-step-2.png')"></image>
						</view>
						<view class="step-text">
							<view>邀请好友</view>
							<view>参团</view>
						</view>
					</view>
					<view class="pintuan-step-point">
						<view></view>
						<view></view>
						<view></view>
					</view>
					<view class="pintuan-step">
						<view class="step-img">
							<image :src="$util.img('public/uniapp/pintuan/pintuan-step-3.png')"></image>
						</view>
						<view class="step-text">
							<view>达到拼团</view>
							<view>人数</view>
						</view>
					</view>
					<view class="pintuan-step-point">
						<view></view>
						<view></view>
						<view></view>
					</view>
					<view class="pintuan-step">
						<view class="step-img">
							<image :src="$util.img('public/uniapp/pintuan/pintuan-step-4.png')"></image>
						</view>
						<view class="step-text">
							<view>组团成功</view>
							<view>等待发货</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
		
		<!-- 悬浮按钮 -->
		<view class="fixed-box" :style="{ height: fixBtnShow ? '330rpx' : '120rpx' }">
			<!-- 规则 -->
			<view class="btn-item" v-if="fixBtnShow" @click="$util.redirectTo('/pages/index/index')">
				<text class="iconfont iconshouye1"></text>
				<view>首页</view>
			</view>
			<view class="btn-item" v-if="fixBtnShow" @click="$util.redirectTo('/pages/member/index')">
				<text class="iconfont iconyonghu"></text>
				<view>我的</view>
			</view>
		 
			<view class="btn-item icon-xiala" v-if="fixBtnShow" @click="fixBtnShow ? (fixBtnShow = false) : (fixBtnShow = true)"><text class="iconfont iconunfold"></text></view>
			<view class="btn-item switch" v-else :class="{ show: fixBtnShow }" @click="fixBtnShow ? (fixBtnShow = false) : (fixBtnShow = true)">
				<view class="">快捷</view>
				<view>导航</view>
			</view>
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
			interval:null,
			intervalNum:0,
			fixBtnShow:false,
			shareImg: ''
		};
	},
	onLoad(e) {
		let that = this;
		 
		setTimeout( () => {
			if (this.addonIsExist && !this.addonIsExist.pintuan) {
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
		
		this.interval = setInterval(function(){
			that.getGroupDetail();
			that.intervalNum++;
			if(that.intervalNum > 5) clearInterval(that.interval);
		},1000);
		
		this.$util.getMemberId().then(resolve => {
			this.memberId = resolve;
			if (this.groupDetail.pintuan_id) this.setPublicShare();
		});
	},
	methods: {
		getGroupDetail() {
			this.$api.sendRequest({
				url: '/pintuan/api/order/detail',
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
						
						if(res.data.pintuan_status) clearInterval(this.interval);
						
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
						// #ifdef MP-WEIXIN
						this.getShareImg();
						// #endif
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
			this.$util.redirectTo('/pages_promotion/pintuan/detail', {
				pintuan_id: this.groupDetail.pintuan_id
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
			let text = this.$config.h5Domain + '/pages_promotion/pintuan/detail?pintuan_id=' + this.groupDetail.pintuan_id + '&group_id=' + this.groupDetail.group_id;
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
			let shareUrl = this.$config.h5Domain + '/pages_promotion/pintuan/detail?pintuan_id=' + this.groupDetail.pintuan_id + '&group_id=' + this.groupDetail.group_id;
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
			let posterParams = {
				id: this.groupDetail.pintuan_id,
				group_id: this.groupDetail.group_id
			};
		
			this.$api.sendRequest({
				url: '/pintuan/api/goods/poster',
				data: {
					page: '/pages_promotion/pintuan/detail',
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
		/**
		 * 获取分享图
		 */
		getShareImg(){
			let posterParams = {
				id: this.groupDetail.pintuan_id
			};
			
			this.$api.sendRequest({
				url: '/pintuan/api/goods/shareimg',
				data: {
					page: '/pages_promotion/pintuan/detail',
					qrcode_param: JSON.stringify(posterParams)
				},
				success: res => {
					if (res.code == 0) this.shareImg = res.data.path;
				}
			})
		}
	},
	/**
	 * 自定义分享内容
	 * @param {Object} res
	 */
	onShareAppMessage(res) {
		var path = '/pages_promotion/pintuan/detail?pintuan_id=' + this.groupDetail.pintuan_id + '&group_id=' + this.groupDetail.group_id;
		if (this.memberId) path += '&source_member=' + this.memberId;
		return {
			title: '还差' + (this.groupDetail.pintuan_num - this.groupDetail.pintuan_count) + '人拼团成功，' + this.groupDetail.sku_name,
			imageUrl: this.shareImg ? this.$util.img(this.shareImg) : this.$util.img(this.groupDetail.sku_image, { size: 'big' }),
			path: path,
			success: res => {},
			fail: res => {}
		};
	}
};
</script>

<style lang="scss">
.page{
	background: #F3F3F3;
	min-height: 100vh;
}
.pintuan-wrap {
	.pintuan-list {
		position: relative;
		height: 290rpx;

		.pintuan-bg {
			width: 100%;
			// background-color: var(--pintuan-promotion-color);
			height: 220rpx;
		}

		.list-item {
			position: absolute;
			top: 20rpx;
			display: flex;
			margin: 0 24rpx;
			padding: $margin-both;
			width: calc(100% - 48rpx);
			height: 264rpx;
			border-radius: 18rpx;
			box-sizing: border-box;
			background-color: #fff;

			.item-image {
				overflow: hidden;
				margin-right: 34rpx;
				width: 192rpx;
				height: 192rpx;
				border-radius: $border-radius;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.item-desc {
				flex: 1;
				display: flex;
				flex-direction: column;
				width: calc(100% - 226rpx);
				position: relative;
				.desc-title {
					overflow: hidden;
					font-size: 30rpx;
					font-weight: bold;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					line-height: 42rpx;
					color: $color-title;
					word-wrap: break-word;
					
				}

				.pintuan-num {
					// margin-top: 22rpx;
					display: flex;
					align-items: center;
					line-height: 1;
					margin-top: 10rpx;

					text {
						display: flex;
						align-items: center;
						justify-content: center;
						border: 0;
						padding: 6rpx;
						margin-right: 24rpx;
						font-size: $font-size-tag;
						border-radius: 4rpx;

						&:nth-child(1) {
							background: linear-gradient(to left, var(--pintuan-promotion-color), var(--pintuan-promotion-aux-color));
							color: #fff;
							font-size: $font-size-activity-tag;
						}
					}
				}

				.color-tip {
					line-height: 1;
					position: absolute;
					bottom: 10rpx;
					.price-btn {
						margin-right: 4rpx;
					}
					
					.old-price {
						text-decoration: line-through;
					}
					.large{
						font-weight: bold;
					}
				}
			}
		}
	}

	.pintuan-clustering {
		padding: 50rpx 0 46rpx;
		margin: $margin-updown 24rpx;
		background-color: #fff;
		border-radius: 18rpx;

		.tips {
			font-size: $font-size-base;
			text-align: center;
			
			.tips-title {
				line-height: 1;
				margin-bottom: $margin-updown;
				font-size: 36rpx;
				font-weight: bold;
			}
			&.text{
				font-size: 36rpx;
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

		.group-member,
		.group-image {
			position: relative;
			width: 90rpx;
			height: 90rpx;
			margin: 0 20rpx 20rpx 0;
			display: inline-block;

			.member-face {
				width: 90rpx;
				height: 90rpx;
				border-radius: 50%;
				overflow: hidden;
				line-height: 1;
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
				background-color: var(--main-color);
			}
		}

		.group-image .member-face {
			width: 82rpx;
			height: 82rpx;
			border: 4rpx solid;
		}

		image {
			width: 100%;
			height: 100%;
		}
	}

	.pintuan-btn {
		width: 560rpx;
		height: 84rpx;
		line-height: 84rpx;
		margin: 22rpx auto 0;
		font-size: $font-size-toolbar;
	}
}

.pintuan-playing {
	margin: 8rpx 24rpx 0;
	width: calc(100% - 48rpx);
	border-radius: 18rpx;
	overflow: hidden;
	background-color: #ffffff;
	.pintuan-step-title{
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 36rpx;
		color: #222;
		padding: 36rpx 0 0;
		font-weight: 700;
		&::before{
			content: '';
			background-color: #222222;
			width: 20rpx;
			height: 5rpx;
			display: block;
			margin-right: 10rpx;
		}
		&::after{
			content: '';
			background-color: #222222;
			width: 20rpx;
			height: 5rpx;
			display: block;
			margin-left: 10rpx;
		}
	}
	.pintuan-step-list{
		display: flex;
		justify-content: space-around;
		padding: 40rpx 24rpx;
		.pintuan-step{
			text-align: center;
			.step-img{
				width: 64rpx;
				height: 64rpx;
				margin: 0 auto;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.step-text{
				margin-top: 6rpx;
				>view{
					line-height: 1.3;
					font-size: $font-size-sub;
				}
			}
		}
		.pintuan-step-point{
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 0 14rpx;
			>view{
				width: 10rpx;
				height: 10rpx;
				border-radius: 50%;
				background-color: #FF8F90;
				&:first-child{
					margin-right: 10rpx;
					background-color: #FFE0E1;
				}
				&:last-child{
					margin-left: 10rpx;
					background-color: #F94547;
					
				}
			}
		}
	}
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
//悬浮按钮
	.fixed-box {
		position: fixed;
		right: 20rpx;
		bottom: 300rpx;
		z-index: 10;
		background: #fff;
		box-shadow: 2rpx 2rpx 22rpx rgba(0, 0, 0, 0.3);
		border-radius: 120rpx;
		padding: 20rpx 0;
		display: flex;
		justify-content: center;
		flex-direction: column;
		width: 120rpx;
		box-sizing: border-box;
		transition: 0.3s;
		overflow: hidden;
		.btn-item {
			display: flex;
			justify-content: center;
			text-align: center;
			flex-direction: column;
			line-height: 1;
			margin: 14rpx 0;
			transition: 0.1s;
			text {
				font-size: 44rpx;
				font-weight: bold;
			}
			view {
				font-size: 26rpx;
				font-weight: bold;
			}
			&.show {
				transform: rotate(180deg);
			}
			&.switch {
			}
			&.icon-xiala {
				margin: 0;
				margin-top: 0.10rpx;
			}
		}
	}
</style>

<style>
	.countdown >>> .uni-countdown{
		margin-left: 10rpx;
	}
	 .countdown >>> .uni-countdown__number {
		min-width: 32rpx;
		height: 32rpx;
		text-align: center;
		line-height: 32rpx;
		border-radius: 4px;
		display: inline-block;
		padding: 4rpx;
		margin: 0;
		border: none;
	}
	.countdown >>> .uni-countdown__splitor {
		width: 10rpx;
		height: 32rpx;
		line-height: 36rpx;
		text-align: center;
		display: inline-block;
	}
	.countdown >>> .uni-countdown__splitor.day {
		width: initial;
	}
	
</style>