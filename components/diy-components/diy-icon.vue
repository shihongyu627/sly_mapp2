<template>
	<view class="diy-icon" :style="iconBgStyle">
		<text class="js-icon" :class="iconClass" :style="iconStyle"></text>
	</view>
</template>

<script>
	export default {
		name: 'diy-icon',
		props: {
			icon: {
				type: String,
				default: ''
			},
			value: {
				type: Object,
				default: function () {
					return null;
				}
			}
		},
		computed: {
			iconClass(){
				var _class = ' ' + this.icon;
				if (this.value && this.value.iconColor.length > 1) _class += ' gradient';
				return _class;
			},
			iconBgStyle(){
				if (!this.value) return {};
	
				var style = {
					'border-radius': this.value.bgRadius + '%',
					'background': ''
				};
	
				if (this.value.iconBgImg) style['background'] += 'url('+ this.$util.img(this.value.iconBgImg) +') no-repeat bottom / contain'
				if (this.value.iconBgColor.length) {
					if (style.background) style.background += ',';
					if (this.value.iconBgColor.length == 1) {
						style.background += this.value.iconBgColor[0];
					} else {
						style['background'] += 'linear-gradient('+ this.value.iconBgColorDeg +'deg, '+ this.value.iconBgColor.join(',') +')';
					}
				}
				return this.$util.objToStyle(style);
			},
			iconStyle(){
				if (!this.value) return {};
	
				var style = {
					'font-size': this.value.fontSize + '%'
				}
				if (this.value.iconColor.length == 1) {
					style.color = this.value.iconColor[0];
				} else {
					style['background'] = 'linear-gradient('+ this.value.iconColorDeg +'deg, '+ this.value.iconColor.join(',') +')';
				}
				return this.$util.objToStyle(style);
			}
		}
	}
</script>

<style lang="scss">
	.diy-icon {
	    width: 100%;
	    height: 100%;
	    font-size: 100%;
	    color: #000;
	    display: flex;
	    align-items: center;
	    justify-content: center;
		
		.js-icon {
		    font-size: 50%;
		    line-height:1;
			padding: 1rpx;
			&.gradient {
				-webkit-background-clip:text!important;
				-webkit-text-fill-color:transparent;
			}
		}
	}
</style>
