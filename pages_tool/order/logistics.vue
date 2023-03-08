<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<scroll-view class="order-nav" :scroll-x="true" :show-scrollbar="false">
			<view v-for="(packageItem, packageIndex) in packageList" :key="packageIndex" class="uni-tab-item"
				@click="ontabtap(packageIndex)">
				<text class="uni-tab-item-title"
					:class="packageIndex == currIndex ? 'uni-tab-item-title-active color-base-border  color-base-text' : ''">
					{{ packageItem.package_name }}
				</text>
			</view>
		</scroll-view>
		<view v-for="(packageItem, packageIndex) in packageList" :key="packageIndex" class="swiper-item"
			v-show="packageIndex == currIndex">
			<view class="container">
				<view class="goods-wrap">
					<view class="body">
						<view class="goods" v-for="(goodsItem, goodsIndex) in packageItem.goods_list" :key="goodsIndex">
							<view class="goods-img" @click="toGoodsDetail(goodsItem.sku_id)">
								<image :src="$util.img(goodsItem.sku_image, { size: 'mid' })"
									@error="imageError(packageIndex, goodsIndex)" mode="aspectFill"></image>
							</view>
							<view class="goods-info">
								<view @click="toGoodsDetail(goodsItem.sku_id)" class="goods-name">
									{{ goodsItem.sku_name }}
								</view>
								<view class="goods-sub-section">
									<view>
										<text>
											<text class="iconfont iconclose"></text>
											{{ goodsItem.num }}
										</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="express-company-wrap" v-if="packageItem.delivery_type == 1">
					<view class="company-logo">
						<image :src="$util.img(packageItem.express_company_image)"></image>
					</view>
					<view class="info">
						<view class="company">
							<text>承运公司： {{ packageItem.express_company_name }}</text>
						</view>
						<view class="no">
							<text>
								运单号：
								<text class="color-tip">{{ packageItem.delivery_no }}</text>
							</text>
							<text class="iconfont iconfuzhi" @click="copyDeliveryNo(packageItem.delivery_no)"></text>
						</view>
					</view>
				</view>

				<view class="track-wrap" v-if="packageItem.delivery_type == 1">
					<block v-if="packageItem.trace.success && packageItem.trace.list.length != 0">
						<view class="track-item" v-for="(traceItem, traceIndex) in packageItem.trace.list"
							:class="traceIndex == 0 ? 'active' : ''" :key="traceIndex">
							<view class="dot" :class="traceIndex == 0 ? 'color-base-bg' : ''"></view>
							<view class="msg">
								<view class="text" :class="traceIndex == 0 ? 'color-base-text' : ''">
									{{ traceItem.remark }}
								</view>
								<view class="time" :class="traceIndex == 0 ? 'color-base-text' : ''">
									{{ traceItem.datetime }}
								</view>
							</view>
						</view>
					</block>
					<block v-else-if="packageItem.trace.success && packageItem.trace.list.length == 0">
						<view class="fail-wrap font-size-base">{{ packageItem.trace.reason }}</view>
					</block>
					<block v-else>
						<view class="fail-wrap font-size-base">{{ packageItem.trace.reason }}</view>
					</block>
				</view>
			</view>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId: '',
				packageList: [],
				isIphoneX: false,
				currIndex: 0,
				status: 0,
				type: ''
			};
		},
		onLoad(option) {
			if (option.order_id) this.orderId = option.order_id;
			if (option.type) this.type = option.type;
		},
		onShow() {


			// 判断登录
			if (!uni.getStorageSync('token')) {
				this.$util.redirectTo('/pages_tool/login/login');
			} else {
				this.getPackageInfo();
			}
			this.isIphoneX = this.$util.uniappIsIPhoneX();
		},
		methods: {
			ontabtap(e) {
				this.currIndex = e;
				// let index = e.target.dataset.current || e.currentTarget.dataset.current;
				// this.orderStatus = this.statusList[index].status;
				// if (this.orderStatus == '') this.mergePayOrder = [];
				// this.$refs.loadingCover.show();
				// this.$refs.mescroll.refresh();
			},
			getPackageInfo() {
				let url = '/api/order/package'
				if (this.type == 'store') {
					url = '/dealer/api/order/package'
				}
				this.$api.sendRequest({
					url: url,
					data: {
						order_id: this.orderId
					},
					success: res => {
						if (res.code >= 0) {
							this.packageList = res.data;
							this.packageList.forEach(item => {
								if (item.trace.list) {
									item.trace.list = item.trace.list.reverse();
								}
								item.status = this.status++;
							});
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						} else {
							this.$util.showToast({
								title: '未获取到订单信息！'
							});
							setTimeout(() => {
								if (this.type == 'store') {
									this.$util.redirectTo('/sellStore/outOrder/list/list');
									return
								}
								this.$util.redirectTo('/pages/order/list');
							}, 1500);
						}
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			toGoodsDetail(e) {
				this.$util.redirectTo('/pages/goods/detail', {
					sku_id: e
				});
			},
			imageError(packageIndex, goodsIndex) {
				this.packageList[packageIndex].goods_list[goodsIndex].sku_image = this.$util.getDefaultImage().goods;
				this.$forceUpdate();
			},
			copyDeliveryNo(value) {
				this.$util.copy(value);
			}
		}
	};
</script>

<style lang="scss">
	@import './public/css/logistics.scss';

	/deep/.uni-scroll-view ::-webkit-scrollbar {
		/* 隐藏滚动条，但依旧具备可以滚动的功能 */
		display: none;
		width: 0;
		height: 0;
		color: transparent;
		background: transparent;
	}

	/deep/::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
		background: transparent;
	}
</style>
