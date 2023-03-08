import Calendar from '@/components/uni-calendar/util.js';
export default {
	data() {
		return {
			rule: [
				{}
			],
			hasSign: 0, //今天是否签到
			signDaysSeries: 0, //连续签到次数
			timestamp: "", //当前的时间戳
			time: "", //当前日期
			MonthData: [], //本月日期信息
			signList: [],
			back: '', //返回页
			redirect: '', //返回方式
			successTip: {},
			startDate: null,
			endDate: null,
			isActive: "", //判断点击
			signState: 1,
			headimg: '',
			point: 0,
			growth: 0,
			signPoint: 0,
			signGrowth: 0,
			rewardRuleDay: [],
			cycle: 0 
		};
	},
	methods: {
		// 获取签到累积柚币
		getSignPointData() {
			this.$api.sendRequest({
				url: '/api/memberaccount/sum',
				data: {
					account_type: 'point',
					from_type: 'signin'
				},
				success: res => {
					if (res.code == 0) {
						this.signPoint = res.data;
					}
				}
			});
		},
		// 获取签到累积成长值
		getSignGrowthData() {
			this.$api.sendRequest({
				url: '/api/memberaccount/sum',
				data: {
					account_type: 'growth',
					from_type: 'signin'
				},
				success: res => {
					if (res.code == 0) {
						this.signGrowth = res.data;
					}
				}
			});
		},
		// 签到是否开启
		getSignState() {
			this.$api.sendRequest({
				url: '/api/membersignin/getSignStatus',
				success: res => {
					if (res.code == 0) {
						this.signState = res.data.is_use;
					}
				}
			});
		},
		navigateBack() {
			if (this.back != '') {
				this.$util.redirectTo(this.back, {}, this.redirect);
			} else {
				this.$util.redirectTo('/pages/member/index', {}, 'reLaunch');
			}
		},
		//获取rule
		getRule() {
			this.$api.sendRequest({
				url: '/api/membersignin/award',
				success: res => {
					if (res.code == 0) {
						this.cycle = res.data.cycle; 
						this.rule = res.data.reward;
						if (this.rule.length > 1) {
							this.rule.forEach((item, index)=>{
								if (index) this.rewardRuleDay.push(parseInt(item.day));
							})
						} 
						var showSignDays = [];
						for (let i = 1; i <= res.data.cycle; i++) {
							showSignDays.push({day: i})
						}
						this.showSignDays = showSignDays;
					}
				}
			});
		},
		//获取连续签到次数
		getSignInfo() {
			this.$api.sendRequest({
				url: '/api/member/info',
				success: res => {
					if (res.code == 0) {
						this.timestamp = res.timestamp;
						this.time = this.$util.timeStampTurnTime(this.timestamp).slice(0, 10)
						this.headimg = res.data.headimg;
						this.signDaysSeries = res.data.sign_days_series;
						
						this.$refs.loadingCover.hide();
					}
				}
			});
		},
		//判断当前是否签到
		getIsSign() {
			this.$api.sendRequest({
				url: '/api/membersignin/issign',
				success: res => {
					if (res.code == 0) {
						this.hasSign = res.data
						this.getSignInfo();
						this.getSignPointData();
						this.getSignGrowthData();
					}
				}
			});
		},
		//签到
		sign() {
			if (this.signState == 0) {
				this.$util.showToast({
					title: '签到未开启'
				})
			}

			if (!this.hasSign && this.signState == 1) {
				this.$api.sendRequest({
					url: '/api/membersignin/signin',
					success: res => {
						if (res.code == 0) {
							this.successTip = res.data;
							this.$refs.uniPopup.open()
							this.getSignInfo();
							this.getSignPointData();
							this.getSignGrowthData();
							this.hasSign = 1;
							this.signDaysSeries = this.signDaysSeries + 1;
						} else {
							this.$util.showToast({
								title: res.message
							})
						}
					}
				});
			}
		},
		close() {
			this.$refs.uniPopup.close()
		}
	},
	computed:{
		pointTomorrow: function(){
			var signDaysSeries = this.signDaysSeries + 1;
			var point = this.rule[0].point ? parseInt(this.rule[0].point) : 0;
			for (let i = 1; i < this.rule.length; i++) {
				let reward = this.rule[i];
				if (reward.day == signDaysSeries && reward.point) point += parseInt(reward.point);
			}
			return point;
		},
		showDay: function(){
			return parseInt(this.signDaysSeries / 7) * 7 + 1;
		}
	}
};
