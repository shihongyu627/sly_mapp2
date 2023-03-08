<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<mescroll-uni @getData="getData" ref="mescroll" :size="10">
			<block slot="list">
				<view class="cf-container color-line-border">
					<view class="tab">
						<view @click="changeState(1)"><text :class="type == 1 ? 'color-base-text active color-base-border-bottom' : ''">我赠送的</text></view>
						<view @click="changeState(2)"><text :class="type == 2 ? 'color-base-text active color-base-border-bottom' : ''">我收到的</text></view>
					</view>
				</view>

				<view v-if="cardlist.length > 0">
					<view class="card-item" v-for="(item, index) in cardlist" :key="index">
						<view class="" style="display: flex; justify-content: space-between;">
							<view class="card-name">{{ item.card_name }}</view>
							<view class="">No.{{ item.number }}</view>
						</view>

						<view class="" style="display: flex;">
							<view class="pre-people">赠与人：{{ item.has_member_name }}</view>
							<view class="have-people">受赠人：{{ item.receive_member_name }}</view>
						</view>
						<view class="card-time">{{ $util.timeStampTurnTime(item.create_time) }}</view>
					</view>
				</view>
				<view class="card-no-data" v-else>
					<view class="card-image"><image :src="$util.img('public/uniapp/giftcard/detail/no_giving.png')" mode=""></image></view>
					<view class="">暂无数据</view>
				</view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			type: 1,
			cardlist: []
		};
	},
	methods: {
		//切换状态
		changeState(type) {
			this.list = [];
			this.type = type;
			this.$refs.mescroll.refresh();
		},
		getData(mescroll) {
			this.$api.sendRequest({
				url: '/giftcard/api/giftcard/transferrecord',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					type: this.type
				},
				success: res => {
					let newArr = [];
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
					}
					if (mescroll.endSuccess) mescroll.endSuccess(newArr.length);

					//设置列表数据
					if (mescroll.num == 1) this.cardlist = []; //如果是第一页需手动制空列表
					this.cardlist = this.cardlist.concat(newArr); //追加新数据
					setTimeout(() => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}, 300);
				},
				fail: res => {
					if (mescroll.endErr) mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		}
	}
};
</script>

<style lang="scss">
.active {
	border-bottom: 4rpx solid;
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
		width: 50%;
		height: 86rpx;

		text {
			display: inline-block;
			line-height: 86rpx;
			height: 80rpx;
			font-size: 30rpx;
		}
	}
}

.card-item {
	background: #fff;
	margin: 30rpx 40rpx;
	padding: 32rpx 30rpx;

	.card-name {
		font-weight: 600;
		font-size: 32rpx !important;
		margin-bottom: 8rpx;
	}

	.card-time {
		width: 125px;
		font-size: 12px;
		font-family: PingFang SC;
		color: #909399;
		line-height: 18px;
		margin-top: 14rpx;
	}

	.pre-people {
		margin-right: 100rpx;
	}
}
.card-no-data {
	width: 100%;
	text-align: center;
	.card-image {
		margin-top: 200rpx;
		display: flex;
		image {
			margin: auto auto;
		}
	}
}
</style>
