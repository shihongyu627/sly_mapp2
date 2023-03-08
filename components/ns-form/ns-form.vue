<template>
	<view class="form-wrap form-component">
		<block v-for="(item, index) in formData">
			<view class="order-wrap" v-if="item.controller == 'Text'">
				<view class="order-cell">
					<view class="name">
						<text class="tit">{{ item.value.title }}</text>
						<text class="required">{{ item.value.required ? '*' : '' }}</text>
					</view>
					<view class="box"><input type="text" :placeholder="item.value.placeholder" placeholder-class="placeholder color-tip" v-model="item.val" /></view>
				</view>
			</view>

			<view class="order-wrap" v-if="item.controller == 'Textarea'">
				<view class="order-cell flex-box textarea">
					<view class="name">
						<text class="tit">{{ item.value.title }}</text>
						<text class="required">{{ item.value.required ? '*' : '' }}</text>
					</view>
					<view class="box"><textarea :placeholder="item.value.placeholder" placeholder-class="placeholder color-tip" v-model="item.val"></textarea></view>
				</view>
			</view>

			<picker mode="selector" :range="item.value.options" v-if="item.controller == 'Select'" @change="pickerChange($event, index)">
				<view class="order-wrap">
					<view class="order-cell">
						<view class="name">
							<text class="tit">{{ item.value.title }}</text>
							<text class="required">{{ item.value.required ? '*' : '' }}</text>
						</view>
						<view class="box">
							<text v-if="item.val != ''">{{ item.val }}</text>
							<text v-else class="color-tip">请选择</text>
						</view>
						<text class="iconfont iconright"></text>
					</view>
				</view>
			</picker>

			<view class="order-wrap" v-if="item.controller == 'Checkbox'">
				<view class="order-cell">
					<view class="name">
						<text class="tit">{{ item.value.title }}</text>
						<text class="required">{{ item.value.required ? '*' : '' }}</text>
					</view>
					<view class="box check-group-box">
						<checkbox-group @change="checkboxChange($event, index)">
							<label v-for="(v, k) in item.option_lists" :key="k">
								<checkbox :value="v.value" :checked="v.checked" />
								<view class="checkbox">
									<text class="iconfont" :class="{'iconfuxuankuang2': !v.checked, 'iconfuxuankuang1 color-base-text': v.checked }"></text>
									{{ v.value }}
								</view>
							</label>
						</checkbox-group>
					</view>
				</view>
			</view>

			<view class="order-wrap" v-if="item.controller == 'Radio'">
				<view class="order-cell">
					<view class="name">
						<text class="tit">{{ item.value.title }}</text>
						<text class="required">{{ item.value.required ? '*' : '' }}</text>
					</view>
					<view class="box radio-group-box">
						<radio-group @change="radioChange($event, index)">
							<label v-for="(v, k) in item.option_lists" :key="k">
								<radio :value="v.value" :checked="item.val == v.value" />
								<view class="radio-box">
									<text class="iconfont" :class="{'iconyuan_checkbox': item.val != v.value, 'iconyuan_checked color-base-text': item.val == v.value }"></text>
									{{ v.value }}
								</view>
							</label>
						</radio-group>
					</view>
				</view>
			</view>

			<view class="order-wrap" v-if="item.controller == 'Img'">
				<view class="order-cell flex-box">
					<view class="name">
						<text class="tit">{{ item.value.title }}</text>
						<text class="required">{{ item.value.required ? '*' : '' }}</text>
					</view>
					<view class="box img-boxs">
						<view class="img-box" v-for="(v, k) in item.img_lists" :key="k" @click="uploadImg(index)">
							<image :src="$util.img(v)" mode="aspectFill"></image>
							<text class="iconfont iconguanbi" @click.stop="delImg(k, index)"></text>
						</view>
						<view class="img-box" @click="addImg(index)"><text class="iconfont iconadd1"></text></view>
					</view>
				</view>
			</view>

			<view class="order-wrap" v-if="item.controller == 'Date'">
				<view class="order-cell">
					<view class="name">
						<text class="tit">{{ item.value.title }}</text>
						<text class="required">{{ item.value.required ? '*' : '' }}</text>
					</view>
					<view class="box box-flex">
						<picker mode="date" :value="item.val" @change="bindDateChange($event, index)">
							<view class="uni-input" :class="{ 'color-tip': !item.val }">{{ item.val ? item.val : item.value.placeholder }}</view>
						</picker>
					</view>
					<text class="iconfont iconright"></text>
				</view>
			</view>

			<view class="order-wrap" v-if="item.controller == 'Datelimit'">
				<view class="order-cell flex-box">
					<view class="name">
						<text class="tit">{{ item.value.title }}</text>
						<text class="required">{{ item.value.required ? '*' : '' }}</text>
					</view>
					<view class="box date-boxs">
						<view class="date-box">
							<picker mode="date" :value="item.start_date" @change="bindStartDateChange($event, index)">
								<view class="picker-box">
									<view class="uni-input" :class="{ 'color-tip': !item.start_date }">{{ item.start_date ? item.start_date : item.value.placeholder_start }}</view>
								</view>
							</picker>
						</view>
						<view class="interval iconfont iconjian"></view>
						<view class="date-box">
							<picker mode="date" :value="item.end_date" @change="bindEndDateChange($event, index)">
								<view class="picker-box">
									<view class="uni-input" :class="{ 'color-tip': !item.end_date }">{{ item.end_date ? item.end_date : item.value.placeholder_end }}</view>
								</view>
							</picker>
						</view>
					</view>
				</view>
			</view>

			<view class="order-wrap" v-if="item.controller == 'Time'">
				<view class="order-cell">
					<view class="name">
						<text class="tit">{{ item.value.title }}</text>
						<text class="required">{{ item.value.required ? '*' : '' }}</text>
					</view>
					<view class="box box-flex">
						<picker mode="time" :value="item.val" @change="bindTimeChange($event, index)">
							<view class="uni-input" :class="{ 'color-tip': !item.val }">{{ item.val ? item.val : item.value.placeholder }}</view>
						</picker>
					</view>
					<text class="iconfont iconright"></text>
				</view>
			</view>

			<view class="order-wrap" v-if="item.controller == 'Timelimit'">
				<view class="order-cell flex-box">
					<view class="name">
						<text class="tit">{{ item.value.title }}</text>
						<text class="required">{{ item.value.required ? '*' : '' }}</text>
					</view>
					<view class="box date-boxs">
						<view class="date-box">
							<picker mode="time" :value="item.start_time" @change="bindStartTimeChange($event, index)">
								<view class="picker-box">
									<view class="uni-input" :class="{ 'color-tip': !item.start_time }">{{ item.start_time ? item.start_time : item.value.placeholder_start }}</view>
								</view>
							</picker>
						</view>
						<view class="interval iconfont iconjian"></view>
						<view class="date-box">
							<picker mode="time" :value="item.end_time" @change="bindEndTimeChange($event, index)">
								<view class="picker-box">
									<view class="uni-input" :class="{ 'color-tip': !item.end_time }">{{ item.end_time ? item.end_time : item.value.placeholder_end }}</view>
								</view>
							</picker>
						</view>
					</view>
				</view>
			</view>

			<view class="order-wrap" v-if="item.controller == 'City'">
				<view class="order-cell box-flex">
					<view class="name">
						<text class="tit">{{ item.value.title }}</text>
						<text class="required">{{ item.value.required ? '*' : '' }}</text>
					</view>
					<view class="box">
						<pick-regions :default-regions="item.default_regions" :select-arr="item.select_arr" @getRegions="handleGetRegions($event, index)">
							<view class="select-address " :class="{ empty: !item.val, 'color-tip': !item.val }">
								{{ item.val ? item.val : item.select_arr == '2' ? '请选择省市' : '请选择省市区/县' }}
							</view>
						</pick-regions>
					</view>
					<text class="iconfont iconright"></text>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
import pickRegions from '@/components/pick-regions/pick-regions.vue';
export default {
	name: 'ns-form',
	components: {
		pickRegions
	},
	props: {
		data: {
			type: Array,
			default: {}
		},
		customAttr: {
			type: Object,
			default: function(){
				return {}
			}
		}
	},
	data() {
		return {
			formData: this.data
		};
	},
	created() {
		this.setFormData();
	},
	watch:{
		data: function(){
			this.setFormData();
		}
	},
	methods: {
		setFormData(){
			this.formData = this.data;
				
			this.formData.forEach(item => {
				if (!item.val) item.val = item.value.default ? item.value.default : '';
				
				if (item.value.options) {
					item.option_lists = [];
					item.value.options.forEach((v, k) => {
						var obj = {};
						obj.value = v;
						obj.checked = false;
						if (item.controller == 'Radio' && ( (!item.val && k == 0 ) || (item.val && item.val == v) )) {
							obj.checked = true;
							item.val = v;
						}
						if (item.controller == 'Checkbox' && item.val) {
							let val = item.val.split(',');
							obj.checked = val.indexOf(v) != -1;
						}
						item.option_lists.push(obj);
					});
				}
			
				if (item.controller == 'Img') {
					item.img_lists = item.val ? item.val.split(',') : [];
				}
			
				if (item.controller == 'Date' && !item.val) {
					if (item.value.is_show_default) {
						if (item.value.is_current) {
							item.val = this.getDate();
						} else {
							item.val = item.value.default;
						}
					} else {
						item.val = '';
					}
				}
			
				if (item.controller == 'Datelimit') {
					if (item.val) {
						let date = item.val.split(' - ');
						item.start_date = date[0];
						item.end_date = date[1];
					} else {
						item.val = '';
						
						if (item.value.is_show_default_start) {
							if (item.value.is_current_start) {
								item.start_date = this.getDate();
							} else {
								item.start_date = item.value.default_start;
							}
						} else {
							item.start_date = '';
						}
			
						if (item.value.is_show_default_end) {
							if (item.value.is_current_end) {
								item.end_date = this.getDate();
							} else {
								item.end_date = item.value.default_end;
							}
						} else {
							item.end_date = '';
						}
						if (item.start_date && item.end_date) {
							item.val = item.start_date + ' - ' + item.end_date;
						}
					}
				}
			
				if (item.controller == 'Time' && !item.val) {
					if (item.value.is_show_default) {
						if (item.value.is_current) {
							item.val = this.getTime();
						} else {
							item.val = item.value.default;
						}
					} else {
						item.val = '';
					}
				}
			
				if (item.controller == 'Timelimit') {
					if (item.val) {
						let time = item.val.split(' - ');
						item.start_time = time[0];
						item.end_time = time[1];
					} else {
						item.val = '';
			
						if (item.value.is_show_default_start) {
							if (item.value.is_current_start) {
								item.start_time = this.getTime();
							} else {
								item.start_time = item.value.default_start;
							}
						} else {
							item.start_time = '';
						}
			
						if (item.value.is_show_default_end) {
							if (item.value.is_current_end) {
								item.end_time = this.getTime();
							} else {
								item.end_time = item.value.default_end;
							}
						} else {
							item.end_time = '';
						}
			
						if (item.start_time && item.end_time) {
							item.val = item.start_time + ' - ' + item.end_time;
						}
					}
				}
			
				if (item.controller == 'City') {
					item.full_address = '';
					item.select_arr = item.value.default_type == 1 ? '2' : '3';
					if (item.val) item.default_regions = item.val.split('-');
					else item.default_regions = [];
				}
			});
		},
		verify() {
			let verify = true;

			for (let i = 0; i < this.formData.length; i++) {
				let item = this.formData[i];
				if (item.controller == 'Text') {
					if (item.value.required && !item.val) {
						verify = false;
						this.$util.showToast({
							title: '请输入' + item.value.title
						});
						break;
					}

					let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
					if (item.name == 'ID_CARD' && reg.test(item.val) === false) {
						verify = !item.value.required;
						if (verify == false) {
							this.$util.showToast({
								title: '身份证输入不合法'
							});
							return false;
						}
						if (verify == true && item.val != '') {
							this.$util.showToast({
								title: '身份证输入不合法'
							});
							return false;
						}
					}
				}

				if (item.controller == 'Textarea') {
					if (item.value.required && !item.val) {
						verify = false;
						this.$util.showToast({
							title: '请输入' + item.value.title
						});
						break;
					}
				}

				if (item.controller == 'Select') {
					if (item.value.required && !item.val) {
						verify = false;
						this.$util.showToast({
							title: '请选择' + item.value.title
						});
						break;
					}
				}

				if (item.controller == 'Checkbox') {
					if (item.value.required && !item.val) {
						verify = false;
						this.$util.showToast({
							title: '请至少选择一个' + item.value.title
						});
						break;
					}
				}

				if (item.controller == 'Img') {
					if (item.value.required && !item.val) {
						verify = false;
						this.$util.showToast({
							title: '请至少上传一张' + item.value.title
						});
						break;
					}
				}

				if (item.controller == 'Date') {
					if (item.value.required && !item.val) {
						verify = false;
						this.$util.showToast({
							title: '请选择' + item.value.title
						});
						break;
					}
				}

				if (item.controller == 'Datelimit') {
					if (item.value.required && !item.val) {
						verify = false;
						this.$util.showToast({
							title: '请选择' + item.value.title
						});
						break;
					}

					if (this.$util.timeTurnTimeStamp(item.start_date) > this.$util.timeTurnTimeStamp(item.end_date)) {
						verify = false;
						this.$util.showToast({
							title: '结束日期不能小于开始日期'
						});
						break;
					}
				}

				if (item.controller == 'Time') {
					if (item.value.required && !item.val) {
						verify = false;
						this.$util.showToast({
							title: '请选择' + item.value.title
						});
						break;
					}
				}

				if (item.controller == 'Timelimit') {
					if (item.value.required && !item.val) {
						verify = false;
						this.$util.showToast({
							title: '请选择' + item.value.title
						});
						break;
					}

					if (item.start_time >= item.end_time) {
						verify = false;
						this.$util.showToast({
							title: '结束时间必须大于开始时间'
						});
						break;
					}
				}

				if (item.controller == 'City') {
					if (item.value.required && !item.val) {
						verify = false;
						this.$util.showToast({
							title: '请选择' + item.value.title
						});
						break;
					}
				}
			}

			if (verify) {
				return this.formData;
			} else return verify;
		},
		pickerChange(e, index) {
			this.formData[index].val = this.data[index].value.options[e.detail.value];
			this.$forceUpdate();
		},
		checkboxChange: function(e, index) {
			this.formData[index].val = e.detail.value.toString();
			this.formData[index].option_lists.forEach(item => {
				item.checked = e.detail.value.indexOf(item.value) != -1;
			})
			this.$forceUpdate();
		},
		radioChange: function(e, index) {
			this.formData[index].val = e.detail.value;
			this.$forceUpdate();
		},
		// 修改图片
		uploadImg(index) {
			this.$util.upload(
				Number(this.formData[index].value.max_count),
				{
					path: 'evaluateimg'
				},
				res => {
					if (res.length > 0) {
						res.forEach(v => {
							if (this.formData[index].img_lists.length >= Number(this.formData[index].value.max_count)) {
								this.$util.showToast({
									title: '最多上传' + this.formData[index].value.max_count + '张图片'
								});
								return false;
							} else {
								this.formData[index].img_lists.push(v);
							}
						});
					}

					this.formData[index].val = this.formData[index].img_lists.toString();
					this.$forceUpdate();
				}
			);
		},
		// 添加图片
		addImg(index) {
			if (this.formData[index].img_lists.length >= Number(this.formData[index].value.max_count)) {
				this.$util.showToast({
					title: '最多上传' + this.formData[index].value.max_count + '张图片'
				});
				return false;
			}
			this.$util.upload(
				Number(this.formData[index].value.max_count),
				{
					path: 'evaluateimg'
				},
				res => {
					if (res.length > 0) {
						res.forEach(v => {
							this.formData[index].img_lists.push(v);
						});
					}
					this.formData[index].val = this.formData[index].img_lists.toString();
					this.$forceUpdate();
				}
			);
		},
		// index 当前数据的下标  k 当前图片的下标
		delImg(k, index) {
			this.formData[index].img_lists.splice(k, 1);
			this.formData[index].val = this.formData[index].img_lists.toString();
			this.$forceUpdate();
		},
		getDate() {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();

			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
		},
		getTime() {
			const date = new Date();
			let hour = date.getHours(); //得到小时
			let min = date.getMinutes(); //得到分钟

			hour = hour > 9 ? hour : '0' + hour;
			min = min > 9 ? min : '0' + min;
			return `${hour}:${min}`;
		},
		bindDateChange(e, index) {
			this.formData[index].val = e.detail.value;
			this.$forceUpdate();
		},
		bindStartDateChange(e, index) {
			this.formData[index].start_date = e.detail.value;
			this.$forceUpdate();
		},
		bindEndDateChange(e, index) {
			this.formData[index].end_date = e.detail.value;
			this.$forceUpdate();
			this.formData[index].val = this.formData[index].start_date + ' - ' + this.formData[index].end_date;
		},
		bindTimeChange(e, index) {
			this.formData[index].val = e.detail.value;
			this.$forceUpdate();
		},
		bindStartTimeChange(e, index) {
			this.formData[index].start_time = e.detail.value;
			this.$forceUpdate();
		},
		bindEndTimeChange(e, index) {
			this.formData[index].end_time = e.detail.value;
			this.formData[index].val = this.formData[index].start_time + ' - ' + this.formData[index].end_time;
			this.$forceUpdate();
		},
		// 获取选择的地区
		handleGetRegions(e, index) {
			this.formData[index].val = '';
			this.formData[index].val += e[0] != undefined ? e[0].label : '';
			this.formData[index].val += e[1] != undefined ? '-' + e[1].label : '';
			this.formData[index].val += e[2] != undefined ? '-' + e[2].label : '';
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss">
.order-wrap {
	padding: 20rpx 0;

	&:last-child {
		margin-bottom: 0;
		border-bottom: 0;
	}
}

.order-cell {
	display: flex;
	align-items: center;
	background: #fff;
	position: relative;
	
	&.textarea {
		align-items: unset;
	}

	&.clear-flex {
		display: block;

		.box {
			margin-top: 16rpx;
			text-align: left;
		}
	}

	&:last-child {
		margin-bottom: 0;
		border-bottom: 0;
	}

	&.align-top {
		align-items: flex-start;
	}

	text {
		font-size: $font-size-base;
	}

	.name {
		width: 160rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.tit {
		text-align: left;
		font-size: $font-size-base;

		text {
			font-size: $font-size-base;
		}
	}

	.required {
		color: red;
		font-size: 28rpx;
		margin-left: 4rpx;
		width: 14rpx;
		text-align: left;
		display: inline-block;
	}

	.box {
		flex: 1;
		padding: 0 10rpx;
		line-height: inherit;
		text-align: left;

		input {
			font-size: $font-size-base;
			text-align: left;
		}

		textarea {
			font-size: $font-size-base;
			width: 100%;
			height: 88rpx;
			line-height: 44rpx;
			text-align: left;
		}

		checkbox-group {
			display: flex;
			flex-wrap: wrap;
		}

		radio-group {
			display: flex;
			flex-wrap: wrap;
		}

		label {
			display: flex;
			align-items: center;
			line-height: 1;
			margin-right: 30rpx;
		}

		&.img-boxs {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
		}

		.img-box {
			margin: 10rpx 20rpx 10rpx 0;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100rpx;
			height: 100rpx;
			border: 1rpx solid $color-line;
			border-radius: 4rpx;
			position: relative;

			.iconguanbi {
				position: absolute;
				top: -14rpx;
				right: -14rpx;
				display: inline-block;
				width: 28rpx;
				height: 28rpx;
				line-height: 28rpx;
				color: $color-tip;
			}

			.iconadd1 {
				font-size: 40rpx;
			}

			image {
				width: 100%;
				height: 100%;
			}
		}

		&.box-flex {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		&.date-boxs {
			padding: 0 10rpx;
			display: flex;
			align-items: center;
		}
		
		.interval {
			margin: 0 12rpx;
			color: #000;
			font-weight: bold;
		}

		.date-box {
			.picker-box {
				display: flex;
				align-items: center;
				justify-content: flex-end;
			}
		}
	}
	
	.radio-group-box {
		radio {
			display: none;
		}
		
		.radio-box {
			display: flex;
			align-items: center;
			line-height: 1;
			
			.iconfont {
				font-size: 32rpx;
				margin-right: 10rpx;
			}
		}
	}
	
	.check-group-box {
		checkbox {
			display: none;
		}
		
		.checkbox {
			display: flex;
			align-items: center;
			line-height: 1;
			
			.iconfont {
				font-size: 32rpx;
				margin-right: 10rpx;
			}
		}
	}
	
	.iconfont {
		color: $color-tip;
		font-size: $font-size-base;
	}
	
	.box-flex picker {
		display: block;
		width: 100%;
	}
	
	.iconright {
		line-height: 1;
		position: unset;
	}
}
</style>
