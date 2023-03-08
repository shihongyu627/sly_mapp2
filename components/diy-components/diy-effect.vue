<template>
	<view class="Effect-wrap" :style="warpCss" v-if="list.length > 0">
		<view :class="['list-wrap', value.style]" :style="warpCss">
			<view :class="['item', value.ornament.type]" v-for="(item, index) in list" :key="index"
				@click="toDetail(item)" :style="itemCss">
				<view class="Effect-img">
					<image class="cover-img" :src="$util.img(item.cover_img)" mode="widthFix" @error="imgError(index)">
					</image>
				</view>
				<view class="info-wrap">
					<!-- <text class="title">{{ item.effect_title }}</text> -->
					<view class="read-wrap">
						<image class="cover-img" :src="$util.loadimg(item.headimg)" mode="widthFix" @error="imgError(index)">
						</image>
						<view class="name">{{ item.name }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 文章
	export default {
		name: 'diy-effect',
		props: {
			value: {
				type: Object
			}
		},
		data() {
			return {
				list: []
			};
		},
		created() {
			console.log(1231231);
			this.getBrandList();
		},
		computed: {
			warpCss() {
				var obj = '';
				obj += 'background-color:' + this.value.componentBgColor + ';';
				if (this.value.componentAngle == 'round') {
					obj += 'border-top-left-radius:' + this.value.topAroundRadius * 2 + 'rpx;';
					obj += 'border-top-right-radius:' + this.value.topAroundRadius * 2 + 'rpx;';
					obj += 'border-bottom-left-radius:' + this.value.bottomAroundRadius * 2 + 'rpx;';
					obj += 'border-bottom-right-radius:' + this.value.bottomAroundRadius * 2 + 'rpx;';
				}
				return obj;
			},
			// 子项样式
			itemCss() {
				var obj = '';
				obj += 'background-color:' + this.value.elementBgColor + ';';
				if (this.value.elementAngle == 'round') {
					obj += 'border-top-left-radius:' + this.value.topElementAroundRadius * 2 + 'rpx;';
					obj += 'border-top-right-radius:' + this.value.topElementAroundRadius * 2 + 'rpx;';
					obj += 'border-bottom-left-radius:' + this.value.bottomElementAroundRadius * 2 + 'rpx;';
					obj += 'border-bottom-right-radius:' + this.value.bottomElementAroundRadius * 2 + 'rpx;';
				}
				if (this.value.ornament.type == 'shadow') {
					obj += 'box-shadow:' + '0 0 10rpx ' + this.value.ornament.color;
				}
				if (this.value.ornament.type == 'stroke') {
					obj += 'border:' + '2rpx solid ' + this.value.ornament.color;
				}
				return obj;
			}
		},
		methods: {
			getBrandList() {
				var data = {
					page: 1,
					page_size: this.value.count
				};
				if (this.value.sources == 'diy') {
					data.page_size = 0;
					data.effect_id_arr = this.value.effectIds.toString();
				}

				this.$api.sendRequest({
					url: '/api/effect/page',
					data: data,
					success: res => {
						if (res.code == 0 && res.data) {
							let data = res.data;
							this.list = data.list;
						}
					}
				});
			},
			toDetail(item) {
				this.$util.redirectTo('/pages_tool/effect/detail', {
					effect_id: item.effect_id
				});
			},
			imgError(index) {
				if (this.list[index]) this.list[index].cover_img = this.$util.getDefaultImage().effect;
			}
		}
	};
</script>

<style lang="scss">
	.Effect-wrap {
		.list-wrap {
			&.style-1 {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				flex-wrap: wrap;
				padding-left: 20rpx;
				padding-right: 20rpx;
				.item {
					width: calc(50% - 10rpx);
					background: #FFFFFF;
					opacity: 1;
					border-radius: 10px;
					margin-bottom: 10px;
					padding-bottom: 10px;
					.Effect-img {
						// height: 182px;
						opacity: 1;
						border-radius: 10px 10px 0px 0px;
						overflow: hidden;
						display: flex;
						align-items: center;
						justify-content: center;
						image {
							width: 100%;
						}
					}

					.info-wrap {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						.title {
							font-size: 14px;
							font-weight: 400;
							color: #231E1E;
							margin-bottom: 10rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							padding-left: 24rpx;
							padding-right: 24rpx;
							box-sizing: border-box;
						}

						.abstract {
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							font-size: $font-size-tag;
						}

						.read-wrap {
							display: flex;
							color: #999ca7;
							align-items: center;
							margin-top: 10rpx;
							line-height: 1;
							padding-left: 24rpx;
							padding-right: 24rpx;
							box-sizing: border-box;
							.cover-img{
								width: 22px;
								height: 22px;
								border-radius: 50%;
								opacity: 1;
								margin-right: 5px;
							}
							.name{
								font-size: 12px;
								font-family: PingFang SC;
								font-weight: 400;
								color: #231E1E;
								opacity: 1;
							}
							text {
								font-size: $font-size-tag;
							}

							.iconfont {
								font-size: 36rpx;
								vertical-align: bottom;
								margin-right: 10rpx;
							}

							.category-icon {
								width: 8rpx;
								height: 8rpx;
								border-radius: 50%;
								background: $base-color;
								margin-right: 10rpx;
							}

							.date {
								margin-left: 20rpx;
							}
						}
					}
				}
			}
		}
	}
</style>
