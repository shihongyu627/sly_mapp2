<template>
	<view :data-theme="themeStyle">
		<view scroll-y="true" class="goods-detail" :class="isIphoneX ? 'active' : ''">
			<view class="card-item margin-bottom">
				<view class="card-top">
					<image class="card-img" :src="goodsImg(cardData.card_cover)" mode="aspectFill"></image>
					<view class="card-right">
						<view class="card-content">
							<view class="card-content-left">
								<view class="card-title">
									{{cardData.card_name}}
								</view>
							</view>
							<view class="card-btn" v-if="cardData.is_allow_transfer==1">
								<button class="share-btn" :plain="true" open-type="share">
								</button>
								转赠
							</view>
						</view>
						<view class="card-bottom">
							<view class="card-text">
								剩余次数 <text
									class="card-num">{{Number(cardData.number)-Number(cardData.use_count)}}</text>
							</view>
							<view class="iconfont iconerweima" @click="previewImage(cardData.card_qrcode)"></view>
							<!-- 	<image class="card-code" :src="goodsImg(cardData.card_qrcode)" mode="aspectFill"
								@click="previewImage(cardData.card_qrcode)"></image> -->
						</view>
					</view>
				</view>
			</view>
			<view class="address-box" v-if="storeInfo&&storeInfo.store_name">
				<view class="adddress-top">
					<view class="address-name">
						{{storeInfo.store_name}}
					</view>
					<img class='store-tel' src="@/common/img/store_tel.png" mode="aspectFill"
						@click="makePhone(storeInfo)" />
				</view>
				<view class="address-bottom">
					<view class="address-left">
						<img class='address-icon' src="@/common/img/address_icon.png" mode="aspectFill" />
						<view class="address-content">
							{{ removeComma(storeInfo.address)}}
						</view>
					</view>
					<view class="address-guide" @click="goHerf(storeInfo)">
						<img class='guide-icon' src="@/common/img/store_tel.png" mode="aspectFill" />
						<view class="guide-title">
							导航
						</view>
					</view>
				</view>
			</view>
			<view class="content-box">
				<view class="content-text">
					使用期限
				</view>
				<view class="content-title" v-if="cardData.valid_time==0">
					永久有效
				</view>
				<view class="content-title" v-if="cardData.valid_time!=0">
					{{$util.timeStampTurnTime(cardData.get_time,'YY-MM-DD')}} -
					{{$util.timeStampTurnTime(cardData.valid_time,'YY-MM-DD')}}
				</view>
				<view class="content-item">
					<view class="content-text">
						适用门店
					</view>
					<view class="content-flex">
						<view class="content-title">
							{{storeInfo.store_name||'通用'}}
						</view>
						<view class="content-btn" @click="openPopup">
							预约
						</view>
					</view>

				</view>
			</view>
			<view class="card-recordBox">
				<view class="record-title">
					体验记录
				</view>
				<view class="record-item" v-for="(item, index) in card_use_list" :key="index">
					<view class="record-left">
						<view class="record-icon">

						</view>
						<view class="record-num">
							1次
						</view>
					</view>
					<view class="record-right">
						<view class="record-time" v-if="item.to_date">
							预约时间：{{item.to_date}} {{item.to_time}}
						</view>
						<view class="record-time">
							体验时间：{{$util.timeStampTurnTime(item.verify_time)||''}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="storePopup" type="bottom" :mask-click="false">
			<view class="popBox">
				<view class="popup-title">
					立即预约
					<img class='pop-close' src="@/common/img/close.png" mode="aspectFill" @click='maskClick()' />
				</view>
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
				<picker @change="pickerEventPostGroup($event)" mode='selector' :range="dataList" range-key="store_name"
					:value="index" v-if="is_bind_store!=1">
					<view class="edit-item">
						<text class="tit">
							门店
						</text>
						<view class="uni-input">
							{{store_name}}
						</view>
					</view>
				</picker>
				<block>
					<view class="edit-item">
						<text class="tit">
							到店日期
						</text>
						<picker mode="date" fields='day' :value="to_date" @change="bindDayChange">
							<text class="select-address "
								:class="{ empty: !formData.to_date, 'color-tip': !formData.to_date }">
								{{ formData.to_date ? formData.to_date : '请选择' }}
							</text>
						</picker>
					</view>
				</block>
				<block>
					<view class="edit-item">
						<text class="tit">
							到店时间
						</text>
						<picker mode="time" :value="to_time" @change="bindTimeChange">
							<text class="select-address "
								:class="{ empty: !formData.to_time, 'color-tip': !formData.to_time }">
								{{ formData.to_time ? formData.to_time : '请选择' }}
							</text>
						</picker>
					</view>
				</block>
				<view class="footer-boxs">
					<view class="footer-bnt" @click="onSubmit()">
						立即预约
					</view>
				</view>
			</view>

		</uni-popup>
		<uni-popup ref="inputDialog" type="center" :mask-click="false">
			<view class="inputDialog-box">
				<view class="input-title">
					转赠
				</view>
				<view class="input-wrapp">
					<view class="input-text">
						转赠对象：
					</view>
					<input class="uni-inputs" type='number' placeholder-class="placeholder-class" placeholder="请输入手机号"
						maxlength="11" mobile="mobile" v-model="mobile" @input="onChangeMember" />
				</view>
				<view class="input-footer">
					<view class="cancelText" @click="onCancel">
						取消转赠
					</view>
					<view class="confirmText" @click="onConfirm">
						确定转增
					</view>
				</view>
			</view>
		</uni-popup>
		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>

	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';

	export default {
		components: {},
		data() {
			return {
				kefuConfig: {
					weapp: '',
					system: '',
					open: '',
					open_url: ''
				},
				member_card_id: '',
				cardData: {},
				storeInfo: {},
				card_use_list: [],
				formData: {
					type: 'subcard',
					name: '',
					mobile: '',
					to_date: '',
					to_time: '',
					member_card_id: '',
					store_id: ''
				},
				is_bind_store: '',
				store_name: '请选择门店',
				dataList: [],
			};
		},
		mixins: [globalConfig],
		onLoad(option) {
			this.formData = uni.getStorageSync('subCardformData') || this.formData;
			if (option.member_card_id) {
				this.member_card_id = option.member_card_id
				this.formData.member_card_id = option.member_card_id;
			}
			this.getData()
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			this.is_bind_store = uni.getStorageSync('is_bind_store') || ''
			if (uni.getStorageSync('token')) {
				this.getCardData();
				// this.useCardData() 测试使用
			} else {
				// this.$util.redirectTo('/pages/login/login/login', {
				// 	back: '/pages_tool/member/card/info/info?member_card_id=' + this.member_card_id
				// });
			}
		},
		/**
		 * 自定义分享内容
		 * @param {Object} res
		 */
		onShareAppMessage(res) {
			let path = '/pages_tool/member/card/get/get';
			let imgUrl = ''
			let title = this.cardData.card_name || ''
			if (this.cardData.card_cover) {
				imgUrl = this.$util.loadimg(this.cardData.card_cover)
			}
			if (this.cardData && this.cardData.member_id) path += '?source_member=' + this.cardData.member_id;
			if (this.member_card_id) path += '&member_card_id=' + this.member_card_id;
			console.log(path, '分享路径');
			return {
				title: title,
				path: path,
				imageUrl: imgUrl,
				success: res => {},
				fail: res => {}
			};
		},
		methods: {
			//选择分组
			pickerEventPostGroup(e) {
				let index = e.target.value;
				console.log(e, index);
				this.store_name = this.dataList[index].store_name;
				this.formData.store_id = this.dataList[index].store_id;
			},
			getData() {
				this.$api.sendRequest({
					url: '/api/store/page',
					data: {},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
							this.total = res.data.count || 0
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						//设置列表数据
						this.dataList = newArr; //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			getCardData() {
				this.$api.sendRequest({
					url: '/subcard/api/membercard/detail',
					data: {
						member_card_id: this.member_card_id
					},
					success: res => {
						uni.stopPullDownRefresh();
						if (res.code >= 0) {
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
							this.cardData = res.data;
							this.storeInfo = res.data.store_info || {}
							this.card_use_list = res.data.card_use_list || []
						} else {
							this.$util.showToast({
								title: '未获取到体验卡信息！'
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages_tool/member/card/list/list');
							}, 1500);
						}
					},
					fail: res => {
						uni.stopPullDownRefresh();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			/**
			 * 下拉刷新
			 */
			onPullDownRefresh() {
				this.getCardData();
			},
			goForward() {
				console.log('转增');
				this.$refs.inputDialog.open()
			},
			goodsImg(imgStr) {
				return this.$util.loadimg(imgStr)
			},
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
			makePhone(item) {
				console.log(item, '打电话');
				if (!item.telphone) {
					return
				}
				uni.makePhoneCall({
					phoneNumber: item.telphone || '' //仅为示例
				});
			},
			goHerf(item) {
				if (!item.latitude && !item.longitude) {
					return
				}
				uni.openLocation({
					latitude: Number(item.latitude),
					longitude: Number(item.longitude),
					name: item.store_name,
					address: this.removeComma(item.address),
					success: function() {
						console.log('success');
					}
				});
			},
			removeComma(str) {
				return this.$util.removeComma(str)
			},
			openPopup() {
				this.$refs.storePopup.open('bottom')
			},
			maskClick() {
				console.log(123);
				this.$refs.storePopup.close()
			},
			bindDayChange(e) {
				console.log(e);
				this.formData.to_date = e.detail.value
			},
			bindTimeChange(e) {
				console.log(e);
				this.formData.to_time = e.detail.value
			},
			onSubmit() {
				console.log(this.formData);
				this.$api.sendRequest({
					url: '/subcard/api/membercard/sub',
					data: this.formData,
					success: res => {
						this.$util.showToast({
							title: res.message
						});
						this.formData.to_date = ''
						this.formData.to_time = ''
						this.formData.member_card_id = ''
						uni.setStorageSync('subCardformData', this.formData || {})
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						if (res.code == 0) {
							uni.redirectTo({
								url: '/tabbarStore/success/success'
							});
						}
					}
				});
			},
			close(type, callback) {

			},
			change(e) {
				console.log('当前模式：状态：' + e.show);
			},
			onCancel() {
				console.log('转增');
				this.$refs.inputDialog.close()
			},
			onChangeMember(e) {
				console.log(e);
				this.mobile = e.detail.value
			},
			onConfirm() {
				console.log('转增');
				if (!this.mobile) {
					this.$util.showToast({
						title: '请输入手机号'
					});
					return
				}
				this.$api.sendRequest({
					url: '/subcard/api/membercard/transfer',
					data: {
						mobile: this.mobile,
						member_card_id: this.member_card_id
					},
					success: res => {
						this.$util.showToast({
							title: res.message
						});
						if (res.code >= 0) {
							this.$refs.mescroll.refresh();
						}
						this.$refs.inputDialog.close()
					}
				});
			},
		}
	};
</script>
<style lang="scss">
</style>
<style scoped lang="scss">
	.goods-detail {
		padding-bottom: 60px;
	}

	.card-item {
		width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 20rpx;
		overflow: hidden;
		margin: 0 auto;
		margin-top: 20rpx;
		padding: 20rpx;
		box-sizing: border-box;
	}

	.card-top {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.card-img {
		width: 260rpx;
		height: 166rpx;
		opacity: 1;
		border-radius: 20rpx;
	}

	.card-right {
		width: 380rpx;
		height: 166rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.card-content {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.card-content-left {}

	.card-title {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		width: 230rpx;
		line-height: initial;
	}

	.card-num {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #65666E;
		opacity: 1;
	}

	.card-price {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FA5D34;
		opacity: 1;
	}

	.card-text {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #65666E;
		opacity: 1;
	}

	.card-footer {
		width: 100%;
		height: 112rpx;
		background: #FFFFFF;
		opacity: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
	}

	.card-btn {
		width: 114rpx;
		height: 56rpx;
		border: 1px solid #1189F4;
		opacity: 1;
		border-radius: 18px;
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 56rpx;
		color: #1189F4;
		opacity: 1;
		text-align: center;
		position: relative;
	}

	.share-btn {
		position: absolute;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		border: none;
		z-index: 90;
	}

	.card-bottom {
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		justify-content: space-between;
	}

	.card-num {
		font-size: 22px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #1189F4;
		opacity: 1;
		margin-left: 5px;
	}

	.card-code {
		width: 20px;
		height: 20px;
		background: #000000;
		opacity: 1;
	}

	.address-box {
		width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		overflow: hidden;
		margin: 0 auto;
		margin-top: 10px;
		padding-top: 20px;
		padding-bottom: 20px;
		padding-left: 24rpx;
		padding-right: 24rpx;
		box-sizing: border-box;
		background-image: url('@/common/img/address_bg.png');
		background-size: 100% 100%;
	}

	.adddress-top {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.address-name {
		font-size: 18px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #303133;
		opacity: 1;
	}

	.store-tel {
		width: 42rpx;
		height: 42rpx;
		margin-left: 22rpx;
	}

	.address-bottom {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		margin-top: 5px
	}

	.address-left {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.address-icon {
		width: 12px;
		height: 14px;
		margin-right: 5px;
	}

	.address-content {
		width: 480rpx;
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #999999;
		opacity: 1;
		line-height: initial;
	}

	.address-guide {
		width: 45px;
		height: 18px;
		background: #FFFFFF;
		border: 1px solid #1189F4;
		opacity: 1;
		border-radius: 4px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
	}

	.guide-icon {
		width: 9px;
		height: 10px;
	}

	.guide-title {
		font-size: 10px;
		font-family: PingFang SC;
		font-weight: normal;
		color: #1189F4;
		opacity: 1;
	}

	.content-box {
		width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		margin-top: 10px;
		padding: 14px;
		box-sizing: border-box;
	}

	.content-item {
		margin-top: 27px;
	}

	.content-text {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 500;
		color: #65666E;
		opacity: 1;
	}

	.content-title {
		margin-top: 5px;
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
	}

	.content-flex {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.content-btn {
		width: 74px;
		height: 28px;
		border: 1px solid #1189F4;
		opacity: 1;
		border-radius: 14px;
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 28px;
		color: #1189F4;
		opacity: 1;
		text-align: center;
	}

	.card-recordBox {
		width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		overflow: hidden;
		padding-left: 18px;
		padding-right: 14px;
		box-sizing: border-box;
		margin: 0 auto;
		margin-top: 10px;
	}

	.record-title {
		width: 100%;
		height: 44px;
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 44px;
		color: #65666E;
		opacity: 1;
	}

	.record-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 70px;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 0px;
	}

	.record-left {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.record-icon {
		width: 18px;
		height: 18px;
		background: #FFFFFF;
		border: 1px solid #DFDFDF;
		border-radius: 50%;
		opacity: 1;
		margin-right: 13px;
	}

	.record-num {
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: 500;
		color: #000000;
		opacity: 1;
	}

	.record-right {}

	.record-time {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 500;
		color: #65666E;
		opacity: 1;
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
		height: 136rpx;
		background: #FFFFFF;
		box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.01);
		opacity: 1;
		border-radius: 0px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-top: 100rpx;
	}

	.footer-bnt {
		width: 710rpx;
		height: 96rpx;
		background: #1189F4;
		opacity: 1;
		border-radius: 48rpx;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 96rpx;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
	}

	.popup-title {
		width: 750rpx;
		height: 120rpx;
		background: #FFFFFF;
		opacity: 1;
		text-align: center;
		line-height: 120rpx;
		position: relative;
		font-size: 36rpx;
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
		// height: 60px;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		margin-top: 10px;
		padding-left: 14px;
		padding-right: 14px;
		box-sizing: border-box;
		padding-top: 20rpx;
		padding-bottom: 20rpx;

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

	.inputDialog-box {
		height: 400rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		width: 300px;
	}

	.input-title {
		font-size: 18px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #364346;
		opacity: 1;
		text-align: center;
		margin-top: 20px;
	}

	.input-wrapp {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-top: 20px;
	}

	.input-text {
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: normal;
		color: #364346;
		opacity: 1;
		margin-right: 5px;
	}

	.uni-inputs {
		height: 40px;
		background: #FFFFFF;
		border: 1px solid #C5C5C5;
		opacity: 1;
		border-radius: 6px;
		padding-left: 20rpx;
		box-sizing: border-box;
	}

	.input-footer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-top: 35px;
	}

	.cancelText {
		height: 40px;
		background: #FFFFFF;
		border: 1px solid #C5C5C5;
		opacity: 1;
		border-radius: 6px;
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: normal;
		line-height: 40px;
		color: #000000;
		opacity: 1;
		text-align: center;
		margin-right: 10px;
		width: 120px;
	}

	.confirmText {
		width: 120px;
		height: 40px;
		background: #1189F4;
		opacity: 1;
		border-radius: 6px;
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: normal;
		line-height: 40px;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
	}
</style>
