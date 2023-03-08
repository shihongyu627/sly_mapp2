<template>
	<view class="order-container" :data-theme="themeStyle">
		<mescroll-uni ref="mescroll" @getData="getListData" top="20rpx">
			<block slot="list">
				<block v-if="orderList.length > 0">
					<view class="team-list">
						<view class="team-item" v-for="(orderItem, orderIndex) in orderList" :key="orderIndex">
							<image :src="$util.loadimg(orderItem.headimg)" class="team-head" mode="aspectFill"
								:lazy-load="true">
							</image>
							<view class="team-right">
								<view class="team-content">
									<view class="team-content-item">
										<view class="team-name">
											{{orderItem.name}}
										</view>
									</view>
									<view class="team-content-item">
										<view class="team-text">
											关联用户：{{orderItem.mobile}}
										</view>
									</view>
									<view class="team-content-item">
										<view class="team-time">
											加入时间：{{$util.timeStampTurnTime(orderItem.create_time)}}
										</view>
									</view>
								</view>
								<view class="team-del-box" @click="onClickdelete(orderItem.auth_id)">
									<text class="team-del">
										<text class="iconfont iconicon7"></text>
									</text>
								</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<view>
						<ns-empty :isIndex="!1" text="暂无账号"></ns-empty>
					</view>
				</block>
			</block>
		</mescroll-uni>
		<view class="team-footer">
			<view class="team-btn" @click="joinTeam()">
				添加账号
			</view>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import globalConfig from '@/common/js/golbalConfig.js';

	export default {
		data() {
			return {
				scrollInto: '',
				orderList: [],
				isIphoneX: false,
				type: ''
			};
		},
		components: {
			uniLoadMore,
		},
		mixins: [globalConfig],
		onLoad(option) {
			console.log(option);
			if (option.type) this.type = option.type;
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			if (uni.getStorageSync('token')) {
				if (this.$refs.mescroll) this.$refs.mescroll.refresh();
			} else {
				// this.$util.redirectTo('/pages/login/login/login', {
				// 	back: '/sellStore/team/list/list?status'
				// });
			}
		},
		methods: {
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/dealer/api/auth/page',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						type: this.type == 'dealer' ? '1' : '2'
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
			goUserInfo(data) {
				// this.$util.redirectTo('/sellStore/team/info/info', {
				// 	worker_id: data.worker_id
				// });
			},
			/**
			 * 添加员工
			 * 
			 */
			joinTeam() {
				this.$util.redirectTo('/sellStore/authorize/create/create', {
					type: this.type
				});
			},
			imageError(orderIndex, goodsIndex) {
				this.orderList[orderIndex].order_goods[goodsIndex].sku_image = this.$util.getDefaultImage()
					.default_goods_img;
				this.$forceUpdate();
			},
			onClickdelete(auth_id) {
				uni.showModal({
					title: '提示',
					content: '是否删除该账号？',
					success: res => {
						if (res.confirm) {
							this.$api.sendRequest({
								url: '/dealer/api/auth/delete',
								data: {
									auth_id: auth_id
								},
								success: res => {
									this.$util.showToast({
										title: res.message
									});
									if (res.code == 0) {
										this.$refs.mescroll.refresh();
									}
								},
							});
						}
					}
				})

			}
		},
		computed: {
			mpOrderList() {
				if (!this.orderList[this.status]) return;
				return this.orderList[this.status].list || [];
			}
		}
	};
</script>

<style lang="scss">
</style>
<style scoped>
	/deep/ .uni-page {
		overflow: hidden;
	}

	/deep/ .mescroll-upwarp {
		padding-bottom: 100rpx;
	}

	.team-item {
		width: 710rpx;
		height: 94px;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto;
		margin-bottom: 10px;
		padding-left: 28rpx;
		padding-right: 40rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		padding-top: 12px;
	}

	.team-head {
		width: 40px;
		height: 40px;
		opacity: 1;
		border-radius: 70px;
		background: #ccc;
		margin-right: 12px;
	}

	.team-right {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 520rpx;
	}

	.team-del-box {
		width: 24px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.team-del {
		width: 12px;
		height: 14px;
		opacity: 1;
	}

	.team-content-item {
		display: flex;
		align-items: center;

	}

	.team-name {
		font-size: 15px;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		margin-right: 5px;
	}

	.team-tag {
		background: #1189F4;
		opacity: 1;
		border-radius: 4px;
		font-size: 11px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		opacity: 1;
		padding-left: 5px;
		padding-right: 5px;
		padding-top: 2px;
		padding-bottom: 2px;
	}

	.team-text {
		font-size: 11px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #65666E;
		opacity: 1;
	}

	.team-time {
		font-size: 11px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #A6ABBA;
		opacity: 1;
	}

	.team-footer {
		width: 100%;
		height: 68px;
		background: #FFFFFF;
		box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.01);
		opacity: 1;
		border-radius: 0px;
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
	}

	.team-btn {
		width: 710rpx;
		height: 48px;
		background: #1189F4;
		opacity: 1;
		border-radius: 24px;
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 48px;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
	}
</style>
