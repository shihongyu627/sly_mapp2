<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="content">
		<view class="head-wrap">
			<!-- 搜索区域 -->
			<view class="search-wrap uni-flex uni-row">
				<view class="flex-item input-wrap">
					<input class="uni-input" maxlength="50" v-model="keyword" confirm-type="search" @confirm="search()" placeholder="请输入您要搜索的商品" />
					<text class="iconfont iconIcon_search" @click.stop="search()"></text>
				</view>
			</view>

			<!-- 排序 -->
			<view class="sort-wrap">
				<view class="comprehensive-wrap" :class="{ 'color-base-text': orderType === '' }" @click="sortTabClick('')">
					<text :class="{ 'color-base-text': orderType === '' }">综合</text>
				</view>
				<view :class="{ 'color-base-text': orderType === 'sales' }" @click="sortTabClick('sales')">销量</view>
				<view class="price-wrap" @click="sortTabClick('discount_price')">
					<text :class="{ 'color-base-text': orderType === 'discount_price' }">价格</text>
					<view class="iconfont-wrap">
						<view class="iconfont iconiconangledown-copy" :class="{ 'color-base-text': priceOrder === 'asc' && orderType === 'discount_price' }"></view>
						<view class="iconfont iconiconangledown" :class="{ 'color-base-text': priceOrder === 'desc' && orderType === 'discount_price' }"></view>
					</view>
				</view>
				<view :class="{ 'color-base-text': orderType === 'screen' }" class="screen-wrap">
					<view class="iconfont font-size-base" @click="changeListStyle" :class="{ iconapps: listStyle == 'largest', iconlist1: listStyle == '' }"></view>
					<view class="line"></view>
					<text @click="sortTabClick('screen')">筛选</text>
					<view @click="sortTabClick('screen')" class="iconfont-wrap"><view class="iconfont iconshaixuan color-tip"></view></view>
				</view>
			</view>
		</view>

		<!-- top:350 -->
		<mescroll-uni top="210" ref="mescroll" @getData="getGoodsList">
			<block slot="list">
				<view class="goods-list" :class="listStyle">
					<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item)">
						<view class="image-wrap"><image :src="$util.img(item.sku_image, { size: 'mid' })" @error="imageError(index)" mode="aspectFill" /></view>
						<view class="goods-desc">
							<view class="goods-name">
								<text class="name">{{ item.sku_name }}</text>
								<view class="good-share-money">
									<view class="level_money">
										<view class="money_sign">佣金:</view>
										<view class="money color-base-text">￥{{ item.commission_money }}</view>
									</view>
								</view>
							</view>
							<view class="goods-bottom">
								<view class="goods-price color-base-text">
									<text class="font-size-tag">￥</text>
									{{ item.discount_price }}
								</view>
								<view class="goods-share color-base-bg" v-if="!item.is_collect" @click.stop="followGoods(index, item.goods_id, item.sku_id)">
									<text>关注</text>
								</view>
								<view class="goods-share color-base-bg" v-else @click.stop="delFollow(item.collect_id, index)"><text>已关注</text></view>
							</view>
						</view>
					</view>
				</view>

				<view class="empty" v-if="goodsList.length == 0 && emptyShow"><ns-empty :isIndex="false" text="暂无分销商品"></ns-empty></view>
			</block>
		</mescroll-uni>

		<!-- 筛选弹出框 -->
		<uni-drawer :visible="showScreen" mode="right" @close="showScreen = false" class="screen-wrap">
			<view class="title color-tip">筛选</view>
			<scroll-view scroll-y>
				<!-- 包邮 -->
				<view class="item-wrap">
					<view class="label"><text>是否包邮</text></view>
					<view class="list"><uni-tag :inverted="true" text="包邮" :type="isFreeShipping ? 'primary' : 'default'" @click="isFreeShipping = !isFreeShipping" /></view>
				</view>

				<!-- 价格筛选项 -->
				<view class="item-wrap">
					<view class="label"><text>价格区间(元)</text></view>
					<view class="price-wrap">
						<input class="uni-input" type="digit" v-model="minPrice" placeholder="最低价" />
						<view class="h-line"></view>
						<input class="uni-input" type="digit" v-model="maxPrice" placeholder="最高价" />
					</view>
				</view>

				<!-- 分类 -->
				<view class="category-list-wrap">
					<text class="first">全部分类</text>
					<view class="class-box">
						<view @click="selectedCategory('')" class="list-wrap"><text :class="{ selected: !categoryId, 'color-base-text': !categoryId }">全部</text></view>
						<view @click="selectedCategory(item.category_id, item.level)" v-for="(item, index) in categoryList" :key="index" class="list-wrap">
							<text :class="{ selected: item.category_id == categoryId, 'color-base-text': item.category_id == categoryId }">{{ item.category_name }}</text>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="footer" :class="{ 'safe-area': isIphoneX }">
				<button type="default" class="footer-box" @click="resetData">重置</button>
				<button type="primary" class="footer-box1" @click="screenData">确定</button>
			</view>
		</uni-drawer>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import uniDrawer from '@/components/uni-drawer/uni-drawer.vue';
import uniTag from '@/components/uni-tag/uni-tag.vue';
import list from './public/js/goods_list.js';
import fenxiaoWords from 'common/js/fenxiao-words.js';
export default {
	components: {
		uniDrawer,
		uniTag
	},
	data() {
		return {};
	},
	onShow() {
		setTimeout( () => {
			if (this.addonIsExist && !this.addonIsExist.fenxiao) {
				this.$util.showToast({
					title: '商家未开启分销',
					mask: true,
					duration: 2000
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
				}, 2000);
				return;
			}
		}, 1000);
		if(this.fenxiaoWords && this.fenxiaoWords.concept) this.$langConfig.title(this.fenxiaoWords.concept + '中心');
	},
	mixins: [list, fenxiaoWords]
};
</script>

<style lang="scss">
@import './public/css/goods_list.scss';
</style>
<style scoped>
>>> .uni-tag--primary.uni-tag--inverted {
	background-color: #f5f5f5 !important;
}
</style>
