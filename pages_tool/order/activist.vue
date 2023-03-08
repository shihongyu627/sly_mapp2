<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="activist-container">
		<mescroll-uni ref="mescroll" @getData="getListData">
			<block slot="list">
				<view class="container">
					<block v-if="refundList.length">
						<view class="order-item" v-for="(item, index) in refundList" :key="index">
							<view class="order-header">
								<text class="status-num font-size-base">{{ item.order_no }}</text>
								<view class="status-name" v-if="item.refund_status == 3">退款成功</view>
								<view class="status-name color-base-text" v-if="item.refund_status == 1">退款中</view>
								<view class="status-name color-base-text" v-if="item.refund_status == -1">退款失败</view>
							</view>
							<view class="goods-wrap">
								<image :src="$util.img(item.sku_image, { size: 'mid' })" @error="imageError(index)" mode="aspectFill" :lazy-load="true"></image>
								<view class="goods-info">
									<view class="goods-name" @click="refundDetail(item.order_goods_id)">{{ item.sku_name }}</view>
									<view class="goods-num">
										<view class="num-text color-base-text">{{ item.refund_status_name }}</view>
										<view class="num-price">
											<text>￥{{ item.price }}</text>
											<text class="num">×{{ item.num }}</text>
										</view>
									</view>
								</view>
							</view>
							<view class="goods-btn">
								<view class="btn-text">
									<text>共{{ item.num }}件商品</text>
									<text>退款：￥{{ item.refund_status == 3 ? item.refund_real_money : item.refund_apply_money }}</text>
								</view>
								<view class="order-action">
									<view class="order-box-btn" @click="refundDetail(item.order_goods_id)">{{ $lang('checkDetail') }}</view>
									<block v-if="item.refund_action.length">
										<view
											class="order-box-btn"
											@click="refundAction(actionItem.event, item)"
											v-for="(actionItem, actionIndex) in item.refund_action"
											:key="actionIndex"
										>
											{{ actionItem.title }}
										</view>
									</block>
								</view>
							</view>
						</view>
					</block>
					<block v-else>
						<view class="cart-empty" v-if="showEmpty"><ns-empty :isIndex="false" :text="$lang('emptyTips')"></ns-empty></view>
					</block>
				</view>
			</block>
		</mescroll-uni>
	</view>
</template>

<script>
import refundMethod from './public/js/refundMethod.js';

export default {
	data() {
		return {
			refundList: [],
			showEmpty: false
		};
	},
	mixins: [refundMethod],
	onShow() {
		
		if (!uni.getStorageSync('token')) {
			this.$util.redirectTo('/pages/order/login', {
				back: '/pages_tool/order/activist'
			});
		}
	},
	methods: {
		getListData(mescroll) {
			this.$api.sendRequest({
				url: '/api/orderrefund/lists',
				data: {
					page: mescroll.num,
					page_size: mescroll.size
				},
				success: res => {
					this.showEmpty = true;
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						});
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.refundList = []; //如果是第一页需手动制空列表
					this.refundList = this.refundList.concat(newArr);
				},
				fail: res => {
					mescroll.endErr();
				}
			});
		},
		refundDetail(order_goods_id) {
			this.$util.redirectTo('/pages_tool/order/refund_detail', {
				order_goods_id
			});
		},
		refundAction(event, data) {
			switch (event) {
				case 'orderRefundCancel': // 撤销维权
					this.cancleRefund(data.order_goods_id, res => {
						if (res.code >= 0) {
							this.$util.showToast({
								title: '撤销成功'
							});
							this.$refs.mescroll.refresh();
						}
					});
					break;
				case 'orderRefundDelivery': // 退款发货
					this.$util.redirectTo('/pages_tool/order/refund_detail', {
						order_goods_id: data.order_goods_id,
						action: 'returngoods'
					});
					break;
				case 'orderRefundAsk':
					this.$util.redirectTo('/pages_tool/order/refund', {
						order_goods_id: data.order_goods_id
					});
					break;
			}
		},
		imageError(index) {
			this.refundList[index].sku_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss" scoped>
/deep/ .fixed {
	position: relative;
	top: 0;
}
.cart-empty {
	padding-top: 308rpx !important;
}
@import './public/css/activist.scss';
</style>
