<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view>
		<view>
			<view class="page">
				<block v-for="(item, index) in goodsList" :key="index">
					<view class="eval-wrap">
						<view class="eval-good">
							<view class="good-box">
								<image class="good_pic" :src="$util.img(item.sku_image, { size: 'mid' })" @error="imageError(index)" mode="widthFix"/>
								<view class="good_info font-size-base">{{ item.sku_name }}</view>
							</view>
						</view>
						<view class="eval-star" v-if="!isEvaluate">
							<view class="star-box">
								<view class="star-title color-base-bg-before">描述相符</view>
								<view class="rate-box"><sx-rate :value="goodsEvalList[index].scores" :index="index" @change="setStar" /></view>
								<view class="grade-li">
									<view
										class="icon iconfont"
										:class="
											goodsEvalList[index].explain_type == '1'
												? 'iconhaoping1 color-base-text'
												: goodsEvalList[index].explain_type == '2'
												? 'iconzhongchaping color-base-text'
												: goodsEvalList[index].explain_type == '3'
												? 'iconzhongchaping'
												: ''
										"
									></view>
									<view class="font-size-tag color-base-text" v-if="goodsEvalList[index].explain_type == '1'">好评</view>
									<view class="font-size-tag color-base-text" v-if="goodsEvalList[index].explain_type == '2'">中评</view>
									<view class="font-size-tag color-base-text" v-if="goodsEvalList[index].explain_type == '3'">差评</view>
								</view>
							</view>
						</view>
					</view>

					<view class="eval-text">
						<view class="text-box">
							<block v-if="!isEvaluate">
								<textarea placeholder="请在此处输入您的评价" v-model="goodsEvalList[index].content" maxlength="200" />
								<text class="maxSize">{{ goodsEvalList[index].content.length }}/200</text>
							</block>
							<block v-else>
								<textarea placeholder="请在此处输入您的追评" v-model="goodsEvalList[index].again_content" maxlength="200" />
								<text class="maxSize">{{ goodsEvalList[index].again_content.length }}/200</text>
							</block>

							<view class="other-info">
								<view class="other-info-box" v-for="(i, t) in imgList[index]" :key="t">
									<image :src="$util.img(i)" mode="aspectFill" @click="preview(i, index)"></image>
									<view class="imgDel" @click="deleteImg(i, index ,t)"><text class=" icon iconfont icondelete"></text></view>
								</view>
								<view class="other-info-box active" @click="addImg(index)" v-if="imgList[index].length < 6 || imgList[index].length == undefined">
									<text class="icon iconfont iconzhaoxiangji"></text>
									<text>{{ imgList[index].length ? 6 - imgList[index].length : 0 }}/6</text>
								</view>
							</view>
						</view>
					</view>
				</block>
			</view>
			<view class="eval-bottom" :class="{ 'safe-area': isIphoneX }">
				<view class="all-election" @click="isAll()" v-if="!isEvaluate">
					<view class="iconfont color-base-text" :class="isAnonymous ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'"></view>
					<text>匿名</text>
				</view>
				<view class="action-btn"><button type="primary" @click="save()">提交</button></view>
			</view>
			<loading-cover ref="loadingCover"></loading-cover>
			
		</view>
	</view>
</template>

<script>
import sxRate from '@/components/sx-rate/index.vue';
import evaluate from './public/js/evaluate.js';
export default {
	components: {
		sxRate
	},
	mixins: [evaluate],
	data() {
		return {
			isIphoneX: false //判断手机是否是iphoneX以上
		};
	},
	onLoad(options) {
		//接收订单号，订单是否是追评等信息
		options.order_id ? (this.orderId = options.order_id) : this.$util.redirectTo('/pages/order/list');
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		if (!uni.getStorageSync('token')) {
			this.$util.redirectTo('/pages_tool/login/login', { back: '/pages_tool/order/evaluate?order_id=' + this.orderId }, 'redirectTo');
		}
		this.getUserInfo();
		this.getEvaluateConfig();
		this.getOrderInfo();
	},
	onShow() {
		//初始化重复点击
		this.flag = false;
		
		
	}
};
</script>

<style lang="scss">
@import './public/css/evaluate.scss'
</style>
