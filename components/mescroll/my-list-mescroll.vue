<template>
	<!-- top="xxx"下拉布局往下偏移,防止被悬浮菜单遮住 -->
	<mescroll v-if="isInit" :top="top" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" @emptyclick="emptyClick" @init="mescrollInit">
		<!-- 数据列表 -->
		<slot name="list"></slot>
	</mescroll>
</template>

<script>
import Mescroll from './mescroll-uni.vue';
export default {
	components: {
		Mescroll
	},
	data() {
		return {
			mescroll: null, //mescroll实例对象
			downOption: {
				auto: false // 不自动加载
			},
			upOption: {
				auto: false, // 不自动加载
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 10 // 每页数据的数量
				},
				noMoreSize: 2, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
				empty: {
					tip: '~ 空空如也 ~', // 提示
					btnText: '去看看'
				},
				onScroll: true
			},
			scrollY: 0,
			isInit: false
		};
	},
	props: {
		top: [String, Number],
		size: [String, Number]
	},
	created() {
		if (this.size) this.upOption.page.size = this.size;
		this.isInit = true;
	},
	mounted() {
		this.mescroll.resetUpScroll();
		this.listenRefresh();
	},
	methods: {
		// mescroll组件初始化的回调,可获取到mescroll对象
		mescrollInit(mescroll) {
			this.mescroll = mescroll;
		},
		/*下拉刷新的回调 */
		downCallback() {
			// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
			// loadSwiper();
			// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
			this.mescroll.resetUpScroll();
			this.listenRefresh();
		},
		/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
		upCallback() {
			//联网加载数据
			this.$emit('getData', this.mescroll);
		},
		//点击空布局按钮的回调
		emptyClick() {
			this.$emit('emptytap', this.mescroll);
		},
		//刷新
		refresh() {
			this.mescroll.resetUpScroll();
			this.listenRefresh();
		},
		listenRefresh() {
			this.$emit('listenRefresh', true);
		}
	}
};
</script>
