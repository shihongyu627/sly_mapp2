<template>
	<view class="order-container" :class="{ 'safe-area': isIphoneX }" :data-theme="themeStyle">
		<mescroll-uni ref="mescroll" @getData="getListData" top="10rpx">
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
							已打款
						</view>
						<view class="item-num">
							￥{{money_ed}}
						</view>
					</view>
					<view class="landing-item">
						<view class="item-title">
							未打款
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
						<view class="data-header">
							<view class="data-yearBox">
								<picker mode="date" fields="year" :value="date" @change="bindMonthChange">
									<view class="data-year">
										<view class="data-date">{{date}}</view>
										<img class='data-bottomIcon' src="../../../common/img/store_bottom.png" alt=""
											mode="aspectFill" />
									</view>
								</picker>
							</view>
							<view class="data-info" @click="toLandIngInfo">
								收款账户
							</view>
						</view>

						<block v-if="dataList.length>0">
							<view class="data-item" v-for="(item, index) in dataList" :key="index">
								<view class="data-top" @click="toOrder(item)">
									<view class="data-title">
										{{item.date}}
									</view>
									<view class="data-state" :style="{color:item.is_pay==1?'#A6ABBA':'#F34E51'}">
										{{item.is_pay==1?'已结算':'未结算'}}
									</view>
								</view>
								<view class="data-bottom">
									<view class="data-money" @click="toOrder(item)">
										{{item.money}}
									</view>
									<view class="data-btn" @click="toPhoto(item)">
										{{item.is_invoice==1?'查看发票':'上传发票'}}
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
					{{content}}
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	import dayjs from 'dayjs'
	export default {
		components: {},
		mixins: [globalConfig],
		data() {
			return {
				isIphoneX: false,
				isSub: false,
				dataList: [],
				date: dayjs().format('YYYY'),
				money_ed: '',
				money_ing: '',
				total_money: '',
				money_month: '',
				content: '落地费规则：\n区域管理费奖励：\n独家区域内每月产生的训练仪提货订单产生的奖励费用，每台奖励为100元。训练仪发货只发往门店注册所在地址，每月系统会依据区域内门店的提货订单统计结算区域管理费。\n提现规则：\n1.填写完善结算打款账号信息。（对公账户，私人账户需申请代开发票）\n2.每月1号会自动生成上月的管理费奖励总额和明细。可在每月1号-10号前上传提现金额的发票，（发票信息需与结算账户一致）提交结算申请。\n3.可多月合并申请结算，多月合并结算时需备注结算月份。\n4.如发票信息和收款账户信息不一致不予结算。\n结算时间：\n总部会在11号统一进行打款结算，如遇节假日，结算时间顺延。'
			};
		},
		onLoad(data) {

		},
		onShow() {
			this.$refs.mescroll.refresh();
		},
		methods: {
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/dealer/api/luodi/recordPage',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
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
			//账户信息
			toLandIngInfo() {
				this.$util.redirectTo('/sellStore/landing/info/info');
			},
			toOrder(item) {
				this.$util.redirectTo('/sellStore/landing/order/order', {
					date: item.date
				});
			},
			tipAsk() {
				// this.$refs.storePopup.open('center')
				this.$util.redirectTo('/sellStore/recommend/rule/rule', {
					title: '落地费规则',
					type: 2
				});
			},
			maskClick() {
				console.log(123);
				this.$refs.storePopup.close()
			},
			bindMonthChange(e) {
				this.date = e.detail.value
			},
			toPhoto(data) {
				let imgArr = []
				imgArr = data.invoice_gallery && data.invoice_gallery.split(',') || []
				if (imgArr.length > 0) {
					uni.previewImage({
						urls: imgArr,
						current: imgArr[0]
					});
					return
				}
				this.$util.redirectTo('/sellStore/landing/upload/upload', {
					type: 'luodi',
					id: data.id
				});
			}
		}
	};
</script>

<style lang="scss">
</style>
<style scoped lang="scss" scoped>
	.landing-headerbox {
		width: 710rpx;
		height: 176rpx;
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
			height: 136rpx;

			.item-title {
				font-size: 28rpx;
				font-family: PingFang SC-Light, PingFang SC;
				font-weight: 300;
				color: #A6ABBA;
			}

			.item-num {
				font-size: 32rpx;
				font-family: PingFang SC-Heavy, PingFang SC;
				font-weight: 800;
				color: #000000;
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

		.data-header {
			margin-top: 20rpx;
			padding-left: 32rpx;
			padding-right: 32rpx;
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}

		.data-info {
			width: 140rpx;
			height: 50rpx;
			background: #1189F4;
			opacity: 1;
			border-radius: 44rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 400;
			line-height: 50rpx;
			color: #FFFFFF;
			opacity: 1;
			text-align: center;
		}

		.data-yearBox {
			width: 100px;
		}

		.data-year {
			display: flex;
			flex-direction: row;
			align-items: center;

			.data-date {
				font-size: 26rpx;
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
			flex-direction: column;
			justify-content: center;
			margin-top: 20rpx;
			padding-left: 32rpx;
			padding-right: 32rpx;
			box-sizing: border-box;

			.data-top {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;

				.data-title {
					font-size: 28rpx;
					font-family: PingFang SC-Bold, PingFang SC;
					font-weight: bold;
					color: #000000;
					width: 480rpx;
				}

				.data-state {
					font-size: 28rpx;
					font-family: PingFang SC-Regular, PingFang SC;
					font-weight: 400;
					color: #A6ABBA;
				}
			}

			.data-bottom {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				margin-top: 10rpx;

				.data-money {
					font-size: 28rpx;
					font-family: PingFang SC-Bold, PingFang SC;
					font-weight: bold;
					color: #D65A59;
					width: 480rpx;
				}

				.data-btn {
					width: 144rpx;
					height: 56rpx;
					border-radius: 36rpx 36rpx 36rpx 36rpx;
					opacity: 1;
					border: 1rpx solid #1189F4;
					font-size: 24rpx;
					font-family: PingFang SC-Regular, PingFang SC;
					font-weight: 400;
					color: #1189F4;
					line-height: 56rpx;
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
