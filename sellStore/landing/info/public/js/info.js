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
				luodi_bank_name: '', //银行姓名
				luodi_bank_account: '', //银行卡号
				luodi_bank_address: '', //银行支行
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
			let title = '账户信息';
			switch (data) {
				case 'luodi_bank_name':
					title = '银行名称';
					break;
				case 'luodi_bank_account':
					title = '银行卡号';
					break;
				case 'luodi_bank_address':
					title = '银行支行';
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
						this.formData.luodi_bank_name = this.memberInfo.luodi_bank_name || "" //银行姓名
						this.formData.luodi_bank_account = this.memberInfo.luodi_bank_account || ""; //银行卡号
						this.formData.luodi_bank_address = this.memberInfo.luodi_bank_address || ""; //银行支行
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
