<template>
	<view class="uni-numbox" :class="{ small: size == 'small' }">
		<button type="default" class="decrease" :class="{ disabled: inputValue <= min || disabled, small: size == 'small' }" @click="_calcValue('minus')">-</button>
		<!-- <view 
			class="uni-numbox__minus" 
		> -->
		<!-- :style="'background-image:url(' + $util.img('public/uniapp/jian.png') + ')'" -->
		<!-- </view> -->
		<input :disabled="disabled" class="uni-input uni-numbox__value" type="number" @input="_onInput" @blur="_onInput" :class="{ small: size == 'small' }" :value="value"/>
		<button type="default" class="increase" :class="{ disabled: inputValue >= max || disabled, small: size == 'small' }" @click="_calcValue('plus')">+</button>
		<!-- <view 
			class="uni-numbox__plus" @click="_calcValue('plus')"
			:style="'background-image:url(' + $util.img('public/uniapp/jia.png') + ')'"
		>
		</view> -->
	</view>
</template>
<script>
export default {
	name: 'UniNumberBox',
	props: {
		value: {
			type: [Number, String],
			default: 1
		},
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			default: 100000
		},
		step: {
			type: Number,
			default: 1
		},
		disabled: {
			type: Boolean,
			default: false
		},
		modifyFlag: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			default: 'default'
		},
		index: {
			type: Number,
			default: -1
		}
	},
	data() {
		return {
			inputValue: 0
		};
	},
	watch: {
		value(val) {
			this.inputValue = +val;
		},
		inputValue(newVal, oldVal, params) {
			if (+newVal !== +oldVal && !this.modifyFlag) {
				this.$emit('change', newVal, params);
			}
		}
	},
	created() {
		this.inputValue = +this.value;
	},
	methods: {
		_calcValue(type) {
			if (this.disabled) {
				return;
			}
			if (this.modifyFlag) return;
			const scale = this._getDecimalScale();
			let value = this.inputValue * scale;
			let step = this.step * scale;
			if (type === 'minus') {
				value -= step;
			} else if (type === 'plus') {
				value += step;
			}
			
			if (value < this.min && type === 'minus') {
				this.$emit('limit', { value: this.inputValue, type }, this.index);
				return;
			}
			
			if (value > this.max && type === 'plus') {
				this.$emit('limit', { value: this.inputValue, type }, this.index);
				return;
			}
			
			this.inputValue = value / scale;
		},
		_getDecimalScale() {
			let scale = 1;
			// 浮点型
			if (~~this.step !== this.step) {
				scale = Math.pow(10, (this.step + '').split('.')[1].length);
			}
			return scale;
		},
		_onInput(event) {
			setTimeout(() => {
				let value = event.detail.value;
				if (!/(^[1-9]\d*$)/.test(value)) value = this.min;
				if (!value) {
					this.inputValue = 0;
					return;
				}
				value = +value;
				if (value > this.max) {
					value = this.max;
				} else if (value < this.min) {
					value = this.min;
				}
				this.inputValue = value;
			}, 0);
		}
	}
};
</script>
<style lang="scss">
@charset "UTF-8";

.uni-numbox {
	display: inline-flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	height: 70rpx;
	position: relative;
}

.uni-numbox.small {
	height: 44rpx;
}

.uni-numbox:after {
	content: '';
	position: absolute;
	transform-origin: center;
	box-sizing: border-box;
	pointer-events: none;
	top: -50%;
	left: -50%;
	right: -50%;
	bottom: -50%;
	border-radius: 12rpx;
	transform: scale(0.5);
}

.uni-numbox__minus,
.uni-numbox__plus {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	background-size: 100% 100%;
	background-position: center;
}

.uni-numbox__value {
	position: relative;
	background-color: $color-bg;
	width: 80rpx;
	height: 40rpx;
	text-align: center;
	border: 1px solid $color-line;
	display: inline-block;
	line-height: 36rpx;
	font-weight: bold;
	margin: 0;
	padding: 0;
	vertical-align: top;
	min-height: initial;
	border-left: none;
	border-right: none;
}

.uni-numbox__value.small {
	width: 60rpx;
	font-size: $font-size-tag;
}

.uni-numbox__value:after {
	content: '';
	position: absolute;
	transform-origin: center;
	box-sizing: border-box;
	pointer-events: none;
	top: -50%;
	left: -50%;
	right: -50%;
	bottom: -50%;
	border-top-width: 0;
	border-bottom-width: 0;
	transform: scale(0.5);
}

.uni-numbox--disabled {
	color: silver;
}
.uni-numbox button {
	width: 40rpx;
	height: 40rpx;
	display: inline-block;
	box-sizing: content-box;
	border: 1px solid $color-line;
	padding: 0;
	margin: 0;
	border-radius: 0;
	background-color: #fff;
	font-weight: bold;
	&.disabled {
		color: $color-line;
		background-color: #f8f8f8!important;
	}
	&.decrease {
		font-size: 44rpx;
		line-height: 32rpx;
	}
	&.increase {
		font-size: $font-size-toolbar;
		line-height: 36rpx;
	}
}
</style>
