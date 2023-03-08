<template>
	<view class="address-edit-content" :data-theme="themeStyle">
		<view class="edit-wrap">
			<view class="edit-item">
				<text class="tit">
					姓名
				</text>
				<input class="uni-input" type="text" placeholder-class="placeholder-class" placeholder="请输入关联人的姓名"
					name="name" v-model="formData.name" />
			</view>
			<view class="edit-item">
				<text class="tit">
					关联用户
				</text>
				<input class="uni-input" type="number" placeholder-class="placeholder-class" placeholder="请输入关联人的手机号"
					maxlength="11" v-model="formData.mobile" />
			</view>
		</view>
		<view class="btn">
			<view class="add" @click="saveAddress">确定</view>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import pickRegions from '@/components/pick-regions/pick-regions.vue';
	import validate from 'common/js/validate.js';
	import globalConfig from '@/common/js/golbalConfig.js';
	import Config from '@/common/js/config.js';
	export default {
		components: {
			pickRegions
		},
		data() {
			return {
				formData: {
					name: '',
					mobile: '',
					type: ''
				},
				groupList: [],
				flag: false, //防重复标识
				type: ''
			};
		},
		onLoad(option) {
			this.formData.type = option.type == 'dealer' ? '1' : '2'
		},
		onBackPress() {},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
		},
		onReady() {
			this.$refs.loadingCover.hide();
		},
		onHide() {
			this.flag = false;
		},
		mixins: [globalConfig],
		methods: {
			vertify() {
				this.formData.name = this.formData.name.trim();
				this.formData.mobile = this.formData.mobile.trim();
				var rule = [{
						name: 'name',
						checkType: 'required',
						errorMsg: '请输入姓名'
					},
					{
						name: 'mobile',
						checkType: 'phoneno',
						errorMsg: '请输入正确的手机号'
					},
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
					let data = {
						name: this.formData.name,
						mobile: this.formData.mobile,
						type:this.formData.type
					};
					this.$api.sendRequest({
						url: '/dealer/api/auth/add',
						data: data,
						success: res => {
							this.flag = false;
							this.$util.showToast({
								title: res.message
							});
							if (res.code == 0) {
								uni.navigateBack({
									delta: 1
								});
							} else {}
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

<style lang="scss" scoped>
	/deep/ pick-regions,
	.pick-regions {
		flex: 1;
		// text-align: right;
	}

	.edit-wrap {
		background: #fff;
		overflow: hidden;
		width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		margin-top: 10px;

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
		justify-content: space-between;

		.text_inp {
			margin-left: $margin-updown;
			flex: 1;
		}

		.tit {
			width: 148rpx;
			font-size: 15px;
			font-family: PingFang SC;
			font-weight: bold;
			color: #000000;
			opacity: 1;

			text {
				margin-left: 10rpx;
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

		.edit-item-right {
			display: flex;
			flex-direction: row;
			align-items: center;
		}

		.select-address {
			display: block;
			text-align: right;
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
			text-align: right;
			// margin-right: 20rpx;
		}

		textarea {
			margin-top: 6rpx;
			height: 100rpx;
			padding-bottom: 20rpx;
			padding-top: 20rpx;
			line-height: 50rpx;
		}

		.placeholder-class {
			// text-align: right;
		}
	}

	.edit-wrap>.edit-item+.edit-item {
		border-top: 2rpx solid #ebedf0;
	}

	.add {
		// margin-top: 60rpx;
		height: 80rpx;
		line-height: 80rpx !important;
		border-radius: 80rpx;
		font-weight: 500;
		width: calc(100% - 60rpx);
		margin-left: 30rpx;
		background: #1189F4;
		color: #fff;
		text-align: center;
	}

	.btn {
		position: fixed;
		width: 100%;
		height: 68px;
		bottom: 0;
		left: 0;
		// padding-bottom: constant(safe-area-inset-bottom);
		/*兼容 IOS<11.2*/
		// padding-bottom: env(safe-area-inset-bottom);
		/*兼容 IOS>11.2*/
		background: #fff;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
</style>
