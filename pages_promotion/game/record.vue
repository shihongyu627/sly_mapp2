<template>
	<page-meta :page-style="themeColor"></page-meta>
	<mescroll-uni ref="mescroll" @getData="getListData">
		<block slot="list">
			<block v-if="list.length > 0">
				<view class="record-item" v-for="(item, index) in list" :key="index">
					<view class="image-wrap">
						<image :src="$util.img('public/uniapp/game/point.png')" mode="widthFix" v-if="item.award_type == 1"></image>
						<image :src="$util.img('public/uniapp/game/balance.png')" mode="widthFix" v-if="item.award_type == 2"></image>
						<image :src="$util.img('public/uniapp/game/coupon.png')" mode="widthFix" v-if="item.award_type == 3"></image>
					</view>
					<view class="content">
						<view class="name">{{ item.award_name }}</view>
						<view class="cont font-size-goods-tag" v-if="item.award_type == 1">奖励详情：{{ item.point }}个柚币</view>
						<view class="cont font-size-goods-tag" v-if="item.award_type == 2">奖励详情：{{ item.balance }}元红包</view>
						<view class="cont font-size-goods-tag" v-if="item.award_type == 3">奖励详情：优惠券“{{ item.relate_name }}”</view>
						<view class="time font-size-goods-tag">中奖时间：{{ $util.timeStampTurnTime(item.create_time) }}</view>
					</view>
					<view class="btn color-base-bg" v-if="item.award_type == 1" @click="$util.redirectTo('/pages_tool/member/point')">查看</view>
					<view class="btn color-base-bg" v-if="item.award_type == 2" @click="$util.redirectTo('/pages_tool/member/balance_detail')">查看</view>
					<view class="btn color-base-bg" v-if="item.award_type == 3" @click="$util.redirectTo('/pages_tool/member/coupon')">查看</view>
				</view>
			</block>
			<block v-else><ns-empty text="暂无中奖记录" :isIndex="false"></ns-empty></block>

			<loading-cover ref="loadingCover"></loading-cover>
		</block>
	</mescroll-uni>
</template>

<script>
export default {
	data() {
		return {
			list: [],
			id: 0
		};
	},
	onLoad(option) {
		if (option.id) this.id = option.id;
	},
	onShow() {
		
		this.list = [];
		if (this.$refs.mescroll) this.$refs.mescroll.refresh();
	},
	methods: {
		getListData(mescroll) {
			this.$api.sendRequest({
				url: '/api/game/recordPage',
				data: {
					id: this.id,
					page: mescroll.num,
					page_size: mescroll.size
				},
				success: res => {
					let newArr = [];

					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
					mescroll.endSuccess(newArr.length);

					if (mescroll.num == 1) this.list = []; //如果是第一页需手动制空列表
					this.list = this.list.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		}
	}
};
</script>

<style lang="scss">
.mescroll-uni-content {
	overflow: hidden;
}

.record-item {
	display: flex;
	padding: 30rpx;
	margin: 20rpx 30rpx 0;
	background-color: #fff;
	border-radius: 10rpx;
	align-items: center;

	.image-wrap {
		width: 80rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		border-radius: 10rpx;

		image {
			width: 80rpx;
		}
	}

	.content {
		flex: 1;
		padding: 0 20rpx;

		.name {
			line-height: 1;
			color: $color-title;
			margin-bottom: 30rpx;
		}

		.time,
		.cont {
			color: $color-tip;
			line-height: 1;
			margin-top: 20rpx;
		}
	}

	.btn {
		width: 128rpx;
		color: #fff;
		padding: 6rpx 0;
		text-align: center;
		border-radius: $border-radius;
		font-size: $font-size-tag;
	}
}
</style>
