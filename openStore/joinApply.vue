<template>
	<view class="process-wrap">
		<view class="popBox">
			<view v-if="type=='1'">
				<view class="edit-item">
					<text class="tit">
						姓名
					</text>
					<input class="uni-input" :disabled="status==10" type="text" placeholder-class="placeholder-class"
						placeholder="请输入" maxlength="30" name="dealer_name" v-model="formData.dealer_name" />
				</view>
				<view class="edit-item">
					<text class="tit">
						联系方式
					</text>
					<input class="uni-input" :disabled="status==10" type="number" placeholder-class="placeholder-class"
						placeholder="请输入" maxlength="11" name="mobile" v-model="formData.mobile" />
				</view>
				<view class="edit-item">
					<text class="tit">
						开店城市
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
			</view>
			<view class="upload-box">
				<view class="upload-box-title" v-if="type==6">{{sOnetitle}}</view>
				<view class="other-info" v-if="type==6">
					<view class="other-info-box" v-for="(i, t) in imgThreeList" :key="t">
						<image class="other-info-image" :src="$util.img(i)" mode="aspectFill"
							@click="previewThree(i, index)">
						</image>
						<view class="imgDel"  v-if="status!=10" @click="deleteThreeImg(i, index)"><text
								class=" icon iconfont icondelete"></text>
						</view>
					</view>
					<view class="other-info-box active"  v-if="status!=10" @click="addThreeImg()">
						<text class="icon iconfont iconzhaoxiangji"></text>
						<text>{{ imgThreeList.length ? 9 - imgThreeList.length : 0 }}/9</text>
					</view>
				</view>

				<view class="upload-box-title">{{title}}</view>
				<view class="other-info">
					<view class="other-info-box" v-for="(i, t) in imgList" :key="t">
						<image class="other-info-image" :src="$util.img(i)" mode="aspectFill"
							@click="preview(i, index)">
						</image>
						<view class="imgDel" v-if="status!=10" @click="deleteImg(i, index)"><text
								class=" icon iconfont icondelete"></text>
						</view>
					</view>
					<view class="other-info-box active" v-if="status!=10" @click="addImg()">
						<text class="icon iconfont iconzhaoxiangji"></text>
						<text>{{ imgList.length ? 9 - imgList.length : 0 }}/9</text>
					</view>
				</view>
				<view class="upload-box-title" v-if="type==6">{{stitle}}</view>
				<view class="other-info" v-if="type==6">
					<view class="other-info-box" v-for="(i, t) in imgTwoList" :key="t">
						<image class="other-info-image" :src="$util.img(i)" mode="aspectFill"
							@click="previewTwo(i, index)">
						</image>
						<view class="imgDel" v-if="status!=10" @click="deleteTwoImg(i, index)"><text
								class=" icon iconfont icondelete"></text>
						</view>
					</view>
					<view class="other-info-box active" v-if="status!=10" @click="addTwoImg()">
						<text class="icon iconfont iconzhaoxiangji"></text>
						<text>{{ imgTwoList.length ? 9 - imgTwoList.length : 0 }}/9</text>
					</view>
				</view>
			</view>

		</view>
		<view class="footer-boxs" v-if="status!=10">
			<view class="footer-bnt" @click="onSubmit()">
				提交
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
					address: '',
					city_ids: '',
					pay_img: '',
					source_member: ''
				},
				applyInfo: {},
				agreement: {},
				type: '',
				title: '',
				stitle: '',
				sOnetitle: '',
				imgList: [],
				imgTwoList: [], //装修后：门头照图，装修实景图
				imgThreeList: [], //上传凭证
				source_member: '',
				status: ''
			};
		},
		mixins: [],
		onLoad(options) {
			if (options.type == '1') {
				this.$langConfig.title('填写信息');
				this.type = options.type
				this.title = '上传打款凭证'
			} else if (options.type == '3') {
				this.$langConfig.title('上传培训证明');
				this.type = options.type
				this.title = '上传培训证明'
			} else if (options.type == '4') {
				this.$langConfig.title('上传合同照片');
				this.type = options.type
				this.title = '上传合同照片'
			} else if (options.type == '6') {
				this.$langConfig.title('上传店面照片');
				this.type = options.type
				this.title = '2.装修前：效果图，平面布局图'
				this.stitle = '3.装修后：门头照图，装修实景图'
				this.sOnetitle = '1.上传营业执照'
			}
			this.formData.source_member = options.source_member || ''
			this.source_member = options.source_member || ''
			this.status = options.status || ''
			this.getListData()

		},
		methods: {
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
							let dd = res.data || {}
							this.formData.dealer_name = dd.dealer_name
							this.formData.type = 'store'
							this.formData.mobile = dd.mobile
							let cityArr = dd.city_names.split('|')
							let arr = []
							cityArr.map((item) => {
								if (item) {
									arr.push((item))
								}
							})
							this.formData.full_address = arr
							this.formData.city_ids = dd.city_ids
							if (this.type == 1) {
								this.imgList = dd.pay_img ? dd.pay_img.split(',') : []
							} else if (this.type == 3) {
								this.imgList = dd.train_img ? dd.train_img.split(',') : []
							} else if (this.type == 4) {
								this.imgList = dd.contract_img ? dd.contract_img.split(',') : []
							} else if (this.type == 6) {
								this.imgList = dd.trim_before_img ? dd.trim_before_img.split(',') : []
								this.imgTwoList = dd.trim_after_img ? dd.trim_after_img.split(',') : []
								this.imgThreeList = dd.cert_img ? dd.cert_img.split(',') : []
							}
							console.log(this.imgList);
							this.applyInfo = res.data || {}
						} else {
							this.$util.showToast({
								title: msg
							});
						}

					},
					fail: res => {}
				});
			},
			//添加图片
			addImg() {
				this.$util.upload(9, {
					path: 'evaluateimg'
				}, res => {
					console.log(res);
					let arr = this.imgList
					this.imgList = [...arr, ...res]
					console.log(this.imgList, 99988);
				});
			},
			//删除图片
			deleteImg(i, j) {
				this.imgList.splice(i, 1);
			},
			// 图片预览
			preview(i, j) {
				let urls = this.imgList
				console.log(urls);
				
				for (let k = 0; k < urls.length; k++) {
					urls[k] = this.$util.img(urls[k])
				}
				uni.previewImage({
					urls: urls,
					current: i
				});
			},
			//添加图片
			addTwoImg() {
				this.$util.upload(9, {
					path: 'evaluateimg'
				}, res => {
					console.log(res);
					let arr = this.imgTwoList
					this.imgTwoList = [...arr, ...res]
					console.log(this.imgTwoList, 99988);
				});
			},
			//删除图片
			deleteTwoImg(i, j) {
				this.imgTwoList.splice(i, 1);
			},
			// 图片预览
			previewTwo(i, j) {
				let urls = this.imgTwoList
				for (let k = 0; k < urls.length; k++) {
					urls[k] = this.$util.img(urls[k])
				}
				uni.previewImage({
					urls: urls,
					current: i
				});
			},

			//添加图片
			addThreeImg() {
				this.$util.upload(9, {
					path: 'evaluateimg'
				}, res => {
					console.log(res);
					let arr = this.imgThreeList
					this.imgThreeList = [...arr, ...res]
					console.log(this.imgThreeList, 99988);
				});
			},
			//删除图片
			deleteThreeImg(i, j) {
				this.imgThreeList.splice(i, 1);
			},
			// 图片预览
			previewThree(i, j) {
				let urls = this.imgThreeList
				for (let k = 0; k < urls.length; k++) {
					urls[k] = this.$util.img(urls[k])
				}
				uni.previewImage({
					urls: urls,
					current: i
				});
			},

			// 获取选择的地区
			handleGetRegions(regions) {
				if (this.status == 10) {
					return
				}
				this.formData.full_address = '';
				this.formData.full_address += regions[0] != undefined ? regions[0].label : '';
				this.formData.full_address += regions[1] != undefined ? '/' + regions[1].label : '';
				this.formData.full_address += regions[2] != undefined ? '/' + regions[2].label : '';
				this.formData.city_ids = regions[2] != undefined ? regions[2].value : '';
			},
			onSubmit() {
				if (this.imgList.length == 0) {
					this.$util.showToast({
						title: '请上传图片'
					});
					return
				}
				if (this.imgList.length > 0) {
					this.formData.pay_img = this.imgList.join(',')
				}
				console.log(this.formData);
				if (this.type == 1) {
					this.$api.sendRequest({
						url: '/dealer/api/apply/applyDealer',
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
				} else {
					let data = {
						type: 'store',
						source_member: this.source_member
					}

					if (this.type == 3) {
						data.train_img = this.imgList.join(',')
					} else if (this.type == 4) {
						data.contract_img = this.imgList.join(',')
					} else if (this.type == 6) {
						if (this.imgThreeList.length == 0) {
							this.$util.showToast({
								title: '请上传图片'
							});
							return
						}
						if (this.imgTwoList.length == 0) {
							this.$util.showToast({
								title: '请上传图片'
							});
							return
						}
						data.trim_before_img = this.imgList.join(',')
						data.trim_after_img = this.imgTwoList.join(',')
						data.cert_img = this.imgThreeList.join(',')
					}

					this.$api.sendRequest({
						url: '/dealer/api/apply/upApplyInfo',
						data: data,
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
				}

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

	.upload-box {
		background: #fff;
		width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		margin-top: 10px;
		padding-bottom: 20px;
		padding-left: 14px;
		padding-right: 14px;
		padding-top: 20px;
		box-sizing: border-box;
	}

	.upload-box-title {
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
	}

	.other-info {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		margin-top: 20rpx;
	}

	.other-info-box {
		width: 160rpx;
		height: 160rpx;
		margin-right: $margin-both;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-right: 60rpx;
		margin-bottom: 30rpx;
		position: relative;


		.iconfont {
			font-size: 60rpx;
			color: #898989;
			line-height: 1;
		}

		text {
			line-height: 1;
		}

		.imgDel {
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			right: -20rpx;
			top: -20rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.iconfont {
				font-size: $font-size-toolbar;
			}
		}
	}

	.other-info-image {
		width: 100%;
		border-radius: $border-radius;
	}

	.other-info-box.active {
		border: 1rpx dashed #898989;
	}

	.other-info-box.active:active {
		background: rgba($color: #cccccc, $alpha: 0.6);
	}

	.other-info-box:nth-child(3n) {
		margin-right: 0;
	}
</style>
