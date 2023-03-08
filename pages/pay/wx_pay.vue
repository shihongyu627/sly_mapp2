<template>
	<page-meta :page-style="themeColor"></page-meta>
	<view class="launch-mask" v-if="show == true">
		<view class="mask-img">
			<image :src="$util.img('public/uniapp/pay/invite_friends_share.png')" mode="aspectFit"></image>
		</view>
		<view class="mask-word">
			点击右上角跳转到浏览器打开
		</view>
	</view>
</template>
<script>

export default {
	name: 'wx_pay',
	components: {
	},

	data() {
		return {
			show : true,
			wx_alipay : "",
			out_trade_no : ""
		};
	},
	onLoad(options) {		
		this.wx_alipay = options.wx_alipay || '';
		this.out_trade_no = options.out_trade_no || '';
		if(!this.$util.isWeiXin() && this.wx_alipay){
			this.show = false;
			location.href = this.wx_alipay;
		}
		this.checkPayStatus();
	},
	methods: {
		getPayInfo(out_trade_no) {
			this.$api.sendRequest({
				url: '/api/pay/info',
				data: {
					out_trade_no
				},
				success: res => {
					if (res.code >= 0 && res.data) {
						this.checkPayStatus();
					} 
				}
			});
		},
		checkPayStatus() {
			var that = this;
			var timer = setInterval(() => {
				that.$api.sendRequest({
					url: '/api/pay/status',
					data: { out_trade_no: that.out_trade_no },
					success: res => {
						if (res.code == 0) {
							if (res.data.pay_status == 2) {
								clearInterval(timer);
								that.$util.redirectTo('/pages/pay/result', { code: that.out_trade_no }, '', 'redirectTo');
							}
						} else {
							clearInterval(timer);
						}
					}
				});
			}, 1000);
		},
	},
};
</script>

<style lang="scss">
.launch-mask{
	position:fixed;
	top:0px;
	left: 0px;
	width:100%;
	height: 100%;
	background:rgba(0,0,0,0.8);
	.mask-img{
		text-align: right;
		margin:10% 10px 10px 30px;
		image{
			width: 50px;
			height:117px;
			margin-right:9%
		}
	}
	.mask-word{
		color: #fff;
		text-align: center;
		font-weight: bold;
		font-size: 18px;
		text{
			color:#FF0036 !important
		}
	}
}
</style>
