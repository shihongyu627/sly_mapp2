<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="apply">
		<!-- 导航栏 -->
		<!-- #ifdef H5 -->
		<view class="head-nav color-base-bg"></view>
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<!-- <view class="head-nav color-base-bg" :class="{ active: isIphoneX }"></view> -->
		<!-- #endif -->

		<view v-if="status === ''">
			<view class="image" :class="fenXiaoAgreement.agreement.img ? '' : 'color-base-bg'">
				<image v-if="fenXiaoAgreement.agreement.img" class="apply-adv" :src="$util.img(fenXiaoAgreement.agreement.img)" mode="widthFix" style="width: 100%;"></image>
				<view class="bg ns-gradient-otherpages-fenxiao-apply-apply-bg" v-else>
					<view class="bg-title"><text>请填写申请信息</text></view>
					<view class="bg-img"><image :src="$util.img('public/uniapp/fenxiao/apply/edit.png')" mode="scaleToFill"></image></view>
				</view>
			</view>

			<view class="apply-wrap">
				<view class="app-info">
					<view class="info">
						<view class="apply-item">
							<view class="title">邀请人</view>
							<text class="shuru">{{ sourceMemberInfo.fenxiao_name }}</text>
						</view>
						<view class="apply-item">
							<view class="title">{{ fenxiaoWords.fenxiao_name }}名称</view>
							<input
								class="input"
								type="text"
								maxlength="30"
								:placeholder="'请输入' + fenxiaoWords.fenxiao_name + '名称'"
								v-model="formData.fenXiaoName"
								placeholder-class="pla-cla"
							/>
						</view>
						<view class="apply-item">
							<view class="title">手机号</view>
							<input class="input" type="number" placeholder="请输入手机号" maxlength="11" v-model="formData.mobile" placeholder-class="pla-cla" />
						</view>
						<view class="apply-xy" v-if="isAgreement" @click="ckeckedRuler()">
							<view class="iconfont" :class="isChecked ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'"></view>
							我已阅读并了解
							<text class="color-base-text" @click.stop="openPopup">【{{ fenxiaoWords.fenxiao_name }}申请协议】</text>
						</view>
						<view class="apply-btn">
							<button @click="applyFenXiao" class="color-base-bg">申请成为{{ fenxiaoWords.fenxiao_name }}</button>
						</view>
					</view>
				</view>

				<view class="apply-message-wrap" v-if="fenxiaoConfig.fenxiao_condition == 2 || fenxiaoConfig.fenxiao_condition == 3">
					<view class="apply-message">
						<view class="apply-message-title color-base-bg-before">分销商申请条件</view>
						<text class="apply-message-info font-size-goods-tag" v-if="fenxiaoConfig.fenxiao_condition == 2">
							申请成为{{ fenxiaoWords.fenxiao_name }},需要您的消费次数需要达到{{ fenxiaoConfig.consume_count }}次
						</text>
						<text class="apply-message-info font-size-goods-tag" v-if="fenxiaoConfig.fenxiao_condition == 3">
							申请成为{{ fenxiaoWords.fenxiao_name }},需要您的消费金额需要达到{{ fenxiaoConfig.consume_money }}元
						</text>
					</view>
				</view>
				<view class="app-info-list" v-if="fenxiaoConfig.fenxiao_condition == 4">
					<view class="apply-message">
						<view class="apply-message-title color-base-bg-before">分销商申请条件</view>
						<text class="apply-message-info font-size-goods-tag">申请成为{{ fenxiaoWords.fenxiao_name }},需要购买以下指定商品(任选其一)</text>
					</view>
					<view class="goods-list" v-for="(item, index) in goodsList" :key="index" @click="toDetail(item)">
						<view class="goods-img">
							<image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(index)"></image>
							<view class="color-base-bg goods-tag" v-if="goodsTag(item) != ''">{{ goodsTag(item) }}</view>
						</view>
						<view class="goods-content">
							<view class="content-name">{{ item.goods_name }}</view>
							<!-- <view class="content-price">{{ item.market_price > 0 ? item.market_price : item.price }}</view> -->
							<view class="delete-price font-size-activity-tag color-tip content-price">
								<block>
									<text class="unit">{{ $lang('common.currencySymbol') }}</text>
									{{ item.market_price > 0 ? item.market_price : item.price }}
								</block>
							</view>
						</view>
					</view>
					<view class="content-lists" v-if="isShow" @click="onOpen()">
						{{ isOpen ? '展开更多' : '收起' }}
						<text class="iconfont iconunfold" style="font-weight: bold;" v-if="isOpen"></text>
						<text class="iconfont iconfold" v-else></text>
					</view>
				</view>
			</view>
		</view>
		<view class="empty" v-else>
			<image :src="$util.img('public/uniapp/fenxiao/index/no-fenxiao.png')" mode="widthFix"></image>
			<text v-if="status == 1">您已提交{{ fenxiaoWords.fenxiao_name }}申请，等待平台审核</text>
			<block v-else-if="status == -1">
				<text>您提交的{{ fenxiaoWords.fenxiao_name }}申请，已被拒绝，请再接再厉</text>
				<view class="again-btn color-base-bg" @click="againApply" v-if="fenxiaoConfig.fenxiao_condition != 0">重新申请</view>
				<view class="again-btn color-base-bg" @click="applyFenXiao" v-else>重新申请</view>
			</block>
		</view>
		<view @touchmove.prevent v-if="fenXiaoAgreement.document">
			<uni-popup ref="applyPopup" type="center" class="wap-floating">
				<view class="conten-box">
					<text class="iconfont iconclose" @click="toClose"></text>
					<view class="title">{{ fenXiaoAgreement.document.title }}</view>
					<view class="content-con">
						<scroll-view scroll-y="true" class="con" show-scrollbar="true"><rich-text :nodes="fenXiaoAgreement.document.content"></rich-text></scroll-view>
					</view>
				</view>
			</uni-popup>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import validate from 'common/js/validate.js';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import fenxiaoWords from 'common/js/fenxiao-words.js';
export default {
	data() {
		return {
			isChecked: false,
			isShow: true,
			isIphoneX: false,
			// 推荐人信息
			sourceMemberInfo: {
				fenxiao_name: '无'
			},
			formData: {
				fenXiaoName: '',
				mobile: ''
			},
			fenXiaoAgreement: {
				agreement: {},
				document: {}
			},
			isAgreement: false,
			back: '',
			isAbled: false,
			status: '',
			isSub: false,
			fenxiaoConfig: {
				fenxiao_condition: 0
			},
			basicsConfig: {},
			goodsList: [],
			isOpen: false
		};
	},
	components: {},
	mixins: [fenxiaoWords],
	onLoad(option) {
		this.onOpen();
		this.getAgreement();
		if (option.back) this.back = option.back;
	},
	async onShow() {
		setTimeout( () => {
			if (this.addonIsExist && !this.addonIsExist.fenxiao) {
				this.$util.showToast({
					title: '商家未开启分销',
					mask: true,
					duration: 2000
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
				}, 2000);
				return;
			}
		}, 1000);

		this.isIphoneX = this.$util.uniappIsIPhoneX();

		if(this.fenxiaoWords && this.fenxiaoWords.fenxiao_name) this.$langConfig.title(this.fenxiaoWords.fenxiao_name + '申请');

		if (uni.getStorageSync('token')) {
			this.applyStatus();
			this.getSourceMemberInfo();
		} else {
			this.$util.redirectTo(
				'/pages_tool/login/login',
				{
					back: '/pages_promotion/fenxiao/apply'
				},
				'redirectTo'
			);
		}

		this.getFenxiaoConfig();
		this.getFenxiaoBasicsConfig();
	},
	methods: {
		toClose() {
			this.$refs.applyPopup.close();
		},
		ckeckedRuler() {
			this.isChecked = !this.isChecked;
		},
		goodsImg(imgStr) {
			let imgs = imgStr.split(',');
			return imgs[0]
				? this.$util.img(imgs[0], {
						size: 'mid'
			   })
				: this.$util.getDefaultImage().goods;
		},
		imgError(index) {
			this.goodsList[index].goods_image = this.$util.getDefaultImage().goods;
		},
		onOpen() {
			this.isOpen = this.isOpen ? false : true;
			this.getFenxiaoConfig();
		},
		goodsTag(data) {
			return data.label_name || '';
		},
		//商品详情
		toDetail(item) {
			this.$util.redirectTo('/pages/goods/detail', {
				goods_id: item.goods_id
			});
		},
		applyStatus() {
			this.$api.sendRequest({
				url: '/fenxiao/api/apply/status',
				data: {},
				success: res => {
					if (res.code >= 0 && res.data) {
						this.status = res.data.status;
						this.isSub = false;
						if (this.status == 2) {
							this.$util.redirectTo('/pages/member/index', {}, 'tabbar');
						}
					}
					this.$refs.loadingCover.hide();
				}
			});
		},
		navigateBack() {
			this.$util.goBack();
		},
		applyFenXiao() {
			if (this.fenxiaoConfig.fenxiao_condition != 0) {
				if (!this.fenXiaoValidata()) return;
				if (this.isAgreement && !this.isChecked) {
					this.$util.showToast({
						title: '请仔细阅读协议，并勾选'
					});
					return;
				}
			}

			if (this.isSub) return;
			this.isSub = true;
			this.$api.sendRequest({
				url: '/fenxiao/api/apply/applyfenxiao',
				data: {
					fenxiao_name: this.formData.fenXiaoName,
					mobile: this.formData.mobile,
					fenxiao_condition: this.fenxiaoConfig.fenxiao_condition
				},
				success: res => {
					if (res.code >= 0 && res.data) {
						if (this.basicsConfig.is_examine == 1) {
							this.applyStatus();
						} else {
							this.$util.redirectTo('/pages_promotion/fenxiao/index');
						}
					} else {
						this.isSub = false;
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		},
		// 申请协议
		getAgreement() {
			this.$api.sendRequest({
				url: '/fenxiao/api/config/agreement',
				success: res => {
					if (res.code === 0) {
						this.fenXiaoAgreement = res.data;
						if (this.fenXiaoAgreement.agreement.is_agreement === '1') {
							this.isAgreement = true;
						}
					}
				}
			});
		},
		openPopup() {
			if (this.isAgreement) this.$refs.applyPopup.open();
		},
		closePopup() {
			this.$refs.applyPopup.close();
		},
		fenXiaoValidata() {
			let rule = [
				{
					name: 'fenXiaoName',
					checkType: 'required',
					errorMsg: '请输入' + this.fenxiaoWords.fenxiao_name + '名称'
				},
				{
					name: 'mobile',
					checkType: 'required',
					errorMsg: '请输入手机号'
				},
				{
					name: 'mobile',
					checkType: 'phoneno',
					errorMsg: '请输入正确的手机号'
				}
			];
			var checkRes = validate.check(this.formData, rule);
			if (checkRes) {
				return true;
			} else {
				this.$util.showToast({
					title: validate.error
				});
				return false;
			}
		},
		// 获取推广人信息
		getSourceMemberInfo() {
			this.$api.sendRequest({
				url: '/fenxiao/api/fenxiao/sourceinfo',
				success: res => {
					if (res.code == 0 && res.data) {
						this.sourceMemberInfo = res.data;
					}
				}
			});
		},
		/**
		 * 重新申请
		 */
		againApply() {
			this.status = '';
		},
		/**
		 * 获取申请条件
		 */
		getFenxiaoConfig() {
			this.$api.sendRequest({
				url: '/fenxiao/api/config/fenxiao',
				data: {},
				success: res => {
					if (res.code >= 0 && res.data) {
						this.fenxiaoConfig = res.data;
						this.goodsList = res.data.goods_list;
						if (this.goodsList.length <= 3) {
							this.isShow = false;
						} else if (this.goodsList.length > 3 && this.isOpen == true) {
							this.isShow = true;
							this.goodsList = res.data.goods_list.slice(0, 3);
						}
						// if(this.isOpen){
						// 	if(this.goodsList.length > 3){
						// 		this.goodsList = res.data.goods_list.slice(0,3)
						// 		this.isOpen = true;
						// 	}else{
						// 		this.goodsList = res.data.goods_list
						// 		this.isOpen = false;
						// 	}
						// } else {
						// 	this.goodsList = res.data.goods_list;
						// 	this.isOpen = false;
						// }
					}
				}
			});
		},

		/**
		 * 获取分销基本配置
		 */
		getFenxiaoBasicsConfig() {
			this.$api.sendRequest({
				url: '/fenxiao/api/config/basics',
				data: {},
				success: res => {
					if (res.code >= 0 && res.data) {
						this.basicsConfig = res.data;
					}
				}
			});
		}
	},
	onBackPress(options) {
		if (options.from === 'navigateBack') {
			return false;
		}
		this.$util.redirectTo('/pages/member/index', {}, 'reLaunch');
		return true;
	}
};
</script>

<style lang="scss">
.image {
	width: 100%;
}
/deep/.uni-scroll-view {
	background-color: #fff;
}

/deep/.uni-scroll-view::-webkit-scrollbar {
	/* 隐藏滚动条，但依旧具备可以滚动的功能 */
	display: none;
}

.head-nav {
	width: 100%;
	height: var(--status-bar-height);
}

.head-nav.active {
	padding-top: 40rpx;
}
.head-return {
	height: 90rpx;
	line-height: 90rpx;
	color: #fff;
	font-weight: 600;
	font-size: $font-size-base;
	position: relative;
	text-align: center;
	text {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: 20rpx;
		display: inline-block;
		margin-right: 10rpx;
		font-size: 32rpx;
	}
}

input::placeholder {
	text-align: right;
}
.apply {
	.bg {
		height: 160rpx;
		display: flex;
		justify-content: space-between;
		padding: 30rpx 80rpx 44rpx 80rpx;
		align-items: center;

		.bg-title {
			color: #ffffff;
			font-size: 36rpx;
		}

		.bg-img {
			width: 150rpx;
			height: 150rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.apply-adv {
		width: 100%;
	}

	.apply-wrap {
		padding-bottom: 100rpx;
		.app-info {
			position: relative;
			top: -28rpx;
			width: 692rpx;
			margin: 0 auto;
			border-radius: 10rpx;
			background-color: #ffffff;

			.info {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.apply-item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: calc(100% - 100rpx);
					background-color: #f8f8f8;
					padding: 20rpx 10rpx;
					margin: 4rpx 10rpx;
					background-color: #ffffff;
					border-bottom: 1rpx solid #f1f1f1;

					.title {
						color: #000;
						font-size: 28rpx;
					}

					.input {
						width: 70%;
						text-align: right;
						height: 40rpx;
						padding-left: 30rpx;
						font-size: $font-size-tag;
						color: #a7a7a7;
					}

					.pla-cla {
						color: #babbc1;
					}

					.shuru {
						padding-left: 30rpx;
					}
				}

				.apply-xy {
					display: flex;
					margin-top: 30rpx;
					color: #838383;
					align-items: center;
					font-size: 26rpx;

					text {
						color: #a7a7a7;
					}

					.iconyuan_checkbox {
						font-size: 36rpx;
						color: #838383;
						margin-right: 14rpx;
						line-height: 1;
					}

					.iconyuan_checked {
						font-size: 36rpx;
						margin-right: 14rpx;
						line-height: 1;
					}
				}
			}
		}

		.app-info-list {
			margin: 0 30rpx 20rpx;
			padding: 30rpx;
			border-radius: 10rpx;
			background-color: #ffffff;

			.apply-message-title {
				line-height: 1;
				font-size: 28rpx;
				font-weight: bold;
				position: relative;
				padding-left: $padding;
				box-sizing: border-box;
			}

			.apply-message-title::before {
				content: '';
				display: block;
				position: absolute;
				width: 6rpx;
				height: 100%;
				left: 0;
				top: 0;
				border-radius: 6rpx;
			}

			.apply-message-info {
				display: inline-block;
				line-height: 1.2;
				color: #333;
				background: #f9f9f9;
				position: relative;
				top: 20rpx;
				width: 586rpx;
				padding: 20rpx 20rpx;
				border-radius: 10rpx;
				margin-bottom: 40rpx;
			}

			.goods-list {
				padding: 30rpx 0;
				// margin-top: 50rpx;
				display: flex;
				border-bottom: 2rpx solid #f6f5f5;

				.goods-img {
					width: 130rpx;
					height: 130rpx;
					margin-right: 20rpx;
					border-radius: 10rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
				.goods-content {
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.content-name {
						font-size: 28rpx;
						color: #303133;
						width: 460rpx;
						display: -webkit-box;
						line-clamp: 2;
						-webkit-line-clamp: 2;
						overflow: hidden;
						text-overflow: ellipsis;
						-webkit-box-orient: vertical;
					}
					.content-price {
						font-size: 28rpx !important;
						font-weight: 600;
						color: #ff4a01 !important;
					}
				}
			}

			.content-lists {
				margin: 20rpx auto 0;
				text-align: center;
				color: #a1a3a8;

				text {
					padding-left: 10rpx;
				}
			}
		}

		.apply-btn {
			margin: 50rpx auto 70rpx auto;
			border-radius: $border-radius;
			width: 90%;

			button {
				color: #ffffff;
				width: 100%;
				margin: 0;
			}
		}

		.apply-message-wrap {
			margin-bottom: 100rpx;
			width: 100%;
			padding: 10rpx;
			display: flex;
			justify-content: center;

			.apply-message {
				width: 85%;
				display: flex;
				flex-direction: column;

				.apply-message-title {
					line-height: 1;
					font-size: $font-size-tag;
					position: relative;
					padding-left: $padding;
					box-sizing: border-box;
				}

				.apply-message-title::before {
					content: '';
					display: block;
					position: absolute;
					width: 6rpx;
					height: 100%;
					left: 0;
					top: 0;
					border-radius: 6rpx;
				}

				.apply-message-info {
					padding-top: $padding;
					line-height: 1.2;
					color: $color-tip;
				}
			}
		}
	}

	.again-btn {
		display: flex;
		justify-content: center;
		width: auto;
		border-radius: $border-radius;
		margin-top: 20rpx;
		color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10rpx 60rpx;
		box-sizing: border-box;
	}

	.conten-box {
		padding: 0 30rpx;
		box-sizing: border-box;
		height: 812rpx;
		width: 580rpx;
		border-radius: 10rpx;

		text {
			margin-top: 25rpx;
			float: right;
			line-height: 1;
		}

		.title {
			width: 100%;
			font-size: 36rpx;
			font-weight: bold;
			display: flex;
			align-items: center;
			justify-content: center;
			border-bottom: 2rpx solid #e0e0e0;
			line-height: 1;
			padding-bottom: 28rpx;
		}

		.content-con {
			width: 100%;
			height: 680rpx;
			box-sizing: border-box;
		}

		.con {
			width: 100%;
			height: 100%;
		}

		.sure {
			width: 100%;
			height: 100rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.sure-btn {
				width: 100%;
				height: 60rpx;
				border-radius: $border-radius;
				color: #ffffff;
				text-align: center;
				line-height: 60rpx;
			}
		}
	}

	.empty {
		width: 100%;
		margin-top: 200rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		image {
			width: 300rpx;
			height: 176rpx;
			margin-bottom: 50rpx;
		}

		text {
			font-size: $font-size-goods-tag;
			font-weight: 600;
		}
	}
}
</style>

<style>
/deep/ .uni-popup__wrapper-box {
	border-radius: 20rpx;
}
</style>
