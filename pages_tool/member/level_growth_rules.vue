<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="member-level">
		<view class="grow-explain">
			<view class="explain-title">
				<image :src="$util.img('public/uniapp/level/growth_that_left.png')" mode="aspectFit"></image>
				成长值说明
				<image :src="$util.img('public/uniapp/level/growth_that_right.png')" mode="aspectFit"></image>
			</view>
			<view class="explain-table">
				<view class="explain-tr">
					<text class="explain-th">等级</text>
					<text class="explain-th">成长值</text>
				</view>
				<view class="explain-tr" v-for="(item, index) in levelList" :key="index">
					<text class="explain-td">{{ item.level_name }}</text>
					<text class="explain-td">{{ item.growth }}</text>
				</view>
			</view>
		</view>
		<view class="grow-value">
			<view class="title">
				<image :src="$util.img('public/uniapp/level/explain.png')" mode="aspectFit"></image>
				<text>什么是成长值</text>
			</view>
			<view class="content color-tip">成长值是消费者在店铺成为会员后，通过消费计算出来的值。成长值决定会员等级，会员等级越高，所享受的会员权益和会员礼包就越多。</view>
		</view>
		<view class="acquisition-grow">
			<view class="title">
				<image :src="$util.img('public/uniapp/level/explain.png')" mode="aspectFit"></image>
				<text>如何获得成长值</text>
			</view>
			<view class="content color-tip">
				<text>1、注册会员送x成长值。</text>
				<text>2、会员充值到余额送x成长值。</text>
				<text>3、会员签到送x成长值。</text>
				<text>4、会员消费x元，交易完成即可获得x个成长值。</text>
			</view>
		</view>

		<to-top v-if="showTop" @toTop="scrollToTopNative()"></to-top>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import nsProgress from '@/components/ns-progress/ns-progress.vue';
import toTop from '@/components/toTop/toTop.vue';
import scroll from '@/common/js/scroll-view.js';
export default {
	components: {
		nsProgress,
		toTop
	},
	mixins: [scroll],
	data() {
		return {
			curIndex: 0,
			descIndex: 0,
			isDescAnimating: false,
			scaleX: (634 / 540).toFixed(4),
			scaleY: (378 / 330).toFixed(4),
			swiperConfig: {
				//type==1时的默认参数
				indicatorDots: false,
				indicatorColor: 'rgba(255, 255, 255, .4)',
				indicatorActiveColor: 'rgba(255, 255, 255, 1)',
				interval: 3000,
				duration: 300,
				circular: false,
				previousMargin: '58rpx',
				nextMargin: '58rpx'
			},
			levelList: [
				{
					needGrowth: 0,
					growth: 0
				}
			],
			levelId: 0,
			growth: 0,

			nowIndex: 0, //我当前所在等级的index
			userInfo: {},
			rule: [] //成长值规则
		};
	},
	computed: {
		listLen() {
			return this.levelList.length;
		},
	},
	onLoad() {
		//会员等级
		this.getLevelList();
		this.getLevelRule();
	},
	onShow() {
		
		
	},
	filters: {
		rate(index, list, growth) {
			let nowGrowth = Number(growth);
			let minGrouth = Number(list[index].growth);
			if (index == list.length - 1) {
				return nowGrowth > minGrouth ? 100 : 0;
			} else {
				let maxGrouth = Number(list[index + 1].growth);
				let num2 = nowGrowth - minGrouth;
				let num1 = maxGrouth - minGrouth;
				let num = Math.floor((num2 / num1) * 100);
				return num > 100 ? 100 : num;
			}
		}
	},
	methods: {
		swiperChange(e) {
			let that = this;
			this.curIndex = e.detail.current;
			this.isDescAnimating = true;
			let timer = setTimeout(function() {
				that.descIndex = e.detail.current;
				clearTimeout(timer);
			}, 150);
		},
		animationfinish(e) {
			this.isDescAnimating = false;
		},
		getBannerDetail(index) {
			uni.showLoading({
				title: '将前往详情页面',
				duration: 2000,
				mask: true
			});
		},
		getLevelList() {
			this.$api.sendRequest({
				url: '/api/memberlevel/lists',
				success: res => {
					if (res.data && res.code == 0) {
						this.levelList = res.data;
						this.getMemberInfo();
					} else {
						this.$util.showToast({
							title: res.message
						});
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				}
			});
		},
		getLevelRule() {
			this.$api.sendRequest({
				url: '/api/member/accountrule',
				success: res => {
					if (res.code == 0 && res.data && res.data.growth) {
						this.rule = res.data.growth;
					}
				}
			});
		},
		getMemberInfo() {
			this.$api.sendRequest({
				url: '/api/member/info',
				success: res => {
					if (res.data && res.code == 0) {
						this.levelId = res.data.member_level;
						this.growth = res.data.growth;
						this.userInfo = res.data;
						this.levelList.forEach((v, i) => {
							if (v.level_id == res.data.member_level) {
								this.curIndex = i;
								this.descIndex = i;
								this.nowIndex = i;
								return;
							}
						});
						this.levelList.forEach((v, i) => {
							let rate = 0;
							if (i != this.levelList.length - 1) {
								v.needGrowth = Number(this.levelList[i + 1].growth) - Number(this.growth); //距离下一阶段需要多少成长值

								if (v.needGrowth <= 0) {
									rate = 100;
								} else {
									rate = (this.growth / this.levelList[i + 1].growth).toFixed(2) * 100;
								}
							} else {
								v.needGrowth = Number(this.levelList[i].growth) - Number(this.growth); //距离下一阶段需要多少成长值
								if (v.needGrowth <= 0) {
									rate = 100;
								} else {
									rate = (this.growth / this.levelList[i].growth).toFixed(2) * 100;
								}
							}
							v.rate = rate;
						});

						this.levelList.forEach(v => {
							if (v.consume_discount) {
								v.consume_discount = (v.consume_discount / 10).toFixed(2);
							}
						});
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #fff;
}
.grow-explain {
	padding: 30rpx;
	margin-top: 30rpx;
	.explain-title {
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		image {
			margin: 0 20rpx;
			width: 54rpx;
			height: 18rpx;
		}
		margin-bottom: 40rpx;
	}
	.explain-tr {
		display: flex;
	}
	.explain-th {
		padding: 10rpx 30rpx;
		& ~ .explain-th {
			border-left: 4rpx solid #fff;
		}
		flex: 1;
		background-color: #f6f1e4;
	}
	.explain-td {
		padding: 10rpx 30rpx;
		& ~ .explain-td {
			border-left: 4rpx solid #fff;
		}
		height: 60rpx;
		line-height: 60rpx;
		flex: 1;
		background-color: #fcfbf7;
	}
}
.grow-value,
.acquisition-grow {
	padding: 0 30rpx 30rpx;
	.title {
		display: flex;
		align-items: center;
		image {
			width: 30rpx;
			height: 30rpx;
			margin-right: 10rpx;
		}
	}
	.content {
		font-size: 24rpx;
		margin-left: 40rpx;
		text {
			display: block;
		}
	}
}
</style>
