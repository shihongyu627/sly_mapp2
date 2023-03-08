<template>
	<view class="content" :data-theme="themeStyle">
		<view class="head-wrap">
			<!-- 搜索区域 -->
			<view class="search-wrap uni-flex uni-row">
				<view class="flex-item input-wrap">
					<input class="uni-input" maxlength="50" v-model="keyword" confirm-type="search" @confirm="search()"
						placeholder="请输入关键词" />
					<text class="iconfont iconsousuo1" @click.stop="search()"></text>
				</view>
			</view>
		</view>
		<mescroll-uni top="120" ref="mescroll" @getData="getGoodsList">
			<block slot="list">
				<view class="service-people">
					<view class="service-people-item" v-for="(item, index) in goodsList" :key="index"
						:style='{border:index == 0?0:1}'>
						<view class="service-people-item-left">
							<image class="service-img" :src="goodsImg(item.headimg)" mode="aspectFill"></image>
							<view class="service-name">{{ item.name }}</view>
						</view>
						<view class="iconfont"
							:class="item.worker_id==worker_id ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'"
							@click="selectService(item)"></view>
					</view>
				</view>
				<view v-if="goodsList.length == 0 && emptyShow">
					<ns-empty text="暂无人员"></ns-empty>
				</view>
				<view class="button-wrap" v-if="goodsList.length !== 0">
					<button type="primary" class="add-address" @click="onClickSelect()">确认</button>
				</view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>

	</view>
</template>

<script>
	import list from './public/js/list.js';
	import globalConfig from '@/common/js/golbalConfig.js';

	export default {
		components: {},
		data() {
			return {
				worker_id: ""
			};
		},
		mixins: [list, globalConfig],
		methods: {
		}
	};
</script>

<style lang="scss">
	@import './public/css/list.scss';
</style>
<style scoped>
	>>>.uni-tag--primary.uni-tag--inverted {
		background-color: #f5f5f5 !important;
	}

	.service-people {
		background-color: #fff;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		overflow: hidden;
		margin: 0 auto;
		margin-left: 15px;
		margin-right: 15px;
		box-sizing: border-box;
	}

	.service-people-item {
		height: 70px;
		background: #FFFFFF;
		opacity: 1;
		margin-left: 15px;
		margin-right: 15px;
		border-top: 1px solid #F2F2F2;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.service-people-item-left {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.service-img {
		width: 40px;
		height: 40px;
		background: #FFFFFF;
		border-radius: 50%;
		opacity: 1;
		margin-right: 10px;
	}

	.service-name {
		font-size: 17px;
		font-family: PingFang SC;
		font-weight: 500;
		color: #14171A;
		opacity: 1;
		width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.service-icon {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		opacity: 1;
	}

	.button-wrap {
		width: 750rpx;
		height: 68px;
		background: #FFFFFF;
		box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.0100);
		opacity: 1;
		border-radius: 0px;
		z-index: 9;
		text-align: center;
		overflow: hidden;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.add-address {
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 80rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
		margin-top: 30rpx;
		background-color: #1189F4;
		color: #fff
	}
</style>
