import config from './config.js'
export default {
	data() {
		return {
			timeoutObj: null, //ping定时器
			servicer_id: null, //绑定
			pingInterval: config.pingInterval //本地端主动给服务器ping的时间, 0 则不开启
		}
	},
	onLoad() {
		let that = this;
		// 因为图片上传，所以不能onhide关闭长链接，但是每次打开客服都会有重复请求，所以优先关闭再去打开长链接
		uni.closeSocket();
		// .判断是否已连接
		that.checkOpenSocket();
		// uni.onSocketClose(function(res) {
		// 	console.log('WebSocket 已关闭！');
		// });
	},
	methods: {
		// 判断是否已连接
		checkOpenSocket() {
			console.log('判断是否已连接')
			// alert('判断是否已连接')
			let self = this;
			uni.sendSocketMessage({
				data: 'ping',
				success: (res) => {
					console.log('连接成功,检查')
					// alert('连接成功,检查')
					// self.getChatList(); 
					return;
				},
				fail: (err) => { // 未连接打开websocket连接
					console.log('连接失败')
					// alert('连接失败')
					self.openConnection();
				}
			});
		},
		openConnection() { // 打开连接
			console.log('打开连接')
			// alert('打开连接')
			// uni.closeSocket(); // 确保已经关闭后再重新打开
			uni.connectSocket({
				url: config.webSocket,
				method: 'POST',
				success(res) {
					console.log('连接成功 connectSocket=', res);
					// alert('连接成功 connectSocket=', res);
				},
				fail(err) {
					console.log('连接失败 connectSocket=', err);
				}
			});
			// uni.onSocketOpen((res) => {
			// 	console.log('连接成功', res);
			// });
			this.onSocketMessage(); // 打开成功监听服务器返回的消息
		},
		//	打开成功监听服务器返回的消息
		onSocketMessage() { // 消息
			console.log("开始监听");

			let that = this;
			this.pingInterval = config.pingInterval;
			this.timeoutObj = null;
			uni.onSocketMessage((res) => { //type:init,connect,close,string,order,goods
				let msg = JSON.parse(res.data);
				console.log("监听该服务器消息", res)
				if (msg.type == 'close') {
					clearInterval(that.timeoutObj);
					that.timeoutObj = null;
					uni.closeSocket();
					return;
				}
				this.reset();
				this.getSocketMsg(res.data); // 监听到有新服务器消息
			});
		},
		// 监听到有新服务器消息
		getSocketMsg(reData) { // 监听到服务器消息
			let that = this;
			// console.log(reData)
			let giveMsg = JSON.parse(reData);
			let data = {
				isItMe: false,
			};
			data.contentType = giveMsg.type;
			// alert(data.contentType)
			if (giveMsg.type == 'init') {
				// alert(123)
				that.$api.sendRequest({
					url: '/servicer/api/chat/bind',
					data: {
						client_id: giveMsg.data.client_id,
						site_id: that.siteId
					},
					success(res) {
						if (res.code == 0) {
							that.servicer_id = res.data.servicer_id;
						} else {
							that.servicer_id = 0;
						}
						that.getChatList();
					}
				})
			} else if (giveMsg.type == 'connect') {
				// that.servicer_id = giveMsg.data.servicer_id;
				// let NewArr = that.messageList;
				// let index = null;
				// for (let i = 0; i < NewArr.length; i++) {
				// 	if (NewArr[i].contentType == 'online' || NewArr[i].contentType == 'noline') {
				// 		index = i;
				// 	}
				// }
				// NewArr.splice(index, 1)
				// that.messageList = NewArr;
				// let obj = {}
				// if (that.servicer_id > 0) {
				// 	obj.contentType = 'online';
				// } else if (that.servicer_id == 0) {
				// 	obj.contentType = 'noline';
				// }
				// that.messageList.push(obj);
				return false;
			} else if (giveMsg.type == 'string') {
				data.content = giveMsg.data.servicer_say;
			} else if (giveMsg.type == 'image') {
				data.image = giveMsg.data.servicer_say;
			} else if (giveMsg.type == 'order') {
				data.order_id = giveMsg.data.order_id;
			} else if (giveMsg.type == 'goodssku') {
				data.sku_id = giveMsg.data.goods_sku_id;
			}
			if (giveMsg.type == 'init') return;
			that.messageList.push(data);
			that.$nextTick(() => {
				that.setPageScrollTo()
			})
		},
		// 检测心跳reset
		reset() {
			console.log("检测心跳")
			clearInterval(this.timeoutObj);
			this.start(); // 启动心跳
		},
		// 启动心跳 start 
		start() {
			console.log("启动心跳")
			let self = this;
			this.timeoutObj = setInterval(function() {
				uni.sendSocketMessage({
					data: 'ping',
					success: (res) => {
						console.log('连接中....');
					},
					fail: (err) => {
						console.log('连接失败重新连接....');
						self.openConnection();
					}
				});
			}, this.pingInterval);
		}
	},
	// onHide() {
	// 	// alert("关闭")
	// 	// 改之前的
	// 	// console.log("我出发了")
	// 	// this.checkOpenSocket();
	// 	clearInterval(this.timeoutObj);
	// 	this.timeoutObj = null;
	// 	this.$api.sendRequest({
	// 		url: '/servicer/api/chat/bye',
	// 		data: {
	// 			servicer_id: this.servicer_id,
	// 			site_id: this.siteId
	// 		},
	// 		success(res) {
	// 			uni.closeSocket();
	// 		},
	// 		fail: (err) => {
	// 			uni.closeSocket();
	// 		}
	// 	});
	// },
	onUnload() {
		// alert("关闭")
		clearInterval(this.timeoutObj);
		this.timeoutObj = null;
		this.$api.sendRequest({
			url: '/servicer/api/chat/bye',
			data: {
				servicer_id: this.servicer_id,
				site_id: this.siteId
			},
			success(res) {
				// alert("关闭1")
				uni.closeSocket();
			},
			fail: (err) => {
				// alert("关闭2")
				uni.closeSocket();
			}
		});
	}
}
