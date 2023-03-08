<template>
	<text>{{ temp }}</text>
</template>

<script>
import _time_ from './time.js';
export default {
	name: 'l-time',
	props: {
		//日期字符串
		text: {
			type: [String, Number, Date],
			default: ''
		},
		//是否显示大于当前时间日期，默认false：大于显示刚刚
		maxDate: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			textVal: this.text
		};
	},
	watch: {
		text() {
			this.textVal = this.text;
		}
	},
	computed: {
		temp() {
			return this.getText();
		}
	},
	methods: {
		getText() {
			let self = this;
			let timeVal = _time_.getFormatTime(self.textVal, self.maxDate);
			if (timeVal && (timeVal.endsWith('刚刚') || timeVal.endsWith('分钟前'))) {
				setTimeout(() => {
					let temp = self.textVal;
					self.textVal = '';
					self.textVal = temp;
				}, 60000);
			}
			return this.textVal ? timeVal : '';
		},
		onClick() {
			this.$emit('on-tap', this.textVal);
		}
	}
};
</script>

<style></style>
