<template>
	<view class="content" :data-theme="themeStyle">
		<mescroll-uni ref="mescroll" @getData="getGoodsList">
			<block slot="list">
				<view class="myopia-list">
					<view class="myopia-item margin-bottom" v-for="(item, index) in goodsList" :key="index"
						@click="toDetail(item)">
						<view class="myopia-top">
							<img class="myopia-icon" src="../../img/question.png" mode="aspectFit" />
							<view class="myopia-title">{{ item.title }}</view>
						</view>
						<view class="myopia-bottom">
							<view class="myopia-top">
								<img class="myopia-icon" src="../../img/ask.png" mode="aspectFit" />
								<view class="myopia-title">{{ item.info }}</view>
							</view>
							<!-- <view class="myopia-footer">
								<view class="myopia-content" v-if="item.content">
									<ns-rich-text :contentArr="$util.getVideo(item.content)"></ns-rich-text>
								</view>

							</view> -->
						</view>
					</view>
				</view>
				<view v-if="goodsList.length == 0 && emptyShow">
					<ns-empty text="暂无内容"></ns-empty>
				</view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import list from '../public/js/list.js';
	import globalConfig from '@/common/js/golbalConfig.js';

	export default {
		components: {},
		data() {
			return {};
		},
		mixins: [list, globalConfig]
	};
</script>

<style lang="scss">

</style>
<style scoped>
	.myopia-item {
		width: 710rpx;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		margin-top: 10px;
		background: #E6ECF2;
	}

	.myopia-top {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		width: 710rpx;
		opacity: 1;
		padding-bottom: 30rpx;
		padding-top: 40rpx;
	}

	.myopia-bottom {
		width: 710rpx;
		background: #ffffff;
		opacity: 1;
		/* padding-bottom: 19px; */
	}

	.myopia-icon {
		width: 20px;
		height: 20px;
		opacity: 1;
		margin-right: 12px;
		border-radius: 50%;
		margin-left: 12px;
	}

	.myopia-title {
		width: 289px;
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #231E1E;
		opacity: 1;
		margin-top: -5px;
		line-height: 24px;
	}

	.myopia-footer {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		width: 710rpx;
		opacity: 1;
	}

	.myopia-content {
		width: 299px;
		font-size: 13px;
		font-family: PingFang SC;
		font-weight: 500;
		color: #65666E;
		opacity: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		margin-right: 12px;
	}

	.bigNews-name {
		width: 335px;
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		margin: 0 auto;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		height: 114rpx;
		margin-bottom: 12px;
	}

	.bigNews-time {
		font-size: 12px;
		font-family: PingFang SC;
		margin: 0 auto;
		font-weight: 400;
		color: #AFAFAF;
		opacity: 1;
	}
</style>
