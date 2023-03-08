<template>
	<view class="diy-notes" v-if="dataList.length" :style="{ backgroundColor: value.componentBgColor }">
		<view class="diy-notes-top">
			<view class="notes-title" :style="{ color: value.titleTextColor}">
				{{ value.title }}
			</view>
			<view class="notes-more" @click="toMore()" :style="{ color: value.moreTextColor}">{{ value.more }}</view>
		</view>

		<scroll-view class="diy-notes-box" scroll-x="true" show-scrollbar="true">
			<view class="notes-box-item" v-for="(item, i) in dataList" :key="i" @click="toDetail(item.note_id)" :style="notesItemStyle">
				<view class="notes-item" v-if="item.status == 1">
					<view class="notes-item-con">
						<view class="notes-title">{{ item.note_title }}</view>
						<view class="notes-highlights-list" v-if="value.notesLabel == 1 && item.goods_highlights">
							<text class="color-base-bg" v-for="(labelItem, labelIndex) in item.label" :key="labelIndex">{{ labelItem }}</text>
						</view>
						<view class="notes-intro">
							<text class="notes-label color-base-text">#{{ item.note_type == 'goods_item' ? '单品介绍' : '掌柜说' }}#</text>
							{{ item.note_abstract }}
						</view>
					</view>

					<view class="notes-img-wrap" :class="{ 'notes-img-wrap-list': item.cover_type == 1 }">
						<image v-if="item.cover_type == 0" :src="$util.img(item.img)" @error="imageError(i)" mode="aspectFill" class="notes-item-image"></image>
						<image
							v-else
							v-for="(imgItem, imgIndex) in item.img"
							:key="imgIndex"
							:src="$util.img(imgItem)"
							@error="imageError(i)"
							mode="aspectFit"
							class="notes-item-image-li"
						></image>
					</view>

					<view class="notes-item-con">
						<view class="notes-info" v-if="(value.readNum == 1 && item.is_show_read_num == 1) || (value.uploadTime == 1 && item.is_show_release_time == 1)">
							<view class="notes-num">
								<text v-show="value.uploadTime == 1 && item.is_show_release_time == 1">{{ item.update_time_day }}</text>
							</view>
							<view class="notes-num">
								<text v-show="value.readNum == 1 && item.is_show_read_num == 1">阅读 {{ item.initial_read_num + item.read_num }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
export default {
	name: 'diy-notes',
	props: {
		value: {
			type: Object
		}
	},
	data() {
		return {
			dataList: [],
			giveLikeFlag: false
		};
	},
	created() {
		this.getDataList();
	},
	computed:{
		notesItemStyle(){
			var css = "";
			css += 'background-color:' + this.value.contentBgColor + ';'
			if(this.value.elementAngle == "round"){
				css += 'border-top-left-radius:' + this.value.topElementAroundRadius * 2 + 'rpx;';
				css += 'border-top-right-radius:' + this.value.topElementAroundRadius * 2 + 'rpx;';
				css += 'border-bottom-left-radius:' + this.value.bottomElementAroundRadius * 2 + 'rpx;';
				css += 'border-bottom-right-radius:' + this.value.bottomElementAroundRadius * 2 + 'rpx;';
			}
			return css;
		}
	},
	methods: {
		refresh() {
			this.getDataList();
		},
		getDataList() {
			var data = { page: 1, page_size: this.value.count };

			if (this.value.sources == 'diy') {
				data.page_size = 0;
				data.note_id_arr = this.value.noteId.toString();
			}

			this.$api.sendRequest({
				url: '/notes/api/notes/lists',
				data: data,
				success: res => {
					var data = res.data;
					this.dataList = [];
					if (data.list) {
						for (var i = 0; i < data.list.length; i++) {
							var item = {};
							item = data.list[i];
							if (data.list[i].cover_type == 1) {
								item.img = data.list[i].cover_img.split(',');
							} else {
								item.img = data.list[i].cover_img;
							}

							if (data.list[i].upload_time) {
								item.update_time_day = this.$util.timeStampTurnTime(data.list[i].upload_time).split(' ')[0];
							} else {
								item.update_time_day = this.$util.timeStampTurnTime(data.list[i].create_time).split(' ')[0];
							}

							item.label = data.list[i].goods_highlights.split(',');
							this.dataList.push(item);
						}
					}
				}
			});
		},
		toMore() {
			this.$util.redirectTo('/pages_tool/store_notes/note_list');
		},
		toDetail(id) {
			this.$util.redirectTo('/pages_tool/store_notes/note_detail', {
				note_id: id
			});
		},
		/* 点赞 */
		giveLike(noteId, index) {
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open('/pages/index/index');
				return;
			}

			if (this.giveLikeFlag) return false;
			this.giveLikeFlag = true;

			var url = this.dataList[index].is_dianzan == 1 ? '/notes/api/record/delete' : '/notes/api/record/add';
			this.$api.sendRequest({
				url: url,
				data: {
					note_id: noteId
				},
				success: res => {
					this.giveLikeFlag = false;
					if (res.code == 0 && res.data > 0) {
						if (this.noteType != 'goods_item')
							this.dataList[index].dianzan_num = this.dataList[index].is_dianzan == 1 ? this.dataList[index].dianzan_num - 1 : this.dataList[index].dianzan_num + 1;
						else {
							this.dataList[index].dianzan_num = this.dataList[index].is_dianzan == 1 ? this.dataList[index].dianzan_num - 1 : this.dataList[index].dianzan_num + 1;
						}
						this.dataList[index].is_dianzan = this.dataList[index].is_dianzan == 1 ? 0 : 1;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		},
		imageError(index) {
			this.dataList[index].img = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss">
scroll-view ::-webkit-scrollbar {
	width: 0;
	height: 0;
	background-color: transparent;
	touch-action: none;
}
.diy-notes {
	width: 100%;
	box-sizing: border-box;
}

.diy-notes-top {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-sizing: border-box;

	.notes-title {
		width: 70%;
		font-size: 28rpx;
		font-weight: 600;
	}

	.notes-more {
		font-size: $font-size-tag;
		color: #858585;
	}

	.notes-more::after {
		font-family: 'iconfont';
		content: '\e6a3';
		font-size: $font-size-tag;
		line-height: 1;
		position: relative;
		margin-left: 4rpx;
	}
}

.diy-notes-box {
	width: 100%;
	padding: 30rpx 0 20rpx;
}

.notes-box-item {
	width: calc(100% - 8rpx);
	margin: 0 auto;
	height: 100%;
	margin-bottom: 30rpx;
	border-radius: 10rpx;
	overflow: hidden;
	-moz-box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.02);
	-webkit-box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.02);
	box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.02);

	.notes-item {
		width: 100%;
		height: 100%;
		padding: 20rpx;
		box-sizing: border-box;
	}

	.notes-img-wrap {
		position: relative;
		height: 300rpx;

		.notes-item-image {
			width: 100%;
			height: 300rpx;
			object-fit: cover;
		}

		.notes-label {
			display: inline-block;
			position: absolute;
			left: 20rpx;
			bottom: 20rpx;
			max-width: calc(100vh - 40rpx);
			background-color: #ffffff;
			line-height: 36rpx;
			padding: 0 10rpx 0 4rpx;
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

	.notes-item-con {
		.notes-title {
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

		.notes-intro {
			margin: 4rpx 0 8rpx;
			line-height: 40rpx;
			overflow: hidden;

			text {
				float: left;
				margin-right: 16rpx;
			}
		}

		.notes-info {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 20rpx;

			.notes-num {
				> text {
					display: flex;
					align-items: center;
					font-size: $font-size-tag;
					color: #969799;

					text.iconfont {
						font-size: 26rpx;
						margin-right: 6rpx;
					}
				}
			}
		}
	}
}
</style>
