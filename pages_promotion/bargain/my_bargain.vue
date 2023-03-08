<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<view class="my_spell_category" v-if="token">
			<view class="category-item" v-for="(item, index) in statusList" :key="index" @click="categoryChange(item.id)">
				<view class="item-con" :class="item.id == status ? 'active color-base-text color-base-bg-before' : ''">{{ item.name }}</view>
			</view>
		</view>
		<mescroll-uni @getData="getData" top="90" ref="mescroll" :size="10" v-if="token">
			<block slot="list">
				<view class="goods-list" v-for="(item, index) in dataList" :key="index">
					<view class="goods-item-content" @click="goBargainDetail(item)">
						<view class="goods-item-state">
							<text class="state-time">发起砍价 {{ $util.timeStampTurnTime(item.start_time) }}</text>
							<text class="state-sign" :style="{ color: bargainState[item.status].color }">{{ bargainState[item.status].text }}</text>
						</view>
						<view class="goods-item-wrap">
							<view class="image-wrap">
								<image :src="$util.img(item.sku_image,{'size':'mid'})" mode="aspectFit" @error="imageError(index)"></image>
							</view>
							<view class="content">
								<view class="title">{{ item.sku_name }}</view>
								<text class="residue-price color-base-text">已砍至{{ item.curr_price }}元</text>
								<view class="price-box">
									<text class="original-price" v-if="item.status">{{ $lang('common.currencySymbol') }}{{ item.price }}</text>
									<view class="time" v-if="item.timeMachine && item.status == 0">
										<uni-count-down :day="item.timeMachine.d" :hour="item.timeMachine.h" :minute="item.timeMachine.i" :second="item.timeMachine.s"
										 color="#fff" splitorColor="#000 !important" backgroundColorClass="color-base-bg" border-color="transparent" />
										<text class="end-txt">后结束</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					
					<view class="goods-item-action" >
						<view class="invitation-bargain">
							<image :src="recordItem.headimg == '' ? $util.img($util.getDefaultImage().head) : $util.img(recordItem.headimg)"
							 v-for="(recordItem, recordIndex) in item.bargain_record" @error="memberImageError(index, recordIndex)"></image>
							<text class="invitation-bargain-end color-base-text color-base-border" v-if="item.status == 0">+</text>
							<text class="invitation-bargain-end color-base-text color-base-border " v-else><text class="iconellipsis2 iconfont"></text></text>
						</view>
						<button class="btn color-base-bg" v-if="item.status == 0 && item.bargain_status == 1" @click="goBargainDetail(item)">继续砍价</button>
						<block v-if="item.status == 1 && item.bargain_status == 1">
							<button class="btn color-base-bg" v-if="item.order_id == 0" @click="goBargainDetail(item)">购买商品</button>
							<button class="btn color-base-bg" v-else @click="goBargainDetail(item)">查看详情</button>
						</block>
						<button class="btn fail color-base-bg" v-if="item.status == 2 && item.bargain_status == 1" @click="$util.redirectTo('/pages_promotion/bargain/list')">重新砍价</button>
					</view>
				</view>
				<ns-empty v-if="dataList.length == 0" :isIndex="true" :emptyBtn ="{url: '/pages/index/index',text: '去逛逛'}" text="暂无砍价订单"></ns-empty>
			</block>
		</mescroll-uni>
		
		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import uniCountDown from '@/components/uni-count-down/uni-count-down.vue';
	export default {
		components: {
			uniCountDown
		},
		data() {
			return {
				mescroll: null,
				dataList: [],
				statusList: [{
						id: 'all',
						name: '全部'
					},
					{
						id: 0,
						name: '正在砍价'
					},
					{
						id: 1,
						name: '砍价成功'
					},
					{
						id: 2,
						name: '砍价失败'
					}
				],
				status: 'all',
				bargainState: [{
						color: '#FFA044',
						text: '正在砍价'
					},
					{
						color: '#11BD64',
						text: '砍价成功'
					},
					{
						color: '#FF4544',
						text: '砍价失败'
					}
				],
				emptyBtn: {
					text: '去逛逛',
					url: '/pages/index/index'
				},
				token: null
			};
		},
		onShow() {
			setTimeout( () => {
				if (this.addonIsExist && !this.addonIsExist.bargain) {
					this.$util.showToast({
						title: '商家未开启砍价',
						mask: true,
						duration: 2000
					});
					setTimeout(() => {
						this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
					}, 2000);
					return;
				}
			}, 1000);
			
			
			if (uni.getStorageSync('token')) {
				this.token = uni.getStorageSync('token');
			} else {
				setTimeout(() => {
					this.$refs.login.open('/pages_promotion/bargain/my_bargain');
				});
			}
		},
		methods: {
			//请求列表数据
			getData(mescroll) {
				this.mescroll = mescroll;
				this.$api.sendRequest({
					url: '/bargain/api/bargain/launchPage',
					data: {
						page_size: mescroll.size,
						page: mescroll.num,
						status: this.status
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
						newArr.forEach(v => {
							if (v.end_time > res.timestamp) {
								v.timeMachine = this.$util.countDown(v.end_time - res.timestamp);
							} else {
								v.timeMachine = null;
							}
						});
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
			//砍价详情
			goBargainDetail(data) {
				this.$util.redirectTo('/pages_promotion/bargain/detail', {
					l_id: data.launch_id,
					b_id: data.bargain_id
				});
			},
			//切换分类
			categoryChange(e) {
				this.status = e;
				this.mescroll.resetUpScroll();
			},
			imageError(index) {
				this.dataList[index].sku_image = this.$util.getDefaultImage().goods;
				this.$forceUpdate();
			},
			memberImageError(index, j) {
				this.dataList[index].bargain_record[j].headimg = this.$util.getDefaultImage().head;
				this.$forceUpdate();
			}
		},
		onBackPress(options) {
			if (options.from === 'navigateBack') {
				return false;
			}
			this.$util.redirectTo('/pages/member/index', {});
			return true;
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
	.my_spell_category {
		width: 100%;
		height: 88rpx;
		display: flex;
		justify-content: space-around;
		background: #fff;
		position: fixed;
		top: 0;
		z-index: 999;
		box-sizing: border-box;

		.category-item {
			width: 130rpx;
			text-align: center;

			.item-con {
				display: inline-block;
				height: 88rpx;
				font-size: 30rpx;
				position: relative;
				line-height: 88rpx;
			}

			.item-con.active:after {
				content: '';
				display: block;
				width: 100%;
				height: 4rpx;
				border-radius: 6rpx;
				position: absolute;
				left: 0;
				bottom: 0;
			}

			&:last-of-type {
				margin-right: 0;
			}
		}
	}

	.goods-list {
		margin: 20rpx 30rpx 20rpx;
		background-color: #fff;
		border-radius: 10rpx;
		height: 358rpx;
		padding: 30rpx;
	}

	.goods-list .goods-item-content {
		background-color: #fff;
		border-radius: 10rpx;
		box-sizing: border-box;

		.goods-item-state {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.state-time {
				font-size: $font-size-base;
				color: $color-title;
			}

			.state-sign {
				font-size: $font-size-tag;
			}
		}

		.goods-item-wrap {
			display: flex;
			margin-top: 42rpx;
		}

		.image-wrap {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 170rpx;
			height: 170rpx;
			margin-right: 18rpx;
			border-radius: 10rpx;
			overflow: hidden;

			image {
				width: 170rpx;
				height: 170rpx;
			}
		}

		.content {
			flex: 1;
			position: relative;
			line-height: 1;
			width: calc(100% - 220rpx);
			.title {
				margin-top: -8rpx;
				height: 84rpx;
				font-size: $font-size-base;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				line-height: 42rpx;
				color: $color-title;
			}

			.residue-price {
				display: inline-block;
				margin-top: 16rpx;
				font-size: $font-size-sub;
				padding: 2rpx 4rpx;
			}

			.price-box {
				position: absolute;
				bottom: 0;
				line-height: 1.6;
				font-size: $font-size-tag;
				width: 100%;

				.original-price {
					color: $color-tip;
					font-size: $font-size-tag;
					text-decoration: line-through;
				}

				.time {
					display: flex;
					align-items: center;
					margin-bottom: -12rpx;
					font-size: $font-size-goods-tag;

					.uni-countdown {
						display: flex;
						align-items: center;
					}

					.end-txt {
						font-size: $font-size-base;
						margin-left: 10rpx;
					}
				}
			}
		}
	}

	.goods-list .goods-item-action {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 120rpx;
		box-sizing: border-box;

		.invitation-bargain {
			display: flex;
			flex-flow: wrap;
			width: 510rpx;

			image {
				border: 2rpx solid #fff;
			}

			image,
			.invitation-bargain-end {
				margin-right: -24rpx;
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
				border: 2rpx solid #fff;
			}

			.invitation-bargain-end {
				display: flex;
				align-items: center;
				justify-content: center;
				border: 2rpx dashed;
				font-size: 24rpx;
				background-color: #fff;
				z-index: 999;
			}
		}

		.btn {
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0;
			padding: 0;
			width: 130rpx;
			height: 60rpx;
			line-height: 1;
			color: var(--btn-text-color);
			font-size: $font-size-tag;

			&.fail {
				background-color: #aaa;
			}
		}
	}
</style>
<style scoped>
	>>>.uni-countdown__number,
	>>>.uni-countdown__splitor {
		margin: 0;
		padding: 0;
	}

	.time>>>.uni-countdown__number {
		min-width: 28rpx;
		height: 28rpx;
		text-align: center;
		line-height: 28rpx;
		background: #000;
		border-radius: 4px;
		display: inline-block;
		padding: 4rpx;
		margin: 0;
		border: none;
	}

	.time>>>.uni-countdown__splitor {
		margin: 0 4rpx;
	}
</style>
