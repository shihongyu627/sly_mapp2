<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="container">
		<view class="head-wrap" v-if="token">
			<text @click="manageFootprint">{{ manage ? '完成' : '管理' }}</text>
		</view>
		<mescroll-uni ref="mescroll" @getData="getListData" top="110rpx" v-if="token">
			<block slot="list">
				<view class="goods-list single-column" v-if="goodsList.length">
					<view v-for="(item, index) in goodsList" :key="index">
						<view class="datetime">{{ datetime(item) }}</view>
						<view class="goods-item" :class="{manage:manage}">
							<view class="checkbox-wrap" v-if="manage" @click="singleElection(item)">
								<text class="iconfont" :class="$util.inArray(item.id, idArr) != -1 ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'"></text>
							</view>
							<view class="goods-img" @click="toDetail(item)">
								<image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(index)"></image>
								<view class="color-base-bg goods-tag" v-if="goodsTag(item) != ''">{{ goodsTag(item) }}</view>
							</view>
							<view class="info-wrap" @click="toDetail(item)">
								<view class="name-wrap">
									<view class="goods-name">{{ item.goods_name }}</view>
								</view>
								
								<view class="lineheight-clear">
									<view class="discount-price">
										<text class="unit price-style small">{{ $lang('common.currencySymbol') }}</text>
										<text class="price price-style large" >{{ parseFloat(showPrice(item)).toFixed(2).split(".")[0] }}</text>
									    <text class="unit price-style small">.{{ parseFloat(showPrice(item)).toFixed(2).split(".")[1] }}</text>
									</view>
									<view class="member-price-tag" v-if="item.member_price && item.member_price == showPrice(item)">
										<image :src="$util.img('public/uniapp/index/VIP.png')" mode="widthFix"></image>
									</view>
									<view class="member-price-tag" v-else-if="item.promotion_type == 1">
										<image :src="$util.img('public/uniapp/index/discount.png')" mode="widthFix"></image>
									</view>
								</view>
								<view class="pro-info">
									<view class="delete-price font-size-activity-tag color-tip price-font">
										<text class="unit">{{ $lang('common.currencySymbol') }}</text>
										{{ item.market_price > 0 ? item.market_price : item.price }}
										
									</view>
									<view class="sale font-size-activity-tag color-tip" v-if="item.sale_show">已售{{ item.sale_num }}{{ item.unit ? item.unit : '件' }}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-else><ns-empty text="暂无浏览过的商品"></ns-empty></view>

				<view class="bottom-wrap" v-if="goodsList.length && manage">
					<view class="all-election" @click="allElection">
						<view class="iconfont" :class="isAll ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'"></view>
						<text>全选</text>
					</view>
					<view class="action-btn"><button type="primary" @click="deleteFootprint()" class="delete" :class="{ disabled: selected }">删除</button></view>
				</view>
			</block>
		</mescroll-uni>

		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
var dateList = [];

export default {
	data() {
		return {
			goodsList: [],
			current: -1,
			manage: false,
			idArr: [],
			mescroll: null,
			isSub: false,
			token: null
		};
	},
	onShow() {

		if (uni.getStorageSync('token')) {
			this.token = uni.getStorageSync('token');
			if (this.$refs.mescroll) this.$refs.mescroll.refresh();
		} else {
			setTimeout(() => {
				this.$refs.login.open('/pages_tool/member/footprint');
			});
		}
	},
	computed: {
		selected() {
			return this.idArr.length == 0;
		},
		isAll() {
			return this.idArr.length == this.goodsList.length;
		},
		storeToken() {
			return this.$store.state.token;
		}
	},
	methods: {
		getListData(mescroll) {
			this.mescroll = mescroll;
			this.$api.sendRequest({
				url: '/api/goodsbrowse/page',
				data: {
					page: mescroll.num,
					page_size: mescroll.size
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
					if (mescroll.num == 1) this.goodsList = []; //如果是第一页需手动制空列表
					this.goodsList = this.goodsList.concat(newArr); //追加新数据
					dateList = [];
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		longpress(index) {
			this.current = index;
		},
		deleteFootprint() {
			if (this.idArr.length == 0) {
				this.$util.showToast({
					title: '请选择要删除的数据！'
				});
				return;
			}
			if (this.isSub) return;
			this.isSub = true;
			this.$api.sendRequest({
				url: '/api/goodsbrowse/delete',
				data: {
					id: this.idArr.toString()
				},
				success: res => {
					this.isSub = false;
					if (res.code >= 0) {
						this.idArr = [];
						this.mescroll.resetUpScroll();
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		},
		manageFootprint() {
			this.manage = !this.manage;
			dateList = [];
		},
		goodsImg(imgStr) {
			let imgs = imgStr.split(',');
			return imgs[0]
				? this.$util.img(imgs[0], {
						size: 'mid'
				  })
				: this.$util.getDefaultImage().goods;
		},
		imgError(index) {
			dateList = [];
			this.goodsList[index].goods_image = this.$util.getDefaultImage().goods;
		},
		showPrice(data) {
			let price = data.discount_price;
			if (data.member_price && parseFloat(data.member_price) < parseFloat(price)) price = data.member_price;
			return price;
		},
		goodsTag(data) {
			return data.label_name || '';
		},
		datetime(item) {
			let date = new Date();
			date.setTime(item.browse_time * 1000);
			let y = date.getFullYear();
			let m = date.getMonth() + 1;
			m = m < 10 ? '0' + m : m;
			let d = date.getDate();
			d = d < 10 ? '0' + d : d;

			var dateTime = y + '/' + m + '/' + d;

			if (this.$util.inArray(dateTime, dateList) == -1) {
				dateList.push(dateTime);
				return dateTime;
			}
		},
		singleElection(item) {
			if (this.$util.inArray(item.id, this.idArr) == -1) {
				this.idArr.push(item.id);
			} else {
				this.idArr.splice(this.$util.inArray(item.id, this.idArr), 1);
			}
			dateList = [];
		},
		allElection() {
			if (this.idArr.length != this.goodsList.length) {
				this.idArr = [];
				let ids = [];
				this.goodsList.forEach(item => {
					ids.push(item.id);
				});
				this.idArr = ids;
			} else {
				this.idArr = [];
			}
			dateList = [];
		},
		toDetail(e) {
			this.$util.redirectTo('/pages/goods/detail', {
				goods_id: e.goods_id
			});
		}
	},
	watch: {
		storeToken: function(nVal, oVal) {
			if (nVal) {
				this.token = nVal;
				this.$refs.mescroll.refresh();
			}
		}
	}
};
</script>

<style lang="scss">
/deep/ .empty {
	margin-top: 0 !important;
}

@import './public/css/footprint.scss';
</style>
