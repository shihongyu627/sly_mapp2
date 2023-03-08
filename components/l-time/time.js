Function.prototype.asyAfter = function(afterfn) {
	var _self = this;
	return function() {
		var ret = _self.apply(this, arguments);
		if (ret === 'next') {
			return afterfn.apply(this, arguments);
		}
		return ret;
	}
}

Date.prototype.pattern = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份         
		"d+": this.getDate(), //日         
		"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
		"H+": this.getHours(), //小时         
		"m+": this.getMinutes(), //分         
		"s+": this.getSeconds(), //秒         
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度         
		"S": this.getMilliseconds() //毫秒         
	};
	var week = {
		"0": "\u65e5",
		"1": "\u4e00",
		"2": "\u4e8c",
		"3": "\u4e09",
		"4": "\u56db",
		"5": "\u4e94",
		"6": "\u516d"
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") :
				"") +
			week[this.getDay() + ""]);
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k])
				.length)));
		}
	}
	return fmt;
}

const isType = type => (/^\[object\s(.*)\]$/.exec(Object.prototype.toString.call(type)))[1];
let Time = function() {};
let timeProto = Time.prototype;

//获取当前时间戳
timeProto.getUnix = function() {
	return new Date().getTime();
}

//获取当天0点0分0秒时间戳
timeProto.getTodayUnix = function() {
	let date = new Date();
	let myDate = `${date.getFullYear()}/${(date.getMonth() + 1)}/${date.getDate()} 00:00:00`;
	return new Date(myDate).getTime();
}

//获取今年1月1日0点0分0秒时间戳
timeProto.getYearUnix = function() {
	let date = new Date();
	date.setMonth(0);
	date.setDate(1);
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date.getTime();
}

//获取当前时间标准年月日
timeProto.getLastDate = function(constTime) {
	if (!constTime) {
		return;
	}
	let date = new Date(constTime);
	if (date.pattern) {
		return date.pattern("yyyy-MM-dd");
	}

	let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
	let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
	return date.getFullYear() + '-' + month + '-' + day;
}

const resDateStr = function(timer, constTime) {
	let _just = function(timer) {

		if (timer <= 0 || Math.floor(timer / 60) <= 0) {
			return "刚刚"
		} else return 'next';
	}

	let _mm = function(timer) {
		if (timer < 3600) {
			return Math.floor(timer / 60) + "分钟前"
		} else return 'next';
	}
	let _hh = function(timer, constTime) {
		let today = _time_.getTodayUnix();
		if (timer >= 3600 && (constTime - today >= 0)) {
			//可切换显示模式
			// return "今天 " + new Date(constTime).pattern("HH:mm");
			return Math.floor(timer / 60 / 60) + "小时前";
		} else {
			return 'next'
		};
	}
	let _dd = function(timer, constTime) {
		let today = _time_.getTodayUnix();
		timer = (today - constTime) / 1000;
		if (timer / 86400 <= 31) {
			return Math.ceil(timer / 86400) + "天前"
		} else return 'next';
	}
	let _dlast = function(timer, constTime) {
		return _time_.getLastDate(constTime);
	}

	let dateFilter = _just.asyAfter(_mm).asyAfter(_hh).asyAfter(_dd).asyAfter(_dlast);
	return dateFilter(timer, constTime);
}


//转换时间
const reg = new RegExp("-", "g");
timeProto.getFormatTime = function(constTime, max) {
	if (!constTime) {
		return "";
	}

	switch (isType(constTime)) {
		case 'Date':
			constTime = constTime.getTime();
			break;
		case 'String':
			constTime = constTime.replace(reg, "/");
		default:
			constTime = new Date(constTime).getTime();
			break;
	}

	let now = this.getUnix();
	let year = this.getYearUnix();
	let timer = (now - constTime) / 1000;
	if (constTime > now && max) {
		return this.getLastDate(constTime);
	}

	let _t = this;
	return resDateStr(timer, constTime);
}

const _time_ = new Time();
export default _time_;
