<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<mescroll-uni @getData="getData" ref="mescroll" :size="10" v-if="addonIsExist.pinfan">
			<block slot="list">
				<view class="ns-adv">
					
					<ns-adv keyword="NS_PINFAN"></ns-adv>
				</view>
				<view class="pinfan-step">
					<view class="pinfan-title">
						<image :src="$util.img('public/uniapp/pinfan/rebate_left.png')" mode=""></image>
						<view class="step-title color-base-text">拼团返利玩法</view>
						<image :src="$util.img('public/uniapp/pinfan/rebate_right.png')" mode=""></image>
					</view>
					<view class="step">
						<view class="">
							<image :src="$util.img('public/uniapp/pinfan/open_group.png')" mode=""></image>
							<view>支付开团或参团</view>
						</view>
						<image :src="$util.img('public/uniapp/pinfan/spot.png')" mode=""></image>
						<view class="">
							<image :src="$util.img('public/uniapp/pinfan/deliver_goods.png')" mode=""></image>
							<view>拼中发货未中退款</view>
						</view>
						<image :src="$util.img('public/uniapp/pinfan/spot.png')" mode=""></image>
						<view class="">
							<image :src="$util.img('public/uniapp/pinfan/gift.png')" mode=""></image>
							<view>未拼中获得奖励</view>
						</view>
					</view>
				</view>
				<view class="goods-list single-column" v-if="dataList.length">
					<view class="goods-item margin-bottom" v-for="(item, index) in dataList" :key="index">
						<view class="list-item">
							<view class="goods-img" @click="toDetail(item)">
								<image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(index)"></image>
								<view class="color-base-bg goods-tag" v-if="goodsTag(item) != ''">{{ goodsTag(item) }}</view>
							</view>
							<view class="info-wrap">
								<view class="name-wrap">
									<view class="goods-name" @click="toDetail(item)">{{ item.goods_name }}</view>

									<view class="pintuan-info">
										<text class="color-base-text pinfan-num">已拼{{ item.order_num }}件</text>
										<text class="color-base-border color-base-text pinfan-box">{{ item.pintuan_num }}人团</text>
									</view>
								</view>
								<view class="lineheight-clear">
									<view class="discount-price">
										<text class="unit  price-style small">￥</text>
										<text class="price  price-style large" >{{ parseFloat(item.pintuan_price).toFixed(2).split(".")[0] }}</text>
										<text class="unit  price-style small">.{{ parseFloat(item.pintuan_price).toFixed(2).split(".")[1] }}</text>
										
									</view>
								</view>
								<view class="pro-info">
									<view class="delete-price font-size-activity-tag color-tip" v-if="item.is_single_buy == 1">
										<text class="font-size-tag lineheight-clear txt">单购价：</text>
										<text class="unit price-font">￥</text>
										<text class="price-font">{{ item.price }}</text>
									</view>
									<view @click="toDetail(item)" class="detail-btn"><button type="primary" size="mini">立即拼团</button></view>
								</view>
							</view>
						</view>
						<view class="step-status font-size-tag">
							<text class="color-base-text">{{ item.pintuan_num }}</text>
							人拼团，
							<text class="color-base-text">{{ item.chengtuan_num }}</text>
							人拼中，未拼中返
							<text class="color-base-text" v-if="item.reward_type == 4">{{ item.reward_type_num }}柚币</text>
							<text class="color-base-text" v-if="item.reward_type == 1 || item.reward_type == 2">￥{{ item.reward_type_num }}</text>
							<text class="color-base-text" v-if="item.reward_type == 3">优惠券</text>
						</view>
					</view>
				</view>
				<view v-if="!dataList.length"><ns-empty text="暂无拼团返利"></ns-empty></view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import uniTag from '@/components/uni-tag/uni-tag.vue';
import nsAdv from '@/components/ns-adv/ns-adv.vue';
export default {
	components: {
		uniTag,
		nsAdv
	},
	data() {
		return {
			dataList: [],
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
			if (this.addonIsExist && !this.addonIsExist.pinfan) {
				this.$util.showToast({
					title: '商家未开启拼团返利',
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
				url: '/pinfan/api/goods/page',
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
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail() {
					//联网失败的回调
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		toDetail(e) {
			this.$util.redirectTo('/pages_promotion/pinfan/detail', {
				pinfan_id: e.pintuan_id
			});
		},
		imgError(index) {
			this.goodsList[index].goods_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		goodsImg(imgStr) {
			let imgs = imgStr.split(',');
			return imgs[0]
				? this.$util.img(imgs[0], {
						size: 'mid'
				  })
				: this.$util.getDefaultImage().goods;
		},
		goodsTag(data) {
			return data.label_name || '';
		}
	}
};
</script>

<style lang="scss" scoped>
@import './public/css/list.scss';
</style>
