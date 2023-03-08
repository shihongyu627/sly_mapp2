<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="point-wrap">
		<mescroll-uni @getData="getData" ref="mescroll" :size="10" v-if="addonIsExist.pointexchange">
			<block slot="list">
				<view class="head-wrap color-base-bg">
					<image :src="$util.img('public/uniapp/point/point_bg.png')" mode="widthFix"></image>
					<view class="wrap" :class="{ 'no-login': !token }">
						<view v-if="!token" @click="login">
							<view class="lineheight-clear"><text class="font-size-toolbar login-btn">立即登录</text></view>
							<view class="lineheight-clear"><text class="font-size-tag">登录后查看我的柚币</text></view>
						</view>
						<view v-else class="member-wrap">
							<view class="headimg">
								<image
									:src="memberInfo.headimg ? $util.img(memberInfo.headimg) : $util.getDefaultImage().head"
									mode="aspectFill"
									@error="memberInfo.headimg = $util.getDefaultImage().head"
								></image>
							</view>
							<text class="point">{{ point }}</text>
							<text class="point-name">柚币</text>
							<view class="rule">
								<text class="iconfont iconwenhao"></text>
								<text class="font-size-tag" @click="openPointPopup()">兑换规则</text>
							</view>
						</view>
						<view class="action-wrap" v-if="token">
							<view @click="jumpPage('/pages_tool/member/point')">
								柚币明细
								<text class="iconfont iconright"></text>
							</view>
							<view class="split"></view>
							<view @click="jumpPage('/pages_promotion/point/order_list')">
								兑换记录
								<text class="iconfont iconright"></text>
							</view>
						</view>
					</view>
				</view>

				<view class="body-wrap" :class="{ 'no-login': !token }">
					<view class="point-exchange-wrap" v-if="couponList.length > 0">
						<view class="type-wrap">
							<text class="type-name">柚币换券</text>
							<view></view>
							<text class="type-sub">更多好券，帮你省钱</text>
						</view>

						<view class="list-wrap">
							<view class="list-wrap-scroll">
								<view class="list-wrap-item coupon-list-wrap-item" v-for="(couponItem, couponIndex) in couponList" :key="couponIndex" @click="toDetail(couponItem)">
									<view class="img-box">
										<image :src="$util.img('public/uniapp/point/coupon_' + themeStyle.name + '_bg1.png')" ></image>
									</view>
									<view class="content">
										<!-- <view class="coupon-price-wrap">
											<view class="coupon-price color-base-text">
												<text v-if="couponItem.coupon_type == 'reward'">￥</text>
												{{parseFloat(couponItem.market_price).toFixed(0)}}
												<text v-if="couponItem.coupon_type == 'discount'">折</text>
											</view>
											<view class="coupon-point">
												<view class="coupon-point-num">
													<image :src="$util.img('public/uniapp/point/rechange.png')"></image>
													<text>{{couponItem.point}}柚币兑换</text>
												</view>
												<view class="coupon-conditions">
													{{couponItem.at_least == 0 ? '无门槛优惠券' : '满'+ parseFloat(couponItem.at_least).toFixed(0) +'可用'}}
												</view>
											</view>
										</view>
										
										<view class="coupon-name">{{couponItem.name}}</view> -->
										<view class="coupon" :style="{ backgroundImage: 'url(' + $util.img('public/uniapp/point/coupon_theme-' + themeStyle.name + '_bg1.png') + ')' }">
											<view class="coupon_left color-line-border">
												<view class="price color-base-text price-font">
													<block v-if="couponItem.coupon_type == 'reward'">
														<text>￥</text>
														{{ parseFloat(couponItem.money) }}
													</block>
													<block v-if="couponItem.coupon_type == 'discount'">
														<block v-if="couponItem.coupon_type == 'discount'">{{ parseFloat(couponItem.discount) }}折</block>
													</block>
												</view>
												<view class="coupon_condition font-size-activity-tag color-base-text">
													{{ couponItem.at_least == 0 ? '无门槛优惠券' : '满' + parseFloat(couponItem.at_least).toFixed(0) + '可用' }}
												</view>
												<view class="coupon_type font-size-activity-tag color-base-text">{{ couponItem.goods_type == 2 ? '指定券' : '全场券' }}</view>
											</view>
											<view class="coupon_right">
												<view class="coupon_num color-base-text font-size-tag">{{ couponItem.point }}柚币</view>
												<view class="coupon_btn color-base-text">兑换</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>

					<view class="point-exchange-wrap" v-if="hongbaoList.length > 0">
						<view class="type-wrap">
							<text class="type-name">柚币换红包</text>
							<view></view>
							<text class="type-sub">红包在手，省钱有道</text>
						</view>

						<view class="list-wrap">
							<view
								class="list-wrap-item hongbao-list-wrap-item"
								v-for="(hongbaoItem, hongbaoIndex) in hongbaoList"
								:key="hongbaoIndex"
								@click="toDetail(hongbaoItem)"
							>
								<view class="img-box"><image :src="$util.img('public/uniapp/point/hongbao_bg.png')"></image></view>
								<view class="content">
									<view class="coupon hongbao">
										<view class="coupon_left">
											<view class="price price-font">
												<text>￥</text>
												{{ parseFloat(hongbaoItem.balance).toFixed(0) }}
											</view>
											<view class="coupon_condition font-size-activity-tag">{{ hongbaoItem.name }}</view>
										</view>
										<view class="coupon_right">
											<view class="coupon_num  font-size-tag">{{ hongbaoItem.point }}柚币</view>
											<view class="coupon_btn">兑换</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>

					<view class="point-exchange-wrap" v-if="goodsList.length > 0">
						<view class="type-wrap-box">
							<view class="type-wrap">
								<text class="type-name">柚币换好物</text>
								<view></view>
								<text class="type-sub">积累柚币，兑换好物</text>
							</view>
							<text class="more" @click="goGoodsList()">更多</text>
						</view>

						<view class="list-wrap">
							<view class="goods-list double-column" v-if="goodsList.length">
								<view class="goods-item margin-bottom" v-for="(item, index) in goodsList" :key="index">
									<view class="goods-img" @click="toDetail(item)"><image :src="goodsImg(item)" mode="widthFix" @error="imgError(index)"></image></view>
									<view class="info-wrap">
										<view class="name-wrap">
											<view class="goods-name" @click="toDetail(item)">{{ item.name }}</view>
										</view>
										<view class="lineheight-clear">
											<view class="discount-price">
												<text class="unit price-font">{{ item.point }}</text>
												<text class="unit  font-size-tag ">柚币</text>
												<block v-if="item.price > 0 && item.pay_type > 0">
													<text class="unit  font-size-tag">+</text>
													<text class="unit  price-font">{{ $lang('common.currencySymbol') }}</text>
													
													<text class="price  price-font" >{{ parseFloat(item.price).toFixed(2).split(".")[0] }}</text>
													<text class="unit  price-font">.{{ parseFloat(item.price).toFixed(2).split(".")[1] }}</text>
													
												</block>
											</view>
										</view>
										<view class="pro-info" v-if="item.stock_show">
											<view class="font-size-activity-tag color-tip">库存{{ item.stock }}</view>
											<view class="sale font-size-activity-tag color-tip" @click="toDetail(item)">
												<!-- <button type="primary" size="mini">立即兑换</button> -->
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</mescroll-uni>

		<!-- 弹出规则 -->
		<view @touchmove.prevent.stop>
			<uni-popup ref="pointPopup" type="bottom">
				<view class="tips-layer">
					<view class="head" @click="closePointPopup()">
						<view class="title">柚币说明</view>
						<text class="iconfont iconclose"></text>
					</view>
					<view class="body">
						<view class="detail margin-bottom">
							<view class="tip">柚币的获取</view>
							<view class="font-size-base">1、柚币可在注册、签到、分享、消费、充值时获得。</view>
							<view class="font-size-base">2、在购买部分商品时可获得柚币。</view>
							<view class="tip">柚币的使用</view>
							<view class="font-size-base">1、柚币可用于兑换柚币中心的商品。</view>
							<view class="font-size-base">2、柚币可在参与某些活动时使用。</view>
							<view class="font-size-base">3、柚币不得转让，出售，不设有效期。</view>
							<view class="tip">柚币的查询</view>
							<view class="font-size-base">1、柚币可在会员中心中查询具体数额以及明细。</view>
						</view>
					</view>
				</view>
			</uni-popup>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>
	</view>
</template>
<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
	components: {
		uniPopup
	},
	data() {
		return {
			mescroll: null,
			categoryList: [
				{
					id: 1,
					name: '柚币换好物'
				},
				{
					id: 2,
					name: '柚币换券'
				},
				{
					id: 3,
					name: '柚币换红包'
				}
			],
			isLogin: false,
			goodsList: [],
			couponList: [],
			hongbaoList: [],
			point: 0,
			token: null,
			memberInfo: {
				headimg: ''
			},
			signState: 1, // 签到是否开启
			//分享建立上下级所需id
			memberId: 0,
			mpShareData: null //小程序分享数据
		};
	},
	onLoad(option) {
		this.$util.getMemberId().then(resolve => {
			this.memberId = resolve;
		});
		//小程序分享接收source_member
		if (option.source_member) {
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
	},
	onShow() {
		
		setTimeout( () => {
			if (this.addonIsExist && !this.addonIsExist.pointexchange) {
				this.$util.showToast({
					title: '商家未开启柚币商城',
					mask: true,
					duration: 2000
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
				}, 2000);
				return;
			}
		}, 1000);

		//记录分享关系
		if (uni.getStorageSync('token') && uni.getStorageSync('source_member')) {
			this.$util.onSourceMember(uni.getStorageSync('source_member'));
		}

		//小程序分享
		// #ifdef MP-WEIXIN
		this.$util.getMpShare().then(res => {
			this.mpShareData = res;
		});
		// #endif

		if (uni.getStorageSync('token')) this.getMemberInfo();
		this.getCouponList();
		this.getHongbaoList();
		this.getSignState();
	},
	computed: {
		storeToken() {
			return this.$store.state.token;
		}
	},
	watch: {
		storeToken: function(nVal, oVal) {
			if (nVal) {
				this.getMemberInfo();
			}
		}
	},
	methods: {
		// 签到是否开启
		getSignState() {
			this.$api.sendRequest({
				url: '/api/membersignin/getSignStatus',
				success: res => {
					if (res.code == 0) {
						this.signState = res.data.is_use;
					}
				}
			});
		},
		jumpPage(url) {
			this.$util.redirectTo(url);
		},
		// 打开柚币说明弹出层
		openPointPopup() {
			this.$refs.pointPopup.open();
		},
		// 打开柚币说明弹出层
		closePointPopup() {
			this.$refs.pointPopup.close();
		},
		// 优惠券
		getCouponList() {
			this.$api.sendRequest({
				url: '/pointexchange/api/goods/page',
				data: {
					page_size: 0,
					type: 2
				},
				success: res => {
					if (res.code == 0 && res.data) {
						this.couponList = res.data.list;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail() {
					//联网失败的回调
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		// 红包
		getHongbaoList() {
			this.$api.sendRequest({
				url: '/pointexchange/api/goods/page',
				data: {
					page_size: 0,
					type: 3
				},
				success: res => {
					if (res.code == 0 && res.data) {
						this.hongbaoList = res.data.list;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail() {
					//联网失败的回调
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		//获取柚币商品详情
		getData(mescroll) {
			// this.mescroll = mescroll;
			this.$api.sendRequest({
				url: '/pointexchange/api/goods/page',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					type: 1
				},
				success: res => {
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						});
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.goodsList = []; //如果是第一页需手动制空列表
					this.goodsList = this.goodsList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail() {
					//联网失败的回调
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		//跳转至详情页面
		toDetail(item) {
			this.$util.redirectTo('/pages_promotion/point/detail', {
				id: item.id
			});
		},
		goGoodsList() {
			this.$util.redirectTo('/pages_promotion/point/goods_list');
		},
		getMemberInfo() {
			this.$api.sendRequest({
				url: '/api/member/info',
				success: res => {
					if (res.code >= 0) {
						this.token = uni.getStorageSync('token');
						this.memberInfo = res.data;
						this.getAccountInfo();
					} else {
						this.token = null;
					}
				}
			});
		},
		//获取个人
		getAccountInfo() {
			this.$api.sendRequest({
				url: '/api/memberaccount/info',
				data: {
					account_type: 'point'
				},
				success: res => {
					if (res.code == 0 && res.data) {
						if (!isNaN(parseFloat(res.data.point))) {
							this.point = parseFloat(res.data.point).toFixed(0);
						}
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		},
		//跳转至登录页面
		login() {
			this.$refs.login.open('/pages_promotion/point/list');
		},
		imgError(index) {
			this.goodsList[index].image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		goodsImg(data) {
			switch (data.type) {
				case 1:
					return this.$util.img(data.image.split(',')[0], {
						size: 'mid'
					});
					break;
				case 2:
					return data.image ? this.$util.img(data.image) : this.$util.img('public/uniapp/point/coupon.png');
					break;
				case 3:
					return data.image ? this.$util.img(data.image) : this.$util.img('public/uniapp/point/hongbao.png');
					break;
			}
		}
	},
	//分享给好友
	onShareAppMessage() {
		return this.mpShareData.appMessage;
	},
	//分享到朋友圈
	onShareTimeline() {
		return this.mpShareData.timeLine;
	}
};
</script>

<style lang="scss">
@import './public/css/list.scss';
</style>
