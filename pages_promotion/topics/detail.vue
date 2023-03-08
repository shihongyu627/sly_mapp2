<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="topic-detail" :style="{ backgroundColor: bgColor }">
		<mescroll-uni @getData="getData" ref="mescroll" :size="10">
			<block slot="list">
				<view class="topic-pic" v-if="topicAdv"><image :src="$util.img(topicAdv)" mode="widthFix"></image></view>
				<view class="goods-list double-column" v-if="dataList.length">
					<view class="goods-item" v-for="(item, index) in dataList" :key="index">
						<view class="goods-img" @click="toDetail(item)"><image :src="goodsImg(item.sku_image)" mode="widthFix" @error="imgError(index)"></image></view>
						<view class="info-wrap">
							<view class="name-wrap">
								<view class="goods-name" @click="toDetail(item)">{{ item.sku_name }}</view>
							</view>
							<view class="lineheight-clear">
								<view class="discount-price">
									<text class="unit  price-style small">{{ $lang('common.currencySymbol') }}</text>
									<text class="price  price-style large" >{{ parseFloat(item.topic_price).toFixed(2).split(".")[0] }}</text>
									<text class="unit  price-style small">.{{ parseFloat(item.topic_price).toFixed(2).split(".")[1] }}</text>
								</view>
								
							</view>
							<view class="pro-info">
								<view class="delete-price font-size-activity-tag color-tip price-font">
									<block v-if="item.market_price">
										<text class="unit">{{ $lang('common.currencySymbol') }}</text>
										{{ item.market_price }}
										
									</block>
									<block v-else>
										<text class="unit">{{ $lang('common.currencySymbol') }}</text>
										{{ item.price }}
									</block>
								</view>
								<view class="sale font-size-activity-tag color-tip" v-if="item.sale_show">已售{{ item.sale_num }}{{ item.unit ? item.unit : "件" }}</view>
							</view>
							
						</view>
					</view>
				</view>
				<view v-if="!dataList.length"><ns-empty text="暂无有相应的商品"></ns-empty></view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			dataList: [],
			topicId: 0,
			bgColor: '#f7f7f7',
			topicAdv: '',
			datainfo:{
				image:'',
				title:''
			}
		};
	},
	components: {},
	onLoad(options) {
		if (options.topic_id) {
			this.topicId = options.topic_id;
		} else {
			uni.navigateBack({
				delta: 1
			});
		}
	},
	onShow() {
		
		
	},
	methods: {
		getData(mescroll) {
			this.$api.sendRequest({
				url: '/topic/api/topicgoods/page',
				data: {
					topic_id: this.topicId,
					page_size: mescroll.size,
					page: mescroll.num
				},
				success: res => {
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data) {
						this.topicAdv = res.data.topic_adv;
						this.bgColor = res.data.bg_color;
						newArr = res.data.list;
						this.datainfo.image = res.data.topic_adv;
						this.datainfo.title = res.data.topic_name;
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
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		toDetail(e) {
			this.$util.redirectTo('/pages_promotion/topics/goods_detail', { id: e.id });
		},
		goodsImg(imgStr) {
			let imgs = imgStr.split(',');
			return imgs[0] ? this.$util.img(imgs[0], { size: 'mid' }) : this.$util.getDefaultImage().goods;
		},
		imgError(index) {
			this.goodsList[index].sku_image = this.$util.getDefaultImage().goods;
		}
	},  
	
	onShareAppMessage(res) {
		var path = '/pages_promotion/topics/detail?topic_id=' + this.topicId;
		if (this.memberId) path += '&source_member=' + this.memberId;
		return {
			title: this.datainfo.title,
			path: path,
			imageUrl: this.$util.img(this.datainfo.image),
			success: res => {},
			fail: res => {}
		};
	},
	// 分享到微信朋友圈
	// #ifdef MP-WEIXIN
	onShareTimeline() {
		var query = 'topic_id=' + this.topicId;
		if (this.memberId) query += '&source_member=' + this.memberId;
		return {
			title: this.datainfo.title,
			query: query,
			imageUrl: this.$util.img(this.datainfo.image),
		};
	},
	// #endif
	
};
</script>

<style lang="scss">
/deep/ .fixed {
	top: 35vh;
}
.topic-pic {
	image {
		width: 100%;
		display: block;
	}
}
// 商品列表双列样式
.goods-list.double-column {
	display: flex;
	flex-wrap: wrap;
	margin: $margin-both $margin-both;

	.goods-item {
		flex: 1;
		position: relative;
		background-color: #fff;
		flex-basis: 48%;
		max-width: calc((100% - 30rpx) / 2);
		margin-right: $margin-both;
		margin-bottom: $margin-updown;
		border-radius: $border-radius;

		&:nth-child(2n) {
			margin-right: 0;
		}

		.goods-img {
			position: relative;
			overflow: hidden;
			padding-top: 100%;
			border-top-left-radius: $border-radius;
			border-top-right-radius: $border-radius;

			image {
				width: 100%;
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
			}
		}

		.goods-tag {
			color: #fff;
			line-height: 1;
			padding: 8rpx 16rpx;
			position: absolute;
			border-bottom-right-radius: $border-radius;
			top: 0;
			left: 0;
			font-size: $font-size-goods-tag;
		}

		.goods-tag-img {
			position: absolute;
			border-top-left-radius: $border-radius;
			width: 80rpx;
			height: 80rpx;
			top: 0;
			left: 0;
			z-index: 5;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.info-wrap {
			padding: 0 26rpx 26rpx 26rpx;
		}

		.goods-name {
			font-size: $font-size-base;
			line-height: 1.3;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			margin-top: 20rpx;
			height: 68rpx;
		}

		.discount-price {
			display: inline-block;
			font-weight: bold;
			line-height: 1;
			margin-top: 16rpx;
			color: var(--price-color);
			.unit {
				margin-right: 6rpx;
			}
		}

		.pro-info {
			display: flex;
			margin-top: auto;

			.delete-price {
				text-decoration: line-through;
				flex: 1;

				.unit {
					margin-right: 6rpx;
				}
			}

			& > view {
				line-height: 1;

				&:nth-child(2) {
					text-align: right;
				}
			}
		}

		.member-price-tag {
			display: inline-block;
			width: 60rpx;
			line-height: 1;
			margin-left: 6rpx;

			image {
				width: 100%;
			}
		}
	}
}
</style>
