<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<view class="content">
			<view class="cate-search">
				<picker @change="pickerEventGroup($event)" mode='selector' :range="groupList" range-key="name"
					:value="index">
					<view class="store-right">
						<view class="store-address">
							{{name}}
						</view>
						<img class='store-bottomImg' src="@/common/img/store_bottom.png" alt="" mode="aspectFill" />
					</view>
				</picker>
				<view class="search-box">
					<input  class="uni-input" maxlength="50" v-model="inputValue" confirm-type="search"
						@focus="inputFocus" focus @confirm="search()"
						placeholder="请搜索关键词"  />
					<text class="iconfont iconsousuo3" @click="search()"></text>
				</view>
			</view>
			<view class="search-content">
				<!-- 历史搜索 -->
				<view class="history" v-if="historyList.length">
					<view class="history-box">
						<view class="history-top">
							<view class="title">{{ $lang('history') }}</view>
							<view class="icon iconfont iconicon7" @click="deleteHistoryList"></view>
						</view>
						<view class="history-bottom " id="history-list"
							:style="{ maxHeight: !isAllHistory ? '100%' : '168rpx' }">
							<view class="history-li" v-for="(item, index) in historyList" :key="index"
								@click="otherSearch(item)">
								<button type="primary">{{ item }}</button>
							</view>
							<view class="history-li history_more" v-if="isAllHistory" @click="isAllHistory = false">
								<button type="primary"><text class="iconfont iconiconangledown"></text></button>
							</view>
						</view>
					</view>
				</view>

				<!-- 热门搜索 -->
				<view class="history" v-if="hotList.length">
					<view class="history-box">
						<view class="history-top">
							<view class="title">{{ $lang('hot') }}</view>
						</view>
						<view class="history-bottom">
							<view class="history-li" v-for="(item, index) in hotList" :key="index"
								@click="otherSearch(item)" @longtap="deleteItem(item)">
								<button type="primary">{{ item }}</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inputValue: '', //搜索框的值
				historyList: [], //历史搜索记录
				searchList: [], //搜索发现列表
				showSearch: true, //是否展示搜索发现
				alikeList: [],
				isIndex: false,
				placWords: '',
				hotList: [],
				isAllHistory: false,
				groupList: [{
					name: '商品',
					type: 1
				}, {
					name: '门店',
					type: 2
				}],
				name: '商品',
				type: 1
			};
		},
		onLoad(options) {
			if (options.keyword) this.inputValue = options.keyword;
			uni.getStorageSync('search') ? '' : uni.setStorageSync('search', []);
		},
		onShow() {
			this.findHistoryList();
			this.defaultSearch();
			this.findHotList();
			this.$nextTick(function() {
				this.getHistoryHeight();
			});
		},
		methods: {
			//选择分组
			pickerEventGroup(e) {
				let index = e.target.value;
				console.log(e, index);
				this.name = this.groupList[index].name;
				this.type = this.groupList[index].type;
			},
			//获取历史搜索记录
			findHistoryList() {
				this.historyList = uni.getStorageSync('search').reverse();
			},
			//删除所有历史记录
			deleteHistoryList() {
				uni.showModal({
					title: '提示',
					content: '确认删除全部历史记录？',
					success: res => {
						if (res.confirm) {
							uni.setStorageSync('search', []);
							this.findHistoryList();
						}
					}
				});
			},
			//删除历史记录的某一项
			deleteItem(e) {
				uni.showModal({
					title: '提示',
					content: '确认删除该条历史记录？',
					success: res => {
						if (res.confirm) {
							let array = uni.getStorageSync('search');
							let newArr = array.filter(v => {
								return v != e;
							});
							uni.setStorageSync('search', newArr);
							this.findHistoryList();
						}
					}
				});
			},
			// 获取默认搜素
			defaultSearch() {
				this.$api.sendRequest({
					url: '/api/goods/defaultSearchWords',
					success: res => {
						this.placWords = res.data.words;
					}
				});
			},
			// 获取热门搜素
			findHotList() {
				this.$api.sendRequest({
					url: '/api/goods/hotSearchWords',
					success: res => {
						if (res.data.words != '') {
							this.hotList = res.data.words.split(',');
						}
					}
				});
			},
			//input框获取焦点事件
			inputFocus(e) {
				this.showScroll = false;
				if (this.inputValue.trim() != '') this.dataList = [];
			},
			//点击其他列表搜索
			otherSearch(e) {
				this.inputValue = e;
				this.search();
			},
			//搜索
			search() {
				if (this.inputValue.trim() != '') {
					this.showScroll = true;

					// 对历史搜索处理,判断有无,最近搜索显示在最前
					let historyList = uni.getStorageSync('search');
					let array = [];
					if (historyList.length) {
						array = historyList.filter(v => {
							return v != this.inputValue.trim();
						});
						array.push(this.inputValue.trim());
					} else {
						array.push(this.inputValue.trim());
					}
					uni.setStorageSync('search', array);
					if (this.type == 1) {
						this.$util.redirectTo('/pages/goods/list', {
							keyword: this.inputValue.trim(),
						});
					} else {
						this.$util.redirectTo('/tabbarStore/list/list', {
							keyword: this.inputValue.trim(),
						});
					}
				} else {
					if (this.placWords == '') {
						this.$util.showToast({
							title: '搜索内容不能为空哦'
						});
					} else {
						if (this.type == 1) {
							this.$util.redirectTo('/pages/goods/list', {
								keyword: this.placWords
							});
						} else {
							this.$util.redirectTo('/tabbarStore/list/list', {
								keyword: ''
							});
						}
					}
				}
			},
			// 获取元素高度
			getHistoryHeight() {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('#history-list')
					.boundingClientRect(data => {
						if (data && data.height > uni.upx2px(70) * 2 + uni.upx2px(35) * 2) {
							this.isAllHistory = true;
						}
					})
					.exec();
			}
		}
	};
</script>

<style lang="scss" scoped>
	/deep/ .fixed {
		position: relative;
		top: 0;
	}

	/deep/ .empty {
		margin-top: 0 !important;
	}

	.store-right {
		width: 110px;
		height: 40px;
		background: #f8f8f8;
		opacity: 1;
		border-radius: 22px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
	}

	.store-bottomImg {
		width: 20px;
		height: 20px;
	}

	.store-address {
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: normal;
		color: #000000;
		opacity: 1;
		width: 30px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.cart-empty {
		padding-top: 54px;
	}

	.content {
		// overflow: hidden;
		width: 100vw;
		/* #ifdef MP */
		height: 100vh;
		/* #endif */
		/* #ifdef H5 */
		height: calc(100vh - env(safe-area-inset-bottom) - var(--status-bar-height));
		/* #endif */
		/* #ifdef APP-PLUS */
		height: calc(100vh - 44px - env(safe-area-inset-bottom));
		/* #endif */
		background: #ffffff;
	}

	.cate-search {
		width: 100%;
		height: 100rpx;
		background: #ffffff;
		padding: 10rpx 30rpx;
		box-sizing: border-box;
		/* #ifdef H5 */
		padding-top: 30rpx;
		/* #endif */
		display: flex;
		flex-direction: row;
		align-items: center;

		input {
			font-size: $font-size-base;
			height: 60rpx;
			padding: 15rpx 25rpx 15rpx 30rpx;
			line-height: 60rpx;
			width: calc(100% - 120rpx);
		}

		text {
			font-size: 32rpx;
			color: $color-tip;
			width: 120rpx;
			text-align: center;
		}

		.search-box {
			width: 100%;
			height: 100%;
			background: $color-bg;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 40rpx;
		}
	}

	.search-content {
		box-sizing: border-box;
		background: #ffffff;
	}

	.history {
		width: 100%;
		box-sizing: border-box;

		.history-box {
			width: 100%;
			height: 100%;
			background: #ffffff;
			padding: 30rpx 30rpx 0rpx 30rpx;

			box-sizing: border-box;
			overflow: hidden;

			.history-top {
				width: 100%;
				height: 60rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: $font-size-toolbar;

				.title {
					font-weight: 500;
					font-size: $font-size-toolbar;
				}

				.iconfont {
					color: $color-tip;
					font-size: $font-size-base;
				}
			}

			.history-bottom {
				width: 100%;
				padding-top: $padding;
				position: relative;

				.history-li {
					display: inline-block;
					margin-right: 20rpx;
					margin-bottom: 15rpx;
					max-width: 100%;

					button[type='primary'] {
						line-height: 66rpx;
						background: #f8f8f8 !important;
						height: 66rpx;
						color: #303133 !important;
						margin: 0 0rpx 4rpx 0 !important;
						padding: 0 $padding;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}

					&.history_more {
						margin-right: 0;
						position: absolute;
						bottom: 0;
						right: 0;
					}
				}
			}
		}

		.hidden-show {
			width: 100%;
			height: 70rpx;
			text-align: center;
			line-height: 70rpx;
		}
	}

	.search-alike {
		width: 100%;
		height: calc(100vh - 100rpx);

		padding: 0 $padding;
		box-sizing: border-box;

		.alike-box {
			width: 100%;
			height: 100%;
			background: #ffffff;
			border-radius: $padding;
			overflow: hidden;
		}
	}
</style>
