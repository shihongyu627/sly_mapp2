<template>
	<view class="card" :data-theme="themeStyle">
		<mescroll-uni ref="mescroll" @getData="getGoodsList">
			<block slot="list">
				<view class="card-list">
					<view class="card-item margin-bottom" v-for="(item, index) in goodsList" :key="index">
						<view class="card-top">
							<image class="card-img" :src="goodsImg(item.card_cover)" mode="aspectFill"
								@click="toDetail(item)"></image>
							<view class="card-right">
								<view class="card-content">
									<view class="card-content-left" @click="toDetail(item)">
										<view class="card-title">
											{{item.card_name}}
										</view>
									</view>
									<view class="card-btn" @click="openPopup(item)">
										预约
									</view>
								</view>
								<view class="card-bottom">
									<view class="card-text" @click="toDetail(item)">
										剩余次数 <text
											class="card-num">{{Number(item.number)-Number(item.use_count)}}</text>
									</view>
									<view class="iconfont iconerweima" @click="previewImage(item.card_qrcode)"></view>
									<!-- 	<image class="card-code" :src="goodsImg(item.card_qrcode)" mode="aspectFill"
										@click="previewImage(item.card_qrcode)"></image> -->
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="goodsList.length == 0">
					<ns-empty text="暂无体验卡" :isIndex="!1"></ns-empty>
				</view>
			</block>
		</mescroll-uni>
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

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import list from '../public/js/list.js';
	import globalConfig from '@/common/js/golbalConfig.js';

	export default {
		components: {},
		data() {
			return {
				name: '',
				mobile: "",
				member_card_id: '',
				formData: {
					type: 'subcard',
					name: '',
					mobile: '',
					to_date: '',
					to_time: '',
					member_card_id: '',
					store_id:''
				},
				store_name: '请选择门店',
				dataList:[],
				is_bind_store:''
			};
		},
		mixins: [list, globalConfig],
		onLoad() {
			this.formData = uni.getStorageSync('subCardformData') || this.formData;
			this.is_bind_store = uni.getStorageSync('is_bind_store') || ''
			this.getData()
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
					data: {
					},
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
			inputDialogToggle() {
				this.$refs.inputDialog.open()
			},
			openPopup(item) {
				this.member_card_id = item.member_card_id
				this.formData.member_card_id = item.member_card_id
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
				let that = this
				this.$api.sendRequest({
					url: '/subcard/api/membercard/sub',
					data: this.formData,
					success: res => {
						that.$util.showToast({
							title: res.message
						});
						that.formData.to_date = ''
						that.formData.to_time = ''
						that.formData.member_card_id = ''
						uni.setStorageSync('subCardformData', that.formData || {})
						that.$refs.storePopup.close()
						if (that.$refs.loadingCover) that.$refs.loadingCover.hide();
						if (res.code == 0) {
							that.$util.redirectTo('/tabbarStore/success/success');
						}
					}
				});
			},
			goForward(item) {
				console.log('转增');
				this.member_card_id = item.member_card_id
				this.$refs.inputDialog.open()
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
	/deep/ .uni-popup__wrapper-box {
		max-height: 550px !important;
	}
	
	.card-item {
		width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		overflow: hidden;
		margin: 0 auto;
		margin-top: 10px;
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
		border-radius: 56rpx;
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 56rpx;
		color: #1189F4;
		opacity: 1;
		text-align: center;
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
		background: #FFFFFF;
		opacity: 1;
	    border-radius: 20rpx;
		margin: 0 auto;
		margin-top: 20rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
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
</style>
