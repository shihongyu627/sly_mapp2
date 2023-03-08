<template>
	<view class="process-wrap">
		<view class="popBox">
			<view class="edit-item">
				<text class="tit">
					姓名
				</text>
				<input class="uni-input" type="text" placeholder-class="placeholder-class" placeholder="请输入"
					maxlength="30" name="name" v-model="formData.name" />
			</view>
			<view class="edit-item">
				<text class="tit">
					联系方式
				</text>
				<input class="uni-input" type="number" placeholder-class="placeholder-class" placeholder="请输入"
					maxlength="11" name="mobile" v-model="formData.mobile" />
			</view>
			<picker @change="pickerEventWayGroup($event)" mode='selector' :range="waylists" range-key="way_name"
				:value="index">
				<view class="edit-item">
					<text class="tit">
						合作方式
					</text>
					<view class="select-address"
						:class="{ empty: !formData.way_name, 'color-tip': !formData.way_name }">
						{{ formData.way_name ? formData.way_name : '请选择合作方式' }}
					</view>
				</view>
			</picker>
			<view class="edit-item">
				<text class="tit">
					所在城市
				</text>
				<view class="edit-item-right">
					<pick-regions :default-regions="defaultRegions" @getRegions="handleGetRegions">
						<text class="select-address "
							:class="{ empty: !formData.full_address, 'color-tip': !formData.full_address }">
							{{ formData.full_address ? formData.full_address : '请选择省市区县' }}
						</text>
					</pick-regions>
				</view>
			</view>
			<picker @change="pickerEventChannelGroup($event)" mode='selector' :range="channellists" range-key="from"
				:value="index">
				<view class="edit-item">
					<text class="tit">
						了解渠道
					</text>
					<text class="select-address " :class="{ empty: !formData.from, 'color-tip': !formData.from }">
						{{ formData.from ? formData.from : '请选择渠道' }}
					</text>
				</view>
			</picker>
			<view class="footer-boxs">
				<view class="footer-bnt" @click="onSubmit()">
					立即申请
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		components: {},
		data() {
			return {
				formData: {
					name: '',
					mobile: '',
					type: 'store',
					full_address: '',
					way_name: '',
					from: '',
					province_id: "",
					city_id: "",
					district_id: "",
					address: '',
					type: ''
				},
				applyInfo: {},
				agreement: {},
				waylists: [{
					way_name: '门店',
					type: 'store'
				}, {
					way_name: '区域',
					type: 'region'
				}],
				channellists: [{
					from: '朋友介绍',
				}, {
					from: '线下店面',
				}, {
					from: '微信朋友圈',
				}, {
					from: '抖音',
				}, {
					from: '电视',
				}, {
					from: '其他',
				}],
			};
		},
		mixins: [],
		onLoad() {},
		methods: {
			//选择合作方式
			pickerEventWayGroup(e) {
				let index = e.target.value;
				console.log(e, index);
				this.formData.way_name = this.waylists[index].way_name;
				this.formData.type = this.waylists[index].type;
			},
			//选择渠道
			pickerEventChannelGroup(e) {
				let index = e.target.value;
				console.log(e, index);
				this.formData.from = this.channellists[index].from;
			},
			// 获取选择的地区
			handleGetRegions(regions) {
				this.formData.full_address = '';
				this.formData.full_address += regions[0] != undefined ? regions[0].label : '';
				this.formData.full_address += regions[1] != undefined ? '-' + regions[1].label : '';
				this.formData.full_address += regions[2] != undefined ? '-' + regions[2].label : '';
				this.formData.province_id = regions[0] != undefined ? regions[0].value : '';
				this.formData.city_id = regions[1] != undefined ? regions[1].value : '';
				this.formData.district_id = regions[2] != undefined ? regions[2].value : '';
			},
			onSubmit() {
				this.$api.sendRequest({
					url: '/dealer/api/apply/cooperateApply',
					data: this.formData,
					success: res => {
						uni.showModal({
							title: '提示',
							content: res.message,
							confirmText: "确认",
							showCancel: false,
							success: res1 => {
								if (res1.confirm) {
									if (res.code == 0) {
										uni.navigateBack()
									}
								}
							}
						})

					}
				});
			},
		}
	};
</script>

<style scoped lang="scss">
	.process-wrap {
		padding-bottom: 60px;
		box-sizing: border-box;
	}

	.process-header {
		width: 100%;
		// height: 132px;
		// background-image: url('http://sly.shanliangyou888.com/upload/1/common/images/20220907/20220907043943166253998333217.png');
		background-size: 100% 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.process-title {
		font-size: 22px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FFFFFF;
		opacity: 1;
		margin-left: 15px;
	}

	.process-text {
		font-size: 13px;
		font-family: PingFang SC;
		font-weight: normal;
		color: #FFFFFF;
		opacity: 0.6;
		margin-left: 15px;
	}

	.apply-item {
		width: 710rpx;
		height: 80px;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		margin-top: 10px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding-left: 14px;
		padding-right: 14px;
		box-sizing: border-box;
	}

	.item-left {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.item-index {
		width: 32px;
		height: 32px;
		background: #1189F4;
		border: 1px solid #1189F4;
		border-radius: 50%;
		opacity: 1;
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: bold;
		line-height: 32px;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
	}

	.item-content {
		margin-left: 14px;
	}

	.item-title {
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
	}

	.item-text {
		font-size: 13px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #65666E;
		opacity: 1;
	}

	.item-btn {
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #1189F4;
		opacity: 1;
	}

	.menu-icon {
		width: 26px;
		height: 26px;
	}

	.popBox {
		width: 100%;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		overflow: hidden;
		background: #FBFBFB !important;
	}

	.footer-boxs {
		width: 100%;
		height: 68px;
		background: #FFFFFF;
		box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.01);
		opacity: 1;
		border-radius: 0px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.footer-bnt {
		width: 710rpx;
		height: 48px;
		background: #1189F4;
		opacity: 1;
		border-radius: 24px;
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 48px;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
	}

	.popup-title {
		width: 750rpx;
		height: 60px;
		background: #FFFFFF;
		opacity: 1;
		text-align: center;
		line-height: 60px;
		position: relative;
		font-size: 18px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #454652;
		opacity: 1;
	}

	.pop-close {
		width: 26px;
		height: 26px;
		position: absolute;
		right: 15px;
		top: 18px;
	}

	.edit-item {
		display: flex;
		align-items: center;
		background-color: #fff;
		justify-content: space-between;
		width: 710rpx;
		height: 60px;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		margin-top: 10px;
		padding-left: 14px;
		padding-right: 14px;
		box-sizing: border-box;

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
</style>
