<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<scroll-view scroll-y="true" class="detail-container" :class="{ 'safe-area': isIphoneX }" v-if="detail">
			<view v-show="action == ''">
				<view class="status-wrap">
					<view class="status-name">{{ detail.refund_status_name }}</view>
					<view class="refund-explain" v-if="detail.refund_status == 1">
						<view class="ns-font-size-sm ns-text-color-gray">等待卖家同意</view>
					</view>
					<view class="refund-explain" v-if="detail.refund_status == 2">
						<view class="ns-font-size-sm ns-text-color-gray">请注意查看资金变化</view>
					</view>
				</view>

				<view class="refund-info">
					<view class="header">退款信息</view>
					<view class="body">
						<!-- 商品信息 -->
						<view class="goods-wrap">
							<view class="goods-img" @click="refundDetail(detail.order_goods_id)">
								<image :src="$util.img(detail.sku_image, { size: 'mid' })" @error="imageError()" mode="aspectFill" :lazy-load="true"></image>
							</view>
							<view class="goods-info">
								<view class="goods-name" @click="refundDetail(detail.order_goods_id)">{{ detail.sku_name }}</view>
								<view class="goods-sub-section">
									<view>
										<text class="refund-price">
											<text>退款：</text>
											<text class="unit">{{ $lang('common.currencySymbol') }}</text>
											<text>{{ detail.presale_deposit_money }}</text>
										</text>
									</view>
								</view>
							</view>
						</view>
						<!-- 退款信息 -->
						<view class="info">
							<view class="cell">退款方式：{{ detail.refund_type == 1 ? '仅退款' : '退款退货' }}</view>
							<view class="cell">退款原因：{{ detail.refund_reason? detail.refund_reason:"买家未填写"}}</view>
							<view class="cell">退款金额：￥{{ detail.presale_deposit_money }}</view>
							<view class="cell">退款编号：{{ detail.deposit_refund_no }}</view>
							<view class="cell">申请时间：{{ $util.timeStampTurnTime(detail.apply_refund_time) }}</view>
							<view class="cell" v-if="detail.refund_time">到账时间：{{ $util.timeStampTurnTime(detail.refund_time) }}</view>
							<view class="cell" v-if="detail.refuse_reason">拒绝理由：{{ detail.refuse_reason}}</view>
						</view>
					</view>
				</view>

				<!-- <view class="operation" :class="{ 'bottom-safe-area': isIphoneX }" v-if="detail.refund_action.length">
					<view class="order-box-btn" v-for="(actionItem, actionIndex) in detail.refund_action" :key="actionIndex" @click="refundAction(actionItem.event)">
						{{ actionItem.title }}
					</view>
				</view> -->
			</view>

		</scroll-view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import refundMethod from './public/js/refundMethod.js';
import validate from 'common/js/validate.js';


export default {
	data() {
		return {
			order_goods_id: '',
			detail: {
				refund_action: []
			},
			isIphoneX: false,
			action: '',
			formData: {
				refund_delivery_name: '',
				refund_delivery_no: '',
				refund_delivery_remark: ''
			},
			isSub: false
		};
	},
	components: {
	},
	mixins: [refundMethod],
	onLoad(option) {
		if (option.order_id) this.order_id = option.order_id;
		if (option.action) this.action = option.action;
		this.isIphoneX=this.$util.uniappIsIPhoneX()
	},
	onShow() {
		
		
		
		if (uni.getStorageSync('token')) {
			this.getRefundDetail();
		} else {
			this.$util.redirectTo('/pages_tool/login/login', { back: '/pages_tool/order/refund_detail?order_goods_id=' + this.order_goods_id });
		}
		
	},
	methods: {
		getRefundDetail() {
			this.$api.sendRequest({
				url: '/presale/api/refund/detail',
				data: {
					order_id: this.order_id
				},
				success: res => {
					if (res.code >= 0) {
						this.detail = res.data;
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					} else {
						this.$util.showToast({ title: '未获取到该订单项退款信息' });
						setTimeout(() => {
							this.$util.redirectTo('/pages/order/list');
						}, 1000);
					}
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		refundAction(event) {
			switch (event) {
				case 'orderRefundCancel':
					this.cancleRefund(this.detail.order_goods_id, res => {
						if (res.code >= 0) {
							this.$util.showToast({ title: '撤销成功' });
							setTimeout(() => {
								this.$util.redirectTo('/pages/order/list');
							}, 1000);
						}
					});
					break;
				case 'orderRefundDelivery':
					this.action = 'returngoods';
					break;
				case 'orderRefundAsk':
					this.$util.redirectTo('/pages_tool/order/refund', { order_goods_id: this.detail.order_goods_id });
					break;
			}
		},
		refurnGoods() {
			var rule = [
				{ name: 'refund_delivery_name', checkType: 'required', errorMsg: '请输入物流公司' },
				{ name: 'refund_delivery_no', checkType: 'required', errorMsg: '请输入物流单号' }
			];
			this.formData.order_goods_id = this.order_goods_id;
			var checkRes = validate.check(this.formData, rule);
			if (checkRes) {
				if (this.isSub) return;
				this.isSub = true;
				this.$api.sendRequest({
					url: '/api/orderrefund/delivery',
					data: this.formData,
					success: res => {
						if (res.code == 0) {
							this.action = '';
							this.getRefundDetail();
						} else {
							this.$util.showToast({ title: res.message });
						}
					}
				});
			} else {
				this.$util.showToast({ title: validate.error });
				return false;
			}
		},
		/**
		 * 切换操作
		 */
		switchAction(action){
			this.action = action;
		},
		imageError() {
			this.detail.sku_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss">
@import './public/css/refund_detail.scss';
</style>
