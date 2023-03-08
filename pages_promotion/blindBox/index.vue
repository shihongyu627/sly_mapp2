<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="blind-box">
		<view class="null" v-if="info.blindbox_inventory <= 0">
			<text class="iconfont icongantanhao1 gantan"></text>
			<text>商品库存不足，请等待商家补货！</text>
		</view>
		<view class="box-bg" :style="{ backgroundImage: 'url(' + $util.img('public/uniapp/blindbox/index_bg.png') + ')' }">
			<view class="top">
				<view class="top-img">
					<image v-if="info.blindbox_images != ''" :src="$util.img(info.blindbox_images)" @error="boxImg()" mode="aspectFit"></image>
					<image v-else :src="$util.img('public/uniapp/blindbox/default.png')"></image>
				</view>
				<view class="right">
					<view class="blind-title font-size-toolbar">{{ info.blindbox_name }}</view>
					<view class="scribe-price font-size-tag price-font">￥{{ info.price }}</view>
					<view class="new-price font-size-tag" v-if="info.new_price > 0">
						新人价：
						<text class="icon price-font">￥</text>
						<text class="money price-font" >{{ parseFloat(info.new_price).toFixed(2).split(".")[0] }}</text>
					   <text class="icon price-font">.{{ parseFloat(info.new_price).toFixed(2).split(".")[1] }}</text>
					</view>
				</view>
				<view class="rule font-size-tag" @click="rule()">活动规则</view>
				<view class="explain-img" @click="toIndex()"><image :src="$util.img('public/uniapp/blindbox/index.png')" mode="" class="index-img"></image></view>
			</view>

			<view class="cabinet-box">
				<view class="cabinet" :style="{ backgroundImage: 'url(' + $util.img('public/uniapp/blindbox/cabinet_two.png') + ')' }">
					<swiper :autoplay="false" :indicator-dots="false" :interval="3000" :duration="1000" :current="inxs" :circular="true" :disable-touch="true">
						<swiper-item v-for="(item, index) in boxPage" :key="index">
							<view class="center-one">
								<view class="item" v-for="(item2, index2) in item" :key="index2" @click="checked(index2, item2)">
									<image v-if="item2.status == 0" :src="$util.img('public/uniapp/blindbox/box.png')" mode="" class="box"></image>
									<image v-if="item2.status == 1" :src="$util.img('public/uniapp/blindbox/null_box.png')" mode="" class="box"></image>
									<image :src="$util.img('public/uniapp/blindbox/checked.png')" class="checked" v-if="act == index2"></image>
								</view>
							</view>
						</swiper-item>
					</swiper>
					<view class="btn-one" :style="{ backgroundImage: 'url(' + $util.img('public/uniapp/blindbox/btn_one.png') + ')' }" @click="changeGroup()">换一组</view>
					<view class="btn-two" :style="{ backgroundImage: 'url(' + $util.img('public/uniapp/blindbox/btn_two.png') + ')' }" @click="openBlind()">拆盲盒</view>
				</view>
			</view>

			<view class="list-box">
				<view class="list_bit" :style="{ backgroundImage: 'url(' + $util.img('public/uniapp/blindbox/goods_bg.png') + ')' }">
					<view class="list" id="innovate">
						<view class="imgs-list" ref="name" :style="{ transform: 'translateX(' + lampX + 'rpx)' }">
							<image
								v-for="(item, index) in infoList"
								:key="index"
								v-if="item.goods_image"
								:src="goodsImg(item.goods_image)"
								@click="redirect('/pages/goods/detail', { goods_id: item.goods_id })"
								class="imgs-img"
								@error="infoListImg(index)"
								mode="aspectFit"
							></image>
						</view>
					</view>
				</view>
				<view class="all font-size-tag" @click="redirect('/pages_promotion/blindbox/goods_list', { blindbox_id: info.blindbox_id })">查看全部</view>
			</view>
			<view class="footer" @click="toMyprize()">我的奖品</view>
		</view>
		<uni-popup ref="rulePopup" type="center">
			<view class="rule-wrap">
				<view class="content-wrap">
					<image :src="$util.img('public/uniapp/blindbox/rule_bg.png')" mode="" class="rule-head"></image>
					<view class="rule-title font-size-toolbar">活动规则</view>
					<scroll-view scroll-y="true" class="rule">
						<view>
							<view class="rule-tit">
								<view class="rule-img"><image :src="$util.img('public/uniapp/blindbox/tag.png')" mode=""></image></view>
								<view class="tit">1. 活动时间</view>
							</view>
							<view class="text">开始时间：{{ $util.timeStampTurnTime(info.start_time) }}</view>
							<view class="text">结束时间：{{ $util.timeStampTurnTime(info.end_time) }}</view>
							<view class="rule-tit" v-if="info.remark">
								<view class="rule-img"><image :src="$util.img('public/uniapp/blindbox/tag.png')" mode=""></image></view>
								<view class="tit">2. 活动说明</view>
							</view>
							<view class="text" v-if="info.remark">{{ info.remark }}</view>
						</view>
					</scroll-view>
					<text class="iconfont iconroundclose" @click="closeRulePopup"></text>
				</view>
			</view>
		</uni-popup>
		<view class="success-popup">
			<uni-popup ref="againPopup" type="center">
				<view class="success-wrap">
					<view class="content-wrap">
						<view class="success" :style="{ backgroundImage: 'url(' + $util.img('public/uniapp/blindbox/success_bg.png') + ')' }">
							<view class="goods">
								<view class="goods-img"><image v-if="boxDetail.sku_image" :src="$util.img(boxDetail.sku_image)" mode="aspectFit" class=""></image></view>
								<view class="goods-name">{{ boxDetail.sku_name }}</view>
								<view class="goods-price">
									<text class="font-size-tag">￥</text>
									{{ parseFloat(boxDetail.price).toFixed(2).split(".")[0] }}
								   <text class="font-size-tag">.{{ parseFloat(boxDetail.price).toFixed(2).split(".")[1] }}</text>
								</view>
							</view>
							<view class="again">
								<view class="color-sub discharge">
									已为您存放至盒柜
									<text class="color-base-text tobox" @click="redirect('/pages_promotion/blindbox/my_prize', { blindbox_id: boxDetail.blindbox_id })">
										前往我的奖品>
									</text>
								</view>
								<view class="agains-btn">
									<view
										class="fill-btn"
										@click="
											redirect('/pages_promotion/blindbox/fill_address', { blindbox_goods_id: boxDetail.blindbox_goods_id, out_trade_no: outTradeNo })
										"
									>
										填写收货信息
									</view>
									<view class="again-btn color-base-bg" @click="reagain()">再来一次</view>
								</view>
							</view>
						</view>
						<view class="close-btn" @click="successClose()"><image :src="$util.img('public/uniapp/hongbao/close.png')" mode=""></image></view>
					</view>
				</view>
			</uni-popup>
		</view>
		<!-- 选择支付方式弹窗 -->
		<view class="" v-if="info.member_info">
			<ns-payment
				ref="choosePaymentPopup"
				:isBalance="is_balance"
				@useBalance="useBalance"
				:balanceDeduct="info.price > 0 && info.member_info.balance_total > 0 ? balanceDeduct : '0'"
				:payMoney="payMoney"
				@confirm="blindOrderCreate"
			></ns-payment>
		</view>
		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import SocketTask from '@/common/js/socketTest.js';
import nsSwitch from '@/components/ns-switch/ns-switch.vue';
export default {
	components: {
		nsSwitch
	},
	data() {
		return {
			lampX: 0, //跑马灯文字位置
			act: null,
			switch: false,
			blindbox_id: null,
			info: {},
			infoList: [],
			boxPage: [],
			boxData: {},
			is_balance: 0,
			payMoney: 1,
			isSub: false,
			payPrice: 0,
			outTradeNo: '',
			payInfo: {},
			page: 1,
			pages: '',
			inxs: null,
			orderId: null,
			boxDetail: {},
			skuId: 0,
			//分享建立上下级所需id
			memberId: 0,
			//分享时详情所用图片
			shareImg: ''
		};
	},
	onLoad(options) {
		this.blindbox_id = options.blindbox_id;

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
					if (item.indexOf('blindbox_id') != -1) this.blindbox_id = item.split('-')[1];
				});
			}
		}

		this.outTradeNo = options.outTradeNo || '';
		if (this.outTradeNo != '') {
			this.getboxGoods();
		} else {
			this.getGoods();
			this.getblindbox();
		}
	},
	onshow() {
		//记录分享关系
		if (uni.getStorageSync('token') && uni.getStorageSync('source_member')) {
			this.$util.onSourceMember(uni.getStorageSync('source_member'));
		}
	},
	/**
	 * 转发分享
	 */
	onShareAppMessage(res) {
		var title = this.info.blindbox_name;
		let route = this.$util.getCurrentShareRoute(this.memberId);
		var path = route.path;
		return {
			title: title,
			path: path,
			imageUrl: this.shareImg,
			success: res => {},
			fail: res => {}
		};
	},
	// 分享到微信朋友圈
	onShareTimeline() {
		var title = this.info.blindbox_name;
		let route = this.$util.getCurrentShareRoute(this.memberId);
		let query = route.query;
		return {
			title: title,
			query: query,
			imageUrl: this.shareImg
		};
	},
	methods: {
		goodsImg(imgStr) {
			let imgs = imgStr.split(',');
			return imgs[0]
				? this.$util.img(imgs[0], {
						size: 'mid'
				  })
				: this.$util.getDefaultImage().goods;
		},
		getGoods() {
			this.$api.sendRequest({
				url: '/blindbox/api/goods/info',
				data: {
					blindbox_id: this.blindbox_id
				},
				success: res => {
					if (res.code >= 0) {
						if (res.data) {
							this.info = res.data;
							//获取分享图片
							if (this.info.blindbox_images) {
								this.shareImg = this.$util.img(this.info.blindbox_images);
							} else {
								this.shareImg = this.$util.img('public/uniapp/blindbox/default.png');
							}
							var infoList = [];
							for (var i in res.data.goods_list) {
								infoList.push(res.data.goods_list[i]);
							}
							this.infoList = infoList;
							setTimeout(() => {
								if (this.infoList.length > 3) {
									this.scrollWindow();
								}
							}, 500);
						} else {
							this.$util.showToast({
								title: '暂无盲盒活动',
								mask: true,
								duration: 2000
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
							}, 2000);
							return;
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
		//拆开盲盒
		openBlind() {
			if (!uni.getStorageSync('token')) {
				setTimeout(() => {
					this.$refs.login.open('/pages_promotion/blindbox/index?blindbox_id=' + this.blindbox_id);
				});
			} else {
				if (this.info.is_new == 0) {
					this.payPrice = this.info.new_price;
				} else {
					this.payPrice = this.info.price;
				}
				if (this.payMoney != 0) {
					this.payMoney = this.payPrice;
				}
				if (this.act != null) {
					this.$refs.choosePaymentPopup.open();
				} else {
					this.$util.showToast({
						title: '请选择盒子'
					});
				}
			}
		},
		toMyprize() {
			if (!uni.getStorageSync('token')) {
				setTimeout(() => {
					this.$refs.login.open('/pages_promotion/blindbox/index?blindbox_id=' + this.blindbox_id);
				});
			} else {
				this.$util.redirectTo('/pages_promotion/blindbox/my_prize', { blindbox_id: this.info.blindbox_id });
			}
		},
		getblindbox() {
			this.$api.sendRequest({
				url: '/blindbox/api/goods/boxPage',
				data: {
					blindbox_id: this.blindbox_id,
					page: this.page
				},
				success: res => {
					if (res.code >= 0) {
						this.page++;
						this.boxPage.push(res.data.list);
						this.pages = res.data.page_count;
						if (this.inxs == null) {
							this.inxs = 0;
						} else {
							setTimeout(() => {
								this.inxs++;
							}, 100);
						}
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		},
		getboxGoods() {
			this.$api.sendRequest({
				url: '/blindbox/api/order/boxDetail',
				data: {
					out_trade_no: this.outTradeNo
				},
				success: res => {
					if (res.code >= 0) {
						this.isSub = false;
						this.$util.showToast({
							title: '支付成功'
						});
						this.boxDetail = res.data;
						this.$refs.againPopup.open();
						this.blindbox_id = this.boxDetail.blindbox_id;
						this.encapsulation();
						uni.setStorage({
							key: 'blindOrderCreateData',
							data: {
								sku_id: this.boxDetail.sku_id.toString(),
								num: 1
							}
						});
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						this.getGoods();
						this.getblindbox();
					} else {
						this.isSub = false;
						this.encapsulation();
						this.act = null;
						this.$util.showToast({
							title: res.message
						});
					}
					this.is_balance = 0;
				}
			});
		},
		blindOrderCreate() {
			if (this.isSub) return;
			this.isSub = true;
			this.$api.sendRequest({
				url: '/blindbox/api/order/createOrder',
				data: {
					blindbox_id: this.blindbox_id,
					blindbox_goods_id: this.boxData.id,
					is_balance: this.is_balance,
					price: this.payPrice
				},
				success: res => {
					uni.hideLoading();
					if (res.code >= 0) {
						this.outTradeNo = res.data;
						if (this.payMoney == 0) {
							this.getboxGoods();
						} else {
							this.$refs.choosePaymentPopup.getPayInfo(res.data);
							this.isSub = false;
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					} else {
						this.encapsulation();
						this.act = null;
						this.isSub = false;
						if (res.data.error_code == 10 || res.data.error_code == 12) {
							uni.showModal({
								title: '订单未创建',
								content: res.message,
								confirmText: '去设置',
								success: res => {
									if (res.confirm) {
										this.selectAddress();
									}
								}
							});
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
					if (this.payMoney != 0) {
						this.payMoney = this.payPrice;
					}
				}
			});
		},
		// 使用余额
		useBalance() {
			if (this.is_balance) {
				this.is_balance = 0;
			} else {
				this.payMoney = 0;
				this.is_balance = 1;
			}
			this.$forceUpdate();
		},
		//选择盒子
		checked(index, e) {
			if (this.act == index) {
				this.act = null;
			} else {
				if (e.status == 0) {
					this.act = index;
				} else {
					this.$util.showToast({
						title: '该盲盒已出售'
					});
				}
			}
			this.boxData = e;
		},
		scrollWindow() {
			let lampX = 0;
			let width = 0;
			let query = uni.createSelectorQuery().in(this);
			query
				.select('#innovate')
				.boundingClientRect(data => {
					width = data.width;
				})
				.exec();
			let inner = this.infoList;
			let inx = 0;
			let interval = setInterval(() => {
				if (this.lampX % 170 == 0) {
					if (inx == inner.length) {
						inx = 0;
					}
					this.infoList.push(inner[inx]);
					inx++;
				}
				this.lampX--;
			}, 20);
		},
		changeGroup() {
			this.act = null;
			if (this.boxPage.length < this.pages) {
				this.getblindbox();
			} else {
				if (this.pages == 1) {
					this.$util.showToast({
						title: '没有更多盒子可换了哦~'
					});
				} else if (this.pages <= 0) {
					this.$util.showToast({
						title: '盲盒已售空，等待商家补货'
					});
				}
				if (this.inxs + 1 == this.pages) {
					this.inxs = 0;
				} else {
					this.inxs++;
				}
			}
		},
		infoListImg(index) {
			this.infoList[index].goods_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		boxImg() {
			this.info.blindbox_images = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		redirect(url, id) {
			this.$util.redirectTo(url, id);
		},
		//打开活动规则
		rule() {
			this.$refs.rulePopup.open();
		},
		//关闭活动规则
		closeRulePopup() {
			this.$refs.rulePopup.close();
		},
		//拆开盲盒关闭
		successClose() {
			this.$refs.againPopup.close();
			this.act = null;
			this.encapsulation();
			this.getGoods();
			// location.reload();
		},
		//再来一次
		reagain() {
			this.successClose();
		},
		//盒子方法
		encapsulation() {
			this.$api.sendRequest({
				url: '/blindbox/api/goods/boxPage',
				data: {
					blindbox_id: this.blindbox_id,
					page: this.inxs + 1
				},
				success: res => {
					if (res.code >= 0) {
						this.boxPage.splice(this.inxs, 1, res.data.list);
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		},
		toIndex() {
			this.$util.redirectTo('/pages/index/index', {});
		},
		/**
		 * 微信订阅消息
		 */
		subscribeMessage() {
			this.$api.sendRequest({
				url: '/weapp/api/weapp/messagetmplids',
				data: {
					keywords: 'ORDER_PAY,ORDER_DELIVERY,ORDER_TAKE_DELIVERY'
				},
				success: res => {
					if (res.data.length) {
						uni.requestSubscribeMessage({
							tmplIds: res.data,
							success: res => {},
							fail: res => {
								console.log('fail', res);
							}
						});
					}
				}
			});
		}
	},
	watch: {
		is_balance: function(newval, oldval) {
			if (newval == 0) {
				this.payMoney = this.payPrice;
			} else {
				if (this.info.member_info) {
					if (this.info.member_info.balance_total - this.payPrice >= 0) {
						this.payMoney = 0;
					} else {
						this.payMoney = this.payPrice - this.info.member_info.balance_total;
					}
				}
			}
		}
	},
	computed: {
		// 余额抵扣
		balanceDeduct() {
			if (this.info.member_info) {
				if (this.info.is_balance == 1) {
					if (this.info.member_info.balance_total <= parseFloat(this.payPrice).toFixed(2)) {
						return parseFloat(this.info.member_info.balance_total).toFixed(2);
					} else {
						return parseFloat(this.payPrice).toFixed(2);
					}
				}
			}
		}
	}
};
</script>

<style lang="scss">
.blind-box {
	.null {
		color: #ff0000;
		line-height: 1;
		margin-left: 30rpx;
		padding: 24rpx 0;
		.gantan {
			margin-right: 20rpx;
		}
	}
	.box-bg {
		background-size: 100% 100%;
		background-repeat: no-repeat;
		padding-bottom: 160rpx;
		height: 100vh;
	}
	.top {
		display: flex;
		justify-content: space-between;
		margin-left: 30rpx;
		position: relative;
		padding-top: 60rpx;
		.top-img {
			width: 210rpx;
			height: 210rpx;
			margin-right: 20rpx;

			image {
				width: 100%;
				border-radius: 10rpx;
				height: 100%;
			}
		}
		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			view {
				color: #fff;
			}
			.blind-title {
				line-height: 1.5;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				word-break: break-word;
				height: 100rpx;
			}
			.scribe-price {
				line-height: 1;
				margin-top: 20rpx;
				text-decoration: line-through;
			}
			.new-price {
				line-height: 1;
				.icon {
					font-size: 30rpx;
				}
				.money {
					font-size: 40rpx;
				}
			}
		}
		.rule {
			width: 20rpx;
			height: 100rpx;
			line-height: 1;
			color: #fff;
			background-color: #4c3889;
			padding: 20rpx;
			border-radius: 10rpx 0 0 10rpx;
			margin-top: -20rpx;
		}
		.explain-img {
			width: 36rpx;
			height: 36rpx;
			position: absolute;
			top: 200rpx;
			left: 660rpx;
			z-index: 1000;
			background-color: #4c3889;
			padding: 12rpx;
			border-radius: 10rpx 0 0 10rpx;
			.index-img {
				width: 100% !important;
				height: 100% !important;
			}
		}
	}
	.cabinet-box {
		height: 780rpx;
		.cabinet {
			background-size: 100%;
			background-repeat: no-repeat;
			position: relative;
			height: 100%;
			margin: 84rpx 30rpx 0;
			swiper {
				height: 600rpx !important;
			}
			.center-one {
				position: absolute;
				top: 90rpx;
				left: 94rpx;
				display: flex;
				flex-wrap: wrap;
				.item {
					position: relative;
					.checked {
						z-index: 601;
						width: 142rpx !important;
						height: 168rpx !important;
						margin-top: 36rpx !important;
						position: absolute !important;
						left: -12rpx;
						top: 0;
					}
					.box {
						width: 120rpx;
						height: 122rpx;
						margin-right: 72rpx;
						position: relative;
						margin-top: 76rpx;
					}
				}
			}
			.btn-one {
				width: 270rpx;
				padding: 20rpx 0 32rpx;
				line-height: 1;
				background-size: 100% 100%;
				background-repeat: no-repeat;
				font-weight: bold;
				text-align: center;
				position: absolute;
				top: 620rpx;
				left: 60rpx;
				color: #fff;
			}
			.btn-two {
				width: 270rpx;
				padding: 20rpx 0 32rpx;
				line-height: 1;
				background-size: 100% 100%;
				background-repeat: no-repeat;
				font-weight: bold;
				text-align: center;
				position: absolute;
				top: 620rpx;
				left: 360rpx;
				color: #fff;
			}
		}
	}
	.list-box {
		position: relative;
		margin: -30rpx 30rpx 68rpx;
		z-index: 500;
		overflow: hidden;
		.list_bit {
			background-size: 100% 100%;
			background-repeat: no-repeat;
			height: 230rpx;
			display: flex;
			padding: 0 70rpx 0 30rpx;
			.list {
				height: 230rpx;
				position: relative;
				padding: 0 10rpx;
				overflow: hidden;
				overflow-x: scroll;
				width: 90%;
				.imgs-list {
					display: flex;
					align-items: center;
					margin-top: 30rpx;
					.imgs-img {
						transition: all 0.4s;
						background-color: #fff;
					}
				}
				image {
					width: 170rpx;
					height: 170rpx;
					border-radius: 10rpx;
					margin-right: 20rpx;
					flex-shrink: 0;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				@keyframes scroll {
					100% {
						/* 需要滚动内容的总高度 */
						left: -540rpx;
					}
				}
			}
		}

		.all {
			width: 20rpx;
			line-height: 1;
			color: #fff;
			background: linear-gradient(0deg, #ffc579, #ffa141);
			padding: 38rpx 18rpx;
			border-radius: 10rpx;
			position: absolute;
			top: 30rpx;
			right: 30rpx;
		}
	}
	.footer {
		font-size: 30rpx;
		color: #fff;
		background-color: #8a6de1;
		border-radius: 50rpx 50rpx 0 0;
		width: 100%;
		line-height: 1;
		padding: 36rpx 0;
		text-align: center;
		position: fixed;
		bottom: 0;
		z-index: 600;
	}
	.rule-wrap {
		border-radius: 10rpx;
		width: 79.95vw;
		box-sizing: border-box;
		background-color: #fff;
		.content-wrap {
			width: 100%;
			border-radius: 8rpx;
			.rule-title {
				position: absolute;
				text-align: center;
				font-weight: bold;
				color: #fff;
				left: 40%;
				top: 40rpx;
			}
			.rule-head {
				width: 100%;
				height: 146rpx;
				border-radius: 8rpx;
			}
			.rule {
				padding: 0 30rpx 30rpx;
				box-sizing: border-box;
				max-height: 700rpx;
				.rule-tit {
					display: flex;
					align-items: center;
				}
				.rule-img {
					width: 30rpx;
					height: 32rpx;
					margin-right: 20rpx;
					image {
						width: 100%;
						height: 100%;
					}
				}
				.tit {
					font-weight: bold;
					margin-top: 10rpx;
					font-size: 30rpx;
				}
				.text {
					word-break: break-word;
					margin-left: 48rpx;
				}
			}
			.iconroundclose {
				color: #fff;
				text-align: center;
				position: absolute;
				bottom: -150rpx;
				left: 50%;
				transform: translateX(-50%);
				font-size: 70rpx;
			}
		}
	}
	.success-wrap {
		width: 630rpx;
		.content-wrap {
			width: 100%;
			border-radius: 20rpx;
			.success {
				background-size: 100% 100%;
				background-repeat: no-repeat;
				padding: 50rpx 0 0;
				.goods {
					width: 360rpx;
					margin: 0 auto;
					background-color: #fff;
					border-radius: 10rpx;
					.goods-img {
						width: 360rpx;
						height: 360rpx;
						image {
							width: 360rpx;
							height: 360rpx;
						}
					}
					.goods-name {
						padding: 20rpx 26rpx 0;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						height: 80rpx;
						line-height: 1.4;
					}
					.goods-price {
						line-height: 1;
						padding: 16rpx 26rpx 26rpx;
						font-size: 36rpx;
						color: var(--price-color);
					}
				}
				.again {
					background-color: #fff;
					border-radius: 20rpx;
					padding: 30rpx 0;
					margin-top: 50rpx;
					.discharge {
						text-align: center;
						.tobox {
							margin-left: 20rpx;
						}
					}
					.agains-btn {
						display: flex;
						justify-content: space-around;
						margin: 30rpx 0 0;
						view {
							color: #fff;
							border-radius: 36rpx;
							line-height: 1;
							width: 260rpx;
							text-align: center;
						}
						.fill-btn {
							background-color: #ff9344;
							padding: 22rpx 0;
						}
						.again-btn {
							padding: 22rpx 0;
						}
					}
				}
			}
			.close-btn {
				margin-top: 30rpx;
				text-align: center;
				image {
					width: 82rpx;
					height: 82rpx;
				}
			}
		}
	}
}
</style>
<style>
/deep/ .uni-popup__wrapper.uni-bottom {
	border-radius: 40rpx 40rpx 0 0 !important;
}
/deep/.register-box .uni-scroll-view {
	background: unset !important;
}
>>> .uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
	overflow: unset;
}
/deep/ uni-popup__wrapper-box goodslist-uni-popup-box {
	/* border-radius: 20rpx !important; */
}
/deep/ .success-popup .uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
	border-radius: 20rpx !important;
	max-width: 84% !important;
}
/deep/ .uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
	background: unset !important;
}
</style>
