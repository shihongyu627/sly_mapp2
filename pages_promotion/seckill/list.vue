<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="page">
		<view v-if="show">
			<mescroll-uni @getData="getData" ref="mescroll" :size="10" v-if="seckillId && addonIsExist.seckill" @scroll="scroll">
				<block slot="list">
					<view class="ns-adv">
						<ns-adv keyword="NS_SECKILL"></ns-adv>
					</view>
					<view class="time-wrap">
						<scroll-view :scroll-x="true" class="scroll-wrap" scroll-with-animation :scroll-into-view="'a' + seckillId">
							<view class="time-item" v-for="(item, key) in timeList" :key="key" :id="'a' + item.id" @click="ontabtap(item.id, key)" :class="seckillId == item.id ? 'active' : ''">
								<view class="start-time font-size-toolbar" >
									{{ transformSeckillTime(item.seckill_start_time) }}
								</view>
								<block v-if="item.type == 'today'">
									<view class="em font-size-tag " v-if="!item.isNow">
										即将开始
									</view>
									<view class="em font-size-tag " v-else-if="item.isNow">
										抢购中
									</view>
								</block>
								<block v-else>
									<view class="em font-size-tag" >明日预告</view>
								</block>
							</view>
						</scroll-view>
					</view>
					
					<view class="time-box">
						<block v-if="timeList[seckillIndex].isNow && timeList[seckillIndex].endTimeMachine">
							本场还剩
							<uni-count-down :day="timeList[seckillIndex].endTimeMachine.d" :hour="timeList[seckillIndex].endTimeMachine.h" :minute="timeList[seckillIndex].endTimeMachine.i" :second="timeList[seckillIndex].endTimeMachine.s" 
							 color="#fff"
							  splitorColor="#F83530 !important" backgroundColor="#F83530" border-color="transparent" />
							</uni-count-down>
							结束
						</block>
						<block v-else-if="!timeList[seckillIndex].isNow && timeList[seckillIndex].startTimeMachine">
							本场还剩
							<uni-count-down :day="timeList[seckillIndex].startTimeMachine.d" :hour="timeList[seckillIndex].startTimeMachine.h" :minute="timeList[seckillIndex].startTimeMachine.i" :second="timeList[seckillIndex].startTimeMachine.s" 
							color="#fff"
							 splitorColor="#fff !important" backgroundColor="#000" border-color="transparent" />
							</uni-count-down>
							开始
						</block>
					</view>

					<view class="goods-list single-column" v-if="dataList.length" >
						<view class="item" v-for="(item, goodsIndex) in dataList" :key="goodsIndex" @click="toGoodsDetail(item)" >
							<view class="img-wrap">
								<image :src="$util.img(item.goods_image,{size: 'mid'})" mode="widthFix" @error="imageError(goodsIndex)"></image>
							</view>
							<view class="content">
								<view
									class="goods-name multi-hidden"
								>
									{{ item.goods_name }}
								</view>
								<view class="progress" >
									<view class="bg" >
										<view class="curr"
										:style="{width: Math.floor((item.sale_num / (item.goods_stock + item.sale_num)) * 240) + 'rpx'}"
										>
											<image class="progress-bar" :src="$util.img('public/uniapp/seckill/progress_bar_01.png')" mode="widthFix"></image>
										</view>
									</view>
									<view class="num" v-if="timeList[seckillIndex].isNow">
										仅剩{{ item.goods_stock }}件
									</view>
								</view>
								<view class="bottom-wrap"> 
									<view class="price-wrap">
										<view class="discount-price">
											<text class="unit price-style small" >¥</text>
											<text class="price price-style large">{{ item.seckill_price.split(".")[0] }}</text>
											<text class="unit price-style small" >{{ '.'+item.seckill_price.split(".")[1] }}</text>
										</view>
										 
										<view class="price-font">
											<text>原价：</text>
											<text class="original-price">¥{{ item.price }}</text>
										</view>
									</view>
									<view class="btn-pintuan">{{ timeList[seckillIndex].isNow ? '马上抢' : '即将开始'}}</view>
								<!-- 	<button>
										{{ timeList[seckillIndex].isNow ? '马上抢' : '即将开始'}}
									</button> -->
								</view>
							</view>
						</view>
						
					</view>

					<view v-if="!dataList.length && showEmpty" style="z-index: 1 !important;"><ns-empty :isIndex="false" text="暂时没有商品哦！去别处看看吧~" textColor="#fff!important"></ns-empty></view>
				</block>
			</mescroll-uni>
		</view>
		<view class="big-empty" v-else><ns-empty :isIndex="false" text="暂时没有商品哦！去别处看看吧~" textColor="#fff!important"></ns-empty></view>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>
<script>
import list from './public/js/list.js';
export default {
	data() {
		return {
			hour: '00',
			minute: '00',
			second: '00',
			ident: false,
			showEmpty: false,
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
			if (this.addonIsExist && !this.addonIsExist.seckill) {
				this.$util.showToast({
					title: '商家未开启秒杀',
					mask: true,
					duration: 2000
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
				}, 2000);
				return;
			}
		}, 1000)

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

		this.getTimeList();
	},
	//分享给好友
	onShareAppMessage() {
		return this.mpShareData.appMessage;
	},
	//分享到朋友圈
	onShareTimeline() {
		return this.mpShareData.timeLine;
	},
	mixins: [list],
	onReady() {
		setTimeout(() => {
			const query = uni.createSelectorQuery().in(this);
			query
				.select('.time-wrap')
				.boundingClientRect(data => {
					if (data) this.timeTop = data.top;
				})
				.exec();
		}, 500);

	}
};
</script>

<style lang="scss">
@import './public/css/list.scss';
</style>
<style>
 
	/deep/.uni-countdown__number {
		padding: 0 4rpx;
		line-height: 36rpx;
		height: 36rpx;
	}
	
	/deep/ .uni-countdown__splitor.day {
		line-height: 36rpx;
	}
	/deep/.uni-countdown__splitor{
		line-height: 36rpx;
	}
	/deep/ .uni-countdown{
		margin: 0 8rpx;
	}
</style>