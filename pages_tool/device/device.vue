<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view :class="isIphoneX ? 'iphone-x' : ''">
		<mescroll-uni ref="mescroll" top="10" @getData="getData" v-if="token">
		<block slot="list">
			<!-- 设备列表 -->
			<block v-if="dataList.length > 0">
				<view class="detailed-wrap">
					<view class="balances" v-for="(item, index) in dataList" :key="index">
						<!-- <image :src="$util.img('public/uniapp/member/balance_detail/income.png')" class="balances-img" v-if="item.account_data > 0"></image>
						<image v-else :src="$util.img('public/uniapp/member/balance_detail/pay.png')" mode="widthFix"></image> -->
						<view class="balances-info" @click="toFromDetail(item)">
							<text class="title">{{ item.type_name }}</text>
							<text>{{ item.remark }}</text>
							<text>{{ $util.timeStampTurnTime(item.create_time) }}</text>
						</view>
						<view class="balances-num">
							<text :class="item.account_data > 0 ? 'color-base-text' : ''">{{ item.account_data > 0 ? '+' + item.account_data : item.account_data }}</text>
						</view>
					</view>
				</view>
			</block>
			<block v-else><ns-empty :emptyBtn ="{url: '/pages/index/index',text: '去逛逛'}" :isIndex="false" text="暂无设备"></ns-empty></block>
			<!-- 无设备列表 -->
		</block>
		</mescroll-uni>
		<ns-login ref="ns-login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
export default {
	data() {
		return {
			dataList: [],
			token: null,
		};
	},
	onLoad(data) {
		if (data.related_id) this.related_id = data.related_id ? data.related_id : 0;
		this.isIphoneX = this.$util.uniappIsIPhoneX();
	},
	onShow() {
		if (uni.getStorageSync('token')) {
			this.token = uni.getStorageSync('token');
			if (this.$refs.mescroll) this.$refs.mescroll.refresh();
		} else {
			setTimeout(() => {
				this.$refs.login.open('/pages_tool/device/device');
			});
		}
	},
	methods: {
		getData(mescroll) {
			this.$api.sendRequest({
				url: '/api/memberaccount/page',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					account_type: 'balance,balance_money',
				},
				success: res => {
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({ title: msg });
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) {
						this.dataList = []; //如果是第一页需手动制空列表
						this.related_id = 0;
					}
					this.dataList = this.dataList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		}
	},
	watch: {
		
	},
	computed: {
	
	}
};
</script>

<style lang="scss" scoped>
.cart-empty {
	margin-top: 208rpx !important;
}

.active {
	border-bottom: 4rpx solid;
}

.coupon-head {
	display: flex;
	background: #fff;
	padding: 20rpx 50rpx;

	.sort {
		border: 2rpx solid #c5c5c5;
		padding: 1rpx 20rpx;
		border-radius: 10rpx;
		cursor: pointer;
		margin-right: 15rpx;
	}
}
.cf-container {
	background: #fff;
	overflow: hidden;
}

.tab {
	display: flex;
	justify-content: space-between;
	height: 86rpx;

	> view {
		text-align: center;
		width: 33%;
		height: 86rpx;

		text {
			display: inline-block;
			line-height: 86rpx;
			height: 80rpx;
			font-size: 30rpx;
		}
	}
}

.coupon-listone {
	margin: 0 30rpx;

	.item {
		display: flex;
		background-color: #fff2f0;
		background-size: 100% 100%;
		border-radius: 20rpx;
		align-items: stretch;
		margin-top: $padding;
		overflow: hidden;
		&.item-disabled{
			.item-base{
				background: #e7e7e7 !important;
			}
		}

		.item-base {
			position: relative;
			width: 197rpx;
			min-width: 197rpx;
			text-align: center;
			background: linear-gradient(to left, var(--bg-color), var(--bg-color-shallow));
			background-repeat: no-repeat;
			background-size: 100% 100%;
			padding: 38rpx 10rpx 38rpx 18rpx;
			&.disabled{
				background: #dedede;
			}
			.coupon-line{
				position: absolute;
				right: 0;
				top: 0;
				height: 100%;
			}
			> view {
				width: calc(100%);
				height: auto;
				position: relative;
				top: 50%;
				transform: translate(0, -50%);
			}

			.use_price {
				font-size: 60rpx;
				line-height: 1;
				color: #fff;

				text {
					font-size: $font-size-toolbar;
				}

				&.disabled {
					color: $color-tip;
				}
			}

			.use_condition {
				color: #fff;
				margin-top: $padding;

				&.margin_top_none {
					margin-top: 0;
				}

				&.disabled {
					color: $color-tip;
				}
			}

			&::after {
				position: absolute;
				content: '';
				background-color: #f8f8f8;
				left: 0;
				top: 50%;
				transform: translate(0, -50%);
				height: 30rpx;
				width: 15rpx;
				border-radius: 0 30rpx 30rpx 0;
			}
		}

		.item-btn {
			position: relative;
			width: 160rpx;
			min-width: 160rpx;
			align-self: center;

			view {
				width: 100rpx;
				height: 50rpx;
				border-radius: $border-radius;
				line-height: 50rpx;
				margin: auto;
				text-align: center;
				background-image: linear-gradient(to right, var(--bg-color), var(--bg-color-shallow));
				color: var(--btn-text-color);;
				font-size: $font-size-tag;

				&.disabled {
					background: $color-line !important;
					color: $color-tip !important;
				}
			}

			&::after {
				position: absolute;
				content: '';
				background-color: #f8f8f8;
				right: 0;
				top: 50%;
				transform: translate(0, -50%);
				height: 30rpx;
				width: 15rpx;
				border-radius: 30rpx 0 0 30rpx;
			}
		}

		.item-info {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: $padding;
			overflow: hidden;
			background-repeat-x: no-repeat;
			background-repeat-y: repeat;

			.use_time {
				padding: $padding 0;
				border-top: 2rpx dashed #cccccc;
				font-size: $font-size-activity-tag;
				color: #909399;
			}

			.use_title {
				font-size: $font-size-base;
				font-weight: 500;
				padding: $padding 0;

				.title {
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.max_price {
					font-weight: 400;
					font-size: $font-size-tag;
				}
			}
		}
	}
}
</style>
