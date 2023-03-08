<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<mescroll-uni @getData="getData" ref="mescroll" :size="10">
			<block slot="list">
				<block v-if="exchangelist.length">
					<view class="exchange-list single-column">
						<view class="exchange-item" v-for="(item, index) in exchangelist" :key="index">
							<view class="exchange-content">
								<view class="exchange-head">
									<view class="card-name">{{item.card_name}}</view>
									<view class="card-id">NO.{{item.entity_bianhao}}</view>
								</view>
								<view class="exchange-text">
									<view class="card-code">兑换码：{{item.carmichael_text}}</view>
									<view class="card-num" v-if="item.balance>0 && item.point>0">礼品卡权益：￥{{item.balance}} + {{item.point}}柚币</view>
									<view class="card-num" v-else-if="item.balance>0 && item.point==0">礼品卡权益：￥{{item.balance}}</view>
									<view class="card-num" v-else-if="item.balance==0 && item.point>0">礼品卡权益：{{item.point}} 柚币</view>
									<view class="card-time">兑换时间：{{$util.timeStampTurnTime(item.use_time) }}</view>
								</view>
							</view>
						</view>
					</view>
				</block>
				<ns-empty v-else :isIndex="false" text="还没有兑换记录"></ns-empty>
			</block>
		</mescroll-uni>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				exchangelist: []
			};
		},
		methods: {
			getData(mescroll) {
				this.$api.sendRequest({
					url: '/giftcard/api/giftcard/exchangerecord',
					data: {
						page_size: mescroll.size,
						page: mescroll.num
					},
					success: res => {
						let newArr = [];
						if (res.code == 0 && res.data) {
							newArr = res.data.list
						} else {}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.exchangelist = []; //如果是第一页需手动制空列表
						this.exchangelist = this.exchangelist.concat(newArr); //追加新数据
						this.exchangelist.forEach(i => {
							i.start_time = this.$util.timeStampTurnTime(i.start_time).slice(0, 10);
							i.end_time = this.$util.timeStampTurnTime(i.end_time).slice(0, 10);
						});
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (mescroll.endErr) mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
		}
	}
</script>
</script>

<style lang="scss" scoped>
	.exchange-list {
		padding: 30rpx;

		.exchange-item {
			background-color: #fff;
			border-radius: 20rpx;
			padding: 20rpx;
			margin: 25rpx 5rpx;

			.exchange-content {
				padding: 20rpx 50rpx;

				.exchange-head {
					display: flex;
					justify-content: space-between;

					.card-name {
						font-size: 34rpx;
						color: #3a3a3a;
					}

					.card-id {
						font-size: 34rpx;
						color: #3a3a3a;
					}
				}

				.exchange-text {
					margin-top: 15rpx;

					.card-code {
						color: #a0a0a0;
					}

					.card-num {
						color: #a0a0a0;
					}

					.card-time {
						color: #a0a0a0;
					}

				}
			}
		}
	}
</style>
