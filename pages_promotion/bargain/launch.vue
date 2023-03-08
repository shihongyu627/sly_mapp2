<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="bargain" :style="{backgroundImage:'url('+ $util.img('public/uniapp/bargain/bargain_background1.png') +')'}">
		<view class="bargain_top" :style="{backgroundImage:'url('+ $util.img('public/uniapp/bargain/bargain_background.png') +')'}"></view>
		<view class="bargin_content">
			<view class="uer_info_base">
				<view class="user_info_img">
					<image :src="info.headimg  == '' ? $util.img($util.getDefaultImage().head) : $util.img(info.headimg)"
					 mode="widthFix"></image>
				</view>
				<text class="user_info_name">{{ info.nickname|cover }}</text>
				<!-- <text class="rule_detail color-base-text color-base-border">活动规则</text> -->
			</view>
			<!-- 宣传语 -->
			<view class="bargin_propaganda">
				<text class="marks">“</text><text>我发现一件好物，快来帮我砍一刀</text><text class="marks">”</text>
			</view>
			<!-- 商品 -->
			<view class="goods">
				<view class="goods_img">
					<image :src="$util.img(info.sku_image, {'size':'mid'})" mode="aspectFit"></image>
				</view>
				<view class="goods_content">
					<view class="goods_title">{{ info.sku_name }}</view>
					<view class="goods_price">
						<view>原价<text class="original_price"> {{ $lang('common.currencySymbol') }}{{ info.price }}</text></view>
						<view>最低可砍至<text class="bottom_price"> {{ $lang('common.currencySymbol') }}{{ info.floor_price }}</text></view>
					</view>
					<view class="partake_num">已有<text class="ident">{{ info.curr_num }}</text>人帮砍 <text class="residue-num">剩余数量<text
							 class="ident">{{ info.bargain_stock }}</text></text></view>
					<view v-if="timeMachine">还剩
						<uni-count-down :day="timeMachine.d" :hour="timeMachine.h" :minute="timeMachine.i" :second="timeMachine.s" color="#fff"
						 splitorColor="#333 !important" backgroundColor="#000" border-color="transparent" />
						</uni-count-down>
					</view>
				</view>
			</view>
			<!-- 进度 -->
			<view class="progress_info">
				<view>已砍至<text>{{ info.curr_price|moneyFormat }}</text>元
				</view>
				<view>
					最低{{ info.floor_price }}元
				</view>
			</view>
			<view class="progress">
				<view class='progress_item' :style="{width: (progress > 5 ? progress : 5) + '%' }">
					<image class="progress_img" :src="$util.img('public/uniapp/bargain/bargain_progress.png')"></image>
				</view>
			</view>
			<block v-if="bargainRecord.length">
				<!-- 砍价记录 -->
				<view class="bragain_recode">
					<view class="bragain_recode_list">
						<block v-for="(item, index) in bargainRecord" :key="index">
							<image :src="item.headimg == '' ? $util.img($util.getDefaultImage().head) : $util.img(item.headimg)"
							 v-if="index < 4"></image>
						</block>
						<block v-if="bargainRecord.length < 5">
							<view class="bragain_recode_add" v-for="(item, index) in 5 - bargainRecord.length">+</view>
						</block>
					</view>
					<view class="bragain_recode_more" v-if="bargainRecord.length == 5">●●●</view>
					<view class="bragain_recode_add" v-if="bargainRecord.length == 5">+</view>
				</view>
				<view class="bragain_recode_detail" @click="toBargainRecode">
					已有{{ info.curr_num }}人帮砍，查看砍价记录<text class="iconfont iconright"></text>
				</view>
			</block>
			<!-- 邀请新用户 -->
			<view class="invitation_peo">
				<!-- <view class="tip">邀请新用户砍掉金额更多哦~</view> -->
				<view v-if="info.self" class="flex-box">
					<block v-if="info.status != 1 && (info.bargain_status != 1 || info.bargain_stock == 0)">
						<block v-if="info.bargain_status != 1">
							<button class="btn-vice disabled">活动已结束</button>
							<button class="btn" @click="$util.redirectTo('/pages_promotion/bargain/list')">更多砍价商品</button>
						</block>
						<block v-else-if="info.bargain_stock == 0">
							<button class="btn-vice disabled">已售罄</button>
							<button class="btn" @click="$util.redirectTo('/pages_promotion/bargain/list')">更多砍价商品</button>
						</block>
					</block>
					<block v-else>
						<block v-if="info.status == 0">
							<button class="btn-vice" v-if="info.buy_type == 0" @click="buyNow">不砍了，直接购买</button>
							<!-- #ifdef MP -->
							<button class="btn" open-type="share">喊好友来砍一刀</button>
							<!-- #endif -->
							<!-- #ifdef H5 -->
							<button class="btn" @click="openSharePopup">喊好友来砍一刀</button>
							<!-- #endif -->
						</block>
						<block v-if="info.status == 1">
							<button class="btn-vice" @click="$util.redirectTo('/pages_promotion/bargain/list')">低价拿更多商品</button>
							<button class="btn" @click="buyNow" v-if="info.order_id == 0">立即购买</button>
						</block>
						<block v-if="info.status == 2">
							<button class="btn" @click="$util.redirectTo('/pages_promotion/bargain/list')">低价拿更多商品</button>
						</block>
					</block>
				</view>
				<view v-else class="flex-box">
					<block v-if="info.status == 0">
						<button class="btn" @click="bargain" v-if="!info.cut">帮好友砍一刀</button>
						<button class="btn-vice" @click="$util.redirectTo('/pages_promotion/bargain/list')" v-else>我也要低价拿</button>
					</block>
					<block v-else>
						<button class="btn" @click="$util.redirectTo('/pages_promotion/bargain/list')">我也要低价拿</button>
					</block>
				</view>
			</view>
		</view>
		<view class="bargin_introduction">
			<view class="bargin_introduction_title">
				<image class="left" :src="$util.img('public/uniapp/bargain/bargain_left.png')"></image>
				砍价流程
				<image class="right" :src="$util.img('public/uniapp/bargain/bargain_right.png')"></image>
			</view>
			<view class="bargin_introduction_content">
				<view class="flow">
					<view class="flow_item">
						<image :src="$util.img('public/uniapp/bargain/bargain_kanjia.png')"></image>
						<view>发起商品砍价</view>
					</view>
					<view class="flow_item">
						<image :src="$util.img('public/uniapp/bargain/bargain_friend.png')"></image>
						<view>邀请好友砍价达要求</view>
					</view>
					<view class="flow_item">
						<image :src="$util.img('public/uniapp/bargain/bargain_good.png')"></image>
						<view>领取商品带回家</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bargin_introduction">
			<view class="bargin_introduction_title">
				<image class="left" :src="$util.img('public/uniapp/bargain/bargain_left.png')"></image>
				砍价记录
				<image class="right" :src="$util.img('public/uniapp/bargain/bargain_right.png')"></image>
			</view>
			<view class="bargin_introduction_content">
				<view class="bargin_invitation" v-if="bargainRecord.length">
					<view class="item" v-for="(item, index) in bargainRecord" :key="index">
						<view class="item_left">
							<image :src="item.headimg == '' ? $util.img($util.getDefaultImage().head) : $util.img(item.headimg)"></image>
							<view>
								<view class="title">{{ item.nickname|cover }}</view>
								<view class="tip" v-if="item.member_id == info.member_id">手气真好，狂砍一刀</view>
								<view class="tip" v-else>好友助力，帮砍一刀</view>
							</view>
						</view>
						<view class="item_right">
							砍掉<text>￥{{ item.money }}</text>
						</view>
					</view>
					<!-- <view class="item_more">查看更多</view> -->
				</view>
				<view v-else>
					<view class="record-empty">现在还没有砍价记录！</view>
				</view>
			</view>
		</view>

		<uni-popup ref="uniPopup" type="center" :maskClick="false">
			<view class="bargain-popup">
				<image :src="$util.img('public/uniapp/bargain/coin.png')" mode="widthFix" class="head"></image>
				<view class="title">您已成功帮砍</view>
				<view class="money">
					<text class="num color-base-text">{{ bargainMoney }}</text>
					<text class="unit">元</text>
				</view>
			</view>
			<text class="iconfont iconroundclose" @click="closePopup"></text>
		</uni-popup>

		<!-- 分享弹窗 -->
		<view @touchmove.prevent.stop>
			<uni-popup ref="sharePopup" type="bottom" class="share-popup">
				<view>
					<view class="share-title">分享</view>
					<view class="share-content">
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

		<loading-cover ref="loadingCover"></loading-cover>

		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
	import LTime from "@/components/l-time/l-time.vue";
	import uniPopup from '@/components/uni-popup/uni-popup.vue';

	export default {
		components: {
			LTime,
			uniPopup
		},
		data() {
			return {
				windowHeight: 0,
				id: 0,
				info: {
					headimg: ''
				},
				bargainRecord: [],
				page: 1,
				totalPage: 1,
				load: false,
				timeMachine: null,
				memberId: 0,
				bargainMoney: '0.00',
				token: null
			};
		},
		onLoad(data) {
			this.getHeight();
			if (data.id) this.id = data.id;
		},
		computed: {
			cutMoney() {
				return this.info.price - this.info.curr_price;
			},
			surplusMoney() {
				return this.info.curr_price - this.info.floor_price;
			},
			progress() {
				let total = this.info.price - this.info.floor_price,
					progress = parseInt(this.cutMoney / total * 100);
				return isNaN(progress) ? 0 : progress;
			}
		},
		onShow() {
			this.getBargainInfo();
			if (uni.getStorageSync('token')) {
				this.$util.getMemberId().then(resolve => {
					this.memberId = resolve;
					this.token = uni.getStorageSync('token');
					if (this.info.launch_id) this.setPublicShare();
				});
			}
		},
		onReady() {
			if (!this.addonIsExist.bargain) {
				this.$util.showToast({
					title: '商家未开启砍价',
					mask: true,
					duration: 2000
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
				}, 2000);
				return;
			}
		},
		methods: {
			getHeight() {
				var self = this;
				uni.getSystemInfo({
					success: function(res) {
						self.windowHeight = res.windowHeight - 44;
						if (self.iphoneX) {
							self.windowHeight = self.windowHeight - 33;
						}
					}
				});
			},
			getBargainInfo() {
				this.$api.sendRequest({
					url: '/bargain/api/bargain/info',
					data: {
						id: this.id
					},
					success: res => {
						if (res.code == 0) {
							this.info = res.data;
							this.getBargainRecord(1);
							if (this.info.status == 0) {
								this.timeMachine = this.$util.countDown(this.info.end_time - res.timestamp);
							}
							this.setPublicShare()
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						} else {
							this.$util.redirectTo('/pages_promotion/bargain/my_bargain');
						}
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				})
			},
			getBargainRecord(page) {
				if (this.load) return;
				this.load = true;

				this.$api.sendRequest({
					url: '/bargain/api/bargain/record',
					data: {
						page: page,
						id: this.info.launch_id
					},
					success: res => {
						this.load = false;
						this.totalPage = res.data.page_count;
						this.page = page;
						if (res.code == 0 && res.data.list.length) {
							if (page == 1) {
								this.bargainRecord = res.data.list;
							} else {
								this.bargainRecord = this.bargainRecord.concat(res.data.list);
							}
						}
					},
				})
			},
			scrolltolower() {
				let next = this.page + 1;
				if (!this.load && next <= this.totalPage) {
					this.getBargainRecord(next);
				}
			},
			/**
			 * 立即购买
			 */
			buyNow() {
				uni.setStorage({
					key: 'bargainOrderCreateData',
					data: {
						launch_id: this.info.launch_id
					},
					success: () => {
						this.$util.redirectTo('/pages_promotion/bargain/payment');
					}
				});
			},
			/**
			 * 帮好友砍价
			 */
			bargain() {
				if (uni.getStorageSync('token')) {
					this.$api.sendRequest({
						url: '/bargain/api/bargain/bargain',
						data: {
							id: this.info.launch_id
						},
						success: res => {
							if (res.code == 0) {
								this.bargainMoney = parseFloat(res.data.bargain_money).toFixed(2)
								this.$refs.uniPopup.open();
								this.getBargainInfo();
							}
						}
					})
				} else {
					this.$refs.login.open('/pages_promotion/bargain/launch?id=' + this.id);
				}
			},
			closePopup() {
				this.$refs.uniPopup.close();
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
				let text = '嘿！朋友就差你这一刀了，帮一下忙呗~' + this.$config.h5Domain + '/pages_promotion/bargain/launch?id=' + this.id;
				if (this.memberId) text += '&source_member=' + this.memberId;
				this.$util.copy(text, () => {
					this.closeSharePopup();
				});
			},
			toBargainRecode() {
				let view = uni.createSelectorQuery().select(".bargin_introduction");
				view.boundingClientRect(data => {
					uni.pageScrollTo({
						duration: 100,
						scrollTop: data.top + 100
					})
				}).exec();
			},
			/**
			 * 设置公众号分享
			 */
			setPublicShare(){
				let shareUrl = this.$config.h5Domain + '/pages_promotion/bargain/launch?id=' + this.id;
				if (this.memberId) shareUrl += '&source_member=' + this.memberId;
			
				this.$util.setPublicShare({
					title: this.info.sku_name, 
					desc: '嘿！朋友就差你这一刀了，帮一下忙呗~',
					link: shareUrl,
					imgUrl: this.info.sku_image
				})
			}
		},
		filters: {
			/**
			 * 字符掩饰输出
			 * @param {Object} str
			 */
			cover(str) {
				if (typeof str == 'string' && str.length > 0) {
					return str.substr(0, 1) + '******' + str.substr(-1);
				} else {
					return '';
				}
			}
		},
		/**
		 * 自定义分享内容
		 */
		onShareAppMessage() {
			var path = '/pages_promotion/bargain/launch?id=' + this.id;
			if (this.memberId) path += '&source_member=' + this.memberId;
			return {
				title: '嘿！朋友就差你这一刀了，帮一下忙呗~',
				imageUrl: this.$util.img(this.info.sku_image, {
					size: 'big'
				}),
				path: path,
				success: res => {},
				fail: res => {}
			};
		},
		onReachBottom() {
			this.scrolltolower();
		}
	};
</script>

<style lang="scss">
	/deep/.uni-countdown__number {
		padding: 0 4rpx;
		line-height: 36rpx;
		height: 36rpx;
	}

	/deep/ .uni-countdown__splitor.day {
		line-height: 36rpx;
	}

	.bargain {
		background-size: cover;
		background-repeat: repeat-y;
		padding-bottom: 100rpx;

		.bargain_top {
			height: 160rpx;
			background-size: 100% auto;
			background-repeat: no-repeat;
		}

		.bargin_content {
			background-color: #fff;
			border-radius: 20rpx;
			margin: 24rpx;
			padding-bottom: 60rpx;

			.uer_info_base {
				display: flex;
				position: relative;
				padding: 30rpx 0;

				.user_info_img {
					background-color: #fff;
					width: 150rpx;
					height: 150rpx;
					margin-top: -80rpx;
					margin-left: 50rpx;
					border-radius: 50%;
					border: 2px solid #fff;
					overflow: hidden;

					image {

						width: 100%;
						height: 100%
					}
				}

				.user_info_name {
					margin-left: 30rpx;
					color: $color-tip;
					align-self: center;
				}

				.rule_detail {
					position: absolute;
					height: 34rpx;
					line-height: 34rpx;
					padding: 0 12rpx;
					line-height: 34rpx;
					font-size: 18rpx;
					border: 1px solid;
					right: 24rpx;
					top: 30rpx;
					border-radius: 34rpx;
				}
			}

			.bargin_propaganda {
				display: flex;
				justify-content: space-between;
				margin: 0 27rpx;
				font-size: 36rpx;
				color: #333333;
				font-weight: bold;

				.marks {
					font-size: 68rpx;
					line-height: 1;
					color: #B0B0B0
				}

			}

			.goods {
				display: flex;
				margin-top: 40rpx;
				margin-left: 24rpx;
				margin-right: 24rpx;
				padding: 24rpx;
				background-color: #FAFAFA;
				border-radius: 10rpx;
				overflow: hidden;

				.goods_img {
					min-width: 180rpx;
					width: 180rpx;
					height: 180rpx;
					margin-right: 20rpx;
					border-radius: 10rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.goods_content {
					flex: 1;
					overflow: hidden;

					.goods_title {
						line-height: 1;
						font-size: 30rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						margin-bottom: 10rpx;
					}

					.goods_price {
						display: flex;

						>view {
							color: #666666;
							font-size: 22rpx;
							margin-right: 20rpx;

							.original_price {
								text-decoration: line-through;
							}

							.bottom_price {
								color: var(--price-color);
							}
						}
					}

					.partake_num {
						font-size: 22rpx;
						color: #666666;

						.residue-num {
							margin-left: 10rpx;
						}

						.ident {
							color: #FE0B42;
						}
					}
				}
			}

			.progress_info {
				display: flex;
				justify-content: space-between;
				margin: 40rpx 24rpx 0;

				>view {
					font-size: 20rpx;
					color: #666666;

					text {
						color: var(--price-color);
					}
				}
			}

			.progress {
				position: relative;
				margin: 11rpx 24rpx 0;
				height: 30rpx;

				background-color: #F2F2F2;
				border-radius: 30rpx;

				.progress_item {
					width: 5%;
					position: absolute;
					left: 0;
					border-radius: 30rpx;
					height: 30rpx;
					background: linear-gradient(to right, #FFA800 0%, #FFE852 100%);
					animation: all 1s forwards;

					.progress_img {
						position: absolute;
						right: -27rpx;
						top: -12rpx;
						height: 54rpx;
						width: 54rpx;
					}
				}
			}

			.bragain_recode {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 58rpx 24rpx 20rpx;

				.bragain_recode_list {
					display: flex;
					margin: 0 26rpx;

					.bragain_recode_add {
						margin-left: 44rpx;
					}

					image {
						width: 84rpx;
						height: 84rpx;
						border: 4rpx solid #FE0B42;
						border-radius: 50%;
						margin-left: -22rpx;

						&:first-child {
							margin-left: 0;
						}
					}
				}

				.bragain_recode_more {
					width: 84rpx;
					height: 84rpx;
					line-height: 84rpx;
					text-align: center;
					font-size: 12rpx;
					color: #999999
				}

				.bragain_recode_add {
					width: 84rpx;
					height: 84rpx;
					line-height: 76rpx;
					text-align: center;
					border-radius: 50%;
					border: 1px dashed #E6E6E6;
					font-size: 60rpx;
					color: #E6E6E6;
				}
			}

			.bragain_recode_detail {
				font-size: 24rpx;
				color: #000;
				margin: 0 34rpx 0;

				.iconfont {
					font-size: 24rpx;
					color: #333333;
				}
			}

			.invitation_peo {
				margin-top: 40rpx;
				margin: 28rpx 30rpx 0;

				.tip {
					text-align: center;
					color: #FE0B42;
					font-size: $font-size-goods-tag;

				}

				.flex-box {
					display: flex;

					button {
						flex: 1;

						&:nth-child(2) {
							margin-left: 20rpx;
						}
					}
				}

				.btn {
					height: 80rpx;
					line-height: 80rpx;
					background: linear-gradient(to bottom, #FFE852, #FFA800);
					border-radius: $border-radius;
					text-align: center;
					font-size: 30rpx;
					color: #FF222C;
					font-weight: bold;
					margin: 20rpx 0;
				}

				.btn-vice {
					height: 80rpx;
					line-height: 80rpx;
					background: linear-gradient(to bottom, #FF6E6E, #FB3939);
					border-radius: $border-radius;
					text-align: center;
					font-size: 30rpx;
					color: #FF222C;
					font-weight: bold;
					margin: 20rpx 0;
					color: #fff;
				}
			}
		}

		.bargin_introduction {
			margin: 24rpx;

			.record-empty {
				text-align: center;
				font-size: $font-size-tag;
				color: #999;
				padding: 100rpx 0;
				background-color: #fff;
				border-radius: 20rpx;
			}

			.bargin_introduction_title {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 36rpx;
				color: #fff;
				font-weight: 500;
				padding: 40rpx 0;

				image {
					width: 180rpx;
					height: 8rpx;

					&.left {
						margin-right: 13rpx;
					}

					&.right {
						margin-left: 13rpx;
					}
				}
			}

			.flow {
				display: flex;
				background-color: #fff;
				border-radius: 20rpx;
				padding: 56rpx 0;

				.flow_item {
					position: relative;
					flex: 1;
					text-align: center;

					image {
						width: 88rpx;
						height: 88rpx;
						margin-bottom: 20rpx;
					}

					>view {
						color: #FD0742;
						font-size: 24rpx;
					}

					&::after {
						position: absolute;
						content: "";
						height: 2rpx;
						width: 100rpx;
						background-color: #FD0742;
						top: 44rpx;
						right: -22%;
					}

					&:last-child::after {
						width: 0;
					}
				}
			}

			.bargin_invitation {
				background-color: #fff;
				border-radius: 20rpx;
				padding: 27rpx;

				.item {
					display: flex;
					align-items: center;
					padding: 20rpx 0;

					.item_left {
						flex: 1;
						display: flex;
						overflow: hidden;

						image {
							height: 70rpx;
							width: 70rpx;
							border: 2px solid #FF222C;
							border-radius: 50%;
							margin-right: 20rpx;
						}

						>view {
							flex: 1;
							overflow: hidden;

							.title {
								font-size: $font-size-goods-tag;
								white-space: nowrap;
								/* 不换行 */
								overflow: hidden;
								text-overflow: ellipsis;
							}

							.tip {
								font-size: 20rpx;
								color: #666666
							}
						}

					}

					.item_right {
						min-width: 100rpx;
						color: #FF222C;
						font-size: 20rpx;

						text {
							font-size: $font-size-tag;
							color: var(--price-color);
						}
					}
				}

				.item_more {
					margin-top: 20rpx;
					text-align: center;
					font-size: 20rpx;
					color: #999999;
				}
			}
		}
	}

	.bargain-popup {
		width: 80vw;
		padding: 60rpx;
		background-color: #fff;
		position: relative;
		box-sizing: border-box;
		border-radius: 20rpx;

		.head {
			width: 55%;
			position: absolute;
			left: 50%;
			top: 0;
			transform: translate(-50%, -70%);
		}

		.title {
			text-align: center;
			font-size: 32rpx;
			margin-top: 40rpx;
		}

		.money {
			text-align: center;

			.num {
				font-size: 36rpx;
				font-weight: 600;
			}

			.unit {
				font-size: 24rpx;
				margin-left: 8rpx;
			}
		}
	}

	.iconroundclose {
		display: block;
		font-size: 60rpx;
		color: #ffffff;
		text-align: center;
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

				.iconfuzhilianjie {
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
</style>
<style scoped>
	/deep/.uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
		overflow-y: unset;
		background: none !important;
	}
</style>
