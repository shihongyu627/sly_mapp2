import validate from '@/common/js/validate.js';
export default {
	data() {
		return {
			registerConfig: {},
			indent: 'all',
			customNavTitle: "",
			memberInfo: {
				headimg: ''
			},
			formData: {
				dealer_name: '', //经销商名称
				bank_name: '', //银行姓名
				bank_account: '', //银行卡号
				bank_address: '', //银行支行
				alipay_name: '', //支付宝姓名
				alipay_account: '', //支付宝账号
				alipay_qrcode: '', //支付宝收款二维码
				wechat_name: '', //微信姓名
				wechat_account: '', //微信账号
				wechat_qrcode: '', //微信收款二维码
			},
			langList: [],
			langIndex: 0,
			seconds: 120,
			timer: null,
			isSend: false,
			captcha: {
				id: '',
				img: ''
			},
			isIphoneX: false,
			current: 0,
			memberConfig: {
				is_audit: 0,
				is_enable: 0
			},
			defaultRegions: [],
			operationType: '',
			title: '',
			content: '',
			editType: ""
		};
	},
	onLoad(option) {
		if (option.back) {
			this.back = option.back;
		}
		this.isIphoneX = this.$util.uniappIsIPhoneX()
	},
	onShow() {
		if (!uni.getStorageSync('token')) {

		} else {
			this.getInfo();
		}
	},
	watch: {
		storeToken: function(nVal, oVal) {
			if (nVal) {
				this.getInfo();
			}
		}
	},
	computed: {
		storeToken() {
			return this.$store.state.token;
		}
	},
	methods: {
		setNavbarTitle(data) {
			let title = '个人资料';
			switch (data) {
				case 'dealer_name':
					title = '经销商名称';
					break;
				case 'bank_name':
					title = '银行姓名';
					break;
				case 'bank_account':
					title = '银行卡号';
					break;
				case 'bank_address':
					title = '银行支行';
					break;
				case 'alipay_name':
					title = '支付宝姓名'
					break;
				case 'alipay_account':
					title = '支付宝账号';
					break;
				case '微信姓名':
					title = '支付宝账号';
					break;
				case 'wechat_account':
					title = '微信账号';
					break;
			}
			this.title = title
			this.editType = data
			this.$refs.inputDialog.open()
		},
		// 初始化用户信息
		getInfo() {
			this.$api.sendRequest({
				url: '/dealer/api/dealer/detail',
				success: res => {
					if (res.code == 0) {
						this.memberInfo = res.data;
						this.formData.dealer_name = this.memberInfo.dealer_name || ""; //经销商名称
						this.formData.bank_name = this.memberInfo.bank_name || "" //银行姓名
						this.formData.bank_account = this.memberInfo.bank_account || ""; //银行卡号
						this.formData.bank_address = this.memberInfo.bank_address || ""; //银行支行
						this.formData.alipay_name = this.memberInfo.alipay_name || ""; //支付宝姓名
						this.formData.alipay_account = this.memberInfo.alipay_account || ""; //支付宝账号
						this.formData.alipay_qrcode = this.memberInfo.alipay_qrcode ||
							""; //支付宝收款二维码
						this.formData.wechat_name = this.memberInfo.wechat_name || ""; //微信姓名
						this.formData.wechat_account = this.memberInfo.wechat_account || ""; //微信账号
						this.formData.wechat_qrcode = this.memberInfo.wechat_qrcode ||
							""; //微信收款二维码
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		// 切换编辑项
		modifyInfo(action) {
			this.setNavbarTitle(action)
		},
		// 编辑
		onChangeContent(e) {
			console.log(e.detail.value);
			this.content = e.detail.value
		},

		headImage(action) {
			this.$util.redirectTo("/sellStore/dealerInfo/modifyQrcode", {
				type: action
			});
		},
		confirm() {
			console.log(this.editType, this.content);
			this.formData[this.editType] = this.content
			console.log(this.formData);
			this.$api.sendRequest({
				url: '/dealer/api/dealer/upDealerInfo',
				data: this.formData,
				success: res => {
					this.content = ''
					this.$refs.inputDialog.close()
					this.$util.showToast({
						title: res.message
					});
					if (res.code == 0) {
						this.getInfo()
					}
				}
			});
		},
	}
};
