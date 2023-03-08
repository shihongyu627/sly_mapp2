<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view :style="{ backgroundColor: bgColor, minHeight: 'calc(100vh - 55px)' }" class="page-img">
		<!-- #ifndef H5 -->
		<view class="page-header" v-if="diyData.global && diyData.global.navBarSwitch"
			:style="{ backgroundImage: bgImg }">
			<ns-navbar :background="bgNav" :title-color="textNavColor" :globalS="diyData.global" :scrollTop="scrollTop">
			</ns-navbar>
		</view>
		<!-- #endif -->
		<diy-index-page ref="indexPage" :value="topIndexValue" :scrollHeight="scrollHeight"
			:scrollTopHeight="scrollTopHeight" :bgUrl="bgUrl" v-if="topIndexValue">
			<diy-group ref="diyGroup" :diyData="diyData" :storeId="storeId" v-if="diyData.value"
				:height="scrollTopHeight"></diy-group>
			<view class="padding-bottom">
				<!-- <ns-copyright></ns-copyright> -->
			</view>
		</diy-index-page>
		<scroll-view v-else scroll-y="true" show-scrollbar="false"
			:style="{ height: 'calc(100vh - ' + headerHeight + ' - 55px)'}" @scroll="scroll">
			<view class="bg-index"
				:style="{ backgroundImage: backgroundUrl, paddingTop: paddingTop,marginTop:marginTop }">
				<diy-group ref="diyGroup" :diyData="diyData" v-if="diyData.value" :storeId="storeId"></diy-group>
				<view class="padding-bottom">
					<!-- <ns-copyright></ns-copyright> -->
				</view>
			</view>
		</scroll-view>

		<template
			v-if="diyData.global && diyData.global.popWindow && diyData.global.popWindow.count != -1 && diyData.global.popWindow.imageUrl">
			<view @touchmove.prevent.stop>
				<uni-popup ref="uniPopupWindow" type="center" class="wap-floating" :maskClick="false">
					<view class="image-wrap">
						<image :src="$util.img(diyData.global.popWindow.imageUrl)" :style="popWindowStyle"
							@click="uniPopupWindowFn()" mode="aspectFit"></image>
					</view>
					<text class="iconfont iconroundclose" @click="closePopupWindow"></text>
				</uni-popup>
			</view>
		</template>

		<!-- 底部tabBar -->
		<view class="page-bottom" v-if="openBottomNav">
			<diy-bottom-nav @callback="callback" :name="name"></diy-bottom-nav>
		</view>

		<!-- 自定义页面跳转返回 -->
		<text class="diy-pages-return" v-if="diyPageReturn.length > 1" @click="diyPageFn">返回</text>

		<!-- 收藏 -->
		<uni-popup ref="collectPopupWindow" type="top" class="wap-floating wap-floating-collect">
			<view v-if="showTip" class="collectPopupWindow"
				:style="{ marginTop: (collectTop + statusBarHeight) * 2 + 'rpx' }">
				<image :src="$util.img('public/uniapp/index/collect2.png')" mode="aspectFit"></image>
				<text @click="closeCollectPopupWindow">我知道了</text>
			</view>
		</uni-popup>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import nsNavbar from '@/components/ns-navbar/ns-navbar.vue';
	import indexJs from './public/js/index.js';

	export default {
		components: {
			uniPopup,
			nsNavbar
		},
		mixins: [indexJs]
	};
</script>

<style lang="scss">
	@import './public/css/index.scss';
</style>

<style scoped>
	.header-boxBg {
		width: 100%;
		height: 100px;
		background: #1189F4;
		opacity: 1;
		border-bottom-left-radius: 20px;
		border-bottom-right-radius: 20px;
	}

	.wap-floating>>>.uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
		background: none !important;
	}

	/deep/ .placeholder {
		height: 0;
	}

	/deep/::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
		display: none;
	}

	/deep/ .ns-copyright-info {
		margin-top: 40rpx;
		margin-bottom: 0;
	}

	.page-img {
		display: flex;
		flex-direction: column;
	}

	.page-header {
		background: #118AF4;
	}
</style>
