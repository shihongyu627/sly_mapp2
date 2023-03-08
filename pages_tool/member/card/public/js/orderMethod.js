export default {
	methods: {
		/**
		 * 订单支付
		 * @param {Object} out_trade_no
		 */
		orderPay(orderData) {
			console.log(orderData, 8888);
			this.pay();
		},
		pay() {
			this.$refs.choosePaymentPopup.getPayInfo(this.orderData.out_trade_no);
		},
		/**
		 * 关闭订单
		 * @param {Object} order_id
		 */
		orderClose(order_id, callback) {
			uni.showModal({
				title: '提示',
				content: '您确定要关闭该订单吗？',
				success: res => {
					if (res.confirm) {
						this.$api.sendRequest({
							url: '/subcard/api/order/close',
							data: {
								order_id
							},
							success: res => {
								if (res.code >= 0) {
									typeof callback == 'function' && callback();
								} else {
									this.$util.showToast({
										title: '当前订单可能存在维权等操作，' + res.message +
											'不可以关闭哦!',
										duration: 2000
									})
								}
							}
						})
					}
				}
			})
		},
		/**
		 * 订单收货
		 * @param {Object} order_id
		 */
		orderDelivery(order_id, callback) {
			uni.showModal({
				title: '提示',
				content: '您确定已经收到货物了吗？',
				success: res => {
					if (res.confirm) {
						this.$api.sendRequest({
							url: '/api/order/takedelivery',
							data: {
								order_id
							},
							success: res => {
								this.$util.showToast({
									title: res.message
								})
								typeof callback == 'function' && callback();
							}
						})
					}
				},
			})
		},
		/**
		 * 订单虚拟商品收货
		 * @param {Object} order_id
		 */
		orderVirtualDelivery(order_id, callback) {
			uni.showModal({
				title: '提示',
				content: '您确定要进行收货吗操作？',
				success: res => {
					if (res.confirm) {
						this.$api.sendRequest({
							url: '/api/order/membervirtualtakedelivery',
							data: {
								order_id
							},
							success: res => {
								this.$util.showToast({
									title: res.message
								})
								typeof callback == 'function' && callback();
							}
						})
					}
				},
			})
		},
	}
}
