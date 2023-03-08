<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<view>
			<scroll-view scroll-y="true" class="refund-container">
				<view class="goods-wrap">
					<view class="goods-img">
						<image
							:src="$util.img(refund_data.order_goods_info.sku_image, { size: 'mid' })"
							@error="refund_data.order_goods_info.sku_image = $util.getDefaultImage().goods"
							mode="aspectFill"
							:lazy-load="true"></image>
					</view>
					<view class="goods-info">
						<view class="goods-name">{{ refund_data.order_goods_info.sku_name }}</view>
					</view>
				</view>

				<view class="refund-option" v-show="!refund_type">
					<view class="option-item" @click="selectRefundType(1)">
						<view>
							<text>退款无需退货</text>
							<text class="font-size-goods-tag color-tip">没收到货，或与卖家协商同意无需退货只退款</text>
						</view>
						<text class="iconfont iconright"></text>
					</view>
					<view class="option-item" @click="selectRefundType(2)" v-if="refund_data.refund_type.length == 2">
						<view>
							<text>退货退款</text>
							<text class="font-size-goods-tag color-tip">已收到货，需退还收到的货物</text>
						</view>
						<text class="iconfont iconright"></text>
					</view>
				</view>

				<view v-show="refund_type">
					<view class="refund-form">
						<view class="item-wrap" @click="openPopup('refundReasonPopup')">
							<view class="label">退款原因：</view>
							<view class="cont reason">
								<text class="color-tip" v-if="!refund_reason.length">请选择</text>
								<text class="color-tip" v-else>{{ refund_reason }}</text>
							</view>
							<text class="iconfont iconright"></text>
						</view>
						<view class="item-wrap">
							<view class="label">退款金额：</view>
							<view class="cont color-base-text">{{ $lang('common.currencySymbol') }}{{ refund_data.refund_money }}</view>
						</view>
					</view>
					
					<view class="refund-form">
						<view class="item-wrap"><view class="label active">退款说明</view></view>
						
						<!-- #ifdef MP-WEIXIN -->
						<textarea
							v-if="!showText"
							class="newText"
							placeholder="请输入退款说明(选填)"
							placeholder-class="color-tip font-size-tag"
							:auto-height="true"
							v-model="refund_remark"
						/>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<textarea
							class="newText"
							placeholder="请输入退款说明(选填)"
							@blur="textBlur()"
							placeholder-class="color-tip font-size-tag"
							:auto-height="true"
							v-model="refund_remark"
						/>
						<!-- #endif -->
					</view>

					<!-- 	<view class="sub-btn color-base-bg" :class="{ 'safe-area': isIphoneX }" @click="submit">{{ $lang('common.submit') }}</view> -->
					<view class="sub-btn" :class="{ 'safe-area': isIphoneX }" @click="submit">
						<button type="primary">{{ $lang('common.submit') }}</button>
					</view>
				</view>

				<uni-popup ref="refundReasonPopup" type="bottom" @change="change()">
					<view class="refund-reason-popup popup">
						<view class="popup-header">
							<view><text class="tit">退款原因</text></view>
							<view class="align-right" @click="closePopup('refundReasonPopup')"><text class="iconfont iconclose"></text></view>
						</view>
						<view class="popup-body">
							<scroll-view scroll-y="true" class="scroll-view" :class="{ 'safe-area': isIphoneX }">
								<view class="reason-list">
									<view class="item" v-for="(item, index) in refund_data.refund_reason_type" :key="index" @click="changeReason(item)">
										<view class="reason">{{ item }}</view>
										<view class="iconfont" :class="refund_reason == item ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'"></view>
									</view>
								</view>
							</scroll-view>
						</view>
						<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }">
							<view class="confirm-btn color-base-bg" @click="closePopup('refundReasonPopup')">确定</view>
						</view>
					</view>
				</uni-popup>
			</scroll-view>
			<loading-cover ref="loadingCover"></loading-cover>
			
		</view>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
	components: {
		uniPopup
	},
	data() {
		return {
			order_goods_id: '',
			refund_type: '',
			refund_reason: '',
			refund_remark: '',
			isIphoneX: false,
			refund_data: {
				refund_type: [],
				order_goods_info: {
					sku_image: ''
				}
			},
			isSub: false,
			showText: false //是否展示退款说明，解决原生小程序textarea层级过高  popup不能遮挡的问题
		};
	},
	onLoad(option) {
		if (option.order_goods_id) this.order_goods_id = option.order_goods_id;
	},
	onShow() {
		
		
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		if (uni.getStorageSync('token')) {
			this.getRefundData();
		} else {
			this.$util.redirectTo('/pages_tool/login/login', { back: '/pages_tool/order/refund?order_goods_id=' + this.order_goods_id });
		}
	},
	methods: {
		/**
		 * 显示弹出层
		 * @param {Object} ref
		 */
		openPopup(ref) {
			this.$refs[ref].open();
		},
		/**
		 * 关闭弹出层
		 * @param {Object} ref
		 */
		closePopup(ref) {
			this.$refs[ref].close();
		},
		textBlur() {
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 0
			});
		},
		/**
		 * 选择退款方式
		 * @param {Object} type
		 */
		selectRefundType(type) {
			this.refund_type = type;
		},
		getRefundData() {
			this.$api.sendRequest({
				url: '/api/orderrefund/refundData',
				data: {
					order_goods_id: this.order_goods_id
				},
				success: res => {
					if (res.code >= 0) {
						this.refund_data = res.data;
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
		submit() {
			if (this.verify()) {
				if (this.isSub) return;
				this.isSub = true;
				
				// #ifdef MP-WEIXIN
				this.subscribeMessage(() => {
					this.$api.sendRequest({
						url: '/api/orderrefund/refund',
						data: {
							order_goods_ids: this.order_goods_id,
							refund_type: this.refund_type,
							refund_reason: this.refund_reason,
							refund_remark: this.refund_remark
						},
						success: res => {
							this.$util.showToast({ title: res.message });
							if (res.code >= 0) {
								this.$util.redirectTo('/pages_tool/order/activist', {}, 'redirectTo');
							} else {
								this.isSub = false;
							}
						},
						fail: res => {
							this.isSub = false;
						}
					});
				})
				// #endif
				
				// #ifndef MP-WEIXIN
				this.$api.sendRequest({
					url: '/api/orderrefund/refund',
					data: {
						order_goods_ids: this.order_goods_id,
						refund_type: this.refund_type,
						refund_reason: this.refund_reason,
						refund_remark: this.refund_remark
					},
					success: res => {
						this.$util.showToast({ title: res.message });
						if (res.code >= 0) {
							this.$util.redirectTo('/pages_tool/order/activist', {}, 'redirectTo');
						} else {
							this.isSub = false;
						}
					},
					fail: res => {
						this.isSub = false;
					}
				});
				// #endif
			}
		},
		verify() {
			if (this.refund_reason == '') {
				this.$util.showToast({ title: '请选择退款原因' });
				return false;
			}
			return true;
		},
		changeReason(refund_reason) {
			this.refund_reason = refund_reason;
		},
		change(e) {
			if (e) this.showText = e.show;
		},
		/**
		 * 微信订阅消息
		 */
		subscribeMessage(callback){
			this.$api.sendRequest({
				url: '/weapp/api/weapp/messagetmplids',
				data: {
					keywords: 'ORDER_REFUND_AGREE,ORDER_REFUND_REFUSE'
				},
				success: res => {
					if (res.code == 0 && res.data.length) {
						uni.requestSubscribeMessage({
							tmplIds: res.data,
							fail: (res) => {
								console.log('fail', res)
							},
							complete: ()=> {
								callback();
							}
						})						
					} else {
						callback();
					}
				},
				fail: res => {
					callback();
				}
			})
		}
	}
};
</script>

<style lang="scss">
@import './public/css/refund.scss';
</style>
<style scoped>
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
</style>
