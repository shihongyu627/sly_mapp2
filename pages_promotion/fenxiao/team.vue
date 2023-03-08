<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<mescroll-uni ref="mescroll" @getData="getData" top="10" class="member-point" :size="8" v-if="token">
			<block slot="list">
				<view class="team-li" v-for="(item, index) in teamList" :key="index" v-if="teamList.length != 0" @click="toFenxiaoOrder(item)">
					<view class="li-box" :class="{ active: index + 1 == teamList.length }">
						<image v-if="item.headimg" :src="$util.img(item.headimg)" @error="imageError(index)" mode="aspectFill"></image>
						<image v-else :src="$util.getDefaultImage().head"></image>
						<view class="menber-info">
							<view class="member-name">
								<block>
									<view class="left">
										<view class="name">{{ item.source_member_nickname }}</view>
										<text class="color-tip font-size-goods-tag">加入时间：{{ item.create_time }}</text>
									</view>
								</block>
							</view>
						</view>
					</view>
				</view>
				<block v-if="teamList.length == 0 && emptyShow">
					<ns-empty text="暂无邀请人" :isIndex="false" v-if="selectId == 0"></ns-empty>
				</block>
			</block>
		</mescroll-uni>

		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import fenxiaoWords from 'common/js/fenxiao-words.js';
export default {
	data() {
		return {
			teamList: [],
			emptyShow: false,
			levelNum: 0,
			token: null
		};
	},
	mixins: [fenxiaoWords],
	onShow() {
		if (uni.getStorageSync('token')) {
			this.token = uni.getStorageSync('token');
		} else {
			setTimeout(() => {
				this.$refs.login.open('/pages_promotion/fenxiao/team');
			});
		}
	},
	methods: {
		getData(mescroll) {
			this.emptyShow = false;
			if (mescroll.num == 1) {
				this.teamList = [];
			}
			this.$api.sendRequest({
				url: '/memberrecommend/api/memberrecommend/lists',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
				},
				success: res => {
					this.emptyShow = true;
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
						newArr.forEach(v => {
							v.create_time = this.$util.timeStampTurnTime(v.create_time)
						});
					} else {
						this.$util.showToast({
							title: msg
						});
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.teamList = []; //如果是第一页需手动制空列表
					this.teamList = this.teamList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		imageError(e) {
			this.teamList[e].headimg = $util.getDefaultImage().head;
			this.$forceUpdate();
		},
		selectCate(e) {
			this.selectId = e;
			this.$refs.mescroll.refresh();
		},
	
	},
	watch: {
		storeToken: function(nVal, oVal) {
			if (nVal) {
				this.token = nVal;
				this.$refs.mescroll.refresh();
			}
		}
	},
	computed: {
		storeToken() {
			return this.$store.state.token;
		}
	}
};
</script>

<style lang="scss">
.team-cate {
	padding: 0 30rpx;
	width: calc(100%);
	height: 90rpx;
	display: flex;
	box-sizing: border-box;
	background: #ffffff;
	position: fixed;
	left: 0;
	top: var(--window-top);

	.cate-li {
		flex: 1;
		display: flex;
		justify-content: center;
		text-align: center;
		align-items: center;
		display: inline-block;
		line-height: 90rpx;
		height: 100%;
		font-size: 30rpx;
		text-align: center;

		&.active {
			box-sizing: border-box;
			border-bottom: 4rpx solid;
		}
	}
}

.team-member {
	width: 100%;
	height: 70rpx;
	line-height: 70rpx;
	color: $color-tip;
	padding: 0 $padding;
	box-sizing: border-box;
}

.team-li {
	margin: $margin-updown $margin-both;
	padding: $margin-both;
	box-sizing: border-box;
	background: #fff;
	margin-bottom: 20rpx;
	border-radius: 10rpx;

	.li-box {
		display: flex;
		box-sizing: border-box;

		image {
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
		}

		.menber-info {
			flex: 1;
			padding-left: $padding;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			justify-content: center;

			.member-name {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: $font-size-base;

				.left {
					width: 70%;
					// display: flex;
					// align-items: center;

					.name {
						max-width: calc(100% - 150rpx);
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.title {
						padding: 4rpx 16rpx;
						justify-content: center;
						align-items: center;
						text-align: center;
						font-size: $font-size-activity-tag;
						border-radius: 4rpx;
						margin-left: 10rpx;
						line-height: 1;
						border: 2rpx solid;
						color: #fff;
					}
				}
			}

			.member-date {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: $padding;

				view {
					width: 50%;
					height: 100%;
					text-align: left;
					line-height: 1;

					text {
						font-size: $font-size-tag;
						color: $color-tip;
					}

					.tit {
						color: $color-tip;
					}
				}
			}
		}

		.btn-see {
			display: flex;
			flex-direction: row-reverse;
		}
	}
	.order-box-btn {
		display: inline-block;
		line-height: 56rpx;
		padding: 0 30rpx;
		font-size: 26rpx;
		color: #303133;
		border: 2rpx solid #999;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		-webkit-border-radius: $border-radius;
		border-radius: $border-radius;
		margin-top: 30rpx;
	}
	.li-box.active {
		border: none;
	}
}
</style>
