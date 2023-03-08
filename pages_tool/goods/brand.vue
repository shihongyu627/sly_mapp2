<template>
	<view :data-theme="themeStyle">
		<mescroll-uni @getData="getBrandList" ref="mescroll" size="20">
			<block slot="list">
				<ns-adv keyword="NS_BRAND"></ns-adv>
				<view class="brand-content" v-if="brandList.length > 0">
					<uni-grid :column="3" @change="change" :showBorder="!1">
						<uni-grid-item v-for="(item, index) in brandList" :key="index" index="index">
							<image class="brand-pic" :src="$util.img(item.image_url)" mode="widthFix"></image>
							<view class="brand_name">{{ item.brand_name }}</view>
						</uni-grid-item>
					</uni-grid>
				</view>
				<view v-if="brandList.length == 0"><ns-empty text="暂无更多品牌,去首页看看吧"></ns-empty></view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import uniGrid from '@/components/uni-grid/uni-grid.vue';
import uniGridItem from '@/components/uni-grid-item/uni-grid-item.vue';
import nsAdv from '@/components/ns-adv/ns-adv.vue';
export default {
	components: {
		uniGrid,
		uniGridItem,
		nsAdv
	},
	data() {
		return {
			brandList: [],
			siteId: 0
		};
	},
	onLoad(options) {
		if (options.site_id) this.siteId = options.site_id;
	},
	onShow() {},
	methods: {
		change(e) {
			this.$util.redirectTo('/pages/goods/list', {
				brand_id: this.brandList[e.detail.index].brand_id
			});
		},
		getBrandList(mescroll) {
			this.$api.sendRequest({
				url: '/api/goodsbrand/page',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					site_id: this.siteId
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
					if (mescroll.num == 1) this.brandList = []; //如果是第一页需手动制空列表
					this.brandList = this.brandList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail() {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		}
	},
	onShareAppMessage(res) {
		var title = '你想要的大牌都在这里';
		var path = '/pages_tool/goods/brand';
		return {
			title: title,
			path: path,
			success: res => {},
			fail: res => {}
		};
	}
};
</script>

<style lang="scss">
/deep/ .uni-grid-item {
	width: calc(100% / 3) !important;
}

.brand-head {
	width: 100%;
	line-height: 0;

	image {
		width: 100%;
	}
}

.brand-content {
	padding: $padding 0;
	box-sizing: border-box;
	background: #ffffff;
	margin: $margin-updown $margin-both 0;

	.brand-pic {
		width: 60%;
		height: 50%;
	}

	.brand_name {
		width: 70%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: center;
	}
}
</style>
