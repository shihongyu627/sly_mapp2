<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<view class="money-wrap">
			<text>-{{ detail.apply_money }}</text>
		</view>

		<!-- 状态0待审核1.待转账2已转账 -1拒绝' -->
		<view class="item">
			<view class="line-wrap">
				<text class="label">当前状态</text>
				<text class="value">{{ detail.status_name }}</text>
			</view>
			<view class="line-wrap">
				<text class="label">交易号</text>
				<text class="value">{{ detail.withdraw_no }}</text>
			</view>
			<view class="line-wrap">
				<text class="label">手续费</text>
				<text class="value">￥{{ detail.service_money }}</text>
			</view>
			<view class="line-wrap">
				<text class="label">申请时间</text>
				<text class="value">{{ $util.timeStampTurnTime(detail.apply_time) }}</text>
			</view>
			<view class="line-wrap" v-if="detail.status">
				<text class="label">审核时间</text>
				<text class="value">{{ $util.timeStampTurnTime(detail.audit_time) }}</text>
			</view>
			<view class="line-wrap" v-if="detail.bank_name">
				<text class="label">银行名称</text>
				<text class="value">{{ detail.bank_name }}</text>
			</view>
			<view class="line-wrap">
				<text class="label">收款账号</text>
				<text class="value">{{ detail.account_number }}</text>
			</view>
			<view class="line-wrap" v-if="detail.status == -1 && detail.refuse_reason">
				<text class="label">拒绝理由</text>
				<text class="value">{{ detail.refuse_reason }}</text>
			</view>
			<view class="line-wrap" v-if="detail.status == 2">
				<text class="label">转账方式名称</text>
				<text class="value">{{ detail.transfer_type_name }}</text>
			</view>
			<view class="line-wrap" v-if="detail.status == 2">
				<text class="label">转账时间</text>
				<text class="value">{{ $util.timeStampTurnTime(detail.payment_time) }}</text>
			</view>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id: 0,
			detail: {}
		};
	},
	onLoad(option) {
		this.id = option.id || 0;
	},
	onShow() {
		
		if (uni.getStorageSync('token')) {
			this.getDetail();
		} else {
			this.$util.redirectTo(
				'/pages_tool/login/login',
				{
					back: '/pages_tool/member/point'
				},
				'redirectTo'
			);
		}
	},
	methods: {
		getDetail() {
			this.$api.sendRequest({
				url: '/api/memberwithdraw/detail',
				data: {
					id: this.id
				},
				success: res => {
					if (res.data) {
						this.detail = res.data;
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		}
	}
};
</script>

<style lang="scss">
.money-wrap {
	text-align: center;
	font-size: 50rpx;
	font-weight: bold;
	margin: 40rpx;
	border-bottom: 2rpx solid $color-line;
	padding: 40rpx;
}

.item {
	margin: 40rpx;

	.line-wrap {
		margin-bottom: 20rpx;

		.label {
			display: inline-block;
			width: 200rpx;
			color: $color-tip;
			font-size: $font-size-base;
		}

		.value {
			display: inline-block;
			font-size: $font-size-base;
		}
	}
}
</style>
