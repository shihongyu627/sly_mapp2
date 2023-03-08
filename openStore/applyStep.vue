<template>
	<view class="process-wrap">
		<!-- <view class="process-header" v-if="agreement.img">
			<image class="process-header" :src="$util.loadimg(agreement.img)" mode="widthFix"></image>
		</view> -->
		<!-- 	<view class="process-header">
			<view class="process-title">
				开店流程
			</view>
			<view class="process-text">
				签约前不会产生任何费用
			</view>
		</view> -->
		<view class="refuse_text" v-if="applyInfo.refuse_text">
			{{applyInfo.refuse_text}}
		</view>
		<view class="edit-item" v-if="fromInfo.dealer_name">
			<text class="tit">
				供货人
			</text>
			<view class="uni-input">{{fromInfo.dealer_name}}</view>
		</view>
		<view class="edit-item">
			<text class="tit">
				所属军团
			</text>
			<view class="uni-input">{{fromInfo.post_name}}</view>
		</view>
		<view class="apply-item">
			<view class="item-left">
				<view class="item-index">
					01
				</view>
				<view class="item-content">
					<view class="item-title">
						开店意向书申请
					</view>
					<view class="item-text">
						填写申请信息
					</view>
				</view>
			</view>
			<view class="item-right">
				<view class="item-btn" @click="onClickUrl(1,applyInfo.status1)"
					v-if="applyInfo.status1==0||applyInfo.status1==-1">
					填写
				</view>
				<view class="item-btn" v-if="applyInfo.status1==1" @click="onClickUrl(1,applyInfo.status1)">
					已提交
				</view>
				<view class="menu-icon" v-if="applyInfo.status1==10" @click="onClickUrl(1,applyInfo.status1)">
					<img class="menu-icon" src='./img/checked.png' mode="aspectFill"></img>
				</view>
			</view>
		</view>
		<view class="apply-item">
			<view class="item-left">
				<view class="item-index">
					02
				</view>
				<view class="item-content">
					<view class="item-title">
						视频面试
					</view>
					<view class="item-text">
						总部面试专员视频面试
					</view>
				</view>
			</view>
			<view class="item-right">
				<view class="menu-icon" v-if="applyInfo.status2==10">
					<img class="menu-icon" src='./img/checked.png' mode="aspectFill"></img>
				</view>
			</view>
		</view>
		<view class="apply-item">
			<view class="item-left">
				<view class="item-index">
					03
				</view>
				<view class="item-content">
					<view class="item-title">
						总部培训、考核
					</view>
					<view class="item-text">
						闪亮七堂课，线下门店7天培训
					</view>
				</view>
			</view>
			<view class="item-right">
				<view class="item-btn" @click="onClickUrl(3,applyInfo.status3)"
					v-if="applyInfo.status2==10&&applyInfo.status3==0">
					上传培训证明
				</view>
				<view class="item-btn" v-if="applyInfo.status3==1" @click="onClickUrl(3,applyInfo.status3)">
					已提交
				</view>
				<view class="menu-icon" v-if="applyInfo.status3==10" @click="onClickUrl(3,applyInfo.status3)">
					<img class="menu-icon" src='./img/checked.png' mode="aspectFill"></img>
				</view>
			</view>
		</view>
		<view class="apply-item">
			<view class="item-left">
				<view class="item-index">
					04
				</view>
				<view class="item-content">
					<view class="item-title">
						签署合同
					</view>
					<view class="item-text">
						正式签约，并缴纳相关费用
					</view>
				</view>
			</view>
			<view class="item-right">
				<view class="item-btn" @click="onClickUrl(4,applyInfo.status4)"
					v-if="applyInfo.status2==10&&applyInfo.status4==0">
					上传合同图片
				</view>
				<view class="item-btn" v-if="applyInfo.status4==1" @click="onClickUrl(4,applyInfo.status4)">
					已提交
				</view>
				<view class="menu-icon" v-if="applyInfo.status4==10" @click="onClickUrl(4,applyInfo.status4)">
					<img class="menu-icon" src='./img/checked.png' mode="aspectFill"></img>
				</view>
			</view>
		</view>
		<view class="apply-item">
			<view class="item-left">
				<view class="item-index">
					05
				</view>
				<view class="item-content">
					<view class="item-title">
						店铺选址
					</view>
					<view class="item-text">
						全国开放名额
					</view>
				</view>
			</view>
			<view class="item-right">
				<view class="item-btn" v-if="applyInfo.status2==10&&applyInfo.status5==0" @click="goMap">
					选址
				</view>
				<view class="item-btn" v-if="applyInfo.status5==1" @click="goMap">
					已提交
				</view>
				<view class="menu-icon" v-if="applyInfo.status5==10" @click="goMap">
					<img class="menu-icon" src='./img/checked.png' mode="aspectFill"></img>
				</view>
			</view>
		</view>
		<view class="apply-item">
			<view class="item-left">
				<view class="item-index">
					06
				</view>
				<view class="item-content">
					<view class="item-title">
						店铺准备
					</view>
					<view class="item-text">
						装修、人力招聘、材料采购、营业执照等
					</view>
				</view>
			</view>
			<view class="item-right">
				<view class="item-btn" v-if="applyInfo.status2==10&&applyInfo.status6==0"
					@click="onClickUrl(6,applyInfo.status6)">
					上传店铺图片
				</view>
				<view class="item-btn" v-if="applyInfo.status6==1" @click="onClickUrl(6,applyInfo.status6)">
					已提交
				</view>
				<view class="menu-icon" v-if="applyInfo.status6==10" @click="onClickUrl(6,applyInfo.status6)">
					<img class="menu-icon" src='./img/checked.png' mode="aspectFill"></img>
				</view>
			</view>
		</view>
		<view class="apply-item">
			<view class="item-left">
				<view class="item-index">
					07
				</view>
				<view class="item-content">
					<view class="item-title">
						正式开业
					</view>
					<!-- 	<view class="item-text">
						公司指派督导驻店指导开业
					</view> -->
				</view>
			</view>
			<view class="item-right" v-if="applyInfo.auth_book_img">
				<view class="item-btn" @click="previewImage(applyInfo.auth_book_img)">
					查看授权书
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
					dealer_name: '',
					mobile: '',
					type: 'store',
					source_member: ""
				},
				applyInfo: {},
				agreement: {},
				fromInfo: {},
				source_member: ''
			};
		},
		mixins: [],
		onLoad() {
			this.getStoreagreement()

		},
		onShow() {
			this.getListData()
		},
		methods: {
			previewImage(imgStr) {
				if (!imgStr) {
					return
				}
				let img = this.$util.loadimg(imgStr)
				uni.previewImage({
					current: 0,
					urls: [img],
				});
			},
			goMap() {
				// this.$util.redirectTo('/openStore/map');
				let that = this
				uni.chooseLocation({
					latitude: this.applyInfo.apply_store_lat || '',
					longitude: this.applyInfo.apply_store_lng || '',
					success: function(res) {
						console.log('位置名称：' + res.name);
						console.log('详细地址：' + res.address);
						console.log('纬度：' + res.latitude);
						console.log('经度：' + res.longitude);
						let latitude = res.latitude
						let longitude = res.longitude
						let address = res.address
						if (that.applyInfo.status5 == 10) {
							return
						}
						uni.showModal({
							title: '温馨提示',
							content: `是否选择${address}为店铺地址？`,
							success: res => {
								if (res.confirm) {
									that.upApplyInfo(address, latitude, longitude)
								}
							}
						})
					}
				});
			},
			upApplyInfo(address, latitude, longitude) {
				this.$api.sendRequest({
					url: '/dealer/api/apply/upApplyInfo',
					data: {
						apply_store_lng: longitude,
						apply_store_lat: latitude,
						apply_store_address: address,
						type: 'store'
					},
					success: res => {
						let msg = res.message;
						this.$util.showToast({
							title: msg
						});
						if (res.code == 0) {
							this.getListData()
						}
					},
					fail: res => {}
				});
			},
			getStoreagreement() {
				this.$api.sendRequest({
					url: '/dealer/api/config/storeagreement',
					data: {},
					success: res => {
						let msg = res.message;
						if (res.code == 0) {
							this.agreement = res.data.agreement || {}
						} else {
							this.$util.showToast({
								title: msg
							});
						}

					},
					fail: res => {}
				});
			},
			getListData() {
				this.$api.sendRequest({
					url: '/dealer/api/apply/info',
					data: {
						type: 'store'
					},
					success: res => {
						let msg = res.message;
						if (res.code == 0) {
							console.log(res.data);
							this.applyInfo = res.data || {}
							if (res.data) {
								if (res.data.source_member) {
									this.source_member = res.data.source_member
									this.formData.source_member = res.data.source_member
								} else {
									this.source_member = uni.getStorageSync('source_member') || ''
									this.formData.source_member = uni.getStorageSync('source_member') || ''
								}
								this.getDealerFromInfo()
							}
						} else {
							this.$util.showToast({
								title: msg
							});
						}

					},
					fail: res => {}
				});
			},
			//分享者信息
			getDealerFromInfo() {
				if (!this.source_member) {
					return
				}
				this.$api.sendRequest({
					url: '/dealer/api/dealer/fromInfo',
					data: {
						member_id: this.source_member || ''
					},
					success: res => {
						let msg = res.message;
						if (res.code == 0) {
							console.log(res.data);
							this.fromInfo = res.data || {}
						} else {
							this.$util.showToast({
								title: msg
							});
						}

					},
					fail: res => {}
				});
			},
			onClickUrl(type, status) {
				this.$util.redirectTo('/openStore/joinApply', {
					type,
					source_member: this.source_member,
					status
				});
			},
			onSubmit() {
				console.log(this.formData);
				this.$api.sendRequest({
					url: '/dealer/api/apply/applyDealer',
					data: this.formData,
					success: res => {
						this.$util.showToast({
							title: res.message
						});
						if (res.code == 0) {
							this.getListData()
						}
						if (this.$refs && this.$refs.storePopup) {
							this.$refs.storePopup.close()
						}
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
   .refuse_text{
	   width: 710rpx;
	   opacity: 1;
	   border-radius: 10px;
	   margin: 0 auto;
	   margin-top: 10px;
	   padding-left: 14px;
	   padding-right: 14px;
	   box-sizing: border-box;
	   font-size: 30rpx;
	   font-family: PingFang SC;
	   font-weight: bold;
	   color: #FA6400;
	   opacity: 1;
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
		width: 380rpx;
	}

	.item-btn {
		font-size: 28rpx;
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
		margin-top: 50px;
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
