// #ifdef H5
import './common/js/pc'
// #endif
import Vue from 'vue'
import App from './App'
import store from './store'
import Util from './common/js/util.js'
import Http from './common/js/http.js'
import Lang from './common/js/lang.js'
import Config from './common/js/config.js'
import globalConfig from './common/js/golbalConfig.js';

Vue.prototype.$store = store //挂在vue

Vue.config.productionTip = false

Vue.prototype.$util = Util;
Vue.prototype.$api = Http;

Vue.prototype.$langConfig = Lang; //语言包对象
Vue.prototype.$lang = Lang.lang; //解析语言包

Vue.prototype.$config = Config;

Vue.mixin(globalConfig);

App.mpType = 'app'

//常用组件
import loadingCover from '@/components/loading-cover/loading-cover.vue';
Vue.component('loading-cover', loadingCover);

import nsEmpty from '@/components/ns-empty/ns-empty.vue';
Vue.component('ns-empty', nsEmpty);
import richText from '@/components/ns-rich-text/ns-rich-text.vue';
Vue.component('ns-rich-text', richText);
import MescrollUni from "@/components/mescroll/my-list-mescroll.vue";
Vue.component("mescroll-uni", MescrollUni); //上拉加载,下拉刷新组件

import MescrollBody from "@/components/mescroll/mescroll-body.vue"
Vue.component('mescroll-body', MescrollBody);

import NsLogin from "@/components/ns-login/ns-login.vue"
Vue.component('ns-login', NsLogin);

const app = new Vue({
	...App,
	store
})

app.$mount()
