<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<mescroll-uni @getData="getData" ref="mescroll" :size="10" v-if="addonIsExist.topic">
			<block slot="list">
				<view class="ns-adv">
					
					<ns-adv keyword="NS_TOPIC"></ns-adv>
				</view>
				<view class="topic-list" v-if="dataList.length" v-for="(item, index) in dataList" :key="index" @click="toDetail(item.topic_id, item.topic_name)">
					<view class="list-img" v-if="item.topic_adv"><image :src="$util.img(item.topic_adv)" mode="widthFix"></image></view>
					<view class="list-info">
						<view class="info-left">
							<text class="left-title">{{ item.topic_name }}</text>
							<text class="left-time">活动时间：{{ item.start_time }}~{{ item.end_time }}</text>
						</view>
						<view class="info-right">
							<text class="iconfont iconshijian1"></text>
							{{ nowTime < item.end_time ? '进行中' : '已结束' }}
						</view>
					</view>
				</view>
				<view v-if="!dataList.length" class="cart-empty"><ns-empty text="暂无专题活动"></ns-empty></view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import nsAdv from '@/components/ns-adv/ns-adv.vue';
export default {
	components: {
		nsAdv
	},
	data() {
		return {
			dataList: [],
			nowTime: '',
			//分享建立上下级所需id
			memberId: 0,
			mpShareData: null //小程序分享数据
		};
	},
	onLoad(option) {
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
			if (this.addonIsExist && !this.addonIsExist.topic) {
				this.$util.showToast({
					title: '商家未开启专题活动',
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
		getData(mescroll) {
			this.$api.sendRequest({
				url: '/topic/api/topic/page',
				data: {
					page_size: mescroll.size,
					page: mescroll.num
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
					//设置列表数据
					if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
					this.dataList = this.dataList.concat(newArr); //追加新数据
					this.dataList.forEach(i => {
						i.start_time = this.$util.timeStampTurnTime(i.start_time).slice(0, 10);
						i.end_time = this.$util.timeStampTurnTime(i.end_time).slice(0, 10);
					});
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		toDetail(e, f) {
			this.$util.redirectTo('/pages_promotion/topics/detail', {
				topic_id: e,
				title: f
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.ns-adv {
	margin: $margin-updown $margin-both;
	border-radius: $border-radius;
	overflow: hidden;
	line-height: 1;
	image {
		width: 100%;
	}
}

/deep/ .fixed {
	position: relative;
	top: 0;
}

/deep/ .empty {
	margin-top: 0 !important;
}

.topic-pic {
	height: 300rpx;

	image {
		height: 300rpx;
	}
}

.topic-list {
	margin: 0 24rpx 24rpx;
	border-radius: 10rpx;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	margin-bottom: 16rpx;
	background-color: #fff;

	.list-img {
		width: 100%;
		overflow: hidden;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.list-info {
		flex: 1;
		display: flex;
		padding: 0 24rpx;
		box-sizing: border-box;
		align-items: center;
		justify-content: space-between;
		padding-top: 29rpx;
		padding-bottom: 29rpx;

		.info-left {
			display: flex;
			flex-direction: column;
			line-height: 1;
			flex: 1;
			margin-right: 30rpx;

			.left-title {
				font-size: $font-size-base;
				color: #383838;
				line-height: 1.5;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.left-time {
				font-size: $font-size-goods-tag;
				color: #838383;
				margin-top: 18rpx;
				line-height: 1;
			}
		}

		.info-right {
			font-size: $font-size-base;
			color: #838383;
			line-height: 1;

			.iconfont {
				font-size: $font-size-toolbar;
				vertical-align: middle;
			}

			text {
				font-size: $font-size-base;
				margin-right: 8rpx;
			}
		}
	}
}
</style>
