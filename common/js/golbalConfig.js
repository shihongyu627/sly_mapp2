export default {
	data() {
		return {
			// 页面样式，动态设置主色调
			themeColor: '' ,//''--base-color:#fa5d14;--base-help-color:#ff7e00;'
			tabBarHeight: '0px'
		}
	},
	onLoad() {
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		let time = setInterval(() => {
			let theme = uni.getStorageSync('theme_style');
			if (theme.main_color) {
				this.themeColorSet()
				clearInterval(time);
			}
		}, 50);
		if (this.themeColor) this.getTabbarHeight();
	},
	computed: {
		themeStyle() {
			return uni.getStorageSync('theme_style');
		},
		//插件是否存在
		addonIsExist() {
			return uni.getStorageSync('addon_is_exist');
		},
		tabBarList() {
			return this.$store.state.tabBarList
		},
		siteInfo() {
			return uni.getStorageSync('siteInfo');
			// return this.$store.state.siteInfo
		},
		storeToken() {
			return this.$store.state.token;
		}
	},
	methods: {
		themeColorSet(){
			let theme = uni.getStorageSync('theme_style');
			this.themeColor = `--base-color:${theme.main_color};--base-help-color:${theme.aux_color};--tab-bar-height:${this.tabBarHeight};`;
			Object.keys(theme).forEach(key => {
				let data = theme[key];
				if(typeof(data) == "object"){
					Object.keys(data).forEach(k => {
						this.themeColor += '--'+k.replace(/_/g, "-")+':'+data[k]+';';
					});
				}else if(typeof(key) == "string" && key){
					this.themeColor += '--'+key.replace(/_/g, "-")+':'+data+';';
				}
			});
			for(let i = 9; i >= 5; i--) {
				let color = this.$util.colourBlend(theme.main_color, '#ffffff', (i / 10));
				this.themeColor += `--base-color-light-${i}:${color};`;
			}
		},
		// 颜色变浅（>0）、变深函数（<0）
		lightenDarkenColor(color, amount) {
		
			var usePound = false;
		
			if (color[0] == "#") {
				color = color.slice(1);
				usePound = true;
			}
		
			var num = parseInt(color, 16);
		
			var r = (num >> 16) + amount;
		
			if (r > 255) r = 255;
			else if (r < 0) r = 0;
		
			var b = ((num >> 8) & 0x00FF) + amount;
		
			if (b > 255) b = 255;
			else if (b < 0) b = 0;
		
			var g = (num & 0x0000FF) + amount;
		
			if (g > 255) g = 255;
			else if (g < 0) g = 0;
		
			return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
		
		},
		/**
		 * 获取tabbar高度
		 */
		getTabbarHeight(){
			try {
				const query = uni.createSelectorQuery().in(this);
				query.select('#tab-bar').boundingClientRect(data => {
					if (data) {
						this.tabBarHeight = data.height + 'px'
						this.themeColorSet();
					}
				}).exec();
			} catch(e) {
			}
		}
	},
	filters: {
		/**
		 * 金额格式化输出
		 * @param {Object} money
		 */
		moneyFormat(money) {
			if (isNaN(parseFloat(money))) return money;
			return parseFloat(money).toFixed(2);
		}
	},
	onReady(){
		let num = 0;
		let timer = setInterval(() => {
			this.getTabbarHeight()
			num += 1;
			if (this.tabBarHeight != '0px' || num == 10) clearInterval(timer)
		}, 100)
	}
}
