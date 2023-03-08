<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view :style="{ backgroundColor: bgColor, minHeight: 'calc(100vh - 55px)' }" class="page-img">
		<scroll-view scroll-y="true" show-scrollbar="false"
			:style="{ height: 'calc(100vh - ' + headerHeight + ' - 55px)' }" @scroll="scroll">
			<view class="bg-index"
				:style="{ backgroundImage: backgroundUrl, paddingTop: paddingTop, marginTop: marginTop }">
				<diy-group ref="diyGroup" :diyData="diyData" v-if="diyData.value" :storeId="storeId"></diy-group>
				<view class="padding-bottom">
					<ns-copyright></ns-copyright>
				</view>
			</view>
		</scroll-view>
		<!-- 底部tabBar -->
		<view class="page-bottom" v-if="openBottomNav">
			<diy-bottom-nav @callback="callback" :name="name"></diy-bottom-nav>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import indexJs from './public/js/index.js';

	export default {
		components: {
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
</style>
