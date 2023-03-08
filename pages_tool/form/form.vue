<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<scroll-view class="page" :scroll-y="true" v-if="detail">
			<view class="form-banner">
				<image :src="$util.img('public/uniapp/form/banner.png')" mode="widthFix"></image>
			</view>
			<view class="system-form-wrap">
				<view class="form-title">请填写表单所需信息</view>
				<ns-form :data="detail.json_data" ref="form"></ns-form>
				<button type="primary" size="mini" class="button" @click="create()">提交</button>
			</view>
		</scroll-view>
		<ns-empty :text="complete  ? '提交成功' : '未获取到表单信息'" v-else></ns-empty>
		
		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id: 0,
			detail: null,
			isRepeat: false,
			complete: false
		};
	},
	onLoad(options) {
		this.id = options.id || 0;
		if (uni.getStorageSync('token')) {
			this.getData();
		} else {
			setTimeout(() => {
				this.$refs.login.open('/pages_tool/form/form?id=' + this.id)
			})
		}
	},
	watch: {
		storeToken: function(nVal, oVal) {
			if (nVal) this.getData();
		}
	},
	methods: {
		getData() {
			this.$api.sendRequest({
				url: '/form/api/form/info',
				data: {
					form_id: this.id
				},
				success: res => {
					if (res.code == 0 && res.data) {
						this.detail = res.data;
					} 
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		create(){
			if (this.$refs.form.verify()) {
				if (this.isRepeat) return;
				this.isRepeat = true;
				
				this.$api.sendRequest({
					url: '/form/api/form/create',
					data: {
						form_id: this.id,
						form_data: JSON.stringify(this.$refs.form.formData)
					},
					success: res => {
						if (res.code == 0) {
							this.$util.showToast({title: '提交成功'})
							setTimeout(() => {
								this.complete = true;
								this.detail = null;
							}, 1500)
						} else {
							this.isRepeat = false;
							this.$util.showToast({title: res.message})
						}
					}
				});
			}
		}
	}
};
</script>

<style lang="scss">
.page {
	width: 100vw;
	height: 100vh;
}
.form-banner {
	width: 100vw;
	line-height: 1;
	image {
		width: 100%;
		line-height: 1;
	}
}
.system-form-wrap {
	background: $color-bg;
	border-radius: 32rpx;
	overflow: hidden;
	margin: 0 0 60rpx 0;
	padding: 0 26rpx;
	transform: translateY(-40rpx);
	
	.form-title {
		line-height: 100rpx;
		padding-top: 20rpx;
	}
	
	.button {
		height: 80rpx;
		line-height: 80rpx !important;
		margin-top: 30rpx!important;
		width: 100%;
		border-radius: 80rpx;
	}
	
	/deep/ .form-wrap {
		background: #fff;
		padding: 30rpx;
		border-radius: 32rpx;
	}
}
</style>
