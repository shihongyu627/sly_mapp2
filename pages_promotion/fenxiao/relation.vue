<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<mescroll-uni ref="mescroll" @getData="getData" top="20" class="member-point" :size="8" v-if="token">
			<view class="goods_list" slot="list">
				<view class="order-list">
					<view class="order-item" v-for="(orderItem, orderIndex) in orderList" :key="orderIndex" @click="toDetail(orderItem.fenxiao_order_id)">
						<view class="order-header">
							<text class="site-name font-size-base">{{ orderItem.order_no }}</text>
							<text class="status-name color-base-text" v-if="orderItem.is_refund == 1">已退款</text>
							<text class="status-name color-text-green" v-else-if="orderItem.is_settlement == 1">已结算</text>
							<text class="status-name color-text-orange" v-else>待结算</text>
						</view>

						<view class="order-body">
							<view class="goods-wrap">
								<view class="goods-img">
									<image :src="$util.img(orderItem.sku_image, { size: 'mid' })" @error="imageError(orderIndex)" mode="aspectFill" :lazy-load="true"></image>
								</view>
								<view class="goods-info">
									<view class="top-wrap">
										<view class="goods-name font-size-base">{{ orderItem.sku_name }}</view>
										<view>
											<text class="color-tip">返{{ fenxiaoWords.account }}</text>
											<text class="price-color font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
											<text class="price-color font-size-toolbar">{{ orderItem.commission }}</text>
										</view>
									</view>
									<view class="goods-sub-section">
										<view class="goods-price">
											<text class="unit price-color">{{ $lang('common.currencySymbol') }}</text>
											<text class="price-color font-size-toolbar">{{ orderItem.price }}</text>
										</view>
										<view>
											<text>
												<text class="iconfont iconclose"></text>
												{{ orderItem.num }}
											</text>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="order-footer">
							<view class="order-base-info active">
								<view class="order-type ">
									<text class="color-tip">{{ $util.timeStampTurnTime(orderItem.create_time) }}</text>
									<!-- <text>返{{ fenxiaoWords.account }}金额：</text>
									<text class="color-base-text">{{ $lang('common.currencySymbol') }}{{ orderItem.commission }}</text> -->
								</view>
								<view class="total">
									<text>合计：</text>
									<text class="price-color">{{ $lang('common.currencySymbol') }}</text>
									<text class="font-size-toolbar price-color">{{ orderItem.real_goods_money }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="cart-empty"><ns-empty text="暂无订单" :isIndex="false" v-if="orderList.length == 0 && emptyShow"></ns-empty></view>
			</view>
		</mescroll-uni>

		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import fenxiaoWords from 'common/js/fenxiao-words.js';
export default {
	data() {
		return {
			orderList: [],
			emptyShow: false,
			token: null,
			fenxiaoId: '',
			subMemberId: ''
		};
	},
	mixins: [fenxiaoWords],
	onLoad(option) {
		if (option.fenxiao_id) {
			this.fenxiaoId = option.fenxiao_id;
		}
		if (option.sub_member_id) {
			this.subMemberId = option.sub_member_id;
		}
	},
	onShow() {
		
		if(this.fenxiaoWords && this.fenxiaoWords.concept)this.$langConfig.title(this.fenxiaoWords.concept + '订单');
		this.token = uni.getStorageSync('token');
	},
	methods: {
		//获得列表数据
		getData(mescroll) {
			this.emptyShow = false;
			if (mescroll.num == 1) {
				this.orderList = [];
			}
			this.$api.sendRequest({
				url: '/fenxiao/api/fenxiao/getorder',
				data: {
					page: mescroll.num,
					page_size: mescroll.size,
					fenxiao_id: this.fenxiaoId ? this.fenxiaoId : '',
					sub_member_id: this.subMemberId ? this.subMemberId : ''
				},
				success: res => {
					this.emptyShow = true;
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data && res.data.list) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({ title: res.message });
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.orderList = []; //如果是第一页需手动制空列表
					this.orderList = this.orderList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		imageError(index) {
			this.orderList[index].sku_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		toDetail(e) {
			this.$util.redirectTo('/pages_promotion/fenxiao/order_detail', {
				id: e
			});
		}
	},
	computed: {
		storeToken() {
			return this.$store.state.token;
		}
	}
};
</script>

<style lang="scss">
@import './public/css/order.scss';
.goods-wraps {
	align-items: center;
}
.goods_list .order-item .order-body .goods-wraps .goods-img,
.goods_list .order-item .order-body .goods-wraps .goods-info,
.goods_list .order-item .order-footers {
	padding: 0;
}
</style>
