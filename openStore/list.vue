<template>
	<view class="openStore-wrapp">
		<mescroll-uni ref="mescroll" @getData="getListData">
			<block slot="list">
				<block v-if="goodsList.length > 0">
					<view class="goods-box">
						<view class="goods-item" v-for="(item, index) in goodsList" :key="index"
							@click="goDetail(item)">
							<image class="goods-image" :src="$util.loadimg(item.cover_img)" mode="widthFix"></image>
							<view class="goods-title">
								{{item.upstore_abstract}}
							</view>
							<view class="goods-name">
								{{item.upstore_title}}
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<view>
						<ns-empty :isIndex="!1" text="暂无案例"></ns-empty>
					</view>
				</block>
			</block>
		</mescroll-uni>

	</view>
</template>
<script>
	export default {
		components: {},
		data() {
			return {
				goodsList: []
			};
		},
		mixins: [],
		onLoad() {},
		methods: {
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/api/upstore/page',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.goodsList = []; //如果是第一页需手动制空列表
						this.goodsList = this.goodsList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			goDetail(data) {
				this.$util.redirectTo('/openStore/info', {
					id: data.upstore_id,
					title: data.upstore_title
				});
			}
		}
	};
</script>

<style scoped>
	.openStore-wrapp {
		padding-bottom: 60px;
	}

	.goods-box {
		width: 710rpx;
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap;
		margin-top: 20rpx;
	}

	.goods-item {
		width: 340rpx;
		/* height: 205px; */
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		overflow: hidden;
		margin-bottom: 20rpx;
		padding-bottom: 20rpx;
	}

	.goods-image {
		width: 340rpx;
		/* height: 140px; */
	}

	.goods-title {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #A6ABBA;
		opacity: 1;
		padding-left: 8px;
		padding-right: 8px;
		box-sizing: border-box;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.goods-name {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		padding-left: 8px;
		padding-right: 8px;
		box-sizing: border-box;
		line-height: initial;
	}
</style>
