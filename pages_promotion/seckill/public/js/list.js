export default {
	data() {
		return {
			mescroll: null,
			timeList: [], //时间列表
			seckillId: null, //选中的时间块
			seckillIndex: null, //选中时间块的index
			dataList: [], //选中时间块的商品列表
			index: null, //当前正在抢购的index,
			timer: null,
			noStartList: [],
			show: false,
		};
	},
	watch: {
		seckillId(newName, oldName) {
			if (newName && oldName && newName != oldName) {
				this.mescroll.resetUpScroll(false);
			}
		}
	},
	methods: {
		goodsImg(imgStr) {
			let imgs = imgStr.split(',');
			return imgs[0] ? this.$util.img(imgs[0], {
				size: 'mid'
			}) : this.$util.getDefaultImage().goods;
		},
		//时间转换
		transformSeckillTime(time) {
			time = parseFloat(time);
			var hour = parseInt(time / 3600);
			var minute = parseInt((time % 3600) / 60);
			var second = parseInt(time % 60);

			if (hour < 10) hour = '0' + hour;
			if (minute < 10) minute = '0' + minute;
			if (second < 10) second = '0' + second;

			return hour + ':' + minute;
		},
		isEnd(isShow) {
			if (!isShow) return;
			this.$util.showToast({
				title: "限时秒杀活动已结束",
			});
		},
		getTimeList() {
			this.$api.sendRequest({
				url: '/seckill/api/seckill/lists',
				success: res => {
					let data = res.data;
					if (!data) return;
					let time = new Date(res.timestamp * 1000);
					let newTimes = time.getHours() * 60 * 60 + time.getMinutes() * 60 + time.getSeconds();
					var tempList = Object.values(data.list);
					tempList.forEach((v, k) => {
						if (v.seckill_start_time <= newTimes && newTimes < v.seckill_end_time) {
							v.isNow = true;
						} else {
							v.isNow = false;
						}
						
						tempList[k]['startTimeMachine'] = this.$util.countDown(v.seckill_start_time - newTimes);
						tempList[k]['endTimeMachine'] = this.$util.countDown(v.seckill_end_time - newTimes);
						if(v.type == 'tomorrow') tempList[k]['startTimeMachine'] = this.$util.countDown(86400 - newTimes + v.seckill_start_time);
						
					});
					this.timeList = tempList;
					if (tempList.length) {
						this.seckillId = this.timeList[0]['id'];
						this.seckillIndex = 0;
						this.show = true;
					}
					var self = this;
					setInterval(function() {
						self.getExpirationTime();
					}, 1000);
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		getData(mescroll) {

			this.mescroll = mescroll;
			this.$api.sendRequest({
				url: '/seckill/api/seckillgoods/page',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					seckill_time_id: this.seckillId
				},
				success: res => {
					
					let newArr = []
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						})
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
					this.dataList = this.dataList.concat(newArr); //追加新数据
					
					if(this.dataList.length == 0) this.showEmpty = true;
					
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail() {
					//联网失败的回调
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		getExpirationTime() {
			var timeListData = this.timeList,
				currDate = new Date(),
				dateStr = currDate.toLocaleDateString(),
				expirationTime,
				nowTime,
				obj;
			
			for (let i in timeListData) {
				if (timeListData[i].isNow) {
					this.ident = true;
					nowTime = Date.parse(currDate);
					expirationTime = Date.parse(dateStr) + parseInt(timeListData[i].seckill_end_time) * 1000;
					let endSeconds = (expirationTime - nowTime) / 1000;
					obj = this.$util.countDown(endSeconds);
					this.hour = obj.h;
					this.minute = obj.i;
					this.second = obj.s;
					if (endSeconds == 0) {
						let next = parseInt(i) + 1;
						if (next < timeListData.length) this.seckillIndex = next;
						this.timeList[i].isNow = false;
						
					}
					return false;
				}
			}
			this.ident = false;
		},
		ontabtap(e, f) {
			if(f != this.seckillIndex)this.dataList = [];
			this.seckillId = e;
			this.seckillIndex = f;
		},
		//跳转到详情页
		toGoodsDetail(item) {
			if(this.timeList[this.seckillIndex].type == 'tomorrow'){
				this.$util.showToast({
					title: "秒杀活动还未开启，敬请期待！",
				});
				
				return false;
			}
			
			this.$api.sendRequest({
				url: '/api/config/time',
				data: {},
				success: res => {
					let time = new Date(res.timestamp * 1000);
					let newTimes = time.getHours() * 60 * 60 + time.getMinutes() * 60 + time.getSeconds();
					if (this.timeList[this.seckillIndex].seckill_start_time <= newTimes && newTimes < this.timeList[this.seckillIndex].seckill_end_time) {
						this.timeList[this.seckillIndex].isNow = true;
					} else {
						this.timeList[this.seckillIndex].isNow = false;
					}

					this.$forceUpdate();

					if (!this.timeList[this.seckillIndex].isNow) {
						this.$util.showToast({
							title: "秒杀活动即将开启，敬请期待！",
						});
						return;
					}
					this.$util.redirectTo('/pages_promotion/seckill/detail', {
						seckill_id: item.id
					});

				}
			});
		},
		imageError(index) {
			this.dataList[index].goods_image = this.$util.getDefaultImage().goods;
			this.$forceUpdate();
		},
		goodsTag(data) {
			return data.label_name || '';
		}
	},
	onShareAppMessage(res) {
		var title = '一大波的秒杀福利就要开始了，真的不来看看嘛';
		var path = '/pages_promotion/seckill/list';
		return {
			title: title,
			path: path,
			success: res => {},
			fail: res => {}
		};
	},
	onHide() {
		clearInterval(this.timer);
	}
};
