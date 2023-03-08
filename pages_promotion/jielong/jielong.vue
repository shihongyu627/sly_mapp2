<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="body">
		<view class="topHead" :style="{ backgroundImage : 'url(' + $util.img('public/uniapp/jielong/banyuan.png') + ')' }">
			<view class="jielong-head">
				<view class="countdown" v-if="status==0">
					距活动开始仅剩：
					<uni-count-down
						:day="time.d"
						:hour="time.h"
						:minute="time.i"
						:second="time.s"
						color="#fff"
						splitorColor="#FF4644"
						backgroundColor="#FF4644"
					/>
				</view>
				<view class="countdown" v-else-if="status ==1">
					距活动结束仅剩：
					<uni-count-down
						:day="time.d"
						:hour="time.h"
						:minute="time.i"
						:second="time.s"
						color="#fff"
						splitorColor="#FF4644"
						backgroundColor="#FF4644"
					/>
				</view>
				<view class="countdown" v-else-if="status==2">
					活动已结束
				</view>
				<view class="countdown" v-else-if="status==3">
					活动已关闭
				</view>
			</view>
			
			<!-- 活动介绍 -->
			<view class="move-info">
				<view class="move-title">
					{{jielong_info.jielong_name}}
				</view>
				<view class="move-detail">
					{{jielong_info.desc}}
				</view>
			</view>
		</view>

		
		<!-- 商品内容 -->
		<view class="marketimg-box-con">
			<view class="marketimg-box-con-item">
				<view class="wrap" v-for="(item, index) in jielong_list" :key="index">
					<view class="img-box">
						<image :src="goodsImg(item.goods_image)"></image>
					</view>
					<view class="content">
						<view class="title">{{item.goods_name}}</view>
						<view class="title-text" v-if="item.introduction">{{item.introduction}}</view>
						<view class="title-text" v-else>精品好物，购物多多，等你来抢</view>
						<view class="content-num" v-if="item.member_headimg.length > 0">
							<view class="content-num-image">
								<image :src="$util.img(data) ? $util.img(data) : $util.getDefaultImage().head" mode="" v-for="(data,value) in item.member_headimg.slice(0,3)" :key="value"></image>
							</view>
							<text :class=" item.member_num==2 ? 'text-left' : ''" v-if="item.member_num<3">{{item.member_num}}人已买</text>
							<text class="text-leftThree" v-else>...等{{item.member_num}}人已买</text>
						</view>
						<view class="content-die">
							<text>￥{{item.discount_price}}</text>
							<text>￥{{item.market_price}}</text>
						</view>
						<view class="content-bnutton">
							<view v-if="item.goods_spec_format && status!=2" @click="codeView(item.sku_id)" class="color-base-bg">
								选规格
								<view class="color-base-bg-num" v-if="item.cart_num!=0 && token!=''">
									{{item.cart_num}}
								</view>
							</view>
							<view v-else-if="item.goods_spec_format && status==2" class="color-base-bg color-base-bgHover">选规格</view>
							<block v-else>
								<view class="content-bnutton-body" v-if="data.sku_id==item.sku_id"  v-for="(data,value) in shoplist"  :key="value"  >
									<view class="content-bnutton-sum iconfont iconjianshao content-bnutton-left" @click="singleSkuReduce(item)"></view>
									<view class="content-bnutton-center" >
										{{data.num}} 
									</view>
								</view>
								<view v-if="status!=2" class="content-bnutton-sum iconfont iconadd-fill content-bnutton-right" @click="singleSkuPlus(item)"></view>
								<view v-else class="content-bnutton-sum iconfont iconadd-fill content-bnutton-right content-bnutton-rightNew"></view>
							</block>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="old-buy old-buy-one" v-if="jielong_buy_page.count == 0">
			<view class="head">
				<image :src="$util.img('public/uniapp/jielong/left.png')" mode=""></image>
				<text class="old-buy-head-text">他们都在买</text>
				<image :src="$util.img('public/uniapp/jielong/right.png')" mode=""></image>    
			</view>
			<view class="content">
				<image :src="$util.img('public/uniapp/jielong/wuren.png')" mode=""></image>
			</view>
			<view class="old-buy-die">
				暂无购买记录
			</view>
		</view>

		<view class="old-buy" v-else>
			<view class="head">
				<image :src="$util.img('public/uniapp/jielong/left.png')" mode=""></image>
				<text class="old-buy-head-text">他们都在买</text>
				<image :src="$util.img('public/uniapp/jielong/right.png')" mode=""></image>
			</view>
			<view :class="seeMores ? 'old-buy-head-content' : ''"> 
				<view class="content" v-for="(item, index) in (jielong_buy_page.list || '').slice(0,cutting)" :key="index">
					<view style="display: flex;">
						<view class="old-buy-content">
							<image class="old-buy-content-image" :src="item.headimg=='' ? $util.getDefaultImage().head : $util.img(item.headimg)"></image>
							<view class="old-buy-content-right">
								<view class="old-buy-top">
									<view class="nickname">
										{{item.nickname}}
									</view>
									<view class="buy-goods">
										{{ $util.timeStampTurnTime(item.pay_time)}}
									</view>
								</view>
								<view class="buy-goods">
									购买了{{item.order_name}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="see-more" @click="seeMore" v-if="seeMores && jielong_buy_page.count>5">
				查看更多
			</view>
			<view class="see-more" @click="seeMore" v-else-if="jielong_buy_page.count>5">
				收起更多
			</view>
		</view>
		
		<view :class="zIndex ? 'cart-bottom zIndex' : 'cart-bottom'" >
			<view class="cart-bottom-content">
				<view class="cart-bottom-gouwu" @click="CartPopup">
					<view :class="status==1 && shoplist.length>0 ? 'cart-bottom-gouwu-content iconhover' : 'cart-bottom-gouwu-content'" >
						<view class="cart-bottom-gouwu-content-sum"  v-if="status==1 && shoplist.length>0">{{num}}</view>
						<i class="iconfont iconziyuan1 "></i>
					</view>
				</view>
				<view class="cart-bottom-text" v-if="shoplist.length==0">
					暂未选购商品
				</view>
				<view class="cart-bottom-textTow" v-else>
					<text>￥</text>{{money}}
				</view>
			</view>
			<view class="cart-gouwu-tijiao cart-gouwu-tijiaohover" v-if="status==0">
				活动未开始
			</view>
			<view :class="status==1 && shoplist.length>0 ? 'cart-gouwu-tijiao ' : 'cart-gouwu-tijiao cart-gouwu-tijiaohover'" v-if="status==1" @click="settlement">
				接龙购买
			</view>
			<view class="cart-gouwu-tijiao cart-gouwu-tijiaohover" v-if="status==2">
				活动已结束
			</view>
			<view class="cart-gouwu-tijiao cart-gouwu-tijiaohover" v-if="status==3">
				活动已关闭
			</view>
		</view>
		
        <view class="shoping-fixed">
			<view class="shoping-fixed-content" @click="share">
				<i class="iconfont iconfenxiang4"></i>
				<view class="shoping-fixed-content-text">
					分享
				</view>
			</view>
			<view class="shoping-fixed-content" @click="order">
				<i class="iconfont icondingdan2"></i>
				<view class="shoping-fixed-content-text">
					订单
				</view>
			</view>
		</view>		
		<uni-popup ref="cartPopup" type="bottom" class="cart-popup" style="margin-bottom: 100rpx;">
			<view class="popup-shop">
				<view class="cart-shop-title">
					<view class="cart-shop-title-left">
						已选商品<text>（共{{num}}件）</text>
					</view>
					<view class="cart-shop-title-right">
						<i class="iconfont iconicon7"></i>
						<text @click='delect'>清空</text>
					</view>
				</view>
				<view class="cart-contentOne" v-if="returnShoping.length==0">
					<image :src="$util.img('public/uniapp/jielong/wurenOne.png')" mode=""></image>
				</view>
				<view class="popup-content-shop" v-else>
					<view class="wrap" v-for="(item, index) in returnShoping" :key="index">
						<view class="img-box">
							<image :src="bottomImage(item.sku_image) ? item.sku_image : $util.img(item.sku_image)"></image>
						</view>
						<view class="content">
							<view class="title">{{item.goods_name}}</view>
							<view class="title-text">规格：{{item.sku_name}}</view>
							<view class="content-die">
								<text>{{item.discount_price}}</text>
								<text>￥{{item.market_price}}</text>
							</view>
							<view class="content-bnutton">
								<block>
									<view class="content-bnutton-body" v-if="data.sku_id==item.sku_id"  v-for="(data,value) in shoplist"  :key="value"  >
										<view class="content-bnutton-sum iconfont iconjianshao content-bnutton-left" @click="singleSkuReduce(item)"></view>
										<view class="content-bnutton-center" >
											{{data.num}} 
										</view>
									</view>
									<view class="content-bnutton-sum iconfont iconadd-fill content-bnutton-right" @click="singleSkuPlus(item)"></view>
								</block>
							</view>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="erWeiPopup" type="center" :mask-click="false">
			<view class="popupContent" >
				<view class="popupContent-top" >
					<view class="popupContent-top-title" >
						<view class="popupContent-top-title-left">
							<image :src="switchImage ? specifications.sku_image : $util.img(specifications.sku_image) " mode=""></image>
						</view>
						<view class="popupContent-top-title-right">
							<view class="popupContent-top-title-right-textTop">
								{{specifications.sku_name}}
							</view>
							<view class="popupContent-top-title-right-textBottom" v-if="specifications.stock_show">
								库存{{specifications.stock}}件
							</view>
						</view>
					</view>
					<view class="popupContent-top-center">
						<view class="popupContent-top-center-content" v-for="(items,indexs) in specificationsItem" :key="indexs">
							<view class="popupContent-top-center-content-text">
								{{items.spec_name}}
							</view>
							<view class="popupContent-top-center-content-small" >
								<view @click="switchs(item.sku_id)" :class="specifications.sku_id == item.sku_id ? 'small-content small-content-hover' : 'small-content'" v-for="(item,i) in items.value" :key="i">
									{{item.spec_value_name}}
								</view>
							</view>
						</view>
					</view>
				    <view class="popupContent-top-bottom" >
				    	已选择：<text>{{specifications.title}}</text>
						<view class="popupContent-top-bottom-content">
							<view class="popupContent-top-bottom-content-left">
								<text>￥</text><text>{{specifications.discount_price}}</text>
							</view>
							<view v-if="display" class="popupContent-top-bottom-content-sum">
								<view class="content-bnutton-sum iconfont iconjianshao content-bnutton-left" @click="singleSkuReduce(specifications)"></view>
								<view v-if="item.sku_id==specifications.sku_id" class="content-bnutton-center" v-for="(item,index) in shoplist" :key="index">
									{{item.num}}
								</view>
								<view class="content-bnutton-sum iconfont iconadd-fill content-bnutton-right" @click="singleSkuPlus(specifications)"></view>
							</view>
							<view v-else >
								<button type="primary" class="popupContent-top-bottom-content-right" v-if="specifications.stock && specifications.stock != 0" @click="shoppingCart(specifications)">加入购物车</button>
								<button type="primary" class="popupContent-top-bottom-content-right" disabled="true" v-else>确定</button>
							</view>
							
						</view>
				    </view>
				</view>
				<view class="popupContent-bottom">
					<i class="iconfont iconfont-delect icon2guanbi" @click="close"></i>
				</view>
			</view>
		</uni-popup>

		<uni-popup ref="share" type="center" class="share-img">
			<view class="share-image" >
				<image :src="$util.img(shareImage)" mode=""></image>
			</view>
		</uni-popup>
		
		
		<ns-login ref="login"></ns-login>
		
		<view class="fixed-left" v-if="horseRace">
			<view class="fixed-left-content">
				<image :src="lantern.headimg=='' ? $util.getDefaultImage().head : $util.img(lantern.headimg)"></image>
				<view class="fixed-left-content-text">
					{{lantern.content}}刚刚下单成功
				</view>
			</view>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>



<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	
	export default {
		data() {
			return {
				jielong_id: '',
				jielong_info: {},
				jielong_list: [{
					goods_image:'',
					member_headimg:[]
				}],
				jielong_buy_page: {},
				time: '',
				timer: '',
				//底部选择选择详情
				selsectDetails:[],
				num:"",//件数
				money:0,//金额数
				specifications:{},// 选规格弹窗内容
				specificationsItem:[{
					spec_name:'',
					spec_value_name:'',
					value:[{
							sku_id:'',
							spec_value_name:""
						}]
				}],//规格尺寸、颜色列表
				index:0,//规格尺寸、颜色选择
				zIndex:true,//弹出层层级判断
				addshop:[],// 添加商品
				shoplist:[],//商品列表
				display:false,//加减添加显示判断
				returnShoping:[],// 返回购物车列表
				shareImage:"",//点击分享后返回的图片
				switchImage:false, // 切换弹窗图片拼接判断
				seeMores:true,// 点击查看更多
				status:"",//判断活动是否开始结束等
				cutting:5,//初始显示数量
				horseRace:true,//判断跑马灯是否显示
				//轮播图判断
				lantern:{},//跑马当当前数据
				token:"",//登录
				//分享建立上下级所需id
				memberId:0,
				//分享时详情所用图片
				shareImg:''
			};
		},
		components: {
			uniPopup,
		},
		onLoad(option) {
			this.jielong_id = option.jielong_id;
			if (option.scene) {
				var sceneParams = decodeURIComponent(option.scene);
				sceneParams = sceneParams.split('&');
				if (sceneParams.length) {
					sceneParams.forEach(item => {
						if (item.indexOf('jielong_id') != -1) this.jielong_id = item.split('-')[1];
					});
				}
			}
			
			//获取memberId
			this.$util.getMemberId().then(resolve=>{
				this.memberId = resolve;
			}).catch((reject)=>{
				// #ifdef MP-WEIXIN
				console.log('reject',reject)
				// #endif
			})
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
			
			this.token=uni.getStorageSync('token')
			this.getJielongDetail()
			this.getJielongBuyPage()
			this.shopList()
			this.openCartPopup()
		},
		onshow(){
			//记录分享关系
			if(uni.getStorageSync('token') && uni.getStorageSync('source_member')){
				this.$util.onSourceMember(uni.getStorageSync('source_member'));
			}
		},
		/**
		 * 转发分享
		 */
		onShareAppMessage(res) {
			var title = this.jielong_info.jielong_name;
			let route = this.$util.getCurrentShareRoute(this.memberId);
			var path = route.path;
			return {
				title: title,
				path: path,
				imageUrl: '',
				success: res => {},
				fail: res => {}
			};
		},
		// 分享到微信朋友圈
		onShareTimeline() {
			let route = this.$util.getCurrentShareRoute(this.memberId);
			let query = route.query;
			return {
				title: this.jielong_info.jielong_name,
				query: query,
				imageUrl: ''
			};
		},
		methods: {
			// 登录操作
			toLogin() {
				if(!uni.getStorageSync('token') && this.$refs.login){
					this.$refs.login.open('/pages_promotion/jielong/jielong?jielong_id=' + this.jielong_id);
					return true
				}
			},
			//商品渲染
			getJielongDetail() {
				this.$api.sendRequest({
					url: '/jielong/api/Goods/jielongDetail',
					data: {
						jielong_id: this.jielong_id
					},
					success: res => {
						if (res.code == 0 && res.data && res.data.info) {
							this.status=res.data.info.status
							this.jielong_info = res.data.info
							this.jielong_list = res.data.list
							this.timer = res.timestamp
							if (this.jielong_info.start_time > this.timer) {
								this.time = this.$util.countDown(this.jielong_info.start_time - this.timer)
							} else if (this.jielong_info.start_time < this.timer && this.jielong_info.end_time > this.timer) {
								this.time = this.$util.countDown(this.jielong_info.end_time - this.timer)
							}
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						} else {
							this.$util.showToast({
								title: "未获取到活动信息",
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages/index/index', {}, '');
							}, 1000);
						}
					},
				})
			},
			// 获取购买人员列表
			getJielongBuyPage() {
				this.$api.sendRequest({
					url: '/jielong/api/Goods/jielongBuyPage',
					data: {
						jielong_id: this.jielong_id
					},
					success: res => {
						if (res.code == 0 && res.data) {
							this.jielong_buy_page = res.data
							if(this.jielong_buy_page.list.length>0){
								this.horseRace=true
								this.running()
							}else{
								this.horseRace=false
							}
						}
					},
				})
			},

			goodsImg(imgStr) {
				let imgs = imgStr.split(',');
				return imgs[0] ? this.$util.img(imgs[0], {
					size: 'mid'
				}) : this.$util.getDefaultImage().goods;
			},

			// 获取商品详情
			async getGoodsSkuDetail(skuId) {
				if (!uni.getStorageSync('token')) {
					this.$refs.login.open(this.currentRoute);
					return;
				}
				
				let res = await this.$api.sendRequest({
					url: '/api/goodssku/getInfoForCategory',
					async: false,
					data: {
						sku_id: skuId,
					}
				});
				let data = res.data;
				
				if (data) {
					this.goodsSkuDetail = data;

					if (this.skuId == 0) this.skuId = this.goodsSkuDetail.sku_id;

					this.goodsSkuDetail.unit = this.goodsSkuDetail.unit || "件";

					this.goodsSkuDetail.show_price = this.goodsSkuDetail.discount_price;
					
					
					
					// 当前商品SKU规格
					if (this.goodsSkuDetail.sku_spec_format) this.goodsSkuDetail.sku_spec_format = JSON.parse(this
						.goodsSkuDetail.sku_spec_format);

					// 商品SKU格式
					if (this.goodsSkuDetail.goods_spec_format) this.goodsSkuDetail.goods_spec_format = JSON.parse(this
						.goodsSkuDetail.goods_spec_format);
				} else {
					this.$util.redirectTo('/pages/index/index', {}, 'reLaunch');
				}
			},
			/**
			 * 结算
			 */
			settlement() {
				var data=[];
				if(this.shoplist.length==0) return false
				this.shoplist.forEach(item=>{
					data.push(item.cart_id)
				});
				data=data.toString()
				this.$util.redirectTo('/pages/order/payment');
				uni.setStorage({
					key: 'orderCreateData',
					data: {
						cart_ids:data,
						jielong_id:this.jielong_id
					},
					success: () => {
						this.$util.redirectTo('/pages/order/payment');
					}
				});
			},
			// 打开弹出层
			CartPopup(){
				if(this.toLogin()){
					this.toLogin()
					return false
				} 
				this.$refs.cartPopup.open();
				this.openCartPopup()
			},
			// 获取购物车列表
			openCartPopup() {
				this.$api.sendRequest({
					url: '/jielong/api/cart/goodsLists',
					data: {
						jielong_id: this.jielong_id,
					},
					success: res => {
						this.num=0
						this.money=0
						let data=res.data;

						if(data.length > 0){
							data.forEach(item=>{
								this.num=parseInt(item.num)+this.num
								this.money=(parseInt(item.price)*parseInt(item.num))+this.money
							})
						}

						this.returnShoping=data
					},
				})
			},
			
			// 关闭优惠券弹出层
			closeCartPopup() {
				this.$refs.cartPopup.close();
			},
			
			// 减
			singleSkuReduce(item){
				var sku_id=item.sku_id;
				this.shoplist.forEach(item=>{
					if(sku_id==item.sku_id && item.num>1){
						var num=--item.num
						this.edit(item.cart_id,num);
					}else if(sku_id==item.sku_id && item.num===1){
						this.delectItem(item.cart_id)
					}
				})
				this.getJielongDetail()
			},
			
			//加
			singleSkuPlus(item){
				if(!uni.getStorageSync('token')){
					this.toLogin()
					return false
				}
				
				if(this.status==0){
					uni.showToast({
						title:'活动未开始',
						icon:"none"
					})
					return false
				}
				var sku_id=item.sku_id;
				var judge=true;
				if(this.shoplist.length==0){
					this.addShop(sku_id)
				}else{
					this.shoplist.forEach(item=>{
						if(sku_id===item.sku_id){
							var num=++item.num
							this.edit(item.cart_id,num);
							judge=false
						}
					})
					if(judge){
						this.addShop(sku_id)
					}
				}
				this.getJielongDetail()
			},
			
			// 清空
			delect(){
				if(!uni.getStorageSync('token')){
					this.toLogin()
					return false
				}
				this.$api.sendRequest({
					url: '/jielong/api/cart/clear',
					data: {
						jielong_id: this.jielong_id,
					},
					success: res => {
						this.shopList();
						this.openCartPopup();
						this.getJielongDetail()
					},
				})
			},
			
			// 打开选购弹窗
			codeView(value){
				if(!uni.getStorageSync('token')){
					this.toLogin()
					return false
				}
				
				if(this.status==0){
					uni.showToast({
						title:'活动未开始',
						icon:"none"
					})
					return false
				}
				this.switchs(value)
				this.$refs.erWeiPopup.open()
				this.zIndex=false;//控制弹窗与底部结算层级
				this.display=false;
				var _that=this
				if(this.shoplist.length==0){
					this.display=false;
				}else{
					this.shoplist.forEach(item=>{// 购物车后内部加入、或加减显示判断
						if(value==item.sku_id){
							this.display=true
						}
					})
				}
			},
			// 关闭选购弹窗 
			close(){
				this.$refs.erWeiPopup.close()
				this.zIndex=true;
			},
			// 规格切换
			switchs(sku){
				this.title=""
				this.shopList();
				this.openCartPopup();
				this.$api.sendRequest({
					url: '/api/goodssku/getInfoForCategory',
					data: {
						sku_id: sku,
					},
					success:(res)=>{
						this.specifications=res.data;
						this.specificationsItem=JSON.parse(this.specifications.goods_spec_format)
						this.specificationsItem.forEach((items)=>{
							items.value.forEach(item=>{
								if(item.sku_id==sku){
									this.title=this.title+item.spec_value_name+'/'
								}
							})
						})
						this.specifications.title=this.title
						this.switchImage=this.specifications.sku_image.includes('http')
					},
				});
				this.display=false
				this.shoplist.forEach(item=>{// 购物车后内部加入、或加减显示判断
					if(sku==item.sku_id){
						this.display=true
					}
				})
			},
			
			// 获取已选商品列表
			shopList(){
				this.toLogin()
				this.$api.sendRequest({
					url: '/jielong/api/cart/lists',
					data: {
						jielong_id: this.jielong_id,
					},
					success: res => {
						this.shoplist=res.data;
						
					},
				})
			},
			// 添加购物车商品
			addShop(sku){
				this.$api.sendRequest({
					url: '/jielong/api/cart/add',
					data: {
						jielong_id: this.jielong_id,
						num:1,
						sku_id:sku,
					},
					success: res => {
						this.addshop=res.data;
						this.shopList();
						this.openCartPopup();
						this.getJielongDetail();
						if(res.code == -1) {
							this.$util.showToast({
								title: res.message
							});
							return
						}
					},
				})
			},
			// 编辑购物车
			edit(cret,num){
				this.$api.sendRequest({
					url: '/jielong/api/cart/edit',
					data: {
						jielong_id: this.jielong_id,
						num:num,
						cart_id:cret,
					},
					success: res => {
						this.shopList();
						this.openCartPopup();
						this.getJielongDetail()
						if(res.code == -1) {
							this.$util.showToast({
								title: res.message
							});
							return
						}
					},
				})
			},
			
			// 删除购物车
			delectItem(cret){
				this.$api.sendRequest({
					url: '/jielong/api/cart/delete',
					data: {
						num:0,
						cart_id:cret,
					},
					success: res => {
						this.shopList();
						this.openCartPopup();
						this.getJielongDetail()
					},
				})
				this.display=false
			},
			// 弹窗添加购物车事件
			shoppingCart(value){
				this.display=true;
				let sku=value.sku_id;
				this.addShop(sku)
				this.openCartPopup();
				this.getJielongDetail()
			},
			
			// 分享
			share(){
				if(!uni.getStorageSync('token')){
					this.toLogin()
					return false
				}
				this.shareImage=""
				uni.showLoading({  
				    title: '加载中'
				});
				this.$refs.share.open()
				let id=JSON.stringify({
					jielong_id:this.jielong_id
				})
				this.$api.sendRequest({
					url: '/jielong/api/goods/poster',
					data: {
						page:'/pages_promotion/jielong/jielong',
						qrcode_param:id,
					},
					success: res => {
						uni.hideLoading();  
						this.shareImage=res.data.poster_path;
					},
				})
			},
			// 订单   
			order(){
				this.$util.redirectTo('/pages/order/list');
			},
			// 底部图片显示判断
			bottomImage(item){
				if(item.includes('http')){
					return true
				}else{
					return false
				}
			},
			//判断查看更多
			seeMore(){
				this.seeMores=!this.seeMores
				if(this.seeMores){
					this.cutting=5
				}else{
					this.cutting=this.jielong_buy_page.count
				}
			},
			// 跑马灯效果
			running(){
				var data=JSON.parse(JSON.stringify(this.jielong_buy_page.list)) 
				var i=1;
				var content=data[0].nickname
				content=content.slice(0,1)
				data[0].content=content+'**'
				this.lantern=data[0]
				setInterval(()=>{
					if(i<data.length){
						content=data[i].nickname
						content=content.slice(0,1)
						data[i].content=content+'**'
						this.lantern=data[i]  
						i++
					}else{
						i=0
					}
				},10000)
			},
		}
	}
</script>

<style scoped lang="scss">
	.body {
		background: #f8f8f8;
		padding-bottom: 200rpx;
	}

	*{
		font-family:PingFang-SC-Bold;
	}
	
	.topHead{
		width: 100%;
		min-height: 200rpx;
		background-repeat: no-repeat;
		background-size:100% 240rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
	}
	.jielong-head {
		border-radius: 0px 0px 50rpx 40rpx;
		width:100%;
		margin-bottom: 30rpx;
		.countdown {
			display: flex;
			align-items: center;
			justify-content: center;
			padding-top: 30rpx;
			color: #fff;
		}

		text {
			padding: 6rpx;
			margin: 15rpx;
			border-radius: 6rpx;
			background: #fff;
			color: #ff4544;
		}
	}

	.move-info {
		background: #fff;
		margin: 0 auto;
		padding: 20rpx;
		box-sizing: border-box;
		border-radius: 15rpx;
		width:100%;
		.move-title {
			font-size: 30rpx;
			font-weight: 600;
		}
		.move-detail {
			font-size: 26rpx;
			color: #B3B3B3;
			display: -webkit-box;
			-webkit-line-clamp:3;
			overflow: hidden;
			text-overflow: ellipsis;
			-webkit-box-orient: vertical;
		}
	}
	// 商品列表
	.marketimg-box-con {
		background: #fff;
		margin: 30rpx 30rpx 0 30rpx;
		border-radius: 15rpx;
		
	}
.wrap {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10rpx;
			border-bottom: 1rpx solid #eee;
			padding: 10px;
			box-sizing: border-box;
			.img-box {
				width: 190rpx;
				height: 190rpx;
				flex-shrink: 0;
				margin-right: 18rpx;
				border-radius: 10rpx;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.content {
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				min-height: 190rpx;
				width: 420rpx;
				position: relative;
				.title{
					font-size:28rpx;
					 font-weight:bold;
					 text-overflow: -o-ellipsis-lastline;
					  overflow: hidden;
					  text-overflow: ellipsis;
					  display: -webkit-box;
					  -webkit-line-clamp: 2;
					  line-clamp: 2;
					  -webkit-box-orient: vertical;
					
				}
				.title-text{
					color:#B3B3B3;
					font-size: 24rpx;
					display: -webkit-box;
					-webkit-line-clamp:1;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-box-orient: vertical;
					margin-bottom: 8rpx;
				}
				.content-num{
					display: flex;
					align-items: center;
					font-size: 20rpx;
					.content-num-image{
						max-width: 140rpx;
						height: 48rpx;
						margin-right: 30rpx;
						position:relative;
						image{
							width: 48rpx;
							height: 48rpx;
							border-radius:50%;
						}
						image:nth-child(2){
							position:absolute;
							left:26rpx;
						}
						image:nth-child(3){
							position:absolute;
							left:52rpx;
						}
					}
					.text-left{
						margin-left:20rpx;
					}
					.text-leftThree{
						margin-left:40rpx;
						color:#B3B3B3;
					}
					.content-num-image:after{
						overflow:hidden;
						height:0;
						content:"";
						display:block;
						clear:both;
					}
					text{
						color:#B3B3B3;
					}
					
				}
				.content-die{
					max-width: 260rpx;
					overflow: hidden; //超出的文本隐藏
					text-overflow: ellipsis; //溢出用省略号显示
					white-space: nowrap; //溢出不换行
					font-size: 20rpx;
					text:nth-child(1){
						font-size:24rpx;
						color:red;
						margin-right: 10rpx;
						font-weight: bold;
					}
					text:nth-child(2){
						font-size:20rpx;
						color:#B3B3B3;
						text-decoration: line-through;
					}
				}
				.content-bnutton{
					// width: 160rpx;
					height: 50rpx;
					position: absolute;
					bottom: 0;
					right: 0;
					display: flex;
					align-items: center;
					justify-content: space-around;
					.content-bnutton-sum{
						font-size: 50rpx;
					}
					.content-bnutton-right{
						color:#ff4544;
					}
					.content-bnutton-rightNew{
						color:#B3B3B3;
					}
					.content-bnutton-left{
						color:#ff4544;
					}
					.content-bnutton-center{
						margin: 0 16rpx;
					}
					.color-base-bg{
						width: 160rpx;
						height: 50rpx;
						border-radius: $border-radius;
						color: white;
						text-align: center;
						line-height: 50rpx;
						position: relative;
						.color-base-bg-num{
							width:30rpx;
							height:30rpx;
							background:#ff4544;
							color:white;
							text-align: center;
							line-height: 30rpx;
							position: absolute;
							border-radius:50% ;
							border: 1rpx solid white;
							top:-15rpx;
							right:-15rpx;
							font-size:24rpx;
						}
					}
					.color-base-bgHover{
						background:#B3B3B3 !important;
					}
					.content-bnutton-body{
						display: flex;
						align-items: center;

					}
				}
				.bot {
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					position: relative;

					.price-box {
						display: flex;
						align-items: flex-end;
						line-height: 1;

						.seckill-price {
							font-size: 32rpx;
							margin-right: 10rpx;
							font-weight: bold;
						}

						.original-price {
							font-size: 20rpx;
							color: #B3B3B3;
							text-decoration: line-through;
						}
					}

					.iconfont {
						height: 52rpx;
						margin-left: 20rpx;
						font-size: 40rpx;
					}
				}
			}
		}
	.old-buy {
		background: #fff;
		margin: 30rpx 30rpx 0 30rpx;
		border-radius: 15rpx;
		padding: 20rpx;
		box-sizing: border-box;
		.head {
			text-align: center;
			color: #ff4544;
			font-size: 32rpx;
			font-weight: 600;
			margin-bottom: 20rpx;
			.old-buy-head-text{
				padding-top:4rpx;
			}
		}

		.see-more {
			text-align: center;
			color: #ff4544;
		}

		.content {
			color: #B3B3B3;

			image {
				width: 70rpx;
				height: 70rpx;
			}

			.nickname {
				text-align: left;
				font-weight: 600;
			}

			.buy-goods {
				font-size: 20rpx;
				color: #B3B3B3;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}

	.careBox_more {
		position: absolute;
		right: -80rpx;
		bottom: -50rpx;
		padding: 50rpx;
		line-height: 1;
		box-sizing: border-box;

		text {
			display: inline-block;
			width: 120rpx;
			height: 50rpx;
			line-height: 34rpx;
			text-align: center;
			color: #fff;
			padding: 8rpx;
			border-radius: 44rpx;
			box-sizing: border-box;
			font-size: $font-size-tag;
		}
	}

	.cart-bottom {
		position: fixed;
		bottom: 0;
		left:0;
		width: 100%;
		height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		box-sizing: border-box;
		background:white;
		z-index: 455445;
		box-shadow: 0 0 30rpx rgba(0,0,0,.2);
		.cart-bottom-gouwu{
			width: 100rpx;
			height: 100rpx;
			background: white;
			position: relative;
			padding: 10rpx;
			border-radius:50%;
			box-sizing: border-box;
			.cart-bottom-gouwu-content{
				width: 80%;
				height: 80%;
				background:#c5c5c5;
				border-radius: 50%;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%,-50%);
				.cart-bottom-gouwu-content-sum{
					position: relative;
					width: 40rpx;
					height: 40rpx;
					top:-10rpx;
					right: -54rpx;
					background:#FF4544;
					margin: 0;
					border-radius:50%;
					border:1rpx solid white;
					color:white;
					text-align: center;
					font-size: 24rpx;
					line-height: 40rpx;
				}
				i{
					position: absolute;
					top:50%;
					left:50%;
					transform: translate(-50%,-50%);
					font-size: 38rpx;
					color:white;
				}
			}
		}
		.cart-bottom-text{
			width: 170rpx;
			font-size: 26rpx;
			margin-left:24rpx;
			text-align: left;
		}
		.cart-bottom-textTow{
			font-size: 34rpx;
			margin-right: 232rpx;
			color: red;
			font-weight: bold;
			margin-left: 24rpx;
			text{
				font-size: 26rpx;
			}
		}
		.cart-gouwu-tijiao{
			font-size: 26rpx;
			color: white;
			width: 200rpx;
			height: 60rpx;
			text-align: center;
			line-height: 60rpx;
			background:#ff4544;
			border-radius: 60rpx;
			padding: 5rpx 0;
		}
		.cart-gouwu-tijiaohover{
			background:#B3B3B3;
		}
	}
	
	
	/deep/ .uni-countdown__number{
		color:#ff4544 !important;
		background:white !important;
		border: none;
	}
	/deep/ .uni-countdown__splitor {
    color: white !important;
}
	.popup-shop{
		width: 100%;
		padding:0 30rpx;
		box-sizing: border-box;
		.cart-shop-title{
			width: 100%;
			height:80rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 30rpx;
			.cart-shop-title-left{
				text{
					color:#c5c5c5;
				}
			}
			.cart-shop-title-right{
				display: flex;
				align-items: center;
				text{
					color:#c5c5c5;
					margin-left: 10rpx;
				}
				i{
					font-size:26rpx;
				}
			}
		}
		.cart-content{
			max-height: 600rpx;
			overflow: auto;
			.marketimg-box-con{
				margin: 0;
				height: 100%;
				.marketimg-box-con-item{
					height: 100%;
				}
			}
		}
		.cart-contentOne{
			width: 100%;
			height: 400rpx;
			color:#c5c5c5;
			font-size: 50rpx;
			text-align: center;
			line-height: 400rpx;
			image{
				width: 420rpx;
				height:260rpx;
				margin:50rpx auto;
			}
		}
	}
	
	// 选规格弹窗
.popupContent{
	width:600rpx;
	min-height:900rpx;
	background:none;
	border-radius: 20rpx;
	overflow: hidden;
	.popupContent-top{
		width: 100%;
		height:60vh;
		background:#FFFFFF;
		border-radius:12rpx;
		.popupContent-top-title{
			width: 100%;
			height: 180rpx;
			border-bottom: 1rpx solid #c5c5c5;
			display: flex;
			padding: 30rpx;
			box-sizing: border-box;
			.popupContent-top-title-left{
				width:120rpx;
				height: 120rpx;
				border: 1rpx solid #c5c5c5;
				margin-right: 20rpx;
				border-radius:8rpx;
				overflow:hidden;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.popupContent-top-title-right{
				width: 70%;
				font-size: 28rpx;
				color: #303133;
				.popupContent-top-title-right-textBottom{
					font-size: 24rpx;
					color:#c5c5c5;
					margin-top:20rpx;
				}
				.popupContent-top-title-right-textTop{
					font-size: 28rpx;
					color:#333333;
					display: -webkit-box;
					-webkit-line-clamp:1;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-box-orient: vertical;
				}
			}
		}
		.popupContent-top-center{
			width: 100%;
			height: 440rpx;
			border-bottom: 1rpx solid #c5c5c5;
			padding:0 30rpx;
			box-sizing: border-box;
			overflow: scroll;
			.popupContent-top-center-content{
				.popupContent-top-center-content-text{
					font-weight: 400;
					padding: 10px 0;
					color:#B3B3B3;
					font-size: 24rpx;
				}
				.popupContent-top-center-content-small{
					margin-bottom: 10rpx;
					.small-content{
						text-align: center;
						position: relative;
						display: inline-block;
						border: 1px solid #eeeeee;
						padding: 0 10px;
						margin: 0 5px 10px 0;
						background-color: #fff!important;
						border-radius: 15px;
						font-size:24rpx;
					}
					.small-content-hover{
						border:2rpx solid #ff4544;
						color:#ff4544;
						box-sizing: border-box;
					}
				}
			}
		}
		.popupContent-top-bottom{ 
			width: 100%;
			height: 230rpx;
			padding: 30rpx;
			box-sizing: border-box;
			font-size: 24rpx;
			text{
				font-size: 24rpx;
				color:#c5c5c5;
			}
			text:nth-child(2){
				margin: 0 10rpx;
			}
			.popupContent-top-bottom-content{
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 20rpx;
				.popupContent-top-bottom-content-left{
					padding-top:10rpx;
					text{
						color:#ff4544;
						font-size: 32rpx;
						word-wrap: break-word;
					}
				}
				.popupContent-top-bottom-content-sum{
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 20rpx;
					width: 200rpx;
					height: 60rpx;
					margin:0;
					.content-bnutton-left{
						font-size: 50rpx;
						color:#ff4544;
					}
					.content-bnutton-right{
						font-size: 50rpx;
						color:#ff4544;
					}
				}
				.popupContent-top-bottom-content-right{
					width: 200rpx;
					height: 60rpx;
					border-radius: 60rpx;
					line-height: 60rpx;
					text-align: center;
				}
			}
		}
	}
	
    .popupContent-bottom{
		display: flex;
		align-items: center;
		justify-content: center;
		.iconfont-delect{
			font-size:60rpx;
			margin-top: 20rpx;
			color: white;
		}
	}
}

/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box{
	background:none;
}

	.popupContent .popupContent-top{
		height: auto;
	}
	
	/deep/ .uni-popup{
		z-index: 55455454;
	}
	/deep/ .bottom.safe-area{
		border-top-left-radius:20rpx;
		border-top-right-radius:20rpx;
	}
	
	/deep/ .uni-popup__wrapper.uni-bottom, .uni-popup__wrapper.uni-top{
		border-top-left-radius:20rpx !important;
		border-top-right-radius:20rpx !important;
	}
	
	/deep/ .uni-countdown__splitor{
		color:white;
	}
	
	.zIndex{
		z-index:99;
	}
	
	.shoping-fixed{
		position: fixed;
		width: 90rpx;
		height: 230rpx;
		right: 30rpx;
		bottom:132rpx;
		.shoping-fixed-content{
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
			box-shadow: 0 0 30rpx rgba(0,0,0,.2);
			background:white;
			margin-bottom:20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			i{
				font-size:40rpx;
				color:#ff4544;
				line-height: 28rpx;
				margin-top: 4rpx;
			}
			.shoping-fixed-content-text{
				font-size:20rpx;
				text-align: center;
				line-height: 20rpx;
			}
		}
	}
	.share-image{
		width: 600rpx;
		height: 960rpx;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.old-buy-top{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.old-buy-content{
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		margin-bottom: 20rpx;
		.old-buy-content-right{ 
			min-width:84%;
			max-width:84%;
			padding: 0 10px; 
			box-sizing: border-box;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
		.old-buy-content-image{
			width: 80rpx !important;
			height: 80rpx !important;
			border-radius: 50%;
		}
	}
	
	.old-buy-head-content{
		overflow:hidden;
	}
	
	.old-buy-one{

		.content{
			width: 420rpx;
			height: 260rpx;
			margin: 20rpx auto;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.old-buy-die{
			font-size:30rpx;
			color:#B3B3B3;
			text-align: center;
		}
	}
	.head{
		display: flex;
		align-items:center;
		justify-content: space-evenly;
		image{
			width: 200rpx;
			height:40rpx
		}
	}
	
	.iconhover{
		background:#FF4544 !important;
	}
	
	/deep/ .uni-countdown__number{width:32rpx;text-align:center;}
	
	.fixed-left{
		position:fixed;
		top:120rpx;
		right:10%;
		max-width:650rpx;
		height:60rpx;
		background:rgba(0,0,0,.4);
		color:white;
		border-radius:60rpx;
		padding:0 30rpx;
		box-sizing:border-box;
		overflow: hidden;
		animation:mymove 10s infinite;
	}
	.fixed-left-content{
		display:flex;
		align-items:center;
		height: 60rpx;
		line-height: 60rpx;
		border-radius:30rpx  0 0 30rpx;
		image{
			width:50rpx;
			height:50rpx;
			border-radius: 50%;
		}
		.fixed-left-content-text{
			max-width:360rpx;
			font-size:24rpx;
			color:white;
			display: -webkit-box;
			-webkit-line-clamp:1;
			overflow: hidden;
			text-overflow: ellipsis;
			-webkit-box-orient: vertical;
			margin-left:6rpx;
		}
	}
	
	@keyframes mymove{
		0% {opacity:0;}
		10%{opacity:0;}
		50% {opacity:1;}
		80% {opacity:1;}
		100% {opacity:0;}
	}
	
	.uni-swiper{
		height: 60rpx !important;
	}
	
	.popup-content-shop{
		max-height: 600rpx;
		overflow: auto;
		padding-bottom: 60rpx;
	}
	.cart-bottom-content{
		display: flex;
		align-items: center;
	}
	.share-img .uni-popup__mask{
		z-index: 1500 !important;
	}
</style>
