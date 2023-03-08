<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="goods-select">
		<view class="top">
			共<text class="color-base-text">{{refund_data.length}}</text>件商品
		</view>
		
		<view class="body">
			<view class="item" v-for="(item,index) in refund_data" :key="index">
				<view @click="single(index)">
					<text v-if="item.judge" class="iconfont iconyuan_checked color-base-text"></text>
					<text v-else class="iconfont iconyuan_checkbox"></text>
				</view>
				<image :src="$util.img(item.sku_image)" @error="error(index)"></image>
				<view class="title">
					<text>{{item.sku_name}}</text>
				</view>
			</view>
		</view>
		
		<view class="bottom-all">
			<view @click="all">
				<text v-if="judge" class="iconfont iconyuan_checked color-base-text"></text>
				<text v-else class="iconfont iconyuan_checkbox"></text>
			</view>
			
			<view v-if="nexthover" class="next" @click="next">下一步</view>
			<view v-else class="next nexthover">请选择商品</view>
		</view>
		
		<!-- <loading-cover ref="loadingCover"></loading-cover> -->
	</view>
</template>

<script>
	export default{
		data(){
			return{
				refund_type:1, 
				refund_data:[],
				judge:true,
				order_goods_id:[],
				nexthover:true
			}
		},
		
		onLoad(option){
			if(option.refund_type){
				this.refund_type = option.refund_type;
				this.getGoodsInfo()
			} else{
				uni.showToast({
					title:'未查找到订单信息',
					icon:'none'
				})
				setTimeout(()=>{
					this.$util.redirectTo('/pages/order/list');
				},1000)
			}
		},
		
		methods:{
			/**
			 * 处理商品选中数据
			 */
			getGoodsInfo(){
				uni.getStorage({
					key:'refund_goods_data',
					success:res=>{
						let refund_data = JSON.parse(res.data);
						this.refund_data = [];
						refund_data.forEach(item=>{
							if(item.refund_status == 0){
								item.judge = true;
								this.refund_data.push(item);
							}
						})
					}
				})
			},
			/**
			 *单选事件 
			 */
			single(key){
				this.refund_data[key].judge = !this.refund_data[key].judge;
				let allJudge = true;
				
				this.refund_data.forEach((item)=>{
					if(!item.judge){
						allJudge = false;
					}
				})
				this.judge = allJudge;
				
				this.getOrderIdInfo();
				this.$forceUpdate()
			},
			/**
			 * 全选选择
			 */
			all(){
				
				this.judge = !this.judge;
				this.refund_data.map(item=>{
					item.judge = this.judge;
					return item;
				})
				
				this.getOrderIdInfo();
				this.$forceUpdate()
			},
			
			/**
			 * 获取选择的order_goods_id
			 */
			getOrderIdInfo(){
				this.order_goods_id = [];
				this.refund_data.forEach(item=>{
					if(item.judge){
						this.order_goods_id.push(item.order_goods_id)
					}
				})
				if(this.order_goods_id.length == 0){
					this.nexthover = false; 
				}else{
					this.nexthover = true; 
				}
				
				this.$forceUpdate();
			},
			/**
			 * 跳转退款界面
			 */
			next(){
				if(this.order_goods_id.length == 0){
					this.getOrderIdInfo();
				}
				
				this.$util.redirectTo('/pages_tool/order/refund_batch', { order_goods_id: this.order_goods_id.join(), refund_type:this.refund_type });
			},
			/**
			 * 默认图片处理
			 */
			error(index){
				this.refund_data[index].sku_image = this.$util.getDefaultImage().goods
				this.$forceUpdate();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goods-select{
		.top{
			padding: 20rpx 30rpx;
			box-sizing: border-box;
			font-size: 28rpx;
			background: #FFFFFF;
			text{
				font-size: 30rpx;
				margin: 0 10rpx;
				font-weight: bold;
			}
		}
		.iconfont{
			font-size: 40rpx;
		}
		.body{
			margin: 30rpx;
			border-radius: 10rpx;
			background: #FFFFFF;
			padding: 30rpx 0 0;
			.item{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 30rpx 30rpx;

				image{
					width: 180rpx;
					height: 180rpx;
					border-radius: 10rpx;
				}
				.title{
					width: 368rpx;
					height:180rpx;
					font-size: 28rpx;
					text{
						text-overflow: -o-ellipsis-lastline;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 3;
						line-clamp: 3;
						-webkit-box-orient: vertical;
					}
				}
			}
		}
		.bottom-all{
			padding-left: 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background: #FFFFFF;
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			box-sizing: border-box;
			.next{
				padding: 16rpx 80rpx;
				color: #FFFFFF;
				background: #ff4544;
			}
			.nexthover{
				background: #e7dcdc !important;
			}
		}
	}
	
</style>
