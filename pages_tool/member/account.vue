<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<mescroll-uni ref="mescroll" @getData="getData" v-if="token">
			<block slot="list">
				<view class="nc-info-list-content" v-if="dataList.length > 0">
					<view class="list-item" v-for="(item, index) in dataList" :key="index">
						<view class="item-top" @click="setDefault(item.id)">
							<view>
								<text class="top-title">{{ item.realname }}</text>
								<text class="top-num">{{ item.mobile }}</text>
							</view>
							<text v-if="item.withdraw_type == 'alipay'">提现账号：{{ item.bank_account }}</text>
							<text v-if="item.withdraw_type == 'bank'">银行名称 ：{{ item.branch_bank_name }}</text>
						</view>
						<view class="item-bottom">
							<text>账号类型 ：{{ item.withdraw_type_name }}</text>
							<view>
								<text @click.stop="editAccount('edit', item.id)">修改</text>
								<text v-if="item.is_default != 1" @click.stop="deleteAccount(item.id)">删除</text>
							</view>
						</view>
						<view v-if="item.is_default == 1" class="color-base-bg item-mr">默认</view>
					</view>
					<button class="add-account" type="primary" @click="editAccount('add')">{{ $lang('newAddAccount') }}</button>
				</view>
				<view v-else class="cart-empty">
					<ns-empty text="暂无账号信息" :isIndex="false" class="zw"></ns-empty>
					<button class="add-account" type="primary" @click="editAccount('add')">{{ $lang('newAddAccount') }}</button>
				</view>
			</block>
		</mescroll-uni>

		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
export default {
	data() {
		return {
			dataList: [], //账号列表
			back: '', // 返回页
			redirect: 'redirectTo', // 跳转方式
			token: null
		};
	},
	onLoad(option) {
		if (option.back) this.back = option.back;
		if (option.redirect) this.redirect = option.redirect;
	},
	onShow() {
		if (uni.getStorageSync('token')) {
			this.token = uni.getStorageSync('token');
			if (this.$refs.mescroll) this.$refs.mescroll.refresh();
		} else {
			setTimeout(() => {
				this.$refs.login.open('/pages_tool/member/account');
			});
		}
	},
	methods: {
		// 编辑提现账户信息
		editAccount(type, id) {
			let data = {};
			if (type == 'edit') data.id = id;
			if (this.back) data.back = this.back;
			this.$util.redirectTo('/pages_tool/member/account_edit', data);
		},
		deleteAccount(id) {
			uni.showModal({
				title: '操作提示',
				content: '确定要删除该账户吗？',
				success: res => {
					if (res.confirm) {
						this.$api.sendRequest({
							url: '/api/memberbankaccount/delete',
							data: {
								id: id
							},
							success: result => {
								if (result.code == 0) {
									this.$util.showToast({
										title: '删除成功'
									});
									this.$refs.mescroll.refresh();
								} else {
									this.$util.showToast({
										title: '删除失败'
									});
								}
							}
						});
					}
				}
			});
		},
		setDefault(id) {
			this.$api.sendRequest({
				url: '/api/memberbankaccount/setdefault',
				data: {
					id
				},
				success: res => {
					if (res.data >= 0) {
						if (this.back != '') {
							this.$util.redirectTo(this.back, {}, this.redirect);
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
		},
		getData(mescroll) {
			this.$api.sendRequest({
				url: '/api/memberbankaccount/page',
				data: {
					page_size: mescroll.size,
					page: mescroll.num
				},
				success: res => {
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
					if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
					this.dataList = this.dataList.concat(newArr); //追加新数据

					let withdrawType = {
						bank: '银行',
						alipay: '支付宝',
						wechatpay: '微信'
					};

					this.dataList.forEach(item => {
						item.withdraw_type_name = withdrawType[item.withdraw_type] ? withdrawType[item.withdraw_type] : '';
					});
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
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

<style lang="scss">
/deep/ .fixed {
	position: relative;
	top: 0;
}

/deep/ .empty {
	margin-top: 0 !important;
}

.cart-empty {
	padding-top: 208rpx !important;
}

.add-account {
	margin-top: 5vh;
	height: 80rpx;
	line-height: 80rpx;
}

.zw {
	margin-top: 250rpx;
}

.list-item {
	margin: 0 $margin-both;
	padding: $margin-both;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	background-color: #fff;
	margin-bottom: 18rpx;
	border-radius: 10rpx;
	overflow: hidden;
	position: relative;

	&:first-child {
		margin-top: 18rpx;
	}

	.item-mr {
		font-size: $font-size-activity-tag;
		color: #fff;
		height: 150rpx;
		width: 150rpx;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		position: absolute;
		right: -90rpx;
		top: -90rpx;
		transform: rotate(45deg);
	}

	.item-top {
		border-bottom: 2rpx solid $color-line;
		padding-bottom: 26rpx;
		display: flex;
		flex-direction: column;

		view {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: $margin-both;

			.top-title {
				font-size: $font-size-base;
				font-weight: 500;
			}

			.top-num {
				font-size: $font-size-tag;
				font-weight: 500;
				margin-right: 10rpx;
			}
		}

		text {
			color: $color-sub;
			font-size: $font-size-tag;
		}
	}

	.item-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 26rpx;

		text {
			font-size: $font-size-tag;
			color: $color-sub;
		}

		view {
			text {
				font-size: $font-size-tag;
				color: $color-tip;
				margin-left: 50rpx;
			}
		}
	}
}
</style>
<style>
/deep/ .mescroll-upwarp {
	padding-bottom: 150rpx;
}
</style>
