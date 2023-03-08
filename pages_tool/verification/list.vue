<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="verify-container">
		<view class="type-wrap">
			<view v-for="(typeItem, typeIndex) in typeList" :key="typeIndex" class="uni-tab-item" :id="typeItem.pickup"
			 :data-current="typeIndex" @click="ontabtap">
				<text class="uni-tab-item-title" :class="type == typeIndex ? 'uni-tab-item-title-active color-base-text color-base-border' : ''">{{ typeItem.name }}</text>
			</view>
		</view>

		<swiper :current="type" class="swiper-box" style="flex: 1;" :duration="200" @change="ontabchange">
			<swiper-item class="swiper-item" :key="typeIndex" v-for="(typeItem, typeIndex) in typeList">
				<scroll-view scroll-y="true" class="verify-list" @scrolltolower="scrolltolower">
					<block v-if="verifyList[typeIndex] != undefined && verifyList[typeIndex].list.length > 0">
						<view class="item" v-for="(item, index) in verifyList[typeIndex].list" :key="index">
							<view @click="toDetail(item.verify_code)">
								<view class="header">
									<view class="color-tip font-size-goods-tag">核销码：{{ item.verify_code }}</view>
									<view class="color-tip align-right font-size-goods-tag">核销员：{{ item.verifier_name }}</view>
								</view>
								<view class="xian"></view>
								<view class="body">
									<view class="content-item" v-for="(citem, citemIndex) in item.item_array" :key="citemIndex">
										<view class="img-wrap">
											<image :src="$util.img(citem.img)" @error="imageError(typeIndex, index, citemIndex)" mode="aspectFill"></image>
										</view>
										<view class="info-wrap">
											<view class="name-wrap">
												<view class="goods-name font-size-tag">{{ citem.name }}</view>
												<view class="font-size-goods-tag color-tip">核销时间：{{ $util.timeStampTurnTime(item.verify_time) }}</view>
											</view>
										<!-- 	<view class="money-wrap">
												<view class="align-right color-tip font-size-goods-tag">
													<text class="iconfont iconclose font-size-goods-tag"></text>
													{{ citem.num }}
												</view>
											</view> -->
										</view>
									<!-- 	<view class="money-wrap">
											<view><text class="color-base-text font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text><text
												 class="font-size-base color-base-text">{{ citem.price | abs }}</text> </view>
										</view> -->
									</view>
								</view>
							</view>
						</view>
					</block>
					<block v-else>
						<ns-empty :isIndex="false" text="暂无核销记录!"></ns-empty>
					</block>
				</scroll-view>
			</swiper-item>
		</swiper>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollInto: '',
				type: 0,
				typeList: [],
				verifyList: [],
				isShow: false
			};
		},
		onShow() {
			this.getVerifyType();
		},
		methods: {
			toDetail(id) {
				this.$util.redirectTo('/pages_tool/verification/detail', {
					code: id
				});
			},
			ontabtap(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.switchTab(index);
				this.isShow = false;
			},
			switchTab(index) {
				if (this.type === index) {
					return;
				}
				this.type = index;
				this.scrollInto = this.typeList[index].type;
			},
			ontabchange(e) {
				let index = e.target.current || e.detail.current;
				this.switchTab(index);
			},
			getVerifyType() {
				this.$api.sendRequest({
					url: '/api/verify/getVerifyType',
					success: res => {
						if (res.code >= 0) {
							this.typeList = [];
							this.verifyList = [];

							Object.keys(res.data).forEach(key => {
								this.typeList.push({
									type: key,
									name: res.data[key].name
								});
								this.verifyList.push({
									page: 1,
									totalPage: 1,
									list: [],
									isLoading: false
								});
								this.getVerifyList(key, 1, this.typeList.length - 1);
							});
						}
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			/**
			 * 获取核销记录
			 * @param {Object} type
			 * @param {Object} page
			 * @param {Object} index
			 */
			getVerifyList(type, page, index) {
				if (this.verifyList[index].isLoading || (page != 1 && page > this.verifyList[index].totalPage)) return;

				this.verifyList[index].isLoading = true;
				this.verifyList[index].loadingType = 'loading';
				this.$api.sendRequest({
					url: '/api/verify/lists',
					data: {
						verify_type: type,
						page: page
					},
					success: res => {
						this.verifyList[index].page = page;
						if (page == 1) {
							this.verifyList[index].list = [];
							uni.stopPullDownRefresh();
						}
						if (res.data.list.length) {
							res.data.list.forEach(item => {
								this.verifyList[index].list.push(item);
							});
						}
						this.verifyList[index].totalPage = res.data.page_count;
						this.verifyList[index].isLoading = false;
						this.verifyList[index].loadingType = page == this.verifyList[index].totalPage ? 'nomore' : 'more';
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						this.isShow = true;
					}
				});
			},
			/**
			 * 滑到底部加载
			 */
			scrolltolower() {
				let index = this.type;
				this.getVerifyList(this.typeList[index].type, this.verifyList[index].page + 1, index);
			},
			/**
			 * 下拉刷新
			 */
			onPullDownRefresh() {
				let index = this.type;
				this.getVerifyList(this.typeList[index].type, 1, index);
			},
			imageError(typeIndex, index, citemIndex) {
				this.verifyList[typeIndex].list[index].item_array[citemIndex].img = this.$util.getDefaultImage().goods;
				this.$forceUpdate();
			}
		},
		filters: {
			abs(value) {
				return Math.abs(parseFloat(value)).toFixed(2);
			}
		}
	};
</script>

<style lang="scss">
	@import './public/css/list.scss';
</style>
