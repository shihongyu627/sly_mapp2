export default {
	data() {
		return {
			fenxiaoWords: {}
		}
	},
	methods: {
		getFenxiaoWrods() {
			this.$api.sendRequest({
				url: '/fenxiao/api/config/words',
				success: res => {
					if (res.code >= 0 && res.data) {
						this.fenxiaoWords = res.data;
						uni.setStorageSync('fenxiaoWords', res.data);
					}
				}
			})
		}
	},
	onShow() {
		if (uni.getStorageSync('fenxiaoWords')) this.fenxiaoWords = uni.getStorageSync('fenxiaoWords');
		this.getFenxiaoWrods();
	}
}
