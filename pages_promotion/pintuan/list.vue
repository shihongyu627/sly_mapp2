<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="order-container" :data-theme="themeStyle">
		<mescroll-uni @getData="getData" ref="mescroll" :size="10" v-if="addonIsExist.pintuan">
			<block slot="list">
				<view class="ns-adv">
					<ns-adv keyword="NS_PINTUAN"></ns-adv>

				</view>
				<view class="goods-list single-column" v-if="dataList.length">
					<view class="goods-item margin-bottom" v-for="(item, index) in dataList" :key="index">
						<view class="goods-img" @click="toDetail(item)">
							<image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(index)"></image>
							<view class="color-base-bg goods-tag">{{ item.pintuan_num }}人团
							</view>
							<!-- <text class="name-label"></text> -->
						</view>
						<view class="info-wrap">
							<view class="name-wrap">
								<view class="goods-name" @click="toDetail(item)">
									{{ item.goods_name }}
								</view>
								<view class="pintuan-info">
									<text class="pintuan-num">已团{{ item.sale_num }}件</text>
								</view>
							</view>
							<view class="lineheight-clear">
								<view class="discount-price">
									<text class="unit price-style small">{{ $lang('common.currencySymbol') }}</text>
									<text
										class="price  price-style large">{{ parseFloat(item.pintuan_price).toFixed(2).split(".")[0] }}</text>
									<text
										class="unit  price-style small">.{{ parseFloat(item.pintuan_price).toFixed(2).split(".")[1] }}</text>
									<text class="delete-price line-through font-size-activity-tag color-tip price-font">
										{{ $lang('common.currencySymbol') }}{{ item.price }}
									</text>
								</view>
								<view class="btn-pintuan" @click="toDetail(item)">去拼团</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 	<view v-if="!dataList.length">
					<ns-empty textColor="#fff!important" :isIndex="false" text="暂无拼团"></ns-empty>
				</view> -->
				<block v-else>
					<view>
						<ns-empty :isIndex="!1" text="暂无拼团"></ns-empty>
					</view>
				</block>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import nsAdv from '@/components/ns-adv/ns-adv.vue';
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		components: {
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
		mixins: [globalConfig],
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

			setTimeout(() => {
				if (this.addonIsExist && !this.addonIsExist.pintuan) {
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
					url: '/pintuan/api/goods/page',
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
				this.$util.redirectTo('/pages_promotion/pintuan/detail', {
					pintuan_id: e.pintuan_id
				});
			},
			imgError(index) {
				this.dataList[index].goods_image = this.$util.getDefaultImage().goods;
				this.$forceUpdate();
			},
			goodsImg(imgStr) {
				let imgs = imgStr.split(',');
				return imgs[0] ?
					this.$util.img(imgs[0], {
						size: 'mid'
					}) :
					this.$util.getDefaultImage().goods;
			},
			goodsTag(data) {
				return data.label_name || '';
			}
		}
	};
</script>

<style lang="scss">
	@import './public/css/list.scss';
	@import '@/common/css/order_parment.scss';
</style>

<style scoped>
	.lineheight-clear {
		/* display: flex;
		align-items: center; */
	}
</style>
