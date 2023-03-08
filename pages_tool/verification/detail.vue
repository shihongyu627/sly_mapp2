<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="container">
		<view class="site-wrap">
			<view class="site-header">
				<view class="shu color-base-bg"></view>
				<view class="order-detail font-size-base">订单明细</view>
			</view>
			<view class="xian"></view>
			<view class="site-body">
				<block v-for="(goodsItem, goodsIndex) in verifyInfo.item_array" :key="goodsIndex">
					<view class="goods-wrap">
						<view class="goods-img">
							<image :src="$util.img(goodsItem.img)" @error="imageError(goodsIndex)" mode="aspectFill">
							</image>
						</view>
						<view class="info-wrap">
							<view class="goods-info">
								<text class="goods-name font-size-base">{{ goodsItem.name }}</text>
							</view>
							<view class="money-wrap">
								<view class="align-right">
									{{ $lang('common.currencySymbol') }}{{ goodsItem.price | abs }}
								</view>
								<view class="align-right color-tip">
									<text class="iconfont iconclose"></text>
									{{ goodsItem.num }}
								</view>
							</view>
						</view>
					</view>
					<view class="all">
						<view class="all-num">共{{ goodsItem.num }}件商品</view>
						<view class="all-money color-base-text">
							<text>合计:</text>
							￥{{ goodsItem.all | abs }}
						</view>
					</view>
				</block>
				<view class="xian" v-if="verifyInfo&&verifyInfo.item_array"></view>
				<view class="order-cell" v-for="(remarkItem, remarkIndex) in verifyInfo.remark_array"
					:key="remarkIndex">
					<text class="tit">{{ remarkItem.title }}：</text>
					<view class="box">
						<text class="color-tip">{{ remarkItem.value }}</text>
						<view class="copy" @click="copy(remarkItem.value)" v-if="remarkItem.title == '订单编号'">复制</view>
					</view>
				</view>
			</view>
		</view>

		<view class="order-summary">
			<view class="site-header">
				<view class="shu color-base-bg"></view>
				<view class="order-detail">核销明细</view>
			</view>
			<view class="xian"></view>
			<view class="order-cell">
				<text class="tit">核销类型：</text>
				<view class="box">
					<text class="color-tip">{{ verifyInfo.verify_type_name }}</text>
				</view>
			</view>
			<block v-if="verifyInfo.is_verify">
				<view class="order-cell">
					<text class="tit">核销状态：</text>
					<view class="box"><text class="color-tip">已核销</text></view>
				</view>
				<view class="order-cell" v-if="verifyInfo.verify_time">
					<text class="tit">核销人员：</text>
					<view class="box">
						<text class="color-tip">{{ verifyInfo.verifier_name }}</text>
					</view>
				</view>
				<view class="order-cell" v-if="verifyInfo.verify_time">
					<text class="tit">核销时间：</text>
					<view class="box">
						<text class="color-tip">{{ $util.timeStampTurnTime(verifyInfo.verify_time) }}</text>
					</view>
				</view>
			</block>
		</view>
		<view class="verify-btn" @click="verify" v-if="verifyInfo.is_verify == 0"><button type="primary">确认使用</button>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				code: '',
				verifyInfo: {
					verify_content: {
						item_array: [],
						remark_array: []
					}
				},
				info: [],
				isSub: false
			};
		},
		onLoad(option) {
			if (option.code) this.code = option.code;
			// 小程序扫码进入
			if (option.scene) {
				var sceneParams = decodeURIComponent(option.scene);
				sceneParams = sceneParams.split('&');
				if (sceneParams.length) {
					sceneParams.forEach(item => {
						if (item.indexOf('code') != -1) this.code = item.split('-')[1];
					});
				}
			}
		},
		onShow() {

			if (uni.getStorageSync('token')) this.checkIsVerifier();
			else this.$util.redirectTo('/pages/member/index', {}, 'reLaunch');

			this.getVerifyInfo();
		},
		methods: {
			checkIsVerifier() {
				this.$api.sendRequest({
					url: '/api/verify/checkisverifier',
					success: res => {
						if (!res.data) {
							this.$util.showToast({
								title: '非核销员无此权限'
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages/member/index', {}, 'reLaunch');
							}, 1000);
						}
					}
				});
			},
			getVerifyInfo() {
				this.$api.sendRequest({
					url: '/api/verify/verifyInfo',
					data: {
						verify_code: this.code
					},
					success: res => {
						if (res.code >= 0) {
							this.verifyInfo = res.data;
							this.info = this.verifyInfo.remark_array.splice(0, 1);
							if (res.data.verify_type == 'subcard') {
								this.verifyInfo.item_array = null
							} else {
								this.verifyInfo.item_array.forEach(item => {
									item.all = item.num * item.price;
								});
							}
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						} else {
							this.$util.showToast({
								title: res.message
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages/member/index', {}, 'reLaunch');
							}, 1000);
						}
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			verify() {
				if (this.isSub) return;
				this.isSub = true;
				this.$api.sendRequest({
					url: '/api/verify/verify',
					data: {
						verify_code: this.code
					},
					success: res => {
						if (res.code >= 0) {
							uni.showModal({
								title: '提示',
								content: res.message,
								confirmText: "确认",
								showCancel: false,
								success: res1 => {
									if (res1.confirm) {
										uni.navigateBack()
									}
								}
							})
						} else {
							this.$util.showToast({
								title: res.message
							});
							this.isSub = false;
						}
					}
				});
			},
			imageError(index) {
				this.verifyInfo.item_array[index].img = this.$util.getDefaultImage().goods;
				this.$forceUpdate();
			},
			copy(str) {
				this.$util.copy(str);
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
