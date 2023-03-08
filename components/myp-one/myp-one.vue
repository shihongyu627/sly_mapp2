<template>
	<view class="code-box">
		<view class="flex-box">
			<input :value="inputValue" type="number" :focus="autoFocus" :maxlength="maxlength" class="hide-input" @input="getVal" />
			<block v-for="(item, index) in ranges" :key="index">
				<view :class="['item', { active: codeIndex === item, middle: type === 'middle', bottom: type === 'bottom', box: type === 'box' }]">
					<view class="line" v-if="type !== 'middle'"></view>
					<view v-if="type === 'middle' && codeIndex <= item" class="bottom-line"></view>
					<block v-if="isPwd && codeArr.length >= item"><text class="dot">●</text></block>
					<block v-else>
						<text class="number">{{ codeArr[index] ? codeArr[index] : '' }}</text>
					</block>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
// 支持使用 v-model
// 支持使用refs
export default {
	name: 'mypOneInput',
	props: {
		// 支持外部提供，支持使用v-model
		// 支持通过value来做清空
		value: {
			type: String,
			default: ''
		},
		// 4/6
		maxlength: {
			type: Number,
			default: 4
		},
		autoFocus: {
			type: Boolean,
			default: false
		},
		isPwd: {
			type: Boolean,
			default: false
		},
		// middle-middle line, bottom-bottom line, box-square box
		type: {
			type: String,
			default: 'bottom'
		}
	},
	watch: {
		maxlength: {
			immediate: true,
			handler: function(newV) {
				if (newV === 6) {
					this.ranges = [1, 2, 3, 4, 5, 6];
				} else {
					this.ranges = [1, 2, 3, 4];
				}
			}
		},
		value: {
			immediate: true,
			handler: function(newV) {
				if (newV !== this.inputValue) {
					this.inputValue = newV;
					this.toMakeAndCheck(newV);
				}
			}
		}
	},
	data() {
		return {
			inputValue: '',
			codeIndex: 1,
			codeArr: [],
			ranges: [1, 2, 3, 4]
		};
	},
	methods: {
		getVal(e) {
			const val = e.detail.value;
			this.inputValue = val;
			this.$emit('input', val);
			this.toMakeAndCheck(val);
		},
		toMakeAndCheck(val) {
			const arr = val.split('');
			this.codeIndex = arr.length + 1;
			this.codeArr = arr;
			if (this.codeIndex > Number(this.maxlength)) {
				this.$emit('finish', this.codeArr.join(''));
			}
		},
		// refs 时不再提供 v-model 支持
		// 支持使用refs来设置value
		// 没有提供数据保护与检测，自己在外面对数据进行检测保护
		set(val) {
			this.inputValue = val;
			this.toMakeAndCheck(val);
		},
		// 支持使用refs来清空
		clear() {
			this.inputValue = '';
			this.codeArr = [];
			this.codeIndex = 1;
		}
	}
};
</script>

<style scoped>
@keyframes twinkling {
	0% {
		opacity: 0.2;
	}

	50% {
		opacity: 0.5;
	}

	100% {
		opacity: 0.2;
	}
}

.code-box {
	text-align: center;
}

.flex-box {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	position: relative;
}

.flex-box .hide-input {
	position: absolute;
	top: 0;
	left: -100%;
	width: 200%;
	height: 100%;
	text-align: left;
	z-index: 9;
	opacity: 1;
}

.flex-box .item {
	position: relative;
	flex: 1;
	margin-right: 18rpx;
	font-size: 70rpx;
	font-weight: bold;
	color: #333333;
	line-height: 100rpx;
}

.flex-box .item::before {
	content: '';
	padding-top: 100%;
	display: block;
}

.flex-box .item:last-child {
	margin-right: 0;
}

.flex-box .middle {
	border: none;
}

.flex-box .box {
	box-sizing: border-box;
	border: 2rpx solid #cccccc;
	border-width: 2rpx 0 2rpx 2rpx;
	margin-right: 0;
}

.flex-box .box:first-of-type {
	border-top-left-radius: 8rpx;
	border-bottom-left-radius: 8rpx;
}

.flex-box .box:last-child {
	border-right: 2rpx solid #cccccc;
	border-top-right-radius: 8rpx;
	border-bottom-right-radius: 8rpx;
}

.flex-box .bottom {
	box-sizing: border-box;
	border-bottom: 2rpx solid #ddd;
}

.flex-box .active {
	border-color: #ddd;
}

.flex-box .active .line {
	display: block;
}

.flex-box .line {
	display: none;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	width: 2rpx;
	height: 40rpx;
	background: #333333;
	animation: twinkling 1s infinite ease;
}

.flex-box .dot,
.flex-box .number {
	line-height: 40rpx;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}

.flex-box .bottom-line {
	height: 8rpx;
	background: #000000;
	width: 80%;
	position: absolute;
	border-radius: 4rpx;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
</style>
