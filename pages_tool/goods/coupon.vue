<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<view class="cf-container color-line-border" >
			<view class="tab">
				<view @click="changeSort(1)"><text :class="sort == 1 ? 'color-base-text active color-base-border-bottom' : ''">全部</text></view>
				<view @click="changeSort(2, 'reward')"><text :class="sort == 2 ? 'color-base-text active color-base-border-bottom' : ''">满减券</text></view>
				<view @click="changeSort(3, 'discount')"><text :class="sort == 3 ? 'color-base-text active color-base-border-bottom' : ''">折扣券</text></view>
				<view @click="changeSort(4, 'no_threshold')"><text :class="sort == 4 ? 'color-base-text active color-base-border-bottom' : ''">无门槛券</text></view>
			</view>
		</view>
		
		<mescroll-uni ref="mescroll" top="100" @getData="getMemberCounponList">
			<block slot="list">
				<view class="coupon-listone">
					<view
						class="item"
						v-for="(item, index) in list"
						:key="index"
						@click="liClick(item, index)"
						:style="{ backgroundColor: item.useState == 2 ? '#F2F2F2' : 'var(--main-color-shallow)' }"
					>
						<view
							class="item-base"
							 
							:class="{ disabled: item.useState == 2 }"
						>
							<image class="coupon-line" mode="heightFix" :src="$util.img('public/uniapp/coupon/coupon_line.png')"></image>
							<view>
								<view class="use_price price-font" v-if="item.type == 'reward'" :class="{ disabled: item.useState == 2 }">
									<text>￥</text>
									{{ parseInt(item.money) }}
								</view>
								<view class="use_price price-font" v-else-if="item.type == 'discount'" :class="{ disabled: item.useState == 2 }">
									{{ parseFloat(item.discount) }}
									<text>折</text>
								</view>
								<view class="use_condition font-size-tag" v-if="item.at_least > 0" :class="{ disabled: item.useState == 2 }">满{{ item.at_least }}元可用</view>
								<view class="use_condition font-size-tag" v-else :class="{ disabled: item.useState == 2 }">无门槛优惠券</view>
							</view>
						</view>
						<view class="item-info">
							<view class="use_title">
								<view class="title">{{ item.coupon_name }}</view>
								<view class="max_price" v-if="item.goods_type == 1" :class="{ disabled: item.useState == 2 }">全场商品</view>
								<view class="max_price" v-else :class="{ disabled: item.useState == 2 }">指定商品</view>
								<view class="max_price" v-if="item.discount_limit != '0.00'">(最大优惠{{ item.discount_limit }}元)</view>
							</view>
							<view class="use_time" v-if="item.validity_type == 0">有效期：{{ $util.timeStampTurnTime(item.end_time) }}</view>
							<view class="use_time" v-else-if="item.validity_type == 1">有效期：领取之日起{{ item.fixed_term }}日内有效</view>
							<view class="use_time" v-else>有效期：长期有效</view>
						</view>
						<view class="item-btn">
							<view v-if="item.useState == 0" @click.stop="receiveCoupon(item, index)">领取</view>
							<view v-if="item.useState == 1" @click.stop="toGoodsList(item, index)">去使用</view>
							<view v-if="item.useState == 2" :class="{ disabled: item.useState == 2 }">已抢光</view>
						</view>
					</view>
				</view>
				<view v-if="list.length == 0"><ns-empty text="暂无可领取的优惠券" :isIndex="false"></ns-empty></view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>

		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [],
			sort: 1,
			types: '',
			couponBtnSwitch: false,
			//分享建立上下级id
			memberId: 0,
			mpShareData: null //小程序分享数据
		};
	},
	onLoad(option) {
		//获取memberId
		this.$util.getMemberId().then(resolve => {
			this.memberId = resolve;
		});
		//小程序分享接收source_member
		if (option.source_member) {
			uni.setStorageSync('source_member', option.source_member);
		}
		// 小程序扫码进入，接收source_member
		if (option.scene) {
			var sceneParams = decodeURIComponent(option.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('sku_id') != -1) this.skuId = item.split('-')[1];
					if (item.indexOf('m') != -1) uni.setStorageSync('source_member', item.split('-')[1]);
					if (item.indexOf('is_test') != -1) uni.setStorageSync('is_test', 1);
				});
			}
		}
	},
	onShow() {
		setTimeout( () => {
			if (this.addonIsExist && !this.addonIsExist.coupon) {
				this.$util.showToast({
					title: '商家未开启优惠券',
					mask: true,
					duration: 2000
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
				}, 2000);
				return;
			}
		}, 1000);

		//记录分享关系
		if (uni.getStorageSync('token') && uni.getStorageSync('source_member')) {
			this.$util.onSourceMember(uni.getStorageSync('source_member'));
		}

		//小程序分享
		// #ifdef MP-WEIXIN
		this.$util.getMpShare().then(res => {
			this.mpShareData = res;
		});
		// #endif

		
		
	},
	//分享给好友
	onShareAppMessage() {
		return this.mpShareData.appMessage;
	},
	//分享到朋友圈
	onShareTimeline() {
		return this.mpShareData.timeLine;
	},
	methods: {
		changeSort(sort, types) {
			this.list = [];
			this.sort = sort;
			this.types = types;
			this.$refs.mescroll.refresh(false);
		},
		liClick(item, index) {
			if (item.useState == 0) this.receiveCoupon(item, index);
			else this.toGoodsList(item, index);
		},

		//领取优惠券
		receiveCoupon(item, index) {
			if (this.couponBtnSwitch) return;
			this.couponBtnSwitch = true;
			let token = uni.getStorageSync('token');
			if (token != '') {
				this.$api.sendRequest({
					url: '/coupon/api/coupon/receive',
					data: {
						coupon_type_id: item.coupon_type_id,
						get_type: 2 //获取方式:1订单2.直接领取3.活动领取
					},
					success: res => {
						this.couponBtnSwitch = false;
						let msg = '';
						msg = '领取成功，快去使用吧';
						let list = this.list;
						if (res.data.is_exist == 1 && res.code < 0) {
							msg = '您已领取过该优惠券，快去使用吧';
						} else {
							msg = res.message;
						}
						if (res.data.is_exist == 1) {
							for (let i = 0; i < list.length; i++) {
								if (list[i].coupon_type_id == item.coupon_type_id) {
									list[i].useState = 1;
								}
							}
						} else {
							for (let i = 0; i < list.length; i++) {
								if (list[i].coupon_type_id == item.coupon_type_id) {
									list[i].useState = 2;
								}
							}
						}
						this.$util.showToast({
							title: msg
						});
					},
					fail: res => {
						this.couponBtnSwitch = false;
					}
				});
			} else {
				this.couponBtnSwitch = false;
				this.$refs.login.open('/pages_tool/login/login');
			}
		},
		//获取优惠券列表
		getMemberCounponList(mescroll) {
			this.$api.sendRequest({
				url: '/coupon/api/coupon/typepagelists',
				data: {
					page: mescroll.num,
					page_size: mescroll.size,
					sort: this.sort,
					type: this.types
				},
				success: res => {
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						});
					}
					mescroll.endSuccess(newArr.length);
					if (newArr.length) {
						newArr.forEach(v => {
							if (v.count == v.lead_count) v.useState = 2;
							else if(v.max_fetch != 0 && v.member_coupon_num && v.member_coupon_num >= v.max_fetch) v.useState = 1;
							else v.useState = 0;
						});
					}
					//设置列表数据
					if (mescroll.num == 1) this.list = []; //如果是第一页需手动制空列表
					this.list = this.list.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail() {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		imageError(index) {
			this.list[index].logo = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		couponImageError(index) {
			this.list[index].image = this.$util.img('public/uniapp/goods/coupon.png');
			this.$forceUpdate();
		},
		toGoodsList(item) {
			if (item.goods_type != 1) {
				this.$util.redirectTo('/pages/goods/list', {
					coupon: item.coupon_type_id
				});
			} else {
				this.$util.redirectTo('/pages/goods/list', {});
			}
		}
	}
};
</script>

<style lang="scss">
.coupon-head {
	padding: 20rpx 50rpx;
	display: flex;
	background: #fff;

	.sort {
		border: 2rpx solid #c5c5c5;
		padding: 1rpx 20rpx;
		border-radius: $border-radius;
		cursor: pointer;
		margin-right: 15rpx;
	}
}
.coupon-listone {
	padding: 0 30rpx;

	.item {
		display: flex;
		background-color: #fff2f0; //
		background-size: 100% 100%;
		border-radius: 20rpx;
		align-items: stretch;
		margin-top: $padding;
		overflow: hidden;

		.item-base {
			position: relative;
			width: 197rpx;
			min-width: 197rpx;
			text-align: center;
			background: linear-gradient(to left, var(--bg-color), var(--bg-color-shallow));
			background-repeat: no-repeat;
			background-size: 100% 100%;
			padding: 38rpx 10rpx 38rpx 18rpx;
			&.disabled{
				background: #dedede;
			}
			.coupon-line{
				position: absolute;
				right: 0;
				top: 0;
				height: 100%;
			}
			> view {
				height: auto;
				position: relative;
				top: 50%;
				transform: translate(0, -50%);
			}

			.use_price {
				font-size: 60rpx;
				line-height: 1;
				color: #fff;

				text {
					font-size: $font-size-toolbar;
				}

				&.disabled {
					color: $color-tip;
				}
			}

			.use_condition {
				color: #fff;
				margin-top: $padding;

				&.margin_top_none {
					margin-top: 0;
				}

				&.disabled {
					color: $color-tip;
				}
			}

			&::after {
				position: absolute;
				content: '';
				background-color: #f8f8f8;
				left: 0;
				top: 50%;
				transform: translate(0, -50%);
				height: 30rpx;
				width: 15rpx;
				border-radius: 0 30rpx 30rpx 0;
			}
		}

		.item-btn {
			width: 160rpx;
			min-width: 160rpx;
			align-self: center;
			position: relative;

			view {
				width: 100rpx;
				height: 50rpx;
				border-radius: $border-radius;
				line-height: 50rpx;
				margin: auto;
				text-align: center;
				background-image: linear-gradient(to right, var(--bg-color), var(--bg-color-shallow));
				color: var(--btn-text-color);
				font-size: $font-size-tag;

				&.disabled {
					background: #dedede !important;
					color: #909399 !important;
				}
			}

			&::after {
				position: absolute;
				content: '';
				background-color: #f8f8f8;
				right: 0;
				top: 50%;
				transform: translate(0, -50%);
				height: 30rpx;
				width: 15rpx;
				border-radius: 30rpx 0 0 30rpx;
			}
		}

		.item-info {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 20rpx;
			overflow: hidden;
			background-repeat-x: no-repeat;
			background-repeat-y: repeat;

			.use_time {
				padding: 20rpx 0;
				border-top: 2rpx dashed #cccccc;
				font-size: $font-size-activity-tag;
				color: #909399;
			}

			.use_title {
				font-size: $font-size-base;
				font-weight: 500;
				padding: 20rpx 0;

				// height:80rpx;
				.title {
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.max_price {
					font-weight: 400;
					font-size: $font-size-tag;
				}
			}
		}
	}
}

.empty {
	margin-top: 200rpx;
}
.cf-container {
	background: #fff;
	overflow: hidden;
}

.tab {
	display: flex;
	justify-content: space-between;
	height: 86rpx;

	> view {
		text-align: center;
		width: 33%;
		height: 86rpx;

		text {
			display: inline-block;
			line-height: 86rpx;
			height: 80rpx;
			font-size: 30rpx;
		}
	}
}

.active {
	border-bottom: 4rpx solid;
}

</style>
