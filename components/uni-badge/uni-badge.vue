<template>
	<text
		v-if="text"
		:class="inverted ? 'uni-badge-' + type + ' uni-badge--' + size + ' uni-badge-inverted' : 'uni-badge-' + type + ' uni-badge--' + size"
		class="uni-badge"
		@click="onClick()"
	>
		{{ text }}
	</text>
</template>

<script>
export default {
	name: 'UniBadge',
	props: {
		type: {
			type: String,
			default: 'default'
		},
		inverted: {
			type: Boolean,
			default: false
		},
		text: {
			type: String,
			default: ''
		},
		size: {
			// small.normal
			type: String,
			default: 'normal'
		}
	},
	methods: {
		onClick() {
			this.$emit('click');
		}
	}
};
</script>

<style>
@charset "UTF-8";

.uni-badge {
	font-family: 'Helvetica Neue', Helvetica, sans-serif;
	box-sizing: border-box;
	font-size: 24rpx;
	line-height: 1;
	display: inline-block;
	padding: 6rpx 12rpx;
	color: #333;
	border-radius: 200rpx;
	background-color: #e5e5e5;
}

.uni-badge.uni-badge-inverted {
	padding: 0 10rpx 0 0;
	color: #999;
	background-color: transparent;
}

.uni-badge-primary {
	color: #fff;
	background-color: #007aff;
}

.uni-badge-primary.uni-badge-inverted {
	color: #007aff;
	background-color: transparent;
}

.uni-badge-success {
	color: #fff;
	background-color: #4cd964;
}

.uni-badge-success.uni-badge-inverted {
	color: #4cd964;
	background-color: transparent;
}

.uni-badge-warning {
	color: #fff;
	background-color: #f0ad4e;
}

.uni-badge-warning.uni-badge-inverted {
	color: #f0ad4e;
	background-color: transparent;
}

.uni-badge-error {
	color: #fff;
	background-color: #dd524d;
}

.uni-badge-error.uni-badge-inverted {
	color: #dd524d;
	background-color: transparent;
}

.uni-badge--small {
	transform: scale(0.8);
	transform-origin: center center;
}
</style>
