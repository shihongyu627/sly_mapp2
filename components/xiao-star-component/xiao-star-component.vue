<template>
	<view class="star-container">
		<view class="star-view star-view" style="display: flex;align-items: center;height: 36rpx; overflow: hidden;margin-top:8rpx;">
			<view class="star-icon-con">
				<view
					@tap="evaluateTap(item, index)"
					:class="item == 3 ? 'iconfont star-icon-item-font iconai65' : item == 1 ? 'iconfont star-icon-item-font iconwujiaoxing1' : ''"
					v-for="(item, index) in starArr"
					:key="index"
				></view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 *  starArr 数据说明
 *
 *  1  	实星
 *  2	空星
 * 	3	半空星
 */
export default {
	data() {
		return {
			starArr: [],
			star_count: 0,
			isTapZuihou: false
		};
	},
	props: {
		// 星评数量
		starCount: {
			type: Number,
			default: 0
		},
		// 是否开启手动评价
		isEvaluate: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		starCount(newVal, oldVal) {
			this.star_count = JSON.parse(JSON.stringify(newVal));
		}
	},
	mounted() {
		this.star_count = JSON.parse(JSON.stringify(this.starCount));
		var star_count = this.star_count / 2;
		if (String(this.starCount).indexOf('.') != -1) {
			// 小数
			var decimalsSatr = parseInt(star_count);
			this.starPushFn(false, decimalsSatr);
		} else {
			// 整数
			var intSatr = parseInt(star_count);
			this.starPushFn(true, intSatr);
		}
	},
	methods: {
		/**
		 *  手动评价
		 *
		 * @param {*} item  	点击的item
		 * @param {*} index		点击的index
		 */
		evaluateTap(item, index) {
			if (!this.isEvaluate) {
				return;
			}
			var sliceArr = this.starArr.slice(index);
			var starNewArr = this.starArr.slice(0, index);
			var optIndex = index + 1;
			if (item == 1) {
				let sliceNewArr = [];
				sliceArr.forEach((slItem, slIndex) => {
					sliceNewArr.push(2);
				});
				if (starNewArr.length <= 0 && this.isTapZuihou) {
					this.starArr = [];
					this.starFor(i => {
						this.starArr.push(2);
					});
					this.isTapZuihou = false;
					this.star_count = 0;

					return;
				}
				if (starNewArr.length <= 0) {
					this.isTapZuihou = true;
				}
				if (starNewArr.length == 3) {
					this.star_count = 8;
				} else if (starNewArr.length == 2) {
					this.star_count = 6;
				} else if (starNewArr.length == 1) {
					this.star_count = 4;
				} else if (starNewArr.length == 0) {
					this.star_count = 2;
				}
				// if(starNewArr)
				this.$emit('evaluateChange', this.star_count);
				this.starArr = [...starNewArr, ...sliceNewArr];
			} else {
				if (index == 4) {
					this.star_count = 10;
				} else if (index == 3) {
					this.star_count = 8;
				} else if (index == 2) {
					this.star_count = 6;
				} else if (index == 1) {
					this.star_count = 4;
				} else if (index == 0) {
					this.star_count = 2;
				}
			}

			this.starFor(i => {
				if (i < optIndex) {
					if (this.starArr[i] == 2) {
						this.starArr[i] = 1;
					}

					this.starArr = Object.assign([], this.starArr);
				}
			});

			this.$emit('evaluateChange', this.star_count);
		},
		/**
		 *  星数量循环
		 *
		 * @param {*} slotcallback
		 */
		starFor(slotcallback) {
			for (let i = 0; i < 5; i++) {
				slotcallback(i);
			}
		},
		/**
		 *  星数推送
		 *
		 * @param {*} isInt  		是否是整数
		 * @param {*} satrCount		星数量
		 */
		starPushFn(isInt, satrCount) {
			if (isInt) {
				this.starFor(i => {
					if (i < satrCount) {
						this.starArr.push(1);
					} else {
						this.starArr.push(2);
					}
				});
				return;
			}
			this.starFor(i => {
				if (i < satrCount) {
					this.starArr.push(1);
				} else if (i <= satrCount) {
					this.starArr.push(3);
				} else {
					this.starArr.push(2);
				}
			});
		}
	}
};
</script>

<style scoped lang="scss">
.uni-view {
	color: none !important;
}

@font-face {
	font-family: 'iconfont';
	src: url('//at.alicdn.com/t/font_2188799_iwu9ledxvl.eot?t=1611736513810'); /* IE9 */
	src: url('//at.alicdn.com/t/font_2188799_iwu9ledxvl.eot?t=1611736513810#iefix') format('embedded-opentype'),
		/* IE6-IE8 */
			url('data:application/x-font-woff2;charset=utf-8;base64,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')
			format('woff2'),
		url('//at.alicdn.com/t/font_2188799_iwu9ledxvl.woff?t=1611736513810') format('woff'),
		url('//at.alicdn.com/t/font_2188799_iwu9ledxvl.ttf?t=1611736513810') format('truetype'),
		/* chrome, firefox, opera, Safari, Android, iOS 4.2+ */ url('//at.alicdn.com/t/font_2188799_iwu9ledxvl.svg?t=1611736513810#iconfont') format('svg'); /* iOS 4.1- */
}

.iconfont {
	font-family: 'iconfont' !important;
	font-size: 16px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.iconwujiaoxing1:before {
	content: '\e623';
}

.iconwujiaoxing3:before {
	content: '\e712';
}

.iconai65:before {
	content: '\e6b7';
}

.star-container {
	.star-view {
		color: rgb(244, 209, 119) !important;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		.star-count {
			margin-right: 20rpx;
			font-weight: 600;
			font-size: 33rpx;
			// font-weight-600 font-33 d-flex a-center
		}
		.star-icon-con {
			font-weight: 600;
			font-size: 33rpx;
			display: flex;
			align-items: center;
			height: 36rpx;
			.star-icon-item-font {
				font-size: 38rpx;
				color: rgb(244, 209, 119) !important;
			}
		}
		.iconwujiaoxing3 {
			color: rgb(244, 209, 119) !important;
		}
	}
}
</style>
