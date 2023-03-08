<template>
	<page-meta :page-style="themeColor"></page-meta>
	<scroll-view scroll-y="true" class="container">
		<view>
			<view class="head-wrap">
				<image :src="$util.img('public/uniapp/game/turntable_head.png')" mode="widthFix"></image>
				<view class="rule-mark" @click="openRulePopup">规则</view>
			</view>
			<view class="turntable-wrap" :style="{ backgroundImage: 'url(' + $util.img('public/uniapp/game/turntable_bg.png') + ')' }">
				<view class="wrap">
					<view class="award-wrap" v-for="(item, index) in gameInfo.award" :key="index">
						<view class="box" :class="{ on: index == currentIndex }">
							<view class="award-img"><image :src="$util.img(item.award_img)" mode="widthFix"></image></view>
							<view class="award-text">{{ item.award_name }}</view>
						</view>
					</view>
					<block v-if="gameInfo.status == 1">
						<block v-if="gameInfo.surplus_num > 0 || !token">
							<view class="star-box" @click="lottery">
								<view class="text">立即抽奖</view>
								<view class="tips">剩余{{ gameInfo.surplus_num }}次</view>
							</view>
						</block>
						<block v-else>
							<view class="star-box disabled">
								<view class="text">立即抽奖</view>
								<view class="tips">剩余{{ gameInfo.surplus_num }}次</view>
							</view>
						</block>
					</block>
					<block v-else-if="gameInfo.status == 0">
						<view class="status-box"><view>活动尚未开始</view></view>
					</block>
					<block v-else>
						<view class="status-box"><view>活动已经结束</view></view>
					</block>
				</view>
			</view>
			<view class="action-text">
				<view class="point">我的柚币：{{ point }}</view>
				<view class="record" @click="$util.redirectTo('/pages_promotion/game/record', { id: id })">我的中奖记录</view>
			</view>
			<!-- 中奖名单 -->
			<view class="record-wrap" v-if="gameInfo.is_show_winner && gameInfo.draw_record.length">
				<view class="body-shade"></view>
				<view class="head">中奖名单</view>
				<view class="body">
					<view class="wrap" :class="{ animate: animate }">
						<view v-for="(item, index) in gameInfo.draw_record" :key="index">
							<view class="tit">{{ item.member_nick_name | cover }}</view>
							<view class="txt">
								<l-time :text="item.create_time * 1000"></l-time>
								获得 {{ item.award_name }}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 抽奖结果 -->
		<uni-popup ref="resultPopup" type="center" :maskClick="false">
			<view class="result-wrap">
				<block v-if="result.is_winning">
					<view class="content-wrap yes">
						<image :src="$util.img(gameInfo.award[resultIndex].award_img)" mode="widthFix" class="look"></image>
						<view class="msg">恭喜您抽中{{ gameInfo.award[resultIndex].award_name }}</view>
						<view class="btn" @click="closePopup">继续抽奖</view>
						<text class="iconfont iconroundclose" @click="closePopup"></text>
					</view>
					<image :src="$util.img('public/uniapp/game/result_yes.png')" mode="widthFix" class="bg-img"></image>
				</block>
				<block v-else>
					<view class="content-wrap">
						<image :src="$util.img('public/uniapp/game/result_look.png')" mode="widthFix" class="look"></image>
						<view class="msg">{{ gameInfo.no_winning_desc }}</view>
						<view class="btn" @click="closePopup">继续抽奖</view>
						<text class="iconfont iconroundclose" @click="closePopup"></text>
					</view>
					<image :src="$util.img('public/uniapp/game/result_no.png')" mode="widthFix" class="bg-img"></image>
				</block>
			</view>
		</uni-popup>

		<!-- 活动规则 -->
		<uni-popup ref="rulePopup" type="center" :maskClick="false">
			<view class="rule-wrap">
				<view class="content-wrap">
					<image :src="$util.img('public/uniapp/game/rule_head.png')" mode="widthFix" class="rule-head"></image>
					<scroll-view scroll-y="true" class="rule">
						<view>
							<view class="tit">活动时间</view>
							<view class="text">{{ $util.timeStampTurnTime(gameInfo.start_time) }} - {{ $util.timeStampTurnTime(gameInfo.end_time) }}</view>
							<view class="tit">参与规则</view>
							<view class="text" v-if="gameInfo.join_type == 0">每个用户活动期间共有{{ gameInfo.join_frequency }}次抽奖机会。</view>
							<view class="text" v-else>每个用户活动期间每天都有{{ gameInfo.join_frequency }}次抽奖机会，每天0点更新。</view>
							<view class="text">每次抽奖需消耗 {{ gameInfo.points }} 柚币</view>
							<view class="text" v-if="gameInfo.level_id != 0">该活动只有{{ gameInfo.level_name }}等级的会员可参与。</view>
							<block v-if="gameInfo.remark != ''">
								<view class="tit">活动说明</view>
								<view class="text">{{ gameInfo.remark }}</view>
							</block>
						</view>
					</scroll-view>
					<text class="iconfont iconroundclose" @click="closeRulePopup"></text>
				</view>
			</view>
		</uni-popup>

		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>
	</scroll-view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import LTime from '@/components/l-time/l-time.vue';

export default {
	components: {
		uniPopup,
		LTime
	},
	data() {
		return {
			token: null,
			isClick: false,
			currentIndex: -1, // 当前选中
			maxRing: 6, // 最大圈数,
			currentRing: 1, // 当前圈数
			speed: 300, // 转数
			timer: null,
			id: 0, // 活动id
			gameInfo: {
				// 游戏信息
				award: [
					{
						award_img: '',
						award_name: ''
					}
				],
				surplus_num: ''
			},
			award: [],
			resultIndex: 0,
			result: {
				// 抽奖结果
				is_winning: 1
			},
			point: 0,
			animate: false,
			scrollTimer: null,
			memberInfo: null,
			//分享建立上下级所需id
			memberId: 0,
			//分享时详情所用图片
			shareImg: ''
		};
	},
	onLoad(option) {
		if (option.id) this.id = option.id;

		this.$util.getMemberId().then(resolve => {
			this.memberId = resolve;
		});
		//小程序分享接收source_member
		if (option.source_member) {
			uni.setStorageSync('source_member', option.source_member);
		}
		// 小程序扫码进入，接收source_member

		if (option.scene) {
			var sceneParams = decodeURIComponent(option.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('id') != -1) this.id = item.split('-')[1];
					if (item.indexOf('sku_id') != -1) this.skuId = item.split('-')[1];
					if (item.indexOf('m') != -1) uni.setStorageSync('source_member', item.split('-')[1]);
					if (item.indexOf('is_test') != -1) uni.setStorageSync('is_test', 1);
				});
			}
		}
		this.getGameInfo();
	},
	onShow() {
		 
		setTimeout( () => {
			if (this.addonIsExist && !this.addonIsExist.turntable) {
				this.$util.showToast({
					title: '商家未开启幸运抽奖',
					mask: true,
					duration: 2000
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index', {}, 'redirectTo');
				}, 2000);
				return;
			}
		}, 1000);

		//记录分享关系
		if (uni.getStorageSync('token') && uni.getStorageSync('source_member')) {
			this.$util.onSourceMember(uni.getStorageSync('source_member'));
		}

		if (uni.getStorageSync('token')) {
			this.getMemberPointInfo();
			this.token = uni.getStorageSync('token');
		}
	},
	/**
	 * 转发分享
	 */
	onShareAppMessage(res) {
		var title = this.gameInfo.game_name;
		var route = this.$util.getCurrentShareRoute(this.memberId);
		var path = route.path;
		return {
			title: title,
			path: path,
			imageUrl: '',
			success: res => {},
			fail: res => {}
		};
	},
	// 分享到微信朋友圈
	// #ifdef MP-WEIXIN
	onShareTimeline() {
		var title = this.gameInfo.game_name;
		var route = this.$util.getCurrentShareRoute(this.memberId);
		var query = route.query;
		return {
			title: title,
			query: query,
			imageUrl: ''
		};
	},
	// #endif
	computed: {
		storeToken() {
			return this.$store.state.token;
		}
	},
	watch: {
		storeToken: function(nVal, oVal) {
			if (nVal) {
				this.token = uni.getStorageSync('token');
				this.getMemberPointInfo();
				this.getGameInfo();
			}
		}
	},
	methods: {
		getMemberPointInfo() {
			this.$api.sendRequest({
				url: '/api/member/info',
				success: res => {
					if (res.code == 0 && res.data) {
						this.point = parseInt(res.data.point);
						this.memberInfo = res.data;
					}
				}
			});
		},
		lottery() {
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open('/pages_promotion/game/turntable?id=' + this.id);
				return;
			}
			if (this.gameInfo.status != 1) return;
			if (this.gameInfo.surplus_num <= 0) {
				this.$util.showToast({
					title: '您的抽奖次数已用完'
				});
				return;
			}
			let levelId = ',' + this.gameInfo.level_id + ',';
			if (this.gameInfo.level_id != '0' && levelId.indexOf(',' + this.memberInfo.member_level + ',') == -1) {
				this.$util.showToast({
					title: '该活动只有' + this.gameInfo.level_name + '等级的会员可参与该活动'
				});
				return;
			}
			if (this.gameInfo.points > 0 && this.point < this.gameInfo.points) {
				this.$util.showToast({
					title: '柚币不足'
				});
				return;
			}
			if (this.isClick) return;
			this.isClick = true;

			// 初始化转盘参数
			this.currentIndex = 0;
			this.currentRing = 1;
			this.speed = 300;
			this.timer = setInterval(this.startRoll, this.speed);

			this.$api.sendRequest({
				url: '/turntable/api/turntable/lottery',
				data: {
					id: this.id
				},
				success: res => {
					if (res.code >= 0) {
						this.result = res.data;

						if (res.data.is_winning) {
							this.resultIndex = this.$util.inArray(res.data.award_id, this.award);
						} else {
							this.resultIndex = this.$util.inArray(-1, this.award);
						}

						// 扣除次数 柚币
						this.point -= this.gameInfo.points;
						this.gameInfo.surplus_num -= 1;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				},
				fail: res => {
					this.resultIndex = this.$util.inArray(-1, this.award);
				}
			});
		},
		getGameInfo() {
			this.$api.sendRequest({
				url: '/turntable/api/turntable/info',
				data: {
					id: this.id
				},
				success: res => {
					if (res.code >= 0 && res.data) {
						this.gameInfo = res.data;
						res.data.award.forEach(e => {
							this.award.push(e.award_id);
						});
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();

						if (this.gameInfo.is_show_winner && this.gameInfo.draw_record.length > 6) {
							this.scrollTimer = setInterval(this.scrollRecord, 2000);
						}
					} else {
						this.$util.showToast({
							title: '未获取到活动信息！'
						});
						setTimeout(() => {
							this.$util.redirectTo('/pages/index/index', {}, 'reLaunch');
						}, 1500);
					}
				},
				fail: res => {
					this.$util.showToast({
						title: '未获取到活动信息！'
					});
					setTimeout(() => {
						this.$util.redirectTo('/pages/index/index', {}, 'reLaunch');
					}, 1500);
				}
			});
		},
		startRoll() {
			if (this.speed > 50) {
				this.speed -= 50;
			}
			if (this.currentRing >= this.maxRing - 1 && this.speed < 700) {
				this.speed += 100;
			}
			if (this.currentRing == this.maxRing && this.currentIndex == this.resultIndex) {
				clearInterval(this.timer);
				this.showResult();
				return;
			}
			if (this.currentIndex == 7) {
				this.currentRing += 1;
				this.currentIndex = 0;
			} else {
				this.currentIndex += 1;
			}
			clearInterval(this.timer);
			this.timer = setTimeout(this.startRoll, this.speed); //开始转动
		},
		// 展示中奖结果
		showResult() {
			this.$refs.resultPopup.open();
		},
		closePopup() {
			this.isClick = false;
			this.currentIndex = -1;
			this.$refs.resultPopup.close();
		},
		openRulePopup() {
			this.$refs.rulePopup.open();
		},
		closeRulePopup() {
			this.$refs.rulePopup.close();
		},
		scrollRecord() {
			this.animate = true;
			setTimeout(() => {
				this.gameInfo.draw_record.push(this.gameInfo.draw_record[0]); // 将数组的第一个元素添加到数组的
				this.gameInfo.draw_record.shift();
				this.animate = false;
			}, 1000);
		}
	},
	filters: {
		cover(str) {
			if (typeof str == 'string' && str.length > 0) {
				return str.substr(0, 1) + '******' + str.substr(-1);
			} else {
				return '';
			}
		}
	},
	onHide() {
		clearInterval(this.scrollTimer);
	}
};
</script>

<style lang="scss">
@import './public/css/turntable.scss';
</style>
<style scoped>
>>> .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: none !important;
}

>>> .uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
	overflow: unset;
}
</style>
