<template>
	<view class="city-list">
		<uni-indexed-list :options="list" :show-select="false" @click="bindClick" />
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	import pyfl from "pyfl";

	export default {
		components: {},
		data() {
			return {
				list: [],
				citylist: []
			}
		},
		onLoad() {
			this.getCitylists()
		},
		created() {},
		mixins: [globalConfig],
		onShow() {},
		methods: {
			getCitylists() {
				this.$api.sendRequest({
					url: '/api/store/citylists',
					data: {},
					success: res => {
						let msg = res.message;
						if (res.code == 0 && res.data) {
							this.list = res.data;
							this.citylist = res.data
							this.list.map((item) => {
								item = this.keyDeel(item);
							})
							let arrSort = this.list.sort((a, b) => {
								return a.shortname.localeCompare(b.shortname)
							});
							let newProvince = [];
							newProvince = this.sortArr(arrSort, "letter");
							console.log(newProvince);
							newProvince.unshift({
								letter: '#',
								data: ['全部']
							})
							this.list = newProvince
						} else {
							this.$util.showToast({
								title: msg
							});
						}

					},
					fail: res => {}
				});
			},
			//首字母转换
			keyDeel(item) {
				let str = item.shortname.substr(0, 1);
				if (item.shortname == '重庆') {
					let letter = pyfl(str);
					item.letter = 'C';
					return item
				}
				let letter = pyfl(str);
				item.letter = letter;
				return item;
			},
			//数据处理
			sortArr(arr, str) {
				var _arr = [],
					_t = [],
					// 临时的变量
					_tmp;

				// 按照特定的参数将数组排序将具有相同值得排在一起
				arr = arr.sort(function(a, b) {
					var s = a[str],
						t = b[str];

					return s < t ? -1 : 1;
				});

				if (arr.length) {
					_tmp = arr[0][str];
				}
				// console.log( arr );
				// 将相同类别的对象添加到统一个数组
				for (var i in arr) {
					if (arr[i][str] === _tmp) {
						_t.push(arr[i]);
					} else {
						_tmp = arr[i][str];
						_arr.push(_t);
						_t = [arr[i]];
					}
				}
				// 将最后的内容推出新数组
				_arr.push(_t); //获取到所有整合数据
				// 终极整合
				var integration = [];
				_arr.forEach(item => {
					var eee = {
						letter: "",
						data: []
					};
					item.forEach(self => {
						if (eee.letter != self.letter) {
							eee.letter = self.letter;
							eee.data.push(`${self.shortname}`);
						} else {
							eee.data.push(`${self.shortname}`);
						}
					});
					integration.push(eee);
				});
				return integration;
			},
			bindClick(e) {
				console.log(this.citylist);
				if (e.item.name == '全部') {
					let dd = {
						shortname: '全部',
						city_id: ''
					}
					uni.$emit('onChangeSeleCity', dd)
					uni.navigateBack();
					return
				}
				this.citylist.map((item) => {
					if (item.shortname == e.item.name) {
						console.log(item);
						uni.$emit('onChangeSeleCity', item)
						uni.navigateBack();
						return
					}
				})
				console.log('点击item，返回数据' + JSON.stringify(e))
			},
		}
	};
</script>

<style scoped>
	.city-list {
		width: 100%;
		height: 100%;
	}

	.address-go {
		width: 68px;
		height: 30px;
		background: #1189F4;
		opacity: 1;
		border-radius: 15px;
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 30px;
		color: #FFFFFF;
		opacity: 1;
		text-align: center;
	}
</style>
