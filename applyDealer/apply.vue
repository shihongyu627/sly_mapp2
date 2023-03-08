<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="popBox">
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
		<view class="edit-item">
			<text class="tit">
				姓名
			</text>
			<input class="uni-input" :disabled="!hiddenSub" type="text" placeholder-class="placeholder-class"
				placeholder="请输入" maxlength="30" name="dealer_name" v-model="formData.dealer_name" />
		</view>
		<view class="edit-item">
			<text class="tit">
				联系方式
			</text>
			<input class="uni-input" type="number" placeholder-class="placeholder-class" placeholder="请输入"
				maxlength="11" name="mobile" :disabled="!hiddenSub" v-model="formData.mobile" />
		</view>
		<picker @change="pickerEventLevelGroup($event)" mode='selector' :range="levellists" range-key="level_name"
			:value="index">
			<view class="edit-item">
				<text class="tit">
					经销商级别
				</text>
				<view class="uni-input">
					{{level_name}}
				</view>
			</view>
		</picker>
		<view class="edit-item">
			<text class="tit">
				推荐人电话
			</text>
			<input class="uni-input" type="number" placeholder-class="placeholder-class" placeholder="请输入"
				maxlength="11" name="recommend_no" :disabled="!hiddenSub" v-model="formData.recommend_no" />
		</view>
		<view class="edit-item">
			<text class="tit">
				区域地址
			</text>
			<view class="edit-item-right">
				<view class="uni-tags" v-for="(item,index) in addressList" @click="delTag(index)">
					{{item}}
					<img class='uni-tags-close' src="../common/img/close.png" alt="" mode="aspectFill" />
				</view>
				<pick-regions :default-regions="defaultRegions" @getRegions="handleGetRegions">
					<view class="uni-input">
						请选择区域
					</view>
				</pick-regions>
			</view>

		</view>

		<picker @change="pickerEventPostGroup($event)" mode='selector' :range="postlists" range-key="post_name"
			:value="index">
			<view class="edit-item">
				<text class="tit">
					所属军团
				</text>
				<view class="uni-input">
					{{post_name}}
				</view>
			</view>
		</picker>
		<picker @change="pickerEventGroupGroup($event)" mode='selector' :range="grouplists" range-key="group_name"
			:value="index">
			<view class="edit-item">
				<text class="tit">
					所属战队（选填）
				</text>
				<view class="uni-input">
					{{group_name}}
				</view>
			</view>
		</picker>
		<view class="upload-box">
			<view class="upload-box-title">上传打款凭证</view>
			<view class="other-info">
				<view class="other-info-box" v-for="(i, t) in imgList" :key="t">
					<image class="other-info-image" :src="$util.img(i)" mode="aspectFill" @click="preview(i, index)">
					</image>
					<view class="imgDel" @click="deleteImg(i, index)" v-if="hiddenSub"><text
							class=" icon iconfont icondelete"></text>
					</view>
				</view>
				<view class="other-info-box active" @click="addImg()" v-if="hiddenSub">
					<text class="icon iconfont iconzhaoxiangji"></text>
					<text>{{ imgList.length ? 9 - imgList.length : 0 }}/9</text>
				</view>
			</view>
			<view class="upload-box-title">上传合同</view>
			<view class="other-info">
				<view class="other-info-box" v-for="(i, t) in imgTwoList" :key="t">
					<image class="other-info-image" :src="$util.img(i)" mode="aspectFill" @click="previewTwo(i, index)">
					</image>
					<view class="imgDel" @click="deleteTwoImg(i, index)" v-if="hiddenSub"><text
							class=" icon iconfont icondelete"></text>
					</view>
				</view>
				<view class="other-info-box active" @click="addTwoImg()" v-if="hiddenSub">
					<text class="icon iconfont iconzhaoxiangji"></text>
					<text>{{ imgTwoList.length ? 9 - imgTwoList.length : 0 }}/9</text>
				</view>
			</view>
			<view class="upload-box-title" v-if="applyInfo.auth_book_img">授权书</view>
			<view class="other-info" v-if="applyInfo.auth_book_img">
				<view class="other-info-box">
					<image class="other-info-image" :src="$util.loadimg(applyInfo.auth_book_img)" mode="aspectFill"
						@click="previewBook(applyInfo.auth_book_img)">
					</image>

				</view>
			</view>
		</view>
		<view class="footer-boxs" v-if="hiddenSub">
			<view class="footer-bnt" @click="onSubmit()">
				提交
			</view>
		</view>
	</view>
	<ns-login ref="login"></ns-login>
	</view>
</template>
<script>
	import validate from 'common/js/validate.js';
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		components: {},
		data() {
			return {
				flag: false,
				formData: {
					dealer_name: '',
					mobile: '',
					type: 'dealer',
					post_id: '',
					level_id: '',
					group_id: '',
					source_member: '',
					region_id: '',
					city_ids: '',
					pay_img: '',
					contract_img: '',
					recommend_no: ''
				},
				post_name: '请选择军团',
				group_name: '请选择战队',
				level_name: '请选择经销商等级',
				postlists: [],
				grouplists: [],
				levellists: [],
				defaultRegions: [],
				addressList: [],
				city_idsArr: [],
				imgList: [],
				imgTwoList: [],
				source_member: '',
				fromInfo: {},
				hiddenSub: true,
				applyInfo: {}
			};
		},
		mixins: [globalConfig],
		onLoad() {
			this.getListData()
			this.getPostlistsData() //军团
			this.getGrouplistsData() //战队
			this.getLevellistsData() //等级
		},
		onHide() {
			this.flag = false;
		},
		methods: {
			getListData() {
				this.$api.sendRequest({
					url: '/dealer/api/apply/info',
					data: {
						type: 'dealer'
					},
					success: res => {
						let msg = res.message;
						if (res.code == 0) {
							console.log(res.data, '查询申请信息');
							let dd = res.data
							this.applyInfo = dd || {}
							if (dd.status == 2) {
								this.hiddenSub = false
							} else {
								this.hiddenSub = true
							}
							if (dd?.source_member) {
								this.source_member = dd.source_member
								this.formData.source_member = dd.source_member
							} else {
								this.source_member = uni.getStorageSync('source_member') || ''
								this.formData.source_member = uni.getStorageSync('source_member') || ''
							}
							this.getDealerFromInfo()
							if (dd) {
								this.formData.dealer_name = dd.dealer_name
								this.formData.mobile = dd.mobile
								this.formData.post_id = dd.post_id || ""
								this.post_name = dd.post_name
								this.formData.level_id = dd.level_id || ""
								this.level_name = dd.level_name
								this.formData.group_id = dd.group_id || ""
								this.group_name = dd.group_name
								this.formData.region_id = dd.region_id || ""
								this.formData.city_ids = dd.city_ids || ""
								if (dd.city_names) {
									let cityArr = dd.city_names.split('|')
									let arr = []
									cityArr.map((item) => {
										if (item) {
											arr.push((item))
										}
									})
									this.addressList = arr
								}
								if (dd.city_ids) {
									this.city_idsArr = dd.city_ids.split(',')
								}
								if (dd.pay_img) {
									this.imgList = dd.pay_img.split(',')
								}
								if (dd.contract_img) {
									this.imgTwoList = dd.contract_img.split(',')
								}
								console.log(this.imgList);
								this.formData.city_ids = dd.city_ids || ""
								this.formData.contract_img = dd.contract_img || ""
								this.formData.pay_img = dd.pay_img || ""
								this.formData.recommend_no = dd.recommend_no || ""
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
			//添加图片
			addImg() {
				this.$util.upload(9, {
					path: 'evaluateimg'
				}, res => {
					console.log(res);
					let arr = this.imgList
					this.imgList = [...arr, ...res]
					// this.orderCreateData.pay_gallery = this.imgList.join(',')
					console.log(this.imgList, 99988);
				});
			},
			//删除图片
			deleteImg(i, j) {
				this.imgList.splice(i, 1);
				// this.orderCreateData.pay_gallery = this.imgList.join(',')
			},
			// 图片预览
			preview(i, j) {
				let urls = this.imgList
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
					// this.orderCreateData.pay_gallery = this.imgList.join(',')
					console.log(this.imgTwoList, 99988);
				});
			},
			//删除图片
			deleteTwoImg(i, j) {
				this.imgTwoList.splice(i, 1);
				// this.orderCreateData.pay_gallery = this.imgList.join(',')
			},
			// 图片预览
			previewTwo(i, j) {
				let urls = this.imgTwoList;
				console.log(urls, i);
				for (let k = 0; k < urls.length; k++) {
					urls[k] = this.$util.img(urls[k])
				}
				uni.previewImage({
					urls: urls,
					current: i
				});
			},
			previewBook(url) {
				uni.previewImage({
					urls: [url],
					current: url
				});
			},
			delTag(index) {
				if (this.applyInfo.status == 2) {
					return
				}
				this.addressList.splice(index, 1)
				this.city_idsArr.splice(index, 1)
			},
			// 获取选择的地区
			handleGetRegions(regions) {
				if (this.applyInfo.status == 2) {
					return
				}
				let str = '';
				str += regions[0] != undefined ? regions[0].label : '';
				str += regions[1] != undefined ? '/' + regions[1].label : '';
				str += regions[2] != undefined ? '/' + regions[2].label : '';
				let cityId = regions[2] != undefined ? '' + regions[2].value : '';
				for (var i = 0; i < this.addressList.length; i++) {
					let item = this.addressList[i]
					if (item == str) {
						this.$util.showToast({
							title: '不能重复选择同一个区域'
						});
						return
					}
				}
				this.city_idsArr.push(cityId)
				this.addressList.push(str)
				console.log('区域', str);
			},
			//选择分组
			pickerEventPostGroup(e) {
				if (this.applyInfo.status == 2) {
					return
				}
				let index = e.target.value;
				console.log(e, index);
				this.post_name = this.postlists[index].post_name;
				this.formData.post_id = this.postlists[index].post_id;
			},
			//选择分组
			pickerEventGroupGroup(e) {
				if (this.applyInfo.status == 2) {
					return
				}
				let index = e.target.value;
				console.log(e, index);
				this.group_name = this.grouplists[index].group_name;
				this.formData.group_id = this.grouplists[index].group_id;
			},
			//选择分组
			pickerEventLevelGroup(e) {
				if (this.applyInfo.status == 2) {
					return
				}
				let index = e.target.value;
				console.log(e, index);
				this.level_name = this.levellists[index].level_name;
				this.formData.level_id = this.levellists[index].level_id;
			},
			getPostlistsData() {
				this.$api.sendRequest({
					url: '/dealer/api/apply/postlists',
					data: {},
					success: res => {
						let msg = res.message;
						if (res.code == 0) {
							this.postlists = res.data;
						} else {
							this.$util.showToast({
								title: msg
							});
						}

					},
					fail: res => {}
				});
			},
			getGrouplistsData() {
				this.$api.sendRequest({
					url: '/dealer/api/apply/grouplists',
					data: {},
					success: res => {
						let msg = res.message;
						if (res.code == 0) {
							this.grouplists = res.data;
						} else {
							this.$util.showToast({
								title: msg
							});
						}

					},
					fail: res => {}
				});
			},
			getLevellistsData() {
				this.$api.sendRequest({
					url: '/dealer/api/apply/levellists',
					data: {},
					success: res => {
						let msg = res.message;
						if (res.code == 0) {
							this.levellists = res.data;
						} else {
							this.$util.showToast({
								title: msg
							});
						}

					},
					fail: res => {}
				});
			},

			vertify() {
				var rule = [{
						name: 'dealer_name',
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
			onSubmit() {
				// if (this.flag) return;
				// this.flag = true;
				if (this.vertify()) {
					if (!this.formData.level_id) {
						this.$util.showToast({
							title: '请选择经销商级别'
						});
						return
					}
					if (this.city_idsArr.length == 0) {
						this.$util.showToast({
							title: '请选择区域'
						});
						return
					}
					if (!this.formData.post_id) {
						this.$util.showToast({
							title: '请选择军团'
						});
						return
					}

					if (this.imgList.length == 0) {
						this.$util.showToast({
							title: '请上传打款凭证图片'
						});
						return
					}
					if (this.imgTwoList.length == 0) {
						this.$util.showToast({
							title: '请上传合同图片'
						});
						return
					}
					this.formData.pay_img = this.imgList.join(',')
					this.formData.contract_img = this.imgTwoList.join(',')
					this.formData.city_ids = this.city_idsArr.join(',')
					uni.setStorageSync('source_member', '')
					console.log(this.formData, '提交参数');
					let that=this
					this.$api.sendRequest({
						url: '/dealer/api/apply/applyDealer',
						data: this.formData,
						success: res => {
							if (res.code == 0) {
								uni.showModal({
									title: '提示',
									content: res.message,
									confirmText: "确认",
									showCancel: false,
									success: res1 => {
										if (res1.confirm) {
											this.flag = false;
											if (res.code == 0) {
												that.$util.redirectTo('/pages/member/index');
											}
										}
									}
								})
							} else {
								this.$util.showToast({
									title: msg
								});
								this.flag = false;
							}
						},
						fail: res => {
							this.flag = false;
						}
					});
				}
			},
			onClickApply() {
				if (!uni.getStorageSync('token')) {
					this.getWxAuth()
					return;
				}
				this.$refs.storePopup.open('bottom')
			},
			maskClick() {
				this.$refs.storePopup.close()
			},
			/**
			 * 获取微信授权
			 */
			getWxAuth(callback) {
				if (!uni.getStorageSync('token')) {
					this.$refs.login.open('/applyDealer/index');
					return;
				}
				// #ifdef MP-WEIXIN
				wx.getUserProfile({
					desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: res => {
						typeof callback == 'function' && callback();
					}
				});
				// #endif
				// #ifdef H5
				if (this.$util.isWeiXin()) {
					this.$api.sendRequest({
						url: '/wechat/api/wechat/authcode',
						data: {
							scopes: 'snsapi_userinfo',
							redirect_url: this.$config.h5Domain + '/applyDealer/index'
						},
						success: res => {
							if (res.code >= 0) {
								location.href = res.data;
							}
						}
					});
				}
				// #endif
			},
		}
	};
</script>

<style scoped lang="scss" scoped>
	page {
		background: #fff;
	}

	.edit-item-right {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-end;

		.uni-tags {
			background: rgba(22, 169, 81, 0.1);
			border-radius: 20rpx;
			padding-top: 10rpx;
			padding-bottom: 10rpx;
			padding-left: 15rpx;
			padding-right: 36rpx;
			margin-bottom: 10rpx;
			display: flex;
			position: relative;
		}

		.uni-tags-close {
			width: 36rpx;
			height: 36rpx;
			position: absolute;
			right: 0;
			top: 0;
			z-index: 99;
		}
	}

	/deep/ .uni-popup__wrapper-box {
		max-height: 550px !important;
	}

	.process-wrap {
		// background: #fff;
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

	.content {
		// width: 710rpx;
		// background: #fff;
		margin: 0 auto;
		// margin: 0 30rpx;
		padding: 20rpx 30rpx 10rpx;
		box-sizing: border-box;
	}

	.footer-box {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		padding-left: 20rpx;
		padding-right: 20rpx;
		padding-bottom: 40rpx;
		padding-bottom: 40rpx;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 0;
		background: #fff;
	}

	.footer-btnLeft {
		width: 150px;
		height: 48px;
		border: 1px solid #9E9E9E;
		opacity: 1;
		border-radius: 24px;
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 48px;
		color: #454652;
		opacity: 1;
		text-align: center;
	}

	.footer-btnRight {
		width: 150px;
		height: 48px;
		background: #1189F4;
		opacity: 1;
		border-radius: 24px;
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 48px;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
	}

	.edit-wrap {
		background: #fff;
		overflow: hidden;
		width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		margin-top: 50px;

		.tip {
			padding: 20rpx 30rpx 10rpx;
			background-color: #f8f8f8;
			color: $color-tip;
		}
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
		z-index: 10;
	}

	.popBox {
		width: 100%;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		overflow: hidden;
		background: #FBFBFB !important;
		padding-bottom: 190rpx;
	}

	.footer-boxs {
		width: 100%;
		height: 140rpx;
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
		background: #FFFFFF;
		opacity: 1;
		border-radius: 20rpx;
		margin: 0 auto;
		margin-top: 20rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		box-sizing: border-box;
		padding-top: 30rpx;
		padding-bottom: 30rpx;

		.text_inp {
			margin-left: $margin-updown;
			flex: 1;
		}

		.tit {
			width: 230rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #000000;
			opacity: 1;
			display: flex;
			flex-direction: row;

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
