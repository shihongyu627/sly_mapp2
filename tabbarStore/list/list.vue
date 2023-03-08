<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="content">
		<view class="head-wrap">
			<!-- 搜索区域 -->
			<view class="search-wrap uni-flex uni-row">
				<view class="flex-item input-wrap">
					<input class="uni-input" maxlength="50" v-model="keyword" @confirm="search()"
						placeholder="请输入您要搜索的门店" />
					<text class="iconfont iconsousuo3" @click.stop="search()"></text>
				</view>
			</view>
		</view>
	</view>
	<mescroll-uni top="90" ref="mescroll" @getData="getGoodsList">
		<block slot="list">
			<view class="store-list">
				<view class="list-item" v-for="(item, index) in dataList" :key="index">
					<view class="list-top">
						<image class="store-img" :src="loadimg(item.store_image)" mode="aspectFill"
							@click="goInfo(item)"></image>
						<view class="item-right">
							<view class="item-one" @click="goInfo(item)">
								<view class="item-storeName">
									{{item.store_name}}
								</view>
								<view class="item-km" v-if="item.distance">
									{{(item.distance).toFixed(2)}}km
								</view>
							</view>
							<view class="item-two">
								<view class="item-time" @click="goInfo(item)">
									营业时间：{{ item.open_date }}
								</view>
								<img class='store-tel' src="@/common/img/store_tel.png" alt="" mode="aspectFill"
									@click="makePhone(item)" />
							</view>
						</view>
					</view>
					<view class="item-footer">
						<view class="address-box" @click="goInfo(item)">
							<img class='address-icon' src="@/common/img/address_icon.png" alt="" mode="aspectFill" />
							<view class="address-text">
								{{ removeComma(item.address)}}
							</view>
						</view>
						<view class="address-go" @click="goHerf(item)">
							去这里
						</view>
					</view>
				</view>
			</view>

			<view v-if="dataList.length == 0 && emptyShow">
				<ns-empty text="暂无门店"></ns-empty>
			</view>
		</block>
	</mescroll-uni>
	<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import list from '../public/js/list.js';
	export default {
		components: {},
		data() {
			return {};
		},
		mixins: [list]
	};
</script>

<style lang="scss">
</style>
<style scoped lang="scss">
	.content {
		background: #fff;
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		padding-bottom: 10px;
	}

	.head-wrap {
		width: 100%;
	}

	.search-wrap {
		flex: 0.5;
		padding: 30rpx 30rpx 0;
		font-size: $font-size-tag;
		display: flex;
		align-items: center;
		width: 100%;
		box-sizing: border-box;

		.iconfont {
			margin-left: 16rpx;
			font-size: 36rpx;
		}

		.input-wrap {
			flex: 1;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: $color-bg;
			height: 70rpx;
			padding-left: 10rpx;
			border-radius: 70rpx;
			width: 100%;

			input {
				width: 90%;
				background: $color-bg;
				font-size: $font-size-tag;
				height: 50rpx;
				padding: 10rpx 25rpx 10rpx 40rpx;
				line-height: 50rpx;
				border-radius: 40rpx;
			}

			text {
				font-size: $font-size-toolbar;
				color: $color-tip;
				width: 80rpx;
				text-align: center;
				margin-right: 20rpx;
			}
		}

		.category-wrap,
		.list-style {
			display: flex;
			justify-content: center;
			align-items: center;

			.iconfont {
				font-size: 50rpx;
				color: $color-tip;
			}

			text {
				display: block;
				margin-top: 60rpx;
			}
		}
	}

	.store-list {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		margin-top: 30px;
		padding-bottom: 120rpx;
	}

	.list-item {
		width: 100%;
		padding-left: 24rpx;
		padding-right: 24rpx;
		box-sizing: border-box;
		// width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		padding-top: 10px;
		padding-bottom: 10px;
		margin-bottom: 10px;
	}

	.list-top {
		margin-bottom: 10px;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
		width: 100%;
	}

	.store-img {
		width: 66px;
		height: 66px;
		opacity: 1;
		border-radius: 10px;
		overflow: hidden;
		background: #ccc;
	}

	.item-right {
		width: 250px;
		padding-left: 20rpx;
		box-sizing: border-box;
	}

	.item-one {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.item-storeName {
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		width: 170px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.item-km {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #000000;
		opacity: 1;
	}

	.item-two {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.item-time {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: normal;
		color: #A9AAB0;
		opacity: 1;
	}

	.store-tel {
		width: 36rpx;
		height: 36rpx;
	}

	.item-footer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.address-box {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.address-icon {
		width: 14px;
		height: 14px;
		margin-right: 5px;
	}

	.address-text {
		width: 204px;
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: normal;
		color: #000000;
		opacity: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.address-go {
		width: 68px;
		height: 30px;
		background: #1189F4;
		opacity: 1;
		border-radius: 15px;
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 30px;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
	}
</style>
