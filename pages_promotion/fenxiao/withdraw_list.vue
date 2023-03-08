<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<view class="withdraw-cate" v-if="token">
			<block v-for="(item, index) in category" :key="index">
				<view class="cate-li" :class="{ 'active color-base-text color-base-bg-before': status == item.id }" @click="slectCate(item.id)">{{ item.name }}</view>
			</block>
		</view>

		<mescroll-uni ref="mescroll" @getData="getData" top="90" class="member-point" :size="10">
			<block slot="list">
				<view class="withdraw-li" v-for="(item, index) in withdrawList" :key="index">
					<view class="li-box">
						<view class="tixian-desc">
							<view class="desc-info">
								<view class="desc-info-name">申请{{ fenxiaoWords.withdraw }}</view>
								<view class="desc-info-time">{{ $util.timeStampTurnTime(item.create_time) }}</view>
							</view>
							<view class="desc-money" :style="withdrawState[item.status].color">{{ withdrawState[item.status].text }}</view>
						</view>
						<view class="money-desc">
							<text>实际到金额：{{ item.real_money }}</text>
							<text>手续费：{{ item.withdraw_rate_money }}</text>
							<text class="money">￥{{ item.money }}</text>
						</view>
					</view>
				</view>
				<block v-if="withdrawList.length == 0 && emptyShow">
					<ns-empty :text="'暂无' + fenxiaoWords.withdraw + '记录'" :isIndex="false" v-if="status == 0"></ns-empty>
					<ns-empty :text="'暂无待审核' + fenxiaoWords.withdraw + '记录'" :isIndex="false" v-if="status == 1"></ns-empty>
					<ns-empty :text="'暂无已审核' + fenxiaoWords.withdraw + '记录'" :isIndex="false" v-if="status == 2"></ns-empty>
					<ns-empty :text="'暂无已拒绝' + fenxiaoWords.withdraw + '记录'" :isIndex="false" v-if="status == -1"></ns-empty>
				</block>
			</block>
		</mescroll-uni>

		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import fenxiaoWords from 'common/js/fenxiao-words.js';
export default {
	data() {
		return {
			category: [
				{
					id: 0,
					name: '全部',
					number: 2
				},
				{
					id: 1,
					name: '待审核',
					number: 0
				},
				{
					id: 2,
					name: '已审核',
					number: 0
				},
				{
					id: -1,
					name: '已拒绝',
					number: 0
				}
			],
			withdrawState: {
				'1': {
					color: 'color: rgb(255, 160, 68)',
					text: '待审核'
				},
				'2': {
					color: 'color: rgb(17, 189, 100)',
					text: '已审核'
				},
				'-1': {
					color: 'color: rgb(255, 69, 68)',
					text: '已拒绝'
				}
			},
			status: 0,
			withdrawList: [],
			emptyShow: false,
			token: null
		};
	},
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
		
		if(this.fenxiaoWords && this.fenxiaoWords.withdraw)this.$langConfig.title(this.fenxiaoWords.withdraw + '明细');

		if (uni.getStorageSync('token')) {
			this.token = uni.getStorageSync('token');
		} else {
			setTimeout(() => {
				this.$refs.login.open('/pages_promotion/fenxiao/withdraw_list');
			});
		}
	},
	mixins: [fenxiaoWords],
	methods: {
		//获得列表数据
		getData(mescroll) {
			this.emptyShow = false;
			if (mescroll.num == 1) {
				this.withdrawList = [];
			}
			this.$api.sendRequest({
				url: '/fenxiao/api/withdraw/page',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					status: this.status
				},
				success: res => {
					this.emptyShow = true;
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data && res.data.list) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						});
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.withdrawList = []; //如果是第一页需手动制空列表
					this.withdrawList = this.withdrawList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		slectCate(e) {
			this.status = e;
			this.$refs.mescroll.refresh();
		}
	},
	watch: {
		storeToken: function(nVal, oVal) {
			if (nVal) {
				this.token = nVal;
				this.$refs.mescroll.refresh();
			}
		}
	},
	computed: {
		storeToken() {
			return this.$store.state.token;
		}
	}
};
</script>

<style lang="scss">
/deep/ .empty {
	margin-top: 0 !important;
}

.withdraw-cate {
	width: 100%;
	height: 88rpx;
	display: flex;
	justify-content: space-around;
	background: #fff;
	position: fixed;
	top: 0;
	z-index: 999;
	box-sizing: border-box;

	.cate-li {
		text-align: center;
		display: inline-block;
		height: 88rpx;
		font-size: 30rpx;
		position: relative;
		line-height: 88rpx;

		&.active:after {
			content: '';
			display: block;
			width: 100%;
			height: 4rpx;
			border-radius: 6rpx;
			position: absolute;
			left: 0;
			bottom: 0;
		}
	}
}

.withdraw-member {
	width: 100%;
	height: 70rpx;
	line-height: 70rpx;
	color: $color-tip;
	padding: 0 $padding;
	box-sizing: border-box;
}

.withdraw-li {
	width: 100%;
	padding: 0 30rpx;
	box-sizing: border-box;
	margin-top: 20rpx;

	.li-box {
		width: 100%;
		height: 100%;
		padding: 30rpx;
		background-color: #fff;
		box-sizing: border-box;
		border-radius: $border-radius;

		.tixian-desc {
			width: 100%;
			display: flex;
			justify-content: space-between;
			border-bottom: 2rpx solid $color-line;

			.desc-info {
				display: flex;
				justify-content: center;
				flex-direction: column;

				.desc-info-name {
					font-size: $font-size-base;
					color: $color-title;
					line-height: 1;
					margin-bottom: 10rpx;
				}

				.desc-info-time {
					margin-bottom: 10rpx;
					font-size: $font-size-tag;
					color: $color-tip;
				}
			}

			.desc-money {
				max-width: 50%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				font-size: $font-size-base;
			}
		}

		.money-desc {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 20rpx;
			line-height: 1;
			color: $color-title;
			font-size: $font-size-tag;
			.money{
				color: var(--price-color);
			}
		}
	}
}
</style>
