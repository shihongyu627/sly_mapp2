<template>
	<view class="address-edit-content" :data-theme="themeStyle">
		<view class="edit-wrap">
			<block>
				<view class="edit-item">
					<text class="tit">
						类型
					</text>
					<picker v-if="billType!='assets'" @change="pickerEventGroup($event)" mode='selector'
						:range="groupList" range-key="name" :value="index">
						<view class="select-right">
							<text class="select-address "
								:class="{ empty: !formData.title, 'color-tip': !formData.title }">
								{{ formData.title ? formData.title : '点击选择' }}
							</text>
							<text class="iconfont iconright cell-more"></text>
						</view>
					</picker>
					<view class="select-right" v-if="billType=='assets'">
						<text class="select-address " :class="{ empty: !formData.title, 'color-tip': !formData.title }">
							{{ formData.title ? formData.title : '暂无' }}
						</text>
					</view>
				</view>
			</block>
			<view class="edit-item">
				<text class="tit">
					金额
				</text>
				<input class="uni-input" type="number" placeholder-class="placeholder-class" placeholder="请填写费用金额"
					money="money" v-model="formData.money" />
			</view>
			<block>
				<view class="edit-item" v-if="type=='date_month'">
					<text class="tit">
						分摊月份
					</text>
					<picker @change="pickerEventMonthGroup($event)" mode='selector' :range="monthList" range-key="value"
						:value="index">
						<view class="select-right">
							<text class="select-address "
								:class="{ empty: !formData.date_month, 'color-tip': !formData.date_month }">
								{{ formData.date_month ? formData.date_month : '点击选择' }}
							</text>
							<text class="iconfont iconright cell-more"></text>
						</view>
					</picker>
				</view>
			</block>
			<block>
				<view class="edit-item">
					<text class="tit">
						付款时间
					</text>
					<picker mode="date" :value="formData.pay_time" @change="bindMonthChange">
						<view class="select-right">
							<text class="select-address " :class="{ empty: !date, 'color-tip': !date }">
								{{ date ? date : '点击选择' }}
							</text>
							<text class="iconfont iconright cell-more"></text>
						</view>
					</picker>
				</view>
			</block>
			<view class="edit-item">
				<text class="tit">
					备注
				</text>
				<input class="uni-input" type="text" placeholder-class="placeholder-class" placeholder="请输入"
					v-model="formData.content" content='content' />
			</view>
		</view>
		<view class="btn">
			<button type="primary" class="add" @click="saveAddress">确定</button>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import pickRegions from '@/components/pick-regions/pick-regions.vue';
	import validate from 'common/js/validate.js';
	import globalConfig from '@/common/js/golbalConfig.js';
	import Config from '@/common/js/config.js';
	import dayjs from 'dayjs'
	export default {
		components: {
			pickRegions
		},
		data() {
			return {
				formData: {
					pay_time: '',
					title: '',
					content: '',
					type: '',
					money: '',
					date_month: ''
				},
				back: '', // 返回页
				redirect: 'redirectTo', // 跳转方式
				flag: false, //防重复标识
				defaultRegions: [],
				localType: 1,
				groupList: [],
				monthList: [{
					value: '12'
				}, {
					value: '24'
				}, {
					value: '36'
				}],
				date: '',
				type: '',
				billType: ''
			};
		},
		onLoad(option) {
			//assets
			this.billType = option.type || ''
			if (option.type == 'assets') {
				this.type = 'date_month'
				this.formData.title='固定资产'
				this.formData.type='type6'
			}
			this.typelists()
		},
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
			//选择分组
			pickerEventGroup(e) {
				let index = e.target.value;
				console.log(e, index);
				this.formData.title = this.groupList[index].name;
				this.formData.type = this.groupList[index].value;
				this.type = this.groupList[index].type;
				if (this.type != 'date_month') {
					this.formData.date_month = '';
				}
			},
			pickerEventMonthGroup(e) {
				let index = e.target.value;
				console.log(e, index);
				this.formData.date_month = this.monthList[index].value;
			},
			bindMonthChange(e) {
				this.date = e.detail.value
				this.formData.pay_time = dayjs(e.detail.value).unix() + ''
			},
			vertify() {
				this.formData.money = this.formData.money.trim();
				this.formData.title = this.formData.title.trim();
				this.formData.pay_time = this.formData.pay_time.trim();
				console.log(this.type, 89);

				var rule = [{
						name: 'title',
						checkType: 'required',
						errorMsg: '请选择类型'
					},
					{
						name: 'money',
						checkType: 'required',
						errorMsg: '请输入金额'
					},

					{
						name: 'pay_time',
						checkType: 'required',
						errorMsg: '请选择付款时间'
					},
				];
				if (this.type == 'date_month') {
					let dd = {
						name: 'date_month',
						checkType: 'required',
						errorMsg: '请选择分摊月份'
					}
					this.formData.date_month = this.formData.date_month.trim();
					rule.push(dd)
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
			typelists() {
				this.$api.sendRequest({
					url: '/dealer/api/cashbook/typelists',
					data: {},
					success: res => {
						if (res.code == 0 && res.data) {
							this.groupList = res.data;
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			saveAddress() {
				if (this.flag) return;
				this.flag = true;
				if (this.vertify()) {
					// let data = {
					// 	type: this.formData.type,
					// 	title: this.formData.title,
					// 	content: this.formData.content,
					// 	money: this.formData.money,
					// 	pay_time: this.formData.pay_time,
					// };
					console.log(this.formData);
					this.$api.sendRequest({
						url: '/dealer/api/cashbook/add',
						data: this.formData,
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

		.select-right {
			display: flex;
			flex-direction: row;
			align-items: center;
		}

		.cell-more {
			color: #909399;
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
