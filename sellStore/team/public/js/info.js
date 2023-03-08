export default {
	data() {
		return {
			value: '',
			type: "",
			formData: {
				rankname: '',
				base_salary: '',
				worker_id:""
			},
			groupList: []
		};
	},
	onLoad(option) {
		if (option.type == 'money') {
			this.formData.base_salary = option.value || ''
		} else {
			this.formData.rankname = option.value || ''
		}
		this.type = option.type || ''
		this.formData.worker_id = option.worker_id || ''
		console.log(option, 999);
		this.getGrouplistsData()
	},
	onShow() {
		if (!uni.getStorageSync('token')) {

		} else {}
	},
	onHide() {

	},
	methods: {
		getGrouplistsData() {
			this.$api.sendRequest({
				url: '/dealer/api/worker/typelists',
				data: {},
				success: res => {
					let msg = res.message;
					console.log(res.data);
					if (res.code == 0) {
						this.groupList = res.data;
					} else {
						this.$util.showToast({
							title: msg
						});
					}

				},
				fail: res => {}
			});
		},
		save(type) {
			let data = {
				rankname: this.formData.rankname,
				base_salary: this.formData.base_salary,
				worker_id: this.formData.worker_id
			};
			this.$api.sendRequest({
				url: '/dealer/api/worker/edit',
				data: data,
				success: res => {
					this.$util.showToast({
						title: res.message
					});
					if (res.code == 0) {
						uni.navigateBack({
							delta: 1
						});
					} else {}
				},
				fail: res => {
					this.flag = false;
				}
			});

		},
		//选择分组
		pickerEventGroup(e) {
			let index = e.target.value;
			console.log(e, index);
			this.formData.rankname = this.groupList[index].value;
		},
	}

}
