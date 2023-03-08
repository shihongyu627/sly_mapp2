<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="order-container" :class="{ 'safe-area': isIphoneX }">
		<!-- 导航栏 -->
		<!-- #ifdef H5 -->
		<view class="head-nav ns-bg-color"></view>
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<view class="head-nav ns-bg-color" :class="{ active: isIphoneX }"></view>
		<!-- #endif -->
		<!-- <view class="head-return ns-bg-color" @click="navigateBack()">
			<text class="iconfont iconback_light"></text>
			{{ $lang('title') }}
		</view> -->
		<view class="payment-top ns-bg-color">
			<view class="order-status-left">
				<!-- <image src="../../../static/order-icon.png" mode=""></image> -->
				<image v-if="action.icon" :src="$util.img(action.icon)" mode=""></image>
				<view class="status-name">
					<view class="status-name">{{ firstData.order_status_name }}</view>
					<view class="status-name">{{ firstData.order_type_name }}</view>
					<!-- <view class="status-name">定金支付截止时间:{{$util.timeStampTurnTime(firstData.pay_start_time)}}</view> -->
				</view>
			</view>
		</view>
		<!-- 物流配送方式信息 -->
		<!-- 订单状态 -->
		
		<view class="store-wrap margin_top">
			<view class="delivery-box" >
				<view>
					<view class="store-info">
						<view class="icon ns-bg-color"><view class="iconfont icondingwei1 ns-font-size-lg"></view></view>
						<view class="store-info-detail">
							<view>
								<text class="ns-margin-right">收货人：{{ firstData.name }}</text>
								<text>{{ firstData.mobile }}</text>
							</view>
							<view class="store-detail">
								<view class="ns-text-color-gray">收货地址：{{ firstData.full_address }} {{ firstData.address }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 选择门店 -->
			<!-- <view class="delivery-box" v-if="orderPaymentData.is_virtual == 0 && orderPaymentData.delivery.delivery_type == 'store'">
				<view>
					<view @click="openSiteDelivery" class="store-info" v-if="storeInfo.currStore">
						<view class="icon ns-bg-color" v-if="!storeInfo.currStore.store_image"><view class="iconfont iconmendian"></view></view>
						<view class="icon image-icon" v-else><image :src="$util.img(storeInfo.currStore.store_image)" mode="aspectFill"></image></view>
						<view class="store-info-detail">
							<view>
								<text>{{ storeInfo.currStore.store_name }}</text>
								<text></text>
							</view>
							<view class="store-detail">
								<view class="ns-text-color-gray" v-if="storeInfo.currStore.open_date">营业时间：{{ storeInfo.currStore.open_date }}</view>
								<view class="ns-text-color-gray">地址：{{ storeInfo.currStore.full_address }} {{ storeInfo.currStore.address }}</view>
							</view>
						</view>
						<view class="cell-more"><view class="iconfont iconright"></view></view>
					</view>
					<view v-else>
						<view class="address-empty"><view class="ns-text-color">当前无自提门店！请选择其它配送方式</view></view>
					</view>
				</view>
				<view v-if="storeInfo.currStore" @click.stop="" class="pick-block">
					<view>预留手机</view>
					<input class="text-right" type="number" placeholder="请输入手机号" v-model="member_address.mobile" />
				</view>
			</view> -->
		</view>

		<!-- 虚拟商品展示 -->
		<!-- <view class="mobile-wrap" v-if="orderPaymentData.is_virtual == 1">
			<view class="icon ns-bg-color"><view class="iconfont iconshouji1 ns-font-size-xx-lg"></view></view>
			<view class="mobile-info">
				<view class="tips ns-text-color ns-font-size-sm">购买虚拟类商品需填写您的手机号，以方便商家与您联系</view>
				<view class="form-group">
					<view class="form-item">
						<text class="text">手机号码</text>
						<input
							type="number"
							value=""
							maxlength="11"
							placeholder="请输入您的手机号码"
							placeholder-class="ns-text-color-gray placeholder"
							class="input"
							v-model="orderCreateData.member_address.mobile"
						/>
					</view>
				</view>
			</view>
		</view>
 -->
		<!-- 店铺 -->
		<view class="site-wrap">
			<view class="site-body">
				<!-- 商品 -->
					<view class="goods-wrap" >
						<view @click="navigateTo(firstData)" class="goods-img">
							<image :src="$util.img(firstData.sku_image, { size: 'mid' })" mode="aspectFill"></image>
						</view>
						<view class="goods-info">
							<view @click="navigateTo(firstData)" class="goods-name">{{ firstData.sku_name }}</view>
							<view class="sku " v-if="firstData.sku_spec_format">
								<view class="goods-spec">
									<block v-for="(x,i) in firstData.sku_spec_format" :key="i" >{{ x.spec_value_name }} {{i < firstData.sku_spec_format.length-1 ?'':''}}</block>
								</view>
							</view>
							<view class="goods-sub-section">
								<view>
									<text class="goods-price ns-text-color">
										<text class="unit">{{ $lang('common.currencySymbol') }}</text>
										{{ firstData.price }}
									</text>
								</view>
								<view>
									<text>
										<text class="iconfont iconclose"></text>
										{{ firstData.num }}
									</text>
								</view>
							</view>
						</view>
					</view>
			</view>
		</view>

		<!-- 订单概况 -->
		<!-- <view class="order-summary">
			<view class="order-cell">
				<text class="tit">订单编号：</text>
				<view class="box">
					<text class="ns-text-color-black">{{ firstData.order_no }}</text>
					<view class="copy" @click="$util.copy(firstData.order_no)">复制</view>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">订单交易号：</text>
				<view class="box">
					<text class="ns-text-color-black">{{ firstData.out_trade_no }}</text>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">创建时间：</text>
				<view class="box">
					<text class="ns-text-color-black">{{ $util.timeStampTurnTime(firstData.create_time) }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="firstData.close_time > 0">
				<text class="tit">关闭时间：</text>
				<view class="box">
					<text class="ns-text-color-black">{{ $util.timeStampTurnTime(firstData.close_time) }}</text>
				</view>
			</view>
			<block v-if="firstData.pay_status > 0">
				<view class="hr"></view>
				<view class="order-cell">
					<text class="tit">支付方式：</text>
					<view class="box">
						<text class="ns-text-color-black">{{ firstData.pay_type_name }}</text>
					</view>
				</view>
				<view class="order-cell">
					<text class="tit">支付时间：</text>
					<view class="box">
						<text class="ns-text-color-black">{{ $util.timeStampTurnTime(firstData.pay_time) }}</text>
					</view>
				</view>
			</block>
			<view class="hr"></view>
			<view class="order-cell" v-if="firstData.delivery_type_name">
				<text class="tit">配送方式：</text>
				<view class="box">
					<text class="ns-text-color-black">{{ firstData.delivery_type_name }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="firstData.buyer_message != ''">
				<text class="tit">买家留言：</text>
				<view class="box">
					<text class="ns-text-color-black">{{ firstData.buyer_message }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="firstData.promotion_type_name">
				<text class="tit">活动优惠：</text>
				<view class="box">
					<text class="ns-text-color-black">{{ firstData.promotion_type_name }}</text>
				</view>
			</view> -->
			<!-- 联系客服 -->
			<!-- <view class="kefu"> -->
				<!-- #ifdef MP-WEIXIN -->
				<!-- <button type="default" hover-class="none" open-type="contact"></button> -->
				<!-- #endif -->
				<!-- <view>
					<text class="iconfont iconziyuan"></text>
					<text>联系客服</text>
				</view>
			</view>
		</view> -->
		<!-- 订单金额 -->
		<template >
			<view class="order-money">
				<view class="order-cell">
					<text class="tit">商品金额</text>
					<view class="box align-right">
						<text class="ns-text-color-black">
							<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
							{{ firstData.goods_money | moneyFormat }}
						</text>
					</view>
				</view>
				<view class="order-cell" v-if="firstData.presale_money > 0">
					<text class="tit">抵扣金额</text>
					<view class="box align-right">
						<text class="ns-text-color">
							<text class="operator">-</text>
							<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
							<text>{{  firstData.presale_money | moneyFormat}}</text>
						</text>
					</view>
				</view>
				<view class="order-cell" v-if="firstData.delivery_money > 0">
					<text class="tit">运费</text>
					<view class="box align-right">
						<text class="ns-text-color">
							<text class="operator">+</text>
							<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
							<text>{{ firstData.delivery_money | moneyFormat }}</text>
						</text>
					</view>
				</view>
				<view class="order-cell" v-if="firstData.invoice_money > 0">
					<text class="tit">
						税费
						<text class="ns-text-color">({{ finalPay.invoice_rate }}%)</text>
					</text>
					<view class="box align-right">
						<text class="ns-text-color">
							<text class="operator">+</text>
							<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
							<text>{{ firstData.invoice_money | moneyFormat }}</text>
						</text>
					</view>
				</view>
				<view class="order-cell" v-if="firstData.invoice_delivery_money > 0">
					<text class="tit">发票邮寄费</text>
					<view class="box align-right">
						<text class="ns-text-color">
							<text class="operator">+</text>
							<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
							<text>{{ firstData.invoice_delivery_money | moneyFormat }}</text>
						</text>
					</view>
				</view>
				<view class="order-cell" v-if="firstData.promotion_money > 0">
					<text class="tit">优惠</text>
					<view class="box align-right">
						<text class="ns-text-color">
							<text class="operator">-</text>
							<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
							<text>{{ firstData.promotion_money | moneyFormat }}</text>
						</text>
					</view>
				</view>
				<view class="order-cell" v-if="firstData.coupon_money > 0">
					<text class="tit">优惠券</text>
					<view class="box align-right">
						<text class="ns-text-color">
							<text class="operator">-</text>
							<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
							<text>{{ firstData.coupon_money | moneyFormat }}</text>
						</text>
					</view>
				</view>
				<view class="order-cell" v-if="firstData.balance_money > 0">
					<text class="tit">使用余额</text>
					<view class="box align-right">
						<text class="ns-text-color">
							<text class="operator">-</text>
							<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
							<text>{{ firstData.balance_money | moneyFormat }}</text>
						</text>
					</view>
				</view>
			</view>
		</template>
		
		<!-- <template >
			<view class="order-money">
				<view class="order-cell">
					<text class="tit">订单号</text>
					<view class="box align-right">
						<text class="ns-text-color-black">
							<text class="ns-font-size-sm">订单编号</text>
							{{finalPay.order_info.order_no}}
						</text>
					</view>
				</view>
				
			</view>
		</template> -->
		
		<view class="order-money">
			<view class="order-cell" v-if="firstData.is_virtual == 0 && firstData.presale_deposit > 0">
				<text class="tit ns-text-color">阶段一：付定金</text>
				<view class="box align-right">
					<text class="ns-text-color-black ns-text-color">
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						{{ firstData.presale_deposit_money | moneyFormat}}
					</text>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">阶段二：付尾款</text>
				<view class="box align-right">
					<text>
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ firstData.final_money | moneyFormat}}</text>
					</text>
				</view>
			</view>
		</view>
		
		<view class="order-submit" :class="{ 'bottom-safe-area': isIphoneX }">
			<view class="order-settlement-info">
				<text class="ns-text-color-gray ns-margin-right">共{{ firstData.num }}件</text>
				<text>合计：</text>
				<text class="ns-text-color">
					{{ $lang('common.currencySymbol') }}
					<text class="money ns-font-size-base">{{ firstData.presale_deposit_money | moneyFormat }}</text>
				</text>
			</view>
			<block v-if="firstData.order_status == 0">
				<view class="submit-btn" v-if="isDisabled" ><button type="primary" size="mini" @click="firstPaymentCreate(firstData)" >付定金</button></view>
				<view class="submit-btn" v-else><button type="default " class="default" size="mini"  >付定金</button></view>
			</block>
		
			<!-- <view class="submit-btn" v-if="isDisabled" >
				<button type="primary" size="mini" v-for="(item,index_action) in action.member_action" @click="operation(item.action, orderItem)" :class="index_action != (action.member_action.length-1)?'default':''">{{item.title}}</button>
			</view> -->
		</view>

		<!-- 发票弹窗 -->
		<uni-popup ref="invoicePopup" type="bottom">
			<view :style="orderCreateData.is_invoice == 1 ? 'height: 83vh;' : 'height: 48vh;'" class="invoice-popup popup" @touchmove.prevent.stop>
				<view class="popup-header">
					<view><text class="tit">发票</text></view>
					<view class="align-right"><text class="iconfont iconclose uni-bold" @click="closeInvoicePopup()"></text></view>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view>
						<view class="invoice-cell is-invoice" v-if="orderPaymentData.shop_goods_list.invoice">
							<text class="tit">需要发票</text>
							<view class="option-grpup">
								<view class="option-item" :class="{ 'ns-bg-color active': orderCreateData.is_invoice == 0 }" @click="changeIsInvoice">不需要</view>
								<view class="option-item" :class="{ 'ns-bg-color active': orderCreateData.is_invoice == 1 }" @click="changeIsInvoice">需要</view>
							</view>
						</view>
						<block v-if="orderCreateData.is_invoice == 1">
							<view class="invoice-cell">
								<text class="tit">发票类型</text>
								<view class="option-grpup">
									<view class="option-item" :class="{ 'ns-bg-color active': orderCreateData.invoice_type == 1 }" @click="changeInvoiceType(1)">纸质</view>
									<view class="option-item" :class="{ 'ns-bg-color active': orderCreateData.invoice_type == 2 }" @click="changeInvoiceType(2)">电子</view>
								</view>
							</view>
							<view class="invoice-cell">
								<text class="tit">抬头类型</text>
								<view class="option-grpup">
									<view class="option-item" :class="{ 'ns-bg-color active': orderCreateData.invoice_title_type == 1 }" @click="changeInvoiceTitleType(1)">个人</view>
									<view class="option-item" :class="{ 'ns-bg-color active': orderCreateData.invoice_title_type == 2 }" @click="changeInvoiceTitleType(2)">企业</view>
								</view>
							</view>
							<!-- <view class="invoice-cell is-invoice" @click="changeIsTaxInvoice()">
								<text class="tit">需要增值税专用发票</text>
								<view class="box align-right"></view>
								<switch color="#FF4544" class="balance-switch" :checked="orderCreateData.is_tax_invoice == 1" />
							</view> -->
							<view class="invoice-cell">
								<text class="tit">发票信息</text>
								<view class="invoice-form-group">
									<input type="text" placeholder="请填写抬头名称" v-model.trim="orderCreateData.invoice_title" />
									<input v-if="orderCreateData.invoice_title_type == 2" type="text" placeholder="请填写纳税人识别号" v-model.trim="orderCreateData.taxpayer_number" />
									<input type="text" placeholder="请填写邮寄地址" v-model.trim="orderCreateData.invoice_full_address" v-if="orderCreateData.invoice_type == 1" />
									<input type="text" placeholder="请填写邮箱" v-model.trim="orderCreateData.invoice_email" v-if="orderCreateData.invoice_type == 2" />
								</view>
							</view>
							<view class="invoice-cell">
								<text class="tit">发票内容</text>
								<view class="option-grpup">
									<view
										:key="index"
										v-for="(item, index) in orderPaymentData.shop_goods_list.invoice.invoice_content_array"
										:class="{ 'ns-bg-color active': item == orderCreateData.invoice_content }"
										@click="changeInvoiceContent(item)"
										class="option-item"
									>
										{{ item }}
									</view>
								</view>
							</view>
						</block>
						<view class="invoice-tops ns-text-color-gray">发票内容将以根据税法调整，具体请以展示为准，发票内容显示详细商品名 称及价格信息</view>
					</view>
				</scroll-view>
				<view class="popup-footer" @click="saveInvoice" :class="{ 'bottom-safe-area': isIphoneX }"><view class="confirm-btn ns-bg-color">保存</view></view>
			</view>
		</uni-popup>

		<!-- 优惠券弹窗 -->
		<uni-popup ref="couponPopup" type="bottom">
			<view class="coupon-popup popup" @touchmove.prevent.stop>
				<view class="popup-header">
					<view><text class="tit">优惠券</text></view>
					<view class="align-right"><text class="iconfont iconclose uni-bold" @click="closePopup('couponPopup')"></text></view>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view
						class="coupon-item"
						v-for="(couponItem, couponIndex) in orderPaymentData.shop_goods_list.coupon_list"
						:key="couponIndex"
						@click="selectCoupon(couponItem)"
					>
						<view class="iconfont" :class="orderPaymentData.coupon.coupon_id == couponItem.coupon_id ? 'iconyuan_checked ns-text-color' : 'iconyuan_checkbox'"></view>
						<view class="circular"></view>
						<view class="coupon-info">
							<view class="coupon-money" v-if="couponItem.type == 'reward'">
								<text class="ns-text-color">{{ parseFloat(couponItem.money) }}</text>
								<text class="unit ns-text-color">元</text>
							</view>
							<view class="coupon-money" v-if="couponItem.type == 'discount'">
								<text class="ns-text-color">{{ parseFloat(couponItem.discount) }}</text>
								<text class="unit ns-text-color">折</text>
							</view>
							<view class="info">
								<view>{{ couponItem.coupon_name }}</view>
								<view class="ns-text-color-gray ns-font-size-sm" v-if="couponItem.at_least > 0">
									满{{ couponItem.at_least }}可用
									<text class="ns-text-color-gray ns-font-size-sm" v-if="couponItem.type == 'discount' && couponItem.discount_limit > 0">
										(最多可抵{{ couponItem.discount_limit }})
									</text>
								</view>
								<view class="ns-text-color-gray ns-font-size-sm" v-else>任意金额可用</view>
								<view class="ns-text-color-gray ns-font-size-sm">有效期：{{ $util.timeStampTurnTime(couponItem.end_time) }}</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }"><view class="confirm-btn ns-bg-color" @click="popupConfirm('couponPopup')">确定</view></view>
			</view>
		</uni-popup>

		<!-- 活动优惠弹窗 -->
		<uni-popup ref="sitePromotionPopup" type="bottom">
			<view class="promotion-popup popup">
				<view class="popup-header">
					<view><text class="tit">活动优惠</text></view>
					<view class="align-right"><text class="iconfont iconclose uni-bold" @click="closePopup('sitePromotionPopup')"></text></view>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view>
						<view class="order-cell">
							<text class="tit"><text class="promotion-mark ns-gradient-promotionpages-topics-payment" >限时秒杀</text></text>
							<view class="box align-right"></view>
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }">
					<view class="confirm-btn ns-bg-color" @click="closePopup('sitePromotionPopup')">确定</view>
				</view>
			</view>
		</uni-popup>

		<!-- 门店列表弹窗 -->
		<uni-popup ref="deliveryPopup" type="bottom">
			<view class="delivery-popup popup">
				<view class="popup-header">
					<view><text class="tit">已为您甄选出附近所有相关门店</text></view>
					<view class="align-right"><text class="iconfont iconclose uni-bold" @click="closePopup('deliveryPopup')"></text></view>
				</view>
				<view class="popup-body store-popup" :class="{ 'safe-area': isIphoneX }">
					<view class="delivery-cell delivery-cont">
						<view class="pickup-point" v-for="(item, index) in storeInfo.storeList" :key="index" @click="selectPickupPoint(item)">
							<view class="delivery-detail">
								<view class="name" :class="item.store_id == orderPaymentData.delivery.store_id ? 'ns-text-color' : ''">
									<text>{{ item.store_name }}</text>
									<text v-if="item.distance">({{ item.distance }}km)</text>
								</view>
								<view class="info">
									<view :class="item.store_id == orderPaymentData.delivery.store_id ? 'ns-text-color' : ''" class="ns-font-size-sm">营业时间：{{ item.open_date }}</view>
									<view :class="item.store_id == orderPaymentData.delivery.store_id ? 'ns-text-color' : ''" class="ns-font-size-sm">地址：{{ item.full_address }}{{ item.address }}</view>
								</view>
							</view>
							<view class="icon" v-if="item.store_id == orderPaymentData.delivery.store_id"><text class="iconfont iconyuan_checked ns-text-color"></text></view>
						</view>
						<view v-if="!storeInfo.storeList">所选择收货地址附近没有可以自提的门店</view>
					</view>
				</view>
			</view>
		</uni-popup>

		<!-- 支付密码弹窗 -->
		<uni-popup ref="payPassword" :custom="true">
			<view class="pay-password">
				<template v-if="!finalPay">
					<block v-if="orderPaymentData.member_account.is_pay_password == 0">
						<view class="title">为了您的账户安全,请先设置您的支付密码</view>
						<view class="tips">可到"个人中心","个人资料","支付密码"中设置</view>
						<view class="btn ns-bg-color ns-border-color" @click="setPayPassword">立即设置</view>
						<view class="btn white ns-text-color ns-border-color" @click="noSet">暂不设置</view>
					</block>
					<block v-else>
						<view class="title">请输入支付密码</view>
						<view class="password-wrap">
							<myp-one :maxlength="6" :is-pwd="true" @input="input" ref="input" :auto-focus="isFocus" type="box"></myp-one>
							<view class="align-right"><text class="ns-text-color ns-font-size-sm forget-password" @click="setPayPassword">忘记密码</text></view>
						</view>
					</block>
				</template>
				<template v-else>
					<block v-if="finalPay.member_account.is_pay_password == 0">
						<view class="title">为了您的账户安全,请先设置您的支付密码</view>
						<view class="tips">可到"个人中心","个人资料","支付密码"中设置</view>
						<view class="btn ns-bg-color ns-border-color" @click="setPayPassword">立即设置</view>
						<view class="btn white ns-text-color ns-border-color" @click="noSet">暂不设置</view>
					</block>
					<block v-else>
						<view class="title">请输入支付密码</view>
						<view class="password-wrap">
							<myp-one :maxlength="6" :is-pwd="true" @input="input" ref="input" :auto-focus="isFocus" type="box"></myp-one>
							<view class="align-right"><text class="ns-text-color ns-font-size-sm forget-password" @click="setPayPassword">忘记密码</text></view>
						</view>
					</block>
				</template>
				
			</view>
		</uni-popup>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import payment from './public/js/payment_first.js';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import mypOne from '@/components/myp-one/myp-one.vue';
import nsSwitch from '@/components/ns-switch/ns-switch.vue';

export default {
	components: {
		uniPopup,
		mypOne,
		nsSwitch
	},
	data() {
		return {};
	},
	onLoad() {},
	mixins: [payment]
};
</script>

<style lang="scss">
@import './public/css/payment.scss';
</style>
<style scoped>
button.default{
	background-color: #ccc !important;
	color:#fff;
	margin-right:15rpx !important;
}
/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: none;
	max-height: unset !important;
	overflow-y: hidden !important;
}
>>> .uni-popup__wrapper {
	border-radius: 20rpx 20rpx 0 0;
}
>>> .uni-popup {
	z-index: 8;
}
</style>
