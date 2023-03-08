export default {
	methods: {
		//获取邀请列表
		getList() {
			this.$api.sendRequest({
				url: '/memberrecommend/api/memberrecommend/lists',
				data: {
					page: this.page,
					page_size: this.page_size
				},
				success: res => {
					this.inviteList = this.inviteList.concat(res.data.list);
					this.total_num = res.data.page_count;
				}
			});
		},
		moreList() {
			this.page++;
			this.isClick = false;
			if (this.page < this.total_num) {
				this.getList();
				this.isClick = true;
			} else if (this.page == this.total_num) {
				this.getList();
			}
		},
		getBaseInfo() {
			this.$api.sendRequest({
				url: '/memberrecommend/api/memberrecommend/info',
				success: res => {
					if (res.code == 0) {
						this.info = res.data;
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				}
			});
		},
		openSharePopup() {
			this.$refs.sharePopup.open();
		},
		// 关闭分享弹出层
		closeSharePopup() {
			this.$refs.sharePopup.close();
		},
		// 打开规则说明弹出层
		openRulePopup() {
			this.$refs.rulePopup.open();
		},
		// 打开规则说明弹出层
		closeRulePopup() {
			this.$refs.rulePopup.close();
		},
		copyUrl() {
			let text = this.$config.h5Domain + '/pages/index/index';
			if (this.memberId) text += '?source_member=' + this.memberId;
			this.$util.copy(text, () => {
				this.closeSharePopup();
			});
		},
		// 打开海报弹出层
		openPosterPopup() {
			this.getPoster();
			this.$refs.sharePopup.close();
			this.$refs.posterPopup.open();
		},
		// 关闭海报弹出层
		closePosterPopup() {
			this.$refs.posterPopup.close();
		},
		//生成海报
		getPoster() {
			//活动海报信息
			let qrcode_param = {
				source_member: this.memberId
			};
			this.$api.sendRequest({
				url: "/memberrecommend/api/memberrecommend/poster",
				data: {
					page: '/pages/index/index',
					qrcode_param: JSON.stringify(qrcode_param)
				},
				success: res => {
					if (res.code == 0) {
						this.poster = res.data.path + "?time=" + new Date().getTime();
					} else {
						this.posterMsg = res.message;
					}
				}
			});
		},
		savePoster() {
			let url = this.$util.img(this.poster);
			uni.downloadFile({
				url: url,
				success: (res) => {
					if (res.statusCode === 200) {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								this.$util.showToast({
									title: "保存成功"
								});
							},
							fail: () => {
								this.$util.showToast({
									title: "保存失败，请稍后重试"
								});
							}
						});
					}
				},
				fail: (e) => {
				}
			});
		}
	}
}