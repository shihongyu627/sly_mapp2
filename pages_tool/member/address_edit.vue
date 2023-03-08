<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="address-edit-content">
		<view class="edit-wrap">
			<view class="tip">地址信息</view>
			<view class="edit-item">
				<text class="tit">
					{{ $lang('consignee') }}
					<text>*</text>
				</text>
				<input
					class="uni-input"
					type="text"
					placeholder-class="placeholder-class"
					:placeholder="$lang('consigneePlaceholder')"
					maxlength="30"
					name="name"
					v-model="formData.name"
				/>
			</view>
			<view class="edit-item">
				<text class="tit">
					{{ $lang('mobile') }}
					<text>*</text>
				</text>
				<input class="uni-input" type="number" placeholder-class="placeholder-class" :placeholder="$lang('mobilePlaceholder')" maxlength="11" v-model="formData.mobile" />
			</view>
			<view class="edit-item">
				<text class="tit">{{ $lang('telephone') }}</text>
				<input
					class="uni-input"
					type="text"
					placeholder-class="placeholder-class"
					:placeholder="$lang('telephonePlaceholder')"
					maxlength="20"
					v-model="formData.telephone"
				/>
			</view>
			<!--  外卖地址区分 -->
			<block v-if="localType == 2">
				<view class="edit-item">
					<text class="tit">
						{{ $lang('receivingCity') }}
						<text>*</text>
					</text>
					<view class="text_inp" :class="{ empty: !formData.full_address, 'color-tip': !formData.full_address }" @click="selectAddress">
						{{ formData.full_address ? formData.full_address : '请选择省市区县' }}
					</view>

					<text @click="selectAddress" class="padding-left iconfont iconlocation"></text>
				</view>
			</block>
			<block v-else>
				<view class="edit-item">
					<text class="tit">
						{{ $lang('receivingCity') }}
						<text>*</text>
					</text>
					<pick-regions :default-regions="defaultRegions" @getRegions="handleGetRegions">
						<text class="select-address " :class="{ empty: !formData.full_address, 'color-tip': !formData.full_address }">
							{{ formData.full_address ? formData.full_address : '请选择省市区县' }}
						</text>
					</pick-regions>
				</view>
			</block>

			<view class="edit-item">
				<text class="tit" style="">
					{{ $lang('address') }}
					<text>*</text>
				</text>
				<input class="uni-input" type="text" placeholder-class="placeholder-class" :placeholder="$lang('addressPlaceholder')" maxlength="50" v-model="formData.address" />
				<!-- <textarea class="uni-input  " type="text" placeholder-class="placeholder-class" :placeholder="$lang('addressPlaceholder')" maxlength="50" v-model="formData.address" ></textarea> -->
			</view>
		</view>
		<view class="btn">
			<button type="primary" class="add" @click="saveAddress">{{ $lang('save') }}</button>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import pickRegions from '@/components/pick-regions/pick-regions.vue';
import validate from 'common/js/validate.js';
import Config from '@/common/js/config.js';
export default {
	components: {
		pickRegions
	},
	data() {
		return {
			formData: {
				id: 0,
				name: '',
				mobile: '',
				telephone: '',
				province_id: '',
				city_id: '',
				district_id: '',
				community_id: '',
				address: '',
				full_address: '',
				latitude: 0,
				longitude: 0,
				is_default: 1
			},
			address: '',
			addressValue: '',
			back: '', // 返回页
			redirect: 'redirectTo', // 跳转方式
			flag: false, //防重复标识
			defaultRegions: [],
			localType: 1
		};
	},
	onLoad(option) {
		if (option.back) this.back = option.back;
		if (option.redirect) this.redirect = option.redirect;
		if (option.type) this.localType = option.type;
		if (option.id && !option.name) {
			this.formData.id = option.id;
			this.getAddressDetail();
		} else if (option.name) {
			if (uni.getStorageSync('addressInfo')) this.formData = uni.getStorageSync('addressInfo');
			this.formData.address = option.name;
			this.localType = 2;
			this.getAddress(option.latng);
			//给formData复制
			var tempArr = this.getQueryVariable('latng').split(',');
			this.formData.latitude = tempArr[0];
			this.formData.longitude = tempArr[1];
		} else {
			if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
		}
	},
	onBackPress() {
		uni.setStorageSync('addressInfo', '');
	},
	onShow() {
		if (this.formData.id) {
			uni.setNavigationBarTitle({
				title: '编辑收货地址'
			});
		} else {
			uni.setNavigationBarTitle({
				title: '新增收货地址'
			});
		}
	},
	onReady() {
		this.$refs.loadingCover.hide();
	},
	onHide() {
		this.flag = false;
	},
	methods: {
		// 获取地址信息
		getAddressDetail() {
			this.$api.sendRequest({
				url: '/api/memberaddress/info',
				data: {
					id: this.formData.id
				},
				success: res => {
					let data = res.data;
					if (data != null) {
						this.formData.name = data.name;
						this.formData.mobile = data.mobile;
						this.formData.telephone = data.telephone;
						this.formData.address = data.address;
						this.formData.full_address = data.full_address;
						this.formData.latitude = data.latitude;
						this.formData.longitude = data.longitude;
						this.formData.is_default = data.is_default;
						this.localType = data.type;
						this.defaultRegions = [data.province_id, data.city_id, data.district_id];
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		//获取详细地址
		getAddress(value) {
			this.$api.sendRequest({
				url: '/api/memberaddress/tranAddressInfo',
				data: {
					latlng: value
				},
				success: res => {
					if (res.code == 0) {
						this.formData.full_address = '';
						this.formData.full_address += res.data.province != undefined ? res.data.province : '';
						this.formData.full_address += res.data.city != undefined ? '-' + res.data.city : '';
						this.formData.full_address += res.data.district != undefined ? '-' + res.data.district : '';
						this.addressValue = '';
						this.addressValue += res.data.province_id != undefined ? res.data.province_id : '';
						this.addressValue += res.data.city_id != undefined ? '-' + res.data.city_id : '';
						this.addressValue += res.data.district_id != undefined ? '-' + res.data.district_id : '';
					} else {
						this.showToast({
							title: '数据有误'
						});
					}
				}
			});
		},
		// 获取选择的地区
		handleGetRegions(regions) {
			this.formData.full_address = '';
			this.formData.full_address += regions[0] != undefined ? regions[0].label : '';
			this.formData.full_address += regions[1] != undefined ? '-' + regions[1].label : '';
			this.formData.full_address += regions[2] != undefined ? '-' + regions[2].label : '';
			this.addressValue = '';
			this.addressValue += regions[0] != undefined ? regions[0].value : '';
			this.addressValue += regions[1] != undefined ? '-' + regions[1].value : '';
			this.addressValue += regions[2] != undefined ? '-' + regions[2].value : '';
		},

		selectAddress() {
			// #ifdef MP
			uni.chooseLocation({
				success: res => {
					this.formData.latitude = res.latitude;
					this.formData.longitude = res.longitude;
					this.formData.address = res.name;
					this.getAddress(res.latitude + ',' + res.longitude);
				},
				fail(res) {
					uni.getSetting({
						success: function(res) {
							var statu = res.authSetting;
							if (!statu['scope.userLocation']) {
								uni.showModal({
									title: '是否授权当前位置',
									content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
									success(tip) {
										if (tip.confirm) {
											uni.openSetting({
												success: function(data) {
													if (data.authSetting['scope.userLocation'] === true) {
														this.$util.showToast({
															title: '授权成功'
														});
														//授权成功之后，再调用chooseLocation选择地方
														setTimeout(function() {
															uni.chooseLocation({
																success: data => {
																	this.formData.latitude = res.latitude;
																	this.formData.longitude = res.longitude;
																	this.formData.address = res.name;
																	this.getAddress(res.latitude + ',' + res.longitude);
																}
															});
														}, 1000);
													}
												}
											});
										} else {
											this.$util.showToast({
												title: '授权失败'
											});
										}
									}
								});
							}
						}
					});
				}
			});
			// #endif
			// #ifdef H5
			var urlencode = this.formData;
			uni.setStorageSync('addressInfo', urlencode);
			let backurl = Config.h5Domain + '/pages_tool/member/address_edit?type=' + this.localType;
			if (this.formData.id) backurl += '&id=' + this.formData.id;
			if (this.back) backurl += '&back=' + this.back;

			window.location.href = 'https://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl=' + encodeURIComponent(backurl) + '&key=' + Config.mpKey + '&referer=myapp';
			// #endif
		},

		getQueryVariable(variable) {
			var query = window.location.search.substring(1);
			var vars = query.split('&');
			for (var i = 0; i < vars.length; i++) {
				var pair = vars[i].split('=');
				if (pair[0] == variable) {
					return pair[1];
				}
			}
			return false;
		},
		vertify() {
			this.formData.name = this.formData.name.trim();
			this.formData.mobile = this.formData.mobile.trim();
			this.formData.address = this.formData.address.trim();
			var rule = [
				{
					name: 'name',
					checkType: 'required',
					errorMsg: '请输入姓名'
				},
				{
					name: 'mobile',
					checkType: 'required',
					errorMsg: '请输入手机号'
				},
				{
					name: 'mobile',
					checkType: 'phoneno',
					errorMsg: '请输入正确的手机号'
				},
				{
					name: 'full_address',
					checkType: 'required',
					errorMsg: '请选择省市区县'
				},
				{
					name: 'address',
					checkType: 'required',
					errorMsg: '详细地址不能为空'
				}
			];
			var checkRes = validate.check(this.formData, rule);
			if (checkRes) {
				return true;
			} else {
				this.$util.showToast({
					title: validate.error
				});
				this.flag = false;
				return false;
			}
		},
		saveAddress() {
			if (this.flag) return;
			this.flag = true;
			if (this.vertify()) {
				let addressValueArr = this.addressValue.split('-'),
					data = {},
					url = '';

				data = {
					name: this.formData.name,
					mobile: this.formData.mobile,
					telephone: this.formData.telephone,
					province_id: addressValueArr[0],
					city_id: addressValueArr[1],
					district_id: addressValueArr[2] ? addressValueArr[2] : '',
					community_id: 0,
					address: this.formData.address,
					full_address: this.formData.full_address,
					latitude: this.formData.latitude,
					longitude: this.formData.longitude,
					is_default: this.formData.is_default,
					type: this.localType
				};

				url = 'add';
				if (this.formData.id) {
					url = 'edit';
					data.id = this.formData.id;
					if (this.back != '') data.is_default = 1;
				}
				this.$api.sendRequest({
					url: '/api/memberaddress/' + url,
					data: data,
					success: res => {
						this.flag = false;

						if (res.code == 0) {
							if (this.back != '') {
								this.$util.redirectTo(this.back, {}, 'redirectTo');
							} else {
								this.$util.showToast({
									title: res.message
								});
								uni.navigateBack({
									delta: 1
								});
							}
							uni.removeStorageSync('addressInfo');
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					},
					fail: res => {
						this.flag = false;
					}
				});
			}
		}
	}
};
</script>

<style lang="scss">
/deep/ pick-regions,
.pick-regions {
	flex: 1;
}

.edit-wrap {
	background: #fff;
	overflow: hidden;

	.tip {
		padding: 20rpx 30rpx 10rpx;
		background-color: #f8f8f8;
		color: $color-tip;
	}
}

.edit-item {
	display: flex;
	align-items: center;
	margin: 0 30rpx;
	min-height: 100rpx;
	background-color: #fff;

	.text_inp {
		margin-left: $margin-updown;
		flex: 1;
	}

	.tit {
		width: 148rpx;

		text {
			margin-left: 10rpx;
			color: #ff4544;
		}

		&.margin_tit {
			align-self: flex-start;
			margin-top: 24rpx;
		}
	}

	.iconlocation {
		color: #606266;
		align-self: flex-start;
		margin-top: 20rpx;
	}

	.select-address {
		display: block;
		margin-left: 10rpx;

		&.empty {
			color: #808080;
		}
	}

	textarea,
	input {
		flex: 1;
		font-size: $font-size-base;
		margin-left: 20rpx;
		padding: 0;
	}

	textarea {
		margin-top: 6rpx;
		height: 100rpx;
		padding-bottom: 20rpx;
		padding-top: 20rpx;
		line-height: 50rpx;
	}
}

.edit-wrap > .edit-item + .edit-item {
	border-top: 2rpx solid #ebedf0;
}

.add {
	margin-top: 60rpx;
	height: 80rpx;
	line-height: 80rpx !important;
	border-radius: $border-radius;
	font-weight: 500;
	width: calc(100% - 60rpx);
	margin-left: 30rpx;
}

.btn {
	position: fixed;
	width: 100%;
	bottom: 30rpx;
	height: auto;
	padding-bottom: constant(safe-area-inset-bottom);
	/*兼容 IOS<11.2*/
	padding-bottom: env(safe-area-inset-bottom);
	/*兼容 IOS>11.2*/
}
</style>
