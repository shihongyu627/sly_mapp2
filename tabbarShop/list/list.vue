<template>
	<view class="card" :data-theme="themeStyle">
		<mescroll-uni ref="mescroll" @getData="getGoodsList">
			<block slot="list">
				<view class="card-list">
					<view class="card-item margin-bottom" v-for="(item, index) in goodsList" :key="index">
						<view class="card-top">
							<image class="card-img" :src="goodsImg(item.goods_image)" mode="scaleToFill"
								@error="imgError(index)" @click="toDetail(item)"></image>
							<view class="card-right">
								<view class="card-content" @click="toDetail(item)">
									<view class="card-content-left">
										<view class="card-title">
											{{item.goods_name}}
										</view>
										<view class="card-num">
											已售{{item.sale_num}}件
										</view>
									</view>
								</view>
								<view class="card-footer">
									<view class="card-vipBox" @click="toDetail(item)">
										<view class="card-price">
											<text style="font-size: 12px;">￥</text> {{item.price}}
										</view>
										<img v-if="item.is_consume_discount==1" class='vip_icon'
											src="@/common/img/vip_icon.png" alt="" mode="aspectFill" />
									</view>
									<view class="buy-box" v-if="item.num!=0">
										<img class='buy-icon' @click="toNum(item,'minus')" src="@/common/img/minus.png"
											alt="" mode="aspectFill" />
										<view class="buy-num">
											{{item.num}}
										</view>
										<img class='buy-icon' @click="toNum(item,'add')" src="@/common/img/add.png"
											alt="" mode="aspectFill" />
									</view>
									<view class="card-btn" v-if="item.num==0" @click="toBuy(item)">
										立即购买
									</view>
								</view>

							</view>
						</view>
					</view>
				</view>
				<view v-if="goodsList.length == 0 && emptyShow">
					<ns-empty text="暂无卡"></ns-empty>
				</view>
				<view class="footer-br" v-if="selectGoodsList.length>0">

				</view>
			</block>
		</mescroll-uni>
		<view class="footer-box" v-if="selectGoodsList.length>0">
			<view class="footer-text">
				共{{selectGoodsList.length}}件丨合计：<text class="footer-money">￥{{total}}</text>
			</view>
			<view class="footer-btn" @click="settlement">
				结算
			</view>
		</view>
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
		width: 220rpx;
		height: 220rpx;
		opacity: 1;
		border-radius: 10px;
	}

	.card-right {
		display: flex;
		flex-direction: column;
		width: 420rpx;
		justify-content: flex-start;
		height: 220rpx;
	}

	.card-content {
		display: flex;
		flex-direction: row;
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
		width: 420rpx;
		line-height: initial;
	}

	.card-num {
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #65666E;
		opacity: 1;
		margin-top: 10px;
	}

	.card-price {
		font-size: 40rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FA5D34;
		opacity: 1;
		margin-right: 5px;
	}

	.card-vipBox {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.vip_icon {
		width: 28px;
		height: 14px;
	}

	.card-txt {
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #65666E;
		opacity: 1;
	}

	.card-footer {
		width: 100%;
		height: 110rpx;
		background: #FFFFFF;
		opacity: 1;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		justify-content: space-between;
	}

	.card-btn {
		width: 150rpx;
		height: 50rpx;
		background: #1189F4;
		border: 1px solid #1189F4;
		opacity: 1;
		border-radius: 50rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 50rpx;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
	}

	.buy-box {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.buy-icon {
		width: 36rpx;
		height: 36rpx;
	}

	.buy-num {
		font-size: 32rpx;
		font-family: PingFang SC-Regular, PingFang SC;
		font-weight: 400;
		color: #000000;
		min-width: 50rpx;
		text-align: center;
	}

	.footer-br {
		height: 20rpx;
	}

	.footer-box {
		width: 750rpx;
		height: 136rpx;
		background: #FFFFFF;
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		opacity: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding-left: 40rpx;
		padding-right: 40rpx;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 9999;
	}

	.footer-text {
		font-size: 28rpx;
		font-family: PingFang SC-Regular, PingFang SC;
		font-weight: 400;
		color: #454652;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.footer-money {
		font-size: 44rpx;
		font-family: PingFang SC-Bold, PingFang SC;
		font-weight: bold;
		color: #FA5D34;
	}

	.footer-btn {
		width: 260rpx;
		height: 88rpx;
		background: #1189F4;
		border-radius: 44rpx 44rpx 44rpx 44rpx;
		opacity: 1;
		font-size: 32rpx;
		font-family: PingFang SC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 88rpx;
		text-align: center;
	}
</style>
