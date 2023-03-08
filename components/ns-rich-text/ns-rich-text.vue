<template>
	<view :data-theme="themeStyle">
		<!-- <rich-text :nodes="$util.richText(detail.content)"></rich-text> -->
		<view v-for="(content, index) in contentArr" :key="index">
			<rich-text v-if="content.type!='video'" :nodes="$util.richText(content.value)"></rich-text>
			<video v-if="content.type=='video'" :src="content.value" controls style="width: 100%;"></video>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ns-rich-text',
		props: {
			contentArr: {
				type: Array,
				default: []
			},
		},
	};
</script>
<style lang="scss">
</style>
<style scoped>
</style>
