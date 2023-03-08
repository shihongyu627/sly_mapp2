<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="account-list-content">
		<view class="edit-item">
			<text class="tit">{{ $lang('name') }}</text>
			<input class="desc uni-input" type="text" maxlength="30" placeholder="请输入真实姓名" name="name" v-model="formData.realname" />
		</view>
		<view class="edit-item">
			<text class="tit">{{ $lang('mobilePhone') }}</text>
			<input class="desc uni-input" type="number" maxlength="11" placeholder="请输入手机号" v-model="formData.mobile" />
		</view>
		<view class="edit-item">
			<text class="tit">{{ $lang('accountType') }}</text>
			<picker @change="bindPickerChange" :value="index" :range="payList" class="picker">
				<text class="desc uni-input">{{ payList[index] }}</text>
				<text class="iconfont iconright"></text>
			</picker>
		</view>
		<view class="edit-item" v-if="formData.withdraw_type == 'bank'">
			<text class="tit">银行名称</text>
			<input class="desc uni-input" type="text" maxlength="50" placeholder="请输入银行名称" v-model.trim="formData.branch_bank_name" />
		</view>
		<view class="edit-item" v-if="formData.withdraw_type != 'wechatpay'">
			<text class="tit">提现账号</text>
			<input class="desc uni-input" type="text" maxlength="30" placeholder="请输入提现账号" v-model.trim="formData.bank_account" />
		</view>
		<view class="btn">
			<button type="primary" class="add" @click="saveAccount">{{ $lang('save') }}</button>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import validate from 'common/js/validate.js';
export default {
	data() {
		return {
			formData: {
				realname: '',
				mobile: '',
				withdraw_type: '',
				bank_account: '',
				branch_bank_name: ''
			},
			payList: [],
			index: 0,
			flag: false,
			transferType: [],
			accountInfo: null,
			back: ''
		};
	},
	onLoad(option) {
		if (option.id) this.formData.id = option.id;
		if (option.back) this.back = option.back;
	},
	onShow() {
		
		
		if (this.formData.id) {
			this.getAccountDetail(this.formData.id);
		} else {
			this.getTransferType();
		}
		if (this.formData.id) {
			uni.setNavigationBarTitle({
				title: '编辑账户'
			});
		} else {
			uni.setNavigationBarTitle({
				title: '新增账户'
			});
		}
	},
	methods: {
		getAccountDetail(id) {
			this.$api.sendRequest({
				url: '/api/memberbankaccount/info',
				data: {
					id: this.formData.id
				},
				success: res => {
					if (res.code == 0 && res.data) {
						this.accountInfo = res.data;
						this.formData.realname = res.data.realname;
						this.formData.mobile = res.data.mobile;
						this.formData.bank_account = res.data.bank_account;
						this.formData.branch_bank_name = res.data.branch_bank_name;
						this.formData.withdraw_type = res.data.withdraw_type;
					}
					this.getTransferType();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					this.getTransferType();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		/**
		 * 获取转账方式
		 */
		getTransferType() {
			this.payList = [];
			this.$api.sendRequest({
				url: '/api/memberwithdraw/transferType',
				success: res => {
					if (res.code >= 0 && res.data) {
						this.transferType = res.data;
						for (let v in this.transferType) {
							this.payList.push(this.transferType[v]);
						}

						if (this.payList.length == 1 && this.payList[0] == '银行卡') {
							this.formData.withdraw_type = 'bank';
						}

						this.payList.reverse();
						if (!this.formData.id && this.$refs.loadingCover) this.$refs.loadingCover.hide();

						if (this.accountInfo && this.$util.inArray(this.accountInfo.withdraw_type_name, this.payList) == -1) {
							this.payList.push(this.accountInfo.withdraw_type_name);
						}

						if (this.payList.length && this.accountInfo) {
							this.index = this.$util.inArray(this.accountInfo.withdraw_type_name, this.payList);
						}

						if (!this.formData.withdraw_type && this.payList.length) {
							switch (this.payList[0]) {
								case '银行卡':
									this.formData.withdraw_type = 'bank';
									break;
								case '支付宝':
									this.formData.withdraw_type = 'alipay';
									break;
								case '微信零钱':
									this.formData.withdraw_type = 'wechatpay';
									break;
							}
						}
					}
				}
			});
		},
		bindPickerChange(e) {
			this.index = e.detail.value;
			let value = '';
			for (let i in this.transferType) {
				if (this.transferType[i] == this.payList[this.index]) {
					value = i;
				}
			}
			if (value != '') this.formData.withdraw_type = value;
		},
		vertify() {
			var rule = [
				{
					name: 'realname',
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
					name: 'withdraw_type',
					checkType: 'required',
					errorMsg: '请选择账户类型'
				}
			];
			if (this.formData.withdraw_type == 'bank') {
				rule.push({
					name: 'branch_bank_name',
					checkType: 'required',
					errorMsg: '请输入银行名称'
				});
			}
			if (this.formData.withdraw_type != 'wechatpay') {
				rule.push({
					name: 'bank_account',
					checkType: 'required',
					errorMsg: '请输入提现账号'
				});
			}
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
		saveAccount() {
			if (this.flag) return;
			this.flag = true;
			if (this.vertify()) {
				let url = !this.formData.id ? 'add' : 'edit';
				let data = {};
				this.$api.sendRequest({
					url: '/api/memberbankaccount/' + url,
					data: {
						id: this.formData.id,
						realname: this.formData.realname,
						mobile: this.formData.mobile,
						withdraw_type: this.formData.withdraw_type,
						bank_account: this.formData.bank_account,
						branch_bank_name: this.formData.branch_bank_name
					},
					success: res => {
						if (res.code == 0) {
							if (!this.formData.id) {
								this.$util.showToast({
									title: '添加成功'
								});
							} else {
								this.$util.showToast({
									title: '修改成功'
								});
							}
							if (this.back != '') {
								this.$util.redirectTo(this.back, {}, this.redirect);
							} else {
								this.$util.redirectTo('/pages_tool/member/account');
							}
						} else {
							this.flag = false;
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
.account-list-content {
	margin: $margin-updown $margin-both;
	padding: 0 30rpx;
	background-color: #fff;
	border-radius: $border-radius;

	.edit-item {
		display: flex;
		align-items: center;
		padding: 0 $margin-both;
		padding: 30rpx 0;
		background-color: #fff;

		.tit {
			width: 120rpx;
		}

		.desc {
			flex: 1;
			margin-left: 20rpx;
			padding: 0;
		}

		&:first-of-type {
			margin-top: $uni-spacing-row-base;
		}

		.picker {
			flex: 1;

			text {
				&:last-child {
					line-height: 50rpx;
					float: right;
					color: $color-tip;
					font-size: $font-size-activity-tag;
				}
			}
		}
	}
}

.account-list-content > .edit-item + .edit-item {
	border-top: 2rpx solid $color-line;
}

.add {
	margin-top: 60rpx;
	height: 80rpx;
	line-height: 80rpx !important;
	font-weight: 500;
	width: calc(100% - 60rpx);
	margin-left: 30rpx;
}

.btn {
	position: fixed;
	left: 0;
	width: 100%;
	bottom: 30rpx;
	height: auto;
	padding-bottom: constant(safe-area-inset-bottom);
	/*兼容 IOS<11.2*/
	padding-bottom: env(safe-area-inset-bottom);
	/*兼容 IOS>11.2*/
}
</style>
