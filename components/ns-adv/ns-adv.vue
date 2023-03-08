<template>
	<view v-if="advList.length">
		<swiper :indicator-dots="advList.length > 1" indicator-active-color="#ffffff" :autoplay="true" :interval="3000" :duration="1000" v-if="advList.length > 1" class="ns-adv">
			<swiper-item v-for="(item, index) in advList" :key="index" @click="jumppage(item.adv_url)">
				<view class="image-box" :style="{ 'background-color': item.background }"><image :src="$util.img(item.adv_image)"></image></view>
			</swiper-item>
		</swiper>
		<view v-else>
			<image :src="$util.img(advList[0]['adv_image'])" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
export default {
	name: 'ns-advert',
	props: {
		keyword: {
			type: String
		}
	},
	data() {
		return {
			advList: []
		};
	},
	created() {
		this.getAdvList();
	},
	methods: {
		//获取广告位
		getAdvList() {
			var item = {
				adv_image: '',
				adv_url: ''
			};
			this.$api.sendRequest({
				url: '/api/adv/detail',
				data: {
					keyword: this.keyword
				},
				success: res => {
					if (res.code == 0) {
						var data = res.data.adv_list;
						for (var index in data) {
							if (data[index].adv_url) data[index].adv_url = JSON.parse(data[index].adv_url);
						}
						this.advList = res.data.adv_list;
					}
				}
			});
		},
		jumppage(e) {
			this.$util.diyRedirectTo(e);
		}
	}
};
</script>

<style>
.bg {
	width: 100%;
	height: 158rpx;
	background-color: #fff;
	position: fixed;
	left: 0;
	/* #ifdef H5 */
	top: 88rpx;
	/* #endif */
	/* #ifdef MP-WEIXIN */
	top: 0;
	/* #endif */
}
.ns-adv {
	background: #fff;
	height: 300rpx;
	border-radius: 10rpx;
	/* padding: 8rpx 24rpx 24rpx; */
}

.ns-adv .image-box {
	width: 100%;
	height: 100%;
	border-radius: 10rpx;
}

.ns-adv image {
	width: 100%;
	height: 100%;
	border-radius: 10rpx;
}
</style>
