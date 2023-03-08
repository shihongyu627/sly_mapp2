<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="container" id="container">
		<view class="room" :class="keyWordsConfig.is_open == 1 ? 'active' : ''" @click="closePopWindow">
			<view class="tips" :class="{ show: isLoading }">正在获取消息</view>
			<view class="room-content-box">
				<view :id="'chat' + index" v-for="(item, index) in messageList" :key="index">
					<chat-message
						:message="item"
						:shopInfo="shopInfo"
						:userInfo="userInfo"
						@sendGood="sendGood($event, index)"
						@sendOrder="sendOrder($event, index)"
						:send="send"
					></chat-message>
				</view>
			</view>
			<view class="paddingbottom" id="paddingbottom" v-if="chatBottom"></view>
		</view>
		<view class="input-content" :class="keyWordsConfig.is_open == 1 ? 'active' : ''">
			<view class="keyWords" v-if="keyWordsConfig.is_open == 1">
				<text
					v-for="(item, index) in keyWordsConfig.keyword_list"
					:key="index"
					@click="
						formData.content = item.keyword;
						sendMsg('message');
					"
				>
					{{ item.keyword }}
				</text>
			</view>
			<view class="input-box">
				<view class="iconfont iconbiaoqing1 padding-right " @click="openEmjoy()"></view>
				<editor
					id="editor"
					class="message-edit"
					v-model="formData.content"
					@ready="onEditorReady"
					@focus="inputFocus"
					@input="onEditorinput()"
					@blur="closePopWindow()"
				></editor>
				<view class="iconfont iconjiahao01 padding-right" @click="openChatMore()"></view>
				<view class="send_btn color-base-bg" @click="sendMsg('message')">发送</view>
			</view>
			<view class="inputShow" v-if="inputShow && inputFirst"></view>
			<view v-if="emjoyShow" @touchmove.prevent.stop>
				<view class="emjoy-box">
					<scroll-view scroll-y="true" class="emjoy-content">
						<view class="emjoy-item" v-for="(item, index) in emjoyList" :key="index" @click="addEmjoy(item, index)"><image :src="$util.img(item)"></image></view>
					</scroll-view>
				</view>
			</view>
			<view class="more_send" v-if="chatMore">
				<view class="more_send-item" @click="addImg()">
					<i class="iconfont icontupian "></i>
					<view>图片</view>
				</view>
			</view>
		</view>

		<!-- 加载动画 -->
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import SocketTask from '@/common/js/socketTest.js';
import chatMessage from '@/components/chat-message/chat-message.vue';
import emjoy from '@/common/js/emjoy.js';
export default {
	components: {
		chatMessage
	},
	data() {
		return {
			emjoyList: emjoy.emjoyList,
			emjoyShow: false,
			chatMore: false,
			formData: {
				content: '',
				goods_id: 0,
				order_id: 0,
				image: ''
			},
			isNetWork: false,
			send: false,

			messageList: [],
			page: 1,
			isAll: false,
			isLoading: false,
			showLoading: false, //显示正在加载

			jumpBottom: null,
			scrollTop: 0,
			scrollPosition: 0,

			siteId: 0, //店铺id
			skuId: 0, //商品id
			orderId: 0, //订单id
			siteName: '', //店铺名称
			shopInfo: {},
			orderdetail: {},
			userInfo: {},
			style: {}, //聊天框的高度
			inputFirst: 0,
			inputShow: false,
			inputOffsetBottom: 0,

			goodsDetails: {},

			// 定位ID
			startId: 0,

			goods_type: {
				promotion_name: '',
				promotion_id: ''
			},
			keyWordsConfig: {
				is_open: 0
			}
		};
	},
	mixins: [SocketTask],
	computed: {
		chatBottom() {
			return this.emjoyShow || this.chatMore || this.inputShow;
		}
	},
	onLoad(info) {
		if (info.sku_id) {
			this.skuId = info.sku_id;
			this.getGoodsDetails(info.sku_id);
		}
		if (info.order_id) {
			this.orderId = info.order_id;
			this.getOrderInfo(info.order_id);
		}
		if (this.skuId || this.orderId) {
			this.send = true;
		}

		this.$on('upDOM', () => {
			this.setPageScrollTo();
		});

		if (info.type) {
			this.goods_type.promotion_name = info.type;
		} else {
			this.goods_type.promotion_name = '';
		}
		if (info.type_id) {
			this.goods_type.promotion_id = info.type_id;
		} else {
			this.goods_type.promotion_id = '';
		}

		if (uni.getStorageSync('token')) {
			this.getUserInfo();
			this.getSiteInfo();
		} else {
			this.$util.redirectTo('/pages_tool/login/login');
			return;
		}
		this.inputFirst = 0;
		this.inputShow = false;
		this.inputOffsetBottom = 0;
		// this.getChatList();
		this.getKeyWordsConfig();

		uni.setNavigationBarTitle({
			title: '商家客服'
		});
	},
	onReady() {
		// 监听键盘高度变化，以便设置输入框的高度
		uni.onKeyboardHeightChange(res => {
			this.inputOffsetBottom = res.height;
			if (res.height === 0) {
				this.focus = false;
			}
		});
	},
	methods: {
		// 初次渲染输入框
		onEditorReady() {
			uni.createSelectorQuery()
				.select('#editor')
				.context(res => {})
				.exec();
		},
		// 输入时，边输入边保存
		onEditorinput() {
			uni.createSelectorQuery()
				.select('#editor')
				.context(res => {
					this.editorCtx = res.context;
					this.editorCtx.getContents({
						success: res => {
							this.formData.content = res.html;
						}
					});
				})
				.exec();
		},
		// 加号
		openChatMore() {
			if (this.$util.isAndroid) {
				this.inputShow = false;
				this.inputFirst = 1;
			}

			this.chatMore = !this.chatMore;
			this.emjoyShow = false;

			this.$nextTick(() => {
				this.setPageScrollTo();
			});
		},
		//获取个人信息
		getUserInfo() {
			this.$api.sendRequest({
				url: '/api/member/info',
				success: res => {
					if (res.code == 0) {
						this.userInfo = res.data;
					}
				}
			});
		},
		getSiteInfo() {
			this.$api.sendRequest({
				url: '/api/site/info',
				success: res => {
					if (res.code == 0) {
						this.shopInfo = res.data;
					}
				}
			});
		},
		// 获取快捷回复设置
		getKeyWordsConfig() {
			this.$api.sendRequest({
				url: '/servicer/api/chat/keyword',
				success: res => {
					if (res.code >= 0 && res.data) {
						this.keyWordsConfig = res.data;
					}
				}
			});
		},
		// 获取商品信息，用于推送的商品详情
		getGoodsDetails(id) {
			this.$api.sendRequest({
				url: '/api/goodssku/detail',
				data: {
					sku_id: id
				},
				success: res => {
					if (res.code >= 0) {
						this.goodsDetails = res.data.goods_sku_detail;
					}
				}
			});
		},
		// 获取订单信息，用于推送订单
		getOrderInfo(id) {
			this.$api.sendRequest({
				url: '/api/order/detail',
				data: {
					order_id: id
				},
				success: res => {
					if (res.code >= 0) {
						console.log(res, 'resresresresresresresresres');
						this.orderdetail = res.data;
					}
				}
			});
		},
		//获取聊天记录
		getChatList() {
			// 如果已经获取完了数据，直接返回不进行请求
			if (this.isAll) {
				this.isLoading = false;
				return;
			}
			// 防重复
			if (this.isLoading) return;
			this.isLoading = true;
			// 如果是第一次请求，手动置空数据
			if (this.page == 1) this.messageList = [];
			// 用于获取聊天记录时，进行拼接数据，同步定位的位置
			let oldStartId = 0;
			oldStartId = this.messageList.length;
			// 改变this指向
			let that = this;
			this.$api.sendRequest({
				url: '/servicer/api/chat/dialogs',
				data: {
					servicer_id: this.servicer_id,
					page: this.page,
					limit: 15,
					site_id: that.siteId
				},
				success(res) {
					if (res.code >= 0 && res.data) {
						that.page += 1;
						// 判定是否获取完数据
						if (res.data.list && res.data.list.length < 15) that.isAll = true;
						// 处理后的数据容器
						let newArr = [];
						//如果获取到历史聊天信息  转换为需要的格式  添加到数组内
						let arr = res.data.list;
						if (arr.length) {
							for (let i = 0; i < arr.length; i++) {
								let obj = {};
								console.log(arr[i]);
								if (arr[i].content_type == 0) {
									obj.id = that.startId;
									obj.content = arr[i].type == 0 ? arr[i].consumer_say : arr[i].servicer_say;
									obj.isItMe = arr[i].type == 0 ? true : false;
									obj.contentType = 'string';
									obj.sendStatus = true;
								} else if (arr[i].content_type == 1) {
									obj.id = that.startId;
									obj.isItMe = arr[i].type == 0 ? true : false;
									obj.sku_id = arr[i].goods_sku_id;
									obj.sendStatus = true;
									if (arr[i].type == 0) {
										obj.contentType = 'sendGood';
									} else {
										obj.contentType = 'goodssku';
									}
								} else if (arr[i].content_type == 2) {
									obj.id = that.startId;
									obj.isItMe = arr[i].type == 0 ? true : false;
									obj.contentType = 'order';
									obj.order_id = arr[i].order_id;
									obj.sendStatus = true;
								} else if (arr[i].content_type == 3) {
									obj.id = that.startId;
									obj.isItMe = arr[i].type == 0 ? true : false;
									obj.contentType = 'image';
									obj.image = arr[i].type == 0 ? arr[i].consumer_say : arr[i].servicer_say;
									obj.sendStatus = true;
								}
								newArr.push(obj);
								that.startId += 1;
							}
						}

						setTimeout(() => {
							// 如果请求的是第一页，并且有订单id或商品id;添加发送信息
							if (that.page - 1 == 1) {
								if (that.skuId && Object.keys(that.goodsDetails).length > 0) {
									let obj = {
										id: that.startId,
										isItMe: true,
										contentType: 'sendGood',
										goodsDetail: that.goodsDetails
									};
									newArr.push(obj);
									that.startId += 1;
								}
								if (that.orderId && Object.keys(that.orderdetail).length > 0) {
									let obj = {
										id: that.startId,
										isItMe: true,
										contentType: 'sendOrder',
										orderDetail: that.orderdetail
									};
									newArr.push(obj);
									that.startId += 1;
								}

								// 是否展示客服在线不在线
								// let _obj = {};
								// _obj.id = that.startId;
								// if(that.servicer_id > 0){
								// 	_obj.contentType = 'online';
								// } else {
								// 	_obj.contentType = 'noline';
								// }
								// newArr.push(_obj);
								// that.startId += 1;
							}
							if (newArr.length) {
								that.messageList = newArr.concat(that.messageList);
								// 同步处理DOM，实现聊天记录的无缝对接
								that.$nextTick(() => {
									if (that.page - 1 == 1) {
										setTimeout(() => {
											that.setPageScrollTo();
										}, 1000);
										that.isLoading = false;
									} else {
										that.setPageScrollTo(`#chat${that.messageList.length - oldStartId}`);
										that.isLoading = false;
									}
								});
							}
						}, 500);
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		},
		// 设置页面滚动位置
		setPageScrollTo(id) {
			if (id) {
				let view = uni
					.createSelectorQuery()
					.in(this)
					.select(id);
				view.boundingClientRect(res => {
					uni.pageScrollTo({
						scrollTop: res.top - 30, // 为多显示出大半个消息的高度，示意上面还有信息。
						duration: 0
					});
				}).exec();
			} else {
				let query = uni.createSelectorQuery().in(this);
				query
					.select('.room')
					.boundingClientRect(data => {
						uni.pageScrollTo({
							scrollTop: data.height - 30, // 为多显示出大半个消息的高度，示意上面还有信息。
							duration: 0
						});
					})
					.exec();
				if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
			}
		},
		//发送商品
		sendGood(e, index) {
			this.sendMsg('goods');
			this.messageList.splice(index, 1);
		},
		//发送订单
		sendOrder(e, index) {
			this.sendMsg('order');
			this.messageList.splice(index, 1);
		},
		//发送消息
		sendMsg(data) {
			if (this.isNetWork) return;
			this.isNetWork = true;
			let that = this;
			if (data == 'goods') {
				let _type = {};
				if (this.goods_type.promotion_id != '') {
					_type.promotion_id = this.goods_type.promotion_id;
					_type.promotion_name = this.goods_type.promotion_name;
				}
				this.$api.sendRequest({
					url: '/servicer/api/chat/say',
					data: {
						goods_id: this.skuId,
						servicer_id: this.servicer_id,
						content_type: 1,
						site_id: this.siteId,
						relate_data: JSON.stringify(_type)
					},
					success(res) {
						that.send = false;
						that.joinData('send', 'goods');
					},
					complete() {
						that.isNetWork = false;
						// uni.hideKeyboard();
					}
				});
			} else if (data == 'order') {
				this.$api.sendRequest({
					url: '/servicer/api/chat/say',
					data: {
						order_id: this.orderId,
						servicer_id: this.servicer_id,
						site_id: this.siteId,
						content_type: 2
					},
					success(res) {
						that.send = false;
						that.joinData('send', 'order');
					},

					complete() {
						that.isNetWork = false;
						// uni.hideKeyboard();
					}
				});
			} else if (data == 'image') {
				that.joinData('send', 'image');
				this.$api.sendRequest({
					url: '/servicer/api/chat/say',
					data: {
						message: this.formData.image.trim(),
						servicer_id: this.servicer_id,
						site_id: this.siteId,
						content_type: 3
					},
					success(res) {
						console.log(res, '图片上传成功');
					},
					error() {
						that.messageList[that.messageList.length - 1].sendStatus = false;
						uni.createSelectorQuery()
							.select('#editor')
							.context(res => {
								this.editorCtx = res.context;
								this.editorCtx.clear();
							})
							.exec();
					},
					complete() {
						that.isNetWork = false;
					}
				});
			} else {
				console.log(this.formData.content, 'this.formData.content');
				let _text = this.formData.content;
				let _testText = _text.replace(/<p>/, '');
				let _testText2 = _testText.replace(/<\/p>/, '');
				let _testText3 = _testText2.replace(/<br>/, '');
				if (_text == '<p></p>' || _text == '<p><br></p>' || !_testText3.trim()) {
					this.$util.showToast({
						title: '发送内容不能为空'
					});
					uni.createSelectorQuery()
						.select('#editor')
						.context(res => {
							that.editorCtx = res.context;
							that.editorCtx.clear();
						})
						.exec();
					that.isNetWork = false;
					return;
				}
				that.joinData('send', 'string');
				this.$api.sendRequest({
					url: '/servicer/api/chat/say',
					data: {
						message: this.formData.content,
						servicer_id: this.servicer_id,
						content_type: 0
					},
					success(res) {
						if (res.code == 0) {
							console.log(res, '文字上传成功');
							that.formData.content = '<p></p>';
							uni.createSelectorQuery()
								.select('#editor')
								.context(res => {
									this.editorCtx = res.context;
									this.editorCtx.clear();
								})
								.exec();
						}
					},
					error() {
						that.messageList[that.messageList.length - 1].sendStatus = false;
						uni.createSelectorQuery()
							.select('#editor')
							.context(res => {
								this.editorCtx = res.context;
								this.editorCtx.clear();
							})
							.exec();
					},
					complete() {
						that.isNetWork = false;
					}
				});
			}
		},
		//拼接消息 处理滚动
		async joinData(addType, contentType) {
			if (addType == 'send') {
				let data = {
					isItMe: true,
					contentType: contentType,
					sendStatus: true
				};
				if (contentType == 'string') {
					data.content = this.formData.content;
				} else if (contentType == 'order') {
					data.order_id = this.orderId;
				} else if (contentType == 'goods') {
					data.sku_id = this.skuId;
				} else if (contentType == 'image') {
					data.image = this.formData.image;
				}
				this.messageList.push(data);
				this.$nextTick(() => {
					setTimeout(() => {
						this.setPageScrollTo();
					}, 500);
				});
			}
		},
		// 隐藏加载提示
		hideLoadTips(flag) {
			if (flag) {
				this.ajax.loadText = '消息获取成功';
				setTimeout(() => {
					this.ajax.loading = false;
				}, 300);
			} else {
				this.ajax.loading = true;
				this.ajax.loadText = '正在获取消息';
			}
		},
		onPageScroll(e) {
			if (e.scrollTop == 0) {
				this.getChatList();
			}
		},
		inputFocus(e) {
			if (this.$util.isAndroid() && this.inputFirst) {
				this.inputShow = true;
			}

			this.chatMore = false;
			// this.$nextTick(() => {
			// 	this.setPageScrollTo();
			// });
		},
		closePopWindow() {
			this.inputFirst = 0;
			this.chatMore = false;
			this.inputShow = false;
			// uni.hideKeyboard();
		},
		// 展开表情
		openEmjoy() {
			console.log(this.emjoyShow, 'this.emjoyShow');
			// if (this.$util.isAndroid()) {
			// 	this.inputFirst = 1;
			// 	this.inputShow = !this.inputShow;
			// }

			// uni.hideKeyboard();
			this.chatMore = false;
			this.emjoyShow = !this.emjoyShow;
			this.$nextTick(() => {
				this.setPageScrollTo();
			});
		},
		// 添加表情
		addEmjoy(emjoy, index) {
			console.log(emjoy, index);
			uni.createSelectorQuery()
				.select('#editor')
				.context(res => {
					this.editorCtx = res.context;
					this.editorCtx.getContents({
						success: res => {
							if (res.html == '<p><br></p>') {
								res.html = '<p></p>';
							}
							let _src = this.$util.img(emjoy);
							let text = '<img src="' + _src + '" style="height=20px; width=20px; margin-left=20px;">';
							let html2 = res.html.replace(/<\/p>$/, text + '</p>');
							this.editorCtx.setContents({
								html: html2
							});
							this.formData.content = html2;
							this.emjoyShow = false;
						}
					});
				})
				.exec();
		},
		// 发送图片
		addImg() {
			this.$util.upload(
				1,
				{
					path: 'chatimg'
				},
				res => {
					if (res[0]) {
						this.formData.image = res[0];
						this.sendMsg('image');
					} else {
						this.$util.showToast({
							title: '上传失败！'
						});
						return false;
					}
				},
				'/servicer/api/chat/chatimg'
			);
		}
	},
	beforeDestroy() {
		clearInterval(this.timeoutObj);
		this.timeoutObj = null;
		this.$api.sendRequest({
			url: '/servicer/api/chat/bye',
			data: {
				servicer_id: this.servicer_id,
				site_id: this.siteId
			},
			success(res) {
				uni.closeSocket();
			}
		});
	}
};
</script>

<style lang="scss">
//处理H5端弹出覆盖输入框的问题
.more_send {
	display: flex;
	border-top: 2rpx solid #e5e5e5;
	height: 390rpx;
	flex-wrap: wrap;

	> view {
		padding-top: 16rpx;
		width: 25%;
		height: 156rpx;
		text-align: center;

		.iconfont {
			display: inline;
			font-size: 60rpx;
			color: #333;
			background-color: #fff;
			border-radius: 20rpx;
			padding: 20rpx;
		}

		> view {
			color: #909399;
			font-size: $font-size-goods-tag;
		}
	}
}

.chat_send {
	display: flex;
	height: 90rpx;
	justify-content: space-between;
	position: relative;

	.send {
		position: absolute;
		right: 30rpx;
		bottom: 30rpx;
		color: #fff;
		align-self: flex-end;
		font-size: 28rpx;
		padding: 10rpx 20rpx;
		border-radius: 8rpx;
	}

	.emjoy_list {
		flex: 1;
	}
}

/* 加载数据提示 */
.tips {
	position: fixed;
	left: 0;
	top: var(--window-top);
	width: 100%;
	z-index: 9;
	background-color: rgba(0, 0, 0, 0);
	height: 72rpx;
	line-height: 72rpx;
	transform: translateY(-80rpx);
	transition: transform 0.3s ease-in-out 0s;
	font-size: 24rpx;
	text-align: center;
	line-height: 72rpx;

	&.show {
		transform: translateY(0);
	}
}

.room {
	width: 100%;
	/* #ifdef H5 */
	min-height: calc(100vh - 48rpx);
	padding-bottom: calc(110rpx + 88rpx);
	padding-bottom: calc(110rpx + 88rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(110rpx + 88rpx + env(safe-area-inset-bottom));
	/* #endif */

	/* #ifndef H5 */
	min-height: calc(100vh + 20rpx);
	padding-bottom: 110rpx;
	padding-bottom: calc(110rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(110rpx + env(safe-area-inset-bottom));
	&.active {
		padding-bottom: 180rpx;
		padding-bottom: calc(180rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(180rpx + env(safe-area-inset-bottom));
	}
	/* #endif */

	box-sizing: border-box;

	.room-content-box {
		width: 100%;
		min-height: calc(100% + 20rpx);
		padding-top: $padding;
		box-sizing: border-box;
	}
}

.paddingbottom {
	height: calc(280rpx + 88rpx);
}

.emjoy-box {
	width: 100%;
	height: 300rpx;
	padding: 20rpx 25rpx;
	box-sizing: border-box;
	background: #f4f4f4;
	border-top: 1rpx solid #e5e5e5;

	.emjoy-content {
		width: 100%;
		height: 100%;

		.emjoy-item {
			display: inline-block;
			width: 100rpx;
			height: 70rpx;
			text-align: center;
			line-height: 70rpx;

			image {
				display: inline-block;
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
}

.input-content {
	background: #f4f4f4;
	width: 100%;
	min-height: 110rpx;
	position: fixed;
	left: 0;
	bottom: 0;
	padding-bottom: 0;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	&.active {
		min-height: 180rpx !important;
	}
	.keyWords {
		height: 60rpx;
		line-height: 60rpx;
		padding: $padding 0 0;
		overflow-x: scroll;
		display: flex;
		margin-left: 20rpx;
		margin-right: 20rpx;
		text {
			font-size: 24rpx;
			margin-right: 20rpx;
			height: 28rpx;
			line-height: 28rpx;
			padding: 10rpx 16rpx;
			background-color: #fff;
			border-radius: $border-radius;
			white-space: nowrap;
		}
	}
	.input-box {
		width: 100%;
		height: auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10rpx $padding;
		box-sizing: border-box;

		.iconfont {
			line-height: 1;
			font-size: 52rpx;
			padding: 15rpx;
		}
		.send_btn {
			font-size: 24rpx;
			min-width: 80rpx;
			text-align: center;
			background-color: #e8e8e8;
			color: #fff;
			border-radius: 8rpx;
			height: 50rpx;
			line-height: 50rpx;
		}

		.message-edit {
			padding: 4rpx 15rpx;
			line-height: 1.5;
			background-color: #ffffff;
			// height: 90rpx;
			min-height: 60rpx !important;
			// max-height: 200rpx;
			height: auto !important;
			border-radius: 30rpx;
			font-size: $font-size-base;
		}

		// input {
		// 	margin-left: 20rpx;
		// 	margin-right: 20rpx;
		// 	width: 630rpx;
		// 	height: 100%;
		// 	height: 72rpx;
		// 	padding: 0 20rpx;
		// 	font-size: $font-size-tag;
		// 	background-color: #fff;
		// 	border-radius: 8rpx;
		// }
	}
}
</style>
