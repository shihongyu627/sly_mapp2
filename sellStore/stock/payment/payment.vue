<template>
	<view class="order-container" :class="{ 'safe-area': isIphoneX }" :data-theme="themeStyle">
		<!-- 店铺 -->
		<view class="site-wrap">
			<view class="site-body">
				<!-- 商品 -->
				<view class="goods-wrap" v-for="(goodsItem, goodsIndex) in orderPaymentData.order_goods_list"
					:key="goodsIndex">
					<view class="goods-img">
						<image :src="$util.loadimg(goodsItem.goods_image)" mode="aspectFill"></image>
					</view>
					<view class="goods-info">
						<view class="goods-name">{{ goodsItem.goods_name }}</view>
						<view class="goods-sub-section">
							<view class="color-base-text price-color">
								<text class="unit">￥</text>
								<text class="goods-price">{{ goodsItem.price }}</text>
							</view>
							<view class="num-color">
								<text class="font-size-tag">x</text>
								<text class="font-size-base">{{ goodsItem.num }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 订单金额 -->
		<view class="order-money">
			<!-- 	<view class="order-cell">
				<text class="tit">订单号</text>
				<view class="box color-title">
					<text class="money">2111 5090 9001 7710 6987 </text>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">下单时间</text>
				<view class="box color-base-text">
					<text class="money">2020-03-14 12:00</text>
				</view>
			</view> -->
			<view class="order-cell">
				<text class="tit">类型</text>
				<view class="box color-base-text">
					<text class="money">{{orderPaymentData.order_type_name}}</text>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">订单备注</text>
				<view class="box"><input type="text" placeholder="请输入" placeholder-class="color-tip"
						v-model="orderCreateData.buyer_message" /></view>
			</view>
			<!-- <view class="order-cell" v-if="orderPaymentData.balance_money > 0">
				<text class="tit">使用余额</text>
				<view class="box color-base-text">
					<text class="operator">-</text>
					<text class="unit">{{ $lang('common.currencySymbol') }}</text>
					<text class="money">{{ orderPaymentData.balance_money | moneyFormat }}</text>
				</view>
			</view> -->
		</view>
		<view class="order-money" v-if="order_type=='in'">
			<view class="order-wayBox">
				<img class='way-icon' src="../../common/img/pay.png" alt="" mode="aspectFill" />
				<view class="way-right">
					<view class="way-top">
						<view class="way-title">
							线下付款
						</view>
						<view class="way-text">
							上传打款凭证
						</view>
					</view>
					<view class="way-item">
						<view class="way-left">
							收款银行：{{parent_dealer_info.bank_name||''}}
						</view>
						<view class="way-copy" @click="$util.copy(parent_dealer_info.bank_name)">
							复制
						</view>
					</view>
					<view class="way-item">
						<view class="way-left">
							银行支行：{{parent_dealer_info.bank_address||''}}
						</view>
						<view class="way-copy" @click="$util.copy(parent_dealer_info.bank_address)">
							复制
						</view>
					</view>
					<view class="way-item">
						<view class="way-left">
							收款单位名称：{{parent_dealer_info.dealer_name||''}}
						</view>
						<view class="way-copy" @click="$util.copy(parent_dealer_info.dealer_name)">
							复制
						</view>
					</view>
					<view class="way-item">
						<view class="way-left">
							收款账号：{{parent_dealer_info.bank_account||''}}
						</view>
						<view class="way-copy" @click="$util.copy(parent_dealer_info.bank_account)">
							复制
						</view>
					</view>
				</view>

			</view>
			<view class="order-wayBox">
				<img class='way-icon' src="../../common/img/alipay.png" alt="" mode="aspectFill" />
				<view class="way-right">
					<view class="way-top">
						<view class="way-title">
							请转账支付宝账号并截图保存
						</view>
					</view>
					<view class="way-item">
						<view class="way-left">
							支付宝账号：{{parent_dealer_info.alipay_account||''}}
						</view>
						<view class="way-copy" @click="$util.copy(parent_dealer_info.alipay_account)">
							复制
						</view>
					</view>
					<view class="way-item">
						<view class="way-left">
							姓名：{{parent_dealer_info.alipay_name||''}}
						</view>
					</view>
				</view>
			</view>
			<view class="order-wayBox">
				<img class='way-icon' src="../../common/img/scan.png" alt="" mode="aspectFill" />
				<view class="way-right">
					<view class="way-top">
						<view class="way-title">
							请扫码付款并截图保存
						</view>
					</view>
					<view class="way-code">
						<view class="code-item">
							<view class="code-title">
								支付宝二维码
							</view>
							<image @click="previewQrcode($util.loadimg(parent_dealer_info.alipay_qrcode))"
								v-if="parent_dealer_info.alipay_qrcode" class="code-img"
								:src="$util.loadimg(parent_dealer_info.alipay_qrcode)" mode="aspectFill"></image>
						</view>
						<view class="code-item code-items">
							<view class="code-title">
								微信二维码
							</view>
							<image @click="previewQrcode($util.loadimg(parent_dealer_info.wechat_qrcode))"
								v-if="parent_dealer_info.wechat_qrcode" class="code-img"
								:src="$util.loadimg(parent_dealer_info.wechat_qrcode)" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="order-wayBox">
				<img class='way-icon' src="../../common/img/qrcode.png" alt="" mode="aspectFill" />
				<view class="way-right">
					<view class="way-top">
						<view class="way-title">
							请上传打款或付款凭证
						</view>
					</view>
					<view class="other-info">
						<view class="other-info-box" v-for="(i, t) in imgList" :key="t">
							<image class="other-info-image" :src="$util.img(i)" mode="aspectFill"
								@click="preview(i, index)"></image>
							<view class="imgDel" @click="deleteImg(i, index)"><text
									class=" icon iconfont icondelete"></text></view>
						</view>
						<view class="other-info-box active" @click="addImg()">
							<text class="icon iconfont iconzhaoxiangji"></text>
							<text>{{ imgList.length ? 3 - imgList.length : 0 }}/3</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="order-submit" :class="{ 'bottom-safe-area': isIphoneX }">
			<view class="order-settlement-info">
				<text class="font-size-base color-tip margin-right">共{{ orderPaymentData.goods_num }}件</text>
				<text class="font-size-base">合计：</text>
				<text class="color-base-text unit price-color">￥</text>
				<text class="color-base-text money price-color">{{ orderPaymentData.pay_money | moneyFormat }}</text>
			</view>
			<view class="submit-btn" @click="orderCreate">确认下单</view>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import payment from '../public/js/payment.js';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import globalConfig from '@/common/js/golbalConfig.js';
	import nsSwitch from '@/components/ns-switch/ns-switch.vue';
	import nsPayment from '@/components/payment/payment.vue';

	export default {
		components: {
			uniPopup,
			nsSwitch,
			nsPayment
		},
		mixins: [payment, globalConfig],
		data() {
			return {}
		},
		onShow() {},
		methods: {}
	};
</script>

<style lang="scss">
	@import './../../../common/css/order_parment.scss';
</style>
<style scoped lang="scss" scoped>
	.price-color {
		color: #FA5D34 !important
	}

	.num-color {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400 !important;
		color: #999999;
		opacity: 1;
	}

	.order-submit {
		height: 59px;
	}

	.order-container {
		padding-bottom: 90px;
		height: auto;
	}

	.money {
		font-size: 12px !important;
		font-family: PingFang SC;
		font-weight: 500;
		color: #000000;
		opacity: 1;
	}

	.tit {
		font-size: 12px !important;
	}

	.goods-wrap:last-of-type {
		border-bottom: 0 !important;
		padding-bottom: 0 !important;
	}

	.site-wrap {
		padding-bottom: 10px;
		padding-top: 0;
	}

	.order-wayBox {
		margin-top: 10px;
		margin-bottom: 10px;
		display: flex;
		flex-direction: row;
	}

	.way-top {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.way-icon {
		width: 22px;
		height: 22px;
		background: #FA5D34;
		opacity: 1;
		border-radius: 11px;
		margin-right: 10px;
	}

	.way-title {
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		margin-right: 10px;
	}

	.way-text {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 500;
		color: #65666E;
		opacity: 1;
	}

	.way-left {
		font-size: 12px;
		font-weight: 500;
		color: #000000;
		opacity: 1;
		width: 230px;
	}

	.way-copy {
		font-size: 12px;
		font-weight: 500;
		color: #1189F4;
		opacity: 1;
	}

	.way-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 280px;
	}

	.way-code {
		display: flex;
		flex-direction: row;
		align-items: center;

	}

	.code-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.code-items {
		margin-left: 90px;
	}

	.code-title {
		font-size: 14px;
		font-weight: 500;
		color: #65666E;
		opacity: 1;
	}

	.code-img {
		width: 88px;
		height: 88px;
		opacity: 1;
		border-radius: 0px;
		background: #999;
		margin-top: 5px;
	}

	.other-info {
		width: 100%;
		padding: 0 $padding;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		margin-top: $margin-updown;
	}

	.other-info-box {
		width: 145rpx;
		height: 145rpx;
		margin-right: $margin-both;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-right: 30rpx;
		margin-bottom: 30rpx;
		position: relative;


		.iconfont {
			font-size: 60rpx;
			color: #898989;
			line-height: 1;
		}

		text {
			line-height: 1;
		}

		.imgDel {
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			right: -20rpx;
			top: -20rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.iconfont {
				font-size: $font-size-toolbar;
			}
		}
	}

	.other-info-image {
		width: 100%;
		border-radius: $border-radius;
	}

	.other-info-box.active {
		border: 1rpx dashed #898989;
	}

	.other-info-box.active:active {
		background: rgba($color: #cccccc, $alpha: 0.6);
	}

	.other-info-box:nth-child(4n) {
		margin-right: 0;
	}

	.submit-btn {
		width: 260rpx;
		height: 88rpx;
		background: #1189F4;
		opacity: 1;
		border-radius: 44rpx;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 88rpx;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
	}
</style>
