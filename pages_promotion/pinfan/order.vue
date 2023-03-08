<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="body">
		<!-- 顶部导航 -->
		<!-- <view class="top">
			<i class="iconfont iconclose" @click="delect"></i>
			<view class="content-text">拼单详情</view>
			<i class="iconfont iconcaidan"></i>
		</view> -->
		
		<!-- 中间详情 -->
		<view class="center-content" @click="toPintuanDetail(groupDetail.pintuan_id)">
			<view class="center-left">
				<image :src="$util.img(groupDetail.sku_image)" mode=""></image>
			</view>
			<view class="center-right">
				<view class="center-right-top center-right-font">{{groupDetail.sku_name}}</view>
				<view class="center-right-center">{{groupDetail.pintuan_num}}人团，已团{{goodsSkuDetail.group_num}}次</view>
				<view class="center-right-bottom">
					<view class="center-right-bottom-money center-right-fontnew" :title="groupDetail.pintuan_price">
						￥{{groupDetail.pintuan_price}}
					</view>
				</view>
				<view class="center-right-bottom-time">
					距结束：<uni-count-down :day="groupDetail.timeMachine.d" :hour="groupDetail.timeMachine.h" :minute="groupDetail.timeMachine.i" :second="groupDetail.timeMachine.s" backgroundColorClass="color-base-bg" splitorColorClass="color-base-text" borderColor="#fff" color="#fff" />
				</view>
			</view>
		</view>
		<!-- 底部拼单 -->
		<view class="die">
			<view class="die-title" v-if="groupDetail.timeMachine.d>0||groupDetail.timeMachine.h>0||groupDetail.timeMachine.i>0||groupDetail.timeMachine.s>0">等待参团，仅剩{{kill}}个名额</view>
			<view class="die-title" v-else>活动已结束</view>
			<view class="die-content">
				<view class="die-content-image" v-for="(item,index) in groupDetail.member_list" :key="index">
					<image :src="item.member_img ? $util.img(item.member_img) : $util.img('public/uniapp/common/default_headimg.png')" mode=""></image>
				</view>
				<view class="die-content-image" v-for="itm in kill">
					<!-- <image :src="$util.img('public/uniapp/default_headimg.png')" mode=""></image> -->
					<image :src=" $util.img('public/uniapp/common/spelling_who.png')" mode="aspectFill"></image>
				</view>
			</view>
			<view class="die-bottom-btn" @click="delegation" v-if="groupDetail.timeMachine.d>0||groupDetail.timeMachine.h>0||groupDetail.timeMachine.i>0||groupDetail.timeMachine.s>0">去参团</view>
		</view>
		
		<!-- 中间弹窗 -->
		<uni-popup ref="pintuanPopup" type="center" class="pintuan-popup-layer">
			<view class="layer">
				<view class="popup-center">
					<view class="popup-center-top">参与的拼单</view>
					<view class="popup-center-text">
						仅剩<text>{{kill}}</text>个名额,
						<uni-count-down :day="groupDetail.timeMachine.d" :hour="groupDetail.timeMachine.h" :minute="groupDetail.timeMachine.i"
						 :second="groupDetail.timeMachine.s" backgroundColorClass="color-base-bg" splitorColorClass="color-base-text"
						 borderColor="#fff" color="#fff" />后结束
					</view>
					<view class="popup-center-center">
						<view class="popup-center-center-image" v-for="(item,index) in groupDetail.member_list" :key="index">
							<image :src="item.member_img ? $util.img(item.member_img) : $util.img('public/uniapp/common/default_headimg.png')" mode=""></image>
						</view>
						<view class="popup-center-center-image" v-for="itm in kill">
							<image :src=" $util.img('public/uniapp/common/spelling_who.png')" mode="aspectFill"></image>
							<!-- <image :src="$util.img('public/uniapp/default_headimg.png')" mode=""></image> -->
						</view>
					</view>
					<view class="popup-center-die" @click="joinPintuan()">参与拼单</view>
					<view class="popup-center-delect" @click="close"><image :src="$util.img('public/uniapp/goods/mask_layer_pintuan_close.png')" /></view>
				</view>
			</view>
		</uni-popup>
			
		<ns-login ref="login"></ns-login>
		<ns-goods-sku ref="goodsSku" @refresh="refreshGoodsSkuDetail" :goods-detail="goodsSkuDetail"></ns-goods-sku>
	</view>
</template>

<script>
	import nsGoodsSku from '@/components/ns-goods-sku/ns-goods-sku.vue';
	import htmlParser from '@/common/js/html-parser';
	export default{
		data(){
			return {
				id:"",//当前拼主的id
				pinfan_id:"",//当前拼团返利id
				groupId: '',
				groupDetail:{
					timeMachine:{
						d:"",
					}
				},//渲染数据用的参数
				kill:0,//还差人数
				goodsSkuDetail:{},//当前拼团商品内容
				whetherCollection:"",//获取用户是否关注
			}
		},
		onLoad(data){
			this.id= data.id;
			this.groupId = data.group_id;
			this.pinfan_id = data.pinfan_id;
			if (data.scene) {
				var sceneParams = decodeURIComponent(data.scene);
				sceneParams = sceneParams.split('&');
				if (sceneParams.length) {
					sceneParams.forEach(item => {
						if (item.indexOf('pinfan') != -1) this.pinfan_id = item.split('-')[1];
						if (item.indexOf('group') != -1) this.groupId = item.split('-')[1];
					});
				}
			}
			this.getGroupDetail()
			this.getGoodsSkuDetail()
		},
		methods:{
			// 初始化渲染数据
			getGroupDetail() {
				this.$api.sendRequest({
					url: '/pinfan/api/pinfangroup/info',
					data: {
						group_id: this.groupId
					},
					success: res => {
						if (res.code == 0) {
							this.groupDetail=res.data;
							this.kill = res.data.pintuan_num - res.data.pintuan_count;
							if (res.data.end_time > res.timestamp) {
								res.data.timeMachine = this.$util.countDown(res.data.end_time - res.timestamp);
							}else{
								res.data.timeMachine = ''
								this.$util.showToast({
									title: "活动已结束",
								});
							}
						}
					},
				});
			},
			toPintuanDetail(id) {
				this.$util.redirectTo('/pages_promotion/pinfan/detail', {
					pinfan_id:id
				});
			},
			// 后退
			delect(){
				this.$util.redirectTo('/pages/index/index', {}, 'reLaunch');
			},
			
			// 去参团，打开弹窗
			delegation(){
				if (!uni.getStorageSync('token')) {
					setTimeout(() => {
						this.$refs.login.open('/pages_promotion/pinfan/order?pinfan_id=' + this.pinfan_id + '&group_id=' + this.groupId + '&id=' + this.id);
					});
					return;
				} 
				if (this.groupDetail.is_self) {
					this.$util.showToast({
						title: "您不能参与自己的团",
					});
					return;
				}
				this.$refs.pintuanPopup.open()
			},
			
			//关闭拼团中间弹窗
			close(){
				this.$refs.pintuanPopup.close()
			},
			
			// 参与拼团
			joinPintuan() {
				this.close();
				this.pintuan(false);
			},
			
			
			/**
			 * 刷新商品详情数据
			 * @param {Object} goodsSkuDetail
			 */
			// 引用组件
			refreshGoodsSkuDetail(goodsSkuDetail) {
				Object.assign(this.goodsSkuDetail, goodsSkuDetail);
				this.goodsSkuDetail.unit = this.goodsSkuDetail.unit || "件";
				// if (this.$refs.goodsPromotion) this.$refs.goodsPromotion.refresh(this.goodsSkuDetail.goods_promotion);
			
				// 解决轮播图数量不一致时，切换到第一个
				if (this.swiperCurrent > this.goodsSkuDetail.sku_images.length) {
					this.swiperAutoplay = true;
					this.swiperCurrent = 1;
					setTimeout(() => {
						this.swiperAutoplay = false;
					}, 40);
				}
			},
			
			async getGoodsSkuDetail() {
				let res = await this.$api.sendRequest({
					url: '/pinfan/api/goods/detail',
					async: false,
					data: {
						pintuan_id: this.pinfan_id
					}
				});
				let data = res.data;
				if (data.goods_sku_detail != null) {
					this.goodsSkuDetail = data.goods_sku_detail;
					this.skuId = this.goodsSkuDetail.sku_id;
					this.goodsSkuDetail.group_id = this.groupId;
			
					//拼团倒计时
					if ((this.goodsSkuDetail.end_time - res.timestamp) > 0) {
						this.goodsSkuDetail.timeMachine = this.$util.countDown(this.goodsSkuDetail.end_time - res.timestamp);
					} else {
						this.$util.showToast({
							title: "活动已结束",
						});
						setTimeout(() => {
							this.$util.redirectTo('/pages/goods/detail', {goods_id: this.goodsSkuDetail.goods_id}, 'redirectTo');
						}, 1000);
					}
			
					//媒体
					if (this.goodsSkuDetail.video_url) this.switchMedia = "video";
			
					if (this.goodsSkuDetail.sku_images) this.goodsSkuDetail.sku_images = this.goodsSkuDetail.sku_images.split(",");
					else this.goodsSkuDetail.sku_images = [];
			
					// 多规格时合并主图
					if (this.goodsSkuDetail.goods_spec_format && this.goodsSkuDetail.goods_image) {
						this.goodsSkuDetail.goods_image = this.goodsSkuDetail.goods_image.split(",");
						this.goodsSkuDetail.sku_images = this.goodsSkuDetail.sku_images.concat(this.goodsSkuDetail.goods_image);
					}
			
					this.goodsSkuDetail.unit = this.goodsSkuDetail.unit || "件";
			
					this.goodsSkuDetail.show_price = (this.goodsSkuDetail.group_id == 0 ? this.goodsSkuDetail.promotion_price : this.goodsSkuDetail
						.pintuan_price);
			
					this.goodsSkuDetail.save_price = (this.goodsSkuDetail.price - this.goodsSkuDetail.show_price) > 0 ? (this.goodsSkuDetail
						.price - this.goodsSkuDetail.show_price).toFixed(2) : 0;
			
					// 当前商品SKU规格
					if (this.goodsSkuDetail.sku_spec_format) this.goodsSkuDetail.sku_spec_format = JSON.parse(this.goodsSkuDetail.sku_spec_format);
			
					// 商品属性
					if (this.goodsSkuDetail.goods_attr_format) {
						let goods_attr_format = JSON.parse(this.goodsSkuDetail.goods_attr_format);
						this.goodsSkuDetail.goods_attr_format = this.$util.unique(goods_attr_format, "attr_id");
						for (var i = 0; i < this.goodsSkuDetail.goods_attr_format.length; i++) {
							for (var j = 0; j < goods_attr_format.length; j++) {
								if (this.goodsSkuDetail.goods_attr_format[i].attr_id == goods_attr_format[j].attr_id && this.goodsSkuDetail.goods_attr_format[
										i].attr_value_id != goods_attr_format[j].attr_value_id) {
									this.goodsSkuDetail.goods_attr_format[i].attr_value_name += "、" + goods_attr_format[j].attr_value_name;
								}
							}
						}
					}
			
					// 商品SKU格式
					if (this.goodsSkuDetail.goods_spec_format) this.goodsSkuDetail.goods_spec_format = JSON.parse(this.goodsSkuDetail.goods_spec_format);
			
					this.$langConfig.title(this.goodsSkuDetail.goods_name);
			
					// 商品详情
					if (this.goodsSkuDetail.goods_content) this.goodsSkuDetail.goods_content = htmlParser(this.goodsSkuDetail.goods_content);
			
					this.contactData = {
						title: this.goodsSkuDetail.sku_name,
						path: '/pages_promotion/pinfan/rebate/detail?pinfan_id=' + this.pinfan_id,
						img: this.$util.img(this.goodsSkuDetail.sku_image, {
							size: 'big'
						})
					}
			
					if (this.token != '') {
						this.getWhetherCollection();
					}
			
					this.setWechatShare();
			
					if (this.$refs.goodsPromotion) this.$refs.goodsPromotion.refresh(this.goodsSkuDetail.goods_promotion);
			
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
			
					// #ifdef MP-WEIXIN
					this.goodsSyncToGoodsCircle();
					// #endif
				} else {
					this.$util.redirectTo('/pages/index/index', {}, 'reLaunch');
				}
			},
			
			//获取用户是否关注
			getWhetherCollection() {
				this.$api.sendRequest({
					url: "/api/goodscollect/iscollect",
					data: {
						goods_id: this.goodsSkuDetail.goods_id
					},
					success: res => {
						this.whetherCollection = res.data;
					}
				});
			},
			
			setWechatShare() {
				// 微信公众号分享
				// #ifdef H5
			// 	if (this.$util.isWeiXin()) {
			// 		this.$api.sendRequest({
			// 			url: '/wechat/api/wechat/share',
			// 			data: {
			// 				url: window.location.href
			// 			},
			// 			success: res => {
			// 				if (res.code == 0) {
			// 					var wxJS = new Weixin();
			// 					wxJS.init(res.data.jssdk_config);
			
			// 					let shareConfig = res.data.share_config,
			// 						url = this.$config.h5Domain + '/pages_promotion/pinfan/rebate/detail?pinfan_id=' + this.pinfan_id +
			// 						'&group_id=' + this.groupId;
			// 					if (this.memberId) url += '&source_member=' + this.memberId;
			
			// 					wxJS.setShareData({
			// 						title: this.goodsSkuDetail.sku_name,
			// 						desc: '拼团价' + '：' + this.$lang('common.currencySymbol') + this.goodsSkuDetail.show_price + '\r\n' +
			// 							shareConfig.goods_param_2 + '\r\n' + '收藏热度：★★★★★',
			// 						link: url,
			// 						imgUrl: this.$util.img(this.goodsSkuDetail.sku_image, {
			// 							size: 'big'
			// 						})
			// 					})
			// 				}
			// 			}
			// 		})
			// 	}
				// #endif
			},
			// 发起拼团
			pintuan(isPromotion = true) {
				if (!uni.getStorageSync('token')) {
					this.$refs.login.open('/pages_promotion/pinfan/detail?pinfan_id=' + this.groupId);
					return;
				}
				if (isPromotion) {
					this.resetPrice();
				}
				this.$refs.goodsSku.show("pinfan", () => {
					this.resetPrice();
					this.getCartCount();
				});
			},
			
			// 重置价格
			resetPrice() {
				this.goodsSkuDetail.group_id = 0;
				this.goodsSkuDetail.show_price = this.goodsSkuDetail.promotion_price;
				this.goodsSkuDetail.save_price = (this.goodsSkuDetail.price - this.goodsSkuDetail.show_price) > 0 ? (this.goodsSkuDetail
					.price - this.goodsSkuDetail.show_price).toFixed(2) : 0;
				this.$forceUpdate();
			},
			
			//获取购物车数量
			getCartCount() {
				this.$store.dispatch('getCartNumber').then((e) => {
					this.cartCount = e;
				});
			},
		}
	}
</script>

<style lang="scss">
	.body{
		padding:20rpx 30rpx;
		box-sizing: border-box;
	}
	.top{
		width:100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		i{
			font-size:38rpx;
		}
		.content-text{
			font-size: 30rpx;
		}
	}
	.center-content{
		width: 100%;
		height:300rpx;
		background:white;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx;
		box-sizing: border-box;
		.center-left{
			width:200rpx;
			height: 200rpx;
			border-radius: 8rpx;
			overflow: hidden;
			image{
				width:100%;
				height: 100%;
			}
		}
		.center-right{
			width:400rpx;
			height:240rpx;
			font-size:26rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.center-right-top{
				font-size:28rpx;
				overflow:hidden; 
				text-overflow:ellipsis;
				display:-webkit-box; 
				-webkit-box-orient:vertical;
				-webkit-line-clamp:2; 
			}
			.center-right-center{
				font-size:26rpx;
				color: #c2c2c2;
			}
			.center-right-bottom{
				font-size:24rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.center-right-bottom-money{
					color:red;
					font-size:28rpx;
					width: 200rpx;
					overflow: hidden;
				}
				.center-right-bottom-time{
					font-size: 24rpx;
					display: flex;
					text{
						width:100rpx;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
			}
		}
	}
	
	
	.die{
		width: 100%;
		// height: 348rpx;
		background:white;
		padding: 30rpx;
		box-sizing: border-box;
		margin-top:30rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		.die-title{
			font-size:26rpx;
			color:#c2c2c2;
			text-align: center;
			margin-bottom: 20rpx;
		}
		.die-content{
			width: 100%;
			height:100rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;
			height: 140rpx;
			overflow: hidden;
			.die-content-image{
				width:100rpx;
				height:100rpx;
				border-radius: 50%;
				border: 1rpx solid rgba(0,0,0,.3);
				margin: 20rpx;
				// margin-bottom: 20rpx;
				image{
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
				position: relative;
			}
			.die-content-image:nth-child(1):before{
				position: absolute;
				top:-10rpx;
				left:-40rpx;
				content:"团长";
				width: 60rpx;
				height: 42rpx;
				background:red;
				border-radius: 6rpx;
				color:white;
				text-align: center;
				line-height: 42rpx;
				font-size: 24rpx;
				z-index: 555;
			}
		}
		.die-bottom-btn{
			width:244rpx;
			height: 76rpx;
			border: 1px solid red;
			background:#f8f8f8;
			text-align: center;
			line-height: 76rpx;
			font-size:30rpx;
			color:red;
			border-radius: $border-radius;
			margin: 40rpx auto 0;
		}
	}
	
	.popup-center{
		width:480rpx;
		height:460rpx;
		border-radius: 16rpx;
		background:white;
		padding:30rpx;
		box-sizing:border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		position: relative;
		.popup-center-top{
			font-size: 32rpx;
			color:#303133;
			font-weight:600;
			text-align: center;
		}
		.popup-center-text{
			font-size:24rpx;
			color:#303133;
			text-align: center;
			/deep/ .color-base-bg {
				padding: 0 !important;
			    background-color:white !important;
			    color: #303132 !important;
				margin:0 !important;
			}
			text{
				font-size:24rpx;
				color:#ff4544;
			}
		}
		.popup-center-center{
			width:100%;
			height:80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			.popup-center-center-image{
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				border: 1rpx solid rgba(0,0,0,.3);
				margin-right:10rpx;
				position: relative;
				image{
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
			.popup-center-center-image:nth-child(1):before{
				position: absolute;
				top:-10;
				left:-40rpx;
				content:"团长";
				width: 50rpx;
				height: 30rpx;
				background:red;
				border-radius: 6rpx;
				color:white;
				text-align: center;
				line-height: 30rpx;
				font-size: 24rpx;
				z-index: 555;
			}
		}
		.popup-center-die{
			width:360rpx;
			height:74rpx;
			background:#ff4544;
			border-radius: $border-radius;
			color:white;
			text-align: center;
			line-height: 74rpx;
			margin: 0 auto;
		}
		.popup-center-delect{
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
			position: absolute;
			top:-20rpx;
			right: -20rpx;
			image{
				width:100%;
				height:100%;
				border-radius: 50%;
			}
		}
	}
	
	// 超出两行...
	.center-right-font{
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	//超出一行...
	.center-right-fontnew{
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}
	
	/deep/ .sku-layer .sku-info{
		height:62vh !important;
	}
</style>
<style scoped>
/deep/ .uni-popup__wrapper-box {
	background: none !important;
	max-width: unset !important;
	max-height: unset !important;
}
</style>