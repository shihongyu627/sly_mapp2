export default {
	methods: {
		/**
		 * 撤销退款申请
		 * @param {Object} order_goods_id
		 * @param {Object} callback
		 */
		cancleRefund(order_goods_id, callback) {
			uni.showModal({
				content: '撤销之后本次申请将会关闭,如后续仍有问题可再次发起申请。',
				cancelText: '暂不撤销',
				cancelColor: '#898989',
				success: res => {
					if (res.confirm) {
						this.$api.sendRequest({
							url: '/api/orderrefund/cancel',
							data: {
								order_goods_id
							},
							success: res => {
								typeof callback == 'function' && callback(res);
							}
						})
					}
				}
			})
		},

	}
}
