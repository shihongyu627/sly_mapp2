<template>
	<view class="content" :data-theme="themeStyle">
		<view class="head-wrap">
			<!-- 搜索区域 -->
			<view class="search-wrap uni-flex uni-row">
				<view class="flex-item input-wrap">
					<input class="uni-input" maxlength="50" v-model="order_no" confirm-type="search"
						@confirm="searchConfirm()" placeholder="请输入订单编号" @input="onInput" />
					<text class="iconfont iconsousuo1" @click.stop="searchConfirm()"></text>
				</view>
			</view>
			<view class="record-header">
				<view class="record-headerItem" @click="selectType('in')">
					<view class="header-title">
						进货明细
					</view>
					<view class="header-br" :class="{ 'header-brs': order_type=='in_put'||order_type=='out' }">
					</view>
				</view>
				<view class="record-headerItem" @click="selectType('in_put')">
					<view class="header-title">
						出货明细
					</view>
					<view class="header-br" :class="{ 'header-brs': order_type=='in' }">
					</view>
				</view>
			</view>
			<!-- 排序 -->
			<view class="sort-wrap">
				<view class="price-wrap" @click="sortTabClick('goods_num')">
					<text
						:class="{ 'color-base-text': order === 'goods_num' }">{{order_type=='in'?'进货数量':'出货数量'}}</text>
					<view class="iconfont-wrap">
						<view class="iconfont iconshangsanjiao-copy"
							:class="{ 'color-base-text': sort === 'asc' && order === 'goods_num' }">
						</view>
						<view class="iconfont iconsanjiao"
							:class="{ 'color-base-text': sort === 'desc' && order === 'goods_num' }">
						</view>
					</view>
				</view>
				<view class="price-wrap" @click="sortTabClick('goods_money')">
					<text
						:class="{ 'color-base-text': order === 'goods_money' }">{{order_type=='in'?'进货金额':'出货金额'}}</text>
					<view class="iconfont-wrap">
						<view class="iconfont iconshangsanjiao-copy"
							:class="{ 'color-base-text': sort === 'asc' && order === 'goods_money' }">
						</view>
						<view class="iconfont iconsanjiao"
							:class="{ 'color-base-text': sort === 'desc' && order === 'goods_money' }">
						</view>
					</view>
				</view>
				<view class="price-wrap" @click="sortTabClick('create_time')">
					<text :class="{ 'color-base-text': order === 'create_time' }">下单时间</text>
					<view class="iconfont-wrap">
						<view class="iconfont iconshangsanjiao-copy"
							:class="{ 'color-base-text': sort === 'asc' && order === 'create_time' }">
						</view>
						<view class="iconfont iconsanjiao"
							:class="{ 'color-base-text': sort === 'desc' && order === 'create_time' }">
						</view>
					</view>
				</view>

			</view>
		</view>
		<mescroll-uni top="280" ref="mescroll" @getData="getListData">
			<block slot="list">
				<block v-if="orderList.length > 0">
					<view class="order-list">
						<view class="order-item" v-for="(orderItem, orderIndex) in orderList" :key="orderIndex"
							@click="goInfo(orderItem)">
							<view class="order-header">
								<text class="font-size-base">订单号：{{ orderItem.order_no }}</text>
								<!-- <text class="status-name color-base-text">{{ orderItem.order_status_name }}</text> -->
							</view>
							<view class="order-body">
								<view class="goods-wrap" v-for="(goodsItem, goodsIndex) in orderItem.order_goods_list"
									:key="goodsIndex">
									<view class="goods-img">
										<image :src="$util.loadimg(goodsItem.goods_image)" mode="aspectFill"
											:lazy-load="true"></image>
									</view>
									<view class="goods-info">
										<view class="pro-info">
											<view class="goods-name">{{ goodsItem.goods_name }}</view>
										</view>
										<view class="goods-sub-section">
											<text class="goods-price">
												<text
													class="unit color-base-text font-size-activity-tag">{{ $lang('common.currencySymbol') }}</text>
												<text class="color-base-text">{{ goodsItem.price }}</text>
											</text>
											<text class="goods-num">
												<text class="iconfont iconclose"></text>
												{{ goodsItem.num }}
											</text>
										</view>
										<view class="goods-action">
											<!-- <view class="action-btn">加购物车</view> -->
										</view>
									</view>
								</view>
							</view>
							<view class="order-footer">
								<view class="order-base-info">
									<view class="total">
										<text class="font-size-sub">共{{ orderItem.goods_num }}件商品</text>
										<text class="align-right font-size-base">
											实付款：
											<text class="font-size-base">￥{{ orderItem.pay_money }}</text>
										</text>
									</view>
								</view>
								<!-- 		<view class="order-action" v-else>
								<view class="order-box-btn color-base-border color-base-text"
									@click="orderDetail(orderItem)">查看详情</view>
							</view> -->
							</view>
							<view class="create_time">
								下单时间：{{ $util.timeStampTurnTime(orderItem.create_time) }}
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<view>
						<ns-empty :isIndex="!1" text="暂无流水"></ns-empty>
					</view>
				</block>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>

	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		components: {},
		data() {
			return {
				scrollInto: '',
				orderList: [],
				mergePayOrder: [],
				isIphoneX: false,
				order_type: 'in', //订单类型，in=进货订单，out=提货订单
				order: 'goods_num', //数量goods_num，金额goods_money，创建时间create_time
				sort: 'asc', //desc降序，asc升序
				goods_ids: '',
				order_no: '',
				dealer_id: ""
			};
		},
		mixins: [globalConfig],
		onLoad(data) {
			this.type = data.type || ''
			this.goods_ids = data.goods_id || ""
			this.dealer_id = data.dealer_id || ""
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			if (uni.getStorageSync('token')) {
				if (this.$refs.mescroll) this.$refs.mescroll.refresh();
			} else {
				// this.$util.redirectTo('/pages/login/login/login', {
				// 	back: '/sellStore/stock/record/record'
				// });
			}
		},
		methods: {
			searchConfirm() {
				this.emptyShow = false;
				this.orderList = [];
				this.$refs.mescroll.refresh();
			},
			onInput(e) {
				this.order_no = e.detail.value
			},
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/dealer/api/order/lists',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						order_type: this.order_type,
						order: this.order,
						sort: this.sort,
						goods_ids: this.goods_ids,
						order_status: '',
						order_no: this.order_no,
						dealer_id: this.dealer_id
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
						if (mescroll.num == 1) this.orderList = []; //如果是第一页需手动制空列表
						this.orderList = this.orderList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			selectType(type) {
				console.log(type, this.type);
				if (type == 'in_put') {
					this.order_type = this.type == 'store' ? 'out' : 'in_put'
				} else {
					this.order_type = type
				}

				this.$refs.mescroll.refresh();
			},
			//筛选点击
			sortTabClick(tag) {
				console.log(tag, 8989, this.order);
				let type = this.order
				if (tag == 'goods_num') {
					type = 'goods_num';
				} else if (tag == 'goods_money') {
					type = 'goods_money';
				} else if (tag == 'create_time') {
					type = 'create_time';
				} else {
					type = '';
					this.sort = '';
				}
				if (tag == this.order) {
					this.sort = this.sort == 'asc' ? 'desc' : 'asc';
				} else {
					this.sort = 'asc'
				}
				this.order = type
				console.log(this.sort, this.order);
				this.emptyShow = false;
				this.orderList = [];
				this.$refs.mescroll.refresh();
			},
			goInfo(data) {
				if (this.order_type == 'in') {
					this.$util.redirectTo('/sellStore/inOrder/info/info', {
						order_id: data.order_id
					});
				} else {
					this.$util.redirectTo('/sellStore/outOrder/info/info', {
						order_id: data.order_id
					});
				}

			}
		}
	};
</script>

<style lang="scss">
	@import '../public/css/record.scss';
	@import '../public/css/list.scss';
</style>
<style scoped>
	>>>.uni-tag--primary.uni-tag--inverted {
		background-color: #f5f5f5 !important;
	}

	.record-header {
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
		height: 44px;
		background: #FFFFFF;
		opacity: 1;
		padding-top: 10px;
	}

	.record-headerItem {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.header-title {
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: normal;
		color: #65666E;
		opacity: 1;
	}

	.header-br {
		width: 40px;
		height: 4px;
		background: #1189F4;
		opacity: 1;
		border-radius: 2px;
		margin-top: 5px;
	}

	.header-brs {
		background: #fff;
	}

	.order-service {
		margin-top: 10px;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 40rpx;
		box-sizing: border-box;
	}

	.service-img {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		opacity: 1;
		margin-right: 5px;
		background: #ccc;
	}

	.service-name {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #231E1E;
		opacity: 1;
		margin-right: 12px;
	}

	.service-tel {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #A6ABBA;
		opacity: 0.5;
	}

	.create_time {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #000000;
		opacity: 0.5;
		margin-top: 5px;
		padding-left: 40rpx;
		box-sizing: border-box;
		padding-bottom: 10px;
	}
</style>
