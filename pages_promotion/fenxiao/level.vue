<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="container">
		<view class="level-top color-base-bg">
			<view class="head-img-wrap">
				<view>
					<view class="head-img">
						<image
							:src="fenxiaoInfo.headimg ? $util.img(fenxiaoInfo.headimg) : $util.getDefaultImage().head"
							@error="fenxiaoInfo.headimg = $util.getDefaultImage().head"
							mode="aspectFill"
						></image>
					</view>
					<view class="head-bg color-base-text" :style="{ backgroundImage: 'url(' + $util.img('public/uniapp/fenxiao/level/bg2.png') + ')' }">
						{{ fenxiaoInfo.level_name }}
					</view>
				</view>
				<view class="level-info">{{ fenxiaoInfo.nickname }}</view>
			</view>
			<view class="level-list">
					<view class="level-list-box">
						<block v-for="(item, index) in levelList" :key="index">
							<!-- <view
								class="iconfont font-father"
								:class="index < levelIndex ? 'iconyuan_checkbox isSignin' : index == levelIndex ? 'iconyuan_checked isSignin' : 'iconyuan_checkbox'"
							>
								
								<view class="font-son">{{ item.level_name }}</view>
							</view> -->
							<view class="level_list">
								<view class="level_list-top">
									<image :src="$util.img('public/uniapp/fenxiao/level/v1.png')"/></image>
									<text>{{index+1}}</text>
								</view>
								<view class="font-son">{{ item.level_name }}</view>
							</view>
							<view class="xian" v-if="index != levelList.length - 1" :class="index < levelIndex ? 'active' : ''"></view>
						</block>
					</view>
			</view>
			<view class="level-top-content">
				<view class="content-title-wrap"><view class="content-title color-base-text">当前等级佣金比率</view></view>
				<view class="level-img-item">
					<view class="level-img" v-if="Number(config.level) > 0">
						<view class="level-img-wrap"><image :src="$util.img('public/uniapp/fenxiao/level/money.png')"></image></view>
						<view class="level-img2-wrap">
							<view class="content-name">一级佣金</view>
						</view>
						<view class="level-fs">{{ levelInfo.one_rate }}%</view>
					</view>
					<view class="level-img" v-if="Number(config.level) > 1">
						<view class="level-img-wrap"><image :src="$util.img('public/uniapp/fenxiao/level/money.png')"></image></view>
						<view class="level-img2-wrap">
							<view class="content-name">二级佣金</view>
						</view>
						<view class="level-fs">{{ levelInfo.two_rate }}%</view>
					</view>
					<view class="level-img" v-if="Number(config.level) > 2">
						<view class="level-img-wrap"><image :src="$util.img('public/uniapp/fenxiao/level/money.png')"></image></view>
						<view class="level-img2-wrap">
							<view class="content-name">三级佣金</view>
						</view>
						<view class="level-fs">{{ levelInfo.three_rate }}%</view>
					</view>
				</view>
			</view>
		</view>
		<view class="level-bottom" v-if="fenxiaoInfo.condition.last_level">
			<view class="level-bottom-name">
				距离下一等级：
				<!--<view class="level_img">
					<image :src="$util.img('public/uniapp/fenxiao/level/v_h.png')"></image>
					<text >{{fenxiaoInfo.condition.last_level.level_num}}</text>
				</view>
				 <text class="color-base-text">{{ fenxiaoInfo.condition.last_level.level_name }}</text> -->
				<view class="head-bg color-base-text" :style="{ backgroundImage: 'url(' + $util.img('public/uniapp/fenxiao/level/bg3.png') + ')' }">
					{{ fenxiaoInfo.condition.last_level.level_name }}
				</view>				
			</view>
			<view class="level-bottom-title">
				<block v-if="fenxiaoInfo.condition.last_level.upgrade_type == 1">
					<text class="line-left color-base-bg"></text>
					满足以下任意条件
					<text class="line-right color-base-bg"></text>
				</block>
				<block v-else>
					<text class="line-left color-base-bg"></text>
					满足以下全部条件
					<text class="line-right color-base-bg"></text>
				</block>
			</view>
			<view class="detail">
				<view class="detail-wrap">
					<view class="detail-title">
						<text>操作行为</text>
						<text>操作进度</text>
					</view>
					<view class="detail-item " v-if="fenxiaoInfo.condition.last_level.one_fenxiao_order_num > 0">
						<view class="detail-item-name">一级分销订单总数</view>
						<view class="detail-item-content">
							<text class="color-base-text">{{ fenxiaoInfo.one_fenxiao_order_num }}</text>
							/ {{ fenxiaoInfo.condition.last_level.one_fenxiao_order_num }}
						</view>
					</view>
					<view class="detail-item" v-if="fenxiaoInfo.condition.last_level.one_fenxiao_order_money > 0">
						<view class="detail-item-name">分销订单佣金总额</view>
						<view class="detail-item-content">
							<text class="color-base-text">{{ fenxiaoInfo.one_fenxiao_order_money ? fenxiaoInfo.one_fenxiao_order_money : 0 }}</text>
							/ {{ fenxiaoInfo.condition.last_level.one_fenxiao_order_money }}
						</view>
					</view>
					<view class="detail-item" v-if="fenxiaoInfo.condition.last_level.one_fenxiao_total_order > 0">
						<view class="detail-item-name">一级分销订单总额</view>
						<view class="detail-item-content">
							<text class="color-base-text">{{ fenxiaoInfo.one_fenxiao_total_order ? fenxiaoInfo.one_fenxiao_total_order : 0 }}</text>
							/ {{ fenxiaoInfo.condition.last_level.one_fenxiao_total_order }}
						</view>
					</view>
					<view class="detail-item " v-if="fenxiaoInfo.condition.last_level.order_num > 0">
						<view class="detail-item-name">自购订单总数</view>
						<view class="detail-item-content">
							<text class="color-base-text">{{ fenxiaoInfo.order_num ? fenxiaoInfo.order_num : 0 }}</text>
							/ {{ fenxiaoInfo.condition.last_level.order_num }}
						</view>
					</view>
					<view class="detail-item" v-if="fenxiaoInfo.condition.last_level.order_money > 0">
						<view class="detail-item-name">自购订单总额</view>
						<view class="detail-item-content">
							<text class="color-base-text">{{ fenxiaoInfo.order_money ? fenxiaoInfo.order_money : 0 }}</text>
							/ {{ fenxiaoInfo.condition.last_level.order_money }}
						</view>
					</view>
					<view class="detail-item" v-if="fenxiaoInfo.condition.last_level.one_child_num > 0">
						<view class="detail-item-name">一级下线人数</view>
						<view class="detail-item-content">
							<text class="color-base-text">{{ fenxiaoInfo.one_child_num ? fenxiaoInfo.one_child_num : 0 }}</text>
							/ {{ fenxiaoInfo.condition.last_level.one_child_num }}
						</view>
					</view>
					<view class="detail-item" v-if="fenxiaoInfo.condition.last_level.one_child_fenxiao_num > 0">
						<view class="detail-item-name">一级下线分销商</view>
						<view class="detail-item-content">
							<text class="color-base-text">{{ fenxiaoInfo.one_child_fenxiao_num ? fenxiaoInfo.one_child_fenxiao_num : 0 }}</text>
							/ {{ fenxiaoInfo.condition.last_level.one_child_fenxiao_num }}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import fenxiaoWords from 'common/js/fenxiao-words.js';
export default {
	data() {
		return {
			fenxiaoInfo: {
				condition: {
					last_level: null
				}
			},
			levelInfo: {},
			config: {},
			levelList: []
		};
	},
	mixins: [fenxiaoWords],
	computed: {
		levelIndex() {
			let index = -1;
			let levelId = this.levelInfo.level_id;
			let array = this.levelList;
			for (let i = 0; i < array.length; i++) {
				if (array[i].level_id == levelId) {
					index = i;
					break;
				}
			}
			return index;
		}
	},
	onLoad() {},
	onShow() {
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
		
		if(this.fenxiaoWords && this.fenxiaoWords.fenxiao_name)this.$langConfig.title(this.fenxiaoWords.fenxiao_name + '等级');
		
		this.getFenxiaoLevel();
		if (uni.getStorageSync('token')) {
			this.getFenxiaoInfo();
			this.getBasicsConfig();
		} else {
			this.$util.redirectTo('/pages_tool/login/login', {
				back: '/pages_promotion/fenxiao/level'
			});
		}
	},
	methods: {
		/**
		 * 获取分销等级信息
		 */
		getFenxiaoLevel() {
			this.$api.sendRequest({
				url: '/fenxiao/api/Level/lists',
				success: res => {
					if (res.code == 0 && res.data) {
						this.levelList = res.data;
					}
				}
			});
		},

		/**
		 * 获取分销商信息
		 */
		getFenxiaoInfo() {
			this.$api.sendRequest({
				url: '/fenxiao/api/fenxiao/detail',
				success: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					if (res.code >= 0 && res.data) {
						this.fenxiaoInfo = res.data;
						this.getLevelInfo();
					} else {
						this.$util.redirectTo('/pages_promotion/fenxiao/apply');
					}
				},
				fail: () => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		getLevelInfo() {
			this.$api.sendRequest({
				url: '/fenxiao/api/fenxiao/level',
				data: {
					level: this.fenxiaoInfo.level_id
				},
				success: res => {
					if (res.code >= 0) {
						this.levelInfo = res.data;
					}
				}
			});
		},
		/**
		 * 获取分销基本配置
		 */
		getBasicsConfig() {
			this.$api.sendRequest({
				url: '/fenxiao/api/config/basics',
				success: res => {
					if (res.code >= 0) {
						this.config = res.data;
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.level-top {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
	background-image: linear-gradient(to right, #FF4544 ,#FD5F36);
	padding:30rpx;
	.head-img-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30rpx;

		.head-img {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			border: 6rpx solid #ffffff;
			box-sizing: border-box;
			margin: auto;

			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}

		.head-bg {
			height: 46rpx;
			margin-top: -20rpx;
			background-size: 100% 100%;
			position: relative;
			font-size: $font-size-sub;
			font-weight: 500;
			text-align: center;
			line-height: 54rpx;
			min-width: 164rpx;
			padding: 0 $padding;
			box-sizing: border-box;
			color: #CD9722 !important;
		}

		.level-info {
			color: #ffffff;
			font-size: $font-size-toolbar;
			margin-top: $margin-updown;
			line-height: 1;
			text-align: center;
		}
	}

	.level-list {
		width: 100%;
		padding: 30rpx 0;
		text-align: center;
		overflow: hidden;
		.level-list-box {
			display: flex;
			// justify-content: center;
			align-items: center;
			overflow-x: scroll;
			.iconfont {
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: $font-size-toolbar;
				color: rgba($color: #ffffff, $alpha: 0.6);
				line-height: 1;
			}

			.isSignin {
				color: #ffffff;
			}

			.xian {
				width: 70rpx;
				min-width: 70rpx;
				border: 1rpx solid rgba($color: #ffffff, $alpha: 0.6);
				margin-top: -34rpx;
			}
			.xian.active {
				border: 1rpx solid #ffffff;
			}
			.font-father {
				position: relative;
			}
			.font-son {
				padding:0 10rpx;
				bottom: -60rpx;
				left: -30rpx;
				text-align: center;
				line-height: 1;
				color: #ffffff;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: $font-size-tag;
			}

			.level-item-name {
				color: #ffffff;
				padding: 20rpx 50rpx;
			}
			.level_list{
				.level_list-top{
					position: relative;
					width:40rpx;
					margin:auto;
					image{
						width:40rpx;
						height:34rpx;
					}
					text{
						position: absolute;
						right:0rpx;
						color:#fff;
						font-size: $font-size-sub;
					}
				}
				
			}
		}
	}
	.level-top-content {
		background-color: #ffffff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width:calc(100% - 60rpx);
		margin-top: 30rpx;
		padding: 30rpx;
		border-radius: 10rpx;

		.content-title-wrap {
			flex: 1;

			.content-title {
				// padding-top: 20rpx;
				// padding-bottom: 20rpx;
			}
		}

		.level-img-item {
			
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			margin-top: 30rpx;
			margin-bottom: 20rpx;

			.level-img {
				width: 33.333%;
				position: relative;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.level-img-wrap {
					width: 84rpx;
					height: 84rpx;
					border-radius: 50%;
					border: 1rpx solid #e5e5e5;
					background-color: #ffffff;
					display: flex;
					justify-content: center;
					align-items: center;

					image {
						width: 84rpx;
						height: 84rpx;
					}
				}

				.level-img2-wrap {
					width: 120rpx;
					height: 40rpx;
					background-size: 100% 100%;
					background-repeat: no-repeat;
					text-align: center;
					line-height: 1;
					margin-top: $padding;
				}

				.content-name {
					position: relative;
					width: 100%;
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					font-weight: 500;
					
				}

				.level-fs {
					font-size: $font-size-sub;
					line-height: 1;
					margin-top: 10rpx;
					color:$color-tip
				}
			}
		}
	}
}

.detail-wrap .detail-item:nth-child(2n + 1) {
	background-color: #f7f8fa;
}

.level-bottom {
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
	height: 50%;

	.level-bottom-name {
		font-size: $font-size-base;
		padding: 30rpx;
		position:relative;
		display: flex;
		.level_img{
			width: 26rpx;
			position:relative;
			image{
				width: 26rpx;
				height: 20rpx;
			}
			text {
				line-height: 1;
				position:absolute;
				right:-2rpx;
				bottom:10rpx;
				background-image:-webkit-linear-gradient(bottom,#FF4544,#FD5F36); 
				-webkit-background-clip:text; 
				-webkit-text-fill-color:transparent; 
				font-size: $font-size-activity-tag;
			}
		}
		text {
			padding-left: 5rpx;
		}
		.head-bg{
				height: 46rpx;
				margin-top: -6rpx;
				background-size: 100% 100%;
				position: relative;
				font-size: 26rpx;
				font-weight: 500;
				text-align: center;
				line-height: 48rpx;
				min-width: 164rpx;
				padding: 0 20rpx 0 60rpx;
				-webkit-box-sizing: border-box;
				box-sizing: border-box;
				color: #fff !important;
		}
	}

	.level-bottom-title {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 24rpx 28rpx;
		text {
			width: 100rpx;
			height: 4rpx;
			opacity: 0.3;
		}
		.line-left {
			margin-right: 20rpx;
		}
		.line-right {
			margin-left: 20rpx;
		}
	}

	.detail {
		display: flex;
		flex-direction: column;

		.detail-wrap {
			display: flex;
			flex-direction: column;
			padding-bottom: 140rpx;

			.detail-title {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 24rpx 8rpx;

				text {
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}

			.detail-item {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 8rpx 24rpx;
				margin-top: 10rpx;
				&.active{
					background-color: #F8F8F8;
				}
				.detail-item-name {
					flex: 1;
					color: $color-tip;
					display: flex;
					justify-content: center;
					align-items: center;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.detail-item-content {
					flex: 1;
					color: $color-tip;
					display: flex;
					justify-content: center;
					align-items: center;

					text {
						margin-right: 4rpx;
					}
				}
			}
		}
	}
}

</style>
