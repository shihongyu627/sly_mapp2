<template>
	<view class="ns-time">
		<uni-popup type="bottom" ref="selectTime">
			<view class="box">
				<view class="title">
					<block v-if="obj.delivery && obj.delivery.delivery_type == 'local'">选择送达时间</block>
					<block v-if="obj.delivery && obj.delivery.delivery_type == 'store'">选择自提时间</block>
					<text class="iconfont iconclose" @click="close"></text>
				</view>
				<view class="body">
					<!-- 左侧日期选择 -->
					<scroll-view :scroll-y="true" class="left">
						<view class="item" :class="index == keyJudge ? 'itemDay' : ''" v-for="(item, index) in dayData" :key="index" @click="selectTime('days', index, 'yes')">
							<block v-if="item.title">{{ item.title }}</block>
							<block v-else>{{ item.month }}</block>
							<text class="itemtext">{{ item.Day }}</text>
						</view>
					</scroll-view>
					<!-- 右侧时间选择 -->
					<scroll-view :scroll-y="true" class="right">
						<view
							class="item"
							:class="key == keyJudge && index == keys ? 'itemTime' : ''"
							v-for="(item, index) in timeData"
							:key="index"
							@click="selectTime('time', index, 'yes')"
						>
							{{ item }}
							<text v-if="key == keyJudge && index == keys" class="iconfont iconyuan_checked color-base-text"></text>
						</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import unipopup from '@/components/uni-popup/uni-popup.vue';
export default {
	components: {
		unipopup
	},
	data() {
		return {
			//选中日期的键值
			key: 0,
			//选中时间的键值
			keys: 0,
			//渲染用数据
			obj: {},
			//左侧渲染时间
			dayData: [],
			// 右侧渲染数据
			timeData: [],
			//判断弹窗打开
			judge: false,
			//判断左侧列表是否为日期选中列表
			keyJudge: 0,
			//当前时间时间戳
			dayTime: 0
		};
	},
	methods: {
		refresh(){
			this.key = 0;
			this.keys = 0;
			this.keyJudge = 0;
		},
		/**
		 * 弹窗打开
		 */
		open(obj, type) {
			this.dayData = [];
			this.timeData = [];
			this.obj = obj;
			this.toDay(obj.dataTime.time_type, obj.dataTime.time_week);
			if (this.judge) {
				if (type == 'no') {
					this.selectTime('', '', type);
				} else {
					this.$refs.selectTime.open();
				}
			}
		},
		/**
		 * 时间选择
		 */
		selectTime(type, index, judge) {
			if (type == 'days') {
				this.keyJudge = index;
				this.toTime();
			} else if (type == 'time') {
				this.keys = index;
				this.key = this.keyJudge;
				let obj = this.dayData[this.key];
				obj.time = this.timeData[this.keys];
				this.$emit('selectTime', { data: obj, type: judge });
				this.$refs.selectTime.close();
			}

			if (judge == 'no') {
				this.toTime(judge);
				let obj = this.dayData[0];
				obj.time = this.timeData[0];
				this.$emit('selectTime', { data: obj, type: judge });
			}
			this.$forceUpdate();
		},
		/**
		 * 弹窗关闭
		 */
		close() {
			this.$refs.selectTime.close();
		},
		/**
		 * 左侧数据处理
		 */
		toDay(type, obj) {
			let today = new Date();
			let nowYear = today.getFullYear(); //当前年
			let nowMonth = today.getMonth() + 1; //当前月
			let nowDate = today.getDate(); //当前日
			let nowDay = today.getDay(); //当前星期几
			let endDay = new Date(nowYear, nowMonth, 0).getDate(); //当月多少天
			let Hours = today.getHours();
			let Minutes = today.getMinutes();
			this.dayTime = Number(Hours) * 3600 + Number(Minutes) * 60; //获取到当前时分秒的时间戳
			let judge = false;
			let num = 1; //记录循环执行过的次数

			if (obj.time_week && obj.time_week.length == 7) {
				//判断是否七天全有
				judge = true;
			}

			for (let i = 0; i < 7; i++) {
				let objects = {};
				let dayStr = '';
				switch (nowDay) {
					case 1:
						dayStr = '周一';
						break;
					case 2:
						dayStr = '周二';
						break;
					case 3:
						dayStr = '周三';
						break;
					case 4:
						dayStr = '周四';
						break;
					case 5:
						dayStr = '周五';
						break;
					case 6:
						dayStr = '周六';
						break;
					case 0:
						dayStr = '周日';
						break;
				}
				//判断当天是否能够配送、自提
				if (type == 0 || judge || obj.indexOf(nowDay.toString()) != -1) {
					switch (num) {
						case 1:
							if (i == 0) {
								if (this.obj.dataTime.end_time < this.dayTime) {
									i = i - 1;
								} else {
									objects = {
										title: '今天',
										type: 'special',
										month: nowMonth + '月' + nowDate + '日',
										Day: '(' + dayStr + ')'
									};
									this.dayData.push(objects); //左侧日期数据处理
								}
							}
							break;
						case 2:
							if (i == 0 || i == 1) {
								objects = {
									title: '明天',
									month: nowMonth + '月' + nowDate + '日',
									Day: '(' + dayStr + ')'
								};
								this.dayData.push(objects); //左侧日期数据处理
							}
							break;
						default:
							objects = {
								title: '',
								month: nowMonth + '月' + nowDate + '日',
								Day: '(' + dayStr + ')'
							};
							this.dayData.push(objects); //左侧日期数据处理
					}
				} else {
					i = i - 1;
				}

				if (nowDate != endDay) {
					nowDate += 1;
				} else {
					if (nowMonth != 12) {
						nowMonth += 1;
					} else {
						nowMonth = 1;
					}
					nowDate = 1;
				}

				if (nowDay != 6) {
					nowDay += 1;
				} else {
					nowDay = 0;
				}
				num += 1;

				if (i == 6) {
					this.judge = true;
				}
			}

			this.toTime(); //处理右侧时间数据
		},
		/**
		 * 处理右侧时间数据
		 */
		toTime(judge) {
			//并非打开弹窗进入时，所有数据置零
			if (judge == 'no') {
				this.key = 0;
				this.keys = 0;
				this.keyJudge = 0;
			}

			this.timeData = [];

			let remainder = 0;
			//当天配送自提的话，向后推迟30分钟
			let newDayTime = JSON.parse(JSON.stringify(this.dayTime));
			newDayTime = Math.ceil(this.dayTime / 600) * 600 + 1800;

			//判断选中是否为当天
			let timeJudage = false;
			if (this.dayData[this.keyJudge] && this.dayData[this.keyJudge].type && newDayTime > this.obj.dataTime.start_time) timeJudage = true;

			//后台返回初始时间与结束时间为0时,为方便判断,修改结束时间
			if (this.obj.dataTime.end_time == 0 && this.obj.dataTime.start_time == 0) {
				this.obj.dataTime.end_time = 86400;
			}

			// 左侧时间循环次数
			let num = 0;
			// 左侧列表添加的时间
			let time = 0;

			if (timeJudage) {
				//配送、自提时间为当天时间的话
				// 配送、自提时间为当天时间的话,当前时间向后推迟30分钟
				num = parseInt((parseInt(this.obj.dataTime.end_time) - parseInt(newDayTime)) / 1200) + 1;
				remainder = (parseInt(this.obj.dataTime.end_time) - parseInt(newDayTime)) % 1200;
				time = parseInt(newDayTime);
			} else {
				//配送、自提时间不为当天时间的话
				num = parseInt((parseInt(this.obj.dataTime.end_time) - parseInt(this.obj.dataTime.start_time)) / 1200);
				remainder = (parseInt(this.obj.dataTime.end_time) - parseInt(this.obj.dataTime.start_time)) % 1200;

				if (remainder != 0) {
					this.obj.dataTime.start_time = parseInt(parseInt(this.obj.dataTime.start_time) / 1200) * 1200;
				}

				time = parseInt(this.obj.dataTime.start_time);
			}
			let end_time = 0;
			for (let i = 0; i < num; i++) {
				if (timeJudage) {
					if (i != 0) {
						time = parseInt(time) + 1200;
					}
				} else {
					if (i != 0) {
						time = parseInt(time) + 1200;
					}
					// time = parseInt(time) + 1200
				}
				this.timeData[i] = this.$util.getTimeStr(time);
			}
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss" scoped>
.box {
	height: 728rpx;
	.title {
		padding: 0 30rpx;
		box-sizing: border-box;
		text-align: center;
		font-size: 28rpx;
		font-weight: bold;
		position: relative;
		height: 90rpx;
		line-height: 90rpx;
		border-bottom: 1rpx solid #f7f4f4;
		.iconclose {
			font-size: 26rpx;
			color: #909399;
			position: absolute;
			right: 30rpx;
			top: 50%;
			transform: translateY(-50%);
		}
	}
	.body {
		width: 100%;
		height: calc(100% - 90rpx);
		display: flex;
		align-items: center;
		.left {
			width: 230rpx;
			background: #f8f8f8;
			height: 100%;
			.item {
				width: 100%;
				padding: 16rpx 30rpx;
				box-sizing: border-box;
				text-align: center;
				font-size: 24rpx;
				display: flex;
				align-items: center;
			}
			.itemDay {
				background: #ffffff;
			}
		}
		.right {
			width: calc(100% - 230rpx);
			height: 100%;
			padding: 0 30rpx;
			box-sizing: border-box;
			.item {
				width: 100%;
				font-size: 24rpx;
				border-bottom: 1rpx solid #eeeeee;
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 72rpx;
				.iconyuan_checked {
					font-size: 28rpx;
					margin-right: 30rpx;
				}
			}
			.itemTime {
				color: var(--main-color);
			}
		}
	}
}
</style>
