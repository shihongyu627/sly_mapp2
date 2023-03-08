<template>
	<view class="sellStore-wrapp">
		<view class="sellStore-header" @click="upDealerInfo">
			<image class="header-heading"
				:src="userInfo.headimg ? $util.img(userInfo.headimg) : $util.getDefaultImage().default_headimg"
				mode="aspectFill" @error="userInfo.headimg = $util.getDefaultImage().default_headimg"></image>
			<view class="header-left">
				<view class="header-top">
					<view class="header-name">
						{{userInfo.nickname||''}}
					</view>
					<!-- <view class="header-tag" v-if="userInfo.is_store">
						门店
					</view>
					<view class="header-tag" v-if="userInfo.is_dealer">
						经销商
					</view> -->
					<view class="header-tag">
						{{userInfo.level_name||''}}
					</view>
				</view>
				<view class="header-class" v-if="userInfo.parent_name">
					我的上级：{{userInfo.parent_name||''}}
				</view>
			</view>
		</view>
		<view class="menu-box" v-for="(item, index) in menuList" :key="index">
			<view class="menu-title">
				{{item.title}}
			</view>
			<view class="menu-item">
				<view v-for="(item1, index1) in item.children" :key="index1">
					<!-- 	<view class="item-box" v-if="item1.url=='kefu'">
						<button class="share-btn" :plain="true" open-type="contact">
						</button>
						<img class='item-icon' :src="item1.icon" alt="" mode="aspectFill" />
						<view class="item-name">
							{{item1.title}}
						</view>
					</view> -->
					<ns-contact v-if="item1.url=='kefu'">
						<view class="item-box">
							<img class='item-icon' :src="item1.icon" alt="" mode="aspectFill" />
							<view class="item-name">
								{{item1.title}}
							</view>
						</view>
					</ns-contact>
					<!-- 			<view class="item-box" v-if="item1.url!='kefu'&&item1.type!='recommend'" @click="goHref(item1)">
						<button class="share-btn" @click="shareUrl(item1.shareType)" :plain="true" open-type="share"
							v-if="item1.url=='share'">
						</button>
						<img class='item-icon' :src="item1.icon" alt="" mode="aspectFill" />
						<view class="item-name">
							{{item1.title}}
						</view>
					</view> -->
					<view class="item-box" v-if="item1.url!='kefu'&&item1.url!='share'" @click="goHref(item1)">
						<img class='item-icon' :src="item1.icon" alt="" mode="aspectFill" />
						<view class="item-name">
							{{item1.title}}
						</view>
					</view>
					<view class="item-box" v-if="item1.url!='kefu'&&item1.url=='share'">
						<button class="share-btn" @click="shareUrl(item1.shareType)" :plain="true" open-type="share"
							v-if="item1.url=='share'">
						</button>
						<img class='item-icon' :src="item1.icon" alt="" mode="aspectFill" />
						<view class="item-name">
							{{item1.title}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				userInfo: {},
				menuList: [{
					title: '订单管理',
					children: [{
						title: '门店订单',
						icon: require('../common/img/sellStore_menu.png'),
						url: '/sellStore/order/list/list'
					}, {
						title: '体验卡订单',
						icon: require('../common/img/sellStore_menu1.png'),
						url: '/sellStore/tiyan/list/list'
					}, {
						title: '预约记录',
						icon: require('../common/img/sellStore_menu2.png'),
						url: '/sellStore/record/list/list'
					}]
				}, {
					title: '进销订单管理',
					children: [{
						title: '仓库管理',
						icon: require('../common/img/sellStore_menu3.png'),
						url: '/sellStore/stock/list/list'
					}, {
						title: '进货订单',
						icon: require('../common/img/sellStore_menu4.png'),
						url: '/sellStore/inOrder/list/list?order_type=in'
					}, {
						title: '出货订单',
						icon: require('../common/img/sellStore_menu5.png'),
						url: '/sellStore/inOrder/list/list?order_type=in_put'
					}, {
						title: '提货订单',
						icon: require('../common/img/sellStore_menu5.png'),
						url: '/sellStore/outOrder/list/list'
					}]
				}, {
					title: '其他管理',
					children: [{
							title: '团队管理',
							icon: require('../common/img/sellStore_menu6.png'),
							url: '/sellStore/distributor/list/list'
						}, {
							title: '门店管理',
							icon: require('../common/img/sellStore_menu7.png'),
							url: '/sellStore/store/list/list'
						}, {
							title: '员工管理',
							icon: require('../common/img/sellStore_menu8.png'),
							url: '/sellStore/team/list/list'
						}, {
							title: '客户管理',
							icon: require('../common/img/sellStore_menu9.png'),
							url: '/sellStore/customer/list/list'
						}, {
							title: '收支管理',
							icon: require('../common/img/sellStore_menu10.png'),
							url: '/sellStore/bill/list/list'
						}, {
							title: '财务报表',
							icon: require('../common/img/sellStore_menumoney.png'),
							url: '/sellStore/reportForm/finance/finance'
						}, {
							title: '数据分析',
							icon: require('../common/img/sellStore_menu11.png'),
							url: '/sellStore/reportForm/statistics/statistics'
						}, {
							title: '经销商排行榜',
							icon: require('../common/img/sellStore_menu12.png'),
							url: '/sellStore/ranking/distributor/distributor'
						},
						{
							title: '门店排行榜',
							icon: require('../common/img/sellStore_menuStore.png'),
							url: '/sellStore/ranking/store/store'
						},
						// {
						// 	title: '城市排行榜',
						// 	icon: require('../common/img/sellStore_menu12.png'),
						// 	url: '/sellStore/ranking/city/city'
						// },
						// {
						// 	title: '防窜货管理',
						// 	icon: require('../common/img/sellStore_menu13.png'),
						// 	url: ''
						// },
						{
							title: '邀请合作',
							icon: require('../common/img/joinTeam.png'),
							url: 'share',
							shareType: 'dealer'
						},
						{
							title: '邀请入驻',
							icon: require('../common/img/sellStore_menu14.png'),
							url: 'share',
							shareType: 'store'
						},
						{
							title: '核销入口',
							icon: require('../common/img/sellStore_menu15.png'),
							url: '/pages_tool/verification/index'
						},
						{
							title: '联系客服',
							icon: require('../common/img/sellStore_menu16.png'),
							url: 'kefu'
						},

					],
				}],
				type: '',
				shareType: '',
				is_dealer_auth_account: '',
				is_store_auth_account: ''
			};
		},
		mixins: [],
		onLoad(data) {
			let workType = uni.getStorageSync('workType') || '';
			console.log(data, '123123');
			if (data.type) {
				this.type = data.type
				uni.setStorageSync('workType', data.type || '');
			} else {
				this.type = workType
			}
			this.is_dealer_auth_account = data.is_dealer_auth_account || ''
			this.is_store_auth_account = data.is_store_auth_account || ''
			this.getMemberInfo()
		},
		/**
		 * 自定义分享内容
		 * @param {Object} res
		 */
		onShareAppMessage(res) {
			let path = '/pages/index/index';
			let title = '闪亮柚近视防控'
			let imgUrl = ''
			if (this.shareType == 'store') {
				path = '/openStore/agreement'
				title = '邀请入驻'
				imgUrl =
					'https://qiniu.shanliangyou888.com/upload/1/common/images/20221222/20221222013741167168746161448.jpg'
			} else if (this.shareType == 'dealer') {
				path = '/applyDealer/index'
				title = '邀请合作'
				imgUrl =
					'https://qiniu.shanliangyou888.com/upload/1/common/images/20221222/20221222013741167168746161975.png'
			}

			if (this.userInfo && this.userInfo.member_id) path += '?&source_member=' + this.userInfo.member_id;
			if (this.shareType) path += '&type=' + this.shareType;
			console.log(path, '分享路径');
			return {
				title: title,
				path: path,
				imageUrl: imgUrl,
				success: res => {},
				fail: res => {}
			};
		},
		/**
		 * 下拉刷新
		 */
		onPullDownRefresh() {
			this.getMemberInfo()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			shareUrl(shareType) {
				this.shareType = shareType
			},
			upDealerInfo() {
				if (this.userInfo.is_dealer == '1' && this.type == 'dealer') {
					this.$util.redirectTo('/sellStore/dealerInfo/dealerInfo');
				}
			},
			goHref(item) {
				console.log(item);
				if (!item.url) {
					return
				}
				// if (item.url == '/sellStore/reportForm/finance/finance' || item.url ==
				// 	'/sellStore/reportForm/statistics/statistics') {
				// 	this.$util.showToast({
				// 		title: '暂无开放'
				// 	});
				// 	return
				// }
				this.$util.redirectTo(item.url, {
					is_dealer: this.userInfo.is_dealer,
					is_store: this.userInfo.is_store,
					type: this.type
				}, );
			},
			/**
			 * 查询会员信息
			 */
			getMemberInfo() {
				this.$api.sendRequest({
					url: '/dealer/api/dealer/detail',
					data: {},
					success: res => {
						if (res.code == 0) {
							this.userInfo = res.data;
							let dd = res.data
							console.log(this.type, 99999999);
							if (this.type == 'dealer') {
								this.menuList = [{
									title: '进销订单管理',
									children: [{
										title: '仓库管理',
										icon: require(
											'../common/img/sellStore_menu3.png'
										),
										url: '/sellStore/stock/list/list'
									}, {
										title: '进货订单',
										icon: require(
											'../common/img/sellStore_menu4.png'
										),
										url: '/sellStore/inOrder/list/list?order_type=in'
									}, {
										title: '出货订单',
										icon: require(
											'../common/img/sellStore_menu5.png'
										),
										url: '/sellStore/inOrder/list/list?order_type=in_put'
									}]
								}, {
									title: '其他管理',
									children: [{
											title: '团队管理',
											icon: require(
												'../common/img/sellStore_menu6.png'
											),
											url: '/sellStore/distributor/list/list'
										}, {
											title: '门店管理',
											icon: require(
												'../common/img/sellStore_menu7.png'
											),
											url: '/sellStore/store/list/list'
										}, {
											title: '推荐人列表',
											icon: require(
												'../common/img/recommend_img.png'
											),
											url: '/sellStore/recommend/list/list',
											type: 'recommend'
										}, {
											title: '数据报表',
											icon: require(
												'../common/img/sellStore_menu11.png'
											),
											url: '/sellStore/reportForm/statistics/statistics'
										}, {
											title: '经销商排行榜',
											icon: require(
												'../common/img/sellStore_menu12.png'
											),
											url: '/sellStore/ranking/distributor/distributor'
										},
										{
											title: '门店排行榜',
											icon: require(
												'../common/img/sellStore_menuStore.png'
											),
											url: '/sellStore/ranking/store/store'
										},

										// {
										// 	title: '城市排行榜',
										// 	icon: require(
										// 		'../common/img/sellStore_menu12.png'
										// 	),
										// 	url: '/sellStore/ranking/city/city'
										// },
										// {
										// 	title: '防窜货管理',
										// 	icon: require('../common/img/sellStore_menu13.png'),
										// 	url: ''
										// },
										{
											title: '邀请合作',
											icon: require('../common/img/joinTeam.png'),
											url: 'share',
											shareType: 'dealer'
										},
										{
											title: '邀请入驻',
											icon: require('../common/img/sellStore_menu14.png'),
											url: 'share',
											shareType: 'store'
										},
										{
											title: '联系客服',
											icon: require(
												'../common/img/sellStore_menu16.png'
											),
											url: 'kefu'
										},
										{
											title: '落地费管理',
											icon: require(
												'../common/img/sellNewTwo.png'
											),
											url: '/sellStore/landing/index/index'
										},
										{
											title: '推荐费管理',
											icon: require(
												'../common/img/sellNewOne.png'
											),
											url: '/sellStore/recommend/fee/fee'
										},
									],
								}]
							} else if (this.type == 'store') {
								this.menuList = [{
									title: '订单管理',
									children: [{
										title: '门店订单',
										icon: require(
											'../common/img/sellStore_menu.png'
										),
										url: '/sellStore/order/list/list'
									}, {
										title: '体验卡订单',
										icon: require(
											'../common/img/sellStore_menu1.png'
										),
										url: '/sellStore/tiyan/list/list'
									}, {
										title: '预约记录',
										icon: require(
											'../common/img/sellStore_menu2.png'
										),
										url: '/sellStore/record/list/list'
									}]
								}, {
									title: '进销订单管理',
									children: [{
										title: '仓库管理',
										icon: require(
											'../common/img/sellStore_menu3.png'
										),
										url: '/sellStore/stock/list/list'
									}, {
										title: '进货订单',
										icon: require(
											'../common/img/sellStore_menu4.png'
										),
										url: '/sellStore/inOrder/list/list?order_type=in'
									}, {
										title: '提货订单',
										icon: require(
											'../common/img/sellStore_menu5.png'
										),
										url: '/sellStore/outOrder/list/list'
									}]
								}, {
									title: '其他管理',
									children: [{
											title: '员工管理',
											icon: require(
												'../common/img/sellStore_menu8.png'
											),
											url: '/sellStore/team/list/list'
										}, {
											title: '客户管理',
											icon: require(
												'../common/img/sellStore_menu9.png'
											),
											url: '/sellStore/customer/list/list'
										}, {
											title: '收支管理',
											icon: require(
												'../common/img/sellStore_menu10.png'
											),
											url: '/sellStore/bill/list/list'
										}, {
											title: '财务报表',
											icon: require(
												'../common/img/sellStore_menumoney.png'
											),
											url: '/sellStore/reportForm/finance/finance'
										},
										// {
										// 	title: '防窜货管理',
										// 	icon: require('../common/img/sellStore_menu13.png'),
										// 	url: ''
										// },
										{
											title: '核销入口',
											icon: require(
												'../common/img/sellStore_menu15.png'
											),
											url: '/pages_tool/verification/index'
										},
										{
											title: '联系客服',
											icon: require(
												'../common/img/sellStore_menu16.png'
											),
											url: 'kefu'
										},
										{
											title: '我的钱包',
											icon: require(
												'../common/img/wallet.png'
											),
											url: '/pages_tool/member/balance'
										},

										// {
										// 	title: '落地费管理',
										// 	icon: require(
										// 		'../common/img/sellNewTwo.png'
										// 	),
										// 	url: '/sellStore/landing/index/index'
										// },
										// {
										// 	title: '推荐费管理',
										// 	icon: require(
										// 		'../common/img/sellNewOne.png'
										// 	),
										// 	url: '/sellStore/recommend/fee/fee'
										// },
									],
								}]
							}
							this.menuList.map((item) => {
								if (item.title == '其他管理') {
									if (this.is_dealer_auth_account != 1 && this
										.is_store_auth_account != 1) {
										item.children.push({
											title: '授权账号',
											icon: require(
												'../common/img/sellStore_menuStore.png'
											),
											url: '/sellStore/authorize/list/list'
										})
									}
								}
							})
							uni.setStorageSync('dealerInfo', res.data || {})
							if (dd.is_dealer == 1 && dd.is_full_account == 0 && this.type == 'dealer') {
								let that = this
								uni.showModal({
									title: '提示',
									content: '您尚未设置收款信息',
									confirmText: "去设置",
									success: res => {
										if (res.confirm) {
											that.$util.redirectTo(
												'/sellStore/dealerInfo/dealerInfo');
										}
									}
								})
							}
							if (dd.is_store == 1 && dd.is_assets == 0 && this.type == 'store') {
								let that = this
								uni.showModal({
									title: '提示',
									content: '您尚未填写固定资产',
									confirmText: "去填写",
									success: res => {
										if (res.confirm) {
											that.$util.redirectTo(
												'/sellStore/bill/create/create', {
													type: 'assets'
												});
										}
									}
								})
							}
						}
					},
					complete: res => {}
				});
			}
		}
	};
</script>

<style scoped>
	.sellStore-wrapp {
		padding-bottom: 20px;
	}

	.sellStore-header {
		width: 100%;
		height: 80px;
		background: #fff;
		border-radius: 0px 0px 0px 0px;
		display: flex;
		align-items: center;
		flex-direction: row;
	}

	.header-heading {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		margin-left: 10px;
		margin-right: 15px;
	}

	.header-top {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.header-name {
		max-width: 100px;
		font-size: 20px;
		font-weight: bold;
		color: #000000;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.header-class {
		font-size: 13px;
		font-weight: 400;
		color: #65666E;
	}

	.header-tag {
		background: #1189F4;
		border-radius: 4px 4px 4px 4px;
		opacity: 1;
		font-size: 11px;
		font-weight: 400;
		color: #FFFFFF;
		padding-left: 5px;
		padding-right: 5px;
		margin-left: 10px;
	}

	.menu-box {
		width: 710rpx;
		background: #FFFFFF;
		border-radius: 10px;
		opacity: 1;
		margin: 0 auto;
		margin-top: 10px;
	}

	.menu-title {
		width: 710rpx;
		height: 60rpx;
		background: #FFFFFF;
		border-radius: 10px 10px 0px 0px;
		opacity: 1;
		padding-left: 14px;
		box-sizing: border-box;
		font-size: 16px;
		font-weight: bold;
		color: #000000;
		line-height: 100rpx;
	}

	.menu-item {
		padding-top: 40rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
	}

	.item-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 175rpx;
		margin-bottom: 20rpx;
		position: relative;
	}

	.share-btn {
		position: absolute;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		border: none;
		z-index: 90;
	}

	.item-name {
		font-size: 28rpx;
		font-weight: 400;
		color: #34373F;
	}

	.item-icon {
		width: 60rpx;
		height: 60rpx;
	}
</style>
