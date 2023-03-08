<template>
	<view class="card" :data-theme="themeStyle">
		<mescroll-uni ref="mescroll" @getData="getGoodsList">
			<block slot="list">
				<view class="card-list">
					<view class="card-item margin-bottom" v-for="(item, index) in goodsList" :key="index"
						@click="toDetail(item)">
						<view class="card-top">
							<image class="card-img" :src="goodsImg(item.card_cover)" mode="aspectFill"
								@error="imgError(index)"></image>
							<view class="card-right">
								<view class="card-content">
									<view class="card-title">
										{{item.card_name}}
									</view>
									<view class="">
										<view class="card-price">
											<text style="font-size: 12px;">￥</text> {{item.card_price}}
										</view>
										<view class="card-num">
											{{item.number}}次
										</view>
									</view>
								</view>

							</view>
						</view>
						<view class="card-footer">
							<view class="card-txt">
								{{item.validity_type_name}}
							</view>
							<view class="card-btn">
								立即开通
							</view>
						</view>
					</view>
				</view>
				<view v-if="goodsList.length == 0 && emptyShow">
					<ns-empty text="暂无卡"></ns-empty>
				</view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import list from '../public/js/list.js';
	import globalConfig from '@/common/js/golbalConfig.js';

	export default {
		components: {},
		data() {
			return {};
		},
		mixins: [list, globalConfig]
	};
</script>

<style lang="scss">

</style>
<style scoped>
	.card-item {
		width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		overflow: hidden;
		margin: 0 auto;
		margin-top: 10px;
		padding: 12px;
		box-sizing: border-box;
	}

	.card-top {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.card-img {
		width: 260rpx;
		height: 166rpx;
		opacity: 1;
		border-radius: 10px;
	}

	.card-right {
		width: 350rpx;
		height: 166rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.card-content {
		height: 166rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.card-content-left {}

	.card-title {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		width: 320rpx;
		line-height: initial;
	}

	.card-num {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #65666E;
		opacity: 1;
	}

	.card-price {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FA5D34;
		opacity: 1;
	}

	.card-txt {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #65666E;
		opacity: 1;
	}

	.card-footer {
		width: 100%;
		margin-top: 10rpx;
		background: #FFFFFF;
		opacity: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.card-btn {
		width: 74px;
		height: 28px;
		background: #1189F4;
		border: 1px solid #1189F4;
		opacity: 1;
		border-radius: 14px;
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 28px;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
	}
</style>
