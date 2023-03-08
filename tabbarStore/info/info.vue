<template>
	<view :data-theme="themeStyle">
		<view class="header-box">
			<view class="header-banner">
				<image class="header-banner" :src="loadimg(detail.store_image)" mode="aspectFill"
					@click="goInfo(detail)">
				</image>
			</view>
			<view class="footer-map">
				<view class="list-top">
					<image class="store-img" :src="loadimg(detail.store_image)" mode="aspectFill"
						@click="goInfo(detail)">
					</image>
					<view class="item-right">
						<view class="item-one" @click="goInfo(detail)">
							<view class="item-storeName">
								{{detail.store_name}}
							</view>
							<view class="item-km" v-if="detail.distance">
								{{(Number(detail.distance)).toFixed(2)}}km
							</view>
						</view>
						<view class="item-two">
							<view class="item-time" @click="goInfo(detail)">
								营业时间：{{ detail.open_date }}
							</view>
							<img class='store-tel' src="@/common/img/store_tel.png" mode="aspectFill"
								@click="makePhone(detail)" />
						</view>
					</view>
				</view>
				<view class="item-footer">
					<view class="address-box" @click="goInfo(detail)">
						<img class='address-icon' src="@/common/img/address_icon.png" mode="aspectFill" />
						<view class="address-text">
							{{ removeComma(detail.address)}}
						</view>
					</view>
					<view class="address-go" @click="goHerf(detail)">
						去这里
					</view>
				</view>
			</view>
		</view>
		<view class="ranking-title">
			明星排行榜
		</view>
		<view class="record-list" v-if="orderList.length > 0">
			<view class="record-item" v-for="(item,index) in orderList" :key="index">
				<view class="record-index" v-if="index!=0&&index!=1&&index!=2">
					{{index+1}}
				</view>
				<img class='record-index' src="@/common/img/oneIcon.png" mode="aspectFill" v-if="index==0" />
				<img class='record-index' src="@/common/img/TwoIcon.png" mode="aspectFill" v-if="index==1" />
				<img class='record-index' src="@/common/img/ThreeIcon.png" mode="aspectFill" v-if="index==2" />
				<view class="record-right">
					<view class="record-box">
						<image class="record-head" :src="loadimg(item.headimg)" mode="aspectFill">
							<view class="">
								<view class="record-top">
									<view class="record-name">
										{{item.nickname}}
									</view>
									<view class="record-total">
										体验{{item.sub_count}}次
									</view>
								</view>

								<view class="record-phone">
									加入时间：{{ $util.timeStampTurnTime(item.create_time) }}
								</view>
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
		<!-- <view class="footer-box">
			<view class="footer-bnt" @click="openPopup()">
				立即预约
			</view>
		</view> -->
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		components: {},
		data() {
			return {
				isIphoneX: false,
				detail: {

				},
				orderList: [],
				formData: {
					type: 'store',
					name: '',
					mobile: '',
					to_date: '',
					to_time: '',
					store_id: ''
				},
				storeId: '',
				num: 1,
				total: 0
			};
		},
		onLoad(data) {
			console.log(data);
			this.formData = uni.getStorageSync('subformData') || this.formData;
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			this.$langConfig.title(data.store_name);
			this.storeId = data.storeId
			this.formData.store_id = data.storeId
			let that = this
			uni.getLocation({
				type: 'gcj02',
				success: res => {
					console.log('当前位置的经度：' + res.longitude);
					console.log('当前位置的纬度：' + res.latitude);
					that.latitude = res.latitude
					that.longitude = res.longitude
					if (data.storeId) {
						this.getInfo()
					}
				},
				fail: res => {
					if(data.storeId){
						this.getInfo()
					}
				}
			});
			if (data.storeId) {
				this.getListData()
			}
		},
		created() {},
		mixins: [globalConfig],
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			if (uni.getStorageSync('token')) {
				if (this.$refs.mescroll) this.$refs.mescroll.refresh();
			} else {
				// this.$util.redirectTo('/pages/login/login/login', {
				// 	back: '/tabbarStore/info/info?status=' + this.orderStatus
				// });
			}
		},
		onReachBottom() {
			if (this.total == this.orderList.length) {
				return
			}
			this.num += 1
			this.getListData()
		},
		methods: {
			getListData() {
				this.$api.sendRequest({
					url: '/api/store/memberlists',
					data: {
						page: this.num,
						page_size: 10,
						tag: 'top',
						store_id: this.storeId
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
						if (this.num == 1) this.orderList = []; //如果是第一页需手动制空列表
						this.orderList = this.orderList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			//获取门店详情
			getInfo() {
				let data = {
					store_id: this.storeId
				};
				if (this.latitude && this.longitude) {
					data.latitude = this.latitude;
					data.longitude = this.longitude;
				}
				this.$api.sendRequest({
					url: '/api/store/info',
					data: data,
					success: res => {
						if (res.data) {
							this.detail = res.data;
						}
					}
				});
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
						uni.setStorageSync('subformData', this.formData || {});
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
			loadimg(imgStr) {
				return this.$util.loadimg(imgStr)
			},
			removeComma(str) {
				return this.$util.removeComma(str)
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
			goInfo(item) {
				this.$util.redirectTo('/tabbarStore/info/info', {
					store_name: item.store_name,
					storeId: item.store_id
				}, );

			},
			makePhone(item) {
				console.log(item, '打电话');
				if (!item.telphone) {
					return
				}
				uni.makePhoneCall({
					phoneNumber: item.telphone //仅为示例
				});
			}
		},
	};
</script>
<style lang="scss" scoped>
	.header-box {}

	.header-banner {
		width: 100%;
		height: 750rpx;
		background: #ccc;
	}

	.footer-map {
		width: 710rpx;
		padding-left: 24rpx;
		padding-right: 24rpx;
		box-sizing: border-box;
		// width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		margin: 0 auto;
		margin-top: -70px;
		position: relative;
	}

	.list-top {
		margin-bottom: 20rpx;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
		width: 100%;
	}

	.store-img {
		width: 132rpx;
		height: 132rpx;
		opacity: 1;
		border-radius: 20rpx;
		overflow: hidden;
		background: #ccc;
	}

	.item-right {
		width: 500rpx;
	}

	.item-one {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.item-storeName {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		width: 340rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.item-km {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #000000;
		opacity: 1;
	}

	.item-two {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.item-time {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: normal;
		color: #A9AAB0;
		opacity: 1;
	}

	.store-tel {
		width: 36rpx;
		height: 36rpx;
	}

	.item-footer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.address-box {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.address-icon {
		width: 28rpx;
		height: 28rpx;
		margin-right: 10rpx;
	}

	.address-text {
		width: 408rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: normal;
		color: #000000;
		opacity: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.address-go {
		width: 136rpx;
		height: 60rpx;
		background: #1189F4;
		opacity: 1;
		border-radius: 30rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 60rpx;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
	}

	.ranking-title {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		margin-top: 30rpx;
		margin-bottom: 20rpx;
		margin-left: 44rpx;
	}

	.record-list {
		width: 710rpx;
		margin: 0 auto;
		padding-bottom: 90rpx;
	}


	.record-item {
		width: 710rpx;
		height: 190rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 20rpx;
		padding-right: 40rpx;
		padding-left: 24rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
	}

	.record-index {
		font-size: 36rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		width: 72rpx;
		height: 72rpx;
		text-align: center;
	}

	.record-right {
		width: 550rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.record-box {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.record-head {
		width: 40px;
		height: 40px;
		opacity: 1;
		border-radius: 24px;
		background: #ccc;
		margin-right: 8px;
	}

	.record-top {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 460rpx;
	}

	.record-name {
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
	}

	.record-phone {
		font-size: 11px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #65666E;
		opacity: 1;
	}

	.record-total {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #65666E;
		opacity: 1;
	}

	.footer-box {
		width: 100%;
		height: 68px;
		background: #FFFFFF;
		box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.01);
		opacity: 1;
		border-radius: 0px;
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

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
