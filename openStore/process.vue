<template>
	<view class="process-wrap">
		<view class="process-header" v-if="agreement.img">
			<image class="process-header" :src="$util.loadimg(agreement.img)" mode="widthFix"></image>
		</view>
		<!-- 	<view class="process-header">
			<view class="process-title">
				开店流程
			</view>
			<view class="process-text">
				签约前不会产生任何费用
			</view>
		</view> -->
		<view class="menu-box">
			<view class="menu-item" v-for="(item, index) in menuList" :key="index" @click="selectMenu(item)">
				<view class="menu-title" :class="{'menu-titles':activeIndex==item.id}">
					{{item.title}}
				</view>
				<view class="menu-br" v-if="activeIndex==item.id">
				</view>
			</view>
		</view>
	<!-- 	<view class="content-titleBox">
			<view class="content-title">
				{{activeTitle}}
			</view>
			<img class="content-icon"
				src="http://sly.shanliangyou888.com/upload/1/common/images/20220907/20220907051325166254200565291.png"
				mode="aspectFill"></image>
		</view> -->
		<view class="step-box">
			<ns-rich-text :contentArr="$util.getVideo(detail.content)"></ns-rich-text>
		</view>
	</view>
</template>
<script>
	export default {
		components: {},
		data() {
			return {
				activeIndex: 1,
				menuList: [{
					title: '合作流程',
					id: 1
				}, {
					title: '开店条件',
					id: 2
				}, {
					title: '常见问题',
					id: 3
				}, {
					title: '开店优势',
					id: 4
				}],
				activeTitle: '合作流程',
				detail: {},
				agreement: {}
			};
		},
		mixins: [],
		onLoad() {
			this.getListData()
		},
		methods: {
			selectMenu(item) {
				console.log(item);
				this.activeIndex = item.id
				this.activeTitle = item.title
				if (item.id == '1') {
					this.detail = this.configData.document1
				}
				if (item.id == '2') {
					this.detail = this.configData.document2
				}
				if (item.id == '3') {
					this.detail = this.configData.document3
				}
				if (item.id == '4') {
					this.detail = this.configData.document4
				}
			},
			getListData() {
				this.$api.sendRequest({
					url: '/dealer/api/config/storejoininfo',
					data: {},
					success: res => {
						let msg = res.message;
						if (res.code == 0) {
							this.configData = res.data || {}
							this.detail = this.configData.document1
							this.agreement = this.configData.agreement || {}
							console.log(this.agreement);
						} else {
							this.$util.showToast({
								title: msg
							});
						}

					},
					fail: res => {}
				});
			},
		}
	};
</script>

<style scoped>
	.process-wrap {
		/* background: #fff; */
		padding-bottom: 60px;
		box-sizing: border-box;
	}

	.process-header {
		width: 100%;
		/* height: 132px; */
		/* background-image: url('http://sly.shanliangyou888.com/upload/1/common/images/20220907/20220907043943166253998333217.png'); */
		background-size: 100% 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.process-title {
		font-size: 22px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FFFFFF;
		opacity: 1;
		margin-left: 15px;
	}

	.process-text {
		font-size: 13px;
		font-family: PingFang SC;
		font-weight: normal;
		color: #FFFFFF;
		opacity: 0.6;
		margin-left: 15px;
	}

	.menu-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		background: #fff;
	}

	.menu-item {
		height: 40px;
		position: relative;
		width: 90px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.menu-title {
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: normal;
		color: #65666E;
		opacity: 1;
	}

	.menu-titles {
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #1189F4;
		opacity: 1;
	}

	.menu-br {
		position: absolute;
		width: 40px;
		height: 4px;
		background: #1189F4;
		opacity: 1;
		border-radius: 2px;
		bottom: 0;
		align-self: 25px;
	}

	.content-titleBox {
		width: 230px;
		height: 24px;
		position: relative;
		margin: 0 auto;
		margin-top: 30px;
	}

	.content-title {
		width: 230px;
		height: 24px;
		text-align: center;
		font-size: 17px;
		font-weight: 500;
		color: #000000;
		opacity: 1;
		line-height: 24px;
	}

	.content-icon {
		width: 230px;
		height: 24px;
		opacity: 1;
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 10;
	}

	.step-box {
	/* 	width: 710rpx;
		background: #FFFFFF;
		opacity: 1;
		border-radius: 10px;
		margin: 0 auto; */
		margin-top: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		/* padding-left: 24rpx; */
		/* padding-right: 24rpx; */
		box-sizing: border-box;
	}

	.step-item {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: center;
		justify-content: center;
	}

	.step-top {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		width: 100%;
		position: relative;
	}

	.step-left {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 3px;
		height: 100%;
	}

	.step-radius {
		width: 10px;
		height: 10px;
		background: #FFFFFF;
		border: 1px solid #A6ABBA;
		border-radius: 50%;
		opacity: 1;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 10;
	}

	.step-br {
		height: 100%;
		border-left: 1px dashed #707070;
		opacity: 1;
		box-sizing: border-box;
	}

	.step-right {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		border-left: 1px dashed #707070;
		padding-left: 30rpx;
		box-sizing: border-box;
		margin-left: 5px;
		min-height: 28px;
	}

	.step-rights {
		border-left: 1px dashed #fff;
	}

	.step-title {
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #1189F4;
		opacity: 1;
		text-align: center;
		margin-top: 20px;
	}

	.step-desc {
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000000;
		opacity: 1;
		width: 200px;
		line-height: initial;
	}

	.step-time {
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: 500;
		color: #65666E;
		opacity: 1;
		line-height: initial;
	}
</style>
