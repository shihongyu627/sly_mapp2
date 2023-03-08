<template>
	<view class="order-container" :class="{ 'safe-area': isIphoneX }" :data-theme="themeStyle">
		<view class="order-nav">
			<view v-for="(statusItem, statusIndex) in statusList" :key="statusIndex" class="uni-tab-item"
				:id="statusItem.id" :data-current="statusIndex" @click="ontabtap">
				<text class="uni-tab-item-title"
					:class="statusItem.status == orderStatus ? 'uni-tab-item-title-active color-base-border  color-base-text' : ''">
					{{ statusItem.name }}
				</text>
			</view>
		</view>
		<mescroll-uni ref="mescroll" @getData="getListData" top="100rpx">
			<block slot="list">
				<view class="landing-headerbox">
					<view class="landing-item">
						<view class="item-title">
							总收入
						</view>
						<view class="item-num">
							￥{{total_money}}
						</view>
					</view>
					<view class="landing-item landing-item1">
						<view class="item-title">
							已结算
						</view>
						<view class="item-num">
							￥{{money_ed}}
						</view>
					</view>
					<view class="landing-item">
						<view class="item-title">
							未结算
						</view>
						<view class="item-num">
							￥{{money_ing}}
						</view>
						<view class="item-iconBox" @click="tipAsk">
							<img class='item-icon' src="../../common/img/askPng.png" alt="" mode="aspectFill" />
						</view>
					</view>
				</view>
				<block>
					<view class="data-box">
						<view class="data-yearBox">
							<picker mode="date" fields="month" :value="date" @change="bindMonthChange">
								<view class="data-year">
									<view class="data-date">{{date}}</view>
									<img class='data-bottomIcon' src="../../../common/img/store_bottom.png" alt=""
										mode="aspectFill" />
								</view>
							</picker>
							<view class="data-monthTotal">本月合计：<text style="color: #1189F4;">{{money_month}}</text>元
							</view>
						</view>
						<block v-if="dataList.length>0">
							<view class="data-item" v-for="(item, index) in dataList" :key="index">
								<view class="data-left" @click="toOrder(item)">
									<view class="data-icon">
										<img class='data-iconImg' :src="$util.loadimg(item.to_dealer_head)" alt=""
											mode="aspectFill" />
									</view>
									<view class="item-content">
										<view class="item-name">
											{{item.to_dealer_name}}
										</view>
										<view class="item-mobile">
											{{item.to_dealer_mobile}}
										</view>
									</view>
								</view>
								<view class="data-right">
									<view class="data-money">
										{{item.money}}
									</view>
									<view class="data-btnBox" v-if="orderStatus==1">
										<view class="data-btn" @click="toPhoto(item,'invoice')">
											{{item.is_invoice==1?'查看发票':'上传发票'}}
										</view>
										<view class="data-btn1" @click="toPhoto(item,'pay')">
											查看凭证
										</view>
									</view>
									<view class="data-btnBox" v-if="orderStatus==2">
										<view class="data-btn" @click="toPhoto(item,'invoice')">
											查看发票
										</view>
										<view class="data-btn1" @click="toPhoto(item,'pay')">
											{{item.is_pay==1?'查看凭证':'上传凭证'}}
										</view>
									</view>
								</view>
							</view>
						</block>
						<block v-else>
							<view>
								<ns-empty :isIndex="!1" text="暂无数据"></ns-empty>
							</view>
						</block>
					</view>

				</block>

			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>

		<uni-popup ref="storePopup" type="center" :mask-click="true">
			<view class="popBox">
				<view class="popBox-top">
					<view class="popBox-title">
						温馨提示
					</view>
					<img class='pop-close' src="@/common/img/close.png" mode="aspectFill" @click='maskClick()' />
				</view>
				<view class="pop-content">
					{{content1}}{{content}}
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import dayjs from 'dayjs'
	export default {
		components: {},
		mixins: [globalConfig],
		data() {
			return {
				isIphoneX: false,
				isSub: false,
				dataList: [],
				date: dayjs().format('YYYY-MM'),
				statusList: [],
				order_type: 'in',
				is_self: '1',
				orderStatus: '1',
				money_ed: '',
				money_ing: '',
				total_money: '',
				money_month: '',
				content1: '推荐费：\n区域经销商在录入系统前，填写的推荐人，形成推荐关系。推荐关系可在经销商工作台推荐人列表查看。\n推荐人推荐的区域经销商产生的训练仪进货订单，每笔订单会产生100元的推荐奖励。系统会依据进货订单统计核算推荐奖励。\n',
				content: '结算规则：\n1.填写完善结算打款账号信息。（对公账户，私人账户需申请代开发票）\n2.每月1号会自动生成上月的推荐费奖励总额和明细。\n3.可多月合并申请结算，多月合并结算时需备注结算月份。\n4.推荐费奖励结算是由上级供货人结算。提交结算申请时会自动展示上级供货人信息\n5.填写结算金额，上传发票（可与上级协商是否需要提供发票）。提交申请，等待供货人审核结算信息。\n6.上级供货人审核结算申请时，核对信息是否正确，打款后上传打款凭证，确认通过后完成结算。\n结算时间：\n每月1号出明细后，可自行申请结算。'
			};
		},
		onLoad(data) {
			this.getOrderStatus()
		},
		onShow() {
			this.$refs.mescroll.refresh();
		},
		methods: {
			toOrder() {
				this.$util.redirectTo('/sellStore/recommend/order/order', {
					type: this.orderStatus,
					date: this.date
				});
			},
			/**
			 * 获取物流订单状态
			 */
			getOrderStatus() {
				this.orderStatus = '1'
				this.statusList = [{
						status: '1',
						name: '收入预览',
						id: 'status_1'
					},
					{
						status: '2',
						name: '支出预览',
						id: 'status_2'
					},
				];
			},
			// 切换状态
			ontabtap(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.orderStatus = this.statusList[index].status;
				this.$refs.loadingCover.show();
				this.$refs.mescroll.refresh();
			},
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/dealer/api/tuijian/recordPage',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						type: this.orderStatus,
						date: this.date,
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
							this.money_ed = res.data.money_ed || '0'
							this.money_ing = res.data.money_ing || '0'
							this.total_money = res.data.total_money || '0'
							this.money_month = res.data.money_month || '0'
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
						this.dataList = this.dataList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			tipAsk() {
				// this.$refs.storePopup.open('center')
				this.$util.redirectTo('/sellStore/recommend/rule/rule', {
					title: '推荐费规则',
					type: 1
				});
			},
			maskClick() {
				console.log(123);
				this.$refs.storePopup.close()
			},
			bindMonthChange(e) {
				this.date = e.detail.value
				this.$refs.mescroll.refresh();
			},
			toPhoto(data, type) {
				console.log(data);
				let imgArr = []
				if (type == 'invoice') {
					imgArr = data.invoice_gallery && data.invoice_gallery.split(',') || []
				} else {
					imgArr = data.pay_gallery && data.pay_gallery.split(',') || []
				}
				if (imgArr.length > 0) {
					uni.previewImage({
						urls: imgArr,
						current: imgArr[0]
					});
					return
				}
				this.$util.redirectTo('/sellStore/landing/upload/upload', {
					type: type,
					id: data.id
				});
			}
		}
	};
</script>

<style lang="scss">
</style>
<style scoped lang="scss" scoped>
	.order-nav {
		width: 100vw;
		height: 100rpx;
		flex-direction: row;
		/* #ifdef H5 */
		// padding-top: 14rpx;
		/* #endif */
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
		background: #fff;
		display: flex;
		// border-bottom-left-radius: 24rpx;
		// border-bottom-right-radius: 24rpx;
		// padding-bottom: 30rpx;
		/* #ifdef H5 */
		// padding-bottom: 20rpx;
		/* #endif */
		position: fixed;
		left: 0;
		z-index: 998;
		overflow-x: scroll;

		.uni-tab-item {
			flex: 1;
			padding-left: 15rpx;
			padding-right: 15rpx;
		}

		.uni-tab-item-title {
			font-size: $font-size-base;
			display: block;
			height: 86rpx;
			line-height: 90rpx;
			border-bottom: 1px solid #fff;
			padding: 0 10rpx;
			flex-wrap: nowrap;
			/* #ifndef APP-PLUS */
			white-space: nowrap;
			/* #endif */
			text-align: center;
			font-size: 30rpx;
		}

		.uni-tab-item-title-active {
			display: block;
			height: 86rpx;
			border-bottom: 2px solid #ffffff;
			padding: 0 10rpx;
		}

		::-webkit-scrollbar {
			width: 0;
			height: 0;
			color: transparent;
		}
	}

	.uni-tab-item-title {
		border: 0;
		padding-left: 30rpx;
		padding-right: 30rpx;
		height: 64rpx;
		background: #fff;
		opacity: 1;
		border-radius: 64rpx;
		color: #999999;
		line-height: 32px;
	}

	.uni-tab-item-title-active {
		background: #1189F4;
		color: #fff !important;
	}

	.landing-headerbox {
		width: 710rpx;
		height: 150rpx;
		background: #FFFFFF;
		border-radius: 20rpx 20rpx 20rpx 20rpx;
		opacity: 1;
		margin: 0 auto;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		position: relative;

		.landing-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 240rpx;
			height: 120rpx;

			.item-title {
				font-size: 28rpx;
				font-family: PingFang SC-Light, PingFang SC;
				font-weight: 800;
				color: #000000;
			}

			.item-num {
				font-size: 26rpx;
				font-family: PingFang SC-Heavy, PingFang SC;
				color: #000;
			}
		}

		.landing-item1 {
			border-right: 1rpx solid #F2F2F2;
			border-left: 1rpx solid #F2F2F2;
		}

		.item-iconBox {
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			right: 8rpx;
			top: 4rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}

		.item-icon {
			width: 40rpx;
			height: 40rpx;
		}
	}

	.data-box {
		padding-bottom: 60rpx;

		.data-yearBox {
			margin-top: 20rpx;
			padding-left: 32rpx;
			padding-right: 32rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.data-monthTotal {
			font-size: 28rpx;
			font-family: PingFang SC-Bold, PingFang SC;
			font-weight: bold;
			color: #000;
		}

		.data-year {
			display: flex;
			flex-direction: row;
			align-items: center;

			.data-date {
				font-size: 13px;
				font-weight: 400;
				color: #000000;
				opacity: 1;
				margin-right: 15rpx;
			}

			.data-bottomIcon {
				width: 28rpx;
				height: 28rpx;
			}
		}

		.data-item {
			width: 710rpx;
			height: 150rpx;
			background: #FFFFFF;
			border-radius: 20rpx 20rpx 20rpx 20rpx;
			opacity: 1;
			margin: 0 auto;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			margin-top: 20rpx;
			padding-left: 32rpx;
			padding-right: 32rpx;
			box-sizing: border-box;

			.data-left {
				display: flex;
				flex-direction: row;
				align-items: center;
				height: 100rpx;

				.data-icon {
					width: 80rpx;
					height: 80rpx;
					margin-right: 24rpx;
					border-radius: 80rpx;
				}

				.data-iconImg {
					width: 80rpx;
					height: 80rpx;
					border-radius: 80rpx;
				}

				.item-content {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
				}

				.item-name {
					font-size: 30rpx;
					font-family: PingFang SC-Bold, PingFang SC;
					color: #000000;
				}

				.item-mobile {
					font-size: 22rpx;
					font-family: PingFang SC-Regular, PingFang SC;
					font-weight: 400;
					color: #A6ABBA;
				}
			}

			.data-right {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: flex-end;
				height: 100rpx;

				.data-btnBox {
					display: flex;
					flex-direction: row;
					align-items: center;
				}

				.data-money {
					font-size: 24rpx;
					font-family: PingFang SC-Regular, PingFang SC;
					font-weight: 400;
					color: #FA5D34;
				}

				.data-btn1 {
					width: 120rpx;
					height: 50rpx;
					border-radius: 36rpx 36rpx 36rpx 36rpx;
					opacity: 1;
					border: 1rpx solid #14A862;
					font-size: 20rpx;
					font-family: PingFang SC-Regular, PingFang SC;
					font-weight: 400;
					color: #12A85D;
					line-height: 50rpx;
					text-align: center;
					margin-left: 20rpx;
				}

				.data-btn {
					width: 120rpx;
					height: 50rpx;
					border-radius: 36rpx 36rpx 36rpx 36rpx;
					opacity: 1;
					border: 1rpx solid #1189F4;
					font-size: 20rpx;
					font-family: PingFang SC-Regular, PingFang SC;
					font-weight: 400;
					color: #1189F4;
					line-height: 50rpx;
					text-align: center;
				}
			}
		}
	}

	.popBox {
		min-height: 248rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding-bottom: 30rpx;
		padding-top: 30rpx;
		box-sizing: border-box;
		opacity: 1;
		overflow: hidden;
		background: #FBFBFB !important;

		.popBox-top {
			padding-left: 35rpx;
			padding-right: 35rpx;
			box-sizing: border-box;
			margin: 0 auto;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}

		.popBox-title {
			font-size: 28rpx;
			font-family: PingFang SC-Regular, PingFang SC;
			font-weight: 400;
			color: #1189F4;
		}

		.pop-close {
			width: 32rpx;
			height: 32rpx;
		}

		.pop-content {
			font-size: 28rpx;
			font-family: PingFang SC-Regular, PingFang SC;
			font-weight: 400;
			color: #000000;
			margin-top: 15rpx;
			margin-left: 35rpx;
			margin-right: 35rpx;
			white-space: pre-wrap
		}
	}
</style>
