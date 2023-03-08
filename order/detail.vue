<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="detail-container" :class="{ 'safe-area': isIphoneX }">
		<!-- 订单状态 -->
		<view class="status-wrap color-base-bg"
			:style="{ backgroundImage: 'url(' + $util.img('public/uniapp/order/status-wrap-bg.png') + ')' }">
			<view class="order-status-left">
				<image v-if="action.icon" :src="$util.img(action.icon)"></image>
				<view class="status-name">
					<view class="name">
						{{ orderData.order_status_name }}
						<text v-if="orderData.promotion_status_name">（{{ orderData.promotion_status_name }}）</text>
					</view>
					<view class="desc" v-if="orderData.promotion_type == 'presale' && orderData.order_status == 1">
						预计{{ $util.timeStampTurnTime(orderData.predict_delivery_time, true) }}日后发货
					</view>
					<view class="desc" v-if="orderData.close_cause">订单关闭原因：{{ orderData.close_cause }}</view>
				</view>
			</view>
		<!-- 	<view class="order-time" v-if="orderData.order_status == 0" id="action-date">
				剩余时间：
				<uni-count-down :day="orderData.closeTimeMachine.d" :hour="orderData.closeTimeMachine.h"
					:minute="orderData.closeTimeMachine.i" :second="orderData.closeTimeMachine.s" color="#fff"
					splitorColor="#fff" />
			</view> -->
		</view>

		<!-- 地址信息 -->
		<view class="address-wrap" v-if="orderData.order_type == 1 || orderData.order_type == 3">
			<view class="icon">
				<view class="iconfont iconlocation"></view>
			</view>
			<view class="address-info">
				<view class="info">
					<text class="font-size-base">{{ orderData.name }}&nbsp;{{ orderData.mobile }}</text>
				</view>
				<view class="detail">
					<text class="font-size-base">收货地址：{{ $util.removeComma(orderData.full_address) }} {{ orderData.address }}</text>
				</view>
			</view>
			<template v-if="orderData.order_type == 3">
				<view v-if="orderData.buyer_ask_delivery_time && orderData.buyer_ask_delivery_time != 0"
					class="pick-block first-pick-block">
					<view class="font-size-base">送达时间：</view>
					<view class="last-child">
						{{ orderData.buyer_ask_delivery_time.indexOf('-') != -1 ? orderData.buyer_ask_delivery_time : $util.timeStampTurnTime(orderData.buyer_ask_delivery_time) }}
					</view>
				</view>
				<view v-else class="pick-block first-pick-block">
					<view>送达时间：</view>
					<view class="last-child">立即送达</view>
				</view>
				<block v-if="orderData.package_list">
					<view class="pick-block">
						<view>配送员：</view>
						<view class="last-child">{{ orderData.package_list.deliverer }}</view>
					</view>
					<view class="pick-block">
						<view>外卖电话：</view>
						<view class="last-child">{{ orderData.package_list.deliverer_mobile }}</view>
					</view>
				</block>
			</template>
		</view>

		<template v-if="orderData.order_type == 2">
			<!-- 门店信息 -->
			<view class="store-wrap">
				<view>
					<view class="store-info" v-if="orderData.delivery_store_info">
						<view class="icon">
							<view class="iconfont iconmendian"></view>
						</view>
						<view class="store-info-detail">
							<view class="store-name" @click="diyRedirectToStore(orderData)">
								<text class="name font-size-base">{{ orderData.delivery_store_name }}</text>
								<text class="iconfont iconright font-size-base"></text>
							</view>
							<view class="detail store-detail"  @click="diyRedirectToStore(orderData)">
								<view class="color-tip" v-if="orderData.delivery_store_info.open_date">
									营业时间：{{ orderData.delivery_store_info.open_date }}</view>
								<view class="color-tip">地址：{{ $util.removeComma(orderData.delivery_store_info.full_address) }}</view>
							</view>
						</view>
					</view>
					<view v-else>
						<view class="address-empty">
							<view class="color-base-text">当前无自提门店</view>
						</view>
					</view>
				</view>
				<!-- 	<view class="pick-block first-pick-block">
					<view class="font-size-base">预留手机</view>
					<input class="last-child" type="number" disabled :value="orderData.mobile" />
				</view>
				<view class="pick-block first-pick-block" v-if="">
					<view class="font-size-base">提货时间</view>
					<input class="last-child" disabled :value="$util.timeStampTurnTime(orderData.buyer_ask_delivery_time)" />
				</view> -->
			</view>

			<view class="pickup-info" v-if="orderData.pay_status">
				<view class="pickup-code-info">
					<view class="info">
						<text class="font-size-base">
							<text class="color-tip font-size-base">提货码：</text>
							{{ orderData.delivery_code }}
						</text>
						<text class="copy" @click="$util.copy(orderData.delivery_code)">复制</text>
					</view>
					<view class="code" @click="previewMedia($util.img(orderData.pickup))">
						<!-- <image :src="$util.img(orderData.pickup_barcode)" class="barcode" mode="widthFix"></image> -->
						<image :src="$util.img(orderData.pickup)" class="qrcode" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</template>

		<template v-if="orderData.order_type == 4">
			<view class="virtual-mobile-wrap" v-if="!orderData.virtual_goods">
				<view class="font-size-base">预留手机</view>
				<view class="color-tip font-size-tag">{{ orderData.mobile }}</view>
			</view>
		</template>

		<!-- 店铺 -->
		<view class="site-wrap" :style="orderData.virtual_goods ? 'margin-top: -69rpx;' : ''">
			<view class="site-body">
				<view v-for="(goodsItem, goodsIndex) in orderData.order_goods" :key="goodsIndex" class="goods-item">
					<view class="goods-wrap">
						<view class="goods-img" @click="goDetail(goodsItem)">
							<image :src="$util.img(goodsItem.sku_image, { size: 'mid' })"
								@error="imageError(goodsIndex)" mode="aspectFill"></image>
						</view>
						<view class="goods-info" @click="goDetail(goodsItem)">
							<view class="goods-name">{{ goodsItem.sku_name }}</view>
							<view class="sku" v-if="goodsItem.sku_spec_format">
								<view class="goods-spec">
									<block v-for="(x, i) in goodsItem.sku_spec_format" :key="i">
										{{ x.spec_value_name }}
										{{ i < goodsItem.sku_spec_format.length - 1 ? '; ' : '' }}
									</block>
								</view>
							</view>
							<view class="goods-sub-section">
								<view>
									<text class="goods-price ">
										<text class="unit price-style small">{{ $lang('common.currencySymbol') }}</text>
										<text class="price-style large">
											{{
												parseFloat(goodsItem.price)
													.toFixed(2)
													.split('.')[0]
											}}
										</text>
										<text class="unit price-style small">
											.{{
												parseFloat(goodsItem.price)
													.toFixed(2)
													.split('.')[1]
											}}
										</text>
									</text>
								</view>
								<view>
									<text class="font-size-base">
										<text class="iconfont iconclose"></text>
										{{ goodsItem.num }}
									</text>
								</view>
							</view>
						</view>
					</view>

					<view class="goods-form" v-if="goodsItem.form">
						<view class="order-cell" v-for="(item, index) in goodsItem.form" :key="index">
							<text class="tit">{{ item.value.title }}：</text>
							<view class="box img-box" v-if="item.controller == 'Img'">
								<view class="img" v-for="(img, imgIndex) in item.img_lists" :key="imgIndex">
									<image :src="$util.img(img)" mode="widthFix" @click="previewMedia($util.img(img))">
									</image>
								</view>
							</view>
							<view class="box" v-else>
								<text class="color-title">{{ item.val }}</text>
							</view>
						</view>
					</view>

					<view class="goods-action" v-if="orderData.delivery_type != 'store'">
						<block v-if="orderData.is_enable_refund">
							<view @click="goRefund(goodsItem.order_goods_id)"
								v-if="goodsItem.refund_status == 0 || goodsItem.refund_status == -1">
								<view class="order-box-btn" v-if="orderData.promotion_type != 'blindbox'">
									{{ orderData.order_status == 10 ? '申请售后' : '申请退款' }}</view>
							</view>
						</block>
						<view @click="goRefundDetail(goodsItem.order_goods_id)"
							v-if="goodsItem.refund_status != 0 && goodsItem.refund_status != -1">
							<view class="order-box-btn">{{ orderData.order_status == 10 ? '查看售后' : '查看退款' }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 订单概况 -->
		<view class="order-summary">
			<view class="order-cell" v-if="orderData.worker_name">
				<text class="tit">服务人员：</text>
				<view class="box">
					<text class="color-title">{{ orderData.worker_name }}</text>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">订单编号：</text>
				<view class="box">
					<text class="color-title">{{ orderData.order_no }}</text>
					<view class="copy" @click="$util.copy(orderData.order_no)">复制</view>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">订单交易号：</text>
				<view class="box">
					<text class="color-title">{{ orderData.out_trade_no }}</text>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">创建时间：</text>
				<view class="box">
					<text class="color-title">{{ $util.timeStampTurnTime(orderData.create_time) }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.close_time > 0">
				<text class="tit">关闭时间：</text>
				<view class="box">
					<text class="color-title">{{ $util.timeStampTurnTime(orderData.close_time) }}</text>
				</view>
			</view>
			<block v-if="orderData.pay_status > 0">
				<view class="hr"></view>
				<view class="order-cell">
					<text class="tit">支付方式：</text>
					<view class="box">
						<text class="color-title">{{ orderData.pay_type_name }}</text>
					</view>
				</view>
				<view class="order-cell">
					<text class="tit">支付时间：</text>
					<view class="box">
						<text class="color-title">{{ $util.timeStampTurnTime(orderData.pay_time) }}</text>
					</view>
				</view>
			</block>
			<view class="order-cell" v-if="orderData.delivery_type_name">
				<text class="tit">配送方式：</text>
				<view class="box">
					<text class="color-title">{{ orderData.delivery_type_name }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.buyer_message != ''">
				<text class="tit">买家留言：</text>
				<view class="box">
					<text class="color-title">{{ orderData.buyer_message }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.promotion_type_name != ''">
				<text class="tit">活动优惠：</text>
				<view class="box">
					<text class="color-title">{{ orderData.promotion_type_name }}</text>
				</view>
			</view>
			<block v-if="orderData.is_invoice > 0">
				<view class="hr"></view>
				<view class="order-cell">
					<text class="tit">发票类型：</text>
					<view class="box">
						<text class="color-title">{{ orderData.invoice_type == 1 ? '纸质发票' : '电子发票' }}</text>
					</view>
				</view>
				<view class="order-cell">
					<text class="tit">发票抬头类型：</text>
					<view class="box">
						<text class="color-title">{{ orderData.invoice_title_type == 1 ? '个人' : '企业' }}</text>
					</view>
				</view>
				<view class="order-cell">
					<text class="tit">发票抬头：</text>
					<view class="box">
						<text class="color-title">{{ orderData.invoice_title }}</text>
					</view>
				</view>

				<view class="order-cell">
					<text class="tit">发票内容：</text>
					<view class="box">
						<text class="color-title">{{ orderData.invoice_content }}</text>
					</view>
				</view>
				<view class="order-cell" v-if="orderData.invoice_type == 1">
					<text class="tit">发票邮寄地址：</text>
					<view class="box">
						<text class="color-title">{{ orderData.invoice_full_address }}</text>
					</view>
				</view>
				<view class="order-cell" v-else>
					<text class="tit">发票接收邮件：</text>
					<view class="box">
						<text class="color-title">{{ orderData.invoice_email }}</text>
					</view>
				</view>
			</block>
			<block v-if="orderData.form">
				<view class="hr"></view>
				<view class="order-cell" v-for="(item, index) in orderData.form" :key="index">
					<text class="tit">{{ item.value.title }}：</text>
					<view class="box img-box" v-if="item.controller == 'Img'">
						<view class="img" v-for="(img, imgIndex) in item.img_lists" :key="imgIndex">
							<image :src="$util.img(img)" mode="widthFix" @click="previewMedia($util.img(img))"></image>
						</view>
					</view>
					<view class="box" v-else>
						<text class="color-title">{{ item.val }}</text>
					</view>
				</view>
			</block>
			<!-- 联系客服 -->
			<ns-contact :niushop="{ order_id: orderData.order_id }">
				<view class="kefu">
					<view>
						<text class="iconfont iconziyuan"></text>
						<text>联系客服</text>
					</view>
				</view>
			</ns-contact>
		</view>

		<block v-if="orderData.virtual_goods && orderData.goods_class == 2 && orderData.virtual_goods.is_veirfy == 0">
			<view class="verify-code-wrap">
				<view class="code">
					<image :src="$util.img(orderData.virtualgoods_barcode)" class="barcode" mode="widthFix"></image>
					<image :src="$util.img(orderData.virtualgoods)" class="qrcode" mode="widthFix"></image>
					<text>请将条形码或二维码出示给核销员</text>
				</view>
				<view class="hr"></view>
				<view class="wrap">
					<text class="font-size-base virtual-code">{{ orderData.virtual_code }}</text>
					<view class="copy" @click="$util.copy(orderData.virtual_code)">复制</view>
				</view>
			</view>

			<view class="verify-info-wrap">
				<view class="head">核销信息</view>
				<view class="order-cell">
					<text class="tit">核销次数</text>
					<view class="box align-right">
						<text class="color-title">
							剩余{{ orderData.virtual_goods.verify_total_count - orderData.virtual_goods.verify_use_num }}次/共{{ orderData.virtual_goods.verify_total_count }}次
						</text>
					</view>
				</view>
				<view class="order-cell">
					<text class="tit">有效期</text>
					<view class="box align-right">
						<text class="color-title"
							v-if="orderData.virtual_goods.expire_time > 0">{{ $util.timeStampTurnTime(orderData.virtual_goods.expire_time) }}</text>
						<text v-else>永久有效</text>
					</view>
				</view>
			</view>

			<view class="verify-info-wrap">
				<view class="head">核销记录</view>
				<view v-if="orderData.virtual_goods.verify_record.length">
					<view v-for="(item, index) in orderData.virtual_goods.verify_record" :key="index"
						class="record-item">
						<view class="order-cell">
							<text class="tit">核销人</text>
							<view class="box align-right">
								<text class="color-title">{{ item.verifier_name }}</text>
							</view>
						</view>
						<view class="order-cell">
							<text class="tit">核销时间</text>
							<view class="box align-right">
								<text class="color-title">{{ $util.timeStampTurnTime(item.verify_time) }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="record-empty" v-else>暂无核销记录</view>
			</view>
		</block>

		<block v-if="orderData.virtual_goods && orderData.goods_class == 3">
			<view class="verify-info-wrap carmichael">
				<view class="head">卡密信息</view>
				<view v-for="(item, index) in orderData.virtual_goods" :key="index" class="record-item">
					<view class="order-cell">
						<text class="tit">卡号：</text>
						<view class="box">
							<text class="color-title">{{ item.card_info.cardno }}</text>
							<view class="copy" @click="$util.copy(item.card_info.cardno)">复制</view>
						</view>
					</view>
					<view class="order-cell">
						<text class="tit">密码：</text>
						<view class="box">
							<text class="color-title">{{ item.card_info.password }}</text>
							<view class="copy" @click="$util.copy(item.card_info.password)">复制</view>
						</view>
					</view>
				</view>
			</view>
		</block>

		<!-- 订单金额 -->
		<view class="order-money">
			<view class="order-cell">
				<text class="tit">商品金额</text>
				<view class="box align-right">
					<text class="color-title price-font">
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						{{ orderData.goods_money }}
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.order_type != 4">
				<text class="tit">运费</text>
				<view class="box align-right">
					<text class="color-base-text price-font">
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.delivery_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.member_card_money > 0">
				<text class="tit">会员卡</text>
				<view class="box align-right">
					<text class="color-base-text price-font">
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.member_card_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.invoice_money > 0">
				<text class="tit">
					税费
					<text class="color-base-text">({{ orderData.invoice_rate }}%)</text>
				</text>
				<view class="box align-right">
					<text class="color-base-text price-font">
						<text class="operator">+</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.invoice_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.invoice_delivery_money > 0">
				<text class="tit">发票邮寄费</text>
				<view class="box align-right">
					<text class="color-base-text price-font">
						<text class="operator">+</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.invoice_delivery_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.adjust_money != 0">
				<text class="tit">订单调整</text>
				<view class="box align-right">
					<text class="color-base-text price-font">
						<text class="operator" v-if="orderData.adjust_money < 0">-</text>
						<text class="operator" v-else>+</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.adjust_money | abs }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.promotion_money > 0">
				<text class="tit">优惠</text>
				<view class="box align-right">
					<text class="color-base-text price-font">
						<text class="operator">-</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.promotion_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.coupon_money > 0">
				<text class="tit">优惠券</text>
				<view class="box align-right">
					<text class="color-base-text price-font">
						<text class="operator">-</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.coupon_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.balance_money > 0">
				<text class="tit">使用余额</text>
				<view class="box align-right">
					<text class="color-base-text price-font">
						<text class="operator">-</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.balance_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.point_money > 0">
				<text class="tit">柚币抵扣</text>
				<view class="box align-right">
					<text class="color-base-text price-font">
						<text class="operator">-</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.point_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell">
				<view class="box align-right">
					<text>实付金额：</text>
					<text class="color-base-text price-font">
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text class="font-size-base">{{ orderData.order_money }}</text>
					</text>
				</view>
			</view>

			<view class="order-action fixed-bottom bottom-safe-area" v-if="orderData.action.length > 0">
				<view class="order-box-btn white"
					v-if="evaluateConfig.evaluate_status == 1 && orderData.is_evaluate == 1"
					@click="operation('memberOrderEvaluation')">
					<text v-if="orderData.evaluate_status == 0">评价</text>
					<text v-else-if="orderData.evaluate_status == 1">追评</text>
				</view>
				<view class="order-box-btn"
					:class="{ 'color-base-border color-base-text': operationItem.action == 'orderPay' }"
					v-for="(operationItem, operationIndex) in orderData.action" :key="operationIndex"
					@click="operation(operationItem.action)">
					{{ operationItem.title }}
				</view>
			</view>

			<view class="order-action fixed-bottom bottom-safe-area"
				v-else-if="orderData.action.length == 0 && orderData.is_evaluate == 1 && evaluateConfig.evaluate_status == 1">
				<view class="order-box-btn white" @click="operation('memberOrderEvaluation')">
					<text v-if="orderData.evaluate_status == 0">评价</text>
					<text v-else-if="orderData.evaluate_status == 1">追评</text>
				</view>
			</view>
		</view>

		<!-- 订单 -->
		<view class="fixed-bottom-box bottom-safe-area"
			v-if="orderData.action.length > 0 || (orderData.is_evaluate == 1 && evaluateConfig.evaluate_status == 1)">
		</view>

		<nsGoodsRecommend ref="goodrecommend" route="orderdetail"></nsGoodsRecommend>
		<!-- 选择支付方式弹窗 -->
		<ns-payment ref="choosePaymentPopup"></ns-payment>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import nsGoodsRecommend from '@/components/ns-goods-recommend/ns-goods-recommend.vue';
	import orderMethod from './public/js/orderMethod.js';
	import nsPayment from '@/components/payment/payment.vue';

	export default {
		data() {
			return {
				isIphoneX: false,
				orderId: 0,
				orderData: {
					action: []
				},
				action: {
					icon: ''
				},
				evaluateConfig: {
					evaluate_audit: 1,
					evaluate_show: 0,
					evaluate_status: 1
				}
			};
		},
		mixins: [orderMethod],
		components: {
			nsGoodsRecommend,
			nsPayment
		},
		onLoad(option) {
			if (option.order_id) this.orderId = option.order_id;
		},
		onShow() {
			this.isIphoneX = this.$util.uniappIsIPhoneX();

			if (uni.getStorageSync('token')) {
				this.getEvaluateConfig();
				this.getOrderData();
			} else {
				this.$util.redirectTo('/pages_tool/login/login', {
					back: '/order/detail?order_id=' + this.orderId
				});
			}
		},
		methods: {
			goDetail(e) {
				this.$util.redirectTo('/pages/goods/detail', {
					goods_id: e.goods_id
				});
			},
			goRefund(id) {
				this.$util.redirectTo('/pages_tool/order/refund', {
					order_goods_id: id
				});
			},
			goRefundDetail(id) {
				this.$util.redirectTo('/pages_tool/order/refund_detail', {
					order_goods_id: id
				});
			},
			getOrderData() {
				this.$api.sendRequest({
					url: '/api/order/detail',
					data: {
						order_id: this.orderId
					},
					success: res => {
						uni.stopPullDownRefresh();
						if (res.code >= 0) {
							if (res.data.order_status == 0) {
								let date = Date.parse(new Date()) / 1000;
								res.data.closeTimeMachine = this.$util.countDown(res.data.create_time + res
									.data.auto_close - date);
							}
							let num = 0;
							this.orderData = res.data;
							let refund_order_goods_ids = [];
							this.orderData.order_goods.forEach(v => {
								if (v.sku_spec_format) {
									v.sku_spec_format = JSON.parse(v.sku_spec_format);
								} else {
									v.sku_spec_format = [];
								}

								if (v.refund_status == 0 || v.refund_status == -1) {
									num += 1;
									refund_order_goods_ids.push(v.order_goods_id);
								}
							});
							this.action = JSON.parse(res.data.order_status_action);

							//判断在可退款商品数量大于1时出现批量删除按钮
							if (num > 1) {
								this.orderData.refund_batch_status = true;
								this.orderData.refund_order_goods_ids = refund_order_goods_ids;
							} else {
								this.orderData.refund_batch_status = false;
							}

							if (this.orderData.delivery_store_info != '') this.orderData.delivery_store_info =
								JSON.parse(this.orderData.delivery_store_info);

							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						} else {
							this.$util.showToast({
								title: '未获取到订单信息！'
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages/order/list');
							}, 1500);
						}
					},
					fail: res => {
						uni.stopPullDownRefresh();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			/**
			 * 下拉刷新
			 */
			onPullDownRefresh() {
				this.getOrderData();
			},
			operation(action) {
				switch (action) {
					case 'orderPay': // 支付
						this.orderPay(this.orderData);
						break;
					case 'orderClose': //关闭
						this.orderClose(this.orderData.order_id, () => {
							this.getOrderData();
						});
						break;
					case 'memberTakeDelivery': //收货
						this.orderDelivery(this.orderData.order_id, () => {
							this.getOrderData();
						});
						break;
					case 'trace': //查看物流
						this.$util.redirectTo('/pages_tool/order/logistics', {
							order_id: this.orderData.order_id
						});
						break;
					case 'memberOrderEvaluation': //评价
						this.$util.redirectTo('/pages_tool/order/evaluate', {
							order_id: this.orderData.order_id
						});
						break;
						//批量退款
					case 'memberBatchRefund':
						this.$util.redirectTo('/pages_tool/order/refund_type_select', {
							order_id: this.orderId
						});
						break;
					case 'memberVirtualTakeDelivery':
						this.orderVirtualDelivery(this.orderData.order_id, () => {
							this.getOrderData();
						});
						break;
				}
			},
			imageError(index) {
				this.orderData.order_goods[index].sku_image = this.$util.getDefaultImage().goods;
				this.$forceUpdate();
			},
			getEvaluateConfig() {
				this.$api.sendRequest({
					url: '/api/goodsevaluate/config',
					success: res => {
						if (res.code == 0) {
							var data = res.data;
							this.evaluateConfig = data;
						}
					}
				});
			},
			// 显示选择支付方式弹框
			openChoosePayment() {
				this.$refs.choosePaymentPopup.open();
			},
			diyRedirectToStore(data) {
				if(!data.delivery_store_id){
					return
				}
				uni.redirectTo({
					url: `/tabbarStore/info/info?storeId=${data.delivery_store_id}&store_name=${data.delivery_store_name}`
				});
			},
			// 预览图片
			previewMedia(pickup) {
				var paths = [];
				paths.push(pickup);

				uni.previewImage({
					urls: paths
				});
			}
		},
		filters: {
			abs(value) {
				return Math.abs(parseFloat(value)).toFixed(2);
			}
		}
	};
</script>

<style lang="scss">
	@import './public/css/detail.scss';
</style>
