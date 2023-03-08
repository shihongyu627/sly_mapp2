<template>
	<view class="wrap-box" v-if="showFenxiao != 0 && levelInfo.words_account && levelInfo.commission_money > 0 && levelInfo.is_commission_money == 1">
		<view class="wrap">
			<view class="title color-base-text">{{ levelInfo.words_account }}详情</view>
			<view class="commission-ratio">
				<view class="item">
					<view>一级{{ levelInfo.words_account }}</view>
					<view class="price-color">
						<text class="unit">￥</text>
						<text class="money" >{{ parseFloat(levelInfo.commission_money).toFixed(2).split(".")[0] }}</text>
					    <text class="unit">.{{ parseFloat(levelInfo.commission_money).toFixed(2).split(".")[1] }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'ns-fenxiao-good-detail',
	props: {
		skuId: {
			type: [Number, String],
			default: 0
		}
	},
	data() {
		return {
			isIphoneX: false,
			showFenxiao: 0, //判断是否开启分销
			levelInfo: {
				words_account: '',
				commission_money: '',
				is_commission_money: ''
			}
		};
	},
	created() {
		if (!uni.getStorageSync('token')) return;
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		this.showFenxiao = this.$store.state.addonIsExist.fenxiao;
	},
	mounted() {
		this.$nextTick(function() {
			if (this.showFenxiao != 0) {
				this.getFenxiaoGoodsDetail();
			}
		});
	},
	methods: {
		//请求佣金详情
		getFenxiaoGoodsDetail() {
			this.$api.sendRequest({
				url: '/fenxiao/api/goods/detail',
				data: {
					sku_id: this.skuId
				},
				success: res => {
					if (res.code == 0 && res.data) {
						this.levelInfo = res.data;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.wrap {
	background-color: #fff;
	padding: $padding 0;
	box-sizing: border-box;

	.title {
		font-weight: 600;
		font-size: $font-size-base;
	}

	.commission-ratio {
		margin-top: 10rpx;
		border-radius: $border-radius;

		.item {
			display: flex;
			border-bottom: 2rpx solid $color-line;
			height: 80rpx;
			align-items: center;

			&:last-child {
				border-bottom: none;
			}

			view {
				flex: 1;

				&:first-child {
					font-size: $font-size-base;
				}

				&:last-child {
					text-align: right;
					font-weight: bold;
					.unit {
						font-size: $font-size-tag;
						margin-right: 4rpx;
					}
					.money {
						font-size: $font-size-base;
					}
				}
			}
		}
	}
}
.price-color{
	color: var(--price-color);
}
</style>
