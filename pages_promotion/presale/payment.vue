<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="order-container" :class="{ 'safe-area': isIphoneX }">
		<!-- #ifdef MP -->
		<view class="payment-navbar" :style="{
				'padding-top': menuButtonBounding.top + 'px',
				'height': menuButtonBounding.height + 'px'
			}"
		>
			<view class="navbar-title">
				确认订单
			</view>
		</view>
		<view class="payment-navbar-block" :style="{'height': menuButtonBounding.bottom + 'px'}"></view>
		<!-- #endif -->
		
		<scroll-view scroll-y="true" class="order-scroll-container">
			<view class="payment-navbar-block"></view>
			<!-- 选择地址 -->
			<template v-if="orderPaymentData.is_virtual == 0">
				<!-- 配送方式 -->
				<view class="delivery-mode" v-if="orderPaymentData.shop_goods_list.express_type.length > 1">
					<view class="action">
						<view v-for="(deliveryItem, deliveryIndex) in orderPaymentData.shop_goods_list.express_type"
							:key="deliveryIndex"
							:class="{active: deliveryItem.name == orderPaymentData.delivery.delivery_type}"
							@click="selectDeliveryType(deliveryItem)">
							{{ deliveryItem.title }}
							<!-- 外圆角 -->
							<view class="out-radio"></view>
						</view>
					</view>
				</view>
				
				<view class="address-box" :class="{'not-delivery-type': orderPaymentData.shop_goods_list.express_type.length <= 1}" v-if="orderPaymentData.delivery.delivery_type != 'store'">
					<view class="info-wrap" :class="{local: orderPaymentData.delivery.delivery_type == 'local'}" v-if="orderPaymentData.member_address" @click="selectAddress">
						<view class="content">
							<text
								class="name font-size-base">{{ orderPaymentData.member_address.name ? orderPaymentData.member_address.name : '' }}</text>
							<text
								class="font-size-base">{{ orderPaymentData.member_address.mobile ? orderPaymentData.member_address.mobile : '' }}</text>
							<text class="cell-more iconfont iconright"></text>
							<view class="desc-wrap">
								{{ orderPaymentData.member_address.full_address ? orderPaymentData.member_address.full_address : '' }}
								{{ orderPaymentData.member_address.address ? orderPaymentData.member_address.address : '' }}
							</view>
						</view>
					</view>
					<view class="empty-wrap" v-else @click="selectAddress">
						<view class="info">请设置收货地址</view>
						<view class="cell-more">
							<view class="iconfont iconright"></view>
						</view>
					</view>

					<!-- 外卖配送 -->
					<view class="local-box" v-if="orderPaymentData.delivery.delivery_type == 'local'">
						<view class="order-cell">
							<text class="tit">配送时间</text>
							<view class="box">
								<text v-if="timeInfo.showTime">{{ timeInfo.start_time + '-' + timeInfo.end_time }}</text>
								<text v-if="deliveryWeek">
									<template v-if="timeInfo.showTime">
										（
									</template>
									{{ deliveryWeek }}
									<template v-if="timeInfo.showTime">
										）
									</template>
								</text>
								<text v-if="!canLocalDelicery">（休息中）</text>
							</view>
						</view>
						<picker v-if="timeInfo.showTimeBar && orderPaymentData.member_address && canLocalDelicery"
							:value="orderCreateData.buyer_ask_delivery_time" mode="time" @change="bindTimeChange">
							<view class="pick-block">
								<view class="font-size-base">送达时间</view>
								<view class="time-picker">
									<text>{{ orderCreateData.buyer_ask_delivery_time }}</text>
									<text class="iconfont iconright cell-more"></text>
								</view>
							</view>
						</picker>
					</view>
					<image class="address-line" :src="$util.img('public/uniapp/order/address-line.png')" ></image>
				</view>

				<!-- 选择门店 -->
				<view class="store-box" :class="{'not-delivery-type': orderPaymentData.shop_goods_list.express_type.length <= 1}" v-if="orderCreateData.delivery.delivery_type == 'store'">
					<block v-if="storeInfo.currStore">
						<view @click="openSiteDelivery" class="store-info">
							<view class="store-address-info">
								<view class="info-wrap">
									<view class="title">
										<text>{{ storeInfo.currStore.store_name }}</text>
									</view>
									<view class="store-detail">
										<view v-if="storeInfo.currStore.open_date">营业时间：{{ storeInfo.currStore.open_date }}</view>
										<view class="address">{{ storeInfo.currStore.full_address }} {{ storeInfo.currStore.address }}</view>
									</view>
								</view>
								<view class="cell-more iconfont iconright"></view>
							</view>
						</view>
						<view class="mobile-wrap store-mobile">
							<view class="form-group">
								<text class="text">预留手机</text>
								<input type="number" maxlength="11" placeholder="请输入您的手机号码" placeholder-class="color-tip placeholder" class="input" v-model="member_address.mobile"  />
							</view>
						</view>
					</block>
					<view v-else class="empty">当前无自提门店，请选择其它配送方式</view>
					<image class="address-line" :src="$util.img('public/uniapp/order/address-line.png')" ></image>
				</view>
			</template>

			<!-- 虚拟商品展示手机号 -->
			<view class="mobile-wrap" v-if="orderPaymentData.is_virtual == 1 && orderCreateData.member_address">
				<view class="tips color-base-text">
					<text class="iconfont icongantanhao"></text>
					购买虚拟类商品需填写手机号，方便商家与您联系</view>
				<view class="form-group">
					<text class="iconfont icondianhua2"></text>
					<text class="text">手机号码</text>
					<input type="number" maxlength="11" placeholder="请输入您的手机号码" placeholder-class="color-tip placeholder"
						class="input" v-model="orderCreateData.member_address.mobile" />
				</view>
			</view>

			<!-- 店铺 -->
			<view class="site-wrap order-goods">
				<view class="site-body">
					<!-- 商品 -->
					<view class="goods-item" v-for="(goodsItem, goodsIndex) in orderPaymentData.shop_goods_list.goods_list" :key="goodsIndex">
						<view class="goods-wrap">
							<view class="goods-img" @click="navigateTo(goodsItem.goods_id)">
								<image :src="$util.img(goodsItem.sku_image, { size: 'mid' })" @error="imageError(goodsIndex)"
									mode="aspectFill"></image>
							</view>
							<view class="goods-info">
								<view class="top-wrap">
									<view @click="navigateTo(goodsItem.goods_id)" class="goods-name">{{ goodsItem.sku_name }}</view>
									<view class="sku" v-if="goodsItem.sku_spec_format">
										<view class="goods-spec">
											<block v-for="(x, i) in goodsItem.sku_spec_format" :key="i">
												{{ x.spec_value_name }} {{ i < goodsItem.sku_spec_format.length - 1 ? '; ' : '' }}
											</block>
										</view>
									</view>
									<view class="error-tips" v-if="goodsItem.is_virtual == 0 && orderCreateData.delivery && goodsItem.support_trade_type.indexOf(orderCreateData.delivery.delivery_type) == -1">
										<text class="iconfont icongantanhao"></text> 
										<text>该商品不支持{{ orderCreateData.delivery.delivery_type_name }}</text>
									</view>
								</view>
								<view class="goods-sub-section">
									<view class="">
										<text class="unit">{{ $lang('common.currencySymbol') }}</text>
										<text class="goods-price" >{{ parseFloat(goodsItem.price).toFixed(2).split(".")[0] }}</text>
										<text class="unit">.{{ parseFloat(goodsItem.price).toFixed(2).split(".")[1] }}</text>
									</view>
									<view>
										<text class="font-size-tag">x</text>
										<text class="font-size-base">{{ goodsItem.num }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="site-wrap buyer-message">
				<view class="order-cell">
					<text class="tit">买家留言</text>
					<view class="box text-overflow " @click="openPopup('buyerMessagePopup')">
						<text v-if="orderCreateData.buyer_message">{{orderCreateData.buyer_message}}</text>
						<text class="color-sub" v-else>无留言</text>
					</view>
					<text class="iconfont iconright"></text>
				</view>
			</view>
			
			<view class="site-wrap" v-if="orderPaymentData.shop_goods_list.invoice">
				<view class="site-footer">
					<view class="order-cell order-invoice-cell">
						<text class="tit">发票</text>
						<view class="box text-overflow" @click="openPopup('invoicePopup')">
							<text
								v-if="orderCreateData.is_invoice == 1">{{ orderCreateData.invoice_type == 1 ? '纸质' : '电子' }}发票({{ orderCreateData.invoice_content }})</text>
							<text v-else>无需发票</text>
						</view>
						<text class="iconfont iconright"></text>
					</view>
				</view>
			</view>

			<!-- 订单金额 -->
			<view class="order-money">
				<view class="order-cell">
					<text class="tit">商品金额</text>
					<view class="box color-title">
						<text class="unit">{{ $lang('common.currencySymbol') }}</text>
						<text class="money">{{ orderPaymentData.goods_money | moneyFormat }}</text>
					</view>
				</view>
				<view class="order-cell" v-if="presaleDiscount > 0">
					<text class="tit">定金膨胀</text>
					<view class="box color-base-text">
						<text class="operator">-</text>
						<text class="unit">{{ $lang('common.currencySymbol') }}</text>
						<text class="money">{{ presaleDiscount }}</text>
					</view>
				</view>
				<view class="order-cell" v-if="orderPaymentData.is_virtual == 0 && orderPaymentData.delivery_money > 0">
					<text class="tit">运费</text>
					<view class="box color-base-text">
						<text class="operator">+</text>
						<text class="unit">{{ $lang('common.currencySymbol') }}</text>
						<text class="money">{{ orderPaymentData.delivery_money | moneyFormat }}</text>
					</view>
				</view>
				<view class="order-cell" v-if="orderCreateData.is_invoice && orderPaymentData.invoice_money > 0">
					<text class="tit">
						<text>税费</text>
						<text
							class="color-base-text font-bold">({{ orderPaymentData.shop_goods_list.invoice.invoice_rate }}%)</text>
					</text>
					<view class="box color-base-text">
						<text class="operator">+</text>
						<text class="unit">{{ $lang('common.currencySymbol') }}</text>
						<text class="money">{{ orderPaymentData.invoice_money | moneyFormat }}</text>
					</view>
				</view>
				<view class="order-cell" v-if="orderCreateData.is_invoice && orderPaymentData.invoice_delivery_money > 0">
					<text class="tit">发票邮寄费</text>
					<view class="box color-base-text">
						<text class="operator">+</text>
						<text class="unit">{{ $lang('common.currencySymbol') }}</text>
						<text class="money">{{ orderPaymentData.invoice_delivery_money | moneyFormat }}</text>
					</view>
				</view>
				<view class="order-cell" v-if="orderPaymentData.promotion_money > 0">
					<text class="tit">优惠</text>
					<view class="box color-base-text">
						<text class="operator">-</text>
						<text class="unit">{{ $lang('common.currencySymbol') }}</text>
						<text class="money">{{ orderPaymentData.promotion_money | moneyFormat }}</text>
					</view>
				</view>
				<view class="order-cell" v-if="orderPaymentData.coupon_money > 0">
					<text class="tit">优惠券</text>
					<view class="box color-base-text">
						<text class="operator">-</text>
						<text class="unit">{{ $lang('common.currencySymbol') }}</text>
						<text class="money">{{ orderPaymentData.coupon_money | moneyFormat }}</text>
					</view>
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

			<view class="order-money">
				<view class="order-cell"
					v-if="orderPaymentData.is_virtual == 0 && orderPaymentData.presale_info.presale_deposit > 0">
					<text class="tit color-base-text">阶段一：付定金</text>
					<view class="box align-right">
						<text class="ns-text-color-black color-base-text">
							<text class="font-size-tag">{{ $lang('common.currencySymbol') }}</text>
							<text class="font-size-base">{{ orderPaymentData.presale_deposit_money | moneyFormat}}</text>
						</text>
					</view>
				</view>
				<view class="order-cell">
					<text class="tit">阶段二：付尾款</text>
					<view class="box align-right">
						<text>
							<text class="font-size-tag">{{ $lang('common.currencySymbol') }}</text>
							<text class="font-size-base">{{ orderPaymentData.final_money | moneyFormat}}</text>
						</text>
					</view>
				</view>
			</view>

			<template v-if="is_deposit_back == 1">
				<view class="pre-sale-money">
					<view>我已同意定金不退等预售协议 <text class="iconfont iconbangzhu1" @click="presaleAgreement"></text></view>
					<switch class="balance-switch" :checked="switch_state" @change="switchChange" />
				</view>
			</template>
			<view class="error-message" v-if="orderPaymentData.delivery && orderPaymentData.delivery.delivery_type == 'local' && orderPaymentData.shop_goods_list.delivery && orderPaymentData.shop_goods_list.delivery.error && orderPaymentData.shop_goods_list.delivery.error !== ''">{{orderPaymentData.shop_goods_list.delivery.error_msg}}</view>
			<view class="order-submit" :class="{ 'bottom-safe-area': isIphoneX }">
				<view class="order-settlement-info">
					<text class="font-size-base color-tip margin-right">共{{ orderPaymentData.num }}件</text>
					<text class="font-size-base">定金：</text>
					<text class="color-base-text unit">{{ $lang('common.currencySymbol') }}</text>
					<text class="color-base-text money">{{ orderPaymentData.pay_money | moneyFormat }}</text>
				</view>
				 
				<view class="submit-btn">
					<button v-if="createBtn()" type="primary" size="mini" @click="openChoosePayment()">提交订单</button>
					<button v-else class="no-submit"  size="mini">
						<block v-if="orderPaymentData.delivery && orderPaymentData.delivery.delivery_type == 'local' && orderPaymentData.shop_goods_list.delivery && orderPaymentData.shop_goods_list.delivery.error && orderPaymentData.shop_goods_list.delivery.start_money > orderPaymentData.presale_deposit_money">
							差{{ orderPaymentData.shop_goods_list.delivery.start_money-orderPaymentData.presale_deposit_money | moneyFormat }}起送
						</block>
						<block v-else>提交订单</block>
					</button>
				</view>
			</view>
			<div class="order-submit-block"></div>
		</scroll-view>
		
		<!-- 定金退款弹窗 -->
		<uni-popup ref="depositRefund" type="center">
			<view class="depositRefund-wrap">
				<view class="depositRefund-con">
					预售商品定金不支持退款,同意后可继续下单。
				</view>
				<view class="popup-footer">
					<view class="confirm-btn color-tip" @click="closeDepositRefund">我再想想</view>
					<view class="confirm-btn color-base-bg" @click="toPayOrder">同意并下单</view>
				</view>
			</view>
		</uni-popup>

		<!-- 定金不退协议弹窗 -->
		<uni-popup ref="presaleAgreement" type="center">
			<view class="agreement-wrap">
				<view class="agreement-title font-size-toolbar">
					定金不退协议
				</view>
				<view class="agreement-con">
					<template v-if="orderPaymentData.presale_info">
						{{orderPaymentData.presale_info.deposit_agreement}}
					</template>
					<template v-else>
						<text class="color-tip">暂无退定金协议</text>
					</template>
				</view>
				<view class="popup-footer">
					<view class="confirm-btn color-base-bg" @click="closePresaleAgreement">确定</view>
				</view>
			</view>
		</uni-popup>
		
		<!-- 留言弹窗 -->
		<uni-popup ref="buyerMessagePopup" type="bottom">
			<view style="height: auto;" class="buyermessag-popup popup" @touchmove.prevent.stop>
				<view class="popup-header">
					<text class="tit">买家留言</text>
					<text class="iconfont iconclose" @click="closePopup('buyerMessagePopup')"></text>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view>
						<view class="buyermessag-cell">
							<view class="buyermessag-form-group">
								<textarea type="text" maxlength="100" placeholder="留言前建议先与商家协调一致" placeholder-class="color-tip" v-model="orderCreateData.buyer_message" /> </textarea>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer" @click="saveBuyerMessage" :class="{ 'bottom-safe-area': isIphoneX }"><view class="confirm-btn color-base-bg">确定</view></view>
			</view>
		</uni-popup>

		<!-- 发票弹窗 -->
		<uni-popup ref="invoicePopup" type="bottom">
			<view :style="orderCreateData.is_invoice == 1 ? 'height: 83vh;' : 'height: 48vh;'"
				class="invoice-popup popup" @touchmove.prevent.stop>
				<view class="popup-header">
					<text class="tit">发票</text>
					<text class="iconfont iconclose" @click="closeInvoicePopup()"></text>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view>
						<view class="invoice-cell" v-if="orderPaymentData.shop_goods_list.invoice">
							<text class="tit">需要发票</text>
							<view class="option-grpup">
								<view class="option-item"
									:class="{ 'color-base-bg active': orderCreateData.is_invoice == 0 }"
									@click="changeIsInvoice">不需要</view>
								<view class="option-item"
									:class="{ 'color-base-bg active': orderCreateData.is_invoice == 1 }"
									@click="changeIsInvoice">需要</view>
							</view>
						</view>
						<block v-if="orderCreateData.is_invoice == 1">
							<view class="invoice-cell">
								<text class="tit">发票类型</text>
								<view class="option-grpup">
									<view class="option-item"
										:class="{ 'color-base-bg active': orderCreateData.invoice_type == item }"
										@click="changeInvoiceType(item)"
										v-for="(item, index) in orderPaymentData.shop_goods_list.invoice.invoice_type"
										:key="index">{{item == 1?'纸质':'电子'}}</view>
								</view>
							</view>
							<view class="invoice-cell">
								<text class="tit">抬头类型</text>
								<view class="option-grpup">
									<view class="option-item"
										:class="{ 'color-base-bg active': orderCreateData.invoice_title_type == 1 }"
										@click="changeInvoiceTitleType(1)">
										个人
									</view>
									<view class="option-item"
										:class="{ 'color-base-bg active': orderCreateData.invoice_title_type == 2 }"
										@click="changeInvoiceTitleType(2)">
										企业
									</view>
								</view>
							</view>
							<!-- <view class="invoice-cell is-invoice" @click="changeIsTaxInvoice()">
								<text class="tit">需要增值税专用发票</text>
								<view class="box"></view>
								<switch color="#FF4544" class="balance-switch" :checked="orderCreateData.is_tax_invoice == 1" />
							</view> -->
							<view class="invoice-cell">
								<text class="tit">发票信息</text>
								<view class="invoice-form-group">
									<input type="text" placeholder="请填写抬头名称"
										v-model.trim="orderCreateData.invoice_title" />
									<input v-if="orderCreateData.invoice_title_type == 2" type="text"
										placeholder="请填写纳税人识别号" v-model.trim="orderCreateData.taxpayer_number" />
									<input type="text" placeholder="请填写邮寄地址"
										v-model.trim="orderCreateData.invoice_full_address"
										v-if="orderCreateData.invoice_type == 1" />
									<input type="text" placeholder="请填写邮箱" v-model.trim="orderCreateData.invoice_email"
										v-if="orderCreateData.invoice_type == 2" />
								</view>
							</view>
							<view class="invoice-cell">
								<text class="tit">发票内容</text>
								<view class="option-grpup">
									<view :key="index"
										v-for="(item, index) in orderPaymentData.shop_goods_list.invoice.invoice_content_array"
										:class="{ 'color-base-bg active': item == orderCreateData.invoice_content }"
										@click="changeInvoiceContent(item)" class="option-item content">
										{{ item }}
									</view>
								</view>
							</view>
						</block>
						<view class="invoice-tops">发票内容将以根据税法调整，具体请以展示为准，发票内容显示详细商品名 称及价格信息</view>
					</view>
				</scroll-view>
				<view class="popup-footer" @click="saveInvoice" :class="{ 'bottom-safe-area': isIphoneX }">
					<view class="confirm-btn color-base-bg">确定</view>
				</view>
			</view>
		</uni-popup>

		<!-- 优惠券弹窗 -->
		<uni-popup ref="couponPopup" type="bottom">
			<view class="coupon-popup popup" @touchmove.prevent.stop>
				<view class="popup-header">
					<text class="tit">优惠券</text>
					<text class="iconfont iconclose" @click="closePopup('couponPopup')"></text>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view class="coupon-item"
						v-for="(couponItem, couponIndex) in orderPaymentData.shop_goods_list.coupon_list"
						:key="couponIndex" @click="selectCoupon(couponItem)">
						<view class="coupon-info">
							<view class="info-wrap"
								:style="{ backgroundImage: 'url(' + $util.img('public/uniapp/coupon/bg_lingqu.png') + ')' }">
								<view class="coupon-money">
									<template v-if="couponItem.type == 'reward'">
										<text class="unit">{{ $lang('common.currencySymbol') }}</text>
										<text class="money">{{ parseFloat(couponItem.money) }}</text>
									</template>
									<template v-else-if="couponItem.type == 'discount'">
										<text class="money">{{ parseFloat(couponItem.discount) }}</text>
										<text class="unit">折</text>
									</template>
									<view class="at-least">
										<template v-if="couponItem.at_least > 0">
											满{{ couponItem.at_least }}可用
										</template>
										<template v-else>
											无门槛
										</template>
									</view>
								</view>
							</view>
							<view class="desc-wrap">
								<view class="coupon-name">{{ couponItem.coupon_name }}</view>
								<view v-if="couponItem.type == 'discount' && couponItem.discount_limit > 0"
									class="limit">最多可抵￥{{ couponItem.discount_limit }}</view>
								<view class="time font-size-goods-tag">
									有效期：{{ couponItem.end_time ? $util.timeStampTurnTime(couponItem.end_time) : '长期有效'}}</view>
							</view>
							<view class="iconfont"
								:class="orderPaymentData.coupon.coupon_id == couponItem.coupon_id ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'">
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }">
					<view class="confirm-btn color-base-bg" @click="popupConfirm('couponPopup')">确定</view>
				</view>
			</view>
		</uni-popup>

		<!-- 门店列表弹窗 -->
		<uni-popup ref="deliveryPopup" type="bottom">
			<view class="delivery-popup popup">
				<view class="popup-header">
					<text class="tit">已为您甄选出附近所有相关门店</text>
					<text class="iconfont iconclose" @click="closePopup('deliveryPopup')"></text>
				</view>
				<view class="popup-body store-popup" :class="{ 'safe-area': isIphoneX }">
					<view class="delivery-content">
						<view class="item-wrap" v-for="(item, index) in storeInfo.storeList" :key="index"
							@click="selectPickupPoint(item)">
							<view class="detail">
								<view class="name"
									:class="item.store_id == orderPaymentData.delivery.store_id ? 'color-base-text' : ''">
									<text>{{ item.store_name }}</text>
									<text v-if="item.distance">({{ item.distance }}km)</text>
								</view>
								<view class="info">
									<view
										:class="item.store_id == orderPaymentData.delivery.store_id ? 'color-base-text' : ''"
										class="font-size-goods-tag">
										营业时间：{{ item.open_date }}
									</view>
									<view
										:class="item.store_id == orderPaymentData.delivery.store_id ? 'color-base-text' : ''"
										class="font-size-goods-tag">
										地址：{{ item.full_address }}{{ item.address }}
									</view>
								</view>
							</view>
							<view class="icon" v-if="item.store_id == orderPaymentData.delivery.store_id"><text
									class="iconfont iconyuan_checked color-base-text"></text></view>
						</view>
						<view v-if="!storeInfo.storeList" class="empty">所选择收货地址附近没有可以自提的门店</view>
					</view>
				</view>
			</view>
		</uni-popup>

		<!-- 选择支付方式弹窗 -->
		<ns-payment ref="choosePaymentPopup" :isBalance="orderCreateData.is_balance" @useBalance="useBalance"
			:isPayPassWord="orderPaymentData.member_account.is_pay_password"
			:balanceDeduct="orderPaymentData.order_money > 0 && orderPaymentData.member_account.balance_total > 0 ? balanceDeduct : '0'"
			:payMoney="orderPaymentData.pay_money" @confirm="orderCreate"></ns-payment>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import payment from './public/js/payment.js';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';

	export default {
		components: {
			uniPopup
		},
		mixins: [payment]
	};
</script>

<style lang="scss">
@import "@/common/css/order_parment.scss";
</style>
<style scoped lang="scss">
	/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
		background: none;
		max-height: unset !important;
		overflow-y: hidden !important;
	}

	/deep/ .uni-popup__wrapper {
		border-radius: 20rpx 20rpx 0 0;
	}

	/deep/ .uni-popup {
		z-index: 8;
	}
	
	.store-box {
		.store-mobile {
			padding-bottom: 0;
		}
	}

	.depositRefund-wrap {
		background-color: #FFFFFF;
		padding: 50rpx 80rpx;
		text-align: center;

		.depositRefund-con {
			font-size: 30rpx;
		}

		.popup-footer {
			margin-top: 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.confirm-btn {
			width: 200rpx;
			height: 70rpx;
			font-size: $font-size-base;
			border-radius: $border-radius;
			border: 2rpx solid $color-line;
			color: $color-tip;
			display: flex;
			justify-content: center;
			align-items: center;

			&.color-base-bg {
				color: #FFFFFF;
			}
		}
	}

	// 定金不退
	.pre-sale-money {
		margin: 20rpx 30rpx;
		border-radius: $border-radius;
		background: #fff;
		padding: 20rpx 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		view {
			display: flex;
			align-items: center;

			text {
				margin-left: 10rpx;
				font-size: $font-size-toolbar;
			}
		}
	}

	// 退定金协议
	.agreement-wrap {
		width: 70vw;
		background-color: #fff;
		padding: 30rpx 40rpx;

		.agreement-title {
			font-weight: bold;
			text-align: center;
			margin-bottom: 24rpx;
		}

		.agreement-con {
			min-height: 10vh;
			max-height: 46vh;
			overflow: auto;
		}

		.popup-footer {
			margin-top: 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.confirm-btn {
			width: 200rpx;
			height: 70rpx;
			font-size: $font-size-base;
			border-radius: $border-radius;
			border: 2rpx solid #eeeeee;
			color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
