<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<view class="notes-nav">
			<scroll-view class="notes-list" scroll-x="true">
				<text v-for="(gruopItem, gruopIndex) in groupInfo.groupList" :key="gruopIndex" class="notes-item" @click="tabCut(gruopItem.group_id, gruopIndex)"
				 :class="gruopIndex == groupInfo.currIdent ? 'color-base-text active color-base-border' : ''">
					{{ gruopItem.group_name }}
				</text>
			</scroll-view>
		</view>

		<mescroll-uni @getData="getNotesList" ref="mescroll" v-if="groupInfo.currId != 0" top="94">
			<block slot="list">
				<view class="notes-content">
					<view class="note-item" v-for="(listItem, listIndex) in noteListInfo" :key="listIndex" @click="noteDetail(listItem.note_id)">
						<text class="note-title">{{ listItem.note_title }}</text>
						<view class="notes-highlights-list" v-if="listItem.goods_highlights">
							<text class="color-base-bg" v-for="(labelItem, labelIndex) in listItem.label" :key="labelIndex">{{ labelItem }}</text>
						</view>
						<view class="note-desc">
							<text class="color-base-text">#{{ listItem.note_type == 'goods_item' ? '单品介绍' : '掌柜说' }}#</text>
							{{ listItem.note_abstract }}
						</view>
						<view class="notes-img-wrap" :class="{ 'notes-img-wrap-list': listItem.cover_type == 1 }">
							<image v-if="listItem.cover_type == 0" :src="$util.img(listItem.cover_img)" mode="aspectFill" class="notes-item-image"></image>
							<image v-else v-for="(imgItem, imgIndex) in listItem.img" :key="imgIndex" :src="$util.img(imgItem)" mode="aspectFit"
							 class="notes-item-image-li"></image>
						</view>

						<view class="rest-info">
							<view class="time" v-if="listItem.is_show_release_time == 1">{{ $util.timeStampTurnTime(listItem.create_time, 'time') }}</view>
							<view class="read-info">
								<text v-if="listItem.is_show_read_num == 1">
									阅读
									<text>{{ listItem.initial_read_num + listItem.read_num }}</text>
								</text>
								<text v-if="listItem.is_show_dianzan_num == 1" @click.stop="giveLike(listItem.note_id, listIndex)">
									<text class="iconfont iconlikefill color-base-text" v-if="listItem.is_dianzan == 1"></text>
									<text class="iconfont icongz" v-else></text>
									<text>{{ listItem.initial_dianzan_num + listItem.dianzan_num }}</text>
								</text>
							</view>
						</view>
					</view>
				</view>
			</block>
			<loading-cover ref="loadingCover"></loading-cover>
		</mescroll-uni>

		<view class="empty-box" v-if="showEmpty && noteListInfo.length == 0">
			<ns-empty :isIndex="false" text="暂无店铺笔记"></ns-empty>
		</view>
		
		<!-- 底部tabBar -->
		<view class="page-bottom"><diy-bottom-nav></diy-bottom-nav></view>

		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				groupInfo: {
					groupList: [],
					currIdent: 0,
					currId: 0
				},
				noteListInfo: [],
				giveLikeFlag: false,
				showEmpty: false,
				//分享建立上下级所需id
				memberId:0,
				mpShareData:null,//小程序分享数据
			};
		},
		onLoad(option) {
			this.$util.getMemberId().then(resolve => {
				this.memberId = resolve;
			});
			//小程序分享接收source_member
			if (option.source_member){
				uni.setStorageSync('source_member', option.source_member);
			}
			// 小程序扫码进入，接收source_member
			if (option.scene) {
				var sceneParams = decodeURIComponent(option.scene);
				sceneParams = sceneParams.split('&');
				if (sceneParams.length) {
					sceneParams.forEach(item => {
						if (item.indexOf('sku_id') != -1) this.skuId = item.split('-')[1];
						if (item.indexOf('m') != -1) uni.setStorageSync('source_member', item.split('-')[1]);
						if (item.indexOf('is_test') != -1) uni.setStorageSync('is_test', 1);
					});
				}
			}
		},
		onShow() {
			//记录分享关系
			if(uni.getStorageSync('token') && uni.getStorageSync('source_member')){
				this.$util.onSourceMember(uni.getStorageSync('source_member'));
			}
			//小程序分享
			// #ifdef MP-WEIXIN
			this.$util.getMpShare().then((res) => { this.mpShareData = res; });
			// #endif
			 
			setTimeout( () => {
				if (this.addonIsExist && !this.addonIsExist.notes) {
					this.$util.showToast({
						title: '商家未开启店铺笔记',
						mask: true,
						duration: 2000
					});
					setTimeout(() => {
						this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
					}, 2000);
					return;
				}
			}, 1000);
			this.getGroup();
			if (this.$refs.mescroll) {
				this.$refs.mescroll.refresh();
			}
		},
		//分享给好友
		onShareAppMessage() {
			return this.mpShareData.appMessage;
		},
		//分享到朋友圈
		onShareTimeline() {
			return this.mpShareData.timeLine;
		},
		methods: {
			/* 获取分组数据 */
			getGroup() {
				this.showEmpty = false;
				this.$api.sendRequest({
					url: '/notes/api/notes/group',
					success: res => {
						this.showEmpty = true;
						if (res.code == 0) {
							if (res.data.length != 0) {
								this.groupInfo.groupList = res.data;
								this.groupInfo.currId = res.data[0].group_id;
							}
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			/* 切换标签页 */
			tabCut(groupId, index) {
				this.groupInfo.currIdent = index;
				this.groupInfo.currId = groupId;

				this.$refs.mescroll.refresh();
			 	if(this.$refs.loadingCover) this.$refs.loadingCover.show();
			},
			/* 获取l列表信息 */
			getNotesList(mescroll) {
				this.showEmpty = false;
				this.$api.sendRequest({
					url: '/notes/api/notes/lists',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						group_id: this.groupInfo.currId
					},
					success: res => {
						this.showEmpty = true;
						let newArr = [];
						if (res.code == 0) {
							newArr = res.data.list;
						} else {
							this.$util.showToast({
								title: res.message
							});
						}

						mescroll.endSuccess(newArr.length);
						if (mescroll.num == 1) this.noteListInfo = []; //如果是第一页需手动制空列表
						this.noteListInfo = this.noteListInfo.concat(newArr); //追加新数据
						this.noteListInfo.forEach(function(item, index) {
							item.img = item.cover_img.split(',');
							item.label = item.goods_highlights.split(',');
						});

						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			/* 跳转详情 */
			noteDetail(noteId) {
				this.$util.redirectTo('/pages_tool/store_notes/note_detail', {
					note_id: noteId
				});
			},
			/* 点赞 */
			giveLike(noteId, index) {
				if (!uni.getStorageSync('token')) {
					this.$refs.login.open('/pages_tool/store_notes/note_list');
					return;
				}

				if (this.giveLikeFlag) return false;
				this.giveLikeFlag = true;

				var url = this.noteListInfo[index].is_dianzan == 1 ? '/notes/api/record/delete' : '/notes/api/record/add';
				this.$api.sendRequest({
					url: url,
					data: {
						note_id: noteId
					},
					success: res => {
						this.giveLikeFlag = false;
						if (res.code == 0 && res.data > 0) {
							if (this.noteType != 'goods_item')
								this.noteListInfo[index].dianzan_num =
								this.noteListInfo[index].is_dianzan == 1 ? this.noteListInfo[index].dianzan_num - 1 : this.noteListInfo[
									index].dianzan_num + 1;
							else {
								this.noteListInfo[index].dianzan_num =
									this.noteListInfo[index].is_dianzan == 1 ? this.noteListInfo[index].dianzan_num - 1 : this.noteListInfo[
										index].dianzan_num + 1;
							}
							this.noteListInfo[index].is_dianzan = this.noteListInfo[index].is_dianzan == 1 ? 0 : 1;
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	.notes-nav {
		overflow: hidden;
		padding: 0 20rpx;
		background-color: #fff;

		.notes-list {
			display: flex;
			align-items: center;
			width: 100%;
			height: 90rpx;
			white-space: nowrap;

			.notes-item {
				&.active {
					border-bottom: 4rpx solid;
				}

				display: inline-block;
				margin: 0 20rpx;
				height: 86rpx;
				text-align: center;
				line-height: 90rpx;
			}
		}
	}

	.notes-content {
		height: 100%;
		width: 100%;
	}

	.note-item {
		margin: 30rpx 20rpx;
		padding: 20rpx;
		background-color: #fff;
		border-radius: 6rpx;
		overflow: hidden;
		position: relative;

		.note-title {
			font-size: 30rpx;
			font-weight: 600;
			line-height: 44rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}

		.notes-highlights-list {
			text {
				display: inline-block;
				color: #ffffff;
				font-size: 24rpx;
				line-height: 36rpx;
				padding: 0 10rpx;
				border-radius: 4rpx;
				margin: 0 5rpx;
			}
		}

		.note-desc {
			margin: 4rpx 0 8rpx;
			line-height: 40rpx;
			overflow: hidden;

			text {
				float: left;
				margin-right: 16rpx;
			}
		}

		.notes-img-wrap {
			position: relative;
			height: 300rpx;

			.notes-item-image {
				width: 100%;
				height: 300rpx;
				object-fit: cover;
			}

		}

		.notes-img-wrap-list {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			height: auto;

			image {
				width: calc((100% - 40rpx) / 3);
				height: 210rpx;
				margin-top: 20rpx;

				&:nth-child(-n + 3) {
					margin-top: 0;
				}
			}

			&:after {
				content: '';
				width: calc((100% - 40rpx) / 3);
			}
		}

		.note-img-one {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 420rpx;

			image {
				width: 100%;
				height: 420rpx;
			}
		}

		.note-img-more {
			width: 100%;
			white-space: nowrap;

			.more-item {
				~.more-item {
					margin-left: 16rpx;
				}

				overflow: hidden;
				display: inline-block;
				width: 200rpx;
				height: 200rpx;
				text-align: center;
				line-height: 200rpx;
				border-radius: 10rpx;

				image {
					width: 200rpx;
					height: 200rpx;
				}
			}
		}

		.notes-img-wrap {
			position: relative;
			height: 300rpx;

			.notes-item-image {
				width: 100%;
				height: 300rpx;
				object-fit: cover;
			}

		}

		.notes-img-wrap-list {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			height: auto;

			image {
				width: calc((100% - 40rpx) / 3);
				height: 210rpx;
				margin-top: 20rpx;

				&:nth-child(-n + 3) {
					margin-top: 0;
				}
			}

			&:after {
				content: '';
				width: calc((100% - 40rpx) / 3);
			}
		}

		.rest-info {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 20rpx;

			.time,
			.read-info {
				color: #b6b6b6;
				font-size: 24rpx;
			}

			text {
				margin-left: 10rpx;
			}

			.read-info>text {
				margin-left: 30rpx;
			}
		}
	}

	.empty-box {
		margin-top: 200rpx;
	}
</style>
