<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="goods-evaluate">
		<view class="evaluate-tab">
			<view v-for="(item, index) in evaluateList" :key="index" :class="evaluateTab == item.value ? 'active-tab' : ''" @click="onEvaluateTab(item.value)">
				{{ item.name }}({{ item.count }})
			</view>
		</view>
		<mescroll-uni ref="mescroll" top="100" @getData="getGoodsEvaluate">
			<block slot="list">
				<view class="evaluate-item" v-for="(item, index) in list" :key="index">
					<view class="evaluator">
						<view>
							<view class="evaluator-face">
								<image v-if="item.member_headimg" :src="$util.img(item.member_headimg)" @error="imageError(index)" mode="aspectFill" />
								<image v-else :src="$util.getDefaultImage().head" mode="aspectFill" />
							</view>

							<view class="evaluator-info">
								<view class="evaluator-info-left">
									<view class="evaluator-name using-hidden" v-if="item.member_name.length > 2 && item.is_anonymous == 1">
										{{ item.member_name[0] }}***{{ item.member_name[item.member_name.length - 1] }}
									</view>
									<text class="evaluator-name using-hidden" v-else>{{ item.member_name }}</text>
									<view class="evaluator-time color-tip">{{ $util.timeStampTurnTime(item.create_time) }}</view>
								</view>
								<view class="evaluator-xing"><xiaoStarComponent :starCount="item.scores * 2"></xiaoStarComponent></view>
							</view>
						</view>
					</view>
					<view class="cont">{{ item.content }}</view>
					<scroll-view scroll-x="true">
						<view class="evaluate-img" v-if="item.images">
							<view class="img-box" v-for="(img, img_index) in item.images" :key="img_index" @click="previewEvaluate(index, img_index, 'images')">
								<image :src="$util.img(img)" mode="aspectFill" />
							</view>
						</view>
					</scroll-view>

					<view v-if="item.explain_first != ''" class="time shop-reply-box">
						<view class="shop-reply">商家回复：</view>
						<view class="cont">{{ item.explain_first }}</view>
					</view>

					<template v-if="item.again_content != '' && item.again_is_audit == 1">
						<view class="review-evaluation color-base-text">追加评价</view>
						<view class="cont">{{ item.again_content }}</view>
						<scroll-view scroll-x="true">
							<view class="evaluate-img" v-if="item.again_images.length > 0">
								<view
									class="img-box"
									v-for="(again_img, again_index) in item.again_images"
									:key="again_index"
									@click="previewEvaluate(index, again_index, 'again_images')"
								>
									<image :src="$util.img(again_img)" mode="aspectFill"></image>
								</view>
							</view>
						</scroll-view>

						<view v-if="item.again_explain != ''" class="time shop-reply-box">
							<view class="shop-reply" v-if="item.again_explain != ''">商家回复：</view>
							<view class="cont">{{ item.again_explain }}</view>
						</view>
					</template>
				</view>
				<view v-if="list.length == 0"><ns-empty text="暂无商品评价"></ns-empty></view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import xiaoStarComponent from '@/components/xiao-star-component/xiao-star-component.vue';
export default {
	components: { xiaoStarComponent },
	data() {
		return {
			goodsId: 0,
			list: [],
			evaluateList: [{ name: '全部', value: 0, count: 0 }, { name: '好评', value: 1, count: 0 }, { name: '中评', value: 2, count: 0 }, { name: '差评', value: 3, count: 0 }],
			evaluateTab: 0,
			mescroll_type: {}
		};
	},
	onLoad(data) {
		this.goodsId = data.goods_id || 0;
		this.getEvaluateCount();
	},
	onShow() {
		
		
	},
	methods: {
		getEvaluateCount(mescroll) {
			this.$api.sendRequest({
				url: '/api/goodsevaluate/getgoodsevaluate',
				data: {
					goods_id: this.goodsId
				},
				success: res => {
					for (let i = 0; i < this.evaluateList.length; i++) {
						if (this.evaluateList[i].value == 0) {
							this.evaluateList[i].count = res.data.total;
						} else if (this.evaluateList[i].value == 1) {
							this.evaluateList[i].count = res.data.haoping;
						} else if (this.evaluateList[i].value == 2) {
							this.evaluateList[i].count = res.data.zhongping;
						} else if (this.evaluateList[i].value == 3) {
							this.evaluateList[i].count = res.data.chaping;
						}
					}
				}
			});
		},
		getGoodsEvaluate(mescroll) {
			this.mescroll_type = mescroll;
			this.$api.sendRequest({
				url: '/api/goodsevaluate/page',
				data: {
					page: mescroll.num,
					page_size: mescroll.size,
					goods_id: this.goodsId,
					explain_type: this.evaluateTab == 0 ? '' : this.evaluateTab
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

					for (var i = 0; i < newArr.length; i++) {
						if (newArr[i].images) newArr[i].images = newArr[i].images.split(',');
						if (newArr[i].again_images) newArr[i].again_images = newArr[i].again_images.split(',');
						if (newArr[i].is_anonymous == 1)
							newArr[i].member_name = newArr[i].member_name.replace(newArr[i].member_name.substring(1, newArr[i].member_name.length - 1), '***');
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.list = []; //如果是第一页需手动制空列表
					this.list = this.list.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},

		// 预览评价图片
		previewEvaluate(index, img_index, field) {
			var paths = [];
			for (let i = 0; i < this.list[index][field].length; i++) {
				paths.push(this.$util.img(this.list[index][field][i]));
			}
			uni.previewImage({
				current: img_index,
				urls: paths
			});
		},

		imageError(index) {
			this.list[index].member_headimg = this.$util.getDefaultImage().head;
			this.$forceUpdate();
		},
		onEvaluateTab(value) {
			this.list = [];
			this.evaluateTab = value;
			this.mescroll_type.num = 1;
			this.mescroll_type.size = 10;
			let mescrolls = {
				num: 1,
				size: 10
			};
			this.getGoodsEvaluate(this.mescroll_type);
		}
	}
};
</script>

<style lang="scss">
.goods-evaluate {
	.evaluate-tab {
		display: flex;
		align-items: center;
		background: #fff;
		height: 100rpx;
		padding: 0 $margin-both;

		view {
			background: #f0f0f0;
			color: #333;
			border-radius: 30rpx;
			margin-right: 20rpx;
			padding: 8rpx 30rpx;
			font-size: 24rpx;
		}
		.active-tab {
			background-color: $base-color;
			color: #fff;
		}
	}
	.evaluate-item {
		margin: $margin-updown $margin-both;
		padding: $margin-both;
		background: #fff;
		border-radius: 10rpx;

		.evaluator {
			& > view {
				display: flex;
				align-items: center;
			}

			.evaluator-face {
				width: 79rpx;
				height: 79rpx;
				border-radius: 50%;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.evaluator-info {
				width: 85%;
				margin-left: 13rpx;

				.evaluator-name {
					color: #303133;
					font-size: $font-size-base;
					line-height: 1;
					width: 250rpx;
				}

				.evaluator-time {
					font-size: $font-size-tag;
					// margin-top: 14rpx;
					line-height: 1;
				}
				.evaluator-info-left {
					display: flex;
					align-items: center;
					justify-content: space-between;
				}
			}
		}

		.cont {
			text-align: justify;
			display: -webkit-box;
			word-break: break-all;
			font-size: $font-size-base;
			margin: 26rpx 0 0;
			color: #000000;
			line-height: 42rpx;
		}

		.evaluate-img {
			display: flex;
			width: 100%;
			flex-wrap: wrap;
			margin-top: 19rpx;

			.img-box {
				flex-shrink: 0;
				width: 140rpx;
				height: 140rpx;
				overflow: hidden;
				margin: 20rpx 23rpx 0 0;
				border-radius: 10rpx;

				&:nth-child(4n) {
					margin-right: 0;
				}

				&:nth-child(-n + 4) {
					margin-top: 0;
				}

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.time {
			font-size: $font-size-tag;
			background: #f8f8f8;
			padding: 10rpx 20rpx;
			border-radius: 6rpx;
			margin-top: 20rpx;

			text {
				line-height: 42rpx;
				color: $color-tip;
			}
		}

		.evaluation-reply {
			margin-top: 10rpx;
			font-size: $font-size-tag;
		}

		.review-evaluation {
			margin-top: 29rpx;
			font-size: $font-size-base;
			line-height: 1;

			.review-time {
				overflow: hidden;
				float: right;
			}

			& + .cont {
				margin: 18rpx 0 0;
			}
		}
	}
}

.shop-reply {
	font-size: $font-size-base;
	color: #000;
	line-height: 1;

	& + .cont {
		margin-top: 10rpx !important;
	}
}

.shop-reply-box {
	padding: 20rpx !important;
}
</style>
