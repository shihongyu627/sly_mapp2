export default {
	methods: {
		/**
		 * 关闭订单
		 * @param {Object} order_id
		 */
		orderClose(order_id, callback){
			uni.showModal({
				title: '提示',
				content: '您确定要关闭该订单吗？',
				success: res => {
					if (res.confirm) {
						this.$api.sendRequest({
							url: '/presale/api/order/close',
							data: {order_id},
							success: res => {
								if(res.code==0){
									typeof callback == 'function' && callback();
								}else{
									this.$util.showToast({
										title: res.message,
										duration:2000
									})
								}
							}
						})
					}
				}
			})
		},
		/**
		 * 删除订单
		 * @param {Object} order_id
		 */
		deleteOrder(order_id, callback){
			uni.showModal({
				title: '提示',
				content: '您确定要删除该订单吗？',
				success: res => {
					if (res.confirm) {
						this.$api.sendRequest({
							url: '/presale/api/order/delete',
							data: {order_id},
							success: res => {
								if(res.code==0){
									typeof callback == 'function' && callback();
								}else{
									this.$util.showToast({
										title: res.message,
										duration:2000
									})
								}
							}
						})
					}
				}
			})
		},
		/**
		 * 退定金
		 * @param {Object} order_id
		 */
		refundDeposit(order_id, callback){
			uni.showModal({
				title: '提示',
				content: '您确定要退定金吗？',
				success: res => {
					if (res.confirm) {
						this.$api.sendRequest({
							url: '/presale/api/refund/applyRefund',
							data: {order_id},
							success: res => {
								if(res.code==0){
									typeof callback == 'function' && callback();
								}else{
									this.$util.showToast({
										title:res.message,
										duration:2000
									})
								}
							}
						})
					}
				}
			})
		},
		/**
		 * 支付尾款
		 * @param {Object} order_id
		 */
		orderPayFinal(order, callback){
			let url = '/presale/api/order/pay',
				data = { id: order.id };
			if (order.final_out_trade_no == '') {
				url = '/presale/api/ordercreate/finalCreate';
				data.is_balance = this.isBalance;
			}
			this.$api.sendRequest({
				url,
				data,
				success: res => {
					this.isSub = false;
					if (res.code >= 0) {
						if (this.payMoney == 0) {
							this.$util.redirectTo('/pages_tool/pay/result', {
								code: res.data
							}, 'redirectTo');
						} else {
							this.$refs.choosePaymentPopup.getPayInfo(res.data);
						}
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
					this.isBalance = 0;
				},
				fail: res => {
					this.isSub = false;
				}
			})
		},
		/**
		 * 定金支付
		 * @param {Object} order_id
		 */
		orderPayDeposit(order, callback){
			this.$api.sendRequest({
				url: '/presale/api/order/pay',
				data: {
					'id' : order.id
				},
				success: res => {
					this.isSub = false;
					if (res.code >= 0) {
						this.$refs.choosePaymentPopup.getPayInfo(res.data);
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				},
				fail: res => {
					this.isSub = false;
				}
			})
		},
		openPaymentPopup(order, type){
			this.payType = type;
			if (type == 'final_money') {
				if (order.final_out_trade_no == '') {
					this.payMoney = order.order_money - order.presale_deposit_money;
				}
			} else if (type == 'presale_deposit_money') {
				this.payMoney = order.pay_deposit_money;
			}
			uni.setStorageSync('paySource', 'presale');
			this.$refs.choosePaymentPopup.open();
		}
	} 
}