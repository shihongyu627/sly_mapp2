<template>
	<view class="stock-box">

		<mescroll-uni ref="mescroll" @getData="getGoodsList">
			<block slot="list">
				<view class="stock-headerBox">
					<view class="stock-itembox">
						<view class="stock-item">
							<view class="stock-total">
								{{stockInfo.total_in_count}}
							</view>
							<view class="stock-title">
								累计进货
							</view>
						</view>
						<view class="stock-item">
							<view class="stock-total">
								{{stockInfo.total_in_money}}
							</view>
							<view class="stock-title">
								累计进货金额
							</view>
						</view>
					</view>
					<view class="stock-itembox">
						<view class="stock-item">
							<view class="stock-total">
								{{stockInfo.total_sale_count}}
							</view>
							<view class="stock-title">
								累计售出
							</view>
						</view>
						<view class="stock-item">
							<view class="stock-total">
								{{stockInfo.total_sale_money}}
							</view>
							<view class="stock-title">
								累计售出金额
							</view>
						</view>
					</view>
					<view class="stock-itembox">
						<view class="stock-item">
							<view class="stock-total">
								{{stockInfo.total_stock}}
							</view>
							<view class="stock-title">
								剩余总库存
							</view>
						</view>
						<view class="stock-item">
							<view class="stock-total">
								{{stockInfo.total_stock_money}}
							</view>
							<view class="stock-title">
								剩余总库存金额
							</view>
						</view>
					</view>
				</view>
				<view class="store-top">
					<!-- 	<view class="store-right">
						<view class="store-address">
							全部
						</view>
						<img class='store-bottomImg' src="../../../common/img/store_bottom.png" alt=""
							mode="aspectFill" />
					</view> -->
					<view class="store-left">
						<text class="iconfont iconsousuo2"></text>
						<input class="uni-input" confirm-type="search" @confirm="searchConfirm"
							placeholder="请输入搜索关键词" />
					</view>
				</view>
				<view class="stock-list">
					<view class="list-item margin-bottom" v-for="(item, index) in goodsList" :key="index">
						<view class="iconfont"
							:class="item.checked ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'"
							@click="selectGoods(item)"></view>
						<view class="list-right" @click="toStockRecord(item)">
							<image class="stock-img" :src="$util.loadimg(item.goods_image)" mode="aspectFill">
							</image>
							<view class="list-content">
								<view class="list-top">
									<view class="list-name">
										{{item.goods_name}}
									</view>
								</view>
								<view class="list-price">
									<text style="font-size: 12px;">￥</text>{{item.price}}
								</view>
								<view class="list-bottom">
									<view class="list-stock">
										云仓库存<text style="color:#1189F4">{{item.stock_cloud||0}}</text>
									</view>
									<view class="list-stock" v-if="is_store==1">
										实际库存<text style="color:#1189F4">{{item.stock_local||0}}</text>
									</view>
								</view>
							</view>
						</view>

					</view>
				</view>
				<view v-if="goodsList.length == 0 && emptyShow">
					<ns-empty text="暂无商品"></ns-empty>
				</view>
				<view class="list-br">

				</view>
			</block>
		</mescroll-uni>
		<view class="stock-footer" v-if="is_store==1">
			<view class="stock-btn1" @click="goOrder('out')">
				提货
			</view>
			<view class="stock-btn2" @click="goOrder('in')">
				进货
			</view>
		</view>
		<view class="stock-footer" v-if="is_dealer==1&&is_store==0">
			<view class="">
				
			</view>
			<view class="stock-btn2" @click="goOrder('in')">
				进货
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
		mixins: [list, globalConfig],
		methods: {

		}
	};
</script>

<style scoped>
	.color-base-text {
		color: #1189F4 !important;
	}

	.stock-headerBox {
		width: 710rpx;
		height: 211px;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		margin-top: 10px;
		margin-bottom: 10px;
		padding-top: 20px;
	}

	.stock-itembox {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		margin-bottom: 20px;
	}

	.stock-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 150px;
	}

	.stock-total {
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
	}

	.stock-title {
		font-size: 12px;
		font-weight: 400;
		color: #000000;
		opacity: 0.5;
	}

	.store-top {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 710rpx;
		margin: 0 auto;
	}

	.store-left {
		width: 710rpx;
		height: 40px;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 22px;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 40rpx;
		box-sizing: border-box;
	}

	.store-left-l {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-right: 6px;
		box-sizing: border-box;
		border-right: 1px solid #DFDFDF;
	}

	.store-bottomImg {
		width: 20px;
		height: 20px;
	}

	.store-address {
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: normal;
		color: #000000;
		opacity: 1;
		width: 30px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.store-right {
		width: 84px;
		height: 40px;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 22px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.store-left-r {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 20rpx;
		box-sizing: border-box;
	}

	.iconsousuo2 {
		color: #A9AAB0;
		margin-right: 10px;
	}

	.uni-input {
		width: 140px;
	}

	.store_mapImg {
		width: 17px;
		height: 17px;
	}

	.store-map-title {
		font-size: 10px;
		font-family: PingFang SC;
		font-weight: normal;
		color: #000000;
		opacity: 1;
	}

	.stock-list {
		margin-top: 10px;
	}

	.list-br {
		height: 60px;
	}

	.list-item {
		width: 710rpx;
		height: 127px;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin: 0 auto;
		padding-left: 30rpx;
		padding-right: 20rpx;
		box-sizing: border-box;
	}

	.list-left {
		width: 22px;
		height: 22px;
		border: 1px solid #CCCCCC;
		border-radius: 50%;
		opacity: 1;
	}

	.stock-img {
		width: 100px;
		height: 100px;
		opacity: 1;
		border-radius: 4px;
	}

	.list-right {
		width: 290px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.list-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.list-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 170px;
	}

	.list-name {
		width: 240rpx;
		font-size: 16px;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		line-height: initial;
	}

	.list-price {
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FA5D34;
		opacity: 1;
	}

	.list-content {
		height: 100px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 170px;
	}

	.list-stock {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #999999;
		opacity: 1;
	}

	.stock-footer {
		position: fixed;
		width: 100%;
		height: 68px;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 0px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		bottom: 0;
		left: 0;
		padding-left: 20rpx;
		padding-right: 20rpx;
		box-sizing: border-box;
		z-index: 999;
	}

	.stock-btn1 {
		width: 170px;
		height: 48px;
		border: 1px solid #1189F4;
		opacity: 1;
		border-radius: 24px;
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: bold;
		line-height: 48px;
		color: #1189F4;
		opacity: 1;
		text-align: center;
	}

	.stock-btn2 {
		width: 170px;
		height: 48px;
		background: #1189F4;
		opacity: 1;
		border-radius: 24px;
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: bold;
		line-height: 48px;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
	}
</style>
