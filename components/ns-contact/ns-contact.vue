<template>
	<view class="contact-wrap" >
		<slot v-if="config && config.type != 'none'"></slot>
		<button type="default" hover-class="none" :open-type="openType" class="contact-button" @click="contactServicer" 
			:send-message-title="sendMessageTitle" 
			:send-message-path="sendMessagePath" 
			:send-message-img="sendMessageImg"
		></button>
	</view>
</template>

<!-- 客服组件 -->
<script>
	export default {
		name: 'ns-contact',
		props: {
			niushop: {
				type:Object,
				default: function(){
					return {}
				}
			},
			sendMessageTitle: {
				type: String,
				default: ''
			},
			sendMessagePath: {
				type: String,
				default: ''
			},
			sendMessageImg: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				config: null,
				openType: ''
			};
		},
		created() {
			this.getKefuConfig();
		},
		methods: {
			/**
			 * 获取小程序配置
			 */
			getKefuConfig(){
				this.$api.sendRequest({
					url: '/api/config/servicer',
					success: res => {
						if (res.code == 0) {
							// #ifdef H5
							this.config = res.data.h5;
							// #endif
							// #ifdef MP-WEIXIN
							this.config = res.data.weapp;
							if (this.config.type == 'weapp') this.openType = 'contact';
							// #endif
							
						}
					}
				});
			},
			/**
			 * 联系客服
			 */
			contactServicer(){
				if (this.openType == 'contact') return;
				switch(this.config.type) {
					case 'wxwork':
						// #ifdef H5
						location.href = this.config.wxwork_url;
						// #endif
						// #ifdef MP-WEIXIN
						uni.getSystemInfo({
							success: function (res) {
								console.log(res)
							}
						});
						wx.openCustomerServiceChat({
							extInfo: {url: this.config.wxwork_url},
							corpId: this.config.corpid
						})
						// #endif
					break;
					case 'third':
						location.href = this.config.third_url;
					break;
					case 'niushop':
						this.$util.redirectTo('/pages_tool/chat/room', this.niushop);
					break;
					default:
						this.makePhoneCall();
				}
			},
			/**
			 * 店铺联系方式
			 */
			makePhoneCall(){
				this.$api.sendRequest({
					url: '/api/config/shopcontact',
					success: res => {
						if (res.code == 0 && res.data.mobile) uni.makePhoneCall({ phoneNumber: res.data.mobile });
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.contact-wrap {
		width: 100%;
		height: 100%;
		position: relative;
		
		.contact-button {
			width: 100%;
			height: 100%;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 5;
			padding: 0;
			margin: 0;
			opacity: 0;
		}
	}
</style>
