<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<mescroll-uni ref="mescroll" @getData="getListData" v-if="token">
			<block slot="list">
				<view class="address-list">
					<template v-if="addressList.length !== 0">
						<view class="address-item" v-for="(item, index) in addressList" :key="index">
							<view class="address-item-top" v-if="localType == 2 && item.local_data">
								<view class="address-top-info">
									<view class="address-name">{{ item.name }}</view>
									<view class="address-tel">{{ item.mobile }}</view>
									<view class="address-status" v-if="localType == 2 && item.local_data">{{ item.local_data }}</view>
								</view>
								<view class="address-info">{{ $util.removeComma(item.full_address) }}{{ item.address }}</view>
							</view>

							<view class="address-item-top" v-else @click="setDefault(item.id)">
								<view class="address-top-info">
									<view class="address-name">{{ item.name }}</view>
									<view class="address-tel">{{ item.mobile }}</view>
								</view>
								<view class="address-info">{{  $util.removeComma(item.full_address)  }}{{ item.address }}</view>
							</view> 

							<view class="address-item-bottom">
								<view class="address-default" @click="setDefault(item.id)">
									<view class="iconfont" :class="item.is_default == 1 ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'"></view>
									<text class="default" v-if="localType == 2 && item.local_data" :class="{ 'color-base-text': item.is_default == 1 }">默认地址</text>
									<text class="default" v-else :class="{ 'color-base-text': item.is_default == 1 }">默认地址</text>
								</view>
								<view class="address-btn">
									<text class="edit" @click="addAddress('edit', item.id)">
										<text class="iconfont iconbianji"></text>
										{{ $lang('modify') }}
									</text>
									<text class="delete" v-if="item.is_default != 1" @click="deleteAddress(item.id, item.is_default)">
										<text class="iconfont iconicon7"></text>
										{{ $lang('del') }}
									</text>
								</view>
							</view>
						</view>
						<view class="btn-add">
							<!-- #ifdef MP-WEIXIN -->
						<!-- 	<view class="wx-add" @click="getChooseAddress()" v-if="local != 1">
								<text class="">{{ $lang('getAddress') }}</text>
							</view> -->
							<!-- #endif -->
							<!-- #ifdef H5 -->
							<button type="primary" class="add-address" @click="getChooseAddress()" v-if="$util.isWeiXin() && local != 1">{{ $lang('getAddress') }}</button>
							<!-- #endif -->
							<button type="primary" class="add-address" @click="addAddress('add')">
								<text class="iconfont iconadd1"></text>
								{{ $lang('newAddAddress') }}
							</button>
						</view>
					</template>
					<view v-if="addressList.length == 0 && showEmpty" class="empty-box cart-empty"><ns-empty text="暂无可用地址" :isIndex="isIndex"></ns-empty></view>
					<view class="button-wrap" v-if="addressList.length == 0 && showEmpty">
						<!-- #ifdef H5 -->
						<!-- <button type="primary" class="add-address" @click="getChooseAddress()" v-if="$util.isWeiXin() && local != 1">{{ $lang('getAddress') }}</button> -->
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO -->
					<!-- 	<view class="wx-add" @click="getChooseAddress()" v-if="local != 1">
							<text class="">{{ $lang('getAddress') }}</text>
						</view> -->
						<!-- <button type="primary" class="add-wx color-base-text" @click="getChooseAddress()">{{ $lang('getAddress') }}</button> -->
						<!-- #endif -->

						<button type="primary" class="add-address" @click="addAddress('add')">
							<text class="iconfont iconadd1"></text>
							{{ $lang('newAddAddress') }}
						</button>
					</view>
				</view>
			</block>
		</mescroll-uni>
		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import { Weixin } from 'common/js/wx-jssdk.js';

export default {
	data() {
		return {
			addressList: [],
			back: '', // 返回页
			redirect: 'redirectTo', // 跳转方式
			isIndex: false,
			showEmpty: false,
			local: 0, //定位是否显示
			localType: 1,
			token: null
		};
	},
	onLoad(option) {
		if (option.back) {
			this.back = option.back;
			uni.setStorageSync('addressBack', option.back);
		} else {
			if (uni.getStorageSync('addressBack')) {
				this.back = uni.getStorageSync('addressBack');
				uni.removeStorageSync('addressBack');
			}
		}
		if (option.redirect) this.redirect = option.redirect;
		if (option.local) this.local = option.local;
		if (option.type) this.localType = option.type;
	},
	onShow() {
		uni.removeStorageSync('addressInfo');

		if (uni.getStorageSync('token')) {
			this.token = uni.getStorageSync('token');
			if (this.$refs.mescroll) this.$refs.mescroll.refresh();
		} else {
			setTimeout(() => {
				this.$refs.login.open('/pages_tool/member/address');
			});
		}
	},
	methods: {
		getListData(mescroll) {
			this.showEmpty = false;
			this.$api.sendRequest({
				url: '/api/memberaddress/page',
				data: {
					page: mescroll.num,
					page_size: mescroll.size,
					type: this.localType
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
					if (mescroll.num == 1) this.addressList = []; //如果是第一页需手动制空列表
					this.addressList = this.addressList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},

		/* 地址跳转 */
		addAddress(type, id) {
			let data = {
				type: this.localType
			};
			if (type == 'edit') data.id = id;
			if (this.back) data.back = this.back;

			this.$util.redirectTo('/pages_tool/member/address_edit', data);
		},
		/* 删除地址信息 */
		deleteAddress(id, is_default) {
			uni.showModal({
				title: '操作提示',
				content: '确定要删除该地址吗？',
				success: res => {
					if (res.confirm) {
						if (is_default == 1) {
							this.$util.showToast({
								title: '默认地址，不能删除'
							});
							return;
						}
						this.$api.sendRequest({
							url: '/api/memberaddress/delete',
							data: {
								id: id
							},
							success: res => {
								if (res.code == 0) {
									this.$util.showToast({
										title: '删除成功'
									});
								} else {
									this.$util.showToast({
										title: '删除失败'
									});
								}
								this.$refs.mescroll.refresh();
							},
							fail: res => {
								mescroll.endErr();
							}
						});
					}
				}
			});
		},
		setDefault(id) {
			this.$api.sendRequest({
				url: '/api/memberaddress/setdefault',
				data: {
					id
				},
				success: res => {
					if (res.data > 0) {
						this.$refs.mescroll.refresh();
						if (this.back != '') {
							this.$util.redirectTo(this.back, {}, 'redirectTo');
						} else {
							this.$refs.mescroll.refresh();
							this.$util.showToast({
								title: '修改默认地址成功'
							});
						}
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		},
		/**
		 * 一键获取地址
		 */
		getChooseAddress() {
			// #ifdef H5
			if (this.$util.isWeiXin()) {
				if (uni.getSystemInfoSync().platform == 'ios') {
					var url = uni.getStorageSync('initUrl');
				} else {
					var url = location.href;
				}
				// 获取jssdk配置
				this.$api.sendRequest({
					url: '/wechat/api/wechat/jssdkconfig',
					data: {
						url: url
					},
					success: jssdkRes => {
						if (jssdkRes.code == 0) {
							var wxJS = new Weixin();
							wxJS.init(jssdkRes.data);
							wxJS.openAddress(res => {
								if (res.errMsg == 'openAddress:ok') {
									this.saveAddress({
										name: res.userName, // 收货人姓名,
										mobile: res.telNumber, // 手机号
										province: res.provinceName, // 省
										city: res.cityName, // 市
										district: res.countryName, // 县
										address: res.detailInfo, // 详细地址
										full_address: res.provinceName + '-' + res.cityName + '-' + res.countryName,
										is_default: 1
									});
								} else {
									this.$util.showToast({
										title: res.errMsg == 'openAddress:function not implement' ? 'PC端微信不支持一键获取地址' : res.errMsg
									});
								}
							});
						} else {
							this.$util.showToast({
								title: jssdkRes.message
							});
						}
					}
				});
			}
			// #endif

			// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO
			uni.chooseAddress({
				success: res => {
					if (res.errMsg == 'chooseAddress:ok') {
						this.saveAddress({
							name: res.userName, // 收货人姓名,
							mobile: res.telNumber, // 手机号
							province: res.provinceName, // 省
							city: res.cityName, // 市
							district: res.countyName, // 县
							address: res.detailInfo, // 详细地址
							full_address: res.provinceName + '-' + res.cityName + '-' + res.countyName,
							is_default: 1
						});
					} else {
						this.$util.showToast({
							title: res.errMsg
						});
					}
				}
			});
			// #endif
		},
		/**
		 * 保存微信地址
		 * @param {Object} params
		 */
		saveAddress(params) {
			this.$api.sendRequest({
				url: '/api/memberaddress/addthreeparties',
				data: params,
				success: res => {
					if (res.code >= 0) {
						
						if (this.back != '') {
							this.$util.redirectTo(this.back, {}, 'redirectTo');
						} else {
							this.$refs.mescroll.refresh();
						}
						
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		}
	},
	watch: {
		storeToken: function(nVal, oVal) {
			if (nVal) {
				this.token = nVal;
				this.$refs.mescroll.refresh();
			}
		}
	},
	computed: {
		storeToken() {
			return this.$store.state.token;
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
	padding-top: 208rpx !important;
}

.address-list {
	width: 100%;
	height: 100%;
	padding-bottom: 40rpx;
	.local {
		display: flex;
		align-items: center;
		margin: $margin-updown $margin-both;
		background-color: #fff;
		padding: 30rpx;
		border-radius: $border-radius;
		text {
			margin-right: 10rpx;
		}
	}

	.address-item {
		margin: $padding 0 0;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
		padding: 30rpx;
		box-sizing: border-box;
		border-radius: 0;

		.address-item-top {
			display: flex;
			flex-direction: column;
			border-bottom: 1rpx solid $color-line;

			.address-top-info {
				display: flex;
				justify-content: flex-start;
				position: relative;
				.address-name {
					color: #000000;
					font-size: $font-size-toolbar;
				}

				.address-tel {
					color: #000000;
					font-size: $font-size-toolbar;
					margin-left: 26rpx;
				}
				.address-status {
					color: #f00;
					font-size: $font-size-base;
					position: absolute;
					right: 0;
				}
			}

			.address-info {
				font-size: $font-size-base;
				color: $color-tip;
				margin-top: 10rpx;
				margin-bottom: 28rpx;
			}
		}

		.address-item-bottom {
			display: flex;
			justify-content: space-between;
			padding-top: 30rpx;

			.address-default {
				display: flex;
				align-items: center;
				font-size: $font-size-base;
				line-height: 1;

				.default {
					padding-left: 10rpx;
				}

				.iconfont {
					line-height: 1;
				}
			}

			.address-btn {
				font-size: $font-size-base;
				line-height: 1;
				display: flex;
				align-items: center;

				.edit {
					text {
						vertical-align: center;
						margin-right: 10rpx;
						font-size: 30rpx;
					}
				}

				.delete {
					padding-left: 40rpx;

					text {
						margin-right: 10rpx;
						font-size: 26rpx;
					}
				}
			}
		}
	}

	.btn-add {
		margin-top: 60rpx;
		bottom: 0;
		width: 100%;
		background: #fff;
		position: fixed;
		padding: 0 30rpx;
		box-sizing: border-box;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		.add-address {
			height: 80rpx;
			line-height: 80rpx;
			border-radius: $border-radius;
			margin: 30rpx 0 30rpx;

			text {
				margin-right: 10rpx;
				font-size: $font-size-base;
			}
		}
	}

	.wx-add {
		margin-top: 30rpx;
		margin-bottom: 30rpx;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		border: 2rpx solid #cccccc;
		border-radius: $border-radius;
	}
}

.button-wrap {
	height: 250rpx;
	margin: auto;
	margin-top: 30rpx;
	width: calc(100% - 60rpx);

	z-index: 9;
	text-align: center;
	overflow: hidden;

	.add-address {
		height: 80rpx;
		line-height: 80rpx;
		border-radius: $border-radius;
		margin: 30rpx 0 30rpx;

		text {
			margin-right: 10rpx;
			font-size: $font-size-base;
		}
	}

	.add-wx {
		background-color: none;
		margin-top: 30rpx;
		margin-bottom: 30rpx;
		width: 100%;
		text-align: center;
		height: 92rpx;
		line-height: 92rpx;
		border: 2rpx solid #cccccc;
		border-radius: 92rpx;
	}
}
</style>
