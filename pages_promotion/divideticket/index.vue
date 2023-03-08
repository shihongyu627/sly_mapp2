<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="guafen-box">
		<view v-if="groupInfoList.status!=2">
			<view class="guafen_adv" :style="{ backgroundImage: 'url(' + $util.img('public/uniapp/divideticket/guafen_bg.png') + ')' }">
				<view class="explain">
					<view class="explain-img" @click="toIndex()">
						<image :src="$util.img('public/uniapp/hongbao/index.png')" mode="" class="index-img"></image>
					</view>
					<view class="desc ns-rule-bg" @click="openRulePopup">活动说明</view>
				</view>
				<view class="guafen_content" v-if="groupInfoList == '' && guafenInfo.status == 1" :style="{ 'background-image': 'url(' + $util.img('public/uniapp/divideticket/guafen_success_bg.png') + ')' }">
					<view class="guafen_content_title">点击 [立即领取] 瓜分优惠券</view>
					<view class="guafen_content_num">{{guafenInfo.money}} <text>元</text></view>
					<view class="btn" @click="getLaunch()">立即领取</view>
				</view>
				<view class="guafen_content" v-if="groupInfoList != ''&& guafenInfo.status == 1 &&groupInfoList.status==0||groupInfoList.status==2" :style="{ 'background-image': 'url(' + $util.img('public/uniapp/divideticket/guafen_success_bg.png') + ')' }">
					<view class="guafen_photo" >
						<scroll-view :scroll-y="true" :show-scrollbar="false" v-if="groupInfoList.member_list.length > 0">
							<view class="guafen-lists">
								<view class="guafen_header_img" v-for="(headerItem,headerIndex) in groupInfoList.member_list" :key="headerItem.member_id">
									<image v-if="headerItem.headimg != ''" :src="$util.img(headerItem.headimg)" mode="" @error="headerimageError(headerIndex)"></image>
									<image v-else :src="$util.img('public/uniapp/default_img/head.png')" mode=""></image>
								</view>
								<view class="guafen_header_img" @click="openSharePopup" v-for="(itm,inx) in groupInfoList.num - groupInfoList.member_list.length" :key="inx">
									<text>+</text>
								</view>
							</view>
						</scroll-view>
					</view>
					<view class="guafen_content_title">仅差<text class="guafen_content_color">{{groupInfoList.num - groupInfoList.member_list.length}}</text>人，即可瓜分<text class="guafen_content_color">{{guafenInfo.money}}</text>元优惠券</view>
					<view class="guafen_content_time">
						<image :src="$util.img('public/uniapp/divideticket/bg_left.png')" mode=""></image>
						<text class="seckill-title-name">距离结束</text>
						<uni-count-down class="guafen_content_color" :hour="seckillH" :minute="seckillI" :second="seckillS" borderColor="#fff" color="#FF4544"/>
						<image :src="$util.img('public/uniapp/divideticket/bg_right.png')" mode=""></image>
					</view>
					<view class="btn" @click="openSharePopup">邀请好友一起瓜分</view>
				</view>
				<block v-if="groupInfoList != ''&&groupInfoList.status==1 && g_member_state ==0">
					<view class="guafen_content-one" :style="{ 'background-image': 'url(' + $util.img('public/uniapp/divideticket/guafen_success_bg.png') + ')' }">
						<view class="guafen-success">恭喜你，成功获得优惠券</view>
						<view class="guafen_photo" :class="groupInfoList.member_list.length>4?'guafen-lists':'guafen-lists-two'">
							<scroll-view :scroll-y="true" :show-scrollbar="false" v-if="groupInfoList.member_list.length > 0">
								<view :class="groupInfoList.member_list.length>4?'guafen-lists':'guafen-lists-two'">
									<view class="guafen_header_img" v-for="(headerItem,headerIndex) in groupInfoList.member_list" :key="headerItem.member_id">
										<image v-if="headerItem.headimg != ''" :src="$util.img(headerItem.headimg)" mode="" @error="headerimageError(headerIndex)"></image>
										<image v-else :src="$util.img('public/uniapp/default_img/head.png')" mode=""></image>
									</view>
								</view>
							</scroll-view>
						</view>
						<view class="guafen-coupon">{{money}}<text>元</text></view>
						<view class="guafen-man color-tip font-size-tag" v-if="guafenInfo.is_limit==1">店铺商品满{{guafenInfo.at_least|int}}元可用</view>
						<view class="guafen-time color-tip font-size-tag">有效期：{{$util.timeStampTurnTime(start_time_coupon)|date}} 至 {{$util.timeStampTurnTime(end_time_coupon)|date}}</view>
						<view class="success-btn" @click="toList()">立即使用</view>
						<view class="success-guafen-btn" @click="toGuaFen">瓜分新礼包</view>
					</view>
				</block>
				<block v-if="groupInfoList.status!=1&&guafenInfo.status==-1 || groupInfoList.status!=1&&guafenInfo.status==2">
					{{groupInfoList.status}}
					<view class="guafen_over" :style="{ 'background-image': 'url(' + $util.img('public/uniapp/divideticket/guafen_success_bg.png') + ')' }">
						哎呀，来晚了，活动已结束
					</view>
				</block>
				<block v-if="guafenInfo.status==1 && g_member_state==1">
					<view class="guafen_over" :style="{ 'background-image': 'url(' + $util.img('public/uniapp/divideticket/guafen_success_bg.png') + ')' }">
						来晚了，优惠券已被瓜分完
					</view>
				</block>
				<!-- <block v-if="guafenInfo.status == 2 && groupInfoList.status!=1 && this.memberList.length == guafenInfo.divide_num">
					<view class="guafen-success">恭喜你，成功获得优惠券</view>
					<view class="guafen-coupon">{{money}}<text>元</text></view>
					<view class="guafen-man color-tip font-size-tag" v-if="guafenInfo.is_limit==1">店铺商品满{{guafenInfo.at_least|int}}元可用</view>
					<view class="guafen-time color-tip font-size-tag">有效期：{{$util.timeStampTurnTime(start_time_coupon)|date}} 至 {{$util.timeStampTurnTime(end_time_coupon)|date}}</view>
					<view class="success-btn" @click="toList()">立即使用</view>
				</block> -->
			</view>
			<nsGoodsRecommend ref="goodrecommend" route="guafen"></nsGoodsRecommend>
		</view>
		<view class="detail-box" v-if="groupInfoList.status==2">
			<view class="status-wrap color-base-bg" :style="{ backgroundImage: 'url(' + $util.img('public/uniapp/order/status-wrap-bg.png') + ')' }">
				<view class="order-status-left">
					<view class="status-name">
						<text class="iconfont iconwode-tuangou fail"></text>
						<text class="name font-size-toolbar">组队失败</text>
					</view>
				</view>
			</view>
			<view class="guafen_content">
				<view :class="groupInfoList.member_list.length>4?'guafen_photo':'guafen_photo-two'">
					<scroll-view :scroll-y="true" :show-scrollbar="false" v-if="groupInfoList.member_list.length > 0">
						<view :class="groupInfoList.member_list.length>4?'guafen-lists':'guafen-lists-two'">
							<view class="guafen_header_img" v-for="(headerItem,headerIndex) in groupInfoList.member_list" :key="headerItem.member_id">
								<image v-if="headerItem.headimg != ''" :src="$util.img(headerItem.headimg)" mode="" @error="headerimageError(headerIndex)"></image>
								<image v-else :src="$util.img('public/uniapp/default_img/head.png')" mode=""></image>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="guafen_content_title">集齐{{groupInfoList.num}}人可瓜分红包，还差<text class="color-base-text">{{groupInfoList.num - groupInfoList.member_list.length}}</text>人</view>
			</view>
			<view class="footer-guafen">
				<view class="footer-list">
					<text>活动开始时间</text><text>{{ $util.timeStampTurnTime(guafenInfo.start_time) }}</text>
				</view>
				<view class="footer-list">
					<text>活动结束时间</text><text>{{ $util.timeStampTurnTime(guafenInfo.end_time) }}</text>
				</view>
				<view class="footer-list">
					<text>组队时间</text><text>{{ $util.timeStampTurnTime(groupInfoList.start_time) }}</text>
				</view>
			</view>
		</view>
		<!-- 活动规则 -->
		<uni-popup ref="rulePopup" type="center" :maskClick="false">
			<view class="rule-wrap">
				<view class="content-wrap">
					<image :src="$util.img('public/uniapp/divideticket/explain.png')" mode="" class="rule-head"></image>
					<scroll-view scroll-y="true" class="rule">
						<view>
							<view class="tit">活动时间:</view>
							<view class="text">{{ $util.timeStampTurnTime(guafenInfo.start_time) }} - {{ $util.timeStampTurnTime(guafenInfo.end_time) }}</view>
							<view class="tit">活动说明:</view>
							<view class="text">{{ guafenInfo.remark }}</view>
						</view>
					</scroll-view>
					<text class="iconfont iconroundclose" @click="closeRulePopup"></text>
				</view>
			</view>
		</uni-popup>
		<!-- 分享弹窗 -->
		<view @touchmove.prevent.stop>
			<uni-popup ref="sharePopup" type="bottom" class="share-popup">
				<view>
					<view class="share-title">分享</view>
					<view class="share-content">
						<!-- #ifdef MP -->
						<view class="share-box">
							<button class="share-btn" :plain="true" open-type="share">
								<view class="iconfont iconiconfenxianggeihaoyou"></view>
								<text>分享给好友</text>
							</button>
						</view>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<view class="share-box" v-if="goodsCircle">
							<button class="share-btn" :plain="true" @click="openBusinessView">
								<view class="iconfont iconhaowuquan"></view>
								<text>分享到好物圈</text>
							</button>
						</view>
						<!-- #endif -->
						<view class="share-box" @click="openPosterPopup">
							<button class="share-btn" :plain="true">
								<view class="iconfont iconpengyouquan"></view>
								<text>生成分享海报</text>
							</button>
						</view>
						<!-- #ifdef H5 -->
						<view class="share-box" @click="copyUrl">
							<button class="share-btn" :plain="true">
								<view class="iconfont iconfuzhilianjie"></view>
								<text>复制链接</text>
							</button>
						</view>
						<!-- #endif -->
					</view>
					<view class="share-footer" @click="closeSharePopup"><text>取消分享</text></view>
				</view>
			</uni-popup>
		</view>
		<!-- 海报 -->
		<view @touchmove.prevent.stop>
			<uni-popup ref="posterPopup" type="bottom" class="poster-layer">
				<template v-if="poster != '-1'">
					<view>
						<view class="image-wrap">
							<image :src="$util.img(poster)" :show-menu-by-longpress="true" />
						</view>
						<!-- #ifdef MP || APP-PLUS  -->
						<view class="save" @click="saveGoodsPoster()">保存图片</view>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<view class="save">长按保存图片</view>
						<!-- #endif -->
					</view>
					<view class="close iconfont iconclose" @click="closePosterPopup()"></view>
				</template>
				<view v-else class="msg">{{ posterMsg }}</view>
			</uni-popup>
		</view>
		<!-- 链接 -->
		<view @touchmove.prevent.stop  class="reward-popup">
			<uni-popup ref="linkPopup" type="center" :maskClick="false">
				<view class="warp-popup" v-if="inviterInfo">
					<view class="reward-wrap" :style="{ backgroundImage: 'url(' + $util.img('public/uniapp/divideticket/guafen_popup.png') + ')' }">
						<image :src="$util.img(inviterInfo.headimg ? $util.img(inviterInfo.headimg) : $util.getDefaultImage().head)" @error="inviterInfo.headimg = $util.getDefaultImage().head" class="img-head"></image>
						<view class="nickname font-size-tag">{{inviterInfo.nickname|guolv}}</view>
						<view class="txt">邀请你加入团队</view>
						<view class="qu-btn" @click="join()">加入队伍</view>
					</view>
					<view class="close-btn" @click="closeLinkPopup()">
						<image :src="$util.img('public/uniapp/hongbao/close.png')" mode=""></image>
					</view>
				</view>
				<view class="warp-popup" v-else>
					<view class="reward-wrap" :style="{ backgroundImage: 'url(' + $util.img('public/uniapp/divideticket/guafen_popup.png') + ')' }">
						<image :src="$util.img(groupInfoList.header_headimg ? $util.img(groupInfoList.header_headimg) : $util.getDefaultImage().head)" @error="groupInfoList.header_headimg = $util.getDefaultImage().head" class="img-head"></image>
						<view class="nickname font-size-tag">{{groupInfoList.header_nickname|guolv}}</view>
						<view class="txt">邀请你加入团队</view>
						<view class="qu-btn" @click="join()">加入队伍</view>
						<view class="close-btn" @click="closeLinkPopup()">
							<image :src="$util.img('public/uniapp/hongbao/close.png')" mode=""></image>
						</view>
					</view>
				</view>
			</uni-popup>
		</view>
		<!-- 集齐瓜分 -->
		<view @touchmove.prevent.stop  class="reward-popup-two">
			<uni-popup ref="linkSuccessPopup" type="center" :maskClick="false">
				<view class="reward-wrap-two" :style="{ backgroundImage: 'url(' + $util.img('public/uniapp/divideticket/guafen_success.png') + ')' }">
					<view class="txt-two">{{guafenInfo.money|int}}<text class="element-two">元</text></view>
					<view class="qu-btn-two" @click="closeGetItNow()">立即领取</view>
				</view>
			</uni-popup>
		</view>
		<!-- 喊好友一起瓜分 -->
		<view @touchmove.prevent.stop  class="reward-popup-three">
			<uni-popup ref="friendsPopup" type="center" :maskClick="false">
				<view class="wrap-popup-three">
					<view class="reward-wrap-three" :style="{ backgroundImage: 'url(' + $util.img('public/uniapp/divideticket/guafen_popup.png') + ')' }">
						<view class="join-three">你已加入<text class="nickname-three">{{groupInfoList.header_nickname|guolv}}</text>的瓜分团</view>
						<view class="guafen-three" v-if="groupInfoList.member_list">仅差<text>{{groupInfoList.num - groupInfoList.member_list.length}}</text>人即可瓜分优惠礼包</view>
						<view class="txt-three">{{guafenInfo.money|int}}<text class="element-three">元</text></view>
						<view class="qu-btn-three" @click="goFriend()">喊好友一起瓜分</view>
					</view>
					<view class="close-btn-three" @click="closeFriend()">
						<image :src="$util.img('public/uniapp/hongbao/close.png')" mode=""></image>
					</view>
				</view>
			</uni-popup>
		</view>
		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import nsGoodsRecommend from '@/components/ns-goods-recommend/ns-goods-recommend.vue';
export default {
	components: {
		nsGoodsRecommend,
		uniPopup
	},
	data() {
		return {
			guafenInfo : {},
			groupInfoList: [],
			goodsRecommend: [],
			isShow:false,
			isNow: false,
			seckillH: '',
			seckillI: '',
			seckillS: '',
			seckillInterval: null,
			poster: "-1", //海报
			posterMsg: "", //海报错误信息
			posterHeight: 0,
			couponId: '',
			groupId:'',
			memberInfo:{},
			money:'',
			memberList:[],
			inviterId:'',
			inviterInfo:{},
			is_exit:0,
			g_member_state:0,
			start_time_coupon:'',
			end_time_coupon:'',
			token:null,
			memberId: 0,
		};
	},
	onLoad(option) { 
		//小程序分享接收source_member
		if (option.source_member){
			uni.setStorageSync('source_member', option.source_member);
		}
		// 小程序扫码进入
		if (option.scene) {
			var sceneParams = decodeURIComponent(option.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('cid') != -1) this.couponId = item.split('-')[1];
					if (item.indexOf('id') != -1) this.inviterId = item.split('-')[1];
					if (item.indexOf('gid') != -1) this.groupId = item.split('-')[1]
					if (item.indexOf('m') != -1) uni.setStorageSync('source_member', item.split('-')[1]);
					if (item.indexOf('is_test') != -1) uni.setStorageSync('is_test', 1);
				});
			}
		}else{
			if(option.cid){
				if (option.cid) this.couponId = option.cid;
				if (option.id) this.inviterId = option.id
				if (option.gid) this.groupId = option.gid
			}else{
				if (option.coupon_id) this.couponId = option.coupon_id;
				if (option.inviter_id) this.inviterId = option.inviter_id
				if (option.group_id) this.groupId = option.group_id
			}
		}
	},
	filters:{
		date(date){
			return String(date).slice(0,10);
		},
		guolv(str){
			str = String(str);
		    if(str.length>=6){
				return str.substr(0,1)+'****'+str.substr(str.split('').length-1,str.split('').length);
			}else{
				return str;
			}
		},
		int(val){
			var str = String(val);
			var arr = str.split('.');
			if(parseInt(arr[1])>0){
				return str
			}else{
				return arr[0]
			}
		}
	},
	onShow() {
		this.getInfo();
		this.getMemberInfo()
		this.$util.getMemberId().then(resolve => {
			this.memberId = resolve;
			if (this.guafenInfo.coupon_id) this.setPublicShare();
		});
		
		//记录分享关系
		if(uni.getStorageSync('token') && uni.getStorageSync('source_member')){
			this.$util.onSourceMember(uni.getStorageSync('source_member'));
		}
		
	},
	methods: {
		closeGetItNow(){
			this.$refs.linkSuccessPopup.close();
		},
		// 打开分享弹出层
		openSharePopup() {
			this.$refs.sharePopup.open();
			this.getGoodsPoster();
		},
		// 关闭分享弹出层
		closeSharePopup() {
			this.$refs.sharePopup.close();
		},
		showPrice(data) {
			let price = data.discount_price;
			if (data.member_price && parseFloat(data.member_price) < parseFloat(price)) price = data.member_price;
			return price;
		},
		openRulePopup() {
			this.$refs.rulePopup.open();
		},
		closeRulePopup() {
			this.$refs.rulePopup.close();
		},
		toIndex(){
			this.$util.redirectTo('/pages/index/index', {});
		},
		toList(){
			var arr = this.guafenInfo.goods_ids.split(',').filter(function(arrs){
				return arrs && arrs.trim()
			})
			this.$util.redirectTo('/pages/goods/list', {goods_id_arr:arr});
		},
		toGuaFen(){
			this.$util.redirectTo('/pages_promotion/divideticket/list', {});
		},
		//去商品详情
		toDetail(item){
			this.$util.redirectTo('/pages/goods/detail', {goods_id:item.goods_id});
		},
		closeFriend(){
			this.$refs.friendsPopup.close();
		},
		friend(){
			this.$refs.friendsPopup.open();
		},
		goFriend(){
			this.closeFriend();
			this.openSharePopup()
		},
		GetItNowPopup(){
			this.$refs.linkSuccessPopup.open();
		},
		getInfo() {
			this.$api.sendRequest({
				url: '/divideticket/api/divideticket/info',
				data: {
					coupon_id : this.couponId,
					inviter_id:this.inviterId==''?0:this.inviterId,
					group_id:this.groupId==''?0:this.groupId
				},
				success: res => {
					if (res.code >= 0) {
						this.guafenInfo = res.data
						this.groupInfoList = res.data.group_info
						this.memberList = res.data.group_info.member_list;
						this.groupId = res.data.group_info.group_id;
						if(this.guafenInfo.inviter_info){
							this.inviterInfo = res.data.inviter_info
						}
						if(this.memberList){
							this.memberList.forEach(e=>{
								if(this.guafenInfo.member_id == e.member_id){
									this.money = e.money
									this.start_time_coupon = e.coupon_start_time
									this.end_time_coupon = e.coupon_end_time
								}
							})	
						}
						if(res.data.group_info != '') {
							let time = Date.parse(new Date())/1000; //当前时间
							var obj = this.$util.countDown(this.groupInfoList.end_time - time)
							this.seckillH = obj.h;
							this.seckillI = obj.i;
							this.seckillS = obj.s;
							if(res.data.member_id!=res.data.group_info.header_id){
								var is_exit = 0;
								res.data.group_info.member_list.some(function(i){
									if(i.member_id == res.data.member_id){
										is_exit = is_exit + 1;
									}
								})
								if(res.data.group_info.status == 1 && is_exit == 0){
									this.g_member_state = 1;
								}else{
									if(is_exit == 0){
										is_exit = is_exit + 1;
										this.$refs.linkPopup.open();
									}
								}
							}
						}
						this.setPublicShare()
					}
				}
			});
		},
		join(){
			if (!uni.getStorageSync('token')) {
				setTimeout(() => {
					this.$refs.login.open('/pages_tool/hongbao/index?coupon_id=' + this.couponId +'&group_id='+this.groupId);
				});
			}else{
				this.$api.sendRequest({
					url: '/divideticket/api/divideticket/divideticket',
					data: {
						group_id : this.groupId
					},
					success: res => {
						if(res.code>=0){
							this.$util.showToast({
								title: '加入成功'
							});
							this.closeLinkPopup()
							this.getInfo();
							if(this.groupInfoList.num-this.groupInfoList.member_list.length>1){
								this.friend();
							}
							if(this.groupInfoList.num-this.groupInfoList.member_list.length <= 1){
								this.GetItNowPopup()
							}
						}else{
							this.$util.showToast({
								title: res.message
							});
							this.closeLinkPopup()
						}
						
					}
				});
			}
			
		},
		getLaunch() {
			if (!uni.getStorageSync('token')) {
				setTimeout(() => {
					this.$refs.login.open('/pages_promotion/divideticket/index?coupon_id=' + this.couponId +'&group_id='+this.groupId);
				});
			}else{
				this.$api.sendRequest({
					url: '/divideticket/api/divideticket/launch',
					data: {
						coupon_id : this.couponId
					},
					success: res => {
						if (res.code >= 0) {
							this.groupId = res.data
							this.isShow == true
							this.getInfo();
						}else {
							this.$util.showToast({ title:'优惠券已被瓜分完，下次再来吧' });
						}
						this.$forceUpdate();
					}
				});
			}
		},
		// 打开海报弹出层
		openPosterPopup() {
			this.$util.redirectTo('/pages_promotion/divideticket/poster', {coupon_id:this.couponId,group_id:this.groupId,inviter_id:this.guafenInfo.member_id},);
		},
		//生成海报
		getGoodsPoster() {
			//活动海报信息
			this.$api.sendRequest({
				url: "/divideticket/api/divideticket/poster",
				data: {
					coupon_id: this.couponId,
					group_id:this.groupId==''?0:this.groupId
				},
				success: res => {
					if (res.code == 0) {
						this.poster = res.data.path + "?time=" + new Date().getTime();
					} else {
						this.posterMsg = res.message;
					}
				}
			});
		},
		// 关闭海报弹出层
		closePosterPopup() {
			this.$refs.posterPopup.close();
		},
		closeLinkPopup(){
			this.$refs.linkPopup.close();
		},
		copyUrl() {
			let text = this.$config.h5Domain + '/pages_promotion/divideticket/index';
			if (this.couponId) text += '?coupon_id=' + this.couponId +'&group_id='+this.groupInfoList.group_id+'&inviter_id='+this.guafenInfo.member_id;
			this.$util.copy(text, () => {
				this.closeSharePopup();
			});
		},
		imageError(index){
			this.list[index].goods_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		headerimageError(index) {
			this.list[index].headimg = this.$util.getDefaultImage().head;
			this.$forceUpdate();
		},
		onPageHide() {
			clearInterval(this.seckillInterval);
		},
		getMemberInfo() {
			this.$api.sendRequest({
				url: '/api/member/info',
				success: res => {
					if (res.code == 0) {
						this.memberInfo = res.data;
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		/**
		 * 设置公众号分享
		 */
		setPublicShare(){
			let shareUrl = this.$config.h5Domain + '/pages_promotion/divideticket/index?cid=' + this.guafenInfo.coupon_id + '&gid=' + this.groupInfoList.group_id + '&id=' + this.guafenInfo.member_id;
			if (this.memberId) shareUrl += '&source_member=' + this.memberId;
		
			this.$util.setPublicShare({
				title: '邀请好友瓜分优惠券，一起享优惠', 
				desc: '仅差一人即可瓜分'+ this.guafenInfo.money +'元优惠券',
				link: shareUrl,
				imgUrl: this.$store.state.site_info.logo_square
			})
		}
	},
	/**
	 * 自定义分享内容
	 * @param {Object} res
	 */
	onShareAppMessage(res) {
		var path ='/pages_promotion/divideticket/index?cid=' + this.guafenInfo.coupon_id + '&gid=' + this.groupInfoList.group_id + '&id=' + this.guafenInfo.member_id;
		if (this.memberId) path += '&source_member=' + this.memberId;
		return {
			title: '仅差一人即可瓜分'+ this.guafenInfo.money +'元优惠券',
			path: path,
			imageUrl:'',
			success: res => {},
			fail: res => {}
		};
	},
	
	
	// 分享到微信朋友圈
	// #ifdef MP-WEIXIN
	onShareTimeline() {
		var title = '仅差一人即可瓜分'+ this.guafenInfo.money +'元优惠券';
		let query = query ='?cid=' + this.guafenInfo.coupon_id + '&gid=' + this.groupInfoList.group_id + '&id=' + this.guafenInfo.member_id;
		if (this.memberId) query += '&source_member=' + this.memberId;
		return {
			title: title,
			query: query,
			imageUrl: '',
		};
	},
	// #endif
	
};
</script>
<style lang="scss">
@import '@/common/css/goods_detail.scss';
</style>
<style lang="scss">
.detail-box{
	.status-wrap{
		background-size: 100% 100%;
		background-repeat: no-repeat;
		padding: 60rpx 30rpx;
		height: 100rpx;
		.status-name{
			color: #fff;
			.name{
				margin-left: 14rpx;
			}
			.fail{
				font-size: 40rpx;
			}
		}
	}
	.guafen_content {
		border-radius:$border-radius;
		text-align: center;
		padding:48rpx 0 58rpx;
		margin:-70rpx 30rpx 20rpx;
		background: #fff;
		.guafen_content_title {
			font-size: 30rpx;
			font-weight: bold;
			line-height: 1;
		}
		.guafen_content_num {
			color: #FF4544;
			font-weight: bold;
			font-size: 72rpx;
			margin: 52rpx 0 58rpx;
			line-height: 1;
			text {
				font-size: 30rpx;
				font-weight: bold;
				margin-left: 10rpx;
			}
		}
		.guafen_photo {
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			overflow: hidden;
			margin-bottom: 30rpx;
			.guafen_header_img {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				background: #FFE5E5;
				border: 1px dashed #FF4544;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 44rpx;
				line-height: 44rpx;
				color: #FF4544;
				margin-left: 56rpx;
				margin-bottom: 20px;
				image{
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
				}
			}
		}
		.guafen_photo-two {
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			overflow: hidden;
			margin-bottom: 30rpx;
			.guafen_header_img {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				background: #FFE5E5;
				border: 1px dashed #FF4544;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 44rpx;
				line-height: 44rpx;
				color: #FF4544;
				margin-left: 56rpx;
				margin-bottom: 20px;
				&:first-child{
					margin-left: 0;
				}
				image{
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
				}
			}
		}
		.guafen_content_color {
			color: #FF4544;
		}
		.guafen_content_time {
			font-size: 24rpx;
			margin: 30rpx 0 38rpx; 
			display: flex;
			justify-content: center;
			align-items: center;
			.seckill-title-name {
				margin-right: 11rpx;
			}
			image{
				width: 110rpx;
				height: 2rpx;
				margin: 0 16rpx;
			}
		}
	}
	.footer-guafen{
		border-radius: 10rpx;
		text-align: center;
		padding:30rpx;
		margin:0 30rpx 0;
		background:#fff;
		.footer-list{
			display: flex;
			justify-content: space-between;
			line-height: 2;
		}
	}
}
.guafen_adv {
	background-size: 100%;
	background-repeat: no-repeat;
	margin-bottom: 64rpx;
	padding: 20rpx 30rpx;
	image {
		height: 100%;
		width: 100%;
	}
	.explain{
		display: flex;
		justify-content: space-between;
		.explain-img{
			width: 70rpx;
			height: 70rpx;
			.index-img{
				width: 100% !important;
				height: 100% !important;
			}
		}
		.desc {
			text-align: center;
			color: #fff;
			border-radius: 25rpx;
			font-size: $font-size-tag;
			width: 140rpx;
			height: 50rpx;
			line-height:50rpx;
		}
	}
	.guafen_over{
		height: 100rpx;
		background: linear-gradient(0deg, #FFFFFF, #FFF2EF);
		width: 690rpx;
		border-radius: 10rpx;
		text-align: center;
		display: flex;
		align-items: center;
		text-align: center;
		justify-content: center;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		padding:50rpx 0 56rpx;
		margin:220rpx auto 0;
	}
	.guafen_content {
		background: linear-gradient(0deg, #FFFFFF, #FFF2EF);
		width:690rpx;
		border-radius: 10rpx;
		text-align: center;
		padding:50rpx 0 56rpx;
		margin:200rpx auto 0;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		.guafen_content_title {
			font-size: 30rpx;
			font-weight: bold;
			margin:36rpx 0 28rpx;
			line-height: 1;
		}
		.guafen_content_num {
			color: #FF4544;
			font-weight: 500;
			font-size: 72rpx;
			margin: 20rpx 0 30rpx;
			text {
				font-size: 30rpx;
				font-weight: bold;
				margin-left: 10rpx;
			}
		}
		.guafen_photo {
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			overflow: hidden;
			.guafen_header_img {
				width: 106rpx;
				height: 106rpx;
				border-radius: 50%;
				background: #FFE5E5;
				border: 1px dashed #FF4544;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 44rpx;
				line-height: 44rpx;
				color: #FF4544;
				margin-left: 50rpx;
				margin-bottom: 20px;
				image{
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
				}
			}
		}
		.guafen_content_color {
			color: #FF4544;
		}
		.guafen_content_time {
			font-size: 24rpx;
			margin: 28rpx 0 44rpx; 
			display: flex;
			justify-content: center;
			align-items: center;
			.seckill-title-name {
				margin-right: 11rpx;
			}
			image{
				width: 108rpx;
				height: 2rpx;
				margin: 0 16rpx;
			}
		}
	}
	.btn {
		text-align: center;
		width: 540rpx;
		padding:7.42px;
		color: #FFF;
		font-size: 28rpx;
		font-weight: 500;
		background-color: #FF4544;
		margin: 0 auto;
		border-radius: $border-radius;
		box-shadow: 0 10rpx 20rpx rgba(255, 69, 68,1);
	}
}
.rule-wrap {
	border-radius: 10rpx;
	background-color: #ffd697;
	width: 80vw;
	padding: 12rpx;
	box-sizing: border-box;
	.content-wrap {
		background-color: #fff2dd;
		width: 100%;
		border-radius: 8rpx;
		position: relative;
		.rule-head {
			width: 100%;
			height:148rpx;
			position: absolute;
			transform: translateY(-50%);
			left: 0;
			top: 0;
		}

		.rule {
			height: 560rpx;
			padding:80rpx 30rpx 0 30rpx;
			box-sizing: border-box;

			.tit {
				font-weight: bold;
				color: #da2b00;
				margin-top: 10rpx;
			}
			.text {
				font-size: $font-size-sub;
				color: #da2b00;
				word-break: break-word;
			}
		}
		.iconroundclose {
			color: #fff;
			text-align: center;
			position: absolute;
			bottom: -150rpx;
			left: 50%;
			transform: translateX(-50%);
			font-size: 70rpx;
		}
	}
}
.warp-popup{
	width: 530rpx;
	height: 696rpx;
	.close-btn{
		margin-top: 46rpx;
		text-align: center;
		image{
			width: 82rpx;
			height: 82rpx;
		}
	}
	.reward-wrap {
		background-size: 100% 100%;
		background-repeat: no-repeat;
		text-align: center;
		padding:180rpx 0 68rpx;
		.bg-img-head{
			width: 600rpx;
			height: 740rpx;
		}
		.img-head{
			width: 136rpx;
			height: 136rpx;
			border-radius:50%;
		}
		.nickname{
			color: #fff;
			margin: 30rpx 0 40rpx;
			line-height: 1;
		}
		.qu-btn{
			background-color: #FFC444;
			box-shadow: 0 5px 10px #FFC444;
			color: #fff;
			border-radius: 34rpx;
			width:300rpx;
			margin: 68rpx auto 0;
			padding: 21rpx 0;
			line-height: 1;
		}
		.txt{
			font-size:50rpx;
			color: #fff;
			line-height: 1;
		}
	}
}
.reward-wrap-two {
	width: 530rpx;
	background-size: 100% 100%;
	background-repeat: no-repeat;
	text-align: center;
	padding:414rpx 0 48rpx;
	.bg-img-head-two{
		width: 600rpx;
		height: 740rpx;
	}
	.qu-btn-two{
		background-color: #FFC444;
		box-shadow: 0 5px 10px #FFC444;
		color: #fff;
		border-radius: 34rpx;
		width: 300rpx;
		margin: 0 auto;
		line-height: 1;
		padding: 21rpx 0;
	}
	.txt-two{
		font-size:90rpx;
		color: #fff;
	}
	.element-two{
		font-size: 30rpx;
		margin-left: 20rpx;
	}
}
.wrap-popup-three{
	width: 530rpx;
	height: 696rpx;
	.close-btn-three{
		margin-top: 46rpx;
		text-align: center;
		image{
			width: 82rpx;
			height: 82rpx;
		}
	}
	.reward-wrap-three {
		background-size: 100% 100%;
		background-repeat: no-repeat;
		text-align: center;
		padding:326rpx 0 48rpx;
		.bg-img-head-three{
			width: 600rpx;
			height: 740rpx;
		}
		.qu-btn-three{
			background-color: #FFC444;
			box-shadow: 0 5px 10px #FFC444;
			color: #fff;
			border-radius: 34rpx;
			width: 300rpx;
			line-height: 1;
			padding: 21rpx 0;
			margin:0 auto;
		}
		.txt-three{
			font-size:90rpx;
			color: #fff;
			line-height: 1;
			margin-bottom: 52rpx;
		}
		.element-three{
			font-size: 30rpx;
			margin-left: 20rpx;
		}
		.join-three{
			color: #fff;
			line-height: 1;
		}
		.guafen-three{
			font-size: 30rpx;
			color: #fff;
			line-height: 1;
			margin: 34rpx 0 38rpx;
			text{
				color: #FFC444;
				font-size: 36rpx;
				margin: 0 10rpx;
			}
		}
	}
}
.guafen_content-one{
	background-size: 100% 100%;
	background-repeat: no-repeat;
	width: 690rpx;
	border-radius: 10rpx;
	text-align: center;
	padding:50rpx 0 56rpx;
	margin:200rpx auto 0;
	.guafen_photo {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		overflow: hidden;
		.guafen_header_img {
			width: 106rpx;
			height: 106rpx;
			border-radius: 50%;
			background: #FFE5E5;
			border: 1px dashed #FF4544;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 44rpx;
			line-height: 44rpx;
			color: #FF4544;
			margin-left: 50rpx;
			margin-bottom: 20px;
			image{
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
			}
		}
	}
	.guafen_photo-two {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		overflow: hidden;
		margin-bottom: 30rpx;
		.guafen_header_img {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			background: #FFE5E5;
			border: 1px dashed #FF4544;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 44rpx;
			line-height: 44rpx;
			color: #FF4544;
			margin-left: 56rpx;
			margin-bottom: 20px;
			&:first-child{
				margin-left: 0;
			}
			image{
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
			}
		}
	}
	.guafen-success{
		font-size: 30rpx;
		font-weight: bold;
		margin:0 0 30rpx;
		line-height: 1;
	}
	.guafen-coupon{
		font-size: 72rpx;
		line-height: 1;
		margin-bottom: 40rpx;
		color: #FF4544;
		text{
			font-size: 30rpx;
		}
	}
	.guafen-man{
		line-height: 1;
	}
	.guafen-time{
		line-height: 1;
		margin: 30rpx 0 44rpx;
	}
	.success-btn{
		width: 540rpx;
		background-color: #FF4544;
		box-shadow: 0 10rpx 20rpx rgba(255, 69, 68,1);
		color: #fff;
		border-radius: $border-radius;
		height: 80rpx;
		line-height: 80rpx;
		margin:30rpx auto 40rpx;
	}
	.success-guafen-btn{
		width: 540rpx;
		background-color: #FFC444;
		box-shadow: 0 10rpx 20rpx RGBA(255, 211, 115, 1);
		color: #fff;
		border-radius: $border-radius;
		height: 80rpx;
		line-height: 80rpx;
		margin: 0 auto;
	}
}
.image-wrap{
	height:480rpx !important;
	image{
		height:480rpx !important;
	}
}
</style>
<style scoped>
 /deep/.register-box .uni-scroll-view {
	background: unset !important;
}
/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box{
	background-color: unset;
}
/deep/ .uni-tip-button.color-base-bg{
	background-color: #007aff !important;
}
/deep/ .uni-countdown__number {
	font-size: 14px;
	padding: 0;
}
/deep/ .uni-countdown__splitor{
	font-size: 14px;
	color: #FF4544 !important;
}
>>>.uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: none !important;
}

>>>.uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
	overflow: unset;
}

/deep/ .guafen-lists{
	max-height: 280rpx;
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
}
/deep/ .guafen-lists-two{
	max-height:280rpx;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
}
</style>